window.ERPHealth = class {
  constructor({db}){
    this.db = db;
    this.results = [];
    this.summary = {};
  }

  addResult(result){
    this.results.push({
      id: result.id,
      group: result.group || "General",
      title: result.title,
      status: result.status || "ok",
      count: Number(result.count || 0),
      score: Number(result.score ?? 100),
      recommendation: result.recommendation || "",
      records: result.records || [],
      target_url: result.target_url || "",
      checked_at: new Date().toISOString()
    });
  }

  async safeSelect(table, columns="*", options={}){
    try{
      let query = this.db.from(table).select(columns);
      if(options.limit) query = query.limit(options.limit);
      if(options.order) query = query.order(options.order.column,{ascending:options.order.ascending ?? true});
      const {data,error}=await query;
      if(error) return {ok:false,data:[],error};
      return {ok:true,data:data||[],error:null};
    }catch(error){
      return {ok:false,data:[],error};
    }
  }

  blank(value){
    return value === null || value === undefined || String(value).trim() === "";
  }

  duplicateGroups(rows, getter){
    const map = new Map();
    rows.forEach(row=>{
      const key=String(getter(row)||"").trim().toLowerCase();
      if(!key) return;
      if(!map.has(key)) map.set(key,[]);
      map.get(key).push(row);
    });
    return [...map.values()].filter(group=>group.length>1);
  }

  async run(){
    this.results=[];

    const tables = await Promise.all([
      this.safeSelect("items"),
      this.safeSelect("suppliers"),
      this.safeSelect("departments"),
      this.safeSelect("workshops"),
      this.safeSelect("carriers"),
      this.safeSelect("vehicles"),
      this.safeSelect("employees"),
      this.safeSelect("authorized_persons"),
      this.safeSelect("store_locations"),
      this.safeSelect("rack_item_allocations"),
      this.safeSelect("erp_number_sequences"),
      this.safeSelect("erp_relationships"),
      this.safeSelect("stock_transactions")
    ]);

    const [
      itemsRes,suppliersRes,departmentsRes,workshopsRes,carriersRes,vehiclesRes,
      employeesRes,authoritiesRes,locationsRes,allocationsRes,sequencesRes,
      relationshipsRes,transactionsRes
    ] = tables;

    const tableChecks = [
      ["items",itemsRes],["suppliers",suppliersRes],["departments",departmentsRes],
      ["workshops",workshopsRes],["carriers",carriersRes],["vehicles",vehiclesRes],
      ["employees",employeesRes],["authorized_persons",authoritiesRes],
      ["store_locations",locationsRes],["rack_item_allocations",allocationsRes],
      ["erp_number_sequences",sequencesRes],["erp_relationships",relationshipsRes],
      ["stock_transactions",transactionsRes]
    ];

    tableChecks.forEach(([name,result])=>{
      this.addResult({
        id:`table_${name}`,
        group:"Database",
        title:`${name.replaceAll("_"," ")} table`,
        status:result.ok?"ok":"error",
        count:result.ok?result.data.length:1,
        score:result.ok?100:0,
        recommendation:result.ok
          ?`${result.data.length} record(s) available.`
          :`Create or repair the ${name} table before using dependent modules.`,
        records:result.ok?[]:[{message:result.error?.message||"Table unavailable"}]
      });
    });

    const items=itemsRes.data||[];
    const suppliers=suppliersRes.data||[];
    const departments=departmentsRes.data||[];
    const workshops=workshopsRes.data||[];
    const carriers=carriersRes.data||[];
    const vehicles=vehiclesRes.data||[];
    const employees=employeesRes.data||[];
    const authorities=authoritiesRes.data||[];
    const locations=locationsRes.data||[];
    const allocations=allocationsRes.data||[];
    const sequences=sequencesRes.data||[];
    const relationships=relationshipsRes.data||[];
    const transactions=transactionsRes.data||[];

    this.checkMissing({
      id:"items_without_unit",group:"Master Data",title:"Items without Unit",rows:items,
      predicate:r=>this.blank(r.unit),recommendation:"Assign a unit before using these items in transactions.",
      target_url:"masters.html?type=item"
    });

    this.checkMissing({
      id:"items_without_category",group:"Master Data",title:"Items without Category",rows:items,
      predicate:r=>this.blank(r.category),recommendation:"Assign categories for reporting, reorder rules and analysis.",
      target_url:"masters.html?type=item"
    });

    const allocatedItemIds=new Set(allocations.map(r=>String(r.item_id)));
    const allocatedCodes=new Set(allocations.map(r=>String(r.item_code||"").toLowerCase()).filter(Boolean));
    this.checkMissing({
      id:"items_without_rack",group:"Rack Health",title:"Items without Rack",rows:items,
      predicate:r=>!allocatedItemIds.has(String(r.id)) && !allocatedCodes.has(String(r.item_code||"").toLowerCase()),
      recommendation:"Allocate these items to a rack so receiving and issuing can use physical locations.",
      target_url:"rack-management.html"
    });

    this.checkMissing({
      id:"departments_without_authority",group:"Relationships",title:"Departments without Authority",rows:departments,
      predicate:r=>{
        const name=String(r.department_name||"").trim().toLowerCase();
        const linked=authorities.some(a=>String(a.department||"").trim().toLowerCase()===name);
        return this.blank(r.signature_authority) && !linked;
      },
      recommendation:"Assign a signature authority or link an authorized person to each department.",
      target_url:"master-center.html?type=authority"
    });

    this.checkMissing({
      id:"workshops_without_contact",group:"Master Data",title:"Workshops without Contact",rows:workshops,
      predicate:r=>this.blank(r.contact_person) && this.blank(r.mobile_no),
      recommendation:"Add a contact person or mobile number for faster RGP follow-up.",
      target_url:"masters.html?type=workshop"
    });

    this.checkMissing({
      id:"vehicles_without_driver",group:"Relationships",title:"Vehicles without Driver",rows:vehicles,
      predicate:r=>this.blank(r.driver_name),
      recommendation:"Assign drivers so gate-pass documents can autofill transport details.",
      target_url:"master-center.html?type=vehicle"
    });

    this.checkMissing({
      id:"carriers_without_vehicle",group:"Relationships",title:"Carriers without Vehicle",rows:carriers,
      predicate:r=>this.blank(r.vehicle_no),
      recommendation:"Assign a default vehicle where applicable.",
      target_url:"master-center.html?type=carrier"
    });

    this.checkMissing({
      id:"employees_without_department",group:"Master Data",title:"Employees without Department",rows:employees,
      predicate:r=>this.blank(r.department),
      recommendation:"Assign departments to improve authority and workflow relationships.",
      target_url:"master-center.html?type=employee"
    });

    this.checkDuplicates({
      id:"duplicate_items",group:"Duplicates",title:"Duplicate Items",rows:items,
      getter:r=>`${r.item_name||""}|${r.size||""}`,
      recommendation:"Review duplicate Item Name + Size combinations.",
      target_url:"masters.html?type=item"
    });

    this.checkDuplicates({
      id:"duplicate_suppliers",group:"Duplicates",title:"Duplicate Suppliers",rows:suppliers,
      getter:r=>r.supplier_name,
      recommendation:"Merge or rename duplicate supplier records.",
      target_url:"masters.html?type=supplier"
    });

    this.checkDuplicates({
      id:"duplicate_supplier_phones",group:"Duplicates",title:"Duplicate Supplier Phones",rows:suppliers,
      getter:r=>r.phone||r.mobile_no,
      recommendation:"Verify whether suppliers sharing the same phone number are duplicates.",
      target_url:"masters.html?type=supplier"
    });

    this.checkDuplicates({
      id:"duplicate_locations",group:"Rack Health",title:"Duplicate Rack Locations",rows:locations,
      getter:r=>r.location_name,
      recommendation:"Every physical location should have one unique full location code.",
      target_url:"master-center.html?type=location"
    });

    const brokenAllocations=allocations.filter(a=>{
      const itemExists=items.some(i=>String(i.id)===String(a.item_id)) ||
        items.some(i=>String(i.item_code||"").toLowerCase()===String(a.item_code||"").toLowerCase());
      const locationExists=locations.some(l=>String(l.id)===String(a.location_id)) ||
        locations.some(l=>String(l.location_code||"").toLowerCase()===String(a.location_code||"").toLowerCase());
      return !itemExists || !locationExists;
    });
    this.addIssueCheck({
      id:"broken_rack_allocations",group:"Relationships",title:"Broken Rack Allocations",
      records:brokenAllocations,recommendation:"Repair allocations referencing missing items or locations.",
      target_url:"rack-management.html"
    });

    const invalidSequences=sequences.filter(s=>
      this.blank(s.sequence_type) || this.blank(s.prefix) ||
      Number(s.padding||0)<1 || Number(s.last_number||0)<0 || s.active===false
    );
    this.addIssueCheck({
      id:"invalid_number_sequences",group:"ERP Core",title:"Number Sequence Problems",
      records:invalidSequences,recommendation:"Correct inactive or invalid number sequences before transactions begin.",
      target_url:"erp-core-settings.html"
    });

    const balances=new Map();
    transactions.forEach(r=>{
      const key=String(r.item_code||r.item_name||"").trim().toLowerCase();
      if(!key) return;
      balances.set(key,(balances.get(key)||0)+Number(r.quantity_in||0)-Number(r.quantity_out||0));
    });
    const negativeStock=[...balances.entries()].filter(([,qty])=>qty<0).map(([key,qty])=>({item:key,balance:qty}));
    this.addIssueCheck({
      id:"negative_stock",group:"Inventory",title:"Negative Stock Balances",
      records:negativeStock,recommendation:"Investigate transaction order or missing purchase/opening entries.",
      target_url:"inventory-intelligence.html"
    });

    const lowStock=items.filter(item=>{
      const key=String(item.item_code||item.item_name||"").trim().toLowerCase();
      const balance=balances.get(key)||0;
      const minimum=Number(item.reorder_level||item.minimum_stock||item.min_stock||0);
      return minimum>0 && balance<=minimum;
    }).map(item=>({
      ...item,
      current_balance:balances.get(String(item.item_code||item.item_name||"").trim().toLowerCase())||0
    }));
    this.addIssueCheck({
      id:"low_stock",group:"Inventory",title:"Items Below Minimum Stock",
      records:lowStock,recommendation:"Review reorder suggestions before stock becomes unavailable.",
      target_url:"inventory-intelligence.html"
    });

    const orphanRelationships=relationships.filter(rel=>{
      const source=this.tableData(rel.source_table,{items,suppliers,departments,workshops,carriers,vehicles,employees,authorized_persons:authorities,store_locations:locations});
      const target=this.tableData(rel.target_table,{items,suppliers,departments,workshops,carriers,vehicles,employees,authorized_persons:authorities,store_locations:locations});
      return (source && !source.some(r=>String(r.id)===String(rel.source_id))) ||
             (target && !target.some(r=>String(r.id)===String(rel.target_id)));
    });
    this.addIssueCheck({
      id:"broken_relationships",group:"Relationships",title:"Broken Saved Relationships",
      records:orphanRelationships,recommendation:"Remove or repair relationships pointing to deleted records.",
      target_url:"erp-relationship-center.html"
    });

    this.calculateSummary();
    await this.saveSnapshot();
    return {results:this.results,summary:this.summary};
  }

  tableData(name,data){
    return data[name] || null;
  }

  checkMissing({id,group,title,rows,predicate,recommendation,target_url}){
    const records=rows.filter(predicate);
    this.addIssueCheck({id,group,title,records,recommendation,target_url});
  }

  checkDuplicates({id,group,title,rows,getter,recommendation,target_url}){
    const records=this.duplicateGroups(rows,getter).flat();
    this.addIssueCheck({id,group,title,records,recommendation,target_url});
  }

  addIssueCheck({id,group,title,records,recommendation,target_url}){
    const count=records.length;
    const status=count===0?"ok":count<=3?"warning":"error";
    const score=count===0?100:Math.max(20,100-count*8);
    this.addResult({id,group,title,status,count,score,recommendation,records,target_url});
  }

  calculateSummary(){
    const qualityChecks=this.results.filter(r=>r.group!=="Database");
    const databaseChecks=this.results.filter(r=>r.group==="Database");
    const overall=qualityChecks.length
      ? qualityChecks.reduce((s,r)=>s+r.score,0)/qualityChecks.length
      : 100;

    const groupMap=new Map();
    qualityChecks.forEach(r=>{
      if(!groupMap.has(r.group)) groupMap.set(r.group,[]);
      groupMap.get(r.group).push(r.score);
    });

    const groups={};
    groupMap.forEach((scores,key)=>{
      groups[key]=Math.round(scores.reduce((s,x)=>s+x,0)/scores.length);
    });

    this.summary={
      overall_score:Math.round(overall),
      total_checks:this.results.length,
      passed_checks:this.results.filter(r=>r.status==="ok").length,
      warning_checks:this.results.filter(r=>r.status==="warning").length,
      error_checks:this.results.filter(r=>r.status==="error").length,
      database_score:Math.round(databaseChecks.reduce((s,r)=>s+r.score,0)/Math.max(databaseChecks.length,1)),
      groups
    };
  }

  async saveSnapshot(){
    try{
      await this.db.from("erp_health_snapshots").insert([{
        overall_score:this.summary.overall_score,
        passed_checks:this.summary.passed_checks,
        warning_checks:this.summary.warning_checks,
        error_checks:this.summary.error_checks,
        result_data:this.results
      }]);
    }catch{}
  }
};
