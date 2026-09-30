'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Layers,
  Sparkles
} from 'lucide-react';
import { DocumentAnalysis, BoundingBox } from '@/lib/types';

interface DocumentViewerProps {
  doc: DocumentAnalysis;
  activePage?: number;
  highlightText?: string;
  targetBoundingBox?: BoundingBox | null;
  targetRegions?: BoundingBox[];
  onPageChange?: (page: number) => void;
}

export default function DocumentViewer({
  doc,
  activePage = 1,
  highlightText = '',
  targetBoundingBox,
  targetRegions = [],
  onPageChange
}: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(activePage);
  const [zoom, setZoom] = useState(100);
  const [activeRegionIndex, setActiveRegionIndex] = useState(0);

  useEffect(() => {
    if (activePage && activePage !== currentPage) {
      setCurrentPage(activePage);
    }
  }, [activePage]);

  const handlePageSelect = (p: number) => {
    setCurrentPage(p);
    if (onPageChange) onPageChange(p);
  };

  const totalPages = doc.pageCount || (doc.pages ? doc.pages.length : 1);
  const currentPageData = doc.pages?.find((p) => p.pageNumber === currentPage);

  // Combine single target box with regions array if present
  const regionsToDisplay: BoundingBox[] = [];
  if (targetRegions && targetRegions.length > 0) {
    regionsToDisplay.push(...targetRegions);
  } else if (targetBoundingBox) {
    regionsToDisplay.push(targetBoundingBox);
  }

  const activeBox = regionsToDisplay[activeRegionIndex] || regionsToDisplay[0] || null;

  return (
    <div className="bg-neutral-50 dark:bg-[#0c0d12] text-neutral-900 dark:text-neutral-100 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col h-full overflow-hidden shadow-xs">
      {/* Viewer Header */}
      <div className="p-2.5 sm:p-3 bg-white/95 dark:bg-[#12141a]/95 backdrop-blur-sm border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between gap-2 text-xs flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <FileText className="w-4 h-4 text-emerald-600 dark:text-[#00FF85] flex-shrink-0" />
          <span className="font-semibold text-neutral-900 dark:text-white truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs">
            {doc.name}
          </span>
          {doc.skillName && (
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 font-semibold hidden sm:inline-block">
              {doc.skillName}
            </span>
          )}
        </div>

        {/* Multi-Region Evidence Navigation */}
        {regionsToDisplay.length > 1 && (
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-[10px] text-emerald-600 dark:text-[#00FF85]">
            <Crosshair className="w-3 h-3 text-emerald-600 dark:text-[#00FF85]" />
            <span>
              Region {activeRegionIndex + 1}/{regionsToDisplay.length}
            </span>
            <button
              onClick={() => setActiveRegionIndex((prev) => (prev + 1) % regionsToDisplay.length)}
              className="ml-1 px-1.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-[#00FF85] font-semibold cursor-pointer transition-colors"
            >
              Cycle
            </button>
          </div>
        )}

        {/* Zoom & Page Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="hidden xs:flex items-center bg-neutral-100 dark:bg-white/[0.06] rounded-lg p-0.5 border border-neutral-200 dark:border-white/10 flex-shrink-0">
            <button
              onClick={() => setZoom(Math.max(70, zoom - 15))}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded cursor-pointer transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-neutral-700 dark:text-neutral-300 whitespace-nowrap select-none min-w-[34px] text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 15))}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded cursor-pointer transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center bg-neutral-100 dark:bg-white/[0.06] rounded-lg p-0.5 border border-neutral-200 dark:border-white/10 flex-shrink-0">
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageSelect(currentPage - 1)}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white disabled:opacity-30 rounded cursor-pointer transition-colors disabled:cursor-not-allowed touch-target flex items-center justify-center"
              title="Previous Page"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-neutral-700 dark:text-neutral-300 whitespace-nowrap select-none min-w-[42px] text-center inline-block">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageSelect(currentPage + 1)}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white disabled:opacity-30 rounded cursor-pointer transition-colors disabled:cursor-not-allowed touch-target flex items-center justify-center"
              title="Next Page"
              aria-label="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewer Body with Left Thumbnail Sidebar and Right Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnails Sidebar */}
        {totalPages > 1 && (
          <div className="w-16 bg-neutral-100/70 dark:bg-[#0e0f14] border-r border-neutral-200/80 dark:border-neutral-800/80 overflow-y-auto p-1.5 hidden md:flex flex-col gap-2 flex-shrink-0">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pNum = idx + 1;
              const isSelected = pNum === currentPage;
              return (
                <button
                  key={pNum}
                  onClick={() => handlePageSelect(pNum)}
                  className={`w-full aspect-[3/4] rounded-lg border text-[10px] font-mono flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-700'
                  }`}
                  title={`Page ${pNum}`}
                >
                  <span className="text-[9px]">P.{pNum}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Document Page Canvas with Coordinate Overlays */}
        <div className="flex-1 overflow-auto p-2.5 sm:p-4 flex justify-center bg-neutral-100/60 dark:bg-black/60 relative">
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-xl bg-white dark:bg-[#14151b] text-neutral-900 dark:text-neutral-100 rounded-xl p-4 sm:p-8 shadow-xl transition-transform border border-neutral-200 dark:border-neutral-800 min-h-[560px] text-xs font-sans leading-relaxed relative select-text"
          >
            {/* Coordinate Grounding Bounding Box Overlays */}
            {activeBox && (
              <div
                style={{
                  position: 'absolute',
                  left: `${activeBox.x * 100}%`,
                  top: `${activeBox.y * 100}%`,
                  width: `${activeBox.width * 100}%`,
                  height: `${activeBox.height * 100}%`
                }}
                className="border-2 border-[#00FF85] bg-[#00FF85]/20 rounded pointer-events-none z-10 transition-all duration-300 animate-pulse ring-4 ring-[#00FF85]/25 shadow-lg shadow-emerald-500/30"
              >
                <div className="absolute -top-6 left-0 bg-neutral-950 text-[#00FF85] text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-emerald-500/50 whitespace-nowrap shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF85] animate-ping" />
                  <span>🎯 Verified Grounding Coordinates</span>
                </div>
              </div>
            )}

            {/* Document Header */}
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-4 text-center">
              <h2 className="text-sm font-bold tracking-tight uppercase text-neutral-900 dark:text-white">
                {doc.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1 text-[10px] font-sans text-neutral-500 dark:text-neutral-400">
                <span>Page {currentPage} of {totalPages}</span>
                {doc.fileSize && (
                  <>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </>
                )}
                {doc.skillName && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-emerald-600 dark:text-[#00FF85] font-semibold">
                      Skill: {doc.skillName}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Page Content / Blocks */}
            <div className="space-y-4 font-sans text-neutral-800 dark:text-neutral-200 leading-relaxed">
              {currentPageData && currentPageData.blocks && currentPageData.blocks.length > 0 ? (
                <div className="space-y-3">
                  {currentPageData.blocks.map((block) => (
                    <div
                      key={block.id}
                      className={`p-1.5 rounded transition-colors ${
                        block.type === 'heading'
                          ? 'font-bold text-sm text-neutral-900 dark:text-white pt-2'
                          : block.type === 'table'
                          ? 'bg-neutral-100 dark:bg-white/[0.05] p-2 font-mono text-[11px] rounded border border-neutral-200 dark:border-neutral-800'
                          : 'text-xs text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {block.text}
                    </div>
                  ))}
                </div>
              ) : doc.pageTexts && doc.pageTexts.find((p) => p.page === currentPage) ? (
                <div className="whitespace-pre-wrap font-sans text-xs text-neutral-800 dark:text-neutral-200 space-y-2 leading-relaxed">
                  {doc.pageTexts.find((p) => p.page === currentPage)?.text}
                </div>
              ) : doc.rawText ? (
                <div className="whitespace-pre-wrap font-sans text-xs text-neutral-800 dark:text-neutral-200 space-y-2 leading-relaxed">
                  {doc.rawText}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200 text-xs">
                    <strong className="block font-bold mb-1">Executive Summary:</strong>
                    {doc.summary.executiveBrief || doc.summary.tldr}
                  </div>
                  <div className="space-y-1.5">
                    <strong className="block text-xs font-bold text-neutral-900 dark:text-white">Key Takeaways:</strong>
                    {doc.summary.keyTakeaways.map((t, idx) => (
                      <p key={idx} className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        • {t}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Grounded Entities */}
              {doc.extractedEntities && doc.extractedEntities.length > 0 && (
                <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-white/[0.02] rounded-xl p-3.5 border border-neutral-200/80 dark:border-neutral-800/80 text-xs space-y-2">
                  <span className="font-bold text-neutral-900 dark:text-white block text-[11px] uppercase tracking-wider font-mono">
                    Grounded Entities on Page {currentPage}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {doc.extractedEntities
                      .filter((e) => e.page === currentPage || !e.page)
                      .slice(0, 6)
                      .map((e, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-[11px] bg-white dark:bg-white/[0.04] p-1.5 rounded border border-neutral-200 dark:border-neutral-800"
                        >
                          <span className="text-neutral-500 dark:text-neutral-400">{e.key}:</span>
                          <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[120px]">
                            {e.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
