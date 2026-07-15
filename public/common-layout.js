window.APP_LAYOUT={menu:[
{label:"Dashboard",icon:"⌂",href:"index.html"},
{id:"mastersGroup",label:"Masters",icon:"▦",children:[
{label:"Item Master",href:"masters.html?type=item",match:["items.html","masters.html?type=item"]},
{label:"Supplier Master",href:"masters.html?type=supplier",match:["suppliers.html","masters.html?type=supplier"]},
{label:"Workshop / Party Master",href:"masters.html?type=workshop",match:["workshops.html","masters.html?type=workshop"]},
{label:"Department Master",href:"masters.html?type=department",match:["departments.html","masters.html?type=department"]},
{label:"Other Masters Center",href:"master-center.html",match:["master-center.html"]}]},
{id:"purchaseGroup",label:"Purchase",icon:"🛒",children:[
{label:"Local Purchase",href:"purchase-entry.html?type=local"},
{label:"Zafar Purchase",href:"purchase-entry.html?type=zafar"},
{label:"Board Purchase",href:"purchase-entry.html?type=board"},
{label:"Purchase List",href:"purchase-list.html"}]},
{label:"Issue",icon:"↩",href:"issue.html"},
{id:"gatePassGroup",label:"Gate Pass",icon:"▣",children:[
{label:"RGP Entry",href:"rgp-entry.html"},{label:"RGP Return",href:"rgp-return.html"},
{label:"RGP List",href:"rgp-list.html"},{label:"OGP Entry",href:"ogp-entry.html"},
{label:"OGP List",href:"ogp-list.html"}]},
{id:"reportsGroup",label:"Reports",icon:"▥",children:[
{label:"Purchase Reports",href:"reports.html?type=purchase"},
{label:"Issue Reports",href:"reports.html?type=issue"},
{label:"Stock Reports",href:"reports.html?type=stock"}]},
{label:"Inventory Intelligence",icon:"◆",href:"inventory-intelligence.html"},
{label:"Rack Management",icon:"▤",href:"rack-management.html"},
{label:"Health Control Tower",icon:"◉",href:"erp-health-control-tower.html"},
{id:"settingsGroup",label:"Settings",icon:"⚙",children:[
{label:"ERP Design Studio",href:"erp-design-studio.html"},
{label:"General Settings",href:"settings.html"},
{label:"PDF & Logo Settings",href:"pdf-settings.html"},
{label:"Theme Settings",href:"theme-settings.html"},
{label:"ERP Core Settings",href:"erp-core-settings.html"},
{label:"ERP Relationship Center",href:"erp-relationship-center.html"},
{label:"ERP Data Health Center",href:"erp-health-center.html"}]}
]};

