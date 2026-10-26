"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { INFO } from "@/lib/data";
import { BurgerArt, Ingredient, RingSticker, type IngredientKind } from "./Burger";
import Magnetic from "./Magnetic";

type Floating = { kind: IngredientKind; style: React.CSSProperties; depth: number; rot: number; mobile?: boolean };

const FLOATING: Floating[] = [
  { kind: "pickle", style: { left: "47%", top: "9%", width: "clamp(44px,5vw,72px)" }, depth: 0.8, rot: -14, mobile: true },
  { kind: "tomato", style: { right: "3%", top: "66%", width: "clamp(60px,6.5vw,96px)" }, depth: 0.5, rot: 10, mobile: true },
  { kind: "fry", style: { left: "37%", top: "56%", width: "clamp(16px,1.8vw,26px)" }, depth: 1.1, rot: 28 },
  { kind: "onion", style: { right: "41%", top: "74%", width: "clamp(48px,5vw,74px)" }, depth: 0.7, rot: 0 },
  { kind: "fry", style: { right: "6%", top: "7%", width: "clamp(14px,1.6vw,22px)" }, depth: 1.3, rot: -32, mobile: true },
  { kind: "cheese", style: { left: "27%", top: "3%", width: "clamp(40px,4.4vw,62px)" }, depth: 0.4, rot: 16 },
  { kind: "sesame", style: { left: "61%", top: "5%", width: "18px" }, depth: 1.4, rot: 30, mobile: true },
  { kind: "sesame", style: { right: "2%", top: "42%", width: "16px" }, depth: 0.9, rot: -20 },
  { kind: "sesame", style: { left: "42%", top: "45%", width: "14px" }, depth: 1.2, rot: 60 },
  { kind: "sesame", style: { left: "6%", top: "47%", width: "16px" }, depth: 0.6, rot: -40, mobile: true },
];

