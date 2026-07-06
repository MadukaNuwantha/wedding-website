import { getSession } from "@/lib/session";
import { logout } from "@/lib/auth-actions";
import { listGuests } from "@/lib/guests";
import LoginForm from "./login-form";
import GuestManager from "./guest-manager";

// Always render per-request so the session cookie is read fresh.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();

  // Unauthenticated visitors see the login form in place — there is no
  // separate /login route to discover, and nothing links here.
  if (!session) {
    return <LoginForm />;
  }

  const guests = await listGuests();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow">Maduka &amp; Marine</p>
          <h1 className="mt-1 font-serif text-3xl font-light text-navy">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-sans text-sm text-ink/60">
            Signed in as{" "}
            <span className="font-semibold text-navy">{session.username}</span>
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-navy px-5 py-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy transition-colors hover:bg-navy hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="mt-10">
        <GuestManager guests={guests} />
      </main>
    </div>
  );
}
