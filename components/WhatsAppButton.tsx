"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { DEMO_MESSAGE, whatsappLink } from "@/lib/data";

export default function WhatsAppButton() {
  const ring = useRef<HTMLSpanElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (window.matchMedia(MQ.reduced).matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(btn.current, { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: 0.8, delay: 3.2, ease: "back.out(2)" });
      gsap.fromTo(ring.current, { scale: 1, opacity: 0.7 }, { scale: 1.7, opacity: 0, duration: 1.6, repeat: -1, repeatDelay: 0.6, ease: "power2.out", delay: 4 });
    });
    return () => ctx.revert();
  }, []);

  const href = whatsappLink(DEMO_MESSAGE);

  return (
    <a
      ref={btn}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-4 right-4 z-[70] grid size-16 place-items-center rounded-full bg-wa text-char sm:bottom-6 sm:right-6"
      data-cursor="button"
    >
      <span ref={ring} className="absolute inset-0 rounded-full bg-wa" aria-hidden="true" />
      <svg className="relative" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.04 3C8.86 3 3.04 8.8 3.04 15.96c0 2.3.6 4.53 1.75 6.5L3 29l6.72-1.76a13 13 0 0 0 6.32 1.62h.01c7.17 0 13-5.8 13-12.96C29.05 8.8 23.21 3 16.04 3Zm0 23.66h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.24-3.99 1.04 1.06-3.88-.26-.4a10.7 10.7 0 0 1-1.66-5.72c0-5.95 4.86-10.8 10.84-10.8 5.97 0 10.83 4.85 10.83 10.8 0 5.96-4.86 10.7-10.91 10.7Zm5.94-8.08c-.33-.16-1.94-.95-2.24-1.06-.3-.11-.52-.16-.74.17-.22.32-.85 1.06-1.04 1.27-.19.22-.38.25-.71.08-.33-.16-1.38-.5-2.63-1.62-.97-.86-1.63-1.93-1.82-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.17-.19.22-.33.33-.54.11-.22.06-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.27-.63-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.71 0 1.6 1.17 3.14 1.33 3.36.16.22 2.3 3.5 5.57 4.91.78.33 1.39.53 1.86.68.78.25 1.5.21 2.06.13.63-.09 1.94-.79 2.21-1.56.27-.76.27-1.42.19-1.56-.08-.14-.3-.22-.63-.38Z"
        />
      </svg>
    </a>
  );
}
