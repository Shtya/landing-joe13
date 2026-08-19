const store = new Map();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3;

export function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip;

  // Clean expired entries
  for (const [k, v] of store.entries()) {
    if (now - v.windowStart > WINDOW_MS) {
      store.delete(k);
    }
  }

  const record = store.get(key);

  if (!record) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (now - record.windowStart > WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - record.windowStart)) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}
