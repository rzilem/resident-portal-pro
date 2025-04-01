
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface ResidentData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  unit: string;
  property: string;
  status: string;
  move_in_date: Date;
  move_out_date?: Date;
  mailing_address?: string;
  property_address?: string;
  balance: number;
  payment_preference?: string;
  association_id?: string;
}

export const useAddResident = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addResident = async (residentData: ResidentData) => {
    setIsLoading(true);
    try {
      console.log('Adding resident with data:', residentData);
      
      // Insert into resident_profiles table
      const { data, error } = await supabase
        .from('resident_profiles')
        .insert([
          {
            first_name: residentData.first_name,
            last_name: residentData.last_name,
            email: residentData.email,
            phone: residentData.phone,
            unit: residentData.unit,
            property: residentData.property,
            status: residentData.status.toLowerCase(),
            move_in_date: residentData.move_in_date,
            move_out_date: residentData.move_out_date,
            mailing_address: residentData.mailing_address,
            property_address: residentData.property_address,
            balance: residentData.balance,
            payment_preference: residentData.payment_preference,
            user_id: user?.id,
            association_id: residentData.association_id
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting resident:', error);
        throw error;
      }
      
      console.log('Successfully added resident:', data);
      return data;
    } catch (error) {
      console.error('Error adding resident:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { addResident, isLoading };
};
