import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

// Standard building blocks
export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ children, className = '', ...props }) => (
  <div className="w-full overflow-x-auto">
    <table className={`w-full text-left border-collapse ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = '', ...props }) => (
  <thead className={`bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = '', ...props }) => (
  <tbody className={`divide-y divide-slate-100 dark:divide-slate-800 ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className = '', ...props }) => (
  <tr className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors ${className}`} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => (
  <th className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => (
  <td className={`px-5 py-4.0 text-sm text-slate-700 dark:text-slate-300 ${className}`} {...props}>
    {children}
  </td>
);

// High-level DataGrid Component
export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface TableFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  filters?: TableFilter[];
  pageSize?: number;
}

export function DataGrid<T extends { id: string | number }>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  filters = [],
  pageSize = 5,
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters or search change
  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value === '') {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Sort handler
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Process data (Filter -> Search -> Sort)
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Filter
    Object.entries(activeFilters).forEach(([key, val]) => {
      result = result.filter((row: any) => {
        const rowVal = row[key];
        return String(rowVal).toLowerCase() === val.toLowerCase();
      });
    });

    // 2. Search
    if (searchTerm && searchKey) {
      result = result.filter((row: any) => {
        const rowVal = row[searchKey];
        return String(rowVal).toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // 3. Sort
    if (sortConfig) {
      result.sort((a: any, b: any) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, activeFilters, searchTerm, searchKey, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filter Toolbar */}
      {(searchKey || filters.length > 0) && (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex-1 max-w-sm">
            {searchKey && (
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                leftIcon={<Search size={16} />}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-2.5 items-center">
            {filters.map((filt) => (
              <div key={filt.key} className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{filt.label}:</span>
                <select
                  value={activeFilters[filt.key] || ''}
                  onChange={(e) => handleFilterChange(filt.key, e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-main rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  {filt.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-premium bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={col.sortable ? 'cursor-pointer select-none hover:text-slate-800 dark:hover:text-slate-200' : ''}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortConfig?.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row) : String((row as any)[col.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-10 text-slate-400">
                  No matching records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing Page <span className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft size={14} className="mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
