import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_l-pqzMWz.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_7KXavt6J.mjs';
import { $ as $$Navbar } from './Navbar_BDk-Ncuv.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "404 — Halaman Tidak Ditemukan | TopZone" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<section class="py-24 min-h-screen flex items-center justify-center bg-neon-pink" aria-labelledby="not-found-heading"> <div class="max-w-lg mx-auto px-4 text-center"> <div class="text-8xl mb-4" aria-hidden="true">🔭</div> <h1 id="not-found-heading" class="text-7xl font-black mb-2">404</h1> <p class="text-2xl font-black mb-2">Halaman Tidak Ditemukan!</p> <p class="text-gray-700 font-bold mb-8">Mungkin halaman sudah dipindah atau kamu salah alamat.</p> <nav aria-label="Navigasi bantuan 404" class="space-y-3 md:flex md:justify-center md:space-x-4 md:space-y-0"> <a href="/" class="inline-block px-8 py-4 font-black uppercase border-4 border-black bg-black text-neon-green shadow-[6px_6px_0px_0px_#39FF14] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
Kembali ke Beranda
</a> <a href="#games" class="inline-block px-8 py-4 font-black uppercase border-4 border-black bg-white text-black hover:bg-neon-yellow transition-colors">
Jelajahi Game
</a> <a href="#gear" class="inline-block px-8 py-4 font-black uppercase border-4 border-black bg-white text-black hover:bg-neon-pink text-white transition-colors">
Beli Gear
</a> </nav> <p class="mt-8 text-sm text-gray-500" id="not-found-help">
Masih bingung? Hubungi <a href="mailto:support@topzone.com" class="underline hover:text-neon-pink">support@topzone.com</a> </p> </div> </section> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "D:/Rizkia/Project Software/TopZone/src/pages/404.astro", void 0);

const $$file = "D:/Rizkia/Project Software/TopZone/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
