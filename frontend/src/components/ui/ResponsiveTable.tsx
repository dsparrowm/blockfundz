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
    // Helper to extract header labels and row cells from passed children
    const extract = (node: React.ReactNode) => {
        const headers: string[] = [];
        const rows: React.ReactNode[][] = [];

        React.Children.forEach(node, (child) => {
            if (!React.isValidElement(child)) return;

            const typeName = (child.type as any)?.displayName || (child.type as any)?.name;

            // TableHeader -> extract th text
            if (typeName === 'TableHeader' || typeName === 'thead') {
                React.Children.forEach((child.props as any).children, (tr) => {
                    if (!React.isValidElement(tr)) return;
                    React.Children.forEach((tr.props as any).children, (th) => {
                        if (!React.isValidElement(th) && (typeof th === 'string' || typeof th === 'number')) {
                            headers.push(String(th));
                            return;
                        }
                        // get inner text of th
                        const text = getTextContent(th);
                        headers.push(text || '');
                    });
                });
            }

            // TableBody -> extract rows and cells
            if (typeName === 'TableBody' || typeName === 'tbody') {
                React.Children.forEach((child.props as any).children, (tr) => {
                    if (!React.isValidElement(tr)) return;
                    const cells: React.ReactNode[] = [];
                    React.Children.forEach((tr.props as any).children, (td) => {
                        cells.push(td);
                    });
                    if (cells.length) rows.push(cells);
                });
            }
        });

        return { headers, rows };
    };

    const getTextContent = (node: React.ReactNode): string => {
        if (node == null) return '';
        if (typeof node === 'string' || typeof node === 'number') return String(node);
        if (React.isValidElement(node)) {
            let acc = '';
            React.Children.forEach(node.props.children, (c) => {
                acc += getTextContent(c);
            });
            return acc.trim();
        }
        return '';
    };

    const { headers, rows } = extract(children);

    return (
        <>
            {/* Desktop / wide screens: show the table */}
            <div className={`hidden lg:block w-full overflow-x-auto ${className}`}>
                <Table>
                    {children}
                </Table>
            </div>

            {/* Mobile: stacked cards using extracted headers and rows */}
            <MobileCardList className={className}>
                {rows.length > 0 ? (
                    rows.map((cells, rowIndex) => (
                        <MobileCard key={rowIndex}>
                            <div className="grid grid-cols-1 gap-2">
                                {cells.map((cell, i) => (
                                    <div key={i} className="flex justify-between items-start">
                                        <div className="text-xs text-slate-500 pr-4">{headers[i] || `Column ${i + 1}`}</div>
                                        <div className="text-sm text-slate-900 dark:text-gray-100">{cell}</div>
                                    </div>
                                ))}
                            </div>
                        </MobileCard>
                    ))
                ) : (
                    // Fallback: if we couldn't parse rows, show nothing on mobile (keep desktop table available)
                    <div className="text-sm text-slate-500">No data</div>
                )}
            </MobileCardList>
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
