import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from '../spinners/Spinner';

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
  name: string;
  phone: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/transactions`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
          }
        }); // Adjust the API endpoint as necessary
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction =>
      transaction.type.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.asset.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.name.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.phone.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [transactions, searchText]);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <div>
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-slate-400"
      />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table className="text-slate-800">
            <TableHeader>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Asset</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Plan Name</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className='text-center'>No transactions found.</TableCell>
                </TableRow>
              ) : (
                <>
                  {paginatedTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.asset}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${transaction.status === 'COMPLETED' || transaction.status === 'ACTIVE'
                            ? 'bg-green-500/20 text-green-500'
                            : transaction.status === 'PENDING'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                      <TableCell>{transaction.name}</TableCell>
                      <TableCell>{transaction.planName || 'N/A'}</TableCell>
                      <TableCell>{transaction.phone}</TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
            >
              Previous
            </Button>
            {totalPages !== 0 && <span className='text-white-400'>Page {currentPage} of {totalPages}</span>}
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionManagement;