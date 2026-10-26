"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";

// Pantalla de carga: la marca entra, el contador "prende la plancha" de 000 a 100
// y tres franjas de color suben para destapar el hero.
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const html = document.documentElement;
      html.classList.add("is-loading");
      const finish = () => {
        html.classList.remove("is-loading");
        setGone(true);
      };
      const mm = gsap.matchMedia();

      mm.add(MQ.reduced, () => {
        markIntroDone();
        gsap.to(root.current, { opacity: 0, duration: 0.35, delay: 0.25, onComplete: finish });
      });

      mm.add(MQ.motion, () => {
        const counter = { v: 0 };
        const tl = gsap.timeline({ onComplete: finish });
        tl.from(".ld-word", { yPercent: 115, rotate: 6, duration: 0.75, ease: "power4.out", stagger: 0.09 })
          .from(".ld-stamp", { scale: 2.6, rotate: -50, opacity: 0, duration: 0.55, ease: "back.out(2.2)" }, "-=0.35")
          .to(
            counter,
            {
              v: 100,
              duration: 1.15,
              ease: "power2.inOut",
              onUpdate: () => {
                if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
              },
            },
            0.25,
          )
          .to(".ld-bar", { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 0.25)
          .to(".ld-inner", { yPercent: -40, opacity: 0, duration: 0.45, ease: "power3.in" })
          .add(() => markIntroDone(), "-=0.1")
          .to(".ld-panel", { yPercent: -100, duration: 0.85, ease: "expo.inOut", stagger: 0.09 }, "-=0.15");
      });

      return () => html.classList.remove("is-loading");
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="loader fixed inset-0 z-[100] overflow-hidden" role="status" aria-label="Cargando Restaurante Ejemplo">
      <div className="absolute inset-0 grid grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="ld-panel relative bg-mustard">
            <div className="absolute inset-x-0 bottom-0 h-5 bg-char" />
          </div>
        ))}
      </div>
      <div className="ld-inner absolute inset-0 flex flex-col items-center justify-center px-4 text-char">
        <div className="relative">
          <p className="font-display uppercase leading-[0.82] tracking-[-0.02em] text-center text-[clamp(3rem,15vw,13rem)]">
            <span className="block overflow-hidden">
              <span className="ld-word inline-block bg-mustard px-[0.08em]">Restaurante</span>
            </span>
            <span className="block overflow-hidden">
              <span className="ld-word inline-block bg-ketchup px-[0.08em] text-paper">Ejemplo</span>
            </span>
          </p>
          <span className="ld-stamp absolute -right-2 -top-12 grid size-20 place-items-center rounded-full bg-char text-center font-display text-base leading-none text-mustard md:-right-10 md:-top-8 md:size-32 md:text-2xl">
            DESDE
            <br />
            2016
          </span>
        </div>
        <div className="mt-10 w-[min(420px,80vw)] bg-char p-4 text-paper">
          <p className="flex items-baseline justify-between text-base">
            <span>Prendiendo la plancha</span>
            <span className="font-display text-3xl tabular-nums">
              <span ref={num}>000</span>%
            </span>
          </p>
          <div className="mt-3 h-3 bg-paper/20">
            <div className="ld-bar h-full origin-left scale-x-0 bg-mustard" />
          </div>
        </div>
      </div>
    </div>
  );
}
