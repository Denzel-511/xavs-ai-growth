import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Step3QuickSetup = () => {
  const [primaryColor, setPrimaryColor] = useState("#059669");
  const [logoUrl, setLogoUrl] = useState("");
  const [faq1, setFaq1] = useState("");
  const [faq2, setFaq2] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    sessionStorage.setItem("onboarding_setup", JSON.stringify({ primaryColor, logoUrl, faq1, faq2 }));
    navigate("/onboarding/step4");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-sm text-muted-foreground">Step 3 of 4</span>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Customize your widget</h2>
          <p className="text-muted-foreground">Make it match your brand</p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-4 items-center">
              <Input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-12"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#059669"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="logoUrl">Logo URL (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="logoUrl"
                type="url"
                placeholder="https://yoursite.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Add some common questions (optional)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Help your AI learn about your business
            </p>
            <div className="space-y-3">
              <Textarea
                placeholder="e.g., What are your business hours?"
                value={faq1}
                onChange={(e) => setFaq1(e.target.value)}
                rows={2}
              />
              <Textarea
                placeholder="e.g., What services do you offer?"
                value={faq2}
                onChange={(e) => setFaq2(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={() => navigate("/onboarding/step2")}>
              Back
            </Button>
            <Button onClick={handleNext} className="bg-gradient-primary">
              Next Step
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step3QuickSetup;