import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Users, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const Overview = () => {
  const [stats, setStats] = useState({
    conversations: 0,
    leads: 0,
    avgResponseTime: 0,
    aiAccuracy: 95,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's businesses
      const { data: businesses } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id);

      if (!businesses || businesses.length === 0) return;

      const businessIds = businesses.map(b => b.id);

      // Get conversations count
      const { count: conversationsCount } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .in("business_id", businessIds);

      // Get leads count
      const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .in("business_id", businessIds);

      setStats({
        conversations: conversationsCount || 0,
        leads: leadsCount || 0,
        avgResponseTime: 2,
        aiAccuracy: 95,
      });
    } catch (error: any) {
      toast({
        title: "Error loading stats",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your AI assistant.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-success">+12%</span>
            </div>
            <h3 className="text-2xl font-bold">{stats.conversations}</h3>
            <p className="text-sm text-muted-foreground">Conversations</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-xs text-success">+8%</span>
            </div>
            <h3 className="text-2xl font-bold">{stats.leads}</h3>
            <p className="text-sm text-muted-foreground">Leads Captured</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Clock className="h-5 w-5 text-accent" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{stats.avgResponseTime}s</h3>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{stats.aiAccuracy}%</h3>
            <p className="text-sm text-muted-foreground">AI Accuracy</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/dashboard/conversations">
              <Button variant="outline" className="w-full justify-between">
                View Conversations
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard/knowledge">
              <Button variant="outline" className="w-full justify-between">
                Manage Knowledge
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard/customize">
              <Button variant="outline" className="w-full justify-between">
                Customize Widget
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.conversations === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No conversations yet. Share your widget to get started!</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Recent conversations will appear here</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Overview;