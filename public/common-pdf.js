window.AppPDF = {
  printStandardReport(options={}){
    const settings = {...PDFSettings.get(), ...(options.settingsOverride || {})};
    const {
      title="Report",
      subtitle="",
      columns=[],
      rows=[],
      meta=[],
      preparedBy,
      checkedBy,
      approvedBy
    } = options;

    let host=document.getElementById("printReport");
    if(!host){
      host=document.createElement("section");
      host.id="printReport";
      document.body.appendChild(host);
    }

    const now = new Date();
    const date = now.toLocaleDateString("en-GB",{
      day:"2-digit",month:"short",year:"2-digit"
    }).replace(/ /g,"-");
    const time = now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});

    const safe = AppTools.escapeHtml;
    const preparedValue = preparedBy ?? settings.preparedByValue;
    const checkedValue = checkedBy ?? settings.checkedByValue;
    const approvedValue = approvedBy ?? settings.approvedByValue;

    const companyLines = [
      settings.showCompanyName && settings.companyName
        ? `<div class="pdf-company-name">${safe(settings.companyName)}</div>` : "",
      settings.showCompanySubtitle && settings.companySubtitle
        ? `<div class="pdf-company-subtitle">${safe(settings.companySubtitle)}</div>` : "",
      settings.showCompanyAddress && settings.companyAddress
        ? `<div>${safe(settings.companyAddress)}</div>` : "",
      settings.showCompanyPhone && settings.companyPhone
        ? `<div>Phone: ${safe(settings.companyPhone)}</div>` : "",
      settings.showCompanyEmail && settings.companyEmail
        ? `<div>Email: ${safe(settings.companyEmail)}</div>` : "",
      settings.showCompanyTaxNo && settings.companyTaxNo
        ? `<div>Tax No: ${safe(settings.companyTaxNo)}</div>` : ""
    ].filter(Boolean).join("");

    const rightInfo = [
      settings.showDate ? `<div><strong>Date:</strong> ${date}</div>` : "",
      settings.showTime ? `<div><strong>Time:</strong> ${time}</div>` : "",
      settings.showRecordCount ? `<div><strong>Records:</strong> ${rows.length}</div>` : ""
    ].filter(Boolean).join("");

    const reportHeading = [
      settings.showReportTitle ? `<h1>${safe(title)}</h1>` : "",
      settings.showReportSubtitle && subtitle ? `<p>${safe(subtitle)}</p>` : ""
    ].join("");

    const logo = settings.logoVisible && settings.logoDataUrl
      ? `<img class="pdf-logo" src="${settings.logoDataUrl}" alt="Logo">`
      : "";

    const signatures = [
      settings.showPreparedBy ? {label:settings.preparedByLabel,value:preparedValue} : null,
      settings.showCheckedBy ? {label:settings.checkedByLabel,value:checkedValue} : null,
      settings.showApprovedBy ? {label:settings.approvedByLabel,value:approvedValue} : null
    ].filter(Boolean);

    host.innerHTML = `
      <style>
        @page{
          size:${safe(settings.paperSize)} ${safe(settings.orientation)};
          margin:${Number(settings.marginMm)||9}mm;
          @bottom-right{
            content:${settings.showPageNumber ? '"Page " counter(page) " of " counter(pages)' : '""'};
            font-size:8pt;
          }
        }
        #printReport{
          --pdf-accent:${safe(settings.themeColor)};
          font-size:${Number(settings.fontSizePt)||8}pt;
        }
        #printReport .pdf-header{
          display:grid;
          grid-template-columns:auto 1fr auto;
          gap:10px;
          align-items:start;
          border-bottom:3px solid var(--pdf-accent);
          padding-bottom:7px;
          margin-bottom:9px;
        }
        #printReport .pdf-logo{
          width:${Number(settings.logoWidthMm)||22}mm;
          max-height:22mm;
          object-fit:contain;
        }
        #printReport .pdf-company-name{font-weight:800;font-size:12pt}
        #printReport .pdf-company-subtitle{font-size:9pt;margin-bottom:2px}
        #printReport .pdf-company{font-size:8pt;line-height:1.35}
        #printReport .pdf-title{text-align:center}
        #printReport .pdf-title h1{
          font-size:${Number(settings.headerFontSizePt)||21}pt;
          margin:0
        }
        #printReport .pdf-title p{font-size:9pt;margin:3px 0 0}
        #printReport .pdf-right{font-size:8pt;text-align:right;line-height:1.45}
        #printReport .print-meta{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:5px;
          margin-bottom:8px;
          font-size:8pt
        }
        #printReport .print-meta div{border:1px solid #333;padding:5px}
        #printReport .print-table{width:100%;border-collapse:collapse}
        #printReport .print-table thead{display:table-header-group}
        #printReport .print-table th{
          background:var(--pdf-accent)!important;
          color:#111!important;
          border:1px solid #333;
          padding:4px;
          white-space:normal
        }
        #printReport .print-table td{border:1px solid #333;padding:4px}
        #printReport .pdf-signatures{
          display:grid;
          grid-template-columns:repeat(${Math.max(signatures.length,1)},1fr);
          gap:30px;
          margin-top:18px
        }
        #printReport .pdf-signature{
          text-align:center;
          padding-top:18px;
          border-top:1px solid #333;
          min-height:35px
        }
        #printReport .pdf-footer{
          display:grid;
          grid-template-columns:1fr 1fr 1fr;
          gap:8px;
          margin-top:10px;
          border-top:1px solid #777;
          padding-top:4px;
          font-size:8pt
        }
        #printReport .pdf-footer .center{text-align:center}
        #printReport .pdf-footer .right{text-align:right}
      </style>

      <div class="pdf-header">
        <div>${logo}</div>
        <div>
          <div class="pdf-company">${companyLines}</div>
          <div class="pdf-title">${reportHeading}</div>
        </div>
        <div class="pdf-right">${rightInfo}</div>
      </div>

      ${settings.showMeta && meta.length ? `
        <div class="print-meta">
          ${meta.map(item=>`
            <div><strong>${safe(item.label)}:</strong> ${safe(item.value ?? "-")}</div>
          `).join("")}
        </div>` : ""}

      <table class="print-table">
        <thead>
          <tr>${columns.map(c=>`<th>${safe(c.label)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map(row=>`
            <tr>
              ${columns.map(c=>`
                <td>${safe(typeof c.value==="function" ? c.value(row) : (row[c.key] ?? ""))}</td>
              `).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>

      ${signatures.length ? `
        <div class="pdf-signatures">
          ${signatures.map(item=>`
            <div class="pdf-signature">
              <strong>${safe(item.label)}</strong><br>
              ${safe(item.value || "")}
            </div>
          `).join("")}
        </div>` : ""}

      <div class="pdf-footer">
        <div>${settings.showFooterLeft ? safe(settings.footerLeft) : ""}</div>
        <div class="center">${settings.showFooterCenter ? safe(settings.footerCenter) : ""}</div>
        <div class="right">${settings.showFooterRight ? safe(settings.footerRight) : ""}</div>
      </div>
    `;

    window.print();
  }
};
