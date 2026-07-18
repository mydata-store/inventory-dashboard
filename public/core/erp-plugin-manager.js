(function(){
const KEY='erp_plugins_v1';
const defaults={
 'offline-engine':{id:'offline-engine',name:'Offline Engine',version:'1.0.0',enabled:true,status:'installed',core:true},
 'excel-backup':{id:'excel-backup',name:'Excel Backup',version:'1.0.0',enabled:true,status:'installed',core:true},
 'diagnostics':{id:'diagnostics',name:'Diagnostics',version:'1.0.0',enabled:true,status:'installed',core:true},
 'barcode':{id:'barcode',name:'Barcode',version:'0.0.0',enabled:false,status:'available'},
 'qr-code':{id:'qr-code',name:'QR Code',version:'0.0.0',enabled:false,status:'available'},
 'approval-workflow':{id:'approval-workflow',name:'Approval Workflow',version:'0.0.0',enabled:false,status:'available'},
 'email':{id:'email',name:'Email Notifications',version:'0.0.0',enabled:false,status:'available'},
 'whatsapp':{id:'whatsapp',name:'WhatsApp Notifications',version:'0.0.0',enabled:false,status:'available'},
 'ai-assistant':{id:'ai-assistant',name:'AI Assistant',version:'0.0.0',enabled:false,status:'available'},
 'accounting':{id:'accounting',name:'Accounting',version:'0.0.0',enabled:false,status:'available'},
 'production':{id:'production',name:'Production',version:'0.0.0',enabled:false,status:'available'},
 'maintenance':{id:'maintenance',name:'Maintenance',version:'0.0.0',enabled:false,status:'available'}
};
function read(){let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{};return {...defaults,...saved}}
function write(v){localStorage.setItem(KEY,JSON.stringify(v));return v}
const api={id:'plugin-manager',init(ERP){this.ERP=ERP;ERP.state.plugins=read();},all(){return read()},setEnabled(id,enabled){const p=read();if(!p[id])throw Error('Plugin not found: '+id);if(p[id].core&&!enabled)throw Error('Core plugins cannot be disabled.');p[id]={...p[id],enabled:!!enabled,updatedAt:new Date().toISOString()};write(p);this.ERP.state.plugins=p;this.ERP.emit('plugins:changed',p[id]);return p[id]},register(plugin){if(!plugin?.id)throw Error('Plugin id required');const p=read();p[plugin.id]={...p[plugin.id],...plugin,updatedAt:new Date().toISOString()};write(p);this.ERP.state.plugins=p;return p[plugin.id]}};
window.ERP.registerModule(api);window.ERPPlugins=api;
})();
