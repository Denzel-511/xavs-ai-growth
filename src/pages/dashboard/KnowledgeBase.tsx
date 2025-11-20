import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Upload, Pencil, Trash2, Download, FileText } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  created_at: string;
  updated_at: string;
}

const KnowledgeBase = () => {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [filteredKnowledge, setFilteredKnowledge] = useState<KnowledgeItem[]>([]);
  const [businessId, setBusinessId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBusinessAndKnowledge();
  }, []);

  useEffect(() => {
    filterKnowledge();
  }, [knowledge, searchQuery, categoryFilter]);

  const loadBusinessAndKnowledge = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (business) {
        setBusinessId(business.id);
        loadKnowledge(business.id);
      }
    } catch (error) {
      console.error("Error loading business:", error);
    }
  };

  const loadKnowledge = async (bid: string) => {
    try {
      const { data, error } = await supabase
        .from("knowledge_base")
        .select("*")
        .eq("business_id", bid)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setKnowledge(data || []);
      
      const uniqueCategories = Array.from(
        new Set(data?.map(item => item.category).filter(Boolean) as string[])
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error loading knowledge:", error);
      toast({
        title: "Error",
        description: "Failed to load knowledge base",
        variant: "destructive",
      });
    }
  };

  const filterKnowledge = () => {
    let filtered = [...knowledge];

    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredKnowledge(filtered);
  };

  const handleAdd = async () => {
    if (!formData.question || !formData.answer) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("knowledge_base").insert({
        business_id: businessId,
        question: formData.question,
        answer: formData.answer,
        category: formData.category || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ added successfully",
      });

      setFormData({ question: "", answer: "", category: "" });
      setIsAddDialogOpen(false);
      loadKnowledge(businessId);
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to add FAQ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingItem || !formData.question || !formData.answer) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("knowledge_base")
        .update({
          question: formData.question,
          answer: formData.answer,
          category: formData.category || null,
        })
        .eq("id", editingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingItem(null);
      setFormData({ question: "", answer: "", category: "" });
      loadKnowledge(businessId);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to update FAQ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const { error } = await supabase
        .from("knowledge_base")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });

      loadKnowledge(businessId);
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleBulkImport = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const text = await csvFile.text();
      const lines = text.split("\n").filter(line => line.trim());
      
      // Skip header row
      const dataLines = lines.slice(1);
      
      const items = dataLines.map(line => {
        const [question, answer, category] = line.split(",").map(s => s.trim().replace(/^"|"$/g, ""));
        return {
          business_id: businessId,
          question,
          answer,
          category: category || null,
        };
      }).filter(item => item.question && item.answer);

      if (items.length === 0) {
        throw new Error("No valid items found in CSV");
      }

      const { error } = await supabase.from("knowledge_base").insert(items);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${items.length} FAQs imported successfully`,
      });

      setIsImportDialogOpen(false);
      setCsvFile(null);
      loadKnowledge(businessId);
    } catch (error) {
      console.error("Error importing FAQs:", error);
      toast({
        title: "Error",
        description: "Failed to import FAQs. Check CSV format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Question", "Answer", "Category"];
    const rows = knowledge.map(item => [
      `"${item.question}"`,
      `"${item.answer}"`,
      `"${item.category || ""}"`,
    ]);

    const csv = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "knowledge_base.csv";
    a.click();
  };

  const downloadTemplate = () => {
    const csv = "Question,Answer,Category\n\"What are your business hours?\",\"We're open Monday to Friday 9am-5pm\",\"General\"\n\"How can I contact support?\",\"You can reach us at support@example.com\",\"Support\"";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "knowledge_base_template.csv";
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground mt-2">
              Manage your AI's knowledge with FAQs and documents
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total FAQs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{knowledge.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <FileText className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions and answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredKnowledge.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No FAQs found. Add your first FAQ to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKnowledge.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium max-w-xs">
                        {item.question}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {item.answer}
                        </p>
                      </TableCell>
                      <TableCell>
                        {item.category && (
                          <Badge variant="secondary">{item.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
            <DialogDescription>
              Add a new question and answer to your knowledge base
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Question *</label>
              <Input
                placeholder="What is your return policy?"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Answer *</label>
              <Textarea
                placeholder="We accept returns within 30 days..."
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={6}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                placeholder="e.g., Policies, Support, General"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>
              Update the question and answer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Question *</label>
              <Input
                placeholder="What is your return policy?"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Answer *</label>
              <Textarea
                placeholder="We accept returns within 30 days..."
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={6}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                placeholder="e.g., Policies, Support, General"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Import FAQs</DialogTitle>
            <DialogDescription>
              Upload a CSV file with questions and answers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                CSV format: Question, Answer, Category
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTemplate} className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkImport} disabled={isLoading || !csvFile}>
              {isLoading ? "Importing..." : "Import FAQs"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default KnowledgeBase;
