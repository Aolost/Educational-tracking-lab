// api/track.js
export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'POST') {
      try {
        const clientData = await request.json();
        
        //  SILENT GEO DATA (From Cloudflare)
        const cf = request.cf || {};
        const geoData = {
          city: cf.city || 'Unknown',
          country: cf.country || 'Unknown',
          region: cf.region || 'Unknown',
          latitude: cf.latitude || 'N/A',
          longitude: cf.longitude || 'N/A',
          ip: request.headers.get('CF-Connecting-IP') || 'Hidden'
        };

        const fullLog = { ...clientData, geo: geoData, serverTime: new Date().toISOString() };

        console.log('📍 NEW VISITOR:', JSON.stringify(fullLog));

        return new Response(JSON.stringify({ success: true, geo: geoData }), {
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