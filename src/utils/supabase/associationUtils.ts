
import { supabase } from "@/integrations/supabase/client";
import { Association, AssociationSettings } from "@/types/association";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

/**
 * Fetch all associations from Supabase
 */
export const fetchAssociations = async (): Promise<Association[]> => {
  try {
    const { data, error } = await supabase
      .from('associations')
      .select(`
        *,
        association_settings(settings)
      `)
      .order('name');
    
    if (error) throw error;
    
    // Transform the returned data to match our Association type
    return data.map(item => ({
      id: item.id,
      name: item.name,
      address: {
        street: item.address || '',
        city: item.city || '',
        state: item.state || '',
        zipCode: item.zip || '',
        country: item.country || 'USA',
      },
      contactInfo: {
        email: item.contact_email || '',
        phone: item.contact_phone || '',
        website: item.contact_website || '',
      },
      type: (item.type as "hoa" | "condo" | "coop" | "other") || 'hoa',
      foundedDate: item.founded_date || new Date().toISOString().split('T')[0],
      units: item.units || 0,
      status: (item.status as "active" | "inactive") || 'active',
      settings: item.association_settings?.settings 
        ? (item.association_settings.settings as unknown as AssociationSettings) 
        : createDefaultSettings(),
    }));
  } catch (error) {
    console.error('Error fetching associations:', error);
    toast.error('Failed to fetch associations');
    return [];
  }
};

/**
 * Create a new association in Supabase
 */
