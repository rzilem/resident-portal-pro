
import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface APIFieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'textarea';
  description?: string;
  placeholder?: string;
  required?: boolean;
}

export interface APIConfigFormProps {
  integrationId: string;
  fields: APIFieldDefinition[];
  initialValues?: Record<string, any>;
  onSave: (values: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  testConnection?: (values: Record<string, any>) => Promise<boolean>;
}

export const APIConfigForm: React.FC<APIConfigFormProps> = ({
  integrationId,
  fields,
  initialValues = {},
  onSave,
  onCancel,
  testConnection
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamically create schema based on fields
  const createFormSchema = () => {
    const shape: Record<string, z.ZodTypeAny> = {};
    
    fields.forEach(field => {
      let validator: z.ZodTypeAny;
      
      if (field.type === 'url') {
        validator = z.string().url({ message: "Please enter a valid URL" });
      } else {
        validator = z.string();
      }
      
      if (field.required) {
        if (field.type === 'url') {
          // For URL fields that are required
          validator = z.string()
            .min(1, { message: `${field.label} is required` })
            .url({ message: "Please enter a valid URL" });
        } else {
          // For other types that are required
          validator = z.string().min(1, { message: `${field.label} is required` });
        }
      } else {
        // Optional fields
        validator = z.string().optional();
      }
      
      shape[field.name] = validator;
    });
    
    return z.object(shape);
  };

  const formSchema = createFormSchema();
  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues as FormSchema,
  });

  useEffect(() => {
    // Update form values when initialValues change
    if (initialValues) {
      Object.entries(initialValues).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as any, String(value));
        }
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: FormSchema) => {
    setIsSaving(true);
    try {
      await onSave(values);
      toast.success(`${integrationId} configuration saved successfully`);
    } catch (error) {
      console.error("Error saving API configuration:", error);
      toast.error(`Failed to save ${integrationId} configuration`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!testConnection) return;
    
    const values = form.getValues();
    setIsTesting(true);
    
    try {
      const success = await testConnection(values);
      if (success) {
        toast.success("Connection test successful");
      } else {
        toast.error("Connection test failed");
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error("Connection test failed");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === 'textarea' ? (
                    <Textarea
                      placeholder={field.placeholder}
                      {...formField}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...formField}
                    />
                  )}
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="gap-2"
          >
            <X className="h-4 w-4" /> Cancel
          </Button>
          
          <div className="space-x-2">
            {testConnection && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                {isTesting ? "Testing..." : "Test Connection"}
              </Button>
            )}
            
            <Button type="submit" disabled={isSaving} className="gap-2">
              <Check className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default APIConfigForm;
