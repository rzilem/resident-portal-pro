
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User, CustomField } from '@/types/user';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CardFooter } from "@/components/ui/card";
import { Save, ShieldCheck } from "lucide-react";
import PersonalInfoCard from './personal-info/PersonalInfoCard';
import CustomFieldsCard from './custom-fields/CustomFieldsCard';
import { profileFormSchema, ProfileFormValues } from './types';
import { useAuthRole } from '@/hooks/use-auth-role';
import { Badge } from "@/components/ui/badge";

interface ProfileFormProps {
  user: User;
  updateUser: (data: Partial<User>) => void;
}

const ProfileForm = ({ user, updateUser }: ProfileFormProps) => {
  const { isAdmin } = useAuthRole();
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
    const updatedData = {
      ...data,
      customFields,
    };
    
    console.log("Submitting with admin privileges:", isAdmin);
    updateUser(updatedData);
  };

  const handleCustomFieldsChange = (fields: CustomField[]) => {
    setCustomFields(fields);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Personal Information</h2>
            {isAdmin && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Admin Mode
              </Badge>
            )}
          </div>
          
          <PersonalInfoCard form={form} />
          
          <CustomFieldsCard 
            initialCustomFields={customFields} 
            onCustomFieldsChange={handleCustomFieldsChange} 
          />
          
          <CardFooter className="flex justify-end px-0">
            <Button 
              type="submit" 
              className={`flex items-center gap-2 ${isAdmin ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
            >
              <Save className="h-4 w-4" />
              {isAdmin ? "Save with Admin Rights" : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