const TABS = [
  { href: "#menu", label: "La carta", cls: "bg-mustard text-char", h: "h-[64px] lg:h-[70px]" },
  { href: "#combos", label: "Combos", cls: "bg-paper text-char", h: "h-[72px] lg:h-[84px]" },
  { href: "#nosotros", label: "Por qué", cls: "bg-char text-paper", h: "h-[60px] lg:h-[66px]" },
  { href: "#opiniones", label: "Opiniones", cls: "bg-pickle text-paper", h: "h-[70px] lg:h-[78px]" },
  { href: "#ubicacion", label: "Dónde", cls: "bg-kraft text-char", h: "h-[62px] lg:h-[72px]" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const split = SplitText.create(".hero-line", { type: "chars", mask: "chars" });
        const svg = el.querySelector<SVGSVGElement>(".hero-burger svg");
        const seeds = el.querySelectorAll(".b-seed");

        gsap.set(split.chars, { yPercent: 118, rotate: 14, transformOrigin: "0% 100%" });
        gsap.set(".b-layer", { y: -640, opacity: 0 });
        gsap.set(seeds, { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(svg, { transformOrigin: "50% 100%" });
        gsap.set([".hero-copy > *", ".hero-photo", ".hero-sticker", ".ing-inner"], { opacity: 0 });
        gsap.set(".hero-tab", { yPercent: 110 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        tl.to(split.chars, { yPercent: 0, rotate: 0, duration: 1, ease: "expo.out", stagger: 0.035 }, 0);

        // La hamburguesa se arma de abajo hacia arriba: pan, carne, queso, tomate, lechuga, pan.
        const order = ["bun-bottom", "patty", "cheese", "tomato", "lettuce", "bun-top"];
        order.forEach((name, i) => {
          const layer = el.querySelector(`[data-layer="${name}"]`);
          const at = 0.3 + i * 0.22;
          if (name === "cheese") {
            tl.set(layer, { y: 0, opacity: 1 }, at).fromTo(
              layer,
              { scaleY: 0, transformOrigin: "50% 0%" },
              { scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.45)" },
              at,
            );
          } else {
            tl.to(layer, { y: 0, opacity: 1, duration: name === "bun-top" ? 0.48 : 0.36, ease: "power3.in" }, at).to(
              svg,
              { scaleY: name === "bun-top" ? 0.9 : 0.95, scaleX: name === "bun-top" ? 1.06 : 1.03, duration: 0.09, yoyo: true, repeat: 1, ease: "power1.out" },
              ">",
            );
          }
        });
        tl.to(seeds, { scale: 1, duration: 0.3, ease: "back.out(3)", stagger: 0.02 }, ">-0.05")
          .to(".hero-copy > *", { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, startAt: { y: 26 } }, 0.7)
          .to(".hero-tab", { yPercent: 0, duration: 0.7, ease: "back.out(1.6)", stagger: 0.07 }, 0.9)
          .to(".hero-photo", { opacity: 1, rotate: -7, scale: 1, duration: 0.8, ease: "back.out(1.5)", startAt: { rotate: -30, scale: 0.6 } }, 1.2)
          .to(".hero-sticker", { opacity: 1, scale: 1, rotate: -12, duration: 0.7, ease: "back.out(2.2)", startAt: { scale: 0, rotate: -200 } }, 1.75)
          .to(".ing-inner", { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.05, startAt: { scale: 0 } }, 1.0);

        const off = onIntroDone(() => tl.play());

        // Giro continuo del texto de la calcomanía.
        gsap.to(".hero-sticker .ring-spin", { rotate: 360, duration: 14, repeat: -1, ease: "none", transformOrigin: "50% 50%" });

        // Flotación suave de los ingredientes.
        gsap.utils.toArray<HTMLElement>(".ing-float").forEach((node, i) => {
          gsap.to(node, { rotate: `+=${i % 2 ? 14 : -14}`, y: i % 2 ? -10 : 10, duration: 2.4 + (i % 4) * 0.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
        });

        // Al hacer scroll: vista explotada de la hamburguesa y capas de parallax.
        const scrub = { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 };
        const explode = [70, 40, 14, -10, -36, -96];
        gsap.utils.toArray<SVGGElement>(".b-explode").forEach((g, i) => {
          gsap.to(g, { y: explode[i], rotate: i % 2 ? 2.5 : -2.5, transformOrigin: "50% 50%", ease: "none", scrollTrigger: scrub });
        });
        gsap.utils.toArray<HTMLElement>(".ing").forEach((node) => {
          const depth = Number(node.dataset.depth ?? 1);
          gsap.to(node, { y: -depth * 380, ease: "none", scrollTrigger: scrub });
        });
        gsap.to(".hero-photo-wrap", { y: -160, ease: "none", scrollTrigger: scrub });
        gsap.to(".hero-line-1", { xPercent: -8, ease: "none", scrollTrigger: scrub });
        gsap.to(".hero-line-2", { xPercent: 6, ease: "none", scrollTrigger: scrub });

        return () => {
          off();
          split.revert();
        };
      });

      // Parallax con el puntero, solo en escritorio con mouse.
      mm.add(MQ.rich, () => {
        const items = gsap.utils.toArray<HTMLElement>(".ing").map((node) => {
          const inner = node.querySelector<HTMLElement>(".ing-inner")!;
          return {
            depth: Number(node.dataset.depth ?? 1),
            x: gsap.quickTo(inner, "x", { duration: 0.8, ease: "power3" }),
            y: gsap.quickTo(inner, "y", { duration: 0.8, ease: "power3" }),
          };
        });
        const bx = gsap.quickTo(".hero-burger", "x", { duration: 1, ease: "power3" });
        const by = gsap.quickTo(".hero-burger", "y", { duration: 1, ease: "power3" });
        const move = (e: PointerEvent) => {
          const px = e.clientX / window.innerWidth - 0.5;
          const py = e.clientY / window.innerHeight - 0.5;
          items.forEach((it) => {
            it.x(px * 60 * it.depth);
            it.y(py * 50 * it.depth);
          });
          bx(px * -18);
          by(py * -12);
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="inicio"
      className="hero relative isolate flex min-h-[calc(100svh-var(--demo-h))] flex-col overflow-hidden bg-ketchup text-paper lg:block lg:h-[calc(100svh-var(--demo-h))] lg:min-h-[720px]"
    >
      {/* Ingredientes flotantes */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        {FLOATING.map((f, i) => (
          <div key={i} className={`ing absolute ${f.mobile ? "" : "hidden md:block"}`} data-depth={f.depth} style={f.style}>
            <div className="ing-inner" style={{ transform: `rotate(${f.rot}deg)` }}>
              <Ingredient kind={f.kind} className="ing-float block h-auto w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Barra superior */}
      <nav aria-label="Principal" className="relative z-40 grid grid-cols-[1fr_auto_1fr] items-center px-[var(--gutter)] pt-4 lg:pt-6">
        <ul className="hidden gap-6 whitespace-nowrap text-[0.95rem] font-medium lg:flex">
          <li><a className="link-underline" href="#menu" data-cursor="button">La carta</a></li>
          <li><a className="link-underline" href="#combos" data-cursor="button">Combos</a></li>
          <li><a className="link-underline" href="#ubicacion" data-cursor="button">Dónde estamos</a></li>
        </ul>
        <a href="#inicio" className="col-start-2 text-center font-display uppercase leading-[0.85]" aria-label="La Plancha 70, inicio">
          <span className="block text-[0.95rem] tracking-[0.02em]">La Plancha</span>
          <span className="block text-[1.9rem] lg:text-[2.2rem]">70</span>
        </a>
        <a href="#ubicacion" className="link-underline justify-self-end text-[0.95rem] font-medium" data-cursor="button">
          <span className="hidden sm:inline">{INFO.street} · </span>Laureles
        </a>
      </nav>

      {/* Titular */}
      <h1 className="hero-title relative z-30 mt-6 px-[var(--gutter)] font-display uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(5.2rem,21vw,9rem)] lg:absolute lg:leading-[0.8] lg:left-0 lg:top-[13svh] lg:mt-0 lg:text-[clamp(7rem,16.5vw,17.5rem)]">
        <span className="sr-only">La Plancha 70, hamburguesas en Medellín: </span>
        <span className="hero-line hero-line-1 block">Muerde</span>
        <span className="hero-line hero-line-2 block pl-[8vw]">sin miedo</span>
      </h1>

      {/* Hamburguesa estrella */}
      <div className="hero-burger relative z-20 mx-auto mt-4 w-[min(88vw,520px)] lg:absolute lg:right-[2.5vw] lg:top-[13svh] lg:mt-0 lg:w-[min(44vw,80svh)]">
        <BurgerArt className="block h-auto w-full overflow-visible" />
        <div className="hero-sticker absolute -right-1 -top-6 w-[112px] -rotate-12 text-[14px] sm:w-[140px] lg:-right-6 lg:-top-2 lg:w-[168px] lg:text-[18px]">
          <RingSticker ring="LA ESTRELLA DE LA CASA · LA ESTRELLA DE LA CASA · " top="La Doble" bottom="$28.900" ringClassName="ring-spin" />
        </div>
      </div>

      {/* Foto real, pegada con cinta */}
      <div className="hero-photo-wrap absolute bottom-[132px] left-[40vw] z-10 hidden w-[clamp(150px,13vw,200px)] lg:block">
        <figure className="hero-photo relative -rotate-[7deg] bg-paper p-2 pb-8 text-char">
          <span className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-3 bg-mustard/90" aria-hidden="true" />
          <Image
            src="/images/hero-burger-estrella-smash-doble.jpg"
            alt="La Doble 70 servida: dos carnes smash con cheddar fundido y pepinillos"
            width={400}
            height={500}
            priority
            sizes="200px"
            className="block aspect-[4/5] w-full object-cover"
          />
          <figcaption className="absolute inset-x-2 bottom-1.5 text-center text-[0.8125rem] font-medium">La de verdad, sin filtro</figcaption>
        </figure>
      </div>

      {/* Texto y acción */}
      <div className="hero-copy relative z-30 mt-6 flex flex-col gap-6 px-[var(--gutter)] pb-32 lg:absolute lg:bottom-[128px] lg:mt-0 lg:max-w-[34rem] lg:pb-0">
        <p className="text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] leading-[1.4] font-medium">
          Smash de res molida esta mañana, papas cortadas a mano y malteadas que no pasan por el pitillo. En la 70 desde 2016.
        </p>
        <div>
          <Magnetic>
            <a
              href="#menu"
              className="btn-primary inline-flex w-full items-center justify-center gap-3 bg-mustard px-8 py-5 font-display text-2xl uppercase text-char sm:w-auto"
              data-cursor="button"
            >
              <span data-magnetic-inner className="inline-flex items-center gap-3">
                Pedir ahora
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="square" />
                </svg>
              </span>
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Pestañas tipo carpeta que llevan a cada sección */}
      <nav aria-label="Secciones" className="absolute inset-x-0 bottom-0 z-30 overflow-x-auto overflow-y-hidden px-[var(--gutter)] [scrollbar-width:none]">
        <ul className="flex min-w-max items-end gap-2 lg:min-w-0 lg:gap-3">
          {TABS.map((t) => (
            <li key={t.href} className="hero-tab lg:flex-1">
              <a
                href={t.href}
                className={`folder-tab flex ${t.h} min-w-[150px] items-start px-7 pt-3 font-display text-xl uppercase lg:text-2xl ${t.cls}`}
                data-cursor="button"
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
