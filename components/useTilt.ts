"use client";

import { useEffect, type RefObject } from "react";
import { gsap, MQ } from "@/lib/gsap";

// Inclinación 3D al pasar el puntero. Solo puntero fino y con movimiento permitido.
export function useTilt(ref: RefObject<HTMLElement | null>, max = 10) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia(MQ.rich);
    if (!mq.matches) return;

    gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
    const lift = el.querySelectorAll<HTMLElement>("[data-tilt-lift]");

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * max * 2);
      rx(-py * max * 2);
    };
    const enter = () => {
      if (lift.length) gsap.to(lift, { z: 60, duration: 0.5, ease: "power3" });
    };
    const leave = () => {
      rx(0);
      ry(0);
      if (lift.length) gsap.to(lift, { z: 0, duration: 0.6, ease: "power3" });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { rotationX: 0, rotationY: 0 });
    };
  }, [ref, max]);
}
