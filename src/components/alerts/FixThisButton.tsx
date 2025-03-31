
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
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

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
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Apply solution to this alert</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
              </div>
              
              <DialogFooter>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Close without applying solution</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleApplySolution} 
                        disabled={!selectedSolutionId || isApplying}
                      >
                        {isApplying ? "Applying..." : "Apply Solution"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Apply selected solution</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogFooter>
            </>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">Solution is being applied</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                The selected solution is now being applied to this alert. This may take a few moments.
              </p>
              
              {selectedSolution && (
                <div className="rounded-md border p-3 bg-muted/30">
                  <p className="font-medium">{selectedSolution.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedSolution.description}</p>
                </div>
              )}
              
              <DialogFooter>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Close
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Close dialog</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleMarkResolved} 
                        disabled={isApplying}
                      >
                        {isApplying ? "Processing..." : "Mark as Resolved"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Mark alert as resolved</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FixThisButton;
