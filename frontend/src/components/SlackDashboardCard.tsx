import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import {
    TrendingUp,
    TrendingDown,
    MoreVertical,
    ExternalLink,
    Download,
    RefreshCw,
    Copy,
    Share2,
    Eye,
    Settings
} from 'lucide-react';

interface SlackDashboardCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        direction: 'up' | 'down';
        period?: string;
    };
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
    children?: React.ReactNode;
    className?: string;
    showActions?: boolean;
    loading?: boolean;
    onRefresh?: () => void;
    onExport?: () => void;
    onViewDetails?: () => void;
    onShare?: () => void;
}

const colorClasses = {
    blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        accent: 'border-blue-200',
        button: 'hover:bg-blue-100'
    },
    green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        accent: 'border-green-200',
        button: 'hover:bg-green-100'
    },
    red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        accent: 'border-red-200',
        button: 'hover:bg-red-100'
    },
    yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        accent: 'border-yellow-200',
        button: 'hover:bg-yellow-100'
    },
    purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        accent: 'border-purple-200',
        button: 'hover:bg-purple-100'
    },
    indigo: {
        bg: 'bg-indigo-50',
        icon: 'text-indigo-600',
        accent: 'border-indigo-200',
        button: 'hover:bg-indigo-100'
    }
};

export const SlackDashboardCard: React.FC<SlackDashboardCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = 'blue',
    children,
    className = '',
    showActions = true,
    loading = false,
    onRefresh,
    onExport,
    onViewDetails,
    onShare
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const colors = colorClasses[color];

    const handleCopyValue = () => {
        navigator.clipboard.writeText(value.toString());
        setShowDropdown(false);
        // You could show a toast notification here
    };

    const defaultActions = [
        {
            icon: RefreshCw,
            label: 'Refresh Data',
            onClick: onRefresh || (() => window.location.reload())
        },
        {
            icon: Eye,
            label: 'View Details',
            onClick: onViewDetails || (() => { })
        },
        {
            icon: Copy,
            label: 'Copy Value',
            onClick: handleCopyValue
        },
        {
            icon: Download,
            label: 'Export Data',
            onClick: onExport || (() => { })
        },
        {
            icon: Share2,
            label: 'Share',
            onClick: onShare || (() => { })
        }
    ];

    if (loading) {
        return (
            <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md relative ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center space-x-2">
                    {Icon && (
                        <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${colors.icon}`} />
                        </div>
                    )}
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
                </div>

                {showActions && (
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => onViewDetails?.()}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="View Details"
                        >
                            <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => onExport?.()}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Export Data"
                        >
                            <Download className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => onRefresh?.()}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className="w-3 h-3" />
                        </button>

                        {/* Dropdown Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                title="More Actions"
                            >
                                <MoreVertical className="w-3 h-3" />
                            </button>

                            {showDropdown && (
                                <>
                                    {/* Overlay to close dropdown */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowDropdown(false)}
                                    ></div>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-8 z-20 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                                        {defaultActions.map((action, index) => {
                                            const ActionIcon = action.icon;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={action.onClick}
                                                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <ActionIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                    <span>{action.label}</span>
                                                </button>
                                            );
                                        })}

                                        <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                                            <button
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                }}
                                                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                <span>Card Settings</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </span>
                    {trend && (
                        <div className={`flex items-center text-sm ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {trend.direction === 'up' ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            <span>{Math.abs(trend.value)}%</span>
                            {trend.period && (
                                <span className="text-gray-500 dark:text-gray-400 ml-1">{trend.period}</span>
                            )}
                        </div>
                    )}
                </div>

                {subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{subtitle}</p>
                )}

                {children && (
                    <div className="mt-4">{children}</div>
                )}
            </div>

            {/* Bottom accent */}
            <div className={`h-1 ${colors.bg} rounded-b-lg`}></div>
        </div>
    );
};

export default SlackDashboardCard;
