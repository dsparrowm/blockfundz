import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from './spinners/Spinner';
import Toast from '../utils/Toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('BTC');
  const [network, setNetwork] = useState('Bitcoin');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pin, setPin] = useState('');
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [createPin, setCreatePin] = useState('');
  const [createPinLoading, setCreatePinLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    // Fetch pin status on mount
    const fetchPinStatus = async () => {
      try {
        const res = await axiosInstance.get(`/api/user/withdrawal-pin-status`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        });
        setHasPin(res.data.hasPin);
        if (!res.data.hasPin) setShowPinDialog(true);
      } catch {
        setHasPin(false);
        setShowPinDialog(true);
      }
    };
    fetchPinStatus();
  }, []);

  // Auto-close Toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Create pin handler
  const handleCreatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(createPin)) {
      setToastMessage({ type: "error", message: "Pin must be 4 digits" });
      setShowToast(true);
      return;
    }
    setCreatePinLoading(true);
    try {
      await axiosInstance.post(`/api/withdrawals/set-withdrawal-pin`, { pin: createPin }, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      setHasPin(true);
      setShowPinDialog(false);
      setToastMessage({ type: "success", message: "Withdrawal pin set successfully" });
      setShowToast(true);
    } catch {
      setToastMessage({ type: "error", message: "Failed to set pin" });
      setShowToast(true);
    } finally {
      setCreatePinLoading(false);
    }
  };

  const handleSubmit = async (e) => {
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
    try {
      const response = await axiosInstance.post(`/api/withdrawals`, {
        userId: localStorage.getItem('userId'),
        amount: parseFloat(amount),
        asset,
        network,
        address,
        pin,
      },
        {
          withCredentials: true
        }
      );

      setSuccess('Withdrawal request created successfully');
      setAmount('');
      setAsset('BTC');
      setNetwork('Bitcoin');
      setPin('');
      setToastMessage({ type: "success", message: "Withdrawal request created successfully" });
      setShowToast(true);
    } catch (err) {
      setError('Failed to create withdrawal request');
      setToastMessage({ type: "error", message: "Failed to create withdrawal request" });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-slate-200 text-slate-800">
      {showToast && toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setShowToast(false)}
        />
      )}
      {/* <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Withdrawal Pin</DialogTitle>
            <DialogDescription>
              Please set a 4-digit pin to enable withdrawals.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePin} className="space-y-4">
            <Input
              type="password"
              maxLength={4}
              pattern="\d{4}"
              placeholder="Enter 4-digit pin"
              value={createPin}
              onChange={e => setCreatePin(e.target.value.replace(/\D/g, ""))}
              required
            />
            <Button type="submit" disabled={createPinLoading}>
              {createPinLoading ? <Spinner size="sm" /> : "Set Pin"}
            </Button>
          </form>
        </DialogContent>
      </Dialog> */}
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Withdraw</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <Input
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full bg-slate-300 border-slate-100 text-slate-800"
              required
              value={amount}
            />
          </div>
          <div>
            <label className="block text-sm font-medium ">Asset</label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger className="w-full bg-slate-300 border-slate-100">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent className="bg-white border-neutral-700">
                <SelectItem value="BITCOIN">Bitcoin</SelectItem>
                <SelectItem value="ETHEREUM">Ethereum</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Withdrawal Address</label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full bg-slate-300 border-slate-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Network</label>
            <Select value={network} onValueChange={setNetwork}>
              <SelectTrigger className="w-full bg-slate-300 border-slate-100">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-100">
                <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Tron">Tron</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Withdrawal Pin</label>
            <Input
              type="password"
              maxLength={4}
              pattern="\d{4}"
              placeholder="Enter 4-digit withdrawal pin"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
              required
              disabled={!hasPin}
            />
          </div>
          <Button type="submit" className="w-full bg-green-500 hover:bg-orange-700" disabled={loading || !hasPin}>
            {loading ? <Spinner /> : 'Submit'}
          </Button>
        </form>
        {/* {!hasPin && (
          <p className="text-red-500 mt-4 text-center">
            You must set a withdrawal pin before making withdrawals.
          </p>
        )} */}
      </CardContent>
    </Card>
  );
};

export default Withdraw;