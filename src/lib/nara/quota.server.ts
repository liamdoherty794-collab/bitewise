import { getRequest } from "@tanstack/react-start/server";

const memory = new Map<string, number>();

type Gate =
  | { ok: true }
  | { ok: false; kind: "paused" | "unavailable"; error: string };

/** IP limit, then the global Gemini budget. Neither is refunded. */
export async function reserveMealCall(countsGemini: boolean): Promise<Gate> {
  try {
    const network = await reserveSlot(`bitewise:web:ip:${await hashIp(clientIp())}:${utcDay()}`, ipDailyLimit());
    if (!network.allowed) {
      return {
        ok: false,
        kind: "paused",
        error: "Too many meal photos from this network today. Try again tomorrow, or type the meal.",
      };
    }
    if (!countsGemini) return { ok: true };
    const budget = await reserveSlot(`bitewise:web:gemini:${utcDay()}`, geminiDailyCap());
    if (!budget.allowed) {
      return {
        ok: false,
        kind: "paused",
        error: "Meal photos are paused until tomorrow. Too many were read today. Barcodes and typed meals still work.",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      kind: "unavailable",
      error: "Meal photos are not configured on the server. Type the meal instead.",
    };
  }
}

function utcDay() {
  return new Date().toISOString().slice(0, 10);
}

function geminiDailyCap() {
  return intEnv("GEMINI_DAILY_CAP", 200);
}

function ipDailyLimit() {
  return intEnv("PHOTO_IP_DAILY_LIMIT", 30);
}

function intEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (raw == null || raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 1_000_000) return fallback;
  return n;
}

async function reserveSlot(key: string, max: number) {
  if (max <= 0) return { allowed: false, count: 0 };
  const count = await incr(key);
  if (count > max) {
    await decr(key);
    return { allowed: false, count: max };
  }
  await expire(key, 60 * 60 * 48);
  return { allowed: true, count };
}

function clientIp() {
  let request: Request | undefined;
  try {
    request = getRequest();
  } catch {
    return "unknown";
  }
  if (!request) return "unknown";
  const real = request.headers.get("x-real-ip")?.trim();
  if (real && isIp(real)) return real;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded && isIp(forwarded)) return forwarded;
  return "unknown";
}

function isIp(value: string) {
  return value.length <= 64 && /^[0-9a-fA-F:.]+$/.test(value);
}

async function hashIp(ip: string) {
  const salt = process.env.RATE_LIMIT_SALT || "bitewise";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

async function incr(key: string) {
  return mutate(key, 1);
}

async function decr(key: string) {
  return mutate(key, -1);
}

async function mutate(key: string, delta: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.VERCEL) throw new Error("limits");
    const next = Math.max(0, (memory.get(key) ?? 0) + delta);
    memory.set(key, next);
    return next;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([delta > 0 ? "INCR" : "DECR", key]),
  });
  if (!res.ok) throw new Error("limits");
  const body = (await res.json()) as { result?: unknown };
  const count = typeof body.result === "number" ? body.result : Number(body.result);
  if (!Number.isFinite(count)) throw new Error("limits");
  return count;
}

async function expire(key: string, seconds: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;
  await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["EXPIRE", key, String(seconds)]),
  });
}
