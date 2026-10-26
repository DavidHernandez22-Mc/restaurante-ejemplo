"use client";

import type * as Leaflet from "leaflet";

// Leaflet se carga desde cdnjs solo cuando el mapa está por entrar en pantalla.
// Los hashes SRI son los publicados por cdnjs para la versión 1.9.4.
const BASE = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4";
const JS_SRI = "sha512-puJW3E/qXDqYp9IfhAI54BJEaWIfloJ7JWs7OeD5i6ruC9JZL1gERT1wjtwXFlh7CjE7ZJ+/vcRZRkIYIb6p4g==";
const CSS_SRI = "sha512-h9FcoyWjHcOcmEVkxOfTLnmZFWIH0iZhZT1H2TbOq55xssQGEJHEaIm+PgoUaZbRvQTNTluNOEfb1ZRy6D3BOw==";

let pending: Promise<typeof Leaflet> | null = null;

export function loadLeaflet(): Promise<typeof Leaflet> {
  const w = window as unknown as { L?: typeof Leaflet };
  if (w.L) return Promise.resolve(w.L);
  if (pending) return pending;

  pending = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${BASE}/leaflet.min.css`;
    css.integrity = CSS_SRI;
    css.crossOrigin = "anonymous";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = `${BASE}/leaflet.min.js`;
    script.integrity = JS_SRI;
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = () => (w.L ? resolve(w.L) : reject(new Error("Leaflet no quedó disponible")));
    script.onerror = () => {
      pending = null;
      reject(new Error("No se pudo cargar Leaflet"));
    };
    document.head.appendChild(script);
  });
  return pending;
}
