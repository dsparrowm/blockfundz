import { useState } from 'react';
import { SlackDashboardCard } from './SlackDashboardCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Bitcoin,
  Wallet,
  Copy,
  RefreshCcw,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  Shield
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import QRCode from "react-qr-code";

interface CryptoAsset {
  id: string;
  name: string;
  icon: any;
  networks: string[];
  address: string;
}

const Deposits = () => {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [copied, setCopied] = useState(false);
  const [network, setNetwork] = useState('');

  const cryptoAssets: CryptoAsset[] = [
    {
      id: 'BTC',
      name: 'Bitcoin',
      icon: Bitcoin,
      networks: ['Bitcoin Network'],
      address: 'bc1qxtewurxx8qn03grrydewxaaf7ywch9v8q4k5e3'
    },
    {
      id: 'ETH',
      name: 'Ethereum',
      icon: Wallet,
      networks: ['Ethereum Network'],
      address: '0x10f08239Bd10bF4B88aD65905C451bC7AA042dE9'
    },
    {
      id: 'USDT',
      name: 'USDT',
      icon: Wallet,
      networks: ['Tron Network'],
      address: 'TMjQ1v1NLsN3agAstFZcFVA8xQEyFAysQq'
    },
    {
      id: 'BNB',
      name: 'Smart Chain(BNB)',
      icon: Wallet,
      networks: ['BNB Network'],
      address: '0x5C3250dC676c22E9BE847fc8e358F2E10073dfED'
    }
  ];

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNetworkChange = (network: string) => {
    setNetwork(network);
  };

  const renderDepositInstructions = () => {
    if (!selectedAsset) return null;

    return (
      <div className="space-y-6 mt-6">
        {/* Network Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select Network</label>
          <Select onValueChange={handleNetworkChange}>
            <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              {selectedAsset.networks.map((net: string) => (
                <SelectItem key={net} value={net}>{net}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {network && (
          <div className="space-y-6">
            <Tabs defaultValue="address" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="address" className="text-gray-700">Address</TabsTrigger>
                <TabsTrigger value="qr" className="text-gray-700">QR Code</TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="mt-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col items-center">
                  <QRCode value={selectedAsset.address} />
                  <p className="text-center mt-4 text-sm text-gray-600">
                    Scan QR code to get deposit address
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="address" className="mt-4">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        readOnly
                        value={selectedAsset.address}
                        className="bg-white border-gray-300 pr-24 font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        onClick={() => handleCopyAddress(selectedAsset.address)}
                      >
                        {copied ? (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600">Copied!</span>
                          </div>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-blue-800">
                  <h4 className="font-medium mb-2">Important Notes</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>Send only {selectedAsset.name} ({selectedAsset.id}) to this deposit address</li>
                    <li>Ensure you're using the {network} network</li>
                    <li>Minimum deposit: 0.001 {selectedAsset.id}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Transaction Details</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Processing Time</span>
                  <span className="font-medium">10-30 minutes</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Network Fee</span>
                  <span className="font-medium">Network-dependent</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Confirmations</span>
                  <span className="font-medium">12 blocks</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Deposit Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SlackDashboardCard
          title="Available Assets"
          value={cryptoAssets.length.toString()}
          subtitle="Supported cryptocurrencies"
          icon={Wallet}
          color="blue"
          loading={false}
        />

        <SlackDashboardCard
          title="Processing Time"
          value="10-30 min"
          subtitle="Average confirmation time"
          icon={Clock}
          color="yellow"
          loading={false}
        />

        <SlackDashboardCard
          title="Network Security"
          value="100%"
          subtitle="Secure deposits"
          icon={Shield}
          color="green"
          loading={false}
        />

        <SlackDashboardCard
          title="Active Deposits"
          value="0"
          subtitle="Pending confirmations"
          icon={ArrowDownLeft}
          color="purple"
          loading={false}
        />
      </div>

      {/* Main Deposit Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowDownLeft className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Deposit Cryptocurrency</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-6">
            {/* Asset Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Asset</label>
              <Select
                onValueChange={(value) => {
                  const asset = cryptoAssets.find(asset => asset.id === value);
                  setSelectedAsset(asset || null);
                  setNetwork('');
                }}
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
        </div>
      </div>
    </div>
  );
};

export default Deposits;