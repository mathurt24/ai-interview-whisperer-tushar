import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, FileText, Mail, Calendar } from "lucide-react";

interface InterviewRecord {
  id: string;
  candidateName: string;
  jobRole: string;
  date: string;
  overallScore: number;
  status: "completed" | "in-progress" | "scheduled";
  interviewerEmail: string;
}

// Mock data - replace with actual database queries
const mockInterviews: InterviewRecord[] = [
  {
    id: "1",
    candidateName: "John Doe",
    jobRole: "Frontend Developer",
    date: "2024-01-15",
    overallScore: 8.2,
    status: "completed",
    interviewerEmail: "hr@company.com"
  },
  {
    id: "2",
    candidateName: "Jane Smith",
    jobRole: "React Developer",
    date: "2024-01-14",
    overallScore: 6.8,
    status: "completed",
    interviewerEmail: "tech@company.com"
  },
  {
    id: "3",
    candidateName: "Mike Johnson",
    jobRole: "Full Stack Developer",
    date: "2024-01-16",
    overallScore: 0,
    status: "scheduled",
    interviewerEmail: "lead@company.com"
  }
];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterview, setSelectedInterview] = useState<InterviewRecord | null>(null);

  const filteredInterviews = mockInterviews.filter(interview =>
    interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: InterviewRecord["status"]) => {
    switch (status) {
      case "completed": return "default";
      case "in-progress": return "destructive";
      case "scheduled": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-0" style={{ background: 'var(--gradient-card)' }}>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Admin Dashboard
            </CardTitle>
            <p className="text-muted-foreground">Manage interview records and reports</p>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Interviews</p>
                  <p className="text-2xl font-bold">{mockInterviews.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{mockInterviews.filter(i => i.status === 'completed').length}</p>
                </div>
                <Badge variant="default" className="text-lg px-3 py-1">✓</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">
                    {(mockInterviews.filter(i => i.overallScore > 0).reduce((sum, i) => sum + i.overallScore, 0) / 
                      mockInterviews.filter(i => i.overallScore > 0).length || 0).toFixed(1)}
                  </p>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">★</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">{mockInterviews.filter(i => i.status === 'scheduled').length}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="interviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interviews">Interview Records</TabsTrigger>
            <TabsTrigger value="reports">Detailed Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="interviews" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by candidate name or job role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Interview List */}
            <Card>
              <CardHeader>
                <CardTitle>Interview Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedInterview(interview)}
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{interview.candidateName}</h3>
                          <p className="text-sm text-muted-foreground">{interview.jobRole}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {interview.overallScore > 0 ? `${interview.overallScore}/10` : "Not scored"}
                          </p>
                          <p className="text-sm text-muted-foreground">{interview.date}</p>
                        </div>
                        <Badge variant={getStatusColor(interview.status)}>
                          {interview.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Interview Report</CardTitle>
                <p className="text-muted-foreground">Send detailed interview reports to hiring managers</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="interviewer-email">Interviewer Email</Label>
                    <Input
                      id="interviewer-email"
                      placeholder="hr@company.com"
                      type="email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="candidate-select">Select Interview</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="">Choose an interview...</option>
                      {mockInterviews.filter(i => i.status === 'completed').map(interview => (
                        <option key={interview.id} value={interview.id}>
                          {interview.candidateName} - {interview.jobRole}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Report
                </Button>
              </CardContent>
            </Card>

            {/* Interview Detail View */}
            {selectedInterview && (
              <Card>
                <CardHeader>
                  <CardTitle>Interview Details: {selectedInterview.candidateName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Candidate Information</h4>
                      <p><strong>Name:</strong> {selectedInterview.candidateName}</p>
                      <p><strong>Position:</strong> {selectedInterview.jobRole}</p>
                      <p><strong>Interview Date:</strong> {selectedInterview.date}</p>
                      <p><strong>Overall Score:</strong> {selectedInterview.overallScore}/10</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Contact Information</h4>
                      <p><strong>Interviewer:</strong> {selectedInterview.interviewerEmail}</p>
                      <p><strong>Status:</strong> 
                        <Badge variant={getStatusColor(selectedInterview.status)} className="ml-2">
                          {selectedInterview.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}