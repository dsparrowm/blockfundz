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
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 3;

  const activities = [
    { title: 'Top up Apex account', date: 'Jan 28, 2025', status: 'processing', amount: '+M400,005.00', balance: 'M400,005.00' },
    { title: 'Withdraw from Apex account', date: 'Jan 27, 2025', status: 'completed', amount: '-M200,000.00', balance: 'M200,005.00' },
    { title: 'Transfer to savings', date: 'Jan 26, 2025', status: 'completed', amount: '-M100,000.00', balance: 'M100,005.00' },
    { title: 'Received payment', date: 'Jan 25, 2025', status: 'completed', amount: '+M50,000.00', balance: 'M150,005.00' },
    // Add more activities as needed
  ];

  const isVerified = false;

  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);


  const handleNextPage = () => {
    if (indexOfLastActivity < activities.length) {
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

  return (
    <>
      <div className="px-8 flex justify-between items-center">
        <div className="mb-4 text-white space-y-2 mt-4">
          <p className="text-xl text-coral-black">Welcome</p>
          <p className="text-[40px] font-bolder text-coral-black">{user.name}</p>
          <p className="text-[17px] text-gray-600">here's a summary of your account.</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-slate-800 text-white px-4 py-2 rounded text-bold">Invest & Earn</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded font-bold">Deposit Now</button>
        </div>
      </div>
      {!isVerified && (
        <div className="mt-4 pl-4 py-2 bg-white text-coral-black rounded flex items-center space-x-2 mx-8 hidden">
          <AlertCircle className="w-6 h-6 text-yellow-600 font-bold" />
          <span>
            Caution: You need to verify your account to gain full functionality.{' '}
            <span className="text-yellow-600 cursor-pointer" onClick={() => setActiveComponent('verify')}>
              Let's get started! to the moon
            </span>
          </span>
        </div>
      )}
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
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentActivities.map((activity, index) => (
              <TableRow key={index}>
                <TableCell>{activity.title}</TableCell>
                <TableCell>{activity.date}</TableCell>
                <TableCell>{activity.status}</TableCell>
                <TableCell>{activity.amount}</TableCell>
                <TableCell>{activity.balance}</TableCell>
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
            disabled={indexOfLastActivity >= activities.length}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Next
          </button>
        </div>
      </div>
      <div className="pt-6 border-t mt-6 mx-8 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4 text-lg">Refer Us & Earn</h3>
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