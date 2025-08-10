import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Users, CreditCard, TrendingUp, Activity, DollarSign, ArrowUpRight } from 'lucide-react';
import SlackDashboardCard from '../SlackDashboardCard';
import Spinner from '../spinners/Spinner';
import { useDarkMode } from '../../contexts/DarkModeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminOverview = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersResponse, transactionsResponse, investmentsResponse] = await Promise.all([
          axiosInstance.get('/api/users/count'),
          axiosInstance.get('/api/transactions/count'),
          axiosInstance.get('/api/investments/count')
        ]);

        setTotalUsers(usersResponse.data.users);
        setTotalTransactions(transactionsResponse.data.transactions);
        setTotalInvestments(investmentsResponse.data.investments);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        console.error('Error response:', error.response?.data); // Debug log
        console.error('Error status:', error.response?.status); // Debug log
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ['Users', 'Transactions', 'Investments'],
    datasets: [
      {
        label: 'Count',
        data: [totalUsers, totalTransactions, totalInvestments],
        backgroundColor: [
          'rgba(59, 130, 246, 0.1)',
          'rgba(16, 185, 129, 0.1)',
          'rgba(245, 158, 11, 0.1)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SlackDashboardCard
          title="Total Users"
          value={0}
          loading={true}
        />
        <SlackDashboardCard
          title="Total Transactions"
          value={0}
          loading={true}
        />
        <SlackDashboardCard
          title="Total Investments"
          value={0}
          loading={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SlackDashboardCard
          title="Total Users"
          value={totalUsers}
          subtitle="Registered platform users"
          icon={Users}
          color="blue"
          trend={{
            value: 12.5,
            direction: 'up',
            period: 'this month'
          }}
        />

        <SlackDashboardCard
          title="Total Transactions"
          value={totalTransactions}
          subtitle="All platform transactions"
          icon={CreditCard}
          color="green"
          trend={{
            value: 8.2,
            direction: 'up',
            period: 'this week'
          }}
        />

        <SlackDashboardCard
          title="Active Investments"
          value={totalInvestments}
          subtitle="Current investment plans"
          icon={TrendingUp}
          color="yellow"
          trend={{
            value: 5.1,
            direction: 'up',
            period: 'this month'
          }}
        />

        <SlackDashboardCard
          title="Platform Health"
          value="99.9%"
          subtitle="System uptime"
          icon={Activity}
          color="green"
          trend={{
            value: 0.1,
            direction: 'up',
            period: 'this quarter'
          }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SlackDashboardCard
          title="Platform Overview"
          value=""
          subtitle="Visual representation of key metrics"
          color="indigo"
          className="lg:col-span-2"
        >
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </SlackDashboardCard>
      </div>

      {/* Recent Activity */}
      <SlackDashboardCard
        title="Recent Activity"
        value=""
        subtitle="Latest platform activities and updates"
        icon={Activity}
        color="purple"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">New user registration</span>
            </div>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Investment plan created</span>
            </div>
            <span className="text-xs text-gray-500">5 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">Withdrawal request pending</span>
            </div>
            <span className="text-xs text-gray-500">10 minutes ago</span>
          </div>
        </div>
      </SlackDashboardCard>
    </div>
  );
};

export default AdminOverview;