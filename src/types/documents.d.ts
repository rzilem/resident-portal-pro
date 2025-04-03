
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
}
