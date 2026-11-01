export type RangeKey = '7D' | '30D' | '90D';
export type TxnStatus = 'approved' | 'declined' | 'pending';
export type AlertSeverity = 'high' | 'medium' | 'low';

export interface Kpi {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals: number;
  compact?: boolean;
  delta: number;
  spark: number[];
  icon: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  bin: string;
  card: string;
  cardType: 'Debit' | 'Prepaid' | 'Credit';
  product: 'Classic' | 'Gold' | 'Platinum' | 'Signature' | 'Payroll' | 'Gift';
  channel: 'POS' | 'Online' | 'ATM';
  amount: number;
  status: TxnStatus;
  postedAt: Date;
  reference: string;
  authCode: string;
  responseCode: string;
  responseMessage: string;
  location: string;
  fee: number;
}

export interface AlertItem {
  id: number;
  severity: AlertSeverity;
  title: string;
  detail: string;
  time: string;
}

export interface DashboardData {
  kpis: Kpi[];
  labels: string[];
  domestic: number[];
  international: number[];
  hours: number[];
  categories: { name: string; share: number }[];
  bins: string[];
  binMix: { debit: number[]; prepaid: number[]; credit: number[] };
  cardMix: { name: string; value: number }[];
  approval: { approved: number; declined: number; rate: number };
  declineReasons: { reason: string; share: number }[];
  lifecycle: { stage: string; value: number }[];
}

