/* eslint-disable */
// @ts-nocheck
'use client';

// Panels showing the Midnight contract and the Cardano reserve for a period.

import React, { useEffect, useState } from 'react';
import { describeError } from '@/lib/chain/errors';
import { Anchor, Copy, Cpu, KeyRound, Landmark, Loader2, Lock, RefreshCw, ScrollText, ShieldAlert, ShieldCheck, Stamp } from 'lucide-react';

const short = (h: string, a = 8, b = 6) => (h && h.length > a + b + 3 ? `${h.slice(0, a)}...${h.slice(-b)}` : h || '—');
const fmt = (v: bigint | number | null | undefined) => (v === null || v === undefined ? '—' : Number(v).toLocaleString());

export function ModeSwitch({ mode, onChange, t }: any) {
  return (
    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-[10px] font-black uppercase tracking-widest">
      {['local', 'preprod'].map(m => (
        <button
          key={m}
          onClick={() => mode !== m && onChange(m)}
          className={`px-3 py-1.5 rounded-md transition-all ${mode === m ? (m === 'preprod' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white') : 'text-slate-500 hover:text-white'}`}
          title={m === 'local' ? t.modeLocalHint : t.modePreprodHint}
        >
          {m === 'local' ? t.modeLocal : t.modePreprod}
        </button>
      ))}
    </div>
  );
}

function Row({ label, children }: any) {
  return (
    <div className="flex justify-between items-center gap-4 text-xs py-1.5">
      <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{label}</span>
      <span className="text-white font-mono text-right truncate">{children}</span>
    </div>
  );
}

