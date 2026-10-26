"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Barra compacta que baja cuando el hero sale de pantalla, con una barra de progreso de lectura.
export default function StickyNav() {
  const bar = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(bar.current, { yPercent: -110 });
    const st = ScrollTrigger.create({
      trigger: "#inicio",
      start: "bottom 120px",
      onEnter: () => gsap.to(bar.current, { yPercent: 0, duration: reduced ? 0 : 0.5, ease: "power3.out" }),
      onLeaveBack: () => gsap.to(bar.current, { yPercent: -110, duration: reduced ? 0 : 0.35, ease: "power3.in" }),
    });
    const progress = gsap.fromTo(
      ".read-progress",
      { scaleX: 0 },
      { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: reduced ? true : 0.3 } },
    );
    return () => {
      st.kill();
      progress.scrollTrigger?.kill();
    };
  });

  return (
    <header ref={bar} className="fixed inset-x-0 top-[var(--demo-h)] z-[60] bg-char text-paper">
      <div className="flex h-16 items-center justify-between gap-4 px-[var(--gutter)]">
        <a href="#inicio" className="whitespace-nowrap font-display text-2xl uppercase leading-none" data-cursor="button">
          La Plancha <span className="text-mustard">70</span>
        </a>
        <nav aria-label="Atajos" className="hidden lg:block">
          <ul className="flex gap-6 whitespace-nowrap text-[0.95rem] font-medium">
            <li><a className="link-underline" href="#menu" data-cursor="button">La carta</a></li>
            <li><a className="link-underline" href="#combos" data-cursor="button">Combos</a></li>
            <li><a className="link-underline" href="#nosotros" data-cursor="button">Por qué</a></li>
            <li><a className="link-underline" href="#opiniones" data-cursor="button">Opiniones</a></li>
            <li><a className="link-underline" href="#ubicacion" data-cursor="button">Dónde</a></li>
          </ul>
        </nav>
        <a href="#menu" className="btn-primary whitespace-nowrap bg-mustard px-4 py-2 font-display text-lg uppercase text-char" data-cursor="button">
          Pedir ahora
        </a>
      </div>
      <div className="read-progress h-1.5 origin-left bg-ketchup" aria-hidden="true" />
    </header>
  );
}
