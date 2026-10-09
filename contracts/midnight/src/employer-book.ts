// The employer's off-chain book: salary rules, the opening of every payslip it
// issued, and the opening of each period's running total. Builds the private
// state each employer circuit needs and the updated book after it succeeds.

import { pureCircuits, type PayslipOpening, type SalaryRules, type TotalOpening } from './managed/payroll/contract/index.js';
import { toHex, type PayrollPrivateState } from './witnesses';

export type EmployerBook = {
  readonly rules: SalaryRules;
  readonly issued: Readonly<Record<string, PayslipOpening>>; // payslipId hex -> opening
  readonly totals: Readonly<Record<string, TotalOpening>>; // period -> running total opening
};

export const createEmployerBook = (rules: SalaryRules): EmployerBook => ({ rules, issued: {}, totals: {} });

type Prepared = { privateState: PayrollPrivateState; next: EmployerBook };

const base = (book: EmployerBook, secretKey: Uint8Array): PayrollPrivateState => ({
  secretKey,
  openings: {},
  rules: book.rules,
  totals: book.totals,
});

export function prepareSetRules(book: EmployerBook, secretKey: Uint8Array): Prepared {
  return { privateState: base(book, secretKey), next: book };
}

/** Private state for issuePayslip, and the book to keep once it succeeds. */
export function prepareIssue(
  book: EmployerBook,
  secretKey: Uint8Array,
  employeePk: Uint8Array,
  period: bigint,
  opening: PayslipOpening,
  salt: Uint8Array = crypto.getRandomValues(new Uint8Array(32)),
): Prepared {
  const id = toHex(pureCircuits.payslipId(employeePk, period));
  const p = period.toString();
  const replaced = book.issued[id];
  const previousTotal = book.totals[p]?.total ?? 0n;
  const total = previousTotal + opening.details.net - (replaced?.details.net ?? 0n);
  return {
    privateState: {
      ...base(book, secretKey),
      openings: { [id]: opening },
      replaced: replaced ? { [id]: replaced } : {},
      nextTotalSalts: { [p]: salt },
    },
    next: {
      ...book,
      issued: { ...book.issued, [id]: opening },
      totals: { ...book.totals, [p]: { total, salt } },
    },
  };
}

export function prepareClose(book: EmployerBook, secretKey: Uint8Array): Prepared {
  return { privateState: base(book, secretKey), next: book };
}

export const totalOf = (book: EmployerBook, period: bigint) => book.totals[period.toString()]?.total ?? 0n;
