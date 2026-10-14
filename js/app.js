
const PRODUCTS = PRODUCT_DATA;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const fmt = n => Number(n).toLocaleString("kk-KZ") + " ₸";

let cart = JSON.parse(localStorage.getItem("agromarket-cart") || "[]");
let favorites = JSON.parse(localStorage.getItem("agromarket-favorites") || "[]");

function save(){localStorage.setItem("agromarket-cart",JSON.stringify(cart));localStorage.setItem("agromarket-favorites",JSON.stringify(favorites));}
function product(id){return PRODUCTS.find(p=>p.id===Number(id));}
function cartCount(){return cart.reduce((s,x)=>s+x.qty,0);}
function cartTotal(){return cart.reduce((s,x)=>{const p=product(x.id);return s+(p?p.price*x.qty:0)},0);}
function toast(msg){const t=$("#toast");if(!t)return;t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2200);}
function add(id){const p=product(id);if(!p)return;const i=cart.find(x=>x.id===p.id);if(i)i.qty++;else cart.push({id:p.id,qty:1});save();renderAll();toast(`${p.name} себетке қосылды`);}
function setQty(id,d){const i=cart.find(x=>x.id===Number(id));if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==Number(id));save();renderAll();}
function removeItem(id){cart=cart.filter(x=>x.id!==Number(id));save();renderAll();}
function fav(id){id=Number(id);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save();renderAll();toast(favorites.includes(id)?"Таңдаулыға қосылды":"Таңдаулыдан өшірілді");}

function renderHeader(){
  const c=$("#cartCount"); if(c)c.textContent=cartCount();
  const path=location.pathname.split("/").pop()||"index.html";
  $$(".nav a").forEach(a=>{a.classList.toggle("active",a.getAttribute("href")===path);});
}
function renderDrawer(){
  const box=$("#drawerItems"), empty=$("#drawerEmpty"), total=$("#drawerTotal");
  if(!box)return;
  box.innerHTML="";
  if(!cart.length){empty?.classList.remove("hidden");}
  else {empty?.classList.add("hidden");}
  cart.forEach(i=>{const p=product(i.id);if(!p)return;const el=document.createElement("div");el.className="drawer-item";el.innerHTML=`<div class="drawer-icon">${p.emoji}</div><div class="drawer-info"><b>${p.name}</b><small>${fmt(p.price)} • ${i.qty} ${p.unit}</small><div class="qty"><button data-minus="${p.id}">−</button><span>${i.qty}</span><button data-plus="${p.id}">+</button><button class="remove" data-remove="${p.id}">Жою</button></div></div>`;box.appendChild(el);});
  if(total)total.textContent=fmt(cartTotal());
}
function renderCartPage(){
  const box=$("#cartPageItems");if(!box)return;
  const empty=$("#cartPageEmpty"), subtotal=$("#subtotal"), delivery=$("#delivery"), total=$("#cartPageTotal");
  box.innerHTML="";
  if(!cart.length){empty?.classList.remove("hidden");}
  else {empty?.classList.add("hidden");}
  cart.forEach(i=>{const p=product(i.id);if(!p)return;const el=document.createElement("div");el.className="cart-row";el.innerHTML=`<div class="cart-icon">${p.emoji}</div><div class="cart-info"><b>${p.name}</b><small>${p.category} • ${fmt(p.price)} / ${p.unit}</small><div class="qty"><button data-minus="${p.id}">−</button><span>${i.qty}</span><button data-plus="${p.id}">+</button><button class="remove" data-remove="${p.id}">Жою</button></div></div><strong>${fmt(p.price*i.qty)}</strong>`;box.appendChild(el);});
  const sub=cartTotal(), del=sub===0?0:(sub>=15000?0:1200);
  if(subtotal)subtotal.textContent=fmt(sub);if(delivery)delivery.textContent=del?fmt(del):"Тегін";if(total)total.textContent=fmt(sub+del);
}
function productCard(p){
  const isFav=favorites.includes(p.id);
  return `<article class="product-card"><div class="p-image"><span class="badge">${p.category}</span><button class="heart ${isFav?"active":""}" data-fav="${p.id}">♡</button><span>${p.emoji}</span></div><div class="p-info"><span class="p-cat">${p.category}</span><h3 class="p-name">${p.name}</h3><div class="rating">★★★★★ <span>${p.rating}</span></div><div class="p-bottom"><span class="price">${fmt(p.price)} <small>/ ${p.unit}</small></span><button class="add" data-add="${p.id}">Себетке</button></div><button class="details" data-details="${p.id}">Толығырақ →</button></div></article>`;
}
function renderProductGrid(){
  const grid=$("#productGrid");if(!grid)return;
  const q=($("#searchInput")?.value||"").trim().toLowerCase(), cat=window.activeCat||"Барлығы";
  let list=PRODUCTS.filter(p=>(cat==="Барлығы"||p.category===cat)&&(!q||p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)));
  const sort=$("#sortSelect")?.value||"default";
  if(sort==="asc")list.sort((a,b)=>a.price-b.price);if(sort==="desc")list.sort((a,b)=>b.price-a.price);if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name,"kk"));
  grid.innerHTML=list.map(productCard).join("");
  $("#resultCount") && ($("#resultCount").textContent=`${list.length} өнім`);
  $("#emptyState")?.classList.toggle("hidden",!!list.length);
}
function renderFavorites(){
  const grid=$("#favoritesGrid");if(!grid)return;
  const list=PRODUCTS.filter(p=>favorites.includes(p.id));grid.innerHTML=list.map(productCard).join("");
  $("#favoritesEmpty")?.classList.toggle("hidden",!!list.length);
}
function renderAll(){renderHeader();renderDrawer();renderCartPage();renderProductGrid();renderFavorites();renderCheckout();}
function openDrawer(){ $("#drawer")?.classList.add("open");$("#overlay")?.classList.remove("hidden");document.body.style.overflow="hidden";}
function closeDrawer(){ $("#drawer")?.classList.remove("open");$("#overlay")?.classList.add("hidden");document.body.style.overflow="";}

