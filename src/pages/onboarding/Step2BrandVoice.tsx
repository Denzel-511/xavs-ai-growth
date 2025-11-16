import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Step2BrandVoice = () => {
  const [tone, setTone] = useState("professional");
  const navigate = useNavigate();
  const { toast } = useToast();

  const tones = [
    { value: "professional", label: "Professional", description: "Formal and business-like" },
    { value: "friendly", label: "Friendly", description: "Warm and approachable" },
    { value: "casual", label: "Casual", description: "Relaxed and conversational" },
    { value: "enthusiastic", label: "Enthusiastic", description: "Energetic and excited" },
  ];

  const handleNext = () => {
    sessionStorage.setItem("onboarding_tone", tone);
    navigate("/onboarding/step3");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-sm text-muted-foreground">Step 2 of 4</span>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Choose your brand voice</h2>
          <p className="text-muted-foreground">How should your AI assistant communicate?</p>
        </div>

        <div className="space-y-4 mb-8">
          {tones.map((toneOption) => (
            <Card
              key={toneOption.value}
              className={`p-4 cursor-pointer transition-all ${
                tone === toneOption.value
                  ? "border-2 border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setTone(toneOption.value)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    tone === toneOption.value ? "border-primary" : "border-muted-foreground"
                  }`}
                >
                  {tone === toneOption.value && (
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{toneOption.label}</h3>
                  <p className="text-sm text-muted-foreground">{toneOption.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-muted p-4 rounded-lg mb-8">
          <h4 className="font-semibold mb-2">Sample greeting:</h4>
          <p className="text-sm">
            {tone === "professional" && "Good day! How may I assist you with your inquiry today?"}
            {tone === "friendly" && "Hi there! 👋 How can I help you today?"}
            {tone === "casual" && "Hey! What's up? How can I help?"}
            {tone === "enthusiastic" && "Hello! 🎉 I'm so excited to help you today!"}
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/onboarding/step1")}>
            Back
          </Button>
          <Button onClick={handleNext} className="bg-gradient-primary">
            Next Step
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Step2BrandVoice;