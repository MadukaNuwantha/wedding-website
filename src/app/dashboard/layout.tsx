import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import LoginForm from "./login-form";
import DashboardShell from "./dashboard-shell";

// Read the session cookie fresh on every request.
export const dynamic = "force-dynamic";

// Keep the dashboard out of search engines and previews — it's private.
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Unauthenticated visitors see the login form in place — there is no
  // separate /login route to discover, and nothing links here. When the
  // layout renders the login form instead of {children}, the child page's
  // server code never runs, so no protected data is fetched.
  if (!session) {
    return (
      <div className="min-h-dvh bg-tint">
        <LoginForm />
      </div>
    );
  }

  return <DashboardShell username={session.username}>{children}</DashboardShell>;
}
