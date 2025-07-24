import { useState, useMemo, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Users, Edit, Trash, UserPlus, Search, DollarSign, Shield, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import SlackDashboardCard from '../SlackDashboardCard';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios';
import { toast } from 'sonner';
import Spinner from '../spinners/Spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  isVerified: boolean;
  createdAt: string;
}

interface UserManagementProps {
  users: User[];
  isLoading?: boolean;
  onEditUser?: (user: User) => void;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";

const UserManagement = ({
  isLoading = false,
  onEditUser,
}: UserManagementProps) => {
  const [bitcoinBalance, setBitcoinBalance] = useState(0);
  const [mainBalance, setMainBalance] = useState(0);
  const [ethereumBalance, setEthereumBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(isLoading);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '' });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
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
  const userData = useStore(state => state.user)
  const setUser = useStore(state => state.setUser)


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/users`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
          }
        });
        const filteredUsers = response.data.users.filter((user: User) => user.email !== 'admin@mail.com');
        setUsersData(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCredit = async () => {
    if (!selectedUserId) return;

    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/credit`, {
        userId: selectedUserId,
        mainBalance: mainBalance,
        bitcoin: bitcoinBalance,
        ethereum: ethereumBalance,
        usdt: usdtBalance,
        usdc: usdcBalance,
        bnb: bnbBalance
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
      });
      toast(response.data.message);

      // Reset balances
      setBitcoinBalance(0);
      setMainBalance(0);
      setEthereumBalance(0);
      setUsdtBalance(0);
      setUsdcBalance(0);
      setBnbBalance(0);

      // Update user balance in the UI
      setUsersData(usersData.map(user =>
        user.id === selectedUserId ? { ...user, balance: user.balance + bitcoinBalance + ethereumBalance + usdtBalance + usdcBalance + bnbBalance } : user
      ));
    } catch (error) {
      console.error('Error crediting user:', error);
    }
  }

  const handleAddUser = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/addUser`, newUser, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
      });
      toast(response.data.message);
      setUsersData([...usersData, response.data.createdUser]);
      setIsAddUserDialogOpen(false);
      setNewUser({ name: '', email: '', phone: '', password: '' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleViewBalances = (user: User) => {
    setSelectedUser(user);
    setIsBalanceDialogOpen(true);
  };

  const handleCreateTransaction = async () => {
    if (!selectedUserId) return;

    try {
      const response = await axios.post(`${apiBaseUrl}/api/transactions`, {
        userId: selectedUserId,
        ...transaction,
        date: transaction.date.toISOString() // Convert date to ISO string for API
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
      });

      toast(response.data.message);
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
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast('Failed to create transaction');
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/verify-user`, { userId }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
      });
      toast(response.data.message);

      // Update user status in the UI
      setUsersData(usersData.map(user =>
        user.id === userId ? { ...user, isVerified: true } : user
      ));
      setUser({ ...userData, isVerified: true });
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const user = { id: userId };
      const response = await axios.delete(`${apiBaseUrl}/api/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        data: user
      });

      if (response.status === 200) {
        toast('User deleted successfully');
        setUsersData(usersData.filter(user => user.id !== userId));
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      toast('Could not delete user. Please try again.');
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = useMemo(() => {
    return usersData.filter(user =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [usersData, searchText]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage and monitor all platform users</p>
          </div>
          <Button
            onClick={() => setIsAddUserDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SlackDashboardCard
            title="Total Users"
            value={usersData.length}
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
            value={usersData.filter(user => user.isVerified).length}
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
            title="Total Balances"
            value={`$${usersData.reduce((sum, user) => sum + (user.balance || 0), 0).toLocaleString()}`}
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
            value={Math.floor(usersData.length * 0.75)}
            subtitle="Monthly active users"
            icon={TrendingUp}
            color="yellow"
            trend={{
              value: 5.4,
              direction: 'up',
              period: 'this month'
            }}
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Users</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableCell className="font-semibold">Name</TableCell>
                      <TableCell className="font-semibold">Email</TableCell>
                      <TableCell className="font-semibold">Phone</TableCell>
                      <TableCell className="font-semibold">Status</TableCell>
                      <TableCell className="font-semibold">Total Balance</TableCell>
                      <TableCell className="font-semibold">Created At</TableCell>
                      <TableCell className="font-semibold">Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        </TableRow>
                      ))
                    ) : usersData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>
                            <span className={user.isVerified ? 'text-green-500 text-lg' : 'text-red-500 text-lg'}>
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                            {!user.isVerified && (
                              <Button
                                variant="secondary"
                                className="ml-2 bg-slate-500 text-white hover:bg-slate-800"
                                size="sm"
                                onClick={() => handleVerifyUser(user.id)}
                              >
                                Verify
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="secondary" className="bg-slate-500 text-white text-md hover:bg-slate-900" size="sm" onClick={() => handleViewBalances(user)}>
                              View Balances
                            </Button>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger >
                                <Button variant="secondary" className="bg-slate-500 text-white hover:bg-slate-800" size="sm" onClick={() => setSelectedUserId(user.id)}>Credit</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle><span className='text-coral-black font-bold'>Credit User</span></DialogTitle>
                                  <DialogDescription>
                                    Make changes to the user's balances here. Click save when you're done.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="mainBalance" className="text-right">
                                      Main Balance
                                    </Label>
                                    <Input
                                      id="mainBalance"
                                      value={mainBalance}
                                      onChange={(event) => setMainBalance(Number(event.target.value))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="bitcoin" className="text-right">
                                      Bitcoin
                                    </Label>
                                    <Input
                                      id="bitcoin"
                                      value={bitcoinBalance}
                                      onChange={(event) => setBitcoinBalance(Number(event.target.value))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="ethereum" className="text-right">
                                      Ethereum
                                    </Label>
                                    <Input
                                      id="ethereum"
                                      value={ethereumBalance}
                                      onChange={(event) => setEthereumBalance(Number(event.target.value))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="usdt" className="text-right">
                                      USDT
                                    </Label>
                                    <Input
                                      id="usdt"
                                      value={usdtBalance}
                                      onChange={(event) => setUsdtBalance(Number(event.target.value))}
                                      className="col-span-3" />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="usdc" className="text-right">
                                      USDC
                                    </Label>
                                    <Input
                                      id="usdc"
                                      value={usdcBalance}
                                      onChange={(event) => setUsdcBalance(Number(event.target.value))}
                                      className="col-span-3" />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit" onClick={handleCredit}>
                                    Save changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEditUser?.(user)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  </AlertDialogHeader>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user?
                                  </AlertDialogDescription>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="bg-blue-500 hover:bg-blue-700 text-white"
                                  onClick={() => setSelectedUserId(user.id)}
                                >
                                  Create Transaction
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Create Transaction</DialogTitle>
                                  <DialogDescription>
                                    Create a new transaction for this user.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  {/* Name Field */}
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                      Name
                                    </Label>
                                    <Input
                                      id="name"
                                      value={transaction.name}
                                      onChange={(e) => setTransaction({ ...transaction, name: e.target.value })}
                                      className="col-span-3"
                                    />
                                  </div>
                                  {/* Phone Field */}
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right">
                                      Phone
                                    </Label>
                                    <Input
                                      id="phone"
                                      value={transaction.phone}
                                      onChange={(e) => setTransaction({ ...transaction, phone: e.target.value })}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right">
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
                                  {/* Plan Name Field (Conditional) */}
                                  {transaction.type === 'subscription' && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="planName" className="text-right">
                                        Plan Name
                                      </Label>
                                      <Input
                                        id="planName"
                                        value={transaction.planName}
                                        onChange={(e) => setTransaction({ ...transaction, planName: e.target.value })}
                                        className="col-span-3"
                                      />
                                    </div>
                                  )}

                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="asset" className="text-right">
                                      Asset
                                    </Label>
                                    <Select
                                      onValueChange={(value) => setTransaction({ ...transaction, asset: value })}
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select asset" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="bitcoin">Bitcoin</SelectItem>
                                        <SelectItem value="ethereum">Ethereum</SelectItem>
                                        <SelectItem value="usdt">USDT</SelectItem>
                                        <SelectItem value="usdt">USDC</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="amount" className="text-right">
                                      Amount
                                    </Label>
                                    <Input
                                      id="amount"
                                      type="number"
                                      value={transaction.amount}
                                      onChange={(e) => setTransaction({ ...transaction, amount: Number(e.target.value) })}
                                      className="col-span-3"
                                    />
                                  </div>

                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="date" className="text-right">
                                      Date
                                    </Label>
                                    <DatePicker
                                      selected={transaction.date}
                                      onChange={(date) => setTransaction({ ...transaction, date: date || new Date() })}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-right">
                                      Status
                                    </Label>
                                    <Select
                                      value={transaction.status}
                                      onValueChange={(value) =>
                                        setTransaction(prev => ({ ...prev, status: value }))
                                      }
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {transaction.type === 'subscription' ? (
                                          <>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                          </>
                                        ) : transaction.type === 'withdrawal' ? (
                                          <>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Completed</SelectItem>
                                          </>
                                        ) : (
                                          <>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                          </>
                                        )}
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
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={async () => {
                              try {
                                const res = await axios.get(`${apiBaseUrl}/api/users/${user.id}/password`, {
                                  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
                                });
                                toast(`Password: ${res.data.password}`);
                              } catch (err) {
                                toast('Could not fetch password');
                              }
                            }}>
                              Show Password
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || totalPages === 0}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
            {totalPages !== 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <span className="ml-2 text-gray-400">•</span>
                <span className="ml-2">
                  {usersData.length} total users
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hidden">Open Balance Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>User Balances</DialogTitle>
              <DialogDescription>
                Balances for {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Bitcoin</Label>
                <div className="col-span-3">{selectedUser?.bitcoinBalance}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Ethereum</Label>
                <div className="col-span-3">{selectedUser?.ethereumBalance}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">USDT</Label>
                <div className="col-span-3">{selectedUser?.usdtBalance}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">USDC</Label>
                <div className="col-span-3">{selectedUser?.usdcBalance}</div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsBalanceDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hidden">Open Add User Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new user. Click save when you're done.
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
                <Label htmlFor="passwrod" className="text-right">
                  password
                </Label>
                <Input
                  id="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddUser}>
                {loading ? (<Spinner />) : 'Add User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserManagement;