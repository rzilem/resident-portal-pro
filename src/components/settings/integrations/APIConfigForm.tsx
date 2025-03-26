
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";

// Import the new components
import APIFormField, { APIFieldDefinition } from './form/FormField';
import FormActions from './form/FormActions';
import createFormSchema from './form/SchemaBuilder';

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

  // Create form schema based on fields
  const formSchema = createFormSchema(fields);
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
          <APIFormField 
            key={field.name}
            field={field} 
            form={form}
          />
        ))}

        <FormActions 
          onCancel={onCancel}
          isSaving={isSaving}
          isTesting={isTesting}
          onTestConnection={testConnection ? handleTestConnection : undefined}
        />
      </form>
    </Form>
  );
};

export default APIConfigForm;
