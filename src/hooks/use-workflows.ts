
import { useState, useEffect } from 'react';
import { Workflow } from '@/types/workflow';

interface UseWorkflowsProps {
  associationId?: string;
}

// Mock data for workflows
const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Late Payment Notice',
    description: 'Send late payment notices to residents',
    category: 'financial',
    steps: [],
    status: 'active',
    createdAt: '2025-01-15',
    createdBy: 'admin-1'
  },
  {
    id: 'wf-2',
    name: 'Maintenance Reminder',
    description: 'Send maintenance reminders to residents',
    category: 'maintenance',
    steps: [],
    status: 'active',
    createdAt: '2025-01-20',
    createdBy: 'admin-1'
  },
  {
    id: 'wf-3',
    name: 'Meeting Invitation',
    description: 'Send meeting invitations to board members',
    category: 'meetings',
    steps: [],
    status: 'active',
    createdAt: '2025-02-05',
    createdBy: 'admin-2'
  }
];

export function useWorkflows({ associationId }: UseWorkflowsProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWorkflows = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call to get workflows for the association
        const data = associationId 
          ? mockWorkflows.filter(w => w.associationId === associationId || !w.associationId)
          : mockWorkflows;
          
        setWorkflows(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching workflows:', err);
        setError('Failed to load workflows');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkflows();
  }, [associationId]);
  
  return {
    workflows,
    isLoading,
    error
  };
}
