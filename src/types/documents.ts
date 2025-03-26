
export interface DocumentCategory {
  id: string;
  name: string;
  parent?: string;
  description?: string;
  isRestricted?: boolean;
  requiredPermission?: string;
  sortOrder?: number;
}

export interface DocumentFile {
  id: string;
  name: string;
  description?: string;
  fileSize: number;
  fileType: string;
  url: string;
  category: string;
  tags?: string[];
  uploadedBy: string;
  uploadedDate: string;
  lastModified?: string;
  version: number;
  previousVersions?: {
    version: number;
    url: string;
    lastModified: string;
    modifiedBy: string;
  }[];
  expirationDate?: string;
  isPublic: boolean;
  isArchived: boolean;
  properties?: string[];
  associations?: string[];
  metadata?: Record<string, any>;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  content: string;
  createdBy: string;
  createdDate: string;
  lastModified?: string;
  lastModifiedBy?: string;
  version: number;
  previousVersions?: {
    version: number;
    content: string;
    lastModified: string;
    modifiedBy: string;
  }[];
  isActive: boolean;
  usageCount: number;
  lastUsed?: string;
  mergeTags?: string[];
  associationId?: string;
}

export interface DocumentPermission {
  documentId: string;
  roleId: string;
  permissions: {
    view: boolean;
    download: boolean;
    edit: boolean;
    delete: boolean;
    share: boolean;
  };
}

export interface DocumentSearchFilters {
  query?: string;
  categories?: string[];
  fileTypes?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  uploadedBy?: string[];
  tags?: string[];
  associations?: string[];
  properties?: string[];
  isPublic?: boolean;
  isArchived?: boolean;
}
