import React, { useEffect, useMemo, useState } from 'react';
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
import Spinner from './spinners/Spinner';
import { AlertCircle, Bold, ArrowUpRight, ArrowDownLeft, DollarSign, CreditCard } from 'lucide-react';

const Overview = () => {
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState([]);
  const [mainBalance, setMainBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 3;



  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;

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
          axiosInstance.get(`/api/users/main-balance?userId=${userId}`, {
            signal: controller.signal
          }),
          axiosInstance.get(`/api/users/transactions?userId=${userId}`, {
            signal: controller.signal
          }),
          axiosInstance.get(`/api/users/balances?userId=${userId}`, {
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
    <>
      <div className="px-8 flex justify-between items-center">
        <div className="mb-4 text-white space-y-2 mt-4">
          <p className="text-xl text-coral-black">Welcome</p>
          <p className="text-[40px] font-bolder text-coral-black">{user?.name}</p>
          <p className="text-[17px] text-gray-600">Here's a summary of your account.</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveComponent('Invest')}
            className="bg-slate-800 text-white px-4 py-2 rounded text-bold"
          >
            Invest & Earn
          </button>
          <button
            onClick={() => setActiveComponent('Deposits')}
            className="bg-red-500 text-white px-4 py-2 rounded font-bold"
          >
            Deposit Now
          </button>
        </div>
      </div>
      {!user?.isVerified && (
        <div className="mt-4 pl-4 py-2 bg-slate-200 text-coral-black rounded flex items-center space-x-2 mx-8">
          <AlertCircle className="w-6 h-6 text-yellow-600 font-bold" />
          <span>
            Caution: You need to verify your account to gain full functionality.{' '}
            <span
              className="text-yellow-600 cursor-pointer"
              onClick={() => setActiveComponent('verify')}
            >
              Let's get started!
            </span>
          </span>
        </div>
      )}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
        {/* Available Balance Card */}
        <div className="bg-white p-4 rounded shadow border-b-4 border-b-green-500">
          <p className="text-lg font-bold text-gray-600">Main Balance</p>

          <p className="text-2xl font-bold mt-2 text-red-500">${mainBalance.toLocaleString()}</p>
          <div className='flex justify-between mt-4'>
            <p className='text-slate-500'>Bitcoin Balance</p>
            <p className="text-sm text-gray-600">{balances.bitcoinBalance} BTC</p>
          </div>
          <div className='flex justify-between mt-2'>
            <p className='text-slate-500'>Ethereum Balance</p>
            <p className="text-sm text-gray-600">{balances.ethereumBalance} ETH</p>
          </div>
          <div className='flex justify-between mt-2'>
            <p className='text-slate-500'>Usdt Balance</p>
            <p className="text-sm text-gray-600">{balances.usdtBalance} USDT</p>
          </div>
          <div className='flex justify-between mt-2'>
            <p className='text-slate-500'>Usdc Balance</p>
            <p className="text-sm text-gray-600">{balances.usdcBalance} USDC</p>
          </div>
        </div>

        {/* Total Deposit Card */}
        <div className="bg-white p-4 rounded shadow border-b-4 border-b-blue-500 flex flex-col justify-between">
          <div>
            <p className="text-lg font-bold text-gray-600">Total Deposit</p>
            <p className="text-2xl font-bold mt-2 text-gray-400">--------</p>
          </div>
          <div>
            <p className='text-slate-500'>Deposit count</p>
            <p>0</p>
          </div>
        </div>

        {/* Total Withdrawals Card */}
        <div className="bg-white p-4 rounded shadow border-b-4 border-b-orange-500 flex flex-col justify-between">
          <div>
            <p className="text-lg font-bold text-gray-600">Total Withdrawals</p>
            <p className="text-2xl font-bold mt-2">-------</p>
          </div>
          <div>
            <p className='text-slate-500'>Withdrawal count</p>
            <p>0</p>
          </div>
        </div>
      </div>
      {/* Left Column - Activity */}

      <div className="flex justify-between items-center mb-3 px-8 pt-8">
        <h2 className="md:text-[20px] font-bold text-slate-800">Recent Activity</h2>
        <button className="text-primary hover:text-blue-800 font-medium">
          See History
        </button>
      </div>
      <div className="md:col-span-2 bg-white px-6 py-3 rounded shadow mx-8">
        <Table>
          <TableHeader className="text-primary">
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction, index) => (
              <TableRow key={index} className="hover:bg-gray-50 transition-colors text-slate-800">
                <TableCell className="flex items-center gap-2">
                  {getTransactionIcon(transaction.type)}
                  {transaction.type}
                </TableCell>
                <TableCell>{transaction.asset}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-white ${transaction.status === 'COMPLETED' || transaction.status === 'ACTIVE'
                      ? 'bg-green-500'
                      : transaction.status === 'PENDING'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                      }`}
                  >
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell>{transaction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage * activitiesPerPage >= transactions.length}
            className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <div className="pt-6 border-t mt-6 mx-8 bg-white p-4 rounded shadow">
        <div className='flex justify-between'>
          <h3 className="font-semibold mb-4 text-lg text-primary">Refer Us & Earn</h3>
          <span className='text-slate-400'>Coming Soon</span>
        </div>
        <p className="text-md text-gray-600 mb-4">
          Use the below link to invite your friends.
        </p>
        <div className="flex items-center gap-2">
          <div className="border rounded p-3 rounded flex-1">
            <span className="text-sm text-gray-400">teamapexllc.com/ref?ref=disparrown</span>
          </div>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm">
            Copy Link
          </button>
        </div>
      </div>
    </>
  );
};

export default Overview;