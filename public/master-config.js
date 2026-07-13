
window.MASTER_CONFIG={
item:{title:"Item Master",subtitle:"Manage inventory items, sizes, units and categories",table:"items",codeField:"item_code",codePrefix:"ITM",fields:[
{name:"item_name",label:"Item Name",required:true,capitalize:true},{name:"size",label:"Size",capitalize:true},
{name:"unit",label:"Unit",required:true},{name:"category",label:"Category"},
{name:"status",label:"Status",type:"select",options:["Active","Inactive"]},{name:"remarks",label:"Remarks",capitalize:true,span:4}],searchFields:["item_code","item_name","size","unit","category","status"]},
supplier:{title:"Supplier Master",subtitle:"Manage suppliers and purchasing contacts",table:"suppliers",codeField:"supplier_code",codePrefix:"SUP",fields:[
{name:"supplier_name",label:"Supplier Name",required:true,capitalize:true},{name:"proprietor_name",label:"Proprietor Name",capitalize:true},
{name:"phone",label:"Phone",numeric:true},{name:"address",label:"Address",capitalize:true,span:2},
{name:"items_detail",label:"Items Detail",capitalize:true,span:2},{name:"status",label:"Status",type:"select",options:["Active","Inactive"]},
{name:"remarks",label:"Remarks",capitalize:true,span:4}],searchFields:["supplier_code","supplier_name","proprietor_name","phone","address","status"]},
workshop:{title:"Workshop / Party Master",subtitle:"Manage repair workshops, outside parties, calibration labs and vendors",table:"workshops",codeField:"workshop_code",codePrefix:"WSP",fields:[
{name:"workshop_name",label:"Workshop / Party Name",required:true,capitalize:true},{name:"contact_person",label:"Contact Person",capitalize:true},
{name:"mobile_no",label:"Mobile No.",numeric:true},{name:"city",label:"City",capitalize:true},
{name:"address",label:"Address",capitalize:true,span:2},{name:"specialization",label:"Specialization",capitalize:true},
{name:"status",label:"Status",type:"select",options:["Active","Inactive"]},{name:"remarks",label:"Remarks",capitalize:true,span:4}],searchFields:["workshop_code","workshop_name","contact_person","mobile_no","city","specialization","status"]},
department:{title:"Department Master",subtitle:"Manage departments, responsible persons and signature authorities",table:"departments",codeField:"department_code",codePrefix:"DEP",fields:[
{name:"department_name",label:"Department Name",required:true,capitalize:true},{name:"responsible_person",label:"Responsible Person",capitalize:true},
{name:"signature_authority",label:"Signature Authority",capitalize:true},{name:"phone",label:"Phone",numeric:true},
{name:"location",label:"Location",capitalize:true,span:2},{name:"status",label:"Status",type:"select",options:["Active","Inactive"]},
{name:"remarks",label:"Remarks",capitalize:true,span:4}],searchFields:["department_code","department_name","responsible_person","signature_authority","phone","location","status"]},
unit:{title:"Unit Master",subtitle:"Manage standard stock measurement units",table:"units",codeField:"unit_code",codePrefix:"UNT",fields:[
{name:"unit_name",label:"Unit Name",required:true,capitalize:true},{name:"short_name",label:"Short Name",required:true},
{name:"decimal_allowed",label:"Decimal Allowed",type:"select",options:["Yes","No"]},{name:"status",label:"Status",type:"select",options:["Active","Inactive"]},
{name:"remarks",label:"Remarks",capitalize:true,span:4}],searchFields:["unit_code","unit_name","short_name","decimal_allowed","status"]},
category:{title:"Category Master",subtitle:"Manage inventory item categories",table:"categories",codeField:"category_code",codePrefix:"CAT",fields:[
{name:"category_name",label:"Category Name",required:true,capitalize:true},{name:"inventory_type",label:"Inventory Type",type:"select",options:["Inventory","Non-Inventory"]},
{name:"status",label:"Status",type:"select",options:["Active","Inactive"]},{name:"remarks",label:"Remarks",capitalize:true,span:4}],searchFields:["category_code","category_name","inventory_type","status"]},
carrier:{title:"Carrier Master",subtitle:"Manage outgoing and incoming carriers",table:"carriers",codeField:"carrier_code",codePrefix:"CAR",fields:[
{name:"carrier_name",label:"Carrier Name",required:true,capitalize:true},{name:"mobile_no",label:"Mobile No.",numeric:true},
{name:"vehicle_no",label:"Vehicle No."},{name:"status",label:"Status",type:"select",options:["Active","Inactive"]},
{name:"remarks",label:"Remarks",capitalize:true,span:4}],searchFields:["carrier_code","carrier_name","mobile_no","vehicle_no","status"]},
authority:{title:"Authorized Person Master",subtitle:"Manage gate pass and store authorization persons",table:"authorized_persons",codeField:"authority_code",codePrefix:"AUT",fields:[
{name:"person_name",label:"Person Name",required:true,capitalize:true},{name:"designation",label:"Designation",capitalize:true},
{name:"department",label:"Department",capitalize:true},{name:"mobile_no",label:"Mobile No.",numeric:true},
{name:"status",label:"Status",type:"select",options:["Active","Inactive"]},{name:"remarks",label:"Remarks",capitalize:true,span:4}],searchFields:["authority_code","person_name","designation","department","mobile_no","status"]}
};
