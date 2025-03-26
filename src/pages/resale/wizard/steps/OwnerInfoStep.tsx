
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface OwnerInfoStepProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  onUpdate: (data: any) => void;
}

// Create a form schema
const ownerSchema = z.object({
  name: z.string().min(1, { message: "Owner name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
});

const OwnerInfoStep: React.FC<OwnerInfoStepProps> = ({ formData, onUpdate }) => {
  // Set up the form
  const form = useForm<z.infer<typeof ownerSchema>>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
    },
  });
  
  function onSubmit(values: z.infer<typeof ownerSchema>) {
    onUpdate(values);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Owner Information</h2>
        <p className="text-muted-foreground">Enter the current property owner's contact information</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Full name" />
                </FormControl>
                <FormDescription>
                  Enter the legal owner's full name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="email@example.com" />
                </FormControl>
                <FormDescription>
                  Owner's primary email address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(555) 123-4567" />
                </FormControl>
                <FormDescription>
                  Owner's contact phone number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="hidden">Update</Button>
        </form>
      </Form>
      
      {formData.name && (
        <div className="border p-4 rounded-md bg-muted/30">
          <h3 className="font-medium mb-2">Owner Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Name:</div>
            <div>{formData.name}</div>
            <div className="text-muted-foreground">Email:</div>
            <div>{formData.email}</div>
            <div className="text-muted-foreground">Phone:</div>
            <div>{formData.phone}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerInfoStep;
