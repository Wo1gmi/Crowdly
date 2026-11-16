const finite=(v,min,max,label)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw new Error(`${label}: допустимо от ${min} до ${max}`);};
const text=(v,label)=>{if(typeof v!=='string'||!v.trim()||v.length>500)throw new Error(`${label}: введите текст до 500 символов`);};
export function validateLocation(l){
 text(l.id,'ID объекта');text(l.name,'Название объекта');if(!['target','own','competitor'].includes(l.role))throw new Error('Неизвестная роль объекта');
 if(!['thermal','leisure','mall','retail'].includes(l.category))throw new Error('Неизвестный формат объекта');
 if(!['direct','rental'].includes(l.revenueModel))throw new Error('Неизвестная модель дохода');
 finite(l.lat,-85,85,'Широта');finite(l.lon,-180,180,'Долгота');
 for(const k of ['price','ancillary','fixedCosts','variableCost','capex'])finite(l[k],0,1e12,k);
 finite(l.area,1,1e7,'Площадь');finite(l.capacity,1,1e7,'Вместимость');finite(l.duration,0.1,24,'Длительность');finite(l.hours,1,24,'Время работы');finite(l.quality,0.1,5,'Привлекательность');finite(l.conversion,0,100,'Конверсия');finite(l.occupancy,0,100,'Занятость');finite(l.openMonth,0,119,'Месяц открытия');if(!Number.isInteger(l.openMonth))throw new Error('Месяц открытия — целое число');
 if(!Array.isArray(l.tenants)||l.tenants.length!==4)throw new Error('Нужно четыре категории арендаторов');
 for(const t of l.tenants){text(t.name,'Категория');finite(t.share,0,100,'Доля площади');finite(t.rent,0,1e7,'Аренда');finite(t.turnover,0,100,'Процент с оборота');finite(t.appeal,0.1,5,'Привлекательность категории');}
 if(Math.abs(l.tenants.reduce((s,t)=>s+t.share,0)-100)>0.01)throw new Error('Доли категорий должны составлять 100%');
}
export function validateAudience(a){text(a.id,'ID аудитории');text(a.name,'Название аудитории');finite(a.population,1,1e8,'Численность');finite(a.lat,-85,85,'Широта');finite(a.lon,-180,180,'Долгота');finite(a.frequency,0,60,'Посещения в месяц');finite(a.budget,1,1e8,'Бюджет');finite(a.travelTolerance,1,240,'Допустимое время');finite(a.priceSensitivity,0.01,10,'Чувствительность к цене');}
export function validateScenario(s,p){text(s.id,'ID сценария');text(s.name,'Название сценария');const location=p.locations.find(l=>l.id===s.locationId&&l.role==='target');if(!location)throw new Error('Выберите проектируемый объект');
 validateModelScenario(s,p);
 finite(s.demandMultiplier,0.1,3,'Множитель спроса');finite(s.costMultiplier,0.1,3,'Множитель затрат');}
/** Partial scenario overrides are allowed for calculation and sensitivity, but never unchecked. */
export function validateModelScenario(s,p){
 if(s==null)return;
 if(typeof s!=='object'||Array.isArray(s))throw new Error('Некорректный сценарий');
 for(const key of ['demandMultiplier','costMultiplier'])if(s[key]!=null)finite(s[key],0,3,key);
 const keys=['price','area','capacity','quality','lat','lon','capex'];
 const hasLocationChange=keys.some(k=>s[k]!=null)||s.tenantShares!=null;
 if(s.locationId!=null||hasLocationChange){
  const location=p.locations.find(l=>l.id===s.locationId&&l.role==='target');if(!location)throw new Error('Выберите проектируемый объект сценария');
  if(s.tenantShares!=null&&(!Array.isArray(s.tenantShares)||s.tenantShares.length!==4))throw new Error('Нужно четыре доли арендаторов');
  validateLocation({...location,...Object.fromEntries(keys.filter(k=>s[k]!=null).map(k=>[k,s[k]])),tenants:location.tenants.map((t,i)=>({...t,share:s.tenantShares?.[i]??t.share}))});
 }
}
export function validateProject(p){
 if(!p||typeof p!=='object')throw new Error('Некорректный проект');
 text(p.id,'ID проекта');text(p.name,'Название проекта');text(p.city,'Город');if(p.currency!=='RUB'){const error=new Error('Расчёты поддерживаются только в российских рублях (RUB). Валюта исходных данных не изменяется.');error.code='unsupported_currency';throw error;}
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(p.startMonth)||Number(p.startMonth.slice(0,4))<2000||Number(p.startMonth.slice(0,4))>2100)throw new Error('Дата начала: 2000–2100, формат ГГГГ-ММ');
 finite(p.horizon,1,10,'Горизонт');if(!Number.isInteger(p.horizon))throw new Error('Горизонт — целое число лет');finite(p.discount,0,200,'Ставка дисконтирования');finite(p.taxRate,0,100,'Налог на положительный результат');finite(p.annualGrowth,-30,50,'Рост спроса');finite(p.costGrowth,0,100,'Рост расходов');finite(p.outsideWeight,0.01,100,'Внешняя альтернатива');finite(p.demandScale,0.05,20,'Масштаб спроса');finite(p.rampMonths,1,24,'Выход на загрузку');if(!Number.isInteger(p.rampMonths))throw new Error('Выход на загрузку — целое число месяцев');
 if(!Array.isArray(p.locations)||p.locations.length>100||!Array.isArray(p.audiences)||p.audiences.length>100)throw new Error('Не более 100 объектов и групп');p.locations.forEach(validateLocation);p.audiences.forEach(validateAudience);
 for(const list of [p.locations,p.audiences,p.scenarios]){if(!Array.isArray(list)||new Set(list.map(x=>x.id)).size!==list.length)throw new Error('Повторяющиеся идентификаторы');}
 if(p.scenarios.length>100)throw new Error('Не более 100 сценариев');p.scenarios.forEach(s=>validateScenario(s,p));
 if(!Array.isArray(p.seasonality)||p.seasonality.length!==12)throw new Error('Нужно 12 коэффициентов сезонности');p.seasonality.forEach(v=>finite(v,0.1,3,'Сезонность'));
 if(!Array.isArray(p.history)||p.history.length>50000)throw new Error('Не более 50 000 строк истории');
 const seen=new Set();for(const h of p.history){if(!p.locations.some(l=>l.id===h.locationId)||!/^\d{4}-(0[1-9]|1[0-2])$/.test(h.date))throw new Error('История: неверный объект или дата');finite(h.visits,0,1e10,'Посещения');finite(h.revenue,0,1e14,'Выручка');const key=`${h.locationId}/${h.date}`;if(seen.has(key))throw new Error('История: повтор месяца для объекта');seen.add(key);}
}
export function validateWorkspace(data){if(data.version!==1||!Array.isArray(data.projects)||data.projects.length<1||data.projects.length>50)throw new Error('Неподдерживаемый формат резервной копии');data.projects.forEach(validateProject);if(!data.projects.some(p=>p.id===data.activeProjectId))throw new Error('Активный проект не найден');if(!data.settings||typeof data.settings.workspaceName!=='string'||typeof data.settings.displayName!=='string'||!Array.isArray(data.activity))throw new Error('Некорректные настройки');}
