import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_l-pqzMWz.mjs';
import { r as renderScript, $ as $$Navbar } from './Navbar_BDk-Ncuv.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_7KXavt6J.mjs';

const $$Success = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<section class="py-24 min-h-screen bg-neon-green flex items-center justify-center"> <div class="max-w-2xl mx-auto px-4 text-center"> <div class="text-8xl mb-4">✑</div> <h1 class="text-5xl font-black mb-4">Pesanan Berhasil! 🚀</h1> <p class="text-xl font-bold mb-2">Terima Kasih</p> <div class="border-4 border-black bg-white p-8 my-8 shadow-[6px_6px_0px_0px_#000]"> <p class="text-lg font-bold mb-2">Nomor Pesanan</p> <p class="text-xl font-black" id="order-id">-</p> <p class="text-sm font-bold mt-2" id="order-status">Status: <span class="text-yellow-500" id="status-badge">Menunggu Pembayaran</span></p> <p class="text-xs text-gray-500 font-bold mt-2">Simpan nomor pesanan untuk konfirmasi pembayaran</p> <div id="payment-info" class="hidden mt-4 border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] text-left"> <h3 class="font-black text-lg mb-3">💳 Petunjuk Pembayaran</h3> <ul class="text-sm font-bold space-y-2 text-gray-700" id="payment-instructions"></ul> </div> <div id="payment-polling" class="hidden mt-4"> <p class="text-sm font-bold text-gray-600">Memeriksa status pembayaran...</p> <div class="w-full h-2 bg-gray-200 border-2 border-black mt-2 rounded-full overflow-hidden"> <div class="h-full bg-neon-pink animate-pulse" style="width: 100%"></div> </div> </div> <div id="payment-retry" class="hidden mt-4"> <p class="text-red-600 font-black mb-2">Pembayaran gagal atau kedaluwarsa</p> <button id="retry-btn" class="px-6 py-3 font-black border-3 border-black bg-red-400 text-white hover:bg-red-600 transition-all">Coba Bayar Lagi</button> </div> </div> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/" class="px-8 py-3 font-black uppercase tracking-wider text-lg bg-black text-neon-green border-4 border-black shadow-[4px_4px_0px_0px_#39FF14] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#39FF14] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#39FF14] transition-all text-center">Kembali ke Beranda</a> <a href="/orders" class="px-8 py-3 font-black uppercase tracking-wider text-lg bg-neon-pink text-white border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all text-center">Lihat Pesanan</a> </div> </div> </section> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/pages/checkout/success.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/pages/checkout/success.astro", void 0);

const $$file = "D:/Rizkia/Project Software/TopZone/src/pages/checkout/success.astro";
const $$url = "/checkout/success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Success,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
