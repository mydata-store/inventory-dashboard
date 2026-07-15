const pages = [
 {group:"CORE",name:"Dashboard",type:"dashboard",title:"ERP Dashboard",subtitle:"Overview of daily store and inventory operations"},
 {group:"ERP CORE",name:"ERP Core Settings",type:"settings",title:"ERP Core Settings",subtitle:"Control system-wide ERP preferences"},
 {group:"ERP CORE",name:"ERP Data Health Center",type:"dashboard",title:"ERP Data Health Center",subtitle:"Review master data quality and missing relationships"},
 {group:"ERP CORE",name:"ERP Health Control Tower",type:"dashboard",title:"ERP Health Control Tower",subtitle:"Executive ERP health monitoring and control page"},
 {group:"ERP CORE",name:"ERP Relationship Center",type:"settings",title:"ERP Relationship Center",subtitle:"Manage master-to-master relationships and auto-fill rules"},
 {group:"GATE PASS",name:"OGP Entry",type:"transaction",title:"OGP Entry",subtitle:"Create outward gate passes"},
 {group:"GATE PASS",name:"OGP List",type:"report",title:"OGP List",subtitle:"Search, review and print outward gate passes"},
 {group:"GATE PASS",name:"RGP Entry",type:"transaction",title:"RGP Entry",subtitle:"Create returnable gate passes"},
 {group:"GATE PASS",name:"RGP List",type:"report",title:"RGP List",subtitle:"Monitor returnable gate pass status"},
 {group:"INVENTORY",name:"Inventory Intelligence",type:"dashboard",title:"Inventory Intelligence",subtitle:"Stock trends, alerts and decision support"},
 {group:"INVENTORY",name:"Issue Entry",type:"transaction",title:"Issue Entry",subtitle:"Issue material to departments"},
 {group:"INVENTORY",name:"Rack Management",type:"transaction",title:"Rack Management",subtitle:"Manage racks, locations and item allocation"},
 {group:"MASTERS",name:"Master Framework",type:"standard",title:"Master Framework",subtitle:"Standard master page designer"},
 {group:"PURCHASES",name:"Local Purchase",type:"transaction",title:"Local Purchase",subtitle:"Record local purchase transactions"},
 {group:"PURCHASES",name:"Purchase List",type:"report",title:"Purchase List",subtitle:"Search and review all purchases"}
];

let currentPage = pages[3], selected = null, zoom=1, history=[], future=[];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function renderPages(filter=""){
 const host=$("#pageList"); host.innerHTML="";
 const groups=[...new Set(pages.map(p=>p.group))];
 groups.forEach(g=>{
   const matches=pages.filter(p=>p.group===g && p.name.toLowerCase().includes(filter.toLowerCase()));
   if(!matches.length)return;
   host.insertAdjacentHTML("beforeend",`<div class="group-title">${g}</div>`);
   matches.forEach(p=>{
     const b=document.createElement("button"); b.className="page-item"+(p===currentPage?" active":"");
     b.innerHTML=`<span class="page-name">${p.name}</span><span class="badge">${p.type}</span>`;
     b.onclick=()=>loadPage(p); host.appendChild(b);
   });
 });
}
function component(type,text,tag="div",extra=""){
 return `<${tag} class="editable-component ${extra}" data-type="${type}" data-link="" tabindex="0">${text}</${tag}>`;
}
function pageMarkup(p){
 if(p.type==="dashboard") return `
  <div class="preview-header editable-component" data-type="header" data-link="">
    ${component("heading",p.title,"h2")}${component("text",p.subtitle,"p")}
  </div>
  <div class="preview-grid">
   ${component("stat",'<span>System Health</span><strong>96%</strong>',"div","preview-card")}
   ${component("stat",'<span>Active Masters</span><strong>18</strong>',"div","preview-card")}
   ${component("stat",'<span>Open Alerts</span><strong>4</strong>',"div","preview-card")}
   ${component("stat",'<span>Pending Actions</span><strong>7</strong>',"div","preview-card")}
  </div>
  <div class="preview-section editable-component" data-type="section" data-link="">
   ${component("heading","ERP Health Checks","h3")}
   <div class="health-row"><b>Master Data Completeness</b><span>All required masters are configured</span><span class="status-good">Healthy</span></div>
   <div class="health-row"><b>Inventory Transactions</b><span>Latest entries synchronized</span><span class="status-good">Healthy</span></div>
   <div class="health-row"><b>Gate Pass Returns</b><span>3 overdue RGP items require review</span><span style="color:#b45309;font-weight:800">Warning</span></div>
  </div>`;
 return `
  <div class="preview-header editable-component" data-type="header" data-link="">
   ${component("heading",p.title,"h2")}${component("text",p.subtitle,"p")}
  </div>
  <div class="preview-section editable-component" data-type="section" data-link="">
   ${component("heading","Page workspace","h3")}
   ${component("text","Select this text or add components from the left Components tab.","p")}
   ${component("button","Open "+p.name,"button","btn primary")}
  </div>`;
}
function bindCanvas(){
 $$(".editable-component").forEach(el=>el.addEventListener("click",e=>{e.stopPropagation();selectComponent(el)}));
 $("#canvasPage").onclick=()=>clearSelection();
}
function loadPage(p){
 currentPage=p; selected=null;
 $("#pageTitle").textContent=p.title; $("#pageSubtitle").textContent=p.subtitle; $("#breadcrumb").textContent=`${p.group} / ${p.type}`;
 $("#canvasPage").innerHTML=pageMarkup(p); bindCanvas(); renderPages($("#pageSearch").value); clearInspector(); toast(`${p.name} loaded`);
}
function selectComponent(el){
 $$(".editable-component").forEach(x=>x.classList.remove("selected")); selected=el; el.classList.add("selected");
 $("#emptyInspector").classList.add("hidden"); $("#propertyForm").classList.remove("hidden");
 $("#selectedType").textContent=el.dataset.type||el.tagName.toLowerCase();
 $("#propText").value=el.innerText.trim();
 const st=getComputedStyle(el);
 $("#propFontSize").value=parseInt(st.fontSize)||14; $("#propWeight").value=st.fontWeight>=700?"700":st.fontWeight>=600?"600":"400";
 $("#propAlign").value=st.textAlign||"left"; $("#propColor").value=rgbToHex(st.color); $("#propBg").value=rgbToHex(st.backgroundColor);
 $("#propRadius").value=parseInt(st.borderRadius)||0; $("#propLink").value=el.dataset.link||"";
}
function clearSelection(){if(selected)selected.classList.remove("selected");selected=null;clearInspector()}
function clearInspector(){$("#emptyInspector").classList.remove("hidden");$("#propertyForm").classList.add("hidden")}
function snapshot(){history.push($("#canvasPage").innerHTML);if(history.length>30)history.shift();future=[];setSaving()}
function applyProps(){
 if(!selected)return; snapshot();
 if(selected.children.length===0 || ["heading","text","button"].includes(selected.dataset.type)) selected.textContent=$("#propText").value;
 selected.style.fontSize=$("#propFontSize").value+"px"; selected.style.fontWeight=$("#propWeight").value;
 selected.style.textAlign=$("#propAlign").value; selected.style.color=$("#propColor").value;
 selected.style.backgroundColor=$("#propBg").value; selected.style.borderRadius=$("#propRadius").value+"px"; selected.dataset.link=$("#propLink").value;
 setSaved(); toast("Component updated");
}
function addComponent(type){
 snapshot(); let html="";
 if(type==="heading")html=component("heading","New Heading","h3");
 if(type==="text")html=component("text","Write your text here.","p");
 if(type==="button")html=component("button","New Button","button","btn primary");
 if(type==="card")html=component("card","<strong>New Card</strong><p>Card content</p>","div","preview-card");
 if(type==="stat")html=component("stat","<span>New Metric</span><strong>0</strong>","div","preview-card");
 if(type==="table")html=component("table","<strong>New Table</strong><p>Configure columns from Properties.</p>","div","preview-section");
 $("#canvasPage").insertAdjacentHTML("beforeend",html);bindCanvas();setSaved();toast(type+" added");
}
function setSaving(){$("#saveState").textContent="Saving…"} function setSaved(){setTimeout(()=>$("#saveState").textContent="Saved",250)}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function rgbToHex(v){const m=v.match(/\d+/g);if(!m||m.length<3)return"#ffffff";return"#"+m.slice(0,3).map(x=>(+x).toString(16).padStart(2,"0")).join("")}

