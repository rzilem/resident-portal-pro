
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface PropertyDetailsStepProps {
  formData: {
    id: string;
    name: string;
    unit: string;
  };
  onUpdate: (data: any) => void;
}

// Create a form schema
const propertySchema = z.object({
  propertyId: z.string().min(1, { message: "Property is required" }),
  unitNumber: z.string().min(1, { message: "Unit number is required" }),
  associationId: z.string().optional(),
});

// Sample properties for demo purposes
const properties = [
  { id: 'prop1', name: 'Oakwood Heights', association: 'Oakwood HOA' },
  { id: 'prop2', name: 'Willow Creek Estates', association: 'Willow Creek HOA' },
  { id: 'prop3', name: 'Riverfront Towers', association: 'Downtown Condo Association' },
  { id: 'prop4', name: 'Pine Valley Community', association: 'Pine Valley HOA' },
];

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({ formData, onUpdate }) => {
  // Set up the form
  const form = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      propertyId: formData.id || '',
      unitNumber: formData.unit || '',
      associationId: 'none',
    },
  });
  
  function onSubmit(values: z.infer<typeof propertySchema>) {
    const selectedProperty = properties.find(p => p.id === values.propertyId);
    
    onUpdate({
      id: values.propertyId,
      name: selectedProperty?.name || '',
      unit: values.unitNumber,
      association: selectedProperty?.association || '',
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Property Information</h2>
        <p className="text-muted-foreground">Select the property and unit for the resale documentation</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "select_property"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="select_property" disabled>Select a property</SelectItem>
                    {properties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose from your managed properties
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unitNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Number</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input {...field} placeholder="e.g. 101, A12" />
                    <Button type="button" variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Enter the specific unit or lot number
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
          <h3 className="font-medium mb-2">Selected Property</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Property:</div>
            <div>{formData.name}</div>
            <div className="text-muted-foreground">Unit:</div>
            <div>{formData.unit}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsStep;
