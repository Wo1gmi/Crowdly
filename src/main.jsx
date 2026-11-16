import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
class ErrorBoundary extends React.Component {
 state={error:null};static getDerivedStateFromError(error){return {error};}
 render(){if(this.state.error)return <div style={{padding:48,fontFamily:'sans-serif'}}><h1>Не удалось открыть рабочее пространство</h1><p>Сохранённые данные остаются в браузере. Попробуйте перезагрузить страницу.</p><button onClick={()=>location.reload()}>Перезагрузить</button><details><summary>Техническая информация</summary><pre>{this.state.error.message}</pre></details></div>;return this.props.children;}
}
createRoot(document.getElementById('root')).render(<ErrorBoundary><App/></ErrorBoundary>);
