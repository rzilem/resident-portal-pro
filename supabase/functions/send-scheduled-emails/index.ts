
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get current time
    const now = new Date();
    
    // Find all scheduled communications that are due
    const { data: dueCommunications, error } = await supabase
      .from("communications")
      .select("*, communication_recipients(*)")
      .eq("status", "scheduled")
      .lte("scheduled_for", now.toISOString());
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${dueCommunications.length} due communications`);
    
    // Process each due communication
    const results = await Promise.all(
      dueCommunications.map(async (comm) => {
        try {
          // For each communication, call send-email function
          for (const recipient of comm.communication_recipients) {
            // In a real implementation, you'd call your email service here
            // For now, we'll just log it
            console.log(`Sending ${comm.message_type} to ${recipient.recipient_email}`);
            console.log(`Subject: ${comm.subject}`);
            console.log(`Content: ${comm.content.substring(0, 100)}...`);
            
            // Update recipient status
            await supabase
              .from("communication_recipients")
              .update({ 
                status: "sent",
                sent_at: new Date().toISOString() 
              })
              .eq("id", recipient.id);
          }
          
          // Update communication status
          await supabase
            .from("communications")
            .update({ 
              status: "sent",
              updated_at: new Date().toISOString() 
            })
            .eq("id", comm.id);
          
          return { id: comm.id, success: true };
        } catch (commError) {
          console.error(`Error processing communication ${comm.id}:`, commError);
          
          // Mark as failed
          await supabase
            .from("communications")
            .update({ 
              status: "failed",
              updated_at: new Date().toISOString() 
            })
            .eq("id", comm.id);
          
          return { id: comm.id, success: false, error: commError.message };
        }
      })
    );
    
    return new Response(
      JSON.stringify({
        processed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-scheduled-emails function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
