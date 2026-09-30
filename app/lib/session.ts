import { createCookie } from "react-router";

// Get session secret from environment variables
const getSessionSecret = () => {
  const secret = process.env.SESSION_SECRET;
  // if (!secret && process.env.NODE_ENV === "production") {
  //   throw new Error("SESSION_SECRET must be set in production environment");
  // }
  // In development, use a default secret if not provided (not recommended for production)
  return secret || "emergency-fallback-secret";
};

export const sessionCookie = createCookie("session", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  secrets: [getSessionSecret()],
});


export const languageCookie = createCookie("language", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 year
  secrets: [getSessionSecret()],
});

export async function createAuthSession(data: { accessToken: string }) {
  return sessionCookie.serialize(data);
}

export async function getAccessToken(request: Request) {
  const cookie = request.headers.get("Cookie");
  const session = await sessionCookie.parse(cookie);
  return session?.accessToken;
}

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionCookie.parse(cookie);
}


export async function getSelectedLanguage(request: Request): Promise<string | null> {
  const cookie = request.headers.get("Cookie");
  const language = await languageCookie.parse(cookie);
  return language?.language || null;
}

export async function setSelectedLanguage(language: string) {
  return languageCookie.serialize({ language });
}

/**
 * Check if user is authenticated (has active session)
 */
export async function isAuthenticated(request: Request): Promise<boolean> {
  const token = await getAccessToken(request);
  return !!token;
}

/**
 * Destroy session cookie by setting it to expire immediately
 */
export async function destroySession() {
  return sessionCookie.serialize("", {
    maxAge: 0,
  });
}

