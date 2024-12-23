import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"; // Adjust the import paths as necessary
import { Button } from "@/components/ui/button"; // Adjust the import paths as necessary
import AddInvestmentPlanDialog from './AddInvestmentPlanDialog'; // Adjust the import path as necessary
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Edit, Trash } from 'lucide-react';

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
        const response = await axios.get('http://localhost:3001/api/investments', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
          }
        });
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
      const response = await axios.post('http://localhost:3001/api/investments/add', newPlan, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
      });
      setInvestmentPlans([...investmentPlans, response.data.newPlan]);
    } catch (error) {
      console.error('Error adding investment plan:', error);
    }
  };

  const handleEditPlan = async (updatedPlan: InvestmentPlan) => {
    if (!updatedPlan) return; // Ensure updatedPlan is not null or undefined
    try {
      const response = await axios.put(`http://localhost:3001/api/investments/${updatedPlan.id}`, updatedPlan, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
      });
      console.log(investmentPlans.map(plan => plan.id === updatedPlan.id ? response.data : plan));
      setInvestmentPlans(investmentPlans.map(plan => plan.id === updatedPlan.id ? response.data : plan));
      setEditPlan(null);
    } catch (error) {
      console.error('Error editing investment plan:', error);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/investments/${planId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
      });
      setInvestmentPlans(investmentPlans.filter(plan => plan.id !== planId));
      setDeletePlan(null);
    } catch (error) {
      console.error('Error deleting investment plan:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white-400">Manage Investment Plans</h2>
      <AddInvestmentPlanDialog onAddPlan={handleAddPlan} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table className="text-white">
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Minimum Amount</TableCell>
              <TableCell>Maximum Amount</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Total Returns (%)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investmentPlans.map(plan => (
              <TableRow key={plan.id}>
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.plan}</TableCell>
                <TableCell>{plan.minimumAmount}</TableCell>
                <TableCell>{plan.maximumAmount}</TableCell>
                <TableCell>{plan.interestRate}</TableCell>
                <TableCell>{plan.totalReturns}</TableCell>
                <TableCell>
                  <div className='flex items-center space-x-2'>
                    <Dialog open={editPlan?.id === plan.id} onOpenChange={(isOpen) => !isOpen && setEditPlan(null)}>
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="sm" onClick={() => setEditPlan(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Plan</DialogTitle>
                          <DialogDescription>
                            Make changes to the investment plan here. Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan" className="text-right">
                              Plan
                            </Label>
                            <Input
                              id="plan"
                              value={editPlan?.plan || ''}
                              onChange={(e) => setEditPlan({ ...editPlan!, plan: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="minimumAmount" className="text-right">
                              Minimum Amount
                            </Label>
                            <Input
                              id="minimumAmount"
                              type="number"
                              value={editPlan?.minimumAmount || 0}
                              onChange={(e) => setEditPlan({ ...editPlan!, minimumAmount: parseFloat(e.target.value) })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="maximumAmount" className="text-right">
                              Maximum Amount
                            </Label>
                            <Input
                              id="maximumAmount"
                              type="number"
                              value={editPlan?.maximumAmount || 0}
                              onChange={(e) => setEditPlan({ ...editPlan!, maximumAmount: parseFloat(e.target.value) })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="interestRate" className="text-right">
                              Interest Rate
                            </Label>
                            <Input
                              id="interestRate"
                              type="number"
                              value={editPlan?.interestRate || 0}
                              onChange={(e) => setEditPlan({ ...editPlan!, interestRate: parseFloat(e.target.value) })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="totalReturns" className="text-right">
                              Total Returns (%)
                            </Label>
                            <Input
                              id="totalReturns"
                              type="number"
                              value={editPlan?.totalReturns || 0}
                              onChange={(e) => setEditPlan({ ...editPlan!, totalReturns: parseFloat(e.target.value) })}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={() => handleEditPlan(editPlan!)}>
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={deletePlan?.id === plan.id} onOpenChange={(isOpen) => !isOpen && setDeletePlan(null)}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setDeletePlan(plan)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Delete Plan</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this investment plan? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="secondary" onClick={() => setDeletePlan(null)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
                            Delete
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
      )}
    </div>
  );
};

export default InvestmentPlansManagement;