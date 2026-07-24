
(()=>{
const KEY='erpControlCenter2';
const defaults={
 theme:'factory',density:'standard',global:{workspace:'#eef3f8',surface:'#ffffff',surface2:'#f7f9fc',text:'#0b1b34',muted:'#5b6b82',primary:'#10284a',accent:'#f59e0b',success:'#16a34a',danger:'#dc2626',sidebar:'#0e1b2f',sidebarText:'#ffffff',sidebarActive:'#f59e0b',sidebarActiveText:'#101827',topbar:'#ffffff',profile:'#0f2442',tableHeader:'#f59e0b',groupHeader:'#10284a',border:'#cad5e3',inputFocus:'#2563eb',font:'Inter, Segoe UI, Arial, sans-serif',baseFont:14,headingScale:1,controlHeight:38,radius:12,buttonRadius:9,inputRadius:8,rowHeight:38,pagePad:18,sectionGap:14,shadow:'soft'},pages:{}};
const themes={
 factory:{workspace:'#eef3f8',surface:'#ffffff',text:'#0b1b34',muted:'#5b6b82',primary:'#10284a',accent:'#f59e0b',sidebar:'#0e1b2f',sidebarActive:'#f59e0b',sidebarActiveText:'#101827',topbar:'#ffffff',profile:'#0f2442',tableHeader:'#f59e0b',groupHeader:'#10284a',border:'#cad5e3',inputFocus:'#2563eb'},
 executive:{workspace:'#f2f6fb',surface:'#ffffff',text:'#0b1f3a',muted:'#607089',primary:'#123b6d',accent:'#e59b21',sidebar:'#0b2748',sidebarActive:'#2b6cb0',topbar:'#ffffff',profile:'#123b6d',tableHeader:'#dce9f8',groupHeader:'#123b6d',border:'#c9d7e8',inputFocus:'#2b6cb0'},
 industrial:{workspace:'#eceff1',surface:'#ffffff',text:'#1f2933',muted:'#64727e',primary:'#37474f',accent:'#ff8f00',sidebar:'#263238',sidebarActive:'#ff8f00',topbar:'#fafafa',profile:'#37474f',tableHeader:'#ffb300',groupHeader:'#37474f',border:'#b0bec5',inputFocus:'#ff8f00'},
 emerald:{workspace:'#eff8f3',surface:'#ffffff',text:'#12352a',muted:'#5c756d',primary:'#126b4b',accent:'#e0a11a',sidebar:'#0d4d38',sidebarActive:'#21a675',topbar:'#ffffff',profile:'#126b4b',tableHeader:'#39b982',groupHeader:'#126b4b',border:'#b9d9cc',inputFocus:'#149965'},
 minimal:{workspace:'#f7f7f8',surface:'#ffffff',text:'#171717',muted:'#737373',primary:'#171717',accent:'#525252',sidebar:'#ffffff',sidebarText:'#171717',sidebarActive:'#e5e5e5',topbar:'#ffffff',profile:'#f5f5f5',tableHeader:'#ededed',groupHeader:'#262626',border:'#e5e5e5',inputFocus:'#525252'},
 glass:{workspace:'#eaf2ff',surface:'#ffffff',text:'#10213c',muted:'#60718c',primary:'#315ca8',accent:'#f59e0b',sidebar:'#1c3562',sidebarActive:'#5b8def',topbar:'#f7fbff',profile:'#315ca8',tableHeader:'#8bb8ff',groupHeader:'#315ca8',border:'#b9cae5',inputFocus:'#5b8def'},
 carbon:{workspace:'#10151d',surface:'#18212c',surface2:'#202b38',text:'#edf2f7',muted:'#a7b2c2',primary:'#34495e',accent:'#f5a623',sidebar:'#090d12',sidebarText:'#ffffff',sidebarActive:'#f5a623',topbar:'#18212c',profile:'#202b38',tableHeader:'#d98c10',groupHeader:'#202b38',border:'#344150',inputFocus:'#4fa3ff'},
 midnight:{workspace:'#0c1220',surface:'#111b2d',surface2:'#17233a',text:'#eef5ff',muted:'#9eb0ca',primary:'#2463a7',accent:'#00b8d9',sidebar:'#070c15',sidebarText:'#ffffff',sidebarActive:'#00b8d9',topbar:'#111b2d',profile:'#17233a',tableHeader:'#1778a8',groupHeader:'#17355d',border:'#2b405e',inputFocus:'#00b8d9'},
 blackgold:{workspace:'#151515',surface:'#202020',surface2:'#282828',text:'#f8f3e7',muted:'#b8ae98',primary:'#2b2b2b',accent:'#d4af37',sidebar:'#090909',sidebarText:'#f8f3e7',sidebarActive:'#d4af37',topbar:'#1b1b1b',profile:'#252525',tableHeader:'#d4af37',groupHeader:'#262626',border:'#4b4638',inputFocus:'#d4af37'},
 office:{workspace:'#f3f6fa',surface:'#ffffff',text:'#172033',muted:'#667085',primary:'#185abd',accent:'#f3b33d',sidebar:'#123f73',sidebarActive:'#2b78d0',topbar:'#ffffff',profile:'#185abd',tableHeader:'#d9e7f8',groupHeader:'#185abd',border:'#c8d4e3',inputFocus:'#185abd'},
 sap:{workspace:'#edf2f5',surface:'#ffffff',text:'#1d2d3e',muted:'#607284',primary:'#0a6ed1',accent:'#e9730c',sidebar:'#263746',sidebarActive:'#0a6ed1',topbar:'#ffffff',profile:'#354a5f',tableHeader:'#d1e8ff',groupHeader:'#354a5f',border:'#b8c6d1',inputFocus:'#0a6ed1'},
 sunrise:{workspace:'#fff7ed',surface:'#ffffff',text:'#431407',muted:'#8a5f50',primary:'#9a3412',accent:'#f97316',sidebar:'#7c2d12',sidebarActive:'#fb923c',topbar:'#fffaf5',profile:'#9a3412',tableHeader:'#fb923c',groupHeader:'#9a3412',border:'#fed7aa',inputFocus:'#f97316'}
};
function merge(a,b){return Object.assign({},a||{},b||{})}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return {...defaults,...x,global:merge(defaults.global,x.global),pages:x.pages||{}}}catch(e){return structuredClone(defaults)}}
function shadow(v){return v==='none'?'none':v==='strong'?'0 14px 34px rgba(15,35,65,.20)':v==='flat'?'0 1px 2px rgba(15,35,65,.08)':'0 8px 24px rgba(15,35,65,.10)'}
function apply(){const s=load(), page=document.body.dataset.erpPage||location.pathname.split('/').pop().replace('.html',''), p=s.pages[page]||{}, g=merge(s.global,p); const r=document.documentElement.style;
 const map={workspace:'--cc-workspace',surface:'--cc-surface',surface2:'--cc-surface-2',text:'--cc-text',muted:'--cc-muted',primary:'--cc-primary',accent:'--cc-accent',success:'--cc-success',danger:'--cc-danger',sidebar:'--cc-sidebar',sidebarText:'--cc-sidebar-text',sidebarActive:'--cc-sidebar-active',sidebarActiveText:'--cc-sidebar-active-text',topbar:'--cc-topbar',profile:'--cc-profile',tableHeader:'--cc-table-header',groupHeader:'--cc-group-header',border:'--cc-border',inputFocus:'--cc-input-focus',font:'--cc-font-family'};
 Object.entries(map).forEach(([k,v])=>g[k]!=null&&r.setProperty(v,g[k]));
 [['baseFont','--cc-base-font','px'],['headingScale','--cc-heading-scale',''],['controlHeight','--cc-control-height','px'],['radius','--cc-radius','px'],['buttonRadius','--cc-button-radius','px'],['inputRadius','--cc-input-radius','px'],['rowHeight','--cc-table-row-height','px'],['pagePad','--cc-page-pad','px'],['sectionGap','--cc-section-gap','px']].forEach(([k,v,u])=>g[k]!=null&&r.setProperty(v,g[k]+u));
 r.setProperty('--cc-card-shadow',shadow(g.shadow)); document.body.classList.toggle('cc-hide-helper',!!p.hideHelper);document.body.classList.toggle('cc-hide-subtitle',!!p.hideSubtitle);document.body.classList.toggle('cc-compact-kpi',!!p.compactKpi);document.body.classList.toggle('cc-density-compact',s.density==='compact');document.body.classList.toggle('cc-density-comfortable',s.density==='comfortable');
}
window.ERPControlCenter={KEY,defaults,themes,load,save:s=>{localStorage.setItem(KEY,JSON.stringify(s));apply();window.dispatchEvent(new CustomEvent('erp-control-center-change',{detail:s}))},apply};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
window.addEventListener('storage',e=>{if(e.key===KEY)apply()});

