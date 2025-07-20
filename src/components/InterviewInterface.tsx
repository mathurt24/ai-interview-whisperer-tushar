import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Play, Square, Volume2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface InterviewInterfaceProps {
  candidateName: string;
  jobRole: string;
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
}

export default function InterviewInterface({ 
  candidateName, 
  jobRole, 
  questions, 
  onComplete 
}: InterviewInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript + ' ');
        }
      };

      recognitionRef.current.onerror = () => {
        toast({
          title: "Speech Recognition Error",
          description: "Please check your microphone and try again.",
          variant: "destructive"
        });
        setIsRecording(false);
      };
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [toast]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      setIsRecording(true);
      setTimeElapsed(0);
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      toast({
        title: "Recording Started",
        description: "Speak your answer clearly. Click stop when finished.",
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to continue with the interview.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const evaluateAnswer = (questionText: string, answerText: string): { score: number; feedback: string } => {
    const words = answerText.trim().split(' ');
    const wordCount = words.length;
    const questionLower = questionText.toLowerCase();
    const answerLower = answerText.toLowerCase();
    
    let score = 0;
    let feedback = "";
    
    // Base completeness scoring
    if (wordCount < 20) {
      score = Math.random() * 3 + 1; // 1-4
      feedback = "Answer too brief. Needs more detail and examples.";
    } else if (wordCount < 50) {
      score = Math.random() * 3 + 3; // 3-6
      feedback = "Basic answer provided. Could elaborate with more specific examples.";
    } else if (wordCount < 100) {
      score = Math.random() * 3 + 5; // 5-8
      feedback = "Good detailed response. Shows understanding of the topic.";
    } else {
      score = Math.random() * 2 + 7; // 7-9
      feedback = "Comprehensive answer with excellent detail and examples.";
    }
    
    // Technical question evaluation
    if (currentQuestion.type === 'technical') {
      const techKeywords = ['react', 'javascript', 'component', 'function', 'api', 'database', 'algorithm', 'performance', 'optimization', 'testing', 'debug', 'framework', 'library', 'async', 'promise'];
      const foundKeywords = techKeywords.filter(keyword => answerLower.includes(keyword));
      
      if (foundKeywords.length >= 3) {
        score += 1;
      } else if (foundKeywords.length === 0) {
        score = Math.max(score - 2, 1);
        feedback = "Answer lacks technical depth. Include specific technical concepts and examples.";
      }
      
      // Check for code examples or technical specifics
      if (answerLower.includes('example') || answerLower.includes('for instance') || answerLower.includes('like when')) {
        score += 0.5;
      }
    }
    
    // Behavioral question evaluation
    if (currentQuestion.type === 'behavioral') {
      const behavioralKeywords = ['team', 'challenge', 'conflict', 'leadership', 'communication', 'problem', 'solution', 'collaboration', 'responsibility', 'goal'];
      const foundKeywords = behavioralKeywords.filter(keyword => answerLower.includes(keyword));
      
      if (foundKeywords.length >= 2) {
        score += 1;
      }
      
      // STAR method indicators
      const starIndicators = ['situation', 'task', 'action', 'result', 'when', 'what i did', 'outcome', 'learned'];
      const foundSTAR = starIndicators.filter(indicator => answerLower.includes(indicator));
      
      if (foundSTAR.length >= 2) {
        score += 1;
        feedback = "Good use of specific examples and structured response.";
      } else {
        feedback = "Consider using specific examples with situation, action, and results.";
      }
    }
    
    // Cap the score and add some randomness for realism
    score = Math.min(Math.max(score + (Math.random() * 0.8 - 0.4), 1), 10);
    score = Math.round(score * 10) / 10; // Round to 1 decimal
    
    return { score, feedback };
  };

  const submitAnswer = () => {
    if (!transcript.trim()) {
      toast({
        title: "No Answer Recorded",
        description: "Please record your answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    const evaluation = evaluateAnswer(currentQuestion.question, transcript);
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      transcript: transcript.trim(),
      score: evaluation.score,
      feedback: evaluation.feedback
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setTranscript("");
    setTimeElapsed(0);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      toast({
        title: "Answer Submitted",
        description: `Score: ${evaluation.score}/10 - Moving to next question.`,
      });
    } else {
      onComplete(updatedAnswers);
    }
  };

  const retakeAnswer = () => {
    setTranscript("");
    setTimeElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-interview-calm to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0" style={{ background: 'var(--gradient-card)' }}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Interview with <span className="text-primary">{candidateName}</span>
            </CardTitle>
            <p className="text-muted-foreground">Position: {jobRole}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="outline">Question {currentQuestionIndex + 1} of {questions.length}</Badge>
              <Badge variant={currentQuestion.type === 'technical' ? 'default' : 'secondary'}>
                {currentQuestion.type === 'technical' ? 'Technical' : 'Behavioral'}
              </Badge>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Question */}
        <Card className="border-0 shadow-lg" style={{ background: 'var(--gradient-card)' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Current Question</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakQuestion(currentQuestion.question)}
                disabled={isPlaying}
              >
                {isPlaying ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isPlaying ? 'Playing...' : 'Play Question'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{currentQuestion.question}</p>
          </CardContent>
        </Card>

        {/* Recording Interface */}
        <Card className="border-0 shadow-lg" style={{ background: 'var(--gradient-card)' }}>
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                onClick={isRecording ? stopRecording : startRecording}
                className="flex items-center gap-2"
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              
              {transcript && (
                <Button
                  variant="outline"
                  onClick={retakeAnswer}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake
                </Button>
              )}
            </div>

            {isRecording && (
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-destructive">
                  {formatTime(timeElapsed)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Recording in progress...</p>
              </div>
            )}

            {transcript && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Your Transcript:</h4>
                  <p className="text-sm leading-relaxed">{transcript}</p>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={submitAnswer}
                    className="bg-gradient-to-r from-interview-success to-secondary hover:opacity-90 transition-all duration-300"
                  >
                    Submit Answer & Continue
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Global speech recognition type definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}