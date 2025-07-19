import { useEffect, useMemo, useState } from 'react';
import { SlackDashboardCard } from './SlackDashboardCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useStore } from '../store/useStore';
import axiosInstance from '../api/axiosInstance';
import Spinner from './spinners/Spinner';
import {
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  CreditCard,
  TrendingUp,
  Bitcoin,
  Banknote,
  Coins,
  ChevronLeft,
  ChevronRight,
  Copy,
  Clock
} from 'lucide-react';

interface UserBalances {
  bitcoinBalance?: number;
  ethereumBalance?: number;
  usdtBalance?: number;
  usdcBalance?: number;
}

const Overview = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balances, setBalances] = useState<UserBalances>({});
  const [mainBalance, setMainBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 3;

  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const setActiveComponent = useStore(state => state.setActiveComponent);

  // Memoize user ID to prevent unnecessary effect triggers
  const userId = useMemo(() => user?.id, [user?.id]);

  // User data effect
  useEffect(() => {
    const controller = new AbortController();
    console.log('fetching user main Balance', user.mainBalance);

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/user', {
          params: { userDataId: localStorage.getItem('userId') },
          withCredentials: true,
          signal: controller.signal
        });

        if (!controller.signal.aborted) {
          setUser({
            mainBalance: response.data.user.mainBalance ?? 0,
            ...response.data.user
          });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('User data error:', error);
        }
      }
    };

    fetchUserData();
    return () => controller.abort();
  }, [setUser]);


  // Transactions and balances effect
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);


        const [mainBalRes, transRes, balanceRes] = await Promise.all([
          axiosInstance.get(`/api/users/main-balance`, {
            signal: controller.signal
          }),
          axiosInstance.get(`/api/users/transactions`, {
            signal: controller.signal
          }),
          axiosInstance.get(`/api/users/balances`, {
            signal: controller.signal
          })
        ]);

        if (!controller.signal.aborted) {
          setMainBalance(mainBalRes.data.mainBalance || 0);
          setTransactions(transRes.data.transactions || []);
          setBalances(balanceRes.data.balances || {});
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Data fetch error:', error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [userId]);

  // Memoize paginated transactions
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * activitiesPerPage;
    const end = currentPage * activitiesPerPage;
    return transactions.slice(start, end);
  }, [transactions, currentPage]);



  const handleNextPage = () => {
    if (currentPage * activitiesPerPage < transactions.length) {
      setCurrentPage(p => p + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  };


  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Top up Apex account': return <ArrowUpRight className="w-5 h-5 text-green-500" />;
      case 'Withdraw from Apex account': return <ArrowDownLeft className="w-5 h-5 text-red-500" />;
      case 'Transfer to savings': return <DollarSign className="w-5 h-5 text-blue-500" />;
      case 'Received payment': return <CreditCard className="w-5 h-5 text-yellow-500" />;
      default: return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="space-y-2">
          <p className="text-xl text-gray-600 dark:text-gray-400">Welcome back,</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{user?.name}</p>
          <p className="text-gray-500 dark:text-gray-400">Here's a summary of your account.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveComponent('Invest')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Invest & Earn
          </button>
          <button
            onClick={() => setActiveComponent('Deposits')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Deposit Now
          </button>
        </div>
      </div>

      {/* Verification Alert */}
      {!user?.isVerified && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">
              Caution: You need to verify your account to gain full functionality.{' '}
              <span
                className="text-yellow-600 cursor-pointer underline font-medium"
                onClick={() => setActiveComponent('verify')}
              >
                Let's get started!
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SlackDashboardCard
          title="Main Balance"
          value={`$${Number(mainBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Total portfolio value"
          icon={DollarSign}
          color="green"
          trend={{ value: 12.5, direction: "up" }}
          loading={isLoading}
        />

        <SlackDashboardCard
          title="Bitcoin"
          value={`${Number(balances.bitcoinBalance || 0).toFixed(8)} BTC`}
          subtitle="Bitcoin balance"
          icon={Bitcoin}
          color="yellow"
          trend={{ value: 5.2, direction: "up" }}
          loading={isLoading}
        />

        <SlackDashboardCard
          title="Ethereum"
          value={`${Number(balances.ethereumBalance || 0).toFixed(6)} ETH`}
          subtitle="Ethereum balance"
          icon={Banknote}
          color="blue"
          trend={{ value: 8.7, direction: "up" }}
          loading={isLoading}
        />

        <SlackDashboardCard
          title="Stablecoins"
          value={`$${(Number(balances.usdtBalance || 0) + Number(balances.usdcBalance || 0)).toFixed(2)}`}
          subtitle="USDT + USDC balance"
          icon={Coins}
          color="indigo"
          trend={{ value: 2.1, direction: "up" }}
          loading={isLoading}
        />
      </div>

      {/* Interest Information Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-800">
              💰 Earning Interest Daily
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Your active investments are earning interest automatically every 24 hours.
              Interest is calculated based on your investment plans and credited directly to your main balance.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-green-600 font-medium">Next Calculation</p>
              <p className="text-xs text-green-500">Every day at 12:00 AM UTC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#2c2d33] rounded-lg border border-gray-200 dark:border-[#3c3f4c] shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#3c3f4c]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h2>
            </div>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
              See History
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : paginatedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No transactions yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Your transaction history will appear here.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((transaction: any, index: number) => (
                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-[#2c2d33]/50 transition-colors">
                      <TableCell className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        <span className="font-medium">{transaction.type}</span>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{transaction.asset}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'COMPLETED' || transaction.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{transaction.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {Math.ceil(transactions.length / activitiesPerPage) > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-[#3c3f4c]">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {(currentPage - 1) * activitiesPerPage + 1} to{' '}
                    {Math.min(currentPage * activitiesPerPage, transactions.length)} of{' '}
                    {transactions.length} transactions
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-[#3c3f4c] rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2c2d33] hover:bg-gray-50 dark:hover:bg-[#3c3f4c] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Page {currentPage} of {Math.ceil(transactions.length / activitiesPerPage)}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage * activitiesPerPage >= transactions.length}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-[#3c3f4c] rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2c2d33] hover:bg-gray-50 dark:hover:bg-[#3c3f4c] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-white dark:bg-[#2c2d33] rounded-lg border border-gray-200 dark:border-[#3c3f4c] shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#3c3f4c]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Refer Us & Earn</h3>
            <span className="text-sm text-gray-400 bg-gray-100 dark:bg-[#3c3f4c] px-2 py-1 rounded">Coming Soon</span>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Use the below link to invite your friends and earn rewards.
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-50 dark:bg-[#1a1d29] border border-gray-200 dark:border-[#3c3f4c] rounded-lg px-3 py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">teamapexllc.com/ref?ref=disparrown</span>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;