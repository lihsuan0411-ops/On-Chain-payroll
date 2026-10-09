/* eslint-disable */
// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Wallet, Building2, User, ChevronRight, CheckCircle, 
  Activity, FileText, Server, Eye, Download, 
  Loader2, X, ChevronLeft, LogOut, LogIn, Hexagon, BadgeCheck, FileSearch, Database, LockKeyhole, Landmark,
  Lock, ShieldAlert, ShieldCheck, Stamp
} from 'lucide-react';
import { usePayrollChain, AUDITOR_HOLDER } from '@/lib/chain/use-payroll-chain';
import { ModeSwitch, ContractPanel, ReservePanel, UnlockKeys } from './chain-panels';
import { DEMO_SALARY_BANDS, LEVEL_NAMES } from '@/contracts/midnight/src/payroll-math';

type UserRole = 'landing' | 'employer' | 'employee' | 'auditor';
type WalletType = 'metamask' | 'eternl' | 'lace' | '';
type Lang = 'en' | 'zh';

// Demo org chart: one employee per salary level (bands in contracts/midnight/src/payroll-math.ts).
const EMPLOYEES = [
  { id: "Aden", name: "Aden", title: "Operation Intern", level: 1, address: "0x9E3...4A21", base: 40000, allowance: 2000 },
  { id: "Chloe", name: "Chloe", title: "Product Designer", level: 2, address: "0x5D8...0B37", base: 52000, allowance: 3000 },
  { id: "Alice", name: "Alice", title: "Senior Dev", level: 3, address: "0x71C...976F", base: 75000, allowance: 5000 },
  { id: "Bob", name: "Bob", title: "Product Lead", level: 4, address: "0x3B2...1A9E", base: 90000, allowance: 8000 },
  { id: "David", name: "David", title: "CFO", level: 5, address: "0xA41...7C2D", base: 150000, allowance: 15000 },
];
const EMPLOYEE_IDS = EMPLOYEES.map(e => e.id);

const AUDITOR_ADDRESS = "0xAUDIT...4242";
const PERIOD = "2026-05";
const PERIOD_U = 202605n;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const shortHash = (h: string) => h ? `${h.slice(0, 10)}...${h.slice(-6)}` : '';
const fmt = (v: bigint | number) => Number(v).toLocaleString();
const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));
// Chain modules load WASM, so they are only imported on the client when needed.
const chainCore = () => import('@/lib/chain/core');

