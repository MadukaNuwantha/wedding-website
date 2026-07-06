"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/lib/auth-actions";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  soon?: boolean;
};

const NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    href: "/dashboard/custom-url",
    label: "Custom URL",
    icon: (
      <>
        <path d="M9 15l6-6" strokeLinecap="round" />
        <path d="M11 6.5 12.5 5a3.5 3.5 0 0 1 5 5L16 11.5" strokeLinecap="round" />
        <path d="M13 17.5 11.5 19a3.5 3.5 0 0 1-5-5L8 12.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    href: "/dashboard/rsvps",
    label: "RSVP List",
    icon: (
      <>
        <path d="M8 6h11M8 12h11M8 18h11" strokeLinecap="round" />
        <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeLinecap="round" />
      </>
    ),
  },
  {
    href: "/dashboard/invitations",
    label: "Invitation Create",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-sans text-sm font-medium transition-colors ${
        active
          ? "bg-navy text-ivory"
          : "text-ink/70 hover:bg-white hover:text-navy"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-[18px] w-[18px] shrink-0"
      >
        {item.icon}
      </svg>
      <span className="truncate">{item.label}</span>
      {item.soon && (
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${
            active ? "bg-ivory/20 text-ivory" : "bg-tint text-silver-deep"
          }`}
        >
          Soon
        </span>
      )}
    </Link>
  );
}

export default function DashboardShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const [menuOpen, setMenuOpen] = useState(false);
  const activeItem = NAV.find((item) => isActive(item.href));

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Position the drawer directly below the header (whatever its height is).
  const headerRef = useRef<HTMLElement>(null);
  const [headerH, setHeaderH] = useState(56);
  useEffect(() => {
    const measure = () => setHeaderH(headerRef.current?.offsetHeight ?? 56);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="min-h-dvh bg-tint">
      {/* Sticky header (+ mobile dropdown) */}
      <div className="sticky top-0 z-30">
        <header
          ref={headerRef}
          className="flex items-center justify-between gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-3.5"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="-ml-1 rounded-lg p-2 text-navy transition-colors hover:bg-tint md:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
            <div className="min-w-0">
              <p className="eyebrow">Maduka &amp; Marine</p>
              <p className="truncate font-serif text-lg font-light leading-tight text-navy">
                {/* Current section on mobile; "Admin" on desktop */}
                <span className="md:hidden">{activeItem?.label ?? "Admin"}</span>
                <span className="hidden md:inline">Admin</span>
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <span className="font-sans text-sm text-ink/60">
              Signed in as{" "}
              <span className="font-semibold text-navy">{username}</span>
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-navy px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy transition-colors hover:bg-navy hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              >
                Sign Out
              </button>
            </form>
          </div>
        </header>

      </div>

      {/* Mobile side drawer (opens from the left, below the header) */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="animate-fade-in fixed inset-0 z-20 bg-navy-deep/30 md:hidden"
          />
          <nav
            style={{ top: headerH }}
            className="animate-slide-in-left fixed bottom-0 left-0 z-30 flex w-72 max-w-[82%] flex-col overflow-y-auto border-r border-line bg-white px-3 py-4 shadow-2xl md:hidden"
          >
            <div className="space-y-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                />
              ))}
            </div>
            <div className="mt-auto border-t border-line pt-3">
              <p className="px-3.5 pb-2 font-sans text-xs text-ink/50">
                Signed in as{" "}
                <span className="font-semibold text-navy">{username}</span>
              </p>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full rounded-xl border border-navy px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy transition-colors hover:bg-navy hover:text-ivory"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </nav>
        </>
      )}

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 space-y-1.5">
            {NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(item.href)}
              />
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