export const createSupabaseAssociation = async (association: Omit<Association, 'id'>): Promise<Association | null> => {
  try {
    // Extract data for the associations table
    const associationData = {
      name: association.name,
      address: association.address.street,
      city: association.address.city,
      state: association.address.state,
      zip: association.address.zipCode,
      country: association.address.country,
      contact_email: association.contactInfo.email,
      contact_phone: association.contactInfo.phone,
      contact_website: association.contactInfo.website,
      type: association.type,
      founded_date: association.foundedDate,
      units: association.units,
      status: association.status,
    };

    // Insert association record
    const { data: newAssociation, error } = await supabase
      .from('associations')
      .insert(associationData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Insert settings
    if (newAssociation) {
      const settingsObj = association.settings || createDefaultSettings();
      const { error: settingsError } = await supabase
        .from('association_settings')
        .insert({
          association_id: newAssociation.id,
          settings: settingsObj as unknown as Json
        });
      
      if (settingsError) throw settingsError;
    }
    
    // Return full association object
    return {
      id: newAssociation.id,
      name: newAssociation.name,
      address: {
        street: newAssociation.address || '',
        city: newAssociation.city || '',
        state: newAssociation.state || '',
        zipCode: newAssociation.zip || '',
        country: newAssociation.country || 'USA',
      },
      contactInfo: {
        email: newAssociation.contact_email || '',
        phone: newAssociation.contact_phone || '',
        website: newAssociation.contact_website || '',
      },
      type: (newAssociation.type as "hoa" | "condo" | "coop" | "other") || 'hoa',
      foundedDate: newAssociation.founded_date || new Date().toISOString().split('T')[0],
      units: newAssociation.units || 0,
      status: (newAssociation.status as "active" | "inactive") || 'active',
      settings: association.settings || createDefaultSettings(),
    };
  } catch (error) {
    console.error('Error creating association:', error);
    toast.error('Failed to create association');
    return null;
  }
};

/**
 * Update an existing association in Supabase
 */
export const updateSupabaseAssociation = async (id: string, updates: Partial<Association>): Promise<Association | null> => {
  try {
    // Extract data for the associations table
    const associationData: any = {};
    
    if (updates.name) associationData.name = updates.name;
    if (updates.address) {
      associationData.address = updates.address.street;
      associationData.city = updates.address.city;
      associationData.state = updates.address.state;
      associationData.zip = updates.address.zipCode;
      associationData.country = updates.address.country;
    }
    if (updates.contactInfo) {
      associationData.contact_email = updates.contactInfo.email;
      associationData.contact_phone = updates.contactInfo.phone;
      associationData.contact_website = updates.contactInfo.website;
    }
    if (updates.type) associationData.type = updates.type;
    if (updates.foundedDate) associationData.founded_date = updates.foundedDate;
    if (updates.units) associationData.units = updates.units;
    if (updates.status) associationData.status = updates.status;
    
    // Only update if we have data to update
    if (Object.keys(associationData).length > 0) {
      const { error } = await supabase
        .from('associations')
        .update(associationData)
        .eq('id', id);
      
      if (error) throw error;
    }
    
    // Update settings if provided
    if (updates.settings) {
      // First check if settings record exists
      const { data: existingSettings, error: checkError } = await supabase
        .from('association_settings')
        .select()
        .eq('association_id', id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingSettings) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('association_settings')
          .update({
            settings: updates.settings as unknown as Json,
            updated_at: new Date().toISOString()
          })
          .eq('association_id', id);
        
        if (updateError) throw updateError;
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('association_settings')
          .insert({
            association_id: id,
            settings: updates.settings as unknown as Json
          });
        
        if (insertError) throw insertError;
      }
    }
    
    // Fetch updated association
    const { data: updatedAssociation, error: fetchError } = await supabase
      .from('associations')
      .select(`
        *,
        association_settings(settings)
      `)
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Return updated association
    return {
      id: updatedAssociation.id,
      name: updatedAssociation.name,
      address: {
        street: updatedAssociation.address || '',
        city: updatedAssociation.city || '',
        state: updatedAssociation.state || '',
        zipCode: updatedAssociation.zip || '',
        country: updatedAssociation.country || 'USA',
      },
      contactInfo: {
        email: updatedAssociation.contact_email || '',
        phone: updatedAssociation.contact_phone || '',
        website: updatedAssociation.contact_website || '',
      },
      type: (updatedAssociation.type as "hoa" | "condo" | "coop" | "other") || 'hoa',
      foundedDate: updatedAssociation.founded_date || new Date().toISOString().split('T')[0],
      units: updatedAssociation.units || 0,
      status: (updatedAssociation.status as "active" | "inactive") || 'active',
      settings: updatedAssociation.association_settings?.settings 
        ? (updatedAssociation.association_settings.settings as unknown as AssociationSettings) 
        : createDefaultSettings(),
    };
  } catch (error) {
    console.error('Error updating association:', error);
    toast.error('Failed to update association');
    return null;
  }
};

/**
 * Update a specific setting for an association
 */
export const updateSupabaseAssociationSetting = async (
  id: string,
  settingName: string,
  value: any
): Promise<Association | null> => {
  try {
    // First get current settings
    const { data: currentData, error: fetchError } = await supabase
      .from('association_settings')
      .select('settings')
      .eq('association_id', id)
      .maybeSingle();
    
    if (fetchError) throw fetchError;
    
    // Prepare updated settings
    const currentSettings = currentData?.settings || createDefaultSettings();
    const updatedSettings = {
      ...currentSettings,
      [settingName]: value
    };
    
    // Check if record exists
    if (currentData) {
      // Update settings
      const { error: updateError } = await supabase
        .from('association_settings')
        .update({
          settings: updatedSettings as Json,
          updated_at: new Date().toISOString()
        })
        .eq('association_id', id);
      
      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('association_settings')
        .insert({
          association_id: id,
          settings: updatedSettings as Json
        });
      
      if (insertError) throw insertError;
    }
    
    // Get updated association
    return await getSupabaseAssociationById(id);
  } catch (error) {
    console.error(`Error updating setting ${settingName}:`, error);
    toast.error(`Failed to update ${settingName}`);
    return null;
  }
};

/**
 * Delete an association from Supabase
 */
