/** Quoted RFC-style CSV, comma or semicolon, BOM and CRLF support. */
export function parseCSV(text){
 text=text.replace(/^\uFEFF/,'');const delimiter=text.split('\n')[0].includes(';')?';':',';
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===delimiter&&!quoted){row.push(cell.trim());cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell.trim());if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)throw new Error('В CSV не закрыта кавычка');row.push(cell.trim());if(row.some(Boolean))rows.push(row);
 if(rows.length<2)throw new Error('Нужны заголовок и хотя бы одна строка данных');
 const headers=rows.shift();if(new Set(headers).size!==headers.length)throw new Error('Повтор заголовка CSV');
 return rows.map((r,i)=>{if(r.length!==headers.length)throw new Error(`Строка ${i+2}: число столбцов не совпадает`);return Object.fromEntries(headers.map((h,k)=>[h,r[k]]));});
}
export function toCSV(rows){if(!rows.length)return '';const headers=Object.keys(rows[0]);const esc=v=>{let value=String(v??'');if(typeof v==='string'&&/^[\s]*[-=+@]/.test(value))value="'"+value;return '"'+value.replaceAll('"','""')+'"';};return '\uFEFF'+[headers,...rows.map(r=>headers.map(h=>r[h]))].map(r=>r.map(esc).join(';')).join('\r\n');}
export function historyFromCSV(text,project){return parseCSV(text).map((r,i)=>{for(const h of ['date','locationId','visits','revenue'])if(!(h in r))throw new Error(`Не найден столбец ${h}`);if(!project.locations.some(l=>l.id===r.locationId))throw new Error(`Строка ${i+2}: объект ${r.locationId} не найден`);return {date:r.date,locationId:r.locationId,visits:r.visits===''?NaN:Number(r.visits.replace(',','.')),revenue:r.revenue===''?NaN:Number(r.revenue.replace(',','.'))};});}
