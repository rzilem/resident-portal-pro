
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

/**
 * Upload a document to the Supabase storage
 * @param file The file to upload
 * @param category The document category
 * @param description Optional description
 * @param path Custom path within the bucket
 * @returns Object with success status and optional error message
 */
export const uploadToStorage = async ({
  file,
  category,
  description = '',
  path,
}: {
  file: File;
  category: string;
  description?: string;
  path?: string;
}) => {
  try {
    const filePath = path || `${category}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }
    
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path);
    
    return { 
      success: true, 
      path: data.path,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown upload error' 
    };
  }
};

/**
 * Process an Excel or CSV file and extract the data
 * @param file The Excel or CSV file
 * @returns Object with headers and data rows
 */
export const processSpreadsheetFile = async (file: File) => {
  try {
    console.log("Processing spreadsheet file:", file.name);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    
    // Get the first worksheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === 0) {
      throw new Error("The spreadsheet appears to be empty");
    }
    
    // Extract headers (first row)
    const headers = jsonData[0] as string[];
    console.log("Extracted headers:", headers);
    
    // Extract data rows (excluding header row)
    const rows = jsonData.slice(1).map(row => {
      const rowData: Record<string, any> = {};
      (row as any[]).forEach((cell, index) => {
        if (index < headers.length) {
          rowData[headers[index]] = cell;
        }
      });
      return rowData;
    });
    
    console.log("File processed successfully", { headers, rowCount: rows.length });
    return { headers, rows, success: true };
  } catch (error) {
    console.error('File processing error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown file processing error',
      headers: [],
      rows: []
    };
  }
};

/**
 * Save imported data to Supabase database
 * @param mappedData Mapped data with correct field names
 * @returns Object with success status and results
 */
export const saveImportedData = async (
  data: Record<string, any>[],
  mappings: { sourceField: string; targetField: string }[]
) => {
  try {
    // This function prepares the data and would save it to Supabase in a real implementation
    console.log("Would save data to database:", { recordCount: data.length });
    
    // Transform the data based on mappings
    const transformedData = data.map(row => {
      const newRow: Record<string, any> = {};
      
      mappings.forEach(mapping => {
        if (mapping.targetField && mapping.targetField !== 'ignore') {
          newRow[mapping.targetField] = row[mapping.sourceField];
        }
      });
      
      return newRow;
    });
    
    // Here we would actually insert the data to the database
    // For demo purposes, we'll just return success
    return {
      success: true,
      recordsImported: data.length,
      recordsWithWarnings: 0
    };
  } catch (error) {
    console.error("Error saving imported data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error saving data"
    };
  }
};

/**
 * Get available document categories
 * @returns Array of category names
 */
export const getDocumentCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('name')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching document categories:', error);
      return ['uncategorized', 'imports', 'templates', 'reports'];
    }
    
    if (data && data.length > 0) {
      return data.map(category => category.name);
    }
    
    // Default categories if none found
    return ['uncategorized', 'imports', 'templates', 'reports'];
  } catch (error) {
    console.error('Exception fetching document categories:', error);
    return ['uncategorized', 'imports', 'templates', 'reports'];
  }
};
