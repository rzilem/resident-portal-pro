
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Loader2, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Alert, 
  AlertSolution
} from '@/types/alert';
import { 
  implementSolution, 
  updateAlertStatus 
} from '@/utils/alerts';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';
import { workflowService } from '@/services/workflowService';
import { toast } from 'sonner';

interface FixThisButtonProps {
  alert: Alert;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onStatusUpdate?: (alertId: string, newStatus: Alert['status']) => void;
}

const FixThisButton: React.FC<FixThisButtonProps> = ({ 
  alert, 
  variant = 'default', 
  size = 'sm',
  className = '',
  onStatusUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [implementing, setImplementing] = useState<string | null>(null);
  
  const handleImplementSolution = async (solutionId: string) => {
    setImplementing(solutionId);
    
    try {
      const solution = alert.solutions.find(s => s.id === solutionId);
      if (!solution) throw new Error('Solution not found');
      
      // If this solution has a workflow template, create a workflow from it
      if (solution.actionType === 'workflow' && solution.workflowTemplateId) {
        // Create a workflow from the template
        const workflow = await workflowService.createFromTemplate(solution.workflowTemplateId, {
          // Link the workflow to this alert
          metadata: { 
            alertId: alert.id,
            solutionId: solutionId,
            created: new Date().toISOString()
          }
        });
        
        // Update the alert with the workflow ID
        const updatedAlert = {
          ...alert,
          relatedWorkflowId: workflow.id
        };
        
        // Call implementSolution to update alert status
        await implementSolution(alert.id, solutionId);
        
        toast.success(`Workflow "${workflow.name}" created successfully`, {
          description: "You can monitor progress in the Workflows section"
        });
      } else {
        // For non-workflow solutions, just implement the solution
        await implementSolution(alert.id, solutionId);
      }
      
      // Close the dialog after a short delay to show success state
      setTimeout(() => {
        setIsOpen(false);
        
        // Call the callback if provided
        if (onStatusUpdate) {
          onStatusUpdate(alert.id, 'in-progress');
        }
      }, 1000);
    } catch (error) {
      console.error('Error implementing solution:', error);
      toast.error('Failed to implement solution');
    } finally {
      setImplementing(null);
    }
  };

  const handleDismiss = () => {
    updateAlertStatus(alert.id, 'dismissed');
    setIsOpen(false);
    
    if (onStatusUpdate) {
      onStatusUpdate(alert.id, 'dismissed');
    }
  };
  
  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'high': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <AlertTriangle className="h-4 w-4 mr-1" />
        Fix This
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Alert: {alert.title}</span>
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {alert.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="text-sm font-medium mb-2">Available Solutions:</h3>
            <div className="space-y-2">
              {alert.solutions.map((solution) => (
                <div 
                  key={solution.id} 
                  className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-medium">{solution.title}</h4>
                    <p className="text-xs text-muted-foreground">{solution.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {solution.actionType === 'workflow' && (
                      <HoverCard>
                        <HoverCardTrigger>
                          <Badge variant="outline" className="cursor-help">
                            Workflow
                          </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-2">
                          <p className="text-xs">
                            This solution will start an automated workflow that will guide you through the process.
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleImplementSolution(solution.id)}
                      disabled={implementing !== null}
                      className="h-8"
                    >
                      {implementing === solution.id ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          <span>Starting</span>
                        </>
                      ) : (
                        <span>Start</span>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismiss}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Dismiss Alert
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              <Check className="h-4 w-4 mr-1" />
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FixThisButton;
