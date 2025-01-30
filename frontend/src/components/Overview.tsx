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
        {/* Available Balance Card */}
        <div className="bg-white p-4 rounded shadow border-b-4 border-b-green-500">
          <p className="text-lg font-bold text-gray-600">Available Balance</p>

          <p className="text-2xl font-bold mt-2">$2,000</p>
        </div>

        {/* Total Deposit Card */}
        <div className="bg-white p-4 rounded shadow border-b-4 border-b-blue-500">
          <p className="text-lg font-bold text-gray-600">Total Deposit</p>
          <p className="text-2xl font-bold mt-2">$14,000</p>
        </div>

        {/* Total Withdrawals Card */}
        <div className="bg-white p-4 rounded shadow border-b-4 border-b-orange-500">
          <p className="text-lg font-bold text-gray-600">Total Withdrawals</p>
          <p className="text-2xl font-bold mt-2">$12,000</p>
        </div>
      </div>
      {/* Left Column - Activity */}

      <div className="flex justify-between items-center mb-6 px-8 pt-8">
        <h2 className="text-lg font-bold text-white-400">Recent Activity</h2>
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          See History
        </button>
      </div>
      <div className="md:col-span-2 bg-white px-6 py-2 rounded shadow mx-8">
        {/* Activity Item */}
        <div className="flex justify-between items-start">
          <div className='space-y-2'>
            <h3 className="font-semibold text-sm">Top up Apex account</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Jan 28,2025</p>
              <span className="text-sm text-yellow-600">processing</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-600 font-semibold">+M400,005.00</p>
            <p className="text-sm text-gray-500">M400,005.00</p>
          </div>
        </div>

        {/* Referral Section */}
        {/* <div className="pt-6 border-t mt-6">
            <h3 className="font-semibold mb-4">Refer Us & Earn</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use the below link to invite your friends.
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-yellow-50 p-3 rounded flex-1">
                <span className="text-sm">teamapexllc.com/ref?ref=disparrown</span>
              </div>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm">
                Copy Link
              </button>
            </div>
          </div> */}
      </div>

      {/* Right Column - (Add your other content here if needed) */}
      <div className="md:col-span-1">
        {/* Add any additional content that appears in your image */}
      </div>
    </>
  );
};

export default Overview;