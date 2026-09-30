'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  label: string;
  category: 'core' | 'document' | 'concept' | 'satellite';
  color: string;
  glowColor: string;
  connections: number[];
  orbitAngle?: number;
  orbitSpeed?: number;
  orbitRadius?: number;
  hubIndex?: number;
}

interface Particle {
  sourceIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export default function NeuralGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [hoveredNode, setHoveredNode] = useState<{
    label: string;
    category: string;
    description: string;
    x: number;
    y: number;
  } | null>(null);
  const hoveredNodeRef = useRef<{ label?: string } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Dynamic hubs based on light / dark mode
    const hubs = isLight
      ? [
          { x: 0.38, y: 0.42, color: '#059669', glow: 'rgba(5, 150, 105, 0.35)', label: 'Agent One Core' },
          { x: 0.72, y: 0.32, color: '#0284c7', glow: 'rgba(2, 132, 199, 0.35)', label: 'Knowledge Graph' },
          { x: 0.58, y: 0.72, color: '#2563eb', glow: 'rgba(37, 99, 235, 0.35)', label: 'Vector Hybrid' },
          { x: 0.22, y: 0.68, color: '#7c3aed', glow: 'rgba(124, 58, 237, 0.35)', label: 'Document Graph' }
        ]
      : [
          { x: 0.38, y: 0.42, color: '#00FF85', glow: 'rgba(0, 255, 133, 0.4)', label: 'Agent One Core' },
          { x: 0.72, y: 0.32, color: '#00D2FF', glow: 'rgba(0, 210, 255, 0.4)', label: 'Knowledge Graph' },
          { x: 0.58, y: 0.72, color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)', label: 'Vector Hybrid' },
          { x: 0.22, y: 0.68, color: '#A855F7', glow: 'rgba(168, 85, 247, 0.4)', label: 'Document Graph' }
        ];

    const nodes: Node[] = [];
    const particles: Particle[] = [];

    // Create 4 main hubs
    hubs.forEach((hub) => {
      nodes.push({
        x: hub.x * width,
        y: hub.y * height,
        vx: 0,
        vy: 0,
        radius: 7,
        baseRadius: 7,
        label: hub.label,
        category: 'core',
        color: hub.color,
        glowColor: hub.glow,
        connections: []
      });
    });

    // Connect core hubs together
    nodes[0].connections.push(1, 2, 3);
    nodes[1].connections.push(0, 2);
    nodes[2].connections.push(0, 1, 3);
    nodes[3].connections.push(0, 2);

    // Knowledge & Document Entities (Satellites)
    const entities = [
      { label: 'Commercial Lease.docx', cat: 'document', hub: 0 },
      { label: 'Liabilities Matrix', cat: 'concept', hub: 0 },
      { label: 'Spatial Citations', cat: 'concept', hub: 0 },
      { label: 'Balance Sheet Q4.xlsx', cat: 'document', hub: 2 },
      { label: 'Disputed Fee Detection', cat: 'concept', hub: 2 },
      { label: 'Cash Flow Synthesis', cat: 'concept', hub: 2 },
      { label: 'ArXiv 2408.0124', cat: 'document', hub: 1 },
      { label: 'Entity Extraction', cat: 'concept', hub: 1 },
      { label: 'Temporal Graph Rerank', cat: 'concept', hub: 1 },
      { label: 'FastAPI Spec.json', cat: 'document', hub: 3 },
      { label: 'MCP Protocol Bus', cat: 'concept', hub: 3 },
      { label: 'Multi-Agent Swarm', cat: 'concept', hub: 0 },
      { label: 'Zero Retention Vault', cat: 'concept', hub: 3 }
    ];

    entities.forEach((ent, i) => {
      const hubIdx = ent.hub;
      const angle = (i * ((2 * Math.PI) / entities.length)) + Math.random() * 0.2;
      const dist = 60 + Math.random() * 85;
      const hX = hubs[hubIdx].x * width;
      const hY = hubs[hubIdx].y * height;

      const nodeIdx = nodes.length;
      nodes.push({
        x: hX + Math.cos(angle) * dist,
        y: hY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: ent.cat === 'document' ? 4.5 : 3.5,
        baseRadius: ent.cat === 'document' ? 4.5 : 3.5,
        label: ent.label,
        category: ent.cat as any,
        color: ent.cat === 'document' ? (isLight ? '#0f172a' : '#FFFFFF') : hubs[hubIdx].color,
        glowColor: hubs[hubIdx].glow,
        connections: [hubIdx],
        orbitAngle: angle,
        orbitSpeed: 0.002 * (i % 2 === 0 ? 1 : -1),
        orbitRadius: dist,
        hubIndex: hubIdx
      });

      nodes[hubIdx].connections.push(nodeIdx);

      if (i % 3 === 0 && nodeIdx > 4) {
        const otherHub = (hubIdx + 1) % 4;
        nodes[nodeIdx].connections.push(otherHub);
        nodes[otherHub].connections.push(nodeIdx);
      }
    });

