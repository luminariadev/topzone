import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_l-pqzMWz.mjs';
import { r as renderScript, $ as $$Navbar } from './Navbar_BDk-Ncuv.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_7KXavt6J.mjs';

const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<section class="min-h-screen flex items-center justify-center bg-neon-yellow dark:bg-gray-900 py-16 px-4"> <div class="w-full max-w-md"> <div class="border-4 border-black bg-white dark:bg-gray-800 p-8 shadow-[8px_8px_0px_0px_#000]"> <div class="text-center mb-8"> <h1 class="text-4xl font-black mb-2 text-black dark:text-white">Daftar <span style="color:#FF007F; -webkit-text-stroke:1px #000;">TopZone</span></h1> <p class="font-bold text-gray-600 dark:text-gray-300">Buat akun untuk mulai belanja!</p> </div> <form id="register-form" class="space-y-5"> <div> <label for="fullname" class="block text-sm font-black uppercase tracking-wider mb-2 text-black dark:text-white">Nama Lengkap</label> <input type="text" id="fullname" name="fullname" required placeholder="Budi Gamer" class="w-full px-4 py-3 border-3 border-black font-bold text-lg shadow-[3px_3px_0px_0px_#000] focus:shadow-[1px_1px_0px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all dark:bg-gray-700 dark:text-white"> </div> <div> <label for="email" class="block text-sm font-black uppercase tracking-wider mb-2 text-black dark:text-white">Email</label> <input type="email" id="email" name="email" required placeholder="you@example.com" class="w-full px-4 py-3 border-3 border-black font-bold text-lg shadow-[3px_3px_0px_0px_#000] focus:shadow-[1px_1px_0px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all dark:bg-gray-700 dark:text-white"> </div> <div> <label for="password" class="block text-sm font-black uppercase tracking-wider mb-2 text-black dark:text-white">Password</label> <input type="password" id="password" name="password" required minlength="6" placeholder="Min 6 karakter" class="w-full px-4 py-3 border-3 border-black font-bold text-lg shadow-[3px_3px_0px_0px_#000] focus:shadow-[1px_1px_0px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all dark:bg-gray-700 dark:text-white"> </div> <div> <label for="password-confirm" class="block text-sm font-black uppercase tracking-wider mb-2 text-black dark:text-white">Konfirmasi Password</label> <input type="password" id="password-confirm" name="password-confirm" required minlength="6" placeholder="Ulangi password" class="w-full px-4 py-3 border-3 border-black font-bold text-lg shadow-[3px_3px_0px_0px_#000] focus:shadow-[1px_1px_0px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all dark:bg-gray-700 dark:text-white"> </div> <div id="error-msg" class="hidden bg-red-500 text-white font-black px-4 py-3 border-2 border-black text-sm"></div> <div id="success-msg" class="hidden bg-neon-green text-black font-black px-4 py-3 border-2 border-black text-sm"></div> <div id="voucher-info" class="hidden bg-neon-yellow text-black font-black px-4 py-3 border-2 border-black text-sm mt-2 text-center">
🎉 Selamat! Kamu dapat voucher <span id="voucher-code-display" class="bg-black text-white px-2 py-1 text-lg"></span> <div class="text-xs mt-1">Diskon 10%! Gunakan di halaman checkout.</div> </div> <button type="submit" id="register-btn" class="w-full py-4 font-black uppercase tracking-wider text-lg bg-neon-pink text-white border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all">
Daftar Sekarang
</button> </form> <div class="mt-6 text-center"> <p class="font-bold text-gray-600 dark:text-gray-300">
Sudah punya akun?
<a href="/login" class="font-black underline hover:text-neon-pink transition-colors text-black dark:text-white">Masuk di sini</a> </p> </div> </div> <div class="text-center mt-6"> <a href="/" class="inline-flex items-center gap-2 font-black text-sm hover:underline">
&#8592; Kembali ke Beranda
</a> </div> </div> </section> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/pages/register.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/pages/register.astro", void 0);

const $$file = "D:/Rizkia/Project Software/TopZone/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
