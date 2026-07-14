window.ERPRelations = class {
  constructor({db}){
    this.db = db;
    this.cache = {};
  }

  async loadMasters(){
    const queries = {
      items: this.db.from("items").select("*").order("item_name"),
      departments: this.db.from("departments").select("*").order("department_name"),
      workshops: this.db.from("workshops").select("*").order("workshop_name"),
      carriers: this.db.from("carriers").select("*").order("carrier_name"),
      vehicles: this.db.from("vehicles").select("*").order("vehicle_no"),
      employees: this.db.from("employees").select("*").order("employee_name"),
      authorities: this.db.from("authorized_persons").select("*").order("person_name"),
      locations: this.db.from("store_locations").select("*").order("location_name"),
      allocations: this.db.from("rack_item_allocations").select("*")
    };

    const entries = await Promise.all(
      Object.entries(queries).map(async ([key,promise]) => {
        const result = await promise;
        if(result.error) throw result.error;
        return [key,result.data || []];
      })
    );

    this.cache = Object.fromEntries(entries);
    return this.cache;
  }

  itemLabel(item){
    return [item.item_name,item.size].filter(Boolean).join(" - ");
  }

  findItem(id){
    return this.cache.items?.find(x => Number(x.id) === Number(id)) || null;
  }

  findDepartment(id){
    return this.cache.departments?.find(x => Number(x.id) === Number(id)) || null;
  }

  findWorkshop(id){
    return this.cache.workshops?.find(x => Number(x.id) === Number(id)) || null;
  }

  findCarrier(id){
    return this.cache.carriers?.find(x => Number(x.id) === Number(id)) || null;
  }

  findVehicle(id){
    return this.cache.vehicles?.find(x => Number(x.id) === Number(id)) || null;
  }

  async getItemRelations(itemId){
    const item = this.findItem(itemId);
    if(!item) throw new Error("Item not found.");

    const [txResult,supplierResult] = await Promise.all([
      this.db.from("stock_transactions").select("*")
        .eq("item_code",item.item_code)
        .order("transaction_date",{ascending:false}),
      this.db.from("suppliers").select("*")
    ]);

    if(txResult.error) throw txResult.error;
    if(supplierResult.error) throw supplierResult.error;

    const transactions = txResult.data || [];
    const purchases = transactions.filter(row =>
      String(row.transaction_type || "").toLowerCase().includes("purchase")
    );

    const lastPurchase = purchases[0] || null;
    const purchaseQty = purchases.reduce((sum,row) =>
      sum + Number(row.quantity_in || row.qty || row.quantity || 0),0
    );
    const purchaseValue = purchases.reduce((sum,row) => {
      const qty = Number(row.quantity_in || row.qty || row.quantity || 0);
      const rate = Number(row.unit_rate || row.rate || 0);
      return sum + qty * rate;
    },0);

    const currentStock = transactions.reduce((sum,row) =>
      sum + Number(row.quantity_in || 0) - Number(row.quantity_out || 0),0
    );

    const allocations = (this.cache.allocations || []).filter(row =>
      Number(row.item_id) === Number(itemId)
    );

    const allocatedStock = allocations.reduce((sum,row) =>
      sum + Number(row.assigned_qty || 0),0
    );

    const preferredSupplier = (supplierResult.data || []).find(supplier =>
      String(supplier.supplier_name || "").toLowerCase() ===
      String(lastPurchase?.supplier || lastPurchase?.supplier_name || "").toLowerCase()
    ) || null;

    return {
      item,
      current_stock: currentStock,
      allocated_stock: allocatedStock,
      unallocated_stock: currentStock - allocatedStock,
      last_purchase_rate: Number(lastPurchase?.unit_rate || lastPurchase?.rate || 0),
      average_purchase_rate: purchaseQty ? purchaseValue / purchaseQty : 0,
      last_purchase_date: lastPurchase?.transaction_date || null,
      last_supplier_name: lastPurchase?.supplier || lastPurchase?.supplier_name || "",
      preferred_supplier: preferredSupplier,
      rack_locations: allocations,
      primary_rack: allocations.find(x => String(x.primary_location).toLowerCase() === "yes") || allocations[0] || null
    };
  }

  getDepartmentRelations(departmentId){
    const department = this.findDepartment(departmentId);
    if(!department) throw new Error("Department not found.");

    const authorities = (this.cache.authorities || []).filter(person =>
      String(person.department || "").trim().toLowerCase() ===
      String(department.department_name || "").trim().toLowerCase()
    );

    const employees = (this.cache.employees || []).filter(person =>
      String(person.department || "").trim().toLowerCase() ===
      String(department.department_name || "").trim().toLowerCase()
    );

    return {
      department,
      authorities,
      employees,
      default_authority: authorities[0] || null,
      responsible_person: department.responsible_person || "",
      signature_authority: department.signature_authority || ""
    };
  }

  getWorkshopRelations(workshopId){
    const workshop = this.findWorkshop(workshopId);
    if(!workshop) throw new Error("Workshop not found.");

    const defaultCarrier = (this.cache.carriers || []).find(carrier =>
      String(carrier.carrier_name || "").trim().toLowerCase() ===
      String(workshop.default_carrier || "").trim().toLowerCase()
    ) || null;

    return {
      workshop,
      default_carrier: defaultCarrier
    };
  }

  getCarrierRelations(carrierId){
    const carrier = this.findCarrier(carrierId);
    if(!carrier) throw new Error("Carrier not found.");

    const vehicle = (this.cache.vehicles || []).find(v =>
      String(v.vehicle_no || "").trim().toLowerCase() ===
      String(carrier.vehicle_no || "").trim().toLowerCase()
    ) || null;

    return {
      carrier,
      default_vehicle: vehicle,
      mobile_no: carrier.mobile_no || "",
      cnic: carrier.cnic || ""
    };
  }

  getVehicleRelations(vehicleId){
    const vehicle = this.findVehicle(vehicleId);
    if(!vehicle) throw new Error("Vehicle not found.");

    const carrier = (this.cache.carriers || []).find(c =>
      String(c.vehicle_no || "").trim().toLowerCase() ===
      String(vehicle.vehicle_no || "").trim().toLowerCase()
    ) || null;

    return {
      vehicle,
      carrier,
      driver_name: vehicle.driver_name || "",
      driver_mobile: vehicle.driver_mobile || ""
    };
  }

  async saveRelationship(type,payload){
    const {error} = await this.db.from("erp_relationships").upsert({
      relation_type:type,
      source_table:payload.source_table,
      source_id:String(payload.source_id),
      target_table:payload.target_table,
      target_id:String(payload.target_id),
      relation_data:payload.relation_data || {},
      active:true,
      updated_at:new Date().toISOString()
    },{
      onConflict:"relation_type,source_table,source_id,target_table,target_id"
    });

    if(error) throw error;
  }

  async listRelationships(){
    const {data,error}=await this.db.from("erp_relationships")
      .select("*")
      .order("updated_at",{ascending:false});
    if(error) throw error;
    return data || [];
  }
};
