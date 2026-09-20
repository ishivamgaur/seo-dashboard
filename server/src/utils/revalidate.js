import { config } from '../config/environment.js';

// Fire-and-forget purge of the frontend cache. Called after content
// mutations so public pages stay static-fast yet update instantly.
// Never throws — a failed webhook must not break the admin response.
export const triggerRevalidate = async () => {
  try {
    const base = (config.clientUrl || '').replace(/\/$/, '');
    const secret = process.env.REVALIDATE_SECRET;
    if (!base || !secret) return;

    await fetch(`${base}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error('Revalidate webhook failed:', err.message);
  }
};
