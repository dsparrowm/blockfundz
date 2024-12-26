import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'; // Adjust the import paths as necessary
import { Input } from '@/components/ui/input'; // Adjust the import paths as necessary
import { Label } from '@/components/ui/label'; 

interface AddInvestmentPlanDialogProps {
  onAddPlan: (plan: { plan: string; minimumAmount: number; maximumAmount: number; interestRate: number; totalReturns: number }) => void;
}

const AddInvestmentPlanDialog: React.FC<AddInvestmentPlanDialogProps> = ({ onAddPlan }) => {
  const [newPlan, setNewPlan] = useState({ plan: '', minimumAmount: 0, maximumAmount: 0, interestRate: 0, totalReturns: 0 });

  const handleAddPlan = () => {
    onAddPlan(newPlan);
    setNewPlan({ plan: '', minimumAmount: 0, maximumAmount: 0, interestRate: 0, totalReturns: 0 });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Plan</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Investment Plan</DialogTitle>
        <DialogDescription>Fill in the details of the new investment plan.</DialogDescription>
        <div className="mb-4">
          <Label htmlFor="newPlan">Plan</Label>
          <Input
            id="newPlan"
            value={newPlan.plan}
            onChange={(e) => setNewPlan({ ...newPlan, plan: e.target.value })}
            className="w-full"
          />
          <Label htmlFor="newMinimumAmount">Minimum Amount</Label>
          <Input
            id="newMinimumAmount"
            type="number"
            value={newPlan.minimumAmount}
            onChange={(e) => setNewPlan({ ...newPlan, minimumAmount: parseFloat(e.target.value) })}
            className="w-full"
          />
          <Label htmlFor="newMaximumAmount">Maximum Amount</Label>
          <Input
            id="newMaximumAmount"
            type="number"
            value={newPlan.maximumAmount}
            onChange={(e) => setNewPlan({ ...newPlan, maximumAmount: parseFloat(e.target.value) })}
            className="w-full"
          />
          <Label htmlFor="newInterestRate">Interest Rate</Label>
          <Input
            id="newInterestRate"
            type="number"
            value={newPlan.interestRate}
            onChange={(e) => setNewPlan({ ...newPlan, interestRate: parseFloat(e.target.value) })}
            className="w-full"
          />
          <Label htmlFor="newTotalReturns">Total Returns (%)</Label>
          <Input
            id="newTotalReturns"
            type="number"
            value={newPlan.totalReturns}
            onChange={(e) => setNewPlan({ ...newPlan, totalReturns: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        <DialogClose asChild>
          <Button onClick={handleAddPlan}>Add Plan</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestmentPlanDialog;