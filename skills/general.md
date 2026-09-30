---
id: general
name: General Document (Fallback)
priority: architecture-ready
domain_triggers: []
panels: [Summary, Key Facts, Risks]
graph_node_types: [Entity, Fact, Risk]
graph_edge_types: [MENTIONS, RELATES_TO]
---

# General Document (Fallback)

## Activates when
No other skill's `domain_triggers` match with sufficient confidence.
This skill always produces the three universal panels (Summary, Key
Facts, Risks) so no document is ever left with an empty workspace.

## Extraction targets
- Document purpose and type (best-effort classification)
- Named entities and their apparent role
- Key factual statements
- Any stated risks, conditions, or obligations, generically framed

## Guardrails (what this skill must not claim)
Do not force domain-specific framing (fees, liability, coverage) onto
a document that doesn't clearly belong to one of the specialized
skills. Prefer plain, generic language over guessing a domain.

## Evidence requirements
Every extracted fact must resolve to page + bounding box + source
text, same as every other skill.
