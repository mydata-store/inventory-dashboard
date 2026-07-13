window.AppSearch = {
  setupTypeahead(input, options={}){
    const {
      values=[],
      getLabel=value=>String(value),
      minChars=0,
      maxResults=30,
      onSelect,
      onInput
    } = options;

    if(!input) return;

    let wrap = input.parentElement;
    if(!wrap.classList.contains("typeahead-wrap")){
      const newWrap = document.createElement("div");
      newWrap.className = "typeahead-wrap";
      input.parentNode.insertBefore(newWrap,input);
      newWrap.appendChild(input);
      wrap = newWrap;
    }

    let menu = wrap.querySelector(".typeahead-menu");
    if(!menu){
      menu = document.createElement("div");
      menu.className = "typeahead-menu";
      wrap.appendChild(menu);
    }

    let filtered = [];
    let index = -1;

    const close = () => {
      menu.classList.remove("open");
      index = -1;
    };

    const choose = item => {
      input.value = getLabel(item);
      close();
      onSelect?.(item);
      input.dispatchEvent(new Event("change",{bubbles:true}));
    };

    const render = () => {
      const query = input.value.trim().toLowerCase();
      onInput?.(input.value);

      if(query.length < minChars){
        close();
        return;
      }

      filtered = values
        .filter(item => getLabel(item).toLowerCase().includes(query))
        .slice(0,maxResults);

      if(!filtered.length){
        menu.innerHTML = `<div class="typeahead-empty">No matching record</div>`;
        menu.classList.add("open");
        return;
      }

      index = Math.min(index,filtered.length-1);

      menu.innerHTML = filtered.map((item,i)=>`
        <div class="typeahead-option ${i===index?"active":""}" data-index="${i}">
          ${AppTools.escapeHtml(getLabel(item))}
        </div>
      `).join("");

      menu.classList.add("open");

      menu.querySelectorAll(".typeahead-option").forEach(option=>{
        option.addEventListener("mousedown",event=>{
          event.preventDefault();
          choose(filtered[Number(option.dataset.index)]);
        });
      });
    };

    input.addEventListener("focus",()=>{
      index = -1;
      render();
    });

    input.addEventListener("input",()=>{
      index = -1;
      render();
    });

    input.addEventListener("keydown",event=>{
      if(event.key==="ArrowDown"){
        event.preventDefault();
        if(!menu.classList.contains("open")) render();
        index = Math.min(index+1,filtered.length-1);
        render();
      }else if(event.key==="ArrowUp"){
        event.preventDefault();
        index = Math.max(index-1,0);
        render();
      }else if(event.key==="Enter" && menu.classList.contains("open") && filtered.length){
        event.preventDefault();
        if(index<0) index=0;
        choose(filtered[index]);
      }else if(event.key==="Escape"){
        close();
      }else if(event.key==="Tab" && menu.classList.contains("open") && index>=0 && filtered[index]){
        choose(filtered[index]);
      }
    });

    input.addEventListener("blur",()=>setTimeout(close,150));
  },

  openCommandPalette(commands=[]){
    let backdrop=document.getElementById("commandPalette");
    if(!backdrop){
      backdrop=document.createElement("div");
      backdrop.id="commandPalette";
      backdrop.className="command-palette-backdrop";
      backdrop.innerHTML=`
        <div class="command-palette">
          <input class="command-palette-input" placeholder="Search pages, records or actions...">
          <div class="command-palette-results"></div>
        </div>`;
      backdrop.addEventListener("click",e=>{if(e.target===backdrop)this.closeCommandPalette()});
      document.body.appendChild(backdrop);
    }

    const input=backdrop.querySelector(".command-palette-input");
    const results=backdrop.querySelector(".command-palette-results");
    let filtered=commands,index=0;

    const render=()=>{
      const q=input.value.trim().toLowerCase();
      filtered=commands.filter(cmd=>`${cmd.title} ${cmd.keywords||""}`.toLowerCase().includes(q)).slice(0,30);
      index=Math.min(index,Math.max(filtered.length-1,0));
      results.innerHTML=filtered.map((cmd,i)=>`
        <div class="command-result ${i===index?"active":""}" data-index="${i}">
          <strong>${AppTools.escapeHtml(cmd.title)}</strong>
          <span>${AppTools.escapeHtml(cmd.subtitle||"")}</span>
        </div>`).join("") || `<div class="command-empty">No result found.</div>`;

      results.querySelectorAll(".command-result").forEach(el=>{
        el.addEventListener("mousedown",()=>run(Number(el.dataset.index)));
      });
    };

    const run=i=>{
      const cmd=filtered[i];if(!cmd)return;
      this.closeCommandPalette();
      if(typeof cmd.action==="function")cmd.action();
      else if(cmd.href)location.href=cmd.href;
    };

    input.oninput=()=>{index=0;render()};
    input.onkeydown=e=>{
      if(e.key==="ArrowDown"){e.preventDefault();index=Math.min(index+1,filtered.length-1);render()}
      if(e.key==="ArrowUp"){e.preventDefault();index=Math.max(index-1,0);render()}
      if(e.key==="Enter"){e.preventDefault();run(index)}
      if(e.key==="Escape")this.closeCommandPalette();
    };

    backdrop.classList.add("open");
    input.value="";
    render();
    setTimeout(()=>input.focus(),0);
  },

  closeCommandPalette(){
    document.getElementById("commandPalette")?.classList.remove("open");
  }
};

document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){
    e.preventDefault();
    if(window.APP_COMMANDS)AppSearch.openCommandPalette(window.APP_COMMANDS);
  }
});
