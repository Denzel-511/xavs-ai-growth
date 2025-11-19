import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessId, conversationId, visitorId, email, name, phone } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Create or update conversation
    let conversation;
    if (conversationId) {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();
      conversation = data;
    } else {
      const { data } = await supabase
        .from("conversations")
        .insert({
          business_id: businessId,
          visitor_id: visitorId,
          status: "new",
        })
        .select()
        .single();
      conversation = data;
    }

    if (!conversation) throw new Error("Failed to create/find conversation");

    // Capture lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        business_id: businessId,
        conversation_id: conversation.id,
        email,
        name,
        phone,
      })
      .select()
      .single();

    if (leadError) throw leadError;

    // Get business info for notification
    const { data: business } = await supabase
      .from("businesses")
      .select("name, user_id, profiles!inner(email)")
      .eq("id", businessId)
      .single();

    // Send notification email to business owner
    const ownerEmail = business?.profiles?.[0]?.email;
    if (ownerEmail) {
      console.log(`New lead captured for ${business.name}:`);
      console.log(`Email: ${email}, Name: ${name || 'Not provided'}, Phone: ${phone || 'Not provided'}`);
      console.log(`Business owner: ${ownerEmail}`);
      
      // TODO: Integrate with email service (Resend) for notifications
      // For now, just logging
    }

    // Update analytics
    const today = new Date().toISOString().split('T')[0];
    const { data: analytics } = await supabase
      .from("analytics")
      .select("*")
      .eq("business_id", businessId)
      .eq("date", today)
      .single();

    if (analytics) {
      await supabase
        .from("analytics")
        .update({
          leads_captured: (analytics.leads_captured || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", analytics.id);
    } else {
      await supabase
        .from("analytics")
        .insert({
          business_id: businessId,
          date: today,
          leads_captured: 1,
          conversations: 1,
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        conversationId: conversation.id,
        leadId: lead.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in capture-lead function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
