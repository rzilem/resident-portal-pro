
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

export interface APIFieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'textarea';
  description?: string;
  placeholder?: string;
  required?: boolean;
}

interface APIFormFieldProps {
  field: APIFieldDefinition;
  form: UseFormReturn<any>;
}

export const APIFormField: React.FC<APIFormFieldProps> = ({ field, form }) => {
  return (
    <FormField
      key={field.name}
      control={form.control}
      name={field.name}
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
  );
};

export default APIFormField;
