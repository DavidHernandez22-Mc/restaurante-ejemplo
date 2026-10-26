// Estrella de ocho puntas usada como separador en las cintas y en las calcomanías.
export default function Burst({ className = "", size = 28 }: { className?: string; size?: number }) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? 50 : 22;
    const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={className}>
      <polygon points={pts.join(" ")} fill="currentColor" />
    </svg>
  );
}
