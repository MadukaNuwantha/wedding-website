"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/auth-actions";

const inputBase =
  "w-full rounded-xl border border-line bg-white px-4 py-3 font-sans text-base text-ink outline-none transition-colors placeholder:text-silver-deep/60 focus:border-navy focus:ring-2 focus:ring-navy/12";
const labelBase =
  "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy-600";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="card w-full max-w-sm rounded-3xl p-8 sm:p-10">
        <div className="text-center">
          <p className="eyebrow">Private Access</p>
          <h1 className="mt-3 font-serif text-3xl font-light text-navy">
            Dashboard
          </h1>
          <p className="mt-2 font-sans text-sm text-ink/60">
            Please sign in to continue.
          </p>
        </div>

        <form action={action} className="mt-8 space-y-5">
          <div>
            <label htmlFor="username" className={labelBase}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              required
              className={inputBase}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelBase}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputBase}
            />
          </div>

          {state?.error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-center font-sans text-sm text-red-700"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-navy px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ivory shadow-lg shadow-navy/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
