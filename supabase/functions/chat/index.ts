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
    const { messages, businessId, visitorId, conversationId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get business info and knowledge base
    const { data: business } = await supabase
      .from("businesses")
      .select("*, knowledge_base(*)")
      .eq("id", businessId)
      .single();

    if (!business) throw new Error("Business not found");

    // Build context from knowledge base
    let knowledgeContext = "";
    if (business.knowledge_base && business.knowledge_base.length > 0) {
      knowledgeContext = business.knowledge_base
        .map((kb: any) => `Q: ${kb.question}\nA: ${kb.answer}`)
        .join("\n\n");
    }

    const systemPrompt = `You are an AI assistant for ${business.name}. ${business.tone ? `Use a ${business.tone} tone.` : ''}
Business website: ${business.website || 'Not provided'}
Industry: ${business.industry || 'Not specified'}

Knowledge Base:
${knowledgeContext || 'No specific information provided yet.'}

Your role is to:
1. Answer visitor questions professionally and helpfully
2. Provide information about the business
3. Be concise but friendly
4. If you don't know something, be honest and offer to have someone contact them
5. Encourage visitors to leave their contact info for follow-up`;

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // Save message to conversation
    if (conversationId) {
      await supabase.from("messages").insert([
        {
          conversation_id: conversationId,
          role: "user",
          content: messages[messages.length - 1].content,
        },
        {
          conversation_id: conversationId,
          role: "assistant",
          content: aiMessage,
        },
      ]);
    }

    return new Response(
      JSON.stringify({ message: aiMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
