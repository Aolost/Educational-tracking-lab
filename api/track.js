// api/track.js - Cloudflare Worker Backend

export default {
  async fetch(request, env) {
    // 1. Enable CORS (Allow GitHub Pages to talk to this API)
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 2. Handle Pre-flight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 3. Handle Data Submission
    if (request.method === 'POST') {
      try {
        const data = await request.json();
        
        // Add server timestamp
        data.serverTime = new Date().toISOString();

        // 4. Log the data (You'll see this in Cloudflare Dashboard)
        console.log('📥 NEW VISITOR:', JSON.stringify(data));

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Tracking API Active', { headers: corsHeaders });
  },
};


