window.APP_LAYOUT={menu:[
{label:"⌂ Dashboard",href:"index.html"},
{id:"mastersGroup",label:"▦ Masters",children:[
{label:"Item Master",href:"masters.html?type=item",match:["items.html","masters.html?type=item"]},
{label:"Supplier Master",href:"masters.html?type=supplier",match:["suppliers.html","masters.html?type=supplier"]},
{label:"Workshop / Party Master",href:"masters.html?type=workshop",match:["workshops.html","masters.html?type=workshop"]},
{label:"Department Master",href:"masters.html?type=department",match:["departments.html","masters.html?type=department"]},
{label:"Unit Master",href:"masters.html?type=unit"},
{label:"Category Master",href:"masters.html?type=category"},
{label:"Carrier Master",href:"masters.html?type=carrier"},
{label:"Authorized Person Master",href:"masters.html?type=authority"}]},
{label:"🛒 Purchase Entry",href:"purchase.html"},
{label:"↩ Issue Entry",href:"issue.html"},
{id:"gatePassGroup",label:"▣ Gate Pass",children:[
{label:"RGP Entry",href:"rgp-entry.html"},{label:"RGP Return",href:"rgp-return.html"},
{label:"RGP List",href:"rgp-list.html"},{label:"OGP Entry",href:"ogp-entry.html"},
{label:"OGP List",href:"ogp-list.html"}]},
{label:"▤ Stock Ledger",href:"stock-ledger.html"},
{label:"▥ Reports",href:"reports.html"},
{id:"settingsGroup",label:"⚙ Settings",children:[
{label:"General Settings",href:"settings.html"},
{label:"PDF & Logo Settings",href:"pdf-settings.html"}]}
]};

function currentPageKey(){const f=location.pathname.split("/").pop()||"index.html";return f+location.search}
function itemMatches(item,key){
 if(item.match&&item.match.some(x=>key.includes(x)))return true;
 return item.href&&(key===item.href||key.startsWith(item.href));
}
function toggleSidebarGroup(groupId){
 document.querySelectorAll(".nav-group").forEach(group=>{
   if(group.id!==groupId) group.classList.remove("open");
 });
 document.getElementById(groupId)?.classList.toggle("open");
}
function buildSidebar(){
 const host=document.getElementById("appSidebar");if(!host)return;
 const key=currentPageKey();
 let html=`<aside class="app-sidebar"><div class="app-brand"><div class="app-brand-icon">◆</div><div><h2>Inventory Store</h2><p>Management System</p></div></div><nav class="app-nav">`;
 APP_LAYOUT.menu.forEach(item=>{
  if(item.children){
   const open=item.children.some(child=>itemMatches(child,key));
   html+=`<div class="nav-group ${open?"open":""}" id="${item.id}">
   <button class="nav-group-title ${open?"active":""}" onclick="toggleSidebarGroup('${item.id}')">
   <span>${item.label}</span><span class="chevron">⌃</span></button><div class="nav-submenu">`;
   item.children.forEach(child=>{
     html+=`<a class="${itemMatches(child,key)?"active":""}" href="${child.href}">${child.label}</a>`;
   });
   html+=`</div></div>`;
  }else{
   html+=`<a class="${itemMatches(item,key)?"active":""}" href="${item.href}">${item.label}</a>`;
  }
 });
 html+=`</nav><div class="app-profile"><img src="public/waqas.jpg.png" onerror="this.src='public/profile.png'"><h3>Muhammad Waqas</h3><p><span></span>Online</p></div></aside>`;
 host.innerHTML=html;
}
document.addEventListener("DOMContentLoaded",buildSidebar);
