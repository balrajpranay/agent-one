import {
  DocumentAnalysis,
  GraphData,
  GraphNode,
  GraphRelationship,
  CommunitySummary
} from './types';

/**
 * Client-safe pure transformer that constructs GraphData (nodes, relationships, communities)
 * from a structured DocumentAnalysis without any Node.js dependencies.
 */
export function buildGraphFromAnalysis(doc: DocumentAnalysis): GraphData {
  const nodes: GraphNode[] = [];
  const relationships: GraphRelationship[] = [];

  const docNodeId = `doc-${doc.id}`;
  nodes.push({
    id: docNodeId,
    label: 'Document',
    properties: {
      id: doc.id,
      title: doc.name,
      domain: doc.detectedDomain,
      pageCount: doc.pageCount,
      workspaceId: doc.workspaceId || 'default'
    }
  });

  // Entities
  (doc.extractedEntities || []).forEach((ent, idx) => {
    const entId = `ent-${doc.id}-${idx + 1}`;
    nodes.push({
      id: entId,
      label: 'Entity',
      properties: {
        id: entId,
        name: ent.key || ent.value,
        type: ent.category,
        page: ent.page,
        relevance: ent.relevance || 'primary'
      }
    });

    relationships.push({
      id: `rel-doc-ent-${idx + 1}`,
      type: 'DEFINED_IN',
      sourceId: entId,
      targetId: docNodeId
    });
  });

  // Risks
  (doc.trackedRisks || []).forEach((risk, idx) => {
    const riskId = `risk-${doc.id}-${idx + 1}`;
    nodes.push({
      id: riskId,
      label: 'Risk',
      properties: {
        id: riskId,
        title: risk.title,
        severity: risk.riskLevel,
        description: risk.plainEnglish,
        page: risk.page
      }
    });

    relationships.push({
      id: `rel-doc-risk-${idx + 1}`,
      type: 'CARRIES_RISK',
      sourceId: docNodeId,
      targetId: riskId
    });
  });

  // Important Dates
  (doc.trackedDates || []).forEach((dt, idx) => {
    const dateId = `date-${doc.id}-${idx + 1}`;
    nodes.push({
      id: dateId,
      label: 'ImportantDate',
      properties: {
        id: dateId,
        event: dt.event,
        date: dt.date,
        type: dt.type,
        page: dt.page
      }
    });

    relationships.push({
      id: `rel-doc-date-${idx + 1}`,
      type: 'DUE_ON',
      sourceId: docNodeId,
      targetId: dateId
    });
  });

  // Tracked Amounts / Numbers
  (doc.trackedNumbers || []).slice(0, 10).forEach((num, idx) => {
    const numId = `num-${doc.id}-${idx + 1}`;
    nodes.push({
      id: numId,
      label: 'Amount',
      properties: {
        id: numId,
        label: num.label,
        value: String(num.value),
        unit: num.unit || '',
        category: num.category,
        page: num.page
      }
    });

    relationships.push({
      id: `rel-doc-amt-${idx + 1}`,
      type: 'SPECIFIED_IN',
      sourceId: numId,
      targetId: docNodeId
    });
  });

  // Obligations (from legalData if available)
  (doc.legalData?.obligations || []).forEach((ob, idx) => {
    const obId = `ob-${doc.id}-${idx + 1}`;
    nodes.push({
      id: obId,
      label: 'Obligation',
      properties: {
        id: obId,
        party: ob.party,
        description: ob.obligation,
        deadline: ob.deadline,
        page: ob.page || 1
      }
    });

    relationships.push({
      id: `rel-ob-${idx + 1}`,
      type: 'OBLIGATED_TO',
      sourceId: obId,
      targetId: docNodeId
    });
  });

  // Detect simple communities: cluster by domain and topic entities
  const community: CommunitySummary = {
    id: `comm-${doc.id}-1`,
    level: 1,
    name: `${doc.detectedDomain.toUpperCase()} Core Cluster`,
    summary: `Primary entity network for ${doc.name}, focusing on ${doc.summary?.keyTakeaways?.slice(0, 2).join('; ') || 'core subject matter'}.`,
    entityCount: nodes.length
  };

  return {
    nodes,
    relationships,
    communities: [community]
  };
}
