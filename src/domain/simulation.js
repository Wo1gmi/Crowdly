import {allocateMonth} from './demand.js';
import {summarizeFinance} from './finance.js';
export function revenue(location,visits,price=location.price) {
 const purchases=visits*location.conversion/100;
 const tenantSales=purchases*price;
 const rent=location.area*location.occupancy/100*location.tenants.reduce((s,t)=>s+t.share/100*t.rent,0);
 const turnoverRent=tenantSales*location.tenants.reduce((s,t)=>s+t.share/100*t.turnover/100,0);
 return {purchases,tenantSales,operatorRevenue:location.revenueModel==='rental'?rent+turnoverRent:tenantSales+visits*location.ancillary};
}
export function applyScenario(project,scenario) {
 if(!scenario)return structuredClone(project.locations);
 return project.locations.map(l=>l.id!==scenario.locationId?structuredClone(l):{
 ...structuredClone(l),...Object.fromEntries(['price','area','capacity','quality','lat','lon','capex'].map(k=>[k,scenario[k]??l[k]])),
 tenants:l.tenants.map((t,i)=>({...t,share:scenario.tenantShares?.[i]??t.share}))
 });
}
export function simulate(project,scenario=null) {
 const locations=applyScenario(project,scenario),targets=locations.filter(l=>l.role==='target'),own=locations.filter(l=>l.role==='own');
 const baselineLocations=locations.filter(l=>l.role!=='target');
 const [startYear,startMonth]=project.startMonth.split('-').map(Number);
 let cum=-targets.reduce((s,l)=>s+l.capex,0);const flows=[cum],networkFlows=[cum],months=[];
 const annualLocations=Object.fromEntries(locations.map(l=>[l.id,{...l,visits:0,revenue:0,baselineVisits:0,segments:{}}]));
 for(let m=0;m<project.horizon*12;m++){
  const year=Math.floor(m/12),date=new Date(Date.UTC(startYear,startMonth-1+m,1)),season=project.seasonality[date.getUTCMonth()];
  const demandGrowth=(1+project.annualGrowth/100)**(m/12);
  const active=locations.filter(l=>l.role!=='target'||m>=l.openMonth);
  const allocation=allocateMonth(project,active,season,(scenario?.demandMultiplier??1)*demandGrowth);
  const baseline=allocateMonth(project,baselineLocations,season,(scenario?.demandMultiplier??1)*demandGrowth);
  let visits=0,demand=0,revenueTotal=0,costs=0,profit=0,ownLostRevenue=0,ownLostVisits=0,lostContribution=0,purchases=0,capacity=0;
  for(const l of locations){
   const r=allocation.locations[l.id];if(!r)continue;
   const ramp=l.role==='target'?Math.min(1,(m-l.openMonth+1)/Math.max(1,project.rampMonths)):1;
   const q=r.visits*ramp,rev=revenue(l,q),base=revenue(l,baseline.locations[l.id]?.visits??0);
   const currentCosts=l.fixedCosts*(1+project.costGrowth/100)**(m/12)*(scenario?.costMultiplier??1)+q*l.variableCost*(1+project.costGrowth/100)**(m/12)*(scenario?.costMultiplier??1);
   if(m<12){const a=annualLocations[l.id];a.visits+=q;a.revenue+=rev.operatorRevenue;a.baselineVisits+=baseline.locations[l.id]?.visits??0;for(const seg of r.segments)a.segments[seg.id]=(a.segments[seg.id]??0)+seg.visits*ramp;}
   if(l.role==='target'){visits+=q;demand+=r.demand;revenueTotal+=rev.operatorRevenue;costs+=currentCosts;purchases+=rev.purchases;capacity+=r.capacity;}
   if(l.role==='own'){
    const lost=Math.max(0,base.operatorRevenue-rev.operatorRevenue),lostQ=Math.max(0,(baseline.locations[l.id]?.visits??0)-q);
    ownLostRevenue+=lost;ownLostVisits+=lostQ;lostContribution+=lost-lostQ*l.variableCost*(1+project.costGrowth/100)**(m/12);
   }
  }
  profit=revenueTotal-costs;const tax=Math.max(0,profit)*project.taxRate/100,cf=profit-tax;
  const networkProfit=profit-lostContribution,networkCash=networkProfit-Math.max(0,networkProfit)*project.taxRate/100;
  cum+=cf;flows.push(cf);networkFlows.push(networkCash);
  months.push({index:m,date:date.toISOString().slice(0,7),year:year+1,visits,demand,revenue:revenueTotal,costs,profit,tax,cashFlow:cf,cumulative:cum,networkCash,ownLostRevenue,ownLostVisits,purchases,utilization:capacity?visits/capacity:0,unserved:Math.max(0,demand-visits),outside:allocation.outside});
 }
 const first=months.slice(0,12),sum=key=>first.reduce((s,m)=>s+m[key],0);
 const last=months.slice(-12),lastRevenue=last.reduce((s,m)=>s+m.revenue,0);
 const targetRevenue=sum('revenue'),lost=sum('ownLostRevenue');
 return {months,locations:Object.values(annualLocations),flows,networkFlows,finance:summarizeFinance(flows,project.discount),networkFinance:summarizeFinance(networkFlows,project.discount),annual:{visits:sum('visits'),revenue:targetRevenue,costs:sum('costs'),cashFlow:sum('cashFlow'),purchases:sum('purchases'),lostRevenue:lost,netRevenue:targetRevenue-lost,lostVisits:sum('ownLostVisits'),utilization:first.reduce((s,m)=>s+m.utilization,0)/12,cannibalization:targetRevenue?lost/targetRevenue:0,lastRevenue},targetIds:targets.map(l=>l.id),ownIds:own.map(l=>l.id)};
}
export function priceSensitivity(project,scenario) {
 const l=project.locations.find(l=>l.id===scenario?.locationId)||project.locations.find(l=>l.role==='target');
 if(!l)return [];
 return [-20,-10,0,10,20].map(change=>{const price=(scenario?.price??l.price)*(1+change/100),result=simulate(project,{...scenario,locationId:l.id,price});return {change,price,visits:result.annual.visits,revenue:result.annual.revenue,npv:result.finance.npv};});
}
/** Estimate a single multiplicative demand scale, using uncapped observed own-object months only. */
export function calibrateDemand(project) {
 const clone={...project,demandScale:1};let observed=0,predicted=0,used=0;
 for(const row of project.history){
  const l=project.locations.find(l=>l.id===row.locationId);if(!l||l.role==='target')continue;
  const month=Number(row.date.slice(5,7))-1;
  const historicalLocations=project.locations.filter(x=>x.role!=='target');
  const allocation=allocateMonth(clone,historicalLocations,project.seasonality[month]);const r=allocation.locations[l.id];
  if(r && r.visits<r.capacity*0.95 && row.visits>=0){observed+=row.visits;predicted+=r.visits;used++;}
 }
 if(!used || predicted<=0)throw new Error('Нужна история посещений действующих объектов сети или конкурентов ниже предела вместимости.');
 const scale=observed/predicted;if(scale<0.05||scale>20)throw new Error('Масштаб вне диапазона 0,05–20. Проверьте численность аудитории и единицы данных.');
 return {scale,rows:used,at:new Date().toISOString(),method:'ratio-of-sums'};
}
