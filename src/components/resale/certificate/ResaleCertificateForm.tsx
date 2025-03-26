import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ResaleCertificate } from '@/types/supabase';

const formSchema = z.object({
  propertyAddress: z.string().min(5, "Address is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  associationName: z.string().min(1, "Association name is required"),
  closingDate: z.string().min(1, "Closing date is required"),
});

export type ResaleCertificateFormValues = z.infer<typeof formSchema>;

interface ResaleCertificateFormProps {
  onSubmit: (data: ResaleCertificateFormValues) => void;
  isLoading: boolean;
}

const ResaleCertificateForm: React.FC<ResaleCertificateFormProps> = ({ 
  onSubmit, 
  isLoading 
}) => {
  const form = useForm<ResaleCertificateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyAddress: '',
      ownerName: '',
      associationName: '',
      closingDate: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="propertyAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, Austin, TX 78701" {...field} />
              </FormControl>
              <FormDescription>
                Enter the complete address of the property
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Owner Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="associationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Association Name</FormLabel>
              <FormControl>
                <Input placeholder="Sunset Heights HOA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="closingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Closing Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Certificate"}
        </Button>
      </form>
    </Form>
  );
};

export default ResaleCertificateForm;
