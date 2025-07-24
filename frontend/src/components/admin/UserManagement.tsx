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
import { Users, Search, DollarSign, Shield, TrendingUp, Filter, UserPlus, Edit, Trash, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import SlackDashboardCard from '../SlackDashboardCard';
import { useStore } from '../../store/useStore';
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
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '' });
  const [bitcoinBalance, setBitcoinBalance] = useState(0);
  const [mainBalance, setMainBalance] = useState(0);
  const [ethereumBalance, setEthereumBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);

  const [transaction, setTransaction] = useState({
    type: '',
    asset: '',
    amount: 0,
    status: 'pending',
    date: new Date(),
    name: '',
    phone: '',
    planName: ''
  });

  const itemsPerPage = 10;
  const userData = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);

  useEffect(() => {
    if (propUsers && propUsers.length > 0) {
      setUsers(propUsers);
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/users');

        // Filter out admin user
        const filteredUsers = response.data.users.filter((user: User) => user.email !== 'admin@mail.com');

        setUsers(filteredUsers);
      } catch (error: any) {
        console.error('❌ Error fetching users:', error);
        console.error('❌ Error response:', error.response);
        toast.error(error.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  const handleUpdateBalance = async () => {
    if (!selectedUserId) return;

    try {
      const response = await axiosInstance.post('/api/users/credit', {
        userId: selectedUserId,
        mainBalance: mainBalance,
        bitcoin: bitcoinBalance,
        ethereum: ethereumBalance,
        usdt: usdtBalance,
        usdc: usdcBalance,
        bnb: bnbBalance
      });
      toast.success('User balance updated successfully');

      // Reset balances
      setBitcoinBalance(0);
      setMainBalance(0);
      setEthereumBalance(0);
      setUsdtBalance(0);
      setUsdcBalance(0);
      setBnbBalance(0);

      // Update user balance in the UI - overwrite instead of add
      setUsers(users.map(user =>
        user.id === selectedUserId ? {
          ...user,
          balance: mainBalance // Only update main balance, or adjust based on your needs
        } : user
      ));
    } catch (error: any) {
      console.error('Error updating user balance:', error);
      toast.error(error.response?.data?.message || 'Failed to update user balance');
    }
  };

  const handleCreateTransaction = async () => {
    if (!selectedUserId) return;

    try {
      const response = await axiosInstance.post('/api/transactions', {
        userId: selectedUserId,
        ...transaction,
        date: transaction.date.toISOString()
      });

      toast.success(response.data.message);
      setIsTransactionDialogOpen(false);
      setTransaction({
        type: '',
        asset: '',
        amount: 0,
        status: 'pending',
        date: new Date(),
        name: '',
        phone: '',
        planName: ''
      });
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast.error(error.response?.data?.message || 'Failed to create transaction');
    }
  };

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-600">Monitor and manage all platform users and their activities</p>
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
              <div className="overflow-hidden">
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
                      <TableRow key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <Badge variant="outline" className="text-xs">
                              ID: {user.id}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-xs text-gray-500">{user.phone || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              variant={user.isVerified ? "default" : "secondary"}
                              className={user.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-gray-900">
                            ${(user.balance || 0).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 flex-wrap">
                            {!user.isVerified && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyUser(user.id)}
                                className="text-xs bg-green-50 text-green-700 hover:bg-green-100"
                              >
                                Verify
                              </Button>
                            )}

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewBalances(user)}
                              className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Balances
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUserId(user.id);
                                    // Pre-populate with current balance
                                    setMainBalance(user.balance || 0);
                                    setBitcoinBalance(0);
                                    setEthereumBalance(0);
                                    setUsdtBalance(0);
                                    setUsdcBalance(0);
                                    setBnbBalance(0);
                                  }}
                                  className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100"
                                >
                                  Update Balance
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Update User Balance</DialogTitle>
                                  <DialogDescription>
                                    Set new balances for the user's account. Enter amounts for each currency. This will overwrite existing balances.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="mainBalance" className="text-right">
                                      Main Balance
                                    </Label>
                                    <Input
                                      id="mainBalance"
                                      type="number"
                                      value={mainBalance}
                                      onChange={(e) => setMainBalance(Number(e.target.value))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="bitcoin" className="text-right">
                                      Bitcoin
                                    </Label>
                                    <Input
                                      id="bitcoin"
                                      type="number"
                                      value={bitcoinBalance}
                                      onChange={(e) => setBitcoinBalance(Number(e.target.value))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="ethereum" className="text-right">
                                      Ethereum
                                    </Label>
                                    <Input
                                      id="ethereum"
                                      type="number"
                                      value={ethereumBalance}
                                      onChange={(e) => setEthereumBalance(Number(e.target.value))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="usdt" className="text-right">
                                      USDT
                                    </Label>
                                    <Input
                                      id="usdt"
                                      type="number"
                                      value={usdtBalance}
                                      onChange={(e) => setUsdtBalance(Number(e.target.value))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="usdc" className="text-right">
                                      USDC
                                    </Label>
                                    <Input
                                      id="usdc"
                                      type="number"
                                      value={usdcBalance}
                                      onChange={(e) => setUsdcBalance(Number(e.target.value))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="bnb" className="text-right">
                                      BNB
                                    </Label>
                                    <Input
                                      id="bnb"
                                      type="number"
                                      value={bnbBalance}
                                      onChange={(e) => setBnbBalance(Number(e.target.value))}
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit" onClick={handleUpdateBalance}>
                                    Update Balance
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedUserId(user.id)}
                                  className="text-xs bg-orange-50 text-orange-700 hover:bg-orange-100"
                                >
                                  Transaction
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Create Transaction</DialogTitle>
                                  <DialogDescription>
                                    Create a new transaction record for this user.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="txName" className="text-right">
                                      Name
                                    </Label>
                                    <Input
                                      id="txName"
                                      value={transaction.name}
                                      onChange={(e) => setTransaction({ ...transaction, name: e.target.value })}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="txPhone" className="text-right">
                                      Phone
                                    </Label>
                                    <Input
                                      id="txPhone"
                                      value={transaction.phone}
                                      onChange={(e) => setTransaction({ ...transaction, phone: e.target.value })}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="txType" className="text-right">
                                      Type
                                    </Label>
                                    <Select
                                      onValueChange={(value) => {
                                        let newStatus = '';
                                        switch (value) {
                                          case 'subscription':
                                            newStatus = 'active';
                                            break;
                                          case 'withdrawal':
                                            newStatus = 'pending';
                                            break;
                                          default:
                                            newStatus = 'pending';
                                        }
                                        setTransaction(prev => ({
                                          ...prev,
                                          type: value,
                                          status: newStatus,
                                          planName: value === 'subscription' ? prev.planName : ''
                                        }));
                                      }}
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="deposit">Deposit</SelectItem>
                                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                        <SelectItem value="subscription">Subscription</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="txAmount" className="text-right">
                                      Amount
                                    </Label>
                                    <Input
                                      id="txAmount"
                                      type="number"
                                      value={transaction.amount}
                                      onChange={(e) => setTransaction({ ...transaction, amount: Number(e.target.value) })}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="txAsset" className="text-right">
                                      Asset
                                    </Label>
                                    <Select
                                      onValueChange={(value) => setTransaction({ ...transaction, asset: value })}
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select asset" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="BTC">Bitcoin</SelectItem>
                                        <SelectItem value="ETH">Ethereum</SelectItem>
                                        <SelectItem value="USDT">USDT</SelectItem>
                                        <SelectItem value="USDC">USDC</SelectItem>
                                        <SelectItem value="BNB">BNB</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit" onClick={handleCreateTransaction}>
                                    Create Transaction
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>

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
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
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
