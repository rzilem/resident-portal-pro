
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileText, Download, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  propertyAddress: z.string().min(5, "Address is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  associationName: z.string().min(1, "Association name is required"),
  closingDate: z.string().min(1, "Closing date is required"),
});

type FormValues = z.infer<typeof formSchema>;

const ResaleCertificate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyAddress: '',
      ownerName: '',
      associationName: '',
      closingDate: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPreviewMode(true);
      toast({
        title: "Certificate Generated",
        description: "Resale certificate has been generated successfully.",
      });
    }, 1500);
  };

  const handleDownload = () => {
    toast({
      title: "Certificate Downloaded",
      description: "Your resale certificate has been downloaded as a PDF.",
    });
  };

  const handleEmail = () => {
    toast({
      title: "Certificate Sent",
      description: "Your resale certificate has been emailed to the recipients.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resale Certificate Generator</CardTitle>
        <CardDescription>
          Create Texas-compliant resale certificates with property and seller information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!previewMode ? (
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
        ) : (
          <div className="space-y-6">
            <div className="border rounded-md p-6">
              <h2 className="text-xl font-semibold mb-4">Resale Certificate</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Property Information</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.getValues("propertyAddress")}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Current Owner</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.getValues("ownerName")}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Association</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.getValues("associationName")}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Closing Date</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.getValues("closingDate")}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Account Statement</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Current Regular Assessment:</span> $250.00 monthly</p>
                    <p><span className="font-medium">Special Assessment:</span> None</p>
                    <p><span className="font-medium">Transfer Fee:</span> $150.00</p>
                    <p><span className="font-medium">Outstanding Balance:</span> $0.00</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium">Violations</h3>
                  <p className="text-sm text-muted-foreground">
                    No open violations found.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Legal Matters</h3>
                  <p className="text-sm text-muted-foreground">
                    There are no pending legal matters involving this property.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setPreviewMode(false)} className="flex-1">
                Edit
              </Button>
              <Button onClick={handleDownload} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="secondary" onClick={handleEmail} className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResaleCertificate;
