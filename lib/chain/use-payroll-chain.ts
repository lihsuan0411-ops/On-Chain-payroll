'use client';

// React state for the payroll contract: picks the local simulator or Preprod,
// keeps a fresh copy of the public ledger, and exposes the derived views.
// Chain modules are imported lazily so their WASM never loads during SSR.

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { loadKeystore, type Keystore } from '../privacy';
import type { ChainMode, Ledger, PayrollBackend, PayslipView } from './core';

const MODE_KEY = 'payrollChainMode';
const PREPROD_CONTRACT_KEY = 'payrollPreprodContract.v1';
export const AUDITOR_HOLDER = 'AUDITOR';

const readMode = (): ChainMode => {
  try {
    return localStorage.getItem(MODE_KEY) === 'preprod' ? 'preprod' : 'local';
  } catch {
    return 'local';
  }
};

export function usePayrollChain(employeeIds: string[]) {
  const [mode, setModeState] = useState<ChainMode>('local');
  const [backend, setBackend] = useState<PayrollBackend | null>(null);
  const [ledger, setLedger] = useState<Ledger | null>(null);
  const [keystore, setKeystore] = useState<Keystore | null>(null);
  const [midnightApi, setMidnightApi] = useState<ConnectedAPI | null>(null);
  const [shieldedAddress, setShieldedAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ids = employeeIds.join(',');

  useEffect(() => {
    setModeState(readMode());
    loadKeystore([...ids.split(','), AUDITOR_HOLDER]).then(setKeystore);
    try {
      localStorage.removeItem('payrollLedger.v2'); // pre-Midnight ledger
    } catch {}
  }, [ids]);

  const refresh = useCallback(async (b: PayrollBackend | null = backend) => {
    if (!b) return;
    try {
      setLedger(await b.readLedger());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [backend]);

  // Local mode: open the in-browser contract right away.
  useEffect(() => {
    setBackend(null);
    setLedger(null);
    if (mode !== 'local') return;
    let cancelled = false;
    import('./backend-local').then(({ LocalPayrollBackend }) => {
      if (cancelled) return;
      const b = LocalPayrollBackend.open();
      setBackend(b);
      refresh(b);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Preprod: poll the indexer so other parties' transactions show up.
  useEffect(() => {
    if (mode !== 'preprod' || !backend) return;
    const t = setInterval(() => refresh(), 15_000);
    return () => clearInterval(t);
  }, [mode, backend, refresh]);

  const setMode = (m: ChainMode) => {
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {}
    setMidnightApi(null);
    setShieldedAddress('');
    setModeState(m);
  };

  /** Connects Lace and joins the configured contract, if any. Returns the shielded address. */
  const connectMidnight = async () => {
    const { connectMidnightWallet, PreprodPayrollBackend } = await import('./backend-preprod');
    const api = await connectMidnightWallet();
    const { shieldedAddress: addr } = await api.getShieldedAddresses();
    setMidnightApi(api);
    setShieldedAddress(addr);
    const address = process.env.NEXT_PUBLIC_PAYROLL_CONTRACT || localStorage.getItem(PREPROD_CONTRACT_KEY);
    if (address) {
      const b = await PreprodPayrollBackend.join(api, address);
      setBackend(b);
      await refresh(b);
    }
    return addr;
  };

  const run = async <T,>(fn: () => Promise<T>): Promise<T> => {
    setBusy(true);
    try {
      return await fn();
    } finally {
      setBusy(false);
    }
  };

  const deployPreprod = () =>
    run(async () => {
      if (!midnightApi) throw new Error('Connect Lace first');
      const { PreprodPayrollBackend } = await import('./backend-preprod');
      const b = await PreprodPayrollBackend.deploy(midnightApi);
      localStorage.setItem(PREPROD_CONTRACT_KEY, b.contractAddress);
      setBackend(b);
      await refresh(b);
      return b.contractAddress;
    });

  const joinPreprod = (address: string) =>
    run(async () => {
      if (!midnightApi) throw new Error('Connect Lace first');
      const { PreprodPayrollBackend } = await import('./backend-preprod');
      const b = await PreprodPayrollBackend.join(midnightApi, address.trim());
      localStorage.setItem(PREPROD_CONTRACT_KEY, b.contractAddress);
      setBackend(b);
      await refresh(b);
    });

  const resetLocal = async () => {
    const { LocalPayrollBackend } = await import('./backend-local');
    LocalPayrollBackend.reset();
    const b = LocalPayrollBackend.deploy();
    setBackend(b);
    await refresh(b);
  };

  const [views, setViews] = useState<PayslipView[]>([]);
  useEffect(() => {
    if (!ledger) {
      setViews([]);
      return;
    }
    import('./core').then(core => setViews(core.payslipViews(ledger, ids.split(','))));
  }, [ledger, ids]);

  return useMemo(
    () => ({
      mode,
      setMode,
      backend,
      ledger,
      views,
      keystore,
      busy,
      error,
      midnightApi,
      shieldedAddress,
      contractAddress: backend?.contractAddress ?? '',
      refresh: () => refresh(),
      run,
      connectMidnight,
      deployPreprod,
      joinPreprod,
      resetLocal,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, backend, ledger, views, keystore, busy, error, midnightApi, shieldedAddress],
  );
}
