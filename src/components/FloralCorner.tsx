type Corner = "tl" | "tr" | "bl" | "br";

const PETALS = [0, 72, 144, 216, 288];

/** Five-petal blossom; layers=2 adds an inner ring for a fuller bloom. */
function Flower({
  x,
  y,
  s = 1,
  layers = 1,
}: {
  x: number;
  y: number;
  s?: number;
  layers?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {PETALS.map((a) => (
        <path
          key={a}
          d="M0 0 C 3.6 -5 3.6 -11 0 -14 C -3.6 -11 -3.6 -5 0 0 Z"
          transform={`rotate(${a})`}
        />
      ))}
      {layers > 1 &&
        PETALS.map((a) => (
          <path
            key={`i${a}`}
            d="M0 0 C 2.2 -3.2 2.2 -7 0 -9 C -2.2 -7 -2.2 -3.2 0 0 Z"
            transform={`rotate(${a + 36})`}
          />
        ))}
      <circle r="1.7" fill="currentColor" stroke="none" />
    </g>
  );
}

function Leaf({ x, y, rot, s = 1 }: { x: number; y: number; rot: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 C 6 -5 15 -5 22 0 C 15 5 6 5 0 0 Z" />
      <path d="M4 0 H 19" />
    </g>
  );
}

/** Slender stem with tiny leaves for filler. */
function Sprig({ x, y, rot, s = 1 }: { x: number; y: number; rot: number; s?: number }) {
  const tiny: Array<[number, number, number]> = [
    [8, -1, -42],
    [14, -3, -40],
    [20, -5, -36],
    [11, 0, 44],
    [17, -2, 46],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 C 8 -1 16 -3 26 -6" />
      {tiny.map(([lx, ly, lr], i) => (
        <path
          key={i}
          d="M0 0 C 2 -2.4 6 -2.4 8 0 C 6 2.4 2 2.4 0 0 Z"
          transform={`translate(${lx} ${ly}) rotate(${lr}) scale(0.85)`}
        />
      ))}
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
      className={`pointer-events-none absolute h-24 w-24 text-silver sm:h-44 sm:w-44 ${posClass[corner]} ${className}`}
      viewBox="0 0 130 130"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* stems along the two edges */}
        <path d="M6 12 C 34 8 62 12 94 15" opacity="0.65" />
        <path d="M12 6 C 8 34 12 62 15 94" opacity="0.65" />

        {/* filler sprigs */}
        <Sprig x={52} y={26} rot={26} s={0.9} />
        <Sprig x={26} y={52} rot={64} s={0.9} />
        <Sprig x={86} y={20} rot={16} s={0.6} />
        <Sprig x={20} y={86} rot={70} s={0.6} />

        {/* leaves */}
        <Leaf x={46} y={12} rot={20} s={0.7} />
        <Leaf x={70} y={15} rot={12} s={0.6} />
        <Leaf x={12} y={46} rot={74} s={0.7} />
        <Leaf x={15} y={70} rot={82} s={0.6} />
        <Leaf x={44} y={42} rot={-38} s={0.65} />

        {/* blossoms */}
        <Flower x={30} y={30} s={1.2} layers={2} />
        <Flower x={60} y={18} s={0.75} />
        <Flower x={18} y={60} s={0.75} />
        <Flower x={84} y={15} s={0.5} />
        <Flower x={15} y={84} s={0.5} />
      </g>
    </svg>
  );
}
