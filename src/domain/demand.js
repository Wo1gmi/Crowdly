/** Deterministic cohort choice model. All coefficients are explicit assumptions, not trained ML. */
export function distanceKm(a,b) {
 const rad=x=>x*Math.PI/180,dlat=rad(b.lat-a.lat),dlon=rad(b.lon-a.lon);
 const h=Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlon/2)**2;
 return 6371*2*Math.asin(Math.sqrt(Math.min(1,h)));
}
export function locationAppeal(location) {
 const tenantFactor=location.tenants.reduce((s,t)=>s+t.share/100*t.appeal,0);
 return Math.max(0.05,location.quality)*(location.area/5000)**0.3*(0.6+0.4*tenantFactor);
}
export function allocateMonth(project,locations,season=1,demandMultiplier=1) {
 const result=Object.fromEntries(locations.map(l=>[l.id,{id:l.id,demand:0,visits:0,unserved:0,segments:[]} ]));
 let outside=0,opportunities=0;
 for(const g of project.audiences){
  const opportunitiesForGroup=g.population*g.frequency*project.demandScale*season*demandMultiplier;
  const weights=locations.map(l=>{
   const minutes=distanceKm(g,l)/25*60+6;
   return locationAppeal(l)*Math.exp(-g.priceSensitivity*l.price/Math.max(g.budget,1)-minutes/Math.max(g.travelTolerance,1));
  });
  const totalWeight=project.outsideWeight+weights.reduce((s,w)=>s+w,0);
  outside+=opportunitiesForGroup*project.outsideWeight/totalWeight;opportunities+=opportunitiesForGroup;
  locations.forEach((l,i)=>{const q=opportunitiesForGroup*weights[i]/totalWeight;result[l.id].demand+=q;result[l.id].segments.push({id:g.id,name:g.name,visits:q});});
 }
 for(const l of locations){
  const r=result[l.id],cap=l.capacity*l.hours/Math.max(l.duration,0.1)*30;
  r.visits=Math.min(r.demand,cap);r.unserved=r.demand-r.visits;r.utilization=cap? r.visits/cap:0;r.capacity=cap;
  r.segments=r.segments.map(g=>({...g,visits:r.demand?g.visits*r.visits/r.demand:0}));
 }
 return {locations:result,outside,opportunities};
}
