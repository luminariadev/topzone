import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_l-pqzMWz.mjs';
import { r as renderScript, $ as $$Navbar } from './Navbar_BDk-Ncuv.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_7KXavt6J.mjs';
import { $ as $$Button } from './Button_poJCj7C-.mjs';

const $$Cart = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<section class="py-16 min-h-screen bg-white dark:bg-gray-900"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <h1 class="text-5xl font-black mb-2 text-black dark:text-white">Keranjang <span style="color:#FF007F; -webkit-text-stroke:1px #000;">Belanja</span></h1> <p class="font-medium mb-10 text-gray-500 dark:text-gray-400">Periksa pesananmu sebelum checkout.</p> <!-- Empty state --> <div id="cart-empty" class="hidden text-center py-24 border-4 border-dashed border-black dark:border-gray-600"> <div class="text-6xl mb-4">🛒</div> <p class="text-2xl font-black mb-6 text-black dark:text-white">Keranjangmu masih kosong!</p> ${renderComponent($$result2, "Button", $$Button, { "variant": "green", "size": "lg", "href": "/" }, { "default": ($$result3) => renderTemplate`Mulai Belanja` })} </div> <!-- Cart items --> <div id="cart-content" class="hidden"> <div id="cart-list" class="flex flex-col gap-4 mb-8"></div> <!-- Summary --> <div class="border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 bg-neon-yellow"> <div class="flex justify-between items-center mb-4"> <span class="text-xl font-bold text-black dark:text-white">Total Pesanan</span> <span class="text-3xl font-black text-black dark:text-white" id="cart-total">Rp 0</span> </div> ${renderComponent($$result2, "Button", $$Button, { "variant": "black", "size": "lg", "class": "w-full" }, { "default": ($$result3) => renderTemplate`<a href="/checkout/" class="block w-full py-4 font-black uppercase tracking-wider text-lg bg-black text-white border-4 border-black shadow-[4px_4px_0px_0px_#39FF14] text-center hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#39FF14] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#39FF14] transition-all">Lanjut ke Checkout</a>` })} <p class="text-center text-xs text-black/60 dark:text-white/60 mt-3 font-medium"> ✨</p> </div> </div> </div> </section> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/pages/cart.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/pages/cart.astro", void 0);

const $$file = "D:/Rizkia/Project Software/TopZone/src/pages/cart.astro";
const $$url = "/cart";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cart,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
