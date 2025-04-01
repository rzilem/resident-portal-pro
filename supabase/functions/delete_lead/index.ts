
// Follow this setup guide to integrate the Deno runtime and Supabase
// https://docs.deno.com/runtime/manual/getting_started/setup

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Delete lead function is running!");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context from the request
    const supabaseClient = createClient(
      // Supabase API URL - stored in SUPABASE_URL env var
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - stored in SUPABASE_ANON_KEY env var
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the request body
    const requestData = await req.json();
    const leadId = requestData.leadId;
    
    if (!leadId) {
      return new Response(
        JSON.stringify({ success: false, error: "Lead ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Processing deletion of lead: ${leadId}`);
    
    // Get the lead to find documents to delete
    const { data: lead, error: fetchError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching lead:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    let documentErrors = [];
    
    // Delete associated documents if any exist
    if (lead && lead.uploaded_files && lead.uploaded_files.length > 0) {
      console.log(`Found ${lead.uploaded_files.length} documents to delete`);
      
      for (const doc of lead.uploaded_files) {
        if (doc && doc.path) {
          try {
            console.log(`Deleting document: ${doc.path}`);
            const { error: storageError } = await supabaseClient.storage
              .from('documents')
              .remove([doc.path]);
              
            if (storageError) {
              console.error('Error removing document:', storageError);
              documentErrors.push(`Error deleting ${doc.name}: ${storageError.message}`);
            } else {
              console.log(`Successfully deleted document: ${doc.path}`);
            }
          } catch (docError) {
            console.error('Exception deleting document:', docError);
            documentErrors.push(`Exception deleting ${doc.name}`);
          }
        }
      }
    } else {
      console.log('No documents to delete');
    }
    
    // IMPORTANT: Force bypass RLS for lead deletion
    // First try with rpc if available
    try {
      console.log('Trying to delete lead with service_role capabilities');
      // Create a service role client to bypass RLS
      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
      
      // Delete the lead using service role
      const { error: adminDeleteError } = await adminClient
        .from('leads')
        .delete()
        .eq('id', leadId);
        
      if (adminDeleteError) {
        console.error('Error deleting lead with service role:', adminDeleteError);
        throw adminDeleteError;
      } else {
        console.log('Lead successfully deleted with service role');
      }
    } catch (serviceRoleError) {
      console.error('Service role deletion failed, falling back to standard delete:', serviceRoleError);
      
      // Fall back to standard delete
      const { error: deleteError } = await supabaseClient
        .from('leads')
        .delete()
        .eq('id', leadId);
        
      if (deleteError) {
        console.error('Error deleting lead with standard delete:', deleteError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: deleteError.message,
            documentErrors: documentErrors.length > 0 ? documentErrors : undefined
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log('Lead successfully deleted with standard delete');
    }
    
    console.log('Lead deletion completed successfully');
    return new Response(
      JSON.stringify({ 
        success: true,
        documentErrors: documentErrors.length > 0 ? documentErrors : undefined
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
