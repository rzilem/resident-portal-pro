
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sampleReportDataService } from "./SampleReportDataService";

export interface ReportDataPayload {
  association_id: string;
  report_type: string;
  report_category: string;
  time_range: string;
  data: any;
}

class ReportDataService {
  /**
   * Fetch report data from Supabase
   */
  async getReportData(
    reportType: string,
    associationId: string,
    timeRange: string = 'month',
    reportCategory: string = 'financial'
  ): Promise<any> {
    try {
      console.log(`Fetching report data for ${reportType} in ${associationId}`);
      
      // If association is 'all', return sample data for now
      if (associationId === 'all') {
        return sampleReportDataService.getFinancialData(reportType, associationId);
      }
      
      const { data, error } = await supabase
        .from('report_data')
        .select('*')
        .eq('report_type', reportType)
        .eq('association_id', associationId)
        .eq('time_range', timeRange)
        .eq('report_category', reportCategory)
        .single();
      
      if (error) {
        // If no data found, generate sample data
        if (error.code === 'PGRST116') {
          console.log('No report data found, using sample data instead');
          
          // Get sample data
          const sampleData = sampleReportDataService.getFinancialData(reportType, associationId);
          
          // Store it for future use if it's a valid association
          if (associationId !== 'all') {
            await this.storeReportData({
              association_id: associationId,
              report_type: reportType,
              report_category: reportCategory,
              time_range: timeRange,
              data: sampleData
            });
          }
          
          return sampleData;
        }
        
        console.error('Error fetching report data:', error);
        return null;
      }
      
      return data.data;
    } catch (error) {
      console.error('Unexpected error fetching report data:', error);
      return sampleReportDataService.getFinancialData(reportType, associationId);
    }
  }
  
  /**
   * Store report data in Supabase
   */
  async storeReportData(payload: ReportDataPayload): Promise<boolean> {
    try {
      // Check if record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('report_data')
        .select('id')
        .eq('report_type', payload.report_type)
        .eq('association_id', payload.association_id)
        .eq('time_range', payload.time_range)
        .eq('report_category', payload.report_category)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing report data:', checkError);
        return false;
      }
      
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('report_data')
          .update({ data: payload.data })
          .eq('id', existingData.id);
        
        if (updateError) {
          console.error('Error updating report data:', updateError);
          return false;
        }
        
        return true;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('report_data')
          .insert([payload]);
        
        if (insertError) {
          console.error('Error storing report data:', insertError);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error('Unexpected error storing report data:', error);
      return false;
    }
  }
  
  /**
   * Upload a report attachment to storage
   */
  async uploadReportAttachment(
    reportId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string } | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${reportId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('report_attachments')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading report attachment:', error);
        toast.error('Failed to upload attachment. Please try again.');
        return null;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('report_attachments')
        .getPublicUrl(data.path);
      
      return { url: publicUrlData.publicUrl };
    } catch (error) {
      console.error('Unexpected error uploading report attachment:', error);
      toast.error('An unexpected error occurred. Please try again.');
      return null;
    }
  }
  
  /**
   * Seed initial report data for an association
   */
  async seedInitialReportData(associationId: string): Promise<boolean> {
    try {
      console.log(`Seeding initial report data for association ${associationId}`);
      
      // Get list of report types to seed
      const reportTypes = [
        { type: 'income-expense', category: 'financial' },
        { type: 'bank-balances', category: 'financial' },
        { type: 'cash-flow', category: 'financial' },
        { type: 'cash-forecast', category: 'financial' },
        { type: 'admin-billing', category: 'financial' },
        { type: 'billing-report', category: 'financial' },
        { type: 'balance', category: 'financial' },
        { type: 'property-status', category: 'property' },
        { type: 'maintenance-history', category: 'property' },
        { type: 'resident-demographics', category: 'resident' },
        { type: 'resident-activity', category: 'resident' }
      ];
      
      // Seed each report type
      for (const { type, category } of reportTypes) {
        // Generate sample data
        const sampleData = sampleReportDataService.getFinancialData(type, associationId);
        
        // Store it
        await this.storeReportData({
          association_id: associationId,
          report_type: type,
          report_category: category,
          time_range: 'month',
          data: sampleData
        });
      }
      
      console.log('Successfully seeded initial report data');
      return true;
    } catch (error) {
      console.error('Error seeding initial report data:', error);
      return false;
    }
  }
}

export const reportDataService = new ReportDataService();
