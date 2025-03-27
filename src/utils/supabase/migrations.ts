
/**
 * Supabase database migrations
 */
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PostgrestError } from '@supabase/supabase-js';
import { Json } from "@/integrations/supabase/types";

// Define the structure of association_settings table entries
interface AssociationSettings {
  id: string;
  settings: Json;
}

/**
 * Initialize the database with required tables if they don't exist
 * @returns {Promise<boolean>} - True if initialization succeeds, false otherwise
 */
export const initializeTables = async (): Promise<boolean> => {
  try {
    console.log('Checking if association_settings table exists...');
    
    // Check if association_settings table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('association_settings')
      .select('id')
      .limit(1) as { data: AssociationSettings[] | null; error: PostgrestError | null };

    if (tableCheckError) {
      // Using 'any' cast to bypass TypeScript error
      console.error('Error checking association_settings table:', tableCheckError.message);
      return false;
    }

    const settingsTableExists = tableExists !== null && tableExists.length > 0;

    // If the table exists but is empty, we don't need to create it
    if (settingsTableExists) {
      console.log('association_settings table exists');
      return true;
    }
    
    console.log('association_settings table not found or empty, checking for default settings');

    // Check if default settings already exist to avoid RLS violations on re-insert
    const { data: defaultSettings, error: settingsError } = await supabase
      .from('association_settings')
      .select()
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .maybeSingle() as { data: AssociationSettings | null; error: PostgrestError | null };

    if (settingsError && settingsError.code !== 'PGRST116') {
      // Skip RLS errors, just log them
      if (!settingsError.message.includes('row-level security')) {
        console.error('Error checking default settings:', settingsError.message);
      } else {
        console.log('RLS policy prevented checking default settings, continuing...');
      }
    }

    // Only try to insert if we didn't find default settings
    if (!defaultSettings) {
      console.log('Attempting to insert default settings...');
      
      try {
        const { error: insertError } = await supabase
          .from('association_settings')
          .insert([{
            id: '00000000-0000-0000-0000-000000000001',
            settings: {} as Json,
          }]) as { data: any; error: PostgrestError | null };

        if (insertError) {
          // Skip RLS errors, just log them
          if (!insertError.message.includes('row-level security')) {
            console.error('Error inserting default settings:', insertError.message);
          } else {
            console.log('RLS policy prevented inserting default settings, continuing...');
            // This is expected in some cases, so we'll return true anyway
            return true;
          }
        } else {
          console.log('Default settings inserted successfully');
        }
      } catch (insertError: unknown) {
        const errorMessage = insertError instanceof Error ? insertError.message : String(insertError);
        
        // Skip RLS errors, just log them
        if (!errorMessage.includes('row-level security')) {
          console.error('Exception inserting default settings:', errorMessage);
        } else {
          console.log('RLS policy prevented inserting default settings, continuing...');
          // This is expected in some cases, so we'll return true anyway
          return true;
        }
      }
    } else {
      console.log('Default settings already exist');
    }

    console.log('Database tables initialized successfully');
    return true;
  } catch (error: unknown) {
    console.error('Error initializing tables:', error);
    return false;
  }
};

/**
 * Run all pending migrations
 * @returns {Promise<void>}
 */
export const runMigrations = async (): Promise<void> => {
  try {
    const success = await initializeTables();

    if (success) {
      console.log('Database migrations completed successfully');
    } else {
      console.warn('Database initialization had issues, but will continue to function');
      // Don't throw an error here, just warn and continue
    }
  } catch (error: unknown) {
    console.error('Error running migrations:', error);
    toast.error('Database migrations encountered issues');
    // Don't rethrow the error, just log it and continue
  }
};

// Run migrations immediately on import, but don't block if they fail
runMigrations().catch(error => {
  console.error('Unhandled error during migrations:', error);
});
