import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../ui/table";
import { Button } from "../ui/button";
import AddInvestmentPlanDialog from './AddInvestmentPlanDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Edit, Trash, DollarSign, TrendingUp, Calendar, Settings } from 'lucide-react';
import Spinner from '../spinners/Spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import SlackDashboardCard from '../SlackDashboardCard';

interface InvestmentPlan {
  id: number;
  plan: string;
  minimumAmount: number;
  maximumAmount: number;
  interestRate: number;
  totalReturns: number;
}

const InvestmentPlansManagement = () => {
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState<InvestmentPlan | null>(null);
  const [deletePlan, setDeletePlan] = useState<InvestmentPlan | null>(null);

  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/investments');
        setInvestmentPlans(response.data.investmentPlans);
      } catch (error) {
        console.error('Error fetching investment plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentPlans();
  }, []);

  const handleAddPlan = async (newPlan: { plan: string; minimumAmount: number; maximumAmount: number; interestRate: number; totalReturns: number }) => {
    try {
      const response = await axiosInstance.post('/api/investments/add', newPlan);
      setInvestmentPlans([...investmentPlans, response.data.newPlan]);
    } catch (error) {
      console.error('Error adding investment plan:', error);
    }
  };

  const handleEditPlan = async (updatedPlan: InvestmentPlan) => {
    if (!updatedPlan) return; // Ensure updatedPlan is not null or undefined
    try {
      const response = await axiosInstance.put(`/api/investments/${updatedPlan.id}`, updatedPlan);
      setInvestmentPlans(investmentPlans.map(plan => plan.id === updatedPlan.id ? response.data : plan));
      setEditPlan(null);
    } catch (error) {
      console.error('Error editing investment plan:', error);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    try {
      await axiosInstance.delete(`/api/investments/${planId}`);
      setInvestmentPlans(investmentPlans.filter(plan => plan.id !== planId));
      setDeletePlan(null);
    } catch (error) {
      console.error('Error deleting investment plan:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Investment Plans Management</h1>
          </div>
          <p className="text-gray-600">Create, edit, and manage investment plans for your platform</p>
        </div>
        <AddInvestmentPlanDialog onAddPlan={handleAddPlan} />
      </div>

      {/* Stats Cards using SlackDashboardCard for consistency */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SlackDashboardCard
          title="Total Plans"
          value={investmentPlans.length}
          subtitle="Active investment plans"
          icon={TrendingUp}
          color="blue"
          trend={{
            value: 12.5,
            direction: 'up',
            period: 'this month'
          }}
        />

        <SlackDashboardCard
          title="Avg. Interest Rate"
          value={`${investmentPlans.length > 0
            ? (investmentPlans.reduce((sum, plan) => sum + plan.interestRate, 0) / investmentPlans.length).toFixed(1)
            : '0'
            }%`}
          subtitle="Average across all plans"
          icon={DollarSign}
          color="green"
          trend={{
            value: 8.2,
            direction: 'up',
            period: 'this week'
          }}
        />

        <SlackDashboardCard
          title="Avg. Returns"
          value={`${investmentPlans.length > 0
            ? (investmentPlans.reduce((sum, plan) => sum + plan.totalReturns, 0) / investmentPlans.length).toFixed(1)
            : '0'
            }%`}
          subtitle="Average total returns"
          icon={Calendar}
          color="purple"
          trend={{
            value: 5.7,
            direction: 'up',
            period: 'this quarter'
          }}
        />
      </div>

      {/* Investment Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Plans</CardTitle>
          <CardDescription>
            Manage all investment plans and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner />
            </div>
          ) : investmentPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <TrendingUp className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No investment plans</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new investment plan.</p>
              <div className="mt-6">
                <AddInvestmentPlanDialog onAddPlan={handleAddPlan} />
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-semibold text-gray-900">Plan Name</TableCell>
                    <TableCell className="font-semibold text-gray-900">Amount Range</TableCell>
                    <TableCell className="font-semibold text-gray-900">Interest Rate</TableCell>
                    <TableCell className="font-semibold text-gray-900">Total Returns</TableCell>
                    <TableCell className="font-semibold text-gray-900 text-center">Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investmentPlans.map((plan, index) => (
                    <TableRow key={plan.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{plan.plan}</div>
                          <Badge variant="outline" className="text-xs">
                            ID: {plan.id}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            ${plan.minimumAmount.toLocaleString()} - ${plan.maximumAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Investment range</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {plan.interestRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {plan.totalReturns}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <Dialog open={editPlan?.id === plan.id} onOpenChange={(isOpen) => !isOpen && setEditPlan(null)}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditPlan(plan)}
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Edit className="h-5 w-5 text-blue-600" />
                                  Edit Investment Plan
                                </DialogTitle>
                                <DialogDescription>
                                  Update the investment plan details. All fields are required.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-6 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="plan" className="text-sm font-medium">
                                    Plan Name
                                  </Label>
                                  <Input
                                    id="plan"
                                    value={editPlan?.plan || ''}
                                    onChange={(e) => setEditPlan({ ...editPlan!, plan: e.target.value })}
                                    placeholder="Enter plan name"
                                    className="w-full"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="minimumAmount" className="text-sm font-medium">
                                      Minimum Amount ($)
                                    </Label>
                                    <Input
                                      id="minimumAmount"
                                      type="number"
                                      value={editPlan?.minimumAmount || 0}
                                      onChange={(e) => setEditPlan({ ...editPlan!, minimumAmount: parseFloat(e.target.value) || 0 })}
                                      placeholder="0"
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="maximumAmount" className="text-sm font-medium">
                                      Maximum Amount ($)
                                    </Label>
                                    <Input
                                      id="maximumAmount"
                                      type="number"
                                      value={editPlan?.maximumAmount || 0}
                                      onChange={(e) => setEditPlan({ ...editPlan!, maximumAmount: parseFloat(e.target.value) || 0 })}
                                      placeholder="0"
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="interestRate" className="text-sm font-medium">
                                      Interest Rate (%)
                                    </Label>
                                    <Input
                                      id="interestRate"
                                      type="number"
                                      step="0.01"
                                      value={editPlan?.interestRate || 0}
                                      onChange={(e) => setEditPlan({ ...editPlan!, interestRate: parseFloat(e.target.value) || 0 })}
                                      placeholder="0.00"
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="totalReturns" className="text-sm font-medium">
                                      Total Returns (%)
                                    </Label>
                                    <Input
                                      id="totalReturns"
                                      type="number"
                                      step="0.01"
                                      value={editPlan?.totalReturns || 0}
                                      onChange={(e) => setEditPlan({ ...editPlan!, totalReturns: parseFloat(e.target.value) || 0 })}
                                      placeholder="0.00"
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setEditPlan(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleEditPlan(editPlan!)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={deletePlan?.id === plan.id} onOpenChange={(isOpen) => !isOpen && setDeletePlan(null)}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletePlan(plan)}
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                              >
                                <Trash className="h-4 w-4 text-red-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-red-600">
                                  <Trash className="h-5 w-5" />
                                  Delete Investment Plan
                                </DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete "{plan.plan}"? This action cannot be undone and will affect all users invested in this plan.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                                <div className="flex">
                                  <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                      Warning
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                      <p>This will permanently delete the investment plan and may affect existing investments.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setDeletePlan(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeletePlan(plan.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Plan
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentPlansManagement;