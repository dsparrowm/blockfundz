import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"; // Adjust the import paths as necessary
import { Button } from "@/components/ui/button"; // Adjust the import paths as necessary
import Spinner from '../spinners/Spinner';

interface WithdrawalRequest {
  id: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  amount: number;
  asset: string;
  network: string;
  address: string;
  status: string;
  createdAt: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";

const WithdrawalRequestManagement = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchWithdrawalRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/withdrawals`, {
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

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

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

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await axios.post(`${apiBaseUrl}/api/withdrawals/approve?id=${id}`, {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
      });

      // Update the local state to reflect the change
      setWithdrawalRequests(prev =>
        prev.map(request =>
          request.id === id
            ? { ...request, status: 'APPROVED' }
            : request
        )
      );

      setSuccessMessage(`Withdrawal request ${id} approved successfully`);
    } catch (error: any) {
      console.error('Error approving withdrawal request:', error);
      const errorMessage = error.response?.data?.message || 'Failed to approve withdrawal request. Please try again.';
      setErrorMessage(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await axios.post(`${apiBaseUrl}/api/withdrawals/reject?id=${id}`, {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
      });

      // Update the local state to reflect the change
      setWithdrawalRequests(prev =>
        prev.map(request =>
          request.id === id
            ? { ...request, status: 'REJECTED' }
            : request
        )
      );

      setSuccessMessage(`Withdrawal request ${id} rejected successfully`);
    } catch (error: any) {
      console.error('Error rejecting withdrawal request:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reject withdrawal request. Please try again.';
      setErrorMessage(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const renderTableRows = () => {
    return paginatedWithdrawalRequests.map(request => (
      <TableRow key={request.id}>
        <TableCell>{request.id}</TableCell>
        <TableCell>{request.user.name}</TableCell>
        <TableCell>{request.user.email}</TableCell>
        <TableCell>${request.amount.toFixed(2)}</TableCell>
        <TableCell>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {request.asset}
          </span>
        </TableCell>
        <TableCell>{request.network}</TableCell>
        <TableCell>
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
            {request.address ? `${request.address.substring(0, 10)}...` : 'N/A'}
          </span>
        </TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs font-medium
            ${request.status === 'APPROVED'
              ? 'bg-green-500/20 text-green-500'
              : request.status === 'PENDING'
                ? 'bg-yellow-500/20 text-yellow-500'
                : 'bg-red-500/20 text-red-500'
            }`}>
            {request.status}
          </span>
        </TableCell>
        <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className='bg-green-500 text-white hover:bg-green-600'
              onClick={() => handleApprove(request.id)}
              disabled={actionLoading === request.id || request.status !== 'PENDING'}
            >
              {actionLoading === request.id ? <Spinner /> : 'Approve'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleReject(request.id)}
              disabled={actionLoading === request.id || request.status !== 'PENDING'}
            >
              {actionLoading === request.id ? <Spinner /> : 'Reject'}
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <input
        type="text"
        placeholder="Search withdrawal requests..."
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
                <TableCell>User Name</TableCell>
                <TableCell>User Email</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Asset</TableCell>
                <TableCell>Network</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawalRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className='text-center'>No withdrawal requests found</TableCell>
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
};

export default WithdrawalRequestManagement;