/** Midnight contract status for the period, plus deploy/join (Preprod) and funding. */
export function ContractPanel({ chain, summary, period, periodU, walletConnected, onConnect, onError, canFund, t }: any) {
  const [joinAddress, setJoinAddress] = useState('');
  const [budget, setBudget] = useState(250000);
  const [working, setWorking] = useState('');

  const act = (name: string, fn: () => Promise<any>) => async () => {
    setWorking(name);
    try {
      await fn();
      await chain.refresh();
    } catch (e) {
      onError(describeError(e));
    } finally {
      setWorking('');
    }
  };

  const fund = act('fund', () => chain.backend.fundPeriod(periodU, BigInt(Math.max(0, Math.floor(budget)))));
  const close = act('close', () => chain.backend.closePeriod(periodU));
  // Publishes the rules commitment and shares the rules themselves with the auditor only.
  const publishRules = act('rules', async () => {
    await chain.backend.setSalaryRules();
    const core = await import('@/lib/chain/core');
    await core.postRules(chain.contractAddress, core.employerBook(chain.contractAddress).rules, 'AUDITOR', chain.keystore);
  });
  const Spinner = ({ on }: any) => (working === on ? <Loader2 className="w-3 h-3 animate-spin" /> : null);

  const needsContract = chain.mode === 'preprod' && !chain.backend;

  return (
    <div className="bg-[#111623] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl mt-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-black text-white tracking-tight">{t.midnightContract}</h3>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${chain.mode === 'preprod' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-indigo-300 border-indigo-500/30 bg-indigo-500/10'}`}>
          {chain.mode === 'preprod' ? t.modePreprod : t.modeLocal}
        </span>
      </div>
      <p className="text-slate-500 text-xs mb-5 font-medium">{chain.mode === 'preprod' ? t.modePreprodHint : t.modeLocalHint}</p>

      {chain.mode === 'preprod' && <WalletStatus info={chain.walletInfo} t={t} />}

      {needsContract ? (
        !walletConnected ? (
          <button onClick={onConnect} className="w-full bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 py-3 rounded-xl text-xs font-black uppercase tracking-widest">{t.connectLace}</button>
        ) : (
          <div className="space-y-3">
            <button disabled={chain.busy} onClick={() => chain.deployPreprod().catch(e => onError(describeError(e)))} className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
              {chain.busy && <Loader2 className="w-4 h-4 animate-spin" />} {t.deployContract}
            </button>
            <div className="flex gap-2">
              <input value={joinAddress} onChange={e => setJoinAddress(e.target.value)} placeholder={t.contractAddressPh} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-emerald-500/50" />
              <button disabled={!joinAddress || chain.busy} onClick={() => chain.joinPreprod(joinAddress).catch(e => onError(describeError(e)))} className="bg-white/5 border border-white/10 text-white px-4 rounded-xl text-xs font-black uppercase disabled:opacity-40">{t.joinContract}</button>
            </div>
          </div>
        )
      ) : !chain.ledger ? (
        <div className="flex items-center gap-2 text-slate-500 text-xs"><Loader2 className="w-4 h-4 animate-spin" /> {t.keystoreLoading}</div>
      ) : (
        <div>
          <Row label={t.contractAddress}>
            <button className="inline-flex items-center gap-1 hover:text-indigo-300" onClick={() => navigator.clipboard?.writeText(chain.contractAddress)} title={chain.contractAddress}>
              {short(chain.contractAddress)} <Copy className="w-3 h-3" />
            </button>
          </Row>
          <Row label={`${t.issuedCount} · ${period}`}>{summary.issued}</Row>
          <Row label={t.periodRoot}>{short(summary.root ?? '')}</Row>
          <Row label={t.budgetLabel}>{summary.budget === null ? <span className="text-slate-500">{t.notFunded}</span> : `${fmt(summary.budget)} pTWD`}</Row>
          <Row label={t.rulesLabel}>{summary.rulesPublished ? <span className="text-emerald-400">{t.rulesPublished}</span> : <span className="text-amber-400">{t.rulesMissing}</span>}</Row>
          <Row label={t.closedTotal}>{summary.closedTotal === null ? <span className="text-slate-500">{t.periodOpen}</span> : `${fmt(summary.closedTotal)} pTWD`}</Row>
          <Row label={t.colStatus}>{summary.audited ? <span className="text-emerald-400">{t.audited}</span> : <span className="text-amber-400">{t.notAudited}</span>}</Row>

          {canFund && !summary.rulesPublished && (
            <button disabled={!!working} onClick={publishRules} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
              <Spinner on="rules" /><ScrollText className="w-3.5 h-3.5" /> {t.publishRules}
            </button>
          )}
          {canFund && summary.budget === null && (
            <div className="flex gap-2 mt-4">
              <input type="number" min={0} step={10000} value={budget} onChange={e => setBudget(Number(e.target.value))} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white text-right outline-none focus:border-indigo-500/50" />
              <button disabled={!!working} onClick={fund} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                <Spinner on="fund" /> {t.fundPeriod}
              </button>
            </div>
          )}
          {canFund && summary.issued > 0 && summary.budget !== null && summary.closedTotal === null && (
            <button disabled={!!working} onClick={close} className="w-full mt-4 bg-white/5 border border-indigo-500/30 text-indigo-300 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
              <Spinner on="close" /><Stamp className="w-3.5 h-3.5" /> {t.closePeriod}
            </button>
          )}
          {chain.mode === 'local' && canFund && (
            <button onClick={() => window.confirm(t.resetConfirm) && chain.resetLocal()} className="mt-4 text-[10px] text-slate-600 hover:text-slate-300 font-black uppercase tracking-widest flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> {t.resetLocal}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** The Cardano reserve for the period: lock, anchor the Midnight root, check sync. */
export function ReservePanel({ chain, summary, period, periodU, readOnly, onError, t }: any) {
  const [reserve, setReserve] = useState(null);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [ada, setAda] = useState(10);
  const [working, setWorking] = useState(false);
  const periodNum = Number(periodU);

  const load = async () => {
    if (!chain.contractAddress) return setReserve(null);
    setLoading(true);
    try {
      const cw = await import('@/lib/chain/cardano-wallet');
      setReserve(chain.mode === 'local' ? cw.localReserve.find(chain.contractAddress, periodNum) : await cw.findReserve(chain.contractAddress, periodNum));
    } catch (e) {
      onError?.(describeError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (chain.mode === 'preprod') import('@/lib/chain/cardano-wallet').then(cw => setWallets(cw.cardanoWallets()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain.contractAddress, chain.mode]);

  const act = async (fn: () => Promise<any>) => {
    setWorking(true);
    try {
      await fn();
      // Give the indexer a moment before re-reading the script address.
      if (chain.mode === 'preprod') await new Promise(r => setTimeout(r, 4000));
      await load();
    } catch (e) {
      onError?.(describeError(e));
    } finally {
      setWorking(false);
    }
  };

  const lock = () =>
    act(async () => {
      const cw = await import('@/lib/chain/cardano-wallet');
      const pkh = client?.paymentKeyHash ?? '00'.repeat(28);
      const datum = {
        employer: pkh,
        auditor: pkh, // single-wallet demo; use the auditor's key hash in production
        midnightContract: chain.contractAddress,
        period: periodNum,
        budget: summary.budget ?? 0n,
        payrollRoot: summary.root ?? '',
        payslipCount: summary.issued,
        unlockAfter: Date.now() + 30 * 24 * 3600 * 1000,
      };
      const lovelace = BigInt(Math.round(ada * 1_000_000));
      if (chain.mode === 'local') cw.localReserve.lock(datum, lovelace);
      else await client.lock(datum, lovelace);
    });

  const anchor = () =>
    act(async () => {
      const cw = await import('@/lib/chain/cardano-wallet');
      if (chain.mode === 'local') cw.localReserve.anchor(reserve, summary.root, summary.issued);
      else await client.anchor(reserve, summary.root, summary.issued);
    });

  const connect = (name: string) =>
    act(async () => {
      const cw = await import('@/lib/chain/cardano-wallet');
      setClient(await cw.CardanoReserveClient.connect(name));
    });

  const inSync = reserve && summary.root && reserve.datum.payrollRoot === summary.root;
  const canAnchor = reserve && summary.root && summary.issued > reserve.datum.payslipCount;

  return (
    <div className="bg-[#111623] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl mt-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Landmark className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-black text-white tracking-tight">{t.cardanoReserve} · {period}</h3>
        </div>
        <button onClick={load} className="text-slate-500 hover:text-white" title="Refresh">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}</button>
      </div>
      <p className="text-slate-500 text-xs mb-5 font-medium">{t.cardanoReserveDesc}</p>

      {reserve ? (
        <div>
          <Row label={t.reserveAda}>{(Number(reserve.lovelace) / 1e6).toLocaleString()} {chain.mode === 'local' && <span className="text-slate-500">({t.simulated})</span>}</Row>
          <Row label={t.anchoredRoot}>{short(reserve.datum.payrollRoot)}</Row>
          <Row label={t.issuedCount}>{reserve.datum.payslipCount}</Row>
          <Row label="Tx">{short(reserve.txHash)}</Row>
          <div className={`mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${inSync ? 'text-emerald-400' : 'text-amber-400'}`}>
            {inSync ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {inSync ? t.inSync : t.outOfSync}
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-600 text-xs font-bold uppercase tracking-widest py-3">{loading ? '…' : t.noReserve}</div>
      )}

      {!readOnly && chain.contractAddress && (
        <div className="mt-5 space-y-3">
          {chain.mode === 'preprod' && !client && (
            wallets.length === 0 ? (
              <div className="text-xs text-slate-500">{t.noCardanoWallet}</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {wallets.map(w => (
                  <button key={w.id} onClick={() => connect(w.id)} className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <img src={w.icon} alt="" className="w-4 h-4" /> {w.name}
                  </button>
                ))}
              </div>
            )
          )}
          {client && <div className="text-[10px] text-slate-500 font-mono truncate">{client.address}</div>}

          {!reserve && (chain.mode === 'local' || client) && (
            <div className="flex gap-2">
              <input type="number" min={2} step={1} value={ada} onChange={e => setAda(Number(e.target.value))} className="w-28 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white text-right outline-none" />
              <button disabled={working} onClick={lock} className="flex-1 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
                {working ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />} {t.lockReserve}
              </button>
            </div>
          )}
          {canAnchor && (chain.mode === 'local' || client) && (
            <button disabled={working} onClick={anchor} className="w-full bg-sky-600/10 border border-sky-500/30 text-sky-300 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
              {working ? <Loader2 className="w-3 h-3 animate-spin" /> : <Anchor className="w-3 h-3" />} {t.anchorRoot}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Preprod: derive this role's Midnight key and view key from a CIP-30 wallet
 * signature (lib/chain/wallet-keys.ts), instead of the demo keys in this browser.
 */
export function UnlockKeys({ chain, role, holder, onError, onUnlocked, t }: any) {
  const [wallets, setWallets] = useState([]);
  const [unlocked, setUnlocked] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    import('@/lib/chain/cardano-wallet').then(cw => setWallets(cw.cardanoWallets()));
    import('@/lib/chain/core').then(core => core.hasDerivedSecretKey(role) && setUnlocked(core.toHex(core.publicKeyFor(role))));
  }, [role]);

  const unlock = async (walletId: string) => {
    setBusy(true);
    try {
      const [cw, wk] = await Promise.all([import('@/lib/chain/cardano-wallet'), import('@/lib/chain/wallet-keys')]);
      const pk = await wk.unlockRole(await cw.connectSigner(walletId), role, holder);
      await chain.reloadKeys();
      setUnlocked(pk);
      onUnlocked?.(pk);
    } catch (e) {
      onError(describeError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-[#111623] border border-amber-500/20 p-6 rounded-[2rem] shadow-2xl mt-8">
      <div className="flex items-center gap-3 mb-1">
        <KeyRound className="w-5 h-5 text-amber-400" />
        <h3 className="text-base font-black text-white tracking-tight">{t.unlockTitle}</h3>
      </div>
      {unlocked ? (
        <div className="text-xs text-emerald-400 font-bold flex items-center gap-2 mt-2"><ShieldCheck className="w-4 h-4" /> {t.unlocked} · <span className="font-mono text-slate-400">{short(unlocked)}</span></div>
      ) : (
        <>
          <p className="text-slate-500 text-xs mb-4 font-medium">{t.unlockDesc}</p>
          {wallets.length === 0 ? (
            <div className="text-xs text-slate-500">{t.noCardanoWallet}</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {wallets.map(w => (
                <button key={w.id} disabled={busy} onClick={() => unlock(w.id)} className="bg-white/5 border border-white/10 hover:border-amber-500/40 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <img src={w.icon} alt="" className="w-4 h-4" />} {w.name}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Preprod: DUST (fee) balance and where proofs are generated, with fixes for common blockers. */
export function WalletStatus({ info, t }: any) {
  if (!info) return null;
  const noDust = info.dust <= 0n;
  const localProver = info.proverServerUri && /localhost|127\.0\.0\.1/.test(info.proverServerUri);
  return (
    <div className="mb-5 space-y-2">
      <div className={`rounded-xl border px-4 py-3 text-xs ${noDust ? 'border-amber-500/40 bg-amber-500/10 text-amber-200' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'}`}>
        <div className="font-black uppercase tracking-widest text-[10px] mb-1">DUST · {info.networkId}</div>
        {noDust ? t.noDust : t.dustOk}
      </div>
      {localProver && (
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-xs text-sky-200">
          <div className="font-black uppercase tracking-widest text-[10px] mb-1">{t.proverLabel} · {info.proverServerUri}</div>
          {t.localProverHint}
          <pre className="mt-2 font-mono text-[10px] text-slate-300 bg-black/40 rounded-lg p-2 whitespace-pre-wrap">docker run -p 6300:6300 midnightntwrk/proof-server:8.1.0 midnight-proof-server -v</pre>
        </div>
      )}
    </div>
  );
}