// Bangladesh number style: lakh/crore grouping (12,34,567).
export function formatBdt(amount: number, decimals = 0): string {
  return (
    '৳' +
    amount.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

export function maskCard(bin: string, last4: string, length = 16): string {
  return `${bin.slice(0, 4)} ${'*'.repeat(length - 8)} ${last4}`;
}

const RANGE_DAYS: Record<RangeKey, number> = { '7D': 7, '30D': 30, '90D': 90 };

const ICONS = {
  volume: 'M2 6h20v12H2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 12h.01M18 12h.01',
  transactions: 'M22 12h-4l-3 9L9 3l-3 9H2',
  approval: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  cards: 'M2 5h20v14H2zM2 10h20M6 15h4',
  ticket: 'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1zM8 8h8M8 12h8',
  fraud: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
};

// Seeded PRNG so the dummy data is stable between renders and ranges.
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatDay(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function sample(values: number[], count: number): number[] {
  if (values.length <= count) {
    return values;
  }
  const step = (values.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => values[Math.round(i * step)]);
}

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);
const round = (value: number, digits = 0) => Number(value.toFixed(digits));

export function buildDashboardData(range: RangeKey): DashboardData {
  const days = RANGE_DAYS[range];
  const rand = mulberry32(days * 7919);

  const labels: string[] = [];
  const domestic: number[] = [];
  const international: number[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.push(formatDay(date));

    const weekday = date.getDay();
    const weekend = weekday === 0 || weekday === 6 ? 0.82 : 1;
    const growth = 1 + ((days - i) / days) * 0.18;
    domestic.push(round((180 + rand() * 60) * weekend * growth, 1));
    international.push(round((62 + rand() * 36) * weekend * growth * (1 + ((days - i) / days) * 0.12), 1));
  }

  const dailyTotal = domestic.map((value, i) => value + international[i]);
  const avgTicket = round(3050 + rand() * 280);
  const volumeBdt = sum(dailyTotal) * 100000; // series is in lakh
  const txnCount = Math.round(volumeBdt / avgTicket);
  const approvalRate = round(94.6 + rand() * 1.8, 1);
  const approved = Math.round(txnCount * (approvalRate / 100));
  const declined = txnCount - approved;
  const fraudBlocked = Math.round(declined * 0.21);

  const trend = (base: number, spread: number) =>
    Array.from({ length: 12 }, (_, i) => round(base + i * spread * 0.4 + rand() * spread * 2, 2));

  const kpis: Kpi[] = [
    {
      id: 'volume', label: 'Total volume', value: volumeBdt, prefix: '৳', decimals: 2, compact: true,
      delta: round(8 + rand() * 6, 1), spark: sample(dailyTotal, 12), icon: ICONS.volume,
    },
    {
      id: 'transactions', label: 'Transactions', value: txnCount, decimals: 2, compact: true,
      delta: round(5 + rand() * 6, 1), spark: sample(dailyTotal.map((v) => (v * 100000) / avgTicket), 12), icon: ICONS.transactions,
    },
    {
      id: 'approval', label: 'Approval rate', value: approvalRate, suffix: '%', decimals: 1,
      delta: round(0.3 + rand() * 1.1, 1), spark: trend(94, 0.35), icon: ICONS.approval,
    },
    {
      id: 'cards', label: 'Active cards', value: 48230 + days * 11, decimals: 0,
      delta: round(2 + rand() * 3, 1), spark: trend(46000, 260), icon: ICONS.cards,
    },
    {
      id: 'ticket', label: 'Avg. ticket size', value: avgTicket, prefix: '৳', decimals: 0,
      delta: round(-2.5 + rand() * 4, 1), spark: trend(2980, 60), icon: ICONS.ticket,
    },
    {
      id: 'fraud', label: 'Fraud blocked', value: fraudBlocked, decimals: 0,
      delta: round(-9 - rand() * 6, 1), spark: trend(1500, 40).reverse(), icon: ICONS.fraud,
    },
  ];

  const hourShape = [
    0.18, 0.1, 0.07, 0.06, 0.08, 0.16, 0.34, 0.56, 0.74, 0.82, 0.88, 0.96,
    1, 0.94, 0.86, 0.84, 0.9, 0.97, 0.92, 0.8, 0.62, 0.46, 0.33, 0.24,
  ];
  const hourBase = txnCount / sum(hourShape);
  const hours = hourShape.map((shape) => Math.round(shape * hourBase * (0.95 + rand() * 0.1)));

  return {
    kpis,
    labels,
    domestic,
    international,
    hours,
    categories: [
      { name: 'Groceries', share: 27 },
      { name: 'E-commerce', share: 22 },
      { name: 'Dining', share: 16 },
      { name: 'Fuel', share: 13 },
      { name: 'Travel', share: 12 },
      { name: 'Utilities', share: 10 },
    ],
    bins: ['506123', '506456', '506789', '507111', '508222', '509999'],
    binMix: {
      debit: [6200, 4400, 5100, 3300, 2100, 1600],
      prepaid: [2100, 3200, 2200, 2600, 2500, 2300],
      credit: [1100, 500, 1000, 1500, 1200, 1400],
    },
    cardMix: [
      { name: 'Debit', value: 24560 },
      { name: 'Prepaid', value: 15980 },
      { name: 'Credit', value: 7690 },
    ],
    approval: { approved, declined, rate: approvalRate },
    declineReasons: [
      { reason: 'Insufficient funds', share: 38 },
      { reason: 'Suspected fraud', share: 21 },
      { reason: 'Incorrect PIN', share: 16 },
      { reason: 'Card expired', share: 14 },
      { reason: 'Limit exceeded', share: 11 },
    ],
    lifecycle: [
      { stage: 'Issued', value: 3200 },
      { stage: 'Activated', value: 2688 },
      { stage: 'First transaction', value: 2210 },
      { stage: 'Active at 90 days', value: 1870 },
    ],
  };
}

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

// Merchant discount rate charged on approved card-present and online sales.
const MDR = 0.015;

type TxnSeed = Omit<Transaction, 'fee' | 'postedAt'> & { minutes: number };

const TXN_SEEDS: TxnSeed[] = [
  { id: 'TXN-48213', merchant: 'Fresh Basket Market', category: 'Groceries', bin: '506123', card: '4821', cardType: 'Debit', product: 'Classic', channel: 'POS', amount: 9262, status: 'approved', minutes: 2, reference: '531208847213', authCode: 'A48213', responseCode: '00', responseMessage: 'Approved', location: 'Gulshan, Dhaka' },
  { id: 'TXN-48212', merchant: 'Northwind Online', category: 'E-commerce', bin: '507111', card: '1190', cardType: 'Credit', product: 'Platinum', channel: 'Online', amount: 34430, status: 'approved', minutes: 4, reference: '531208847198', authCode: 'A48212', responseCode: '00', responseMessage: 'Approved', location: 'Online (3-D Secure)' },
  { id: 'TXN-48211', merchant: 'SkyBridge Airlines', category: 'Travel', bin: '509999', card: '7734', cardType: 'Credit', product: 'Signature', channel: 'Online', amount: 137280, status: 'pending', minutes: 7, reference: '531208847176', authCode: 'A48211', responseCode: '--', responseMessage: 'Awaiting settlement', location: 'Online (3-D Secure)' },
  { id: 'TXN-48210', merchant: 'Metro Fuel Station', category: 'Fuel', bin: '506456', card: '3306', cardType: 'Prepaid', product: 'Payroll', channel: 'POS', amount: 6760, status: 'approved', minutes: 9, reference: '531208847152', authCode: 'A48210', responseCode: '00', responseMessage: 'Approved', location: 'Banani, Dhaka' },
  { id: 'TXN-48209', merchant: 'Lumen Electronics', category: 'E-commerce', bin: '506789', card: '5518', cardType: 'Debit', product: 'Gold', channel: 'Online', amount: 98890, status: 'declined', minutes: 12, reference: '531208847131', authCode: '------', responseCode: '59', responseMessage: 'Suspected fraud', location: 'Online (3-D Secure)' },
  { id: 'TXN-48208', merchant: 'Harbor Grill', category: 'Dining', bin: '506123', card: '2047', cardType: 'Debit', product: 'Classic', channel: 'POS', amount: 5258, status: 'approved', minutes: 15, reference: '531208847109', authCode: 'A48208', responseCode: '00', responseMessage: 'Approved', location: 'Agrabad, Chattogram' },
  { id: 'TXN-48207', merchant: 'City Power & Water', category: 'Utilities', bin: '506789', card: '9921', cardType: 'Debit', product: 'Gold', channel: 'Online', amount: 14110, status: 'approved', minutes: 21, reference: '531208847085', authCode: 'A48207', responseCode: '00', responseMessage: 'Approved', location: 'Online (3-D Secure)' },
  { id: 'TXN-48206', merchant: 'QuickCash ATM #204', category: 'Cash', bin: '508222', card: '6602', cardType: 'Prepaid', product: 'Gift', channel: 'ATM', amount: 22000, status: 'declined', minutes: 26, reference: '531208847062', authCode: '------', responseCode: '51', responseMessage: 'Insufficient funds', location: 'Motijheel, Dhaka' },
  { id: 'TXN-48205', merchant: 'Green Leaf Grocers', category: 'Groceries', bin: '506123', card: '4821', cardType: 'Debit', product: 'Classic', channel: 'POS', amount: 3976, status: 'approved', minutes: 31, reference: '531208847040', authCode: 'A48205', responseCode: '00', responseMessage: 'Approved', location: 'Dhanmondi, Dhaka' },
  { id: 'TXN-48204', merchant: 'Voyage Hotels', category: 'Travel', bin: '507111', card: '1190', cardType: 'Credit', product: 'Platinum', channel: 'Online', amount: 59400, status: 'pending', minutes: 38, reference: '531208847017', authCode: 'A48204', responseCode: '--', responseMessage: 'Awaiting settlement', location: 'Online (3-D Secure)' },
];

export const RECENT_TRANSACTIONS: Transaction[] = TXN_SEEDS.map(({ minutes, ...txn }) => ({
  ...txn,
  postedAt: minutesAgo(minutes),
  fee: txn.status === 'approved' ? Math.round(txn.amount * MDR) : 0,
}));

export function timeAgo(date: Date): string {
  const minutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60_000));
  if (minutes < 60) {
    return `${minutes} min ago`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours} hr ago`;
}

export const ALERTS: AlertItem[] = [
  { id: 1, severity: 'high', title: 'Velocity spike on BIN 506456', detail: '312 attempts in 10 min from 4 IP ranges', time: '3 min ago' },
  { id: 2, severity: 'high', title: 'Card-testing pattern detected', detail: '27 micro-charges on merchant Lumen Electronics', time: '18 min ago' },
  { id: 3, severity: 'medium', title: 'International decline rate up 2.4%', detail: 'Concentrated in UK and UAE corridors', time: '1 hr ago' },
  { id: 4, severity: 'low', title: '55 cards awaiting activation > 7 days', detail: 'Reminder campaign is scheduled for 9:00 AM', time: '3 hr ago' },
];
