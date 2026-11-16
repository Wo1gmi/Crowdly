/** Planning examples, not market benchmarks. Never describe these values as observed. */
export const FORMATS = [
  {id:'family',ru:'Семейный центр',en:'Family entertainment',icon:'play',ruHint:'Билеты, игры, детский досуг',enHint:'Tickets, play and family activities'},
  {id:'wellness',ru:'Термы и wellness',en:'Thermal & wellness',icon:'wellness',ruHint:'Платный визит и ограниченная вместимость',enHint:'Paid visits and limited capacity'},
  {id:'cafe',ru:'Кафе',en:'Café',icon:'cafe',ruHint:'Средний чек и число заказов',enHint:'Average order and daily transactions'},
  {id:'custom',ru:'Свой формат',en:'Your own format',icon:'custom',ruHint:'Любой бизнес с оплатой за визит',enHint:'Any business with revenue per visit'},
];
const assumptions = {
    family:{price:1400,capacityPerDay:200,utilization:35,rent:600000,otherFixedCosts:912000,variableCostPct:25,capex:8000000},
    wellness:{price:2800,capacityPerDay:140,utilization:30,rent:950000,otherFixedCosts:1350000,variableCostPct:22,capex:30000000},
    cafe:{price:550,capacityPerDay:240,utilization:35,rent:180000,otherFixedCosts:520000,variableCostPct:35,capex:4500000},
    custom:{price:1000,capacityPerDay:100,utilization:35,rent:180000,otherFixedCosts:420000,variableCostPct:30,capex:3500000},
};
export function makePlannerInput(country='RU',format='family',language='ru'){
  if(!['RU','AE'].includes(country))throw new Error('Unsupported planning market');
  if(!['ru','en'].includes(language))throw new Error('Unsupported planning language');
  const f=FORMATS.find(x=>x.id===format);
  if(!f)throw new Error('Unsupported business format');
  return {country,currency:'RUB',format:f.id,name:language==='ru'?f.ru:f.en,city:country==='AE'?'Dubai':language==='ru'?'Москва':'Moscow',...assumptions[f.id],operatingDays:30,horizonMonths:60,discountRate:20,annualCostGrowth:0,annualPriceGrowth:0,rampMonths:3,taxRate:0,observedMonthlyVisits:null};
}
export const PLANNER_FIELDS=['price','capacityPerDay','operatingDays','utilization','rent','otherFixedCosts','variableCostPct','capex','horizonMonths','discountRate','annualCostGrowth','annualPriceGrowth','rampMonths','taxRate','observedMonthlyVisits'];
export const MODEL_VERSION='2.0.0';
