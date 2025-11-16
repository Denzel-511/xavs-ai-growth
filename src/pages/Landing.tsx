import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  MessageSquare, 
  BarChart3, 
  Globe, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">XAVS AI</span>
            <span className="text-sm text-muted-foreground">by XAVS Labs</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="text-sm hover:text-primary transition-colors">FAQ</a>
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-primary">Start Free Trial</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary font-medium">
              <Zap className="h-4 w-4" />
              Trusted by 500+ African SMEs
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Turn Your Website into a <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">24/7 Sales Machine</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              XAVS AI automatically chats with visitors, captures leads, and grows your business—while you focus on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary text-lg px-8 h-14 shadow-lg hover:shadow-xl transition-all">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                See Demo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                14-day free trial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop Losing Sales While You Sleep</h2>
              <p className="text-muted-foreground text-lg">Your website visitors have questions. XAVS AI has answers.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 border-destructive/20">
                <div className="h-12 w-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">Lost Sales</h3>
                <p className="text-sm text-muted-foreground">Visitors leave because no one responds to their questions.</p>
              </Card>
              <Card className="p-6 border-warning/20">
                <div className="h-12 w-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Repetitive Questions</h3>
                <p className="text-sm text-muted-foreground">Your team wastes time answering the same questions daily.</p>
              </Card>
              <Card className="p-6 border-primary/20">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Slow Response</h3>
                <p className="text-sm text-muted-foreground">Customers expect instant answers in today's fast-paced world.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started in Minutes</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to transform your website</p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-sm text-muted-foreground">Create your account and start your free trial</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Customize AI</h3>
              <p className="text-sm text-muted-foreground">Train your AI with your business information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Embed & Grow</h3>
              <p className="text-sm text-muted-foreground">Add our widget and watch leads roll in</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Growing Businesses</h2>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Sparkles className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Custom Knowledge Base</h3>
              <p className="text-sm text-muted-foreground">Train AI with your FAQs, products, and services</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <MessageSquare className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Automated Lead Capture</h3>
              <p className="text-sm text-muted-foreground">Collect emails automatically during conversations</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Globe className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Multi-Language Support</h3>
              <p className="text-sm text-muted-foreground">English, Twi, French, and more</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <BarChart3 className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground">Track conversations, leads, and engagement</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">Your data is encrypted and protected</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Instant Responses</h3>
              <p className="text-sm text-muted-foreground">No more waiting—AI responds in seconds</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">One-time setup + monthly subscription</p>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-2 hover:border-primary transition-colors">
              <h3 className="font-bold text-xl mb-2">Personal Site</h3>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground">Setup: <span className="font-semibold text-foreground">GHS 1,000</span></div>
                <div className="text-3xl font-bold text-primary">GHS 79<span className="text-base text-muted-foreground">/mo</span></div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> 1 website</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Basic AI</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Analytics</li>
              </ul>
              <Link to="/signup">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </Card>
            <Card className="p-6 border-2 border-primary shadow-lg scale-105">
              <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full w-fit mb-2">Most Popular</div>
              <h3 className="font-bold text-xl mb-2">Business</h3>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground">Setup: <span className="font-semibold text-foreground">GHS 1,000</span></div>
                <div className="text-3xl font-bold text-primary">GHS 199<span className="text-base text-muted-foreground">/mo</span></div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Multiple websites</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Automated leads</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Full dashboard</li>
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-gradient-primary">Get Started</Button>
              </Link>
            </Card>
            <Card className="p-6 border-2 hover:border-primary transition-colors">
              <h3 className="font-bold text-xl mb-2">Business Pro</h3>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground">Setup: <span className="font-semibold text-foreground">GHS 1,000</span></div>
                <div className="text-3xl font-bold text-primary">GHS 299<span className="text-base text-muted-foreground">/mo</span></div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Advanced analytics</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Custom AI</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Widget branding</li>
              </ul>
              <Link to="/signup">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </Card>
            <Card className="p-6 border-2 hover:border-primary transition-colors">
              <h3 className="font-bold text-xl mb-2">Enterprise</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary">Custom</div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Dedicated support</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> API access</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Integrations</li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">How do I install XAVS AI on my website?</h3>
              <p className="text-sm text-muted-foreground">Just copy one line of code and paste it before the closing &lt;/body&gt; tag on your website. It takes less than 2 minutes!</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I update the AI's knowledge?</h3>
              <p className="text-sm text-muted-foreground">Yes! You can add or update FAQs, documents, and quick info anytime from your dashboard.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Is there really a free trial?</h3>
              <p className="text-sm text-muted-foreground">Absolutely! Try XAVS AI free for 14 days. No credit card required.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Does it work on mobile?</h3>
              <p className="text-sm text-muted-foreground">Yes! The widget is fully responsive and works beautifully on all devices.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="font-bold">XAVS AI</span>
              </div>
              <p className="text-sm text-muted-foreground">Powered by XAVS Labs</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <p className="text-sm text-muted-foreground">support@xavslabs.com</p>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            © 2024 XAVS Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;