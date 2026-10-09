// Readable error text for the UI. DApp Connector errors (Lace) carry the real
// cause in `code` / `reason` while `message` is often just "Error", and
// Midnight.js wraps failures in `cause` chains.

type Described = { message?: string; type?: string; code?: string; reason?: string; cause?: unknown };

const HINTS: Record<string, string> = {
  Rejected: 'The request was rejected in Lace.',
  PermissionRejected: 'Lace did not grant permission for this action.',
  Disconnected: 'Lace disconnected. Reconnect the wallet and try again.',
};

export function describeError(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;
  for (let depth = 0; current && depth < 6; depth++) {
    if (typeof current !== 'object') {
      parts.push(String(current));
      break;
    }
    const e = current as Described;
    if (e.type === 'DAppConnectorAPIError' || e.code) {
      parts.push([e.code && `Lace ${e.code}`, e.reason, e.code && HINTS[e.code]].filter(Boolean).join(': '));
    } else if (e.message && e.message !== 'Error') {
      parts.push(e.message);
    }
    current = e.cause;
  }
  const text = [...new Set(parts.filter(Boolean))].join(' ← ');
  // Keep the full object in the console for debugging.
  console.error('[payroll]', error);
  return text || (error instanceof Error ? `${error.name}: ${error.message}` : String(error));
}