export const deleteSupabaseAssociation = async (id: string): Promise<boolean> => {
  try {
    // Delete association (will cascade delete settings due to foreign key)
    const { error } = await supabase
      .from('associations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting association:', error);
    toast.error('Failed to delete association');
    return false;
  }
};

/**
 * Set an association as the default
 */
export const setDefaultSupabaseAssociation = async (id: string): Promise<Association[]> => {
  try {
    // First get all associations to update their settings
    const associations = await fetchAssociations();
    
    // Update each association's settings
    for (const association of associations) {
      if (!association.settings) continue;
      
      const isDefault = association.id === id;
      const updatedSettings = {
        ...association.settings,
        isDefault
      };
      
      await updateSupabaseAssociationSetting(association.id, 'isDefault', isDefault);
    }
    
    // Return updated associations
    return await fetchAssociations();
  } catch (error) {
    console.error('Error setting default association:', error);
    toast.error('Failed to set default association');
    return [];
  }
};

/**
 * Toggle an association's status
 */
export const toggleSupabaseAssociationStatus = async (id: string): Promise<Association | null> => {
  try {
    // Get current association
    const association = await getSupabaseAssociationById(id);
    if (!association) throw new Error('Association not found');
    
    // Toggle status
    const newStatus = association.status === 'active' ? 'inactive' : 'active';
    
    // Update status
    const { error } = await supabase
      .from('associations')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) throw error;
    
    // Return updated association
    return await getSupabaseAssociationById(id);
  } catch (error) {
    console.error('Error toggling association status:', error);
    toast.error('Failed to toggle association status');
    return null;
  }
};

/**
 * Get an association by ID
 */
const getSupabaseAssociationById = async (id: string): Promise<Association | null> => {
  try {
    const { data, error } = await supabase
      .from('associations')
      .select(`
        *,
        association_settings(settings)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Transform to our Association type
    return {
      id: data.id,
      name: data.name,
      address: {
        street: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zip || '',
        country: data.country || 'USA',
      },
      contactInfo: {
        email: data.contact_email || '',
        phone: data.contact_phone || '',
        website: data.contact_website || '',
      },
      type: (data.type as "hoa" | "condo" | "coop" | "other") || 'hoa',
      foundedDate: data.founded_date || new Date().toISOString().split('T')[0],
      units: data.units || 0,
      status: (data.status as "active" | "inactive") || 'active',
      settings: data.association_settings?.settings 
        ? (data.association_settings.settings as unknown as AssociationSettings) 
        : createDefaultSettings(),
    };
  } catch (error) {
    console.error('Error fetching association by ID:', error);
    return null;
  }
};

/**
 * Create default settings for a new association
 */
const createDefaultSettings = (): AssociationSettings => {
  return {
    fiscalYearStart: '01-01',
    feesFrequency: 'monthly',
    documents: {
      storageLimit: 1000,
      allowedTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png']
    },
    board: {
      termLength: 24,
      maximumMembers: 7
    },
    communications: {
      emailEnabled: true,
      smsEnabled: true,
      announcementsEnabled: true
    },
    modules: {
      maintenance: true,
      violations: true,
      voting: true,
      accounting: true,
      documents: true,
      calendar: true
    },
    timezone: 'America/New_York',
    primaryLanguage: 'en',
    currencySymbol: '$'
  };
};

/**
 * Upload a logo for an association
 */
export const uploadAssociationLogo = async (
  associationId: string, 
  file: File
): Promise<string | null> => {
  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${associationId}-logo-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase
      .storage
      .from('association_files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data } = await supabase
      .storage
      .from('association_files')
      .getPublicUrl(filePath);
    
    const publicUrl = data.publicUrl;
    
    // Update logo URL in settings
    await updateSupabaseAssociationSetting(associationId, 'logoUrl', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading association logo:', error);
    toast.error('Failed to upload logo');
    return null;
  }
};
