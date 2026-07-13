window.InventoryIntelligence = class {
  constructor(options={}){
    this.options = {
      db: null,
      transactionTable: "stock_transactions",
      itemTable: "items",
      purchaseTypes: ["purchase","local purchase","zafar purchase","board purchase","opening balance"],
      issueTypes: ["issue"],
      rgpOutTypes: ["rgp out"],
      rgpReturnTypes: ["rgp return"],
      ogpOutTypes: ["ogp out"],
      deadStockDays: 180,
      slowMovingDays: 90,
      lowStockDefault: 0,
      ...options
    };

    this.db = this.options.db;
    this.transactions = [];
    this.items = [];
    this.itemMetrics = [];
    this.summary = {};
  }

  normalizeType(value){
    return String(value||"").trim().toLowerCase();
  }

  number(value){
    const n = Number(String(value??"").replace(/,/g,""));
    return Number.isFinite(n) ? n : 0;
  }

  date(value){
    if(!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  daysSince(value){
    const d = this.date(value);
    if(!d) return null;
    const today = new Date();
    today.setHours(0,0,0,0);
    d.setHours(0,0,0,0);
    return Math.floor((today-d)/(1000*60*60*24));
  }

  itemKey(row){
    const code = row.item_code || row.code || "";
    if(code) return String(code).trim().toLowerCase();
    return [
      row.item_name || row.item || row.product_name || "",
      row.size || row.item_size || ""
    ].join("|").trim().toLowerCase();
  }

  transactionQtyIn(row){
    return this.number(
      row.quantity_in ?? row.qty_in ?? row.received_qty ?? row.purchase_qty ?? 0
    );
  }

  transactionQtyOut(row){
    return this.number(
      row.quantity_out ?? row.qty_out ?? row.issue_qty ?? row.sent_qty ?? 0
    );
  }

  transactionRate(row){
    return this.number(
      row.unit_rate ?? row.rate ?? row.purchase_rate ?? row.last_purchase_rate ?? 0
    );
  }

  transactionDate(row){
    return row.transaction_date || row.date || row.created_at || null;
  }

  transactionType(row){
    return this.normalizeType(row.transaction_type || row.type || row.entry_type);
  }

  async load(){
    if(!this.db) throw new Error("Supabase client is required.");

    const [txResult,itemResult] = await Promise.all([
      this.db.from(this.options.transactionTable).select("*").order("transaction_date",{ascending:true}),
      this.db.from(this.options.itemTable).select("*")
    ]);

    if(txResult.error) throw txResult.error;
    if(itemResult.error) throw itemResult.error;

    this.transactions = txResult.data || [];
    this.items = itemResult.data || [];

    this.calculate();
    return {
      summary:this.summary,
      items:this.itemMetrics,
      transactions:this.transactions
    };
  }

  calculate(){
    const grouped = new Map();

    const ensure = row => {
      const key = this.itemKey(row);
      if(!grouped.has(key)){
        grouped.set(key,{
          key,
          item_code:row.item_code || row.code || "",
          item_name:row.item_name || row.item || row.product_name || "",
          size:row.size || row.item_size || "",
          unit:row.unit || "",
          category:row.category || "",
          opening_qty:0,
          purchase_qty:0,
          issue_qty:0,
          rgp_out_qty:0,
          rgp_return_qty:0,
          ogp_out_qty:0,
          current_stock:0,
          reserved_stock:0,
          available_stock:0,
          last_purchase_rate:0,
          average_rate:0,
          stock_value:0,
          last_purchase_date:null,
          last_issue_date:null,
          last_movement_date:null,
          movement_count:0,
          monthly_consumption:0,
          reorder_level:this.number(row.reorder_level ?? row.minimum_stock ?? row.min_stock ?? this.options.lowStockDefault),
          status:"Normal"
        });
      }
      return grouped.get(key);
    };

    this.items.forEach(item => ensure(item));

    const purchaseTypes = new Set(this.options.purchaseTypes.map(x=>this.normalizeType(x)));
    const issueTypes = new Set(this.options.issueTypes.map(x=>this.normalizeType(x)));
    const rgpOutTypes = new Set(this.options.rgpOutTypes.map(x=>this.normalizeType(x)));
    const rgpReturnTypes = new Set(this.options.rgpReturnTypes.map(x=>this.normalizeType(x)));
    const ogpOutTypes = new Set(this.options.ogpOutTypes.map(x=>this.normalizeType(x)));

    const now = new Date();
    const monthStart = new Date(now.getFullYear(),now.getMonth(),1);

    this.transactions.forEach(row=>{
      const metric = ensure(row);
      const type = this.transactionType(row);
      const qtyIn = this.transactionQtyIn(row);
      const qtyOut = this.transactionQtyOut(row);
      const rate = this.transactionRate(row);
      const d = this.date(this.transactionDate(row));

      metric.movement_count++;
      if(d && (!metric.last_movement_date || d > new Date(metric.last_movement_date))){
        metric.last_movement_date = d.toISOString();
      }

      if(type === "opening balance"){
        metric.opening_qty += qtyIn || qtyOut;
      }

      if(purchaseTypes.has(type)){
        const qty = qtyIn || this.number(row.quantity || row.qty);
        metric.purchase_qty += qty;
        if(rate>0){
          metric.last_purchase_rate = rate;
          metric.last_purchase_date = d ? d.toISOString() : metric.last_purchase_date;
        }
      }

      if(issueTypes.has(type)){
        metric.issue_qty += qtyOut || this.number(row.quantity || row.qty);
        if(d) metric.last_issue_date = d.toISOString();
        if(d && d >= monthStart){
          metric.monthly_consumption += qtyOut || this.number(row.quantity || row.qty);
        }
      }

      if(rgpOutTypes.has(type)) metric.rgp_out_qty += qtyOut || this.number(row.quantity || row.qty);
      if(rgpReturnTypes.has(type)) metric.rgp_return_qty += qtyIn || this.number(row.quantity || row.qty);
      if(ogpOutTypes.has(type)) metric.ogp_out_qty += qtyOut || this.number(row.quantity || row.qty);

      metric.current_stock += qtyIn - qtyOut;
    });

    grouped.forEach(metric=>{
      const purchases = this.transactions.filter(row =>
        this.itemKey(row)===metric.key &&
        purchaseTypes.has(this.transactionType(row)) &&
        this.transactionRate(row)>0
      );

      const purchaseValue = purchases.reduce((sum,row)=>{
        const qty = this.transactionQtyIn(row) || this.number(row.quantity || row.qty);
        return sum + qty*this.transactionRate(row);
      },0);
      const purchaseQty = purchases.reduce((sum,row)=>{
        return sum + (this.transactionQtyIn(row) || this.number(row.quantity || row.qty));
      },0);

      metric.average_rate = purchaseQty ? purchaseValue/purchaseQty : metric.last_purchase_rate;
      metric.reserved_stock = Math.max(metric.rgp_out_qty - metric.rgp_return_qty,0);
      metric.available_stock = metric.current_stock - metric.reserved_stock;
      metric.stock_value = metric.current_stock * (metric.average_rate || metric.last_purchase_rate || 0);

      const age = this.daysSince(metric.last_movement_date);
      if(metric.current_stock <= metric.reorder_level){
        metric.status = "Low Stock";
      }else if(age !== null && age >= this.options.deadStockDays){
        metric.status = "Dead Stock";
      }else if(age !== null && age >= this.options.slowMovingDays){
        metric.status = "Slow Moving";
      }else{
        metric.status = "Normal";
      }
    });

    this.itemMetrics = [...grouped.values()].sort((a,b)=>
      String(a.item_name).localeCompare(String(b.item_name),undefined,{numeric:true,sensitivity:"base"})
    );

    this.summary = {
      total_items:this.itemMetrics.length,
      current_stock_value:this.itemMetrics.reduce((s,x)=>s+x.stock_value,0),
      low_stock_items:this.itemMetrics.filter(x=>x.status==="Low Stock").length,
      slow_moving_items:this.itemMetrics.filter(x=>x.status==="Slow Moving").length,
      dead_stock_items:this.itemMetrics.filter(x=>x.status==="Dead Stock").length,
      reserved_stock_qty:this.itemMetrics.reduce((s,x)=>s+x.reserved_stock,0),
      available_stock_qty:this.itemMetrics.reduce((s,x)=>s+x.available_stock,0),
      negative_stock_items:this.itemMetrics.filter(x=>x.current_stock<0).length
    };
  }

  getItemMetrics(query=""){
    const q = String(query||"").trim().toLowerCase();
    if(!q) return [...this.itemMetrics];
    return this.itemMetrics.filter(x=>
      [x.item_code,x.item_name,x.size,x.unit,x.category,x.status]
        .join(" ").toLowerCase().includes(q)
    );
  }

  getLowStock(){
    return this.itemMetrics.filter(x=>x.status==="Low Stock");
  }

  getSlowMoving(){
    return this.itemMetrics.filter(x=>x.status==="Slow Moving");
  }

  getDeadStock(){
    return this.itemMetrics.filter(x=>x.status==="Dead Stock");
  }

  getNegativeStock(){
    return this.itemMetrics.filter(x=>x.current_stock<0);
  }

  getReorderSuggestions(){
    return this.itemMetrics
      .filter(x=>x.current_stock<=x.reorder_level)
      .map(x=>({
        ...x,
        suggested_order_qty:Math.max(
          (x.monthly_consumption*2)-x.available_stock,
          x.reorder_level-x.available_stock,
          0
        )
      }));
  }

  getDepartmentConsumption(){
    const map = new Map();
    const issueTypes = new Set(this.options.issueTypes.map(x=>this.normalizeType(x)));

    this.transactions.forEach(row=>{
      if(!issueTypes.has(this.transactionType(row))) return;
      const department = row.department || row.department_name || row.issued_to || "Unassigned";
      const qty = this.transactionQtyOut(row) || this.number(row.quantity || row.qty);
      const value = qty*this.transactionRate(row);

      if(!map.has(department)) map.set(department,{department,qty:0,value:0,transactions:0});
      const entry = map.get(department);
      entry.qty += qty;
      entry.value += value;
      entry.transactions++;
    });

    return [...map.values()].sort((a,b)=>b.value-a.value);
  }

  getSupplierPerformance(){
    const map = new Map();
    const purchaseTypes = new Set(this.options.purchaseTypes.map(x=>this.normalizeType(x)));

    this.transactions.forEach(row=>{
      if(!purchaseTypes.has(this.transactionType(row))) return;
      const supplier = row.supplier || row.supplier_name || "Unknown Supplier";
      const qty = this.transactionQtyIn(row) || this.number(row.quantity || row.qty);
      const value = qty*this.transactionRate(row);

      if(!map.has(supplier)) map.set(supplier,{supplier,qty:0,value:0,transactions:0,last_purchase_date:null});
      const entry = map.get(supplier);
      entry.qty += qty;
      entry.value += value;
      entry.transactions++;

      const d = this.date(this.transactionDate(row));
      if(d && (!entry.last_purchase_date || d > new Date(entry.last_purchase_date))){
        entry.last_purchase_date = d.toISOString();
      }
    });

    return [...map.values()].sort((a,b)=>b.value-a.value);
  }
};
