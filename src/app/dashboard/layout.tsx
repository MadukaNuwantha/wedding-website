import type { Metadata } from "next";

// Keep the dashboard out of search engines and previews — it's private.
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-tint">{children}</div>;
}
