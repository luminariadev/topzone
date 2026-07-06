import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { m as maybeRenderHead, o as renderComponent, h as addAttribute, k as renderTemplate, x as Fragment } from './entrypoint_l-pqzMWz.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_7KXavt6J.mjs';
import { r as renderScript, $ as $$Navbar } from './Navbar_BDk-Ncuv.mjs';
import { $ as $$Button } from './Button_poJCj7C-.mjs';
import 'clsx';
import { s as supabase } from './supabase_BNdglYSt.mjs';
import { g as gears, f as formatCurrency } from './gears_DQTVjETc.mjs';

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- src/components/Hero.astro -->${maybeRenderHead()}<section id="hero" class="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden"> <!-- Background image with overlay --> <div class="absolute inset-0"> <img src="/hero_background.png" alt="TopZone gaming store — koleksi game populer dan aksesoris gaming premium" class="w-full h-full object-cover opacity-40" loading="eager" fetchpriority="high" decoding="async" width="1920" height="1080"> <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" aria-hidden="true"></div> </div> <!-- Neubrutalism decorative border frame --> <div class="absolute inset-4 border-4 border-white/20 pointer-events-none hidden md:block"></div> <!-- Content --> <div class="relative z-10 text-center px-6 max-w-5xl mx-auto"> <!-- Badge --> <div class="inline-block mb-6 px-4 py-1 bg-neon-yellow text-black font-black text-sm uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_#000]" role="status">
🎮 #1 Gaming Store Indonesia
</div> <h1 class="text-5xl sm:text-6xl md:text-8xl font-black uppercase leading-none tracking-tighter mb-6"> <span class="block text-white">TOP UP &</span> <span class="block" style="color:#39FF14; -webkit-text-stroke: 2px #000;">GEAR UP</span> </h1> <p class="text-lg md:text-2xl font-bold mb-10 text-gray-200 max-w-2xl mx-auto">
Diamonds, gems, and premium gaming gear — delivered instantly with no hassle.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> ${renderComponent($$result, "Button", $$Button, { "variant": "green", "size": "lg", "href": "#games" }, { "default": ($$result2) => renderTemplate`Explore Games` })} ${renderComponent($$result, "Button", $$Button, { "variant": "yellow", "size": "lg", "href": "#gear" }, { "default": ($$result2) => renderTemplate`Shop Gear` })} </div> <!-- Stats bar --> <div class="mt-16 flex flex-wrap justify-center gap-6 md:gap-12" role="list" aria-label="TopZone statistics"> ${[
    { label: "Transactions", value: "500K+" },
    { label: "Games Supported", value: "50+" },
    { label: "Happy Customers", value: "200K+" }
  ].map((stat, i) => renderTemplate`<div${addAttribute(i, "key")} class="border-2 border-white/30 px-6 py-3 bg-black/40 backdrop-blur-sm" role="listitem"> <div class="text-3xl font-black" style="color:#39FF14;"${addAttribute(`${stat.value} ${stat.label}`, "aria-label")}>${stat.value}</div> <div class="text-sm text-gray-400 font-bold uppercase tracking-wider">${stat.label}</div> </div>`)} </div> </div> </section>`;
}, "D:/Rizkia/Project Software/TopZone/src/components/Hero.astro", void 0);

const $$Marquee = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- src/components/Marquee.astro -->${maybeRenderHead()}<div class="overflow-hidden border-y-4 border-black bg-black py-3 select-none" data-astro-cid-tpudeaz7> <div class="marquee-track flex whitespace-nowrap gap-0" data-astro-cid-tpudeaz7> ${[1, 2].map(() => renderTemplate`<span class="marquee-content inline-flex items-center gap-8 pr-8 text-neon-green font-black text-sm uppercase tracking-widest" data-astro-cid-tpudeaz7> <span data-astro-cid-tpudeaz7>🎮 New Game Releases</span> <span class="text-neon-pink" data-astro-cid-tpudeaz7>✦</span> <span data-astro-cid-tpudeaz7>⚙️ Gear Sale Up to 30%</span> <span class="text-neon-yellow" data-astro-cid-tpudeaz7>✦</span> <span data-astro-cid-tpudeaz7>🚀 Instant Top-Up</span> <span class="text-neon-pink" data-astro-cid-tpudeaz7>✦</span> <span data-astro-cid-tpudeaz7>🎉 Use Code: TOPZONE20</span> <span class="text-neon-yellow" data-astro-cid-tpudeaz7>✦</span> <span data-astro-cid-tpudeaz7>💎 500K+ Transactions</span> <span class="text-neon-pink" data-astro-cid-tpudeaz7>✦</span> <span data-astro-cid-tpudeaz7>🔥 Trusted by 200K Gamers</span> <span class="text-neon-yellow" data-astro-cid-tpudeaz7>✦</span> </span>`)} </div> </div>`;
}, "D:/Rizkia/Project Software/TopZone/src/components/Marquee.astro", void 0);

