'use client';

import React from 'react';
import { FileText } from 'lucide-react';

interface FormattedTextProps {
  content: string;
  isAssistant?: boolean;
}

function parseMarkdownBlocks(text: string): string[] {
  const lines = text.split('\n');
  const blocks: string[] = [];
  let currentBlock: string[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      currentBlock.push(line);
      if (!inCodeBlock) {
        blocks.push(currentBlock.join('\n'));
        currentBlock = [];
      }
      continue;
    }

    if (inCodeBlock) {
      currentBlock.push(line);
      continue;
    }

    if (trimmed === '') {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'));
        currentBlock = [];
      }
    } else {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'));
  }

  return blocks;
}

export default function FormattedMessageText({ content, isAssistant = true }: FormattedTextProps) {
  if (!content) return null;

  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-4 font-sans text-[15px] sm:text-[16px] leading-[1.75] text-neutral-800 dark:text-neutral-200">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Horizontal Dividers (--- or ***)
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          return (
            <div
              key={bIdx}
              className="my-4 border-t border-neutral-200 dark:border-neutral-800"
            />
          );
        }

        // 2. Headings (#, ##, ### or bold single-line title)
        if (trimmed.startsWith('#')) {
          const hashes = trimmed.match(/^#+/)?.[0]?.length || 1;
          const cleanHeading = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');

          if (hashes === 1) {
            return (
              <h3
                key={bIdx}
                className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white pt-3 pb-1.5 flex items-center gap-2.5 border-b border-neutral-200 dark:border-neutral-800"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00FF85] flex-shrink-0" />
                <span>{cleanHeading}</span>
              </h3>
            );
          }

          if (hashes === 2) {
            return (
              <h4
                key={bIdx}
                className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white pt-2.5 pb-1 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00FF85] flex-shrink-0" />
                <span>{cleanHeading}</span>
              </h4>
            );
          }

          return (
            <h5
              key={bIdx}
              className="text-[16px] sm:text-[17px] font-semibold tracking-tight text-neutral-900 dark:text-white pt-2 pb-0.5 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00FF85] flex-shrink-0" />
              <span>{cleanHeading}</span>
            </h5>
          );
        }

        // Heading without hash (e.g. "50/30/20 Personalized Recommendations" or "Executive Summary")
        if (
          !trimmed.includes('\n') &&
          trimmed.length < 80 &&
          (trimmed.endsWith('Recommendations') ||
            trimmed.endsWith('Summary') ||
            trimmed.endsWith('Analysis') ||
            trimmed.endsWith('Audit') ||
            trimmed.endsWith('Checklist') ||
            trimmed.endsWith('Overview') ||
            trimmed.endsWith('Breakdown') ||
            trimmed.endsWith('Takeaways'))
        ) {
          return (
            <h5
              key={bIdx}
              className="text-[16px] sm:text-[17px] font-semibold text-neutral-900 dark:text-white pt-2.5 pb-1 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00FF85] flex-shrink-0" />
              <span>{trimmed.replace(/\*\*/g, '')}</span>
            </h5>
          );
        }

        // 3. Fenced Code Blocks (```lang ... ```)
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const firstLine = lines[0].replace(/^```/, '').trim();
          const language = firstLine || 'code';
          const codeContent =
            lines.length > 2 && lines[lines.length - 1].startsWith('```')
              ? lines.slice(1, -1).join('\n')
              : lines.slice(1).join('\n');

          return (
            <div
              key={bIdx}
              className="my-3.5 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 text-neutral-100 shadow-xs"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/90 border-b border-neutral-800 text-xs font-mono text-neutral-400">
                <span className="font-semibold uppercase tracking-wider">{language}</span>
              </div>
              <pre className="p-4 overflow-x-auto text-[13.5px] sm:text-[14px] font-mono leading-relaxed text-neutral-200">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        // 4. Markdown Data Table
        if (trimmed.includes('|') && trimmed.split('\n').length >= 2) {
          const lines = trimmed.split('\n').filter((l) => l.trim().startsWith('|'));
          if (lines.length >= 2) {
            const headerLine = lines[0];
            const dataLines = lines.slice(2);
            const headers = headerLine
              .split('|')
              .map((c) => c.trim())
              .filter(Boolean);

            return (
              <div
                key={bIdx}
                className="overflow-x-auto my-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs max-w-full"
              >
                <table className="min-w-full text-left text-[13.5px] sm:text-[14px] divide-y divide-neutral-200 dark:divide-neutral-800">
                  <thead className="bg-neutral-100/80 dark:bg-neutral-800/60 font-semibold text-neutral-900 dark:text-white">
                    <tr>
                      {headers.map((h, hIdx) => (
                        <th
                          key={hIdx}
                          className="px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                        >
                          {h.replace(/\*\*/g, '')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {dataLines.map((row, rIdx) => {
                      const cells = row
                        .split('|')
                        .map((c) => c.trim())
                        .filter(Boolean);
                      if (cells.length === 0) return null;
                      return (
                        <tr
                          key={rIdx}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                        >
                          {cells.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className="px-4 py-2.5 whitespace-nowrap text-neutral-800 dark:text-neutral-200 font-sans text-[13.5px] sm:text-[14px]"
                            >
                              {renderFormattedInline(cell)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // 5. List Items & Numbered Steps
        const lines = trimmed.split('\n');
        const hasListItems = lines.some(
          (l) =>
            l.trim().startsWith('-') ||
            l.trim().startsWith('*') ||
            l.trim().startsWith('•') ||
            /^\d+[\.\)]\s/.test(l.trim()) ||
            /^\*\*\d+[\.\)]\*\*/.test(l.trim())
        );

        if (hasListItems && lines.length > 1) {
          return (
            <div key={bIdx} className="space-y-2.5 pl-0.5 my-2">
              {lines.map((line, lIdx) => {
                const lineTrimmed = line.trim();
                if (!lineTrimmed) return null;

                const isNumbered =
                  /^\d+[\.\)]\s/.test(lineTrimmed) || /^\*\*\d+[\.\)]\*\*/.test(lineTrimmed);
                const isBullet =
                  lineTrimmed.startsWith('-') || lineTrimmed.startsWith('*') || lineTrimmed.startsWith('•');

                if (isNumbered) {
                  const numberMatch =
                    lineTrimmed.match(/^(\d+)[\.\)]/) || lineTrimmed.match(/^\*\*(\d+)[\.\)]\*\*/);
                  const numStr = numberMatch ? numberMatch[1] : `${lIdx + 1}`;
                  const cleanItemText = lineTrimmed
                    .replace(/^\*\*\d+[\.\)]\*\*\s*/, '')
                    .replace(/^\d+[\.\)]\s*/, '')
                    .trim();

                  return (
                    <div
                      key={lIdx}
                      className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex items-start gap-3 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5 shadow-2xs">
                        {numStr}
                      </div>
                      <div className="flex-1 text-neutral-800 dark:text-neutral-200 text-[15px] sm:text-[16px] leading-[1.75]">
                        {renderFormattedInline(cleanItemText)}
                      </div>
                    </div>
                  );
                }

                if (isBullet) {
                  const cleanItemText = lineTrimmed.replace(/^[-*•]\s*/, '').trim();
                  return (
                    <div key={lIdx} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00FF85] mt-2.5 flex-shrink-0" />
                      <div className="flex-1 text-neutral-800 dark:text-neutral-200 text-[15px] sm:text-[16px] leading-[1.75]">
                        {renderFormattedInline(cleanItemText)}
                      </div>
                    </div>
                  );
                }

                return (
                  <p key={lIdx} className="text-neutral-800 dark:text-neutral-200 font-semibold mb-1 text-[15px] sm:text-[16px]">
                    {renderFormattedInline(lineTrimmed)}
                  </p>
                );
              })}
            </div>
          );
        }

        // 6. Standalone Numbered Block
        if (/^\d+[\.\)]\s/.test(trimmed) || /^\*\*\d+[\.\)]\*\*/.test(trimmed)) {
          const numberMatch = trimmed.match(/^(\d+)[\.\)]/) || trimmed.match(/^\*\*(\d+)[\.\)]\*\*/);
          const numStr = numberMatch ? numberMatch[1] : '1';
          const cleanItemText = trimmed
            .replace(/^\*\*\d+[\.\)]\*\*\s*/, '')
            .replace(/^\d+[\.\)]\s*/, '')
            .trim();

          return (
            <div
              key={bIdx}
              className="p-3.5 sm:p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex items-start gap-3 my-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5 shadow-2xs">
                {numStr}
              </div>
              <div className="flex-1 text-neutral-800 dark:text-neutral-200 text-[15px] sm:text-[16px] leading-[1.75]">
                {renderFormattedInline(cleanItemText)}
              </div>
            </div>
          );
        }

        // 7. Normal Clean Text Paragraph
        return (
          <p
            key={bIdx}
            className={`text-[15px] sm:text-[16px] leading-[1.75] ${
              isAssistant ? 'text-neutral-800 dark:text-neutral-200' : 'text-white font-medium'
            }`}
          >
            {renderFormattedInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderFormattedInline(text: string): React.ReactNode {
  // Split by bold (**text**), inline code (`code`), and page citations (*(Page X)* or (Page X))
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*\(Page\s*\d+(?:,\s*Page\s*\d+)*\)\*|\(Page\s*\d+(?:,\s*Page\s*\d+)*\))/g);

  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;

        // Bold formatting
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-semibold text-neutral-950 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }

        // Inline Code snippet
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-mono text-[13px] sm:text-[13.5px] text-emerald-600 dark:text-[#00FF85] font-medium border border-neutral-200 dark:border-neutral-700/60"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        // Page Citations (e.g. *(Page 2)* or (Page 2, Page 4))
        if (
          (part.startsWith('*(Page') && part.endsWith(')*')) ||
          (part.startsWith('(Page') && part.endsWith(')'))
        ) {
          const pageClean = part.replace(/\*/g, '').replace(/[()]/g, '');
          return (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-[#00FF85] font-mono text-xs font-medium border border-emerald-500/20 mx-1 align-baseline shadow-2xs"
            >
              <FileText className="w-3 h-3" />
              <span>{pageClean}</span>
            </span>
          );
        }

        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}
