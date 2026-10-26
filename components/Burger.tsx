import { useId } from "react";

// Ilustración plana de La Doble 70. Cada capa vive en dos grupos:
// .b-explode (lo mueve el scroll) y .b-layer (lo mueve el armado inicial).

const SESAME: [number, number, number][] = [
  [130, 112, -20], [168, 96, 10], [210, 90, -5], [252, 98, 18], [292, 114, -12],
  [110, 146, 25], [152, 132, -8], [196, 124, 30], [238, 128, -25], [280, 140, 6],
  [320, 150, -18], [138, 170, 12], [182, 160, -30], [226, 162, 8], [268, 172, -10], [306, 180, 22],
];

function lettucePath() {
  const x0 = 28;
  const x1 = 392;
  const waves = 14;
  const seg = (x1 - x0) / waves;
  let d = `M${x0} 232`;
  for (let i = 0; i < waves; i++) d += ` q${seg / 2} -20 ${seg} 0`;
  d += ` L${x1} 244`;
  for (let i = 0; i < waves; i++) d += ` q${-seg / 2} 16 ${-seg} 0`;
  return d + " Z";
}

export function BurgerArt({ className = "" }: { className?: string }) {
  const lettuce = lettucePath();
  return (
    <svg viewBox="0 0 420 400" className={className} role="img" aria-label="Ilustración de La Doble 70 armándose capa por capa">
      <g className="b-explode" data-explode="0">
        <g className="b-layer" data-layer="bun-bottom">
          <path d="M44 330 H376 Q392 330 388 348 Q380 382 338 384 H82 Q40 382 32 348 Q28 330 44 330 Z" fill="#E8A13A" />
          <path d="M34 356 Q44 382 82 384 H338 Q376 382 386 356 Q370 372 336 372 H84 Q50 372 34 356 Z" fill="#C97F23" />
          <rect x="40" y="326" width="340" height="14" rx="7" fill="#F5CB7E" />
        </g>
      </g>
      <g className="b-explode" data-explode="1">
        <g className="b-layer" data-layer="patty">
          <path d="M36 296 Q36 268 66 268 H354 Q384 268 384 296 V306 Q384 334 354 334 H66 Q36 334 36 306 Z" fill="#5B2D18" />
          <path d="M40 314 Q46 334 66 334 H354 Q374 334 380 314 Q366 326 350 326 H70 Q54 326 40 314 Z" fill="#3D1C0E" />
          {[[78, 300], [124, 312], [170, 296], [214, 316], [262, 300], [306, 314], [344, 298], [100, 286], [238, 288], [326, 288]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="9" ry="3.5" fill="#3D1C0E" transform={`rotate(${i % 2 ? 12 : -10} ${x} ${y})`} />
          ))}
          {[[60, 284, 100], [150, 282, 200], [270, 282, 330]].map(([x1, y, x2], i) => (
            <path key={i} d={`M${x1} ${y} Q${(x1 + x2) / 2} ${y - 6} ${x2} ${y}`} stroke="#7C4326" strokeWidth="5" strokeLinecap="round" fill="none" />
          ))}
        </g>
      </g>
      <g className="b-explode" data-explode="2">
        <g className="b-layer" data-layer="cheese">
          <path
            d="M28 256 H392 L374 274 L362 302 Q356 314 350 302 L342 282 H302 L290 322 Q284 334 278 322 L268 284 H202 L190 308 Q184 318 178 308 L168 284 H106 L98 300 Q93 310 88 300 L80 280 L28 256 Z"
            fill="#FFC21A"
          />
          <path d="M28 256 H392 L384 264 H36 Z" fill="#FFD75E" />
        </g>
      </g>
      <g className="b-explode" data-explode="3">
        <g className="b-layer" data-layer="tomato">
          <rect x="54" y="236" width="154" height="26" rx="13" fill="#B5160F" />
          <rect x="62" y="240" width="138" height="16" rx="8" fill="#F0675C" />
          <rect x="212" y="236" width="154" height="26" rx="13" fill="#B5160F" />
          <rect x="220" y="240" width="138" height="16" rx="8" fill="#F0675C" />
          {[88, 120, 152, 176, 246, 278, 310, 334].map((x, i) => (
            <ellipse key={i} cx={x} cy="248" rx="5" ry="3" fill="#FFD3C4" />
          ))}
        </g>
      </g>
      <g className="b-explode" data-explode="4">
        <g className="b-layer" data-layer="lettuce">
          <path d={lettuce} fill="#4F8A1F" transform="translate(0 6)" />
          <path d={lettuce} fill="#79B536" />
        </g>
      </g>
      <g className="b-explode" data-explode="5">
        <g className="b-layer" data-layer="bun-top">
          <path d="M40 210 C34 118 110 66 210 66 C310 66 386 118 380 210 Q380 228 362 228 H58 Q40 228 40 210 Z" fill="#E8A13A" />
          <path d="M42 198 H378 Q380 228 362 228 H58 Q40 228 42 198 Z" fill="#C97F23" />
          <path d="M88 134 C112 100 160 84 212 82" stroke="#F7C46B" strokeWidth="14" strokeLinecap="round" fill="none" />
          {SESAME.map(([x, y, r], i) => (
            <ellipse key={i} className="b-seed" cx={x} cy={y} rx="7" ry="3.6" fill="#FFF1D2" transform={`rotate(${r} ${x} ${y})`} />
          ))}
        </g>
      </g>
    </svg>
  );
}