const games = [
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    img: "/assets/mlbb.png",
    color: "#39FF14",
    badge: "Terlaris",
    category: "mobile",
    currency: "Diamond",
    description: "Top up diamond Mobile Legends Bang Bang dengan harga terbaik. Instan, aman, dan terpercaya.",
    priority: 1,
    packages: [
      { id: "mlbb-86", label: "86 Diamond", price: 19e3 },
      { id: "mlbb-172", label: "172 Diamond", price: 37e3 },
      { id: "mlbb-257", label: "257 Diamond", price: 55e3 },
      { id: "mlbb-344", label: "344 Diamond", price: 72e3 },
      { id: "mlbb-514", label: "514 Diamond", price: 108e3 },
      { id: "mlbb-706", label: "706 Diamond", price: 147e3 }
    ]
  },
  {
    slug: "valorant",
    name: "Valorant",
    img: "/assets/valorant.png",
    color: "#FF007F",
    badge: "Trending",
    category: "pc",
    currency: "VP",
    description: "Beli Valorant Points (VP) untuk unlock agent, skin senjata, dan battle pass favoritmu.",
    priority: 2,
    packages: [
      { id: "valo-420", label: "420 VP", price: 55e3 },
      { id: "valo-740", label: "740 VP", price: 95e3 },
      { id: "valo-1200", label: "1.200 VP", price: 15e4 },
      { id: "valo-2050", label: "2.050 VP", price: 255e3 },
      { id: "valo-3650", label: "3.650 VP", price: 45e4 },
      { id: "valo-5350", label: "5.350 VP", price: 65e4 }
    ]
  },
  {
    slug: "free-fire",
    name: "Free Fire",
    img: "/assets/freefire.png",
    color: "#FFE600",
    badge: "Hot Deal",
    category: "mobile",
    currency: "Diamond",
    description: "Top up diamond Free Fire untuk beli skin karakter, senjata, dan item eksklusif lainnya.",
    priority: 3,
    packages: [
      { id: "ff-70", label: "70 Diamond", price: 14e3 },
      { id: "ff-140", label: "140 Diamond", price: 27e3 },
      { id: "ff-355", label: "355 Diamond", price: 66e3 },
      { id: "ff-720", label: "720 Diamond", price: 132e3 },
      { id: "ff-1450", label: "1.450 Diamond", price: 26e4 },
      { id: "ff-2180", label: "2.180 Diamond", price: 385e3 }
    ]
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    img: "/assets/pubg.png",
    color: "#F5A623",
    badge: "Baru",
    category: "mobile",
    currency: "UC",
    description: "Top up Unknown Cash (UC) PUBG Mobile untuk beli Royale Pass, skin senjata, dan item limited edition.",
    priority: 4,
    packages: [
      { id: "pubg-60", label: "60 UC", price: 13e3 },
      { id: "pubg-325", label: "325 UC", price: 66e3 },
      { id: "pubg-660", label: "660 UC", price: 132e3 },
      { id: "pubg-1800", label: "1.800 UC", price: 355e3 },
      { id: "pubg-3850", label: "3.850 UC", price: 71e4 },
      { id: "pubg-8100", label: "8.100 UC", price: 1395e3 }
    ]
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    img: "/assets/genshin.png",
    color: "#4FC1E9",
    badge: "Populer",
    category: "mobile",
    currency: "Genesis Crystal",
    description: "Top up Genesis Crystal Genshin Impact untuk beli Wanderlust Invocation dan item eksklusif.",
    priority: 5,
    packages: [
      { id: "gi-60", label: "60 Genesis Crystal", price: 13e3 },
      { id: "gi-300", label: "300 Genesis Crystal", price: 63e3 },
      { id: "gi-980", label: "980 Genesis Crystal", price: 198e3 },
      { id: "gi-1980", label: "1.980 Genesis Crystal", price: 395e3 },
      { id: "gi-3280", label: "3.280 Genesis Crystal", price: 635e3 },
      { id: "gi-6480", label: "6.480 Genesis Crystal", price: 125e4 }
    ]
  },
  {
    slug: "roblox",
    name: "Roblox",
    img: "/assets/roblox.png",
    color: "#E74C3C",
    badge: "Favorit",
    category: "mobile",
    currency: "Robux",
    description: "Beli Robux untuk akses game eksklusif, item avatar, dan pengalaman premium di Roblox.",
    priority: 6,
    packages: [
      { id: "rbx-80", label: "80 Robux", price: 16e3 },
      { id: "rbx-400", label: "400 Robux", price: 77e3 },
      { id: "rbx-800", label: "800 Robux", price: 153e3 },
      { id: "rbx-1700", label: "1.700 Robux", price: 305e3 },
      { id: "rbx-3500", label: "3.500 Robux", price: 6e5 }
    ]
  },
  {
    slug: "fortnite",
    name: "Fortnite",
    img: "/assets/fortnite.png",
    color: "#9B59B6",
    badge: "Promo",
    category: "pc",
    currency: "V-Bucks",
    description: "Beli V-Bucks Fortnite untuk Battle Pass, skin, emote, dan kosmetik lainnya.",
    priority: 7,
    packages: [
      { id: "fn-1000", label: "1.000 V-Bucks", price: 16e3 },
      { id: "fn-2800", label: "2.800 V-Bucks", price: 43e3 },
      { id: "fn-5000", label: "5.000 V-Bucks", price: 77e3 },
      { id: "fn-13500", label: "13.500 V-Bucks", price: 193e3 }
    ]
  },
  // ── 2.2 New Games ──────────────────────────────────────
  {
    slug: "ml-starlight",
    name: "Mobile Legends Starlight Pass",
    img: "/assets/mlbb-starlight.png",
    color: "#FFD700",
    badge: "Premium",
    category: "mobile",
    currency: "Starlight",
    description: "Aktifkan Starlight Pass Mobile Legends untuk skin eksklusif, emblem, dan reward bulanan.",
    priority: 8,
    packages: [
      { id: "ml-sl-1", label: "Starlight Pass", price: 85e3 },
      { id: "ml-sl-2", label: "Starlight Pass + 20 Level", price: 165e3 }
    ]
  },
  {
    slug: "fifa-mobile",
    name: "FIFA Mobile",
    img: "/assets/fifa.png",
    color: "#4CAF50",
    badge: "Sport",
    category: "mobile",
    currency: "FC Points",
    description: "Top up FC Points FIFA Mobile untuk membeli pemain, pack, dan upgrade tim impianmu.",
    priority: 9,
    packages: [
      { id: "fifa-105", label: "105 FC Points", price: 11e3 },
      { id: "fifa-520", label: "520 FC Points", price: 55e3 },
      { id: "fifa-1060", label: "1.060 FC Points", price: 11e4 },
      { id: "fifa-2200", label: "2.200 FC Points", price: 22e4 },
      { id: "fifa-5600", label: "5.600 FC Points", price: 55e4 }
    ]
  },
  {
    slug: "cod-mobile",
    name: "COD Mobile",
    img: "/assets/codm.png",
    color: "#FF4500",
    badge: "Aksi",
    category: "mobile",
    currency: "CP",
    description: "Top up COD Points (CP) untuk battle pass, weapon blueprint, dan karakter eksklusif.",
    priority: 10,
    packages: [
      { id: "codm-80", label: "80 CP", price: 12e3 },
      { id: "codm-420", label: "420 CP", price: 6e4 },
      { id: "codm-880", label: "880 CP", price: 12e4 },
      { id: "codm-2400", label: "2.400 CP", price: 31e4 },
      { id: "codm-4800", label: "4.800 CP", price: 6e5 }
    ]
  },
  {
    slug: "apex-legends",
    name: "Apex Legends",
    img: "/assets/apex.png",
    color: "#DC143C",
    badge: "Battle Royale",
    category: "pc",
    currency: "Apex Coins",
    description: "Beli Apex Coins untuk Battle Pass, skin legend, dan item kosmetik limited edition.",
    priority: 11,
    packages: [
      { id: "apex-500", label: "500 Apex Coins", price: 55e3 },
      { id: "apex-1000", label: "1.000 Apex Coins", price: 11e4 },
      { id: "apex-2000", label: "2.000 Apex Coins", price: 215e3 },
      { id: "apex-4000", label: "4.000 Apex Coins", price: 425e3 },
      { id: "apex-10000", label: "10.000 Apex Coins", price: 102e4 }
    ]
  },
  {
    slug: "pokemon-unite",
    name: "Pokémon Unite",
    img: "/assets/pokemon-unite.png",
    color: "#FFD700",
    badge: "Populer",
    category: "mobile",
    currency: "Aeos Gems",
    description: "Top up Aeos Gems Pokémon Unite untuk unlock Pokémon, Holowear, dan battle pass.",
    priority: 12,
    packages: [
      { id: "pu-60", label: "60 Aeos Gems", price: 11e3 },
      { id: "pu-240", label: "240 Aeos Gems", price: 44e3 },
      { id: "pu-490", label: "490 Aeos Gems", price: 88e3 },
      { id: "pu-1220", label: "1.220 Aeos Gems", price: 215e3 },
      { id: "pu-2440", label: "2.440 Aeos Gems", price: 43e4 }
    ]
  },
  {
    slug: "honor-of-kings",
    name: "Honor of Kings",
    img: "/assets/hok.png",
    color: "#1E90FF",
    badge: "Trending",
    category: "mobile",
    currency: "Top-Up",
    description: "Top up Honor of Kings untuk skin hero, battle pass, dan item limited eksklusif.",
    priority: 13,
    packages: [
      { id: "hok-60", label: "60 Token", price: 12e3 },
      { id: "hok-300", label: "300 Token", price: 6e4 },
      { id: "hok-980", label: "980 Token", price: 18e4 },
      { id: "hok-1980", label: "1.980 Token", price: 36e4 },
      { id: "hok-3280", label: "3.280 Token", price: 59e4 }
    ]
  },
  {
    slug: "steam-wallet",
    name: "Steam Wallet",
    img: "/assets/steam.png",
    color: "#1b2838",
    badge: "Multi-Platform",
    category: "pc",
    currency: "Steam IDR",
    description: "Top up Steam Wallet dengan harga terbaik. Gunakan untuk ribuan game di Steam store.",
    priority: 14,
    packages: [
      { id: "steam-50k", label: "Rp 50.000", price: 52e3 },
      { id: "steam-100k", label: "Rp 100.000", price: 103e3 },
      { id: "steam-200k", label: "Rp 200.000", price: 205e3 },
      { id: "steam-500k", label: "Rp 500.000", price: 51e4 }
    ]
  },
  {
    slug: "playstation-store",
    name: "PlayStation Store",
    img: "/assets/ps-store.png",
    color: "#003087",
    badge: "Console",
    category: "console",
    currency: "PSN Wallet",
    description: "Top up PlayStation Network Wallet untuk membeli game, DLC, dan langganan PS Plus.",
    priority: 15,
    packages: [
      { id: "psn-50k", label: "Rp 50.000", price: 54e3 },
      { id: "psn-100k", label: "Rp 100.000", price: 107e3 },
      { id: "psn-200k", label: "Rp 200.000", price: 213e3 },
      { id: "psn-500k", label: "Rp 500.000", price: 53e4 }
    ]
  },
  {
    slug: "nintendo-eshop",
    name: "Nintendo eShop",
    img: "/assets/nintendo-eshop.png",
    color: "#E60012",
    badge: "Console",
    category: "console",
    currency: "Gold Points",
    description: "Top up Nintendo eShop untuk membeli game Nintendo Switch dan DLC eksklusif.",
    priority: 16,
    packages: [
      { id: "nso-50k", label: "Rp 50.000", price: 55e3 },
      { id: "nso-100k", label: "Rp 100.000", price: 109e3 },
      { id: "nso-200k", label: "Rp 200.000", price: 217e3 },
      { id: "nso-500k", label: "Rp 500.000", price: 54e4 }
    ]
  },
  {
    slug: "google-play-gift",
    name: "Google Play Gift Card",
    img: "/assets/google-play.png",
    color: "#4285F4",
    badge: "Gift Card",
    category: "mobile",
    currency: "IDR",
    description: "Saldo Google Play untuk membeli aplikasi, game, film, dan langganan di Play Store.",
    priority: 17,
    packages: [
      { id: "gp-50k", label: "Rp 50.000", price: 53e3 },
      { id: "gp-100k", label: "Rp 100.000", price: 105e3 },
      { id: "gp-200k", label: "Rp 200.000", price: 209e3 },
      { id: "gp-500k", label: "Rp 500.000", price: 52e4 }
    ]
  },
  {
    slug: "apple-gift-card",
    name: "Apple App Store & iTunes",
    img: "/assets/apple-gift.png",
    color: "#555555",
    badge: "Gift Card",
    category: "mobile",
    currency: "IDR",
    description: "Saldo App Store & iTunes untuk pembelian aplikasi, game, musik, dan langganan di ekosistem Apple.",
    priority: 18,
    packages: [
      { id: "ap-50k", label: "Rp 50.000", price: 54e3 },
      { id: "ap-100k", label: "Rp 100.000", price: 107e3 },
      { id: "ap-200k", label: "Rp 200.000", price: 213e3 },
      { id: "ap-500k", label: "Rp 500.000", price: 53e4 }
    ]
  }
];

