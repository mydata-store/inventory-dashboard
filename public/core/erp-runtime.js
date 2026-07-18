(function(){
'use strict';
const ERP={version:'41.3.0',modules:new Map(),pages:new Map(),state:{online:navigator.onLine,booted:false,settings:{}},events:new EventTarget()};
ERP.on=(n,f)=>ERP.events.addEventListener(n,e=>f(e.detail)); ERP.emit=(n,d)=>ERP.events.dispatchEvent(new CustomEvent(n,{detail:d}));
ERP.registerModule=m=>{if(!m||!m.id)throw new Error('ERP module id required');ERP.modules.set(m.id,m);return m};
ERP.registerPage=p=>{const x={id:document.body?.dataset.erpPage||location.pathname.split('/').pop()||'unknown',features:['settings','theme','shell','profile','offline','backup'],...p};ERP.pages.set(x.id,x);ERP.state.page=x;return x};
ERP.safe=async(label,fn)=>{try{return await fn()}catch(e){console.error('[ERP]',label,e);ERP.Diagnostics?.log('error',label,e.message);return null}};
ERP.boot=async()=>{if(ERP.state.booted)return ERP;ERP.state.booted=true;document.documentElement.dataset.erpBoot='starting';
 for(const id of ['settings','registry','offline','backup','host','theme','profile','shell']){const m=ERP.modules.get(id);if(m?.init)await ERP.safe(id,()=>m.init(ERP));}
 document.documentElement.dataset.erpBoot='ready';ERP.emit('ready',ERP.state);return ERP};
window.ERP=ERP;document.addEventListener('DOMContentLoaded',()=>ERP.boot());
})();
