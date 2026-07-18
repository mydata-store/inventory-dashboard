(function(){
"use strict";
const K={published:"erp_control_published_v1",draft:"erp_control_draft_v1",theme:"erp_theme_manager_v2",shell:"erp_shell_settings_v1",fonts:"erp_font_settings_v1",profiles:"erp_profile_controller_v1",autofill:"erp_autofill_controller_v1"};
const parse=(k,f={})=>{try{return JSON.parse(localStorage.getItem(k)||"")||f}catch{return f}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

function activeProfile(){
  const store=parse(K.profiles,{profiles:[]});
  return store.profiles?.find(p=>p.id===store.activeProfileId)||store.profiles?.[0]||null;
}
function profileToShell(p){
  if(!p)return {};
  const g=p.general||{},c=p.card||{},d=p.display||{},pic=p.picture||{};
  const image=pic.dataUrl||pic.url||"public/waqas.jpg.png";
  return {
    profileVisible:p.status!=="inactive",
    profileName:g.fullName||"Muhammad Waqas",
    profileDesignation:g.designation||"",
    profileDepartment:g.department||"",
    profileImage:image,
    profileCardBackground:c.backgroundColor||"#0f172a",
    profileTextColor:c.textColor||"#ffffff",
    profileRadius:Number(c.radius||12),
    profileCardWidth:Number(c.width||260),
    profileCardHeight:Number(c.height||104),
    profileImageSize:Number(c.pictureSize||58),
    profileImageShape:c.pictureShape||"circle",
    profileTextAlign:c.textAlign||"left",
    profilePicturePosition:c.picturePosition||"left",
    profileBorderStyle:c.borderStyle||"solid",
    profileBorderWidth:Number(c.borderWidth||1),
    profileBorderColor:c.borderColor||"#334155",
    profileShadow:c.shadow||"soft",
    profileShowName:d.name!==false,
    profileShowDesignation:d.designation===true,
    profileShowDepartment:d.department===true,
    profileShowEmployeeCode:d.employeeCode===true,
    profileShowCompany:d.company===true,
    profileShowBranch:d.branch===true,
    profileShowMobile:d.mobile===true,
    profileShowEmail:d.email===true,
    profileShowWelcome:d.welcome===true,
    profileShowStatus:c.onlineStatus!==false,
    profileStatusText:"Online",
    profileStatusColor:"#16a34a",
    profilePosition:"left-bottom",
    profileSingleOnly:true
  };
}
function fontToTheme(fonts,theme){
  if(!fonts||!Object.keys(fonts).length)return theme;
  const family=fonts.family||"Segoe UI, Arial, sans-serif",copy={...theme,fonts:{...(theme.fonts||{})}};
  const sizes={body:Number(fonts.baseSize||12),title:Number(fonts.baseSize||12)+8,subtitle:Number(fonts.baseSize||12)-1,
    section:Number(fonts.baseSize||12)+1,tableHeader:Number(fonts.tableSize||10),tableBody:Number(fonts.tableSize||10),
    formLabel:Math.max(8,Number(fonts.formSize||11)-2),formInput:Number(fonts.formSize||11),button:Math.max(8,Number(fonts.formSize||11)-2)};
  Object.entries(sizes).forEach(([k,size])=>copy.fonts[k]={...(copy.fonts[k]||{}),family,size});
  if(copy.fonts.title)copy.fonts.title.weight=Number(fonts.headingWeight||800);
  return copy;
}
function themeFromProfile(profile,current){
  const preset=profile?.theme?.assignedTheme;
  if(!preset||!window.ERPThemeManager?.presets?.[preset])return current;
  const base=window.ERPThemeManager.mergedPreset(preset);
  return {...base,...current,name:base.name,primaryColor:profile.theme.accentColor||current.primaryColor||base.primaryColor,
    buttonStyle:profile.theme.buttonStyle||current.buttonStyle||base.buttonStyle};
}

const Runtime={
  version:"41.7.0",
  collect(){
    const profile=activeProfile(),fonts=parse(K.fonts,{}),shell=parse(K.shell,{});
    let theme=parse(K.theme,{});
    theme=themeFromProfile(profile,theme);
    theme=fontToTheme(fonts,theme);
    return {theme,shell:{...shell,...profileToShell(profile)},fonts,profile,autofill:parse(K.autofill,{})};
  },
  apply({silent=false}={}){
    const s=this.collect();
    if(window.ERPThemeManager){
      const theme=window.ERPThemeManager.setLocal(s.theme);
      window.ERPThemeManager.apply(theme);
    }
    save(K.shell,s.shell);
    if(window.ERPUniversalShell?.render)window.ERPUniversalShell.render(s.shell);
    this.applyGenericTheme(s.theme);
    this.applyProfile(s.profile);
    window.ERPAutofillSettings=s.autofill||{};
    if(!silent){
      window.dispatchEvent(new CustomEvent("erp-design-published",{detail:s}));
      window.dispatchEvent(new CustomEvent("erp-theme-changed",{detail:s.theme}));
      window.dispatchEvent(new CustomEvent("erp-shell-settings-changed",{detail:s.shell}));
    }
    return s;
  },
  applyGenericTheme(t={}){
    const root=document.documentElement;
    const vars={"--erp-primary":t.primaryColor,"--erp-secondary":t.secondaryColor,"--erp-accent":t.secondaryColor,
      "--erp-bg":t.pageBackground,"--erp-surface":t.cardBackground,"--erp-text":t.primaryText,"--erp-border":t.borderColor,
      "--erp-sidebar-bg":t.sidebarBackground,"--erp-sidebar-text":t.sidebarText,"--erp-active-bg":t.activeBackground,"--erp-active-text":t.activeText};
    Object.entries(vars).forEach(([k,v])=>{if(v)root.style.setProperty(k,v)});
    document.body.dataset.erpTheme=String(t.name||"custom").replace(/\s+/g,"-").toLowerCase();
  },
  applyProfile(p){
    if(!p)return;const g=p.general||{};
    document.querySelectorAll("[data-erp-profile-name],.profile-name").forEach(el=>el.textContent=g.fullName||"");
    document.querySelectorAll("[data-erp-profile-designation],.profile-role").forEach(el=>el.textContent=g.designation||"");
    document.querySelectorAll("[data-erp-profile-department],.profile-department").forEach(el=>el.textContent=g.department||"");
  },
  publish(meta={}){
    const store=parse(K.profiles,{profiles:[]});
    if(store.profiles?.length){
      const currentId=window.currentProfileId||store.activeProfileId||store.profiles[0].id;
      store.activeProfileId=currentId;
      save(K.profiles,store);
    }
    const settings=this.collect(),old=parse(K.published,{version:0});
    const next={...settings,version:Number(old.version||0)+1,runtimeVersion:this.version,publishedAt:new Date().toISOString(),publishedBy:"Muhammad Waqas",...meta};
    save(K.published,next);save(K.draft,next);this.apply();
    return next;
  },
  sync(){
    const p=parse(K.published,null);
    if(p){if(p.theme)save(K.theme,p.theme);if(p.shell)save(K.shell,p.shell);if(p.fonts)save(K.fonts,p.fonts);if(p.autofill)save(K.autofill,p.autofill)}
    return this.apply({silent:true});
  }
};
window.ERPDesignStudioRuntime=Runtime;
function boot(){
  Runtime.sync();
  ["erp-theme-changed","erp-shell-settings-changed","erp-profile-changed","erp-font-settings-changed"].forEach(n=>window.addEventListener(n,()=>setTimeout(()=>Runtime.apply({silent:true}),0)));
  window.addEventListener("storage",e=>{if(Object.values(K).includes(e.key))Runtime.sync()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