    // Dandelion radiating points
    const dandelionPointsCount = 55;
    for (let d = 0; d < dandelionPointsCount; d++) {
      const hubIdx = d % hubs.length;
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 140;
      const hX = hubs[hubIdx].x * width;
      const hY = hubs[hubIdx].y * height;

      const satIdx = nodes.length;
      nodes.push({
        x: hX + Math.cos(angle) * dist,
        y: hY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        radius: 1.5 + Math.random() * 1.5,
        baseRadius: 1.5 + Math.random() * 1.5,
        label: '',
        category: 'satellite',
        color: hubs[hubIdx].color,
        glowColor: 'transparent',
        connections: [hubIdx],
        orbitAngle: angle,
        orbitSpeed: (0.001 + Math.random() * 0.0015) * (d % 2 === 0 ? 1 : -1),
        orbitRadius: dist,
        hubIndex: hubIdx
      });
      nodes[hubIdx].connections.push(satIdx);
    }

    // Spawn traveling particles
    for (let p = 0; p < 16; p++) {
      const src = Math.floor(Math.random() * 4);
      const conns = nodes[src].connections;
      const tgt = conns[Math.floor(Math.random() * conns.length)] || 0;
      particles.push({
        sourceIndex: src,
        targetIndex: tgt,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
        color: nodes[src].color
      });
    }

