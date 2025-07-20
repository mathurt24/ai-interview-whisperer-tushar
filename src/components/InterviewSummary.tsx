import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Clock, Star, TrendingUp, TrendingDown, Download, Phone } from "lucide-react";

interface Answer {
  questionId: number;
  transcript: string;
  score: number;
  feedback: string;
}

interface Question {
  id: number;
  question: string;
  type: "technical" | "behavioral";
}

interface InterviewSummary {
  strengths: string;
  improvementAreas: string;
  finalRating: number;
  recommendation: "Hire" | "Maybe" | "No";
}

interface InterviewSummaryProps {
  candidateName: string;
  candidatePhone: string;
  jobRole: string;
  questions: Question[];
  answers: Answer[];
  onStartNew: () => void;
}

export default function InterviewSummary({ 
  candidateName, 
  candidatePhone,
  jobRole, 
  questions, 
  answers, 
  onStartNew 
}: InterviewSummaryProps) {
  
  const generateSummary = (): InterviewSummary => {
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
    const averageScore = totalScore / answers.length;
    
    const technicalAnswers = answers.filter((answer, index) => questions[index]?.type === 'technical');
    const behavioralAnswers = answers.filter((answer, index) => questions[index]?.type === 'behavioral');
    
    const technicalAvg = technicalAnswers.length > 0 ? 
      technicalAnswers.reduce((sum, answer) => sum + answer.score, 0) / technicalAnswers.length : 0;
    const behavioralAvg = behavioralAnswers.length > 0 ? 
      behavioralAnswers.reduce((sum, answer) => sum + answer.score, 0) / behavioralAnswers.length : 0;
    
    // Analyze actual transcript content for personalized feedback
    const allTranscripts = answers.map(answer => answer.transcript).join(' ').toLowerCase();
    const questionTexts = questions.map(q => q.question.toLowerCase());
    
    // Personalized strengths based on actual performance
    const strengthsList = [];
    
    // Technical strengths analysis
    if (technicalAvg >= 7) {
      const techKeywords = ['react', 'javascript', 'component', 'api', 'algorithm', 'performance', 'testing', 'database', 'framework'];
      const mentionedTech = techKeywords.filter(keyword => allTranscripts.includes(keyword));
      if (mentionedTech.length >= 3) {
        strengthsList.push(`Demonstrated solid understanding of ${mentionedTech.slice(0, 3).join(', ')}`);
      } else if (mentionedTech.length > 0) {
        strengthsList.push(`Shows knowledge of ${mentionedTech.join(', ')} concepts`);
      }
      
      if (allTranscripts.includes('example') || allTranscripts.includes('experience')) {
        strengthsList.push("Effectively uses real-world examples to explain concepts");
      }
    }
    
    // Behavioral strengths analysis
    if (behavioralAvg >= 7) {
      if (allTranscripts.includes('team') && allTranscripts.includes('collaboration')) {
        strengthsList.push("Strong team collaboration and communication skills");
      }
      if (allTranscripts.includes('challenge') || allTranscripts.includes('problem')) {
        strengthsList.push("Demonstrates problem-solving mindset and resilience");
      }
      if (allTranscripts.includes('leadership') || allTranscripts.includes('led')) {
        strengthsList.push("Shows leadership potential and initiative");
      }
    }
    
    // Communication analysis
    const avgWordCount = answers.reduce((sum, answer) => sum + answer.transcript.split(' ').length, 0) / answers.length;
    if (avgWordCount > 80) {
      strengthsList.push("Provides comprehensive and detailed responses");
    }
    
    // Score consistency
    const scoreVariance = Math.max(...answers.map(a => a.score)) - Math.min(...answers.map(a => a.score));
    if (scoreVariance <= 2 && averageScore >= 7) {
      strengthsList.push("Consistent performance across different question types");
    }
    
    // Improvement areas based on actual weaknesses
    const improvementsList = [];
    
    if (technicalAvg < 6) {
      const weakTechAreas = [];
      if (questionTexts.some(q => q.includes('react')) && !allTranscripts.includes('react')) {
        weakTechAreas.push("React framework concepts");
      }
      if (questionTexts.some(q => q.includes('javascript')) && !allTranscripts.includes('javascript')) {
        weakTechAreas.push("JavaScript fundamentals");
      }
      if (weakTechAreas.length > 0) {
        improvementsList.push(`Needs deeper understanding of ${weakTechAreas.join(' and ')}`);
      } else {
        improvementsList.push("Technical knowledge requires strengthening with more hands-on practice");
      }
    }
    
    if (behavioralAvg < 6) {
      if (!allTranscripts.includes('situation') && !allTranscripts.includes('result')) {
        improvementsList.push("Should structure answers using STAR method (Situation, Task, Action, Result)");
      }
      if (avgWordCount < 40) {
        improvementsList.push("Responses need more detail and specific examples");
      }
    }
    
    // Specific answer quality issues
    const shortAnswers = answers.filter(a => a.transcript.split(' ').length < 30).length;
    if (shortAnswers >= 2) {
      improvementsList.push("Many answers too brief - provide more comprehensive explanations");
    }
    
    const lowScoreAnswers = answers.filter(a => a.score < 5);
    if (lowScoreAnswers.length >= 2) {
      improvementsList.push("Several key areas need improvement before meeting role requirements");
    }
    
    // Default fallbacks
    const strengths = strengthsList.length > 0 ? strengthsList.join('. ') : "Shows potential and basic understanding of role requirements";
    const improvementAreas = improvementsList.length > 0 ? improvementsList.join('. ') : "Continue developing skills and gaining practical experience";
    
    let recommendation: "Hire" | "Maybe" | "No" = "No";
    if (averageScore >= 7.5) recommendation = "Hire";
    else if (averageScore >= 5.5) recommendation = "Maybe";
    
    return {
      strengths,
      improvementAreas,
      finalRating: Math.round(averageScore * 10) / 10,
      recommendation
    };
  };

  const summary = generateSummary();
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  const maxScore = answers.length * 10;

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "Hire": return "interview-success";
      case "Maybe": return "interview-warning";
      case "No": return "destructive";
      default: return "muted";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "interview-success";
    if (score >= 6) return "interview-warning";
    return "destructive";
  };

  const downloadReport = () => {
    const reportData = {
      candidate: {
        name: candidateName,
        phone: candidatePhone,
        role: jobRole
      },
      interview: {
        date: new Date().toISOString(),
        questions: questions.length,
        totalScore: `${totalScore}/${maxScore}`,
        averageScore: summary.finalRating,
        recommendation: summary.recommendation
      },
      summary: {
        strengths: summary.strengths,
        improvementAreas: summary.improvementAreas
      },
      answers: answers.map((answer, index) => ({
        question: questions[index]?.question || `Question ${index + 1}`,
        type: questions[index]?.type || 'unknown',
        score: answer.score,
        feedback: answer.feedback,
        transcript: answer.transcript
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${candidateName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const callCandidate = () => {
    // In a real implementation, this would trigger a Twilio call
    window.open(`tel:${candidatePhone}`, '_self');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-interview-calm to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0" style={{ background: 'var(--gradient-card)' }}>
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Interview Complete</CardTitle>
            <p className="text-muted-foreground text-lg">
              Summary for <span className="font-semibold text-primary">{candidateName}</span>
            </p>
            <p className="text-sm text-muted-foreground">Position: {jobRole}</p>
          </CardHeader>
        </Card>

        {/* Overall Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 text-center" style={{ background: 'var(--gradient-card)' }}>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{summary.finalRating}/10</div>
              <p className="text-sm text-muted-foreground">Overall Rating</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 text-center" style={{ background: 'var(--gradient-card)' }}>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{totalScore}/{maxScore}</div>
              <p className="text-sm text-muted-foreground">Total Score</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 text-center" style={{ background: 'var(--gradient-card)' }}>
            <CardContent className="pt-6">
              <Badge 
                variant="outline" 
                className={`text-lg px-4 py-2 bg-${getRecommendationColor(summary.recommendation)}/10 border-${getRecommendationColor(summary.recommendation)}`}
              >
                {summary.recommendation}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">Recommendation</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Summary */}
        <Card className="border-0" style={{ background: 'var(--gradient-card)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Interview Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-interview-success mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Key Strengths
              </h4>
              <p className="text-sm leading-relaxed">{summary.strengths}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-interview-warning mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Areas for Improvement
              </h4>
              <p className="text-sm leading-relaxed">{summary.improvementAreas}</p>
            </div>
          </CardContent>
        </Card>

        {/* Question-by-Question Breakdown */}
        <Card className="border-0" style={{ background: 'var(--gradient-card)' }}>
          <CardHeader>
            <CardTitle>Question Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {answers.map((answer, index) => {
              const question = questions[index];
              if (!question) return null;
              
              return (
                <div key={answer.questionId} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={question.type === 'technical' ? 'default' : 'secondary'}>
                          {question.type}
                        </Badge>
                        <Badge variant="outline" className={`bg-${getScoreColor(answer.score)}/10`}>
                          {answer.score}/10
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-2">{question.question}</p>
                      <p className="text-xs text-muted-foreground">{answer.feedback}</p>
                    </div>
                  </div>
                  
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View Transcript
                    </summary>
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      {answer.transcript}
                    </div>
                  </details>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={downloadReport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          
          <Button
            onClick={callCandidate}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Call Candidate
          </Button>
          
          <Button
            onClick={onStartNew}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Start New Interview
          </Button>
        </div>
      </div>
    </div>
  );
}