import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_l-pqzMWz.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_7KXavt6J.mjs';
import { $ as $$Navbar } from './Navbar_BDk-Ncuv.mjs';
import { g as gears, f as formatCurrency } from './gears_DQTVjETc.mjs';

function getUniqueBrands(items) {
  const brands = /* @__PURE__ */ new Set();
  items.forEach((item) => {
    if ("brand" in item && item.brand) {
      brands.add(item.brand);
    }
  });
  return Array.from(brands).sort();
}

function paginate(items, page, perPage) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const start = (clampedPage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total,
    totalPages
  };
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const url = Astro2.url;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const category = url.searchParams.get("category") || "all";
  const brand = url.searchParams.get("brand") || "all";
  const sort = url.searchParams.get("sort") || "Terbaru";
  let filteredGear = gears;
  if (category !== "all") filteredGear = filteredGear.filter((g) => g.category === category);
  if (brand !== "all") filteredGear = filteredGear.filter((g) => g.brand === brand);
  if (sort === "Termurah") filteredGear = [...filteredGear].sort((a, b) => a.price - b.price);
  else if (sort === "Termahal") filteredGear = [...filteredGear].sort((a, b) => b.price - a.price);
  else if (sort === "A-Z") filteredGear = [...filteredGear].sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "Z-A") filteredGear = [...filteredGear].sort((a, b) => b.name.localeCompare(a.name));
  const itemsPerPage = 9;
  const { items: paginatedProducts, totalPages } = paginate(filteredGear, page, itemsPerPage);
  function filterUrl(overrides) {
    const p = new URLSearchParams();
    const src = { category, brand, sort };
    for (const [k, v] of Object.entries({ ...src, ...overrides })) {
      if (v && v !== "all" && v !== "Terbaru") p.set(k, v);
    }
    return "/gear?" + p.toString();
  }
  const uniqueBrands = getUniqueBrands(gears);
  const gearCategories = {
    all: "Semua",
    keyboard: "Keyboard",
    mouse: "Mouse",
    headset: "Headset",
    chair: "Chair",
    controller: "Controller",
    webcam: "Webcam",
    microphone: "Microphone",
    monitor: "Monitor",
    mousepad: "Mousepad",
    speaker: "Speaker",
    streaming: "Streaming"
  };
  const sortOptions = [
    { value: "Termurah", label: "Termurah" },
    { value: "Termahal", label: "Termahal" },
    { value: "A-Z", label: "A-Z" },
    { value: "Z-A", label: "Z-A" },
    { value: "Terbaru", label: "Terbaru" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Gear Catalog - TopZone", "description": "All your gaming peripherals in one place." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="py-16 bg-white dark:bg-gray-900"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Header --> <div class="mb-10"> <h1 class="text-5xl font-black uppercase tracking-tight mb-2 text-black dark:text-white">Gear Catalog</h1> <p class="text-gray-600 dark:text-gray-400 font-medium text-lg">All your gaming peripherals in one place.</p> </div> <!-- Filters Section --> <div class="bg-gray-50 dark:bg-gray-800 border-4 border-black p-6 mb-8 shadow-[6px_6px_0px_0px_#000]"> <div class="flex flex-col lg:flex-row gap-6"> <!-- Category Filter Tabs --> <div class="flex-1"> <label class="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Category</label> <div class="flex flex-wrap gap-2"> ${Object.keys(gearCategories).map((key) => {
    const url2 = filterUrl({ category: key === "all" ? void 0 : key });
    return renderTemplate`<a${addAttribute(url2, "href")}${addAttribute(`px-4 py-2 font-black text-sm uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${brand !== "all" ? "" : ""} ${category === key ? "bg-black text-neon-green shadow-[3px_3px_0px_0px_#39FF14]" : "bg-white dark:bg-gray-700 dark:text-white hover:bg-neon-pink hover:text-white"}`, "class")}>${gearCategories[key]}</a>`;
  })} </div> </div> <!-- Brand Filter --> <div class="w-full lg:w-48"> <label class="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Brand</label> <select onchange="location.href = this.value" class="w-full px-3 py-2 border-4 border-black font-bold bg-white dark:bg-gray-700 dark:text-white shadow-[2px_2px_0px_0px_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all"> <option${addAttribute(filterUrl({ brand: void 0 }), "value")}${addAttribute(brand === "all", "selected")}>Semua Brand</option> ${uniqueBrands.map((b) => renderTemplate`<option${addAttribute(filterUrl({ brand: b }), "value")}${addAttribute(brand === b, "selected")}>${b}</option>`)} </select> </div> <!-- Sort Filter --> <div class="w-full lg:w-44"> <label class="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Urutkan</label> <select onchange="location.href = this.value" class="w-full px-3 py-2 border-4 border-black font-bold bg-white dark:bg-gray-700 dark:text-white shadow-[2px_2px_0px_0px_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all"> ${sortOptions.map((opt) => renderTemplate`<option${addAttribute(filterUrl({ sort: opt.value }), "value")}${addAttribute(sort === opt.value, "selected")}>${opt.label}</option>`)} </select> </div> </div> </div> <!-- Product Grid --> ${paginatedProducts.length > 0 ? renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"> ${paginatedProducts.map((gear) => renderTemplate`<a${addAttribute(`/gear/${gear.slug}`, "href")} class="group block border-4 border-black bg-white dark:bg-gray-800 shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#FF007F] transition-all"> <div class="aspect-[4/3] overflow-hidden border-b-2 border-black"> <img${addAttribute(gear.img, "src")}${addAttribute(gear.name, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"> </div> <div class="p-5"> <span class="inline-block px-2 py-1 text-xs font-black uppercase tracking-widest mb-2 bg-black text-neon-green">${gear.tag}</span> <h3 class="text-xl font-black mb-1 text-black dark:text-white truncate">${gear.name}</h3> <p class="text-lg font-bold text-neon-pink">${formatCurrency(gear.price)}</p> </div> </a>`)} </div>` : renderTemplate`<div class="text-center py-24 border-4 border-dashed border-black dark:border-gray-600 mb-12"> <p class="text-2xl font-black text-gray-400 dark:text-gray-500">Tidak ada gear ditemukan</p> <p class="text-gray-500 dark:text-gray-400 mt-2 font-medium">Coba ubah filter atau kata kunci pencarian.</p> </div>`} <!-- Pagination --> ${totalPages > 1 && renderTemplate`<div class="flex justify-center items-center gap-4"> ${page > 1 && renderTemplate`<a${addAttribute(filterUrl({ page: String(page - 1) }), "href")} class="px-5 py-3 font-black uppercase border-2 border-black bg-white dark:bg-gray-700 dark:text-white shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">← Sebelumnya</a>`} <span class="font-black text-lg text-black dark:text-white">Halaman ${page} dari ${totalPages}</span> ${page < totalPages && renderTemplate`<a${addAttribute(filterUrl({ page: String(page + 1) }), "href")} class="px-5 py-3 font-black uppercase border-2 border-black bg-white dark:bg-gray-700 dark:text-white shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Selanjutnya →</a>`} </div>`} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "D:/Rizkia/Project Software/TopZone/src/pages/gear/index.astro", void 0);

const $$file = "D:/Rizkia/Project Software/TopZone/src/pages/gear/index.astro";
const $$url = "/gear";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
