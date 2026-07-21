window.ERPDesignBootstrap = {
  pageMap: {
    "index.html":"dashboard",
    "masters.html":"masters",
    "master-center.html":"master_center",
    "rack-management.html":"rack_management",
    "inventory-intelligence.html":"inventory_intelligence",
    "costing.html":"costing",
    "erp-core-settings.html":"erp_core_settings",
    "erp-relationship-center.html":"erp_relationship_center",
    "erp-health-center.html":"erp_health_center",
    "erp-health-control-tower.html":"erp_health_control_tower",
    "purchase-list.html":"purchase_list",
    "issue-entry.html":"issue_entry",
    "rgp-entry.html":"rgp_entry",
    "rgp-list.html":"rgp_list",
    "ogp-entry.html":"ogp_entry",
    "ogp-list.html":"ogp_list"
  },

  detectPageKey(){
    const file=(location.pathname.split("/").pop()||"index.html").toLowerCase();
    if(file==="purchase-entry.html"){
      const type=new URLSearchParams(location.search).get("type")||"local";
      return `${type}_purchase`;
    }
    return this.pageMap[file]||null;
  },

  async init(){
    const pageKey=this.detectPageKey();
    if(!pageKey || !window.supabase) return;

    try{
      const db=window.db || window.supabaseClient || supabase.createClient(
        "https://lzsxtvkluqvcaetnnydu.supabase.co",
        "sb_publishable_QfemUy-S0bO7fy6-uL_jBA_ZzGXKgma"
      );
      const config=await ERPPageRenderer.loadConfig(db,pageKey);
      if(!config) return;
      ERPPageRenderer.applyPageConfig(config);
      this.applyFieldConfig(config);
      this.applyButtonConfig(config);
      this.applyColumnConfig(config);
      this.applySectionConfig(config);
    }catch(error){
      console.warn("ERP Design Studio runtime:",error.message);
    }
  },

  applyFieldConfig(config){
    (config.form?.fields||[]).forEach(field=>{
      const input=document.querySelector(
        `[name="${CSS.escape(field.key)}"],#${CSS.escape(field.key)},[data-field-key="${CSS.escape(field.key)}"]`
      );
      if(!input) return;

      const wrapper=input.closest(".form-field,.field,.input-group");
      const label=wrapper?.querySelector("label");

      if(label && field.label) label.childNodes[0].textContent=field.label+" ";
      if(wrapper) wrapper.style.display=field.visible===false?"none":"";
      input.required=Boolean(field.required);
      input.readOnly=Boolean(field.readonly);
      if(field.placeholder) input.placeholder=field.placeholder;
      if(field.default_value!==undefined && !input.value) input.value=field.default_value;
      if(wrapper && field.span) wrapper.style.gridColumn=`span ${Math.min(Number(field.span),4)}`;
    });
  },

  applyButtonConfig(config){
    (config.buttons?.items||[]).forEach(button=>{
      const element=document.querySelector(
        `[data-action="${CSS.escape(button.key)}"],[data-form-action="${CSS.escape(button.key)}"],#${CSS.escape(button.key)}Btn`
      );
      if(!element) return;
      element.style.display=button.visible===false?"none":"";
      if(button.label) element.textContent=button.label;
      element.style.order=button.order||0;
      if(button.shortcut) element.dataset.shortcut=button.shortcut;
    });
  },

  applyColumnConfig(config){
    const columns=config.table?.columns||[];
    columns.forEach(column=>{
      const selectors=[
        `th[data-key="${CSS.escape(column.key)}"]`,
        `th[data-column="${CSS.escape(column.key)}"]`,
        `th[data-field="${CSS.escape(column.key)}"]`
      ];
      document.querySelectorAll(selectors.join(",")).forEach(th=>{
        if(column.label) th.textContent=column.label;
        th.style.display=column.visible===false?"none":"";
        th.style.textAlign=column.header_align||config.table.header_alignment||"center";
        if(column.width) th.style.width=column.width+"px";
        const index=[...th.parentElement.children].indexOf(th);
        th.closest("table")?.querySelectorAll("tbody tr").forEach(tr=>{
          const td=tr.children[index];
          if(!td) return;
          td.style.display=column.visible===false?"none":"";
          td.style.textAlign=column.cell_align||"left";
        });
      });
    });
  },

  applySectionConfig(config){
    (config.sections?.items||[]).forEach(section=>{
      const element=document.querySelector(
        `[data-section="${CSS.escape(section.key)}"],#${CSS.escape(section.key)}`
      );
      if(!element) return;
      element.style.display=section.visible===false?"none":"";
      element.style.order=section.order||0;
      const heading=element.querySelector("h1,h2,h3,.section-title");
      if(heading && section.title) heading.textContent=section.title;
    });
  }
};

document.addEventListener("DOMContentLoaded",()=>ERPDesignBootstrap.init());
