interface Question {
  id: number;
  question: string;
  type: "technical" | "behavioral";
}

interface CandidateData {
  name: string;
  phone: string;
  jobRole: string;
  resumeText: string;
}

// Mock question database - in real implementation, this would be AI-generated
const questionBank = {
  "Frontend Developer": {
    technical: [
      "Explain the virtual DOM in React and how it improves performance.",
      "What's the difference between let, const, and var in JavaScript?",
      "How do you handle state management in a large React application?",
      "Describe CSS specificity and how it affects styling.",
      "What are React hooks and why were they introduced?",
      "How do you optimize the performance of a React application?",
      "Explain the concept of closures in JavaScript with an example.",
      "What is the difference between controlled and uncontrolled components?",
    ],
    behavioral: [
      "Describe a challenging bug you fixed and how you approached it.",
      "Tell me about a time you had to work with a difficult team member.",
      "How do you stay updated with the latest frontend technologies?",
      "Describe a project where you had to learn a new technology quickly.",
      "Tell me about a time you disagreed with a design decision.",
    ]
  },
  "Backend Developer": {
    technical: [
      "Explain the difference between SQL and NoSQL databases.",
      "How do you handle authentication and authorization in APIs?",
      "What are microservices and what are their advantages?",
      "Describe how you would design a RESTful API.",
      "How do you ensure data consistency in distributed systems?",
      "What is database indexing and why is it important?",
      "Explain the concept of caching and different caching strategies.",
      "How do you handle error handling in backend applications?",
    ],
    behavioral: [
      "Describe a time when you had to optimize a slow database query.",
      "Tell me about a system design challenge you faced.",
      "How do you approach debugging complex backend issues?",
      "Describe a time you had to make a trade-off between performance and maintainability.",
      "Tell me about a time you had to handle a production incident.",
    ]
  },
  "Full Stack Developer": {
    technical: [
      "How do you ensure data consistency between frontend and backend?",
      "Explain the differences between server-side and client-side rendering.",
      "How do you handle authentication across the full stack?",
      "Describe your approach to API design and documentation.",
      "How do you manage state in a full-stack application?",
      "What strategies do you use for testing full-stack applications?",
      "How do you handle real-time data synchronization?",
      "Explain the concept of progressive web applications.",
    ],
    behavioral: [
      "Describe a full-stack project you built from scratch.",
      "How do you prioritize between frontend and backend tasks?",
      "Tell me about a time you had to make architectural decisions.",
      "Describe how you collaborate with designers and other developers.",
      "Tell me about a challenging integration you implemented.",
    ]
  },
  "QA Engineer": {
    technical: [
      "What's the difference between unit, integration, and end-to-end testing?",
      "How do you design test cases for a new feature?",
      "Explain the concept of test automation and its benefits.",
      "How do you handle flaky tests in automated test suites?",
      "What tools do you use for performance testing?",
      "Describe your approach to API testing.",
      "How do you ensure test coverage without over-testing?",
      "What is the testing pyramid and how do you apply it?",
    ],
    behavioral: [
      "Describe a critical bug you found and how you reported it.",
      "Tell me about a time you had to advocate for quality improvements.",
      "How do you handle pressure to skip testing due to tight deadlines?",
      "Describe your experience working with development teams.",
      "Tell me about a time you improved a testing process.",
    ]
  },
  "DevOps Engineer": {
    technical: [
      "Explain the concept of Infrastructure as Code.",
      "How do you handle secrets management in CI/CD pipelines?",
      "What's the difference between containers and virtual machines?",
      "Describe your approach to monitoring and alerting.",
      "How do you implement blue-green deployments?",
      "What strategies do you use for backup and disaster recovery?",
      "Explain the concept of immutable infrastructure.",
      "How do you handle scaling applications automatically?",
    ],
    behavioral: [
      "Describe a time you resolved a critical production incident.",
      "Tell me about a complex deployment you managed.",
      "How do you balance automation with manual processes?",
      "Describe your experience with cloud migration projects.",
      "Tell me about a time you improved system reliability.",
    ]
  }
};

const defaultQuestions = {
  technical: [
    "Describe your experience with the technologies mentioned in your resume.",
    "How do you approach learning new technologies or frameworks?",
    "Walk me through your problem-solving process for technical challenges.",
    "What development tools and practices do you find most valuable?",
  ],
  behavioral: [
    "Tell me about a challenging project you worked on recently.",
    "Describe a time you had to work under pressure or tight deadlines.",
    "How do you handle constructive criticism or feedback?",
    "Tell me about a time you had to collaborate with a difficult colleague.",
  ]
};

export function generateQuestions(candidateData: CandidateData): Question[] {
  const { jobRole, resumeText } = candidateData;
  
  // Get role-specific questions or fall back to defaults
  const roleQuestions = questionBank[jobRole as keyof typeof questionBank] || defaultQuestions;
  
  // Analyze resume for keywords to personalize questions
  const resumeLower = resumeText.toLowerCase();
  const technologies = [
    'react', 'angular', 'vue', 'javascript', 'typescript', 'node.js', 'python', 
    'java', 'spring', 'docker', 'kubernetes', 'aws', 'azure', 'mongodb', 
    'postgresql', 'redis', 'elasticsearch', 'jenkins', 'git'
  ];
  
  const foundTechnologies = technologies.filter(tech => resumeLower.includes(tech));
  
  // Select 4 technical questions and 1 behavioral question
  const shuffledTechnical = [...roleQuestions.technical].sort(() => Math.random() - 0.5);
  const shuffledBehavioral = [...roleQuestions.behavioral].sort(() => Math.random() - 0.5);
  
  const selectedQuestions: Question[] = [
    ...shuffledTechnical.slice(0, 4).map((q, i) => ({
      id: i + 1,
      question: q,
      type: "technical" as const
    })),
    {
      id: 5,
      question: shuffledBehavioral[0],
      type: "behavioral" as const
    }
  ];
  
  // Personalize first question if specific technologies are found
  if (foundTechnologies.length > 0 && selectedQuestions[0]) {
    const techList = foundTechnologies.slice(0, 3).join(', ');
    selectedQuestions[0].question = `I see you have experience with ${techList}. ${selectedQuestions[0].question}`;
  }
  
  return selectedQuestions;
}