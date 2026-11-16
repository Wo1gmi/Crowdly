export const uid = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const categories = {thermal:'Термальный комплекс', leisure:'Досуговое пространство', mall:'Торговый центр', retail:'Магазин'};
export const roles = {target:'Проектируемый', own:'Объект сети', competitor:'Конкурент'};
export const tenantDefaults = [
 {id:'wellness',name:'Здоровье и отдых',share:40,rent:1800,turnover:5,appeal:1.25},
 {id:'food',name:'Еда и напитки',share:25,rent:2600,turnover:7,appeal:1.05},
 {id:'shops',name:'Торговля',share:20,rent:2100,turnover:4,appeal:0.8},
 {id:'services',name:'Услуги',share:15,rent:1500,turnover:4,appeal:0.9},
];
export function makeLocation(overrides={}) {return {
 id:uid(),name:'Новый объект',role:'target',category:'thermal',lat:55.76,lon:37.61,
 price:1900,area:6500,capacity:650,hours:14,duration:3,quality:1,conversion:65,
 ancillary:420,capex:320000000,fixedCosts:7000000,variableCost:300,
 revenueModel:'direct',occupancy:90,openMonth:0,tenants:structuredClone(tenantDefaults),...overrides
};}
export function makeProject(overrides={}) {if(Object.hasOwn(overrides,'currency')&&overrides.currency!=='RUB'){const error=new Error('Новый проект можно создать только в российских рублях (RUB). Значения другой валюты не преобразуются.');error.code='unsupported_currency';throw error;}return {
 id:uid(),name:'Новый проект',city:'Москва',currency:'RUB',startMonth:'2027-01',horizon:5,
 discount:20,taxRate:15,annualGrowth:3,costGrowth:4,outsideWeight:1.8,demandScale:1,
 rampMonths:6,seasonality:[1.22,1.12,1.04,0.94,0.89,0.84,0.82,0.89,0.99,1.09,1.12,1.04],
 locations:[makeLocation()],audiences:[{id:uid(),name:'Жители района',population:120000,lat:55.77,lon:37.6,frequency:0.8,budget:3000,travelTolerance:30,priceSensitivity:1.3}],
 scenarios:[],history:[],calibration:null,notes:'',demo:false,updatedAt:new Date().toISOString(),...overrides
};}
export function createSeed() {
 const p=makeProject({id:'demo-moscow',name:'Север Москвы · новый комплекс',city:'Москва',demo:true,
 locations:[
 makeLocation({id:'target',name:'Новый комплекс · Северный',lat:55.872,lon:37.56}),
 makeLocation({id:'own-1',name:'Объект сети · Речной',role:'own',lat:55.843,lon:37.49,area:5200,price:1800,quality:1.05,capex:0}),
 makeLocation({id:'own-2',name:'Объект сети · Ботанический',role:'own',lat:55.823,lon:37.615,area:4500,price:2000,capacity:450,capex:0}),
 makeLocation({id:'competitor',name:'Конкурент · Запад',role:'competitor',lat:55.865,lon:37.437,price:1700,area:5000,quality:0.9,capex:0})],
 audiences:[
 {id:'family',name:'Семьи с детьми',population:145000,lat:55.887,lon:37.585,frequency:0.55,budget:2600,travelTolerance:28,priceSensitivity:1.4},
 {id:'active',name:'Активные горожане',population:118000,lat:55.854,lon:37.57,frequency:0.8,budget:3300,travelTolerance:35,priceSensitivity:1.05},
 {id:'local',name:'Жители соседних районов',population:185000,lat:55.825,lon:37.5,frequency:0.45,budget:2200,travelTolerance:22,priceSensitivity:1.7},
 {id:'premium',name:'Аудитория с высоким доходом',population:42000,lat:55.89,lon:37.49,frequency:0.75,budget:4500,travelTolerance:40,priceSensitivity:0.8}],
 scenarios:[
 {id:'base',name:'Базовый сценарий',locationId:'target',price:1900,area:6500,capacity:650,quality:1,lat:55.872,lon:37.56,capex:320000000,demandMultiplier:1,costMultiplier:1,tenantShares:[40,25,20,15]},
 {id:'compact',name:'Компактный формат',locationId:'target',price:1700,area:4800,capacity:480,quality:0.95,lat:55.872,lon:37.56,capex:245000000,demandMultiplier:1,costMultiplier:0.85,tenantShares:[35,30,20,15]},
 {id:'premium-s',name:'Расширенный формат',locationId:'target',price:2300,area:8000,capacity:800,quality:1.2,lat:55.872,lon:37.56,capex:410000000,demandMultiplier:1,costMultiplier:1.15,tenantShares:[50,20,15,15]}]});
 return {version:1,activeProjectId:p.id,projects:[p],settings:{workspaceName:'Моя команда',displayName:'Пользователь',compact:false},activity:[{id:uid(),text:'Открыт демонстрационный проект',at:new Date().toISOString()}]};
}
