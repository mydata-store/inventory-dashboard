window.ThemeSettings = {
  storageKey: "inventory_theme_settings_v1",

  defaults: {
    themeMode: "custom",
    pageBackground: "#f4f6fb",
    cardBackground: "#ffffff",
    textColor: "#0f172a",
    mutedTextColor: "#64748b",
    borderColor: "#dbe1ea",
    primaryColor: "#f5a316",
    successColor: "#16a34a",
    dangerColor: "#dc2626",
    infoColor: "#2563eb",

    sidebarBackgroundTop: "#351000",
    sidebarBackgroundBottom: "#1a0600",
    sidebarTextColor: "#ffffff",
    sidebarActiveBackground: "#f5a316",
    sidebarActiveTextColor: "#111827",
    sidebarHoverBackground: "#f5a316",
    sidebarHoverTextColor: "#111827",
    sidebarBorderColor: "rgba(255,255,255,.22)",

    sidebarWidth: 170,
    sidebarHeightMode: "full",
    sidebarCustomHeight: 100,
    sidebarPosition: "fixed",
    sidebarPadding: 10,
    sidebarItemHeight: 34,
    sidebarItemGap: 5,
    sidebarFontSize: 10,
    sidebarRadius: 8,
    sidebarIconSize: 14,

    brandVisible: true,
    brandTitle: "Inventory Store",
    brandSubtitle: "Management System",
    brandIcon: "◆",
    brandIconBackground: "#f5a316",
    brandIconColor: "#ffffff",
    brandIconSize: 30,

    profileVisible: true,
    profileName: "Muhammad Waqas",
    profileStatusText: "Online",
    profileStatusColor: "#22c55e",
    profileCardBackground: "#5b2f1c",
    profileImageSize: 52,
    profileImageBorderColor: "#f5a316",

    menuAccordion: true,
    autoOpenCurrentGroup: true,
    rememberOpenGroup: false,
    showChevrons: true,
    submenuIndent: 8,
    submenuFontSize: 9,

    cardRadius: 15,
    buttonRadius: 8,
    inputRadius: 8,
    tableHeaderColor: "#f5a316",
    tableHeaderTextColor: "#ffffff",
    tableRowHoverColor: "#fff8ec",
    shadowStrength: 7,

    compactMode: false,
    animationsEnabled: true
  },

  presets: {
    current: {},
    navy: {
      pageBackground:"#f5f7fb",primaryColor:"#d7a100",
      sidebarBackgroundTop:"#0f172a",sidebarBackgroundBottom:"#020617",
      sidebarActiveBackground:"#fbbf24",sidebarActiveTextColor:"#111827",
      profileCardBackground:"#1e293b",tableHeaderColor:"#d7a100"
    },
    blue: {
      pageBackground:"#f4f7fb",primaryColor:"#2563eb",
      sidebarBackgroundTop:"#0f2f5f",sidebarBackgroundBottom:"#071a33",
      sidebarActiveBackground:"#3b82f6",sidebarActiveTextColor:"#ffffff",
      profileCardBackground:"#153a68",tableHeaderColor:"#2563eb"
    },
    green: {
      pageBackground:"#f3f8f5",primaryColor:"#16a34a",
      sidebarBackgroundTop:"#11351f",sidebarBackgroundBottom:"#07180e",
      sidebarActiveBackground:"#22c55e",sidebarActiveTextColor:"#052e16",
      profileCardBackground:"#1f4d31",tableHeaderColor:"#16a34a"
    },
    charcoal: {
      pageBackground:"#f3f4f6",primaryColor:"#f59e0b",
      sidebarBackgroundTop:"#27272a",sidebarBackgroundBottom:"#09090b",
      sidebarActiveBackground:"#f59e0b",sidebarActiveTextColor:"#18181b",
      profileCardBackground:"#3f3f46",tableHeaderColor:"#f59e0b"
    }
  },

  get(){
    try{
      const saved = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
      return {...this.defaults, ...saved};
    }catch{
      return {...this.defaults};
    }
  },

  save(settings){
    localStorage.setItem(this.storageKey, JSON.stringify({...this.defaults, ...settings}));
  },

  reset(){
    localStorage.removeItem(this.storageKey);
  },

  applyPreset(name){
    const preset = this.presets[name] || {};
    const next = {...this.get(), ...preset, themeMode:name};
    this.save(next);
    return next;
  },

  apply(settings = this.get()){
    const root = document.documentElement;
    const px = value => `${Number(value)||0}px`;

    root.style.setProperty("--sidebar-width", px(settings.sidebarWidth));
    root.style.setProperty("--page-bg", settings.pageBackground);
    root.style.setProperty("--card-bg", settings.cardBackground);
    root.style.setProperty("--text", settings.textColor);
    root.style.setProperty("--muted", settings.mutedTextColor);
    root.style.setProperty("--border", settings.borderColor);
    root.style.setProperty("--accent", settings.primaryColor);
    root.style.setProperty("--green", settings.successColor);
    root.style.setProperty("--red", settings.dangerColor);
    root.style.setProperty("--blue", settings.infoColor);
    root.style.setProperty("--sidebar-bg-top", settings.sidebarBackgroundTop);
    root.style.setProperty("--sidebar-bg-bottom", settings.sidebarBackgroundBottom);
    root.style.setProperty("--sidebar-text", settings.sidebarTextColor);
    root.style.setProperty("--sidebar-active-bg", settings.sidebarActiveBackground);
    root.style.setProperty("--sidebar-active-text", settings.sidebarActiveTextColor);
    root.style.setProperty("--sidebar-hover-bg", settings.sidebarHoverBackground);
    root.style.setProperty("--sidebar-hover-text", settings.sidebarHoverTextColor);
    root.style.setProperty("--sidebar-border", settings.sidebarBorderColor);
    root.style.setProperty("--sidebar-padding", px(settings.sidebarPadding));
    root.style.setProperty("--sidebar-item-height", px(settings.sidebarItemHeight));
    root.style.setProperty("--sidebar-item-gap", px(settings.sidebarItemGap));
    root.style.setProperty("--sidebar-font-size", px(settings.sidebarFontSize));
    root.style.setProperty("--sidebar-radius", px(settings.sidebarRadius));
    root.style.setProperty("--brand-icon-size", px(settings.brandIconSize));
    root.style.setProperty("--profile-card-bg", settings.profileCardBackground);
    root.style.setProperty("--profile-image-size", px(settings.profileImageSize));
    root.style.setProperty("--profile-border", settings.profileImageBorderColor);
    root.style.setProperty("--submenu-indent", px(settings.submenuIndent));
    root.style.setProperty("--submenu-font-size", px(settings.submenuFontSize));
    root.style.setProperty("--card-radius", px(settings.cardRadius));
    root.style.setProperty("--button-radius", px(settings.buttonRadius));
    root.style.setProperty("--input-radius", px(settings.inputRadius));
    root.style.setProperty("--table-header-bg", settings.tableHeaderColor);
    root.style.setProperty("--table-header-text", settings.tableHeaderTextColor);
    root.style.setProperty("--table-row-hover", settings.tableRowHoverColor);
    root.style.setProperty("--shadow-strength", String(settings.shadowStrength));

    document.body.classList.toggle("compact-mode", Boolean(settings.compactMode));
    document.body.classList.toggle("no-animations", !settings.animationsEnabled);

    const sidebar = document.querySelector(".app-sidebar");
    if(sidebar){
      sidebar.style.position = settings.sidebarPosition;
      if(settings.sidebarHeightMode === "custom"){
        sidebar.style.height = `${Number(settings.sidebarCustomHeight)||100}vh`;
      }else{
        sidebar.style.height = "100vh";
      }
    }
  }
};

document.addEventListener("DOMContentLoaded",()=>{
  ThemeSettings.apply();
});
