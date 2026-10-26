"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
}

// Condiciones compartidas para gsap.matchMedia().
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  // Puntero fino y pantalla amplia: cursor propio, inclinación 3D, imanes, vista previa al pasar.
  rich: "(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
};

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