function getSb() {
  if (!supabase) return null;
  return supabase;
}
async function fetchGames() {
  const sb = getSb();
  try {
    const localGames = JSON.parse(localStorage.getItem("topzone_games") || "[]");
    if (localGames && localGames.length > 0) return localGames;
  } catch (e) {
    console.warn("Failed to parse localStorage topzone_games:", e);
  }
  if (!sb) return games;
  try {
    const { data: products, error } = await sb.from("products").select("*").eq("type", "game");
    if (error || !products || products.length === 0) {
      console.warn("Supabase fetchGames failed, using fallback data:", error);
      return games;
    }
    const { data: packages, error: pkgError } = await sb.from("product_packages").select("*").in("product_id", products.map((p) => p.id));
    if (pkgError) {
      console.warn("Supabase fetchPackages failed:", pkgError);
      return games;
    }
    const pkgMap = /* @__PURE__ */ new Map();
    (packages || []).forEach((pkg) => {
      if (!pkgMap.has(pkg.product_id)) pkgMap.set(pkg.product_id, []);
      pkgMap.get(pkg.product_id).push({ id: pkg.id, label: pkg.label, price: pkg.price });
    });
    return products.map((p) => ({
      slug: p.slug,
      name: p.name,
      img: p.img,
      color: p.color || "#39FF14",
      badge: p.badge || "New",
      category: p.category,
      currency: p.currency || "Diamond",
      description: p.description,
      packages: (pkgMap.get(p.id) || []).sort((a, b) => a.price - b.price)
    }));
  } catch (fetchError) {
    console.error("Supabase fetchGames failed, using fallback data:", fetchError);
    return games;
  }
}
async function fetchGears() {
  const sb = getSb();
  try {
    const localGears = JSON.parse(localStorage.getItem("topzone_gears") || "[]");
    if (localGears && localGears.length > 0) return localGears;
  } catch (e) {
    console.warn("Failed to parse localStorage topzone_gears:", e);
  }
  if (!sb) return gears;
  try {
    const { data: products, error } = await sb.from("products").select("*").eq("type", "gear");
    if (error || !products || products.length === 0) {
      console.warn("Supabase fetchGears failed, using fallback data:", error);
      return gears;
    }
    const { data: specs, error: specError } = await sb.from("gear_specs").select("*").in("product_id", products.map((p) => p.id));
    if (specError) {
      console.warn("Supabase fetchSpecs failed:", specError);
      return gears;
    }
    const specMap = /* @__PURE__ */ new Map();
    (specs || []).forEach((spec) => {
      if (!specMap.has(spec.product_id)) specMap.set(spec.product_id, []);
      specMap.get(spec.product_id).push({ label: spec.label, value: spec.value });
    });
    return products.map((p) => ({
      slug: p.slug,
      name: p.name,
      img: p.img,
      price: p.price,
      tag: p.tag || "Gaming",
      category: p.category,
      description: p.description,
      specs: specMap.get(p.id) || []
    }));
  } catch (fetchError) {
    console.error("Supabase fetchGears failed, using fallback data:", fetchError);
    return gears;
  }
}

