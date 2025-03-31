
import { supabase } from "@/integrations/supabase/client";

// Types for reports
export interface ReportData {
  id: string;
  name: string;
  description: string;
  type: string;
  format: string;
  createdAt: Date;
  downloadUrl?: string;
}

export interface DocumentData {
  id: string;
  name: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedDate: Date;
  downloadUrl: string;
  version?: number;
}

export interface DatabaseRecordStats {
  totalRecords: number;
  updatedToday: number;
  recordTypes: { name: string; count: number }[];
}

/**
 * Service for handling reports and documents functionality
 */
class ReportsService {
  /**
   * Fetches available reports based on type
   */
  async getReports(type: string = 'all'): Promise<ReportData[]> {
    try {
      // In real implementation, this would fetch from API
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('category', 'reports')
        .order('uploaded_date', { ascending: false });

      if (error) throw error;

      // Transform to our format
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        type: item.file_type.split('/')[0],
        format: item.file_type.split('/')[1] || 'pdf',
        createdAt: new Date(item.uploaded_date),
        downloadUrl: item.url
      }));
    } catch (error) {
      console.error("Error fetching reports:", error);
      return [];
    }
  }

  /**
   * Fetches documents by category
   */
  async getDocuments(category: string = 'association'): Promise<DocumentData[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('category', category)
        .order('uploaded_date', { ascending: false });

      if (error) throw error;

      // Transform to our format
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: item.category,
        fileType: item.file_type,
        fileSize: item.file_size,
        uploadedBy: item.uploaded_by,
        uploadedDate: new Date(item.uploaded_date),
        downloadUrl: item.url,
        version: item.version
      }));
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  }

  /**
   * Downloads a document or report
   */
  async downloadDocument(id: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('url')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data?.url || null;
    } catch (error) {
      console.error("Error downloading document:", error);
      return null;
    }
  }

  /**
   * Gets database record statistics
   */
  async getDatabaseStats(): Promise<DatabaseRecordStats> {
    try {
      // In a real implementation, this would be fetched from the API
      // Currently using mock data
      return {
        totalRecords: 5843,
        updatedToday: 124,
        recordTypes: [
          { name: 'Residents', count: 2340 },
          { name: 'Properties', count: 1976 },
          { name: 'Associations', count: 42 },
          { name: 'Vendors', count: 185 },
          { name: 'Other', count: 1300 }
        ]
      };
    } catch (error) {
      console.error("Error fetching database stats:", error);
      return {
        totalRecords: 0,
        updatedToday: 0,
        recordTypes: []
      };
    }
  }

  /**
   * Generates a new report
   */
  async generateReport(reportType: string, parameters: any): Promise<{ success: boolean; reportId?: string }> {
    try {
      // This would call an API endpoint to generate the report
      // For demo purposes, just return success
      return { success: true, reportId: `report-${Date.now()}` };
    } catch (error) {
      console.error("Error generating report:", error);
      return { success: false };
    }
  }

  /**
   * Export database records to a file
   */
  async exportDatabaseRecords(format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<{ success: boolean; downloadUrl?: string }> {
    try {
      // This would call an API endpoint to generate the export
      // For demo purposes, just return success with a mock download URL
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const downloadUrl = `/exports/records-export-${timestamp}.${format}`;
      
      return { success: true, downloadUrl };
    } catch (error) {
      console.error("Error exporting records:", error);
      return { success: false };
    }
  }
}

export const reportsService = new ReportsService();
