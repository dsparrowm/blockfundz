import { useEffect, useState } from 'react';
import { SlackDashboardCard } from './SlackDashboardCard';
import {
  ArrowUp,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import Spinner from './spinners/Spinner';

interface Withdrawal {
  id: string;
  amount: number;
  asset: string;
  network: string;
  address: string;
  status: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

const WithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    setError('');
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await axiosInstance.get('/api/withdrawals', {
        params: {
          userId: userId
        }
      });

      setWithdrawals(response.data.withdrawalRequests || []);
    } catch (error: any) {
      console.error('Error fetching withdrawals:', error);
      setError(error.response?.data?.message || 'Failed to fetch withdrawal history');
    } finally {
      setLoading(false);
    }
  };

  // Filter withdrawals based on search and status
  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.amount.toString().includes(searchTerm) ||
      withdrawal.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || withdrawal.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);

  // Calculate stats for dashboard cards
  const totalAmount = withdrawals.reduce((sum, wd) => sum + wd.amount, 0);
  const approvedCount = withdrawals.filter(wd => wd.status.toUpperCase() === 'APPROVED').length;
  const pendingCount = withdrawals.filter(wd => wd.status.toUpperCase() === 'PENDING').length;

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
      case 'COMPLETED':
        return 'text-green-600 bg-green-50 border border-green-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border border-yellow-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: string) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SlackDashboardCard
          title="Total Withdrawals"
          value={withdrawals.length.toString()}
          subtitle="All time withdrawals"
          icon={ArrowUp}
          color="red"
          trend={withdrawals.length > 0 ? { value: 12, direction: "up" } : undefined}
          loading={loading}
        />

        <SlackDashboardCard
          title="Total Amount"
          value={`$${totalAmount.toFixed(2)}`}
          subtitle="Total withdrawn"
          icon={DollarSign}
          color="blue"
          trend={totalAmount > 0 ? { value: 8, direction: "up" } : undefined}
          loading={loading}
        />

        <SlackDashboardCard
          title="Approved"
          value={approvedCount.toString()}
          subtitle="Successful withdrawals"
          icon={CheckCircle}
          color="green"
          trend={approvedCount > 0 ? { value: 15, direction: "up" } : undefined}
          loading={loading}
        />

        <SlackDashboardCard
          title="Pending"
          value={pendingCount.toString()}
          subtitle="Awaiting approval"
          icon={Clock}
          color="yellow"
          loading={loading}
        />
      </div>

      {/* Main Withdrawal History Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowUp className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Withdrawal History</h2>
            </div>
            <button
              onClick={fetchWithdrawals}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search withdrawals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-[#3c3f4c] dark:bg-[#2c2d33] dark:text-white dark:focus:ring-[#4a154b]"
              />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:border-[#3c3f4c] dark:bg-[#2c2d33] dark:text-white dark:focus:ring-[#4a154b]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Withdrawal List */}
          <div className="space-y-4">
            {paginatedWithdrawals.length === 0 ? (
              <div className="text-center py-8">
                <ArrowUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawals found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'You haven\'t made any withdrawals yet.'}
                </p>
              </div>
            ) : (
              paginatedWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-lg font-semibold text-gray-900">
                          ${withdrawal.amount.toFixed(2)} {withdrawal.asset}
                        </div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                          {getStatusIcon(withdrawal.status)}
                          <span className="ml-1">{withdrawal.status}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Network:</span> {withdrawal.network}
                        </div>
                        <div>
                          <span className="font-medium">Address:</span> {formatAddress(withdrawal.address)}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {formatDate(withdrawal.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredWithdrawals.length)} of {filteredWithdrawals.length} withdrawals
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalHistory;