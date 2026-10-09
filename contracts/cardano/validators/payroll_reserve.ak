//// Payroll reserve on Cardano.
////
//// The employer escrows the period's payroll reserve here and anchors the
//// Midnight payroll root for that period in the datum. Individual salaries never
//// touch Cardano: they live as commitments on Midnight and are paid as shielded
//// tokens there. Banks and tax authorities on Cardano can check that the
//// anchored root matches `periodRoots[period]` on the Midnight contract.

use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use aiken/interval
use cardano/address.{from_script, from_verification_key}
use cardano/assets.{from_lovelace, lovelace_of}
use cardano/transaction.{
  InlineDatum, Input, NoDatum, Output, OutputReference, Transaction,
}

pub type PayrollReserve {
  employer: VerificationKeyHash,
  auditor: VerificationKeyHash,
  /// Midnight contract address holding the private payroll ledger.
  midnight_contract: ByteArray,
  /// Payroll period as YYYYMM, e.g. 202605.
  period: Int,
  /// Aggregate shielded pay tokens minted on Midnight for the period.
  budget: Int,
  /// Latest anchored Midnight `periodRoots[period]`.
  payroll_root: ByteArray,
  /// Matching Midnight `periodIssued[period]`.
  payslip_count: Int,
  /// POSIX time (ms) after which the employer may reclaim without the auditor.
  unlock_after: Int,
}

pub type Action {
  /// Employer updates the anchored Midnight root; funds stay in the script.
  Anchor { payroll_root: ByteArray, payslip_count: Int }
  /// Employer and auditor jointly release the reserve after the audit.
  Release
  /// Employer reclaims the reserve once `unlock_after` has passed.
  Reclaim
}

validator payroll_reserve {
  spend(
    datum: Option<PayrollReserve>,
    action: Action,
    own_ref: OutputReference,
    self: Transaction,
  ) {
    expect Some(reserve) = datum
    let signed_by = fn(key) { list.has(self.extra_signatories, key) }

    when action is {
      Anchor { payroll_root, payslip_count } -> {
        expect Some(own_input) = transaction.find_input(self.inputs, own_ref)
        let own_address = own_input.output.address
        expect [continuing] =
          list.filter(self.outputs, fn(o: Output) { o.address == own_address })
        expect InlineDatum(raw) = continuing.datum
        expect next: PayrollReserve = raw

        and {
          signed_by(reserve.employer),
          payslip_count > reserve.payslip_count,
          lovelace_of(continuing.value) >= lovelace_of(own_input.output.value),
          next == PayrollReserve { ..reserve, payroll_root, payslip_count },
        }
      }

      Release -> and {
          signed_by(reserve.employer),
          signed_by(reserve.auditor),
        }

      Reclaim -> and {
          signed_by(reserve.employer),
          interval.is_entirely_after(self.validity_range, reserve.unlock_after),
        }
    }
  }

  else(_) {
    fail
  }
}

// ## Tests

const script_hash = #"0000000000000000000000000000000000000000000000000000beef"

const employer = #"00000000000000000000000000000000000000000000000000000e01"

const auditor = #"00000000000000000000000000000000000000000000000000000a01"

const own_ref = OutputReference { transaction_id: #"01", output_index: 0 }

const reserve =
  PayrollReserve {
    employer,
    auditor,
    midnight_contract: #"cafe",
    period: 202605,
    budget: 250000,
    payroll_root: #"",
    payslip_count: 0,
    unlock_after: 1_800_000_000_000,
  }

fn reserve_output(datum: PayrollReserve, lovelace: Int) -> Output {
  Output {
    address: from_script(script_hash),
    value: from_lovelace(lovelace),
    datum: InlineDatum(datum),
    reference_script: None,
  }
}

fn spend_tx(outputs: List<Output>, signers: List<VerificationKeyHash>) {
  Transaction {
    ..transaction.placeholder,
    inputs: [
      Input { output_reference: own_ref, output: reserve_output(reserve, 50_000_000) },
    ],
    outputs: outputs,
    extra_signatories: signers,
  }
}

fn anchored(root: ByteArray, count: Int) {
  PayrollReserve { ..reserve, payroll_root: root, payslip_count: count }
}

test anchor_updates_root() {
  let tx = spend_tx([reserve_output(anchored(#"aa", 2), 50_000_000)], [employer])
  payroll_reserve.spend(Some(reserve), Anchor(#"aa", 2), own_ref, tx)
}

test anchor_requires_employer() fail {
  let tx = spend_tx([reserve_output(anchored(#"aa", 2), 50_000_000)], [auditor])
  payroll_reserve.spend(Some(reserve), Anchor(#"aa", 2), own_ref, tx)
}

test anchor_cannot_drain_funds() fail {
  let tx = spend_tx([reserve_output(anchored(#"aa", 2), 1_000_000)], [employer])
  payroll_reserve.spend(Some(reserve), Anchor(#"aa", 2), own_ref, tx)
}

test anchor_cannot_rewind_count() fail {
  let tx = spend_tx([reserve_output(anchored(#"aa", 0), 50_000_000)], [employer])
  payroll_reserve.spend(Some(reserve), Anchor(#"aa", 0), own_ref, tx)
}

test anchor_cannot_change_other_fields() fail {
  let tampered = PayrollReserve { ..anchored(#"aa", 2), auditor: employer }
  let tx = spend_tx([reserve_output(tampered, 50_000_000)], [employer])
  payroll_reserve.spend(Some(reserve), Anchor(#"aa", 2), own_ref, tx)
}

test anchor_datum_must_match_redeemer() fail {
  let tx = spend_tx([reserve_output(anchored(#"bb", 2), 50_000_000)], [employer])
  payroll_reserve.spend(Some(reserve), Anchor(#"aa", 2), own_ref, tx)
}

test anchor_needs_single_continuing_output() fail {
  let out = reserve_output(anchored(#"aa", 2), 25_000_000)
  let tx = spend_tx([out, out], [employer])
  payroll_reserve.spend(Some(reserve), Anchor(#"aa", 2), own_ref, tx)
}

test release_with_both_signatures() {
  let payout =
    Output {
      address: from_verification_key(employer),
      value: from_lovelace(50_000_000),
      datum: NoDatum,
      reference_script: None,
    }
  payroll_reserve.spend(
    Some(reserve),
    Release,
    own_ref,
    spend_tx([payout], [employer, auditor]),
  )
}

test release_without_auditor() fail {
  payroll_reserve.spend(Some(reserve), Release, own_ref, spend_tx([], [employer]))
}

test reclaim_after_unlock() {
  let tx =
    Transaction {
      ..spend_tx([], [employer]),
      validity_range: interval.after(reserve.unlock_after + 1),
    }
  payroll_reserve.spend(Some(reserve), Reclaim, own_ref, tx)
}

test reclaim_before_unlock() fail {
  let tx =
    Transaction {
      ..spend_tx([], [employer]),
      validity_range: interval.after(reserve.unlock_after - 1000),
    }
  payroll_reserve.spend(Some(reserve), Reclaim, own_ref, tx)
}

test missing_datum() fail {
  payroll_reserve.spend(None, Release, own_ref, spend_tx([], [employer, auditor]))
}
