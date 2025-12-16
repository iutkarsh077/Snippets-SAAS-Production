export function createBucket(capacity, refillPerSecond) {
  return {
    capacity,
    tokens: capacity,
    refillPerSecond,
    lastRefill: Date.now(),
  };
}

export function Refill(bucket) {
  const now = Date.now();
  const intervalInSec = (now - bucket.lastRefill) / 1000;

  if (intervalInSec > 0) {
    const addTokens = Math.floor(intervalInSec * bucket.refillPerSecond);
    bucket.tokens = Math.min(bucket.capacity, addTokens + bucket.tokens);
    bucket.lastRefill = now;
  }
}

export function TryAndRemove(bucket) {
  Refill(bucket);

  if (bucket.tokens >= 1) {
    bucket.tokens = bucket.tokens - 1;
    return true;
  }
  return false;
}
