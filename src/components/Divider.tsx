type DividerProps = {
  className?: string;
  /** Tint of the center diamond + lines. Defaults to silver. */
  tone?: "silver" | "navy" | "light";
};

/**
 * Ornamental divider: two silver rules flanking a small rotated diamond.
 */
export default function Divider({ className = "", tone = "silver" }: DividerProps) {
  const color =
    tone === "navy"
      ? "text-navy"
      : tone === "light"
        ? "text-silver-light"
        : "text-silver";

  return (
    <div
      className={`flex items-center justify-center gap-4 ${color} ${className}`}
      aria-hidden="true"
    >
      <span className="silver-rule w-16 sm:w-24" />
      <span className="flex items-center gap-2">
        <span className="inline-block h-1 w-1 rounded-full bg-current" />
        <span className="inline-block h-2.5 w-2.5 rotate-45 border border-current" />
        <span className="inline-block h-1 w-1 rounded-full bg-current" />
      </span>
      <span className="silver-rule w-16 sm:w-24" />
    </div>
  );
}
