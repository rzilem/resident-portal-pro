
import { supabase } from "@/integrations/supabase/client";
import { Association } from "@/types/association";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { getAssociationById } from "./getAssociations";
import { settingsToJson } from "./types";
import { handleError, validateAssociation } from "./utils";

/**
 * Update an existing association in Supabase
 * @param {string} id - The association ID to update
 * @param {Partial<Association>} updates - The fields to update
 * @returns {Promise<Association | null>} - The updated association or null if update fails
 */
export const updateAssociation = async (id: string, updates: Partial<Association>): Promise<Association | null> => {
  try {
    // Validate updates if they contain required fields
    if (updates.name) {
      validateAssociation(updates);
    }
    
    // Extract data for the associations table
    const associationData: Record<string, any> = {};
    
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
            settings: settingsToJson(updates.settings),
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
            settings: settingsToJson(updates.settings)
          });
        
        if (insertError) throw insertError;
      }
    }
    
    toast.success('Association updated successfully');
    // Fetch updated association
    return await getAssociationById(id);
  } catch (error) {
    handleError(error, 'update association');
    return null;
  }
};

/**
 * Update a specific setting for an association
 * @param {string} id - The association ID
 * @param {string} settingName - The setting name to update
 * @param {any} value - The new value for the setting
 * @returns {Promise<Association | null>} - The updated association or null if update fails
 */
export const updateAssociationSetting = async (
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
    const currentSettings = currentData?.settings 
      ? (currentData.settings as unknown as Record<string, any>)
      : {};
      
    const updatedSettings = {
      ...(typeof currentSettings === 'object' && currentSettings !== null ? currentSettings : {}),
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
    return await getAssociationById(id);
  } catch (error) {
    handleError(error, `update setting "${settingName}"`);
    return null;
  }
};