function openModal(id){
  const p=product(id), m=$("#productModal");if(!p||!m)return;
  $("#modalIcon").textContent=p.emoji;$("#modalCategory").textContent=p.category;$("#modalName").textContent=p.name;$("#modalDescription").textContent=p.description;$("#modalPrice").textContent=`${fmt(p.price)} / ${p.unit}`;$("#modalStock").textContent=`Қоймада: ${p.stock} ${p.unit}`;
  $("#modalAdd").dataset.id=p.id;m.classList.remove("hidden");
}
function closeModal(){$("#productModal")?.classList.add("hidden");}

function renderCheckout(){
  const list=$("#checkoutItems");if(!list)return;
  list.innerHTML=cart.map(i=>{const p=product(i.id);return `<div class="order-mini"><span>${p.name} × ${i.qty}</span><b>${fmt(p.price*i.qty)}</b></div>`}).join("")||"<span style='color:var(--muted);font-size:11px'>Себет бос</span>";
  const sub=cartTotal(), del=sub>=15000||sub===0?0:1200;$("#checkoutTotal")&&( $("#checkoutTotal").textContent=fmt(sub+del) );
}
async function submitOrder(e){
  e.preventDefault();
  if(!cart.length){toast("Себет бос");return;}
  const form=e.currentTarget, btn=$("#submitOrder");btn.disabled=true;btn.textContent="Жіберілуде…";
  const sub=cartTotal(), del=sub>=15000?0:1200, total=sub+del;
  const details=cart.map(i=>{const p=product(i.id);return `${p.name} × ${i.qty} = ${fmt(p.price*i.qty)}`}).join("\n");
  const fd=new FormData(form);
  fd.append("order_details",details);fd.append("order_total",fmt(total));fd.append("_subject",`AgroMarket тапсырысы — ${fd.get("customer_name")||"Клиент"}`);
  fd.append("_captcha","false");
  try{
    const r=await fetch("https://formsubmit.co/ajax/kalzanovsarvar@gmail.com",{method:"POST",headers:{"Accept":"application/json"},body:fd});
    if(!r.ok)throw new Error("send");
    $("#orderSuccess")?.classList.remove("hidden");form.reset();cart=[];save();renderAll();
    $("#orderSuccess")?.scrollIntoView({behavior:"smooth",block:"center"});toast("Тапсырыс поштаға жіберілді");
  }catch(err){
    const subject=encodeURIComponent(`AgroMarket тапсырысы — ${fd.get("customer_name")||"Клиент"}`);
    const body=encodeURIComponent(`Аты-жөні: ${fd.get("customer_name")||""}\nТелефон: ${fd.get("phone")||""}\nE-mail: ${fd.get("customer_email")||""}\nМекенжай: ${fd.get("address")||""}\n\nӨнімдер:\n${details}\n\nЖалпы: ${fmt(total)}`);
    window.location.href=`mailto:kalzanovsarvar@gmail.com?subject=${subject}&body=${body}`;
    toast("Gmail арқылы жіберу терезесі ашылды");
  }finally{btn.disabled=false;btn.textContent="Тапсырысты жіберу →";}
}

document.addEventListener("click",e=>{
  const a=e.target.closest("[data-add]"), f=e.target.closest("[data-fav]"), d=e.target.closest("[data-details]"), plus=e.target.closest("[data-plus]"), minus=e.target.closest("[data-minus]"), rem=e.target.closest("[data-remove]");
  if(a){e.preventDefault();add(a.dataset.add)} if(f){e.preventDefault();fav(f.dataset.fav)} if(d){e.preventDefault();openModal(d.dataset.details)}
  if(plus)setQty(plus.dataset.plus,1);if(minus)setQty(minus.dataset.minus,-1);if(rem)removeItem(rem.dataset.remove);
});
document.addEventListener("DOMContentLoaded",()=>{
  if(localStorage.getItem("agromarket-theme")==="dark")document.body.classList.add("dark");
  $("#themeBtn")?.addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("agromarket-theme",document.body.classList.contains("dark")?"dark":"light")});
  $("#openCart")?.addEventListener("click",openDrawer);$("#closeDrawer")?.addEventListener("click",closeDrawer);$("#overlay")?.addEventListener("click",closeDrawer);
  $("#modalClose")?.addEventListener("click",closeModal);$("#productModal")?.addEventListener("click",e=>{if(e.target.id==="productModal")closeModal()});
  $("#modalAdd")?.addEventListener("click",e=>{add(e.currentTarget.dataset.id);closeModal()});
  $("#menuBtn")?.addEventListener("click",()=>{const n=$("#mainNav");n.classList.toggle("mobile-open");});
  $("#searchInput")?.addEventListener("input",renderProductGrid);$("#sortSelect")?.addEventListener("change",renderProductGrid);
  $("#clearSearch")?.addEventListener("click",()=>{$("#searchInput").value="";renderProductGrid()});
  $$(".tab").forEach(t=>t.addEventListener("click",()=>{$$(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");window.activeCat=t.dataset.category;renderProductGrid()}));
  $("#toTop")?.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
  window.addEventListener("scroll",()=>$("#toTop")?.classList.toggle("show",scrollY>500));
  $("#orderForm")?.addEventListener("submit",submitOrder);
  renderAll();
});
window.activeCat="Барлығы";