export type IngredientKind = "pickle" | "tomato" | "fry" | "onion" | "sesame" | "cheese";

export function Ingredient({ kind, className = "" }: { kind: IngredientKind; className?: string }) {
  switch (kind) {
    case "pickle":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <circle cx="40" cy="40" r="34" fill="#4F7A1F" />
          <circle cx="40" cy="40" r="26" fill="#8DBB45" />
          {Array.from({ length: 7 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 7;
            const x = Math.round((40 + Math.cos(a) * 14) * 100) / 100;
            const y = Math.round((40 + Math.sin(a) * 14) * 100) / 100;
            return <ellipse key={i} cx={x} cy={y} rx="4" ry="2.4" fill="#E9F2C8" transform={`rotate(${Math.round((a * 180) / Math.PI)} ${x} ${y})`} />;
          })}
        </svg>
      );
    case "tomato":
      return (
        <svg viewBox="0 0 90 90" className={className} aria-hidden="true">
          <circle cx="45" cy="45" r="40" fill="#A9140D" />
          <circle cx="45" cy="45" r="32" fill="#F0675C" />
          {Array.from({ length: 6 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 6;
            const x = Math.round((45 + Math.cos(a) * 18) * 100) / 100;
            const y = Math.round((45 + Math.sin(a) * 18) * 100) / 100;
            return <ellipse key={i} cx={x} cy={y} rx="6" ry="3.5" fill="#FFD3C4" transform={`rotate(${Math.round((a * 180) / Math.PI)} ${x} ${y})`} />;
          })}
          <circle cx="45" cy="45" r="7" fill="#C9241A" />
        </svg>
      );
    case "fry":
      return (
        <svg viewBox="0 0 24 130" className={className} aria-hidden="true">
          <rect x="2" y="2" width="20" height="126" rx="5" fill="#FFC21A" />
          <rect x="2" y="2" width="20" height="16" rx="5" fill="#E09A0C" />
          <rect x="14" y="24" width="4" height="90" rx="2" fill="#FFDB6E" />
        </svg>
      );
    case "onion":
      return (
        <svg viewBox="0 0 90 90" className={className} aria-hidden="true">
          <circle cx="45" cy="45" r="36" fill="none" stroke="#8E2F6E" strokeWidth="12" />
          <circle cx="45" cy="45" r="27" fill="none" stroke="#F3D6EA" strokeWidth="5" />
        </svg>
      );
    case "cheese":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <path d="M6 10 H74 V58 Q66 70 58 58 Q50 72 40 60 L30 74 Q24 80 20 70 L6 74 Z" fill="#FFC21A" />
        </svg>
      );
    case "sesame":
    default:
      return (
        <svg viewBox="0 0 30 16" className={className} aria-hidden="true">
          <ellipse cx="15" cy="8" rx="13" ry="6.5" fill="#FFF1D2" />
        </svg>
      );
  }
}

// Calcomanía circular con texto girando alrededor.
export function RingSticker({
  ring,
  top,
  bottom,
  className = "",
  ringClassName = "",
  tone = "mustard",
}: {
  ring: string;
  top: string;
  bottom: string;
  className?: string;
  ringClassName?: string;
  tone?: "mustard" | "paper" | "char";
}) {
  const id = "ring" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const bg = tone === "mustard" ? "#FFC21A" : tone === "paper" ? "#F7F6F2" : "#1B110C";
  const ink = tone === "char" ? "#FFC21A" : "#1B110C";
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden="true">
        <circle cx="100" cy="100" r="98" fill={bg} />
      </svg>
      <svg viewBox="0 0 200 200" className={`absolute inset-0 size-full ${ringClassName}`} aria-hidden="true">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fill={ink} fontSize="19" letterSpacing="2" style={{ fontFamily: "var(--font-anton)" }}>
          <textPath href={`#${id}`}>{ring}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-display uppercase leading-[0.9]" style={{ color: ink }}>
        <span className="text-[1.15em]">{top}</span>
        <span className="text-[1.7em]">{bottom}</span>
      </div>
    </div>
  );
}
