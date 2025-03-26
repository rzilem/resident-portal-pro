
import { toast } from 'sonner';
import { workflowService } from '@/services/workflowService';
import { getAlertById } from './alertQueries';
import { updateAlertStatus } from './alertMutations';
import { alertsDatabase } from '@/data/mockAlerts';

export const implementSolution = async (alertId: string, solutionId: string): Promise<boolean> => {
  const alert = getAlertById(alertId);
  if (!alert) return false;
  
  const solution = alert.solutions.find(s => s.id === solutionId);
  if (!solution) return false;
  
  try {
    // Execute the solution's action
    await solution.action();
    
    // Update alert status to in-progress
    updateAlertStatus(alertId, 'in-progress');
    
    // Show toast notification
    toast.success(`Solution initiated: ${solution.title}`, {
      description: `Working on: ${alert.title}`
    });
    
    return true;
  } catch (error) {
    console.error('Error implementing solution:', error);
    
    toast.error('Failed to implement solution', {
      description: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return false;
  }
};

// Check workflow progress and update alert status
export const checkWorkflowProgressForAlert = async (alertId: string): Promise<void> => {
  const alert = getAlertById(alertId);
  if (!alert || !alert.relatedWorkflowId) return;
  
  try {
    const workflow = await workflowService.getWorkflowById(alert.relatedWorkflowId);
    
    // If the workflow is completed, mark the alert as resolved
    if (workflow.status === 'completed') {
      updateAlertStatus(alertId, 'resolved');
      toast.success(`Alert "${alert.title}" resolved`, {
        description: "The associated workflow has been completed"
      });
    }
  } catch (error) {
    console.error('Error checking workflow progress:', error);
  }
};
