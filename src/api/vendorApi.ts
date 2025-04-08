
import { supabase } from "@/integrations/supabase/client";
import { Vendor, VendorTag, VendorService, VendorInsurance } from "@/types/vendor";
import { toast } from "sonner";

// Get all vendors
export const getVendors = async (): Promise<Vendor[]> => {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching vendors:", error);
    toast.error("Failed to load vendors");
    return [];
  }
};

// Get a single vendor by ID
export const getVendorById = async (id: string): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching vendor with ID ${id}:`, error);
    toast.error("Failed to load vendor details");
    return null;
  }
};

// Create a new vendor
export const createVendor = async (vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .insert([vendor])
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("Vendor created successfully");
    return data;
  } catch (error) {
    console.error("Error creating vendor:", error);
    toast.error("Failed to create vendor");
    return null;
  }
};

// Update an existing vendor
export const updateVendor = async (id: string, vendor: Partial<Vendor>): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .update(vendor)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("Vendor updated successfully");
    return data;
  } catch (error) {
    console.error(`Error updating vendor with ID ${id}:`, error);
    toast.error("Failed to update vendor");
    return null;
  }
};

// Delete a vendor
export const deleteVendor = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("vendors")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast.success("Vendor deleted successfully");
    return true;
  } catch (error) {
    console.error(`Error deleting vendor with ID ${id}:`, error);
    toast.error("Failed to delete vendor");
    return false;
  }
};

// Get vendor services
export const getVendorServices = async (vendorId: string): Promise<VendorService[]> => {
  try {
    const { data, error } = await supabase
      .from("vendor_services")
      .select("*")
      .eq("vendor_id", vendorId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching services for vendor ${vendorId}:`, error);
    toast.error("Failed to load vendor services");
    return [];
  }
};

// Add a vendor service
export const addVendorService = async (service: Omit<VendorService, "id" | "createdAt">): Promise<VendorService | null> => {
  try {
    const { data, error } = await supabase
      .from("vendor_services")
      .insert([service])
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("Service added successfully");
    return data;
  } catch (error) {
    console.error("Error adding vendor service:", error);
    toast.error("Failed to add service");
    return null;
  }
};

// Update vendor insurance
export const updateVendorInsurance = async (vendorId: string, insurance: Omit<VendorInsurance, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
  try {
    // First check if insurance record exists
    const { data: existingInsurance } = await supabase
      .from("vendor_insurance")
      .select("id")
      .eq("vendor_id", vendorId)
      .maybeSingle();

    if (existingInsurance) {
      // Update existing insurance
      const { error } = await supabase
        .from("vendor_insurance")
        .update(insurance)
        .eq("vendor_id", vendorId);

      if (error) throw error;
    } else {
      // Insert new insurance
      const { error } = await supabase
        .from("vendor_insurance")
        .insert([{ ...insurance, vendor_id: vendorId }]);

      if (error) throw error;
    }

    toast.success("Insurance information updated");
    return true;
  } catch (error) {
    console.error("Error updating vendor insurance:", error);
    toast.error("Failed to update insurance information");
    return false;
  }
};

// Get vendor insurance
export const getVendorInsurance = async (vendorId: string): Promise<VendorInsurance | null> => {
  try {
    const { data, error } = await supabase
      .from("vendor_insurance")
      .select("*")
      .eq("vendor_id", vendorId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching insurance for vendor ${vendorId}:`, error);
    toast.error("Failed to load insurance information");
    return null;
  }
};

// Upload vendor document
export const uploadVendorDocument = async (
  vendorId: string,
  file: File,
  documentType: string
): Promise<string | null> => {
  try {
    const filePath = `${vendorId}/${Date.now()}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from("vendor_documents")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from("vendor_documents")
      .getPublicUrl(filePath);

    const url = urlData.publicUrl;

    // Add record to vendor_documents table
    const { error: dbError } = await supabase
      .from("vendor_documents")
      .insert([
        {
          vendor_id: vendorId,
          name: file.name,
          url: url,
          document_type: documentType,
          is_insurance: documentType.toLowerCase().includes('insurance')
        }
      ]);

    if (dbError) {
      throw dbError;
    }

    toast.success("Document uploaded successfully");
    return url;
  } catch (error) {
    console.error("Error uploading vendor document:", error);
    toast.error("Failed to upload document");
    return null;
  }
};

// Get vendor documents
export const getVendorDocuments = async (vendorId: string) => {
  try {
    const { data, error } = await supabase
      .from("vendor_documents")
      .select("*")
      .eq("vendor_id", vendorId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching documents for vendor ${vendorId}:`, error);
    toast.error("Failed to load vendor documents");
    return [];
  }
};

// Delete vendor document
export const deleteVendorDocument = async (documentId: string, filePath: string): Promise<boolean> => {
  try {
    // Delete from database
    const { error: dbError } = await supabase
      .from("vendor_documents")
      .delete()
      .eq("id", documentId);

    if (dbError) {
      throw dbError;
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("vendor_documents")
      .remove([filePath]);

    if (storageError) {
      console.error("Warning: File deleted from DB but not from storage:", storageError);
    }

    toast.success("Document deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting vendor document:", error);
    toast.error("Failed to delete document");
    return false;
  }
};