const T = {
  en: {
    navTitle: "On-Chain Payroll",
    connect: "Connect Wallet",
    langToggle: "繁中",
    comingSoon: "Coming Soon",
    bankApi: "Bank API (Loan / Audit)",
    govCpaApi: "Gov / CPA API (Tax / Audit)",
    web3Standard: "Web3 Standard",
    titlePrefix: "Enterprise-Grade",
    titleSuffix: "On-Chain Payroll",
    desc: "Empower your organization with secure, compliant, and confidential salary distribution. Experience the future of Web3 human resources.",
    empPortal: "Employer Portal",
    empPortalDesc: "Manage compensation and execute secure payouts.",
    launch: "Launch Dashboard",
    employeePortal: "Employee Portal",
    employeePortalDesc: "Securely log in to claim salary and download official payslips.",
    claimVerify: "Claim & Verify",
    auditorPortal: "Auditor Portal",
    auditorPortalDesc: "Inspect compliance logs and export audit reports.",
    accessLogs: "Access Logs",
    employerTitle: "Private Payroll Disbursement",
    connectEmp: "Connect Enterprise Wallet",
    selectEmp: "1. Select Employee",
    currentPeriod: "2. Current Period (Locked)",
    base: "Base Salary (TWD)",
    allowance: "Allowance",
    bonus: "Discretionary Bonus",
    labor: "Labor Insurance",
    health: "Health Insurance",
    tax: "Income Tax",
    net: "Total Net Pay",
    signSettle: "Sign & Settle",
    encrypting: "Encrypting Data...",
    proving: "Generating ZK Proof...",
    relaying: "Relaying to Network...",
    settling: "Settling Funds...",
    complete: "Disbursement Complete",
    sysAlert: "System Alert",
    dupAlert: "salary for this period has already been claimed.",
    dismiss: "Dismiss",
    added: "Disbursement Successful!",
    updated: "Record Updated!",
    done: "Done",
    employeeTitle: "Employee Portal Access",
    accId: "Account ID",
    pwd: "Password",
    signIn: "Sign In",
    walletReq: "Wallet ID Required",
    walletReqDesc: "Please connect your personal wallet to verify identity and unlock your salary claim portal.",
    connectStd: "Connect Standard Wallet",
    welcome: "Welcome",
    dashboard: "Compensation Dashboard",
    logout: "Secure Logout",
    empty: "No pending salary disbursements found.",
    compProof: "Compensation",
    ready: "Ready to Claim",
    disbursed: "Signed",
    review: "Review",
    payslip: "Payslip",
    verified: "Verified Digital Payslip",
    claimed: "Receipt Signed on Midnight",
    processing: "Processing...",
    withdraw: "Claim & Sign Receipt",
    download: "Download PDF",
    claimConfirmed: "Claim Confirmed!",
    claimDesc: "Your claim was proven on Midnight with your private key. The amounts never left your device. You can download the verifiable payslip from the dashboard.",
    returnDash: "Return to Dashboard",
    auditTitle: "Compliance & Audit Portal",
    auditSub: "Real-time monitoring of on-chain disbursements.",
    exportCsv: "Export CSV Log",
    auditReq: "Auditor Authentication Required",
    auditReqDesc: "Connect your auditor wallet. Your key is checked against the auditor registered in the Midnight payroll contract.",
    connectAudit: "Connect Auditor Wallet",
    verifyingId: "Verifying Identity...",
    verifyingDesc: "Checking the auditor key in the Midnight contract...",
    accessGranted: "Access Granted",
    emptyLedger: "No transaction records found on the ledger.",
    colEmp: "Employee",
    colPeriod: "Period",
    colNet: "Net Payout",
    colStatus: "Status",
    colAction: "Action",
    inspect: "Inspect",
    cryptoProof: "Cryptographic Proof",
    verifiedZk: "Verified ZK-Rollup Transaction",
    empId: "Employee Identifier",
    disbPeriod: "Disbursement Period",
    closeIns: "Close Inspector",
    netSettled: "Net Settled",
    selectAccount: "Select Account...",
    periodLabel: "Period",
    immutableNote: "Figures stay private: Midnight stores only the commitment, and the ZK proof shows the deductions are correct.",
    statusPending: "Pending",
    statusClaimed: "Claimed",
    accountNotFound: "Account not found. Try Aden, Alice or Bob.",
    decrypting: "Decrypting...",
    decryptFailed: "Unable to decrypt",
    commitment: "On-Chain Commitment",
    commitmentOk: "Commitment matches decrypted figures",
    commitmentBad: "Commitment mismatch: figures may have been tampered with",
    publicLedger: "Public Ledger View",
    publicLedgerDesc: "What anyone on the network can see for this period.",
    encrypted: "Encrypted",
    noRecordsPeriod: "No disbursements for this period yet.",
    bonusInvalid: "Bonus cannot be negative.",
    sealedFor: "Sealed for",
    keystoreLoading: "Loading key vault...",
    modeLocal: "Local",
    modePreprod: "Preprod",
    modeLocalHint: "Runs the real Compact circuits in your browser. No wallet or test tokens needed.",
    modePreprodHint: "Midnight Preprod via Lace, with the reserve on Cardano Preprod via a CIP-30 wallet.",
    midnightContract: "Midnight Payroll Contract",
    contractAddress: "Contract",
    deployContract: "Deploy Payroll Contract",
    joinContract: "Join",
    contractAddressPh: "Existing contract address",
    connectLace: "Connect Lace (Midnight)",
    issuedCount: "Payslips issued",
    periodRoot: "Payroll root",
    budgetLabel: "Funded budget",
    notFunded: "Not funded",
    fundPeriod: "Fund Period",
    audited: "Signed off",
    notAudited: "Awaiting audit",
    resetLocal: "Reset simulator",
    resetConfirm: "Deploy a fresh local contract? All local payslips will be cleared.",
    contractNotReady: "Deploy or join a payroll contract first.",
    payoutSkipped: "Payslip issued. Shielded payout skipped: the employee has no registered Midnight address or the period is not funded.",
    payoutSent: "Shielded payout sent",
    issueTx: "Midnight tx",
    cardanoReserve: "Cardano Reserve",
    cardanoReserveDesc: "Escrows the period's reserve on Cardano and anchors the Midnight payroll root, so banks and tax offices can verify it there.",
    reserveAda: "Reserve (ADA)",
    anchoredRoot: "Anchored root",
    lockReserve: "Lock Reserve",
    anchorRoot: "Anchor Midnight Root",
    inSync: "Cardano anchor matches Midnight",
    outOfSync: "Midnight has newer payslips; anchor again",
    noReserve: "No reserve locked for this period",
    noCardanoWallet: "No CIP-30 Cardano wallet found in this browser.",
    simulated: "simulated",
    attestPeriod: "Sign Off Period",
    attestDone: "Period signed off on Midnight.",
    auditorMismatch: "This key is not the auditor registered in the payroll contract.",
    laceWallet: "Lace (Midnight)",
    shieldedRegistered: "Payout address registered",
    zkVerified: "Verified against Midnight commitment",
    levelLabel: "Salary level",
    bandLabel: "Band",
    bandBase: "Base salary is outside this level's band: the ZK proof will be rejected.",
    bandAllowance: "Allowance exceeds this level's band: the ZK proof will be rejected.",
    bandBonus: "Bonus exceeds this level's band: the ZK proof will be rejected.",
    rulesLabel: "Salary rules",
    rulesPublished: "Committed on chain",
    rulesMissing: "Not published",
    publishRules: "Publish Salary Rules",
    closedTotal: "Period total",
    periodOpen: "Open (hidden)",
    closePeriod: "Close Period (prove total ≤ budget)",
    unlockTitle: "Unlock Keys with Your Wallet",
    unlockDesc: "Sign a message with a Cardano wallet (Lace, Eternl…). Your payroll keys are derived from the signature, so nothing secret is stored and you can recover them on any device.",
    unlocked: "Keys derived from your wallet signature",
    rulesVerified: "Salary rules match the on-chain commitment",
    withinBand: "Within the band for level",
    outOfBand: "Outside the band for level",
    noDust: "No DUST yet. Midnight fees are paid in DUST, not tNIGHT. In Lace, open Midnight and designate your tNIGHT for DUST generation, then wait a few minutes for DUST to accrue before deploying or sending transactions.",
    dustOk: "DUST available for transaction fees.",
    proverLabel: "Proof server",
    localProverHint: "Lace generates proofs with a proof server on this computer. Keep it running and on version 8.1.0 (the current networks reject proofs from older versions):",
    noContractEmployee: "No payroll contract on Preprod yet. The employer deploys it and issues payslips first; they will appear here."
  },
  zh: {
    navTitle: "鏈上薪資系統",
    connect: "連接錢包",
    langToggle: "EN",
    comingSoon: "待推出",
    bankApi: "民間銀行 API (貸款/聯徵)",
    govCpaApi: "政府/事務所 API (報稅/合規)",
    web3Standard: "Web3 標準協議",
    titlePrefix: "企業級",
    titleSuffix: "鏈上發薪方案",
    desc: "透過安全、合規且極具隱私的方式進行薪資發放。體驗 Web3 時代的人力資源管理未來。",
    empPortal: "雇主發放入口",
    empPortalDesc: "管理薪資結構並執行安全的鏈上發放。",
    launch: "進入控制台",
    employeePortal: "員工提領入口",
    employeePortalDesc: "安全登入以提領薪資並下載官方薪資證明。",
    claimVerify: "提領與驗證",
    auditorPortal: "審計查核入口",
    auditorPortalDesc: "查核合規紀錄並匯出系統審計報表。",
    accessLogs: "查閱紀錄",
    employerTitle: "隱私薪資發放控制台",
    connectEmp: "連接企業錢包",
    selectEmp: "1. 選擇員工",
    currentPeriod: "2. 當前週期 (系統鎖定)",
    base: "本薪 (TWD)",
    allowance: "固定津貼",
    bonus: "浮動獎金",
    labor: "勞工保險",
    health: "健康保險",
    tax: "個人所得稅",
    net: "實領淨額",
    signSettle: "簽署與結算",
    encrypting: "資料加密中...",
    proving: "產生零知識證明...",
    relaying: "節點廣播中...",
    settling: "資金結算中...",
    complete: "發放完成",
    sysAlert: "系統提示",
    dupAlert: "此週期的薪資已被提領，系統拒絕重複發放。",
    dismiss: "關閉",
    added: "薪資發放成功！",
    updated: "紀錄更新成功！",
    done: "完成",
    employeeTitle: "員工入口登入",
    accId: "員工帳號",
    pwd: "登入密碼",
    signIn: "安全登入",
    walletReq: "需要錢包驗證",
    walletReqDesc: "請連接您的個人 Web3 錢包以驗證數位身分並解鎖薪資提領權限。",
    connectStd: "連接個人錢包",
    welcome: "歡迎",
    dashboard: "薪資提領儀表板",
    logout: "安全登出",
    empty: "目前沒有待處理的薪資發放紀錄。",
    compProof: "薪資單",
    ready: "待提領",
    disbursed: "已簽收",
    review: "查看",
    payslip: "薪資明細",
    verified: "已驗證的數位薪資單",
    claimed: "已在 Midnight 簽收",
    processing: "區塊鏈處理中...",
    withdraw: "簽收薪資",
    download: "下載 PDF",
    claimConfirmed: "提領成功！",
    claimDesc: "已用您的私鑰在 Midnight 上以零知識證明完成簽收，金額從未離開您的裝置。您可以從儀表板下載可驗證的薪資單。",
    returnDash: "返回儀表板",
    auditTitle: "財務合規與審計入口",
    auditSub: "即時監控所有鏈上資金撥款紀錄。",
    exportCsv: "匯出 CSV 報表",
    auditReq: "需要審計員身分驗證",
    auditReqDesc: "請連接審計錢包。系統會比對 Midnight 薪資合約中登記的審計員金鑰。",
    connectAudit: "連接審計錢包",
    verifyingId: "鏈上身分驗證中...",
    verifyingDesc: "正在比對 Midnight 合約登記的審計金鑰...",
    accessGranted: "授權通過",
    emptyLedger: "目前分類帳無交易紀錄。",
    colEmp: "員工",
    colPeriod: "週期",
    colNet: "實發金額",
    colStatus: "狀態",
    colAction: "操作",
    inspect: "查核",
    cryptoProof: "密碼學證明",
    verifiedZk: "已驗證的 ZK-Rollup 交易",
    empId: "員工識別碼",
    disbPeriod: "撥款週期",
    closeIns: "關閉視窗",
    netSettled: "實際結算金額",
    selectAccount: "選擇員工帳號...",
    periodLabel: "週期",
    immutableNote: "數字全程保密：Midnight 只儲存承諾值，並以零知識證明扣繳計算正確。",
    statusPending: "待提領",
    statusClaimed: "已提領",
    accountNotFound: "查無此帳號，請輸入 Aden、Alice 或 Bob。",
    decrypting: "解密中...",
    decryptFailed: "無法解密",
    commitment: "鏈上承諾值",
    commitmentOk: "承諾值與解密後的數字相符",
    commitmentBad: "承諾值不符：數字可能遭到竄改",
    publicLedger: "公開分類帳視角",
    publicLedgerDesc: "網路上任何人在此週期能看到的內容。",
    encrypted: "已加密",
    noRecordsPeriod: "此週期尚無發放紀錄。",
    bonusInvalid: "獎金不可為負數。",
    sealedFor: "加密授權對象",
    keystoreLoading: "載入金鑰庫中...",
    modeLocal: "本機",
    modePreprod: "Preprod",
    modeLocalHint: "在瀏覽器內執行真正的 Compact 電路，不需要錢包或測試幣。",
    modePreprodHint: "透過 Lace 連接 Midnight Preprod，並用 CIP-30 錢包在 Cardano Preprod 託管準備金。",
    midnightContract: "Midnight 薪資合約",
    contractAddress: "合約",
    deployContract: "部署薪資合約",
    joinContract: "加入",
    contractAddressPh: "既有合約地址",
    connectLace: "連接 Lace (Midnight)",
    issuedCount: "已發薪資單",
    periodRoot: "薪資根雜湊",
    budgetLabel: "已注資預算",
    notFunded: "尚未注資",
    fundPeriod: "注資本期",
    audited: "已簽核",
    notAudited: "待審計",
    resetLocal: "重置模擬器",
    resetConfirm: "要部署新的本機合約嗎？所有本機薪資單都會清除。",
    contractNotReady: "請先部署或加入薪資合約。",
    payoutSkipped: "薪資單已發出。略過 shielded 撥款：員工尚未登記 Midnight 收款地址，或本期尚未注資。",
    payoutSent: "Shielded 撥款已送出",
    issueTx: "Midnight 交易",
    cardanoReserve: "Cardano 準備金",
    cardanoReserveDesc: "在 Cardano 託管當期準備金並錨定 Midnight 薪資根雜湊，讓銀行與國稅局可在 Cardano 上查驗。",
    reserveAda: "準備金 (ADA)",
    anchoredRoot: "已錨定根雜湊",
    lockReserve: "鎖定準備金",
    anchorRoot: "錨定 Midnight 根雜湊",
    inSync: "Cardano 錨定值與 Midnight 一致",
    outOfSync: "Midnight 有新的薪資單，請重新錨定",
    noReserve: "本期尚未鎖定準備金",
    noCardanoWallet: "此瀏覽器找不到 CIP-30 Cardano 錢包。",
    simulated: "模擬",
    attestPeriod: "簽核本期",
    attestDone: "已在 Midnight 完成本期簽核。",
    auditorMismatch: "此金鑰不是薪資合約登記的審計員。",
    laceWallet: "Lace (Midnight)",
    shieldedRegistered: "已登記收款地址",
    zkVerified: "已比對 Midnight 承諾值",
    levelLabel: "薪資職級",
    bandLabel: "區間",
    bandBase: "本薪不在此職級的區間內，零知識證明會被拒絕。",
    bandAllowance: "津貼超過此職級上限，零知識證明會被拒絕。",
    bandBonus: "獎金超過此職級上限，零知識證明會被拒絕。",
    rulesLabel: "薪資規則",
    rulesPublished: "已上鏈承諾",
    rulesMissing: "尚未公布",
    publishRules: "公布薪資規則",
    closedTotal: "本期總額",
    periodOpen: "未結算（隱藏）",
    closePeriod: "期末結算（證明總額 ≤ 預算）",
    unlockTitle: "用錢包解鎖金鑰",
    unlockDesc: "用 Cardano 錢包（Lace、Eternl…）簽一則訊息。薪資金鑰由簽章推導而來，不必儲存任何機密，換裝置也能重新取回。",
    unlocked: "已由錢包簽章推導金鑰",
    rulesVerified: "薪資規則與鏈上承諾一致",
    withinBand: "符合職級區間",
    outOfBand: "超出職級區間",
    noDust: "還沒有 DUST。Midnight 的手續費用 DUST 支付，不是 tNIGHT。請在 Lace 的 Midnight 頁面把 tNIGHT 指定為產生 DUST，等幾分鐘 DUST 累積後，再部署或送出交易。",
    dustOk: "DUST 充足，可支付交易手續費。",
    proverLabel: "證明伺服器",
    localProverHint: "Lace 會用你電腦上的 proof server 產生證明，請保持執行並使用 8.1.0 版（目前的網路不接受舊版產生的證明）：",
    noContractEmployee: "Preprod 上還沒有薪資合約。需要先由雇主部署合約並發出薪資單，之後會顯示在這裡。"
  }
};

