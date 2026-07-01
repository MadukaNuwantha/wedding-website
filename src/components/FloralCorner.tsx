type Corner = "tl" | "tr" | "bl" | "br";

// Leaf placements along the stems: [x, y, rotationDeg, scale]
const LEAVES: Array<[number, number, number, number]> = [
  [12, 72, -22, 0.7],
  [30, 58, -48, 0.95],
  [46, 38, -66, 0.9],
  [55, 18, -82, 0.7],
  [30, 82, 8, 0.85],
  [54, 76, -2, 0.8],
  [76, 66, -10, 0.7],
  [66, 42, -18, 0.8],
  [88, 42, -4, 0.7],
];

function Flower({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          d="M0 0 C 3.2 -5 3.2 -11 0 -14 C -3.2 -11 -3.2 -5 0 0 Z"
          transform={`rotate(${a})`}
        />
      ))}
      <circle r="2.1" />
    </g>
  );
}

// Mirror the base (top-left) artwork into each corner, pointing inward.
const posClass: Record<Corner, string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0 [transform:scaleX(-1)]",
  bl: "bottom-0 left-0 [transform:scaleY(-1)]",
  br: "bottom-0 right-0 [transform:scale(-1,-1)]",
};

export default function FloralCorner({
  corner = "tl",
  className = "",
}: {
  corner?: Corner;
  className?: string;
}) {
  return (
    <svg
      className={`pointer-events-none absolute h-24 w-24 text-silver sm:h-40 sm:w-40 ${posClass[corner]} ${className}`}
      viewBox="0 0 110 110"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      >
        {/* stems */}
        <path d="M3 82 C 28 74 44 54 52 24 C 55 13 59 7 68 3" />
        <path d="M3 82 C 26 86 46 80 74 66" />
        <path d="M52 26 C 62 36 78 42 98 42" />
        {/* leaves */}
        {LEAVES.map(([x, y, r, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
            <path d="M0 0 C 8 -6 19 -6 27 0 C 19 6 8 6 0 0 Z" />
            <path d="M3 0 H 24" />
          </g>
        ))}
        {/* blossoms */}
        <Flower x={68} y={3} s={1} />
        <Flower x={98} y={42} s={0.9} />
        <Flower x={74} y={66} s={0.85} />
      </g>
    </svg>
  );
}
