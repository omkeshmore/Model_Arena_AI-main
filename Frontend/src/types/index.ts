export interface JudgeRecommendation {
  solution_1_score: number;
  solution_2_score: number;
  solution_1_reasoning: string;
  solution_2_reasoning: string;
  winner?: 'solution_1' | 'solution_2' | 'tie';
}

export interface ComparisonObject {
  id: string;
  problem: string;
  solution_1: string;
  solution_2: string;
  solution_1_model: string;
  solution_2_model: string;
  judge: JudgeRecommendation;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt: string;
}

export type ThemeMode = 'dark' | 'light';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}
