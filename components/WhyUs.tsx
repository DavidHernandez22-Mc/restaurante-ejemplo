"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { STATS } from "@/lib/data";
import { RingSticker } from "./Burger";

function formatStat(v: number, decimals: number) {
  return v.toFixed(decimals).replace(".", ",");
}

// La sección es la bolsa de papel kraft: tinta roja y negra sellada encima.
export default function WhyUs() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Titular sellado: entra grande y girado, y se estampa contra el papel.
        gsap.from(".why-title", {
          scale: 1.6,
          rotate: -8,
          opacity: 0,
          duration: 0.55,
          ease: "power4.in",
          scrollTrigger: { trigger: ".why-title", start: "top 80%", once: true },
          onComplete: () => {
            gsap.fromTo(".why-title", { x: -4 }, { x: 0, duration: 0.25, ease: "elastic.out(2, 0.3)" });
          },
        });

        // Contadores.
        gsap.utils.toArray<HTMLElement>(".stat-num").forEach((node) => {
          const target = Number(node.dataset.value);
          const decimals = Number(node.dataset.decimals ?? 0);
          const counter = { v: 0 };
          node.textContent = formatStat(0, decimals);
          gsap.to(counter, {
            v: target,
            duration: target > 50 ? 2.2 : 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 88%", once: true },
            onUpdate: () => {
              node.textContent = formatStat(counter.v, decimals);
            },
          });
        });

        // Las cifras pequeñas suben con un leve giro, cada una a su tiempo.
        gsap.utils.toArray<HTMLElement>(".stat-small").forEach((node, i) => {
          gsap.from(node, {
            y: 70,
            rotate: i % 2 ? 4 : -4,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 90%", once: true },
          });
        });

        // Foto revelada con máscara: el marco sube mientras la foto baja, solo con transform.
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".why-photo", start: "top 80%", once: true } });
        tl.from(".why-photo-mask", { yPercent: 100, duration: 1.2, ease: "expo.out" }).from(
          ".why-photo-inner",
          { yPercent: -100, duration: 1.2, ease: "expo.out" },
          0,
        );

        // Parallax dentro del marco.
        gsap.fromTo(
          ".why-photo-img",
          { yPercent: -8, scale: 1.18 },
          { yPercent: 8, scale: 1.18, ease: "none", scrollTrigger: { trigger: ".why-photo", start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.fromTo(
          ".why-stamp",
          { y: 80 },
          { y: -80, ease: "none", scrollTrigger: { trigger: ".why-photo", start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  const [big, ...rest] = STATS;

  return (
    <section ref={root} id="nosotros" className="relative overflow-hidden bg-kraft py-[120px] text-char lg:py-[200px]">
      <div className="grid grid-cols-1 gap-x-8 px-[var(--gutter)] lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="why-title origin-left font-display uppercase leading-[0.85] tracking-[-0.02em] text-[clamp(3.4rem,8vw,8.5rem)]">
            Rápido, pero
            <br />
            hecho a mano
          </h2>
          <p className="mt-6 max-w-[42ch] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] font-medium leading-[1.45]">
            Somos comida rápida porque la plancha está caliente desde el mediodía, no porque algo venga listo en una bolsa.
          </p>

          <div className="mt-14 lg:mt-20">
            <p className="font-display leading-[0.8] tracking-[-0.04em] text-ketchup-deep text-[clamp(7rem,24vw,22rem)]">
              <span className="stat-num tabular-nums" data-value={big.value} data-decimals={big.decimals}>
                {formatStat(big.value, big.decimals)}
              </span>
              {big.suffix}
            </p>
            <div className="mt-4 max-w-[38ch]">
              <h3 className="font-display text-[2rem] uppercase leading-none">{big.title}</h3>
              <p className="mt-2 text-lg leading-[1.5]">{big.text}</p>
            </div>
          </div>
        </div>

        <div className="relative mt-16 lg:col-span-5 lg:mt-0">
          <figure className="why-photo relative overflow-hidden">
            <div className="why-photo-mask overflow-hidden">
              <div className="why-photo-inner relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/local-barra-y-mesas.jpg"
                  alt="Salón de un restaurante con barra, mesas de madera y lámparas colgantes"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="why-photo-img object-cover"
                />
              </div>
            </div>
          </figure>
          <div className="why-stamp absolute -bottom-10 -left-6 w-[150px] text-[17px] lg:-left-16 lg:w-[190px] lg:text-[21px]">
            <RingSticker ring="HECHO A MANO · HECHO A MANO · HECHO A MANO · " top="Desde" bottom="2016" tone="char" className="-rotate-12" />
          </div>
        </div>
      </div>

      <ul className="mt-24 grid grid-cols-1 gap-14 px-[var(--gutter)] md:grid-cols-3 md:gap-8 lg:mt-32">
        {rest.map((s, i) => (
          <li key={s.title} className={`stat-small ${i === 1 ? "md:translate-y-16" : i === 2 ? "md:-translate-y-6" : ""}`}>
            <p className="font-display leading-[0.85] text-ketchup-deep text-[clamp(4.5rem,9vw,9rem)]">
              <span className="stat-num tabular-nums" data-value={s.value} data-decimals={s.decimals}>
                {formatStat(s.value, s.decimals)}
              </span>
              <span className="text-[0.45em]">{s.suffix || " / 5"}</span>
            </p>
            <h3 className="mt-3 font-display text-[1.75rem] uppercase leading-none">{s.title}</h3>
            <p className="mt-2 max-w-[34ch] text-lg leading-[1.5]">{s.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
