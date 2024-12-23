import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminOverview = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersResponse, transactionsResponse, investmentsResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/users/count', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            }
          }),
          axios.get('http://localhost:3001/api/transactions/count', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            }
          }),
          axios.get('http://localhost:3001/api/investments/count', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            }
          })
        ]);

        setTotalUsers(usersResponse.data.users);
        setTotalTransactions(transactionsResponse.data.transactions);
        setTotalInvestments(investmentsResponse.data.investments);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ['Users', 'Transactions', 'Investments'],
    datasets: [
      {
        label: 'Count',
        data: [totalUsers, totalTransactions, totalInvestments],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Dashboard Overview',
      },
    },
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Total Transactions</h3>
              <p className="text-2xl">{totalTransactions}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Total Investments</h3>
              <p className="text-2xl">{totalInvestments}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Bar data={data} options={options} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;