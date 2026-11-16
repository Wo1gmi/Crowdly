import {validatePlannerInput} from '../domain/planner.js';
import {PLANNER_FIELDS} from '../data/plannerPresets.js';
const KEY='crowdly.planner.v2';
const MAX_BYTES=1000000;
const INPUT_KEYS=['country','currency','format','name','city',...PLANNER_FIELDS];
const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
export function cleanPlanInput(raw){
  if(!isRecord(raw))throw new Error('Invalid project');
  const input=Object.fromEntries(INPUT_KEYS.filter(k=>Object.hasOwn(raw,k)).map(k=>[k,raw[k]]));
  return validatePlannerInput(input);
}
function decodeBackup(text,separateForeign=false){
  if(typeof text!=='string'||text.length>MAX_BYTES||new TextEncoder().encode(text).length>MAX_BYTES)throw new Error('File exceeds 1 MB');
  const raw=JSON.parse(text);
  if(!isRecord(raw)||raw.kind!=='crowdly-planner'||raw.version!==2||!Array.isArray(raw.saved)||raw.saved.length>30)throw new Error('Unsupported Crowdly file');
  const foreignCurrencies=new Set();let foreignRecordCount=0;
  const readInput=input=>{
    if(separateForeign&&isRecord(input)&&typeof input.currency==='string'&&input.currency!=='RUB'){
      foreignCurrencies.add(input.currency);foreignRecordCount++;return null;
    }
    return cleanPlanInput(input);
  };
  const current=raw.current==null?null:readInput(raw.current);
  const ids=new Set();
  const saved=raw.saved.map(p=>{
    if(!isRecord(p)||typeof p.id!=='string'||!p.id.trim()||p.id.length>100)throw new Error('Invalid saved project ID');
    if(ids.has(p.id))throw new Error('Duplicate project IDs');ids.add(p.id);
    const savedAt=p.savedAt??'';
    if(typeof savedAt!=='string'||savedAt.length>64||(savedAt&&!Number.isFinite(Date.parse(savedAt))))throw new Error('Invalid saved date');
    const input=readInput(p.input);
    return input?{id:p.id,input,savedAt,provenance:cleanProvenance(p.provenance)}:null;
  }).filter(Boolean);
  // Foreign entries only disappear from the usable view. The exact original is returned by load().
  return {data:{kind:'crowdly-planner',version:2,current,provenance:raw.current!=null&&current===null?{}:cleanProvenance(raw.provenance),saved},foreignCurrencies:[...foreignCurrencies],foreignRecordCount};
}
/** User imports and all writes accept RUB only. No field is relabelled or converted. */
export function parsePlannerBackup(text){return decodeBackup(text).data;}
function cleanProvenance(p){return isRecord(p)?Object.fromEntries(Object.entries(p).filter(([k,v])=>INPUT_KEYS.includes(k)&&['user','example','csv'].includes(v))):{};}
export const plannerRepository={
 load(){
   let raw;
   try{raw=localStorage.getItem(KEY);}catch{return {data:null,error:'unavailable'};}
   if(raw===null)return {data:null,error:null};
   try{
     const decoded=decodeBackup(raw,true);
     if(decoded.foreignRecordCount)return {...decoded,error:'foreign_currency',recoveryText:raw};
     return {data:decoded.data,error:null};
   }catch{return {data:null,error:'recover',recoveryText:raw};}
 },
 save(data){const safe=parsePlannerBackup(JSON.stringify({kind:'crowdly-planner',version:2,...data}));localStorage.setItem(KEY,JSON.stringify(safe));return safe;},
};
export function getLanguage(){try{return localStorage.getItem('crowdly.language')==='en'?'en':'ru';}catch{return 'ru';}}
export function saveLanguage(lang){try{localStorage.setItem('crowdly.language',lang);}catch{/* Language still works in memory. */}}
