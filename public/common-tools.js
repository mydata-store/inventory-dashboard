
window.AppTools={
 titleCase(v){return String(v||"").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()).replace(/\bAnd\b/g,"and").replace(/\bOf\b/g,"of")},
 escapeHtml(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")},
 parseDate(v){
  const t=String(v||"").trim();if(!t)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(t))return t;
  const p=t.replace(/[/.]/g,"-").split("-");if(p.length<2)return null;
  const d=Number(p[0]),m=Number(p[1]);if(!d||!m||d>31||m>12)return null;
  let y=p[2]||new Date().getFullYear();if(String(y).length===2)y="20"+y;
  return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
 },
 displayDate(v){const iso=this.parseDate(v);if(!iso)return v||"-";const m=iso.match(/^(\d{4})-(\d{2})-(\d{2})$/),ms=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return `${m[3]}-${ms[+m[2]]}-${m[1].slice(-2)}`},
 setupAutoCapitalize(root=document){root.querySelectorAll("[data-capitalize]").forEach(el=>el.addEventListener("blur",()=>el.value=this.titleCase(el.value.trim())))},
 setupNumericFields(root=document){root.querySelectorAll("[data-numeric]").forEach(el=>el.addEventListener("input",()=>el.value=el.value.replace(/[^\d.+\-]/g,"")))},
 setupDateFields(root=document){root.querySelectorAll("[data-date]").forEach(el=>el.addEventListener("blur",()=>{if(!el.value.trim())return;const iso=this.parseDate(el.value);if(!iso){this.toast("Invalid date.","error");el.focus();return}el.value=this.displayDate(iso)}))},
 setupEnterNavigation(container,onFinish){const fields=[...container.querySelectorAll("input:not([readonly]),select,textarea")];fields.forEach((f,i)=>f.addEventListener("keydown",e=>{if(e.key==="Enter"&&f.tagName!=="TEXTAREA"){e.preventDefault();const next=fields[i+(e.shiftKey?-1:1)];if(next){next.focus();next.select?.()}else if(!e.shiftKey)onFinish?.()}}))},
 toast(message,type="success"){let t=document.getElementById("globalToast");if(!t){t=document.createElement("div");t.id="globalToast";document.body.appendChild(t)}t.textContent=message;t.className=`toast ${type} show`;clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>t.classList.remove("show"),2600)},
 openModal(title,content){let m=document.getElementById("globalModal");if(!m){m=document.createElement("div");m.id="globalModal";m.className="modal-backdrop";m.innerHTML=`<div class="modal-box"><div class="modal-head"><h3 id="globalModalTitle"></h3><button class="btn btn-dark btn-sm" onclick="AppTools.closeModal()">×</button></div><div class="modal-body" id="globalModalBody"></div></div>`;m.onclick=e=>{if(e.target===m)this.closeModal()};document.body.appendChild(m)}globalModalTitle.textContent=title;globalModalBody.innerHTML=content;m.classList.add("open");document.body.style.overflow="hidden"},
 closeModal(){document.getElementById("globalModal")?.classList.remove("open");document.body.style.overflow=""},
 setupGlobalShortcuts({save,clear,search,undo}={}){document.addEventListener("keydown",e=>{if(e.ctrlKey&&e.key.toLowerCase()==="s"&&save){e.preventDefault();save()}if(e.ctrlKey&&e.key.toLowerCase()==="f"&&search){e.preventDefault();search.focus();search.select?.()}if(e.ctrlKey&&e.key.toLowerCase()==="z"&&undo){e.preventDefault();undo()}if(e.key==="Escape"){if(document.getElementById("globalModal")?.classList.contains("open"))this.closeModal();else clear?.()}})}
};
