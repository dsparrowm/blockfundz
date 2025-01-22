import React, { useState, useMemo, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Users, Edit, Trash } from 'lucide-react';
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios';
import { toast } from 'sonner';
import Spinner from '../spinners/Spinner';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string,
  balance: number,
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
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/users`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
          }
        }); // Adjust the API endpoint as necessary
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
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-slate-400"
      />
      <Button onClick={() => setIsAddUserDialogOpen(true)} className="ml-4">
        Add New User
      </Button>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table className="text-white">
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>All Balances</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Actions</TableCell>
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
                      <Button variant="secondary" size="sm" onClick={() => handleViewBalances(user)}>
                        View Balances
                      </Button>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger >
                          <Button variant="secondary" size="sm" onClick={() => setSelectedUserId(user.id)}><span className='text-orange-500'>Credit</span></Button>
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
                            {/* <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="bnb" className="text-right">
                                BNB
                              </Label>
                              <Input
                                id="bnb"
                                value={bnbBalance}
                                onChange={(event) => setBnbBalance(Number(event.target.value))}
                                className="col-span-3" />
                            </div> */}
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
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onEditUser?.(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Edit profile</SheetTitle>
                              <SheetDescription>
                                Make changes to your profile here. Click save when you're done.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input id="name" value="Pedro Duarte" className="col-span-3" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                  Email
                                </Label>
                                <Input id="email" value="johndoe@example.com" className="col-span-3" />
                              </div>
                            </div>
                            <SheetFooter>
                              <SheetClose asChild>
                                <Button type="submit">Save changes</Button>
                              </SheetClose>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
            >
              Previous
            </Button>
            {totalPages !== 0 && <span className='text-white-400'>Page {currentPage} of {totalPages}</span>}
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </>
      )}

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
  );
};

export default UserManagement;