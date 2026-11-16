import {summarizeFinance} from './finance.js';

const DEFAULTS = {
 country: 'RU', currency: 'RUB', format: 'custom', name: '', city: '',
 operatingDays: 30, utilization: 35, horizonMonths: 60, discountRate: 20,
 annualCostGrowth: 0, annualPriceGrowth: 0, rampMonths: 3, taxRate: 0,
 observedMonthlyVisits: null,
};
const RANGE = {
 price: [0, 1e8], capacityPerDay: [1, 1e7], operatingDays: [1, 31], utilization: [0, 100],
 rent: [0, 1e12], otherFixedCosts: [0, 1e12], variableCostPct: [0, 200], capex: [0, 1e13],
 horizonMonths: [12, 120], discountRate: [0, 200], annualCostGrowth: [-50, 100],
 annualPriceGrowth: [-50, 100], rampMonths: [1, 36], taxRate: [0, 100],
};
function assertNumber(value, min, max, name) {
 if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error(`${name}: допустимое значение от ${min} до ${max}.`);
}
/** Returns a new normalized object. No market facts or geography are inferred. */
export function validatePlannerInput(raw) {
 if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Нужны параметры бизнеса.');
 const input = {...DEFAULTS, ...raw};
 if (!['RU', 'AE'].includes(input.country)) throw new Error('Выберите Россию или ОАЭ.');
 if (input.currency !== 'RUB') {const error=new Error('Расчёты поддерживаются только в российских рублях (RUB). Суммы в другой валюте не конвертируются.');error.code='unsupported_currency';throw error;}
 if (!['family', 'wellness', 'cafe', 'custom'].includes(input.format)) throw new Error('Неизвестный формат бизнеса.');
 for (const key of ['name', 'city']) if (typeof input[key] !== 'string' || input[key].length > 500) throw new Error(`${key}: не более 500 символов.`);
 for (const [key, [min, max]] of Object.entries(RANGE)) assertNumber(input[key], min, max, key);
 for (const key of ['operatingDays', 'horizonMonths', 'rampMonths']) if (!Number.isInteger(input[key])) throw new Error(`${key}: введите целое число.`);
 if (input.observedMonthlyVisits !== null) assertNumber(input.observedMonthlyVisits, 0, 1e10, 'Посещения в месяц');
 return input;
}
function operatingMonth(input, visits, month = 0) {
 const price = input.price * (1 + input.annualPriceGrowth / 100) ** (month / 12);
 const inflation = (1 + input.annualCostGrowth / 100) ** (month / 12);
 const revenue = visits * price, variableCosts = revenue * input.variableCostPct / 100;
 const rent = input.rent * inflation, otherFixedCosts = input.otherFixedCosts * inflation;
 const fixedCosts = rent + otherFixedCosts, costs = fixedCosts + variableCosts;
 const operatingProfit = revenue - costs, tax = Math.max(0, operatingProfit) * input.taxRate / 100;
 return {visits, price, revenue, variableCosts, rent, otherFixedCosts, fixedCosts, costs, operatingProfit, tax, cashFlow: operatingProfit - tax};
}
function runScenario(input, id, multiplier, baseVisits, monthlyCapacity) {
 const monthlyVisits = Math.min(monthlyCapacity, Math.max(0, baseVisits * multiplier));
 const steadyState = operatingMonth(input, monthlyVisits);
 const flows = [0 - input.capex], months = [];
 let cumulative = 0 - input.capex;
 for (let index = 0; index < input.horizonMonths; index++) {
  const ramp = Math.min(1, (index + 1) / input.rampMonths);
  const current = operatingMonth(input, monthlyVisits * ramp, index);
  cumulative += current.cashFlow; flows.push(current.cashFlow);
  months.push({month: index + 1, year: Math.floor(index / 12) + 1, capacity: monthlyCapacity, utilization: current.visits / monthlyCapacity * 100, ramp, ...current, cumulative});
 }
 const year1 = Object.fromEntries(['visits', 'revenue', 'operatingProfit', 'cashFlow'].map(key => [key, months.slice(0, 12).reduce((sum, row) => sum + row[key], 0)]));
 return {id, multiplier, utilization: monthlyVisits / monthlyCapacity * 100, monthlyVisits, revenue: steadyState.revenue, operatingProfit: steadyState.operatingProfit, cashFlow: steadyState.cashFlow, steadyState, months, flows, finance: summarizeFinance(flows, input.discountRate), year1};
}
/** Transparent unit economics and deterministic stresses, not an estimated demand forecast. */
export function planBusiness(raw) {
 const input = validatePlannerInput(raw), monthlyCapacity = input.capacityPerDay * input.operatingDays;
 const contributionPerVisit = input.price * (1 - input.variableCostPct / 100);
 const fixedCosts = input.rent + input.otherFixedCosts;
 const breakEvenVisits = fixedCosts === 0 ? 0 : contributionPerVisit > 0 ? fixedCosts / contributionPerVisit : null;
 const requestedVisits = input.observedMonthlyVisits === null ? monthlyCapacity * input.utilization / 100 : input.observedMonthlyVisits;
 const baseVisits = Math.min(monthlyCapacity, requestedVisits);
 const scenarios = [['low', 0.7], ['base', 1], ['high', 1.3]].map(([id, multiplier]) => runScenario(input, id, multiplier, baseVisits, monthlyCapacity));
 const base = scenarios[1], warnings = [];
 if (input.observedMonthlyVisits === null) warnings.push({code: 'assumed_volume', message: 'Загрузка задана как допущение. Сценарии не оценивают фактический спрос в локации.'});
 if (requestedVisits > monthlyCapacity) warnings.push({code: 'volume_above_capacity', message: 'Введённые посещения выше указанной мощности. Расчёт ограничен мощностью.'});
 if (contributionPerVisit <= 0) warnings.push({code: 'non_positive_contribution', message: 'Каждый дополнительный визит не покрывает переменные затраты. Проверьте цену и себестоимость.'});
 if (breakEvenVisits === null || breakEvenVisits > monthlyCapacity) warnings.push({code: 'break_even_above_capacity', message: 'При текущей цене, затратах и мощности операционная безубыточность недостижима.'});
 if (base.finance.maxFundingNeed > input.capex + 0.01) warnings.push({code: 'working_capital_needed', message: 'На покрытие операционных убытков требуется дополнительный денежный резерв сверх затрат на открытие.'});
 const sensitivity = [];
 const labels = {price: 'Цена', visits: 'Посещения', rent: 'Аренда', otherFixedCosts: 'Прочие постоянные затраты', variableCostPct: 'Доля переменных затрат'};
 for (const key of Object.keys(labels)) for (const change of [-10, 10]) {
  const altered = {...input}; let visits = baseVisits;
  if (key === 'visits') visits = Math.min(monthlyCapacity, baseVisits * (1 + change / 100));
  else altered[key] *= 1 + change / 100;
  // This is ceteris paribus sensitivity: a changed price does not imply a known demand reaction.
  const result = runScenario(altered, 'sensitivity', 1, visits, monthlyCapacity);
  sensitivity.push({key, change, label: labels[key], npv: result.finance.npv, deltaNpv: result.finance.npv - base.finance.npv, operatingProfit: result.operatingProfit});
 }
 sensitivity.sort((a, b) => Math.abs(b.deltaNpv) - Math.abs(a.deltaNpv));
 return {
  input, monthlyCapacity, contributionPerVisit, fixedCosts, breakEvenVisits,
  breakEvenPerDay: breakEvenVisits === null ? null : breakEvenVisits / input.operatingDays,
  breakEvenUtilization: breakEvenVisits === null ? null : breakEvenVisits / monthlyCapacity * 100,
  maxAffordableRent: baseVisits * contributionPerVisit - input.otherFixedCosts,
  demandBasis: input.observedMonthlyVisits === null ? 'assumption' : 'observed', requestedMonthlyVisits: requestedVisits,
  scenarios, base, sensitivity, warnings,
 };
}
