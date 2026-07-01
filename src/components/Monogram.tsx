type MonogramProps = {
  className?: string;
  /** Rendered width & height in pixels */
  size?: number;
};

/**
 * MM monogram logo (public/name-logo.png). The PNG is gold, but we recolor it
 * to the current text color via a CSS mask, so it matches the navy/silver
 * theme wherever it's used (set the colour with a `text-*` class on a parent
 * or via `className`).
 */
export default function Monogram({ className = "", size = 92 }: MonogramProps) {
  return (
    <span
      className={`inline-block bg-current ${className}`}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: "url(/name-logo.png)",
        maskImage: "url(/name-logo.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
      aria-hidden="true"
    />
  );
}
