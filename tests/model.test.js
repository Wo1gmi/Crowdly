import test from 'node:test';
import assert from 'node:assert/strict';
import {createSeed,makeProject,makeLocation} from '../src/data/seed.js';
import {allocateMonth,distanceKm} from '../src/domain/demand.js';
import {simulate,revenue,calibrateDemand,unitEconomics} from '../src/domain/simulation.js';
import {npv,irr,payback} from '../src/domain/finance.js';
import {validateWorkspace,validateProject,validateScenario} from '../src/domain/validation.js';
import {parseCSV,toCSV,historyFromCSV} from '../src/services/csv.js';
const project=()=>createSeed().projects[0];
test('seed conforms to the complete workspace contract',()=>validateWorkspace(createSeed()));
test('same inputs give identical simulation outputs',()=>{const p=project();assert.deepEqual(simulate(p),simulate(p));});
test('increasing a target price reduces its unconstrained demand',()=>{const p=project();const low=simulate(p,{locationId:'target',price:1000});const high=simulate(p,{locationId:'target',price:3000});assert.ok(high.annual.visits<low.annual.visits);});
test('cohort demand is conserved across locations and outside option',()=>{const p=project();const r=allocateMonth(p,p.locations);const demand=Object.values(r.locations).reduce((s,x)=>s+x.demand,0);assert.ok(Math.abs(demand+r.outside-r.opportunities)<1e-7);});
test('zero population implies zero visits and zero direct revenue',()=>{const p=project();p.audiences=[];const r=simulate(p);assert.equal(r.annual.visits,0);assert.equal(r.annual.revenue,0);});
test('capacity limits served visits, not latent demand',()=>{const p=project();p.locations[0].capacity=1;const r=allocateMonth(p,p.locations);const target=r.locations.target;assert.ok(target.demand>target.visits);assert.equal(target.visits,1*14/3*30);});
test('new opening reduces own-object demand and net increment is below standalone revenue',()=>{const r=simulate(project());assert.ok(r.annual.lostVisits>0);assert.ok(r.annual.netRevenue<r.annual.revenue);assert.ok(r.networkFinance.npv<r.finance.npv);});
test('an opening after the horizon produces no first-year target sales',()=>{const p=project();p.locations[0].openMonth=24;assert.equal(simulate(p).annual.revenue,0);});
test('no planned location produces no incremental cash flow',()=>{const p=project();p.locations=p.locations.filter(l=>l.role!=='target');p.scenarios=[];const r=simulate(p);assert.equal(r.finance.npv,0);assert.equal(r.annual.netRevenue,0);});
test('rental revenue uses occupancy, floor area and turnover rent',()=>{const l=makeLocation({revenueModel:'rental',area:1000,occupancy:80,price:100,conversion:100});l.tenants=l.tenants.map(t=>({...t,share:25,rent:1000,turnover:5}));assert.equal(revenue(l,1000).operatorRevenue,805000);});
test('financial formulas agree with annual closed-form example',()=>{assert.ok(Math.abs(npv([-100,110],0.1,1))<1e-10);assert.ok(Math.abs(irr([-100,110],1)-0.1)<1e-9);assert.equal(payback([-100,40,80]),1.75);});
test('IRR handles initial operating losses and rejects multiple sign reversals',()=>{const flows=[-100,-20,80,100];const rate=irr(flows,1);assert.ok(rate>0);assert.ok(Math.abs(npv(flows,rate,1))<1e-7);assert.equal(irr([-100,300,-250],1),null);});
test('monthly IRR is annualized and payback beyond horizon is null',()=>{assert.ok(Math.abs(irr([-100,110],12)-(1.1**12-1))<1e-7);assert.equal(payback([-100,10,10]),null);});
test('a demand stress changes both baseline and opening case consistently',()=>{const p=project(),a=simulate(p),b=simulate(p,{demandMultiplier:.5});assert.ok(b.annual.visits<a.annual.visits);assert.ok(Math.abs(b.annual.cannibalization-a.annual.cannibalization)<1e-6);});
test('calibration recovers a known scale from uncapped own-object history',()=>{const p=project();const own=p.locations.filter(l=>l.role!=='target');const r=allocateMonth({...p,demandScale:1},own,p.seasonality[0]);p.history=[{locationId:'own-1',date:'2026-01',visits:r.locations['own-1'].visits*1.5,revenue:1000}];assert.ok(Math.abs(calibrateDemand(p).scale-1.5)<1e-8);});
test('invalid data and unbalanced tenant shares are rejected',()=>{const p=project();p.locations[0].tenants[0].share=80;assert.throws(()=>validateProject(p),/100%/);const p2=project();p2.discount=NaN;assert.throws(()=>validateProject(p2));});
test('CSV roundtrip supports delimiters, quotes, BOM and linebreaks',()=>{const data=[{name:'One; "Two"\nThree',value:123}];const rows=parseCSV(toCSV(data));assert.equal(rows[0].name,data[0].name);assert.equal(rows[0].value,'123');});
test('CSV cannot silently accept bad row shapes or unknown object IDs',()=>{assert.throws(()=>parseCSV('a;b\n1;2;3'));assert.throws(()=>historyFromCSV('date,locationId,visits,revenue\n2026-01,missing,10,100',project()));});
test('workspace restore rejects missing fields and duplicate history months',()=>{const s=createSeed();s.projects[0].history=[{date:'2026-01',locationId:'own-1',visits:10,revenue:100},{date:'2026-01',locationId:'own-1',visits:20,revenue:200}];assert.throws(()=>validateWorkspace(s),/повтор/);});
test('model does not mutate project inputs',()=>{const p=project(),copy=structuredClone(p);simulate(p,p.scenarios[0]);assert.deepEqual(p,copy);});
test('spherical distance sanity check',()=>{assert.equal(distanceKm({lat:0,lon:0},{lat:0,lon:0}),0);assert.ok(Math.abs(distanceKm({lat:0,lon:0},{lat:0,lon:1})-111.195)<0.01);});
test('calendar capacity uses actual month length, including leap years',()=>{
 const p=project();p.startMonth='2028-01';p.locations[0].capacity=1;p.rampMonths=1;
 const r=simulate(p),daily=14/3;
 assert.equal(r.months[0].capacity,daily*31);
 assert.equal(r.months[1].capacity,daily*29);
 assert.equal(r.months[3].capacity,daily*30);
 for(const m of r.months)assert.ok(m.visits<=m.capacity);
});
test('ramp-up reduces cannibalization while demand remains conserved',()=>{
 const p=project();p.rampMonths=12;
 const early=simulate(p),mature=simulate({...p,rampMonths:1});
 assert.ok(early.months[0].ownLostVisits<mature.months[0].ownLostVisits);
 assert.ok(early.months[0].visits<mature.months[0].visits);
 const a=allocateMonth(p,p.locations,1,1,{choiceMultipliers:{target:1/12}});
 const sum=Object.values(a.locations).reduce((s,l)=>s+l.demand,0)+a.outside;
 assert.ok(Math.abs(sum-a.opportunities)<1e-7);
});
test('network after-tax cash is the change in total network cash, including tax savings',()=>{
 const common={price:100,area:5000,lat:0,lon:0,capacity:1000,hours:12,duration:1,quality:1,conversion:100,ancillary:0,variableCost:0};
 const target=makeLocation({...common,id:'new',fixedCosts:40000});
 const own=makeLocation({...common,id:'old',role:'own',fixedCosts:10000,capex:0});
 for(const l of [target,own])l.tenants=l.tenants.map(t=>({...t,appeal:1}));
 const p=makeProject({locations:[target,own],audiences:[{id:'a',name:'A',population:1000,lat:0,lon:0,frequency:1,budget:1000,travelTolerance:100,priceSensitivity:1}],outsideWeight:Math.exp(-.16),rampMonths:1,seasonality:Array(12).fill(1),taxRate:20,annualGrowth:0,costGrowth:0});
 const m=simulate(p).months[0];
 assert.ok(Math.abs(m.visits-1000/3)<1e-9);
 assert.ok(Math.abs(m.networkProfit-(-70000/3))<1e-7);
 assert.ok(Math.abs(m.networkTax-(-14000/3))<1e-7);
 assert.ok(Math.abs(m.networkCash-(-56000/3))<1e-7);
});
test('scenario cost stress affects planned investment without changing own-network cost assumptions',()=>{
 const p=project();p.taxRate=0;
 const normal=simulate(p),stress=simulate(p,{costMultiplier:1.5});
 for(let i=0;i<normal.months.length;i++){
  const a=normal.months[i],b=stress.months[i];
  assert.ok(Math.abs(b.costs-a.costs*1.5)<1e-6);
  assert.ok(Math.abs((a.cashFlow-a.networkCash)-(b.cashFlow-b.networkCash))<1e-6);
 }
});
test('simulation rejects invalid partial overrides and non-finite inputs',()=>{
 assert.throws(()=>simulate({...project(),discount:NaN}));
 assert.throws(()=>simulate(project(),{locationId:'target',price:NaN}));
 assert.throws(()=>simulate(project(),{locationId:'missing',price:100}));
 assert.throws(()=>simulate(project(),{demandMultiplier:-1}));
 assert.throws(()=>simulate(project(),{locationId:'target',tenantShares:[100]}));
 assert.throws(()=>allocateMonth(project(),project().locations,NaN));
 assert.throws(()=>distanceKm({lat:NaN,lon:0},{lat:0,lon:0}));
 const zero=simulate(project(),{demandMultiplier:0});assert.equal(zero.annual.visits,0);
});
test('unit economics distinguish operating break-even from investment recovery',()=>{
 const p=makeProject({locations:[makeLocation({price:100,conversion:100,ancillary:0,fixedCosts:8000,variableCost:20,capex:1000000,capacity:100,hours:10,duration:1})]});
 const e=unitEconomics(p).primary;
 assert.equal(e.contributionPerVisit,80);assert.equal(e.breakEvenVisits,100);assert.equal(e.breakEvenRevenue,10000);
 assert.equal(unitEconomics(p,{costMultiplier:2}).primary.breakEvenVisits,16000/60);
 p.locations[0].variableCost=120;
 assert.equal(unitEconomics(p).primary.breakEvenVisits,null);
 assert.equal(unitEconomics(p).primary.operatingBreakEvenPossible,false);
});
test('calibration excludes physically impossible and capacity-censored observations',()=>{
 const p=project(),historical=p.locations.filter(l=>l.role!=='target'),allocation=allocateMonth(p,historical,p.seasonality[0],1,{days:31});
 p.history=[{locationId:'own-1',date:'2026-01',visits:allocation.locations['own-1'].demand*1.2,revenue:1000},{locationId:'own-2',date:'2026-01',visits:allocation.locations['own-2'].capacity*2,revenue:1000}];
 const calibrated=calibrateDemand(p);
 assert.ok(Math.abs(calibrated.scale-1.2)<1e-10);
 assert.equal(calibrated.rows,1);assert.equal(calibrated.excludedRows[0].reason,'above-capacity');
 assert.equal(calibrated.diagnostics.independentValidation,false);
 p.history=p.history.slice(1);assert.throws(()=>calibrateDemand(p),/95%/);
});
test('workspace JSON restore rejects malformed tenantShares before comparison can render',()=>{
 for(const tenantShares of [{0:40,1:25,2:20,3:15},[40,25,20,15,0],[]]){
  const workspace=createSeed();workspace.projects[0].scenarios[0].tenantShares=tenantShares;
  const restored=JSON.parse(JSON.stringify(workspace));
  assert.throws(()=>validateWorkspace(restored),/четыре доли/);
 }
 const valid=JSON.parse(JSON.stringify(createSeed()));
 assert.doesNotThrow(()=>validateWorkspace(valid));
 for(const scenario of valid.projects[0].scenarios)assert.doesNotThrow(()=>simulate(valid.projects[0],scenario));
});
