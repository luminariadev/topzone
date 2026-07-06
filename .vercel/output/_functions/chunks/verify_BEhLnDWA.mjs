import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_l-pqzMWz.mjs';
import { r as renderScript, $ as $$Navbar } from './Navbar_BDk-Ncuv.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_7KXavt6J.mjs';

const $$Verify = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<section class="min-h-screen flex items-center justify-center bg-neon-yellow dark:bg-gray-900 py-16 px-4"> <div class="w-full max-w-md"> <div class="border-4 border-black bg-white dark:bg-gray-800 p-8 shadow-[8px_8px_0px_0px_#000]"> <div class="text-center mb-8"> <div class="w-20 h-20 mx-auto mb-6 bg-neon-green/10 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000]"> <svg class="w-10 h-10 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"> <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path> </svg> </div> <h1 class="text-4xl font-black mb-2 text-black dark:text-white">Verifikasi <span class="text-neon-pink" style="-webkit-text-stroke:1px #000;">Berhasil!</span></h1> <p class="font-bold text-gray-600 dark:text-gray-300">Email kamu sudah diverifikasi</p> </div> <div id="success-state" class="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-700 p-6 rounded-lg mb-6"> <p class="font-bold text-black dark:text-white mb-4">
🎉 Selamat! Email <span id="email-display" class="font-mono text-neon-pink"></span> sudah diverifikasi.
</p> <p class="font-bold text-gray-700 dark:text-gray-300 mb-4">
Sekarang kamu bisa login ke TopZone dan mulai belanja game & gear favoritmu!
</p> <div class="bg-neon-yellow text-black font-black px-4 py-3 border-2 border-black text-sm text-center mb-4 shadow-[2px_2px_0px_0px_#000]">
🎁 Voucher <span id="voucher-code" class="bg-black text-white px-2 py-1"></span> (10% diskon) sudah siap di akunmu!
</div> </div> <div id="error-state" class="hidden bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-700 p-6 rounded-lg mb-6"> <p class="font-bold text-red-700 dark:text-red-300 mb-4" id="error-message"></p> </div> <div class="space-y-3"> <a href="/login" class="block w-full py-4 font-black uppercase tracking-wider text-lg bg-neon-pink text-white border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all text-center">
Masuk Sekarang
</a> <a href="/" class="block w-full py-4 font-black uppercase tracking-wider text-lg bg-black text-neon-green border-4 border-black shadow-[4px_4px_0px_0px_#39FF14] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#39FF14] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#39FF14] transition-all text-center">
Kembali ke Beranda
</a> </div> </div> <div class="text-center mt-6"> <a href="/" class="inline-flex items-center gap-2 font-black text-sm hover:underline text-black dark:text-white">
← Kembali ke Beranda
</a> </div> </div> </section> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/pages/auth/verify.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/pages/auth/verify.astro", void 0);

const $$file = "D:/Rizkia/Project Software/TopZone/src/pages/auth/verify.astro";
const $$url = "/auth/verify";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Verify,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
