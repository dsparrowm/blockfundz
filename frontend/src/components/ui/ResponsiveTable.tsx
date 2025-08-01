import React from 'react';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "./table";

interface ResponsiveTableProps {
    children: React.ReactNode;
    className?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
    children,
    className = ''
}) => {
    return (
        <>
            {/* Desktop Table */}
            <div className={`hidden lg:block overflow-x-auto ${className}`}>
                <Table>
                    {children}
                </Table>
            </div>
        </>
    );
};

interface MobileCardListProps {
    children: React.ReactNode;
    className?: string;
}

export const MobileCardList: React.FC<MobileCardListProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`lg:hidden space-y-3 ${className}`}>
            {children}
        </div>
    );
};

interface MobileCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({
    children,
    className = '',
    onClick
}) => {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default ResponsiveTable;
