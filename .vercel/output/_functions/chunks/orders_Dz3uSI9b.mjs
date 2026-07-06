import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_l-pqzMWz.mjs';
import { r as renderScript, $ as $$Navbar } from './Navbar_BDk-Ncuv.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_7KXavt6J.mjs';
import { $ as $$Button } from './Button_poJCj7C-.mjs';

const $$Orders = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<section class="py-16 min-h-screen bg-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <h1 class="text-5xl font-black mb-2">Riwayat <span style="color:#FF007F; -webkit-text-stroke:1px #000;">Pesanan</span></h1> <p class="text-gray-500 font-medium mb-10">Daftar pesanan TopZone kamu.</p> <!-- Empty state --> <div id="orders-empty" class="text-center py-24 border-4 border-dashed border-black"> <div class="text-6xl mb-4">??</div> <p class="text-2xl font-black mb-2">Belum ada pesanan!</p> <p class="text-gray-500 font-bold mb-6">Yuk top up game atau beli gear dulu.</p> ${renderComponent($$result2, "Button", $$Button, { "variant": "green", "size": "lg", "href": "/" }, { "default": ($$result3) => renderTemplate`Mulai Belanja` })} </div> <!-- Orders list --> <div id="orders-list" class="hidden flex flex-col gap-4"></div> </div> </section> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/pages/orders.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/pages/orders.astro", void 0);

const $$file = "D:/Rizkia/Project Software/TopZone/src/pages/orders.astro";
const $$url = "/orders";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Orders,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
