import React from 'react';
import { profileFormSchema } from "./profile/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PersonalInfoCard from './profile/cards/PersonalInfoCard';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import NotificationsCard from './profile/cards/NotificationsCard';
import IntegrationsCard from './profile/cards/IntegrationsCard';
import ExportDataCard from './profile/cards/ExportDataCard';
import { useAuth } from '@/hooks/use-auth';

// Define the UserProfile interface to match the structure we're using
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  profilePicture?: string;
  role?: string;
  createdAt: string;
}

async function fetchProfile(): Promise<UserProfile> {
  // This would be an API call in a real app
  return {
    id: '1',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    phoneNumber: '(555) 123-4567',
    address: '123 Main St, Anytown, USA',
    bio: 'Product manager with 5+ years experience in SaaS',
    profilePicture: '/avatars/01.png',
    role: 'user',
    createdAt: new Date().toISOString(),
  };
}

async function updateProfile(data: any): Promise<any> {
  // This would be an API call in a real app
  console.log('Saving profile data:', data);
  return { success: true };
}

export default function ProfileSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      bio: '',
    },
  });

  React.useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, form]);

  async function onSubmit(data: any) {
    try {
      await updateProfile(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Create a form adapter that matches what PersonalInfoCard expects
  const formAdapter = {
    getValues: (field: string) => form.getValues(field as any) as string,
    setValue: (field: string, value: string) => form.setValue(field as any, value),
    formState: form.formState,
    control: form.control,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6">
            <PersonalInfoCard 
              form={formAdapter} 
              isAdmin={isAdmin} 
            />
            <div className="grid gap-6 md:grid-cols-2">
              <NotificationsCard />
              <IntegrationsCard />
            </div>
            <ExportDataCard />
          </div>
          
          <Button type="submit" className="mt-8">
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
