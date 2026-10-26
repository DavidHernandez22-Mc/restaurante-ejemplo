"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { INFO, ORDERABLES, formatCOP } from "@/lib/data";
import { useOrder } from "./OrderProvider";
import Edge from "./Edge";

// El ticket del pedido: se imprime con lo que agregas y se envía por WhatsApp.
export default function OrderTicket() {
  const { lines, count, total, open, setOpen, add, remove, clear, bump } = useOrder();
  const pillRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const shown = useRef(false);

  const reduced = () => window.matchMedia(MQ.reduced).matches;

  // Aparece la primera vez que hay algo en el pedido.
  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    if (count > 0 && !shown.current) {
      shown.current = true;
      gsap.fromTo(pill, { yPercent: 160, rotate: -12, autoAlpha: 0 }, { yPercent: 0, rotate: -2, autoAlpha: 1, duration: reduced() ? 0 : 0.7, ease: "back.out(1.8)" });
    } else if (count === 0 && shown.current) {
      shown.current = false;
      gsap.to(pill, { yPercent: 160, autoAlpha: 0, duration: reduced() ? 0 : 0.4, ease: "power3.in" });
      setOpen(false);
    }
  }, [count, setOpen]);

  // Pequeño golpe cada vez que se suma algo.
  useEffect(() => {
    if (!bump || !pillRef.current || reduced()) return;
    gsap.fromTo(pillRef.current, { scale: 1.15, rotate: 4 }, { scale: 1, rotate: -2, duration: 0.5, ease: "elastic.out(1.2, 0.4)" });
  }, [bump]);

  // Abrir y cerrar el ticket.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (open) {
      gsap.set(panel, { display: "block" });
      gsap.fromTo(panel, { yPercent: 105, rotate: 3 }, { yPercent: 0, rotate: 0, duration: reduced() ? 0 : 0.6, ease: "power4.out" });
      panel.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    gsap.to(panel, { yPercent: 110, duration: reduced() ? 0 : 0.4, ease: "power3.in", onComplete: () => gsap.set(panel, { display: "none" }) });
  }, [open, setOpen]);

  const entries = Object.entries(lines).filter(([id]) => ORDERABLES[id]);
  const message = [
    "¡Hola, Restaurante Ejemplo! Quiero pedir:",
    ...entries.map(([id, qty]) => `${qty} × ${ORDERABLES[id].name} (${formatCOP(ORDERABLES[id].price * qty)})`),
    `Total: ${formatCOP(total)}`,
    "",
    "Nombre:",
    "Dirección o recojo en el local:",
  ].join("\n");
  const waHref = `https://wa.me/${INFO.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <button
        ref={pillRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="ticket-pedido"
        className="fixed bottom-4 left-4 z-[70] invisible flex items-center opacity-0 gap-3 bg-paper px-5 py-3 text-char sm:bottom-6 sm:left-6"
        data-cursor="button"
      >
        <span className="font-display text-xl uppercase">Tu pedido</span>
        <span className="grid size-8 place-items-center rounded-full bg-ketchup font-display text-lg text-paper tabular-nums">{count}</span>
        <span className="font-display text-xl tabular-nums">{formatCOP(total)}</span>
      </button>

      <div
        ref={panelRef}
        id="ticket-pedido"
        role="dialog"
        aria-modal="false"
        aria-label="Tu pedido"
        className="fixed bottom-24 left-4 z-[75] hidden w-[min(400px,calc(100vw-2rem))] sm:bottom-24 sm:left-6"
      >
        <div className="relative max-h-[70svh] overflow-y-auto bg-paper px-6 pb-8 pt-6 text-char">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-3xl uppercase leading-none">{INFO.name}</p>
              <p className="mt-1 text-[0.9375rem]">
                {INFO.street}, {INFO.area}
              </p>
            </div>
            <button
              type="button"
              data-autofocus
              onClick={() => setOpen(false)}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-char text-paper"
              aria-label="Cerrar el ticket"
              data-cursor="button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </button>
          </div>

          <div className="ticket-tear my-5" aria-hidden="true" />

          <ul className="space-y-3">
            {entries.map(([id, qty]) => (
              <li key={id} className="flex items-center gap-3 text-base">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => remove(id)} className="grid size-8 place-items-center bg-char/10 font-bold" aria-label={`Quitar una ${ORDERABLES[id].name}`}>
                    −
                  </button>
                  <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
                  <button type="button" onClick={() => add(id)} className="grid size-8 place-items-center bg-char/10 font-bold" aria-label={`Agregar otra ${ORDERABLES[id].name}`}>
                    +
                  </button>
                </div>
                <span className="flex-1">{ORDERABLES[id].name}</span>
                <span className="tabular-nums">{formatCOP(ORDERABLES[id].price * qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 h-1 bg-char" aria-hidden="true" />
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-display text-2xl uppercase">Total</span>
            <span className="font-display text-[2.75rem] leading-none tabular-nums">{formatCOP(total)}</span>
          </div>
          <p className="mt-2 text-[0.9375rem]">El valor del domicilio te lo confirmamos por WhatsApp.</p>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 flex h-14 w-full items-center justify-center gap-3 bg-wa font-display text-xl uppercase text-char"
            data-cursor="button"
          >
            Enviar por WhatsApp
          </a>
          <button type="button" onClick={clear} className="link-underline mx-auto mt-4 block text-base">
            Vaciar pedido
          </button>
          <Edge shape="zigzag" side="bottom" size={10} color="var(--color-paper)" />
        </div>
      </div>
    </>
  );
}
