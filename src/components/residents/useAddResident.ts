
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
}

export const useAddResident = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addResident = async (residentData: ResidentData) => {
    setIsLoading(true);
    try {
      console.log('Adding resident with data:', residentData);
      
      // First check if we have the resident_profiles table
      const { error: checkError } = await supabase
        .from('resident_profiles')
        .select('id')
        .limit(1);
      
      // If the resident_profiles table exists, use it (this is our primary target)
      if (!checkError) {
        console.log('Using resident_profiles table');
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
              user_id: user?.id
            }
          ])
          .select();

        if (error) throw error;
        return data;
      } 
      
      // Fallback to residents table if it exists (legacy support)
      const { error: residentsTableError } = await supabase
        .from('residents')
        .select('id')
        .limit(1);

      if (!residentsTableError) {
        console.log('Falling back to residents table');
        // First, try to find or create the property
        let propertyId = null;
        
        if (residentData.property_address) {
          const { data: propertyData } = await supabase
            .from('properties')
            .select('id')
            .eq('address', residentData.property_address)
            .maybeSingle();
            
          if (propertyData) {
            propertyId = propertyData.id;
          } else {
            // Create the property if it doesn't exist
            const { data: newProperty, error: propertyError } = await supabase
              .from('properties')
              .insert({
                address: residentData.property_address,
                unit_number: residentData.unit
              })
              .select()
              .single();
              
            if (propertyError) {
              console.error('Error creating property:', propertyError);
            } else {
              propertyId = newProperty.id;
            }
          }
        }
        
        // Create the resident entry
        const { data, error } = await supabase
          .from('residents')
          .insert([
            {
              user_id: user?.id,
              property_id: propertyId,
              resident_type: 'owner', // Default to owner
              move_in_date: residentData.move_in_date,
              move_out_date: residentData.move_out_date,
              is_primary: true
            }
          ])
          .select();

        if (error) throw error;
        
        // Also create/update profile entry
        if (data && data.length > 0) {
          await supabase
            .from('profiles')
            .upsert({
              id: user?.id,
              first_name: residentData.first_name,
              last_name: residentData.last_name,
              email: residentData.email,
              phone_number: residentData.phone
            });
        }
        
        return data;
      }
      
      // If neither table exists, use local storage as fallback
      const storedResidents = localStorage.getItem('residents') || '[]';
      const residents = JSON.parse(storedResidents);
      
      const newResident = {
        id: Date.now(),
        name: `${residentData.first_name} ${residentData.last_name}`,
        unit: residentData.unit,
        property: residentData.property,
        email: residentData.email,
        phone: residentData.phone,
        status: residentData.status,
        moveInDate: residentData.move_in_date.toISOString().split('T')[0],
        moveOutDate: residentData.move_out_date ? residentData.move_out_date.toISOString().split('T')[0] : '',
        balance: `$${residentData.balance.toFixed(2)}`,
        mailingAddress: residentData.mailing_address,
        propertyAddress: residentData.property_address,
        paymentPreference: residentData.payment_preference
      };
      
      residents.push(newResident);
      localStorage.setItem('residents', JSON.stringify(residents));
      
      return [newResident];
    } catch (error) {
      console.error('Error adding resident:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { addResident, isLoading };
};
