import { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import Spinner from '../spinners/Spinner';
import { toast } from 'sonner';
import { Users, Search, DollarSign, Shield, TrendingUp, Filter, UserPlus, Trash, Eye, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import SlackDashboardCard from '../SlackDashboardCard';
import { useStore } from '../../store/useStore';
import { useDarkMode } from '../../contexts/DarkModeContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  mainBalance?: number;
  bitcoinBalance?: number;
  ethereumBalance?: number;
  usdtBalance?: number;
  usdcBalance?: number;
  isVerified: boolean;
  createdAt: string;
}

interface UserManagementProps {
  users?: User[];
  isLoading?: boolean;
  onEditUser?: (user: User) => void;
}

const UserManagement = ({
  users: propUsers,
  isLoading = false,
  onEditUser,
}: UserManagementProps = {}) => {
  const [users, setUsers] = useState<User[]>(propUsers || []);
  const [loading, setLoading] = useState(isLoading);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Dialog states
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '' });

  // New multi-currency credit states
  const [creditForm, setCreditForm] = useState({
    currency: 'BITCOIN' as 'BITCOIN' | 'ETHEREUM' | 'USDT' | 'USDC',
    amount: 0,
    reason: '',
    date: new Date()
  });
  const [isCrediting, setIsCrediting] = useState(false);
  const [usdPreview, setUsdPreview] = useState(0);

  // USD input mode for BTC and ETH
  const [inputMode, setInputMode] = useState<'CRYPTO' | 'USD'>('CRYPTO');
  const [usdAmount, setUsdAmount] = useState(0);
  const [cryptoPrices, setCryptoPrices] = useState({
    BITCOIN: 116515,
    ETHEREUM: 4274.31,
    USDT: 1,
    USDC: 1
  });

  // Legacy states (keep for compatibility)
  const [bitcoinBalance, setBitcoinBalance] = useState(0);
  const [mainBalance, setMainBalance] = useState(0);
  const [ethereumBalance, setEthereumBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);

  // transaction creation removed per admin UI request

  const itemsPerPage = 10;
  const userData = useStore(state => state.user);
  const { isDarkMode } = useDarkMode();
  const setUser = useStore(state => state.setUser);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/users');

      // Filter out admin user
      const filteredUsers = response.data.users.filter((user: User) => user.email !== 'admin@mail.com');

      setUsers(filteredUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propUsers && propUsers.length > 0) {
      setUsers(propUsers);
      setLoading(false);
      return;
    }

    fetchUsers();
    fetchCryptoPrices(); // Fetch prices when component loads
  }, [propUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [users, searchText]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Calculate statistics
  const verifiedUsers = users.filter(user => user.isVerified).length;
  const totalBalance = users.reduce((sum, user) => {
    // Use only mainBalance for total calculation
    const userBalance = user.mainBalance || 0;
    return sum + userBalance;
  }, 0);
  const activeThisMonth = Math.floor(users.length * 0.75); // Mock calculation

  const handleVerifyUser = async (userId: string) => {
    try {
      const response = await axiosInstance.post('/api/users/verify-user', { userId });
      toast.success(response.data.message || 'User verified successfully');
      // Refresh users list
      const updatedResponse = await axiosInstance.get('/api/users');
      const filteredUsers = updatedResponse.data.users.filter((user: User) => user.email !== 'admin@mail.com');
      setUsers(filteredUsers);
    } catch (error: any) {
      console.error('Error verifying user:', error);
      toast.error(error.response?.data?.message || 'Failed to verify user');
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/addUser', newUser);
      toast.success(response.data.message);
      setUsers([...users, response.data.createdUser]);
      setIsAddUserDialogOpen(false);
      setNewUser({ name: '', email: '', phone: '', password: '' });
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleViewBalances = (user: User) => {
    setSelectedUser(user);
    setIsBalanceDialogOpen(true);
  };

  const handleCreditUser = async () => {
    if (!selectedUserId || creditForm.amount <= 0) {
      toast.error('Please select a user and enter a valid amount');
      return;
    }

    setIsCrediting(true);
    try {
      const response = await axiosInstance.post('/api/users/credit', {
        userId: selectedUserId,
        currency: creditForm.currency,
        amount: creditForm.amount,
        reason: creditForm.reason || 'Admin credit',
        date: creditForm.date ? new Date(creditForm.date).toISOString() : undefined,
        adminId: userData?.id // Pass admin ID if available
      });

      toast.success(response.data.message);

      // Reset form
      setCreditForm({
        currency: 'BITCOIN',
        amount: 0,
        reason: '',
        date: new Date()
      });
      setUsdPreview(0);
      setUsdAmount(0);
      setInputMode('CRYPTO');
      setIsBalanceDialogOpen(false);

      // Refresh users list
      fetchUsers();

    } catch (error: any) {
      console.error('Error crediting user:', error);
      toast.error(error.response?.data?.message || 'Failed to credit user');
    } finally {
      setIsCrediting(false);
    }
  };

  const handleResetBalance = async (userId: string, userName: string) => {
    if (!userId) {
      toast.error('Please select a user');
      return;
    }

    setIsCrediting(true);
    try {
      const response = await axiosInstance.post('/api/users/reset-balance', {
        userId: userId,
        reason: 'Admin balance reset',
        adminId: userData?.id // Pass admin ID if available
      });

      toast.success(response.data.message);

      // Refresh users list to show updated balances
      fetchUsers();

    } catch (error: any) {
      console.error('Error resetting user balance:', error);
      toast.error(error.response?.data?.message || 'Failed to reset user balance');
    } finally {
      setIsCrediting(false);
    }
  };

  // Calculate USD preview when amount or currency changes
  const calculateUsdPreview = async (amount: number, currency: string) => {
    if (amount <= 0) {
      setUsdPreview(0);
      return;
    }

    try {
      const rate = cryptoPrices[currency as keyof typeof cryptoPrices] || 1;
      setUsdPreview(amount * rate);
    } catch (error) {
      console.error('Error calculating USD preview:', error);
      setUsdPreview(0);
    }
  };

  // Fetch current crypto prices
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd');
      const data = await response.json();

      const prices = {
        BITCOIN: data.bitcoin.usd,
        ETHEREUM: data.ethereum.usd,
        USDT: data.tether.usd,
        USDC: data['usd-coin'].usd
      };

      setCryptoPrices(prices);
      return prices;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      return cryptoPrices; // Return current prices as fallback
    }
  };

  // Handle input mode change
  const handleInputModeChange = (mode: 'CRYPTO' | 'USD') => {
    setInputMode(mode);

    if (mode === 'USD') {
      // Convert current crypto amount to USD
      const currentUsdValue = creditForm.amount * cryptoPrices[creditForm.currency as keyof typeof cryptoPrices];
      setUsdAmount(currentUsdValue);
    } else {
      // Convert current USD amount to crypto
      const currentCryptoValue = usdAmount / cryptoPrices[creditForm.currency as keyof typeof cryptoPrices];
      setCreditForm(prev => ({ ...prev, amount: currentCryptoValue }));
    }
  };

  // Handle USD amount change
  const handleUsdAmountChange = (usdValue: number) => {
    setUsdAmount(usdValue);

    if (usdValue <= 0) {
      setCreditForm(prev => ({ ...prev, amount: 0 }));
      setUsdPreview(0);
      return;
    }

    const cryptoValue = usdValue / cryptoPrices[creditForm.currency as keyof typeof cryptoPrices];
    setCreditForm(prev => ({ ...prev, amount: cryptoValue }));
    setUsdPreview(usdValue);
  };

  // Handle crypto amount change
  const handleCryptoAmountChange = (cryptoValue: number) => {
    setCreditForm(prev => ({ ...prev, amount: cryptoValue }));
    calculateUsdPreview(cryptoValue, creditForm.currency);

    if (inputMode === 'USD') {
      const usdValue = cryptoValue * cryptoPrices[creditForm.currency as keyof typeof cryptoPrices];
      setUsdAmount(usdValue);
    }
  };

  // transaction creation handler removed

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await axiosInstance.delete(`/api/users/${userId}`);
      toast.success(response.data.message || 'User deleted successfully');
      setUsers(users.filter(user => user.id !== userId));
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className={`space-y-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>User Management</h1>
          </div>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monitor and manage all platform users and their activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddUser}>
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards using SlackDashboardCard for consistency */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SlackDashboardCard
          title="Total Users"
          value={users.length}
          subtitle="Active platform users"
          icon={Users}
          color="blue"
          trend={{
            value: 12.5,
            direction: 'up',
            period: 'this month'
          }}
        />

        <SlackDashboardCard
          title="Verified Users"
          value={verifiedUsers}
          subtitle="Identity verified"
          icon={Shield}
          color="green"
          trend={{
            value: 8.3,
            direction: 'up',
            period: 'this month'
          }}
        />

        <SlackDashboardCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString()}`}
          subtitle="Combined user balances"
          icon={DollarSign}
          color="purple"
          trend={{
            value: 15.2,
            direction: 'up',
            period: 'this month'
          }}
        />

        <SlackDashboardCard
          title="Active This Month"
          value={activeThisMonth}
          subtitle="Monthly active users"
          icon={TrendingUp}
          color="yellow"
          trend={{
            value: 5.4,
            direction: 'up',
            period: 'this week'
          }}
        />
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            User Data
          </CardTitle>
          <CardDescription>
            Search and manage all platform users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {/* Skeleton rows */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="overflow-hidden">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">There are currently no users to display.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-semibold text-gray-900">User</TableCell>
                      <TableCell className="font-semibold text-gray-900">Contact</TableCell>
                      <TableCell className="font-semibold text-gray-900">Status</TableCell>
                      <TableCell className="font-semibold text-gray-900">Balance</TableCell>
                      <TableCell className="font-semibold text-gray-900">Joined</TableCell>
                      <TableCell className="font-semibold text-gray-900">Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user, index) => (
                      <TableRow key={user.id} className={index % 2 === 0 ? "bg-white dark:bg-[#1e1e1e]" : "bg-gray-50/50 dark:bg-[#181818]"}>
                        <TableCell className="min-w-[150px]">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <Badge variant="outline" className="text-xs">
                              ID: {user.id}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-xs text-gray-500">{user.phone || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="space-y-1">
                            <Badge
                              variant={user.isVerified ? "default" : "secondary"}
                              className={user.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <div className="text-sm font-medium text-gray-900">
                            ${(user.balance || 0).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <div className="text-sm text-gray-900">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[300px]">
                          <div className="flex items-center gap-1 flex-wrap">
                            {!user.isVerified && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyUser(user.id)}
                                className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2 py-1"
                              >
                                Verify
                              </Button>
                            )}

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewBalances(user)}
                              className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Balances</span>
                              <span className="sm:hidden">View</span>
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUserId(user.id);
                                    // Reset credit form
                                    setCreditForm({
                                      currency: 'BITCOIN',
                                      amount: 0,
                                      reason: '',
                                      date: new Date()
                                    });
                                    setUsdPreview(0);
                                  }}
                                  className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100"
                                >
                                  Credit Balance
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px] mx-4">
                                <DialogHeader>
                                  <DialogTitle>Credit User Balance</DialogTitle>
                                  <DialogDescription>
                                    Credit cryptocurrency to the user's account. Select currency and amount to add to their balance.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                    <Label htmlFor="currency" className="sm:text-right font-medium">
                                      Currency
                                    </Label>
                                    <Select
                                      value={creditForm.currency}
                                      onValueChange={(value: any) => {
                                        setCreditForm({ ...creditForm, currency: value });
                                        setInputMode('CRYPTO'); // Reset to crypto mode when currency changes
                                        calculateUsdPreview(creditForm.amount, value);
                                      }}
                                    >
                                      <SelectTrigger className="sm:col-span-3">
                                        <SelectValue placeholder="Select currency" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="BITCOIN">Bitcoin (BTC)</SelectItem>
                                        <SelectItem value="ETHEREUM">Ethereum (ETH)</SelectItem>
                                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                                        <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Input Mode Toggle for BTC and ETH */}
                                  {(creditForm.currency === 'BITCOIN' || creditForm.currency === 'ETHEREUM') && (
                                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                      <Label className="sm:text-right font-medium">
                                        Input Mode
                                      </Label>
                                      <div className="sm:col-span-3">
                                        <div className="flex gap-2">
                                          <Button
                                            type="button"
                                            variant={inputMode === 'CRYPTO' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleInputModeChange('CRYPTO')}
                                            className="flex-1"
                                          >
                                            {creditForm.currency === 'BITCOIN' ? 'BTC' : 'ETH'}
                                          </Button>
                                          <Button
                                            type="button"
                                            variant={inputMode === 'USD' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleInputModeChange('USD')}
                                            className="flex-1"
                                          >
                                            USD
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                    <Label htmlFor="amount" className="sm:text-right font-medium">
                                      {inputMode === 'USD' && (creditForm.currency === 'BITCOIN' || creditForm.currency === 'ETHEREUM')
                                        ? 'USD Amount'
                                        : `${creditForm.currency === 'BITCOIN' ? 'BTC' : creditForm.currency === 'ETHEREUM' ? 'ETH' : creditForm.currency} Amount`}
                                    </Label>
                                    {inputMode === 'USD' && (creditForm.currency === 'BITCOIN' || creditForm.currency === 'ETHEREUM') ? (
                                      <Input
                                        id="usd-amount"
                                        type="number"
                                        step="0.01"
                                        value={usdAmount}
                                        onChange={(e) => handleUsdAmountChange(Number(e.target.value))}
                                        placeholder="0.00"
                                        className="sm:col-span-3"
                                      />
                                    ) : (
                                      <Input
                                        id="amount"
                                        type="number"
                                        step="0.00000001"
                                        value={creditForm.amount}
                                        onChange={(e) => handleCryptoAmountChange(Number(e.target.value))}
                                        placeholder="0.00000000"
                                        className="sm:col-span-3"
                                      />
                                    )}
                                  </div>

                                  {/* Show conversion preview */}
                                  {creditForm.amount > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                      <Label className="sm:text-right font-medium text-gray-600">
                                        {inputMode === 'USD' ? 'Crypto Amount' : 'USD Value'}
                                      </Label>
                                      <div className="sm:col-span-3 text-green-600 font-semibold">
                                        {inputMode === 'USD'
                                          ? `≈ ${creditForm.amount.toFixed(8)} ${creditForm.currency === 'BITCOIN' ? 'BTC' : 'ETH'}`
                                          : `≈ $${usdPreview.toLocaleString()}`
                                        }
                                      </div>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                    <Label htmlFor="reason" className="sm:text-right font-medium">
                                      Reason
                                    </Label>
                                    <Input
                                      id="reason"
                                      value={creditForm.reason}
                                      onChange={(e) => setCreditForm({ ...creditForm, reason: e.target.value })}
                                      placeholder="Reason for credit (optional)"
                                      className="sm:col-span-3"
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                    <Label htmlFor="credit-date" className="sm:text-right font-medium">Date</Label>
                                    <div className="sm:col-span-3">
                                      <DatePicker
                                        id="credit-date"
                                        selected={creditForm.date ? new Date(creditForm.date) : new Date()}
                                        onChange={(d: Date) => setCreditForm({ ...creditForm, date: d })}
                                        showTimeSelect
                                        dateFormat="Pp"
                                        className="w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    type="submit"
                                    onClick={handleCreditUser}
                                    disabled={isCrediting || creditForm.amount <= 0}
                                  >
                                    {isCrediting ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Crediting...
                                      </div>
                                    ) : (
                                      `Credit ${creditForm.currency}`
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {/* Transaction and Edit actions removed per admin preference */}

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-orange-600 hover:bg-orange-50"
                                  disabled={isCrediting}
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reset User Balance</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reset all balances for {user.name} to zero? This will set their main balance, Bitcoin, Ethereum, USDT, and USDC balances to $0. This action cannot be undone and transaction records will be created for tracking.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleResetBalance(user.id, user.name)}
                                    className="bg-orange-600 hover:bg-orange-700"
                                    disabled={isCrediting}
                                  >
                                    {isCrediting ? 'Resetting...' : 'Reset Balance'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200 gap-4">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1"
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </Button>
                    <span className="text-sm text-gray-600 px-2">
                      {currentPage}/{totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Balance Viewing Dialog */}
      <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Balance Details</DialogTitle>
            <DialogDescription>
              {selectedUser ? `Balance information for ${selectedUser.name}` : 'User balance details'}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Main Balance</Label>
                  <div className="text-lg font-semibold">${selectedUser.balance?.toLocaleString() || '0'}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedUser.isVerified ? "default" : "secondary"}>
                    {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-gray-500">Email</Label>
                    <div>{selectedUser.email}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <div>{selectedUser.phone || 'N/A'}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Member Since</Label>
                    <div>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">User ID</Label>
                    <div className="font-mono text-xs">{selectedUser.id}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsBalanceDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
