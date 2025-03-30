
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

export interface APIFieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'textarea' | 'email' | 'select';
  description?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string;
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
            ) : field.type === 'select' && field.options ? (
              <Select
                value={formField.value}
                onValueChange={formField.onChange}
                defaultValue={field.defaultValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          {field.hint && (
            <FormDescription className="text-xs text-muted-foreground mt-1">
              {field.hint}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default APIFormField;
