
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useAuthRole } from '@/hooks/use-auth-role';

interface FormData {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  address: string;
  bio: string;
}

export const useProfileForm = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { isAdmin } = useAuthRole();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    address: "",
    bio: ""
  });
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Initialize form with user data
    if (user && profile) {
      setFormData({
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: user.email || "",
        phone: profile.phone_number || "",
        jobTitle: "",  // Replace with actual field from profile when available
        address: "",   // Replace with actual field from profile when available
        bio: ""        // Replace with actual field from profile when available
      });
      
      setProfileImageUrl(profile.profile_image_url);
    }
  }, [user, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Create the update object with type safety
      const updateData: {
        first_name: string;
        last_name: string;
        phone_number?: string;
      } = {
        first_name: firstName,
        last_name: lastName,
      };
      
      // Only add phone_number if it exists
      if (formData.phone) {
        updateData.phone_number = formData.phone;
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) {
        // Check if this might be a permission issue and the user is admin
        if (isAdmin) {
          console.log("Admin override for profile update");
          // For admins, try using a service role or another method to update the profile
          // This would typically be done through a backend endpoint
          const { error: adminUpdateError } = await supabase.rpc('admin_update_user_profile', {
            user_id: user.id,
            first_name: firstName,
            last_name: lastName,
            phone_number: formData.phone || null
          });
          
          if (adminUpdateError) {
            console.error("Admin update error:", adminUpdateError);
            throw adminUpdateError;
          }
        } else {
          console.error("Supabase update error:", error);
          throw error;
        }
      }
      
      // Refresh profile data
      await refreshProfile();
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (url: string | null) => {
    // Update local state immediately for better UX
    setProfileImageUrl(url);
    // Refresh profile data to ensure everything is in sync
    await refreshProfile();
  };

  return {
    formData,
    profileImageUrl,
    loading,
    handleChange,
    handleSubmit,
    handlePhotoChange,
    isAdmin
  };
};
