
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wrench, ChevronRight, CheckCircle } from 'lucide-react';
import { Alert, AlertSolution } from '@/types/alert';
import { getAlertSolutions, updateAlertStatus } from '@/utils/alerts';
import { toast } from 'sonner';

interface FixThisButtonProps extends ButtonProps {
  alert: Alert;
  onStatusUpdate?: (alertId: string, newStatus: Alert['status']) => void;
}

const FixThisButton: React.FC<FixThisButtonProps> = ({ 
  alert, 
  onStatusUpdate,
  ...buttonProps 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  // Get solution options based on alert type
  const solutions: AlertSolution[] = getAlertSolutions(alert.title);

  const handleApplySolution = async () => {
    if (!selectedSolutionId) {
      toast.error("Please select a solution");
      return;
    }

    try {
      setIsApplying(true);
      
      // Update the alert status to in-progress
      await updateAlertStatus(alert.id, 'in-progress');
      
      if (onStatusUpdate) {
        onStatusUpdate(alert.id, 'in-progress');
      }
      
      toast.success("Solution is being applied");
      
      // In a real app, we would trigger the actual resolution process here
      // This might involve sending emails, creating tasks, etc.
      
      setIsResolved(true);
      
    } catch (error) {
      console.error('Error applying solution:', error);
      toast.error("Failed to apply solution. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleMarkResolved = async () => {
    try {
      setIsApplying(true);
      
      // Update the alert status to resolved
      await updateAlertStatus(alert.id, 'resolved');
      
      if (onStatusUpdate) {
        onStatusUpdate(alert.id, 'resolved');
      }
      
      toast.success("Alert marked as resolved");
      setIsDialogOpen(false);
      
    } catch (error) {
      console.error('Error marking as resolved:', error);
      toast.error("Failed to mark as resolved. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const selectedSolution = solutions.find(s => s.id === selectedSolutionId);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-2 py-0 whitespace-nowrap"
        {...buttonProps}
      >
        <Wrench className="h-3.5 w-3.5 mr-1" />
        Fix This
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isResolved ? "Solution Applied" : "Fix This Alert"}
            </DialogTitle>
            <DialogDescription>
              {isResolved 
                ? "The solution is being applied. You can mark this alert as resolved when the issue is fixed."
                : "Select a solution to apply to this alert"}
            </DialogDescription>
          </DialogHeader>

          {!isResolved ? (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Alert Details</h3>
                  <div className="rounded-md border p-3">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Select a Solution</h3>
                  <Select 
                    value={selectedSolutionId} 
                    onValueChange={setSelectedSolutionId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a solution..." />
                    </SelectTrigger>
                    <SelectContent>
                      {solutions.map(solution => (
                        <SelectItem key={solution.id} value={solution.id}>
                          {solution.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSolution && (
                  <div className="rounded-md border p-3 space-y-3">
                    <p className="text-sm font-medium">{selectedSolution.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Steps:</p>
                      <ul className="space-y-1">
                        {selectedSolution.steps.map((step, index) => (
                          <li key={index} className="text-xs flex items-start gap-2">
                            <ChevronRight className="h-3 w-3 text-muted-foreground mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleApplySolution}
                  disabled={!selectedSolutionId || isApplying}
                >
                  Apply Solution
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="py-6 flex flex-col items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-center">Solution is being applied</h3>
                <p className="text-center text-muted-foreground mt-2">
                  Selected solution: {selectedSolution?.title}
                </p>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="default"
                  onClick={handleMarkResolved}
                  disabled={isApplying}
                >
                  Mark as Resolved
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FixThisButton;
