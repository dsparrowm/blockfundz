import { useEffect, useState } from 'react';
import { SlackDashboardCard } from './SlackDashboardCard';
import {
  ArrowDown,
  Search,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import Spinner from './spinners/Spinner';

interface Deposit {
  id: string;
  type: string;
  asset: string;
  amount: number;
  network: string;
  status: string;
  date: string;
}

const DepositHistory = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/api/deposits');

      setDeposits(response.data.deposits || []);
    } catch (error: any) {
      console.error('Error fetching deposits:', error);
      setError(error.response?.data?.message || 'Failed to fetch deposit history');
    } finally {
      setLoading(false);
    }
  };

  // Filter deposits based on search and status
  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = deposit.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.amount.toString().includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || deposit.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeposits = filteredDeposits.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'ACTIVE':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'INACTIVE':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  // Calculate stats
  const totalAmount = deposits.reduce((sum, dep) => sum + dep.amount, 0);
  const recentDeposits = deposits.filter(dep => {
    const depDate = new Date(dep.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return depDate >= weekAgo;
  }).length;
  const completedDeposits = deposits.filter(dep => dep.status.toUpperCase() === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SlackDashboardCard title="Total Deposits" value={0} loading={true} color="green" />
          <SlackDashboardCard title="Total Amount" value="$0.00" loading={true} color="blue" />
          <SlackDashboardCard title="Recent Deposits" value={0} loading={true} color="purple" />
          <SlackDashboardCard title="Completed" value={0} loading={true} color="indigo" />
        </div>
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deposit History</h1>
          <p className="text-gray-600 mt-1">Track all your cryptocurrency deposits and transactions</p>
        </div>
        <button
          onClick={fetchDeposits}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SlackDashboardCard
          title="Total Deposits"
          value={deposits.length}
          subtitle="All deposit transactions"
          icon={ArrowDown}
          color="green"
          trend={{
            value: 12.5,
            direction: 'up',
            period: 'this month'
          }}
        />

        <SlackDashboardCard
          title="Total Amount"
          value={`$${totalAmount.toFixed(2)}`}
          subtitle="Total deposited value"
          icon={DollarSign}
          color="blue"
          trend={{
            value: 8.3,
            direction: 'up',
            period: 'this week'
          }}
        />

        <SlackDashboardCard
          title="Recent Deposits"
          value={recentDeposits}
          subtitle="Last 7 days"
          icon={Calendar}
          color="purple"
          trend={{
            value: 15.2,
            direction: 'up',
            period: 'vs last week'
          }}
        />

        <SlackDashboardCard
          title="Completed"
          value={completedDeposits}
          subtitle="Successful deposits"
          icon={CheckCircle}
          color="indigo"
          trend={{
            value: 2.1,
            direction: 'up',
            period: 'completion rate'
          }}
        />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Card Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">All Deposits</h2>
              <p className="text-sm text-gray-600 mt-1">Manage and view your deposit history</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deposits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-[#3c3f4c] dark:bg-[#2c2d33] dark:text-white dark:focus:ring-[#4a154b]"
                />
              </div>
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:border-[#3c3f4c] dark:bg-[#2c2d33] dark:text-white dark:focus:ring-[#4a154b]"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {paginatedDeposits.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowDown className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deposits found</h3>
              <p className="text-gray-600">Your deposit history will appear here once you make your first deposit.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Deposits Grid */}
              <div className="grid gap-4">
                {paginatedDeposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {deposit.asset.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">#{deposit.id}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`}>
                            {getStatusIcon(deposit.status)}
                            <span className="ml-1">{deposit.status}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{deposit.asset} • {deposit.network}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{deposit.amount.toFixed(6)} {deposit.asset}</p>
                      <p className="text-sm text-gray-600">{formatDate(deposit.date)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDeposits.length)} of {filteredDeposits.length} deposits
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositHistory;