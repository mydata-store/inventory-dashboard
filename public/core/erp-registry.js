(function(){
const KEY='erp_feature_registry_v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const api={id:'registry',init(ERP){this.ERP=ERP;ERP.state.registry=read();this.registerPage({id:document.body?.dataset.erpPage||location.pathname.split('/').pop()||'unknown',path:location.pathname,status:'active'});},registerPage(page){const r=read();r.pages=r.pages||{};r.pages[page.id]={...(r.pages[page.id]||{}),...page,lastSeen:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(r));this.ERP&&(this.ERP.state.registry=r);return r.pages[page.id]},registerFeature(feature){if(!feature?.id)throw Error('Feature id required');const r=read();r.features=r.features||{};r.features[feature.id]={...(r.features[feature.id]||{}),...feature,updatedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(r));return r.features[feature.id]},all(){return read()}};
window.ERP.registerModule(api);window.ERPRegistry=api;
})();
