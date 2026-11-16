import React from 'react';
const COLORS={low:'#9aa4b5',base:'#3643b8',high:'#76a443'};
export function CashChart({scenarios,currency,language}){
  const en=language==='en',w=700,h=250,p={l:65,r:18,t:18,b:34};
  const all=scenarios.flatMap(s=>[-s.finance.invested,...s.months.map(m=>m.cumulative)]);
  const max=Math.max(1,...all),min=Math.min(0,...all),spread=max-min;
  const x=n=>p.l+n/scenarios[0].months.length*(w-p.l-p.r),y=v=>p.t+(max-v)/spread*(h-p.t-p.b);
  const number=v=>new Intl.NumberFormat(en?'en':'ru',{notation:'compact',maximumFractionDigits:1}).format(v);
  const names=en?{low:'Downside',base:'Base case',high:'Upside'}:{low:'Сдержанный',base:'Базовый',high:'Рост'};
  return <div className="cp-chart"><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={en?'Cumulative cash after opening investment, across three planning scenarios':'Накопленный денежный поток с учётом вложений по трём сценариям'}>
    {[0,.25,.5,.75,1].map(t=>{const v=min+spread*t;return <g key={t}><line x1={p.l} x2={w-p.r} y1={y(v)} y2={y(v)} stroke="#e8ebf1"/><text x={p.l-12} y={y(v)+4} textAnchor="end" fontSize="10" fill="#727c8c">{number(v)}</text></g>;})}
    <line x1={p.l} x2={w-p.r} y1={y(0)} y2={y(0)} stroke="#a9b2c1" strokeDasharray="4 4"/>
    {scenarios.map(s=><path key={s.id} d={[-s.finance.invested,...s.months.map(m=>m.cumulative)].map((v,i)=>`${i?'L':'M'} ${x(i)} ${y(v)}`).join(' ')} fill="none" stroke={COLORS[s.id]} strokeWidth={s.id==='base'?3:2} strokeLinecap="round"/>)}
    {[0,12,24,36,48,60,84,120].filter(n=>n<=scenarios[0].months.length).map(n=><text key={n} x={x(n)} y={h-10} textAnchor="middle" fontSize="10" fill="#727c8c">{n}</text>)}
  </svg><div className="cp-chart-legend">{scenarios.map(s=><span key={s.id}><i style={{background:COLORS[s.id]}}/>{names[s.id]}</span>)}<small>{currency} · {en?'months':'месяцы'}</small></div></div>;
}
export function Waterfall({scenario,format,language}){
  const en=language==='en',s=scenario.steadyState;
  const rows=[[en?'Revenue':'Выручка',s.revenue,'#b7ed70'],[en?'Variable costs':'Переменные затраты',s.variableCosts,'#bac2d5'],[en?'Rent':'Аренда',s.rent,'#b3b8ee'],[en?'Other fixed costs':'Остальные затраты',s.otherFixedCosts,'#939fc0'],[en?'Operating result':'Операционный результат',s.operatingProfit,s.operatingProfit>=0?'#3643b8':'#c55c4f']];
  const max=Math.max(...rows.map(r=>Math.abs(r[1])),1);
  return <div className="cp-waterfall">{rows.map(([label,value,color])=><div key={label} className="cp-water-row"><div><span>{label}</span><strong>{format(value)}</strong></div><div className="cp-track"><i style={{width:`${Math.max(.5,Math.abs(value)/max*100)}%`,background:color}}/></div></div>)}</div>;
}
