import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  align?: 'left' | 'center' | 'right';
  mono?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  caption?: string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  caption,
  emptyMessage = 'No records available.',
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`w-full max-w-full overflow-x-auto block ${className}`}>
      <table className="w-full min-w-[500px] text-left border-collapse font-sans text-sm">
        {caption && (
          <caption className="text-left font-mono text-xs uppercase tracking-wider text-slate mb-2">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-ink/20 text-slate">
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                style={{ width: col.width }}
                className={`py-2 px-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center font-sans text-xs text-slate italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={keyExtractor(row, rowIdx)}
                className="hover:bg-ink/[0.02] transition-colors duration-120"
              >
                {columns.map((col, colIdx) => {
                  const val =
                    typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode);

                  return (
                    <td
                      key={colIdx}
                      className={`py-2.5 px-3 ${col.mono ? 'font-mono text-xs tabular-nums' : 'text-sm'} ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
