import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bitcoin, Wallet, Copy, RefreshCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCode from "react-qr-code";

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
      address: 'bc1qjyrwte503a0vc7mwn3h52rz383wgh480pz9y63'
    },
    {
      id: 'ETH',
      name: 'Ethereum',
      icon: Wallet,
      networks: ['Ethereum Network'],
      address: '0x5C3250dC676c22E9BE847fc8e358F2E10073dfED'
    },
    {
      id: 'USDT',
      name: 'USDT',
      icon: Wallet,
      networks: ['Tron Network'],
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    {
      id: 'USDC',
      name: 'USDC',
      icon: Wallet,
      networks: ['Ethereum Network', 'Tron Network'],
      address: '0x5C3250dC676c22E9BE847fc8e358F2E10073dfED'
    }
  ];

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <SelectTrigger className="w-full bg-slate-300 border-slate-400">
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
            <Tabs defaultValue="address" className="w-full text-bold">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800 color-red-500">
                <TabsTrigger value="address" className="text-white">Address</TabsTrigger>
                <TabsTrigger value="qr" className="text-white">QR Code</TabsTrigger>
                {/* <TabsTrigger value="barcode">Barcode</TabsTrigger> */}
              </TabsList>
              <TabsContent value="qr" className="mt-4">
                <div className="bg-white p-6 rounded-lg flex flex-col items-center">
                  <QRCode value={selectedAsset.address} />
                  <p className="text-center mt-4 text-sm text-black">
                    Scan QR code to get deposit address
                  </p>
                </div>
              </TabsContent>
              {/* <TabsContent value="qr" className="mt-4">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  {generateQRCode(selectedAsset.address)}
                  <p className="text-center mt-4 text-sm text-gray-400">
                    Scan QR code to get deposit address
                  </p>
                </div>
              </TabsContent> */}
              <TabsContent value="address" className="mt-4 bg-slate-300 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      readOnly
                      value={selectedAsset.address}
                      className="bg-slate-300 border-slate-600 pr-24"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1 text-slate-800 hover:text-slate-800"
                      onClick={() => handleCopyAddress(selectedAsset.address)}
                    >
                      {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              {/* <TabsContent value="barcode" className="mt-4">
                <div className="bg-slate-500 p-6 rounded-lg">
                  <Barcode value={selectedAsset.address} />
                  <p className="text-center mt-4 text-md text-slate-100">
                    Scan barcode to get deposit address
                  </p>
                </div>
              </TabsContent> */}
            </Tabs>

            {/* Important Notes */}
            <Alert className="bg-slate-300 border-slate-400 mt-6">
              <AlertDescription className="text-slate-800">
                <ul className="list-disc pl-4 space-y-2 text-sm">
                  <li>Send only {selectedAsset.name} ({selectedAsset.id}) to this deposit address</li>
                  <li>Ensure you're using the {network} network</li>
                  <li>Minimum deposit: 0.001 {selectedAsset.id}</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Transaction Details */}
            <div className="space-y-4 bg-slate-300 p-4 rounded-lg">
              <h3 className="text-md font-medium">Transaction Details</h3>
              <div className="space-y-2 text-sm ">
                <div className="flex justify-between text-gray-800">
                  <span>Processing Time</span>
                  <span>10-30 minutes</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>Network Fee</span>
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
    <Card className="bg-transparent text-slate-800">
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
            <label className="text-sm text-slate-800">Select Asset</label>
            <Select
              onValueChange={(value) => {
                setSelectedAsset(cryptoAssets.find(asset => asset.id === value));
                setNetwork('');
              }}
            >
              <SelectTrigger className="w-full bg-slate-300 border-slate-400">
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