function BrandLogo() {
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1.5px] shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-all">
        <div className="w-full h-full bg-[#0a0e17] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-cyan-400/10 blur-md"></div>
          <Hexagon className="w-6 h-6 text-cyan-400 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        </div>
      </div>
    </div>
  );
}

export default function OnChainPayrollApp() {
  const [lang, setLang] = useState<Lang>('en');
  const [currentView, setCurrentView] = useState<UserRole>('landing');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null);
  const [activeEmployeeId, setActiveEmployeeId] = useState('');
  const chain = usePayrollChain(EMPLOYEE_IDS);

  const t = T[lang];

  const registerEmployeeAddress = async (employeeId: string, address: string) => {
    if (!employeeId || !address) return;
    (await chainCore()).registerShieldedAddress(employeeId, address);
  };

  // Local mode: wallets are mocked, the contract runs in the browser.
  const connectWallet = async (type: WalletType) => {
    setIsConnecting(true);
    setShowWalletModal(false);
    setTimeout(() => {
      const employee = EMPLOYEES.find(e => e.id === activeEmployeeId);
      if (currentView === 'auditor') setWalletAddress(AUDITOR_ADDRESS);
      else if (currentView === 'employee' && employee) setWalletAddress(employee.address);
      else if (type === 'metamask') setWalletAddress("0xEMPL...C0DE");
      else setWalletAddress("addr_test1...Corp");
      setWalletType(type);
      setWalletConnected(true);
      setIsConnecting(false);
    }, 800);
  };

  // Preprod: Lace exposes the Midnight DApp Connector API.
  const connectLace = async () => {
    setIsConnecting(true);
    setShowWalletModal(false);
    try {
      const address = await chain.connectMidnight();
      setWalletAddress(shortHash(address));
      setWalletType('lace');
      setWalletConnected(true);
      if (currentView === 'employee') await registerEmployeeAddress(activeEmployeeId, address);
    } catch (e) {
      setDuplicateAlert(errorText(e));
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletType('');
    setWalletAddress('');
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
    setActiveEmployeeId('');
    disconnectWallet();
  };

  const handleEmployeeLogin = (id: string) => {
    setActiveEmployeeId(id);
    const employee = EMPLOYEES.find(e => e.id === id);
    if (walletConnected && chain.mode === 'local' && employee) setWalletAddress(employee.address);
    if (walletConnected && chain.mode === 'preprod') registerEmployeeAddress(id, chain.shieldedAddress);
  };

  const switchMode = (mode) => {
    disconnectWallet();
    chain.setMode(mode);
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');
  const openWalletModal = () => setShowWalletModal(true);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-200 font-sans selection:bg-blue-500/30 pb-20 relative">
      {duplicateAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111623] border border-amber-500/30 w-full max-w-sm rounded-2xl p-8 shadow-2xl text-center">
            <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t.sysAlert}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed break-words">{duplicateAlert}</p>
            <button onClick={() => setDuplicateAlert(null)} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold transition">{t.dismiss}</button>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <nav className="border-b border-white/5 bg-[#0a0e17]/80 backdrop-blur-md sticky top-0 z-50 h-20 flex items-center justify-between px-8">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={navigateToLanding}>
          <BrandLogo />
          <div className="font-bold text-white text-xl tracking-tight hidden md:block group-hover:text-blue-400 transition-colors">{t.navTitle}</div>
        </div>
        <div className="flex items-center gap-4">
          <ModeSwitch mode={chain.mode} onChange={switchMode} t={t} />
          <button onClick={toggleLang} className="text-xs font-black text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-all active:scale-95 uppercase">
            {t.langToggle}
          </button>
          {walletConnected ? (
            <div className="flex items-center gap-3 animate-in fade-in">
              <div className={`px-4 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 ${currentView === 'auditor' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : walletType === 'metamask' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-300'}`}>
                <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80] animate-pulse"></div>
                {walletAddress}
              </div>
              <button onClick={disconnectWallet} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"><LogOut className="w-4 h-4" /></button>
            </div>
          ) : (
            currentView !== 'landing' && (
              <button onClick={openWalletModal} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2">
                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wallet className="w-4 h-4" />} {t.connect}
              </button>
            )
          )}
        </div>
      </nav>

      <main className="relative z-10">
        {currentView === 'landing' && <LandingView onNavigate={setCurrentView} t={t} />}
        {currentView === 'employer' && <EmployerView chain={chain} walletConnected={walletConnected} onConnect={openWalletModal} onSetAlert={setDuplicateAlert} onNavigateBack={navigateToLanding} t={t} />}
        {currentView === 'employee' && <EmployeeView chain={chain} walletConnected={walletConnected} onConnect={openWalletModal} onLogin={handleEmployeeLogin} onSetAlert={setDuplicateAlert} onLogout={navigateToLanding} t={t} />}
        {currentView === 'auditor' && <AuditorView chain={chain} walletConnected={walletConnected} onConnect={openWalletModal} onSetAlert={setDuplicateAlert} onNavigateBack={navigateToLanding} t={t} />}
      </main>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111623] border border-white/10 w-full max-w-sm rounded-3xl p-8 shadow-2xl relative shadow-blue-900/10">
            <button onClick={() => setShowWalletModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-white font-black text-center mb-8 text-xl tracking-tight">{lang === 'en' ? 'Select Wallet' : '選擇授權錢包'}</h3>
            <div className="space-y-3">
              
              {currentView === 'employer' && (
                <>
                  <button disabled className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 cursor-not-allowed opacity-40 relative group">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-400 uppercase tracking-widest border border-white/10 px-2 py-1 rounded bg-white/5">{t.comingSoon}</div>
                    <div className="w-10 h-10 rounded-full bg-[#0a0e17] flex items-center justify-center overflow-hidden border border-white/10 p-1 grayscale">
                      <img src="/safe.png" alt="Safe" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left font-bold text-slate-300">Safe (M-of-N)</div>
                  </button>
                  <div className="flex items-center gap-4 py-2"><div className="h-px bg-white/5 flex-1"></div><span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{t.web3Standard}</span><div className="h-px bg-white/5 flex-1"></div></div>
                </>
              )}

              {currentView === 'auditor' && (
                <>
                  {/* Bank API Button */}
                  <button disabled className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 cursor-not-allowed opacity-40 relative group">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-400 uppercase tracking-widest border border-white/10 px-2 py-1 rounded bg-white/5">{t.comingSoon}</div>
                    <div className="w-10 h-10 rounded-full bg-[#0a0e17] flex items-center justify-center overflow-hidden border border-white/10 p-2.5">
                      <Building2 className="w-full h-full text-slate-400" />
                    </div>
                    <div className="text-left font-bold text-slate-300 text-sm">{t.bankApi}</div>
                  </button>

                  {/* Gov / CPA API Button */}
                  <button disabled className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 cursor-not-allowed opacity-40 relative group mt-3">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-400 uppercase tracking-widest border border-white/10 px-2 py-1 rounded bg-white/5">{t.comingSoon}</div>
                    <div className="w-10 h-10 rounded-full bg-[#0a0e17] flex items-center justify-center overflow-hidden border border-white/10 p-2.5">
                      <Landmark className="w-full h-full text-slate-400" />
                    </div>
                    <div className="text-left font-bold text-slate-300 text-sm">{t.govCpaApi}</div>
                  </button>

                  <div className="flex items-center gap-4 py-2 mt-2"><div className="h-px bg-white/5 flex-1"></div><span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{t.web3Standard}</span><div className="h-px bg-white/5 flex-1"></div></div>
                </>
              )}

              {chain.mode === 'preprod' ? (
                <button onClick={connectLace} className="w-full bg-white/5 hover:bg-emerald-900/20 border border-white/5 hover:border-emerald-500/40 p-4 rounded-2xl flex items-center gap-4 transition-all group active:scale-[0.98]">
                  <div className="w-10 h-10 rounded-xl bg-[#0a0e17] flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-900/20 transition-colors">
                    <Hexagon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left font-bold text-white group-hover:text-emerald-400 transition-colors">{t.laceWallet}</div>
                </button>
              ) : (
                <>
                  <button onClick={() => connectWallet('metamask')} className="w-full bg-white/5 hover:bg-orange-900/20 border border-white/5 hover:border-orange-500/40 p-4 rounded-2xl flex items-center gap-4 transition-all group active:scale-[0.98]">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center p-2 group-hover:bg-white/10 transition-colors">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left font-bold text-white group-hover:text-orange-400 transition-colors">MetaMask</div>
                  </button>
                  
                  <button onClick={() => connectWallet('eternl')} className="w-full bg-white/5 hover:bg-blue-900/20 border border-white/5 hover:border-blue-500/40 p-4 rounded-2xl flex items-center gap-4 transition-all group active:scale-[0.98]">
                    <div className="w-10 h-10 rounded-xl bg-[#0a0e17] flex items-center justify-center overflow-hidden border border-blue-500/30 p-0.5 group-hover:bg-blue-900/20 transition-colors">
                      <img src="/eternl.png" alt="Eternl" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="text-left font-bold text-white group-hover:text-blue-400 transition-colors">Eternl</div>
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Decrypts the openings sealed for `holder` and checks each against its on-chain commitment.
function useOpenings(chain: any, views: any[], holder: string, enabled: boolean) {
  const [openings, setOpenings] = useState<Record<string, any>>({});
  useEffect(() => {
    if (!enabled || !chain.keystore || !holder) { setOpenings({}); return; }
    let cancelled = false;
    chainCore().then(core =>
      Promise.all(views.map(async v => [v.id, await core.readOpening(chain.contractAddress, v, holder, chain.keystore)] as const)),
    ).then(entries => { if (!cancelled) setOpenings(Object.fromEntries(entries)); });
    return () => { cancelled = true; };
  }, [views, holder, chain.keystore, chain.contractAddress, enabled]);
  return openings;
}

const statusLabel = (status: string, t: any) => status === 'Claimed' ? t.statusClaimed : t.statusPending;

function usePeriodSummary(chain: any) {
  const [summary, setSummary] = useState({ root: null, issued: 0, budget: null, closedTotal: null, audited: false, rulesPublished: false });
  useEffect(() => {
    if (!chain.ledger) return;
    chainCore().then(core => setSummary(core.periodSummary(chain.ledger, PERIOD_U)));
  }, [chain.ledger]);
  return summary;
}

function LandingView({ onNavigate, t }: any) {
  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[1.1]">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">{t.titlePrefix}</span><br />{t.titleSuffix}
      </h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-20 leading-relaxed font-medium">{t.desc}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <button onClick={() => onNavigate('employer')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/5 hover:border-blue-500/40 p-10 rounded-[2.5rem] transition-all text-left overflow-hidden shadow-2xl hover:shadow-blue-900/20 active:scale-[0.98]">
          <div className="absolute top-[-10%] right-[-10%] p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700"><Building2 className="w-48 h-48 text-blue-500" /></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-400 border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform"><Server className="w-7 h-7" /></div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{t.empPortal}</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">{t.empPortalDesc}</p>
            <div className="inline-flex items-center text-blue-400 text-sm font-black group-hover:gap-3 transition-all tracking-widest uppercase">{t.launch} <ChevronRight className="w-4 h-4 ml-1" /></div>
          </div>
        </button>

        <button onClick={() => onNavigate('employee')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/5 hover:border-purple-500/40 p-10 rounded-[2.5rem] transition-all text-left overflow-hidden shadow-2xl hover:shadow-purple-900/20 active:scale-[0.98]">
          <div className="absolute top-[-10%] right-[-10%] p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700"><User className="w-48 h-48 text-purple-500" /></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-400 border border-purple-500/20 shadow-inner group-hover:scale-110 transition-transform"><Shield className="w-7 h-7" /></div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{t.employeePortal}</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">{t.employeePortalDesc}</p>
            <div className="inline-flex items-center text-purple-400 text-sm font-black group-hover:gap-3 transition-all tracking-widest uppercase">{t.claimVerify} <ChevronRight className="w-4 h-4 ml-1" /></div>
          </div>
        </button>

        <button onClick={() => onNavigate('auditor')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/5 hover:border-emerald-500/40 p-10 rounded-[2.5rem] transition-all text-left overflow-hidden shadow-2xl hover:shadow-emerald-900/20 active:scale-[0.98]">
          <div className="absolute top-[-10%] right-[-10%] p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700"><FileSearch className="w-48 h-48 text-emerald-500" /></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform"><Database className="w-7 h-7" /></div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{t.auditorPortal}</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">{t.auditorPortalDesc}</p>
            <div className="inline-flex items-center text-emerald-400 text-sm font-black group-hover:gap-3 transition-all tracking-widest uppercase">{t.accessLogs} <ChevronRight className="w-4 h-4 ml-1" /></div>
          </div>
        </button>
      </div>
    </div>
  );
}

function EmployerView({ chain, walletConnected, onConnect, onSetAlert, onNavigateBack, t }: any) {
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const period = PERIOD;
  const [bonus, setBonus] = useState(0);
  const [level, setLevel] = useState(0);
  const [step, setStep] = useState(0); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);
  const summary = usePeriodSummary(chain);

  const emp = EMPLOYEES.find(e => e.id === selectedEmpId);
  // Display-only; the circuit re-checks these figures inside the proof.
  const laborFee = emp ? Math.floor(emp.base * 0.025) : 0;
  const healthFee = emp ? Math.floor(emp.base * 0.015) : 0;
  const taxFee = emp ? Math.floor((emp.base + emp.allowance + bonus) * 0.05) : 0;
  const totalNet = emp ? (emp.base + emp.allowance + bonus - laborFee - healthFee - taxFee) : 0;
  const bonusInvalid = !Number.isInteger(bonus) || bonus < 0;
  // Mirrors assertWithinRules so the employer sees why a proof would be refused.
  const band = DEMO_SALARY_BANDS[level - 1];
  const bandWarning = emp && band && (
    BigInt(emp.base) < band.minBase || BigInt(emp.base) > band.maxBase ? t.bandBase
    : BigInt(emp.allowance) > band.maxAllowance ? t.bandAllowance
    : BigInt(bonus) > band.maxBonus ? t.bandBonus : null);
  const periodRecords = chain.views.filter(r => r.period === period);
  const ready = !!chain.backend && !!chain.keystore;

  const handleExecute = async () => {
    if (!walletConnected) { onConnect(); return; }
    if (!ready) { onSetAlert(t.contractNotReady); return; }
    if (bonusInvalid) return;
    const existing = periodRecords.find(r => r.employeeId === selectedEmpId);
    if (existing && existing.status === 'Claimed') {
      onSetAlert(t.dupAlert);
      return;
    }
    const pace = chain.mode === 'local' ? 700 : 0;
    try {
      const core = await chainCore();
      setStep(1);
      const opening = core.newOpening(level, emp.base, emp.allowance, bonus);
      const employeePk = core.employeePublicKey(emp.id);
      await sleep(pace);

      setStep(2);
      const issue = await chain.backend.issuePayslip(employeePk, PERIOD_U, opening);

      setStep(3);
      const idHex = core.toHex(core.pureCircuits.payslipId(employeePk, PERIOD_U));
      await core.postOpening(chain.contractAddress, idHex, opening, [emp.id, AUDITOR_HOLDER], chain.keystore);
      await chain.refresh();
      await sleep(pace);

      setStep(4);
      const address = core.shieldedAddressOf(emp.id);
      const payout = address && summary.budget !== null ? await chain.backend.payEmployee(address, opening.details.net) : null;
      await sleep(pace);

      setResult({ issueTx: issue.txId, payoutTx: payout?.txId, payoutSkipped: chain.mode === 'preprod' && !payout, net: opening.details.net });
      setStep(5);
      setShowSuccess(true);
    } catch (e) {
      setStep(0);
      onSetAlert(errorText(e));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-in fade-in duration-500 relative">
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-[#111623] border border-blue-500/50 p-10 rounded-[2.5rem] shadow-2xl text-center w-full max-w-sm">
                <CheckCircle className="w-16 h-16 text-blue-400 mx-auto mb-6 animate-bounce" />
                <h2 className="text-3xl font-black text-white mb-2">{t.added}</h2>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">{t.periodLabel} <span className="text-white font-bold">{period}</span><br/>{t.immutableNote}</p>
                {result && (
                  <div className="text-left text-[10px] font-mono text-slate-500 bg-black/40 rounded-xl p-3 mb-6 space-y-1 break-all">
                    <div>{t.issueTx}: <span className="text-slate-300">{shortHash(result.issueTx)}</span></div>
                    {result.payoutTx && <div>{t.payoutSent}: <span className="text-slate-300">{shortHash(result.payoutTx)}</span></div>}
                    {result.payoutSkipped && <div className="text-amber-400 font-sans">{t.payoutSkipped}</div>}
                  </div>
                )}
                <button onClick={() => { setShowSuccess(false); setStep(0); setSelectedEmpId(''); setBonus(0); setResult(null); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black tracking-widest uppercase shadow-lg shadow-blue-900/20">{t.done}</button>
            </div>
        </div>
      )}
      <div className="bg-[#111623] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
           <div className="bg-white/5 p-3 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border border-white/5 shadow-inner" onClick={onNavigateBack}><ChevronLeft className="text-slate-400"/></div>
           <h2 className="text-3xl font-black text-white tracking-tighter">{t.employerTitle}</h2>
        </div>
        <div className="space-y-8">
          {!walletConnected && <button onClick={onConnect} className="w-full bg-blue-900/10 border border-blue-500/20 p-5 rounded-2xl text-blue-400 font-black flex justify-center items-center gap-3 transition-all hover:bg-blue-900/20 shadow-inner"><Wallet /> {t.connectEmp}</button>}
          
          <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">{t.selectEmp}</label>
                <select className="bg-black/40 border border-white/10 rounded-2xl p-4 w-full text-white outline-none focus:border-blue-500/50 cursor-pointer appearance-none transition-all" value={selectedEmpId} onChange={(e) => { setSelectedEmpId(e.target.value); setLevel(EMPLOYEES.find(x => x.id === e.target.value)?.level ?? 0); }}>
                    <option value="">{t.selectAccount}</option>
                    {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} - {e.title}</option>)}
                </select>
              </div>
              <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">{t.currentPeriod}</label>
                  <div className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 text-slate-400 font-mono flex items-center justify-between cursor-not-allowed">
                      <span>{period}</span>
                      <LockKeyhole className="w-4 h-4 text-slate-700" />
                  </div>
              </div>
          </div>

          {emp && (
            <div className="bg-[#0a0e17] rounded-[2rem] p-8 border border-white/5 animate-in zoom-in slide-in-from-bottom-4 duration-500 shadow-inner">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm text-slate-400 font-medium pb-3 border-b border-white/5">
                  <span>{t.levelLabel}</span>
                  <select value={level} onChange={e => setLevel(Number(e.target.value))} className="bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none">
                    {LEVEL_NAMES.map((name, i) => <option key={name} value={i + 1}>L{i + 1} · {name}</option>)}
                  </select>
                </div>
                {band && <div className="text-[10px] text-slate-500 font-mono text-right">{t.bandLabel}: {fmt(band.minBase)}–{fmt(band.maxBase)} · {t.allowance} ≤ {fmt(band.maxAllowance)} · {t.bonus} ≤ {fmt(band.maxBonus)}</div>}
                <div className="flex justify-between text-sm text-slate-400 font-medium"><span>{t.base}</span><span className="text-white font-mono tracking-tight">{emp.base.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-slate-400 font-medium"><span>{t.allowance}</span><span className="text-white font-mono tracking-tight">{emp.allowance.toLocaleString()}</span></div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                  <span className="text-blue-400 font-black uppercase">{t.bonus}</span>
                  <input type="number" min={0} step={1000} value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className={`bg-black/60 border rounded-lg px-3 py-2 text-right text-white w-32 outline-none font-mono ${bonusInvalid ? 'border-red-500/60' : 'border-white/10 focus:border-blue-500/50'}`}/>
                </div>
                {bonusInvalid && <div className="text-right text-[11px] text-red-400 font-bold">{t.bonusInvalid}</div>}
                {bandWarning && <div className="text-right text-[11px] text-amber-400 font-bold flex items-center justify-end gap-1"><ShieldAlert className="w-3.5 h-3.5"/>{bandWarning}</div>}
              </div>
              <div className="space-y-3 border-t border-white/5 pt-6">
                <div className="flex justify-between text-xs text-red-400/70 font-bold italic"><span>{t.labor}</span><span className="font-mono">-{laborFee.toLocaleString()}</span></div>
                <div className="flex justify-between text-xs text-red-400/70 font-bold italic"><span>{t.health}</span><span className="font-mono">-{healthFee.toLocaleString()}</span></div>
                <div className="flex justify-between text-xs text-red-400/70 font-bold italic"><span>{t.tax}</span><span className="font-mono">-{taxFee.toLocaleString()}</span></div>
              </div>
              <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-8">
                <span className="text-slate-300 uppercase text-sm font-black">{t.net}</span>
                <span className="text-blue-400 text-4xl font-black">{totalNet.toLocaleString()} TWD</span>
              </div>
            </div>
          )}
          
          <button onClick={handleExecute} disabled={!selectedEmpId || !period || bonusInvalid || (walletConnected && !ready) || (step > 0 && step < 5)} className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex justify-center items-center gap-3 tracking-widest uppercase shadow-xl active:scale-[0.98] ${(!selectedEmpId || !period || bonusInvalid) ? 'bg-slate-800 text-slate-600' : step === 5 ? 'bg-blue-600 text-white' : step > 0 ? 'bg-purple-600 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'}`}>
            {step === 0 && <><Activity className="w-5 h-5"/> {t.signSettle}</>}
            {step > 0 && step < 5 && <><Loader2 className="animate-spin w-5 h-5" /> {step === 1 ? t.encrypting : step === 2 ? t.proving : step === 3 ? t.relaying : t.settling}</>}
            {step === 5 && <><CheckCircle className="w-5 h-5"/> {t.complete}</>}
          </button>
        </div>
      </div>

      {chain.mode === 'preprod' && <UnlockKeys chain={chain} role="employer" onError={onSetAlert} t={t} />}
      <ContractPanel chain={chain} summary={summary} period={period} periodU={PERIOD_U} walletConnected={walletConnected} onConnect={onConnect} onError={onSetAlert} canFund t={t} />
      <ReservePanel chain={chain} summary={summary} period={period} periodU={PERIOD_U} onError={onSetAlert} t={t} />

      <div className="bg-[#111623] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl mt-8">
        <div className="flex items-center gap-3 mb-1">
          <Eye className="w-5 h-5 text-slate-500" />
          <h3 className="text-lg font-black text-white tracking-tight">{t.publicLedger} · {period}</h3>
        </div>
        <p className="text-slate-500 text-xs mb-6 font-medium">{t.publicLedgerDesc}</p>
        {periodRecords.length === 0 ? (
          <div className="text-center text-slate-600 text-xs font-bold uppercase tracking-widest py-6">{t.noRecordsPeriod}</div>
        ) : (
          <div className="space-y-3">
            {periodRecords.map(r => (
              <div key={r.id} className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-white font-black text-sm">{r.employeeId ?? shortHash(r.employeePk)}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{shortHash(r.commitment)}</div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-mono text-xs"><Lock className="w-3.5 h-3.5" /> {t.encrypted}</div>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${r.status === 'Claimed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{statusLabel(r.status, t)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmployeeView({ chain, walletConnected, onConnect, onLogin, onSetAlert, onLogout, t }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showWithdrawSuccessModal, setShowWithdrawSuccessModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundEmp = EMPLOYEES.find(emp => emp.id.toLowerCase() === loginId.toLowerCase());
    if (foundEmp) {
      setIsLoggedIn(true);
      setLoginId(foundEmp.id);
      setLoginError('');
      onLogin(foundEmp.id);
    } else {
      setLoginError(t.accountNotFound);
    }
  };

  const myRecords = React.useMemo(() => chain.views.filter(v => v.employeeId === loginId), [chain.views, loginId]);
  const revealed = useOpenings(chain, myRecords, loginId, isLoggedIn && walletConnected);
  const selectedRecord = myRecords.find(r => r.id === selectedId);
  const selectedReveal = selectedId ? revealed[selectedId] : undefined;

  // Claiming runs claimPayslip: a ZK proof of the employee key and the opening.
  const handleWithdrawAction = async (record: any) => {
    setProcessingId(record.id);
    try {
      const core = await chainCore();
      await chain.backend.claimPayslip(loginId, core.periodToUint(record.period), revealed[record.id].opening);
      await chain.refresh();
      setShowWithdrawSuccessModal(true);
    } catch (e) {
      onSetAlert(errorText(e));
    } finally {
      setProcessingId(null);
    }
  };

  if (!isLoggedIn) {
    return (
        <div className="max-w-md mx-auto p-6 pt-20 animate-in fade-in duration-500">
          <div className="bg-[#111623] border border-white/5 p-10 rounded-[2.5rem] text-center shadow-2xl relative">
            <button onClick={onLogout} className="absolute top-8 left-8 text-slate-500 hover:text-white transition-colors"><ChevronLeft/></button>
            <div className="w-20 h-20 bg-purple-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-purple-400 border border-purple-500/20 shadow-inner"><LogIn className="w-10 h-10"/></div>
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight">{t.employeeTitle}</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <input type="text" placeholder={t.accId} value={loginId} onChange={e => { setLoginId(e.target.value); setLoginError(''); }} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-purple-500 font-medium"/>
              <input type="password" placeholder={t.pwd} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-purple-500 font-medium"/>
              {loginError && <div className="text-red-400 text-xs font-bold">{loginError}</div>}
              <button type="submit" disabled={!loginId} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-2xl font-black tracking-widest uppercase transition-all shadow-lg active:scale-95">{t.signIn}</button>
            </form>
          </div>
        </div>
    );
  }

  if (isLoggedIn && !walletConnected) {
    return (
      <div className="max-w-md mx-auto p-6 pt-20 animate-in zoom-in duration-500">
        <div className="bg-[#111623] border border-orange-500/20 p-10 rounded-[2.5rem] text-center shadow-2xl relative">
          <button onClick={onLogout} className="absolute top-8 left-8 text-slate-500 hover:text-white transition-colors"><ChevronLeft/></button>
          <div className="w-20 h-20 bg-orange-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-orange-400 border border-orange-500/20"><Wallet className="w-10 h-10"/></div>
          <h2 className="text-2xl font-black text-white mb-4 tracking-tight">{t.walletReq}</h2>
          <p className="text-slate-400 mb-10 text-sm leading-relaxed font-medium">{t.walletReqDesc}</p>
          <button onClick={onConnect} className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-black tracking-widest uppercase shadow-lg active:scale-95">{t.connectStd}</button>
        </div>
      </div>
    );
  }

  const employeeDetails = EMPLOYEES.find(e => e.id === loginId);

  const generatePDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const core = await chainCore();
      const doc = new jsPDF();
      const d = selectedReveal.opening.details;
      doc.setFontSize(20); doc.text("On-Chain Payroll Receipt", 14, 22);
      doc.setFontSize(10); doc.text(`Verified against Midnight contract (${chain.mode})`, 14, 30);
      doc.text(`Employee: ${employeeDetails?.name || loginId}`, 14, 40);
      doc.text(`Period: ${selectedRecord.period}`, 14, 46);
      doc.setFontSize(7);
      doc.text(`Contract: ${chain.contractAddress}`, 14, 52);
      doc.text(`Payslip ID: ${selectedRecord.id}`, 14, 57);
      doc.text(`Commitment: ${selectedRecord.commitment}`, 14, 62);
      doc.text(`Salt: ${core.toHex(selectedReveal.opening.salt)}`, 14, 67);
      doc.text("Verify: payslipCommitment({details, salt}) in payroll.compact (persistentCommit) must equal payslips[id].commitment on Midnight.", 14, 72);
      doc.setFontSize(10);
      (autoTable as any)(doc, {
        startY: 78, head: [['Description', 'Amount (TWD)']],
        body: [
          ['Base Salary', fmt(d.base)], 
          ['Allowance', fmt(d.allowance)], 
          ['Bonus', fmt(d.bonus)], 
          ['Labor Insurance', `-${fmt(d.labor)}`], 
          ['Health Insurance', `-${fmt(d.health)}`], 
          ['Income Tax', `-${fmt(d.tax)}`], 
          ['TOTAL NET PAY', { content: fmt(d.net), styles: { fontStyle: 'bold' } }]
        ],
      });
      doc.save(`${employeeDetails?.name || loginId}_Payslip_${selectedRecord.period}.pdf`);
    } catch (err) { onSetAlert("PDF Generation Failed"); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500 relative">
      {showWithdrawSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in duration-300">
          <div className="bg-[#111623] border border-green-500/30 p-10 rounded-[3rem] text-center shadow-2xl w-full max-w-sm border border-white/5">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-8 animate-bounce"/>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{t.claimConfirmed}</h2>
            <p className="text-slate-400 text-sm mb-12 leading-relaxed font-medium">{t.claimDesc}</p>
            <button onClick={() => setShowWithdrawSuccessModal(false)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black tracking-widest uppercase shadow-lg active:scale-95">{t.returnDash}</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-10">
        <div><h2 className="text-4xl font-black text-white tracking-tighter">{t.welcome}, {employeeDetails?.name}</h2><p className="text-slate-500 text-sm mt-1 font-bold uppercase tracking-widest">{t.dashboard}</p></div>
        <button onClick={onLogout} className="text-xs font-black text-slate-500 hover:text-white border-b-2 border-slate-800 pb-1 uppercase">{t.logout}</button>
      </div>

      {chain.mode === 'preprod' && !chain.backend && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-200">{t.noContractEmployee}</div>
      )}
      {chain.mode === 'preprod' && <UnlockKeys chain={chain} role={`employee:${loginId}`} holder={loginId} onError={onSetAlert} t={t} />}

      {chain.mode === 'preprod' && chain.shieldedAddress && (
        <div className="mb-6 text-[10px] font-mono text-slate-500 flex items-center gap-2"><BadgeCheck className="w-3.5 h-3.5 text-emerald-400"/> {t.shieldedRegistered}: {shortHash(chain.shieldedAddress)}</div>
      )}

      <div className="space-y-6">
        {myRecords.length === 0 ? (
          <div className="bg-[#111623] border border-dashed border-white/5 p-20 rounded-[3rem] text-center text-slate-600 font-bold uppercase tracking-widest"><FileText className="w-14 h-14 mx-auto mb-6 opacity-20"/>{t.empty}</div>
        ) : (
          myRecords.map(record => (
            <div key={record.id} className="bg-[#111623] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group shadow-xl hover:bg-[#161b2c] transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-purple-400 transition-colors border border-white/5 shadow-inner"><FileText className="w-7 h-7"/></div>
                <div><div className="text-white font-black text-xl tracking-tight">{record.period} {t.compProof}</div><div className="text-[10px] text-slate-500 font-mono mt-1 opacity-60">ID: {shortHash(record.commitment)}</div></div>
              </div>
              <div className="text-right flex items-center gap-10">
                <div>
                  <div className="text-3xl font-black text-white font-mono tracking-tighter">
                    {revealed[record.id] ? fmt(revealed[record.id].opening.details.net) : <span className="text-slate-600 text-base flex items-center gap-2 justify-end"><Lock className="w-4 h-4"/>{record.id in revealed ? t.decryptFailed : t.decrypting}</span>}
                  </div>
                  <div className={`text-[10px] uppercase font-black mt-1 tracking-widest ${record.status === 'Claimed' ? 'text-green-500' : 'text-amber-500'}`}>{record.status === 'Claimed' ? t.disbursed : t.ready}</div>
                </div>
                <button disabled={!revealed[record.id]} onClick={() => { setSelectedId(record.id); setShowDetails(true); }} className="disabled:opacity-30 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-black tracking-widest uppercase transition-all border border-white/5 group-hover:scale-105 active:scale-95 shadow-sm">
                  {t.review}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDetails && selectedRecord && selectedReveal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 animate-in fade-in backdrop-blur-md">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
             <button onClick={() => setShowDetails(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors z-20"><X /></button>
             
             <div className="bg-gradient-to-b from-purple-900/30 to-[#0f172a] p-10 border-b border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
               <h3 className="text-4xl font-black text-white tracking-tighter mb-4">{selectedRecord.period} {t.payslip}</h3>
               <div className={`flex items-center gap-3 text-xs font-black uppercase tracking-widest ${selectedRecord.status === 'Claimed' ? 'text-green-400' : 'text-purple-400'}`}>
                 {selectedRecord.status === 'Claimed' ? <BadgeCheck className="w-5 h-5"/> : <Shield className="w-5 h-5"/>}
                 {selectedRecord.status === 'Claimed' ? t.claimed : t.verified}
               </div>
             </div>
             
             <div className="p-10 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-slate-400 font-bold uppercase tracking-widest"><span>{t.base}</span><span className="text-white font-mono">{fmt(selectedReveal.opening.details.base)}</span></div>
                  <div className="flex justify-between text-sm text-slate-400 font-bold uppercase tracking-widest"><span>{t.allowance} / Bonus</span><span className="text-white font-mono">{fmt(selectedReveal.opening.details.allowance + selectedReveal.opening.details.bonus)}</span></div>
                  <div className="h-px bg-white/10 my-6" />
                  
                  <div className="flex justify-between text-xs text-red-400/80 font-black italic uppercase tracking-tighter"><span>{t.labor}</span><span className="font-mono">-{fmt(selectedReveal.opening.details.labor)}</span></div>
                  <div className="flex justify-between text-xs text-red-400/80 font-black italic uppercase tracking-tighter"><span>{t.health}</span><span className="font-mono">-{fmt(selectedReveal.opening.details.health)}</span></div>
                  <div className="flex justify-between text-xs text-red-400/80 font-black italic uppercase tracking-tighter"><span>{t.tax}</span><span className="font-mono">-{fmt(selectedReveal.opening.details.tax)}</span></div>
                  
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pt-4 ${selectedReveal.verified ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedReveal.verified ? <ShieldCheck className="w-4 h-4"/> : <ShieldAlert className="w-4 h-4"/>}
                    {selectedReveal.verified ? t.zkVerified : t.commitmentBad}
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-4">
                    <span className="text-slate-300 font-black tracking-widest uppercase text-xs">{t.net}</span>
                    <span className="text-cyan-400 text-4xl font-black drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">{fmt(selectedReveal.opening.details.net)} TWD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10">
                  <button 
                    onClick={() => handleWithdrawAction(selectedRecord)} 
                    disabled={selectedRecord.status === 'Claimed' || processingId === selectedRecord.id || !selectedReveal.verified}
                    className={`w-full py-5 rounded-2xl font-black tracking-widest uppercase transition-all shadow-xl active:scale-[0.98] ${
                      selectedRecord.status === 'Claimed' 
                      ? 'bg-black/40 text-slate-600 cursor-not-allowed border border-white/5' 
                      : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-cyan-900/20'
                    }`}
                  >
                    {processingId === selectedRecord.id ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : selectedRecord.status === 'Claimed' ? <CheckCircle className="text-green-500 mx-auto w-5 h-5" /> : t.withdraw}
                  </button>
                  <button onClick={generatePDF} className="w-full bg-white/5 hover:bg-white/10 text-slate-300 py-5 rounded-2xl font-black tracking-widest uppercase transition-all border border-white/5 active:scale-[0.98]">
                    {t.download}
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditorView({ chain, walletConnected, onConnect, onSetAlert, onNavigateBack, t }: any) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authDenied, setAuthDenied] = useState(false);
  const [attesting, setAttesting] = useState(false);
  const summary = usePeriodSummary(chain);

  // Real check: our auditor key must hash to the auditor stored in the contract.
  useEffect(() => {
    if (!walletConnected) { setAuthSuccess(false); setAuthDenied(false); return; }
    if (authSuccess || !chain.ledger) return;
    setIsVerifying(true);
    const timer = setTimeout(async () => {
      const core = await chainCore();
      const ok = core.toHex(chain.ledger.auditor) === core.toHex(core.publicKeyFor('auditor'));
      setAuthSuccess(ok);
      setAuthDenied(!ok);
      setIsVerifying(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [walletConnected, authSuccess, chain.ledger, chain.keystore]);

  // The rules are shared with the auditor only; check them against the on-chain commitment.
  const [rules, setRules] = useState<any>(null);
  useEffect(() => {
    if (!authSuccess || !chain.ledger || !chain.keystore) return;
    chainCore().then(core => core.readRules(chain.contractAddress, chain.ledger, AUDITOR_HOLDER, chain.keystore)).then(setRules);
  }, [authSuccess, chain.ledger, chain.keystore, chain.contractAddress]);

  const revealed = useOpenings(chain, chain.views, AUDITOR_HOLDER, authSuccess);
  const selectedRecord = chain.views.find(r => r.id === selectedId);
  const selectedReveal = selectedId ? revealed[selectedId] : undefined;
  const [bandCheck, setBandCheck] = useState<string | null>(null);
  useEffect(() => {
    if (!rules?.verified || !selectedReveal) { setBandCheck(null); return; }
    chainCore().then(core => setBandCheck(core.bandViolation(rules.rules, selectedReveal.opening.details)));
  }, [rules, selectedReveal]);

  const attest = async () => {
    setAttesting(true);
    try {
      await chain.backend.attestPeriod(PERIOD_U);
      await chain.refresh();
    } catch (e) {
      onSetAlert(errorText(e));
    } finally {
      setAttesting(false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Payslip ID", "Employee", "Period", "Base Salary", "Allowances", "Bonus", "Labor Ins.", "Health Ins.", "Tax", "Net Payout", "Status", "Commitment", "Commitment Verified"];
    const rows = chain.views.map(r => {
      const d = revealed[r.id]?.opening.details;
      return [
        r.id, r.employeeId ?? r.employeePk, r.period,
        d?.base ?? '', d?.allowance ?? '', d?.bonus ?? '',
        d?.labor ?? '', d?.health ?? '', d?.tax ?? '',
        d?.net ?? '', r.status, r.commitment, revealed[r.id]?.verified ? 'YES' : 'NO'
      ].map(String);
    });
    const csv = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "Audit_Compliance_Log.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-500 relative">
      <div className="bg-[#111623] border border-emerald-500/10 p-12 rounded-[3.5rem] shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex items-center justify-between mb-12 relative z-10">
          <div className="flex items-center gap-5">
             <div className="bg-white/5 p-3 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border border-white/5 shadow-inner" onClick={onNavigateBack}><ChevronLeft className="text-slate-400"/></div>
             <div>
               <h2 className="text-4xl font-black text-white tracking-tighter">{t.auditTitle}</h2>
               <p className="text-emerald-400/80 text-sm mt-1 font-bold uppercase tracking-widest">{t.auditSub}</p>
             </div>
          </div>
          {authSuccess && chain.views.length > 0 && (
             <button onClick={downloadCSV} className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-inner active:scale-95">
               <Download className="w-4 h-4 mr-2 inline" /> {t.exportCsv}
             </button>
          )}
        </div>

        {!walletConnected ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-slate-800/10 rounded-[2rem] flex items-center justify-center mb-10 border border-white/5 shadow-inner"><LockKeyhole className="w-12 h-12 text-slate-700" /></div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t.auditReq}</h3>
            <p className="text-slate-500 mb-12 max-w-sm text-center text-sm font-medium leading-relaxed">{t.auditReqDesc}</p>
            <button onClick={onConnect} className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black tracking-widest uppercase transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
              {t.connectAudit}
            </button>
          </div>
        ) : !chain.backend ? (
          <div className="text-center text-slate-500 py-20 text-sm font-bold">{t.contractNotReady}</div>
        ) : isVerifying || (!authSuccess && !authDenied) ? (
          <div className="flex flex-col items-center justify-center py-28 animate-in fade-in">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-emerald-500 animate-spin mb-8 opacity-40" />
              <Shield className="w-8 h-8 text-emerald-400 absolute top-6 left-6 animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{t.verifyingId}</h3>
            <p className="text-emerald-400/50 font-mono text-xs tracking-widest uppercase">{t.verifyingDesc}</p>
          </div>
        ) : authDenied ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <ShieldAlert className="w-16 h-16 mb-6" />
            <p className="font-bold">{t.auditorMismatch}</p>
            {chain.mode === 'preprod' && <div className="w-full max-w-md text-left"><UnlockKeys chain={chain} role="auditor" holder={AUDITOR_HOLDER} onError={onSetAlert} onUnlocked={() => setAuthDenied(false)} t={t} /></div>}
          </div>
        ) : (
          <div className="space-y-6 relative z-10 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div className="flex flex-wrap gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit shadow-inner">
                  <BadgeCheck className="w-4 h-4"/> {t.accessGranted}
                </div>
                {rules && (
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${rules.verified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {rules.verified ? <ShieldCheck className="w-4 h-4"/> : <ShieldAlert className="w-4 h-4"/>} {rules.verified ? t.rulesVerified : t.commitmentBad}
                  </div>
                )}
              </div>
              {summary.audited ? (
                <div className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-2"><Stamp className="w-4 h-4"/> {t.attestDone}</div>
              ) : summary.issued > 0 && (
                <button disabled={attesting} onClick={attest} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase flex items-center gap-2 disabled:opacity-50">
                  {attesting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Stamp className="w-4 h-4"/>} {t.attestPeriod} · {PERIOD}
                </button>
              )}
            </div>

            {chain.views.length === 0 ? (
              <div className="border-2 border-dashed border-white/5 p-24 rounded-[3rem] text-center text-slate-600 font-black uppercase tracking-widest">
                <Database className="w-16 h-16 mx-auto mb-6 opacity-10"/>
                {t.emptyLedger}
              </div>
            ) : (
              <div className="overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl bg-black/20">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="p-6">{t.colEmp}</th>
                      <th className="p-6">{t.colPeriod}</th>
                      <th className="p-6">{t.colNet}</th>
                      <th className="p-6">{t.colStatus}</th>
                      <th className="p-6 text-right">{t.colAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {chain.views.map(record => (
                      <tr key={record.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6 text-white font-black tracking-tight">{record.employeeId ?? shortHash(record.employeePk)}</td>
                        <td className="p-6 text-slate-400 font-mono text-xs">{record.period}</td>
                        <td className="p-6 font-mono text-cyan-400 text-lg font-black">
                          {revealed[record.id] ? fmt(revealed[record.id].opening.details.net) : <span className="text-slate-600 text-xs flex items-center gap-2"><Lock className="w-3.5 h-3.5"/>{record.id in revealed ? t.decryptFailed : t.decrypting}</span>}
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${record.status === 'Claimed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                            {statusLabel(record.status, t)}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                           <button disabled={!revealed[record.id]} onClick={() => { setSelectedId(record.id); setShowDetails(true); }} className="disabled:opacity-30 bg-white/5 hover:bg-white/10 text-emerald-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                             {t.inspect}
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <ReservePanel chain={chain} summary={summary} period={PERIOD} periodU={PERIOD_U} readOnly onError={onSetAlert} t={t} />
          </div>
        )}
      </div>

      {showDetails && selectedRecord && selectedReveal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 animate-in fade-in backdrop-blur-lg">
          <div className="bg-[#0f172a] border border-emerald-500/20 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl relative">
             <button onClick={() => setShowDetails(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X /></button>
             
             <div className="bg-emerald-900/10 p-10 border-b border-white/5">
               <h3 className="text-3xl font-black text-white tracking-tighter mb-4">{t.cryptoProof}</h3>
               <div className={`flex items-center gap-3 text-xs font-black uppercase tracking-widest ${selectedReveal.verified ? 'text-emerald-400' : 'text-red-400'}`}>
                 {selectedReveal.verified ? <ShieldCheck className="w-5 h-5"/> : <ShieldAlert className="w-5 h-5"/>}
                 {selectedReveal.verified ? t.zkVerified : t.commitmentBad}
               </div>
               <div className="mt-6 text-[9px] text-slate-500 font-mono break-all bg-black/60 p-4 rounded-2xl border border-white/5 shadow-inner leading-relaxed">
                 {t.commitment}: {selectedRecord.commitment}
                 <br/>{t.contractAddress}: {chain.contractAddress}
               </div>
             </div>
             
             <div className="p-10 space-y-5">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-3"><span>{t.empId}</span><span className="text-white font-black">{selectedRecord.employeeId ?? shortHash(selectedRecord.employeePk)}</span></div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-3"><span>{t.disbPeriod}</span><span className="text-white">{selectedRecord.period}</span></div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-3"><span>{t.levelLabel}</span>
                  <span className={bandCheck ? 'text-red-400' : 'text-white'}>
                    L{String(selectedReveal.opening.details.level)} · {LEVEL_NAMES[Number(selectedReveal.opening.details.level) - 1]}
                    {rules?.verified && <span className={`ml-2 normal-case tracking-normal ${bandCheck ? 'text-red-400' : 'text-emerald-400'}`}>{bandCheck ? `✗ ${t.outOfBand}` : `✓ ${t.withinBand}`}</span>}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-3"><span>{t.colStatus}</span><span className={selectedRecord.status === 'Claimed' ? 'text-green-400' : 'text-amber-400'}>{statusLabel(selectedRecord.status, t)}</span></div>
                
                <div className="pt-6 space-y-3">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest"><span>{t.base}</span><span className="font-mono text-white">{fmt(selectedReveal.opening.details.base)}</span></div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest"><span>{t.allowance} / Bonus</span><span className="font-mono text-white">{fmt(selectedReveal.opening.details.allowance + selectedReveal.opening.details.bonus)}</span></div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest"><span>{t.labor}</span><span className="font-mono text-red-400/60">-{fmt(selectedReveal.opening.details.labor)}</span></div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest"><span>{t.health}</span><span className="font-mono text-red-400/60">-{fmt(selectedReveal.opening.details.health)}</span></div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest"><span>{t.tax}</span><span className="font-mono text-red-400/60">-{fmt(selectedReveal.opening.details.tax)}</span></div>
                  
                  <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-8">
                    <span className="text-slate-300 font-black tracking-widest uppercase text-xs">{t.netSettled}</span>
                    <span className="text-emerald-400 text-3xl font-black font-mono">{fmt(selectedReveal.opening.details.net)} TWD</span>
                  </div>
                </div>

                <div className="mt-10">
                  <button onClick={() => setShowDetails(false)} className="w-full bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black tracking-widest uppercase transition-all border border-white/5">
                    {t.closeIns}
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
