import { redirect, data } from "react-router";
import { useState } from "react";

import { isAuthenticated, createAuthSession } from "~/lib/session";
import type { Route } from "./+types/login";

export function meta() {
  return [
    { title: "Login — Employee records" },
    { name: "description", content: "Sign in to access employee records." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  if (await isAuthenticated(request)) {
    throw redirect("/");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const validEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const validPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const token = process.env.AUTH_TOKEN ?? "dummy-jwt-token";

  if (email !== validEmail || password !== validPassword) {
    return data({ error: "Invalid email or password." }, { status: 401 });
  }

  const cookie = await createAuthSession({ accessToken: token });

  throw redirect("/", {
    headers: { "Set-Cookie": cookie },
  });
}

export default function Login({ actionData }: Route.ComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const error = actionData?.error;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter your credentials to access the dashboard.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
          >
            {error}
          </p>
        )}

        <form method="post" className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-950"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-16 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-950"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded px-2 py-0.5 text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
