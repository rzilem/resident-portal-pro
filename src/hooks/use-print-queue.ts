import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PrintJob, PrintQueueStats, PrintCategory } from '@/services/printQueueService';

export const usePrintQueue = () => {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [stats, setStats] = useState<PrintQueueStats>({
    totalJobs: 0,
    pendingJobs: 0,
    printingJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    totalPagesQueued: 0,
    averageWaitTime: '0m'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock print jobs data
  const mockPrintJobs: PrintJob[] = [
    {
      id: uuidv4(),
      name: 'HOA Meeting Minutes - March 2023.pdf',
      status: 'pending',
      createdAt: '2023-03-15T14:30:00Z',
      pageCount: 12,
      copies: 25,
      paperSize: 'Letter',
      paperType: 'Standard',
      duplexPrinting: true,
      color: false,
      priority: 'high',
      printer: 'Main Office Printer',
      user: 'Administrator',
      documentType: 'Meeting Minutes',
      associationId: '1',
      associationName: 'Sunset Heights HOA',
      category: 'Board Documents',
      description: 'Monthly board meeting minutes for distribution',
      sendCertified: false
    },
    {
      id: uuidv4(),
      name: 'Annual Budget Report 2023.pdf',
      status: 'printing',
      createdAt: '2023-03-14T09:15:00Z',
      pageCount: 35,
      copies: 15,
      paperSize: 'Letter',
      paperType: 'Premium',
      duplexPrinting: true,
      color: true,
      priority: 'normal',
      printer: 'Main Office Printer',
      user: 'Finance Manager',
      documentType: 'Financial Report',
      estimatedCompletionTime: '2023-03-15T15:45:00Z',
      associationId: '1',
      associationName: 'Sunset Heights HOA',
      category: 'Financial Documents',
      description: 'Annual budget report for homeowner review',
      sendCertified: true
    },
    {
      id: uuidv4(),
      name: 'Community Newsletter - Spring 2023.pdf',
      status: 'completed',
      createdAt: '2023-03-10T11:20:00Z',
      updatedAt: '2023-03-10T12:30:00Z',
      pageCount: 8,
      copies: 200,
      paperSize: 'Letter',
      paperType: 'Glossy',
      duplexPrinting: true,
      color: true,
      priority: 'normal',
      printer: 'Production Printer',
      user: 'Communications Coordinator',
      documentType: 'Newsletter',
      associationId: '1',
      associationName: 'Sunset Heights HOA',
      category: 'Communications',
      description: 'Quarterly newsletter for all residents',
      sendCertified: false
    },
    {
      id: uuidv4(),
      name: 'Violation Notices - Batch March 15.pdf',
      status: 'failed',
      createdAt: '2023-03-15T10:45:00Z',
      updatedAt: '2023-03-15T10:50:00Z',
      pageCount: 45,
      copies: 1,
      paperSize: 'Letter',
      paperType: 'Standard',
      duplexPrinting: false,
      color: false,
      priority: 'high',
      printer: 'Office Printer 2',
      user: 'Compliance Manager',
      documentType: 'Violation Notices',
      associationId: '1',
      associationName: 'Sunset Heights HOA',
      category: 'Compliance',
      description: 'Batch of compliance violation letters',
      sendCertified: true
    }
  ];

  // Mock stats calculation based on the mockPrintJobs
  const calculateStats = (jobs: PrintJob[]): PrintQueueStats => {
    const pendingJobs = jobs.filter(job => job.status === 'pending').length;
    const printingJobs = jobs.filter(job => job.status === 'printing').length;
    const completedJobs = jobs.filter(job => job.status === 'completed').length;
    const failedJobs = jobs.filter(job => job.status === 'failed').length;
    
    const totalPagesQueued = jobs.reduce((total, job) => {
      if (job.status === 'pending' || job.status === 'printing') {
        return total + (job.pageCount * job.copies);
      }
      return total;
    }, 0);
    
    return {
      totalJobs: jobs.length,
      pendingJobs,
      printingJobs,
      completedJobs,
      failedJobs,
      totalPagesQueued,
      averageWaitTime: '15m' // Mock value
    };
  };

  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true);
    setTimeout(() => {
      setPrintJobs(mockPrintJobs);
      setStats(calculateStats(mockPrintJobs));
      setLoading(false);
    }, 1000);
  }, []);

  const toggleJobSelection = (id: string) => {
    setSelectedJobs(prev =>
      prev.includes(id)
        ? prev.filter(jobId => jobId !== id)
        : [...prev, id]
    );
  };

  const selectAllJobs = () => {
    if (selectedJobs.length === printJobs.length) {
      // If all jobs are currently selected, deselect all
      setSelectedJobs([]);
    } else {
      // Otherwise, select all jobs
      setSelectedJobs(printJobs.map(job => job.id));
    }
  };

  const clearSelection = () => {
    setSelectedJobs([]);
  };

  const addPrintJob = (job: Omit<PrintJob, 'id' | 'createdAt' | 'status'>) => {
    const newJob: PrintJob = {
      ...job,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    setPrintJobs(prev => [...prev, newJob]);
    setStats(calculateStats([...printJobs, newJob]));
    
    return newJob;
  };

  const deleteJob = (id: string) => {
    setPrintJobs(prev => prev.filter(job => job.id !== id));
    setSelectedJobs(prev => prev.filter(jobId => jobId !== id));
    setStats(calculateStats(printJobs.filter(job => job.id !== id)));
  };

  const cancelPrintJob = (id: string) => {
    setPrintJobs(prev => 
      prev.map(job => 
        job.id === id 
          ? { ...job, status: 'failed', updatedAt: new Date().toISOString() } 
          : job
      )
    );
    setStats(calculateStats(printJobs.map(job => 
      job.id === id 
        ? { ...job, status: 'failed', updatedAt: new Date().toISOString() } 
        : job
    )));
  };

  const reprintJob = (id: string) => {
    const jobToReprint = printJobs.find(job => job.id === id);
    if (!jobToReprint) return null;
    
    const newJob: PrintJob = {
      ...jobToReprint,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      updatedAt: undefined
    };
    
    setPrintJobs(prev => [...prev, newJob]);
    setStats(calculateStats([...printJobs, newJob]));
    
    return newJob;
  };

  // Renamed to avoid variable name conflict
  const printSelectedJobs = () => {
    console.log('Printing selected jobs:', selectedJobs);
    // In a real app, this would handle actual printing
  };

  const sendToHOAMailers = () => {
    console.log('Sending to HOA Mailers:', selectedJobs);
    // In a real app, this would handle sending to an external service
  };

  return {
    printJobs,
    selectedJobs,
    loading,
    error,
    addPrintJob,
    cancelPrintJob,
    reprintJob,
    toggleJobSelection,
    selectAllJobs,
    clearSelection,
    deleteJob,
    printSelectedJobs,
    sendToHOAMailers,
    stats
  };
};

export type { PrintJob, PrintQueueStats, PrintCategory } from '@/services/printQueueService';
