import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InvestmentPlanCard from './InvestmentPlanCard';
import { useStore } from '@/store/useStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

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
  bitcoin: number;
  ethereum: number;
  usdt: number;
  usdc: number;
}

const InvestmentPlans = () => {
  const user = useStore(state => state.user);
  const setActiveComponent = useStore(state => state.setActiveComponent);
  const userBalances: Balances = {
    bitcoin: user.balances.Bitcoin,
    ethereum: user.balances.Ethereum,
    usdt: user.balances.Usdt,
    usdc: user.balances.Usdc,
  };
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [balances, setBalances] = useState<Balances>(userBalances);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAssetDialog, setShowAssetDialog] = useState(false);
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/api/investments', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        setInvestmentPlans(response.data.investmentPlans);
      } catch (error) {
        console.error('Error fetching investment plans:', error);
        toast.error('Failed to fetch investment plans');
      } finally {
        setLoading(false);
      }
    };

    const fetchBalances = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users/balances', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          params: {
            userId: localStorage.getItem('userId')
          }
        });
        setBalances(response.data.balances);
      } catch (error) {
        console.error('Error fetching balances:', error);
        toast.error('Failed to fetch balances');
      }
    };

    fetchInvestmentPlans();
    fetchBalances();
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
    
    const assetBalance = balances[asset as keyof Balances];
    const match = asset.match(/[a-z]+|[A-Z][a-z]*/g);
    const assetType = match ? match[0] : '';

    try {
      const response = await axios.post('http://localhost:3001/api/investments/subscribe', {
        userId: localStorage.getItem('userId'),
        planId: selectedPlan.id,
        asset: assetType.toUpperCase(),
        amount: selectedPlan.minimumAmount
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      
      toast.success(response.data.message);
      setSelectedPlan(null);
      setShowAssetDialog(false);
      
    } catch (error: any) {
      setShowAssetDialog(false);
      
      if (error.response?.data?.insufficientFunds) {
        setShowInsufficientDialog(true);
      } else {
        // Display the specific error message from the backend
        toast.error(error.response?.data?.message || 'An error occurred while subscribing to the plan');
        
        // If it's an "already subscribed" error, we might want to reset the dialogs
        if (error.response?.data?.message?.includes('already subscribed')) {
          setSelectedPlan(null);
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-white-400">Available Investment Plans</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investmentPlans.map(plan => (
            <InvestmentPlanCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} />
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to subscribe to {selectedPlan?.plan} plan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPlan(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubscription}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Asset Selection Dialog */}
      <AlertDialog open={showAssetDialog} onOpenChange={setShowAssetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select Payment Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Choose the asset you want to use for payment:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-4 my-4">
            {Object.entries(balances).map(([asset, amount]) => (
              <button
                key={asset}
                onClick={() => handleAssetSelection(asset)}
                className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                {asset.charAt(0).toUpperCase() + asset.slice(1)} ({amount})
              </button>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowAssetDialog(false);
              setSelectedPlan(null);
            }}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Insufficient Balance Dialog */}
      <AlertDialog open={showInsufficientDialog} onOpenChange={setShowInsufficientDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Insufficient Balance</AlertDialogTitle>
            <AlertDialogDescription>
              Your balance is insufficient for this subscription. Would you like to make a deposit or select another asset?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowInsufficientDialog(false);
              setShowAssetDialog(true);
            }}>Select Another Asset</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowInsufficientDialog(false);
              setSelectedPlan(null);
              setActiveComponent("Deposits");
            }}>Make a Deposit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvestmentPlans;