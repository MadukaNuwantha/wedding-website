// White-flower + silver botanical garland, echoing the inspiration's greenery.

const LEAVES: Array<[number, number, number, number]> = [
  // x, y, rotationDeg, scale  (one half-spray, extending left from centre)
  [-22, 21, 202, 0.8],
  [-48, 18, 206, 0.9],
  [-74, 23, 196, 0.85],
  [-98, 20, 210, 0.7],
  [-120, 27, 200, 0.7],
  [-38, 28, 150, 0.7],
  [-66, 32, 150, 0.7],
  [-92, 33, 150, 0.6],
];

function Bloom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          d="M0 0 C 3.4 -5 3.4 -11 0 -13.5 C -3.4 -11 -3.4 -5 0 0 Z"
          transform={`rotate(${a})`}
          fill="#ffffff"
        />
      ))}
      <circle r="2.4" fill="#ffffff" />
    </g>
  );
}

function HalfSpray() {
  return (
    <g>
      <path d="M-4 20 C -34 15 -70 24 -104 21 C -122 20 -136 27 -147 38" />
      {LEAVES.map(([x, y, r, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d="M0 0 C 8 -6 18 -6 25 0 C 18 6 8 6 0 0 Z" />
          <path d="M3 0 H 22" />
        </g>
      ))}
      <Bloom x={-120} y={17} s={0.7} />
    </g>
  );
}

export default function Garland({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`text-silver ${className}`}
      viewBox="-150 -12 300 66"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <HalfSpray />
        <g transform="scale(-1,1)">
          <HalfSpray />
        </g>
        <Bloom x={0} y={8} s={1.15} />
        <Bloom x={-16} y={14} s={0.8} />
        <Bloom x={16} y={14} s={0.8} />
        <Bloom x={-7} y={3} s={0.7} />
        <Bloom x={8} y={4} s={0.7} />
      </g>
    </svg>
  );
}
