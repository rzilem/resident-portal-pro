
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  replyTo?: string;
  from?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get request body
    const emailData: EmailRequest = await req.json()
    const { to, subject, body, isHtml, replyTo, from } = emailData
    
    // Validate input
    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // In a real implementation, you would use a service like SendGrid, Mailgun, etc.
    // For now, we'll just log the email
    console.log('Sending email:')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Body:', body.substring(0, 100) + '...')
    console.log('Is HTML:', isHtml)
    console.log('Reply To:', replyTo)
    console.log('From:', from)

    // In a real implementation, you would send the email here
    // For example with SendGrid:
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: to }] }],
    //     subject,
    //     content: [{ type: isHtml ? 'text/html' : 'text/plain', value: body }],
    //     from: { email: from || 'no-reply@yourdomain.com' },
    //     reply_to: replyTo ? { email: replyTo } : undefined,
    //   }),
    // });

    // if (!response.ok) {
    //   throw new Error(`Failed to send email: ${response.statusText}`);
    // }

    // Log the email in the communications table
    const { error: logError } = await supabaseClient
      .from('communications')
      .insert([
        {
          message_type: 'email',
          subject,
          content: body,
          format: isHtml ? 'html' : 'text',
          status: 'sent'
        }
      ])

    if (logError) {
      console.error('Error logging email:', logError)
      throw logError
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in send-email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
