"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";

// Cursor propio: un punto mostaza que crece y muestra una etiqueta sobre productos y botones.
// Se activa solo con puntero fino, pantalla amplia y sin "reducir movimiento".
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(MQ.rich);
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    let cleanup = () => {};

    const enable = () => {
      document.documentElement.classList.add("has-cursor");
      gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 0.2, opacity: 0 });
      const xTo = gsap.quickTo(dot, "x", { duration: 0.32, ease: "power3" });
      const yTo = gsap.quickTo(dot, "y", { duration: 0.32, ease: "power3" });
      let visible = false;
      let state = "";

      const setState = (next: string, text: string) => {
        if (next === state) return;
        state = next;
        dot.dataset.state = next;
        label.textContent = text;
        const scale = next === "product" ? 1 : next === "button" ? 0.55 : next === "media" ? 0.85 : 0.2;
        gsap.to(dot, { scale, duration: 0.35, ease: "back.out(2)", overwrite: "auto" });
        gsap.fromTo(label, { opacity: 0, y: 6 }, { opacity: text ? 1 : 0, y: 0, duration: 0.25, delay: 0.05 });
      };

      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        if (!visible) {
          visible = true;
          gsap.set(dot, { x: e.clientX, y: e.clientY });
          gsap.to(dot, { opacity: 1, duration: 0.2 });
        }
      };
      const over = (e: PointerEvent) => {
        const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
        if (!target) return setState("", "");
        setState(target.dataset.cursor ?? "", target.dataset.cursorLabel ?? "");
      };
      const leaveWindow = () => {
        visible = false;
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      };
      const down = () => gsap.to(dot, { scale: "-=0.12", duration: 0.12, yoyo: true, repeat: 1 });

      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      document.documentElement.addEventListener("pointerleave", leaveWindow);
      window.addEventListener("pointerdown", down);

      cleanup = () => {
        document.documentElement.classList.remove("has-cursor");
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leaveWindow);
        window.removeEventListener("pointerdown", down);
        gsap.set(dot, { opacity: 0 });
      };
    };

    const sync = () => {
      cleanup();
      cleanup = () => {};
      if (mq.matches) enable();
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      cleanup();
    };
  }, []);

  return (
    <div ref={dotRef} className="cursor-dot" aria-hidden="true">
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
