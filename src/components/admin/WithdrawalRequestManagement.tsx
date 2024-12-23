import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"; // Adjust the import paths as necessary
import { Button } from "@/components/ui/button"; // Adjust the import paths as necessary
import { Input } from "@/components/ui/input"; // Adjust the import paths as necessary

interface WithdrawalRequest {
  id: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  amount: number;
  address: string;
  status: string;
  createdAt: string;
}

const WithdrawalRequestManagement = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchWithdrawalRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/api/withdrawals', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
          }
        }); // Adjust the API endpoint as necessary
        setWithdrawalRequests(response.data.withdrawalRequests);
      } catch (error) {
        console.error('Error fetching withdrawal requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawalRequests();
  }, []);

  const filteredWithdrawalRequests = useMemo(() => {
    return withdrawalRequests.filter(request =>
      request.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      request.user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      request.status.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [withdrawalRequests, searchText]);

  const paginatedWithdrawalRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredWithdrawalRequests.slice(startIndex, endIndex);
  }, [filteredWithdrawalRequests, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredWithdrawalRequests.length / itemsPerPage);

  const renderTableRows = () => {
    return paginatedWithdrawalRequests.map(request => (
      <TableRow key={request.id}>
        <TableCell>{request.id}</TableCell>
        <TableCell>{request.user.name}</TableCell>
        <TableCell>{request.user.email}</TableCell>
        <TableCell>{request.amount}</TableCell>
        <TableCell>{request.address}</TableCell>
        <TableCell>{request.status}</TableCell>
        <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className='bg-green-500 text-white' onClick={() => handleApprove(request.id)}>Approve</Button>
            <Button variant="destructive" size="sm" onClick={() => handleReject(request.id)}>Reject</Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search withdrawal requests..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-slate-400"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table className="text-white">
            <TableHeader>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>User Email</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawalRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center'>No withdrawal requests found</TableCell>
                </TableRow>
              ) : (
                renderTableRows()
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

  function handleApprove(id: number) {
    // Implement the logic to approve the withdrawal request
    console.log(`Approve request with ID: ${id}`);
  }

  function handleReject(id: number) {
    // Implement the logic to reject the withdrawal request
    console.log(`Reject request with ID: ${id}`);
  }
};

export default WithdrawalRequestManagement;