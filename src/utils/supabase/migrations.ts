
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      const { error } = await supabase
        .rpc('create_association_settings_table')
        .catch(() => ({ error: new Error('RPC not available') }));
      
      if (error) {
        console.error('Error creating association_settings table using RPC:', error);
        
        // Fallback: Create the table using raw SQL
        try {
          await supabase
            .from('association_settings')
            .insert({
              id: '00000000-0000-0000-0000-000000000001',
              settings: {},
            })
            .select();
          
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
          .insert({
            id: '00000000-0000-0000-0000-000000000001',
            settings: {},
          });
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
