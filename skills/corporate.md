---
id: corporate
name: Corporate & Business Documents
priority: core
domain_triggers: [MOU, joint venture, subsidiary, board resolution, annual report, business agreement, vendor agreement, SLA, milestone, deliverable, statement of work, shareholder]
panels: [Entity Map, Responsibility Matrix, Commercial Terms, Milestones, Operational Risks]
graph_node_types: [Organization, Subsidiary, Milestone, CommercialTerm, Deliverable]
graph_edge_types: [SUBSIDIARY_OF, RESPONSIBLE_FOR, DELIVERS_BY, COMMITS_TO, DEPENDS_ON]
---

# Corporate & Business Documents

## Activates when
The document describes relationships between organizations: business
agreements, SLAs, statements of work, board resolutions, annual
reports, joint venture / subsidiary structures.

## Extraction targets
- Organizations, subsidiaries, and their relationships
- Business/commercial relationships between named entities
- Responsibilities assigned to each party
- Commercial terms (pricing, revenue share, payment terms)
- Milestones and deliverables with dates
- Financial commitments and their conditions
- Deadlines and dependency chains between milestones
- Operational risks (dependency failures, resourcing gaps, deadline
  conflicts as stated or implied by the document's own schedule)
- Governance relationships (reporting lines, approval authority)

## Risk taxonomy
- **Delivery risk** — milestones with tight or dependent deadlines
- **Commercial risk** — terms that shift cost/exposure to one party
- **Governance risk** — unclear approval authority or reporting lines
- **Dependency risk** — a deliverable blocked on another party's action

## Hidden-clause heuristics
Flag when a passage:
- Assigns a responsibility without a corresponding deadline or
  deliverable definition
- Makes one milestone silently dependent on another without stating it
  as a formal dependency
- Introduces a financial commitment that isn't reflected in the
  document's stated commercial-terms summary

## Guardrails (what this skill must not claim)
- Never assess whether a business arrangement is "good" or "bad" for
  either party — surface the terms, obligations, and risks as stated.
- Never infer undisclosed financial relationships between entities;
  only report what the document establishes.

## Evidence requirements
Every organization, milestone, and commercial term must resolve to a
specific page + bounding box + source text.
