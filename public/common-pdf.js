
window.AppPDF={
 printStandardReport({title,subtitle="Inventory Store Management System",columns=[],rows=[],meta=[]}){
  let host=document.getElementById("printReport");
  if(!host){host=document.createElement("section");host.id="printReport";document.body.appendChild(host)}
  const date=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"}).replace(/ /g,"-");
  host.innerHTML=`<div class="print-header"><div><h1>${AppTools.escapeHtml(title)}</h1><p>${AppTools.escapeHtml(subtitle)}</p></div><div class="print-date"><strong>Date:</strong> ${date}<br><strong>Records:</strong> ${rows.length}</div></div>
  ${meta.length?`<div class="print-meta">${meta.map(x=>`<div><strong>${AppTools.escapeHtml(x.label)}:</strong> ${AppTools.escapeHtml(x.value??"-")}</div>`).join("")}</div>`:""}
  <table class="print-table"><thead><tr>${columns.map(c=>`<th>${AppTools.escapeHtml(c.label)}</th>`).join("")}</tr></thead><tbody>
  ${rows.map(r=>`<tr>${columns.map(c=>`<td>${AppTools.escapeHtml(typeof c.value==="function"?c.value(r):(r[c.key]??""))}</td>`).join("")}</tr>`).join("")}
  </tbody></table><div class="print-footer"><span>This is computer generated report.</span><span>Inventory Store Management System</span></div>`;
  window.print();
 }
};
