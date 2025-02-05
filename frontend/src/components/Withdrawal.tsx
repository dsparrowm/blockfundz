import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from './spinners/Spinner';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('BTC');
  const [network, setNetwork] = useState('Bitcoin');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {

      const response = await axiosInstance.post(`/api/withdrawals`, {
        userId: localStorage.getItem('userId'),
        amount: parseFloat(amount),
        asset,
        network,
        address,
      },
        {
          withCredentials: true
        }
      );

      setSuccess('Withdrawal request created successfully');
      setAmount('');
      setAsset('BTC');
      setNetwork('Bitcoin');
    } catch (err) {
      setError('Failed to create withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-slate-200 text-slate-800">
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium ">Asset</label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger className="w-full bg-slate-300 border-sslate-100">
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
          <Button type="submit" className="w-full bg-green-500 hover:bg-orange-700" disabled={loading}>
            {loading ? <Spinner /> : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Withdraw;