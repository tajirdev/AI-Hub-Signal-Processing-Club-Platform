import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';

export default function DataTable({
  title,
  subtitle,
  searchPlaceholder = 'Search records...',
  searchValue,
  onSearchChange,
  onCreateNew,
  createButtonText = 'Add New',
  columns = [],
  data = [],
  loading = false,
  page = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  actions,
  filterComponent,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header & Controls Toolbar */}
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {filterComponent}

          {onSearchChange && (
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-xs">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800"
              />
            </div>
          )}

          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-blue-500/20 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              <span>{createButtonText}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50/80 text-gray-700 uppercase font-semibold text-[11px] border-b border-gray-100 tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-5 py-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-5 py-3.5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-16 text-center text-gray-400"
                >
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-blue-600 mb-2" />
                  <p className="text-xs font-medium text-gray-500">Loading records...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-16 text-center text-gray-400"
                >
                  <FontAwesomeIcon icon={faFolderOpen} className="text-3xl text-gray-300 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No records found</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {searchValue ? 'Try refining your search keyword.' : 'Click Add New to create the first record.'}
                  </p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-gray-50/60 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-5 py-3.5 ${col.cellClassName || ''}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-5 py-3.5 text-right space-x-1 whitespace-nowrap">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && onPageChange && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 text-xs text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-800">{data.length}</span> of{' '}
            <span className="font-semibold text-gray-800">{totalItems}</span> records
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className="font-medium text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
