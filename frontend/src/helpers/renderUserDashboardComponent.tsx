import { useStore } from '../store/useStore';
import Overview from '../components/Overview';
import Invest from '../components/Invest';
import Investments from '../components/Investments';
import DepositHistory from '../components/DepositHistory';
import Withdrawal from '../components/Withdrawal';
import WithdrawalHistory from '../components/WithdrawalHistory';
import Deposits from '../components/Deposits';
import AcountSettings from '../components/AccountSettings';
import Profile from '../components/Profile';
import KYCVerification from '../components/Kyc';
import Settings from '../components/Settings';
import Analytics from '../components/Analytics';

const renderUserDashboardComponent = () => {
  const activeComponent = useStore((state) => state.activeComponent);

  switch (activeComponent) {
    case 'Overview':
      return <Overview />;
    case 'Invest':
      return <Invest />;
    case 'Investments':
      return <Investments />;
    case 'Deposits':
      return <Deposits />;
    case 'DepositHistory':
      return <DepositHistory />;
    case 'Settings':
      return <Settings />
    case 'Withdrawals':
      return <Withdrawal />;
    case 'WithdrawalHistory':
      return <WithdrawalHistory />;
    case 'AccountSettings':
      return <AcountSettings />;
    case 'verify':
      return <KYCVerification />;
    case 'Profile':
      return <Profile />;
    case 'Analytics':
      return <Analytics />;
    default:
      return null;
  }
};

export default renderUserDashboardComponent;