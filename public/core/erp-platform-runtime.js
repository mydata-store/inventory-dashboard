(function(){
"use strict";

const VERSION="41.5.0";
const BUILD="2026.07.18";
const KEYS={
  published:"erp_design_published",
  draft:"erp_design_draft",
  plugins:"erp_plugins",
  modules:"erp_module_registry",
  notifications:"erp_notifications",
  activity:"erp_activity_log",
  recentSearches:"erp_recent_searches",
  favorites:"erp_favorite_pages",
  runtimeErrors:"erp_runtime_errors"
};

const parse=(key,fallback)=>{
  try{
    const value=localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  }catch(error){
    return fallback;
  }
};
const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const escapeHtml=value=>String(value??"")
  .replaceAll("&","&amp;").replaceAll("<","&lt;")
  .replaceAll(">","&gt;").replaceAll('"',"&quot;")
  .replaceAll("'","&#039;");

const ERPPlatform={
  version:VERSION,
  build:BUILD,
  startedAt:performance.now(),
  state:{
    settings:{},
    plugins:{},
    modules:{},
    notifications:[],
    activity:[],
    recentSearches:[],
    favorites:[]
  },

  init(){
    this.loadState();
    this.applySettings();
    this.registerCurrentPage();
    this.loadEnabledPlugins();
    this.mountGlobalSearch();
    this.mountNotificationCenter();
    this.mountRuntimeToolbar();
    this.installActionTracking();
    this.bindCrossTabSync();
    this.bindNetworkEvents();
    this.installErrorBoundary();
    this.log("runtime.ready",{
      version:VERSION,
      build:BUILD,
      loadMs:Math.round(performance.now()-this.startedAt),
      page:document.body.dataset.erpPage||location.pathname
    },"success");
    window.dispatchEvent(new CustomEvent("erp:runtime-ready",{detail:this.getRuntimeInfo()}));
  },

  loadState(){
    this.state.settings=parse(KEYS.published,parse(KEYS.draft,{}))||{};
    this.state.plugins=parse(KEYS.plugins,{})||{};
    this.state.modules=parse(KEYS.modules,{})||{};
    this.state.notifications=parse(KEYS.notifications,[])||[];
    this.state.activity=parse(KEYS.activity,[])||[];
    this.state.recentSearches=parse(KEYS.recentSearches,[])||[];
    this.state.favorites=parse(KEYS.favorites,[])||[];
  },

  getRuntimeInfo(){
    const enabledPlugins=Object.values(this.state.plugins).filter(p=>p&&p.enabled===true).length;
    const connectedPages=Object.values(this.state.modules).filter(m=>m&&m.status==="connected").length;
    return {
      version:VERSION,
      build:BUILD,
      browser:navigator.userAgent,
      online:navigator.onLine,
      loadMs:Math.round(performance.now()-this.startedAt),
      registeredPages:Object.keys(this.state.modules).length,
      connectedPages,
      enabledPlugins,
      serviceWorker:"serviceWorker" in navigator,
      indexedDB:"indexedDB" in window,
      localStorage:this.testLocalStorage(),
      memory:performance.memory ? {
        used:performance.memory.usedJSHeapSize,
        total:performance.memory.totalJSHeapSize,
        limit:performance.memory.jsHeapSizeLimit
      } : null
    };
  },

  testLocalStorage(){
    try{
      const key="__erp_test__";
      localStorage.setItem(key,"1");
      localStorage.removeItem(key);
      return true;
    }catch(error){
      return false;
    }
  },

  applySettings(){
    const settings=this.state.settings||{};
    const theme=settings.theme||settings.themeSettings||{};
    const fonts=settings.fonts||settings.fontSettings||{};
    const shell=settings.shell||settings.shellSettings||{};
    const profile=settings.profile||settings.activeProfile||{};

    const root=document.documentElement;
    const variables={
      "--erp-primary":theme.primary,
      "--erp-secondary":theme.secondary,
      "--erp-accent":theme.accent,
      "--erp-bg":theme.background,
      "--erp-surface":theme.surface,
      "--erp-text":theme.text,
      "--erp-font-family":fonts.family||fonts.fontFamily
    };
    Object.entries(variables).forEach(([key,value])=>{
      if(value) root.style.setProperty(key,value);
    });
    if(fonts.baseSize) root.style.setProperty("--erp-font-size",`${fonts.baseSize}px`);
    if(shell.sidebarWidth) root.style.setProperty("--erp-sidebar-width",`${shell.sidebarWidth}px`);
    if(shell.collapsedWidth) root.style.setProperty("--erp-sidebar-collapsed-width",`${shell.collapsedWidth}px`);

    document.body.classList.toggle("erp-dark",theme.mode==="dark");
    document.body.classList.toggle("erp-shell-autohide",shell.autoHide===true||shell.autoHide==="yes");
    document.body.classList.toggle("erp-shell-fixed",shell.autoHide===false||shell.autoHide==="no");

    this.applyProfile(profile);
  },

  applyProfile(profile){
    if(!profile||typeof profile!=="object") return;
    const setText=(selectors,value)=>{
      if(!value) return;
      selectors.forEach(selector=>{
        document.querySelectorAll(selector).forEach(element=>element.textContent=value);
      });
    };
    setText(["[data-erp-profile-name]",".profile-name","#profileName"],profile.name||profile.fullName);
    setText(["[data-erp-profile-designation]",".profile-role","#profileRole"],profile.designation||profile.role);
    setText(["[data-erp-profile-department]",".profile-department","#profileDepartment"],profile.department);

    const image=profile.image||profile.photo||profile.picture;
    if(image){
      ["[data-erp-profile-image]",".profile-avatar img","#profileImage"].forEach(selector=>{
        document.querySelectorAll(selector).forEach(element=>{
          if(element.tagName==="IMG") element.src=image;
          else element.style.backgroundImage=`url("${image}")`;
        });
      });
    }
  },

  registerCurrentPage(){
    const id=document.body.dataset.erpPage||
      location.pathname.split("/").pop().replace(/\.html?$/i,"")||
      "index";
    const record={
      id,
      title:document.title||id,
      module:document.body.dataset.erpModule||"framework",
      url:location.pathname.split("/").pop()||"index.html",
      status:"connected",
      version:VERSION,
      lastSeen:new Date().toISOString()
    };
    this.state.modules[id]={...(this.state.modules[id]||{}),...record};
    save(KEYS.modules,this.state.modules);
  },

  registerModule(module){
    if(!module||!module.id) return;
    this.state.modules[module.id]={
      ...(this.state.modules[module.id]||{}),
      ...module,
      lastUpdated:new Date().toISOString()
    };
    save(KEYS.modules,this.state.modules);
    this.log("module.registered",{id:module.id},"success");
  },

  loadEnabledPlugins(){
    Object.entries(this.state.plugins).forEach(([id,plugin])=>{
      if(!plugin||plugin.enabled!==true) return;
      try{
        if(window.ERPPlugins&&typeof window.ERPPlugins[id]==="function"){
          window.ERPPlugins[id](this);
        }
        this.log("plugin.loaded",{id},"success");
      }catch(error){
        this.notify("Plugin error",`${id}: ${error.message}`,"error");
        this.log("plugin.failed",{id,error:error.message},"error");
      }
    });
  },

  notify(title,message,type="info"){
    const item={
      id:`n_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      title,
      message,
      type,
      createdAt:new Date().toISOString(),
      read:false
    };
    this.state.notifications.unshift(item);
    this.state.notifications=this.state.notifications.slice(0,500);
    save(KEYS.notifications,this.state.notifications);
    this.renderNotifications();
    window.dispatchEvent(new CustomEvent("erp:notification",{detail:item}));
    return item;
  },

  markAllNotificationsRead(){
    this.state.notifications=this.state.notifications.map(item=>({...item,read:true}));
    save(KEYS.notifications,this.state.notifications);
    this.renderNotifications();
  },

  clearNotifications(){
    this.state.notifications=[];
    save(KEYS.notifications,[]);
    this.renderNotifications();
  },

  log(action,detail={},status="success"){
    const profile=(this.state.settings&&(this.state.settings.profile||this.state.settings.activeProfile))||{};
    const row={
      id:`a_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      action,
      detail,
      status,
      page:document.body.dataset.erpPage||location.pathname,
      module:document.body.dataset.erpModule||"framework",
      user:profile.name||profile.fullName||"Muhammad Waqas",
      createdAt:new Date().toISOString()
    };
    this.state.activity.unshift(row);
    this.state.activity=this.state.activity.slice(0,2000);
    save(KEYS.activity,this.state.activity);
    window.dispatchEvent(new CustomEvent("erp:activity",{detail:row}));
    return row;
  },

  getSearchRecords(){
    const records=Object.values(this.state.modules||{}).map(module=>({
      type:"Page",
      title:module.title||module.id,
      subtitle:`${module.module||"ERP"} · ${module.status||"registered"}`,
      url:module.url||`${module.id}.html`,
      id:module.id,
      keywords:JSON.stringify(module)
    }));

    const masterSources=[
      ["erp_items","Item"],["items","Item"],
      ["erp_suppliers","Supplier"],["suppliers","Supplier"],
      ["erp_departments","Department"],["departments","Department"],
      ["erp_workshops","Workshop"],["workshops","Workshop"],
      ["erp_units","Unit"],["erp_categories","Category"],
      ["erp_racks","Rack"],["erp_vehicles","Vehicle"],
      ["erp_carriers","Carrier"],["erp_employees","Employee"]
    ];
    const seen=new Set();

    masterSources.forEach(([key,type])=>{
      const rows=parse(key,[]);
      if(!Array.isArray(rows)) return;
      rows.forEach((row,index)=>{
        const title=row.name||row.item_name||row.supplier_name||
          row.department_name||row.workshop_name||row.code||`${type} ${index+1}`;
        const unique=`${type}:${title}`;
        if(seen.has(unique)) return;
        seen.add(unique);
        records.push({
          type,
          title,
          subtitle:row.size||row.unit||row.code||"",
          url:row.url||"",
          id:unique,
          keywords:JSON.stringify(row)
        });
      });
    });
    return records;
  },

  mountGlobalSearch(){
    if(document.getElementById("erpGlobalSearchButton")) return;

    const button=document.createElement("button");
    button.id="erpGlobalSearchButton";
    button.className="erp-floating-action erp-search-launcher";
    button.type="button";
    button.title="Global Search (Alt + K)";
    button.innerHTML='<span aria-hidden="true">⌕</span><span class="erp-shortcut-label">Alt+K</span>';
    document.body.appendChild(button);

    const overlay=document.createElement("div");
    overlay.id="erpGlobalSearchOverlay";
    overlay.className="erp-overlay";
    overlay.innerHTML=`
      <div class="erp-command-palette">
        <div class="erp-command-head">
          <input id="erpGlobalSearchInput" type="search"
            placeholder="Search pages, controllers, masters, plugins and reports..."
            autocomplete="off">
          <button type="button" data-close-search aria-label="Close">×</button>
        </div>
        <div class="erp-command-tools">
          <span>Global ERP Search</span>
          <kbd>Alt</kbd><span>+</span><kbd>K</kbd>
        </div>
        <div id="erpRecentSearches" class="erp-recent-searches"></div>
        <div id="erpGlobalSearchResults" class="erp-command-results"></div>
      </div>`;
    document.body.appendChild(overlay);

    const input=overlay.querySelector("#erpGlobalSearchInput");
    button.addEventListener("click",()=>this.openGlobalSearch());
    overlay.addEventListener("click",event=>{
      if(event.target===overlay||event.target.closest("[data-close-search]")) this.closeGlobalSearch();
    });
    input.addEventListener("input",()=>this.renderGlobalSearch(input.value));
    input.addEventListener("keydown",event=>{
      if(event.key==="Enter"){
        const first=overlay.querySelector(".erp-search-result");
        if(first) first.click();
      }
    });

    document.addEventListener("keydown",event=>{
      if(event.altKey&&event.key.toLowerCase()==="k"){
        event.preventDefault();
        this.openGlobalSearch();
      }
      if(event.key==="Escape") this.closeGlobalSearch();
    });
  },

  openGlobalSearch(){
    const overlay=document.getElementById("erpGlobalSearchOverlay");
    const input=document.getElementById("erpGlobalSearchInput");
    if(!overlay||!input) return;
    overlay.classList.add("open");
    input.value="";
    this.renderRecentSearches();
    this.renderGlobalSearch("");
    setTimeout(()=>input.focus(),50);
  },

  closeGlobalSearch(){
    document.getElementById("erpGlobalSearchOverlay")?.classList.remove("open");
  },

  renderRecentSearches(){
    const box=document.getElementById("erpRecentSearches");
    if(!box) return;
    const recent=this.state.recentSearches.slice(0,6);
    box.innerHTML=recent.length
      ? `<strong>Recent:</strong>${recent.map(term=>`<button type="button" data-recent="${escapeHtml(term)}">${escapeHtml(term)}</button>`).join("")}`
      : "";
    box.querySelectorAll("[data-recent]").forEach(button=>{
      button.addEventListener("click",()=>{
        const input=document.getElementById("erpGlobalSearchInput");
        input.value=button.dataset.recent;
        this.renderGlobalSearch(input.value);
        input.focus();
      });
    });
  },

  rememberSearch(term){
    const value=String(term||"").trim();
    if(!value) return;
    this.state.recentSearches=[value,...this.state.recentSearches.filter(item=>item!==value)].slice(0,10);
    save(KEYS.recentSearches,this.state.recentSearches);
  },

  toggleFavorite(record){
    const exists=this.state.favorites.some(item=>item.id===record.id);
    this.state.favorites=exists
      ? this.state.favorites.filter(item=>item.id!==record.id)
      : [record,...this.state.favorites].slice(0,30);
    save(KEYS.favorites,this.state.favorites);
    this.renderGlobalSearch(document.getElementById("erpGlobalSearchInput")?.value||"");
  },

  renderGlobalSearch(query){
    const box=document.getElementById("erpGlobalSearchResults");
    if(!box) return;
    const term=String(query||"").trim().toLowerCase();
    const favorites=this.state.favorites||[];
    let rows=this.getSearchRecords()
      .filter(record=>!term||`${record.title} ${record.subtitle} ${record.keywords}`.toLowerCase().includes(term))
      .slice(0,35);

    if(!term&&favorites.length){
      const favoriteIds=new Set(favorites.map(item=>item.id));
      rows=[
        ...favorites.map(item=>({...item,favorite:true})),
        ...rows.filter(item=>!favoriteIds.has(item.id))
      ];
    }

    box.innerHTML=rows.length
      ? rows.map(record=>{
          const favorite=this.state.favorites.some(item=>item.id===record.id);
          return `<div class="erp-search-row">
            <button class="erp-search-result" type="button"
              data-url="${escapeHtml(record.url||"")}"
              data-title="${escapeHtml(record.title)}">
              <span class="erp-result-type">${escapeHtml(record.type)}</span>
              <span class="erp-result-main">
                <strong>${escapeHtml(record.title)}</strong>
                <small>${escapeHtml(record.subtitle||"")}</small>
              </span>
            </button>
            <button class="erp-favorite-button" type="button"
              data-favorite-id="${escapeHtml(record.id)}"
              title="${favorite?"Remove favorite":"Add favorite"}">${favorite?"★":"☆"}</button>
          </div>`;
        }).join("")
      : '<div class="erp-empty-state">No matching ERP records found.</div>';

    box.querySelectorAll(".erp-search-result").forEach(button=>{
      button.addEventListener("click",()=>{
        this.rememberSearch(query||button.dataset.title);
        this.log("search.opened",{query:query||button.dataset.title,url:button.dataset.url},"success");
        if(button.dataset.url) location.href=button.dataset.url;
      });
    });
    box.querySelectorAll("[data-favorite-id]").forEach(button=>{
      button.addEventListener("click",()=>{
        const record=this.getSearchRecords().find(item=>item.id===button.dataset.favoriteId)||
          this.state.favorites.find(item=>item.id===button.dataset.favoriteId);
        if(record) this.toggleFavorite(record);
      });
    });
  },

  mountNotificationCenter(){
    if(document.getElementById("erpNotificationButton")) return;

    const button=document.createElement("button");
    button.id="erpNotificationButton";
    button.className="erp-floating-action erp-notification-launcher";
    button.type="button";
    button.title="Notifications";
    button.innerHTML='🔔<span id="erpNotificationCount"></span>';
    document.body.appendChild(button);

    const panel=document.createElement("aside");
    panel.id="erpNotificationPanel";
    panel.className="erp-side-panel";
    panel.innerHTML=`
      <div class="erp-panel-head">
        <strong>Notification Center</strong>
        <button type="button" data-close-panel>×</button>
      </div>
      <div class="erp-notification-tools">
        <input id="erpNotificationSearch" type="search" placeholder="Search notifications...">
        <button type="button" data-mark-read>Mark all read</button>
        <button type="button" data-clear-notifications>Clear all</button>
      </div>
      <div id="erpNotificationList" class="erp-panel-body"></div>`;
    document.body.appendChild(panel);

    button.addEventListener("click",()=>panel.classList.toggle("open"));
    panel.querySelector("[data-close-panel]").addEventListener("click",()=>panel.classList.remove("open"));
    panel.querySelector("[data-mark-read]").addEventListener("click",()=>this.markAllNotificationsRead());
    panel.querySelector("[data-clear-notifications]").addEventListener("click",()=>{
      if(confirm("Clear all ERP notifications?")) this.clearNotifications();
    });
    panel.querySelector("#erpNotificationSearch").addEventListener("input",()=>this.renderNotifications());
    this.renderNotifications();
  },

  renderNotifications(){
    const count=document.getElementById("erpNotificationCount");
    const list=document.getElementById("erpNotificationList");
    const search=document.getElementById("erpNotificationSearch");
    const term=(search?.value||"").toLowerCase();
    const unread=this.state.notifications.filter(item=>!item.read).length;

    if(count){
      count.textContent=unread?String(unread):"";
      count.style.display=unread?"inline-flex":"none";
    }
    if(!list) return;

    const rows=this.state.notifications.filter(item=>
      !term||`${item.title} ${item.message} ${item.type}`.toLowerCase().includes(term)
    );
    list.innerHTML=rows.length
      ? rows.slice(0,100).map(item=>`
        <article class="erp-notification erp-${escapeHtml(item.type)} ${item.read?"is-read":""}">
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.message)}</p>
          <small>${new Date(item.createdAt).toLocaleString()}</small>
        </article>`).join("")
      : '<div class="erp-empty-state">No matching notifications.</div>';
  },

  mountRuntimeToolbar(){
    const topbar=document.querySelector(".top-ribbon,.topbar,.app-topbar,.header-actions");
    if(!topbar||topbar.querySelector("[data-erp-top-search]")) return;
    const button=document.createElement("button");
    button.type="button";
    button.dataset.erpTopSearch="true";
    button.className="erp-top-search-button";
    button.innerHTML='⌕ <span>Search</span> <kbd>Alt+K</kbd>';
    button.addEventListener("click",()=>this.openGlobalSearch());
    topbar.appendChild(button);
  },

  installActionTracking(){
    document.addEventListener("click",event=>{
      const button=event.target.closest("button,a");
      if(!button) return;
      const text=(button.textContent||"").trim().toLowerCase();
      const actions=[
        ["publish","settings.published"],
        ["save","record.saved"],
        ["backup","backup.created"],
        ["restore","backup.restored"],
        ["enable","plugin.enabled"],
        ["disable","plugin.disabled"],
        ["finish","setup.completed"],
        ["delete","record.deleted"],
        ["export","data.exported"],
        ["import","data.imported"]
      ];
      const matched=actions.find(([word])=>text.includes(word));
      if(matched){
        this.log(matched[1],{
          label:(button.textContent||"").trim(),
          id:button.id||null
        },"success");
      }
    },true);
  },

  bindCrossTabSync(){
    window.addEventListener("storage",event=>{
      if([KEYS.published,KEYS.draft].includes(event.key)){
        this.state.settings=parse(KEYS.published,parse(KEYS.draft,{}))||{};
        this.applySettings();
        this.notify("Settings updated","New Design Studio settings were applied across the ERP.","success");
        window.dispatchEvent(new CustomEvent("erp:settings-updated",{detail:this.state.settings}));
      }
      if(event.key===KEYS.plugins){
        this.state.plugins=parse(KEYS.plugins,{})||{};
        window.dispatchEvent(new CustomEvent("erp:plugins-updated",{detail:this.state.plugins}));
      }
      if(event.key===KEYS.notifications){
        this.state.notifications=parse(KEYS.notifications,[])||[];
        this.renderNotifications();
      }
      if(event.key===KEYS.activity){
        this.state.activity=parse(KEYS.activity,[])||[];
      }
    });

    window.ERPActivity={
      getAll:()=>[...this.state.activity],
      clear:()=>{
        this.state.activity=[];
        save(KEYS.activity,[]);
      },
      export:()=>{
        const blob=new Blob([JSON.stringify(this.state.activity,null,2)],{type:"application/json"});
        const anchor=document.createElement("a");
        anchor.href=URL.createObjectURL(blob);
        anchor.download=`ERP-Activity-${new Date().toISOString().slice(0,10)}.json`;
        anchor.click();
        URL.revokeObjectURL(anchor.href);
      }
    };
  },

  bindNetworkEvents(){
    window.addEventListener("online",()=>{
      this.notify("Connection restored","The ERP is online. Pending records can now synchronize.","success");
      this.log("network.online",{},"success");
    });
    window.addEventListener("offline",()=>{
      this.notify("Offline mode","Internet is unavailable. Work will remain in local storage.","warning");
      this.log("network.offline",{},"warning");
    });
  },

  installErrorBoundary(){
    window.addEventListener("error",event=>{
      const error={
        message:event.message,
        source:event.filename,
        line:event.lineno,
        column:event.colno,
        createdAt:new Date().toISOString()
      };
      const errors=parse(KEYS.runtimeErrors,[]);
      errors.unshift(error);
      save(KEYS.runtimeErrors,errors.slice(0,200));
      this.log("runtime.error",error,"error");
    });
    window.addEventListener("unhandledrejection",event=>{
      const error={
        message:String(event.reason?.message||event.reason||"Unhandled promise rejection"),
        createdAt:new Date().toISOString()
      };
      const errors=parse(KEYS.runtimeErrors,[]);
      errors.unshift(error);
      save(KEYS.runtimeErrors,errors.slice(0,200));
      this.log("runtime.promise_error",error,"error");
    });
  }
};

window.ERPPlatform=ERPPlatform;
window.ERP=window.ERP||ERPPlatform;

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",()=>ERPPlatform.init(),{once:true});
}else{
  ERPPlatform.init();
}
})();
