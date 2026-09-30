import { DocumentAnalysis, DocumentComparison } from './types';

/**
 * Intelligent Document Comparator
 * Performs deep semantic, entity, numerical, date, and risk difference analysis between any two documents.
 */
export function compareDocuments(
  doc1: DocumentAnalysis,
  doc2: DocumentAnalysis
): DocumentComparison {
  const addedItems: { category: string; description: string; page?: number }[] = [];
  const removedItems: { category: string; description: string; page?: number }[] = [];
  const changedValues: { field: string; doc1Value: string; doc2Value: string; significance: 'Major' | 'Minor' | 'Neutral' }[] = [];
  const changedDates: { milestone: string; doc1Date: string; doc2Date: string; changeType: 'Accelerated' | 'Delayed' | 'Modified' }[] = [];
  const riskDifferences: { topic: string; doc1Risk: string; doc2Risk: string; variance: string }[] = [];

  // 1. Compare Entities
  const doc1Entities = doc1.extractedEntities || [];
  const doc2Entities = doc2.extractedEntities || [];
  const doc1EntitiesMap = new Map(doc1Entities.map((e) => [e.key.toLowerCase(), e]));
  const doc2EntitiesMap = new Map(doc2Entities.map((e) => [e.key.toLowerCase(), e]));

  for (const [key, e2] of doc2EntitiesMap.entries()) {
    if (!doc1EntitiesMap.has(key)) {
      addedItems.push({
        category: `Entity (${e2.category})`,
        description: `New ${e2.key}: "${e2.value}"`,
        page: e2.page
      });
    } else {
      const e1 = doc1EntitiesMap.get(key)!;
      if (e1.value.toLowerCase() !== e2.value.toLowerCase()) {
        changedValues.push({
          field: e2.key,
          doc1Value: e1.value,
          doc2Value: e2.value,
          significance: 'Minor'
        });
      }
    }
  }

  for (const [key, e1] of doc1EntitiesMap.entries()) {
    if (!doc2EntitiesMap.has(key)) {
      removedItems.push({
        category: `Entity (${e1.category})`,
        description: `Removed ${e1.key} (was: "${e1.value}")`,
        page: e1.page
      });
    }
  }

  // 2. Compare Metrics & Numerical Values
  const doc1Metrics = doc1.metrics || [];
  const doc2Metrics = doc2.metrics || [];
  const doc1MetricsMap = new Map(doc1Metrics.map((m) => [m.label.toLowerCase(), m]));
  const doc2MetricsMap = new Map(doc2Metrics.map((m) => [m.label.toLowerCase(), m]));

  for (const [label, m2] of doc2MetricsMap.entries()) {
    if (doc1MetricsMap.has(label)) {
      const m1 = doc1MetricsMap.get(label)!;
      if (m1.value !== m2.value) {
        changedValues.push({
          field: m2.label,
          doc1Value: m1.value,
          doc2Value: m2.value,
          significance: 'Major'
        });
      }
    } else {
      addedItems.push({
        category: 'Metric',
        description: `${m2.label}: ${m2.value} (${m2.subtext || 'New signal'})`,
        page: m2.page
      });
    }
  }

  // 3. Compare Dates & Milestones
  const doc1Dates = doc1.trackedDates || [];
  const doc2Dates = doc2.trackedDates || [];
  const doc1DatesMap = new Map(doc1Dates.map((d) => [d.event.toLowerCase(), d]));

  for (const d2 of doc2Dates) {
    const d1 = doc1DatesMap.get(d2.event.toLowerCase());
    if (d1) {
      if (d1.date !== d2.date) {
        changedDates.push({
          milestone: d2.event,
          doc1Date: d1.date,
          doc2Date: d2.date,
          changeType: 'Modified'
        });
      }
    } else {
      addedItems.push({
        category: 'Timeline Milestone',
        description: `${d2.event}: ${d2.date}`,
        page: d2.page
      });
    }
  }

  // 4. Compare Risks & Concerns
  const doc1Risks = doc1.trackedRisks || (doc1.legalData?.riskyClauses?.map((c) => ({
    id: c.id,
    title: c.clause,
    riskLevel: c.riskLevel,
    plainEnglish: c.plainEnglish,
    page: c.page
  }))) || [];

  const doc2Risks = doc2.trackedRisks || (doc2.legalData?.riskyClauses?.map((c) => ({
    id: c.id,
    title: c.clause,
    riskLevel: c.riskLevel,
    plainEnglish: c.plainEnglish,
    page: c.page
  }))) || [];

  const doc1RiskMap = new Map(doc1Risks.map((r) => [r.title.toLowerCase(), r]));
  for (const r2 of doc2Risks) {
    const r1 = doc1RiskMap.get(r2.title.toLowerCase());
    if (r1) {
      if (r1.riskLevel !== r2.riskLevel) {
        riskDifferences.push({
          topic: r2.title,
          doc1Risk: `${r1.riskLevel} Risk`,
          doc2Risk: `${r2.riskLevel} Risk`,
          variance: `Risk adjusted from ${r1.riskLevel} to ${r2.riskLevel}`
        });
      }
    } else {
      riskDifferences.push({
        topic: r2.title,
        doc1Risk: 'Not present',
        doc2Risk: `${r2.riskLevel} Risk`,
        variance: `New risk identified: ${r2.plainEnglish}`
      });
    }
  }

  // 5. Compute Similarity Score
  const totalChecks = Math.max(1, (doc1Entities.length + doc2Entities.length + doc1Metrics.length + doc2Metrics.length) / 2);
  const diffsCount = addedItems.length + removedItems.length + changedValues.length + changedDates.length;
  const similarityScore = Math.max(12, Math.min(99, Math.round(100 - (diffsCount / (totalChecks + diffsCount)) * 80)));

  // 6. Build Verdict & Executive Summary
  const isSameDomain = doc1.detectedDomain === doc2.detectedDomain;
  let verdict = '';
  if (similarityScore > 85) {
    verdict = `High Structural Alignment (${similarityScore}% match${isSameDomain ? ', same domain' : ''}). Minimal variances detected across primary terms and covenants.`;
  } else if (similarityScore > 55) {
    verdict = `Moderate Revisions (${similarityScore}% match). Identified ${changedValues.length} value shifts and ${addedItems.length} added structural elements. Review highlighted diffs.`;
  } else {
    verdict = `Significant Divergence (${similarityScore}% match). These documents exhibit distinct structural paradigms (${doc1.detectedDomain} vs ${doc2.detectedDomain}).`;
  }

  const comparisonSummary = `Compared **${doc1.name}** (${doc1.detectedDomain.toUpperCase()}) against **${doc2.name}** (${doc2.detectedDomain.toUpperCase()}). Found ${addedItems.length} added elements, ${removedItems.length} removed clauses, ${changedValues.length} value shifts, and ${changedDates.length} modified milestones. Overall structural correlation is **${similarityScore}%**.`;

  return {
    doc1Id: doc1.id,
    doc1Name: doc1.name,
    doc2Id: doc2.id,
    doc2Name: doc2.name,
    comparisonSummary,
    similarityScore,
    addedItems,
    removedItems,
    changedValues,
    changedDates,
    riskDifferences,
    verdict
  };
}
