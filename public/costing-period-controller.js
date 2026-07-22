
(function(){
  const KEYS=['costingProductionRecords','dailyProductionRecords','productionRecords','paperProductionRecords'];
  const state={mode:'daily', records:[], selected:null};
  function num(v){const x=Number(v);return Number.isFinite(x)?x:0}
  function normDate(v){
    if(!v)return '';
    const s=String(v).trim();
    const iso=s.match(/^(\d{4})-(\d{2})-(\d{2})/); if(iso)return `${iso[1]}-${iso[2]}-${iso[3]}`;
    const dmy=s.match(/^(\d{1,2})[-\/.](\d{1,2}|[A-Za-z]{3})[-\/.](\d{2,4})$/);
    if(dmy){const months={jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};let m=months[String(dmy[2]).toLowerCase()]||Number(dmy[2]);let y=Number(dmy[3]);if(y<100)y+=2000;return `${y}-${String(m).padStart(2,'0')}-${String(dmy[1]).padStart(2,'0')}`}
    const dt=new Date(s);return isNaN(dt)?'':dt.toISOString().slice(0,10)
  }
  function normalize(r){
    const production=num(r.production ?? r.paperProduction ?? r.paper_production ?? r.quantity ?? r.qty ?? r.tons);
    const ash=num(r.ashPercent ?? r.ash_percent ?? r.ash ?? r.paperAsh ?? r.paper_ash);
    return {date:normDate(r.date ?? r.productionDate ?? r.production_date ?? r.day),production,ash,raw:r};
  }
  function loadRecords(){
    let rows=[];
    if(Array.isArray(window.COSTING_PRODUCTION_RECORDS)) rows=window.COSTING_PRODUCTION_RECORDS;
    if(!rows.length){
      for(const k of KEYS){try{const v=JSON.parse(localStorage.getItem(k)||'null');if(Array.isArray(v)&&v.length){rows=v;break}if(v&&Array.isArray(v.records)&&v.records.length){rows=v.records;break}}catch(e){}}
    }
    state.records=rows.map(normalize).filter(r=>r.date).sort((a,b)=>a.date.localeCompare(b.date));
    return state.records;
  }
  function monthName(v){if(!v)return '';const [y,m]=v.split('-');return new Date(Number(y),Number(m)-1,1).toLocaleDateString('en-GB',{month:'long',year:'numeric'})}
  function calculate(mode,value){
    const all=loadRecords();
    let rows=mode==='monthly'?all.filter(r=>r.date.startsWith(value+'-')):all.filter(r=>r.date===value);
    const productionRows=rows.filter(r=>r.production>0);
    const production=productionRows.reduce((s,r)=>s+r.production,0);
    const ashSum=productionRows.reduce((s,r)=>s+r.ash,0);
    const days=productionRows.length;
    const avgAsh=days?ashSum/days:0; // factory-approved method
    const ashContent=production*avgAsh/100;
    const pulpPortion=production-ashContent;
    return {mode,value,label:mode==='monthly'?monthName(value):value,records:rows,productionDays:days,production,averageAsh:avgAsh,paperAshContent:ashContent,pulpPortion};
  }
  function setText(id,v){const e=document.getElementById(id);if(e)e.textContent=v}
  function render(data){
    setText('cpPeriod',data.label||'—');
    setText('cpDays',data.productionDays);
    setText('cpProduction',data.production.toFixed(3)+' Ton');
    setText('cpAsh',data.averageAsh.toFixed(2)+'%');
    setText('cpAshContent',data.paperAshContent.toFixed(3)+' Ton');
    setText('cpPulp',data.pulpPortion.toFixed(3)+' Ton');
    const msg=document.getElementById('cpMessage');
    if(msg){msg.textContent=data.records.length?`${data.records.length} saved record(s) loaded.`:'No saved production record found for this selection.';msg.className='period-message '+(data.records.length?'ok':'warn')}
    state.selected=data;
    localStorage.setItem('costingSelectedPeriod',JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('costing-period-loaded',{detail:data}));
  }
  function loadSelection(){
    const mode=document.getElementById('cpMode')?.value||'daily';
    const value=(mode==='monthly'?document.getElementById('cpMonth'):document.getElementById('cpDate'))?.value||'';
    if(!value){const m=document.getElementById('cpMessage');if(m){m.textContent='Select a date or month first.';m.className='period-message warn'}return}
    render(calculate(mode,value));
  }
  function switchMode(){
    const mode=document.getElementById('cpMode')?.value||'daily';state.mode=mode;
    document.getElementById('cpDateWrap')?.classList.toggle('hidden',mode!=='daily');
    document.getElementById('cpMonthWrap')?.classList.toggle('hidden',mode!=='monthly');
  }
  function init(){
    const root=document.getElementById('costingPeriodSelector');if(!root)return;
    root.innerHTML=`<div class="period-selector-card"><div class="period-title"><div><h2>Costing Period Selector</h2><p>Load production and ash from the saved daily or monthly production point.</p></div><span class="period-rule">Ash average uses production days only</span></div><div class="period-controls"><label>Search Type<select id="cpMode"><option value="daily">Daily</option><option value="monthly">Monthly</option></select></label><label id="cpDateWrap">Production Date<input id="cpDate" type="date"></label><label id="cpMonthWrap" class="hidden">Production Month<input id="cpMonth" type="month"></label><button class="btn btn-primary" id="cpLoad">Load Saved Data</button></div><div id="cpMessage" class="period-message">Choose a date or month to load production.</div><div class="period-summary"><div><small>Selected Period</small><strong id="cpPeriod">—</strong></div><div><small>Production Days</small><strong id="cpDays">0</strong></div><div><small>Paper Production</small><strong id="cpProduction">0.000 Ton</strong></div><div><small>Average Ash</small><strong id="cpAsh">0.00%</strong></div><div><small>Paper Ash Content</small><strong id="cpAshContent">0.000 Ton</strong></div><div><small>Pulp Portion</small><strong id="cpPulp">0.000 Ton</strong></div></div></div>`;
    document.getElementById('cpMode').addEventListener('change',switchMode);
    document.getElementById('cpLoad').addEventListener('click',loadSelection);switchMode();
    try{const saved=JSON.parse(localStorage.getItem('costingSelectedPeriod')||'null');if(saved){document.getElementById('cpMode').value=saved.mode||'daily';switchMode();if(saved.mode==='monthly')document.getElementById('cpMonth').value=saved.value||'';else document.getElementById('cpDate').value=saved.value||'';render(calculate(saved.mode||'daily',saved.value||''));}}catch(e){}
  }
  window.CostingPeriod={init,loadSelection,calculate,loadRecords,getSelected:()=>state.selected};
  document.addEventListener('DOMContentLoaded',init);
})();
