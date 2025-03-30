
import { z } from "zod";
import { APIFieldDefinition } from "./FormField";

/**
 * Creates a Zod schema based on form field definitions
 */
const createFormSchema = (fields: APIFieldDefinition[]) => {
  const schemaObj: Record<string, any> = {};

  fields.forEach((field) => {
    let schema: z.ZodType<any> = z.string();
    
    // Apply validation based on field type
    if (field.type === 'email') {
      schema = z.string().email({ message: "Invalid email address" });
    } else if (field.type === 'url') {
      schema = z.string().url({ message: "Invalid URL" });
    } else if (field.type === 'select' && field.options) {
      schema = z.enum([...field.options.map(opt => opt.value)] as [string, ...string[]]);
    }
    
    // Make required or optional
    if (field.required) {
      schema = schema.min(1, { message: `${field.label} is required` });
    } else {
      schema = schema.optional();
    }
    
    schemaObj[field.name] = schema;
  });

  return z.object(schemaObj);
};

export default createFormSchema;
