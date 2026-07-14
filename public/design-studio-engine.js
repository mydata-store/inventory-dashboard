window.ERPDesignStudio = class {
  constructor({db}){
    this.db = db;
    this.pages = [];
    this.currentPage = null;
    this.currentVersion = null;
  }

  async loadPages(){
    const {data,error}=await this.db.from("erp_page_definitions")
      .select("*")
      .order("page_group")
      .order("page_name");
    if(error) throw error;
    this.pages=data||[];
    return this.pages;
  }

  async getPage(pageKey){
    const {data,error}=await this.db.from("erp_page_definitions")
      .select("*")
      .eq("page_key",pageKey)
      .single();
    if(error) throw error;
    this.currentPage=data;

    const {data:version,error:versionError}=await this.db.from("erp_page_versions")
      .select("*")
      .eq("page_key",pageKey)
      .eq("is_published",true)
      .order("version_no",{ascending:false})
      .limit(1)
      .maybeSingle();

    if(versionError) throw versionError;
    this.currentVersion=version||null;
    return {page:data,version};
  }

  async saveDraft(pageKey,config,userName="Muhammad Waqas"){
    const {data:last,error:lastError}=await this.db.from("erp_page_versions")
      .select("version_no")
      .eq("page_key",pageKey)
      .order("version_no",{ascending:false})
      .limit(1)
      .maybeSingle();
    if(lastError) throw lastError;

    const versionNo=Number(last?.version_no||0)+1;
    const {data,error}=await this.db.from("erp_page_versions").insert([{
      page_key:pageKey,
      version_no:versionNo,
      config_json:config,
      is_published:false,
      created_by:userName,
      created_at:new Date().toISOString()
    }]).select().single();

    if(error) throw error;
    return data;
  }

  async publishVersion(versionId,pageKey,userName="Muhammad Waqas"){
    const off=await this.db.from("erp_page_versions")
      .update({is_published:false})
      .eq("page_key",pageKey);
    if(off.error) throw off.error;

    const on=await this.db.from("erp_page_versions")
      .update({
        is_published:true,
        published_by:userName,
        published_at:new Date().toISOString()
      })
      .eq("id",versionId);
    if(on.error) throw on.error;

    const stamp=await this.db.from("erp_page_definitions")
      .update({updated_at:new Date().toISOString()})
      .eq("page_key",pageKey);
    if(stamp.error) throw stamp.error;
  }

  async listVersions(pageKey){
    const {data,error}=await this.db.from("erp_page_versions")
      .select("*")
      .eq("page_key",pageKey)
      .order("version_no",{ascending:false});
    if(error) throw error;
    return data||[];
  }

  async restoreVersion(versionId,pageKey){
    await this.publishVersion(versionId,pageKey);
  }

  async upsertPageDefinition(payload){
    const {data,error}=await this.db.from("erp_page_definitions")
      .upsert(payload,{onConflict:"page_key"})
      .select()
      .single();
    if(error) throw error;
    return data;
  }

  defaultConfig(page){
    return {
      general:{
        page_title:page?.page_name||"",
        page_subtitle:page?.page_description||"",
        menu_label:page?.menu_label||page?.page_name||"",
        page_type:page?.page_type||"standard",
        default_tab:"",
        page_width:"full",
        card_radius:14,
        section_gap:12
      },
      form:{
        fields:[]
      },
      table:{
        header_alignment:"center",
        header_height:42,
        header_font_size:11,
        header_bold:true,
        row_height:38,
        freeze_header:true,
        zebra_rows:false,
        columns:[]
      },
      buttons:{
        items:[
          {key:"new",label:"New",visible:true,order:1,shortcut:"Ctrl+N"},
          {key:"save",label:"Save",visible:true,order:2,shortcut:"Ctrl+S"},
          {key:"clear",label:"Clear",visible:true,order:3,shortcut:"Esc"},
          {key:"print",label:"Print / PDF",visible:true,order:4,shortcut:"Ctrl+P"}
        ]
      },
      pdf:{
        title:page?.page_name||"",
        orientation:"landscape",
        show_logo:true,
        show_footer:true
      },
      sections:{
        items:[]
      }
    };
  }
};
