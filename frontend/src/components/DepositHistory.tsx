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
import { ArrowDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { Button } from '@/components/ui/button';
import Spinner from './spinners/Spinner';

const DepositHistory = () => {
  interface Deposit {
    id: string;
    type: string;
    asset: string;
    amount: number;
    network: string;
    status: string;
    date: string;
  }

  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await axiosInstance.get('/api/deposits', {
          params: {
            userId: localStorage.getItem('userId'),
            page: currentPage,
            limit: itemsPerPage
          },
          withCredentials: true
        });
        setDeposits(response.data.deposits);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } catch (err) {
        setError('Failed to fetch deposit history');
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card className="w-full bg-slate-300 text-slate-800">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl font-semibold">Deposit History</CardTitle>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-coral-black" />
              <Input
                placeholder="Search by TxID"
                className="pl-8 bg-slate-100 border-neutral-700 text-slate-800 placeholder:text-slate-500 w-full md:w-[200px]"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[150px] bg-slate-100 border-neutral-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-100 border-neutral-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">COMPLETED</SelectItem>
                <SelectItem value="pending">PENDING</SelectItem>
                <SelectItem value="failed">FAILED</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[150px] bg-slate-100 border-neutral-700">
                <SelectValue placeholder="Asset" />
              </SelectTrigger>
              <SelectContent className="bg-slate-100 border-neutral-700">
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="btc">BITCOIN</SelectItem>
                <SelectItem value="eth">ETHEREUM</SelectItem>
                <SelectItem value="usdt">USDT</SelectItem>
                <SelectItem value="usdt">USDC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-500">
          <Table>
            <TableHeader className="bg-slate-400">
              <TableRow className="hover:bg-neutral-800 border-neutral-700">
                <TableHead className="text-slate-800 font-bold">TxID</TableHead>
                <TableHead className="text-slate-800 font-bold">Type</TableHead>
                <TableHead className="text-slate-800 font-bold">Asset</TableHead>
                <TableHead className="text-slate-800 font-bold">Amount</TableHead>
                <TableHead className="text-slate-800 font-bold">Network</TableHead>
                <TableHead className="text-slate-800 font-bold">Status</TableHead>
                <TableHead className="text-slate-800 font-bold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.map((deposit) => (
                <TableRow
                  key={deposit.id}
                  className="hover:bg-neutral-800 border-neutral-700"
                >
                  <TableCell className="font-medium">{deposit.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ArrowDown className="h-4 w-4 text-green-500" />
                      {deposit.type}
                    </div>
                  </TableCell>
                  <TableCell>{deposit.asset}</TableCell>
                  <TableCell>{deposit.amount}</TableCell>
                  <TableCell>{deposit.network}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${deposit.status === 'COMPLETED'
                        ? 'bg-green-500/20 text-green-500'
                        : deposit.status === 'PENDING'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                      {deposit.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(deposit.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-neutral-800 border-neutral-700 text-white"
          >
            Previous
          </Button>
          <span className="text-neutral-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-neutral-800 border-neutral-700 text-white"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositHistory;