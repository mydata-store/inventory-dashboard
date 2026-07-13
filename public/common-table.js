window.AppTable = class {
  constructor(options){
    this.options = {
      container: null,
      columns: [],
      rows: [],
      rowId: "id",
      pageSize: 20,
      searchable: true,
      searchDropdown: true,
      searchSuggestionLimit: 20,
      searchSuggestionLabel: null,
      searchSuggestionSubtitle: null,
      sortable: true,
      resizable: true,
      selectable: true,
      stickyFirstColumn: false,
      showToolbar: true,
      showTotals: false,
      totals: {},
      preferencesKey: "",
      onDetail: null,
      onEdit: null,
      onDelete: null,
      onRowOpen: null,
      ...options
    };

    this.container = typeof this.options.container === "string"
      ? document.querySelector(this.options.container)
      : this.options.container;

    if(!this.container) throw new Error("AppTable container not found.");

    this.state = {
      query: "",
      sortKey: "",
      sortDirection: "asc",
      page: 1,
      selected: new Set(),
      hiddenColumns: new Set(),
      columnWidths: {},
      rows: [...this.options.rows],
      searchSuggestionIndex: -1
    };

    this.loadPreferences();
    this.render();
  }

  setRows(rows){
    this.state.rows = [...(rows || [])];
    this.state.page = 1;
    this.state.selected.clear();
    this.render();
  }

  getVisibleColumns(){
    return this.options.columns.filter(col => !this.state.hiddenColumns.has(col.key));
  }

  getFilteredRows(){
    const q = this.state.query.trim().toLowerCase();
    let rows = [...this.state.rows];

    if(q){
      rows = rows.filter(row => this.options.columns.some(col => {
        const value = this.getCellValue(row, col);
        return String(value ?? "").toLowerCase().includes(q);
      }));
    }

    if(this.state.sortKey){
      const col = this.options.columns.find(c => c.key === this.state.sortKey);
      rows.sort((a,b) => {
        const av = this.getCellValue(a,col);
        const bv = this.getCellValue(b,col);

        const an = Number(av), bn = Number(bv);
        let result;
        if(Number.isFinite(an) && Number.isFinite(bn)){
          result = an - bn;
        }else{
          result = String(av ?? "").localeCompare(String(bv ?? ""), undefined, {numeric:true,sensitivity:"base"});
        }
        return this.state.sortDirection === "asc" ? result : -result;
      });
    }

    return rows;
  }

  getPagedRows(){
    const rows = this.getFilteredRows();
    const start = (this.state.page - 1) * this.options.pageSize;
    return rows.slice(start, start + this.options.pageSize);
  }

  getCellValue(row,col){
    if(!col) return "";
    if(typeof col.value === "function") return col.value(row);
    return row[col.key];
  }

  getSearchSuggestions(){
    if(!this.options.searchDropdown) return [];

    const query = this.state.query.trim().toLowerCase();
    const seen = new Set();
    const suggestions = [];

    const preferredKeys = [
      "item_name","workshop_name","department_name","department",
      "supplier_name","supplier","person_name","name","title",
      "item_code","workshop_code","department_code","code"
    ];

    for(const row of this.state.rows){
      const allText = this.options.columns
        .map(col => String(this.getCellValue(row,col) ?? ""))
        .join(" ")
        .trim();

      if(query && !allText.toLowerCase().includes(query)) continue;

      let label = "";
      if(typeof this.options.searchSuggestionLabel === "function"){
        label = this.options.searchSuggestionLabel(row);
      }else{
        for(const key of preferredKeys){
          if(row[key] !== undefined && row[key] !== null && String(row[key]).trim()){
            label = String(row[key]).trim();
            break;
          }
        }
        if(!label){
          const firstColumn = this.options.columns.find(col => {
            const value = this.getCellValue(row,col);
            return value !== undefined && value !== null && String(value).trim();
          });
          label = firstColumn ? String(this.getCellValue(row,firstColumn)).trim() : allText;
        }
      }

      let subtitle = "";
      if(typeof this.options.searchSuggestionSubtitle === "function"){
        subtitle = this.options.searchSuggestionSubtitle(row);
      }else{
        subtitle = this.options.columns
          .map(col => String(this.getCellValue(row,col) ?? "").trim())
          .filter(value => value && value !== label)
          .slice(0,3)
          .join(" • ");
      }

      const uniqueKey = `${label}|${subtitle}`.toLowerCase();
      if(!label || seen.has(uniqueKey)) continue;
      seen.add(uniqueKey);

      suggestions.push({
        label,
        subtitle,
        query: label,
        rowId: row[this.options.rowId]
      });

      if(suggestions.length >= this.options.searchSuggestionLimit) break;
    }

    return suggestions;
  }

  renderSearchSuggestions(){
    if(!this.options.searchDropdown) return "";
    const suggestions = this.getSearchSuggestions();

    if(!suggestions.length){
      return this.state.query
        ? `<div class="app-table-search-empty">No matching record</div>`
        : "";
    }

    return suggestions.map((item,index)=>`
      <div class="app-table-search-option ${index===this.state.searchSuggestionIndex?"active":""}"
           data-search-index="${index}">
        <strong>${AppTools.escapeHtml(item.label)}</strong>
        ${item.subtitle ? `<span>${AppTools.escapeHtml(item.subtitle)}</span>` : ""}
      </div>
    `).join("");
  }

  focusSearchInput(caretPosition=null){
    const input = this.container.querySelector(".app-table-search");
    if(!input) return;
    input.focus();
    const position = caretPosition ?? input.value.length;
    try{ input.setSelectionRange(position,position); }catch{}
  }

  render(){
    this.container.innerHTML = `
      <div class="app-table-shell">
        ${this.options.showToolbar ? this.renderToolbar() : ""}
        <div class="app-table-scroll">
          <table class="app-table ${this.options.stickyFirstColumn ? "sticky-first" : ""}">
            <thead>${this.renderHead()}</thead>
            <tbody>${this.renderBody()}</tbody>
            ${this.options.showTotals ? this.renderTotals() : ""}
          </table>
        </div>
        ${this.renderPagination()}
      </div>
    `;
    this.bindEvents();
  }

  renderToolbar(){
    return `
      <div class="app-table-toolbar">
        <div class="app-table-toolbar-left">
          ${this.options.searchable ? `
            <div class="app-table-search-wrap">
              <input class="app-table-search" autocomplete="off" placeholder="Search table..." value="${AppTools.escapeHtml(this.state.query)}">
              <div class="app-table-search-menu">${this.renderSearchSuggestions()}</div>
            </div>` : ""}
          ${this.options.selectable ? `<span class="app-table-selection-count">${this.state.selected.size} selected</span>` : ""}
        </div>
        <div class="app-table-toolbar-right">
          <button class="btn btn-light btn-sm app-table-columns-btn">Columns</button>
          <button class="btn btn-primary btn-sm app-table-export-btn">Export Excel</button>
          <button class="btn btn-danger btn-sm app-table-pdf-btn">Print / PDF</button>
        </div>
      </div>
      <div class="app-table-columns-panel">
        ${this.options.columns.map(col => `
          <label><input type="checkbox" data-col="${AppTools.escapeHtml(col.key)}" ${this.state.hiddenColumns.has(col.key) ? "" : "checked"}> ${AppTools.escapeHtml(col.label)}</label>
        `).join("")}
      </div>
    `;
  }

  renderHead(){
    const columns = this.getVisibleColumns();
    return `<tr>
      ${this.options.selectable ? `<th class="select-col"><input type="checkbox" class="app-table-select-all"></th>` : ""}
      ${columns.map((col,index) => {
        const width = this.state.columnWidths[col.key] ? `style="width:${this.state.columnWidths[col.key]}px;min-width:${this.state.columnWidths[col.key]}px"` : "";
        const sortMark = this.state.sortKey === col.key ? (this.state.sortDirection === "asc" ? " ▲" : " ▼") : "";
        return `<th data-key="${AppTools.escapeHtml(col.key)}" ${width}>
          <span class="app-table-th-label">${AppTools.escapeHtml(col.label)}${sortMark}</span>
          ${this.options.resizable ? `<span class="app-table-resizer" data-key="${AppTools.escapeHtml(col.key)}"></span>` : ""}
        </th>`;
      }).join("")}
      ${this.hasActions() ? `<th>Action</th>` : ""}
    </tr>`;
  }

  renderBody(){
    const rows = this.getPagedRows();
    const columns = this.getVisibleColumns();

    if(!rows.length){
      const colspan = columns.length + (this.options.selectable ? 1 : 0) + (this.hasActions() ? 1 : 0);
      return `<tr><td colspan="${colspan}" class="table-empty">No record found.</td></tr>`;
    }

    return rows.map(row => {
      const id = row[this.options.rowId];
      const selected = this.state.selected.has(String(id));
      return `<tr data-id="${AppTools.escapeHtml(id)}" class="${selected ? "selected-row" : ""}">
        ${this.options.selectable ? `<td class="select-col"><input type="checkbox" class="app-table-row-check" data-id="${AppTools.escapeHtml(id)}" ${selected ? "checked" : ""}></td>` : ""}
        ${columns.map(col => `<td tabindex="0" data-key="${AppTools.escapeHtml(col.key)}">${this.formatCell(row,col)}</td>`).join("")}
        ${this.hasActions() ? `<td><div class="table-actions">
          ${this.options.onDetail ? `<button class="btn btn-success btn-sm" data-action="detail" data-id="${AppTools.escapeHtml(id)}">Detail</button>` : ""}
          ${this.options.onEdit ? `<button class="btn btn-primary btn-sm" data-action="edit" data-id="${AppTools.escapeHtml(id)}">Edit</button>` : ""}
          ${this.options.onDelete ? `<button class="btn btn-danger btn-sm" data-action="delete" data-id="${AppTools.escapeHtml(id)}">Delete</button>` : ""}
        </div></td>` : ""}
      </tr>`;
    }).join("");
  }

  formatCell(row,col){
    const value = this.getCellValue(row,col);
    if(typeof col.render === "function") return col.render(value,row);
    if(col.type === "status"){
      const cls = String(value).toLowerCase();
      return `<span class="badge badge-${AppTools.escapeHtml(cls)}">${AppTools.escapeHtml(value)}</span>`;
    }
    if(col.type === "number"){
      return Number(value || 0).toLocaleString("en-PK",{maximumFractionDigits:3});
    }
    if(col.type === "currency"){
      return `PKR ${Number(value || 0).toLocaleString("en-PK",{maximumFractionDigits:2})}`;
    }
    if(col.type === "date"){
      return AppTools.displayDate(value);
    }
    return AppTools.escapeHtml(value ?? "");
  }

  renderTotals(){
    const columns = this.getVisibleColumns();
    return `<tfoot><tr>
      ${this.options.selectable ? `<td></td>` : ""}
      ${columns.map((col,index) => {
        const totalDef = this.options.totals[col.key];
        if(index === 0 && !totalDef) return `<td><strong>Total</strong></td>`;
        if(typeof totalDef === "function"){
          return `<td><strong>${AppTools.escapeHtml(totalDef(this.getFilteredRows()))}</strong></td>`;
        }
        if(totalDef === "sum"){
          const total = this.getFilteredRows().reduce((s,row)=>s+Number(this.getCellValue(row,col)||0),0);
          return `<td><strong>${total.toLocaleString("en-PK",{maximumFractionDigits:2})}</strong></td>`;
        }
        return `<td></td>`;
      }).join("")}
      ${this.hasActions() ? `<td></td>` : ""}
    </tr></tfoot>`;
  }

  renderPagination(){
    const total = this.getFilteredRows().length;
    const pages = Math.max(1, Math.ceil(total / this.options.pageSize));
    this.state.page = Math.min(this.state.page, pages);

    return `<div class="app-table-pagination">
      <div>${total} record${total===1?"":"s"}</div>
      <div class="app-table-pagination-controls">
        <button class="btn btn-light btn-sm" data-page="prev" ${this.state.page<=1?"disabled":""}>Previous</button>
        <span>Page ${this.state.page} of ${pages}</span>
        <button class="btn btn-light btn-sm" data-page="next" ${this.state.page>=pages?"disabled":""}>Next</button>
        <select class="app-table-page-size">
          ${[10,20,50,100].map(n=>`<option value="${n}" ${this.options.pageSize===n?"selected":""}>${n} rows</option>`).join("")}
        </select>
      </div>
    </div>`;
  }

  hasActions(){
    return this.options.onDetail || this.options.onEdit || this.options.onDelete;
  }

  bindEvents(){
    const searchInput = this.container.querySelector(".app-table-search");
    const searchMenu = this.container.querySelector(".app-table-search-menu");

    searchInput?.addEventListener("focus",()=>{
      searchMenu?.classList.add("open");
    });

    searchInput?.addEventListener("input",e=>{
      const caret = e.target.selectionStart;
      this.state.query = e.target.value;
      this.state.page = 1;
      this.state.searchSuggestionIndex = -1;
      this.render();
      setTimeout(()=>{
        this.focusSearchInput(caret);
        this.container.querySelector(".app-table-search-menu")?.classList.add("open");
      },0);
    });

    searchInput?.addEventListener("keydown",e=>{
      const suggestions = this.getSearchSuggestions();

      if(e.key==="ArrowDown" && suggestions.length){
        e.preventDefault();
        this.state.searchSuggestionIndex = Math.min(
          this.state.searchSuggestionIndex + 1,
          suggestions.length - 1
        );
        this.render();
        setTimeout(()=>{
          this.focusSearchInput();
          this.container.querySelector(".app-table-search-menu")?.classList.add("open");
        },0);
      }else if(e.key==="ArrowUp" && suggestions.length){
        e.preventDefault();
        this.state.searchSuggestionIndex = Math.max(
          this.state.searchSuggestionIndex - 1,
          0
        );
        this.render();
        setTimeout(()=>{
          this.focusSearchInput();
          this.container.querySelector(".app-table-search-menu")?.classList.add("open");
        },0);
      }else if(e.key==="Enter" && suggestions.length && this.state.searchSuggestionIndex>=0){
        e.preventDefault();
        const selected = suggestions[this.state.searchSuggestionIndex];
        this.state.query = selected.query;
        this.state.page = 1;
        this.state.searchSuggestionIndex = -1;
        this.render();
      }else if(e.key==="Escape"){
        searchMenu?.classList.remove("open");
        this.state.searchSuggestionIndex = -1;
      }
    });

    searchInput?.addEventListener("blur",()=>{
      setTimeout(()=>this.container.querySelector(".app-table-search-menu")?.classList.remove("open"),150);
    });

    this.container.querySelectorAll(".app-table-search-option").forEach(option=>{
      option.addEventListener("mousedown",e=>{
        e.preventDefault();
        const suggestions = this.getSearchSuggestions();
        const selected = suggestions[Number(option.dataset.searchIndex)];
        if(!selected) return;
        this.state.query = selected.query;
        this.state.page = 1;
        this.state.searchSuggestionIndex = -1;
        this.render();
      });
    });

    this.container.querySelectorAll("th[data-key]").forEach(th=>{
      th.addEventListener("click",e=>{
        if(e.target.classList.contains("app-table-resizer")) return;
        if(!this.options.sortable) return;
        const key = th.dataset.key;
        if(this.state.sortKey === key){
          this.state.sortDirection = this.state.sortDirection === "asc" ? "desc" : "asc";
        }else{
          this.state.sortKey = key;
          this.state.sortDirection = "asc";
        }
        this.render();
      });
    });

    this.container.querySelector(".app-table-select-all")?.addEventListener("change",e=>{
      this.getPagedRows().forEach(row=>{
        const id = String(row[this.options.rowId]);
        if(e.target.checked) this.state.selected.add(id);
        else this.state.selected.delete(id);
      });
      this.render();
    });

    this.container.querySelectorAll(".app-table-row-check").forEach(cb=>{
      cb.addEventListener("change",e=>{
        const id = String(e.target.dataset.id);
        if(e.target.checked) this.state.selected.add(id);
        else this.state.selected.delete(id);
        this.render();
      });
    });

    this.container.querySelectorAll("[data-action]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const id = btn.dataset.id;
        const row = this.state.rows.find(r=>String(r[this.options.rowId])===String(id));
        if(!row) return;
        const action = btn.dataset.action;
        if(action === "detail") this.options.onDetail?.(row);
        if(action === "edit") this.options.onEdit?.(row);
        if(action === "delete") this.options.onDelete?.(row);
      });
    });

    this.container.querySelectorAll("tbody tr[data-id]").forEach(tr=>{
      tr.addEventListener("dblclick",()=>{
        const row = this.state.rows.find(r=>String(r[this.options.rowId])===String(tr.dataset.id));
        this.options.onRowOpen?.(row);
      });
    });

    this.container.querySelector("[data-page='prev']")?.addEventListener("click",()=>{this.state.page--;this.render()});
    this.container.querySelector("[data-page='next']")?.addEventListener("click",()=>{this.state.page++;this.render()});
    this.container.querySelector(".app-table-page-size")?.addEventListener("change",e=>{
      this.options.pageSize = Number(e.target.value);
      this.state.page = 1;
      this.savePreferences();
      this.render();
    });

    const panel = this.container.querySelector(".app-table-columns-panel");
    this.container.querySelector(".app-table-columns-btn")?.addEventListener("click",()=>{
      panel.classList.toggle("open");
    });
    panel?.querySelectorAll("input[data-col]").forEach(cb=>{
      cb.addEventListener("change",()=>{
        const key = cb.dataset.col;
        if(cb.checked) this.state.hiddenColumns.delete(key);
        else this.state.hiddenColumns.add(key);
        this.savePreferences();
        this.render();
      });
    });

    this.container.querySelector(".app-table-export-btn")?.addEventListener("click",()=>this.exportCSV());
    this.container.querySelector(".app-table-pdf-btn")?.addEventListener("click",()=>this.printPDF());

    this.bindResizers();
    this.bindKeyboardNavigation();
  }

  bindKeyboardNavigation(){
    const cells = [...this.container.querySelectorAll("tbody td[tabindex='0']")];
    cells.forEach((cell,index)=>{
      cell.addEventListener("keydown",e=>{
        const row = cell.parentElement;
        const rowCells = [...row.querySelectorAll("td[tabindex='0']")];
        const colIndex = rowCells.indexOf(cell);
        const rowIndex = [...row.parentElement.children].indexOf(row);

        if(e.key === "ArrowRight"){e.preventDefault();rowCells[colIndex+1]?.focus()}
        if(e.key === "ArrowLeft"){e.preventDefault();rowCells[colIndex-1]?.focus()}
        if(e.key === "ArrowDown"){e.preventDefault();row.parentElement.children[rowIndex+1]?.querySelectorAll("td[tabindex='0']")[colIndex]?.focus()}
        if(e.key === "ArrowUp"){e.preventDefault();row.parentElement.children[rowIndex-1]?.querySelectorAll("td[tabindex='0']")[colIndex]?.focus()}
        if(e.key === "Enter"){
          const id = row.dataset.id;
          const record = this.state.rows.find(r=>String(r[this.options.rowId])===String(id));
          this.options.onRowOpen?.(record);
        }
        if(e.key === " " && this.options.selectable){
          e.preventDefault();
          const id = String(row.dataset.id);
          if(this.state.selected.has(id)) this.state.selected.delete(id);
          else this.state.selected.add(id);
          this.render();
        }
      });
    });
  }

  bindResizers(){
    this.container.querySelectorAll(".app-table-resizer").forEach(handle=>{
      handle.addEventListener("mousedown",e=>{
        e.preventDefault();
        const th = handle.parentElement;
        const key = handle.dataset.key;
        const startX = e.clientX;
        const startWidth = th.offsetWidth;

        const move = ev=>{
          const width = Math.max(70, startWidth + (ev.clientX - startX));
          this.state.columnWidths[key] = width;
          th.style.width = width+"px";
          th.style.minWidth = width+"px";
        };

        const up = ()=>{
          document.removeEventListener("mousemove",move);
          document.removeEventListener("mouseup",up);
          this.savePreferences();
        };

        document.addEventListener("mousemove",move);
        document.addEventListener("mouseup",up);
      });
    });
  }

  exportCSV(){
    const rows = this.getFilteredRows();
    const cols = this.getVisibleColumns();
    let csv = cols.map(c=>`"${String(c.label).replaceAll('"','""')}"`).join(",")+"\n";
    rows.forEach(row=>{
      csv += cols.map(c=>`"${String(this.getCellValue(row,c) ?? "").replaceAll('"','""')}"`).join(",")+"\n";
    });
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (this.options.preferencesKey || "table") + ".csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  printPDF(){
    const cols = this.getVisibleColumns().map(c=>({
      key:c.key,
      label:c.label,
      value:row=>this.getCellValue(row,c)
    }));
    AppPDF.printStandardReport({
      title:this.options.pdfTitle || "Table Report",
      subtitle:this.options.pdfSubtitle || "",
      columns:cols,
      rows:this.getFilteredRows()
    });
  }

  getSelectedRows(){
    return this.state.rows.filter(row=>this.state.selected.has(String(row[this.options.rowId])));
  }

  clearSelection(){
    this.state.selected.clear();
    this.render();
  }

  loadPreferences(){
    if(!this.options.preferencesKey) return;
    try{
      const saved = JSON.parse(localStorage.getItem("app_table_"+this.options.preferencesKey) || "{}");
      this.state.hiddenColumns = new Set(saved.hiddenColumns || []);
      this.state.columnWidths = saved.columnWidths || {};
      if(saved.pageSize) this.options.pageSize = saved.pageSize;
    }catch{}
  }

  savePreferences(){
    if(!this.options.preferencesKey) return;
    localStorage.setItem("app_table_"+this.options.preferencesKey, JSON.stringify({
      hiddenColumns:[...this.state.hiddenColumns],
      columnWidths:this.state.columnWidths,
      pageSize:this.options.pageSize
    }));
  }
};
