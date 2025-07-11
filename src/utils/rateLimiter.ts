const rateLimitWindowMs = 60 * 1000; // 1 minute
const rateLimitMap: Map<string, number[]> = new Map();

export function isRateLimited(to: string): boolean {
  const now = Date.now();
  const windowStart = now - rateLimitWindowMs;

  const timestamps = rateLimitMap.get(to) || [];
  const recent = timestamps.filter(t => t > windowStart);
  recent.push(now);
  rateLimitMap.set(to, recent);

  return recent.length > 5; 
}
