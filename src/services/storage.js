import {createSeed} from '../data/seed.js';
import {validateWorkspace} from '../domain/validation.js';
const KEY='crowdly.workspace.v1';
export const repository = {
 load(){try{const raw=localStorage.getItem(KEY);if(!raw)return {data:createSeed(),warning:null};const data=JSON.parse(raw);validateWorkspace(data);return {data,warning:null};}catch{return {data:createSeed(),warning:'Сохранённые данные не удалось прочитать. Загружен пример; исходная копия остаётся в браузере до следующего сохранения.'};}},
 save(data){validateWorkspace(data);localStorage.setItem(KEY,JSON.stringify(data));},
};
export function downloadFile(name,content,type='text/plain;charset=utf-8') {
 const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
