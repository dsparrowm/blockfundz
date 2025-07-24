import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus } from 'lucide-react';

interface AddInvestmentPlanDialogProps {
  onAddPlan: (plan: { plan: string; minimumAmount: number; maximumAmount: number; interestRate: number; totalReturns: number }) => void;
}

const AddInvestmentPlanDialog = ({ onAddPlan }: AddInvestmentPlanDialogProps) => {
  const [newPlan, setNewPlan] = useState({ plan: '', minimumAmount: 0, maximumAmount: 0, interestRate: 0, totalReturns: 0 });
  const [open, setOpen] = useState(false);

  const handleAddPlan = () => {
    if (!newPlan.plan.trim()) return;

    onAddPlan(newPlan);
    setNewPlan({ plan: '', minimumAmount: 0, maximumAmount: 0, interestRate: 0, totalReturns: 0 });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Add Investment Plan
          </DialogTitle>
          <DialogDescription>
            Create a new investment plan with detailed specifications for your platform.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="newPlan" className="text-sm font-medium">
              Plan Name
            </Label>
            <Input
              id="newPlan"
              value={newPlan.plan}
              onChange={(e) => setNewPlan({ ...newPlan, plan: e.target.value })}
              placeholder="e.g., Premium Growth Plan"
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newMinimumAmount" className="text-sm font-medium">
                Minimum Amount ($)
              </Label>
              <Input
                id="newMinimumAmount"
                type="number"
                value={newPlan.minimumAmount}
                onChange={(e) => setNewPlan({ ...newPlan, minimumAmount: parseFloat(e.target.value) || 0 })}
                placeholder="100"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newMaximumAmount" className="text-sm font-medium">
                Maximum Amount ($)
              </Label>
              <Input
                id="newMaximumAmount"
                type="number"
                value={newPlan.maximumAmount}
                onChange={(e) => setNewPlan({ ...newPlan, maximumAmount: parseFloat(e.target.value) || 0 })}
                placeholder="10000"
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newInterestRate" className="text-sm font-medium">
                Interest Rate (%)
              </Label>
              <Input
                id="newInterestRate"
                type="number"
                step="0.01"
                value={newPlan.interestRate}
                onChange={(e) => setNewPlan({ ...newPlan, interestRate: parseFloat(e.target.value) || 0 })}
                placeholder="5.00"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newTotalReturns" className="text-sm font-medium">
                Total Returns (%)
              </Label>
              <Input
                id="newTotalReturns"
                type="number"
                step="0.01"
                value={newPlan.totalReturns}
                onChange={(e) => setNewPlan({ ...newPlan, totalReturns: parseFloat(e.target.value) || 0 })}
                placeholder="15.00"
                className="w-full"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddPlan}
            disabled={!newPlan.plan.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestmentPlanDialog;