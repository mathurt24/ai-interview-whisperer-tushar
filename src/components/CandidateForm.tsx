import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, User, Phone, Briefcase, FileText } from "lucide-react";

interface CandidateData {
  name: string;
  phone: string;
  jobRole: string;
  resumeText: string;
}

interface CandidateFormProps {
  onSubmit: (data: CandidateData) => void;
}

const jobRoles = [
  "Frontend Developer",
  "Backend Developer", 
  "Full Stack Developer",
  "QA Engineer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "Mobile Developer"
];

export default function CandidateForm({ onSubmit }: CandidateFormProps) {
  const [formData, setFormData] = useState<CandidateData>({
    name: "",
    phone: "",
    jobRole: "",
    resumeText: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.jobRole && formData.resumeText) {
      onSubmit(formData);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFormData(prev => ({ ...prev, resumeText: text }));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-interview-calm to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-0" style={{ background: 'var(--gradient-card)' }}>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Interview Platform
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Welcome to your first-round interview with Tushar, your AI interviewer
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobRole" className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Role
              </Label>
              <Select value={formData.jobRole} onValueChange={(value) => setFormData(prev => ({ ...prev, jobRole: value }))}>
                <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select the position you're applying for" />
                </SelectTrigger>
                <SelectContent>
                  {jobRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Resume
              </Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Text File
                  </Button>
                  <span className="text-sm text-muted-foreground">or paste your resume below</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <Textarea
                  id="resume"
                  placeholder="Paste your resume text here or upload a .txt file above..."
                  value={formData.resumeText}
                  onChange={(e) => setFormData(prev => ({ ...prev, resumeText: e.target.value }))}
                  className="min-h-[120px] transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] text-lg py-6"
              disabled={!formData.name || !formData.phone || !formData.jobRole || !formData.resumeText}
            >
              Start Interview
            </Button>
          </form>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              This interview will consist of 5 questions and should take approximately 10-15 minutes to complete.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}