"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { HOURS, INFO, formatHour } from "@/lib/data";

type Status = { open: boolean; text: string } | null;

// Estado en vivo según la hora de Medellín (UTC-5, sin horario de verano).
function computeStatus(): Status {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }));
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const toMin = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const today = HOURS.find((h) => h.days.includes(day))!;
  const open = toMin(today.open);
  const close = toMin(today.close);
  if (minutes >= open && minutes < close) {
    const left = close - minutes;
    return {
      open: true,
      text: left <= 45 ? `Abierto, cerramos en ${left} min` : `Abierto ahora, hasta las ${formatHour(today.close)}`,
    };
  }
  if (minutes < open) return { open: false, text: `Cerrado, abrimos hoy a las ${formatHour(today.open)}` };
  const tomorrow = HOURS.find((h) => h.days.includes((day + 1) % 7))!;
  return { open: false, text: `Cerrado, abrimos mañana a las ${formatHour(tomorrow.open)}` };
}

export default function Location() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    const update = () => setStatus(computeStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Dos hojas de papel se abren desde el centro y descubren el mapa.
        gsap.set(".map-door", { display: "block" });
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".map-frame", start: "top 75%", once: true } });
        tl.to(".map-door-l", { xPercent: -100, duration: 1.1, ease: "expo.inOut" })
          .to(".map-door-r", { xPercent: 100, duration: 1.1, ease: "expo.inOut" }, 0)
          // La tarjeta se estampa encima.
          .from(".visit-card", { scale: 1.5, rotate: 14, opacity: 0, duration: 0.5, ease: "power4.in" }, 0.55)
          .fromTo(".visit-card", { y: -6 }, { y: 0, duration: 0.4, ease: "elastic.out(1.5, 0.3)" }, ">")
          .from(".visit-row", { opacity: 0, x: 18, stagger: 0.06, duration: 0.4, ease: "power2.out" }, "-=0.2");

        gsap.to(".live-dot", { scale: 1.9, opacity: 0, duration: 1.2, repeat: -1, ease: "power2.out" });
      });
    },
    { scope: root },
  );

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(INFO.mapsQuery)}&z=16&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(INFO.mapsQuery)}`;

  return (
    <section ref={root} id="ubicacion" className="relative bg-char text-char">
      <h2 className="sr-only">Ubicación y horarios</h2>
      <div className="map-frame relative h-[70svh] overflow-hidden md:h-[100svh] md:min-h-[720px]">
        <iframe
          title={`Mapa de ${INFO.name} en ${INFO.street}, ${INFO.area}`}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="map-iframe absolute inset-0 size-full border-0"
          allowFullScreen
        />
        <div className="pointer-events-none absolute inset-0 bg-ketchup mix-blend-multiply opacity-25" aria-hidden="true" />
        <div className="map-door map-door-l pointer-events-none absolute hidden inset-y-0 left-0 w-1/2 bg-mustard" aria-hidden="true" />
        <div className="map-door map-door-r pointer-events-none absolute hidden inset-y-0 right-0 w-1/2 bg-mustard" aria-hidden="true" />
      </div>

      <div className="relative z-10 -mt-20 px-4 pb-16 md:absolute md:left-[var(--gutter)] md:top-[60px] md:mt-0 md:w-[400px] md:px-0 md:pb-0">
        <div className="visit-card bg-paper p-7 md:p-8">
          <p className="font-display text-[2.6rem] uppercase leading-[0.9]">Ven con hambre</p>

          <p className="visit-row mt-4 text-lg leading-[1.4]">
            {INFO.street}
            <br />
            {INFO.area}
          </p>

          <p className="visit-row mt-4 flex min-h-7 items-center gap-3 text-base font-semibold" aria-live="polite">
            {status && (
              <>
                <span className="relative inline-grid size-3 place-items-center">
                  <span className={`live-dot absolute inset-0 rounded-full ${status.open ? "bg-pickle" : "bg-ketchup"}`} />
                  <span className={`relative size-3 rounded-full ${status.open ? "bg-pickle" : "bg-ketchup"}`} />
                </span>
                {status.text}
              </>
            )}
          </p>

          <dl className="visit-row mt-5 space-y-2 text-base">
            {HOURS.map((h) => (
              <div key={h.label} className="flex justify-between gap-4">
                <dt>{h.label}</dt>
                <dd className="tabular-nums">
                  {formatHour(h.open)} – {formatHour(h.close)}
                </dd>
              </div>
            ))}
          </dl>

          <p className="visit-row mt-5 text-base">
            Teléfono{" "}
            <a href={INFO.phoneHref} className="link-underline font-semibold tabular-nums" data-cursor="button">
              {INFO.phoneDisplay}
            </a>
            <br />
            Domicilios a 4 km a la redonda, de 12:00 m. a 10:00 p. m.
          </p>

          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary visit-row mt-7 flex h-14 w-full items-center justify-center bg-ketchup font-display text-xl uppercase text-paper"
            data-cursor="button"
          >
            Cómo llegar
          </a>
        </div>
      </div>
    </section>
  );
}
