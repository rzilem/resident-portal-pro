
import { ReactNode, ComponentType } from 'react';

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  url: string;
  size?: number; // Make size optional but prefer using fileSize for consistency
  fileSize?: number; // Added for backward compatibility
  fileType: string;
  uploadedDate: string;
  uploadedBy?: string;
  lastModified?: string;
  description?: string;
  category?: string;
  version?: string | number;
  tags?: string[] | Tag[];
  isPublic?: boolean;
  isArchived?: boolean;
  previousVersions?: DocumentVersion[];
  expirationDate?: string;
  accessLevel?: DocumentAccessLevel;
  properties?: string[];
  associations?: string[];
  metadata?: Record<string, any>;
}

export interface DocumentVersion {
  version: number;
  url: string;
  lastModified: string;
  modifiedBy: string;
  fileSize?: number;
  size?: number;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  icon?: ComponentType; 
  color?: string;
  parent?: string;
  isRestricted?: boolean;
  requiredPermission?: string;
  sortOrder?: number;
  accessLevel?: DocumentAccessLevel;
  // For compatibility with dropdown selectors
  value?: string;
  label?: string;
}

export type DocumentAccessLevel = 'all' | 'homeowner' | 'board' | 'management' | 'admin';

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

export interface DocumentStats {
  totalCount: number;
  sizeByCategory: Record<string, number>;
  countByType: Record<string, number>;
  uploadsByMonth: Record<string, number>;
  topTags: { tag: string; count: number }[];
}

export interface DocumentViewerConfig {
  showToolbar?: boolean;
  canDownload?: boolean;
  canPrint?: boolean;
  canAnnotate?: boolean;
  canShare?: boolean;
  highlightSearch?: boolean;
  fullscreenEnabled?: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  content: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface DocumentUploadOptions {
  description?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}
