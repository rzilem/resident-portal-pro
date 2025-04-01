
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ColumnMapping } from './mapping/types';

interface ImportedData {
  records: Record<string, any>[];
  mappings: ColumnMapping[];
  fileName: string;
  importType: string;
}

interface ImportResult {
  success: boolean;
  recordsImported: number;
  recordsWithWarnings: number;
  recordsWithErrors: number;
  errorMessage?: string;
}

/**
 * Transform imported data based on column mappings
 */
export const transformImportedData = (
  records: Record<string, any>[],
  mappings: ColumnMapping[]
): Record<string, any>[] => {
  return records.map(record => {
    const transformedRecord: Record<string, any> = {};
    
    // Apply mappings to transform source fields to target fields
    mappings.forEach(mapping => {
      if (mapping.targetField && mapping.targetField !== 'ignore') {
        transformedRecord[mapping.targetField] = record[mapping.sourceField];
      }
    });
    
    return transformedRecord;
  });
};

/**
 * Process association data and save to database
 */
export const saveAssociationData = async (
  data: Record<string, any>[]
): Promise<ImportResult> => {
  try {
    console.log('Saving association data:', data.length, 'records');
    
    let successCount = 0;
    let warningsCount = 0;
    
    for (const associationData of data) {
      // Prepare association record
      const association = {
        name: associationData.association_name || associationData.name,
        address: associationData.address || associationData.location,
        city: associationData.city,
        state: associationData.state,
        zip: associationData.zip,
        contact_phone: associationData.contact_phone || associationData.phone,
        contact_email: associationData.contact_email || associationData.email,
        contact_website: associationData.contact_website || associationData.website,
        founded_date: associationData.founded_date || associationData.onboarding_date,
        units: associationData.units || associationData.total_units,
        type: associationData.type || associationData.association_type || 'hoa',
        status: associationData.status || 'active'
      };
      
      console.log('Inserting association:', association);
      
      // Insert association
      const { data: newAssociation, error } = await supabase
        .from('associations')
        .insert(association)
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting association:', error);
        warningsCount++;
        continue;
      }
      
      // Insert association settings if applicable
      if (newAssociation) {
        const settings = {
          association_id: newAssociation.id,
          settings: {
            fiscalYearStart: associationData.fiscal_year_start || '01-01',
            feesFrequency: associationData.assessment_frequency || associationData.fees_frequency || 'monthly',
            annualFees: associationData.annual_fees || null,
            taxId: associationData.tax_id || null,
            county: associationData.county || null,
            hasPool: (associationData.has_pool === 'Yes' || associationData.has_pool === true),
            hasGate: (associationData.has_gate === 'Yes' || associationData.has_gate === true),
            hasPedestrianGate: (associationData.has_pedestrian_gate === 'Yes' || associationData.has_pedestrian_gate === true),
            offsiteAddresses: associationData.offsite_addresses || null,
            leases: associationData.leases || null,
            serviceType: associationData.service_type || null
          }
        };
        
        const { error: settingsError } = await supabase
          .from('association_settings')
          .insert(settings);
        
        if (settingsError) {
          console.error('Error saving association settings:', settingsError);
          // Don't count this as a failure, just a warning
          warningsCount++;
        }
      }
      
      successCount++;
    }
    
    return {
      success: true,
      recordsImported: successCount,
      recordsWithWarnings: warningsCount,
      recordsWithErrors: data.length - successCount
    };
  } catch (error) {
    console.error('Error saving association data:', error);
    return {
      success: false,
      recordsImported: 0,
      recordsWithWarnings: 0,
      recordsWithErrors: data.length,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Process property data and save to database
 */
export const savePropertyData = async (
  data: Record<string, any>[]
): Promise<ImportResult> => {
  try {
    console.log('Saving property data:', data.length, 'records');
    
    let successCount = 0;
    let warningsCount = 0;
    
    for (const propertyData of data) {
      // First, find the association this property belongs to
      let associationId: string | null = null;
      
      if (propertyData.association_name) {
        const { data: associationData } = await supabase
          .from('associations')
          .select('id')
          .ilike('name', propertyData.association_name)
          .maybeSingle();
        
        if (associationData) {
          associationId = associationData.id;
        }
      }
      
      // Prepare property record
      const property = {
        association_id: associationId,
        address: propertyData.property_address || propertyData.address,
        unit_number: propertyData.unit_number,
        city: propertyData.city,
        state: propertyData.state,
        zip: propertyData.zip,
        property_type: propertyData.property_type,
        bedrooms: propertyData.unit_bedrooms,
        bathrooms: propertyData.unit_bathrooms,
        square_feet: propertyData.unit_square_feet
      };
      
      // Insert property
      const { data: newProperty, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting property:', error);
        warningsCount++;
        continue;
      }
      
      successCount++;
    }
    
    return {
      success: true,
      recordsImported: successCount,
      recordsWithWarnings: warningsCount,
      recordsWithErrors: data.length - successCount
    };
  } catch (error) {
    console.error('Error saving property data:', error);
    return {
      success: false,
      recordsImported: 0,
      recordsWithWarnings: 0,
      recordsWithErrors: data.length,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Process resident data and save to database
 */
export const saveResidentData = async (
  data: Record<string, any>[]
): Promise<ImportResult> => {
  try {
    console.log('Saving resident data:', data.length, 'records');
    
    let successCount = 0;
    let warningsCount = 0;
    
    // First check if we have the resident_profiles table (preferred approach)
    const { error: checkError } = await supabase
      .from('resident_profiles')
      .select('id')
      .limit(1);
      
    if (!checkError) {
      // Use resident_profiles table (primary target)
      for (const residentData of data) {
        try {
          const resident = {
            first_name: residentData.homeowner_first_name || residentData.first_name,
            last_name: residentData.homeowner_last_name || residentData.last_name,
            email: residentData.homeowner_email || residentData.email,
            phone: residentData.phone || residentData.homeowner_phone,
            unit: residentData.unit_number || residentData.unit,
            property: residentData.property_name || residentData.property,
            status: residentData.status || 'active',
            move_in_date: residentData.move_in_date ? new Date(residentData.move_in_date) : new Date(),
            move_out_date: residentData.move_out_date ? new Date(residentData.move_out_date) : null,
            mailing_address: residentData.mailing_address,
            property_address: residentData.property_address,
            balance: parseFloat(residentData.balance || '0'),
            payment_preference: residentData.payment_preference
          };
          
          // Get user_id from session if available
          const { data: sessionData } = await supabase.auth.getSession();
          const userId = sessionData.session?.user?.id;
          
          const { error } = await supabase
            .from('resident_profiles')
            .insert({
              ...resident,
              user_id: userId
            });
            
          if (error) {
            console.error('Error inserting resident:', error);
            warningsCount++;
            continue;
          }
          
          successCount++;
        } catch (error) {
          console.error('Error processing resident data:', error);
          warningsCount++;
        }
      }
      
      return {
        success: true,
        recordsImported: successCount,
        recordsWithWarnings: warningsCount,
        recordsWithErrors: data.length - successCount - warningsCount
      };
    }
    
    // Fall back to legacy implementation if resident_profiles doesn't exist
    for (const residentData of data) {
      // First, find the property this resident belongs to
      let propertyId: string | null = null;
      
      if (residentData.property_address) {
        const { data: propertyData } = await supabase
          .from('properties')
          .select('id')
          .ilike('address', residentData.property_address)
          .eq('unit_number', residentData.unit_number || '')
          .maybeSingle();
        
        if (propertyData) {
          propertyId = propertyData.id;
        } else if (residentData.property_address) {
          // Create property if not found
          const { data: newProperty, error: propertyError } = await supabase
            .from('properties')
            .insert({
              address: residentData.property_address,
              unit_number: residentData.unit_number || '',
              city: residentData.city,
              state: residentData.state,
              zip: residentData.zip
            })
            .select()
            .single();
            
          if (propertyError) {
            console.error('Error creating property:', propertyError);
            warningsCount++;
          } else if (newProperty) {
            propertyId = newProperty.id;
          }
        }
      }
      
      // First check if user exists in auth system
      let userId: string | null = null;
      
      if (residentData.homeowner_email) {
        // Check if user exists by email in public.profiles instead of auth.users
        const { data: userData } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', residentData.homeowner_email)
          .maybeSingle();
        
        if (userData) {
          userId = userData.id;
          console.log('Found existing user with ID:', userId);
        } else {
          // Create a new profile for this user
          const newUserId = crypto.randomUUID();
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: newUserId,
              email: residentData.homeowner_email,
              first_name: residentData.homeowner_first_name,
              last_name: residentData.homeowner_last_name,
              role: 'resident'
            });
            
          if (profileError) {
            console.error('Error creating user profile:', profileError);
            warningsCount++;
            continue;
          }
          
          userId = newUserId;
          console.log('Created new user profile with ID:', userId);
        }
      }
      
      // Prepare resident record
      const resident = {
        property_id: propertyId,
        user_id: userId,
        resident_type: residentData.resident_type || 'owner',
        is_primary: true,
        move_in_date: residentData.move_in_date || new Date().toISOString()
      };
      
      // Insert resident
      const { error } = await supabase
        .from('residents')
        .insert(resident);
      
      if (error) {
        console.error('Error inserting resident:', error);
        warningsCount++;
        continue;
      }
      
      successCount++;
    }
    
    return {
      success: true,
      recordsImported: successCount,
      recordsWithWarnings: warningsCount,
      recordsWithErrors: data.length - successCount
    };
  } catch (error) {
    console.error('Error saving resident data:', error);
    return {
      success: false,
      recordsImported: 0,
      recordsWithWarnings: 0,
      recordsWithErrors: data.length,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Save import log to database - temporarily disabled until we create the table
 */
export const saveImportLog = async (
  importData: ImportedData,
  result: ImportResult
): Promise<void> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      console.error('No authenticated user found');
      return;
    }
    
    // Log import details to console instead of database for now
    console.log('Import log:', {
      user_id: userId,
      file_name: importData.fileName,
      import_type: importData.importType,
      record_count: importData.records.length,
      successful_count: result.recordsImported,
      warnings_count: result.recordsWithWarnings,
      errors_count: result.recordsWithErrors,
      status: result.success ? 'completed' : 'failed'
    });
    
    // Uncomment this when import_logs table is created
    /*
    const { error } = await supabase
      .from('import_logs')
      .insert(importLog);
    
    if (error) {
      console.error('Error saving import log:', error);
    }
    */
  } catch (error) {
    console.error('Error in saveImportLog:', error);
  }
};

/**
 * Import data based on type
 */
export const importData = async (importData: ImportedData): Promise<ImportResult> => {
  try {
    console.log('Importing data of type:', importData.importType);
    
    // Transform the data based on mappings
    const transformedData = transformImportedData(importData.records, importData.mappings);
    
    let result: ImportResult;
    
    // Process data based on import type
    switch (importData.importType) {
      case 'association':
        result = await saveAssociationData(transformedData);
        break;
      case 'property':
        result = await savePropertyData(transformedData);
        break;
      case 'resident':
        result = await saveResidentData(transformedData);
        break;
      default:
        result = {
          success: false,
          recordsImported: 0,
          recordsWithWarnings: 0,
          recordsWithErrors: importData.records.length,
          errorMessage: `Unknown import type: ${importData.importType}`
        };
    }
    
    // Save import log
    await saveImportLog(importData, result);
    
    return result;
  } catch (error) {
    console.error('Error in importData:', error);
    return {
      success: false,
      recordsImported: 0,
      recordsWithWarnings: 0,
      recordsWithErrors: 0,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
