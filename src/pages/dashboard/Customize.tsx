import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Palette, MessageSquare, Sparkles } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Customize = () => {
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState({
    name: "",
    tone: "professional",
    primary_color: "#059669",
    logo_url: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setBusiness({
          name: data.name,
          tone: data.tone || "professional",
          primary_color: data.primary_color || "#059669",
          logo_url: data.logo_url || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading business",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("businesses")
        .update({
          name: business.name,
          tone: business.tone,
          primary_color: business.primary_color,
          logo_url: business.logo_url,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Settings saved!",
        description: "Your chatbot customization has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Customize Your AI</h1>
          <p className="text-muted-foreground">
            Personalize your AI assistant's appearance and behavior
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Appearance Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={business.name}
                  onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                  placeholder="Your Business Name"
                />
              </div>

              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={business.primary_color}
                    onChange={(e) => setBusiness({ ...business, primary_color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={business.primary_color}
                    onChange={(e) => setBusiness({ ...business, primary_color: e.target.value })}
                    placeholder="#059669"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This color will be used for buttons, accents, and branding
                </p>
              </div>

              <div>
                <Label htmlFor="logoUrl">Logo URL (optional)</Label>
                <Input
                  id="logoUrl"
                  value={business.logo_url}
                  onChange={(e) => setBusiness({ ...business, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </Card>

          {/* Personality Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Personality</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="tone">Communication Tone</Label>
                <Select
                  value={business.tone}
                  onValueChange={(value) => setBusiness({ ...business, tone: value })}
                >
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional & Formal</SelectItem>
                    <SelectItem value="friendly">Friendly & Casual</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
                    <SelectItem value="empathetic">Empathetic & Caring</SelectItem>
                    <SelectItem value="concise">Concise & Direct</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  This affects how your AI communicates with customers
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Preview Personality</p>
                    <p className="text-sm text-muted-foreground">
                      {business.tone === "professional" && "Hello! How may I assist you today with your inquiry?"}
                      {business.tone === "friendly" && "Hey there! 👋 What can I help you with today?"}
                      {business.tone === "enthusiastic" && "Hi! I'm so excited to help you today! What do you need? 🎉"}
                      {business.tone === "empathetic" && "Hello! I'm here to help and support you. What's on your mind?"}
                      {business.tone === "concise" && "Hi. How can I help?"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={loadBusiness} disabled={loading}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={loading} className="bg-gradient-primary">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Customize;
