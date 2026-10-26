"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { DEMO_MESSAGE, INFO, whatsappLink } from "@/lib/data";
import Magnetic from "./Magnetic";
import Edge from "./Edge";

// Redes de muestra: no apuntan a ninguna cuenta real.
const SOCIALS = ["Instagram", "TikTok", "Facebook"];

// El reverso de la tarjeta: festón arriba, mensaje a la izquierda, datos a la derecha, estampilla y la marca a todo lo ancho.
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // La marca crece desde el suelo mientras llegas al final.
        gsap.fromTo(
          ".foot-word",
          { scaleY: 0.15, yPercent: 30 },
          {
            scaleY: 1,
            yPercent: 0,
            transformOrigin: "50% 100%",
            ease: "none",
            scrollTrigger: { trigger: ".foot-word-wrap", start: "top bottom", end: "bottom bottom", scrub: 0.4 },
          },
        );
        // La estampilla se pega con un golpe al entrar la postal.
        gsap.from(".foot-stamp", {
          rotate: 30,
          scale: 0.4,
          opacity: 0,
          duration: 0.7,
          ease: "back.out(2.5)",
          scrollTrigger: { trigger: ".postcard", start: "top 75%", once: true },
        });
      });
    },
    { scope: root },
  );

  const wa = whatsappLink(DEMO_MESSAGE);

  return (
    <footer ref={root} className="relative overflow-hidden bg-char pt-[120px] text-char lg:pt-[160px]">
      <div className="px-[var(--gutter)]">
        <div className="postcard relative mx-auto max-w-[1180px] bg-paper px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <Edge shape="scallop" side="top" size={24} color="var(--color-paper)" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="font-display text-[clamp(2.4rem,1.8rem+2vw,3.5rem)] uppercase leading-[0.9]">Nos vemos en la 70</p>
              <p className="mt-5 max-w-[40ch] text-lg leading-[1.55]">
                Si vienes en grupo de más de diez, escríbenos antes y juntamos mesas. Si es cumpleaños, la malteada de la vela corre por nuestra cuenta.
              </p>
              <ul className="mt-8 flex flex-wrap gap-3">
                {SOCIALS.map((label) => (
                  <li key={label}>
                    <Magnetic strength={0.45}>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="inline-flex items-center rounded-full bg-char px-6 py-3 font-display text-xl uppercase text-mustard"
                        data-cursor="button"
                        aria-label={`${label} (enlace de muestra, sin cuenta real)`}
                      >
                        <span data-magnetic-inner>{label}</span>
                      </a>
                    </Magnetic>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative lg:pt-24">
              <figure className="foot-stamp absolute right-0 top-[-2.5rem] w-[72px] rotate-6 bg-mustard p-1.5 sm:w-[88px] lg:top-0">
                <Image src="/images/burger-la-clasica.jpg" alt="" width={176} height={234} sizes="88px" className="block aspect-[3/4] w-full object-cover" />
              </figure>
              <address className="not-italic">
                <ul className="space-y-3 text-[1.125rem] leading-[1.4]">
                  <li>
                    <a className="link-underline" href={wa} target="_blank" rel="noopener noreferrer" data-cursor="button">
                      Escríbenos por WhatsApp
                    </a>
                  </li>
                  <li>
                    <a className="link-underline" href="#ubicacion" data-cursor="button">
                      {INFO.street}, {INFO.area}
                    </a>
                  </li>
                </ul>
              </address>
            </div>
          </div>
          <p className="mt-14 text-center text-[0.8125rem] leading-[1.5]">
            © 2026 {INFO.name}. Sitio de demostración con datos ficticios. Fotografías de Unsplash usadas como referencia temporal.
          </p>
        </div>
      </div>

      <div className="foot-word-wrap mt-16 overflow-hidden lg:mt-24" aria-hidden="true">
        <p className="foot-word whitespace-nowrap text-center font-display uppercase leading-[0.78] tracking-[-0.03em] text-mustard text-[19vw]">
          Plancha 70
        </p>
      </div>
    </footer>
  );
}
