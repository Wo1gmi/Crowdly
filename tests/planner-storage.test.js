import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanPlanInput,parsePlannerBackup,plannerRepository,getLanguage,saveLanguage} from '../src/services/plannerStorage.js';
import {makePlannerInput,FORMATS,PLANNER_FIELDS} from '../src/data/plannerPresets.js';
import {planBusiness} from '../src/domain/planner.js';
import {createSeed,makeProject} from '../src/data/seed.js';
import {repository as workspaceRepository} from '../src/services/storage.js';

const KEY='crowdly.planner.v2';
const file=(overrides={})=>({kind:'crowdly-planner',version:2,current:makePlannerInput(),provenance:{price:'user'},saved:[],...overrides});
const saved=(id,country='RU')=>({id,input:makePlannerInput(country),savedAt:'2026-11-16T12:00:00.000Z',provenance:{price:'example',observedMonthlyVisits:'user'}});
function mockStore(t,initial={}){
 const previous=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
 const values=new Map(Object.entries(initial));
 const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:storage});
 t.after(()=>previous?Object.defineProperty(globalThis,'localStorage',previous):delete globalThis.localStorage);
 return {storage,values};
}
test('all geographic contexts and both languages use the same RUB planning examples',()=>{
 for(const country of ['RU','AE'])for(const format of FORMATS)for(const language of ['ru','en']){
  const input=makePlannerInput(country,format.id,language),result=planBusiness(input);
  assert.equal(input.currency,'RUB');
  const russian=makePlannerInput('RU',format.id,language);
  for(const key of PLANNER_FIELDS)assert.equal(input[key],russian[key]);
  assert.equal(input.format,format.id);assert.equal(input.name,format[language]);
  assert.equal(result.demandBasis,'assumption');
  assert.equal(input.taxRate,0);assert.equal(input.observedMonthlyVisits,null);
  for(const key of PLANNER_FIELDS)assert.ok(Object.hasOwn(input,key));
  assert.ok(Number.isFinite(result.base.finance.npv));
  assert.ok(result.scenarios.every(s=>s.months.every(m=>m.visits>=0&&m.visits<=m.capacity)));
 }
});
test('preset creation is independent and unsupported markets cannot silently select RUB',()=>{
 const first=makePlannerInput();first.price=1;first.name='Changed';
 assert.equal(makePlannerInput().price,1400);assert.notEqual(makePlannerInput().name,'Changed');
 assert.throws(()=>makePlannerInput('US'));
 assert.throws(()=>makePlannerInput('RU','unknown'));
 assert.throws(()=>makePlannerInput('RU','family','unknown'));
});
test('RUB backup roundtrip preserves geography, zero observations and provenance',()=>{
 const current={...makePlannerInput('AE','cafe','en'),observedMonthlyVisits:0,name:'Кафе "A"\nDubai'};
 const original=file({current,saved:[saved('ru','RU'),saved('ae','AE')],provenance:{price:'user',observedMonthlyVisits:'csv'}});
 const decoded=parsePlannerBackup(JSON.stringify(original));
 assert.deepEqual(decoded,original);
 assert.deepEqual(parsePlannerBackup(JSON.stringify(decoded)),decoded);
 assert.equal(planBusiness(decoded.current).base.monthlyVisits,0);
});
test('accepted sparse input returns complete normalized defaults for UI and export',()=>{
 const raw={price:100,capacityPerDay:20,rent:1000,otherFixedCosts:1000,variableCostPct:20,capex:10000};
 const clean=cleanPlanInput(raw);
 assert.equal(clean.currency,'RUB');assert.equal(clean.country,'RU');assert.equal(clean.format,'custom');
 assert.equal(clean.operatingDays,30);assert.equal(clean.rampMonths,3);assert.equal(clean.observedMonthlyVisits,null);
 for(const key of PLANNER_FIELDS)assert.ok(Object.hasOwn(clean,key));
 const loaded=parsePlannerBackup(JSON.stringify(file({current:raw})));
 assert.deepEqual(loaded.current,clean);
 assert.equal(planBusiness(clean).input.currency,'RUB');
});
test('import drops unknown executable or prototype-related fields instead of spreading them',()=>{
 const raw=JSON.parse(JSON.stringify(file()));
 raw.current=Object.assign(JSON.parse('{"__proto__":{"polluted":true},"constructor":"x","onload":"alert(1)"}'),raw.current);
 raw.provenance={price:'user',rent:'validated-by-crowdly',onload:'user',constructor:'user'};
 raw.untrustedExtra={admin:true};
 const safe=parsePlannerBackup(JSON.stringify(raw));
 assert.equal(Object.hasOwn(safe.current,'__proto__'),false);
 assert.equal(Object.hasOwn(safe.current,'constructor'),false);
 assert.equal(Object.hasOwn(safe.current,'onload'),false);
 assert.deepEqual(safe.provenance,{price:'user'});
 assert.equal(Object.hasOwn(safe,'untrustedExtra'),false);
 assert.equal({}.polluted,undefined);
});
test('backup parser rejects bad roots, versions, identities and oversized collections',()=>{
 for(const raw of [null,[],{},file({version:1}),file({kind:'other'}),file({current:false}),file({saved:Array.from({length:31},(_,i)=>saved(String(i)))}),file({saved:[saved('same'),saved('same')]}),file({saved:[saved('')]}),file({saved:[saved('x'.repeat(101))]}),file({saved:[{...saved('a'),savedAt:'not-a-date'}]})])assert.throws(()=>parsePlannerBackup(JSON.stringify(raw)));
 assert.throws(()=>parsePlannerBackup('{invalid json'));
});
test('backup parser rejects unsafe numbers before any calculation',()=>{
 for(const overrides of [{price:-1},{price:1e9},{rent:'100'},{capex:Infinity},{capacityPerDay:0},{observedMonthlyVisits:-1},{horizonMonths:1000000},{operatingDays:1.5},{utilization:101},{variableCostPct:201},{currency:'AED'},{currency:'USD'}])assert.throws(()=>parsePlannerBackup(JSON.stringify(file({current:{...makePlannerInput(),...overrides}}))));
 const literal=JSON.stringify(file()).replace('"price":1400','"price":1e400');
 assert.throws(()=>parsePlannerBackup(literal));
});
test('one-megabyte limit applies to UTF-8 bytes, not only character count',()=>{
 assert.throws(()=>parsePlannerBackup(' '.repeat(1000001)),/1 MB/);
 const multibyte=JSON.stringify({...file(),extra:'я'.repeat(500000)});
 assert.ok(multibyte.length<1000000);
 assert.throws(()=>parsePlannerBackup(multibyte),/1 MB/);
});
test('repository roundtrip uses its own namespace and retains the original network workspace',t=>{
 const {values}=mockStore(t,{'crowdly.workspace.v1':'advanced-project'});
 assert.deepEqual(plannerRepository.load(),{data:null,error:null});
 const expected=plannerRepository.save(file({saved:[saved('a')]}));
 assert.deepEqual(plannerRepository.load(),{data:expected,error:null});
 assert.equal(values.get('crowdly.workspace.v1'),'advanced-project');
});
test('invalid writes and malformed reads do not overwrite the stored project',t=>{
 const original=JSON.stringify(file()),{values}=mockStore(t,{[KEY]:original});
 assert.throws(()=>plannerRepository.save(file({current:{...makePlannerInput(),rent:-1}})));
 assert.equal(values.get(KEY),original);
 const corrupt='{"current":"unfinished';values.set(KEY,corrupt);
 const loaded=plannerRepository.load();
 assert.equal(loaded.error,'recover');assert.equal(loaded.recoveryText,corrupt);
 assert.equal(values.get(KEY),corrupt);
 values.set(KEY,'');assert.equal(plannerRepository.load().error,'recover');
});
test('storage read denial and quota failure remain explicit without losing the previous file',t=>{
 const original=JSON.stringify(file()),{storage,values}=mockStore(t,{[KEY]:original});
 storage.getItem=()=>{throw new Error('blocked');};
 assert.deepEqual(plannerRepository.load(),{data:null,error:'unavailable'});
 storage.setItem=()=>{throw new Error('quota');};
 assert.throws(()=>plannerRepository.save(file({current:makePlannerInput('AE')})),/quota/);
 assert.equal(values.get(KEY),original);
 assert.equal(getLanguage(),'ru');assert.doesNotThrow(()=>saveLanguage('en'));
});
test('language persistence is separate from business currency and project values',t=>{
 const original=JSON.stringify(file()),{values}=mockStore(t,{[KEY]:original});
 saveLanguage('en');assert.equal(getLanguage(),'en');
 saveLanguage('ru');assert.equal(getLanguage(),'ru');
 assert.equal(values.get(KEY),original);
});
test('English and Russian default examples both start in Moscow and RUB',()=>{
 const ru=makePlannerInput('RU','family','ru'),en=makePlannerInput('RU','family','en');
 assert.equal(ru.currency,'RUB');assert.equal(en.currency,'RUB');
 assert.equal(ru.city,'Москва');assert.equal(en.city,'Moscow');
 for(const key of PLANNER_FIELDS)assert.equal(ru[key],en[key]);
});
test('foreign imports and new projects fail explicitly without relabelling money',()=>{
 for(const currency of ['AED','USD']){
  const input={...makePlannerInput(),currency,price:80,capex:450000},copy=structuredClone(input);
  assert.throws(()=>planBusiness(input),error=>error.code==='unsupported_currency');
  assert.throws(()=>parsePlannerBackup(JSON.stringify(file({current:input}))),error=>error.code==='unsupported_currency');
  assert.throws(()=>makeProject({currency}),error=>error.code==='unsupported_currency');
  assert.deepEqual(input,copy);
 }
});
test('planner load partitions foreign entries but preserves the exact complete original',t=>{
 const rub=saved('rub'),foreignSaved={...saved('usd'),input:{...makePlannerInput(),currency:'USD',price:35}};
 const original=file({current:{...makePlannerInput('AE'),currency:'AED',price:80,capex:450000},saved:[rub,foreignSaved]});
 const raw=JSON.stringify(original,null,2),{values}=mockStore(t,{[KEY]:raw});
 const loaded=plannerRepository.load();
 assert.equal(loaded.error,'foreign_currency');assert.equal(loaded.recoveryText,raw);
 assert.deepEqual(loaded.foreignCurrencies,['AED','USD']);assert.equal(loaded.foreignRecordCount,2);
 assert.equal(loaded.data.current,null);assert.deepEqual(loaded.data.saved,[rub]);
 assert.equal(values.get(KEY),raw);
 assert.equal(JSON.parse(loaded.recoveryText).current.price,80);
 assert.equal(JSON.parse(loaded.recoveryText).current.currency,'AED');
 assert.throws(()=>plannerRepository.save(original),error=>error.code==='unsupported_currency');
 assert.equal(values.get(KEY),raw);
});
test('RUB current stays usable when a foreign saved variant requires recovery',t=>{
 const current={...makePlannerInput(),name:'Мой расчёт',rent:123456};
 const raw=JSON.stringify(file({current,saved:[{...saved('old'),input:{...makePlannerInput(),currency:'AED',rent:1234}}]}));
 const {values}=mockStore(t,{[KEY]:raw});
 const loaded=plannerRepository.load();
 assert.equal(loaded.error,'foreign_currency');assert.deepEqual(loaded.data.current,current);
 assert.deepEqual(loaded.data.saved,[]);assert.equal(loaded.recoveryText,raw);
 assert.throws(()=>parsePlannerBackup(raw),error=>error.code==='unsupported_currency');
 assert.equal(values.get(KEY),raw);
});
test('legacy workspace retains RUB projects and protects all foreign source bytes',t=>{
 const original=createSeed(),rub=original.projects[0];rub.id='rub-project';rub.locations[0].price=3210;
 const foreign=structuredClone(rub);foreign.id='foreign-project';foreign.currency='AED';foreign.locations[0].price=80;
 original.projects.push(foreign);original.activeProjectId=foreign.id;
 const raw=JSON.stringify(original,null,2),{values}=mockStore(t,{'crowdly.workspace.v1':raw});
 const loaded=workspaceRepository.load();
 assert.equal(loaded.error,'foreign_currency');assert.ok(loaded.warning);
 assert.equal(loaded.recoveryText,raw);assert.equal(loaded.foreignRecordCount,1);
 assert.deepEqual(loaded.data.projects,[rub]);assert.equal(loaded.data.activeProjectId,rub.id);
 assert.equal(loaded.data.projects[0].locations[0].price,3210);
 assert.equal(JSON.parse(loaded.recoveryText).projects[1].locations[0].price,80);
 assert.equal(JSON.parse(loaded.recoveryText).projects[1].currency,'AED');
 assert.throws(()=>workspaceRepository.save(original),error=>error.code==='unsupported_currency');
 assert.equal(values.get('crowdly.workspace.v1'),raw);
});
test('all-foreign legacy workspace offers only a RUB demo while preserving the original',t=>{
 const original=createSeed();original.projects[0].currency='USD';original.projects[0].locations[0].price=15;
 const raw=JSON.stringify(original),{values}=mockStore(t,{'crowdly.workspace.v1':raw});
 const loaded=workspaceRepository.load();
 assert.equal(loaded.error,'foreign_currency');assert.equal(loaded.recoveryText,raw);
 assert.ok(loaded.data.projects.every(project=>project.currency==='RUB'&&project.demo));
 assert.equal(values.get('crowdly.workspace.v1'),raw);
 assert.equal(JSON.parse(loaded.recoveryText).projects[0].locations[0].price,15);
});
