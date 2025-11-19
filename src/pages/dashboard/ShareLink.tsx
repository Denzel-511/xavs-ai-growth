import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, QrCode, Share2, ExternalLink, Instagram, Facebook, MessageCircle } from "lucide-react";
import QRCode from "qrcode";

const ShareLink = () => {
  const [business, setBusiness] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setBusiness(data);

      // Generate QR code
      const chatUrl = `${window.location.origin}/chat/${data.id}`;
      const qrUrl = await QRCode.toDataURL(chatUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#10b981",
          light: "#ffffff",
        },
      });
      setQrCodeUrl(qrUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const chatUrl = business ? `${window.location.origin}/chat/${business.id}` : "";

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.download = `${business?.name}-qr-code.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Share Your AI Assistant</h1>
          <p className="text-muted-foreground">
            Share your chat link on social media - no website needed!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Chat Link */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Your Chat Link</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Share this link anywhere - Instagram bio, WhatsApp, Facebook, TikTok, or Link tree
            </p>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input value={chatUrl} readOnly className="flex-1" />
                <Button onClick={() => handleCopy(chatUrl, "Chat link")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(chatUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Chat Page
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-3">Where to share:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span>Instagram bio</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Facebook className="h-4 w-4 text-blue-500" />
                  <span>Facebook page</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <span>WhatsApp status & bio</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Share2 className="h-4 w-4 text-primary" />
                  <span>TikTok bio, Link tree, Google Business</span>
                </div>
              </div>
            </div>
          </Card>

          {/* QR Code */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">QR Code</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Print this QR code and display it in your store, on receipts, flyers, or delivery
              vehicles
            </p>
            <div className="flex flex-col items-center gap-4">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-64 h-64 border-4 border-primary/20 rounded-lg"
                />
              )}
              <Button onClick={handleDownloadQR} className="w-full">
                Download QR Code
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-3">Display your QR code on:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Store front window</li>
                <li>✓ Receipts and invoices</li>
                <li>✓ Product packaging</li>
                <li>✓ Flyers and brochures</li>
                <li>✓ Delivery vehicles and bikes</li>
                <li>✓ Business cards</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Embed Code (for advanced users) */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Website Embed Code</h3>
            <Badge variant="secondary">Advanced</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            For users with websites: paste this code before the &lt;/body&gt; tag
          </p>
          <div className="flex gap-2">
            <Input
              value={`<script src="https://xavsai.com/widget.js" data-site="${business?.id}"></script>`}
              readOnly
              className="flex-1 font-mono text-xs"
            />
            <Button
              onClick={() =>
                handleCopy(
                  `<script src="https://xavsai.com/widget.js" data-site="${business?.id}"></script>`,
                  "Embed code"
                )
              }
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ShareLink;
