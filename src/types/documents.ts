
export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  url: string;
  size: number;
  fileType: string;
  uploadedDate: string;
  uploadedBy?: string;
  lastModified?: string;
  description?: string;
  category?: string;
  version?: string;
  tags?: Tag[];
  isPublic?: boolean;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  icon?: React.ComponentType; // Added to fix type errors
  color?: string; // Added to fix type errors
}