function shellSync(){
 const s=load(),g=s.global||{},r=document.documentElement.style;
 const aliases={
  '--erp-sidebar-bg':g.sidebar,'--erp-sidebar-background':g.sidebar,'--sidebar-bg':g.sidebar,'--sidebar-background':g.sidebar,
  '--erp-sidebar-text':g.sidebarText,'--sidebar-text':g.sidebarText,'--erp-sidebar-active':g.sidebarActive,'--sidebar-active':g.sidebarActive,
  '--erp-topbar-bg':g.topbar,'--topbar-bg':g.topbar,'--erp-profile-bg':g.profile,'--profile-bg':g.profile,
  '--erp-primary':g.primary,'--erp-accent':g.accent,'--theme-primary':g.primary,'--theme-accent':g.accent
 };
 Object.entries(aliases).forEach(([k,v])=>v!=null&&r.setProperty(k,v));
 const roots=[...document.querySelectorAll('#appSidebar,#erpSidebar,#erp-sidebar,#universalSidebar,#universal-sidebar,#erpUniversalSidebar,.erp-sidebar,.erpSidebar,.universal-sidebar,.universalSidebar,.sidebar-shell,.side-shell,[data-erp-sidebar],[data-sidebar-root]')];
 roots.forEach(side=>{
  side.style.setProperty('background',g.sidebar||'#0e1b2f','important');side.style.setProperty('color',g.sidebarText||'#fff','important');
  side.querySelectorAll('*').forEach(el=>{
   const t=(el.textContent||'').trim();
   if(t==='ERP Design Studio') el.textContent='Control Center';
  });
 });
 document.querySelectorAll('.topbar,.top-ribbon,.app-topbar,#topbar,#appTopbar,.erp-topbar,.erp-ribbon,[data-erp-topbar]').forEach(el=>el.style.setProperty('background',g.topbar||'#fff','important'));
}
const originalApply=apply;window.ERPControlCenter.apply=()=>{originalApply();shellSync()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{shellSync();new MutationObserver(shellSync).observe(document.body,{childList:true,subtree:true})});
else{shellSync();new MutationObserver(shellSync).observe(document.body,{childList:true,subtree:true})}
})();
