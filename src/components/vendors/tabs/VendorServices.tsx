
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorServices, addVendorService } from '@/api/vendorApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VendorService } from '@/types/vendor';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

interface VendorServicesProps {
  vendorId: string;
}

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  rate: z.string().optional(),
  rateType: z.enum(["hourly", "fixed", "monthly"]).optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const VendorServices: React.FC<VendorServicesProps> = ({ vendorId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['vendorServices', vendorId],
    queryFn: () => getVendorServices(vendorId),
  });
  
  const addServiceMutation = useMutation({
    mutationFn: (service: Omit<VendorService, 'id' | 'createdAt'>) => 
      addVendorService(service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorServices', vendorId] });
      setIsDialogOpen(false);
      form.reset();
    },
  });
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      rate: '',
      rateType: undefined,
    },
  });
  
  const onSubmit = (data: ServiceFormValues) => {
    const formattedData = {
      vendor_id: vendorId,
      name: data.name,
      description: data.description,
      rate: data.rate ? parseFloat(data.rate) : undefined,
      rate_type: data.rateType,
    };
    
    addServiceMutation.mutate(formattedData);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Services</CardTitle>
          <Button onClick={() => setIsDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Service
          </Button>
        </div>
        <CardDescription>Services offered by this vendor</CardDescription>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No services added yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Service
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      )}
                      {service.rate && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">${service.rate}</span>
                          {service.rateType && <span className="text-muted-foreground"> / {service.rateType}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Add Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter service description" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          min="0" 
                          step="0.01" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rateType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a rate type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addServiceMutation.isPending}
                >
                  {addServiceMutation.isPending ? "Adding..." : "Add Service"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VendorServices;
