import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Step1Business = () => {
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (!businessName || !industry) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Store in sessionStorage for now
    sessionStorage.setItem("onboarding_business", JSON.stringify({ businessName, website, industry }));
    navigate("/onboarding/step2");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-sm text-muted-foreground">Step 1 of 4</span>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Tell us about your business</h2>
          <p className="text-muted-foreground">This helps us personalize your AI assistant</p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              placeholder="e.g., Kofi's Electronics"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://yourwebsite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="industry">Industry *</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="services">Professional Services</SelectItem>
                <SelectItem value="restaurant">Restaurant & Food</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Back to Login
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

export default Step1Business;