window.AppForm = class {
  constructor(options){
    this.options = {
      container: null,
      fields: [],
      values: {},
      buttons: ["new","save","clear"],
      title: "",
      draftKey: "",
      autoDraft: true,
      draftDelay: 500,
      warnUnsaved: true,
      onSave: null,
      onNew: null,
      onClear: null,
      onDelete: null,
      onPrint: null,
      onHistory: null,
      ...options
    };

    this.container = typeof this.options.container === "string"
      ? document.querySelector(this.options.container)
      : this.options.container;

    if(!this.container) throw new Error("AppForm container not found.");

    this.state = {
      values: {...this.options.values},
      originalValues: {...this.options.values},
      undoStack: [],
      redoStack: [],
      dirty: false,
      saving: false
    };

    this.render();
    this.bindEvents();
    this.restoreDraftPrompt();
    this.setupUnsavedWarning();
  }

  render(){
    this.container.innerHTML = `
      <div class="app-form-shell">
        ${this.options.title ? `<h2 class="app-form-title">${AppTools.escapeHtml(this.options.title)}</h2>` : ""}
        <div class="app-form-grid">
          ${this.options.fields.map(field => this.renderField(field)).join("")}
        </div>
        <div class="app-form-actions">
          ${this.renderButtons()}
        </div>
        <div class="app-form-errors" aria-live="polite"></div>
      </div>
    `;

    this.applyValues(this.state.values);
    AppTools.setupAutoCapitalize(this.container);
    AppTools.setupNumericFields(this.container);
    AppTools.setupDateFields(this.container);
    AppTools.setupEnterNavigation(this.container,()=>this.save());
  }

  renderField(field){
    const id = this.fieldId(field.name);
    const classes = ["app-form-field"];
    if(field.span) classes.push(`span-${field.span}`);
    if(field.hidden) classes.push("hidden");

    const attrs = [
      field.capitalize ? "data-capitalize" : "",
      field.numeric ? "data-numeric" : "",
      field.date ? "data-date" : "",
      field.readonly ? "readonly" : "",
      field.disabled ? "disabled" : "",
      field.placeholder ? `placeholder="${AppTools.escapeHtml(field.placeholder)}"` : "",
      field.autocomplete ? `autocomplete="${AppTools.escapeHtml(field.autocomplete)}"` : "autocomplete='off'",
      field.maxlength ? `maxlength="${Number(field.maxlength)}"` : ""
    ].filter(Boolean).join(" ");

    let control = "";

    if(field.type === "select"){
      control = `<select id="${id}" name="${AppTools.escapeHtml(field.name)}" ${attrs}>
        ${(field.options||[]).map(option=>{
          const value = typeof option === "object" ? option.value : option;
          const label = typeof option === "object" ? option.label : option;
          return `<option value="${AppTools.escapeHtml(value)}">${AppTools.escapeHtml(label)}</option>`;
        }).join("")}
      </select>`;
    }else if(field.type === "textarea"){
      control = `<textarea id="${id}" name="${AppTools.escapeHtml(field.name)}" ${attrs}></textarea>`;
    }else if(field.type === "checkbox"){
      control = `<label class="app-form-check">
        <input type="checkbox" id="${id}" name="${AppTools.escapeHtml(field.name)}">
        <span>${AppTools.escapeHtml(field.checkboxLabel || field.label)}</span>
      </label>`;
    }else if(field.type === "file"){
      control = `<input type="file" id="${id}" name="${AppTools.escapeHtml(field.name)}"
        ${field.accept ? `accept="${AppTools.escapeHtml(field.accept)}"` : ""}>`;
    }else{
      control = `<input type="${AppTools.escapeHtml(field.inputType || "text")}" id="${id}"
        name="${AppTools.escapeHtml(field.name)}" ${attrs}>`;
    }

    return `<div class="${classes.join(" ")}" data-field="${AppTools.escapeHtml(field.name)}">
      ${field.type !== "checkbox" ? `<label for="${id}">${AppTools.escapeHtml(field.label)}${field.required ? " *" : ""}</label>` : ""}
      ${control}
      <div class="app-form-field-error"></div>
      ${field.help ? `<small>${AppTools.escapeHtml(field.help)}</small>` : ""}
    </div>`;
  }

  renderButtons(){
    const labels = {
      new:"New",save:"Save",delete:"Delete",clear:"Clear",print:"Print / PDF",
      excel:"Export Excel",history:"History",back:"Back"
    };
    const classes = {
      new:"btn-primary",save:"btn-success",delete:"btn-danger",clear:"btn-warning",
      print:"btn-danger",excel:"btn-primary",history:"btn-dark",back:"btn-light"
    };

    return this.options.buttons.map(key=>`
      <button type="button" class="btn ${classes[key]||"btn-light"}" data-form-action="${key}">
        ${labels[key]||key}
      </button>
    `).join("");
  }

  fieldId(name){ return `appForm_${name}`; }

  getField(name){
    return this.container.querySelector(`#${CSS.escape(this.fieldId(name))}`);
  }

  getValues(){
    const values = {};
    this.options.fields.forEach(field=>{
      const el = this.getField(field.name);
      if(!el) return;

      if(field.type === "checkbox"){
        values[field.name] = el.checked;
      }else if(field.type === "file"){
        values[field.name] = el.files?.[0] || null;
      }else{
        let value = el.value;
        if(field.trim !== false) value = value.trim();
        if(field.capitalize) value = AppTools.titleCase(value);
        if(field.uppercase) value = value.toUpperCase();
        if(field.lowercase) value = value.toLowerCase();
        if(field.number) value = value === "" ? null : Number(value);
        if(field.date && value) value = AppTools.parseDate(value) || value;
        values[field.name] = value;
      }
    });
    return values;
  }

  applyValues(values={}){
    this.options.fields.forEach(field=>{
      const el = this.getField(field.name);
      if(!el) return;
      const value = values[field.name];

      if(field.type === "checkbox"){
        el.checked = Boolean(value);
      }else if(field.type !== "file"){
        el.value = value ?? field.defaultValue ?? "";
      }
    });
  }

  setValues(values,markClean=false){
    this.pushUndo();
    this.state.values = {...this.state.values,...values};
    this.applyValues(this.state.values);
    if(markClean){
      this.state.originalValues = {...this.state.values};
      this.state.dirty = false;
    }else{
      this.markDirty();
    }
  }

  setFieldValue(name,value){
    const el = this.getField(name);
    if(!el) return;
    this.pushUndo();
    if(el.type === "checkbox") el.checked = Boolean(value);
    else el.value = value ?? "";
    this.state.values = this.getValues();
    this.markDirty();
  }

  getFieldValue(name){
    return this.getValues()[name];
  }

  validate(){
    this.clearErrors();
    const values = this.getValues();
    const errors = {};

    this.options.fields.forEach(field=>{
      const value = values[field.name];

      if(field.required){
        const empty = field.type === "checkbox" ? !value : value === null || value === undefined || value === "";
        if(empty) errors[field.name] = `${field.label} is required.`;
      }

      if(!errors[field.name] && field.minLength && String(value||"").length < field.minLength){
        errors[field.name] = `${field.label} must contain at least ${field.minLength} characters.`;
      }

      if(!errors[field.name] && field.maxLength && String(value||"").length > field.maxLength){
        errors[field.name] = `${field.label} cannot exceed ${field.maxLength} characters.`;
      }

      if(!errors[field.name] && field.pattern && value){
        const regex = field.pattern instanceof RegExp ? field.pattern : new RegExp(field.pattern);
        if(!regex.test(String(value))) errors[field.name] = field.patternMessage || `${field.label} is invalid.`;
      }

      if(!errors[field.name] && field.min !== undefined && value !== "" && Number(value) < Number(field.min)){
        errors[field.name] = `${field.label} must be at least ${field.min}.`;
      }

      if(!errors[field.name] && field.max !== undefined && value !== "" && Number(value) > Number(field.max)){
        errors[field.name] = `${field.label} cannot exceed ${field.max}.`;
      }

      if(!errors[field.name] && typeof field.validate === "function"){
        const message = field.validate(value,values);
        if(message) errors[field.name] = message;
      }
    });

    if(typeof this.options.validate === "function"){
      const extra = this.options.validate(values) || {};
      Object.assign(errors,extra);
    }

    Object.entries(errors).forEach(([name,message])=>this.showFieldError(name,message));

    const first = Object.keys(errors)[0];
    if(first) this.getField(first)?.focus();

    return {valid:Object.keys(errors).length===0,values,errors};
  }

  showFieldError(name,message){
    const wrap = this.container.querySelector(`[data-field="${CSS.escape(name)}"]`);
    if(!wrap) return;
    wrap.classList.add("has-error");
    wrap.querySelector(".app-form-field-error").textContent = message;
  }

  clearErrors(){
    this.container.querySelectorAll(".app-form-field").forEach(wrap=>wrap.classList.remove("has-error"));
    this.container.querySelectorAll(".app-form-field-error").forEach(el=>el.textContent="");
    this.container.querySelector(".app-form-errors").textContent="";
  }

  async save(){
    if(this.state.saving) return;
    const result = this.validate();
    if(!result.valid){
      AppTools.toast("Please correct the highlighted fields.","error");
      return;
    }

    try{
      this.state.saving = true;
      const saveButton = this.container.querySelector("[data-form-action='save']");
      if(saveButton){saveButton.disabled=true;saveButton.textContent="Saving...";}

      const response = await this.options.onSave?.(result.values,this);

      if(response !== false){
        this.state.values = {...result.values};
        this.state.originalValues = {...result.values};
        this.state.dirty = false;
        this.clearDraft();
        AppTools.toast("Saved successfully.","success");
      }
    }catch(error){
      AppTools.toast(error?.message || "Save failed.","error");
    }finally{
      this.state.saving = false;
      const saveButton = this.container.querySelector("[data-form-action='save']");
      if(saveButton){saveButton.disabled=false;saveButton.textContent="Save";}
    }
  }

  newRecord(){
    if(this.state.dirty && !confirm("Discard unsaved changes and create a new record?")) return;
    this.clear(false);
    this.options.onNew?.(this);
  }

  clear(confirmDirty=true){
    if(confirmDirty && this.state.dirty && !confirm("Clear unsaved form values?")) return;
    this.pushUndo();
    const defaults = {};
    this.options.fields.forEach(field=>defaults[field.name]=field.defaultValue ?? (field.type==="checkbox" ? false : ""));
    this.state.values = defaults;
    this.applyValues(defaults);
    this.clearErrors();
    this.state.dirty = false;
    this.clearDraft();
    this.options.onClear?.(this);
  }

  pushUndo(){
    const current = this.getValues();
    this.state.undoStack.push(current);
    if(this.state.undoStack.length > 50) this.state.undoStack.shift();
    this.state.redoStack = [];
  }

  undo(){
    if(!this.state.undoStack.length){
      AppTools.toast("Nothing to undo.","info");
      return;
    }
    this.state.redoStack.push(this.getValues());
    const values = this.state.undoStack.pop();
    this.state.values = {...values};
    this.applyValues(values);
    this.markDirty();
  }

  redo(){
    if(!this.state.redoStack.length){
      AppTools.toast("Nothing to redo.","info");
      return;
    }
    this.state.undoStack.push(this.getValues());
    const values = this.state.redoStack.pop();
    this.state.values = {...values};
    this.applyValues(values);
    this.markDirty();
  }

  markDirty(){
    this.state.dirty = true;
    if(this.options.autoDraft) this.scheduleDraft();
  }

  scheduleDraft(){
    if(!this.options.draftKey) return;
    clearTimeout(this.draftTimer);
    this.draftTimer = setTimeout(()=>this.saveDraft(),this.options.draftDelay);
  }

  saveDraft(){
    if(!this.options.draftKey) return;
    const values = this.getValues();
    const serializable = {};
    Object.entries(values).forEach(([key,value])=>{
      if(!(value instanceof File)) serializable[key]=value;
    });
    localStorage.setItem(`app_form_draft_${this.options.draftKey}`,JSON.stringify({
      values:serializable,
      savedAt:new Date().toISOString()
    }));
  }

  getDraft(){
    if(!this.options.draftKey) return null;
    try{
      return JSON.parse(localStorage.getItem(`app_form_draft_${this.options.draftKey}`) || "null");
    }catch{
      return null;
    }
  }

  clearDraft(){
    if(this.options.draftKey) localStorage.removeItem(`app_form_draft_${this.options.draftKey}`);
  }

  restoreDraftPrompt(){
    const draft = this.getDraft();
    if(!draft?.values) return;

    const date = draft.savedAt ? new Date(draft.savedAt).toLocaleString() : "";
    if(confirm(`A saved draft was found${date ? " from "+date : ""}. Restore it?`)){
      this.state.values = {...draft.values};
      this.applyValues(draft.values);
      this.state.dirty = true;
      AppTools.toast("Draft restored.","success");
    }else{
      this.clearDraft();
    }
  }

  setupUnsavedWarning(){
    if(!this.options.warnUnsaved) return;
    window.addEventListener("beforeunload",event=>{
      if(!this.state.dirty) return;
      event.preventDefault();
      event.returnValue="";
    });
  }

  bindEvents(){
    this.container.addEventListener("input",event=>{
      if(!event.target.matches("input,select,textarea")) return;
      this.pushUndo();
      this.state.values = this.getValues();
      this.markDirty();

      const fieldName = event.target.name;
      const field = this.options.fields.find(f=>f.name===fieldName);
      if(field?.onInput) field.onInput(event.target.value,this);
    });

    this.container.addEventListener("change",event=>{
      if(!event.target.matches("input,select,textarea")) return;
      const fieldName = event.target.name;
      const field = this.options.fields.find(f=>f.name===fieldName);
      if(field?.onChange) field.onChange(this.getFieldValue(fieldName),this);
    });

    this.container.querySelectorAll("[data-form-action]").forEach(button=>{
      button.addEventListener("click",()=>{
        const action = button.dataset.formAction;
        if(action==="save") this.save();
        if(action==="new") this.newRecord();
        if(action==="clear") this.clear();
        if(action==="delete") this.options.onDelete?.(this.getValues(),this);
        if(action==="print") this.options.onPrint?.(this.getValues(),this);
        if(action==="history") this.options.onHistory?.(this);
        if(action==="back") history.back();
      });
    });

    document.addEventListener("keydown",event=>{
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="s"){
        event.preventDefault();this.save();
      }
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="n"){
        event.preventDefault();this.newRecord();
      }
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="z"&&!event.shiftKey){
        event.preventDefault();this.undo();
      }
      if(((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="y")||
         ((event.ctrlKey||event.metaKey)&&event.shiftKey&&event.key.toLowerCase()==="z")){
        event.preventDefault();this.redo();
      }
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="p"&&this.options.onPrint){
        event.preventDefault();this.options.onPrint(this.getValues(),this);
      }
    });
  }
};
