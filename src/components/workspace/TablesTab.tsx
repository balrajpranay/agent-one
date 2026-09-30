'use client';

import React, { useState } from 'react';
import {
  Download,
  Filter,
  Search,
  ChevronDown,
  ArrowUpDown,
  Table as TableIcon,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { DocumentAnalysis, ExtractedTable } from '@/lib/types';

export default function TablesTab({ doc }: { doc: DocumentAnalysis }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTableIndex, setSelectedTableIndex] = useState(0);
  const [isExported, setIsExported] = useState(false);

  const tables: ExtractedTable[] = doc.extractedTables || [];
  const activeTable = tables[selectedTableIndex] || tables[0];

  if (tables.length === 0) {
    return (
      <div className="bg-white dark:bg-[#12141a] rounded-3xl p-8 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs text-center space-y-4 animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] flex items-center justify-center mx-auto">
          <TableIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-serif font-bold text-neutral-900 dark:text-white">
            No Structured Data Tables Detected
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-1 leading-relaxed">
            The document <strong>{doc.name}</strong> contains narrative paragraphs and layout streams without explicit grid or delimited tables.
          </p>
        </div>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (!activeTable) return;
    const headers = activeTable.columns;
    const csvContent = [
      headers.join(','),
      ...activeTable.rows.map((row) =>
        headers.map((col) => `"${String(row[col] ?? '').replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTable.tableName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExported(true);
    setTimeout(() => setIsExported(false), 2000);
  };

  const filteredRows = activeTable
    ? activeTable.rows.filter((row) =>
        Object.values(row).some((cell) =>
          String(cell).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Table Switcher & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#12141a] p-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
        {/* Table Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tables.map((t: ExtractedTable, idx: number) => (
            <button
              key={t.id || idx}
              onClick={() => setSelectedTableIndex(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTableIndex === idx
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-neutral-600 dark:text-neutral-300'
              }`}
            >
              {t.tableName}
            </button>
          ))}
        </div>

        {/* Search & Export Actions */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search table rows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-neutral-800 rounded-full text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-semibold transition-all shadow-xs flex-shrink-0 cursor-pointer"
          >
            {isExported ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-600" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
            <span>{isExported ? 'Exported' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      {activeTable && (
        <div className="bg-white dark:bg-[#12141a] rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between bg-neutral-50/80 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                {activeTable.tableName}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 px-2.5 py-0.5 rounded-full bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-neutral-800">
              {filteredRows.length} Rows • Spatial Extraction
            </span>
          </div>

          <div className="overflow-x-auto table-scroll-container scrollbar-thin">
            <table className="min-w-full text-left text-xs whitespace-nowrap sm:whitespace-normal">
              <thead className="bg-neutral-50 dark:bg-white/[0.02] border-b border-neutral-200/80 dark:border-neutral-800/80 text-neutral-500 dark:text-neutral-400 uppercase font-mono text-[10px]">
                <tr>
                  {activeTable.columns.map((col: string, idx: number) => (
                    <th key={idx} className="px-3 sm:px-6 py-2.5 sm:py-3 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-800/70 text-neutral-800 dark:text-neutral-200">
                {filteredRows.map((row: Record<string, string | number>, rIdx: number) => (
                  <tr key={rIdx} className="hover:bg-emerald-500/[0.04] dark:hover:bg-white/[0.02] transition-colors">
                    {activeTable.columns.map((col: string, cIdx: number) => (
                      <td key={cIdx} className="px-3 sm:px-6 py-2.5 sm:py-3.5 font-sans break-words-anywhere">
                        {String(row[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
