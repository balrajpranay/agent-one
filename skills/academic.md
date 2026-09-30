---
id: academic
name: Academic & Research Documents
priority: architecture-ready
domain_triggers: [abstract, methodology, hypothesis, literature review, dataset, p-value, citation, peer-reviewed, findings, limitations]
panels: [Methodology Summary, Key Findings, Limitations, Citation Map]
graph_node_types: [Author, Finding, Method, Dataset, Citation]
graph_edge_types: [AUTHORED_BY, USES_METHOD, CITES, SUPPORTS_FINDING]
---

# Academic & Research Documents

## Activates when
The document is a research paper, thesis, or academic report with a
methodology and findings structure.

## Extraction targets
- Authors, affiliations, publication venue/date
- Research question / hypothesis
- Methodology and dataset used
- Key findings and stated confidence/significance
- Stated limitations and future-work notes
- Citations and how they relate to claims made

## Risk taxonomy
- **Methodological risk** — small sample size, unstated confounds
- **Generalizability risk** — findings scoped narrowly but stated broadly
- **Citation-support risk** — a claim citing a source that doesn't
  clearly support it

## Guardrails (what this skill must not claim)
Never assert a finding is "correct" or "incorrect" — report what the
paper claims, its stated confidence, and its own listed limitations.

## Evidence requirements
Every finding and methodology claim must resolve to page + bounding
box + source text.
