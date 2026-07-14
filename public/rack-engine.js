window.RackEngine=class{
constructor({db}){this.db=db;this.locations=[];this.allocations=[];this.transfers=[];this.items=[]}
async load(){const [l,a,t,i]=await Promise.all([this.db.from("store_locations").select("*").order("location_name"),this.db.from("rack_item_allocations").select("*").order("id",{ascending:false}),this.db.from("rack_transfers").select("*").order("transfer_date",{ascending:false}),this.db.from("items").select("*").order("item_name")]);for(const r of [l,a,t,i])if(r.error)throw r.error;this.locations=l.data||[];this.allocations=a.data||[];this.transfers=t.data||[];this.items=i.data||[]}
getLocation(id){return this.locations.find(x=>+x.id===+id)} getItem(id){return this.items.find(x=>+x.id===+id)}
labelItem(i){return [i.item_name,i.size].filter(Boolean).join(" - ")}
locationItems(id){return this.allocations.filter(x=>+x.location_id===+id)}
usage(id){return this.locationItems(id).reduce((s,x)=>s+Number(x.assigned_qty||0),0)}
async saveAllocation(p,id){const r=id?await this.db.from("rack_item_allocations").update(p).eq("id",id):await this.db.from("rack_item_allocations").insert([p]);if(r.error)throw r.error}
async deleteAllocation(id){const r=await this.db.from("rack_item_allocations").delete().eq("id",id);if(r.error)throw r.error}
async transfer(v){const q=Number(v.qty||0);if(q<=0)throw Error("Enter a valid quantity.");if(+v.from_location_id===+v.to_location_id)throw Error("From and To Rack cannot be the same.");
const f=this.allocations.find(x=>+x.location_id===+v.from_location_id&&+x.item_id===+v.item_id);if(!f||Number(f.assigned_qty)<q)throw Error("Not enough quantity in From Rack.");
let r=Number(f.assigned_qty)-q===0?await this.db.from("rack_item_allocations").delete().eq("id",f.id):await this.db.from("rack_item_allocations").update({assigned_qty:Number(f.assigned_qty)-q}).eq("id",f.id);if(r.error)throw r.error;
const to=this.allocations.find(x=>+x.location_id===+v.to_location_id&&+x.item_id===+v.item_id),item=this.getItem(v.item_id),loc=this.getLocation(v.to_location_id);
r=to?await this.db.from("rack_item_allocations").update({assigned_qty:Number(to.assigned_qty)+q}).eq("id",to.id):await this.db.from("rack_item_allocations").insert([{location_id:+v.to_location_id,location_code:loc.location_code,location_name:loc.location_name,item_id:+v.item_id,item_code:item.item_code||"",item_name:item.item_name||"",size:item.size||"",unit:item.unit||"",assigned_qty:q,minimum_qty:0,primary_location:"No"}]);if(r.error)throw r.error;
const from=this.getLocation(v.from_location_id);r=await this.db.from("rack_transfers").insert([{transfer_date:v.transfer_date,from_location_id:+v.from_location_id,from_location_name:from.location_name,to_location_id:+v.to_location_id,to_location_name:loc.location_name,item_id:+v.item_id,item_code:item.item_code||"",item_name:item.item_name||"",size:item.size||"",unit:item.unit||"",qty:q,transferred_by:v.transferred_by||"",remarks:v.remarks||""}]);if(r.error)throw r.error}
};