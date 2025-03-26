
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

export interface PrintJob {
  id: string;
  name: string;
  createdAt: string;
  status: 'pending' | 'printing' | 'completed' | 'error';
  type: 'letter' | 'report' | 'statement' | 'certificate' | 'notice';
  recipient?: string;
  pages: number;
  documentId?: string;
  error?: string;
}

export const usePrintQueue = () => {
  const [jobs, setJobs] = useState<PrintJob[]>(SAMPLE_PRINT_JOBS);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock job creation
  const createJob = useCallback((job: Omit<PrintJob, 'id' | 'createdAt' | 'status'>) => {
    const newJob: PrintJob = {
      ...job,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    setJobs(prev => [newJob, ...prev]);
    
    toast({
      title: "Job added to queue",
      description: `${newJob.name} has been added to the print queue.`
    });

    return newJob;
  }, [toast]);

  // Mock job deletion
  const deleteJob = useCallback((id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
    setSelectedJobs(prev => prev.filter(jobId => jobId !== id));
    
    toast({
      title: "Job removed",
      description: "The job has been removed from the print queue."
    });
  }, [toast]);

  // Mock bulk job deletion
  const deleteSelectedJobs = useCallback(() => {
    if (selectedJobs.length === 0) return;
    
    setJobs(prev => prev.filter(job => !selectedJobs.includes(job.id)));
    setSelectedJobs([]);
    
    toast({
      title: "Jobs removed",
      description: `${selectedJobs.length} jobs have been removed from the print queue.`
    });
  }, [selectedJobs, toast]);

  // Toggle job selection
  const toggleJobSelection = useCallback((id: string) => {
    setSelectedJobs(prev => 
      prev.includes(id) 
        ? prev.filter(jobId => jobId !== id) 
        : [...prev, id]
    );
  }, []);

  // Select all jobs
  const selectAllJobs = useCallback(() => {
    const allJobIds = jobs.map(job => job.id);
    setSelectedJobs(allJobIds);
  }, [jobs]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedJobs([]);
  }, []);

  // Mock print function
  const printJobs = useCallback(() => {
    if (selectedJobs.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate print process
    setTimeout(() => {
      setJobs(prev => 
        prev.map(job => 
          selectedJobs.includes(job.id) 
            ? { ...job, status: 'printing' } 
            : job
        )
      );
      
      setIsLoading(false);
      
      toast({
        title: "Printing started",
        description: `${selectedJobs.length} jobs sent to printer.`
      });
      
      // Simulate completion after some time
      setTimeout(() => {
        setJobs(prev => 
          prev.map(job => 
            selectedJobs.includes(job.id) && job.status === 'printing'
              ? { ...job, status: 'completed' } 
              : job
          )
        );
        
        setSelectedJobs([]);
      }, 3000);
    }, 1000);
  }, [selectedJobs, toast]);

  // Mock send to HOA Mailers function
  const sendToHOAMailers = useCallback(() => {
    if (selectedJobs.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate sending process
    setTimeout(() => {
      setJobs(prev => 
        prev.map(job => 
          selectedJobs.includes(job.id) 
            ? { ...job, status: 'completed' } 
            : job
        )
      );
      
      setIsLoading(false);
      
      toast({
        title: "Jobs sent to HOA Mailers",
        description: `${selectedJobs.length} jobs sent to HOA Mailers service.`
      });
      
      setSelectedJobs([]);
    }, 1500);
  }, [selectedJobs, toast]);

  return {
    jobs,
    selectedJobs,
    isLoading,
    createJob,
    deleteJob,
    deleteSelectedJobs,
    toggleJobSelection,
    selectAllJobs,
    clearSelection,
    printJobs,
    sendToHOAMailers
  };
};

// Sample print jobs for demonstration
const SAMPLE_PRINT_JOBS: PrintJob[] = [
  {
    id: '1',
    name: 'Monthly HOA Statement - Unit 101',
    createdAt: '2023-06-12T09:30:00Z',
    status: 'pending',
    type: 'statement',
    recipient: 'Alice Johnson',
    pages: 3,
    documentId: 'doc-1'
  },
  {
    id: '2',
    name: 'Violation Notice - Unit 203',
    createdAt: '2023-06-12T10:15:00Z',
    status: 'pending',
    type: 'notice',
    recipient: 'Michael Wilson',
    pages: 2,
    documentId: 'doc-2'
  },
  {
    id: '3',
    name: 'Annual Financial Report',
    createdAt: '2023-06-11T14:45:00Z',
    status: 'completed',
    type: 'report',
    recipient: 'Board Members',
    pages: 12,
    documentId: 'doc-3'
  },
  {
    id: '4',
    name: 'Resale Certificate - Unit 156',
    createdAt: '2023-06-11T11:20:00Z',
    status: 'error',
    type: 'certificate',
    recipient: 'David Lee',
    pages: 5,
    documentId: 'doc-4',
    error: 'Insufficient printer toner'
  },
  {
    id: '5',
    name: 'Welcome Letter - Unit 118',
    createdAt: '2023-06-10T16:05:00Z',
    status: 'completed',
    type: 'letter',
    recipient: 'Sarah Brown',
    pages: 1,
    documentId: 'doc-5'
  }
];
