/** API base URL. Empty = same-origin (/api) — use Netlify/Vercel proxy or Vite dev proxy. */
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalized}` : normalized;
}

export function adminHeaders(): HeadersInit {
  const key = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("poke-haven-admin-key") : null;
  return key ? { "X-Admin-Key": key } : {};
}

export async function readApiError(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (data.error) return data.error;
  } catch {
    /* ignore */
  }
  return fallback;
}
