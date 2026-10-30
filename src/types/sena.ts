export type UserRole = 'apprentice' | 'instructor';

export interface ApprenticeProfile {
  id: string;
  name: string;
  username?: string;
  password?: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PEP';
  documentNumber: string;
  email: string;
  ficha: string;
  programName: string;
  center: string;
  regional: string;
  completedModules: string[]; // e.g. ['identidad', 'reglamento', 'bienestar', 'evaluacion']
  quizScore?: number;
  quizTotal?: number;
  quizStatus?: 'passed' | 'failed' | 'not_taken';
  quizDate?: string;
  certificateId?: string;
}

export interface InstructorProfile {
  id: string;
  name: string;
  username?: string;
  password?: string;
  documentType?: 'CC' | 'TI' | 'CE' | 'PEP';
  documentNumber?: string;
  roleTitle: string;
  center: string;
  regional: string;
  email: string;
  assignedFichas: string[];
}

export interface InstitutionalSymbol {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  elements: { name: string; meaning: string }[];
  details: string;
}

export interface AnthemVerse {
  type: 'coro' | 'estrofa';
  number?: number;
  text: string[];
}

export interface EthicValue {
  name: string;
  tagline: string;
  description: string;
  apprenticeApplication: string;
}

export interface RightOrDuty {
  id: string;
  chapter: 'Capítulo I' | 'Capítulo II' | 'Capítulo III' | 'Capítulo IV' | 'Capítulo V';
  chapterTitle: string;
  category: 'principio' | 'derecho' | 'estimulo' | 'deber' | 'prohibicion' | 'falta_sancion' | 'tramite' | 'certificacion';
  article: string;
  title: string;
  summary: string;
  practicalExample: string;
  severity?: 'leve' | 'grave' | 'gravisima';
}

export interface CaseDilemma {
  id: string;
  title: string;
  situation: string;
  involvedActors: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
    applicableArticle: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  category: 'identidad' | 'reglamento' | 'etapas' | 'bienestar';
  categoryLabel: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  regulationSource: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  date: string;
  timeSpentSeconds: number;
}

export interface CohortStats {
  ficha: string;
  program: string;
  totalLearners: number;
  completedInduction: number;
  inProgress: number;
  averageScore: number;
  passRate: number;
}