const $$Loading = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Loading;
  const { text = "Memuat..." } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-col items-center justify-center py-12" data-astro-cid-52om46wh> <div class="w-12 h-12 border-4 border-black border-t-neon-green rounded-full mb-4" style="animation: spin 0.8s linear infinite" data-astro-cid-52om46wh></div> <p class="font-black text-sm uppercase tracking-wider" data-astro-cid-52om46wh>${text}</p> </div>`;
}, "D:/Rizkia/Project Software/TopZone/src/components/Loading.astro", void 0);

const $$FeaturedGames = createComponent(async ($$result, $$props, $$slots) => {
  const games = await fetchGames();
  return renderTemplate`<!-- src/components/FeaturedGames.astro -->${maybeRenderHead()}<section id="games" class="py-20 bg-white text-black border-t-4 border-black"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-10"> <h2 class="text-5xl font-black uppercase tracking-tighter mb-3">
Featured <span style="color:#39FF14; -webkit-text-stroke:1px #000;">Games</span> </h2> <p class="text-gray-600 font-bold text-lg">Top up instantly - safe, fast, and trusted.</p> </div> <div class="flex flex-wrap justify-center gap-3 mb-10" id="filter-tabs"> ${["all", "mobile", "pc", "console"].map((cat) => renderTemplate`<button class="filter-tab px-5 py-2 font-black uppercase tracking-wider text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all"${addAttribute(cat, "data-cat")}> ${cat === "all" ? "🎮 All" : cat === "mobile" ? "📱 Mobile" : cat === "pc" ? "💻 PC" : "🎮 Console"} </button>`)} </div> ${games.length === 0 ? renderTemplate`${renderComponent($$result, "Loading", $$Loading, { "text": "Memuat game..." })}` : renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="games-grid"> ${games.map((game) => renderTemplate`<article class="game-card group border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-150"${addAttribute(game.category, "data-category")}> <a${addAttribute(`/games/${game.slug}`, "href")} class="block"> <div class="relative"> <img${addAttribute(game.img, "src")}${addAttribute(game.name, "alt")} loading="lazy" decoding="async" class="w-full h-52 object-cover border-b-4 border-black"> <span class="absolute top-3 left-3 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000]"${addAttribute(`background:${game.color};`, "style")}> ${game.badge} </span> </div> <div class="p-5"> <h3 class="text-2xl font-black mb-1">${game.name}</h3> <p class="text-gray-500 font-bold mb-4">Top up ${game.currency}</p> <div class="w-full py-3 font-black uppercase tracking-wider text-center border-2 border-black shadow-[3px_3px_0px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[1px_1px_0px_0px_#000] transition-all"${addAttribute(`background:${game.color};`, "style")}>
Top Up Sekarang &rarr;
</div> </div> </a> </article>`)} </div>`} </div> </section> ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/components/FeaturedGames.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/components/FeaturedGames.astro", void 0);

const $$FeaturedGears = createComponent(async ($$result, $$props, $$slots) => {
  const allGears = await fetchGears();
  const categories = [
    { key: "all", label: "🎯 Semua" },
    { key: "keyboard", label: "⌨️ Keyboard" },
    { key: "mouse", label: "🖱️ Mouse" },
    { key: "headset", label: "🎧 Headset" },
    { key: "controller", label: "🎮 Controller" },
    { key: "chair", label: "🪑 Chair" },
    { key: "webcam", label: "📷 Webcam" },
    { key: "microphone", label: "🎙️ Mic" },
    { key: "monitor", label: "🖥️ Monitor" },
    { key: "mousepad", label: "🖊️ Mousepad" },
    { key: "speaker", label: "🔊 Speaker" },
    { key: "streaming", label: "📡 Streaming" }
  ];
  return renderTemplate`<!-- src/components/FeaturedGears.astro -->${maybeRenderHead()}<section id="gear" class="py-20 bg-neon-yellow text-black border-t-4 border-black"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <h2 class="text-5xl font-black uppercase tracking-tighter mb-3">
Featured <span class="bg-black text-neon-yellow px-2">Gear</span> </h2> <p class="text-black/70 font-bold text-lg">Premium peripherals for your setup.</p> </div> ${allGears.length === 0 ? renderTemplate`${renderComponent($$result, "Loading", $$Loading, { "text": "Memuat gear..." })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`  <div class="flex flex-wrap justify-center gap-3 mb-10"> ${categories.map((cat) => renderTemplate`<button${addAttribute(cat.key, "data-gear-filter")}${addAttribute(`gear-tab px-5 py-2 font-black text-sm uppercase tracking-wider border-2 border-black transition-all ${cat.key === "all" ? "bg-black text-neon-green shadow-[3px_3px_0px_0px_#39FF14]" : "bg-white hover:bg-neon-pink hover:text-white"}`, "class")}> ${cat.label} </button>`)} </div>  <div id="gear-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> ${allGears.map((gear) => renderTemplate`<article${addAttribute(gear.category, "data-gear-category")} class="group border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-150"> <a${addAttribute(`/gear/${gear.slug}`, "href")} class="block"> <div class="relative"> <img${addAttribute(gear.img, "src")}${addAttribute(gear.name, "alt")} loading="lazy" decoding="async" class="w-full h-52 object-cover border-b-4 border-black"> <span class="absolute top-3 right-3 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-black bg-black text-neon-yellow shadow-[2px_2px_0px_0px_#FFE600]"> ${gear.tag} </span> ${gear.brand && renderTemplate`<span class="absolute top-3 left-3 px-2 py-1 text-[10px] font-black uppercase tracking-wider border border-black bg-white/90"> ${gear.brand} </span>`} </div> <div class="p-5"> <h3 class="text-2xl font-black mb-1">${gear.name}</h3> <p class="font-bold text-xl mb-4" style="color:#FF007F;"> ${formatCurrency(gear.price)} </p> <div class="w-full py-3 font-black uppercase tracking-wider text-center bg-neon-pink text-white border-2 border-black shadow-[3px_3px_0px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[1px_1px_0px_0px_#000] transition-all">
Lihat Detail →
</div> </div> </a> </article>`)} </div> ` })}`} </div> </section> ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/components/FeaturedGears.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/components/FeaturedGears.astro", void 0);

const $$PromoBanner = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- src/components/PromoBanner.astro -->${maybeRenderHead()}<section id="promo" class="py-16 bg-black text-white border-t-4 border-neon-pink"> <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="border-4 border-neon-pink shadow-[8px_8px_0px_0px_#FF007F] p-10 text-center relative overflow-hidden"> <!-- Decorative background text --> <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5"> <span class="text-[12rem] font-black uppercase text-white">SALE</span> </div> <div class="relative z-10"> <span class="inline-block mb-4 px-4 py-1 bg-neon-pink text-white font-black text-sm uppercase tracking-widest border-2 border-white">
Limited Time Offer
</span> <h2 class="text-4xl md:text-6xl font-black uppercase mb-4">
20% OFF <span style="color:#FFE600;">All Credits</span> </h2> <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
Top up your favorite game with our exclusive promo. Use code below at checkout.
</p> <!-- Promo code box --> <div class="inline-flex items-center gap-0 mb-8"> <span class="px-6 py-3 border-4 border-neon-yellow bg-black text-neon-yellow font-black text-xl tracking-widest">
TOPZONE20
</span> <button class="px-6 py-3 bg-neon-yellow text-black font-black border-4 border-neon-yellow hover:bg-yellow-300 transition-colors uppercase">
Copy
</button> </div> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="#games" class="inline-block px-8 py-4 bg-neon-green text-black font-black uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all">
Claim Now
</a> </div> </div> </div> </div> </section> ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/components/PromoBanner.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/components/PromoBanner.astro", void 0);

const $$TrustBadges = createComponent(($$result, $$props, $$slots) => {
  const badges = [
    {
      icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
      title: "Free Shipping",
      description: "Gratis ongkir untuk pembelian gear gaming",
      color: "#39FF14"
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Secure Payment",
      description: "Transaksi aman dengan enkripsi SSL",
      color: "#FF007F"
    },
    {
      icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
      title: "24/7 Support",
      description: "Tim support siap membantu kapan saja",
      color: "#FFFF00"
    },
    {
      icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
      title: "100% Original",
      description: "Semua produk dijamin original & bergaransi",
      color: "#39FF14"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="py-12 bg-black border-y-4 border-white" aria-labelledby="trust-heading"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 id="trust-heading" class="sr-only">Trust Badges</h2> <div class="grid grid-cols-2 lg:grid-cols-4 gap-4"> ${badges.map((badge) => renderTemplate`<div class="trust-badge flex flex-col items-center text-center p-6 border-4 border-white bg-gray-900 shadow-[4px_4px_0px_0px_#333] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#39FF14] transition-all duration-150"> <div class="w-14 h-14 flex items-center justify-center border-3 border-white mb-4 shadow-[2px_2px_0px_0px_#000]"${addAttribute(`background:${badge.color};`, "style")}> <svg class="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(badge.icon, "d")}></path> </svg> </div> <h3 class="font-black uppercase text-white text-sm tracking-wider mb-1">${badge.title}</h3> <p class="text-gray-400 text-xs font-bold">${badge.description}</p> </div>`)} </div> </div> </section>`;
}, "D:/Rizkia/Project Software/TopZone/src/components/TrustBadges.astro", void 0);

