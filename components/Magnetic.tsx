"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, MQ } from "@/lib/gsap";

// Envuelve un botón o enlace y lo atrae hacia el puntero. El texto interior se mueve un poco más.
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia(MQ.rich);
    if (!mq.matches) return;
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;
    const inner = target.querySelector<HTMLElement>("[data-magnetic-inner]");

    const xTo = gsap.quickTo(target, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.5, ease: "power3" });
    const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.5, ease: "power3" }) : null;
    const iyTo = inner ? gsap.quickTo(inner, "y", { duration: 0.5, ease: "power3" }) : null;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      ixTo?.(dx * strength * 0.5);
      iyTo?.(dy * strength * 0.5);
    };
    const leave = () => {
      gsap.to(target, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: true });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: true });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set([target, inner].filter(Boolean), { x: 0, y: 0 });
    };
  }, [strength]);

  return (
    <span ref={ref} className={`magnetic inline-block p-3 -m-3 ${className}`}>
      {children}
    </span>
  );
}
