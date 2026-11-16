import test from 'node:test';
import assert from 'node:assert/strict';
import {planBusiness, validatePlannerInput} from '../src/domain/planner.js';
import {npv, irr, summarizeFinance} from '../src/domain/finance.js';

const example = (overrides = {}) => ({country:'RU',currency:'RUB',format:'family',name:'My business',city:'Moscow',price:1000,capacityPerDay:100,operatingDays:30,utilization:50,rent:200000,otherFixedCosts:400000,variableCostPct:20,capex:2400000,horizonMonths:36,discountRate:0,annualCostGrowth:0,annualPriceGrowth:0,rampMonths:1,taxRate:0,observedMonthlyVisits:null,...overrides});
const near = (actual, expected, tolerance = 1e-7) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test('planner unit economics match a hand-calculated business', () => {
 const plan = planBusiness(example());
 assert.equal(plan.monthlyCapacity, 3000);
 assert.equal(plan.contributionPerVisit, 800);
 assert.equal(plan.fixedCosts, 600000);
 assert.equal(plan.breakEvenVisits, 750);
 assert.equal(plan.breakEvenPerDay, 25);
 assert.equal(plan.breakEvenUtilization, 25);
 assert.equal(plan.maxAffordableRent, 800000);
 assert.equal(plan.base.monthlyVisits, 1500);
 assert.equal(plan.base.revenue, 1500000);
 assert.equal(plan.base.operatingProfit, 600000);
 assert.equal(plan.base.finance.npv, 19200000);
 assert.equal(plan.base.finance.payback, 4);
 assert.equal(plan.base.year1.visits, 18000);
});
test('zero observed visits are data, while null uses the utilization assumption', () => {
 const observedZero = planBusiness(example({observedMonthlyVisits:0}));
 assert.equal(observedZero.demandBasis, 'observed');
 assert.equal(observedZero.base.monthlyVisits, 0);
 assert.equal(observedZero.base.revenue, 0);
 assert.equal(observedZero.base.finance.payback, null);
 assert.ok(observedZero.scenarios.every(s => s.monthlyVisits === 0));
 assert.equal(planBusiness(example()).demandBasis, 'assumption');
 assert.equal(planBusiness(example({observedMonthlyVisits:500})).base.monthlyVisits, 500);
});
test('three scenarios stress volume and remain physically capacity constrained', () => {
 const plan = planBusiness(example({utilization:95}));
 near(plan.scenarios[0].monthlyVisits, 1995);
 assert.equal(plan.base.monthlyVisits, 2850);
 assert.equal(plan.scenarios[2].monthlyVisits, 3000);
 for (const scenario of plan.scenarios) for (const month of scenario.months) {
  assert.ok(month.visits <= month.capacity && month.visits >= 0);
  assert.ok(month.utilization <= 100 && month.utilization >= 0);
 }
 const over = planBusiness(example({observedMonthlyVisits:5000}));
 assert.equal(over.base.monthlyVisits, 3000);
 assert.equal(over.requestedMonthlyVisits, 5000);
 assert.ok(over.warnings.some(w => w.code === 'volume_above_capacity'));
});
test('ramp begins in month one and funding need includes early losses', () => {
 const plan = planBusiness(example({rampMonths:3}));
 assert.deepEqual(plan.base.months.slice(0,3).map(m => m.visits), [500,1000,1500]);
 assert.equal(plan.base.months[0].cashFlow, -200000);
 assert.equal(plan.base.finance.maxFundingNeed, 2600000);
 assert.equal(plan.base.finance.payback, 6);
 assert.ok(plan.warnings.some(w => w.code === 'working_capital_needed'));
 assert.equal(plan.base.months.at(-1).cumulative, plan.base.finance.netCash);
});
test('break-even detects unviable margins and a threshold above capacity', () => {
 for (const variableCostPct of [100,120]) {
  const plan = planBusiness(example({variableCostPct}));
  assert.equal(plan.breakEvenVisits, null);
  assert.equal(plan.breakEvenUtilization, null);
  assert.ok(plan.warnings.some(w => w.code === 'non_positive_contribution'));
 }
 const constrained = planBusiness(example({capacityPerDay:10}));
 assert.equal(constrained.breakEvenUtilization, 250);
 assert.ok(constrained.warnings.some(w => w.code === 'break_even_above_capacity'));
 assert.equal(planBusiness(example({rent:0,otherFixedCosts:0,price:0})).breakEvenVisits, 0);
});
test('higher rent and operating costs worsen economics without changing assumed demand', () => {
 const base = planBusiness(example());
 for (const overrides of [{rent:300000},{otherFixedCosts:500000},{variableCostPct:30}]) {
  const result = planBusiness(example(overrides));
  assert.ok(result.breakEvenVisits > base.breakEvenVisits);
  assert.ok(result.base.finance.npv < base.base.finance.npv);
  assert.equal(result.base.monthlyVisits, base.base.monthlyVisits);
 }
 const costInflation = planBusiness(example({annualCostGrowth:12}));
 near(costInflation.base.months[12].fixedCosts, 600000*1.12);
 assert.ok(costInflation.base.finance.npv < base.base.finance.npv);
});
test('tax is charged only on positive monthly operating profit', () => {
 const plan = planBusiness(example({rampMonths:3,taxRate:20}));
 assert.equal(plan.base.months[0].tax, 0);
 assert.equal(plan.base.months[2].tax, 120000);
 assert.equal(plan.base.months[2].cashFlow, 480000);
});
test('monthly effective discounting and annualized IRR match closed form', () => {
 near(npv([-100,110],.1,1),0);
 near(irr([-100,110],1),.1);
 near(irr([-100,110],12),1.1**12-1);
 near(irr([-100,0.001],1),-0.99999,1e-10);
 near(irr([-100,0.001,...Array(120).fill(0)],1),-0.99999,1e-10);
 assert.equal(irr([-100,300,-250]), null);
 assert.equal(summarizeFinance([-100,-20,80],0).maxFundingNeed,120);
});
test('financial APIs reject non-finite flows and invalid discount conventions', () => {
 for (const flows of [[],[NaN],[1,Infinity],['100']]) assert.throws(() => npv(flows,.1));
 for (const rate of [-1,-2,NaN,Infinity]) assert.throws(() => npv([-100,120],rate));
 for (const periods of [0,-1,NaN]) assert.throws(() => irr([-100,120],periods));
});
test('sensitivity orders levers by NPV effect and does not invent price elasticity', () => {
 const plan = planBusiness(example());
 assert.equal(plan.sensitivity.length,10);
 const rent = plan.sensitivity.find(row => row.key==='rent' && row.change===10);
 near(rent.deltaNpv,-20000*36);
 const price = plan.sensitivity.find(row => row.key==='price' && row.change===10);
 near(price.deltaNpv,120000*36);
 for(let i=1;i<plan.sensitivity.length;i++) assert.ok(Math.abs(plan.sensitivity[i-1].deltaNpv)>=Math.abs(plan.sensitivity[i].deltaNpv));
});
test('planner is deterministic, JSON serializable and never mutates inputs', () => {
 const input = example(), copy = structuredClone(input);
 const a = planBusiness(input), b = planBusiness(input);
 assert.deepEqual(a,b); assert.deepEqual(input,copy);
 assert.deepEqual(JSON.parse(JSON.stringify(a)),a);
 const zeroCapex=planBusiness(example({capex:0}));
 assert.deepEqual(JSON.parse(JSON.stringify(zeroCapex)),zeroCapex);
});
test('planner rejects invalid numbers and foreign currencies before calculation', () => {
 for(const overrides of [{price:NaN},{rent:-1},{capacityPerDay:0},{utilization:101},{operatingDays:32},{horizonMonths:12.5},{rampMonths:0},{observedMonthlyVisits:-1},{currency:'AED'},{currency:'USD'}]) assert.throws(() => planBusiness(example(overrides)));
 const uae = planBusiness(example({country:'AE',currency:'RUB'}));
 assert.equal(uae.input.currency,'RUB');
 assert.equal(uae.base.revenue,1500000);
 assert.equal(validatePlannerInput(example()).discountRate,0);
});
