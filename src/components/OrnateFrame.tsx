function Filigree({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      className={`absolute h-7 w-7 sm:h-9 sm:w-9 ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M2 20 C 2 8 8 2 20 2" />
        <path d="M8 20 C 8 12 12 8 20 8" />
        <path d="M2 2 C 11 2 13 6 13 13" />
        <circle cx="20" cy="2" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="2" cy="20" r="1.1" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/**
 * Decorative double-line frame with filigree corner flourishes.
 * Inherits color from the parent's text color (use e.g. text-silver-light).
 */
export default function OrnateFrame({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-5 sm:inset-7 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 border border-current opacity-50" />
      <div className="absolute inset-[6px] border border-current opacity-25" />

      <Filigree className="left-[-4px] top-[-4px]" />
      <Filigree className="right-[-4px] top-[-4px] [transform:scaleX(-1)]" />
      <Filigree className="left-[-4px] bottom-[-4px] [transform:scaleY(-1)]" />
      <Filigree className="right-[-4px] bottom-[-4px] [transform:scale(-1,-1)]" />
    </div>
  );
}
