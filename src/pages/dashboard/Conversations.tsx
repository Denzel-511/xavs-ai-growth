import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Phone, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Conversations = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!business) return;

      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          leads (email, name, phone),
          messages (id)
        `)
        .eq("business_id", business.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading conversations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: { label: "New", variant: "default" },
      active: { label: "Active", variant: "secondary" },
      resolved: { label: "Resolved", variant: "outline" },
    };
    const { label, variant } = variants[status] || variants.new;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Conversations</h1>
          <p className="text-muted-foreground">View and manage customer conversations</p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="has_lead">Has Lead</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Conversations List */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Recent Conversations</h3>
                <div className="space-y-3">
                  {loading ? (
                    <p className="text-muted-foreground text-sm">Loading...</p>
                  ) : conversations.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No conversations yet</p>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedConversation?.id === conv.id
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleSelectConversation(conv)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {conv.leads?.[0]?.name || conv.visitor_id}
                            </span>
                          </div>
                          {getStatusBadge(conv.status)}
                        </div>
                        {conv.leads?.[0] && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {conv.leads[0].email}
                            </div>
                            {conv.leads[0].phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {conv.leads[0].phone}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3" />
                          {new Date(conv.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Messages */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Messages</h3>
                {selectedConversation ? (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Select a conversation to view messages</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
