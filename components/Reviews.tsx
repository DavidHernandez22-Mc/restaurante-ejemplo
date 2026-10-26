"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { LETTER, REVIEWS, type Review } from "@/lib/data";
import Marquee from "./Marquee";
import Stars from "./Stars";
import Edge from "./Edge";

function Stub({ review, tilt }: { review: Review; tilt: number }) {
  return (
    <figure
      className="relative mx-3 my-6 w-[300px] shrink-0 bg-paper px-6 py-6 text-char sm:w-[340px]"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <Edge shape="zigzag" side="top" size={8} color="var(--color-paper)" />
      <Edge shape="zigzag" side="bottom" size={8} color="var(--color-paper)" />
      <Stars value={review.stars} className="text-ketchup" />
      <blockquote className="mt-3 text-[1.0625rem] leading-[1.45]">{review.text}</blockquote>
      <figcaption className="mt-4 text-[0.9375rem]">
        <span className="font-semibold">{review.name}</span> · {review.where}
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const root = useRef<HTMLElement>(null);
  const first = REVIEWS.slice(0, 5);
  const second = REVIEWS.slice(5);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Titular que se exprime hacia arriba como salsa del tarro.
        gsap.from(".rev-title-line", {
          scaleY: 0,
          transformOrigin: "50% 100%",
          duration: 0.9,
          ease: "elastic.out(1, 0.5)",
          stagger: 0.12,
          scrollTrigger: { trigger: ".rev-title", start: "top 80%", once: true },
        });

        // La servilleta cae y se acomoda.
        gsap.from(".napkin", {
          y: 120,
          rotate: 9,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".napkin", start: "top 85%", once: true },
        });

        // La carta se lee línea por línea, cada línea sale de su propia máscara.
        // autoSplit vuelve a medir las líneas si cambia el ancho o cargan las fuentes.
        const split = SplitText.create(".letter-text", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.06,
              scrollTrigger: { trigger: ".napkin", start: "top 70%", once: true },
            }),
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="opiniones" className="relative overflow-hidden bg-ketchup pb-[120px] pt-[120px] text-paper lg:pb-[180px] lg:pt-[180px]">
      <div className="grid grid-cols-1 gap-x-8 px-[var(--gutter)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="rev-title font-display uppercase leading-[0.82] tracking-[-0.02em] text-[clamp(3.6rem,9vw,9.5rem)]">
            <span className="rev-title-line block">Lo dicen</span>
            <span className="rev-title-line block">ellos</span>
          </h2>
          <p className="mt-6 inline-block -rotate-2 bg-paper px-3 py-1.5 text-base font-semibold leading-tight text-char">
            Reseñas de ejemplo para la demo
          </p>
        </div>

        <article className="napkin relative mt-12 bg-paper px-6 py-10 text-char sm:px-12 sm:py-14 lg:col-span-6 lg:col-start-7 lg:mt-24 lg:-rotate-2">
          <Edge shape="scallop" side="top" size={10} color="var(--color-paper)" />
          <Edge shape="scallop" side="bottom" size={10} color="var(--color-paper)" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-char/[0.04]" aria-hidden="true" />
          <div className="relative max-w-[34rem]">
            <p className="letter-text font-sans text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-semibold leading-[1.2]">{LETTER.opening}</p>
            {LETTER.body.map((para) => (
              <p key={para.slice(0, 20)} className="letter-text mt-5 text-[1.125rem] leading-[1.55]">
                {para}
              </p>
            ))}
            <div className="mt-10 text-base">
              <p className="font-semibold">{LETTER.name}</p>
              <p>{LETTER.role}</p>
            </div>
          </div>
          <div className="absolute -right-3 -top-6 rotate-6 bg-mustard px-4 py-2 font-display text-xl uppercase text-char sm:-right-8">
            <Stars value={5} className="mr-2 align-[-2px]" />
            Reseña de muestra
          </div>
        </article>
      </div>

      <div className="mt-24 lg:mt-32" aria-label="Más reseñas de clientes">
        <Marquee speed={45} direction={1}>
          {first.map((r, i) => (
            <Stub key={r.name} review={r} tilt={i % 2 ? 1.5 : -1.5} />
          ))}
        </Marquee>
        <Marquee speed={38} direction={-1} className="mt-4">
          {second.map((r, i) => (
            <Stub key={r.name} review={r} tilt={i % 2 ? -2 : 1} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
