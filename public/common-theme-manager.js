
window.ERPThemeManager = {
  storageKey: "erp_theme_manager_v2",

  baseFonts: {
    body:{family:"Inter, Arial, sans-serif",size:12,weight:400,color:"#0f172a",letterSpacing:0,lineHeight:1.45},
    sidebar:{family:"Inter, Arial, sans-serif",size:9,weight:700,color:"#ffffff",letterSpacing:0,lineHeight:1.2},
    topbar:{family:"Inter, Arial, sans-serif",size:11,weight:700,color:"#ffffff",letterSpacing:0,lineHeight:1.2},
    title:{family:"Inter, Arial, sans-serif",size:20,weight:800,color:"#0f172a",letterSpacing:0,lineHeight:1.2},
    subtitle:{family:"Inter, Arial, sans-serif",size:10,weight:400,color:"#64748b",letterSpacing:0,lineHeight:1.4},
    section:{family:"Inter, Arial, sans-serif",size:12,weight:800,color:"#0f172a",letterSpacing:0,lineHeight:1.25},
    tableHeader:{family:"Inter, Arial, sans-serif",size:10,weight:800,color:"#111827",letterSpacing:0,lineHeight:1.2},
    tableBody:{family:"Inter, Arial, sans-serif",size:10,weight:400,color:"#0f172a",letterSpacing:0,lineHeight:1.3},
    formLabel:{family:"Inter, Arial, sans-serif",size:9,weight:800,color:"#475569",letterSpacing:0,lineHeight:1.2},
    formInput:{family:"Inter, Arial, sans-serif",size:11,weight:400,color:"#0f172a",letterSpacing:0,lineHeight:1.3},
    button:{family:"Inter, Arial, sans-serif",size:9,weight:800,color:"#ffffff",letterSpacing:0,lineHeight:1.1},
    graphTitle:{family:"Inter, Arial, sans-serif",size:12,weight:800,color:"#0f172a",letterSpacing:0,lineHeight:1.2},
    graphLabel:{family:"Inter, Arial, sans-serif",size:9,weight:500,color:"#64748b",letterSpacing:0,lineHeight:1.2}
  },

  presets: {
    eyeComfortNavy: {
      name:"Eye Comfort Navy",pageLayout:"full",pageWidth:1440,pageMaxWidth:1900,pageMinHeight:700,pagePadding:16,sectionGap:12,
      pageBackground:"#f8fafc",workspaceBackground:"#eef3f8",cardBackground:"#ffffff",primaryText:"#0f172a",mutedText:"#64748b",
      borderColor:"#dbe3ee",cardBorderWidth:1,cardRadius:12,cardPadding:14,shadowStrength:"soft",
      primaryColor:"#2563eb",secondaryColor:"#f59e0b",successColor:"#16a34a",warningColor:"#f97316",dangerColor:"#dc2626",infoColor:"#2563eb",
      primaryButtonText:"#ffffff",secondaryButtonText:"#111827",
      topBarBackground:"#0f172a",topBarText:"#ffffff",sidebarBackground:"#111827",sidebarText:"#ffffff",activeBackground:"#f59e0b",activeText:"#111827",
      hoverBackground:"#1e293b",hoverText:"#ffffff",headerHeight:58,freezeHeader:true,headerAlignment:"left",
      showTitle:true,titleColor:"#0f172a",showSubtitle:true,subtitleColor:"#64748b",titleAlignment:"left",titleSpacing:6,
      tableHeaderBackground:"#f59e0b",tableHeaderText:"#111827",tableHeaderHeight:38,tableHeaderAlignment:"center",freezeTableHeader:true,frozenColumns:0,
      tableRowHeight:36,tableAlternateRow:"#fbfdff",tableRowHover:"#f8fafc",tableBorderColor:"#dbe3ee",tableBorderWidth:1,tableDensity:"comfortable",tableZebra:true,tableGridLines:true,
      inputBackground:"#ffffff",inputBorder:"#cbd5e1",inputRadius:8,
      buttonHeight:34,buttonRadius:8,buttonBorderWidth:0,buttonIconPosition:"left",buttonHoverEffect:"lift",buttonShadow:"soft",
      graphType:"bar",graphHeight:300,graphBackground:"#ffffff",graphPrimaryColor:"#2563eb",graphSecondaryColor:"#f59e0b",graphGridColor:"#dbe3ee",
      graphLegendPosition:"top",graphAnimation:true,graphDataLabels:true,graphTooltips:true,graphGridLines:true,graphExport:"both",
      density:"comfortable",darkMode:false,fonts:null
    },
    professionalBlue: {
      name:"Professional Blue",pageBackground:"#f4f7fb",workspaceBackground:"#eaf0f7",cardBackground:"#ffffff",primaryText:"#10233f",mutedText:"#6b7c93",
      borderColor:"#d7e0eb",primaryColor:"#1d4ed8",secondaryColor:"#f59e0b",successColor:"#15803d",warningColor:"#d97706",dangerColor:"#b91c1c",infoColor:"#1d4ed8",
      topBarBackground:"#10233f",topBarText:"#ffffff",sidebarBackground:"#163052",sidebarText:"#ffffff",activeBackground:"#2563eb",activeText:"#ffffff",
      tableHeaderBackground:"#1d4ed8",tableHeaderText:"#ffffff",tableAlternateRow:"#f8fbff",tableRowHover:"#eef4ff",
      graphPrimaryColor:"#1d4ed8",graphSecondaryColor:"#f59e0b"
    },
    storeGreen: {
      name:"Store Green",pageBackground:"#f7faf8",workspaceBackground:"#edf5ef",cardBackground:"#ffffff",primaryText:"#15311f",mutedText:"#6b7f70",
      borderColor:"#d7e5da",primaryColor:"#15803d",secondaryColor:"#f59e0b",successColor:"#15803d",warningColor:"#d97706",dangerColor:"#b91c1c",infoColor:"#2563eb",
      topBarBackground:"#15311f",topBarText:"#ffffff",sidebarBackground:"#1c3b27",sidebarText:"#ffffff",activeBackground:"#f59e0b",activeText:"#111827",
      tableHeaderBackground:"#15803d",tableHeaderText:"#ffffff",tableAlternateRow:"#f8fdf9",tableRowHover:"#f0fdf4",
      graphPrimaryColor:"#15803d",graphSecondaryColor:"#f59e0b"
    },
    charcoal: {
      name:"Charcoal",pageBackground:"#f6f7f9",workspaceBackground:"#eceff3",cardBackground:"#ffffff",primaryText:"#18181b",mutedText:"#71717a",
      borderColor:"#d9dce1",primaryColor:"#27272a",secondaryColor:"#f59e0b",successColor:"#16a34a",warningColor:"#f97316",dangerColor:"#dc2626",infoColor:"#2563eb",
      topBarBackground:"#18181b",topBarText:"#ffffff",sidebarBackground:"#27272a",sidebarText:"#ffffff",activeBackground:"#f59e0b",activeText:"#111827",
      tableHeaderBackground:"#27272a",tableHeaderText:"#ffffff",tableAlternateRow:"#fafafa",tableRowHover:"#f4f4f5",
      graphPrimaryColor:"#27272a",graphSecondaryColor:"#f59e0b"
    }
  },

  mergedPreset(name="eyeComfortNavy"){
    const base=structuredClone(this.presets.eyeComfortNavy);
    const selected=this.presets[name]||{};
    const merged={...base,...selected};
    merged.fonts=structuredClone(this.baseFonts);
    return merged;
  },

  getLocal(){
    try{
      const saved=JSON.parse(localStorage.getItem(this.storageKey)||"{}");
      const base=this.mergedPreset("eyeComfortNavy");
      return {...base,...saved,fonts:{...base.fonts,...(saved.fonts||{})}};
    }catch{
      return this.mergedPreset("eyeComfortNavy");
    }
  },

  setLocal(theme){
    const base=this.mergedPreset("eyeComfortNavy");
    const merged={...base,...theme,fonts:{...base.fonts,...(theme.fonts||{})}};
    localStorage.setItem(this.storageKey,JSON.stringify(merged));
    return merged;
  },

  async load(db,{scope="global",pageKey=""}={}){
    const local=this.getLocal();
    if(!db)return local;
    const settingKey=scope==="global"?"global":`${scope}:${pageKey}`;
    try{
      const {data,error}=await db.from("erp_theme_settings").select("theme_json").eq("setting_key",settingKey).maybeSingle();
      if(error)throw error;
      if(data?.theme_json)return this.setLocal({...local,...data.theme_json});
    }catch(error){console.warn("ERP Theme Manager:",error.message)}
    return local;
  },

  async save(db,theme,{scope="global",pageKey=""}={}){
    const merged=this.setLocal(theme);
    const settingKey=scope==="global"?"global":`${scope}:${pageKey}`;
    if(db){
      const {error}=await db.from("erp_theme_settings").upsert({
        setting_key:settingKey,theme_json:merged,updated_by:"Muhammad Waqas",updated_at:new Date().toISOString()
      },{onConflict:"setting_key"});
      if(error)throw error;
    }
    this.apply(merged);
    window.dispatchEvent(new CustomEvent("erp-theme-changed",{detail:merged}));
    return merged;
  },

  cssFontVars(fonts){
    const vars={};
    Object.entries(fonts||{}).forEach(([key,f])=>{
      const k=key.replace(/[A-Z]/g,m=>"-"+m.toLowerCase());
      vars[`--font-${k}-family`]=f.family;
      vars[`--font-${k}-size`]=`${Number(f.size||10)}px`;
      vars[`--font-${k}-weight`]=f.weight;
      vars[`--font-${k}-color`]=f.color;
      vars[`--font-${k}-spacing`]=`${Number(f.letterSpacing||0)}px`;
      vars[`--font-${k}-line-height`]=f.lineHeight;
    });
    return vars;
  },

  apply(theme){
    const t={...this.mergedPreset("eyeComfortNavy"),...theme};
    const root=document.documentElement;
    const shadow=t.shadowStrength==="none"?"none":t.shadowStrength==="strong"?"0 14px 34px rgba(15,23,42,.18)":t.shadowStrength==="medium"?"0 10px 24px rgba(15,23,42,.12)":"0 6px 18px rgba(15,23,42,.08)";
    const buttonShadow=t.buttonShadow==="none"?"none":t.buttonShadow==="strong"?"0 8px 18px rgba(15,23,42,.22)":"0 4px 10px rgba(15,23,42,.12)";
    const vars={
      "--page-bg":t.pageBackground,"--workspace-bg":t.workspaceBackground,"--card-bg":t.cardBackground,"--text":t.primaryText,"--muted":t.mutedText,
      "--border":t.borderColor,"--primary":t.primaryColor,"--accent":t.secondaryColor,"--success":t.successColor,"--warning":t.warningColor,"--danger":t.dangerColor,"--info":t.infoColor,
      "--topbar-bg":t.topBarBackground,"--topbar-text":t.topBarText,"--sidebar-bg":t.sidebarBackground,"--sidebar-text":t.sidebarText,
      "--active-bg":t.activeBackground,"--active-text":t.activeText,"--hover-bg":t.hoverBackground,"--hover-text":t.hoverText,
      "--page-width":`${Number(t.pageWidth)}px`,"--page-max-width":`${Number(t.pageMaxWidth)}px`,"--page-min-height":`${Number(t.pageMinHeight)}px`,
      "--page-padding":`${Number(t.pagePadding)}px`,"--section-gap":`${Number(t.sectionGap)}px`,
      "--card-radius":`${Number(t.cardRadius)}px`,"--card-padding":`${Number(t.cardPadding)}px`,"--card-border-width":`${Number(t.cardBorderWidth)}px`,"--theme-shadow":shadow,
      "--header-height":`${Number(t.headerHeight)}px`,
      "--table-header-bg":t.tableHeaderBackground,"--table-header-text":t.tableHeaderText,"--table-header-height":`${Number(t.tableHeaderHeight)}px`,
      "--table-row-height":`${Number(t.tableRowHeight)}px`,"--table-row-hover":t.tableRowHover,"--table-alt-row":t.tableAlternateRow,
      "--table-border":t.tableBorderColor,"--table-border-width":`${Number(t.tableBorderWidth)}px`,
      "--input-bg":t.inputBackground,"--input-border":t.inputBorder,"--input-radius":`${Number(t.inputRadius||8)}px`,
      "--button-height":`${Number(t.buttonHeight)}px`,"--button-radius":`${Number(t.buttonRadius)}px`,"--button-border-width":`${Number(t.buttonBorderWidth)}px`,"--button-shadow":buttonShadow,
      "--graph-bg":t.graphBackground,"--graph-primary":t.graphPrimaryColor,"--graph-secondary":t.graphSecondaryColor,"--graph-grid":t.graphGridColor,
      ...this.cssFontVars(t.fonts)
    };
    Object.entries(vars).forEach(([k,v])=>root.style.setProperty(k,v));
    document.body.style.fontFamily=t.fonts?.body?.family||"Inter, Arial, sans-serif";
    document.body.classList.toggle("erp-freeze-header",Boolean(t.freezeHeader));
    document.body.classList.toggle("erp-freeze-table-header",Boolean(t.freezeTableHeader));
    document.body.classList.toggle("erp-table-zebra",Boolean(t.tableZebra));
    document.body.classList.toggle("erp-table-grid",Boolean(t.tableGridLines));
    document.body.dataset.themeButtonHover=t.buttonHoverEffect||"lift";
    document.body.dataset.pageLayout=t.pageLayout||"full";
  },

  previewAdvanced(theme,host){
    if(!host)return;
    const t={...this.mergedPreset("eyeComfortNavy"),...theme,fonts:{...this.baseFonts,...(theme.fonts||{})}};
    const f=t.fonts;
    const shadow=t.shadowStrength==="none"?"none":t.shadowStrength==="strong"?"0 14px 34px rgba(15,23,42,.18)":t.shadowStrength==="medium"?"0 10px 24px rgba(15,23,42,.12)":"0 6px 18px rgba(15,23,42,.08)";
    const vars={
      "--pv-page":t.pageBackground,"--pv-card":t.cardBackground,"--pv-border":t.borderColor,"--pv-top":t.topBarBackground,"--pv-top-text":t.topBarText,
      "--pv-side":t.sidebarBackground,"--pv-active":t.activeBackground,"--pv-accent":t.secondaryColor,
      "--pv-title-font":f.title.family,"--pv-title-size":`${f.title.size}px`,"--pv-title-weight":f.title.weight,"--pv-title-color":f.title.color||t.titleColor,"--pv-title-align":t.titleAlignment,
      "--pv-subtitle-font":f.subtitle.family,"--pv-subtitle-size":`${f.subtitle.size}px`,"--pv-subtitle-weight":f.subtitle.weight,"--pv-subtitle-color":f.subtitle.color||t.subtitleColor,
      "--pv-card-radius":`${t.cardRadius}px`,"--pv-card-border-width":`${t.cardBorderWidth}px`,"--pv-shadow":shadow,
      "--pv-primary":t.primaryColor,"--pv-success":t.successColor,"--pv-danger":t.dangerColor,
      "--pv-button-height":`${t.buttonHeight}px`,"--pv-button-radius":`${t.buttonRadius}px`,"--pv-button-border-width":`${t.buttonBorderWidth}px`,
      "--pv-button-font":f.button.family,"--pv-button-size":`${f.button.size}px`,"--pv-button-weight":f.button.weight,
      "--pv-table-font":f.tableBody.family,"--pv-table-size":`${f.tableBody.size}px`,
      "--pv-th-height":`${t.tableHeaderHeight}px`,"--pv-th-bg":t.tableHeaderBackground,"--pv-th-text":t.tableHeaderText,"--pv-th-align":t.tableHeaderAlignment,
      "--pv-row-height":`${t.tableRowHeight}px`,"--pv-table-border":t.tableBorderColor,"--pv-alt-row":t.tableAlternateRow,
      "--pv-graph-bg":t.graphBackground,"--pv-graph-primary":t.graphPrimaryColor,"--pv-graph-secondary":t.graphSecondaryColor
    };
    Object.entries(vars).forEach(([k,v])=>host.style.setProperty(k,v));
    host.querySelector(".theme-preview-title").style.display=t.showTitle===false?"none":"block";
    host.querySelector(".theme-preview-subtitle").style.display=t.showSubtitle===false?"none":"block";
    const graph=host.querySelector(".theme-preview-graph");
    graph.style.height=`${Math.max(90,Math.min(220,Number(t.graphHeight)/2))}px`;
    const bars=[48,78,62,92,55];
    graph.querySelectorAll("span").forEach((el,i)=>{
      if(t.graphType==="line"){el.style.height="5px";el.style.marginBottom=`${bars[i]}px`;el.style.borderRadius="5px"}
      else if(t.graphType==="pie"||t.graphType==="doughnut"){el.style.display=i===0?"block":"none";el.style.height="110px";el.style.maxWidth="110px";el.style.borderRadius="50%";el.style.background=`conic-gradient(${t.graphPrimaryColor} 0 40%,${t.graphSecondaryColor} 40% 70%,${t.successColor} 70% 100%)`}
      else {el.style.display="block";el.style.height=`${bars[i]}%`;el.style.marginBottom="0";el.style.borderRadius="5px 5px 0 0"}
    });
  },

  preview(theme,host){this.previewAdvanced(theme,host)}
};

document.addEventListener("DOMContentLoaded",async()=>{
  const t=await ERPThemeManager.load(window.db||null);
  ERPThemeManager.apply(t);
});
