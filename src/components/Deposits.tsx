import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bitcoin, Wallet, Copy, RefreshCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Deposits = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [copied, setCopied] = useState(false);
  const [network, setNetwork] = useState('');

  const cryptoAssets = [
    { 
      id: 'BTC', 
      name: 'Bitcoin',
      icon: Bitcoin,
      networks: ['Bitcoin Network'],
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    },
    { 
      id: 'ETH', 
      name: 'Ethereum',
      icon: Wallet,
      networks: ['Ethereum Network', 'Arbitrum', 'Optimism'],
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    { 
      id: 'USDT', 
      name: 'USDT',
      icon: Wallet,
      networks: ['Ethereum Network', 'Tron Network', 'BNB Chain'],
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    { 
      id: 'USDC', 
      name: 'USDC',
      icon: Wallet,
      networks: ['Ethereum Network', 'Solana', 'BNB Chain'],
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    }
  ];

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQRCode = (text) => {
    // This creates a simple SVG QR-like pattern for illustration
    // In a real app, you'd use a proper QR code library
    return (
      <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" />
        <path d="M20 20h20v20h-20z M60 20h20v20h-20z M20 60h20v20h-20z" fill="currentColor" />
        <path d="M30 30h40v40h-40z" fill="none" stroke="currentColor" strokeDasharray="2" />
      </svg>
    );
  };

  const handleNetworkChange = (network) => {
    setNetwork(network);
  };

  const renderDepositInstructions = () => {
    if (!selectedAsset) return null;

    return (
      <div className="space-y-6 mt-6">
        {/* Network Selection */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Select Network</label>
          <Select onValueChange={handleNetworkChange}>
            <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              {selectedAsset.networks.map((net) => (
                <SelectItem key={net} value={net}>{net}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {network && (
          <>
            <Tabs defaultValue="qr" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
                <TabsTrigger value="qr">QR Code</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
              </TabsList>
              <TabsContent value="qr" className="mt-4">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  {generateQRCode(selectedAsset.address)}
                  <p className="text-center mt-4 text-sm text-gray-400">
                    Scan QR code to get deposit address
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="address" className="mt-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      readOnly
                      value={selectedAsset.address}
                      className="bg-zinc-800 border-zinc-700 pr-24"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1 text-gray-400 hover:text-white"
                      onClick={() => handleCopyAddress(selectedAsset.address)}
                    >
                      {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Important Notes */}
            <Alert className="bg-yellow-900/20 border-yellow-900/50 mt-6">
              <AlertDescription className="text-yellow-500">
                <ul className="list-disc pl-4 space-y-2 text-sm">
                  <li>Send only {selectedAsset.name} ({selectedAsset.id}) to this deposit address</li>
                  <li>Ensure you're using the {network} network</li>
                  <li>Minimum deposit: 0.001 {selectedAsset.id}</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Transaction Details */}
            <div className="space-y-4 bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing Time</span>
                  <span>10-30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee</span>
                  <span>Network-dependent</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-zinc-900 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Deposit</CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-400">
          <RefreshCcw className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Asset Selection */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Select Asset</label>
            <Select
              onValueChange={(value) => {
                setSelectedAsset(cryptoAssets.find(asset => asset.id === value));
                setNetwork('');
              }}
            >
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {cryptoAssets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    <div className="flex items-center gap-2">
                      <asset.icon className="w-4 h-4" />
                      <span>{asset.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {renderDepositInstructions()}
        </div>
      </CardContent>
    </Card>
  );
};

export default Deposits;