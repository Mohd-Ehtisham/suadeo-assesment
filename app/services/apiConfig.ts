/**
 * Shared API client — a lightweight, client-safe fetch wrapper.
 *
 * Usage:
 *   import { apiRequest } from "~/services/apiConfig";
 *   const data = await apiRequest<MyType>(url, { method: "POST", body: JSON.stringify(payload) });
 */

const DEFAULT_TIMEOUT = 10_000;

export interface ApiRequestOptions extends RequestInit {
  /** Request timeout in ms (default 10 000) */
  timeout?: number;
}

/**
 * Generic JSON fetch helper.
 * - Sets `Accept` and `Content-Type` to JSON by default.
 * - Aborts after `timeout` ms.
 * - Throws on non-2xx responses.
 */
export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, headers, ...rest } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
      ...rest,
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status}).`);
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}
