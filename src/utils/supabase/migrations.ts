
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Initialize the database with required tables if they don't exist
 */
export const initializeTables = async (): Promise<boolean> => {
  try {
    // Check if company_settings table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('company_settings')
      .select('id')
      .limit(1);
    
    let companySettingsExists = !tableCheckError && tableExists !== null;
    
    // Create company_settings table if it doesn't exist
    if (!companySettingsExists) {
      const { error: createError } = await supabase.rpc('create_company_settings_table');
      
      if (createError) {
        console.error('Error creating company_settings table:', createError);
        
        // Attempt to create the table directly as fallback
        const { error: directError } = await supabase.query(`
          CREATE TABLE IF NOT EXISTS public.company_settings (
            id INT PRIMARY KEY,
            settings JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
        `);
        
        if (directError) {
          console.error('Error creating company_settings table directly:', directError);
          return false;
        }
      }
      
      // Set up RLS policies for company_settings
      await supabase.query(`
        ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow authenticated users to read company settings"
        ON public.company_settings
        FOR SELECT
        TO authenticated
        USING (true);
        
        CREATE POLICY "Allow authenticated users to update company settings"
        ON public.company_settings
        FOR UPDATE
        TO authenticated
        USING (true);
        
        CREATE POLICY "Allow authenticated users to insert company settings"
        ON public.company_settings
        FOR INSERT
        TO authenticated
        WITH CHECK (true);
      `);
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
