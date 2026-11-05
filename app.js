/* Farma Tech Store — demo storefront.
   IMPORTANT: Replace WHATSAPP_NUMBER below with the store number in international format,
   digits only (example Somalia: 252XXXXXXXXX). This is required for real order sending. */
const WHATSAPP_NUMBER = "2520905114042";

const products = [
  {id:1,name:"FarmaBook Pro 14",category:"Laptops",price:749,tag:"BEST SELLER",description:"A powerful everyday laptop for programming, study, business, and creative work. Lightweight design with a vivid display and dependable performance.",image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=85",recommend:true},
  {id:2,name:"Samsung Galaxy A Series",category:"Phones",price:249,tag:"POPULAR",description:"A stylish smartphone with a sharp screen, reliable battery life, and smooth everyday performance for communication and entertainment.",image:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=85",recommend:true},
  {id:3,name:"Wireless Pro Headphones",category:"Accessories",price:59,tag:"HOT PICK",description:"Comfortable wireless headphones with immersive sound, a built-in microphone, and a design made for music, calls, and focus.",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",recommend:true},
  {id:4,name:"Dual-Band Wi-Fi Router",category:"Networking",price:45,tag:"ESSENTIAL",description:"A dual-band router designed to support stable home or small-office connectivity, multiple devices, and everyday streaming.",image:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=85",recommend:false},
  {id:5,name:"Mechanical RGB Keyboard",category:"Accessories",price:39,tag:"GAMING",description:"A responsive mechanical-style keyboard with RGB lighting, comfortable key spacing, and a durable build for work or gaming.",image:"https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=85",recommend:true},
  {id:6,name:"Smart Watch Active",category:"Accessories",price:79,tag:"NEW",description:"A versatile smartwatch for daily activity, notifications, timekeeping, and a modern look that fits your routine.",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",recommend:false},
  {id:7,name:"USB-C Fast Charger",category:"Accessories",price:19,tag:"DAILY PICK",description:"A compact USB-C charging accessory for compatible devices. Convenient for home, office, or travel.",image:"https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=85",recommend:false},
  {id:8,name:"Portable SSD 1TB",category:"Accessories",price:99,tag:"STORAGE",description:"Portable solid-state storage for moving files, keeping backups, and expanding your digital workspace.",image:"https://images.unsplash.com/photo-1597872200969-2b65d56bd5?auto=format&fit=crop&w=800&q=85",recommend:true}
];

let cart = JSON.parse(localStorage.getItem("farmaCart") || "[]");
let activeProduct = null;
let checkoutItems = null;
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const money = n => "$" + Number(n).toFixed(2);
const productById = id => products.find(p=>p.id===Number(id));
const saveCart = ()=>{localStorage.setItem("farmaCart",JSON.stringify(cart));renderCart();updateCartCount();};
const escapeHtml = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600);}
function renderProducts(){
  const query=$("#searchInput").value.trim().toLowerCase();
  const category=$("#categoryFilter").value;
  let list=products.filter(p=>(category==="All"||p.category===category)&&(`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query)));
  const sort=$("#sortFilter").value;
  if(sort==="low")list.sort((a,b)=>a.price-b.price);
  if(sort==="high")list.sort((a,b)=>b.price-a.price);
  if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
  const grid=$("#productGrid");
  if(!list.length){grid.innerHTML='<div class="no-products">No products found. Try another search.</div>';return;}
  grid.innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-image" data-detail="${p.id}">
        <span class="product-badge">${escapeHtml(p.tag)}</span>
        <button class="wish-btn" aria-label="Add ${escapeHtml(p.name)} to wishlist" data-wish="${p.id}">♡</button>
        <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('image-fallback');this.parentElement.insertAdjacentHTML('beforeend','<span class=\\'fallback-emoji\\'>📦</span>')">
      </div>
      <div class="product-info">
        <span class="product-category">${escapeHtml(p.category)}</span>
        <h3 data-detail="${p.id}">${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description.slice(0,94))}${p.description.length>94?"…":""}</p>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}" aria-label="Add to cart">+</button></div>
      </div>
    </article>`).join("");
}
function updateCartCount(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  $("#cartCount").textContent=count;$("#drawerCount").textContent=`(${count})`;
}
function addToCart(id,qty=1){
  const p=productById(id);if(!p)return;
  const found=cart.find(item=>item.id===p.id);
  if(found)found.qty+=qty;else cart.push({id:p.id,qty});
  saveCart();toast(`${p.name} added to cart ✓`);
}
function renderCart(){
  const container=$("#cartItems"),empty=$("#cartEmpty"),summary=$("#cartSummary");
  if(!cart.length){container.innerHTML="";empty.style.display="block";summary.style.display="none";return;}
  empty.style.display="none";summary.style.display="block";
  container.innerHTML=cart.map(item=>{
    const p=productById(item.id);if(!p)return "";
    return `<div class="cart-item"><img src="${p.image}" alt="" onerror="this.style.opacity=0"><div><h4>${escapeHtml(p.name)}</h4><p>${money(p.price)}</p><div class="qty-control"><button data-qty="${p.id}" data-change="-1">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-change="1">+</button><button class="remove-item" data-remove="${p.id}" title="Remove">×</button></div></div><b>${money(p.price*item.qty)}</b></div>`;
  }).join("");
  const total=cart.reduce((sum,item)=>sum+productById(item.id).price*item.qty,0);
  $("#cartSubtotal").textContent=money(total);$("#checkoutTotal").textContent=money(total);
}
function openCart(){$("#cartBackdrop").classList.add("show");document.body.style.overflow="hidden";}
function closeCart(){$("#cartBackdrop").classList.remove("show");document.body.style.overflow="";}
function openProduct(id){
  const p=productById(id);if(!p)return;activeProduct=p;
  $("#productModalContent").innerHTML=`<div class="detail-layout"><div class="detail-image"><img src="${p.image}" alt="${escapeHtml(p.name)}" onerror="this.style.opacity=0"></div><div class="detail-copy"><span class="product-category">${escapeHtml(p.category)} • ${escapeHtml(p.tag)}</span><h2 id="modalTitle">${escapeHtml(p.name)}</h2><div class="price">${money(p.price)}</div><p>${escapeHtml(p.description)}</p><div class="detail-actions"><button class="btn btn-primary" id="modalAdd">Add to cart <span>＋</span></button><button class="btn btn-outline" id="modalBuy">Order now ↗</button></div></div>`;
  $("#productModal").classList.add("show");$("#productModal").setAttribute("aria-hidden","false");
  $("#modalAdd").onclick=()=>{addToCart(p.id);};$("#modalBuy").onclick=()=>openDirectCheckout(p.id);
}
function openCheckout(){
  if(!cart.length){toast("Your cart is empty.");return;}
  closeCart();$("#checkoutModal").classList.add("show");$("#checkoutModal").setAttribute("aria-hidden","false");
}
function openDirectCheckout(id){
  const p=productById(id);if(!p)return;
  checkoutItems=[{id:p.id,qty:1}];
  $("#checkoutTotal").textContent=money(p.price);
  $("#productModal").classList.remove("show");
  $("#checkoutModal").classList.add("show");
  $("#checkoutModal").setAttribute("aria-hidden","false");
}

function closeModal(id){const el=$("#"+id);if(el){el.classList.remove("show");el.setAttribute("aria-hidden","true");}document.body.style.overflow="";}
function sendWhatsAppOrder(data){
  if(WHATSAPP_NUMBER.includes("X")){toast("Store WhatsApp number is not configured yet.");return;}
  const items=checkoutItems || cart;
  const lines=items.map(item=>{const p=productById(item.id);return `• ${p.name} x${item.qty} — ${money(p.price*item.qty)}`;});
  const total=items.reduce((sum,item)=>sum+productById(item.id).price*item.qty,0);
  const msg=`🛍️ *NEW ORDER — FARMA TECH STORE*
👤 Name: ${data.name}
📞 Phone: ${data.phone}
📍 Delivery: ${data.address}

📦 *Items:*
${lines.join("\n")}

💵 *Total: ${money(total)}*${data.note?`\n📝 Note: ${data.note}`:""}

Please confirm availability and delivery. Thank you!`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
}
function openChat(){ $("#chatWidget").classList.add("show");$("#chatLauncher").style.display="none";$("#chatInput").focus();}
function closeChat(){ $("#chatWidget").classList.remove("show");$("#chatLauncher").style.display="grid";}
function addMessage(text,type){const el=document.createElement("div");el.className=`message ${type}-message`;el.textContent=text;$("#chatMessages").appendChild(el);$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight;}
function assistantReply(raw){
  const text=raw.toLowerCase();
  if(/hello|hi\b|hey|salaam|asc|assalamu/.test(text))return "Hello! 👋 Welcome to Farma Tech Store. What kind of technology are you looking for today?";
  if(/order|checkout|buy|purchase|dalbo/.test(text))return "Ordering is easy! 🛒 Add your items to the cart, tap Checkout via WhatsApp, fill in your name, phone and delivery location, then send the pre-filled order. Our team will confirm it with you.";
  if(/laptop|computer|program|coding|study|school/.test(text)){
    const picks=products.filter(p=>p.category==="Laptops");
    return "For studying, programming, and everyday work, I recommend checking our laptops. 💻\\n"+picks.map(p=>`${p.name} — ${money(p.price)}\\n${p.description}`).join("\\n\\n")+"\\nTap Products to view details or add one to your cart.";
  }
  if(/phone|mobile|smartphone/.test(text)){
    const p=products.find(p=>p.category==="Phones");return `For a smartphone, take a look at ${p.name} (${money(p.price)}). ${p.description} Browse the Phones category for details.`;
  }
  if(/headphone|earphone|audio|accessor/.test(text)){
    const picks=products.filter(p=>p.category==="Accessories");
    return "Here are some accessories you may like:\\n"+picks.slice(0,4).map(p=>`${p.name} — ${money(p.price)}`).join("\\n")+"\\nWould you like help choosing one?";
  }
  if(/router|wifi|internet|network/.test(text)){
    const p=products.find(p=>p.category==="Networking");return `For connectivity, we have ${p.name} at ${money(p.price)}. ${p.description}`;
  }
  if(/price|cost|cheap|budget|under|qiime/.test(text)){
    return "You can use the product filters to compare prices. Our current demo products range from $19 to $749. Tell me your budget and what you need (study, work, gaming, or communication), and I’ll suggest options.";
  }
  if(/recommend|suggest|best|help me choose/.test(text)){
    return "Of course! 😊 What is your main purpose: (1) studying/programming, (2) communication, (3) gaming, (4) internet/networking, or (5) accessories? If you share your budget in USD, I can make a more useful suggestion.";
  }
  if(/delivery|shipping|where|location|somalia|mogadishu/.test(text)){
    return "Please send your delivery city/area in the Checkout form. Our team will confirm delivery availability, timing, and any fee directly on WhatsApp.";
  }
  if(/thank/.test(text))return "You're welcome! 💙 Thank you for choosing Farma Tech Store. Let me know if you need anything else.";
  return "I’m here to help! You can ask me about laptops, phones, accessories, networking devices, prices, recommendations, or how to place an order. If you tell me your budget and purpose, I can guide you.";
}

// Events
$("#productGrid").addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");if(add){openDirectCheckout(add.dataset.add);return;}
  const wish=e.target.closest("[data-wish]");if(wish){wish.classList.toggle("liked");wish.textContent=wish.classList.contains("liked")?"♥":"♡";toast(wish.classList.contains("liked")?"Added to wishlist":"Removed from wishlist");return;}
  const detail=e.target.closest("[data-detail]");if(detail)openProduct(detail.dataset.detail);
});
$("#categoryFilter").addEventListener("change",renderProducts);
$("#searchInput").addEventListener("input",renderProducts);
$("#sortFilter").addEventListener("change",renderProducts);
$$(".category-card").forEach(btn=>btn.addEventListener("click",()=>{$("#categoryFilter").value=btn.dataset.category;renderProducts;$("#products").scrollIntoView({behavior:"smooth"});renderProducts();}));
$("#openCart").onclick=openCart;$("#closeCart").onclick=closeCart;
$("#cartBackdrop").addEventListener("click",e=>{if(e.target===$("#cartBackdrop"))closeCart();});
$("#cartItems").addEventListener("click",e=>{
  const qty=e.target.closest("[data-qty]");const remove=e.target.closest("[data-remove]");
  if(remove){cart=cart.filter(i=>i.id!==Number(remove.dataset.remove));saveCart();return;}
  if(qty){const item=cart.find(i=>i.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.change);if(item.qty<=0)cart=cart.filter(i=>i.id!==item.id);saveCart();}}
});
$("#continueShopping").onclick=closeCart;$("#checkoutBtn").onclick=openCheckout;
$("#checkoutForm").addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());sendWhatsAppOrder(data);checkoutItems=null;closeModal("checkoutModal");});
$$("[data-close]").forEach(btn=>btn.addEventListener("click",()=>closeModal(btn.dataset.close)));
$$(".modal-backdrop").forEach(el=>el.addEventListener("click",e=>{if(e.target===el)closeModal(el.id);}));
$("#searchToggle").onclick=()=>{$("#searchBox").scrollIntoView({behavior:"smooth",block:"center"});$("#searchInput").focus();};
$("#menuToggle").onclick=()=>$("#mainNav").classList.toggle("open");
$$(".nav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
$("#chatLauncher").onclick=openChat;$("#closeChat").onclick=closeChat;$("#askAssistant").onclick=openChat;$("#footerChat").onclick=e=>{e.preventDefault();openChat();};
$("#chatForm").addEventListener("submit",e=>{e.preventDefault();const input=$("#chatInput");const msg=input.value.trim();if(!msg)return;addMessage(msg,"user");input.value="";setTimeout(()=>addMessage(assistantReply(msg),"bot"),350);});
$(".quick-prompts").addEventListener("click",e=>{const b=e.target.closest("[data-prompt]");if(!b)return;const msg=b.dataset.prompt;addMessage(msg,"user");setTimeout(()=>addMessage(assistantReply(msg),"bot"),300);});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();updateCartCount();
