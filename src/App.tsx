import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Step1Business from "./pages/onboarding/Step1Business";
import Step2BrandVoice from "./pages/onboarding/Step2BrandVoice";
import Step3QuickSetup from "./pages/onboarding/Step3QuickSetup";
import Step4Embed from "./pages/onboarding/Step4Embed";
import Overview from "./pages/dashboard/Overview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding/step1" element={<Step1Business />} />
          <Route path="/onboarding/step2" element={<Step2BrandVoice />} />
          <Route path="/onboarding/step3" element={<Step3QuickSetup />} />
          <Route path="/onboarding/step4" element={<Step4Embed />} />
          <Route path="/dashboard" element={<Overview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
