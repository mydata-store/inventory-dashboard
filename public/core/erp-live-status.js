(function(){
  function fmtBytes(bytes){
    if(bytes===null||bytes===undefined) return "Not available";
    const units=["B","KB","MB","GB"];
    let value=Number(bytes),index=0;
    while(value>=1024&&index<units.length-1){value/=1024;index++}
    return `${value.toFixed(index?1:0)} ${units[index]}`;
  }
  function info(){
    return window.ERPPlatform?.getRuntimeInfo?.()||{
      version:"41.5.0",build:"2026.07.18",online:navigator.onLine
    };
  }
  function set(ids,value){
    ids.forEach(id=>{
      const element=document.getElementById(id)||
        document.querySelector(`[data-erp-live="${id}"]`);
      if(element) element.textContent=value;
    });
  }
  function apply(){
    const data=info();
    set(["erpCoreVersion","runtimeVersion","coreVersion","frameworkVersion"],data.version);
    set(["erpBuild","buildVersion","buildNumber"],data.build);
    set(["registeredPages","pageCount"],String(data.registeredPages??0));
    set(["connectedPages"],String(data.connectedPages??0));
    set(["enabledPlugins","pluginCount"],String(data.enabledPlugins??0));
    set(["browserStatus"],navigator.userAgent);
    set(["internetStatus"],navigator.onLine?"Online":"Offline");
    set(["serviceWorkerStatus"],data.serviceWorker?"Supported":"Not supported");
    set(["indexedDbStatus"],data.indexedDB?"Available":"Not available");
    set(["localStorageStatus"],data.localStorage?"Available":"Not available");
    set(["runtimeLoadTime"],`${data.loadMs??0} ms`);
    set(["runtimeMemory"],data.memory?fmtBytes(data.memory.used):"Browser does not expose memory");
    document.querySelectorAll("[data-runtime-version]").forEach(el=>el.textContent=data.version);
  }
  window.ERPLiveStatus={apply,info,fmtBytes};
  window.addEventListener("erp:runtime-ready",apply);
  window.addEventListener("erp:settings-updated",apply);
  setTimeout(apply,500);
})();
