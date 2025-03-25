
import { v4 as uuidv4 } from 'uuid';

export type PrintJobStatus = 'pending' | 'processing' | 'sent' | 'completed' | 'error';

export type PrintCategory = 
  | 'Bank Return' 
  | 'Statement' 
  | 'Notice' 
  | 'Invoice' 
  | 'Welcome Letter' 
  | 'Violation' 
  | 'Election Material' 
  | 'Other';

export interface PrintJob {
  id: string;
  associationId: string;
  associationName: string;
  category: PrintCategory;
  description: string;
  created: Date;
  status: PrintJobStatus;
  documentUrl?: string;
  recipient?: string;
  sendCertified: boolean;
  sentDate?: Date;
  deliveredDate?: Date;
}

// Mock data for the print queue
const mockPrintJobs: PrintJob[] = [
  {
    id: uuidv4(),
    associationId: 'assoc123',
    associationName: 'Hills of Lakeway Property Owners Association Inc',
    category: 'Bank Return',
    description: 'Andrew & Dell Weaver 3 Sunview Rd',
    created: new Date('2024-12-17T09:00:57'),
    status: 'pending',
    sendCertified: false
  },
  {
    id: uuidv4(),
    associationId: 'assoc456',
    associationName: 'Oakwood Gardens Community Association',
    category: 'Statement',
    description: 'Monthly statements batch for December',
    created: new Date('2024-12-15T14:22:10'),
    status: 'processing',
    sendCertified: false
  },
  {
    id: uuidv4(),
    associationId: 'assoc789',
    associationName: 'Pinecrest HOA',
    category: 'Notice',
    description: 'Annual meeting notice to all homeowners',
    created: new Date('2024-12-14T10:15:32'),
    status: 'sent',
    sentDate: new Date('2024-12-14T11:30:00'),
    sendCertified: true
  },
  {
    id: uuidv4(),
    associationId: 'assoc123',
    associationName: 'Hills of Lakeway Property Owners Association Inc',
    category: 'Violation',
    description: 'Landscaping compliance notices - Batch December',
    created: new Date('2024-12-10T08:45:22'),
    status: 'completed',
    sentDate: new Date('2024-12-10T09:30:00'),
    deliveredDate: new Date('2024-12-13T14:20:00'),
    sendCertified: true
  }
];

// Service to manage print queue
class PrintQueueService {
  private printJobs: PrintJob[] = [...mockPrintJobs];

  // Get all print jobs
  getAllJobs(): PrintJob[] {
    return this.printJobs;
  }

  // Get jobs by category
  getJobsByCategory(category: PrintCategory): PrintJob[] {
    return this.printJobs.filter(job => job.category === category);
  }

  // Get jobs by association
  getJobsByAssociation(associationId: string): PrintJob[] {
    return this.printJobs.filter(job => job.associationId === associationId);
  }

  // Add a new print job
  addJob(job: Omit<PrintJob, 'id'>): PrintJob {
    const newJob: PrintJob = {
      ...job,
      id: uuidv4()
    };
    this.printJobs.push(newJob);
    return newJob;
  }

  // Update a print job
  updateJob(id: string, updates: Partial<PrintJob>): PrintJob | null {
    const index = this.printJobs.findIndex(job => job.id === id);
    if (index === -1) return null;
    
    this.printJobs[index] = { ...this.printJobs[index], ...updates };
    return this.printJobs[index];
  }

  // Delete a print job
  deleteJob(id: string): boolean {
    const initialLength = this.printJobs.length;
    this.printJobs = this.printJobs.filter(job => job.id !== id);
    return this.printJobs.length < initialLength;
  }

  // Send jobs to HOA Mailers
  sendToHOAMailers(jobIds: string[]): { success: boolean; sentJobs: PrintJob[] } {
    const sentJobs: PrintJob[] = [];
    
    jobIds.forEach(id => {
      const job = this.printJobs.find(job => job.id === id);
      if (job && job.status === 'pending') {
        job.status = 'sent';
        job.sentDate = new Date();
        sentJobs.push(job);
      }
    });
    
    return {
      success: sentJobs.length > 0,
      sentJobs
    };
  }
}

export const printQueueService = new PrintQueueService();
