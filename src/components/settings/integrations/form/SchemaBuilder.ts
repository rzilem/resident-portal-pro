
import { z } from "zod";
import { APIFieldDefinition } from "./FormField";

/**
 * Creates a Zod schema based on field definitions
 */
export const createFormSchema = (fields: APIFieldDefinition[]) => {
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
      validator = validator.optional();
    }
    
    shape[field.name] = validator;
  });
  
  return z.object(shape);
};

export default createFormSchema;
