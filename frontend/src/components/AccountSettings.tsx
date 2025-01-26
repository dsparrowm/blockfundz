import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

const AccountSettings = () => {
  const [transactionPin, setTransactionPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/user/settings', { transactionPin }, {
        withCredentials: true,
      });
      toast(response.data.message);
    } catch (error) {
      toast('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-8 bg-red-100">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="transactionPin" className="text-right">
              Transaction PIN
            </Label>
            <Input
              id="transactionPin"
              type="password"
              value={transactionPin}
              onChange={(e) => setTransactionPin(e.target.value)}
              className="col-span-3"
            />
          </div>
          {/* Add more settings fields here */}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;