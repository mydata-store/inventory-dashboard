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
,

  renderComponents(config,container){
    const host=typeof container==="string"?document.querySelector(container):container;
    if(!host || !config?.components?.items) return;

    const components=[...config.components.items]
      .filter(component=>component.visible!==false)
      .sort((a,b)=>Number(a.order||0)-Number(b.order||0));

    host.innerHTML=components.map(component=>this.componentMarkup(component)).join("");
  },

  componentMarkup(component){
    const title=AppTools.escapeHtml(component.title||"");
    switch(component.component_type){
      case "summary_cards":
        return `<section class="studio-runtime-component" data-component="${component.key}">
          <h2>${title}</h2>
          <div class="studio-runtime-summary">${(component.items||[]).map(item=>`
            <div class="studio-runtime-summary-card"><small>${AppTools.escapeHtml(item.label)}</small><strong data-value-source="${AppTools.escapeHtml(item.value_source||"")}">0</strong></div>
          `).join("")}</div>
        </section>`;
      case "search_panel":
        return `<section class="studio-runtime-component" data-component="${component.key}">
          <h2>${title}</h2><div class="studio-runtime-form">${(component.fields||[]).map(field=>`
            <label>${AppTools.escapeHtml(field.label)}<input data-filter-key="${AppTools.escapeHtml(field.key)}" type="${field.type==="date"?"text":"text"}"></label>
          `).join("")}</div>
        </section>`;
      case "entry_form":
        return `<section class="studio-runtime-component" data-component="${component.key}"><h2>${title}</h2><div data-component-host="form"></div></section>`;
      case "data_table":
        return `<section class="studio-runtime-component" data-component="${component.key}"><h2>${title}</h2><div data-component-host="table"></div></section>`;
      case "chart_panel":
        return `<section class="studio-runtime-component" data-component="${component.key}"><h2>${title}</h2><canvas data-component-host="chart"></canvas></section>`;
      case "approval_panel":
        return `<section class="studio-runtime-component" data-component="${component.key}"><h2>${title}</h2><div class="detail-box">Approval workflow will appear here.</div></section>`;
      case "attachment_panel":
        return `<section class="studio-runtime-component" data-component="${component.key}"><h2>${title}</h2><input type="file" ${component.multiple?"multiple":""}></section>`;
      case "activity_timeline":
        return `<section class="studio-runtime-component" data-component="${component.key}"><h2>${title}</h2><div data-component-host="timeline"></div></section>`;
      case "notification_panel":
        return `<section class="studio-runtime-component" data-component="${component.key}"><h2>${title}</h2><div data-component-host="notifications"></div></section>`;
      default:
        return `<section class="studio-runtime-component" data-component="${component.key}"><h2>${title}</h2><div data-component-host="${AppTools.escapeHtml(component.component_type||"custom")}"></div></section>`;
    }
  }
};
