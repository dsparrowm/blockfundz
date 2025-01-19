import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from '../store/useStore';
import axiosInstance from '../api/axiosInstance';
import Cookies from 'js-cookie';

const Overview = () => {
  // State for transactions
  interface Transaction {
    id: number;
    type: string;
    asset: string;
    amount: number;
    status: string;
    date: string;
    txHash: string;
    planName?: string;
    duration?: string;
  }

  interface Balances {
    bitcoinBalance: number;
    ethereumBalance: number;
    usdtBalance: number;
    usdcBalance: number;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<Balances | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ message: string } | null>(null);

  // Filter states
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get user from store
  const user = useStore((state) => state.user);


  // Fetch transactions and balances effect
  useEffect(() => {
    const fetchTransactionsAndBalances = async () => {
      try {
        setIsLoading(true);


        // Fetch transactions
        const transactionsResponse = await axiosInstance.get('/api/users/transactions', {
          params: {
            userId: user.id,
          },
          withCredentials: true,
        });
        setTransactions(transactionsResponse.data.transactions);

        // Fetch balances
        const balancesResponse = await axiosInstance.get('/api/users/balances', {
          params: {
            userId: user.id,
          },
          withCredentials: true,
        });
        setBalances(balancesResponse.data.balances);

      } catch (error) {
        setTransactions([]);
        setError({ message: 'Error fetching data' });
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch transactions and balances when component mounts or user changes
    if (user) {
      fetchTransactionsAndBalances();
    }
  }, [user]);

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const typeMatch = typeFilter === 'all' || tx.type === typeFilter;
    const statusMatch = statusFilter === 'all' || tx.status === statusFilter;
    return typeMatch && statusMatch;
  });

  // Format date
  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get transaction type icon and color
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'deposit':
        return {
          icon: '↓',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'withdrawal':
        return {
          icon: '↑',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        };
      case 'subscription':
        return {
          icon: '★',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
        };
      default:
        return {
          icon: '•',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        };
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card className="w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
        <div className="text-center py-10 text-gray-400">
          Loading transactions...
        </div>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
        <div className="text-center py-10 text-red-400">
          Error loading transactions: {error.message}
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      <CardHeader>
        <CardTitle className="text-white-400 mb-7">Transaction History</CardTitle>
        <div className="flex space-x-4 mt-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1 text-white bg-gray-800/50 "
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="subscription">Subscriptions</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1 text-white-400 bg-gray-800/50 "
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white-400 mb-4">Balances</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-400">Bitcoin Balance</h4>
              <p className="text-lg font-semibold text-white">{balances?.bitcoinBalance} BTC</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-400">Ethereum Balance</h4>
              <p className="text-lg font-semibold text-white">{balances?.ethereumBalance} ETH</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-400">USDT Balance</h4>
              <p className="text-lg font-semibold text-white">{balances?.usdtBalance} USDT</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-400">USDC Balance</h4>
              <p className="text-lg font-semibold text-white">{balances?.usdcBalance} USDC</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="text-white">
            <TableHeader className="text-red-500">
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                    No Transactions yet
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => {
                  const typeStyle = getTypeStyles(tx.type);
                  return (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`w-8 h-8 ${typeStyle.bgColor} ${typeStyle.color} rounded-full flex items-center justify-center`}>
                            {typeStyle.icon}
                          </span>
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{tx.asset}</TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(tx.date)}</TableCell>
                      <TableCell>
                        {tx.type === 'subscription' ? (
                          <div className="text-sm">
                            <div>{tx.planName}</div>
                            <div className="text-gray-500">{tx.duration}</div>
                          </div>
                        ) : (
                          <div className="text-sm font-mono">
                            {tx.txHash}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Overview;