    // Mouse interaction
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      let found = false;
      for (const node of nodes) {
        if (!node.label) continue;
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 18) {
          const hoveredObj = {
            label: node.label,
            category: node.category.toUpperCase(),
            description:
              node.category === 'core'
                ? 'Primary Agentic Reasoning Core & Orchestrator'
                : node.category === 'document'
                ? 'Ingested Multi-Tiered Document Asset'
                : 'Extracted Entity with Spatial Evidence Grounding',
            x: node.x,
            y: node.y
          };
          hoveredNodeRef.current = hoveredObj;
          setHoveredNode(hoveredObj);
          found = true;
          break;
        }
      }
      if (!found) {
        hoveredNodeRef.current = null;
        setHoveredNode(null);
      }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      hoveredNodeRef.current = null;
      setHoveredNode(null);
    };

    const canvasEl = canvas;
    canvasEl.addEventListener('mousemove', handleMouseMove);
    canvasEl.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const render = () => {
      try {
        time += 0.01;
        ctx.clearRect(0, 0, width, height);

        // Update satellite nodes along orbital paths
        for (let i = 4; i < nodes.length; i++) {
          const node = nodes[i];
          if (node.orbitAngle !== undefined && node.orbitSpeed !== undefined && node.orbitRadius !== undefined && node.hubIndex !== undefined) {
            node.orbitAngle += node.orbitSpeed;
            const h = hubs[node.hubIndex];
            const targetX = h.x * width + Math.cos(node.orbitAngle) * node.orbitRadius;
            const targetY = h.y * height + Math.sin(node.orbitAngle) * node.orbitRadius;

            // Repel from mouse slightly
            const dmx = targetX - mouseX;
            const dmy = targetY - mouseY;
            const mDist = Math.hypot(dmx, dmy);
            if (mDist < 80) {
              const force = (80 - mDist) / 80;
              node.x = targetX + (dmx / mDist) * force * 15;
              node.y = targetY + (dmy / mDist) * force * 15;
            } else {
              node.x += (targetX - node.x) * 0.1;
              node.y += (targetY - node.y) * 0.1;
            }
          }
        }

        // Draw Ambient Radial Fog
        const radialGradient = ctx.createRadialGradient(
          nodes[0].x,
          nodes[0].y,
          10,
          nodes[0].x,
          nodes[0].y,
          width * 0.45
        );
        radialGradient.addColorStop(0, isLight ? 'rgba(5, 150, 105, 0.06)' : 'rgba(0, 255, 133, 0.06)');
        radialGradient.addColorStop(0.5, isLight ? 'rgba(2, 132, 199, 0.03)' : 'rgba(0, 210, 255, 0.03)');
        radialGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, width, height);

        // Draw Connection Lines
        const drawnPairs = new Set<string>();
        ctx.lineWidth = 0.75;

        for (let i = 0; i < nodes.length; i++) {
          const na = nodes[i];
          for (const connIdx of na.connections) {
            if (connIdx >= nodes.length) continue;
            const pairKey = i < connIdx ? `${i}-${connIdx}` : `${connIdx}-${i}`;
            if (drawnPairs.has(pairKey)) continue;
            drawnPairs.add(pairKey);

            const nb = nodes[connIdx];
            const dist = Math.hypot(na.x - nb.x, na.y - nb.y);

            const maxDist = 220;
            if (dist > maxDist) continue;
            const alpha = (1 - dist / maxDist) * (na.category === 'satellite' ? 0.2 : 0.45);

            if (isLight) {
              ctx.strokeStyle = na.category === 'core' && nb.category === 'core'
                ? `rgba(5, 150, 105, ${Math.min(1, alpha * 1.5)})`
                : `rgba(15, 23, 42, ${Math.min(1, alpha * 0.3)})`;
            } else {
              ctx.strokeStyle = na.category === 'core' && nb.category === 'core'
                ? `rgba(0, 255, 133, ${Math.min(1, alpha * 1.5)})`
                : `rgba(255, 255, 255, ${Math.min(1, alpha * 0.4)})`;
            }

            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.stroke();
          }
        }

        // Draw Traveling Particles
        particles.forEach((p) => {
          p.progress += p.speed;
          if (p.progress >= 1) {
            p.progress = 0;
            p.sourceIndex = Math.floor(Math.random() * 4);
            const conns = nodes[p.sourceIndex].connections;
            p.targetIndex = conns[Math.floor(Math.random() * conns.length)] || 0;
          }

          const src = nodes[p.sourceIndex];
          const tgt = nodes[p.targetIndex];
          if (!src || !tgt) return;

          const curX = src.x + (tgt.x - src.x) * p.progress;
          const curY = src.y + (tgt.y - src.y) * p.progress;

          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = isLight ? 4 : 8;
          ctx.beginPath();
          ctx.arc(curX, curY, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Draw Nodes
        nodes.forEach((node) => {
          const isCore = node.category === 'core';
          const isDoc = node.category === 'document';
          const isHovered = hoveredNodeRef.current?.label === node.label && !!node.label;

          if (isCore || isHovered) {
            ctx.shadowColor = node.color;
            ctx.shadowBlur = isHovered ? (isLight ? 12 : 20) : (isLight ? 8 : 12);
          }

          ctx.fillStyle = node.color;
          ctx.beginPath();
          const r = isHovered ? node.baseRadius * 1.6 : node.radius;
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          if (isCore) {
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            const pulseR = node.radius + 4 + Math.sin(time * 3 + node.x) * 2;
            ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
            ctx.stroke();
          }

          if ((isCore || isDoc) && node.label && width > 480) {
            ctx.font = isCore ? 'bold 11px system-ui, sans-serif' : '500 10px system-ui, sans-serif';
            ctx.fillStyle = isLight
              ? (isCore ? '#0f172a' : '#334155')
              : (isCore ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)');
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + (isCore ? 18 : 14));
          }
        });
      } catch (err) {
        console.warn('Canvas render notice:', err);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvasEl.removeEventListener('mousemove', handleMouseMove);
      canvasEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isLight]);

  return (
    <div ref={containerRef} className="relative w-full h-[360px] xs:h-[420px] sm:h-[500px] lg:h-[620px] select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

      {/* Floating Status / Telemetry Badge */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#070b14]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-[11px] font-mono flex items-center gap-2 shadow-lg dark:shadow-2xl transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00FF85] animate-ping" />
          <span className="font-semibold text-emerald-600 dark:text-[#00FF85]">99.4% Factual Grounding</span>
          <span className="text-slate-300 dark:text-white/40 hidden sm:inline">|</span>
          <span className="text-slate-600 dark:text-white/70 hidden sm:inline">GraphRAG Active</span>
        </div>
      </div>

      {/* Interactive Tooltip Card on Hover */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: hoveredNode.x, top: hoveredNode.y }}
        >
          <div className="px-3.5 py-2.5 rounded-xl bg-white/95 dark:bg-[#0b101c]/95 backdrop-blur-xl border border-emerald-500/40 text-slate-900 dark:text-white shadow-xl dark:shadow-2xl max-w-[220px] animate-in fade-in zoom-in-95 duration-150">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-[#00FF85] block">
              {hoveredNode.category}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5 truncate">
              {hoveredNode.label}
            </span>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight mt-1">
              {hoveredNode.description}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Visual Fade for seamless section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-[#050811] dark:via-[#050811]/60 dark:to-transparent pointer-events-none" />
    </div>
  );
}
