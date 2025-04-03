
export interface DocumentFile {
  id: string;
  name: string;
  description?: string;
  fileSize: number;
  fileType: string;
  url: string;
  category: string;
  tags?: string[];
  uploadedBy?: string;
  uploadedDate: string;
  lastModified?: string;
  version?: number;
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
}

export interface DocumentCategory {
  id: string;
  name: string;
  parent?: string;
  description?: string;
  isRestricted?: boolean;
  requiredPermission?: string;
  sortOrder?: number;
  accessLevel?: DocumentAccessLevel;
  icon?: string;
  color?: string;
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
