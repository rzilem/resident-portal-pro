
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vendor } from '@/types/vendor';

const vendorFormSchema = z.object({
  name: z.string().min(2, { message: "Vendor name must be at least 2 characters." }),
  contactName: z.string().min(2, { message: "Contact name must be at least 2 characters." }).optional().or(z.literal('')),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
  phone: z.string().min(5, { message: "Please enter a valid phone number." }).optional().or(z.literal('')),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }).optional().or(z.literal('')),
  category: z.string().min(1, { message: "Please select a category." }),
  status: z.enum(["active", "inactive"]),
  paymentTerms: z.string().optional().or(z.literal('')),
  paymentMethod: z.string().optional().or(z.literal('')),
  taxId: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

interface VendorFormProps {
  initialData?: Partial<Vendor>;
  onSubmit: (values: VendorFormValues) => void;
  isSubmitting?: boolean;
}

const VendorForm: React.FC<VendorFormProps> = ({ 
  initialData = {}, 
  onSubmit,
  isSubmitting = false
}) => {
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: initialData.name || "",
      contactName: initialData.contactName || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
      category: initialData.category || "",
      status: initialData.status as "active" | "inactive" || "active",
      paymentTerms: initialData.paymentTerms || "",
      paymentMethod: initialData.paymentMethod || "",
      taxId: initialData.taxId || "",
      notes: initialData.notes || "",
    },
  });

  const handleSubmit = (values: VendorFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter vendor name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Landscaping">Landscaping</SelectItem>
                    <SelectItem value="Painting">Painting</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Window Cleaning">Window Cleaning</SelectItem>
                    <SelectItem value="Gardening">Gardening</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Terms</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="ACH">ACH</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tax ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes about the vendor" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Vendor"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VendorForm;
