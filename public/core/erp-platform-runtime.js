(function(){
"use strict";
const V="41.4.0", K={pub:"erp_design_published",draft:"erp_design_draft",plugins:"erp_plugins",mods:"erp_module_registry",notes:"erp_notifications",log:"erp_activity_log"};
const parse=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||"")||d}catch(e){return d}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const ERPPlatform={
version:V,state:{settings:{},plugins:{},modules:{},notes:[],log:[]},
init(){
 this.state.settings=parse(K.pub,parse(K.draft,{}));
 this.state.plugins=parse(K.plugins,{});
 this.state.modules=parse(K.mods,{});
 this.state.notes=parse(K.notes,[]);
 this.state.log=parse(K.log,[]);
 this.applySettings(); this.registerPage(); this.loadPlugins();
 this.mountSearch(); this.mountNotifications(); this.bindSync();
 this.log("runtime.ready",{version:V,page:document.body.dataset.erpPage||location.pathname});
 window.dispatchEvent(new CustomEvent("erp:runtime-ready",{detail:{version:V}}));
},
applySettings(){
 const s=this.state.settings||{}, t=s.theme||s.themeSettings||{}, f=s.fonts||s.fontSettings||{}, sh=s.shell||s.shellSettings||{}, p=s.profile||s.activeProfile||{};
 const r=document.documentElement;
 [["--erp-primary",t.primary],["--erp-secondary",t.secondary],["--erp-accent",t.accent],["--erp-bg",t.background],["--erp-surface",t.surface],["--erp-text",t.text],["--erp-font-family",f.family||f.fontFamily]].forEach(([k,v])=>v&&r.style.setProperty(k,v));
 if(f.baseSize)r.style.setProperty("--erp-font-size",f.baseSize+"px");
 if(sh.sidebarWidth)r.style.setProperty("--erp-sidebar-width",sh.sidebarWidth+"px");
 document.body.classList.toggle("erp-dark",t.mode==="dark");
 document.body.classList.toggle("erp-shell-autohide",sh.autoHide===true||sh.autoHide==="yes");
 document.body.classList.toggle("erp-shell-fixed",sh.autoHide===false||sh.autoHide==="no");
 this.applyProfile(p);
},
applyProfile(p){
 if(!p)return;
 const set=(sels,v)=>v&&sels.forEach(s=>document.querySelectorAll(s).forEach(e=>e.textContent=v));
 set(["[data-erp-profile-name]",".profile-name","#profileName"],p.name||p.fullName);
 set(["[data-erp-profile-designation]",".profile-role","#profileRole"],p.designation||p.role);
 set(["[data-erp-profile-department]",".profile-department","#profileDepartment"],p.department);
 const src=p.image||p.photo||p.picture;
 if(src)["[data-erp-profile-image]",".profile-avatar img","#profileImage"].forEach(s=>document.querySelectorAll(s).forEach(e=>{if(e.tagName==="IMG")e.src=src;else e.style.backgroundImage=`url("${src}")`}));
},
registerPage(){
 const id=document.body.dataset.erpPage||location.pathname.split("/").pop().replace(/\.html?$/i,"")||"index";
 const m={id,title:document.title||id,module:document.body.dataset.erpModule||"framework",url:location.pathname.split("/").pop()||"index.html",status:"connected",version:V,lastSeen:new Date().toISOString()};
 this.state.modules[id]={...(this.state.modules[id]||{}),...m}; save(K.mods,this.state.modules);
},
registerModule(m){if(!m||!m.id)return;this.state.modules[m.id]={...(this.state.modules[m.id]||{}),...m,lastUpdated:new Date().toISOString()};save(K.mods,this.state.modules);},
loadPlugins(){Object.entries(this.state.plugins).forEach(([id,p])=>{if(p&&p.enabled&&window.ERPPlugins&&typeof ERPPlugins[id]==="function"){try{ERPPlugins[id](this);this.log("plugin.loaded",{id})}catch(e){this.notify("Plugin error",id+": "+e.message,"error")}}})},
notify(title,message,type="info"){
 const n={id:"n_"+Date.now(),title,message,type,createdAt:new Date().toISOString(),read:false};
 this.state.notes.unshift(n);this.state.notes=this.state.notes.slice(0,200);save(K.notes,this.state.notes);this.renderNotifications();return n;
},
log(action,detail={}){
 const p=this.state.settings.profile||this.state.settings.activeProfile||{};
 const row={id:"a_"+Date.now(),action,detail,page:document.body.dataset.erpPage||location.pathname,user:p.name||p.fullName||"Muhammad Waqas",createdAt:new Date().toISOString()};
 this.state.log.unshift(row);this.state.log=this.state.log.slice(0,1000);save(K.log,this.state.log);return row;
},
records(){
 const out=Object.values(this.state.modules).map(m=>({type:"Page",title:m.title||m.id,sub:(m.module||"ERP")+" · "+(m.status||"registered"),url:m.url||m.id+".html",keys:JSON.stringify(m)}));
 [["erp_items","Item"],["items","Item"],["erp_suppliers","Supplier"],["suppliers","Supplier"],["erp_departments","Department"],["departments","Department"],["erp_workshops","Workshop"],["workshops","Workshop"],["erp_units","Unit"],["erp_categories","Category"],["erp_racks","Rack"],["erp_vehicles","Vehicle"]].forEach(([k,t])=>{
  const rows=parse(k,[]); if(!Array.isArray(rows))return;
  rows.forEach((r,i)=>out.push({type:t,title:r.name||r.item_name||r.supplier_name||r.department_name||r.workshop_name||r.code||`${t} ${i+1}`,sub:r.size||r.unit||r.code||"",url:r.url||"",keys:JSON.stringify(r)}));
 });
 return out;
},
mountSearch(){
 if(document.getElementById("erpGlobalSearchButton"))return;
 const b=document.createElement("button");b.id="erpGlobalSearchButton";b.className="erp-floating-action erp-search-launcher";b.type="button";b.title="Global Search (Ctrl+K)";b.textContent="⌕";document.body.appendChild(b);
 const o=document.createElement("div");o.id="erpGlobalSearchOverlay";o.className="erp-overlay";o.innerHTML='<div class="erp-command-palette"><div class="erp-command-head"><input id="erpGlobalSearchInput" type="search" placeholder="Search pages, modules, items, suppliers, departments..."><button data-close-search>×</button></div><div id="erpGlobalSearchResults" class="erp-command-results"></div></div>';document.body.appendChild(o);
 const input=o.querySelector("input");b.onclick=()=>{o.classList.add("open");input.value="";this.renderSearch("");setTimeout(()=>input.focus(),50)};o.onclick=e=>{if(e.target===o||e.target.closest("[data-close-search]"))o.classList.remove("open")};input.oninput=()=>this.renderSearch(input.value);
 document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();b.click()}if(e.key==="Escape")o.classList.remove("open")});
},
renderSearch(q){
 const box=document.getElementById("erpGlobalSearchResults"), s=(q||"").toLowerCase().trim();
 const rows=this.records().filter(r=>!s||`${r.title} ${r.sub} ${r.keys}`.toLowerCase().includes(s)).slice(0,30);
 box.innerHTML=rows.length?rows.map(r=>`<button class="erp-search-result" data-url="${this.esc(r.url)}"><span class="erp-result-type">${this.esc(r.type)}</span><span class="erp-result-main"><strong>${this.esc(r.title)}</strong><small>${this.esc(r.sub)}</small></span></button>`).join(""):'<div class="erp-empty-state">No matching ERP records found.</div>';
 box.querySelectorAll("[data-url]").forEach(e=>e.onclick=()=>{if(e.dataset.url)location.href=e.dataset.url});
},
mountNotifications(){
 if(document.getElementById("erpNotificationButton"))return;
 const b=document.createElement("button");b.id="erpNotificationButton";b.className="erp-floating-action erp-notification-launcher";b.type="button";b.innerHTML='🔔<span id="erpNotificationCount"></span>';document.body.appendChild(b);
 const p=document.createElement("aside");p.id="erpNotificationPanel";p.className="erp-side-panel";p.innerHTML='<div class="erp-panel-head"><strong>Notifications</strong><button data-close-panel>×</button></div><div id="erpNotificationList" class="erp-panel-body"></div>';document.body.appendChild(p);
 b.onclick=()=>{p.classList.toggle("open");this.state.notes=this.state.notes.map(n=>({...n,read:true}));save(K.notes,this.state.notes);this.renderNotifications()};p.querySelector("button").onclick=()=>p.classList.remove("open");this.renderNotifications();
},
renderNotifications(){
 const c=document.getElementById("erpNotificationCount"),l=document.getElementById("erpNotificationList"),u=this.state.notes.filter(n=>!n.read).length;
 if(c){c.textContent=u||"";c.style.display=u?"inline-flex":"none"} if(l)l.innerHTML=this.state.notes.length?this.state.notes.slice(0,50).map(n=>`<article class="erp-notification erp-${this.esc(n.type)}"><strong>${this.esc(n.title)}</strong><p>${this.esc(n.message)}</p><small>${new Date(n.createdAt).toLocaleString()}</small></article>`).join(""):'<div class="erp-empty-state">No notifications.</div>';
},
bindSync(){
 window.addEventListener("storage",e=>{if(e.key===K.pub||e.key===K.draft){this.state.settings=parse(K.pub,parse(K.draft,{}));this.applySettings()}if(e.key===K.notes){this.state.notes=parse(K.notes,[]);this.renderNotifications()}});
 window.addEventListener("online",()=>this.notify("Connection restored","The ERP is online. Pending records can now synchronize.","success"));
 window.addEventListener("offline",()=>this.notify("Offline mode","Internet is unavailable. Work will remain in local storage.","warning"));
 window.ERPActivity={getAll:()=>[...this.state.log],clear:()=>{this.state.log=[];save(K.log,[])},export:()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(this.state.log,null,2)],{type:"application/json"}));a.download="ERP-Activity-"+new Date().toISOString().slice(0,10)+".json";a.click();URL.revokeObjectURL(a.href)}};
},
esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
};
window.ERPPlatform=ERPPlatform;window.ERP=window.ERP||ERPPlatform;
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>ERPPlatform.init(),{once:true});else ERPPlatform.init();
})();
