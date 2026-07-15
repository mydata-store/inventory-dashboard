window.ERPShellSettings = {
  storageKey: "erp_shell_settings_v1",

  defaults: {
    navigationPosition: "top",
    startupPage: "erp-design-studio.html",
    stickyNavigation: true,
    compactTopBar: false,
    showBrand: true,
    brandTitle: "Inventory Store",
    brandSubtitle: "Management System",
    showSearch: false,
    showDateTime: true,
    showNotifications: true,
    showQuickActions: false,

    sidebarWidth: 170,
    sidebarCollapsedWidth: 58,
    sidebarDefaultCollapsed: false,
    sidebarAutoCollapse: false,
    sidebarHoverExpand: false,

    profileVisible: true,
    profilePosition: "top-left",
    profileLayout: "horizontal",
    profileMode: "compact",
    profileName: "Muhammad Waqas",
    profileDesignation: "Store Officer",
    profileDepartment: "Store Department",
    profileEmployeeCode: "",
    profileCompany: "",
    profileSubtitle: "",
    profileStatusText: "Online",
    profileStatusColor: "#22c55e",
    profileImage: "public/waqas.jpg.png",
    profileImageSize: 38,
    profileImageShape: "circle",
    profileCardWidth: 190,
    profileCardHeight: 52,
    profileCardBackground: "#111827",
    profileTextColor: "#ffffff",
    profileRadius: 10,
    profileShadow: true,
    profileShowDesignation: true,
    profileShowDepartment: false,
    profileShowEmployeeCode: false,
    profileShowCompany: false,
    profileShowStatus: true,
    profileHideMobile: false,
    profileAction: "none",

    topBarHeight: 64,
    topBarBackground: "#0f172a",
    topBarTextColor: "#ffffff",
    activeColor: "#f59e0b",
    contentMaxWidth: "none"
  },

  getLocal(){
    try{
      return {...this.defaults,...JSON.parse(localStorage.getItem(this.storageKey)||"{}")};
    }catch{
      return {...this.defaults};
    }
  },

  setLocal(settings){
    const merged={...this.defaults,...settings};
    localStorage.setItem(this.storageKey,JSON.stringify(merged));
    return merged;
  },

  async load(db){
    const local=this.getLocal();
    if(!db) return local;
    try{
      const {data,error}=await db.from("erp_shell_settings")
        .select("settings_json")
        .eq("setting_key","global")
        .maybeSingle();
      if(error) throw error;
      if(data?.settings_json){
        return this.setLocal({...local,...data.settings_json});
      }
    }catch(error){
      console.warn("ERP shell settings:",error.message);
    }
    return local;
  },

  async save(db,settings){
    const merged=this.setLocal(settings);
    if(db){
      const {error}=await db.from("erp_shell_settings").upsert({
        setting_key:"global",
        settings_json:merged,
        updated_by:"Muhammad Waqas",
        updated_at:new Date().toISOString()
      },{onConflict:"setting_key"});
      if(error) throw error;
    }
    window.dispatchEvent(new CustomEvent("erp-shell-settings-changed",{detail:merged}));
    return merged;
  },

  profileMarkup(settings,location="top"){
    if(settings.profileVisible===false) return "";
    if(location==="top" && !String(settings.profilePosition).startsWith("top")) return "";
    if(location==="left" && !String(settings.profilePosition).startsWith("left")) return "";

    const details=[];
    if(settings.profileShowDesignation!==false && settings.profileDesignation) details.push(settings.profileDesignation);
    if(settings.profileShowDepartment && settings.profileDepartment) details.push(settings.profileDepartment);
    if(settings.profileShowEmployeeCode && settings.profileEmployeeCode) details.push(settings.profileEmployeeCode);
    if(settings.profileShowCompany && settings.profileCompany) details.push(settings.profileCompany);
    if(settings.profileSubtitle) details.push(settings.profileSubtitle);

    return `<button class="erp-profile-card erp-profile-${settings.profileLayout||"horizontal"} erp-profile-${settings.profileMode||"compact"}"
      data-profile-action="${settings.profileAction||"none"}"
      style="
        --profile-bg:${settings.profileCardBackground};
        --profile-text:${settings.profileTextColor};
        --profile-radius:${Number(settings.profileRadius||10)}px;
        --profile-width:${Number(settings.profileCardWidth||190)}px;
        --profile-height:${Number(settings.profileCardHeight||52)}px;
        --profile-image-size:${Number(settings.profileImageSize||38)}px;
        --profile-shadow:${settings.profileShadow!==false?"0 5px 18px rgba(0,0,0,.18)":"none"};
      ">
      <img src="${settings.profileImage||"public/profile.png"}"
        class="${settings.profileImageShape==="square"?"square":"circle"}"
        onerror="this.src='public/profile.png'">
      <span class="erp-profile-copy">
        <strong>${window.AppTools?.escapeHtml?.(settings.profileName)||settings.profileName}</strong>
        ${details.length?`<small>${window.AppTools?.escapeHtml?.(details.join(" • "))||details.join(" • ")}</small>`:""}
        ${settings.profileShowStatus!==false?`<em><i style="background:${settings.profileStatusColor}"></i>${window.AppTools?.escapeHtml?.(settings.profileStatusText)||settings.profileStatusText}</em>`:""}
      </span>
    </button>`;
  }
};
