import{a as o,b as g,u as m,r as k}from"./cart.CRGCHWGR.js";const c=document.getElementById("cart-empty"),d=document.getElementById("cart-content"),a=document.getElementById("cart-list"),s=document.getElementById("cart-total");function i(e){return"Rp "+e.toLocaleString("id-ID")}function x(){const e=o.get(),l=g.get();if(e.length===0){c?.classList.remove("hidden"),d?.classList.add("hidden");return}c?.classList.add("hidden"),d?.classList.remove("hidden"),s&&(s.textContent=i(l)),a&&(a.innerHTML=e.map(t=>`
        <div class="flex items-center gap-4 border-4 border-black p-4 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_#000]">
          <img src="${t.img}" alt="${t.name}" class="w-20 h-20 object-cover border-2 border-black flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <h3 class="font-black text-lg leading-tight mb-1 text-black dark:text-white">${t.name}</h3>
            <p class="font-bold text-neon-pink text-lg">${i(t.price)}</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="qty-btn w-8 h-8 border-2 border-black font-black text-lg hover:bg-black hover:text-white transition-colors" data-id="${t.id}" data-action="dec">−</button>
            <span class="w-8 text-center font-black text-black dark:text-white">${t.qty}</span>
            <button class="qty-btn w-8 h-8 border-2 border-black font-black text-lg hover:bg-black hover:text-white transition-colors" data-id="${t.id}" data-action="inc">+</button>
          </div>
          <button class="remove-btn ml-2 w-8 h-8 bg-neon-pink text-white border-2 border-black font-black hover:bg-red-600 transition-colors" data-id="${t.id}">×</button>
        </div>
      `).join(""),a.querySelectorAll(".qty-btn").forEach(t=>{t.addEventListener("click",()=>{const r=t.dataset.id,b=t.dataset.action,n=o.get().find(h=>h.id===r);n&&m(r,b==="inc"?n.qty+1:n.qty-1)})}),a.querySelectorAll(".remove-btn").forEach(t=>{t.addEventListener("click",()=>k(t.dataset.id))}))}o.subscribe(x);
