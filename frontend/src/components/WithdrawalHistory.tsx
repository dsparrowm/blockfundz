import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

interface Withdrawal {
  id: string;
  type: string;
  asset: string;
  amount: number;
  address: string;
  network: string;
  status: string;
  createdAt: string;
}

const WithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axiosInstance.get(`/api/withdrawals`, {
          params: {
            userId: localStorage.getItem('userId')
          },
          withCredentials: true
        });
        setWithdrawals(response.data.withdrawalRequests);
      } catch (err) {
        setError('Failed to fetch withdrawal history');
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (

    <Card className="w-full bg-neutral-900 text-white">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl font-semibold">Withdrawal History</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search transactions"
                className="pl-8 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 w-full md:w-[200px]"
              />
            </div>
            <Select defaultValue="all-status">
              <SelectTrigger className="w-full md:w-[150px] bg-neutral-800 border-neutral-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-assets">
              <SelectTrigger className="w-full md:w-[150px] bg-neutral-800 border-neutral-700">
                <SelectValue placeholder="Asset" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all-assets">All Assets</SelectItem>
                <SelectItem value="btc">Bitcoin</SelectItem>
                <SelectItem value="eth">Ethereum</SelectItem>
                <SelectItem value="usdt">USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-neutral-800">
          <Table>
            <TableHeader className="bg-neutral-800">
              <TableRow className="hover:bg-neutral-800 border-neutral-700">
                <TableHead className="text-neutral-200">TxID</TableHead>
                <TableHead className="text-neutral-200">Type</TableHead>
                <TableHead className="text-neutral-200">Asset</TableHead>
                <TableHead className="text-neutral-200">Amount</TableHead>
                <TableHead className="text-neutral-200">To Address</TableHead>
                <TableHead className="text-neutral-200">Network</TableHead>
                <TableHead className="text-neutral-200">Status</TableHead>
                <TableHead className="text-neutral-200">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((withdrawal) => (
                <TableRow
                  key={withdrawal.id}
                  className="hover:bg-neutral-800 border-neutral-700"
                >
                  <TableCell className="font-medium">{withdrawal.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-red-500">
                      <ArrowUp className="h-4 w-4" />
                      {withdrawal.type}
                    </div>
                  </TableCell>
                  <TableCell>{withdrawal.asset}</TableCell>
                  <TableCell>{withdrawal.amount}</TableCell>
                  <TableCell>
                    <span className="text-neutral-400">{withdrawal.address}</span>
                  </TableCell>
                  <TableCell>{withdrawal.network}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${withdrawal.status === 'COMPLETED'
                        ? 'bg-green-500/20 text-green-500'
                        : withdrawal.status === 'PENDING'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                      {withdrawal.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-neutral-400">
          <div>
            Showing 1-{withdrawals.length} of {withdrawals.length} transactions
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WithdrawalHistory;