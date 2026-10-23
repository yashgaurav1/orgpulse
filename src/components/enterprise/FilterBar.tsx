'use client';

import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import {
  Filter,
  X,
  Plus,
  Bookmark,
  ChevronDown,
  Search,
  RotateCcw,
} from 'lucide-react';

export interface FilterChip {
  id: string;
  field: string;
  label: string;
  value: string;
}

interface FilterBarProps {
  onSearchChange?: (query: string) => void;
  onFiltersChange?: (chips: FilterChip[]) => void;
  onSavedViewSelect?: (viewId: string) => void;
  className?: string;
}

const AVAILABLE_FIELDS = [
  { field: 'domain', label: 'Domain', options: ['Workload', 'Autonomy', 'Recognition', 'Growth', 'Culture'] },
  { field: 'status', label: 'Status', options: ['Needs Review', 'Committed', 'Healthy', 'Suppressed'] },
  { field: 'risk', label: 'Risk Level', options: ['Low', 'Moderate', 'High', 'Critical'] },
];

const SAVED_VIEWS = [
  { id: 'all', name: 'All Squads (Default)' },
  { id: 'attention', name: 'Requires Attention (Risk ≥ High)' },
  { id: 'actions', name: 'Active 14-Day Commitments' },
  { id: 'suppressed', name: 'Suppressed Groups (N < 5)' },
];

export function FilterBar({
  onSearchChange,
  onFiltersChange,
  onSavedViewSelect,
  className = '',
}: FilterBarProps) {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: 'c1', field: 'status', label: 'Status', value: 'Needs Review' },
  ]);
  const [search, setSearch] = useState('');
  const [activeView, setActiveView] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Field selection in add popover
  const [selectedField, setSelectedField] = useState(AVAILABLE_FIELDS[0].field);
  const [selectedValue, setSelectedValue] = useState(AVAILABLE_FIELDS[0].options[0]);

  const handleAddChip = () => {
    const fieldDef = AVAILABLE_FIELDS.find((f) => f.field === selectedField);
    if (!fieldDef) return;

    const newChip: FilterChip = {
      id: `chip-${Date.now()}`,
      field: selectedField,
      label: fieldDef.label,
      value: selectedValue,
    };

    const next = [...chips, newChip];
    setChips(next);
    onFiltersChange?.(next);
    setIsAddOpen(false);
  };

  const handleRemoveChip = (id: string) => {
    const next = chips.filter((c) => c.id !== id);
    setChips(next);
    onFiltersChange?.(next);
  };

  const handleClearAll = () => {
    setChips([]);
    onFiltersChange?.([]);
  };

  const handleSavedView = (viewId: string) => {
    setActiveView(viewId);
    onSavedViewSelect?.(viewId);

    if (viewId === 'attention') {
      const next = [{ id: 'attn', field: 'risk', label: 'Risk Level', value: 'High' }];
      setChips(next);
      onFiltersChange?.(next);
    } else if (viewId === 'actions') {
      const next = [{ id: 'act', field: 'status', label: 'Status', value: 'Committed' }];
      setChips(next);
      onFiltersChange?.(next);
    } else if (viewId === 'all') {
      setChips([]);
      onFiltersChange?.([]);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 p-2 bg-theme-surface border hairline-border rounded-panel text-xs font-mono ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        {/* Search input */}
        <div className="relative min-w-[180px] max-w-[240px]">
          <Search
            size={13}
            strokeWidth={1.5}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-theme-tertiary"
          />
          <input
            type="text"
            value={search}
            placeholder="Search records..."
            onChange={(e) => {
              setSearch(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            className="w-full bg-theme-raised border hairline-border rounded-control pl-7 pr-2.5 py-1 text-xs text-theme-primary placeholder-theme-tertiary focus-ring"
          />
        </div>

        <span className="text-theme-tertiary text-xs">|</span>

        {/* Saved Views Selector */}
        <div className="relative">
          <select
            value={activeView}
            onChange={(e) => handleSavedView(e.target.value)}
            className="bg-theme-raised border hairline-border rounded-control px-2 py-1 text-xs text-theme-secondary hover:text-theme-primary cursor-pointer focus-ring"
          >
            {SAVED_VIEWS.map((v) => (
              <option key={v.id} value={v.id}>
                View: {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Chips */}
        {chips.map((chip) => (
          <span
            key={chip.id}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-theme-raised border border-theme-border rounded-control text-[11px] text-theme-primary shadow-xs"
          >
            <span className="text-theme-tertiary">{chip.label}:</span>
            <span className="font-semibold text-accent">{chip.value}</span>
            <button
              onClick={() => handleRemoveChip(chip.id)}
              className="text-theme-tertiary hover:text-danger rounded-xs p-0.5 transition-colors"
              aria-label={`Remove filter ${chip.label}`}
            >
              <X size={11} strokeWidth={2} />
            </button>
          </span>
        ))}

        {/* Add Filter Popover */}
        <Popover.Root open={isAddOpen} onOpenChange={setIsAddOpen}>
          <Popover.Trigger asChild>
            <button
              className="inline-flex items-center gap-1 px-2 py-1 bg-theme-raised hover:bg-theme-border border hairline-border rounded-control text-theme-secondary hover:text-theme-primary transition-colors focus-ring"
              aria-label="Add filter"
            >
              <Plus size={12} strokeWidth={1.5} />
              <span>Add filter</span>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="start"
              className="z-50 w-64 p-3 bg-theme-surface border hairline-border rounded-panel shadow-xl space-y-3 text-xs font-mono"
            >
              <div className="text-[11px] font-semibold text-theme-primary uppercase tracking-[0.04em]">
                Add Filter Rule
              </div>

              <div>
                <label className="text-[10px] text-theme-tertiary block mb-1">
                  Field
                </label>
                <select
                  value={selectedField}
                  onChange={(e) => {
                    setSelectedField(e.target.value);
                    const def = AVAILABLE_FIELDS.find(
                      (f) => f.field === e.target.value
                    );
                    if (def) setSelectedValue(def.options[0]);
                  }}
                  className="w-full bg-theme-raised border hairline-border rounded-control px-2 py-1 text-xs text-theme-primary focus-ring"
                >
                  {AVAILABLE_FIELDS.map((f) => (
                    <option key={f.field} value={f.field}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-theme-tertiary block mb-1">
                  Value
                </label>
                <select
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  className="w-full bg-theme-raised border hairline-border rounded-control px-2 py-1 text-xs text-theme-primary focus-ring"
                >
                  {AVAILABLE_FIELDS.find(
                    (f) => f.field === selectedField
                  )?.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-theme-subtle">
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="px-2 py-1 text-theme-tertiary hover:text-theme-primary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddChip}
                  className="px-2.5 py-1 bg-accent text-white rounded-control hover:bg-accent-hover transition-colors font-medium"
                >
                  Apply
                </button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* Clear all */}
      {chips.length > 0 && (
        <button
          onClick={handleClearAll}
          className="inline-flex items-center gap-1 text-[11px] text-theme-tertiary hover:text-theme-primary transition-colors"
        >
          <RotateCcw size={11} strokeWidth={1.5} />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
