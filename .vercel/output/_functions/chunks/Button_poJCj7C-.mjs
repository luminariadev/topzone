import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, q as renderSlot } from './entrypoint_l-pqzMWz.mjs';

const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Button;
  const {
    variant = "green",
    size = "md",
    class: className = "",
    href,
    ...rest
  } = Astro2.props;
  const bgColors = {
    green: "bg-neon-green text-black hover:bg-[#2fe510]",
    pink: "bg-neon-pink text-white hover:bg-[#e00070]",
    yellow: "bg-neon-yellow text-black hover:bg-[#e5e500]",
    white: "bg-white text-black hover:bg-neutral-100",
    black: "bg-black text-white hover:bg-neutral-900"
  };
  const sizes = {
    sm: "px-4 py-2 text-xs md:text-sm font-bold",
    md: "px-6 py-3 text-sm md:text-base font-bold",
    lg: "px-8 py-4 text-base md:text-lg font-black"
  };
  const Tag = href ? "a" : "button";
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "href": href, "class:list": [
    "inline-flex items-center justify-center font-sans uppercase tracking-wider border-4 border-black rounded-none transition-all duration-100 cursor-pointer select-none text-center outline-none focus-visible:ring-4 focus-visible:ring-black",
    "shadow-[4px_4px_0px_0px_#000000]",
    "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#000000]",
    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000000]",
    bgColors[variant],
    sizes[size],
    className
  ], ...rest }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "D:/Rizkia/Project Software/TopZone/src/components/Button.astro", void 0);

export { $$Button as $ };
