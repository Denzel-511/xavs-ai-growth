import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Step4Embed = () => {
  const [copied, setCopied] = useState(false);
  const [businessId, setBusinessId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    createBusiness();
  }, []);

  const createBusiness = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get onboarding data
      const businessData = JSON.parse(sessionStorage.getItem("onboarding_business") || "{}");
      const tone = sessionStorage.getItem("onboarding_tone") || "professional";
      const setupData = JSON.parse(sessionStorage.getItem("onboarding_setup") || "{}");

      // Create business
      const { data: business, error } = await supabase
        .from("businesses")
        .insert({
          user_id: user.id,
          name: businessData.businessName,
          website: businessData.website,
          industry: businessData.industry,
          tone,
          primary_color: setupData.primaryColor,
          logo_url: setupData.logoUrl,
        })
        .select()
        .single();

      if (error) throw error;

      setBusinessId(business.id);

      // Add FAQs if provided
      if (setupData.faq1 || setupData.faq2) {
        const faqs = [];
        if (setupData.faq1) faqs.push({ business_id: business.id, question: setupData.faq1, answer: "Please add your answer in the Knowledge Base" });
        if (setupData.faq2) faqs.push({ business_id: business.id, question: setupData.faq2, answer: "Please add your answer in the Knowledge Base" });
        
        await supabase.from("knowledge_base").insert(faqs);
      }

      // Clear session storage
      sessionStorage.removeItem("onboarding_business");
      sessionStorage.removeItem("onboarding_tone");
      sessionStorage.removeItem("onboarding_setup");

      toast({
        title: "Business created!",
        description: "Your AI assistant is ready to use",
      });
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const embedCode = `<script src="https://xavsai.com/widget.js" data-site="${businessId}"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Widget code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-sm text-muted-foreground">Step 4 of 4</span>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Embed your widget</h2>
          <p className="text-muted-foreground">Copy this code and paste it before &lt;/body&gt; tag</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Setting up your business...</p>
          </div>
        ) : (
          <>
            <div className="bg-muted p-4 rounded-lg mb-6 relative">
              <code className="text-sm break-all">{embedCode}</code>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Copy the code above</h3>
                  <p className="text-sm text-muted-foreground">Click the copy button to copy the widget code</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Paste before &lt;/body&gt;</h3>
                  <p className="text-sm text-muted-foreground">Add it to your website's HTML, just before the closing body tag</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Test your widget</h3>
                  <p className="text-sm text-muted-foreground">Visit your website to see the widget in action!</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/onboarding/step3")}>
                Back
              </Button>
              <Button onClick={() => navigate("/dashboard")} className="bg-gradient-primary">
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Step4Embed;