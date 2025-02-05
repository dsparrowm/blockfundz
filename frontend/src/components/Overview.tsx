import React, { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 3;



  const isVerified = false;

  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;


  const handleNextPage = () => {
    if (indexOfLastActivity < transactions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get user and setActiveComponent from global store
  const user = useStore(state => state.user);
  const setActiveComponent = useStore(state => state.setActiveComponent);

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
        console.error('Error fetching transactions and balances:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionsAndBalances();
  }, [user.id]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Top up Apex account':
        return <ArrowUpRight className="w-5 h-5 text-green-500" />;
      case 'Withdraw from Apex account':
        return <ArrowDownLeft className="w-5 h-5 text-red-500" />;
      case 'Transfer to savings':
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      case 'Received payment':
        return <CreditCard className="w-5 h-5 text-yellow-500" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      <div className="px-8 flex justify-between items-center">
        <div className="mb-4 text-white space-y-2 mt-4">
          <p className="text-xl text-coral-black">Welcome</p>
          <p className="text-[40px] font-bolder text-coral-black">{user.name}</p>
          <p className="text-[17px] text-gray-600">here's a summary of your account.</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setActiveComponent('Invest')} className="bg-slate-800 text-white px-4 py-2 rounded text-bold">Invest & Earn</button>
          <button onClick={() => setActiveComponent('Deposits')} className="bg-red-500 text-white px-4 py-2 rounded font-bold">Deposit Now</button>
        </div>
      </div>
      {!isVerified && (
        <div className="mt-4 pl-4 py-2 bg-slate-200 text-coral-black rounded flex items-center space-x-2 mx-8">
          <AlertCircle className="w-6 h-6 text-yellow-600 font-bold" />
          <span>
            Caution: You need to verify your account to gain full functionality.{' '}
            <span className="text-yellow-600 cursor-pointer" onClick={() => setActiveComponent('verify')}>
              Let's get started!
            </span>
          </span>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
        {/* Available Balance Card */}
        <div className="bg-white p-4 rounded shadow border-b-4 border-b-green-500">
          <p className="text-lg font-bold text-gray-600">Available Balance</p>

          <p className="text-2xl font-bold mt-2">-----</p>
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
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          See History
        </button>
      </div>
      <div className="md:col-span-2 bg-white px-6 py-3 rounded shadow mx-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(indexOfFirstActivity, indexOfLastActivity).map((transaction, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  {getTransactionIcon(transaction.type)}
                  {transaction.type}
                </TableCell>
                <TableCell>{transaction.asset}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-white ${transaction.status === 'COMPLETED' || 'ACTIVE' ? 'bg-green-500' :
                      transaction.status === 'PENDING' ? 'bg-yellow-500' :
                        'bg-red-500'
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
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={indexOfLastActivity >= transactions.length}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Next
          </button>
        </div>
      </div>
      <div className="pt-6 border-t mt-6 mx-8 bg-white p-4 rounded shadow">
        <div className='flex justify-between'>
          <h3 className="font-semibold mb-4 text-lg">Refer Us & Earn</h3>
          <span className='text-slate-400'>Coming Soon</span>
        </div>
        <p className="text-md text-gray-600 mb-4">
          Use the below link to invite your friends.
        </p>
        <div className="flex items-center gap-2">
          <div className="border rounded p-3 rounded flex-1">
            <span className="text-sm">teamapexllc.com/ref?ref=disparrown</span>
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