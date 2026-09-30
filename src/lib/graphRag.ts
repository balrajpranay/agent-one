import neo4j, { Driver } from 'neo4j-driver';
import {
  DocumentAnalysis,
  GraphData,
  GraphNode,
  GraphRelationship,
  GraphPath,
  CommunitySummary
} from './types';

let neo4jDriverInstance: Driver | null = null;

function getNeo4jDriver(): Driver | null {
  const isEnabled = process.env.GRAPH_RAG_ENABLED === 'true';
  const uri = process.env.NEO4J_URI?.trim();
  const username = process.env.NEO4J_USERNAME?.trim() || 'neo4j';
  const password = process.env.NEO4J_PASSWORD?.trim();

  if (!isEnabled || !uri || !password) {
    return null;
  }

  if (!neo4jDriverInstance) {
    try {
      neo4jDriverInstance = neo4j.driver(uri, neo4j.auth.basic(username, password));
    } catch (err) {
      console.warn('[GraphRAG] Failed to initialize Neo4j driver, will use memory fallback:', err);
      return null;
    }
  }

  return neo4jDriverInstance;
}

// In-memory Graph Store for fallback & offline graph traversal
interface MemoryGraph {
  nodes: Map<string, GraphNode>;
  relationships: GraphRelationship[];
  communities: CommunitySummary[];
}

const memoryGraphsByWorkspace = new Map<string, MemoryGraph>();

function getOrCreateMemoryGraph(workspaceId: string): MemoryGraph {
  if (!memoryGraphsByWorkspace.has(workspaceId)) {
    memoryGraphsByWorkspace.set(workspaceId, {
      nodes: new Map(),
      relationships: [],
      communities: []
    });
  }
  return memoryGraphsByWorkspace.get(workspaceId)!;
}

import { buildGraphFromAnalysis } from './graphTransformer';
export { buildGraphFromAnalysis };

/**
 * Upsert Graph Data into Neo4j with idempotent MERGE, or save to in-memory Graph Store
 */
export async function upsertGraphData(doc: DocumentAnalysis): Promise<GraphData> {
  const graph = buildGraphFromAnalysis(doc);
  const workspaceId = doc.workspaceId || 'default';

  // Always update in-memory graph store as dependable fallback
  const memGraph = getOrCreateMemoryGraph(workspaceId);
  graph.nodes.forEach((n) => memGraph.nodes.set(n.id, n));
  graph.relationships.forEach((r) => {
    if (!memGraph.relationships.some((existing) => existing.id === r.id)) {
      memGraph.relationships.push(r);
    }
  });
  if (graph.communities) {
    memGraph.communities = graph.communities;
  }

  // Attempt Neo4j upsert if driver is configured
  const driver = getNeo4jDriver();
  if (driver) {
    const session = driver.session();
    try {
      // Upsert Document node
      await session.executeWrite((tx) =>
        tx.run(
          `MERGE (d:Document {id: $id})
           SET d.title = $title, d.domain = $domain, d.workspaceId = $workspaceId`,
          {
            id: doc.id,
            title: doc.name,
            domain: doc.detectedDomain,
            workspaceId
          }
        )
      );

      // Upsert Nodes
      for (const node of graph.nodes) {
        if (node.label === 'Document') continue;
        await session.executeWrite((tx) =>
          tx.run(
            `MERGE (n:${node.label} {id: $id})
             SET n += $props`,
            { id: node.id, props: node.properties }
          )
        );
      }

      // Upsert Relationships
      for (const rel of graph.relationships) {
        await session.executeWrite((tx) =>
          tx.run(
            `MATCH (a {id: $sourceId}), (b {id: $targetId})
             MERGE (a)-[r:${rel.type}]->(b)`,
            { sourceId: rel.sourceId, targetId: rel.targetId }
          )
        );
      }
      console.log(`[GraphRAG] Successfully synced document ${doc.id} to Neo4j`);
    } catch (err) {
      console.warn('[GraphRAG] Neo4j upsert failed, continuing with in-memory graph:', err);
    } finally {
      await session.close();
    }
  }

  return graph;
}

/**
 * Hybrid Context Retrieval: vector chunks + graph entity traversal paths + community summaries
 */
export async function retrieveHybridContext(
  workspaceId: string,
  query: string,
  doc: DocumentAnalysis
): Promise<{
  vectorChunks: Array<{ documentId: string; page: number; text: string }>;
  graphPaths: GraphPath[];
  communitySummaries: CommunitySummary[];
}> {
  const graph = doc.graphData || buildGraphFromAnalysis(doc);
  const lowerQuery = query.toLowerCase();

  // 1. Vector chunks from document text
  const vectorChunks: Array<{ documentId: string; page: number; text: string }> = [];
  (doc.pageTexts || []).forEach((pt) => {
    if (lowerQuery.split(' ').some((word) => word.length > 3 && pt.text.toLowerCase().includes(word))) {
      vectorChunks.push({
        documentId: doc.id,
        page: pt.page,
        text: pt.text.slice(0, 1000)
      });
    }
  });

  if (vectorChunks.length === 0 && doc.pageTexts && doc.pageTexts.length > 0) {
    vectorChunks.push({
      documentId: doc.id,
      page: doc.pageTexts[0].page,
      text: doc.pageTexts[0].text.slice(0, 1000)
    });
  }

  // 2. Traversal paths from graph
  const matchedNodes = graph.nodes.filter((n) => {
    const name = String(n.properties?.name || n.properties?.title || '').toLowerCase();
    return lowerQuery.split(' ').some((w) => w.length > 3 && name.includes(w));
  });

  const graphPaths: GraphPath[] = [];
  matchedNodes.forEach((node) => {
    const connectedRels = graph.relationships.filter(
      (r) => r.sourceId === node.id || r.targetId === node.id
    );

    connectedRels.forEach((rel) => {
      const otherId = rel.sourceId === node.id ? rel.targetId : rel.sourceId;
      const otherNode = graph.nodes.find((n) => n.id === otherId);
      if (otherNode) {
        graphPaths.push({
          nodes: [node, otherNode],
          relationships: [rel],
          summary: `${node.properties?.name || node.label} ${rel.type} ${otherNode.properties?.name || otherNode.label}`
        });
      }
    });
  });

  // Limit to top 5 paths
  const topPaths = graphPaths.slice(0, 5);

  return {
    vectorChunks,
    graphPaths: topPaths,
    communitySummaries: graph.communities || []
  };
}
