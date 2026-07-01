import Image from "next/image";

type ArchedPhotoProps = {
  /** Path to an image in /public (e.g. "/couple.jpg"). Omit for a placeholder. */
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
};

/**
 * Cathedral-arch framed photo. Pass `src` when a real photo is ready;
 * otherwise it shows an elegant placeholder. Caller sets size + aspect,
 * e.g. className="w-64 aspect-[3/4]".
 */
export default function ArchedPhoto({
  src,
  alt = "Maduka & Marine",
  label = "Photo coming soon",
  className = "",
}: ArchedPhotoProps) {
  return (
    <div
      className={`photo-arch relative overflow-hidden border border-line bg-gradient-to-br from-navy/10 to-silver-light/50 shadow-[0_28px_60px_-28px_rgba(20,41,75,0.4)] ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 640px) 80vw, 320px" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-silver-deep">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              className="h-8 w-8"
            >
              <rect x="3" y="6" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="12" r="1.6" />
              <path d="M21 17l-5-5L5 20" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 6l1.2-2h3.6L15 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="px-3 text-center font-sans text-[0.62rem] uppercase tracking-[0.18em]">
              {label}
            </span>
          </div>
        </div>
      )}

      {/* Inner hairline echoing the arch */}
      <div className="photo-arch pointer-events-none absolute inset-[10px] border border-white/60" />
    </div>
  );
}
