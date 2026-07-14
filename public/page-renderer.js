window.ERPPageRenderer = {
  async loadConfig(db,pageKey){
    const {data,error}=await db.from("erp_page_versions")
      .select("config_json")
      .eq("page_key",pageKey)
      .eq("is_published",true)
      .order("version_no",{ascending:false})
      .limit(1)
      .maybeSingle();
    if(error) throw error;
    return data?.config_json||null;
  },

  applyPageConfig(config){
    if(!config) return;
    const title=document.querySelector("[data-page-title], .page-head h1, h1");
    const subtitle=document.querySelector("[data-page-subtitle], .page-subtitle");

    if(title && config.general?.page_title) title.textContent=config.general.page_title;
    if(subtitle && config.general?.page_subtitle) subtitle.textContent=config.general.page_subtitle;

    document.documentElement.style.setProperty("--studio-card-radius",(config.general?.card_radius||14)+"px");
    document.documentElement.style.setProperty("--studio-section-gap",(config.general?.section_gap||12)+"px");
    document.documentElement.style.setProperty("--studio-table-header-height",(config.table?.header_height||42)+"px");
    document.documentElement.style.setProperty("--studio-table-row-height",(config.table?.row_height||38)+"px");
    document.documentElement.style.setProperty("--studio-table-header-align",config.table?.header_alignment||"center");

    const style=document.createElement("style");
    style.id="erpDesignStudioRuntime";
    style.textContent=`
      .card{border-radius:var(--studio-card-radius)!important}
      .app-table th,.data-table th{text-align:var(--studio-table-header-align)!important;height:var(--studio-table-header-height)!important}
      .app-table td,.data-table td{height:var(--studio-table-row-height)!important}
    `;
    document.getElementById(style.id)?.remove();
    document.head.appendChild(style);
  }
};
