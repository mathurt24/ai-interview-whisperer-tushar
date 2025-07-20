import { useState } from "react";
import CandidateForm from "@/components/CandidateForm";
import InterviewInterface from "@/components/InterviewInterface";
import InterviewSummary from "@/components/InterviewSummary";
import { generateQuestions } from "@/lib/questionGenerator";

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

type InterviewStage = "form" | "interview" | "summary";

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

  switch (stage) {
    case "form":
      return <CandidateForm onSubmit={handleFormSubmit} />;
    
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
    
    default:
      return null;
  }
};

export default Index;
