
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import { User, CustomField } from '@/types/user';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Building,
  PlusCircle,
  X,
  Save,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

interface ProfileFormProps {
  user: User;
  updateUser: (data: Partial<User>) => void;
}

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm = ({ user, updateUser }: ProfileFormProps) => {
  const [customFields, setCustomFields] = useState<CustomField[]>(
    user.customFields || []
  );
  const [newCustomField, setNewCustomField] = useState({
    label: '',
    value: '',
    type: 'text' as const
  });

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

  const addCustomField = () => {
    if (newCustomField.label.trim() === '' || newCustomField.value.trim() === '') {
      return;
    }

    const newField: CustomField = {
      id: uuidv4(),
      label: newCustomField.label,
      value: newCustomField.value,
      type: newCustomField.type,
    };

    setCustomFields([...customFields, newField]);
    setNewCustomField({ label: '', value: '', type: 'text' });
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const updateCustomField = (id: string, field: Partial<CustomField>) => {
    setCustomFields(
      customFields.map(item => 
        item.id === id ? { ...item, ...field } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us a little about yourself..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customFields.length > 0 ? (
                <div className="space-y-4">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Input
                        placeholder="Field Name"
                        value={field.label}
                        onChange={(e) => 
                          updateCustomField(field.id, { label: e.target.value })
                        }
                        className="w-1/3"
                      />
                      <Input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) => 
                          updateCustomField(field.id, { value: e.target.value })
                        }
                        className="flex-1"
                      />
                      <Select
                        value={field.type}
                        onValueChange={(value) => 
                          updateCustomField(field.id, { 
                            type: value as 'text' | 'date' | 'boolean' | 'number' | 'select' 
                          })
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Yes/No</SelectItem>
                          <SelectItem value="select">Selection</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomField(field.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                  <Building className="h-10 w-10 mb-2" />
                  <p>No custom fields added yet</p>
                  <p className="text-sm">Add custom fields to store additional information</p>
                </div>
              )}

              <Separator />

              <div className="flex items-end gap-2">
                <div className="w-1/3">
                  <FormLabel className="text-xs">Field Name</FormLabel>
                  <Input
                    placeholder="Field Name"
                    value={newCustomField.label}
                    onChange={(e) => 
                      setNewCustomField({ ...newCustomField, label: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <FormLabel className="text-xs">Value</FormLabel>
                  <Input
                    placeholder="Value"
                    value={newCustomField.value}
                    onChange={(e) => 
                      setNewCustomField({ ...newCustomField, value: e.target.value })
                    }
                  />
                </div>
                <div>
                  <FormLabel className="text-xs">Type</FormLabel>
                  <Select
                    value={newCustomField.type}
                    onValueChange={(value) => 
                      setNewCustomField({ 
                        ...newCustomField, 
                        type: value as 'text' | 'date' | 'boolean' | 'number' | 'select' 
                      })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Yes/No</SelectItem>
                      <SelectItem value="select">Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addCustomField}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
