import {validateAudience,validateLocation} from './validation.js';
/** Deterministic cohort choice model. All coefficients are explicit assumptions, not trained ML. */
export function distanceKm(a,b) {
 if (![a?.lat,a?.lon,b?.lat,b?.lon].every(Number.isFinite) || Math.abs(a.lat)>90 || Math.abs(b.lat)>90 || Math.abs(a.lon)>180 || Math.abs(b.lon)>180) throw new Error('Неверные координаты для расчёта расстояния.');
 const rad=x=>x*Math.PI/180,dlat=rad(b.lat-a.lat),dlon=rad(b.lon-a.lon);
 const h=Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlon/2)**2;
 return 6371*2*Math.asin(Math.sqrt(Math.max(0,Math.min(1,h))));
}
export function locationAppeal(location) {
 const tenantFactor=location.tenants.reduce((s,t)=>s+t.share/100*t.appeal,0);
 return Math.max(0.05,location.quality)*(location.area/5000)**0.3*(0.6+0.4*tenantFactor);
}
export function allocateMonth(project,locations,season=1,demandMultiplier=1,options={}) {
 if(!Array.isArray(locations)||!Array.isArray(project?.audiences)||new Set(locations.map(l=>l.id)).size!==locations.length)throw new Error('Нужны уникальные объекты и группы аудитории.');
 locations.forEach(validateLocation);project.audiences.forEach(validateAudience);
 const days=options.days??30;
 if(!Number.isFinite(season)||season<0||!Number.isFinite(demandMultiplier)||demandMultiplier<0||!Number.isFinite(days)||days<1||days>31||!Number.isFinite(project.demandScale)||project.demandScale<0||!Number.isFinite(project.outsideWeight)||project.outsideWeight<=0)throw new Error('Некорректные параметры распределения спроса.');
 const result=Object.fromEntries(locations.map(l=>[l.id,{id:l.id,demand:0,visits:0,unserved:0,segments:[]} ]));
 let outside=0,opportunities=0;
 for(const g of project.audiences){
  const opportunitiesForGroup=g.population*g.frequency*project.demandScale*season*demandMultiplier;
  const weights=locations.map(l=>{
   const minutes=distanceKm(g,l)/25*60+6;
   const choiceMultiplier=options.choiceMultipliers?.[l.id]??1;
   if(!Number.isFinite(choiceMultiplier)||choiceMultiplier<0||choiceMultiplier>1)throw new Error('Выход на загрузку должен быть от 0 до 1.');
   return choiceMultiplier*locationAppeal(l)*Math.exp(-g.priceSensitivity*l.price/Math.max(g.budget,1)-minutes/Math.max(g.travelTolerance,1));
  });
  const totalWeight=project.outsideWeight+weights.reduce((s,w)=>s+w,0);
  outside+=opportunitiesForGroup*project.outsideWeight/totalWeight;opportunities+=opportunitiesForGroup;
  locations.forEach((l,i)=>{const q=opportunitiesForGroup*weights[i]/totalWeight;result[l.id].demand+=q;result[l.id].segments.push({id:g.id,name:g.name,visits:q});});
 }
 for(const l of locations){
  const r=result[l.id],cap=l.capacity*l.hours/Math.max(l.duration,0.1)*days;
  r.visits=Math.min(r.demand,cap);r.unserved=r.demand-r.visits;r.utilization=cap? r.visits/cap:0;r.capacity=cap;
  r.segments=r.segments.map(g=>({...g,visits:r.demand?g.visits*r.visits/r.demand:0}));
 }
 return {locations:result,outside,opportunities};
}
