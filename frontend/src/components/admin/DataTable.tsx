import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Download, Trash2, CheckSquare, Square, Filter } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: string;
  title?: string;
  onDeleteSelected?: (selectedIds: string[]) => void;
  idKey?: string;
}

export function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  searchKey = 'title',
  title = 'Data Table',
  onDeleteSelected,
  idKey = 'id',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter((item) => {
      const val = item[searchKey] || item.fullName || item.email || item.title || item.name || '';
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchKey]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((d) => d[idKey]));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = data.map((item) =>
      columns.map((c) => `"${String(item[c.key] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 font-mono text-xs">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex-1 sm:w-64">
            <Search className="w-4 h-4 text-brand-400" />
            <input
              type="text"
              placeholder={`Search ${title}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>
          <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">
            {filteredData.length} records
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {selectedIds.length > 0 && onDeleteSelected && (
            <button
              onClick={() => {
                onDeleteSelected(selectedIds);
                setSelectedIds([]);
              }}
              className="px-4 py-2 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-xl font-bold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl font-bold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-brand-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3 w-8">
                <button onClick={handleSelectAll} className="text-slate-400 hover:text-white">
                  {selectedIds.length === paginatedData.length && paginatedData.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-brand-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`p-3 select-none ${col.sortable !== false ? 'cursor-pointer hover:text-white' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {sortKey === col.key && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-400" /> : <ChevronDown className="w-3 h-3 text-brand-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => {
                const id = item[idKey];
                const isSelected = selectedIds.includes(id);
                return (
                  <tr key={id} className={`hover:bg-slate-900/50 transition-colors ${isSelected ? 'bg-brand-500/10' : ''}`}>
                    <td className="p-3">
                      <button onClick={() => handleSelectRow(id)} className="text-slate-400 hover:text-white">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-brand-400" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="p-3 text-slate-200">
                        {col.render ? col.render(item) : String(item[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-slate-500">
                  No records found matching current query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-slate-400 text-[11px]">
        <div>
          Showing {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
        </div>

        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-800 text-slate-200 p-1.5 rounded-lg text-xs"
          >
            {[5, 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </select>

          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg font-bold text-brand-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
