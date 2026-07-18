(function(){
const api={id:'framework-status',init(ERP){this.ERP=ERP},async snapshot(){const r=window.ERPRegistry?.all?.()||{};const p=window.ERPPlugins?.all?.()||{};let pending=0;try{pending=(await window.ERPOffline?.pending?.())?.length||0}catch{};return {version:this.ERP.version,online:navigator.onLine,host:this.ERP.state.host||{},published:this.ERP.state.settings||{},registeredPages:Object.keys(r.pages||{}),features:Object.values(p),pending,backupFolder:window.ERPBackup?.folderName?.()||'Not connected',serviceWorker:'serviceWorker'in navigator,storage:'indexedDB'in window}}};
window.ERP.registerModule(api);window.ERPFrameworkStatus=api;
})();
