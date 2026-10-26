"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { DEMO_MESSAGE, whatsappLink } from "@/lib/data";

// Franja fija que avisa que el sitio es una demostración. Su alto vive en --demo-h
// para que la barra de navegación y los filtros de la carta se ubiquen debajo.
export default function DemoBar() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.set(bar.current, { yPercent: -100 });
      return onIntroDone(() => gsap.to(bar.current, { yPercent: 0, duration: 0.6, delay: 0.2, ease: "power3.out" }));
    });
  });

  return (
    <div
      ref={bar}
      role="region"
      aria-label="Aviso de sitio de demostración"
      className="fixed inset-x-0 top-0 z-[65] flex h-[var(--demo-h)] items-center justify-between gap-3 bg-mustard px-[var(--gutter)] text-char"
    >
      <p className="min-w-0 truncate py-0.5 text-[0.8125rem] font-medium leading-[1.3] sm:text-[0.875rem]">
        Sitio de demostración diseñado por David
        <span className="hidden md:inline"> · ¿Quieres una así para tu restaurante?</span>
      </p>
      <a
        href={whatsappLink(DEMO_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary shrink-0 bg-char px-3 py-1.5 font-display text-[0.95rem] uppercase leading-none text-mustard"
        data-cursor="button"
      >
        Escríbeme
      </a>
    </div>
  );
}
