(function(){
const api={id:'host',init(ERP){this.ERP=ERP;const h=ERP.state.settings.host||{};ERP.state.host={mode:h.mode||'single',isHost:h.isHost!==false,name:h.name||'Store Office Host',deviceId:localStorage.getItem('erp_device_id')||crypto.randomUUID(),lastSeen:new Date().toISOString()};localStorage.setItem('erp_device_id',ERP.state.host.deviceId);localStorage.setItem('erp_device_name',ERP.state.host.name);ERP.emit('host:ready',ERP.state.host)},setHost(v){const s=ERPSettings.getDraft();s.host={...(s.host||{}),...v};ERPSettings.saveDraft(s);return s.host}};
window.ERP.registerModule(api);window.ERPHost=api;
})();
