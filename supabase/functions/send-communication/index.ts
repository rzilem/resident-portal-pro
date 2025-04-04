
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CommunicationRequest {
  subject: string;
  content: string;
  messageType: 'email' | 'sms' | 'portal';
  format: 'html' | 'plain';
  recipients: {
    type: string;
    items: string[];
  };
  status: 'draft' | 'sent' | 'scheduled';
  scheduledFor?: string | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Parse the request
    const { 
      subject, 
      content, 
      messageType, 
      format, 
      recipients,
      status,
      scheduledFor
    }: CommunicationRequest = await req.json();

    // Log the request details
    console.log("Communication request:", {
      messageType,
      subject: subject || "(no subject)",
      recipientType: recipients.type,
      recipientCount: recipients.items.length,
      status,
      scheduledFor: scheduledFor || "N/A"
    });

    // Insert the communication into the database
    const { data: communicationData, error: communicationError } = await supabase
      .from("communications")
      .insert({
        message_type: messageType,
        subject,
        content,
        format,
        status,
        scheduled_for: scheduledFor,
        sender_id: user.id,
        recipient_type: recipients.type,
      })
      .select()
      .single();

    if (communicationError) {
      console.error("Error inserting communication:", communicationError);
      throw communicationError;
    }

    const communicationId = communicationData.id;

    // Insert recipients
    const recipientRecords = recipients.items.map(recipient => ({
      communication_id: communicationId,
      recipient_identifier: recipient,
    }));

    const { error: recipientsError } = await supabase
      .from("communication_recipients")
      .insert(recipientRecords);

    if (recipientsError) {
      console.error("Error inserting recipients:", recipientsError);
      throw recipientsError;
    }

    // If this is an email and not scheduled, actually send it now
    if (messageType === "email" && status === "sent") {
      // Here we would typically call an external email service
      // For now, just log that we would send the email
      console.log(`Would send email with subject "${subject}" to ${recipients.items.length} recipients`);
      
      // In a real implementation, we might call another Supabase Edge Function:
      // await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`, {
      //   method: "POST",
      //   headers: {
      //     Authorization: req.headers.get("Authorization")!,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     to: recipients.items,
      //     subject,
      //     body: content,
      //     isHtml: format === "html",
      //   }),
      // });
    }
    
    // If this is an SMS and not scheduled, send it now
    if (messageType === "sms" && status === "sent") {
      console.log(`Would send SMS to ${recipients.items.length} recipients: "${content.substring(0, 50)}..."`);
      // Similar to email, we would typically call an SMS service here
    }

    return new Response(
      JSON.stringify({
        id: communicationId,
        success: true,
        message: status === "sent" 
          ? `Message sent to ${recipients.items.length} recipients` 
          : `Message scheduled for ${new Date(scheduledFor!).toLocaleString()}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing communication:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while processing your request",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
