(function(){
const list=[
{id:"dashboard",title:"Dashboard",module:"core",url:"index.html",status:"connected"},
{id:"masters",title:"Masters Gallery",module:"masters",url:"masters.html",status:"connected"},
{id:"master-center",title:"Master Center",module:"masters",url:"master-center.html",status:"connected"},
{id:"items",title:"Item Master",module:"masters",url:"items.html",status:"pending"},
{id:"suppliers",title:"Supplier Master",module:"masters",url:"suppliers.html",status:"pending"},
{id:"departments",title:"Department Master",module:"masters",url:"department.html",status:"pending"},
{id:"workshops",title:"Workshop Master",module:"masters",url:"workshop.html",status:"pending"},
{id:"local-purchase",title:"Local Purchase",module:"purchase",url:"local-purchase.html",status:"pending"},
{id:"issue",title:"Issue Entry",module:"inventory",url:"issue.html",status:"pending"},
{id:"gate-pass",title:"Gate Pass",module:"gate-pass",url:"gate-pass.html",status:"pending"},
{id:"stock-ledger",title:"Stock Ledger",module:"inventory",url:"stock-ledger.html",status:"pending"},
{id:"reports",title:"Reports",module:"reports",url:"reports.html",status:"pending"},
{id:"design-studio",title:"ERP Design Studio",module:"framework",url:"erp-design-studio.html",status:"connected"},
{id:"host-manager",title:"Host Manager",module:"framework",url:"host-manager.html",status:"connected"},
{id:"framework-status",title:"Framework Status",module:"framework",url:"framework-status.html",status:"connected"},
{id:"diagnostics",title:"Diagnostics Center",module:"framework",url:"erp-diagnostics.html",status:"connected"},
{id:"plugin-manager",title:"Plugin Manager",module:"framework",url:"erp-plugin-manager.html",status:"connected"},
{id:"erp-control-center",title:"ERP Control Center",module:"framework",url:"erp-control-center.html",status:"connected"},
{id:"activity-log",title:"ERP Activity Log",module:"framework",url:"erp-activity-log.html",status:"connected"}];
const k="erp_module_registry";let e={};try{e=JSON.parse(localStorage.getItem(k)||"{}")}catch(_){}
list.forEach(m=>e[m.id]={...(e[m.id]||{}),...m,version:"41.5.0"});localStorage.setItem(k,JSON.stringify(e));window.ERPModuleRegistry=list;
})();