const $$Testimonials = createComponent(($$result, $$props, $$slots) => {
  const testimonials = [
    {
      name: "Rizky Pratama",
      rating: 5,
      comment: "Top up ML diamonds super cepat! Masuk dalam 2 detik. TopZone emang paling reliable buat top up game.",
      platform: "Mobile Legends",
      platformColor: "#39FF14",
      avatarInitial: "RP",
      avatarBg: "#39FF14"
    },
    {
      name: "Anisa Putri",
      rating: 5,
      comment: "Keyboard mechanical yang aku beli original 100%. Packaging rapi, harga lebih murah dari toko lain. Recommended!",
      platform: "PC Gaming",
      platformColor: "#FF007F",
      avatarInitial: "AP",
      avatarBg: "#FF007F"
    },
    {
      name: "Dimas Aditya",
      rating: 4,
      comment: "Valorant Points masuk langsung. Customer service ramah dan fast response. Cuma agak lama pas jam ramai.",
      platform: "Valorant",
      platformColor: "#FFFF00",
      avatarInitial: "DA",
      avatarBg: "#FFFF00"
    },
    {
      name: "Sarah Wijaya",
      rating: 5,
      comment: "Beli headset SteelSeries di sini. Garansi resmi, harga bersahabat. Free shipping juga! Top banget.",
      platform: "Console Gaming",
      platformColor: "#39FF14",
      avatarInitial: "SW",
      avatarBg: "#39FF14"
    },
    {
      name: "Farhan Hidayat",
      rating: 5,
      comment: "Free Fire diamonds paling murah di TopZone. Sering ada promo juga. Udah jadi langganan buat top up.",
      platform: "Free Fire",
      platformColor: "#FF007F",
      avatarInitial: "FH",
      avatarBg: "#FF007F"
    },
    {
      name: "Maya Sari",
      rating: 4,
      comment: "Pembayaran gampang banget, bisa pakai GoPay. Prosesnya cepat dan ada notif juga. Overall puas!",
      platform: "Mobile Legends",
      platformColor: "#FFFF00",
      avatarInitial: "MS",
      avatarBg: "#FFFF00"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="py-16 bg-white border-t-4 border-black dark:bg-gray-900 dark:border-gray-700" aria-labelledby="testimonials-heading"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-10"> <h2 id="testimonials-heading" class="text-5xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">
What <span class="bg-neon-yellow px-2 border-2 border-black">Gamers</span> Say
</h2> <p class="text-gray-600 dark:text-gray-300 font-bold text-lg">Ribuan gamers udah trust TopZone. Sekarang giliran kamu!</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${testimonials.map((t) => renderTemplate`<article class="border-4 border-black bg-white dark:bg-gray-900 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-150 p-6"> <!-- Stars --> <div class="flex gap-1 mb-3"${addAttribute(`${t.rating} out of 5 stars`, "aria-label")}> ${Array.from({ length: 5 }).map((_, i) => renderTemplate`<svg${addAttribute(`w-5 h-5 ${i < t.rating ? "text-black" : "text-gray-300"}`, "class")} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>`)} </div> <!-- Comment --> <p class="text-gray-700 dark:text-gray-300 font-medium mb-4 leading-relaxed">
"${t.comment}"
</p> <!-- Author --> <div class="flex items-center gap-3"> <div class="w-10 h-10 flex items-center justify-center border-2 border-black font-black text-sm text-black shadow-[2px_2px_0px_0px_#000]"${addAttribute(`background:${t.avatarBg};`, "style")} aria-hidden="true"> ${t.avatarInitial} </div> <div> <p class="font-black text-sm">${t.name}</p> <span class="inline-block px-2 py-0.5 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[1px_1px_0px_0px_#000]"${addAttribute(`background:${t.platformColor};`, "style")}> ${t.platform} </span> </div> </div> </article>`)} </div> </div> </section>`;
}, "D:/Rizkia/Project Software/TopZone/src/components/Testimonials.astro", void 0);

const $$Faq = createComponent(($$result, $$props, $$slots) => {
  const faqItems = [
    {
      question: "Bagaimana cara top up diamonds di Mobile Legends?",
      answer: "Pilih game Mobile Legends, masukkan User ID dan Zone ID kamu, pilih jumlah diamond yang diinginkan, lalu lakukan pembayaran. Diamond akan masuk ke akun kamu dalam hitungan detik!",
      accent: "#39FF14"
    },
    {
      question: "Apakah gear gaming yang dijual original?",
      answer: "100% original! Semua gear gaming di TopZone diambil langsung dari distributor resmi. Kami memberikan garansi resmi untuk setiap pembelian keyboard, mouse, headset, dan monitor.",
      accent: "#FF007F"
    },
    {
      question: "Metode pembayaran apa saja yang diterima?",
      answer: "Kami menerima berbagai metode pembayaran: transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, Dana, ShopeePay), kartu kredit/debit, dan QRIS. Semua transaksi dijamin aman.",
      accent: "#FFFF00"
    },
    {
      question: "Berapa lama proses top up game?",
      answer: "Proses top up game biasanya selesai dalam 1-5 menit setelah pembayaran dikonfirmasi. Untuk beberapa game tertentu, proses bisa memakan waktu hingga 30 menit pada jam ramai.",
      accent: "#39FF14"
    },
    {
      question: "Bagaimana jika terjadi masalah dengan pesanan saya?",
      answer: "Hubungi tim support kami melalui live chat atau email ke support@topzone.id. Tim kami online 24/7 dan akan membantu menyelesaikan masalah kamu secepat mungkin. Kami juga menyediakan sistem refund untuk kasus tertentu.",
      accent: "#FF007F"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="py-16 bg-white border-t-4 border-black dark:bg-gray-900 dark:border-gray-700" id="faq" aria-labelledby="faq-heading"> <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-10"> <h2 id="faq-heading" class="text-5xl font-black uppercase tracking-tighter mb-3">
Frequently <span class="bg-neon-pink px-2 border-2 border-black text-white">Asked</span> </h2> <p class="text-gray-600 font-bold text-lg dark:text-gray-300">Pertanyaan yang sering ditanyain gamers.</p> </div> <div class="space-y-4"> ${faqItems.map((item, index) => renderTemplate`<div class="faq-item border-4 border-black shadow-[4px_4px_0px_0px_#000] bg-white dark:bg-gray-900 transition-all"${addAttribute(index, "data-index")}> <button class="faq-toggle w-full flex items-center justify-between p-5 text-left font-black text-lg uppercase tracking-wide hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" aria-expanded="false"${addAttribute(`faq-answer-${index}`, "aria-controls")}${addAttribute(`faq-question-${index}`, "id")}> <span class="flex items-center gap-3"> <span class="inline-flex items-center justify-center w-8 h-8 border-2 border-black font-black text-sm"${addAttribute(`background:${item.accent};`, "style")}> ${index + 1} </span> <span>${item.question}</span> </span> <span class="faq-icon flex-shrink-0 w-8 h-8 border-2 border-black flex items-center justify-center font-black text-xl leading-none transition-transform duration-200"${addAttribute(`background:${item.accent};`, "style")} aria-hidden="true">
+
</span> </button> <div${addAttribute(`faq-answer-${index}`, "id")} class="faq-answer hidden overflow-hidden border-t-4 border-black" role="region"${addAttribute(`faq-question-${index}`, "aria-labelledby")}> <p class="p-5 text-gray-700 dark:text-gray-300 font-medium leading-relaxed"> ${item.answer} </p> </div> </div>`)} </div> </div> </section> ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/components/Faq.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/components/Faq.astro", void 0);

const $$Newsletter = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- src/components/Newsletter.astro -->${maybeRenderHead()}<section class="py-16 bg-neon-green border-t-4 border-black" aria-labelledby="newsletter-heading"> <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <div class="border-4 border-black shadow-[6px_6px_0px_0px_#000] p-10 bg-white dark:bg-gray-900"> <span class="inline-block mb-4 px-4 py-1 bg-black text-neon-green font-black text-sm uppercase tracking-widest border-2 border-black">
Stay Updated
</span> <h2 id="newsletter-heading" class="text-3xl md:text-4xl font-black uppercase mb-3">
Newsletter <span class="bg-neon-yellow px-2 border-2 border-black">TopZone</span> </h2> <p class="text-gray-600 dark:text-white font-medium mb-6">
Dapatkan info promo terbaru, game top-up deals, dan gear exclusive langsung di inbox kamu!
</p> <form id="newsletter-form" class="flex flex-col sm:flex-row gap-3 justify-center" aria-label="Newsletter subscription"> <label for="newsletter-email" class="sr-only">Email address</label> <input id="newsletter-email" type="email" placeholder="email@kamu.com" required aria-required="true" aria-describedby="newsletter-privacy" class="px-5 py-3 border-4 border-black font-bold text-sm shadow-[3px_3px_0px_0px_#000] w-full sm:w-80 focus:outline-none focus:shadow-[4px_4px_0px_0px_#39FF14] focus:border-neon-green transition-all"> <button type="submit" class="px-8 py-3 bg-black text-neon-green font-black uppercase tracking-wider border-4 border-black shadow-[3px_3px_0px_0px_#39FF14] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#39FF14] active:translate-y-0 active:shadow-[1px_1px_0px_0px_#39FF14] transition-all">
Subscribe &rarr;
</button> </form> <!-- Status messages --> <p id="newsletter-success" class="hidden mt-4 font-black text-sm text-green-700 border-2 border-green-700 px-4 py-2" role="alert">
Terima kasih! Kamu sudah subscribe. Cek inbox kamu ya.
</p> <p id="newsletter-duplicate" class="hidden mt-4 font-black text-sm text-yellow-600 border-2 border-yellow-600 px-4 py-2" role="alert">
Email ini sudah terdaftar. Welcome back!
</p> <p id="newsletter-error" class="hidden mt-4 font-black text-sm text-neon-pink border-2 border-neon-pink px-4 py-2" role="alert">
Masukkan email yang valid ya.
</p> <p id="newsletter-privacy" class="text-xs text-gray-400 mt-4">
Kami tidak spam. Unsubscribe kapan saja.
</p> </div> </div> </section> ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/components/Newsletter.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/components/Newsletter.astro", void 0);

const $$ScrollToTop = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<button id="scroll-to-top" class="fixed bottom-6 left-6 z-50 hidden items-center justify-center w-12 h-12 border-4 border-black bg-neon-green text-black dark:bg-gray-800 dark:border-gray-600 dark:text-neon-green shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all font-bold text-xl" aria-label="Scroll to top" title="Kembali ke atas">
↑
</button> ${renderScript($$result, "D:/Rizkia/Project Software/TopZone/src/components/ScrollToTop.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Rizkia/Project Software/TopZone/src/components/ScrollToTop.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${renderComponent($$result2, "Hero", $$Hero, {})} ${renderComponent($$result2, "Marquee", $$Marquee, {})} ${renderComponent($$result2, "FeaturedGames", $$FeaturedGames, {})} ${renderComponent($$result2, "FeaturedGears", $$FeaturedGears, {})} ${renderComponent($$result2, "PromoBanner", $$PromoBanner, {})} ${renderComponent($$result2, "TrustBadges", $$TrustBadges, {})} ${renderComponent($$result2, "Testimonials", $$Testimonials, {})} ${renderComponent($$result2, "Faq", $$Faq, {})} ${renderComponent($$result2, "Newsletter", $$Newsletter, {})} ${renderComponent($$result2, "Footer", $$Footer, {})} ${renderComponent($$result2, "ScrollToTop", $$ScrollToTop, {})} ` })}`;
}, "D:/Rizkia/Project Software/TopZone/src/pages/index.astro", void 0);

const $$file = "D:/Rizkia/Project Software/TopZone/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
