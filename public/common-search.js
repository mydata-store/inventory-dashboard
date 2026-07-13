window.AppSearch = {
  setupTypeahead(input, options={}){
    const {
      values=[],
      getLabel=value=>String(value),
      minChars=0,
      maxResults=30,
      onSelect
    } = options;

    const wrap = input.closest(".combo") || (()=> {
      const div=document.createElement("div");
      div.className="combo";
      input.parentNode.insertBefore(div,input);
      div.appendChild(input);
      return div;
    })();

    let menu=wrap.querySelector(".combo-menu");
    if(!menu){
      menu=document.createElement("div");
      menu.className="combo-menu";
      wrap.appendChild(menu);
    }

    let filtered=[],index=-1;

    const render=()=>{
      const query=input.value.trim().toLowerCase();
      if(query.length<minChars){
        menu.classList.remove("open");
        return;
      }

      filtered=values.filter(item=>getLabel(item).toLowerCase().includes(query)).slice(0,maxResults);
      index=Math.min(index,filtered.length-1);

      menu.innerHTML=filtered.map((item,i)=>`
        <div class="combo-option ${i===index?"active":""}" data-index="${i}">
          ${AppTools.escapeHtml(getLabel(item))}
        </div>
      `).join("");

      menu.classList.toggle("open",filtered.length>0);

      menu.querySelectorAll(".combo-option").forEach(option=>{
        option.addEventListener("mousedown",()=>{
          const item=filtered[Number(option.dataset.index)];
          input.value=getLabel(item);
          menu.classList.remove("open");
          onSelect?.(item);
        });
      });
    };

    input.addEventListener("focus",()=>{index=-1;render()});
    input.addEventListener("input",()=>{index=-1;render()});
    input.addEventListener("keydown",e=>{
      if(e.key==="ArrowDown"){e.preventDefault();index=Math.min(index+1,filtered.length-1);render()}
      if(e.key==="ArrowUp"){e.preventDefault();index=Math.max(index-1,0);render()}
      if(e.key==="Enter"&&filtered.length){
        e.preventDefault();
        if(index<0)index=0;
        const item=filtered[index];
        input.value=getLabel(item);
        menu.classList.remove("open");
        onSelect?.(item);
      }
      if(e.key==="Escape")menu.classList.remove("open");
    });
    input.addEventListener("blur",()=>setTimeout(()=>menu.classList.remove("open"),120));
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
