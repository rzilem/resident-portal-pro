
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { LeadData, LeadDocument } from './types';
import LeadDocumentUpload from './LeadDocumentUpload';
import { Checkbox } from '@/components/ui/checkbox';

const leadFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  company: z.string().optional(),
  association_name: z.string().optional(),
  association_type: z.string().optional(),
  unit_count: z.coerce.number().int().positive().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  has_pool: z.boolean().optional(),
  has_gate: z.boolean().optional(),
  has_onsite_management: z.boolean().optional(),
  notes: z.string().optional(),
  source: z.string().optional()
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormDialogProps {
  lead?: LeadData;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onSuccess?: (lead: LeadData) => void;
}

const LeadFormDialog: React.FC<LeadFormDialogProps> = ({ 
  lead,
  buttonText = "Add Lead",
  buttonVariant = "default",
  onSuccess
}) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState<LeadDocument[]>(lead?.uploaded_files || []);
  const queryClient = useQueryClient();
  
  const isEditMode = !!lead;
  
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: lead ? {
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      association_name: lead.association_name || "",
      association_type: lead.association_type || "",
      unit_count: lead.unit_count || undefined,
      city: lead.city || "",
      state: lead.state || "",
      has_pool: lead.has_pool || false,
      has_gate: lead.has_gate || false,
      has_onsite_management: lead.has_onsite_management || false,
      notes: lead.notes || "",
      source: lead.source || "manual"
    } : {
      name: "",
      email: "",
      phone: "",
      company: "",
      association_name: "",
      association_type: "",
      city: "",
      state: "",
      has_pool: false,
      has_gate: false,
      has_onsite_management: false,
      source: "manual"
    }
  });
  
  const onSubmit = async (data: LeadFormValues) => {
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        // Update existing lead
        const { error } = await supabase
          .from('leads')
          .update({
            ...data,
            updatedat: new Date().toISOString(),
            uploaded_files: documents.length > 0 ? documents : null
          })
          .eq('id', lead.id);
          
        if (error) throw error;
        
        toast.success("Lead updated successfully");
      } else {
        // Create new lead
        const { data: newLead, error } = await supabase
          .from('leads')
          .insert({
            ...data,
            status: 'new',
            createdat: new Date().toISOString(),
            uploaded_files: documents.length > 0 ? documents : null
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // If this is a new lead with temporary document paths, update the paths
        if (documents.length > 0 && newLead) {
          await updateDocumentPaths(newLead.id);
          
          // Update the lead with the permanent document paths
          const { error: updateError } = await supabase
            .from('leads')
            .update({
              uploaded_files: documents
            })
            .eq('id', newLead.id);
            
          if (updateError) {
            console.error("Error updating document paths:", updateError);
          }
        }
        
        toast.success("Lead created successfully");
        
        if (onSuccess && newLead) {
          onSuccess(newLead as unknown as LeadData);
        }
      }
      
      // Refresh leads data
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      
      // Close dialog and reset form
      setOpen(false);
      form.reset();
      setDocuments([]);
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Failed to save lead");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Update temporary document paths to permanent ones
  const updateDocumentPaths = async (leadId: string) => {
    const updatedDocs = await Promise.all(documents.map(async (doc) => {
      if (doc.path.includes('leads/temp/')) {
        // Copy the file to a permanent location
        const fileName = doc.path.split('/').pop() || '';
        const newPath = `leads/${leadId}/${fileName}`;
        
        const { data } = await supabase.storage
          .from('documents')
          .copy(doc.path, newPath);
          
        if (data) {
          // Get the new URL
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(newPath);
            
          // Remove the temporary file
          await supabase.storage
            .from('documents')
            .remove([doc.path]);
            
          // Update document record
          return {
            ...doc,
            path: newPath,
            url: urlData.publicUrl
          };
        }
      }
      return doc;
    }));
    
    setDocuments(updatedDocs);
    return updatedDocs;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Lead" : "Add New Lead"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update the lead information below."
              : "Enter the lead details to create a new lead."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                      <Input placeholder="john@example.com" {...field} />
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
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="association_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Association Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Community Association" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="association_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Association Type</FormLabel>
                    <FormControl>
                      <Input placeholder="HOA, Condo, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Number of units" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="has_pool"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Has Pool</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_gate"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Has Gate</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_onsite_management"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Has Onsite Management</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Source</FormLabel>
                  <FormControl>
                    <Input placeholder="Website, Referral, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional information about this lead" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Documents</h3>
              <LeadDocumentUpload
                leadId={lead?.id}
                documents={documents}
                onDocumentsChange={setDocuments}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : (isEditMode ? "Update Lead" : "Add Lead")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadFormDialog;
