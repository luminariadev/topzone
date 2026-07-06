import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_l-pqzMWz.mjs';
import { r as renderScript, $ as $$Navbar } from './Navbar_BDk-Ncuv.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_7KXavt6J.mjs';
import { $ as $$Button } from './Button_poJCj7C-.mjs';

const $$OrderDetail = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<section class="py-16 min-h-screen bg-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <a href="/orders" class="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-6">&larr; Kembali ke Riwayat</a> <div id="order-loading" class="text-center py-24"><p class="text-2xl font-black">Memuat pesanan...</p></div> <div id="order-notfound" class="hidden text-center py-24 border-4 border-dashed border-black"> <div class="text-6xl mb-4">❓</div> <p class="text-2xl font-black mb-2">Pesanan tidak ditemukan!</p> ${renderComponent($$result2, "Button", $$Button, { "variant": "green", "size": "lg", "href": "/orders" }, { "default": async ($$result3) => renderTemplate`Lihat Riwayat` })} </div> <div id="order-detail" class="hidden"> <div class="flex justify-between items-start mb-6"> <div> <h1 class="text-4xl font-black mb-1" id="order-id-display"></h1> <p class="text-gray-500 font-bold" id="order-date"></p> </div> <div id="order-status"></div> </div> <div class="border-4 border-black p-5 bg-white shadow-[4px_4px_0px_0px_#000] mb-6"> <h2 class="text-lg font-black mb-3">Data Pembeli</h2> <p class="font-bold"><span class="text-gray-500">Nama:</span> <span id="order-name"></span></p> <p class="font-bold"><span class="text-gray-500">Telepon:</span> <span id="order-phone"></span></p> <p class="font-bold"><span class="text-gray-500">Pembayaran:</span> <span id="order-payment"></span></p> </div> <div class="border-4 border-black p-5 bg-white shadow-[4px_4px_0px_0px_#000] mb-6"> <h2 class="text-lg font-black mb-4">Item Pesanan</h2> <div id="order-items" class="flex flex-col gap-3"></div> </div> <div class="border-4 border-black p-5 bg-neon-yellow shadow-[4px_4px_0px_0px_#000] mb-6"> <div class="flex justify-between items-center"> <span class="text-xl font-black">Total Pembayaran</span> <span class="text-3xl font-black" id="order-total"></span> </div> </div> <!-- Transaction History --> <div id="transaction-history" class="border-4 border-black p-5 bg-white shadow-[4px_4px_0px_0px_#000] mb-6 hidden"> <h2 class="text-lg font-black mb-4">📋 Riwayat Transaksi</h2> <div id="transaction-list" class="flex flex-col gap-2"></div> </div> <!-- Retry Payment --> <div id="retry-section" class="hidden mb-6 text-center"> <p class="text-red-600 font-black mb-3">Pembayaran gagal atau kedaluwarsa</p> <button id="retry-btn" class="px-6 py-3 font-black border-3 border-black bg-red-400 text-white hover:bg-red-600 transition-all">💳 Coba Bayar Lagi</button> </div> </div> </div> </section> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/pages/order-detail.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/pages/order-detail.astro", void 0);

const $$file = "D:/Rizkia/Project Software/TopZone/src/pages/order-detail.astro";
const $$url = "/order-detail";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$OrderDetail,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