$("#pageSearch").oninput=e=>renderPages(e.target.value);
$$(".nav-tabs button").forEach(b=>b.onclick=()=>{$$(".nav-tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$$(".nav-panel").forEach(x=>x.classList.remove("active"));$("#"+b.dataset.panel).classList.add("active")});
$$("[data-add]").forEach(b=>b.onclick=()=>addComponent(b.dataset.add));
$$(".device-switch button").forEach(b=>b.onclick=()=>{$$(".device-switch button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#canvas").className="canvas "+b.dataset.device;toast(b.textContent+" preview")});
$$(".mode-switch button").forEach(b=>b.onclick=()=>{$$(".mode-switch button").forEach(x=>x.classList.remove("active"));b.classList.add("active");const preview=b.dataset.mode!=="design";$("#canvasPage").style.pointerEvents=preview?"none":"auto";toast(b.textContent+" mode")});
$("#applyProps").onclick=applyProps;
$("#removeComponent").onclick=()=>{if(!selected)return;snapshot();selected.remove();selected=null;clearInspector();setSaved();toast("Component removed")};
$("#duplicateBtn").onclick=()=>{if(!selected)return toast("Select a component first");snapshot();selected.insertAdjacentHTML("afterend",selected.outerHTML);bindCanvas();setSaved();toast("Component duplicated")};
$("#deleteBtn").onclick=()=>$("#removeComponent").click();
$("#undoBtn").onclick=()=>{if(!history.length)return toast("Nothing to undo");future.push($("#canvasPage").innerHTML);$("#canvasPage").innerHTML=history.pop();bindCanvas();clearInspector();toast("Undo")};
$("#redoBtn").onclick=()=>{if(!future.length)return toast("Nothing to redo");history.push($("#canvasPage").innerHTML);$("#canvasPage").innerHTML=future.pop();bindCanvas();clearInspector();toast("Redo")};
$("#zoomIn").onclick=()=>{zoom=Math.min(1.4,zoom+.1);$("#canvas").style.transform=`scale(${zoom})`;$("#zoomValue").textContent=Math.round(zoom*100)+"%"};
$("#zoomOut").onclick=()=>{zoom=Math.max(.5,zoom-.1);$("#canvas").style.transform=`scale(${zoom})`;$("#zoomValue").textContent=Math.round(zoom*100)+"%"};
$("#sidebarToggle").onclick=()=>{$("#navigator").classList.toggle("collapsed");$(".studio").classList.toggle("nav-collapsed")};
$("#publishBtn").onclick=()=>toast("Page published successfully");
$("#previewBtn").onclick=()=>{$$('[data-mode]').find(x=>x.dataset.mode==="preview").click()};
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"){e.preventDefault();setSaving();setSaved();toast("Design saved")}if(e.key==="Delete"&&selected&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName))$("#removeComponent").click()});
renderPages();loadPage(currentPage);
