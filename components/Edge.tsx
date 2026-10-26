import { useId } from "react";

type EdgeProps = {
  shape: "scallop" | "zigzag";
  side: "top" | "bottom";
  size?: number;
  color?: string;
  className?: string;
};

// Borde troquelado (festón o zigzag) como relleno sólido, pegado al lado de una pieza de papel.
export default function Edge({ shape, side, size = 14, color = "currentColor", className = "" }: EdgeProps) {
  const id = "edge" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const w = size * 2;
  const h = size;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute left-0 block w-full ${side === "top" ? "bottom-full" : "top-full rotate-180"} ${className}`}
      height={h}
    >
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          {shape === "scallop" ? (
            <circle cx={size} cy={h} r={size} fill={color} />
          ) : (
            <polygon points={`0,${h} ${size},0 ${w},${h}`} fill={color} />
          )}
        </pattern>
      </defs>
      <rect width="100%" height={h + 1} fill={`url(#${id})`} />
    </svg>
  );
}
