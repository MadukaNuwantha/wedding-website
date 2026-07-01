type MonogramProps = {
  className?: string;
  /** Diameter in pixels */
  size?: number;
};

/**
 * Elegant "M & M" monogram inside a thin silver ring.
 * Uses currentColor for the ring/text so it can be tinted by the parent.
 */
export default function Monogram({ className = "", size = 88 }: MonogramProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-current ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className="font-script leading-none"
        style={{ fontSize: size * 0.5 }}
      >
        M<span className="px-[0.06em] align-middle" style={{ fontSize: size * 0.34 }}>&amp;</span>M
      </span>
    </span>
  );
}
