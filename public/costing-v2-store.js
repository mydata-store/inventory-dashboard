
(function(){
const K={materials:'costingV2.materials',rates:'costingV2.rates',entries:'costingV2.entries'};
const defaults=[
{id:'production',name:'Production',group:'Production Information',unit:'Ton',sequence:1,system:true,active:true},
{id:'electricity',name:'Electricity',group:'Production Information',unit:'kWh',sequence:2,system:true,active:true},
{id:'ash-average',name:'Ash Average',group:'Production Information',unit:'%',sequence:3,system:true,active:true},
{id:'steam-total',name:'Steam Total',group:'Production Information',unit:'Ton',sequence:4,system:true,active:true},
{id:'steam-machine',name:'Steam Machine',group:'Production Information',unit:'Ton',sequence:5,system:true,active:true},
{id:'steam-pulp',name:'Steam to Pulp',group:'Production Information',unit:'Ton',sequence:6,system:true,active:true},
{id:'steam-boiler',name:'Steam to Boiler',group:'Production Information',unit:'Ton',sequence:7,system:true,active:true},
{id:'wheat-straw-cattle',name:'Wheat Straw On (Cattle Farm)',group:'Pulp',unit:'Ton',standardYield:33,sequence:101,active:true},
{id:'wheat-straw',name:'Wheat Straw',group:'Pulp',unit:'Ton',standardYield:33,sequence:102,active:true},
{id:'bagasse',name:'Bagasse',group:'Pulp',unit:'Ton',standardYield:29,sequence:103,active:true},
{id:'rice-husk',name:'Rice Husk',group:'Steam',unit:'Ton',sequence:104,active:true},
{id:'bagasse-boiler',name:'Bagasse Boiler',group:'Steam',unit:'Ton',sequence:105,active:true},
{id:'corn-cob',name:'Corn Cob',group:'Steam',unit:'Ton',sequence:106,active:true},
{id:'flour-waste',name:'Flour Waste',group:'Steam',unit:'Ton',sequence:107,active:true},
{id:'mustard-straw',name:'Mustard Straw',group:'Pulp',unit:'Ton',standardYield:33,sequence:108,active:true},
{id:'kahi',name:'Kahi',group:'Pulp',unit:'Ton',standardYield:'',sequence:109,active:true},
{id:'borseem-straw',name:'Borseem Straw',group:'Pulp',unit:'Ton',sequence:110,active:true},
{id:'lin-straw',name:'Lin Straw',group:'Pulp',unit:'Ton',sequence:111,active:true},
{id:'eucalyptus-straw',name:'Eucalyptus Straw',group:'Pulp',unit:'Ton',sequence:112,active:true},
{id:'wood-bora',name:'Wood Bora',group:'Steam',unit:'Ton',sequence:113,active:true},
{id:'cotton-stalk',name:'Cotton Stalk',group:'Pulp',unit:'Ton',sequence:114,active:true},
{id:'wheat-straw-boiler',name:'Wheat Straw (Boiler)',group:'Steam',unit:'Ton',sequence:115,active:true},
{id:'poultry-waste',name:'Poultry Waste',group:'Steam',unit:'Ton',sequence:116,active:true},
{id:'corn-sticks',name:'Corn Sticks',group:'Steam',unit:'Ton',sequence:117,active:true},
{id:'moong-straw',name:'Moong Straw',group:'Steam',unit:'Ton',sequence:118,active:true},
{id:'coal',name:'Coal',group:'Steam',unit:'Ton',sequence:119,active:true},
{id:'cloth-waste',name:'Cloth Waste',group:'Steam',unit:'Ton',sequence:120,active:true},
{id:'sugar-can-crush',name:'Sugar Can Crush',group:'Steam',unit:'Ton',sequence:121,active:true},
{id:'bagasse-pulp',name:'Bagasse Pulp',group:'Recycle',unit:'Ton',sequence:122,active:true},
{id:'soda-ash',name:'Soda Ash',group:'Chemicals',unit:'Kg',sequence:201,active:true},
{id:'sulphur',name:'Sulphur',group:'Chemicals',unit:'Kg',sequence:202,active:true},
{id:'sodium-sulphate',name:'Sodium Sulphate',group:'Chemicals',unit:'Kg',sequence:203,active:true},
{id:'hypo',name:'Hypo',group:'Chemicals',unit:'Kg',sequence:204,active:true},
{id:'soap-stone',name:'Soap Stone',group:'Ash (Filler)',unit:'Kg',standardYield:60,sequence:205,active:true},
{id:'calcium-carbonate',name:'Calcium Carbonate',group:'Ash (Filler)',unit:'Kg',standardYield:60,sequence:206,active:true},
{id:'alum',name:'Alum',group:'Chemicals',unit:'Kg',sequence:207,active:true},
{id:'rosin',name:'Rosin',group:'Chemicals',unit:'Kg',sequence:208,active:true},
{id:'caustic-soda',name:'Caustic Soda',group:'Chemicals',unit:'Kg',sequence:209,active:true},
{id:'starch',name:'Starch',group:'Binder',unit:'Kg',standardYield:60,sequence:301,active:true},
{id:'latex',name:'Latex',group:'Binder',unit:'Kg',standardYield:60,sequence:302,active:true},
{id:'pva',name:'PVA',group:'Binder',unit:'Kg',standardYield:60,sequence:303,active:true},
{id:'cmc',name:'CMC',group:'Binder',unit:'Kg',standardYield:60,sequence:304,active:true},
{id:'blue-color',name:'Blue Color',group:'Color',unit:'Kg',sequence:401,active:true},
{id:'yellow-color',name:'Yellow Color',group:'Color',unit:'Kg',sequence:402,active:true},
{id:'optical-brightener',name:'Optical Brightener',group:'Color',unit:'Kg',sequence:403,active:true}
];
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const n=v=>{const x=parseFloat(v);return Number.isFinite(x)?x:0};
function materials(){let x=read(K.materials,null);if(!Array.isArray(x)||!x.length){x=defaults;write(K.materials,x)}return x.slice().sort((a,b)=>(a.sequence||9999)-(b.sequence||9999)||a.name.localeCompare(b.name))}
function saveMaterials(x){write(K.materials,x)}
function rates(){return read(K.rates,[])} function saveRates(x){write(K.rates,x)}
function entries(){return read(K.entries,[])} function saveEntries(x){write(K.entries,x)}
function ymd(d){return String(d||'').slice(0,10)}
function dayBefore(d){const x=new Date(d+'T00:00:00');x.setDate(x.getDate()-1);return x.toISOString().slice(0,10)}
function addRate(materialId,rate,effectiveFrom,supplier='',remarks=''){let x=rates();x.filter(r=>r.materialId===materialId&&!r.effectiveTo&&r.effectiveFrom<effectiveFrom).forEach(r=>r.effectiveTo=dayBefore(effectiveFrom));x.push({id:'r'+Date.now(),materialId,rate:n(rate),effectiveFrom,effectiveTo:'',supplier,remarks,createdAt:new Date().toISOString()});x.sort((a,b)=>a.effectiveFrom.localeCompare(b.effectiveFrom));saveRates(x);return x}
function effectiveRate(materialId,date){const d=ymd(date);return rates().filter(r=>r.materialId===materialId&&r.effectiveFrom<=d&&(!r.effectiveTo||r.effectiveTo>=d)).sort((a,b)=>b.effectiveFrom.localeCompare(a.effectiveFrom))[0]||null}
function saveDaily(entry){let x=entries();const i=x.findIndex(e=>e.date===entry.date);if(i>=0)x[i]=entry;else x.push(entry);x.sort((a,b)=>a.date.localeCompare(b.date));saveEntries(x)}
function inRange(from,to){return entries().filter(e=>e.date>=from&&e.date<=to)}
function previousClosing(materialId,date){let balance=0;entries().filter(e=>e.date<date).sort((a,b)=>a.date.localeCompare(b.date)).forEach(e=>{const m=e.materials?.[materialId]||{};balance=n(m.opening)+n(m.received)-n(m.pulp)-n(m.boiler)-n(m.pm1)-n(m.pm2)-n(m.pm3)});return balance}
function weightedRate(materialId,from,to,qtyByDate){let q=0,v=0;Object.entries(qtyByDate||{}).forEach(([d,qty])=>{if(d>=from&&d<=to){const z=n(qty),r=effectiveRate(materialId,d);q+=z;v+=z*n(r?.rate)}});return {quantity:q,value:v,averageRate:q?v/q:0}}
window.CostingV2={K,materials,saveMaterials,rates,saveRates,entries,saveEntries,addRate,effectiveRate,saveDaily,inRange,previousClosing,weightedRate,n,ymd};
})();
