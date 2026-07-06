import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, k as renderTemplate, q as renderSlot, o as renderComponent, v as renderHead } from './entrypoint_l-pqzMWz.mjs';
import 'clsx';

const $$SkipNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SkipNav;
  const { targetId = "main-content" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`#${targetId}`, "href")} class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-black focus:text-neon-green focus:font-black focus:text-sm focus:uppercase focus:tracking-wider focus:border-4 focus:border-neon-green focus:shadow-[4px_4px_0px_0px_#39FF14] focus:outline-none">
Lompat ke konten utama
</a>`;
}, "D:/Rizkia/Project Software/TopZone/src/components/SkipNav.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "TopZone — Top Up Game & Gear Gaming Termurah",
    description = "TopZone adalah platform top up game dan belanja gear gaming termurah, tercepat, dan terpercaya di Indonesia. Mobile Legends, Valorant, Free Fire dan banyak lagi.",
    image = "/hero_background.png",
    canonical
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="id" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><meta name="generator"', '><meta name="description"', '><meta name="theme-color" content="#39FF14"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', ">", '<!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', "><!-- Canonical -->", '<link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><link rel="manifest" href="/manifest.json"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="TopZone"><link rel="apple-touch-icon" href="/favicon.svg"><title>', `</title><!-- Dark mode flicker prevention --><script>
			(function() {
				try {
					var theme = localStorage.getItem('topzone_theme');
					if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
						document.documentElement.classList.add('dark');
					}
				} catch (e) {
						console.warn('Failed to restore theme preference:', e);
					}
			})();
		<\/script><!-- JSON-LD Structured Data: WebSite with SearchAction --><script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": "TopZone",
			"url": "https://topzone.id",
			"description": "TopZone adalah platform top up game dan belanja gear gaming termurah, tercepat, dan terpercaya di Indonesia.",
			"potentialAction": {
				"@type": "SearchAction",
				"target": {
					"@type": "EntryPoint",
					"urlTemplate": "https://topzone.id/?q={search_term_string}"
				},
				"query-input": "required name=search_term_string"
			}
		}
		<\/script>`, "</head> <body data-astro-cid-sckkx6r4> ", ' <main id="main-content" data-astro-cid-sckkx6r4> ', " </main></body></html>"])), addAttribute(Astro2.generator, "content"), addAttribute(description, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.url).href, "content"), canonical && renderTemplate`<meta property="og:url"${addAttribute(canonical, "content")}>`, addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.url).href, "content"), canonical && renderTemplate`<link rel="canonical"${addAttribute(canonical, "href")}>`, title, renderHead(), renderComponent($$result, "SkipNav", $$SkipNav, { "targetId": "main-content", "data-astro-cid-sckkx6r4": true }), renderSlot($$result, $$slots["default"]));
}, "D:/Rizkia/Project Software/TopZone/src/layouts/Layout.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- src/components/Footer.astro -->${maybeRenderHead()}<footer class="bg-black text-white border-t-4 border-white pt-16 pb-8"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12"> <!-- Brand --> <div class="md:col-span-1"> <a href="/" class="text-3xl font-black">
🎮 TOP<span class="bg-neon-yellow text-black px-2 border-2 border-black">ZONE</span> </a> <p class="mt-4 text-gray-400 font-medium leading-relaxed">
Your ultimate destination for game top-ups and premium gaming gear in Indonesia.
</p> </div> <!-- Links --> <div> <h4 class="text-neon-yellow font-black uppercase tracking-wider mb-4 border-b-2 border-neon-yellow pb-2">Games</h4> <ul class="space-y-2 text-gray-400 font-medium"> <li><a href="#" class="hover:text-neon-green transition-colors">Mobile Legends</a></li> <li><a href="#" class="hover:text-neon-green transition-colors">Valorant</a></li> <li><a href="#" class="hover:text-neon-green transition-colors">Free Fire</a></li> <li><a href="#" class="hover:text-neon-green transition-colors">All Games</a></li> </ul> </div> <div> <h4 class="text-neon-pink font-black uppercase tracking-wider mb-4 border-b-2 border-neon-pink pb-2">Gear</h4> <ul class="space-y-2 text-gray-400 font-medium"> <li><a href="#" class="hover:text-neon-pink transition-colors">Keyboards</a></li> <li><a href="#" class="hover:text-neon-pink transition-colors">Mice</a></li> <li><a href="#" class="hover:text-neon-pink transition-colors">Headsets</a></li> <li><a href="#" class="hover:text-neon-pink transition-colors">All Gear</a></li> </ul> </div> <div> <h4 class="text-white font-black uppercase tracking-wider mb-4 border-b-2 border-white pb-2">Company</h4> <ul class="space-y-2 text-gray-400 font-medium"> <li><a href="#" class="hover:text-white transition-colors">About</a></li> <li><a href="#" class="hover:text-white transition-colors">Contact</a></li> <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li> <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li> </ul> </div> </div> <!-- Bottom bar --> <div class="border-t-2 border-white/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"> <p class="text-gray-500 text-sm">
&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} TopZone by <a href="https://github.com/luminariadev" class="text-neon-yellow hover:underline font-bold">LuminariaDev</a>. All rights reserved.
</p> <div class="flex gap-4" role="list"> <a href="https://github.com/luminariadev/TopZone" class="text-gray-400 hover:text-white transition-colors font-bold text-sm" aria-label="GitHub repository TopZone">GitHub</a> </div> </div> </div> </footer>`;
}, "D:/Rizkia/Project Software/TopZone/src/components/Footer.astro", void 0);

export { $$Layout as $, $$Footer as a };
