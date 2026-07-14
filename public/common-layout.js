window.APP_LAYOUT={menu:[
{label:"⌂ Dashboard",href:"index.html"},
{id:"mastersGroup",label:"▦ Masters",children:[
{label:"Item Master",href:"masters.html?type=item",match:["items.html","masters.html?type=item"]},
{label:"Supplier Master",href:"masters.html?type=supplier",match:["suppliers.html","masters.html?type=supplier"]},
{label:"Workshop / Party Master",href:"masters.html?type=workshop",match:["workshops.html","masters.html?type=workshop"]},
{label:"Department Master",href:"masters.html?type=department",match:["departments.html","masters.html?type=department"]},
{label:"Other Masters Center",href:"master-center.html",match:["master-center.html"]}]},
{label:"🛒 Purchase Entry",href:"purchase.html"},
{label:"↩ Issue Entry",href:"issue.html"},
{id:"gatePassGroup",label:"▣ Gate Pass",children:[
{label:"RGP Entry",href:"rgp-entry.html"},{label:"RGP Return",href:"rgp-return.html"},
{label:"RGP List",href:"rgp-list.html"},{label:"OGP Entry",href:"ogp-entry.html"},
{label:"OGP List",href:"ogp-list.html"}]},
{label:"▤ Stock Ledger",href:"stock-ledger.html"},
{label:"▤ Rack Management",href:"rack-management.html"},
{label:"◆ Inventory Intelligence",href:"inventory-intelligence.html"},
{label:"▥ Reports",href:"reports.html"},
{id:"settingsGroup",label:"⚙ Settings",children:[
{label:"General Settings",href:"settings.html"},
{label:"PDF & Logo Settings",href:"pdf-settings.html"},
{label:"Theme & Sidebar Settings",href:"theme-settings.html"},
{label:"ERP Core Settings",href:"erp-core-settings.html"},
{label:"ERP Relationship Center",href:"erp-relationship-center.html"},
{label:"ERP Data Health Center",href:"erp-health-center.html"},
{label:"ERP Health Control Tower",href:"erp-health-control-tower.html"},
{label:"Form Engine Demo",href:"form-demo.html"},
{label:"Table Engine Demo",href:"table-demo.html"}]}
]};

function currentPageKey(){const f=location.pathname.split("/").pop()||"index.html";return f+location.search}
function itemMatches(item,key){
 if(item.match&&item.match.some(x=>key.includes(x)))return true;
 return item.href&&(key===item.href||key.startsWith(item.href));
}
function toggleSidebarGroup(groupId){
 const settings=window.ThemeSettings?ThemeSettings.get():{menuAccordion:true,rememberOpenGroup:false};
 const target=document.getElementById(groupId);
 if(!target)return;

 if(settings.menuAccordion){
   document.querySelectorAll(".nav-group").forEach(group=>{
     if(group.id!==groupId)group.classList.remove("open");
   });
 }
 target.classList.toggle("open");

 if(settings.rememberOpenGroup){
   localStorage.setItem("inventory_open_sidebar_group",target.classList.contains("open")?groupId:"");
 }
}
function buildSidebar(){
 const host=document.getElementById("appSidebar");if(!host)return;
 const key=currentPageKey();
 const s=window.ThemeSettings?ThemeSettings.get():{};
 const remembered=s.rememberOpenGroup?localStorage.getItem("inventory_open_sidebar_group"):"";
 let html=`<aside class="app-sidebar">`;

 if(s.brandVisible!==false){
   html+=`<div class="app-brand">
     <div class="app-brand-icon" style="background:${s.brandIconBackground||"#f5a316"};color:${s.brandIconColor||"#fff"}">${s.brandIcon||"◆"}</div>
     <div><h2>${AppTools?.escapeHtml?.(s.brandTitle||"Inventory Store")||"Inventory Store"}</h2>
     <p>${AppTools?.escapeHtml?.(s.brandSubtitle||"Management System")||"Management System"}</p></div>
   </div>`;
 }
 html+=`<nav class="app-nav">`;

 APP_LAYOUT.menu.forEach(item=>{
  if(item.children){
   const currentOpen=item.children.some(child=>itemMatches(child,key));
   const open=(s.autoOpenCurrentGroup!==false&&currentOpen)||remembered===item.id;
   html+=`<div class="nav-group ${open?"open":""}" id="${item.id}">
   <button class="nav-group-title ${currentOpen?"active":""}" onclick="toggleSidebarGroup('${item.id}')">
   <span>${item.label}</span>${s.showChevrons===false?"":'<span class="chevron">⌃</span>'}</button>
   <div class="nav-submenu">`;
   item.children.forEach(child=>{
     html+=`<a class="${itemMatches(child,key)?"active":""}" href="${child.href}">${child.label}</a>`;
   });
   html+=`</div></div>`;
  }else{
   html+=`<a class="${itemMatches(item,key)?"active":""}" href="${item.href}">${item.label}</a>`;
  }
 });
 html+=`</nav>`;

 if(s.profileVisible!==false){
   html+=`<div class="app-profile">
     <img src="public/waqas.jpg.png" onerror="this.src='public/profile.png'">
     <h3>${AppTools?.escapeHtml?.(s.profileName||"Muhammad Waqas")||"Muhammad Waqas"}</h3>
     <p><span style="background:${s.profileStatusColor||"#22c55e"}"></span>${AppTools?.escapeHtml?.(s.profileStatusText||"Online")||"Online"}</p>
   </div>`;
 }

 html+=`</aside>`;
 host.innerHTML=html;
 if(window.ThemeSettings)ThemeSettings.apply(s);
}
document.addEventListener("DOMContentLoaded",buildSidebar);
