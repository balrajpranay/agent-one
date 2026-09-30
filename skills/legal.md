---
id: legal
name: Legal Agreements & Contracts
priority: core
domain_triggers: [agreement, contract, lease, NDA, MOU, terms and conditions, indemnity, liability, termination, arbitration, jurisdiction, governing law, party, whereas, hereinafter]
panels: [Parties & Liability Matrix, Obligation Map, Termination Conditions, Renewal, Key Clauses]
graph_node_types: [Party, Obligation, LiabilityClause, TerminationClause, NoticePeriod]
graph_edge_types: [PARTY_TO, OBLIGATED_TO, LIABLE_FOR, TERMINATES_UNDER, NOTICE_REQUIRED_BY]
---

# Legal Agreements & Contracts

## Activates when
The document is a contract, lease, NDA, MOU, terms-of-service
document, or any agreement structured around parties, obligations,
and governing terms.

## Extraction targets
- Parties and their defined roles
- Obligations and rights of each party
- Liability and indemnity clauses
- Termination and renewal conditions, notice periods
- Payment obligations tied to the agreement
- Governing law and jurisdiction
- Confidentiality terms
- Exceptions, carve-outs, and defined terms
- Assignment/transfer and amendment clauses

## Risk taxonomy
- **Liability exposure** — one-sided indemnity, uncapped liability
- **Termination risk** — one-sided or ambiguous termination rights
- **Renewal risk** — auto-renewal without clear opt-out
- **Compliance risk** — obligations that conflict with stated exceptions
- **Ambiguity risk** — terms defined inconsistently across the document

## Hidden-clause heuristics
Flag when a passage:
- Shifts liability or indemnity disproportionately onto one party
  relative to the document's framing elsewhere
- Auto-renews the agreement or extends its term without an explicit,
  easy-to-find opt-out mechanism
- Narrows a right granted earlier in the document through a later
  exception or carve-out
- Changes governing law/jurisdiction from what's implied by the
  parties' stated locations

## Guardrails (what this skill must not claim)
- Never present output as legal advice or a legal opinion. State what
  the document says and where; do not predict enforceability or
  litigation outcomes.
- Never assume a term is "standard" or "unusual" without qualifying
  that this is a textual observation, not a legal judgment.

## Evidence requirements
Every obligation, liability statement, and date must resolve to a
specific page + bounding box + source text, including the clause
number/heading where present.
