(function(){
const KEY='erp_plugins_v2';
const defaults={
 'universal-shell':{id:'universal-shell',name:'Universal Shell',version:'1.3.0',enabled:true,status:'installed',core:true,category:'Core',description:'Shared sidebar and application shell'},
 'theme-engine':{id:'theme-engine',name:'Theme Engine',version:'1.2.0',enabled:true,status:'installed',core:true,category:'Core',description:'Global colors and visual styles'},
 'profile-engine':{id:'profile-engine',name:'Profile Engine',version:'1.2.0',enabled:true,status:'installed',core:true,category:'Core',description:'Active ERP profile and sidebar card'},
 'offline-engine':{id:'offline-engine',name:'Offline Engine',version:'1.1.0',enabled:true,status:'installed',core:true,category:'Core',description:'IndexedDB local-first storage'},
 'excel-backup':{id:'excel-backup',name:'Excel Backup',version:'1.1.0',enabled:true,status:'installed',core:true,category:'Core',description:'Computer-folder Excel and JSON backups'},
 'diagnostics':{id:'diagnostics',name:'Diagnostics',version:'1.1.0',enabled:true,status:'installed',core:true,category:'Core',description:'System health and error checks'},
 'barcode':{id:'barcode',name:'Barcode',version:'0.0.0',enabled:false,status:'available',category:'Business'},
 'qr-code':{id:'qr-code',name:'QR Code',version:'0.0.0',enabled:false,status:'available',category:'Business'},
 'approval-workflow':{id:'approval-workflow',name:'Approval Workflow',version:'0.0.0',enabled:false,status:'available',category:'Business'},
 'email':{id:'email',name:'Email Notifications',version:'0.0.0',enabled:false,status:'available',category:'Communication'},
 'whatsapp':{id:'whatsapp',name:'WhatsApp Notifications',version:'0.0.0',enabled:false,status:'available',category:'Communication'},
 'ai-assistant':{id:'ai-assistant',name:'AI Assistant',version:'0.0.0',enabled:false,status:'available',category:'Intelligence'},
 'accounting':{id:'accounting',name:'Accounting',version:'0.0.0',enabled:false,status:'available',category:'Enterprise'},
 'hr-payroll':{id:'hr-payroll',name:'HR & Payroll',version:'0.0.0',enabled:false,status:'available',category:'Enterprise'},
 'production':{id:'production',name:'Production',version:'0.0.0',enabled:false,status:'available',category:'Future'},
 'maintenance':{id:'maintenance',name:'Maintenance',version:'0.0.0',enabled:false,status:'available',category:'Future'}
};
function read(){let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{};return Object.fromEntries(Object.entries(defaults).map(([k,v])=>[k,{...v,...(saved[k]||{})}]).concat(Object.entries(saved).filter(([k])=>!defaults[k])))}
function write(v){localStorage.setItem(KEY,JSON.stringify(v));return v}
const api={id:'plugin-manager',init(ERP){this.ERP=ERP;ERP.state.plugins=read();},all(){return read()},setEnabled(id,enabled){const p=read();if(!p[id])throw Error('Plugin not found: '+id);if(p[id].core&&!enabled)throw Error('Core plugins cannot be disabled.');p[id]={...p[id],enabled:!!enabled,updatedAt:new Date().toISOString()};write(p);this.ERP.state.plugins=p;this.ERP.emit('plugins:changed',p[id]);return p[id]},register(plugin){if(!plugin?.id)throw Error('Plugin id required');const p=read();p[plugin.id]={category:'Future',...p[plugin.id],...plugin,updatedAt:new Date().toISOString()};write(p);this.ERP.state.plugins=p;return p[plugin.id]}};
window.ERP.registerModule(api);window.ERPPlugins=api;
})();