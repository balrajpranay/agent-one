/**
 * Upstash Redis Cache Client for Sub-Millisecond Document Query Acceleration
 */

const REDIS_URL = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || '';

// Parse Upstash REST Endpoint from Redis URL
function getUpstashRestConfig() {
  try {
    if (!REDIS_URL) {
      return { endpoint: '', token: '' };
    }
    const url = new URL(REDIS_URL);
    const host = url.hostname;
    const token = url.password || process.env.UPSTASH_REDIS_REST_TOKEN || '';
    return {
      endpoint: `https://${host}`,
      token
    };
  } catch {
    return {
      endpoint: process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
    };
  }
}

/**
 * Get cached value from Redis
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const { endpoint, token } = getUpstashRestConfig();
    if (!endpoint || !token) return null;

    const cleanKey = encodeURIComponent(key);

    const response = await fetch(`${endpoint}/get/${cleanKey}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 0 }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result) {
        try {
          return JSON.parse(data.result) as T;
        } catch {
          return data.result as T;
        }
      }
    }
  } catch (err) {
    console.warn('Redis cache get notice:', err);
  }

  return null;
}

/**
 * Set value in Redis cache with TTL in seconds (default 1 hour)
 */
export async function setInCache(key: string, value: unknown, ttlSeconds = 3600): Promise<boolean> {
  try {
    const { endpoint, token } = getUpstashRestConfig();
    if (!endpoint || !token) return false;

    const cleanKey = encodeURIComponent(key);
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);

    const response = await fetch(`${endpoint}/set/${cleanKey}?ex=${ttlSeconds}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain'
      },
      body: serialized
    });

    return response.ok;
  } catch (err) {
    console.warn('Redis cache set notice:', err);
    return false;
  }
}
