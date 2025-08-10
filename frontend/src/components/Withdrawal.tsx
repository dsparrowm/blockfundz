import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { SlackDashboardCard } from './SlackDashboardCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Spinner from './spinners/Spinner';
import {
  AlertCircle,
  CheckCircle,
  Wallet,
  DollarSign,
  ArrowUpRight,
  Shield,
  Banknote,
  Coins
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('BITCOIN');
  const [network, setNetwork] = useState('Bitcoin Network');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pin, setPin] = useState('');
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [createPin, setCreatePin] = useState('');
  const [createPinLoading, setCreatePinLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<any>({});

  const assetOptions = [
    { value: 'BITCOIN', label: 'Bitcoin (BTC)', network: 'Bitcoin Network' },
    { value: 'ETHEREUM', label: 'Ethereum (ETH)', network: 'Ethereum Network' },
    { value: 'USDT', label: 'USDT', network: 'Tron Network' },
    { value: 'USDC', label: 'USDC', network: 'Ethereum Network' }
  ];

  useEffect(() => {
    fetchUserBalance();
    checkPinStatus();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchUserBalance = async () => {
    try {
      const response = await axiosInstance.get('/api/users/balances');
      setUserBalance(response.data.balances || {});
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  const checkPinStatus = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/user/withdrawal-pin-status');
      setHasPin(response.data.hasPin);
      if (!response.data.hasPin) {
        setShowPinDialog(true);
      }
    } catch (error) {
      setHasPin(false);
      setShowPinDialog(true);
    }
  };

  // Create pin handler
  const handleCreatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(createPin)) {
      setError('Pin must be 4 digits');
      return;
    }
    setCreatePinLoading(true);
    try {
      await axiosInstance.post('/api/auth/user/set-withdrawal-pin',
        { pin: createPin }
      );
      setHasPin(true);
      setShowPinDialog(false);
      setSuccess('Withdrawal pin set successfully');
      setCreatePin('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to set pin');
    } finally {
      setCreatePinLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!hasPin) {
      setError('You must set a withdrawal pin before making withdrawals.');
      setLoading(false);
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setError('Invalid withdrawal pin.');
      setLoading(false);
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    const availableBalance = getBalanceForAsset(asset);

    if (withdrawalAmount > availableBalance) {
      setError(`Insufficient balance. Available: ${availableBalance} ${asset}`);
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post('/api/withdrawals', {
        amount: withdrawalAmount,
        asset,
        network,
        address,
        pin,
      });

      setSuccess('Withdrawal request created successfully and is pending approval');
      setAmount('');
      setPin('');
      setAddress('');
      fetchUserBalance(); // Refresh balance
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create withdrawal request';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getBalanceForAsset = (asset: string) => {
    switch (asset) {
      case 'BITCOIN': return userBalance.bitcoinBalance || 0;
      case 'ETHEREUM': return userBalance.ethereumBalance || 0;
      case 'USDT': return userBalance.usdtBalance || 0;
      case 'USDC': return userBalance.usdcBalance || 0;
      default: return 0;
    }
  };

  const handleAssetChange = (value: string) => {
    setAsset(value);
    const selectedAsset = assetOptions.find(opt => opt.value === value);
    if (selectedAsset) {
      setNetwork(selectedAsset.network);
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance Overview using SlackDashboardCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SlackDashboardCard
          title="Bitcoin (BTC)"
          value={getBalanceForAsset('BITCOIN').toFixed(6)}
          subtitle="Available Balance"
          icon={Coins}
          color="yellow"
          trend={{ value: 5.2, direction: "up" }}
          loading={false}
        />

        <SlackDashboardCard
          title="Ethereum (ETH)"
          value={getBalanceForAsset('ETHEREUM').toFixed(6)}
          subtitle="Available Balance"
          icon={Banknote}
          color="blue"
          trend={{ value: 3.8, direction: "up" }}
          loading={false}
        />

        <SlackDashboardCard
          title="USDT"
          value={getBalanceForAsset('USDT').toFixed(2)}
          subtitle="Available Balance"
          icon={DollarSign}
          color="green"
          trend={{ value: 1.2, direction: "up" }}
          loading={false}
        />

        <SlackDashboardCard
          title="USDC"
          value={getBalanceForAsset('USDC').toFixed(2)}
          subtitle="Available Balance"
          icon={Wallet}
          color="indigo"
          trend={{ value: 2.5, direction: "up" }}
          loading={false}
        />
      </div>

      {/* Withdrawal Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ArrowUpRight className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Withdraw Cryptocurrency</h2>
          </div>
        </div>

        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700">{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Asset</label>
                <Select value={asset} onValueChange={handleAssetChange}>
                  <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Available: {getBalanceForAsset(asset).toFixed(6)} {asset}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Network</label>
                <Input
                  value={network}
                  readOnly
                  className="bg-gray-50 border-gray-300 text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <Input
                type="number"
                step="0.00000001"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
              <Input
                value={address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                placeholder="Enter wallet address"
                className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {hasPin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Withdrawal PIN</label>
                <Input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !hasPin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? <Spinner /> : 'Create Withdrawal Request'}
            </Button>
          </form>
        </div>
      </div>

      {/* Create PIN Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span>Create Withdrawal PIN</span>
            </DialogTitle>
            <DialogDescription>
              Please set a 4-digit PIN to enable withdrawals for security.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Create 4-digit PIN</label>
              <Input
                type="password"
                maxLength={4}
                pattern="\d{4}"
                value={createPin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreatePin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={createPinLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {createPinLoading ? <Spinner /> : 'Create PIN'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Withdraw;