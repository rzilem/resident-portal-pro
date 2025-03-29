
import { z } from 'zod';

// Define the schema for profile form validation
export const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

// Define the type for profile form values based on the schema
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Define any additional types that might be needed for profile components
export interface FormState {
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, any>;
}

export interface FormAdapter {
  getValues: (field: keyof ProfileFormValues) => string;
  setValue: (field: keyof ProfileFormValues, value: string) => void;
  formState: FormState;
  control?: any;
}
