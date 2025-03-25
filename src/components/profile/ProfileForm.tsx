
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User, CustomField } from '@/types/user';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CardFooter } from "@/components/ui/card";
import { Save } from "lucide-react";
import PersonalInfoCard from './personal-info/PersonalInfoCard';
import CustomFieldsCard from './custom-fields/CustomFieldsCard';
import { profileFormSchema, ProfileFormValues } from './types';

interface ProfileFormProps {
  user: User;
  updateUser: (data: Partial<User>) => void;
}

const ProfileForm = ({ user, updateUser }: ProfileFormProps) => {
  const [customFields, setCustomFields] = useState<CustomField[]>(
    user.customFields || []
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      bio: user.bio || '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateUser({
      ...data,
      customFields,
    });
  };

  const handleCustomFieldsChange = (fields: CustomField[]) => {
    setCustomFields(fields);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <PersonalInfoCard form={form} />
          
          <CustomFieldsCard 
            initialCustomFields={customFields} 
            onCustomFieldsChange={handleCustomFieldsChange} 
          />
          
          <CardFooter className="flex justify-end px-0">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
