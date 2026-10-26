"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { COMBOS, formatCOP, type Combo } from "@/lib/data";
import { useOrder } from "./OrderProvider";
import { useTilt } from "./useTilt";
import { RingSticker } from "./Burger";
import Edge from "./Edge";

// Cada cartel tiene su propio color y su propia composición.
const LOOKS = [
  { panel: "bg-ketchup text-paper", price: "text-mustard", button: "bg-mustard text-char", layout: "image-top", rotate: "-rotate-[1.5deg]" },
  { panel: "bg-mustard text-char", price: "text-ketchup", button: "bg-char text-mustard", layout: "image-right", rotate: "rotate-[1deg]" },
  { panel: "bg-paper text-char", price: "text-pickle", button: "bg-pickle text-paper", layout: "image-bottom", rotate: "-rotate-[0.8deg]" },
  { panel: "bg-pickle text-paper", price: "text-mustard", button: "bg-paper text-char", layout: "image-left", rotate: "rotate-[1.8deg]" },
] as const;

function ComboCard({ combo, index }: { combo: Combo; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { add } = useOrder();
  const look = LOOKS[index % LOOKS.length];
  useTilt(ref, 7);

  const saving = combo.before ? combo.before - combo.price : 0;
  const horizontal = look.layout === "image-right" || look.layout === "image-left";

  const image = (
    <div
      data-tilt-lift
      className={`combo-img relative overflow-hidden ${horizontal ? "aspect-[4/5] w-full md:w-[46%] md:shrink-0" : "aspect-[16/10] w-full"}`}
    >
      <Image src={combo.image} alt={`${combo.name}: ${combo.includes.join(", ")}`} fill sizes="(min-width: 768px) 40vw, 85vw" className="object-cover" />
    </div>
  );

  return (
    <article
      ref={ref}
      className={`combo-card relative flex h-full w-full flex-col ${look.panel} ${look.rotate} p-5 md:p-8 ${horizontal ? "md:flex-row md:items-stretch md:gap-8" : "gap-6"} ${look.layout === "image-left" ? "md:flex-row-reverse" : ""}`}
      data-cursor="product"
      data-cursor-label="Lo quiero"
    >
      {(look.layout === "image-top" || horizontal) && image}
      <div className={`flex flex-1 flex-col ${horizontal ? "mt-6 md:mt-0" : ""}`}>
        <h3 className={`font-display uppercase leading-[0.85] text-[clamp(2.6rem,1.6rem+2.4vw,4.25rem)]`}>{combo.name}</h3>
        <p className="mt-2 text-lg font-medium">{combo.line}</p>
        <ul className="mt-4 space-y-1.5 text-base">
          {combo.includes.map((inc) => (
            <li key={inc} className="flex items-start gap-2">
              <svg className="mt-1.5 shrink-0" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <rect width="12" height="12" fill="currentColor" />
              </svg>
              {inc}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span className={`combo-price font-display text-[clamp(3rem,2rem+3vw,5.5rem)] leading-[0.85] tabular-nums ${look.price}`}>{formatCOP(combo.price)}</span>
            {combo.before && (
              <span className="text-base">
                antes <s className="tabular-nums">{formatCOP(combo.before)}</s>
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={() => add(combo.id)}
            className={`btn-primary px-6 py-4 font-display text-xl uppercase ${look.button}`}
            data-cursor="button"
          >
            Agregar combo
          </button>
        </div>
      </div>
      {look.layout === "image-bottom" && image}
      {saving > 0 && (
        <div className={`combo-tag absolute -top-8 z-10 -right-4 md:-right-8`} style={{ width: "clamp(112px, 10vw, 150px)", fontSize: "clamp(13px, 1.15vw, 17px)" }}>
          <RingSticker
            ring="AHORRAS DE VERDAD · AHORRAS DE VERDAD · "
            top="Ahorras"
            bottom={formatCOP(saving)}
            tone={index % 2 ? "char" : "mustard"}
            className="rotate-12"
          />
        </div>
      )}
    </article>
  );
}

export default function Combos() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Escritorio: la sección se fija y los carteles pasan de derecha a izquierda.
      mm.add(MQ.desktop, () => {
        const el = track.current!;
        root.current!.classList.add("is-pinned");
        el.scrollLeft = 0;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // Las etiquetas de ahorro se columpian al entrar en pantalla durante el recorrido horizontal.
        gsap.utils.toArray<HTMLElement>(".combo-tag").forEach((tag) => {
          gsap.fromTo(
            tag,
            { rotate: -70, scale: 0.4, opacity: 0 },
            {
              rotate: 0,
              scale: 1,
              opacity: 1,
              ease: "back.out(2)",
              duration: 0.8,
              scrollTrigger: { trigger: tag, containerAnimation: tween, start: "left 85%", toggleActions: "play none none reverse" },
            },
          );
        });

        // Barra de avance que se llena como una papa frita.
        gsap.fromTo(
          ".combo-progress",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + distance(), scrub: true } },
        );

        // El titular de apertura se comprime al alejarse.
        gsap.to(".combo-intro-title", {
          scale: 0.7,
          opacity: 0.25,
          transformOrigin: "0% 50%",
          ease: "none",
          scrollTrigger: { trigger: ".combo-intro", containerAnimation: tween, start: "left left", end: "right left", scrub: true },
        });

        return () => root.current?.classList.remove("is-pinned");
      });

      // Móvil: carrusel nativo con entrada de los carteles al aparecer.
      mm.add(MQ.mobile, () => {
        gsap.from(".combo-slide", {
          x: 80,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: track.current, start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div className="relative">
    <Edge shape="zigzag" side="top" size={14} color="var(--color-char)" className="z-10" />
    <section ref={root} id="combos" className="combos relative overflow-hidden bg-char text-paper md:h-[100svh]">
      <div
        ref={track}
        className="combo-track flex h-full snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[var(--gutter)] py-20 [scrollbar-width:none] md:gap-[6vw] md:py-0 md:pr-[10vw]"
      >
        <div className="combo-intro flex w-[85vw] shrink-0 snap-start flex-col justify-center md:w-[62vw]">
          <h2 className="combo-intro-title font-display uppercase leading-[0.8] tracking-[-0.02em] text-[clamp(4.5rem,15vw,15rem)]">
            Combos
            <br />
            de cartel
          </h2>
          <p className="mt-6 max-w-[36ch] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-[1.45]">
            Cuatro maneras de pedir más pagando menos. Sigue bajando: los carteles pasan solos.
          </p>
        </div>
        {COMBOS.map((combo, i) => (
          <div
            key={combo.id}
            className={`combo-slide w-[85vw] shrink-0 snap-center py-10 md:h-[78svh] md:py-0 ${
              i === 1 || i === 3 ? "md:w-[min(64vw,940px)]" : "md:w-[min(40vw,560px)]"
            } ${i % 2 ? "md:translate-y-[4svh]" : "md:-translate-y-[3svh]"}`}
          >
            <ComboCard combo={combo} index={i} />
          </div>
        ))}
      </div>
      <div className="combo-progress-wrap absolute inset-x-[var(--gutter)] bottom-6 hidden h-3 bg-paper/15" aria-hidden="true">
        <div className="combo-progress h-full origin-left bg-mustard" />
      </div>
    </section>
    </div>
  );
}
