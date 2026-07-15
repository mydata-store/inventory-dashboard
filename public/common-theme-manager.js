window.ERPThemeManager = {
  storageKey: "erp_theme_manager_v1",

  presets: {
    eyeComfortNavy: {
      name: "Eye Comfort Navy",
      pageBackground: "#f8fafc",
      workspaceBackground: "#eef3f8",
      cardBackground: "#ffffff",
      primaryText: "#0f172a",
      mutedText: "#64748b",
      borderColor: "#dbe3ee",
      primaryColor: "#2563eb",
      secondaryColor: "#f59e0b",
      successColor: "#16a34a",
      warningColor: "#f97316",
      dangerColor: "#dc2626",
      infoColor: "#2563eb",
      topBarBackground: "#0f172a",
      topBarText: "#ffffff",
      sidebarBackground: "#111827",
      sidebarText: "#ffffff",
      activeBackground: "#f59e0b",
      activeText: "#111827",
      hoverBackground: "#1e293b",
      hoverText: "#ffffff",
      tableHeaderBackground: "#f59e0b",
      tableHeaderText: "#111827",
      tableRowHover: "#f8fafc",
      tableAlternateRow: "#fbfdff",
      inputBackground: "#ffffff",
      inputBorder: "#cbd5e1",
      buttonRadius: 8,
      cardRadius: 12,
      inputRadius: 8,
      shadowStrength: "soft",
      fontFamily: "Inter, Arial, sans-serif",
      baseFontSize: 14,
      density: "comfortable",
      darkMode: false
    },
    professionalBlue: {
      name: "Professional Blue",
      pageBackground: "#f4f7fb",
      workspaceBackground: "#eaf0f7",
      cardBackground: "#ffffff",
      primaryText: "#10233f",
      mutedText: "#6b7c93",
      borderColor: "#d7e0eb",
      primaryColor: "#1d4ed8",
      secondaryColor: "#f59e0b",
      successColor: "#15803d",
      warningColor: "#d97706",
      dangerColor: "#b91c1c",
      infoColor: "#1d4ed8",
      topBarBackground: "#10233f",
      topBarText: "#ffffff",
      sidebarBackground: "#163052",
      sidebarText: "#ffffff",
      activeBackground: "#2563eb",
      activeText: "#ffffff",
      hoverBackground: "#1e3a5f",
      hoverText: "#ffffff",
      tableHeaderBackground: "#1d4ed8",
      tableHeaderText: "#ffffff",
      tableRowHover: "#eef4ff",
      tableAlternateRow: "#f8fbff",
      inputBackground: "#ffffff",
      inputBorder: "#c7d3e2",
      buttonRadius: 8,
      cardRadius: 12,
      inputRadius: 8,
      shadowStrength: "soft",
      fontFamily: "Inter, Arial, sans-serif",
      baseFontSize: 14,
      density: "comfortable",
      darkMode: false
    },
    storeGreen: {
      name: "Store Green",
      pageBackground: "#f7faf8",
      workspaceBackground: "#edf5ef",
      cardBackground: "#ffffff",
      primaryText: "#15311f",
      mutedText: "#6b7f70",
      borderColor: "#d7e5da",
      primaryColor: "#15803d",
      secondaryColor: "#f59e0b",
      successColor: "#15803d",
      warningColor: "#d97706",
      dangerColor: "#b91c1c",
      infoColor: "#2563eb",
      topBarBackground: "#15311f",
      topBarText: "#ffffff",
      sidebarBackground: "#1c3b27",
      sidebarText: "#ffffff",
      activeBackground: "#f59e0b",
      activeText: "#111827",
      hoverBackground: "#275333",
      hoverText: "#ffffff",
      tableHeaderBackground: "#15803d",
      tableHeaderText: "#ffffff",
      tableRowHover: "#f0fdf4",
      tableAlternateRow: "#f8fdf9",
      inputBackground: "#ffffff",
      inputBorder: "#c8d9cd",
      buttonRadius: 8,
      cardRadius: 12,
      inputRadius: 8,
      shadowStrength: "soft",
      fontFamily: "Inter, Arial, sans-serif",
      baseFontSize: 14,
      density: "comfortable",
      darkMode: false
    },
    charcoal: {
      name: "Charcoal",
      pageBackground: "#f6f7f9",
      workspaceBackground: "#eceff3",
      cardBackground: "#ffffff",
      primaryText: "#18181b",
      mutedText: "#71717a",
      borderColor: "#d9dce1",
      primaryColor: "#27272a",
      secondaryColor: "#f59e0b",
      successColor: "#16a34a",
      warningColor: "#f97316",
      dangerColor: "#dc2626",
      infoColor: "#2563eb",
      topBarBackground: "#18181b",
      topBarText: "#ffffff",
      sidebarBackground: "#27272a",
      sidebarText: "#ffffff",
      activeBackground: "#f59e0b",
      activeText: "#111827",
      hoverBackground: "#3f3f46",
      hoverText: "#ffffff",
      tableHeaderBackground: "#27272a",
      tableHeaderText: "#ffffff",
      tableRowHover: "#f4f4f5",
      tableAlternateRow: "#fafafa",
      inputBackground: "#ffffff",
      inputBorder: "#d4d4d8",
      buttonRadius: 8,
      cardRadius: 10,
      inputRadius: 8,
      shadowStrength: "soft",
      fontFamily: "Inter, Arial, sans-serif",
      baseFontSize: 14,
      density: "comfortable",
      darkMode: false
    }
  },

  getLocal(){
    try{
      const saved=JSON.parse(localStorage.getItem(this.storageKey)||"{}");
      return {...this.presets.eyeComfortNavy,...saved};
    }catch{
      return {...this.presets.eyeComfortNavy};
    }
  },

  setLocal(theme){
    const merged={...this.presets.eyeComfortNavy,...theme};
    localStorage.setItem(this.storageKey,JSON.stringify(merged));
    return merged;
  },

  async load(db){
    const local=this.getLocal();
    if(!db)return local;
    try{
      const {data,error}=await db.from("erp_theme_settings")
        .select("theme_json")
        .eq("setting_key","global")
        .maybeSingle();
      if(error)throw error;
      if(data?.theme_json)return this.setLocal({...local,...data.theme_json});
    }catch(error){
      console.warn("ERP Theme Manager:",error.message);
    }
    return local;
  },

  async save(db,theme){
    const merged=this.setLocal(theme);
    if(db){
      const {error}=await db.from("erp_theme_settings").upsert({
        setting_key:"global",
        theme_json:merged,
        updated_by:"Muhammad Waqas",
        updated_at:new Date().toISOString()
      },{onConflict:"setting_key"});
      if(error)throw error;
    }
    this.apply(merged);
    window.dispatchEvent(new CustomEvent("erp-theme-changed",{detail:merged}));
    return merged;
  },

  apply(theme){
    const t={...this.presets.eyeComfortNavy,...theme};
    const root=document.documentElement;
    const shadow=t.shadowStrength==="none"?"none":
      t.shadowStrength==="strong"?"0 12px 30px rgba(15,23,42,.16)":
      "0 6px 18px rgba(15,23,42,.08)";

    const vars={
      "--page-bg":t.pageBackground,
      "--workspace-bg":t.workspaceBackground,
      "--card-bg":t.cardBackground,
      "--text":t.primaryText,
      "--muted":t.mutedText,
      "--border":t.borderColor,
      "--primary":t.primaryColor,
      "--accent":t.secondaryColor,
      "--success":t.successColor,
      "--warning":t.warningColor,
      "--danger":t.dangerColor,
      "--info":t.infoColor,
      "--sidebar-bg":t.sidebarBackground,
      "--sidebar-text":t.sidebarText,
      "--active-bg":t.activeBackground,
      "--active-text":t.activeText,
      "--hover-bg":t.hoverBackground,
      "--hover-text":t.hoverText,
      "--table-header-bg":t.tableHeaderBackground,
      "--table-header-text":t.tableHeaderText,
      "--table-row-hover":t.tableRowHover,
      "--table-alt-row":t.tableAlternateRow,
      "--input-bg":t.inputBackground,
      "--input-border":t.inputBorder,
      "--card-radius":`${Number(t.cardRadius||12)}px`,
      "--button-radius":`${Number(t.buttonRadius||8)}px`,
      "--input-radius":`${Number(t.inputRadius||8)}px`,
      "--theme-shadow":shadow,
      "--base-font-size":`${Number(t.baseFontSize||14)}px`
    };
    Object.entries(vars).forEach(([k,v])=>root.style.setProperty(k,v));

    document.body.style.fontFamily=t.fontFamily||"Inter, Arial, sans-serif";
    document.body.classList.toggle("erp-density-compact",t.density==="compact");
    document.body.classList.toggle("erp-density-comfortable",t.density!=="compact");
    document.body.classList.toggle("erp-dark-mode",Boolean(t.darkMode));
  },

  preview(theme,host){
    if(!host)return;
    const t={...this.presets.eyeComfortNavy,...theme};
    host.innerHTML=`
      <div style="background:${t.pageBackground};padding:12px;border-radius:12px;border:1px solid ${t.borderColor}">
        <div style="background:${t.topBarBackground};color:${t.topBarText};height:42px;border-radius:9px;display:flex;align-items:center;padding:0 10px;border-bottom:3px solid ${t.secondaryColor}">
          <strong style="font-size:10px">ERP INVENTORY SYSTEM</strong>
        </div>
        <div style="display:grid;grid-template-columns:92px 1fr;gap:9px;margin-top:9px">
          <div style="background:${t.sidebarBackground};color:${t.sidebarText};border-radius:9px;padding:8px">
            <div style="background:${t.activeBackground};color:${t.activeText};padding:7px;border-radius:7px;font-size:8px">Dashboard</div>
            <div style="padding:7px;font-size:8px">Masters</div>
            <div style="padding:7px;font-size:8px">Purchase</div>
          </div>
          <div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px">
              <div style="background:${t.cardBackground};border:1px solid ${t.borderColor};border-radius:${t.cardRadius}px;padding:9px;box-shadow:${t.shadowStrength==="none"?"none":"0 4px 12px rgba(15,23,42,.07)"}"><small style="color:${t.mutedText}">Total Items</small><strong style="display:block;color:${t.primaryText};font-size:14px">2,458</strong></div>
              <div style="background:${t.cardBackground};border:1px solid ${t.borderColor};border-radius:${t.cardRadius}px;padding:9px"><small style="color:${t.mutedText}">Purchases</small><strong style="display:block;color:${t.warningColor};font-size:14px">PKR 3.2M</strong></div>
              <div style="background:${t.cardBackground};border:1px solid ${t.borderColor};border-radius:${t.cardRadius}px;padding:9px"><small style="color:${t.mutedText}">Low Stock</small><strong style="display:block;color:${t.dangerColor};font-size:14px">34</strong></div>
            </div>
            <table style="width:100%;margin-top:8px;border-collapse:collapse;background:${t.cardBackground};color:${t.primaryText}">
              <thead><tr>${["Date","Supplier","Amount"].map(x=>`<th style="background:${t.tableHeaderBackground};color:${t.tableHeaderText};padding:6px;font-size:7px;text-align:center">${x}</th>`).join("")}</tr></thead>
              <tbody><tr><td style="padding:6px;border-bottom:1px solid ${t.borderColor};font-size:7px">14-Jul-26</td><td style="padding:6px;border-bottom:1px solid ${t.borderColor};font-size:7px">Shoukat Store</td><td style="padding:6px;border-bottom:1px solid ${t.borderColor};font-size:7px;text-align:right">PKR 125,450</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>`;
  }
};

document.addEventListener("DOMContentLoaded",async()=>{
  const local=ERPThemeManager.getLocal();
  ERPThemeManager.apply(local);
  if(!window.supabase)return;
  try{
    const db=window.db||window.supabaseClient||supabase.createClient(
      "https://lzsxtvkluqvcaetnnydu.supabase.co",
      "sb_publishable_QfemUy-S0bO7fy6-uL_jBA_ZzGXKgma"
    );
    const remote=await ERPThemeManager.load(db);
    ERPThemeManager.apply(remote);
  }catch(error){
    console.warn(error.message);
  }
});
