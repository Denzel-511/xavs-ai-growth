import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatWidget = () => {
  const { businessId } = useParams();
  const [business, setBusiness] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorId] = useState(() => `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBusiness();
  }, [businessId]);

  const loadBusiness = async () => {
    if (!businessId) return;

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Business not found",
        variant: "destructive",
      });
      return;
    }

    setBusiness(data);
    setMessages([
      {
        role: "assistant",
        content: `Hi! 👋 Welcome to ${data.name}. How can I help you today?`,
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || !business) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call chat edge function
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [...messages, userMessage],
          businessId: business.id,
          visitorId,
          conversationId,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Check if we should capture lead (after 2 user messages)
      const userMessageCount = messages.filter((m) => m.role === "user").length + 1;
      if (userMessageCount >= 2 && !leadCaptured) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "I'd love to help you further! Can you share your email so we can follow up?",
            },
          ]);
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadCapture = async (email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("capture-lead", {
        body: {
          businessId: business.id,
          conversationId,
          visitorId,
          email,
        },
      });

      if (error) throw error;

      setConversationId(data.conversationId);
      setLeadCaptured(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Thanks! We'll get back to you soon. How else can I help?",
        },
      ]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to capture lead",
        variant: "destructive",
      });
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const primaryColor = business.primary_color || "hsl(var(--primary))";

  return (
    <div className="min-h-screen bg-gradient-hero p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {isOpen ? (
          <div className="bg-card rounded-lg shadow-elegant overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div
              className="p-4 text-white flex items-center justify-between"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-3">
                {business.logo_url && (
                  <img
                    src={business.logo_url}
                    alt={business.name}
                    className="w-10 h-10 rounded-full object-cover bg-white"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{business.name}</h3>
                  <p className="text-xs opacity-90">We typically reply instantly</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Powered by */}
            <div className="px-4 py-2 bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground">
                Powered by <span className="font-semibold text-primary">XAVS Labs</span>
              </p>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full w-16 h-16 shadow-elegant"
            style={{ backgroundColor: primaryColor }}
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
