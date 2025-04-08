
import { supabase } from "@/integrations/supabase/client";
import { 
  Vendor, 
  VendorTag, 
  VendorService, 
  VendorInsurance, 
  VendorRating,
  VendorCategory,
  PaymentTerms,
  InsuranceNotification,
  InsuranceRequirement
} from "@/types/vendor";
import { toast } from "sonner";

// Get all vendors
export const getVendors = async (): Promise<Vendor[]> => {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .select("*, vendor_ratings(*)")
      .order("name");

    if (error) {
      throw error;
    }

    // Calculate average rating for each vendor
    const vendorsWithRatings = data.map(vendor => {
      let avgRating = null;
      if (vendor.vendor_ratings && vendor.vendor_ratings.length > 0) {
        const sum = vendor.vendor_ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0);
        avgRating = Math.round((sum / vendor.vendor_ratings.length) * 10) / 10;
      }
      
      return {
        ...vendor,
        rating: avgRating,
      };
    });

    return vendorsWithRatings || [];
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
      .select(`
        *,
        vendor_ratings(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    // Calculate average rating
    let avgRating = null;
    if (data.vendor_ratings && data.vendor_ratings.length > 0) {
      const sum = data.vendor_ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0);
      avgRating = Math.round((sum / data.vendor_ratings.length) * 10) / 10;
    }

    // Transform vendor data to match our interface
    const vendor: Vendor = {
      ...data,
      rating: avgRating,
    };

    return vendor;
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
        .update({
          policy_number: insurance.policyNumber,
          provider: insurance.provider,
          expiration_date: insurance.expirationDate,
          coverage_amount: insurance.coverageAmount,
          coverage_type: insurance.coverageType,
          agent_name: insurance.agent?.name,
          agent_email: insurance.agent?.email,
          agent_phone: insurance.agent?.phone,
          verification_status: insurance.verificationStatus || 'pending',
          next_verification_date: insurance.nextVerificationDate
        })
        .eq("vendor_id", vendorId);

      if (error) throw error;
    } else {
      // Insert new insurance
      const { error } = await supabase
        .from("vendor_insurance")
        .insert([{ 
          vendor_id: vendorId,
          policy_number: insurance.policyNumber,
          provider: insurance.provider,
          expiration_date: insurance.expirationDate,
          coverage_amount: insurance.coverageAmount,
          coverage_type: insurance.coverageType,
          agent_name: insurance.agent?.name,
          agent_email: insurance.agent?.email,
          agent_phone: insurance.agent?.phone,
          verification_status: insurance.verificationStatus || 'pending',
          next_verification_date: insurance.nextVerificationDate
        }]);

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

    if (!data) return null;

    // Transform database fields to our interface
    const insurance: VendorInsurance = {
      id: data.id,
      policyNumber: data.policy_number,
      provider: data.provider,
      expirationDate: data.expiration_date,
      coverageAmount: data.coverage_amount,
      coverageType: data.coverage_type,
      agent: {
        name: data.agent_name,
        email: data.agent_email,
        phone: data.agent_phone,
      },
      verificationStatus: data.verification_status,
      verifiedBy: data.verified_by,
      verifiedAt: data.verified_at,
      nextVerificationDate: data.next_verification_date
    };

    return insurance;
  } catch (error) {
    console.error(`Error fetching insurance for vendor ${vendorId}:`, error);
    toast.error("Failed to load insurance information");
    return null;
  }
};

// Get vendor categories
export const getVendorCategories = async (): Promise<VendorCategory[]> => {
  try {
    const { data, error } = await supabase
      .from("vendor_categories")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching vendor categories:", error);
    toast.error("Failed to load categories");
    return [];
  }
};

// Get payment terms
export const getPaymentTerms = async (): Promise<PaymentTerms[]> => {
  try {
    const { data, error } = await supabase
      .from("payment_terms")
      .select("*")
      .order("days_due");

    if (error) {
      throw error;
    }

    return data.map(term => ({
      id: term.id,
      name: term.name,
      daysDue: term.days_due,
      description: term.description
    })) || [];
  } catch (error) {
    console.error("Error fetching payment terms:", error);
    toast.error("Failed to load payment terms");
    return [];
  }
};

// Add or update vendor rating
export const rateVendor = async (vendorId: string, rating: number, comment?: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("vendor_ratings")
      .insert([{
        vendor_id: vendorId,
        rating,
        comment,
        rated_by: user.id
      }]);

    if (error) throw error;

    toast.success("Rating submitted successfully");
    return true;
  } catch (error) {
    console.error("Error rating vendor:", error);
    toast.error("Failed to submit rating");
    return false;
  }
};

// Get vendor ratings
export const getVendorRatings = async (vendorId: string): Promise<VendorRating[]> => {
  try {
    const { data, error } = await supabase
      .from("vendor_ratings")
      .select("*, profiles:rated_by(first_name, last_name)")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map((rating: any) => ({
      id: rating.id,
      vendorId: rating.vendor_id,
      rating: rating.rating,
      comment: rating.comment,
      ratedBy: rating.rated_by,
      ratedByName: rating.profiles ? `${rating.profiles.first_name} ${rating.profiles.last_name}` : 'Unknown User',
      createdAt: rating.created_at
    })) || [];
  } catch (error) {
    console.error(`Error fetching ratings for vendor ${vendorId}:`, error);
    toast.error("Failed to load vendor ratings");
    return [];
  }
};

// Upload vendor document
export const uploadVendorDocument = async (
  vendorId: string,
  file: File,
  documentType: string,
  expirationDate?: string,
  isInsurance: boolean = false
): Promise<string | null> => {
  try {
    const filePath = `${vendorId}/${Date.now()}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    const url = urlData.publicUrl;

    // Add record to vendor_documents table
    const { error: dbError } = await supabase
      .from("vendor_documents")
      .insert([
        {
          vendor_id: vendorId,
          name: file.name,
          file_path: filePath,
          document_type: documentType,
          is_insurance: isInsurance,
          expiration_date: expirationDate,
          file_type: file.type,
          size: file.size
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

    // Generate URLs for the documents
    const documentsWithUrls = await Promise.all(data.map(async (doc) => {
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(doc.file_path);

      return {
        ...doc,
        url: urlData.publicUrl
      };
    }));

    return documentsWithUrls || [];
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
      .from("documents")
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

// Get insurance notifications for a vendor
export const getInsuranceNotifications = async (vendorId: string): Promise<InsuranceNotification[]> => {
  try {
    const { data, error } = await supabase
      .from("vendor_insurance_notifications")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("scheduled_date", { ascending: true });

    if (error) {
      throw error;
    }

    return data.map((notification: any) => ({
      id: notification.id,
      vendorId: notification.vendor_id,
      insuranceId: notification.insurance_id,
      notificationType: notification.notification_type,
      scheduledDate: notification.scheduled_date,
      sentAt: notification.sent_at,
      recipient: notification.recipient,
      status: notification.status
    })) || [];
  } catch (error) {
    console.error(`Error fetching insurance notifications for vendor ${vendorId}:`, error);
    toast.error("Failed to load insurance notifications");
    return [];
  }
};

// Schedule an insurance notification
export const scheduleInsuranceNotification = async (
  notification: Omit<InsuranceNotification, "id" | "status">
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("vendor_insurance_notifications")
      .insert([{
        vendor_id: notification.vendorId,
        insurance_id: notification.insuranceId,
        notification_type: notification.notificationType,
        scheduled_date: notification.scheduledDate,
        recipient: notification.recipient,
        status: 'pending'
      }]);

    if (error) {
      throw error;
    }

    toast.success("Notification scheduled successfully");
    return true;
  } catch (error) {
    console.error("Error scheduling insurance notification:", error);
    toast.error("Failed to schedule notification");
    return false;
  }
};

// Get insurance requirements
export const getInsuranceRequirements = async (): Promise<InsuranceRequirement[]> => {
  try {
    const { data, error } = await supabase
      .from("vendor_insurance_requirements")
      .select("*, vendor_categories(name)")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map((req: any) => ({
      id: req.id,
      vendorCategoryId: req.vendor_category_id,
      vendorCategoryName: req.vendor_categories?.name,
      minCoverageAmount: req.min_coverage_amount,
      requiredCoverageTypes: req.required_coverage_types,
      description: req.description
    })) || [];
  } catch (error) {
    console.error("Error fetching insurance requirements:", error);
    toast.error("Failed to load insurance requirements");
    return [];
  }
};
