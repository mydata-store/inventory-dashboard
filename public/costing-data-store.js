(function(){
  const MATERIAL_KEY='costingMaterialMasterV18';
  const RATE_KEY='costingMaterialRatesV18';
  const defaultMaterials=[
    {id:'production',name:'Production',group:'Production Information',unit:'Ton',sequence:1,system:true},
    {id:'electricity',name:'Electricity',group:'Production Information',unit:'kWh',sequence:2,system:true},
    {id:'ash-avg',name:'Ash Avg',group:'Production Information',unit:'%',sequence:3,system:true},
    {id:'steam-total',name:'Steam Total',group:'Production Information',unit:'Ton',sequence:4,system:true},
    {id:'steam-machine',name:'Steam Machine',group:'Production Information',unit:'Ton',sequence:5,system:true},
    {id:'steam-pulp',name:'Steam To Pulp',group:'Production Information',unit:'Ton',sequence:6,system:true},
    {id:'steam-boiler',name:'Steam To Boiler',group:'Production Information',unit:'Ton',sequence:7,system:true},
    {id:'wheat-straw-cattle',name:'Wheat Straw On (Cattle Farm)',group:'Pulp',unit:'Ton',standardYield:33,sequence:101},
    {id:'wheat-straw',name:'Wheat Straw',group:'Pulp',unit:'Ton',standardYield:33,sequence:102},
    {id:'bagasse',name:'Bagasse',group:'Pulp',unit:'Ton',standardYield:29,sequence:103},
    {id:'rice-husk',name:'Rice Husk',group:'Steam',unit:'Ton',sequence:104},
    {id:'bagasse-boiler',name:'Bagasse Boiler',group:'Steam',unit:'Ton',sequence:105},
    {id:'corn-cob',name:'Corn Cob',group:'Steam',unit:'Ton',sequence:106},
    {id:'flour-waste',name:'Flour Waste',group:'Steam',unit:'Ton',sequence:107},
    {id:'mustard-straw',name:'Mustard Straw',group:'Pulp',unit:'Ton',standardYield:33,sequence:108},
    {id:'kahi',name:'Kahi',group:'Pulp',unit:'Ton',standardYield:'',sequence:109},
    {id:'borseem-straw',name:'Borseem Straw',group:'Pulp',unit:'Ton',standardYield:'',sequence:110},
    {id:'lin-straw',name:'Lin Straw',group:'Pulp',unit:'Ton',standardYield:'',sequence:111},
    {id:'eucalyptus-straw',name:'Eucalyptus Straw',group:'Pulp',unit:'Ton',standardYield:'',sequence:112},
    {id:'wood-bora',name:'Wood Bora',group:'Steam',unit:'Ton',sequence:113},
    {id:'cotton-stalk',name:'Cotton Stalk',group:'Pulp',unit:'Ton',standardYield:'',sequence:114},
    {id:'wheat-straw-boiler',name:'Wheat Straw (Boiler)',group:'Steam',unit:'Ton',sequence:115},
    {id:'poultry-waste',name:'Poultry Waste',group:'Steam',unit:'Ton',sequence:116},
    {id:'corn-sticks',name:'Corn Sticks',group:'Steam',unit:'Ton',sequence:117},
    {id:'moong-straw',name:'Moong Straw',group:'Steam',unit:'Ton',sequence:118},
    {id:'coal',name:'Coal',group:'Steam',unit:'Ton',sequence:119},
    {id:'cloth-waste',name:'Cloth Waste',group:'Steam',unit:'Ton',sequence:120},
    {id:'sugar-can-crush',name:'Sugar Can Crush',group:'Steam',unit:'Ton',sequence:121},
    {id:'bagasse-pulp',name:'Bagasse Pulp',group:'Recycle',unit:'Ton',sequence:122},
    {id:'soda-ash',name:'Soda Ash',group:'Chemicals',unit:'Kg',sequence:201},
    {id:'sulphur',name:'Sulphur',group:'Chemicals',unit:'Kg',sequence:202},
    {id:'sodium-sulphate',name:'Sodium Sulphate',group:'Chemicals',unit:'Kg',sequence:203},
    {id:'hypo',name:'Hypo',group:'Chemicals',unit:'Kg',sequence:204},
    {id:'soap-stone',name:'Soap Stone',group:'Ash (Filler)',unit:'Kg',standardYield:60,sequence:205},
    {id:'calcium-carbonate',name:'Calcium Carbonate',group:'Ash (Filler)',unit:'Kg',standardYield:60,sequence:206},
    {id:'alum',name:'Alum',group:'Chemicals',unit:'Kg',sequence:207},
    {id:'rosin',name:'Rosin',group:'Chemicals',unit:'Kg',sequence:208},
    {id:'caustic-soda',name:'Caustic Soda',group:'Chemicals',unit:'Kg',sequence:209},
    {id:'starch',name:'Starch',group:'Binder',unit:'Kg',standardYield:60,sequence:301},
    {id:'latex',name:'Latex',group:'Binder',unit:'Kg',standardYield:60,sequence:302},
    {id:'pva',name:'PVA',group:'Binder',unit:'Kg',standardYield:60,sequence:303},
    {id:'cmc',name:'CMC',group:'Binder',unit:'Kg',standardYield:60,sequence:304},
    {id:'blue-color',name:'Blue Color',group:'Color',unit:'Kg',sequence:401},
    {id:'yellow-color',name:'Yellow Color',group:'Color',unit:'Kg',sequence:402},
    {id:'optical-brightener',name:'Optical Brightener',group:'Color',unit:'Kg',sequence:403}
  ];
  function read(key,fallback){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch(e){return fallback}}
  function write(key,value){localStorage.setItem(key,JSON.stringify(value))}
  function ensure(){let m=read(MATERIAL_KEY,null);if(!Array.isArray(m)||!m.length){m=defaultMaterials;write(MATERIAL_KEY,m)}return m}
  function materials(){return ensure().slice().sort((a,b)=>(a.sequence||9999)-(b.sequence||9999)||a.name.localeCompare(b.name))}
  function saveMaterials(list){write(MATERIAL_KEY,list)}
  function rates(){const r=read(RATE_KEY,[]);return Array.isArray(r)?r:[]}
  function saveRates(list){write(RATE_KEY,list)}
  function effectiveRate(materialId,date){const d=String(date||'').slice(0,10);return rates().filter(r=>r.materialId===materialId&&r.effectiveFrom<=d&&(!r.effectiveTo||r.effectiveTo>=d)).sort((a,b)=>b.effectiveFrom.localeCompare(a.effectiveFrom))[0]||null}
  function addRate(materialId,rate,effectiveFrom){const list=rates();const start=effectiveFrom;list.filter(r=>r.materialId===materialId&&!r.effectiveTo&&r.effectiveFrom<start).forEach(r=>{const x=new Date(start+'T00:00:00');x.setDate(x.getDate()-1);r.effectiveTo=x.toISOString().slice(0,10)});list.push({id:'rate-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),materialId,rate:Number(rate)||0,effectiveFrom:start,effectiveTo:'',createdAt:new Date().toISOString()});saveRates(list);return list}
  function n(v){const x=parseFloat(v);return Number.isFinite(x)?x:0}
  function rateForRange(materialId,from,to,datedQty){let totalQty=0,totalValue=0;Object.entries(datedQty||{}).forEach(([date,qty])=>{if(date>=from&&date<=to){const q=n(qty);const rr=effectiveRate(materialId,date);totalQty+=q;totalValue+=q*(rr?rr.rate:0)}});return {quantity:totalQty,value:totalValue,averageRate:totalQty?totalValue/totalQty:0}}
  window.CostingStore={materials,saveMaterials,rates,saveRates,effectiveRate,addRate,rateForRange,n,MATERIAL_KEY,RATE_KEY};
})();
