import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Spinner from '../spinners/Spinner';
import Toast from '../../utils/Toast';

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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/api/transactions`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      showToastMessage('error', 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    setEditLoading(true);
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/transactions/${selectedTransaction.id}`,
        selectedTransaction,
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
          }
        }
      );

      setTransactions(prev => prev.map(tx =>
        tx.id === selectedTransaction.id ? response.data.transaction : tx
      ));
      showToastMessage('success', 'Transaction updated successfully');
      setEditDialogOpen(false); // Close dialog on success
    } catch (error: any) {
      // Log the backend error response for debugging
      if (error.response) {
        console.error('Backend error:', error.response.data);
      } else {
        console.error('Error updating transaction:', error);
      }
      showToastMessage('error', 'Failed to update transaction');
    } finally {
      setEditLoading(false);
    }
  };

  const showToastMessage = (type: 'success' | 'error', message: string) => {
    setToastMessage({ type, message });
    setShowToast(true);
  };

  // Auto-close Toast after 3 seconds
  React.useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction =>
      Object.values(transaction).some(value =>
        value?.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [transactions, searchText]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <div className="space-y-4">
      {showToast && (
        <Toast
          type={toastMessage.type as 'success' | 'error'}
          message={toastMessage.message}
          onClose={() => setShowToast(false)}
        />
      )}

      <Input
        placeholder="Search transactions..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table>
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
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
                  <TableCell>
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setEditDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Transaction</DialogTitle>
                          <DialogDescription>
                            Update the transaction details below.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditTransaction} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Input
                              id="type"
                              value={selectedTransaction?.type || ''}
                              onChange={(e) => selectedTransaction && setSelectedTransaction({
                                ...selectedTransaction,
                                type: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="asset">Asset</Label>
                            <Input
                              id="asset"
                              value={selectedTransaction?.asset || ''}
                              onChange={(e) => selectedTransaction && setSelectedTransaction({
                                ...selectedTransaction,
                                asset: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={selectedTransaction?.amount || 0}
                              onChange={(e) => selectedTransaction && setSelectedTransaction({
                                ...selectedTransaction,
                                amount: Number(e.target.value)
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                              value={selectedTransaction?.status || ''}
                              onValueChange={(value) => selectedTransaction && setSelectedTransaction({
                                ...selectedTransaction,
                                status: value
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="datetime-local"
                              value={
                                selectedTransaction?.date
                                  ? new Date(selectedTransaction.date).toISOString().slice(0, 16)
                                  : ''
                              }
                              onChange={(e) =>
                                selectedTransaction &&
                                setSelectedTransaction({
                                  ...selectedTransaction,
                                  date: new Date(e.target.value).toISOString(),
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="planName">Plan Name</Label>
                            <Input
                              id="planName"
                              value={selectedTransaction?.planName || ''}
                              onChange={(e) => selectedTransaction && setSelectedTransaction({
                                ...selectedTransaction,
                                planName: e.target.value
                              })}
                            />
                          </div>
                          <Button type="submit" disabled={editLoading}>
                            {editLoading ? <Spinner size="sm" /> : 'Save Changes'}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
            >
              Previous
            </Button>
            {totalPages !== 0 && <span>Page {currentPage} of {totalPages}</span>}
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