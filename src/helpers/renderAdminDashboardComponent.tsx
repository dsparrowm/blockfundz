import React, { useEffect } from "react";
import {useStore} from "../store/useStore";
import AdminOverview from "../components/admin/AdminOverview";
import Users from "../components/Users";
import Analytics from "../components/Analytics";
import UserManagement from "../components/admin/UserManagement";
import {useState} from "react";
import {userData} from "../constants"
import handleEditUser from "./handleEditUser";
import handleDeleteUser from "./handleDeleteUser";
import InvestmentManagement from "@/components/admin/InvestmentManagement";
import TransactionManagement from "@/components/admin/TransactionManagement";
import WithdrawalRequestManagement from "@/components/admin/WithdrawalRequestManagement";
import InvestmentPlanManagement from "@/components/admin/InvestmentPlansManagement";
import SendEmail from "@/components/admin/SendEmail";


const renderAdminDashboardComponent = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

    const activeComponent = useStore((state) => state.activeAdminComponent);
    const [overviewData, setOverviewData] = useState({
    totalUsers: 0,
    totalInvestors: 0,
    requestedWithdrawals: 0,
    totalDeposited: 0,
    totalInvested: 0
  });

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setOverviewData({
        totalUsers: 12345,
        totalInvestors: 5678,
        requestedWithdrawals: 234,
        totalDeposited: 1234567.89,
        totalInvested: 987654.32
      });
      setLoading(false);
    }, 1000);
  }, []);

    switch (activeComponent) {
    case 'Dashboard':
        return <AdminOverview />;
    case 'Manage Investments':
        return <InvestmentManagement />;
    case 'Manage Transactions':
        return <TransactionManagement />;
    case 'Withdrawal Requests':
        return <WithdrawalRequestManagement />;
    case 'Users Management':
        return <UserManagement users={userData} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} isLoading={loading}/>;
    case 'Manage Plans':
        return <InvestmentPlanManagement />;
    case 'Send Mail':
        return <SendEmail />;
    default:
        return null;
    }
    };

  export default renderAdminDashboardComponent;