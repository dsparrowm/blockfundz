import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Edit3,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  CreditCard,
  Zap,
  Search,
  X,
  Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import SlackDashboardCard from '../SlackDashboardCard';
import Spinner from '../spinners/Spinner';

interface Transaction {
  id: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'SUBSCRIPTION';
  asset: 'BITCOIN' | 'ETHEREUM' | 'USDT' | 'USDC';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'ACTIVE' | 'INACTIVE';
  date: string;
  details?: string;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  name?: string;
  phone?: string;
  planName?: string;
  planId?: number;
}

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/transactions');

      if (response.data && response.data.transactions) {
        setTransactions(response.data.transactions);
      } else {
        console.error('Unexpected response structure:', response.data);
        showToastMessage('error', 'Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      console.error('Error response:', error.response?.data); // Debug log
      const errorMessage = error.response?.data?.message || 'Failed to fetch transactions';
      showToastMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    setEditLoading(true);
    try {
      const response = await axiosInstance.put(
        `/api/transactions/${selectedTransaction.id}`,
        {
          type: selectedTransaction.type,
          asset: selectedTransaction.asset,
          amount: selectedTransaction.amount,
          status: selectedTransaction.status,
          details: selectedTransaction.details,
          name: selectedTransaction.name,
          phone: selectedTransaction.phone,
          planName: selectedTransaction.planName
        }
      );

      if (response.data && response.data.transaction) {
        setTransactions(prev => prev.map(tx =>
          tx.id === selectedTransaction.id ? { ...tx, ...response.data.transaction } : tx
        ));
        showToastMessage('success', 'Transaction updated successfully');
        setEditDialogOpen(false);
        setSelectedTransaction(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update transaction';
      showToastMessage('error', errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  const showToastMessage = (type: 'success' | 'error', message: string) => {
    setToastMessage({ type, message });
    setShowToast(true);
  };

  React.useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction =>
      Object.values(transaction).some(value =>
        value?.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [transactions, searchText]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Calculate stats
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'COMPLETED').length;
  const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length;
  const activeTransactions = transactions.filter(t => t.status === 'ACTIVE').length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  const getTransactionIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'DEPOSIT': return ArrowDownLeft;
      case 'WITHDRAWAL': return ArrowUpRight;
      case 'SUBSCRIPTION': return CreditCard;
      default: return DollarSign;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'ACTIVE': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'INACTIVE': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'DEPOSIT': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'WITHDRAWAL': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'SUBSCRIPTION': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${toastMessage.type === 'success'
          ? 'bg-green-50 border-green-400 text-green-700'
          : 'bg-red-50 border-red-400 text-red-700'
          }`}>
          <div className="flex items-center">
            {toastMessage.type === 'success' ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <X className="w-5 h-5 mr-2" />
            )}
            <span className="font-medium">{toastMessage.message}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Transaction Management</h1>
              <p className="text-purple-200 text-lg">Monitor and manage all platform transactions</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchTransactions}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur"
                title="Refresh transactions"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur"
                title="Export transactions"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur"
                title="Filter transactions"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SlackDashboardCard
          title="Total Transactions"
          value={totalTransactions}
          subtitle="All time transactions"
          icon={Zap}
          color="purple"
          trend={{
            value: 15.3,
            direction: 'up',
            period: 'this month'
          }}
        />

        <SlackDashboardCard
          title="Completed"
          value={completedTransactions}
          subtitle="Successfully processed"
          icon={Check}
          color="green"
          trend={{
            value: 8.7,
            direction: 'up',
            period: 'this week'
          }}
        />

        <SlackDashboardCard
          title="Total Volume"
          value={`$${totalAmount.toLocaleString()}`}
          subtitle="Transaction volume"
          icon={DollarSign}
          color="blue"
          trend={{
            value: 12.4,
            direction: 'up',
            period: 'this month'
          }}
        />

        <SlackDashboardCard
          title="Active"
          value={activeTransactions}
          subtitle="Currently active"
          icon={Calendar}
          color="yellow"
          trend={{
            value: 2.1,
            direction: 'up',
            period: 'this week'
          }}
        />
      </div>

      {/* Transaction Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 w-80 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedTransactions.map((transaction) => {
              const TypeIcon = getTransactionIcon(transaction.type);
              return (
                <div
                  key={transaction.id}
                  className="group relative bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-blue-50 border border-gray-200 hover:border-purple-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${getTypeColor(transaction.type)} border`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold text-gray-900">#{transaction.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(transaction.type)}`}>
                            {transaction.type}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {transaction.user?.name || transaction.name || 'Unknown'} • {transaction.user?.email || transaction.phone || 'No contact'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.asset}
                          {transaction.planName && ` • ${transaction.planName}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.asset}</p>
                      </div>

                      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => setSelectedTransaction(transaction)}
                            className="opacity-0 group-hover:opacity-100 p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-all duration-200"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                              Edit Transaction #{selectedTransaction?.id}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Update the transaction details below.
                            </DialogDescription>
                          </DialogHeader>

                          <form onSubmit={handleEditTransaction} className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="type" className="text-sm font-medium text-gray-700">Type</Label>
                              <Select
                                value={selectedTransaction?.type || ''}
                                onValueChange={(value) => selectedTransaction && setSelectedTransaction({
                                  ...selectedTransaction,
                                  type: value as 'DEPOSIT' | 'WITHDRAWAL' | 'SUBSCRIPTION'
                                })}
                              >
                                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="DEPOSIT">Deposit</SelectItem>
                                  <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                                  <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="asset" className="text-sm font-medium text-gray-700">Asset</Label>
                              <Select
                                value={selectedTransaction?.asset || ''}
                                onValueChange={(value) => selectedTransaction && setSelectedTransaction({
                                  ...selectedTransaction,
                                  asset: value as 'BITCOIN' | 'ETHEREUM' | 'USDT' | 'USDC'
                                })}
                              >
                                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                  <SelectValue placeholder="Select asset" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BITCOIN">Bitcoin</SelectItem>
                                  <SelectItem value="ETHEREUM">Ethereum</SelectItem>
                                  <SelectItem value="USDT">USDT</SelectItem>
                                  <SelectItem value="USDC">USDC</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount</Label>
                              <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={selectedTransaction?.amount || 0}
                                onChange={(e) => selectedTransaction && setSelectedTransaction({
                                  ...selectedTransaction,
                                  amount: Number(e.target.value)
                                })}
                                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="details" className="text-sm font-medium text-gray-700">Details</Label>
                              <Input
                                id="details"
                                value={selectedTransaction?.details || ''}
                                onChange={(e) => selectedTransaction && setSelectedTransaction({
                                  ...selectedTransaction,
                                  details: e.target.value
                                })}
                                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                placeholder="Transaction details"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                              <Select
                                value={selectedTransaction?.status || ''}
                                onValueChange={(value) => selectedTransaction && setSelectedTransaction({
                                  ...selectedTransaction,
                                  status: value
                                })}
                              >
                                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="COMPLETED">Completed</SelectItem>
                                  <SelectItem value="PENDING">Pending</SelectItem>
                                  <SelectItem value="ACTIVE">Active</SelectItem>
                                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                              <Button
                                type="submit"
                                disabled={editLoading}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                {editLoading ? 'Saving...' : 'Save Changes'}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || totalPages === 0}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Previous
                </Button>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded border border-purple-200 text-sm">
                  {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;
