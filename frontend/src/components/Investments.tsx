import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Spinner from './spinners/Spinner';
import SlackDashboardCard from './SlackDashboardCard';
import { TrendingUp, DollarSign, Target, CheckCircle } from 'lucide-react';

interface InvestmentPlan {
  id: number;
  plan: string;
  minimumAmount: number;
  maximumAmount: number;
  interestRate: number;
  totalReturns: number;
  createdAt: string;
  updatedAt: string;
}

interface Investment {
  id: number;
  userId: number;
  planId: number | null;
  amount: number;
  asset: string;
  status: string;
  type: string;
  createdAt: string;
  lastInterestCalculation?: string;
  plan?: InvestmentPlan;
}

const Investments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/api/users/transactions', {
        params: {
          type: 'SUBSCRIPTION'
        }
      });

      setInvestments(response.data.transactions || []);
    } catch (error: any) {
      console.error('Error fetching investments:', error);
      setError(error.response?.data?.message || 'Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestments = investments.filter(investment => {
    if (statusFilter === 'all') return true;
    return investment.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProfit = (investment: Investment) => {
    if (!investment.plan || !investment.amount || !investment.createdAt) return 0;

    const amount = parseFloat(investment.amount.toString());
    if (isNaN(amount)) return 0;

    const createdDate = new Date(investment.createdAt);
    if (isNaN(createdDate.getTime())) return 0;

    const interestRate = parseFloat(investment.plan.interestRate?.toString() || '0');
    if (isNaN(interestRate)) return 0;

    const daysActive = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    if (daysActive < 0) return 0;

    const dailyRate = interestRate / 100 / 365;
    return amount * dailyRate * daysActive;
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';

    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SlackDashboardCard
          title="Total Investments"
          value={investments.length.toString()}
          icon={TrendingUp}
          color="blue"
        />

        <SlackDashboardCard
          title="Total Invested"
          value={formatCurrency(investments.reduce((sum, inv) => {
            const amount = parseFloat(inv?.amount?.toString() || '0');
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0))}
          icon={DollarSign}
          color="green"
        />

        <SlackDashboardCard
          title="Active Investments"
          value={investments.filter(inv => inv?.status?.toUpperCase() === 'ACTIVE').length.toString()}
          icon={Target}
          color="purple"
        />

        <SlackDashboardCard
          title="Total Profit"
          value={formatCurrency(investments.reduce((sum, inv) => {
            const profit = calculateProfit(inv);
            return sum + (isNaN(profit) ? 0 : profit);
          }, 0))}
          icon={CheckCircle}
          color="yellow"
        />
      </div>

      {/* Main Investments Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-0 dark:border dark:border-gray-600 rounded-lg">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>My Investments</span>
            </h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-black px-3 py-2 rounded-md border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {filteredInvestments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-gray-500 text-lg">No investments found</p>
              <p className="text-gray-400">Start investing to see your portfolio here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Invested</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Profit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Invested</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Interest</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredInvestments.map((investment) => (
                    <tr key={investment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <span className="font-medium">{investment.plan?.plan || 'Unknown Plan'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(parseFloat(investment?.amount?.toString() || '0') || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-orange-600">
                              {(investment?.asset || 'N/A').substring(0, 1)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">{investment?.asset || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {investment.plan?.interestRate || 0}% APY
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {formatCurrency(calculateProfit(investment))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(investment?.status || 'UNKNOWN')}`}>
                          {investment?.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(investment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {investment.lastInterestCalculation ?
                          formatDate(investment.lastInterestCalculation) :
                          <span className="text-yellow-600 text-xs">Pending</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investments;