
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
    // Check if association_settings table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('association_settings')
      .select('id')
      .limit(1) as { data: AssociationSettings[] | null; error: PostgrestError | null };

    if (tableCheckError) {
      console.error('Error checking association_settings table:', tableCheckError.message);
      return false;
    }

    const settingsTableExists = tableExists !== null && tableExists.length > 0;

    // Create association_settings table if it doesn't exist
    if (!settingsTableExists) {
      console.log('association_settings table does not exist, attempting to create...');

      // Use RPC to create table if available
      try {
        const { error: rpcError } = await supabase
          .rpc('create_association_settings_table') as { data: any; error: PostgrestError | null };

        if (rpcError) {
          throw new Error(rpcError.message || 'Failed to create association_settings table via RPC');
        }
      } catch (rpcError: unknown) {
        console.error('Error creating association_settings table using RPC:', rpcError);

        // Fallback: Create the table by inserting a dummy record
        try {
          const { error: insertError } = await supabase
            .from('association_settings')
            .insert([{
              id: '00000000-0000-0000-0000-000000000001',
              settings: {} as Json,
            }]) as { data: any; error: PostgrestError | null };

          if (insertError) {
            throw new Error(insertError.message || 'Failed to create association_settings table');
          }

          console.log('Created association_settings table');
        } catch (directError: unknown) {
          console.error('Error creating settings table directly:', directError);
          return false;
        }
      }

      // Add a default company settings record if needed
      const { data: defaultSettings, error: settingsError } = await supabase
        .from('association_settings')
        .select()
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .maybeSingle() as { data: AssociationSettings | null; error: PostgrestError | null };

      if (settingsError) {
        console.error('Error checking default settings:', settingsError.message);
        return false;
      }

      if (!defaultSettings) {
        const { error: insertDefaultError } = await supabase
          .from('association_settings')
          .insert([{
            id: '00000000-0000-0000-0000-000000000001',
            settings: {} as Json,
          }]) as { data: any; error: PostgrestError | null };

        if (insertDefaultError) {
          console.error('Error inserting default settings:', insertDefaultError.message);
          return false;
        }
      }
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
      toast.error('Failed to initialize database tables');
      throw new Error('Database initialization failed');
    }
  } catch (error: unknown) {
    console.error('Error running migrations:', error);
    toast.error('Database migrations failed');
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Run migrations immediately on import
runMigrations();
