(()=>{'use strict';
const PCC_KEY='erpProgramControlCenterV3';
const CURRENT_KEY='erpCurrentUserId';
const MODULE_MAP={
 'costing':'Costing Dashboard','formula-control-center':'Formula Control Center','material-group-rate-master':'Material Group & Rate Master','consumption-entry':'Consumption Entry','consumption-report':'Consumption Report','cost-report':'Cost Report','design-studio':'Design Studio','erp-design-studio':'Design Studio','control-center':'Design Studio','settings':'Design Studio','program-control-center':'Program Control Center'
};
const ACTION_WORDS={add:['add','new','save'],edit:['edit','update'],delete:['delete','remove'],approve:['approve'],print:['print'],pdf:['pdf'],excel:['excel','export'],design:['design page']};
function parse(v,f={}){try{return JSON.parse(v)||f}catch{return f}}
function pcc(){return parse(localStorage.getItem(PCC_KEY),{});}
function pageId(){return (document.body?.dataset?.pageId||location.pathname.split('/').pop().replace(/\.html$/,'')||'').toLowerCase()}
function moduleName(){return MODULE_MAP[pageId()]||document.title||pageId()}
function currentUser(state=pcc()){
 const id=localStorage.getItem(CURRENT_KEY)||state.users?.[0]?.id||'u-super';
 return state.users?.find(u=>u.id===id)||state.users?.[0]||{id:'u-super',name:'Muhammad Waqas',role:'Super Administrator',status:'active'};
}
function perm(action,module=moduleName(),state=pcc(),user=currentUser(state)){
 if(user.role==='Super Administrator')return true;
 const r=state.permissions?.[user.role]?.[module];
 if(!r)return action==='view' && !state.permissions?.[user.role];
 return !!r[action];
}
function studioAllowed(state,user){
 if(user.role==='Super Administrator')return true;
 const policy=state.security?.designAdmins||'admins';
 if(policy==='super')return false;
 return user.role==='Administrator' || perm('design','Design Studio',state,user) || perm('view','Design Studio',state,user);
}
function controlAllowed(state,user){
 if(user.role==='Super Administrator')return true;
 return state.security?.controlCenterAccess==='admins' && user.role==='Administrator' && perm('view','Program Control Center',state,user);
}
function accessAllowed(state,user){
 const m=moduleName();
 if(user.status && user.status!=='active')return false;
 if(m==='Design Studio')return studioAllowed(state,user);
 if(m==='Program Control Center')return controlAllowed(state,user);
 return perm('view',m,state,user);
}
function deny(user){
 document.documentElement.style.background='#f4f7f6';
 document.body.innerHTML=`<main style="min-height:100vh;display:grid;place-items:center;padding:24px;font-family:Inter,Arial,sans-serif;background:#f4f7f6;color:#14251f"><section style="max-width:560px;background:white;border:1px solid #dbe4e0;border-radius:18px;padding:28px;box-shadow:0 18px 50px rgba(15,23,42,.12);text-align:center"><div style="font-size:42px">🔒</div><h1 style="margin:10px 0 8px">Access Restricted</h1><p style="color:#64748b;line-height:1.6">${user.name||'This user'} does not have permission to open <b>${moduleName()}</b>.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px"><a href="costing.html" style="padding:10px 15px;border-radius:10px;background:#117a55;color:white;text-decoration:none;font-weight:700">Open Dashboard</a><a href="program-control-center.html" style="padding:10px 15px;border-radius:10px;border:1px solid #cbd5e1;color:#334155;text-decoration:none;font-weight:700">Program Control Center</a></div></section></main>`;
}
function applyActions(state,user){
 const m=moduleName();
 document.querySelectorAll('button,a,input[type="button"],input[type="submit"]').forEach(el=>{
   const t=(el.textContent||el.value||el.title||'').trim().toLowerCase();
   for(const [a,words] of Object.entries(ACTION_WORDS)){
     if(words.some(w=>t.includes(w))&&!perm(a,m,state,user)){
       el.hidden=true;el.setAttribute('aria-hidden','true');
     }
   }
 });
 document.querySelectorAll('[data-permission-action]').forEach(el=>{if(!perm(el.dataset.permissionAction,m,state,user))el.hidden=true});
 const design=document.getElementById('adminDesignButton');if(design&&!perm('design',m,state,user))design.remove();
}
function applyProfile(user){
 const avatar=user.avatar||'';
 const names=document.querySelectorAll('.profile-name,[data-profile-name],.user-name,.side-profile b,.profile-card b');
 names.forEach(x=>x.textContent=user.name||'User');
 const roles=document.querySelectorAll('.profile-role,[data-profile-role],.user-role,.side-profile small,.profile-card small');
 roles.forEach(x=>x.textContent=user.role||'User');
 if(avatar)document.querySelectorAll('.side-avatar img,.profile-photo,.user-avatar,.profile-card img').forEach(img=>img.src=avatar);
 document.documentElement.dataset.erpRole=(user.role||'').toLowerCase().replace(/\s+/g,'-');
 window.ERP_CURRENT_USER=user;window.ERP_USER_ROLE=user.role;window.ERP_CAN=(action,module)=>perm(action,module||moduleName(),pcc(),currentUser());
}
function addUserBadge(user){
 if(document.getElementById('erpSignedInBadge'))return;
 const b=document.createElement('div');b.id='erpSignedInBadge';b.style.cssText='position:fixed;right:16px;top:12px;z-index:9990;background:rgba(15,23,42,.88);color:white;border-radius:999px;padding:7px 11px;font:600 12px Inter,Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.18);pointer-events:none';b.textContent=`${user.name} · ${user.role}`;document.body.appendChild(b);
}
function init(){const state=pcc(),user=currentUser(state);localStorage.setItem('erpUserRole',user.role||'');if(!accessAllowed(state,user)){deny(user);return}applyProfile(user);applyActions(state,user);addUserBadge(user);document.dispatchEvent(new CustomEvent('erp:security-ready',{detail:{user,module:moduleName()}}));}
window.ERP_SECURITY={pcc,currentUser,can:perm,moduleName,studioAllowed,controlAllowed};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
