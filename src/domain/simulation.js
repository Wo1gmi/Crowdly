import {allocateMonth} from './demand.js';
import {summarizeFinance} from './finance.js';
import {validateProject,validateModelScenario} from './validation.js';

export function revenue(location,visits,price=location.price) {
 if(!Number.isFinite(visits)||visits<0||!Number.isFinite(price)||price<0)throw new Error('Посещения и цена должны быть конечными неотрицательными числами.');
 const purchases=visits*location.conversion/100;
 const tenantSales=purchases*price;
 const rent=location.area*location.occupancy/100*location.tenants.reduce((s,t)=>s+t.share/100*t.rent,0);
 const turnoverRent=tenantSales*location.tenants.reduce((s,t)=>s+t.share/100*t.turnover/100,0);
 return {purchases,tenantSales,operatorRevenue:location.revenueModel==='rental'?rent+turnoverRent:tenantSales+visits*location.ancillary};
}
export function applyScenario(project,scenario) {
 validateModelScenario(scenario,project);
 if(!scenario)return structuredClone(project.locations);
 return project.locations.map(l=>l.id!==scenario.locationId?structuredClone(l):{
  ...structuredClone(l),...Object.fromEntries(['price','area','capacity','quality','lat','lon','capex'].map(k=>[k,scenario[k]??l[k]])),
  tenants:l.tenants.map((t,i)=>({...t,share:scenario.tenantShares?.[i]??t.share}))
 });
}
/** Operating break-even at today's costs; excludes CAPEX, financing and taxes. */
export function unitEconomics(project,scenario=null) {
 const costMultiplier=scenario?.costMultiplier??1;
 const locations=applyScenario(project,scenario).filter(l=>l.role==='target').map(l=>{
  const fixedRevenue=revenue(l,0).operatorRevenue;
  const revenuePerVisit=revenue(l,1).operatorRevenue-fixedRevenue;
  const variableCostPerVisit=l.variableCost*costMultiplier;
  const contributionPerVisit=revenuePerVisit-variableCostPerVisit;
  const fixedCosts=l.fixedCosts*costMultiplier;
  const uncoveredFixedCosts=fixedCosts-fixedRevenue;
  const breakEvenVisits=uncoveredFixedCosts<=0?0:contributionPerVisit>0?uncoveredFixedCosts/contributionPerVisit:null;
  const capacityPerMonth=l.capacity*l.hours/l.duration*365.25/12;
  return {id:l.id,name:l.name,revenuePerVisit,variableCostPerVisit,contributionPerVisit,fixedRevenue,fixedCosts,breakEvenVisits,breakEvenRevenue:breakEvenVisits===null?null:fixedRevenue+breakEvenVisits*revenuePerVisit,capacityPerMonth,breakEvenUtilization:breakEvenVisits===null?null:breakEvenVisits/capacityPerMonth,operatingBreakEvenPossible:breakEvenVisits!==null&&breakEvenVisits<=capacityPerMonth,maxProfitableVisits:contributionPerVisit<0&&uncoveredFixedCosts<=0?-uncoveredFixedCosts/-contributionPerVisit:null};
 });
 const sum=key=>locations.reduce((s,l)=>s+l[key],0);
 return {locations,primary:locations.length===1?locations[0]:null,totals:{fixedCosts:sum('fixedCosts'),fixedRevenue:sum('fixedRevenue'),capacityPerMonth:sum('capacityPerMonth')}};
}
export function simulate(project,scenario=null) {
 validateProject(project);
 const locations=applyScenario(project,scenario),targets=locations.filter(l=>l.role==='target'),own=locations.filter(l=>l.role==='own');
 const baselineLocations=locations.filter(l=>l.role!=='target');
 const [startYear,startMonth]=project.startMonth.split('-').map(Number);
 let cum=0-targets.reduce((s,l)=>s+l.capex,0),networkCumulative=cum;
 const flows=[cum],networkFlows=[cum],months=[];
 const annualLocations=Object.fromEntries(locations.map(l=>[l.id,{...l,visits:0,revenue:0,baselineVisits:0,segments:{}}]));
 const taxFor=profit=>Math.max(0,profit)*project.taxRate/100;
 for(let m=0;m<project.horizon*12;m++){
  const year=Math.floor(m/12),date=new Date(Date.UTC(startYear,startMonth-1+m,1)),season=project.seasonality[date.getUTCMonth()];
  const days=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();
  const demandGrowth=(1+project.annualGrowth/100)**(m/12),costGrowth=(1+project.costGrowth/100)**(m/12);
  const active=locations.filter(l=>l.role!=='target'||m>=l.openMonth);
  const choiceMultipliers=Object.fromEntries(active.map(l=>[l.id,l.role==='target'?Math.min(1,(m-l.openMonth+1)/project.rampMonths):1]));
  // Ramp changes choice weights before allocation, so a not-yet-established site cannot
  // cannibalize a full year's mature demand while serving only a fraction of it.
  const allocation=allocateMonth(project,active,season,(scenario?.demandMultiplier??1)*demandGrowth,{days,choiceMultipliers});
  const baseline=allocateMonth(project,baselineLocations,season,(scenario?.demandMultiplier??1)*demandGrowth,{days});
  let visits=0,demand=0,revenueTotal=0,costs=0,ownLostRevenue=0,ownLostVisits=0,purchases=0,capacity=0,ownCurrentProfit=0,ownBaselineProfit=0;
  for(const l of locations){
   const r=allocation.locations[l.id];if(!r)continue;
   const q=r.visits,baseQ=baseline.locations[l.id]?.visits??0,rev=revenue(l,q),base=revenue(l,baseQ);
   // The scenario cost stress belongs to the planned investment, not to the existing network.
   const costMultiplier=l.role==='target'?(scenario?.costMultiplier??1):1;
   const currentCosts=(l.fixedCosts+q*l.variableCost)*costGrowth*costMultiplier;
   if(m<12){const a=annualLocations[l.id];a.visits+=q;a.revenue+=rev.operatorRevenue;a.baselineVisits+=baseQ;for(const seg of r.segments)a.segments[seg.id]=(a.segments[seg.id]??0)+seg.visits;}
   if(l.role==='target'){visits+=q;demand+=r.demand;revenueTotal+=rev.operatorRevenue;costs+=currentCosts;purchases+=rev.purchases;capacity+=r.capacity;}
   if(l.role==='own'){
    ownLostRevenue+=Math.max(0,base.operatorRevenue-rev.operatorRevenue);
    ownLostVisits+=Math.max(0,baseQ-q);
    ownCurrentProfit+=rev.operatorRevenue-currentCosts;
    ownBaselineProfit+=base.operatorRevenue-(l.fixedCosts+baseQ*l.variableCost)*costGrowth;
   }
  }
  const profit=revenueTotal-costs,tax=taxFor(profit),cf=profit-tax;
  const networkProfit=profit+ownCurrentProfit-ownBaselineProfit;
  const networkTax=taxFor(profit+ownCurrentProfit)-taxFor(ownBaselineProfit);
  const networkCash=networkProfit-networkTax;
  cum+=cf;networkCumulative+=networkCash;flows.push(cf);networkFlows.push(networkCash);
  months.push({index:m,date:date.toISOString().slice(0,7),year:year+1,days,visits,demand,revenue:revenueTotal,costs,profit,tax,cashFlow:cf,cumulative:cum,networkCash,networkProfit,networkTax,networkCumulative,ownLostRevenue,ownLostVisits,purchases,capacity,utilization:capacity?visits/capacity:0,unserved:Math.max(0,demand-visits),outside:allocation.outside});
 }
 const first=months.slice(0,12),sum=key=>first.reduce((s,m)=>s+m[key],0);
 const lastRevenue=months.slice(-12).reduce((s,m)=>s+m.revenue,0),targetRevenue=sum('revenue'),lost=sum('ownLostRevenue');
 const economics=unitEconomics(project,scenario),warnings=[];
 if(!project.calibration)warnings.push({code:'uncalibrated_demand',message:'Спрос рассчитан по заданным предпосылкам. Независимая точность прогноза не подтверждена.'});
 if(first.some(m=>m.unserved>0.01))warnings.push({code:'capacity_limited',message:'Часть потенциальных визитов превышает мощность. Модель не перераспределяет этот спрос после переполнения.'});
 if(economics.locations.some(l=>!l.operatingBreakEvenPossible))warnings.push({code:'break_even_above_capacity',message:'Порог безубыточности одного из объектов превышает его расчётную мощность.'});
 return {months,locations:Object.values(annualLocations),flows,networkFlows,finance:summarizeFinance(flows,project.discount),networkFinance:summarizeFinance(networkFlows,project.discount),annual:{visits:sum('visits'),revenue:targetRevenue,costs:sum('costs'),cashFlow:sum('cashFlow'),purchases:sum('purchases'),lostRevenue:lost,netRevenue:targetRevenue-lost,lostVisits:sum('ownLostVisits'),utilization:sum('capacity')?sum('visits')/sum('capacity'):0,cannibalization:targetRevenue?lost/targetRevenue:0,lastRevenue},targetIds:targets.map(l=>l.id),ownIds:own.map(l=>l.id),economics,warnings};
}
export function priceSensitivity(project,scenario) {
 const l=project.locations.find(l=>l.id===scenario?.locationId)||project.locations.find(l=>l.role==='target');
 if(!l)return [];
 return [-20,-10,0,10,20].map(change=>{const price=(scenario?.price??l.price)*(1+change/100),result=simulate(project,{...scenario,locationId:l.id,price});return {change,price,visits:result.annual.visits,revenue:result.annual.revenue,npv:result.finance.npv};});
}
/** Estimate only a demand scale from observations below physical capacity; never price elasticity. */
export function calibrateDemand(project) {
 validateProject(project);
 const clone={...project,demandScale:1},historicalLocations=project.locations.filter(l=>l.role!=='target');
 const byId=new Map(historicalLocations.map(l=>[l.id,l])),allocations=new Map(),usedRows=[],excludedRows=[];
 for(const row of project.history){
  if(!byId.has(row.locationId)){excludedRows.push({date:row.date,locationId:row.locationId,reason:'planned-object'});continue;}
  if(!allocations.has(row.date)){
   const [year,month]=row.date.split('-').map(Number),days=new Date(Date.UTC(year,month,0)).getUTCDate();
   allocations.set(row.date,allocateMonth(clone,historicalLocations,project.seasonality[month-1],1,{days}));
  }
  const r=allocations.get(row.date).locations[row.locationId];
  if(row.visits>=r.capacity*0.95){excludedRows.push({date:row.date,locationId:row.locationId,reason:row.visits>r.capacity?'above-capacity':'capacity-censored'});continue;}
  if(r.demand<=0){excludedRows.push({date:row.date,locationId:row.locationId,reason:'zero-prediction'});continue;}
  usedRows.push({date:row.date,locationId:row.locationId,observed:row.visits,predicted:r.demand});
 }
 const observed=usedRows.reduce((s,r)=>s+r.observed,0),predicted=usedRows.reduce((s,r)=>s+r.predicted,0);
 if(!usedRows.length||predicted<=0)throw new Error('Нужна история посещений действующих объектов ниже 95% календарной вместимости. Проверьте единицы данных и мощность.');
 const scale=observed/predicted;
 if(scale<0.05||scale>20)throw new Error('Масштаб вне диапазона 0,05–20. Проверьте численность аудитории и единицы данных.');
 const absoluteError=usedRows.reduce((s,r)=>s+Math.abs(r.observed-r.predicted*scale),0);
 return {scale,rows:usedRows.length,at:new Date().toISOString(),method:'ratio-of-sums',excludedRows,diagnostics:{observedVisits:observed,predictedVisits:predicted*scale,inSampleWape:observed>0?absoluteError/observed:null,months:new Set(usedRows.map(r=>r.date)).size,objects:new Set(usedRows.map(r=>r.locationId)).size,independentValidation:false}};
}
