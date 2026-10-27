'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
  Trash2,
  FileDown,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyId } from './CopyId';
import { StatusBadge, StatusVariant } from './StatusBadge';

export type TableDensity = 'compact' | 'standard' | 'relaxed';

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  width?: number; // initial px width
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onRowClick?: (row: T) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  onBulkExport?: (selectedIds: string[]) => void;
  defaultPageSize?: number;
  className?: string;
  tableTitle?: React.ReactNode;
  exportButtonLabel?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load table data.',
  onRetry,
  onRowClick,
  onBulkDelete,
  onBulkExport,
  defaultPageSize = 10,
  className = '',
  tableTitle,
  exportButtonLabel,
}: DataTableProps<T>) {
  // Density state
  const [density, setDensity] = useState<TableDensity>('standard');

  // Sorting state
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Column visibility
  const [visibleColIds, setVisibleColIds] = useState<Set<string>>(
    new Set(columns.map((c) => c.id))
  );

  // Column widths (resizable)
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    columns.forEach((c) => {
      initial[c.id] = c.width || 140;
    });
    return initial;
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // First-load animation flag
  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      setHasAnimated(true);
    }
  }, [isLoading, data.length]);

  // Resizing state
  const resizingColRef = useRef<string | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const startResize = (colId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizingColRef.current = colId;
    startXRef.current = e.clientX;
    startWidthRef.current = colWidths[colId] || 140;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingColRef.current) return;
      const deltaX = moveEvent.clientX - startXRef.current;
      const newWidth = Math.max(70, startWidthRef.current + deltaX);
      setColWidths((prev) => ({
        ...prev,
        [resizingColRef.current!]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      resizingColRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Sorting logic
  const handleSort = (colId: string) => {
    if (sortCol === colId) {
      if (sortDir === 'asc') setSortDir('desc');
      else {
        setSortCol(null);
        setSortDir('asc');
      }
    } else {
      setSortCol(colId);
      setSortDir('asc');
    }
  };

  const processedData = useMemo(() => {
    let result = [...data];

    if (sortCol) {
      const col = columns.find((c) => c.id === sortCol);
      if (col && col.accessorKey) {
        result.sort((a, b) => {
          const valA = a[col.accessorKey!];
          const valB = b[col.accessorKey!];
          if (valA === valB) return 0;
          if (valA === null || valA === undefined) return 1;
          if (valB === null || valB === undefined) return -1;
          const cmp = valA < valB ? -1 : 1;
          return sortDir === 'asc' ? cmp : -cmp;
        });
      }
    }

    return result;
  }, [data, sortCol, sortDir, columns]);

  // Pagination logic
  const totalItems = processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Row selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((d) => d.id)));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Density styles
  const rowHeightClass = {
    compact: 'h-[32px] py-1 text-[12px]',
    standard: 'h-[38px] py-2 text-[13px]',
    relaxed: 'h-[44px] py-3 text-[14px]',
  }[density];

  const visibleColumns = columns.filter((c) => visibleColIds.has(c.id));

  return (
    <div className={`relative rounded-panel bg-theme-surface border hairline-border overflow-hidden flex flex-col ${className}`}>
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-theme-subtle bg-theme-surface">
        <div className="flex items-center gap-3">
          {tableTitle && (
            <>
              <span className="text-xs font-semibold text-theme-primary">{tableTitle}</span>
              <span className="text-theme-tertiary text-xs">|</span>
            </>
          )}
          {/* Density Toggle */}
          <div className="flex items-center p-0.5 bg-theme-raised border border-theme-subtle rounded-control">
            <button
              onClick={() => setDensity('compact')}
              className={`px-2 py-0.5 text-[11px] font-mono rounded-control transition-colors ${
                density === 'compact'
                  ? 'bg-theme-surface text-theme-primary shadow-xs font-medium'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
              title="Compact density (32px)"
            >
              Compact
            </button>
            <button
              onClick={() => setDensity('standard')}
              className={`px-2 py-0.5 text-[11px] font-mono rounded-control transition-colors ${
                density === 'standard'
                  ? 'bg-theme-surface text-theme-primary shadow-xs font-medium'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
              title="Standard density (38px)"
            >
              Standard
            </button>
            <button
              onClick={() => setDensity('relaxed')}
              className={`px-2 py-0.5 text-[11px] font-mono rounded-control transition-colors ${
                density === 'relaxed'
                  ? 'bg-theme-surface text-theme-primary shadow-xs font-medium'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
              title="Relaxed density (44px)"
            >
              Relaxed
            </button>
          </div>

          <span className="text-theme-tertiary text-xs">|</span>

          {/* Records summary */}
          <span className="font-mono text-[11px] tabular-nums text-theme-secondary">
            {totalItems} records
          </span>
        </div>

        {/* Right tools: Columns visibility & export */}
        <div className="flex items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-theme-secondary hover:text-theme-primary bg-theme-raised border hairline-border rounded-control transition-colors duration-100 focus-ring"
                aria-label="Toggle column visibility"
              >
                <Columns size={13} strokeWidth={1.5} />
                <span>Columns</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                className="z-50 min-w-[160px] p-1.5 bg-theme-raised border hairline-border rounded-panel shadow-xl text-xs font-mono"
              >
                <DropdownMenu.Label className="px-2 py-1 text-[10px] uppercase tracking-[0.04em] text-theme-tertiary">
                  Toggle Columns
                </DropdownMenu.Label>
                {columns.map((col) => {
                  const isVisible = visibleColIds.has(col.id);
                  return (
                    <DropdownMenu.CheckboxItem
                      key={col.id}
                      checked={isVisible}
                      onCheckedChange={() => {
                        const next = new Set(visibleColIds);
                        if (isVisible && next.size > 1) next.delete(col.id);
                        else next.add(col.id);
                        setVisibleColIds(next);
                      }}
                      className="flex items-center justify-between px-2 py-1.5 rounded-control cursor-pointer select-none text-theme-secondary hover:text-theme-primary hover:bg-theme-surface transition-colors"
                    >
                      <span>{col.header}</span>
                      <DropdownMenu.ItemIndicator>
                        <Check size={12} strokeWidth={2} className="text-accent" />
                      </DropdownMenu.ItemIndicator>
                    </DropdownMenu.CheckboxItem>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {onBulkExport && (
            <button
              onClick={() => onBulkExport(Array.from(selectedIds))}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-theme-secondary hover:text-theme-primary bg-theme-raised border hairline-border rounded-control transition-colors duration-100 focus-ring"
              title="Export all or selected rows"
            >
              <FileDown size={13} strokeWidth={1.5} />
              <span>{exportButtonLabel || 'Export CSV'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
            className="flex items-center justify-between px-4 py-2 bg-accent/10 border-b border-accent/30 text-xs font-mono"
          >
            <div className="flex items-center gap-2 text-accent font-medium">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>
                {selectedIds.size} row{selectedIds.size > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onBulkExport && (
                <button
                  onClick={() => onBulkExport(Array.from(selectedIds))}
                  className="px-2.5 py-1 bg-theme-surface hover:bg-theme-raised border hairline-border text-theme-primary rounded-control transition-colors focus-ring"
                >
                  Export Selected
                </button>
              )}
              {onBulkDelete && (
                <button
                  onClick={() => onBulkDelete(Array.from(selectedIds))}
                  className="flex items-center gap-1 px-2.5 py-1 bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger rounded-control transition-colors focus-ring"
                >
                  <Trash2 size={12} strokeWidth={1.5} />
                  <span>Delete Selected</span>
                </button>
              )}
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-2 py-1 text-theme-secondary hover:text-theme-primary underline underline-offset-2"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Body Area */}
      <div className="relative w-full overflow-x-auto max-w-full">
        <table className="w-full text-left border-collapse select-none">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-10 bg-theme-raised border-b border-theme-border text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary">
            <tr>
              {/* Checkbox select column */}
              <th className="w-10 px-3 py-2 text-center border-r border-theme-subtle">
                <input
                  type="checkbox"
                  aria-label="Select all rows on page"
                  checked={
                    paginatedData.length > 0 &&
                    selectedIds.size === paginatedData.length
                  }
                  onChange={handleSelectAll}
                  className="h-3.5 w-3.5 rounded-xs accent-accent cursor-pointer"
                />
              </th>

              {visibleColumns.map((col) => {
                const width = colWidths[col.id] || 140;
                const isSorted = sortCol === col.id;

                return (
                  <th
                    key={col.id}
                    style={{ width: `${width}px`, minWidth: '70px' }}
                    className="relative px-3 py-2 border-r border-theme-subtle last:border-r-0 select-none group"
                  >
                    <div
                      className={`flex items-center justify-between gap-1.5 ${
                        col.sortable ? 'cursor-pointer hover:text-theme-primary' : ''
                      }`}
                      onClick={() => col.sortable && handleSort(col.id)}
                    >
                      <span className="truncate">{col.header}</span>
                      {col.sortable && (
                        <span className="text-theme-tertiary group-hover:text-theme-primary">
                          {isSorted ? (
                            sortDir === 'asc' ? (
                              <ArrowUp size={12} strokeWidth={2} className="text-accent" />
                            ) : (
                              <ArrowDown size={12} strokeWidth={2} className="text-accent" />
                            )
                          ) : (
                            <ArrowUpDown size={11} strokeWidth={1.5} className="opacity-40 group-hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Resizer Handle */}
                    <div
                      onMouseDown={(e) => startResize(col.id, e)}
                      className="absolute top-0 right-0 bottom-0 w-1.5 cursor-col-resize hover:bg-accent/50 active:bg-accent z-20"
                    />
                  </th>
                );
              })}

              {/* Actions column */}
              <th className="w-14 px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body with States */}
          <tbody className="divide-y divide-theme-subtle">
            {/* Loading state skeleton */}
            {isLoading && (
              <>
                {Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="h-[38px] animate-pulse">
                    <td className="px-3 text-center">
                      <div className="w-3.5 h-3.5 bg-theme-raised rounded-xs mx-auto" />
                    </td>
                    {visibleColumns.map((col) => (
                      <td key={col.id} className="px-3">
                        <div className="h-3.5 bg-theme-raised rounded-xs w-3/4 skeleton-shimmer" />
                      </td>
                    ))}
                    <td className="px-3 text-right">
                      <div className="h-3.5 w-6 bg-theme-raised rounded-xs ml-auto" />
                    </td>
                  </tr>
                ))}
              </>
            )}

            {/* Error State */}
            {isError && !isLoading && (
              <tr>
                <td colSpan={visibleColumns.length + 2} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertTriangle size={24} strokeWidth={1.5} className="text-danger" />
                    <span className="text-sm font-medium text-theme-primary">{errorMessage}</span>
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-theme-raised hover:bg-theme-border border hairline-border text-xs rounded-control transition-colors"
                      >
                        <RefreshCw size={13} strokeWidth={1.5} />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* Empty State */}
            {!isLoading && !isError && paginatedData.length === 0 && (
              <tr>
                <td colSpan={visibleColumns.length + 2} className="py-12 text-center">
                  <div className="text-xs font-mono text-theme-secondary">
                    No matching records found.
                  </div>
                </td>
              </tr>
            )}

            {/* Loaded Data Rows */}
            {!isLoading &&
              !isError &&
              paginatedData.map((row, idx) => {
                const isSelected = selectedIds.has(row.id);

                return (
                  <motion.tr
                    key={row.id}
                    initial={!hasAnimated ? { opacity: 0, y: 4 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.15,
                      delay: !hasAnimated ? idx * 0.02 : 0,
                      ease: [0.2, 0, 0, 1],
                    }}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`group ${rowHeightClass} transition-colors duration-100 cursor-pointer ${
                      isSelected
                        ? 'bg-accent/10'
                        : 'hover:bg-theme-raised/70'
                    }`}
                  >
                    {/* Row Select Checkbox */}
                    <td
                      className="px-3 text-center border-r border-theme-subtle"
                      onClick={(e) => toggleSelectRow(row.id, e)}
                    >
                      <input
                        type="checkbox"
                        aria-label={`Select row ${row.id}`}
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-3.5 w-3.5 rounded-xs accent-accent cursor-pointer"
                      />
                    </td>

                    {/* Column Cells */}
                    {visibleColumns.map((col) => {
                      return (
                        <td
                          key={col.id}
                          className={`px-3 truncate border-r border-theme-subtle last:border-r-0 ${
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          }`}
                        >
                          {col.cell
                            ? col.cell(row)
                            : col.accessorKey
                            ? String(row[col.accessorKey] ?? 'n/a')
                            : 'n/a'}
                        </td>
                      );
                    })}

                    {/* Inline Actions on hover */}
                    <td className="px-3 text-right">
                      <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick && onRowClick(row);
                          }}
                          className="p-1 text-theme-secondary hover:text-theme-primary hover:bg-theme-surface rounded-control"
                          title="View details"
                        >
                          <Eye size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-theme-subtle bg-theme-surface text-xs font-mono">
        <div className="flex items-center gap-3 text-theme-secondary">
          <span>
            Page <strong className="text-theme-primary">{currentPage}</strong> of{' '}
            <strong className="text-theme-primary">{totalPages}</strong>
          </span>

          <span className="text-theme-tertiary">|</span>

          {/* Page size dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-theme-tertiary">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-theme-raised border hairline-border rounded-control px-1.5 py-0.5 text-xs text-theme-primary focus-ring"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1 rounded-control bg-theme-raised border hairline-border text-theme-secondary hover:text-theme-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-ring"
            title="First page"
          >
            <ChevronsLeft size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-control bg-theme-raised border hairline-border text-theme-secondary hover:text-theme-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-ring"
            title="Previous page"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-control bg-theme-raised border hairline-border text-theme-secondary hover:text-theme-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-ring"
            title="Next page"
          >
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded-control bg-theme-raised border hairline-border text-theme-secondary hover:text-theme-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-ring"
            title="Last page"
          >
            <ChevronsRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
