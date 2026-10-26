"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { HOURS, INFO, formatHour } from "@/lib/data";
import { loadLeaflet } from "@/lib/leaflet";

// Cruce de la Carrera 70 con la Avenida San Juan (Calle 44), Laureles, Medellín.
// Calculado con la geometría de ambas vías en Nominatim (OpenStreetMap).
const COORDS: [number, number] = [6.249181, -75.588787];

// Teselas claras de Esri (Light Gray Canvas): fondo sin negocios marcados y una capa aparte
// solo con nombres de calles y barrios. CARTO ya exige clave y muestra una marca de agua.
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
const TILES_BASE = `${ESRI}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`;
const TILES_LABELS = `${ESRI}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`;
const ATTRIBUTION =
  'Teselas &copy; <a href="https://www.esri.com/">Esri</a> · Datos &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, HERE, Garmin';

// Pin propio: círculo mostaza con borde carbón y una hamburguesa.
const PIN_HTML = `<span class="plancha-pin-dot"><svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
<path d="M5 14c0-5.5 5-9 11-9s11 3.5 11 9z" fill="#1b110c"/>
<rect x="4" y="16" width="24" height="4" rx="2" fill="#d91f16"/>
<rect x="5" y="21" width="22" height="3" rx="1.5" fill="#1b110c"/>
<path d="M5 25h22c0 1.7-1.3 3-3 3H8c-1.7 0-3-1.3-3-3z" fill="#1b110c"/>
</svg></span>`;

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
  const mapEl = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>(null);
  const [mapFailed, setMapFailed] = useState(false);

  // El mapa (y Leaflet) se carga solo cuando la sección se acerca a la pantalla.
  useEffect(() => {
    const el = mapEl.current;
    if (!el) return;
    let map: Leaflet.Map | null = null;
    let cancelled = false;

    const init = (L: typeof Leaflet) => {
      if (cancelled) return;
      const touch = window.matchMedia("(pointer: coarse)").matches;
      map = L.map(el, {
        center: COORDS,
        zoom: 16,
        maxZoom: 16,
        // La rueda del mouse sigue bajando la página; en celular un dedo hace scroll, no arrastra el mapa.
        scrollWheelZoom: false,
        dragging: !touch,
        zoomControl: true,
      });
      L.tileLayer(TILES_BASE, { maxZoom: 16, attribution: ATTRIBUTION }).addTo(map);
      L.tileLayer(TILES_LABELS, { maxZoom: 16 }).addTo(map);
      const icon = L.divIcon({ className: "plancha-pin", html: PIN_HTML, iconSize: [60, 60], iconAnchor: [30, 30], popupAnchor: [0, -32] });
      L.marker(COORDS, { icon, title: "La Plancha 70", alt: "La Plancha 70" })
        .addTo(map)
        .bindPopup("<strong>La Plancha 70</strong> · Cra. 70 #44-21", { closeButton: false, autoPan: false, className: "plancha-popup" })
        .openPopup();
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        loadLeaflet()
          .then(init)
          .catch(() => !cancelled && setMapFailed(true));
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, []);

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
          // La tarjeta se estampa encima: entra grande y girada y rebota al asentarse.
          .fromTo(
            ".visit-card",
            { scale: 1.5, rotate: 14, opacity: 0 },
            { scale: 1, rotate: 0, opacity: 1, duration: 0.7, ease: "back.out(2.2)" },
            0.55,
          )
          .from(".visit-row", { opacity: 0, x: 18, stagger: 0.06, duration: 0.4, ease: "power2.out" }, "-=0.2");

        gsap.to(".live-dot", { scale: 1.9, opacity: 0, duration: 1.2, repeat: -1, ease: "power2.out" });
      });
    },
    { scope: root },
  );

  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(INFO.mapsQuery)}`;

  return (
    <section ref={root} id="ubicacion" className="relative overflow-x-clip bg-char text-char">
      <h2 className="sr-only">Ubicación y horarios</h2>
      <div className="map-frame relative h-[70svh] overflow-hidden md:h-[100svh] md:min-h-[720px]">
        <div
          ref={mapEl}
          role="region"
          aria-label={`Mapa de ${INFO.name} en ${INFO.street}, ${INFO.area}`}
          className="map-canvas absolute inset-0 isolate z-0 bg-[#f2f1ee]"
        />
        {mapFailed && (
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 grid place-items-center bg-[#f2f1ee] p-8 text-center font-display text-3xl uppercase text-char"
          >
            Ver la ubicación en Google Maps
          </a>
        )}
        <div className="map-door map-door-l pointer-events-none absolute hidden inset-y-0 left-0 w-1/2 bg-mustard" aria-hidden="true" />
        <div className="map-door map-door-r pointer-events-none absolute hidden inset-y-0 right-0 w-1/2 bg-mustard" aria-hidden="true" />
      </div>

      <div className="relative z-10 -mt-20 px-4 pb-28 md:absolute md:left-[var(--gutter)] md:top-[60px] md:mt-0 md:w-[400px] md:px-0 md:pb-0">
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
