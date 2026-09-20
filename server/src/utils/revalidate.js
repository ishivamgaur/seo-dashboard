import { config } from '../config/environment.js';

// Fire-and-forget purge of the frontend cache. Accepts the exact cache
// tags affected by the mutation so unrelated pages keep serving from
// cache. Never throws — a failed webhook must not break admin response.
export const triggerRevalidate = async (tags = ['site']) => {
  try {
    const base = (config.clientUrl || '').replace(/\/$/, '');
    const secret = process.env.REVALIDATE_SECRET;
    if (!base || !secret) return;

    const res = await fetch(`${base}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, tags }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) console.log(`Revalidated frontend tags: ${tags.join(', ')}`);
    else console.error(`Revalidate webhook rejected: ${res.status}`);
  } catch (err) {
    console.error('Revalidate webhook failed:', err.message);
  }
};
