---
id: insurance
name: Insurance Policies
priority: architecture-ready
domain_triggers: [policy, premium, sum insured, exclusion, rider, deductible, claim, insurer, policyholder, waiting period, coverage]
panels: [Coverage Summary, Exclusions, Premium Schedule, Claim Conditions]
graph_node_types: [Policy, Coverage, Exclusion, Rider, ClaimCondition]
graph_edge_types: [COVERS, EXCLUDES, RIDER_TO, PAYABLE_UNDER]
---

# Insurance Policies

## Activates when
The document is an insurance policy, certificate of insurance, or
policy schedule.

## Extraction targets
- Policyholder, insurer, sum insured, premium amount and frequency
- Coverage inclusions and named exclusions
- Riders and their conditions
- Waiting periods, deductibles, co-pay
- Claim conditions and required documentation
- Renewal terms and grace periods

## Risk taxonomy
- **Coverage gap risk** — exclusions that narrow a headline coverage claim
- **Lapse risk** — grace period / renewal conditions
- **Claim-denial risk** — conditions that could void a claim

## Hidden-clause heuristics
Flag exclusions or waiting-period conditions that materially narrow a
coverage statement made earlier in the document.

## Guardrails (what this skill must not claim)
Never advise on whether coverage is adequate for the user's situation
— state what is and isn't covered, as written.

## Evidence requirements
Every coverage/exclusion statement must resolve to page + bounding box
+ source text.
