import { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Button } from "@/components/ui/button";
import { Check, X, Clock, DollarSign } from 'lucide-react';
import SlackTable from '../SlackTable';
import SlackDashboardCard from '../SlackDashboardCard';
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
        const response = await axiosInstance.get('/api/withdrawals');
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
      await axiosInstance.post(`/api/withdrawals/approve?id=${id}`, {});

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
      await axiosInstance.post(`/api/withdrawals/reject?id=${id}`, {});

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
    return paginatedWithdrawalRequests;
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      width: 'w-16'
    },
    {
      key: 'user',
      title: 'User',
      render: (value: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{value.name}</span>
          <span className="text-xs text-gray-500">{value.email}</span>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (value: number) => (
        <span className="font-semibold text-gray-900">${value.toFixed(2)}</span>
      )
    },
    {
      key: 'asset',
      title: 'Asset',
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'network',
      title: 'Network',
    },
    {
      key: 'address',
      title: 'Address',
      render: (value: string) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
          {value ? `${value.substring(0, 10)}...` : 'N/A'}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => {
        const statusConfig = {
          'APPROVED': {
            bg: 'bg-green-100',
            text: 'text-green-800',
            icon: Check
          },
          'PENDING': {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            icon: Clock
          },
          'REJECTED': {
            bg: 'bg-red-100',
            text: 'text-red-800',
            icon: X
          }
        };

        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.PENDING;
        const Icon = config.icon;

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            <Icon className="w-3 h-3 mr-1" />
            {value}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: WithdrawalRequest) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-green-500 text-white hover:bg-green-600 border-0"
            onClick={() => handleApprove(row.id)}
            disabled={actionLoading === row.id || row.status !== 'PENDING'}
          >
            {actionLoading === row.id ? <Spinner /> : <Check className="w-3 h-3" />}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleReject(row.id)}
            disabled={actionLoading === row.id || row.status !== 'PENDING'}
          >
            {actionLoading === row.id ? <Spinner /> : <X className="w-3 h-3" />}
          </Button>
        </div>
      )
    }
  ];

  const pendingCount = withdrawalRequests.filter(req => req.status === 'PENDING').length;
  const approvedCount = withdrawalRequests.filter(req => req.status === 'APPROVED').length;
  const rejectedCount = withdrawalRequests.filter(req => req.status === 'REJECTED').length;
  const totalAmount = withdrawalRequests.reduce((sum, req) => sum + req.amount, 0);

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-2" />
            {successMessage}
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-center">
            <X className="w-4 h-4 mr-2" />
            {errorMessage}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SlackDashboardCard
          title="Pending Requests"
          value={pendingCount}
          subtitle="Awaiting approval"
          icon={Clock}
          color="yellow"
        />

        <SlackDashboardCard
          title="Approved"
          value={approvedCount}
          subtitle="Successfully processed"
          icon={Check}
          color="green"
        />

        <SlackDashboardCard
          title="Rejected"
          value={rejectedCount}
          subtitle="Declined requests"
          icon={X}
          color="red"
        />

        <SlackDashboardCard
          title="Total Amount"
          value={`$${totalAmount.toFixed(2)}`}
          subtitle="All withdrawal requests"
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Main Table */}
      <SlackTable
        title="Withdrawal Requests"
        subtitle="Manage and review all withdrawal requests"
        columns={columns}
        data={paginatedWithdrawalRequests}
        loading={loading}
        searchValue={searchText}
        onSearchChange={setSearchText}
        onRefresh={() => window.location.reload()}
      />
    </div>
  );
};

export default WithdrawalRequestManagement;