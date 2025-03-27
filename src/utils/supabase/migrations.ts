
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PostgrestError } from '@supabase/supabase-js';
import { Json } from "@/integrations/supabase/types";

/**
 * Initialize the database with required tables if they don't exist
 */
export const initializeTables = async (): Promise<boolean> => {
  try {
    // Check if association_settings table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('association_settings')
      .select('id')
      .limit(1);
    
    let settingsTableExists = !tableCheckError && tableExists !== null;
    
    // Create association_settings table if it doesn't exist
    if (!settingsTableExists) {
      // Use RPC to create table if available
      try {
        const { error } = await supabase
          .rpc('create_association_settings_table');
        
        if (error) throw error;
      } catch (rpcError) {
        console.error('Error creating association_settings table using RPC:', rpcError);
        
        // Fallback: Create the table using raw SQL
        try {
          // The issue is in this block. We need to properly handle the insert operation
          const { error } = await supabase
            .from('association_settings')
            .insert([{
              id: '00000000-0000-0000-0000-000000000001',
              settings: {} as Json,
            }]);
            
          if (error) {
            // Fix for the TypeScript error
            const errorMessage = (error as PostgrestError).message || 'Unknown database error';
            throw new Error(errorMessage);
          }
            
          console.log('Created association_settings table');
        } catch (directError) {
          console.error('Error creating settings table directly:', directError);
          return false;
        }
      }
      
      // Add a default company settings record if needed
      const { data: defaultSettings, error: settingsError } = await supabase
        .from('association_settings')
        .select()
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .maybeSingle();
      
      if (!defaultSettings && !settingsError) {
        await supabase
          .from('association_settings')
          .insert([{
            id: '00000000-0000-0000-0000-000000000001',
            settings: {} as Json,
          }]);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing tables:', error);
    return false;
  }
};

/**
 * Run all pending migrations
 */
export const runMigrations = async (): Promise<void> => {
  try {
    // Initialize tables
    const success = await initializeTables();
    
    if (success) {
      console.log('Database tables initialized successfully');
    } else {
      toast.error('Failed to initialize database tables');
    }
  } catch (error) {
    console.error('Error running migrations:', error);
  }
};

// Run migrations immediately on import
runMigrations();
