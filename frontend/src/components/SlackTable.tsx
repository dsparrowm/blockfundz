import React from 'react';
import { MoreVertical, ArrowUpDown, Filter, Download, RefreshCw } from 'lucide-react';

interface Column {
    key: string;
    title: string;
    sortable?: boolean;
    width?: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface SlackTableProps {
    columns: Column[];
    data: any[];
    loading?: boolean;
    title?: string;
    subtitle?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    onRefresh?: () => void;
    actions?: React.ReactNode;
    className?: string;
}

export const SlackTable: React.FC<SlackTableProps> = ({
    columns,
    data,
    loading = false,
    title,
    subtitle,
    searchValue,
    onSearchChange,
    onRefresh,
    actions,
    className = ''
}) => {
    if (loading) {
        return (
            <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 ${className}`}>
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="grid grid-cols-4 gap-4">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm ${className}`}>
            {/* Header */}
            {(title || subtitle || searchValue !== undefined || onRefresh || actions) && (
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {searchValue !== undefined && onSearchChange && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchValue}
                                        onChange={(e) => onSearchChange(e.target.value)}
                                        className="w-64 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}

                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>

                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                            </button>

                            {onRefresh && (
                                <button
                                    onClick={onRefresh}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}

                            {actions}
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width || ''}`}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.title}</span>
                                        {column.sortable && (
                                            <ArrowUpDown className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Filter className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <p className="text-sm">No data found</p>
                                        <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-4 py-4 whitespace-nowrap text-sm">
                                            {column.render
                                                ? column.render(row[column.key], row)
                                                : (
                                                    <span className="text-gray-900">
                                                        {row[column.key] || '-'}
                                                    </span>
                                                )
                                            }
                                        </td>
                                    ))}
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            {data.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Showing {data.length} results</span>
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                                Previous
                            </button>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded">1</span>
                            <button className="px-3 py-1 text-gray-400 hover:text-gray-600">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlackTable;
