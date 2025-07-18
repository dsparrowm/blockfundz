import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { extractBalances } from "../../helpers/extractCoinBalances";
import renderUserDashboardComponent from "../../helpers/renderUserDashboardComponent";
import renderAdminDashboardComponent from "../../helpers/renderAdminDashboardComponent";
import SlackLayout from "@/components/SlackLayout";
import CryptoTicker from "@/components/CryptoTicker";

export default function Page() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const activeComponent = !isAdmin
    ? useStore((state) => state.activeComponent)
    : useStore((state) => state.activeAdminComponent);
  const userData = useStore(state => state.user);
  const data = userData?.balances ? extractBalances(userData.balances) : {};
  const coin = Object.entries(data);
  const coins = coin.map(([key, value]) => ({ name: key, balance: value }));

  const [cryptoData, setCryptoData] = useState([
    { symbol: 'BTC', price: 64823.45, change: 2.45 },
    { symbol: 'ETH', price: 3321.67, change: -1.23 },
    { symbol: 'SOL', price: 154.89, change: 5.78 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData(prev => prev.map(coin => ({
        ...coin,
        price: coin.price * (1 + (Math.random() * 0.02 - 0.01)),
        change: coin.change + (Math.random() * 0.4 - 0.2)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SlackLayout>
      {/* Crypto Ticker - positioned at top of content area */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <CryptoTicker />
      </div>

      {/* Main Dashboard Content */}
      {!isAdmin ? renderUserDashboardComponent() : renderAdminDashboardComponent()}
    </SlackLayout>
  );
}
