/** Periodic cash flows begin at t=0. Discount and IRR rates are effective annual rates. */
function validateFlows(flows) {
 if (!Array.isArray(flows) || !flows.length || flows.some(value => typeof value !== 'number' || !Number.isFinite(value))) {
  throw new Error('Денежные потоки должны быть непустым массивом конечных чисел.');
 }
}
function validatePeriods(periodsPerYear) {
 if (!Number.isFinite(periodsPerYear) || periodsPerYear <= 0) throw new Error('Число периодов в году должно быть положительным.');
}
export function npv(flows, annualRate, periodsPerYear = 12) {
 validateFlows(flows); validatePeriods(periodsPerYear);
 if (typeof annualRate !== 'number' || !Number.isFinite(annualRate) || annualRate <= -1) throw new Error('Ставка дисконтирования должна быть конечным числом больше −100%.');
 const logRate = Math.log1p(annualRate) / periodsPerYear;
 const value = flows.reduce((sum, flow, index) => sum + flow * Math.exp(-logRate * index), 0);
 if (!Number.isFinite(value)) throw new Error('NPV выходит за числовой диапазон. Проверьте ставку и денежные потоки.');
 return value;
}
/** A conventional investment, including initial operating losses, has at most one IRR. */
export function irr(flows, periodsPerYear = 12) {
 validateFlows(flows); validatePeriods(periodsPerYear);
 if (!(flows[0] < 0) || !flows.some(value => value > 0)) return null;
 let positiveSeen = false;
 for (const flow of flows) {
  if (flow > 0) positiveSeen = true;
  else if (flow < 0 && positiveSeen) return null;
 }
 // Search in log(discount factor) space. Scaling preserves the sign and avoids overflow.
 let lastNonzero = flows.length - 1;
 while (lastNonzero > 0 && flows[lastNonzero] === 0) lastNonzero--;
 const signNpv = logRate => {
  const shift = Math.max(0, -logRate * lastNonzero);
  return flows.reduce((sum, flow, index) => flow === 0 ? sum : sum + flow * Math.exp(-logRate * index - shift), 0);
 };
 let lo = -1, hi = 1;
 for (let i = 0; signNpv(lo) <= 0 && i < 16; i++) lo *= 2;
 for (let i = 0; signNpv(hi) >= 0 && i < 16; i++) hi *= 2;
 if (!(signNpv(lo) > 0 && signNpv(hi) < 0)) return null;
 for (let i = 0; i < 160; i++) {
  const mid = (lo + hi) / 2;
  if (signNpv(mid) > 0) lo = mid; else hi = mid;
 }
 const rate = Math.expm1((lo + hi) / 2 * periodsPerYear);
 return Number.isFinite(rate) && rate > -1 ? rate : null;
}
/** First recovery of the initial investment, in periods, linearly interpolated. */
export function payback(flows) {
 validateFlows(flows);
 if (flows[0] >= 0) return 0;
 let sum = flows[0];
 for (let index = 1; index < flows.length; index++) {
  const before = sum; sum += flows[index];
  if (sum >= 0) return index - 1 + (-before / flows[index]);
 }
 return null;
}
export function summarizeFinance(flows, discount) {
 validateFlows(flows);
 if (typeof discount !== 'number' || !Number.isFinite(discount) || discount <= -100) throw new Error('Ставка дисконтирования должна быть больше −100%.');
 const invested = Math.max(-flows[0], 0), net = flows.reduce((sum, value) => sum + value, 0);
 let cumulative = 0, lowest = 0;
 for (const flow of flows) { cumulative += flow; lowest = Math.min(lowest, cumulative); }
 return {npv: npv(flows, discount / 100), irr: irr(flows), payback: payback(flows), roi: invested > 0 ? net / invested : null, netCash: net, invested, maxFundingNeed: Math.max(-lowest, 0)};
}
