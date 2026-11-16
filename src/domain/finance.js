/** Pure financial functions. Periodic flows begin at t=0; rates are annual. */
export function npv(flows, annualRate, periodsPerYear=12) {
 return flows.reduce((sum,flow,i)=>sum+flow/(1+annualRate)**(i/periodsPerYear),0);
}
/** One sign change from negative to positive: a unique IRR, including initial operating losses. */
export function irr(flows, periodsPerYear=12) {
 if (!(flows[0]<0) || !flows.some(x=>x>0)) return null;
 let positiveSeen=false;for(const flow of flows){if(flow>0)positiveSeen=true;else if(flow<0&&positiveSeen)return null;}
 let lo=-0.9999,hi=1;
 while(npv(flows,hi,periodsPerYear)>0 && hi<1e10) hi=hi*2+1;
 if(npv(flows,hi,periodsPerYear)>0) return null;
 for(let i=0;i<160;i++){const mid=(lo+hi)/2;if(npv(flows,mid,periodsPerYear)>0)lo=mid;else hi=mid;}
 return (lo+hi)/2;
}
export function payback(flows) {
 if (flows[0]>=0) return 0;
 let sum=flows[0];for(let i=1;i<flows.length;i++){const before=sum;sum+=flows[i];if(sum>=0)return i-1+(-before/flows[i]);} return null;
}
export function summarizeFinance(flows,discount) {
 const invested=-Math.min(flows[0],0),net=flows.reduce((s,x)=>s+x,0);
 return {npv:npv(flows,discount/100),irr:irr(flows),payback:payback(flows),roi:invested>0?net/invested:null,netCash:net,invested};
}
