window.MASTER_CENTER_CONFIG = {
  unit: {
    title: "Unit Master",
    shortTitle: "Units",
    icon: "⚖",
    table: "units",
    codeField: "unit_code",
    codePrefix: "UNT",
    primaryField: "unit_name",
    fields: [
      {name:"unit_name",label:"Unit Name",required:true,capitalize:true},
      {name:"short_name",label:"Short Name",required:true,uppercase:true},
      {name:"decimal_allowed",label:"Decimal Allowed",type:"select",options:["Yes","No"],defaultValue:"Yes"},
      {name:"decimal_places",label:"Decimal Places",inputType:"number",number:true,min:0,max:4,defaultValue:2},
      {name:"status",label:"Status",type:"select",options:["Active","Inactive"],defaultValue:"Active"},
      {name:"remarks",label:"Remarks",type:"textarea",capitalize:true,span:4}
    ]
  },

  category: {
    title: "Category Master",
    shortTitle: "Categories",
    icon: "▦",
    table: "categories",
    codeField: "category_code",
    codePrefix: "CAT",
    primaryField: "category_name",
    fields: [
      {name:"category_name",label:"Category Name",required:true,capitalize:true},
      {name:"inventory_type",label:"Inventory Type",type:"select",options:["Inventory","Non-Inventory"],defaultValue:"Inventory"},
      {name:"parent_category",label:"Parent Category",capitalize:true},
      {name:"reorder_policy",label:"Reorder Policy",type:"select",options:["Normal","Minimum Level","Immediate Issue"],defaultValue:"Normal"},
      {name:"status",label:"Status",type:"select",options:["Active","Inactive"],defaultValue:"Active"},
      {name:"remarks",label:"Remarks",type:"textarea",capitalize:true,span:4}
    ]
  },

  carrier: {
    title: "Carrier Master",
    shortTitle: "Carriers",
    icon: "🚚",
    table: "carriers",
    codeField: "carrier_code",
    codePrefix: "CAR",
    primaryField: "carrier_name",
    fields: [
      {name:"carrier_name",label:"Carrier Name",required:true,capitalize:true},
      {name:"father_name",label:"Father Name",capitalize:true},
      {name:"mobile_no",label:"Mobile No.",numeric:true},
      {name:"cnic",label:"CNIC",placeholder:"00000-0000000-0"},
      {name:"vehicle_no",label:"Default Vehicle No.",uppercase:true},
      {name:"address",label:"Address",capitalize:true,span:2},
      {name:"status",label:"Status",type:"select",options:["Active","Inactive"],defaultValue:"Active"},
      {name:"remarks",label:"Remarks",type:"textarea",capitalize:true,span:4}
    ]
  },

  authority: {
    title: "Authorized Person Master",
    shortTitle: "Authorities",
    icon: "✓",
    table: "authorized_persons",
    codeField: "authority_code",
    codePrefix: "AUT",
    primaryField: "person_name",
    fields: [
      {name:"employee_id",label:"Employee ID",uppercase:true},
      {name:"person_name",label:"Person Name",required:true,capitalize:true},
      {name:"designation",label:"Designation",capitalize:true},
      {name:"department",label:"Department",capitalize:true},
      {name:"approval_level",label:"Approval Level",type:"select",options:["Level 1","Level 2","Level 3","Final Authority"],defaultValue:"Level 1"},
      {name:"mobile_no",label:"Mobile No.",numeric:true},
      {name:"can_authorize_rgp",label:"Authorize RGP",type:"select",options:["Yes","No"],defaultValue:"Yes"},
      {name:"can_authorize_ogp",label:"Authorize OGP",type:"select",options:["Yes","No"],defaultValue:"Yes"},
      {name:"status",label:"Status",type:"select",options:["Active","Inactive"],defaultValue:"Active"},
      {name:"remarks",label:"Remarks",type:"textarea",capitalize:true,span:4}
    ]
  },

  employee: {
    title: "Employee Master",
    shortTitle: "Employees",
    icon: "👤",
    table: "employees",
    codeField: "employee_code",
    codePrefix: "EMP",
    primaryField: "employee_name",
    fields: [
      {name:"employee_id",label:"Company Employee ID",required:true,uppercase:true},
      {name:"employee_name",label:"Employee Name",required:true,capitalize:true},
      {name:"father_name",label:"Father Name",capitalize:true},
      {name:"designation",label:"Designation",capitalize:true},
      {name:"department",label:"Department",capitalize:true},
      {name:"mobile_no",label:"Mobile No.",numeric:true},
      {name:"email",label:"Email",lowercase:true,inputType:"email"},
      {name:"cnic",label:"CNIC",placeholder:"00000-0000000-0"},
      {name:"joining_date",label:"Joining Date",date:true,placeholder:"25-6"},
      {name:"employment_type",label:"Employment Type",type:"select",options:["Permanent","Contract","Daily Wages","Intern"],defaultValue:"Permanent"},
      {name:"status",label:"Status",type:"select",options:["Active","Inactive"],defaultValue:"Active"},
      {name:"address",label:"Address",capitalize:true,span:2},
      {name:"remarks",label:"Remarks",type:"textarea",capitalize:true,span:4}
    ]
  },

  vehicle: {
    title: "Vehicle Master",
    shortTitle: "Vehicles",
    icon: "🚛",
    table: "vehicles",
    codeField: "vehicle_code",
    codePrefix: "VEH",
    primaryField: "vehicle_no",
    fields: [
      {name:"vehicle_no",label:"Vehicle No.",required:true,uppercase:true},
      {name:"vehicle_type",label:"Vehicle Type",type:"select",options:["Car","Pickup","Loader","Truck","Trailer","Motorcycle","Other"],defaultValue:"Truck"},
      {name:"ownership",label:"Ownership",type:"select",options:["Company","Contractor","Supplier","Workshop","Private"],defaultValue:"Company"},
      {name:"driver_name",label:"Driver Name",capitalize:true},
      {name:"driver_mobile",label:"Driver Mobile",numeric:true},
      {name:"company_name",label:"Company / Contractor",capitalize:true},
      {name:"registration_expiry",label:"Registration Expiry",date:true,placeholder:"25-6"},
      {name:"status",label:"Status",type:"select",options:["Active","Inactive"],defaultValue:"Active"},
      {name:"remarks",label:"Remarks",type:"textarea",capitalize:true,span:4}
    ]
  },

  location: {
    title: "Location / Rack Master",
    shortTitle: "Rack Locations",
    icon: "▤",
    table: "store_locations",
    codeField: "location_code",
    codePrefix: "LOC",
    primaryField: "location_name",
    autoLocationCode: true,
    fields: [
      {name:"store_name",label:"Store Name",required:true,capitalize:true,defaultValue:"Main Store"},
      {name:"zone",label:"Zone / Section",capitalize:true},
      {name:"rack_no",label:"Rack No.",required:true,uppercase:true},
      {name:"shelf_no",label:"Shelf No.",required:true,uppercase:true},
      {name:"bin_no",label:"Bin No.",uppercase:true},
      {name:"location_name",label:"Full Location",required:true,readonly:true},
      {name:"capacity",label:"Capacity",numeric:true,number:true,min:0},
      {name:"capacity_unit",label:"Capacity Unit",capitalize:true},
      {name:"status",label:"Status",type:"select",options:["Active","Inactive"],defaultValue:"Active"},
      {name:"remarks",label:"Remarks",type:"textarea",capitalize:true,span:4}
    ]
  }
};
