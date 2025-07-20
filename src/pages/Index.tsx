import { useState } from "react";
import CandidateForm from "@/components/CandidateForm";
import InterviewInterface from "@/components/InterviewInterface";
import InterviewSummary from "@/components/InterviewSummary";
import AdminDashboard from "@/components/AdminDashboard";
import { generateQuestions } from "@/lib/questionGenerator";
import { Button } from "@/components/ui/button";

interface CandidateData {
  name: string;
  phone: string;
  jobRole: string;
  resumeText: string;
}

interface Question {
  id: number;
  question: string;
  type: "technical" | "behavioral";
}

interface Answer {
  questionId: number;
  transcript: string;
  score: number;
  feedback: string;
}

type InterviewStage = "form" | "interview" | "summary" | "admin";

const Index = () => {
  const [stage, setStage] = useState<InterviewStage>("form");
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleFormSubmit = (data: CandidateData) => {
    setCandidateData(data);
    const generatedQuestions = generateQuestions(data);
    setQuestions(generatedQuestions);
    setStage("interview");
  };

  const handleInterviewComplete = (interviewAnswers: Answer[]) => {
    setAnswers(interviewAnswers);
    setStage("summary");
  };

  const handleStartNew = () => {
    setStage("form");
    setCandidateData(null);
    setQuestions([]);
    setAnswers([]);
  };

  const showAdminDashboard = () => {
    setStage("admin");
  };

  const backToForm = () => {
    setStage("form");
  };

  switch (stage) {
    case "form":
      return (
        <div>
          <div className="fixed top-4 right-4 z-50">
            <Button
              variant="outline"
              onClick={showAdminDashboard}
              className="text-sm"
            >
              Admin Dashboard
            </Button>
          </div>
          <CandidateForm onSubmit={handleFormSubmit} />
        </div>
      );
    
    case "interview":
      if (!candidateData) return null;
      return (
        <InterviewInterface
          candidateName={candidateData.name}
          jobRole={candidateData.jobRole}
          questions={questions}
          onComplete={handleInterviewComplete}
        />
      );
    
    case "summary":
      if (!candidateData) return null;
      return (
        <InterviewSummary
          candidateName={candidateData.name}
          candidatePhone={candidateData.phone}
          jobRole={candidateData.jobRole}
          questions={questions}
          answers={answers}
          onStartNew={handleStartNew}
        />
      );
    
    case "admin":
      return (
        <div>
          <div className="fixed top-4 left-4 z-50">
            <Button
              variant="outline"
              onClick={backToForm}
              className="text-sm"
            >
              ← Back to Form
            </Button>
          </div>
          <AdminDashboard />
        </div>
      );
    
    default:
      return null;
  }
};

export default Index;