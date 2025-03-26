
import { DocumentFile, DocumentCategory, DocumentSearchFilters } from '@/types/documents';

// Sample document data for development purposes
const mockDocuments: DocumentFile[] = [
  {
    id: "doc-001",
    name: "Annual Budget 2023.pdf",
    description: "Financial budget for the 2023 fiscal year",
    fileSize: 1243000,
    fileType: "application/pdf",
    url: "/mock-documents/budget.pdf",
    category: "financial",
    tags: ["budget", "2023", "financial"],
    uploadedBy: "admin-user",
    uploadedDate: "2023-01-15T10:30:00Z",
    lastModified: "2023-01-15T10:30:00Z",
    version: 1,
    isPublic: true,
    isArchived: false,
    associations: ["assoc-001", "assoc-002"]
  },
  {
    id: "doc-002",
    name: "CC&Rs.pdf",
    description: "Covenants, Conditions & Restrictions document",
    fileSize: 3560000,
    fileType: "application/pdf",
    url: "/mock-documents/ccr.pdf",
    category: "governing",
    tags: ["legal", "governing", "rules"],
    uploadedBy: "admin-user",
    uploadedDate: "2022-05-10T09:15:00Z",
    lastModified: "2022-05-10T09:15:00Z",
    version: 1,
    isPublic: true,
    isArchived: false,
    associations: ["assoc-001"]
  },
  {
    id: "doc-003",
    name: "Meeting Minutes - January.docx",
    description: "Board meeting minutes from January 2023",
    fileSize: 450000,
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    url: "/mock-documents/minutes.docx",
    category: "meetings",
    tags: ["meeting", "minutes", "board", "2023"],
    uploadedBy: "board-secretary",
    uploadedDate: "2023-02-05T14:20:00Z",
    lastModified: "2023-02-05T14:20:00Z",
    version: 1,
    isPublic: false,
    isArchived: false,
    associations: ["assoc-001"]
  },
  {
    id: "doc-004",
    name: "Insurance Policy 2023-2024.pdf",
    description: "Association insurance policy document",
    fileSize: 2780000,
    fileType: "application/pdf",
    url: "/mock-documents/insurance.pdf",
    category: "legal",
    tags: ["insurance", "policy", "legal"],
    uploadedBy: "admin-user",
    uploadedDate: "2023-03-01T11:45:00Z",
    lastModified: "2023-03-01T11:45:00Z",
    version: 1,
    isPublic: true,
    isArchived: false,
    associations: ["assoc-001", "assoc-003"]
  },
  {
    id: "doc-005",
    name: "Pool Rules.pdf",
    description: "Rules for using the community pool",
    fileSize: 320000,
    fileType: "application/pdf",
    url: "/mock-documents/pool.pdf",
    category: "rules",
    tags: ["pool", "rules", "amenities"],
    uploadedBy: "admin-user",
    uploadedDate: "2023-04-15T10:00:00Z",
    lastModified: "2023-05-10T09:30:00Z",
    version: 2,
    previousVersions: [
      {
        version: 1,
        url: "/mock-documents/pool-v1.pdf",
        lastModified: "2023-04-15T10:00:00Z",
        modifiedBy: "admin-user"
      }
    ],
    isPublic: true,
    isArchived: false,
    associations: ["assoc-002"]
  },
  {
    id: "doc-006",
    name: "Vendor Contract - Landscaping.pdf",
    description: "Service contract with landscaping company",
    fileSize: 1650000,
    fileType: "application/pdf",
    url: "/mock-documents/contract.pdf",
    category: "contracts",
    tags: ["vendor", "contract", "landscaping", "maintenance"],
    uploadedBy: "property-manager",
    uploadedDate: "2023-05-20T13:10:00Z",
    lastModified: "2023-05-20T13:10:00Z",
    version: 1,
    expirationDate: "2024-05-19",
    isPublic: false,
    isArchived: false,
    associations: ["assoc-001", "assoc-002"]
  }
];

// Sample document categories for development
const mockCategories: DocumentCategory[] = [
  {
    id: "financial",
    name: "Financial Documents",
    description: "Budgets, financial statements, and other financial records",
    sortOrder: 1
  },
  {
    id: "governing",
    name: "Governing Documents",
    description: "Bylaws, CC&Rs, and other governing documents",
    sortOrder: 2
  },
  {
    id: "meetings",
    name: "Meeting Documents",
    description: "Meeting minutes, agendas, and related documents",
    sortOrder: 3
  },
  {
    id: "legal",
    name: "Legal Documents",
    description: "Insurance policies, legal notices, and other legal documents",
    sortOrder: 4
  },
  {
    id: "rules",
    name: "Rules & Regulations",
    description: "Community rules and regulations documents",
    sortOrder: 5
  },
  {
    id: "contracts",
    name: "Contracts & Agreements",
    description: "Service contracts and other agreements",
    sortOrder: 6,
    isRestricted: true,
    requiredPermission: "admin"
  },
  {
    id: "communications",
    name: "Communications",
    description: "Newsletters, announcements, and other communications",
    sortOrder: 7
  }
];

// Get documents from a mock database
export const getDocuments = async (
  filters?: DocumentSearchFilters,
  associationId?: string
): Promise<DocumentFile[]> => {
  let filteredDocs = [...mockDocuments];
  
  // Filter by association if provided
  if (associationId) {
    filteredDocs = filteredDocs.filter(doc => 
      doc.associations?.includes(associationId)
    );
  }
  
  // Apply additional filters if provided
  if (filters) {
    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => 
        doc.name.toLowerCase().includes(query) || 
        doc.description?.toLowerCase().includes(query) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filteredDocs = filteredDocs.filter(doc => 
        filters.categories?.includes(doc.category)
      );
    }
    
    // Filter by file types
    if (filters.fileTypes && filters.fileTypes.length > 0) {
      filteredDocs = filteredDocs.filter(doc => 
        filters.fileTypes?.includes(doc.fileType)
      );
    }
    
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.tags?.some(tag => filters.tags?.includes(tag))
      );
    }
    
    // Filter by public/archived status
    if (filters.isPublic !== undefined) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.isPublic === filters.isPublic
      );
    }
    
    if (filters.isArchived !== undefined) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.isArchived === filters.isArchived
      );
    }
  }
  
  return filteredDocs;
};

// Get document categories
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  return mockCategories;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on file type
export const getFileTypeIcon = (fileType: string): string => {
  if (fileType.includes('pdf')) return 'pdf';
  if (fileType.includes('word') || fileType.includes('docx')) return 'word';
  if (fileType.includes('excel') || fileType.includes('xlsx')) return 'excel';
  if (fileType.includes('powerpoint') || fileType.includes('pptx')) return 'powerpoint';
  if (fileType.includes('image')) return 'image';
  if (fileType.includes('video')) return 'video';
  if (fileType.includes('audio')) return 'audio';
  if (fileType.includes('zip') || fileType.includes('rar')) return 'archive';
  
  return 'generic';
};

// Get document by ID
export const getDocumentById = async (documentId: string): Promise<DocumentFile | undefined> => {
  return mockDocuments.find(doc => doc.id === documentId);
};
