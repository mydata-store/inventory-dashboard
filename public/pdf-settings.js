window.PDFSettings = {
  storageKey: "inventory_pdf_settings_v1",

  defaults: {
    companyName: "Inventory Store",
    companySubtitle: "Management System",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    companyTaxNo: "",
    logoDataUrl: "",
    logoVisible: true,

    showCompanyName: true,
    showCompanySubtitle: true,
    showCompanyAddress: false,
    showCompanyPhone: false,
    showCompanyEmail: false,
    showCompanyTaxNo: false,

    showReportTitle: true,
    showReportSubtitle: true,
    showDate: true,
    showTime: false,
    showRecordCount: true,
    showMeta: true,
    showPageNumber: true,

    preparedByLabel: "Prepared By",
    preparedByValue: "Muhammad Waqas",
    checkedByLabel: "Checked By",
    checkedByValue: "",
    approvedByLabel: "Approved By",
    approvedByValue: "",

    showPreparedBy: true,
    showCheckedBy: false,
    showApprovedBy: false,

    footerLeft: "This is computer generated report.",
    footerCenter: "",
    footerRight: "Inventory Store Management System",
    showFooterLeft: true,
    showFooterCenter: false,
    showFooterRight: true,

    themeColor: "#ffcc00",
    orientation: "landscape",
    paperSize: "A4",
    marginMm: 9,
    fontSizePt: 8,
    logoWidthMm: 22,
    headerFontSizePt: 21
  },

  get(){
    try{
      const saved = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
      return {...this.defaults, ...saved};
    }catch{
      return {...this.defaults};
    }
  },

  save(settings){
    localStorage.setItem(this.storageKey, JSON.stringify({...this.defaults, ...settings}));
  },

  reset(){
    localStorage.removeItem(this.storageKey);
  }
};
