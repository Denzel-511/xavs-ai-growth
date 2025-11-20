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
    
    console.log(`[Chat] Request received - Business: ${businessId}, Conversation: ${conversationId}`);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("[Chat] LOVABLE_API_KEY not configured");
      throw new Error("AI service not configured");
    }
    
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get business info and knowledge base
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("*, knowledge_base(*)")
      .eq("id", businessId)
      .single();

    if (businessError || !business) {
      console.error("[Chat] Business not found:", businessError);
      throw new Error("Business not found");
    }

    console.log(`[Chat] Business loaded: ${business.name}, Knowledge items: ${business.knowledge_base?.length || 0}`);

    // Build context from knowledge base
    let knowledgeContext = "";
    if (business.knowledge_base && business.knowledge_base.length > 0) {
      knowledgeContext = business.knowledge_base
        .map((kb: any) => `Q: ${kb.question}\nA: ${kb.answer}`)
        .join("\n\n");
    }

    const systemPrompt = `You are an AI assistant for ${business.name}. ${business.tone ? `Use a ${business.tone} tone.` : ''}
You can communicate in multiple languages - respond in the same language the user writes in.
Business website: ${business.website || 'Not provided'}
Industry: ${business.industry || 'Not specified'}

Knowledge Base:
${knowledgeContext || 'No specific information provided yet.'}

Your role is to:
1. Answer visitor questions professionally and helpfully in their language
2. Provide accurate information about the business
3. Be concise but friendly
4. If you don't know something, be honest and offer to have someone contact them
5. Encourage visitors to leave their contact info for follow-up
6. Detect the language used and respond in the same language`;

    console.log("[Chat] Calling Lovable AI with model: google/gemini-2.5-flash");

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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Chat] AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    
    console.log(`[Chat] AI response received, length: ${aiMessage.length} chars`);

    // Save messages to conversation
    if (conversationId) {
      const { error: messagesError } = await supabase.from("messages").insert([
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
      
      if (messagesError) {
        console.error("[Chat] Error saving messages:", messagesError);
      } else {
        console.log("[Chat] Messages saved successfully");
      }
    }

    return new Response(
      JSON.stringify({ message: aiMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("[Chat] Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
