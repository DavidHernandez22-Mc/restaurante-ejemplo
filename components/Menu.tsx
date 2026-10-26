"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { gsap, Flip, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { CATEGORIES, MENU, INFO, formatCOP, type Category } from "@/lib/data";
import { useOrder } from "./OrderProvider";
import { useTilt } from "./useTilt";
import Edge from "./Edge";

type Filter = Category | "todo";

const FILTERS: { id: Filter; label: string; count: number }[] = [
  { id: "todo", label: "Todo", count: MENU.length },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: MENU.filter((m) => m.category === c.id).length })),
];

// Recalcula las posiciones de scroll sin que la página salte: ScrollTrigger puede
// restaurar una posición vieja cuando el documento cambia mucho de alto.
function refreshKeepingScroll() {
  const y = window.scrollY;
  ScrollTrigger.refresh();
  if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, behavior: "instant" });
}

export default function Menu() {
  const root = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const flipTl = useRef<gsap.core.Timeline | null>(null);
  const [filter, setFilter] = useState<Filter>("todo");
  const [active, setActive] = useState(MENU[1].id);
  const [seen, setSeen] = useState<string[]>([MENU[1].id]);
  const { add } = useOrder();

  useTilt(frameRef, 8);

  const activeItem = MENU.find((m) => m.id === active) ?? MENU[1];

  const choose = (next: Filter) => {
    if (next === filter) return;
    const sheet = sheetRef.current;
    if (!sheet) return setFilter(next);

    // Si hay una transición a medias, se termina y se limpian las filas antes de medir de nuevo.
    flipTl.current?.progress(1).kill();
    flipTl.current = null;
    const items = sheet.querySelectorAll<HTMLElement>("[data-flip-id]");
    gsap.killTweensOf(items);
    gsap.set(items, { clearProps: "opacity,transform,translate,rotate" });

    // Si ya bajaste dentro de la carta, se vuelve al inicio de la hoja: al cambiar de
    // categoría la hoja cambia mucho de alto y, sin esto, quedarías mirando otra sección.
    const offset = (window.innerWidth >= 1024 ? 110 : 150) + 40;
    const top = sheet.getBoundingClientRect().top;
    if (top < offset) window.scrollTo({ top: window.scrollY + top - offset, behavior: "instant" });

    if (!window.matchMedia(MQ.reduced).matches) flipState.current = Flip.getState(items);
    setFilter(next);
  };

  // Transición entre categorías con Flip: lo que se queda se reacomoda, lo nuevo cae, lo que sale se va de lado.
  // La carta cambia de alto: todas las posiciones de scroll de abajo se recalculan.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) {
      refreshKeepingScroll();
      return;
    }
    flipState.current = null;
    flipTl.current = Flip.from(state, {
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      stagger: 0.01,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)", stagger: 0.03, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, x: -50, duration: 0.28, ease: "power2.in", stagger: 0.008 }),
      onComplete: () => {
        flipTl.current = null;
        refreshKeepingScroll();
      },
    });
  }, [filter]);

  // Calcomanía de precio que se "pega" de nuevo cada vez que cambia el producto en vista.
  useEffect(() => {
    if (!stickerRef.current || window.matchMedia(MQ.reduced).matches) return;
    gsap.fromTo(stickerRef.current, { scale: 1.5, rotate: -40, opacity: 0 }, { scale: 1, rotate: -8, opacity: 1, duration: 0.45, ease: "back.out(2.4)" });
  }, [active]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // El titular gigante se desliza en sentido contrario al scroll.
        gsap.fromTo(
          ".menu-title",
          { xPercent: 4 },
          { xPercent: -14, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center top", scrub: 0.5 } },
        );
        // La hoja sale como de una impresora: sube y se endereza.
        gsap.from(sheetRef.current, {
          y: 160,
          rotate: 3,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: sheetRef.current, start: "top 92%", once: true },
        });
        gsap.from(".menu-filter", {
          x: -30,
          opacity: 0,
          stagger: 0.07,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: ".menu-filters", start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  const preview = (id: string) => {
    setActive(id);
    setSeen((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const addWithFeedback = (id: string, e: MouseEvent<HTMLElement>) => {
    add(id);
    if (window.matchMedia(MQ.reduced).matches) return;
    const row = (e.currentTarget as HTMLElement).closest(".menu-row");
    const btn = row?.querySelector(".add-btn");
    const plus = row?.querySelector(".plus-one");
    if (btn) gsap.fromTo(btn, { scale: 0.6, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(3)" });
    if (plus) gsap.fromTo(plus, { y: 0, opacity: 1 }, { y: -46, opacity: 0, duration: 0.8, ease: "power2.out" });
  };

  return (
    <section ref={root} id="menu" className="relative overflow-x-clip bg-mustard pb-[120px] pt-[150px] text-char lg:pb-[180px] lg:pt-[200px]">
      <h2 className="menu-title whitespace-nowrap px-[var(--gutter)] font-display uppercase leading-[0.8] tracking-[-0.03em] text-[clamp(6rem,30vw,26rem)]">
        La carta
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-x-8 px-[var(--gutter)] lg:mt-14 lg:grid-cols-12">
        <aside className="contents lg:sticky lg:top-[calc(6rem+var(--demo-h))] lg:col-span-4 lg:block lg:self-start">
          <p className="max-w-[34ch] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] font-medium leading-[1.45]">
            Toca un plato para sumarlo a tu pedido. Al final lo mandas por WhatsApp y te lo tenemos listo.
          </p>

          <div
            role="group"
            aria-label="Filtrar la carta por categoría"
            className="menu-filters sticky top-[calc(64px+var(--demo-h))] z-30 -mx-[var(--gutter)] mt-6 flex gap-2 overflow-x-auto bg-mustard px-[var(--gutter)] py-3 [scrollbar-width:none] lg:static lg:mx-0 lg:flex-wrap lg:gap-2.5 lg:overflow-visible lg:bg-transparent lg:px-0"
          >
            {FILTERS.map((f, i) => (
              <button
                key={f.id}
                type="button"
                onClick={() => choose(f.id)}
                aria-pressed={filter === f.id}
                data-cursor="button"
                className={`menu-filter shrink-0 px-4 py-2 font-display text-xl uppercase leading-none transition-[transform,background-color,color] duration-200 lg:px-4 lg:py-2 lg:text-[1.6rem] ${
                  i % 2 ? "lg:rotate-[1.5deg]" : "lg:-rotate-[1.5deg]"
                } ${filter === f.id ? "bg-char text-mustard" : "bg-paper text-char hover:-translate-y-0.5"}`}
              >
                {f.label}
                <span className="ml-2 align-top font-sans text-sm font-semibold">{f.count}</span>
              </button>
            ))}
          </div>

          {/* Vista previa fija (solo con mouse) */}
          <div className="preview-frame mt-8 hidden w-full max-w-[360px]">
            <div ref={frameRef} className="relative" data-cursor="media" data-cursor-label="Se ve así">
              <div className="relative aspect-square overflow-hidden bg-char">
                {seen.map((id) => {
                  const item = MENU.find((m) => m.id === id)!;
                  const on = id === active;
                  return item.image ? (
                    <Image
                      key={id}
                      src={item.image}
                      alt={on ? item.name : ""}
                      fill
                      sizes="360px"
                      className={`object-cover transition-opacity duration-[240ms] ${on ? "opacity-100" : "opacity-0"}`}
                    />
                  ) : (
                    <div
                      key={id}
                      className={`absolute inset-0 flex items-end bg-ketchup p-6 font-display text-[4.5rem] uppercase leading-[0.85] text-paper transition-opacity duration-[240ms] ${on ? "opacity-100" : "opacity-0"}`}
                      aria-hidden={!on}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
              <div
                ref={stickerRef}
                data-tilt-lift
                className="absolute -bottom-6 -right-6 grid size-32 -rotate-[8deg] place-items-center rounded-full bg-ketchup p-3 text-center text-paper"
              >
                <span className="font-display text-[1.65rem] leading-none">{formatCOP(activeItem.price)}</span>
              </div>
              <p className="mt-4 max-w-[30ch] font-display text-3xl uppercase leading-none" aria-live="polite">
                {activeItem.name}
              </p>
            </div>
          </div>
        </aside>

        {/* La hoja de la carta */}
        <div className="mt-4 lg:col-span-8 lg:col-start-5 lg:mt-0 xl:col-span-7 xl:col-start-6">
          <div ref={sheetRef} className="relative mx-auto mt-6 max-w-[760px] bg-paper px-5 py-12 text-char sm:px-10 lg:mt-0 lg:rotate-[0.6deg] lg:px-14 lg:py-16">
            <Edge shape="scallop" side="top" size={12} color="var(--color-paper)" />
            <Edge shape="scallop" side="bottom" size={12} color="var(--color-paper)" />

            <header className="text-center">
              <p className="font-display text-[clamp(2.25rem,1.6rem+2vw,3rem)] uppercase leading-none">{INFO.name}</p>
              <p className="mt-2 text-[0.9375rem]">Precios en pesos colombianos con impuesto al consumo incluido.</p>
            </header>

            <div className="mt-10">
              {CATEGORIES.map((c) => {
                const items = MENU.filter((m) => m.category === c.id);
                const hidden = filter !== "todo" && filter !== c.id;
                return (
                  <div key={c.id} className={hidden ? "" : "mb-12 last:mb-0"}>
                    <h3 data-flip-id={`g-${c.id}`} className={`${hidden ? "hidden" : "inline-block"} mb-5 bg-char px-3 py-1 font-display text-[1.6rem] uppercase leading-tight text-mustard`}>
                      {c.label}
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          data-flip-id={item.id}
                          className={`menu-row group relative ${hidden ? "hidden" : "flex"} cursor-pointer items-start gap-4 px-2 py-3 transition-colors duration-200 hover:bg-mustard/25 sm:px-3`}
                          onPointerEnter={() => preview(item.id)}
                          onClick={(e) => addWithFeedback(item.id, e)}
                          data-cursor="product"
                          data-cursor-label="Agregar"
                        >
                          <div className="row-thumb relative size-[72px] shrink-0 overflow-hidden bg-mustard lg:size-[96px]">
                            {item.image ? (
                              <Image src={item.image} alt="" fill sizes="96px" className="object-cover transition-transform duration-300 group-hover:scale-110" />
                            ) : (
                              <span className="absolute inset-0 grid place-items-center bg-ketchup p-1 text-center font-display text-sm uppercase leading-none text-paper">
                                {item.name}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              <h4 className="font-display text-[clamp(1.35rem,1.1rem+0.8vw,1.9rem)] uppercase leading-none">{item.name}</h4>
                              {item.tag && (
                                <span className="tag-sticker -rotate-3 bg-ketchup px-2 py-0.5 text-[0.8125rem] font-semibold text-paper">{item.tag}</span>
                              )}
                              <span className="ml-auto font-display text-[clamp(1.35rem,1.1rem+0.8vw,1.9rem)] leading-none tabular-nums">{formatCOP(item.price)}</span>
                            </div>
                            <p className="mt-1.5 max-w-[48ch] text-base leading-[1.45]">{item.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addWithFeedback(item.id, e);
                            }}
                            aria-label={`Agregar ${item.name} al pedido`}
                            className="add-btn relative mt-0.5 grid size-11 shrink-0 place-items-center rounded-full bg-char text-mustard transition-transform duration-200 group-hover:scale-110"
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                              <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
                            </svg>
                            <span className="plus-one pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 font-display text-xl text-ketchup opacity-0">+1</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <footer className="mt-12 text-center text-base leading-[1.5]">
              <p>Lunes a jueves de 12:00 m. a 10:00 p. m. · Viernes y sábado hasta las 11:30 p. m.</p>
              <p>Domingo y festivos de 12:00 m. a 9:00 p. m.</p>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
