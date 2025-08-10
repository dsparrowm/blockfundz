import { useEffect, useState } from 'react';
import { SlackDashboardCard } from './SlackDashboardCard';
import InvestmentPlanCard from './InvestmentPlanCard';
import { useStore } from '../store/useStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { toast } from 'sonner';
import axiosInstance from '../api/axiosInstance';
import Spinner from './spinners/Spinner';
import {
  TrendingUp,
  DollarSign,
  Bitcoin,
  Banknote,
  Coins
} from 'lucide-react';

interface InvestmentPlan {
  id: number;
  name: string;
  plan: string;
  description: string;
  minimumAmount: number;
  maximumAmount: number;
  interestRate: number;
  totalReturns: number;
  recommended: boolean;
}

interface SelectedPlan {
  id: number,
  plan: String,
  minimumAmount: number,
  maximumAmount: number,
  interestRate: number,
  totalReturns: number
}

interface Balances {
  bitcoinBalance: number;
  ethereumBalance: number;
  usdtBalance: number;
  usdcBalance: number;
}

const InvestmentPlans = () => {
  const user = useStore(state => state.user);
  const setActiveComponent = useStore(state => state.setActiveComponent);
  const userBalances: Balances = {
    bitcoinBalance: user?.balances?.Bitcoin || 0,
    ethereumBalance: user?.balances?.Ethereum || 0,
    usdtBalance: user?.balances?.Usdt || 0,
    usdcBalance: user?.balances?.Usdc || 0,
  };
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<number[]>([]);
  const [balances, setBalances] = useState<Balances>(userBalances);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAssetDialog, setShowAssetDialog] = useState(false);
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);

  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/investments`, {
          withCredentials: true,
        });
        setInvestmentPlans(response.data.investmentPlans);
      } catch (error) {
        console.error('Error fetching investment plans:', error);
        toast('Failed to fetch investment plans');
      } finally {
        setLoading(false);
      }
    };

    const fetchBalances = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/balances`, {
          withCredentials: true
        });
        setBalances(response.data.balances);
      } catch (error) {
        console.error('Error fetching balances:', error);
        toast('Failed to fetch balances');
      }
    };

    const fetchUserSubscriptions = async () => {
      try {
        const response = await axiosInstance.get('/api/users/transactions', {
          params: {
            type: 'SUBSCRIPTION'
          },
          withCredentials: true
        });

        // Extract plan IDs from active subscriptions
        const subscribedPlanIds = response.data.transactions
          ?.filter((transaction: any) => transaction.status === 'ACTIVE')
          ?.map((transaction: any) => transaction.planId)
          ?.filter((planId: any) => planId !== null) || [];

        setUserSubscriptions(subscribedPlanIds);
      } catch (error) {
        console.error('Error fetching user subscriptions:', error);
      }
    };

    fetchInvestmentPlans();
    fetchBalances();
    fetchUserSubscriptions();
  }, []);

  const handleSubscribe = (planId: number) => {
    const plan = investmentPlans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmSubscription = () => {
    setShowConfirmDialog(false);
    setShowAssetDialog(true);
  };

  const handleAssetSelection = async (asset: string) => {
    if (!selectedPlan || !balances) return;

    const match = asset.match(/[a-z]+|[A-Z][a-z]*/g);
    const assetType = match ? match[0] : '';

    try {
      const response = await axiosInstance.post(`/api/investments/subscribe`, {
        planId: selectedPlan.id,
        asset: assetType.toUpperCase(),
        amount: selectedPlan.minimumAmount
      }, {
        withCredentials: true
      });

      toast(response.data.message);
      setSelectedPlan(null);
      setShowAssetDialog(false);

    } catch (error: any) {
      setShowAssetDialog(false);

      if (error.response?.data?.insufficientFunds) {
        setShowInsufficientDialog(true);
      } else {
        // Display the specific error message from the backend
        toast(error.response?.data?.message || 'An error occurred while subscribing to the plan');

        // If it's an "already subscribed" error, we might want to reset the dialogs
        if (error.response?.data?.message?.includes('already subscribed')) {
          setSelectedPlan(null);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SlackDashboardCard
          title="Bitcoin Balance"
          value={(balances?.bitcoinBalance || 0).toFixed(6)}
          subtitle="BTC available"
          icon={Bitcoin}
          color="yellow"
          trend={{ value: 5.2, direction: "up" }}
          loading={loading}
        />

        <SlackDashboardCard
          title="Ethereum Balance"
          value={(balances?.ethereumBalance || 0).toFixed(6)}
          subtitle="ETH available"
          icon={Banknote}
          color="blue"
          trend={{ value: 3.8, direction: "up" }}
          loading={loading}
        />

        <SlackDashboardCard
          title="USDT Balance"
          value={(balances?.usdtBalance || 0).toFixed(2)}
          subtitle="USDT available"
          icon={DollarSign}
          color="green"
          trend={{ value: 1.2, direction: "up" }}
          loading={loading}
        />

        <SlackDashboardCard
          title="USDC Balance"
          value={(balances?.usdcBalance || 0).toFixed(2)}
          subtitle="USDC available"
          icon={Coins}
          color="indigo"
          trend={{ value: 2.5, direction: "up" }}
          loading={loading}
        />
      </div>

      {/* Investment Plans Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4a154b] dark:to-[#1a1d29] px-6 py-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-white/20 dark:bg-[#3c3f4c] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Investment Plans</h2>
                <p className="text-white/80 text-sm">Choose the perfect plan for your investment goals</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Daily Interest Calculation</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm">Automatic Profits</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Flexible Terms</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Spinner />
                <p className="text-gray-500 dark:text-gray-400 mt-4">Loading investment plans...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Available Investment Opportunities
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Start earning passive income with our carefully designed investment plans.
                  Each plan offers competitive returns with automatic daily interest calculation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {investmentPlans.map(plan => (
                  <InvestmentPlanCard
                    key={plan.id}
                    plan={plan}
                    isSubscribed={userSubscriptions.includes(plan.id)}
                    onSubscribe={handleSubscribe}
                  />
                ))}
              </div>

              {investmentPlans.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-[#3c3f4c] rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Plans Available</h3>
                  <p className="text-gray-500 dark:text-gray-400">Investment plans will be displayed here once they are created.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
          <AlertDialogHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 dark:from-blue-600 dark:to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Confirm Investment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
              You're about to subscribe to the <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedPlan?.plan}</span> investment plan
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-6">
            <div className="bg-gray-50 dark:bg-[#1a1d29] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Plan Name</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedPlan?.plan}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Minimum Investment</span>
                <span className="font-semibold text-gray-900 dark:text-white">${selectedPlan?.minimumAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Interest Rate</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{selectedPlan?.interestRate}% APY</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Returns</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedPlan?.totalReturns}%</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-[#4a154b]/20 rounded-lg border border-blue-200 dark:border-[#4a154b]">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">💡 Note:</span> Interest will be calculated daily and credited automatically to your main balance.
              </p>
            </div>
          </div>

          <AlertDialogFooter className="flex space-x-3 pt-4 border-t border-gray-100 dark:border-gray-600">
            <AlertDialogCancel
              onClick={() => setSelectedPlan(null)}
              className="flex-1 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 border-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubscription}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 dark:from-[#4a154b] dark:to-[#1a1d29] hover:from-green-600 hover:to-blue-700 dark:hover:from-[#5a1f5a] dark:hover:to-[#2a2f3a] text-white border-0"
            >
              Continue to Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Asset Selection Dialog */}
      <AlertDialog open={showAssetDialog} onOpenChange={setShowAssetDialog}>
        <AlertDialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Choose Payment Asset
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
              Select your preferred cryptocurrency to complete the subscription to <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedPlan?.plan}</span> plan
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-6">
            <div className="grid gap-4">
              {Object.entries(balances).map(([asset, amount]) => {
                const getAssetInfo = (assetName: string) => {
                  const name = assetName.toLowerCase();
                  if (name === 'bitcoin') return { icon: '₿', color: 'border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 dark:border-yellow-400 dark:hover:border-yellow-300 dark:hover:bg-yellow-900/20', textColor: 'text-yellow-600 dark:text-yellow-400' };
                  if (name === 'ethereum') return { icon: 'Ξ', color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-400 dark:hover:border-blue-300 dark:hover:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' };
                  if (name === 'usdt') return { icon: '₮', color: 'border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-400 dark:hover:border-green-300 dark:hover:bg-green-900/20', textColor: 'text-green-600 dark:text-green-400' };
                  if (name === 'usdc') return { icon: '$', color: 'border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-400 dark:hover:border-indigo-300 dark:hover:bg-indigo-900/20', textColor: 'text-indigo-600 dark:text-indigo-400' };
                  return { icon: '○', color: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-400 dark:hover:border-gray-300 dark:hover:bg-gray-900/20', textColor: 'text-gray-600 dark:text-gray-400' };
                };

                const assetInfo = getAssetInfo(asset);
                const hasBalance = Number(amount) > 0;

                return (
                  <button
                    key={asset}
                    onClick={() => handleAssetSelection(asset)}
                    disabled={!hasBalance}
                    className={`
                      flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-200
                      ${hasBalance ? assetInfo.color + ' cursor-pointer transform hover:scale-[1.02]' : 'border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-50'}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full bg-white dark:bg-gray-700 border-2 ${hasBalance ? assetInfo.color.split(' ')[0] : 'border-gray-200 dark:border-gray-600'} flex items-center justify-center font-bold text-lg ${hasBalance ? assetInfo.textColor : 'text-gray-400 dark:text-gray-500'}`}>
                        {assetInfo.icon}
                      </div>
                      <div className="text-left">
                        <p className={`font-semibold ${hasBalance ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                          {asset.charAt(0).toUpperCase() + asset.slice(1)}
                        </p>
                        <p className={`text-sm ${hasBalance ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          Available: {Number(amount).toFixed(6)}
                        </p>
                      </div>
                    </div>

                    {hasBalance && (
                      <div className={`w-6 h-6 rounded-full border-2 ${assetInfo.color.split(' ')[0]} flex items-center justify-center`}>
                        <div className={`w-3 h-3 rounded-full ${assetInfo.textColor.replace('text-', 'bg-')}`}></div>
                      </div>
                    )}

                    {!hasBalance && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#3c3f4c] px-2 py-1 rounded-full">
                        Insufficient
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-[#4a154b]/20 rounded-lg border border-blue-200 dark:border-[#4a154b]">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-500 dark:bg-[#4a154b] rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Subscription Details:</p>
                  <p>Plan: <span className="font-semibold">{selectedPlan?.plan}</span></p>
                  <p>Amount: <span className="font-semibold">${selectedPlan?.minimumAmount}</span></p>
                  <p>Interest Rate: <span className="font-semibold">{selectedPlan?.interestRate}% APY</span></p>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex space-x-3 pt-4 border-t border-gray-100 dark:border-gray-600">
            <AlertDialogCancel
              onClick={() => {
                setShowAssetDialog(false);
                setSelectedPlan(null);
              }}
              className="flex-1 bg-gray-100 dark:bg-[#3c3f4c] hover:bg-gray-200 dark:hover:bg-[#4a4e5c] text-gray-700 dark:text-gray-300 border-0"
            >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Insufficient Balance Dialog */}
      <AlertDialog open={showInsufficientDialog} onOpenChange={setShowInsufficientDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Insufficient Balance</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
              Your balance is insufficient for this subscription. Would you like to make a deposit or select another asset?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-gray-100 dark:border-gray-600 pt-4">
            <AlertDialogCancel
              onClick={() => {
                setShowInsufficientDialog(false);
                setShowAssetDialog(true);
              }}
              className="bg-gray-100 dark:bg-[#3c3f4c] hover:bg-gray-200 dark:hover:bg-[#4a4e5c] text-gray-700 dark:text-gray-300 border-0"
            >
              Select Another Asset
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowInsufficientDialog(false);
                setSelectedPlan(null);
                setActiveComponent("Deposits");
              }}
              className="bg-gradient-to-r from-green-500 to-blue-600 dark:from-[#4a154b] dark:to-[#1a1d29] hover:from-green-600 hover:to-blue-700 dark:hover:from-[#5a1f5a] dark:hover:to-[#2a2f3a] text-white border-0"
            >
              Make a Deposit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvestmentPlans;