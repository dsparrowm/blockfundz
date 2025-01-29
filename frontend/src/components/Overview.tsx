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
import { AlertCircle, Bold } from 'lucide-react';

const Overview = () => {
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <>
      <div className="px-8 flex justify-between items-center">
        <div className="mb-4 text-white space-y-2">
          <p className="text-xl">Welcome</p>
          <p className="text-[40px] font-bolder">{user.name}</p>
          <p className="text-md text-gray-400">here's a summary of your account.</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded text-bold">Invest & Earn</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Deposit Now</button>
        </div>
      </div>
      <div className="mt-4 pl-4 py-2 bg-white text-coral-black rounded flex items-center space-x-2 mx-8">
        <AlertCircle className="w-6 h-6 text-yellow-600 font-bold" />
        <span>
          Caution: You need to verify your account to gain full functionality.{' '}
          <span className="text-yellow-600 cursor-pointer" onClick={() => setActiveComponent('verify')}>
            Let's get started!
          </span>
        </span>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg font-bold">Available Balance</p>
          <p className="text-2xl">{balances.available}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg font-bold">Total Deposit</p>
          <p className="text-2xl">{balances.totalDeposit}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg font-bold">Total Withdrawals</p>
          <p className="text-2xl">{balances.totalWithdrawals}</p>
        </div>
      </div>
    </>
  );
};

export default Overview;