---
id: finance
name: Finance & Investment Documents
priority: core
domain_triggers: [prospectus, mutual fund, investment, brokerage, term sheet, bond, NAV, expense ratio, redemption, lock-in, loan agreement, bank statement, credit facility, securities, portfolio, KYC, demat, exit load]
panels: [Fee Schedule, Risk Matrix, Investment Terms, Important Dates, Hidden Financial Clauses]
graph_node_types: [Instrument, Issuer, FeeItem, RedemptionRule, LockInPeriod, PaymentSchedule]
graph_edge_types: [ISSUES, CHARGES, GOVERNED_BY, MATURES_ON, REDEEMABLE_UNDER]
---

# Finance & Investment Documents

## Activates when
The document is a stock-market, investment, banking, or lending
instrument: prospectuses, term sheets, mutual fund fact sheets, bank
statements, loan/credit agreements, brokerage account documents.

## Extraction targets
- Product/instrument name and type
- Issuer / lender / fund house
- Parties (borrower, lender, investor, guarantor)
- Investment amount / principal
- Fees, charges, expense ratios, recurring costs
- Redemption / exit rules, exit load, lock-in periods
- Payment and repayment schedules
- Important dates (maturity, NAV cutoffs, EMI dates, review dates)
- Risk disclosures as stated in the document
- Penalties, prepayment charges, default conditions
- Conditions and exceptions attached to returns or repayment
- Liquidity constraints
- Interest rate type (fixed/floating) and reset conditions

## Risk taxonomy
Classify each extracted risk into one of:
- **Market risk** — value/return tied to market movement
- **Liquidity risk** — restrictions on withdrawal/redemption/lock-in
- **Credit/counterparty risk** — issuer or borrower default exposure
- **Fee/cost risk** — costs that erode stated returns
- **Structural risk** — conditions that change terms (step-up rates,
  auto-renewal, conditional fee changes)

Every risk must carry a severity (`critical` / `medium` / `low`) based
on what the document itself states, not on external market judgment.

## Hidden-clause heuristics
Flag as a hidden/easy-to-miss clause when a passage:
- Introduces a fee or charge not mentioned in the headline terms
- Changes the effective lock-in or exit conditions from what a summary
  paragraph implies
- Converts a stated fixed rate into a conditional/variable one under
  specific triggers
- Auto-renews an investment or converts it into a different product on
  a trigger date
State plainly *why* the clause is easy to overlook — do not speculate
about issuer intent.

## Guardrails (what this skill must not claim)
- Never answer "should I invest in this" as a recommendation. Instead:
  restate what the document says, the risks it discloses, and the
  conditions attached — let the user decide.
- Never estimate future returns beyond what the document itself
  projects or discloses.
- Never imply regulatory approval/endorsement unless the document
  explicitly states it, with citation.

## Evidence requirements
Every fee, rate, date, and risk statement must resolve to a specific
page + bounding box + source text. If a number appears only in a table
that couldn't be parsed with confidence, mark it `low confidence`
rather than guessing the value.
