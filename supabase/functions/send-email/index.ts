
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from, replyTo }: EmailRequest = await req.json();

    if (!to) {
      throw new Error("Recipient email (to) is required");
    }

    if (!subject) {
      throw new Error("Email subject is required");
    }

    if (!html) {
      throw new Error("Email content (html) is required");
    }

    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`From: ${from || 'noreply@residentpro.com'}`);

    const emailResponse = await resend.emails.send({
      from: from || "ResidentPro <noreply@residentpro.com>",
      to: [to],
      subject: subject,
      html: html,
      reply_to: replyTo,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
