'use client';

import React, { useState } from 'react';
import { GraphData, GraphNode, GraphRelationship } from '@/lib/types';
import { Network, ZoomIn, ZoomOut, Maximize2, Info, Layers } from 'lucide-react';

interface EntityGraphVisualizerProps {
  graphData?: GraphData;
  onNodeClick?: (node: GraphNode) => void;
}

export default function EntityGraphVisualizer({ graphData, onNodeClick }: EntityGraphVisualizerProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="p-8 text-center bg-neutral-50 dark:bg-[#12141a] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-400 text-xs">
        <Network className="w-8 h-8 text-neutral-400 mx-auto mb-2 opacity-50" />
        No knowledge graph nodes or relationships generated yet.
      </div>
    );
  }

  const nodes = graphData.nodes;
  const relationships = graphData.relationships;

  // Simple layout calculation: Circular or force distribution
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.38;

  const nodePositions = new Map<string, { x: number; y: number }>();
  // Place 'Document' at center
  const docNode = nodes.find((n) => n.label === 'Document');
  if (docNode) {
    nodePositions.set(docNode.id, { x: centerX, y: centerY });
  }

  const outerNodes = nodes.filter((n) => n.label !== 'Document');
  outerNodes.forEach((node, idx) => {
    const angle = (idx / outerNodes.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    nodePositions.set(node.id, { x, y });
  });

  const getNodeColor = (label: string) => {
    switch (label) {
      case 'Document':
        return '#00FF85';
      case 'Risk':
        return '#FF5A4E';
      case 'ImportantDate':
        return '#F2B33D';
      case 'Amount':
        return '#10B981';
      case 'Obligation':
        return '#38BDF8';
      default:
        return '#A78BFA';
    }
  };

  return (
    <div className="bg-white dark:bg-[#12141a] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 p-4 flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
          <span className="font-semibold text-neutral-900 dark:text-white">
            Neo4j Knowledge Graph & Entity Network
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 font-semibold">
            {nodes.length} Nodes • {relationships.length} Edges
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(Math.max(0.7, zoom - 0.15))}
            className="p-1 rounded bg-neutral-100 dark:bg-white/[0.06] hover:bg-neutral-200 dark:hover:bg-white/[0.1] text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono px-1 text-neutral-600 dark:text-neutral-300">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(1.5, zoom + 0.15))}
            className="p-1 rounded bg-neutral-100 dark:bg-white/[0.06] hover:bg-neutral-200 dark:hover:bg-white/[0.1] text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center bg-neutral-950 rounded-xl border border-neutral-800 p-2 relative min-h-[360px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-h-[460px] transition-transform"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Edges */}
          {relationships.map((rel) => {
            const p1 = nodePositions.get(rel.sourceId);
            const p2 = nodePositions.get(rel.targetId);
            if (!p1 || !p2) return null;

            return (
              <g key={rel.id}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#333842"
                  strokeWidth="1.5"
                  strokeDasharray="4,2"
                />
                <text
                  x={(p1.x + p2.x) / 2}
                  y={(p1.y + p2.y) / 2 - 4}
                  fill="#94a3b8"
                  fontSize="8"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {rel.type}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;
            const isSelected = selectedNode?.id === node.id;
            const color = getNodeColor(node.label);

            return (
              <g
                key={node.id}
                onClick={() => {
                  setSelectedNode(node);
                  if (onNodeClick) onNodeClick(node);
                }}
                className="cursor-pointer group"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={node.label === 'Document' ? 22 : 14}
                  fill="#14151b"
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all hover:scale-110"
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  fill="#ffffff"
                  fontSize={node.label === 'Document' ? '9' : '8'}
                  textAnchor="middle"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {node.label === 'Document' ? 'DOC' : node.label.slice(0, 3).toUpperCase()}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 26}
                  fill="#cbd5e1"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                  pointerEvents="none"
                >
                  {String(node.properties?.name || node.properties?.title || node.label).slice(0, 14)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Box */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 bg-[#14151b]/95 border border-emerald-500/40 p-3 rounded-xl backdrop-blur-md text-xs space-y-1 shadow-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold text-emerald-400 dark:text-[#00FF85] font-mono">
                :{selectedNode.label} Node
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-neutral-400 hover:text-white text-[10px] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-white font-semibold">
              {String(selectedNode.properties?.name || selectedNode.properties?.title || selectedNode.id)}
            </p>
            <div className="text-[10px] font-mono text-neutral-400">
              {JSON.stringify(selectedNode.properties)}
            </div>
          </div>
        )}
      </div>

      {/* Community Summaries */}
      {graphData.communities && graphData.communities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            GraphRAG Community Detection Summary:
          </span>
          <p className="text-neutral-600 dark:text-neutral-300 text-xs">
            {graphData.communities[0].summary}
          </p>
        </div>
      )}
    </div>
  );
}
