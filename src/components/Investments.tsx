import React, { useEffect } from 'react'
import { useState } from 'react';
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
import axios from 'axios';

const Investments = () => {
  // Sample investment data
  // const investments = [
  //   {
  //     id: 1,
  //     paymentMethod: 'Bitcoin',
  //     totalProfit: 450.20,
  //     status: 'active',
  //     amountInvested: 5000,
  //     activationDate: '2024-03-01',
  //   },
  //   {
  //     id: 2,
  //     paymentMethod: 'Ethereum',
  //     totalProfit: 280.50,
  //     status: 'active',
  //     amountInvested: 3500,
  //     activationDate: '2024-03-05',
  //   },
  //   {
  //     id: 3,
  //     paymentMethod: 'USDT',
  //     totalProfit: 25.80,
  //     status: 'pending',
  //     amountInvested: 500,
  //     activationDate: '2024-03-10',
  //   },
  // ];
  // make a network request to fetch investments data
  interface Investment {
    id: number;
    paymentMethod: string;
    totalProfit: number;
    status: 'active' | 'pending' | 'completed';
    amountInvested: number;
    activationDate: string;
  };

  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get('/api/investmentPlan');
        setInvestments(response.data);
      } catch (error) {
        console.error('Error fetching investments:', error);
      }
    };

    fetchInvestments();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="w-full bg-neutral-900 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Investments</CardTitle>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-32 bg-neutral-800 border-neutral-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-neutral-800">
          <Table>
            <TableHeader className="bg-neutral-800">
              <TableRow className="hover:bg-neutral-800 border-neutral-700">
                <TableHead className="text-neutral-200">Payment Method</TableHead>
                <TableHead className="text-neutral-200">Total Profit</TableHead>
                <TableHead className="text-neutral-200">Status</TableHead>
                <TableHead className="text-neutral-200">Amount Invested</TableHead>
                <TableHead className="text-neutral-200">Activation Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow 
                  key={investment.id} 
                  className="hover:bg-neutral-800 border-neutral-700"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {investment.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell className={`${
                    investment.totalProfit > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatCurrency(investment.totalProfit)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${investment.status === 'active' 
                        ? 'bg-green-500/20 text-green-500' 
                        : investment.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-neutral-500/20 text-neutral-500'
                      }`}>
                      {investment.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(investment.amountInvested)}</TableCell>
                  <TableCell>{formatDate(investment.activationDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Investments