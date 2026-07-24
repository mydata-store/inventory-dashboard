
(()=>{
const KEY='erpControlCenter2';
const defaults={
 theme:'factory',density:'standard',global:{workspace:'#eef3f8',surface:'#ffffff',surface2:'#f7f9fc',text:'#0b1b34',muted:'#5b6b82',primary:'#10284a',accent:'#f59e0b',success:'#16a34a',danger:'#dc2626',sidebar:'#0e1b2f',sidebarText:'#ffffff',sidebarActive:'#f59e0b',sidebarActiveText:'#101827',topbar:'#ffffff',profile:'#0f2442',tableHeader:'#f59e0b',groupHeader:'#10284a',border:'#cad5e3',inputFocus:'#2563eb',font:'Inter, Segoe UI, Arial, sans-serif',baseFont:14,headingScale:1,controlHeight:38,radius:12,buttonRadius:9,inputRadius:8,rowHeight:38,pagePad:18,sectionGap:14,shadow:'soft',sidebarWidth:250,sidebarCollapsedWidth:50,sidebarItemHeight:38,sidebarIconSize:18,sidebarRadius:0,sidebarItemRadius:8,sidebarFontSize:13,sidebarMainFontSize:13,sidebarMainFontWeight:650,sidebarSubFontSize:11,sidebarSubFontWeight:500,sidebarBrandFontSize:12,sidebarBrandFontWeight:750,sidebarLineHeight:1.2,sidebarLetterSpacing:0,sidebarTextTransform:'none',sidebarForceSingleLine:true,sidebarAutoFitLongLabels:true,sidebarTextAlign:'left',sidebarMenuGap:2,sidebarMainIndent:10,sidebarSubmenuRowHeight:30,sidebarAnimation:220,sidebarHover:'#174f3d',sidebarIcon:'#ffffff',sidebarBorder:'#2a3a50',sidebarSubmenuIndent:20,sidebarShowLogo:true,sidebarShowLabels:true,sidebarAutoHide:false,sidebarSingleOpen:true,sidebarShowDividers:true,profileVisible:true,profileShowPhoto:true,profileShowRole:true,profileShowStatus:true,profileHeight:82,profileMargin:10,profileRadius:18,profilePhotoSize:48,profilePhotoShape:'rounded',profileLayout:'horizontal',profileNameSize:13,profileNameWeight:700,profileRoleSize:10,profileRoleWeight:500,profileLineHeight:1.15,profileTextAlign:'left',profilePadding:9,profilePhotoBorderWidth:2,profilePhotoBorder:'#f59e0b',profilePhotoShadow:'soft',profilePhotoZoom:100,profilePhotoX:50,profilePhotoY:50,profilePicture:'',profileFrameShape:'rounded',profileCardBorderWidth:1,profileNameWrap:'ellipsis',profileRoleText:'Store Officer',profileStatusText:'Online',profileRoleSize:10,profileText:'#ffffff',profileBorder:'#2a6d57',profileStatus:'#22c55e',profileShadow:'soft'},pages:{}};
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
 r.setProperty('--cc-card-shadow',shadow(g.shadow));
 r.setProperty('--cc-sidebar-width',(g.sidebarWidth||250)+'px');r.setProperty('--cc-sidebar-collapsed-width',(g.sidebarCollapsedWidth||50)+'px');r.setProperty('--cc-sidebar-item-height',(g.sidebarItemHeight||38)+'px');r.setProperty('--cc-sidebar-icon-size',(g.sidebarIconSize||18)+'px');r.setProperty('--cc-sidebar-radius',(g.sidebarRadius||0)+'px');r.setProperty('--cc-sidebar-item-radius',(g.sidebarItemRadius||8)+'px');r.setProperty('--cc-sidebar-font-size',(g.sidebarFontSize||13)+'px');r.setProperty('--cc-sidebar-main-font-size',(g.sidebarMainFontSize||g.sidebarFontSize||13)+'px');r.setProperty('--cc-sidebar-main-font-weight',g.sidebarMainFontWeight||650);r.setProperty('--cc-sidebar-sub-font-size',(g.sidebarSubFontSize||11)+'px');r.setProperty('--cc-sidebar-sub-font-weight',g.sidebarSubFontWeight||500);r.setProperty('--cc-sidebar-brand-font-size',(g.sidebarBrandFontSize||12)+'px');r.setProperty('--cc-sidebar-brand-font-weight',g.sidebarBrandFontWeight||750);r.setProperty('--cc-sidebar-line-height',g.sidebarLineHeight||1.2);r.setProperty('--cc-sidebar-letter-spacing',(g.sidebarLetterSpacing||0)+'px');r.setProperty('--cc-sidebar-text-transform',g.sidebarTextTransform||'none');r.setProperty('--cc-sidebar-text-align',g.sidebarTextAlign||'left');r.setProperty('--cc-sidebar-menu-gap',(g.sidebarMenuGap||2)+'px');r.setProperty('--cc-sidebar-main-indent',(g.sidebarMainIndent||10)+'px');r.setProperty('--cc-sidebar-submenu-row-height',(g.sidebarSubmenuRowHeight||30)+'px');r.setProperty('--cc-sidebar-animation',(g.sidebarAnimation||220)+'ms');r.setProperty('--cc-sidebar-hover',g.sidebarHover||g.sidebarActive);r.setProperty('--cc-sidebar-icon',g.sidebarIcon||g.sidebarText);r.setProperty('--cc-sidebar-border',g.sidebarBorder||g.border);r.setProperty('--cc-sidebar-submenu-indent',(g.sidebarSubmenuIndent||20)+'px');
 r.setProperty('--cc-profile-height',(g.profileHeight||82)+'px');r.setProperty('--cc-profile-margin',(g.profileMargin||10)+'px');r.setProperty('--cc-profile-radius',(g.profileRadius||18)+'px');r.setProperty('--cc-profile-photo-size',(g.profilePhotoSize||48)+'px');r.setProperty('--cc-profile-name-size',(g.profileNameSize||13)+'px');r.setProperty('--cc-profile-name-weight',g.profileNameWeight||700);r.setProperty('--cc-profile-role-size',(g.profileRoleSize||10)+'px');r.setProperty('--cc-profile-role-weight',g.profileRoleWeight||500);r.setProperty('--cc-profile-line-height',g.profileLineHeight||1.15);r.setProperty('--cc-profile-text-align',g.profileTextAlign||'left');r.setProperty('--cc-profile-padding',(g.profilePadding||9)+'px');r.setProperty('--cc-profile-photo-border-width',(g.profilePhotoBorderWidth||0)+'px');r.setProperty('--cc-profile-photo-border',g.profilePhotoBorder||g.accent);r.setProperty('--cc-profile-photo-shadow',shadow(g.profilePhotoShadow));r.setProperty('--cc-profile-photo-zoom',(g.profilePhotoZoom||100)+'%');r.setProperty('--cc-profile-photo-x',(g.profilePhotoX??50)+'%');r.setProperty('--cc-profile-photo-y',(g.profilePhotoY??50)+'%');r.setProperty('--cc-profile-card-border-width',(g.profileCardBorderWidth??1)+'px');r.setProperty('--cc-profile-text',g.profileText||g.sidebarText);r.setProperty('--cc-profile-border',g.profileBorder||g.border);r.setProperty('--cc-profile-status',g.profileStatus||'#22c55e');r.setProperty('--cc-profile-shadow',shadow(g.profileShadow));
 document.body.classList.toggle('cc-sidebar-hide-logo',g.sidebarShowLogo===false);document.body.classList.toggle('cc-sidebar-single-line',g.sidebarForceSingleLine!==false);document.body.classList.toggle('cc-sidebar-auto-fit',g.sidebarAutoFitLongLabels!==false);document.body.classList.toggle('cc-sidebar-hide-labels',g.sidebarShowLabels===false);document.body.classList.toggle('cc-sidebar-auto-hide',!!g.sidebarAutoHide);document.body.classList.toggle('cc-sidebar-no-dividers',g.sidebarShowDividers===false);document.body.classList.toggle('cc-profile-hidden',g.profileVisible===false);document.body.classList.toggle('cc-profile-hide-photo',g.profileShowPhoto===false);document.body.classList.toggle('cc-profile-hide-role',g.profileShowRole===false);document.body.classList.toggle('cc-profile-hide-status',g.profileShowStatus===false);document.body.dataset.ccProfileLayout=g.profileLayout||'horizontal';document.body.dataset.ccProfilePhotoShape=g.profilePhotoShape||'rounded';document.body.dataset.ccProfileFrameShape=g.profileFrameShape||'rounded';document.body.dataset.ccProfileNameWrap=g.profileNameWrap||'ellipsis';document.body.dataset.ccProfilePicture=g.profilePicture||''; document.body.classList.toggle('cc-hide-helper',!!p.hideHelper);document.body.classList.toggle('cc-hide-subtitle',!!p.hideSubtitle);document.body.classList.toggle('cc-compact-kpi',!!p.compactKpi);document.body.classList.toggle('cc-density-compact',s.density==='compact');document.body.classList.toggle('cc-density-comfortable',s.density==='comfortable');
 setTimeout(()=>{try{enhanceShell()}catch(e){}},0);
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


// Control Center 2.2 — force theme into the Universal Sidebar even when its
// HTML uses unknown classes, is injected late, or lives inside a shadow root.
function ccLuminance(rgb){
  const m=String(rgb||'').match(/[\d.]+/g); if(!m||m.length<3) return 1;
  const a=m.slice(0,3).map(Number).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});
  return .2126*a[0]+.7152*a[1]+.0722*a[2];
}
function ccAllRoots(root=document){
  const roots=[root];
  try{root.querySelectorAll('*').forEach(el=>{if(el.shadowRoot) roots.push(...ccAllRoots(el.shadowRoot));});}catch(e){}
  return roots;
}
function ccFindSidebars(){
  const found=new Set();
  const known='#appSidebar,#erpSidebar,#erp-sidebar,#universalSidebar,#universal-sidebar,#erpUniversalSidebar,.erp-sidebar,.erpSidebar,.universal-sidebar,.universalSidebar,.sidebar-shell,.side-shell,.sidebar-container,.sidebar-wrapper,.left-sidebar,.main-sidebar,.app-side-nav,.sidenav,.side-nav,[data-erp-sidebar],[data-sidebar-root],[data-sidebar]';
  ccAllRoots().forEach(root=>{
    try{root.querySelectorAll(known).forEach(el=>found.add(el));}catch(e){}
    try{root.querySelectorAll('aside,nav,div').forEach(el=>{
      const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
      if(r.width>=38&&r.width<=360&&r.height>=innerHeight*.68&&r.left<=12&&r.top<=110 && ['fixed','sticky','absolute'].includes(cs.position)) found.add(el);
    });}catch(e){}
  });
  return [...found].filter(el=>{
    const r=el.getBoundingClientRect(); return r.width>35&&r.height>innerHeight*.55&&r.left<20;
  });
}
function ccPaintSidebar(side,g){
  const bg=g.sidebar||'#0e1b2f', text=g.sidebarText||'#fff', active=g.sidebarActive||g.accent||'#f59e0b', activeText=g.sidebarActiveText||'#101827', profile=g.profile||bg;
  side.style.setProperty('background',bg,'important');
  side.style.setProperty('background-color',bg,'important');
  side.style.setProperty('color',text,'important');
  side.style.setProperty('--sidebar-bg',bg); side.style.setProperty('--sidebar-background',bg);
  side.style.setProperty('--sidebar-text',text); side.style.setProperty('--sidebar-active',active);
  const nodes=[side,...side.querySelectorAll('*')];
  nodes.forEach(el=>{
    const cls=((el.className&&String(el.className))||'').toLowerCase();
    const role=(el.getAttribute&&((el.getAttribute('role')||'')+' '+(el.getAttribute('aria-current')||''))).toLowerCase();
    const txt=(el.textContent||'').trim();
    if(txt==='ERP Design Studio') el.textContent='Control Center';
    const isProfile=/profile|user-card|account-card/.test(cls);
    const isActive=/\bactive\b|selected|current|menu-active|nav-active/.test(cls)||role.includes('page')||el.getAttribute?.('aria-selected')==='true';
    const isClickable=el.matches?.('a,button,[role="button"],.menu-item,.nav-item,.sidebar-item,.submenu-item');
    if(isProfile){el.style.setProperty('background',profile,'important');el.style.setProperty('background-color',profile,'important');el.style.setProperty('color',text,'important');}
    else if(isActive){el.style.setProperty('background',active,'important');el.style.setProperty('background-color',active,'important');el.style.setProperty('color',activeText,'important');}
    else if(isClickable){el.style.setProperty('color',text,'important');}
    if(el.matches?.('svg,i,.icon,[class*="icon"]')){el.style.setProperty('color','currentColor','important');el.style.setProperty('fill','currentColor','important');}
  });
}
function ccForceShellTheme(){
  const s=load(),g=s.global||{};
  ccFindSidebars().forEach(side=>ccPaintSidebar(side,g));
  // Same-origin frames are also supported.
  document.querySelectorAll('iframe').forEach(fr=>{try{const d=fr.contentDocument;if(!d)return; const oldDoc=document; d.querySelectorAll('aside,nav,[class*="sidebar"],[id*="sidebar"]').forEach(el=>ccPaintSidebar(el,g));}catch(e){}});
}
let ccThemeTimer;
function ccScheduleForce(){clearTimeout(ccThemeTimer);ccForceShellTheme();ccThemeTimer=setTimeout(ccForceShellTheme,80);setTimeout(ccForceShellTheme,350);setTimeout(ccForceShellTheme,1000);}
window.addEventListener('erp-control-center-change',ccScheduleForce);
window.addEventListener('storage',e=>{if(e.key===KEY)ccScheduleForce()});
window.addEventListener('load',ccScheduleForce);
document.addEventListener('click',e=>{if(e.target.closest?.('.theme,[data-setting],#saveBtn'))setTimeout(ccScheduleForce,0)},true);
setInterval(ccForceShellTheme,1500);


function enhanceShell(){
 const g=load().global||{};
 const roots=[document.querySelector('#appSidebar'),document.querySelector('[data-erp-sidebar]'),document.querySelector('.erp-sidebar'),document.querySelector('.universal-sidebar'),document.querySelector('aside')].filter(Boolean);
 roots.forEach(root=>{
   root.classList.add('cc-enhanced-sidebar');
   const links=[...root.querySelectorAll('a,button,.menu-item,.nav-item')];
   links.forEach(el=>{
     const nested=!!el.closest('ul ul,.submenu,[class*=submenu i],[class*=sub-menu i]');
     el.classList.toggle('cc-submenu-item',nested);
     el.classList.toggle('cc-main-menu-item',!nested);
     const txt=(el.textContent||'').trim();
     if(g.sidebarAutoFitLongLabels!==false && txt.length>22) el.classList.add('cc-long-label'); else el.classList.remove('cc-long-label');
   });
   [...root.querySelectorAll('[class*=brand i],[class*=store i],[class*=logo i]')].forEach(el=>el.classList.add('cc-sidebar-brand'));
   const profiles=[...root.querySelectorAll('.profile-card,.sidebar-profile,[class*=profile i]')].filter(el=>!el.closest('[class*=profile i] [class*=profile i]'));
   profiles.forEach(card=>{
      card.classList.add('cc-profile-card');
      const img=card.querySelector('img'); if(img){img.classList.add('cc-profile-photo');if(g.profilePicture)img.src=g.profilePicture;}
      const textEls=[...card.querySelectorAll('strong,b,.name,[class*=name i]')]; if(textEls[0])textEls[0].classList.add('cc-profile-name');
      const role=card.querySelector('small,.role,[class*=role i]'); if(role){role.classList.add('cc-profile-role'); if(g.profileRoleText)role.textContent=g.profileRoleText;}
      const status=card.querySelector('.status,[class*=status i]'); if(status){status.classList.add('cc-profile-status'); const tx=status.querySelector('span')||status; if(g.profileStatusText && tx.childElementCount===0)tx.textContent=g.profileStatusText;}
   });
 });
}
const ccObs=new MutationObserver(()=>enhanceShell());
function startEnhance(){enhanceShell();ccObs.observe(document.body,{subtree:true,childList:true});setTimeout(enhanceShell,250);setTimeout(enhanceShell,900)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startEnhance);else startEnhance();
window.addEventListener('erp-control-center-change',enhanceShell);
})();


// Control Center 2.3 — self-page sidebar synchronizer.
// The legacy shell can repaint its sidebar after the Control Center runtime,
// so this applies the selected theme after every shell render and interaction.
function cc23State(){
  try{return window.ERPControlCenter.load();}catch(e){return {global:{}}}
}
function cc23SidebarCandidates(){
  const out=[];
  document.querySelectorAll('aside,nav,div,section').forEach(el=>{
    try{
      const r=el.getBoundingClientRect(), cs=getComputedStyle(el);
      const left=r.left<=2, tall=r.height>=innerHeight*.70, narrow=r.width>=45&&r.width<=260;
      const positioned=['fixed','sticky','absolute'].includes(cs.position) || r.top<=80;
      if(left&&tall&&narrow&&positioned) out.push(el);
    }catch(e){}
  });
  return out.sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height);
}
function cc23Paint(){
  const st=cc23State(),g=st.global||{};
  const bg=g.sidebar||'#0e1b2f', text=g.sidebarText||'#fff', active=g.sidebarActive||g.accent||'#f59e0b';
  const activeText=g.sidebarActiveText||'#fff', profile=g.profile||bg;
  const side=cc23SidebarCandidates()[0];
  if(!side)return;
  side.dataset.ccThemeSidebar='1';
  side.style.setProperty('background-color',bg,'important');
  side.style.setProperty('background-image','none','important');
  side.style.setProperty('color',text,'important');
  const all=side.querySelectorAll('*');
  all.forEach(el=>{
    const tag=el.tagName;
    if(['A','BUTTON','SPAN','I','SVG','PATH','P','B','STRONG','SMALL','DIV'].includes(tag)){
      el.style.setProperty('--sidebar-text',text);
    }
    if((el.textContent||'').trim()==='ERP Design Studio') el.textContent='Control Center';
  });
  side.querySelectorAll('a,button,[role="button"],.menu-item,.nav-item,.sidebar-item,.side-item').forEach(el=>{
    el.style.setProperty('color',text,'important');
    const cls=String(el.className||'').toLowerCase();
    const aria=el.getAttribute('aria-current');
    if(cls.includes('active')||aria==='page'){
      el.style.setProperty('background-color',active,'important');
      el.style.setProperty('color',activeText,'important');
      el.querySelectorAll('*').forEach(ch=>ch.style.setProperty('color',activeText,'important'));
    }
  });
  side.querySelectorAll('.profile-card,.sidebar-profile,.user-card,[class*="profile"],[class*="user-card"]').forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.width>60&&r.height>30){
      el.style.setProperty('background-color',profile,'important');
      el.style.setProperty('color',text,'important');
      el.querySelectorAll('*').forEach(ch=>ch.style.setProperty('color',text,'important'));
    }
  });
}
window.CC23PaintSidebar=cc23Paint;
function cc23Start(){
  cc23Paint();
  [0,50,150,350,700,1200,2000].forEach(ms=>setTimeout(cc23Paint,ms));
  document.addEventListener('click',()=>[0,30,150,400].forEach(ms=>setTimeout(cc23Paint,ms)),true);
  new MutationObserver(()=>requestAnimationFrame(cc23Paint)).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  setInterval(cc23Paint,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cc23Start);else cc23Start();
