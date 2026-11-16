import React,{useEffect,useState} from 'react';
import Landing from './pages/Landing.jsx';
import Planner from './pages/Planner.jsx';
import WorkspaceApp from './WorkspaceApp.jsx';
import {getLanguage,saveLanguage} from './services/plannerStorage.js';
const ADVANCED=['dashboard','projects','locations','simulator','compare','tenants','data','finance','reports','settings','methodology'];
function readRoute(){const hash=window.location.hash.slice(1);return ['start','planner','demo',...ADVANCED].includes(hash)?hash:'home';}
export default function App(){
 const [route,setRoute]=useState(readRoute),[language,setLanguage]=useState(getLanguage);
 useEffect(()=>{const fn=()=>setRoute(readRoute());window.addEventListener('hashchange',fn);return()=>window.removeEventListener('hashchange',fn);},[]);
 useEffect(()=>{document.documentElement.lang=language;document.title=language==='en'?'Crowdly — New location economics':'Crowdly — экономика новой точки';saveLanguage(language);},[language]);
 function navigate(next){setRoute(next);window.location.hash=next==='home'?'':next;window.scrollTo({top:0,behavior:'instant'});}
 if(ADVANCED.includes(route))return <><div className="cp-workspace-bridge no-print"><span>{language==='en'?'Advanced assumption-based network model · Russian interface':'Расширенная модель сети на заданных допущениях'}</span><button onClick={()=>navigate('planner')}>{language==='en'?'Back to business planner':'К простому расчёту'}</button><button onClick={()=>navigate('home')}>{language==='en'?'Home':'На главную'}</button></div><WorkspaceApp/></>;
 if(route==='home')return <Landing language={language} onLanguageChange={setLanguage} onStart={()=>navigate('start')} onDemo={()=>navigate('demo')} onWorkspace={()=>navigate('dashboard')} onResume={()=>navigate('planner')}/>;
 return <Planner key={route} language={language} onLanguageChange={setLanguage} onHome={()=>navigate('home')} onAdvanced={()=>navigate('dashboard')} initialMode={route==='start'?'new':route==='demo'?'demo':'resume'}/>;
}
