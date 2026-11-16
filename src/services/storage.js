import {createSeed} from '../data/seed.js';
import {validateWorkspace} from '../domain/validation.js';
const KEY='crowdly.workspace.v1';
export const repository = {
 load(){
  let raw;
  try{raw=localStorage.getItem(KEY);}catch{return {data:createSeed(),warning:'Хранилище браузера недоступно. Изменения можно сохранить в резервную копию.',error:'unavailable'};}
  if(raw===null)return {data:createSeed(),warning:null};
  try{
   const original=JSON.parse(raw);
   if(!original||original.version!==1||!Array.isArray(original.projects)||!original.projects.length||original.projects.length>50)throw new Error('Invalid workspace');
   if(original.projects.some(p=>!p||typeof p!=='object'||typeof p.currency!=='string'))throw new Error('Invalid project currency');
   const foreign=original.projects.filter(p=>p.currency!=='RUB');
   if(foreign.length){
    const rubProjects=original.projects.filter(p=>p.currency==='RUB');
    const data=rubProjects.length?{...original,projects:rubProjects,activeProjectId:rubProjects.some(p=>p.id===original.activeProjectId)?original.activeProjectId:rubProjects[0].id}:createSeed();
    validateWorkspace(data);
    return {data,warning:'В исходной копии есть проекты в другой валюте. Они не пересчитаны и не изменены. Сохраните исходную копию перед переходом к расчётам в рублях.',error:'foreign_currency',recoveryText:raw,foreignCurrencies:[...new Set(foreign.map(p=>p.currency))],foreignRecordCount:foreign.length};
   }
   validateWorkspace(original);return {data:original,warning:null};
  }catch{return {data:createSeed(),warning:'Сохранённые данные не удалось прочитать. Исходная копия сохранена без изменений.',error:'recover',recoveryText:raw};}
 },
 save(data){validateWorkspace(data);localStorage.setItem(KEY,JSON.stringify(data));},
};
export function downloadFile(name,content,type='text/plain;charset=utf-8') {
 const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
