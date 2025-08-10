import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../ui/table";
import {
    Search,
    Calendar,
    Filter,
    Download,
    Eye,
    Shield,
    TrendingUp,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AuditEntry {
    id: number;
    timestamp: string;
    action: string;
    asset: string;
    amount: number;
    usdEquivalent?: number;
    status: string;
    details: string;
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
}

interface AuditSummary {
    totalCredits: number;
    totalResets: number;
    totalWithdrawals: number;
    recentActions: number;
    totalUsdValue: number;
}

const AdminAuditTrail: React.FC = () => {
    const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
    const [summary, setSummary] = useState<AuditSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);
    const pageSize = 20;

    useEffect(() => {
        fetchAuditTrail();
        fetchAuditSummary();
    }, [currentPage, actionFilter, startDate, endDate]);

    const fetchAuditTrail = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                limit: pageSize.toString(),
                offset: (currentPage * pageSize).toString()
            });

            if (actionFilter) params.append('action', actionFilter);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await axiosInstance.get(`/api/admin/audit/trail?${params}`);

            setAuditEntries(response.data.auditTrail);
            setTotalEntries(response.data.pagination.total);
        } catch (error: any) {
            console.error('Error fetching audit trail:', error);
            toast.error('Failed to fetch audit trail');
        } finally {
            setLoading(false);
        }
    };

    const fetchAuditSummary = async () => {
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await axiosInstance.get(`/api/admin/audit/summary?${params}`);
            setSummary(response.data.summary);
        } catch (error: any) {
            console.error('Error fetching audit summary:', error);
        }
    };

    const getActionBadgeColor = (action: string) => {
        if (action.includes('CREDIT')) return 'bg-green-100 text-green-800';
        if (action.includes('WITHDRAWAL')) return 'bg-red-100 text-red-800';
        if (action.includes('RESET')) return 'bg-orange-100 text-orange-800';
        return 'bg-gray-100 text-gray-800';
    };

    const formatCurrency = (amount: number, asset: string) => {
        if (asset === 'USDT' || asset === 'USDC') {
            return `$${amount.toLocaleString()}`;
        }
        return `${amount.toFixed(6)} ${asset}`;
    };

    const filteredEntries = auditEntries.filter(entry =>
        entry.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{summary.totalCredits}</div>
                            <p className="text-xs text-muted-foreground">Balance credits issued</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Balance Resets</CardTitle>
                            <RefreshCw className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{summary.totalResets}</div>
                            <p className="text-xs text-muted-foreground">Accounts reset to zero</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Actions</CardTitle>
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{summary.recentActions}</div>
                            <p className="text-xs text-muted-foreground">Last 24 hours</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total USD Value</CardTitle>
                            <Shield className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                ${summary.totalUsdValue.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">Admin actions value</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters & Search
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search users or details..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="action">Action Type</Label>
                            <select
                                id="action"
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">All Actions</option>
                                <option value="CREDIT">Credits</option>
                                <option value="WITHDRAWAL">Withdrawals</option>
                                <option value="RESET">Resets</option>
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Button onClick={fetchAuditTrail} disabled={loading}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Audit Trail Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Admin Action Audit Trail</CardTitle>
                    <CardDescription>
                        Comprehensive log of all admin balance modifications and user account changes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Asset</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>USD Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <TableCell key={j}>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : filteredEntries.length > 0 ? (
                                filteredEntries.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="font-mono text-sm">
                                            {format(new Date(entry.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getActionBadgeColor(entry.action)}>
                                                {entry.action.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{entry.user.name}</div>
                                                <div className="text-sm text-muted-foreground">{entry.user.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{entry.asset}</TableCell>
                                        <TableCell className="font-mono">
                                            {formatCurrency(entry.amount, entry.asset)}
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {entry.usdEquivalent ? `$${entry.usdEquivalent.toFixed(2)}` : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={entry.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                {entry.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate" title={entry.details}>
                                            {entry.details}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-6">
                                        No audit entries found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {currentPage * pageSize + 1} to{' '}
                            {Math.min((currentPage + 1) * pageSize, totalEntries)} of {totalEntries} entries
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                disabled={currentPage === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={(currentPage + 1) * pageSize >= totalEntries}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAuditTrail;
