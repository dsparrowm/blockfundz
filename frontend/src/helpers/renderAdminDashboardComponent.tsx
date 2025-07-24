import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import AdminOverview from "../components/admin/AdminOverview";
import UserManagement from "../components/admin/UserManagement";
import InvestmentManagement from "../components/admin/InvestmentManagement";
import TransactionManagement from "../components/admin/TransactionManagement";
import InvestmentPlansManagement from "../components/admin/InvestmentPlansManagement";
import WithdrawalRequestManagement from "../components/admin/WithdrawalRequestManagement";
import SendEmail from "../components/admin/SendEmail";
import { AdminChatDashboard } from "../components/AdminChatDashboard";
import handleEditUser from "./handleEditUser";


const renderAdminDashboardComponent = () => {
  const [loading, setLoading] = useState(true);

  const activeComponent = useStore((state) => state.activeAdminComponent);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
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
      return <UserManagement onEditUser={handleEditUser} isLoading={loading} />;
    case 'Manage Plans':
      return <InvestmentPlansManagement />;
    case 'Send Mail':
      return <SendEmail />;
    case 'Direct Message':
      return <AdminChatDashboard />;
    default:
      return null;
  }
};

export default renderAdminDashboardComponent;