function currentPageKey(){
  const file=location.pathname.split("/").pop()||"index.html";
  return file+location.search;
}
function itemMatches(item,key){
  if(item.match&&item.match.some(x=>key.includes(x)))return true;
  return item.href&&(key===item.href||key.startsWith(item.href));
}
function escapeLayout(value){
  return window.AppTools?.escapeHtml?.(value)||String(value??"");
}
function closeAllERPNav(exceptId=""){
  document.querySelectorAll(".erp-nav-dropdown.open,.nav-group.open").forEach(el=>{
    if(el.id!==exceptId)el.classList.remove("open");
  });
}
function toggleERPTopMenu(id,event){
  event?.stopPropagation();
  const el=document.getElementById(id);
  if(!el)return;
  const opening=!el.classList.contains("open");
  closeAllERPNav(id);
  el.classList.toggle("open",opening);
}
function toggleSidebarGroup(id){
  const el=document.getElementById(id);
  if(!el)return;
  const opening=!el.classList.contains("open");
  document.querySelectorAll(".nav-group.open").forEach(group=>{
    if(group.id!==id)group.classList.remove("open");
  });
  el.classList.toggle("open",opening);
}
function brandMarkup(settings){
  if(settings.showBrand===false)return "";
  return `<a class="erp-shell-brand" href="${settings.startupPage||"erp-design-studio.html"}">
    <span class="erp-shell-brand-icon">ERP</span>
    <span><strong>${escapeLayout(settings.brandTitle)}</strong><small>${escapeLayout(settings.brandSubtitle)}</small></span>
  </a>`;
}
function menuItemsMarkup(settings,mode){
  const key=currentPageKey();
  return APP_LAYOUT.menu.map((item,index)=>{
    if(item.children){
      const id=`${mode}_${item.id||"group"+index}`;
      const active=item.children.some(child=>itemMatches(child,key));
      if(mode==="top"){
        return `<div class="erp-nav-dropdown ${active?"current":""}" id="${id}">
          <button onclick="toggleERPTopMenu('${id}',event)">
            <span class="erp-nav-icon">${item.icon||"•"}</span><span>${escapeLayout(item.label)}</span><i>⌄</i>
          </button>
          <div class="erp-nav-menu">${item.children.map(child=>`
            <a class="${itemMatches(child,key)?"active":""}" href="${child.href}">${escapeLayout(child.label)}</a>`).join("")}</div>
        </div>`;
      }
      return `<div class="nav-group ${active?"open":""}" id="${id}">
        <button class="nav-group-title ${active?"active":""}" onclick="toggleSidebarGroup('${id}')">
          <span><b>${item.icon||"•"}</b>${escapeLayout(item.label)}</span><i>⌃</i>
        </button>
        <div class="nav-submenu">${item.children.map(child=>`
          <a class="${itemMatches(child,key)?"active":""}" href="${child.href}">${escapeLayout(child.label)}</a>`).join("")}</div>
      </div>`;
    }
    if(mode==="top"){
      return `<a class="erp-top-link ${itemMatches(item,key)?"active":""}" href="${item.href}">
        <span class="erp-nav-icon">${item.icon||"•"}</span><span>${escapeLayout(item.label)}</span>
      </a>`;
    }
    return `<a class="erp-side-link ${itemMatches(item,key)?"active":""}" href="${item.href}">
      <b>${item.icon||"•"}</b><span>${escapeLayout(item.label)}</span>
    </a>`;
  }).join("");
}
function topNavigationMarkup(settings){
  const profileLeft=settings.profilePosition==="top-left"?ERPShellSettings.profileMarkup(settings,"top"):"";
  const profileRight=settings.profilePosition==="top-right"?ERPShellSettings.profileMarkup(settings,"top"):"";
  return `<header class="erp-top-navigation ${settings.compactTopBar?"compact":""}" style="
      --top-height:${Number(settings.topBarHeight||64)}px;
      --top-bg:${settings.topBarBackground};
      --top-text:${settings.topBarTextColor};
      --active:${settings.activeColor};
    ">
    <div class="erp-top-left">
      ${profileLeft}
      ${brandMarkup(settings)}
    </div>
    <nav class="erp-top-menu">${menuItemsMarkup(settings,"top")}</nav>
    <div class="erp-top-right">
      ${settings.showSearch?`<button class="erp-shell-icon" title="Global Search">⌕</button>`:""}
      ${settings.showDateTime?`<span class="erp-date-time"><strong>${new Date().toLocaleDateString("en-PK",{day:"2-digit",month:"short",year:"2-digit"})}</strong><small>${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</small></span>`:""}
      ${settings.showNotifications?`<button class="erp-shell-icon" title="Notifications">🔔</button>`:""}
      ${profileRight}
    </div>
  </header>`;
}
function sideNavigationMarkup(settings){
  const profileTop=settings.profilePosition==="left-top"?ERPShellSettings.profileMarkup(settings,"left"):"";
  const profileBottom=settings.profilePosition==="left-bottom"?ERPShellSettings.profileMarkup(settings,"left"):"";
  return `<aside class="app-sidebar erp-left-navigation ${settings.sidebarDefaultCollapsed?"collapsed":""}" style="
      --side-width:${Number(settings.sidebarWidth||170)}px;
      --side-collapsed:${Number(settings.sidebarCollapsedWidth||58)}px;
      --side-bg:${settings.topBarBackground};
      --side-text:${settings.topBarTextColor};
      --active:${settings.activeColor};
    ">
    ${profileTop}
    ${brandMarkup(settings)}
    <nav class="app-nav">${menuItemsMarkup(settings,"left")}</nav>
    ${profileBottom}
    <button class="erp-sidebar-collapse" onclick="toggleERPLeftSidebar()">⇔</button>
  </aside>`;
}
function toggleERPLeftSidebar(){
  document.querySelector(".erp-left-navigation")?.classList.toggle("collapsed");
  document.body.classList.toggle("erp-sidebar-collapsed");
}
function applyERPLayout(settings){
  document.body.classList.remove("erp-layout-top","erp-layout-left","erp-layout-hybrid","erp-sidebar-collapsed");
  document.body.classList.add(`erp-layout-${settings.navigationPosition||"top"}`);
  document.documentElement.style.setProperty("--erp-content-max",settings.contentMaxWidth||"none");

  document.getElementById("appTopNavigation")?.remove();
  const sidebarHost=document.getElementById("appSidebar");
  if(sidebarHost)sidebarHost.innerHTML="";

  if(["top","hybrid"].includes(settings.navigationPosition)){
    const top=document.createElement("div");
    top.id="appTopNavigation";
    top.innerHTML=topNavigationMarkup(settings);
    document.body.insertBefore(top,document.body.firstChild);
  }
  if(["left","hybrid"].includes(settings.navigationPosition)&&sidebarHost){
    sidebarHost.innerHTML=sideNavigationMarkup(settings);
  }
  if(settings.profileHideMobile)document.body.classList.add("erp-profile-hide-mobile");
  else document.body.classList.remove("erp-profile-hide-mobile");
}
async function buildERPLayout(){
  const immediate=ERPShellSettings.getLocal();
  applyERPLayout(immediate);
  if(!window.supabase)return;

  try{
    const db=window.db||window.supabaseClient||supabase.createClient(
      "https://lzsxtvkluqvcaetnnydu.supabase.co",
      "sb_publishable_QfemUy-S0bO7fy6-uL_jBA_ZzGXKgma"
    );
    const remote=await ERPShellSettings.load(db);
    applyERPLayout(remote);
  }catch(error){
    console.warn(error.message);
  }
}
document.addEventListener("click",event=>{
  if(!event.target.closest(".erp-nav-dropdown"))closeAllERPNav();
});
document.addEventListener("DOMContentLoaded",buildERPLayout);
window.addEventListener("erp-shell-settings-changed",event=>applyERPLayout(event.detail));
