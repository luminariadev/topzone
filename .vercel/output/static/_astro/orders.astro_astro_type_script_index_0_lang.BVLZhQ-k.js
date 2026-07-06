import{a as o}from"./auth.DqYL37Fp.js";const s=JSON.parse(localStorage.getItem(o())||"[]"),n=document.getElementById("orders-empty"),t=document.getElementById("orders-list");function i(e){return"Rp "+e.toLocaleString("id-ID")}function c(e){const a={pending:"bg-yellow-400",processing:"bg-blue-400",completed:"bg-neon-green",cancelled:"bg-red-400"},l={pending:"Pending",processing:"Diproses",completed:"Selesai",cancelled:"Dibatalkan"};return`<span class="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-black ${a[e]||"bg-gray-400"}">${l[e]||e}</span>`}s.length===0?n?.classList.remove("hidden"):(n?.classList.add("hidden"),t?.classList.remove("hidden"),t&&(t.innerHTML=s.map(e=>`
        <a href="/orders/${e.id}" class="block border-4 border-black p-5 bg-white shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-black text-lg">${e.name}</p>
              <p class="text-xs font-bold text-gray-500">${e.id} &middot; ${new Date(e.createdAt).toLocaleDateString("id-ID")}</p>
            </div>
            ${c(e.status)}
          </div>
          <div class="flex justify-between items-center mt-3 pt-3 border-t-2 border-black/10">
            <span class="text-sm font-bold text-gray-500">${e.items?.length||0} item</span>
            <span class="text-xl font-black text-neon-pink">${i(e.total)}</span>
          </div>
        </a>
      `).join("")));
