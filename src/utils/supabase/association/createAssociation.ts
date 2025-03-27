
import { supabase } from "@/integrations/supabase/client";
import { Association } from "@/types/association";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { createDefaultSettings, settingsToJson } from "./types";
import { getAssociationById } from "./getAssociations";

/**
 * Create a new association in Supabase
 */
export const createAssociation = async (association: Omit<Association, 'id'>): Promise<Association | null> => {
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
          settings: settingsToJson(settingsObj)
        });
      
      if (settingsError) throw settingsError;
    }
    
    // Return full association object
    return await getAssociationById(newAssociation.id);
  } catch (error) {
    console.error('Error creating association:', error);
    toast.error('Failed to create association');
    return null;
  }
};
