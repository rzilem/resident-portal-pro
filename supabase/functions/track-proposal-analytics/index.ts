
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface TrackViewRequest {
  proposalId: string;
  sectionId?: string;
  email: string;
  timeSpent?: number;
  type: 'proposal' | 'section';
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
    const requestData: TrackViewRequest = await req.json()
    const { proposalId, sectionId, email, timeSpent, type } = requestData
    
    // Validate input
    if (!proposalId || !email || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get the viewer's IP address from the request
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown'

    if (type === 'proposal') {
      // Log the proposal view
      const { error: viewError } = await supabaseClient
        .from('proposal_views')
        .insert([
          {
            proposalId,
            viewerEmail: email,
            viewerIp: clientIp,
            totalTimeSpent: timeSpent || 0
          }
        ])

      if (viewError) {
        console.error('Error logging proposal view:', viewError)
        throw viewError
      }

      // Increment the view count on the proposal
      const { error: updateError } = await supabaseClient
        .from('proposals')
        .update({ 
          viewCount: supabaseClient.rpc('increment', { row_id: proposalId, table: 'proposals' }),
          lastViewedAt: new Date().toISOString()
        })
        .eq('id', proposalId)

      if (updateError) {
        console.error('Error updating proposal view count:', updateError)
        throw updateError
      }
    } else if (type === 'section' && sectionId) {
      // Log the section view
      const { error: sectionError } = await supabaseClient
        .from('section_views')
        .insert([
          {
            proposalId,
            sectionId,
            viewerEmail: email,
            timeSpent: timeSpent || 0
          }
        ])

      if (sectionError) {
        console.error('Error logging section view:', sectionError)
        throw sectionError
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in track-proposal-analytics:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
