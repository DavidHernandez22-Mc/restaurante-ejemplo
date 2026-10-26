"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type MarqueeProps = {
  children: ReactNode;
  speed?: number; // píxeles por segundo
  direction?: 1 | -1; // 1 = hacia la izquierda
  className?: string;
  trackClassName?: string;
};

// Cinta infinita. Acelera con la velocidad del scroll y cambia de sentido cuando el scroll sube.
export default function Marquee({ children, speed = 70, direction = 1, className = "", trackClassName = "" }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const set = track.firstElementChild as HTMLElement | null;
    if (!set) return;

    let width = set.offsetWidth;
    const ro = new ResizeObserver(() => {
      width = set.offsetWidth;
    });
    ro.observe(set);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => ro.disconnect();
    }

    const setX = gsap.quickSetter(track, "x", "px");
    let x = 0;
    let dir: number = direction;
    let boost = 0;
    let active = false;

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        active = self.isActive;
      },
      onUpdate: (self) => {
        dir = self.direction === 1 ? direction : -direction;
        boost = Math.min(Math.abs(self.getVelocity()) / 140, 12);
      },
    });
    active = st.isActive;

    const tick = (_time: number, deltaTime: number) => {
      if (!active || width === 0) return;
      boost *= 0.93;
      x -= (dir * speed * (1 + boost) * deltaTime) / 1000;
      x = gsap.utils.wrap(-width, 0, x);
      setX(x);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      ro.disconnect();
    };
  }, [speed, direction]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className={`flex w-max will-change-transform ${trackClassName}`}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
