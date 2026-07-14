window.ERPCore = class {
  constructor({db}){
    this.db = db;
    this.settings = {};
  }

  async loadSettings(){
    const {data,error}=await this.db.from("erp_settings").select("*").order("setting_key");
    if(error) throw error;
    this.settings = {};
    (data||[]).forEach(row=>{
      let value=row.setting_value;
      try{ value=JSON.parse(value); }catch{}
      this.settings[row.setting_key]=value;
    });
    return this.settings;
  }

  getSetting(key,fallback=null){
    return this.settings[key] ?? fallback;
  }

  async saveSetting(key,value,group="general"){
    const payload={
      setting_key:key,
      setting_value:typeof value==="string"?value:JSON.stringify(value),
      setting_group:group,
      updated_at:new Date().toISOString()
    };
    const {error}=await this.db.from("erp_settings").upsert(payload,{onConflict:"setting_key"});
    if(error) throw error;
    this.settings[key]=value;
  }

  async nextNumber(type){
    const {data,error}=await this.db.rpc("next_erp_number",{p_type:type});
    if(error) throw error;
    return data;
  }

  async previewNumber(type){
    const {data,error}=await this.db.from("erp_number_sequences").select("*").eq("sequence_type",type).maybeSingle();
    if(error) throw error;
    if(!data) return null;
    return `${data.prefix}${String(data.last_number+1).padStart(data.padding,"0")}${data.suffix||""}`;
  }

  async getItemRelation(itemId){
    const {data:item,error}=await this.db.from("items").select("*").eq("id",itemId).single();
    if(error) throw error;

    const [allocRes,txRes] = await Promise.all([
      this.db.from("rack_item_allocations").select("*").eq("item_id",itemId),
      this.db.from("stock_transactions").select("*").eq("item_code",item.item_code).order("transaction_date",{ascending:false})
    ]);

    if(allocRes.error) throw allocRes.error;
    if(txRes.error) throw txRes.error;

    const allocations=allocRes.data||[];
    const transactions=txRes.data||[];
    const purchases=transactions.filter(r=>String(r.transaction_type||"").toLowerCase().includes("purchase"));

    const lastPurchase=purchases[0]||null;
    const currentStock=transactions.reduce((sum,r)=>sum+Number(r.quantity_in||0)-Number(r.quantity_out||0),0);
    const reserved=allocations.reduce((sum,r)=>sum+Number(r.assigned_qty||0),0);

    return {
      item,
      allocations,
      current_stock:currentStock,
      allocated_stock:reserved,
      unallocated_stock:currentStock-reserved,
      last_purchase_rate:Number(lastPurchase?.unit_rate||lastPurchase?.rate||0),
      last_supplier:lastPurchase?.supplier||lastPurchase?.supplier_name||"",
      last_purchase_date:lastPurchase?.transaction_date||null
    };
  }

  async postStockTransaction(payload){
    const required=["transaction_type","transaction_date","item_code","item_name"];
    for(const key of required){
      if(!payload[key]) throw new Error(`${key.replaceAll("_"," ")} is required.`);
    }

    const qtyIn=Number(payload.quantity_in||0);
    const qtyOut=Number(payload.quantity_out||0);
    if(qtyIn<0||qtyOut<0) throw new Error("Stock quantity cannot be negative.");

    const preventNegative=this.getSetting("prevent_negative_stock",true);
    if(preventNegative && qtyOut>0){
      const {data,error}=await this.db.from("stock_transactions").select("quantity_in,quantity_out").eq("item_code",payload.item_code);
      if(error) throw error;
      const current=(data||[]).reduce((s,r)=>s+Number(r.quantity_in||0)-Number(r.quantity_out||0),0);
      if(qtyOut>current) throw new Error(`Insufficient stock. Available: ${current}`);
    }

    const {data,error}=await this.db.from("stock_transactions").insert([payload]).select().single();
    if(error) throw error;

    await this.audit({
      action:"CREATE",
      module:"Stock",
      record_type:payload.transaction_type,
      record_id:data.id,
      new_data:payload
    });

    return data;
  }

  async audit({action,module,record_type,record_id,old_data=null,new_data=null,user_name="Muhammad Waqas"}){
    const {error}=await this.db.from("audit_log").insert([{
      action,module,record_type,record_id:String(record_id??""),
      old_data,new_data,user_name,created_at:new Date().toISOString()
    }]);
    if(error) throw error;
  }

  async getDashboardAlerts(){
    const [itemsRes,txRes,rgpRes,vehiclesRes] = await Promise.all([
      this.db.from("items").select("*"),
      this.db.from("stock_transactions").select("*"),
      this.db.from("rgp_master").select("*"),
      this.db.from("vehicles").select("*")
    ]);

    const items=itemsRes.data||[];
    const tx=txRes.data||[];
    const rgp=rgpRes.data||[];
    const vehicles=vehiclesRes.data||[];

    const balances=new Map();
    tx.forEach(r=>{
      const key=r.item_code||r.item_name;
      balances.set(key,(balances.get(key)||0)+Number(r.quantity_in||0)-Number(r.quantity_out||0));
    });

    const lowStock=items.filter(i=>{
      const balance=balances.get(i.item_code||i.item_name)||0;
      const min=Number(i.reorder_level||i.minimum_stock||0);
      return balance<=min;
    });

    const pendingRgp=rgp.filter(r=>!["closed","completed"].includes(String(r.status||"").toLowerCase()));
    const today=new Date();
    const expiringVehicles=vehicles.filter(v=>{
      if(!v.registration_expiry) return false;
      const d=new Date(v.registration_expiry);
      const days=(d-today)/(1000*60*60*24);
      return days>=0&&days<=30;
    });

    return {
      low_stock:lowStock,
      pending_rgp:pendingRgp,
      expiring_vehicles:expiringVehicles
    };
  }
};
