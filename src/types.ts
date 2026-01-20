
export interface ContextData {
  situation: string;
  challenge: string;
}

export interface Scores {
  marketing: number;
  experience: number;
  operations: number;
  pricing: number;
  accomodation: number;
  legal: number;
  mindset: number;
}

export type UserRole = 'user' | 'admin';
export type AppPlan = 'Freemium' | 'Bronze' | 'Silver' | 'Gold';

export interface ReportData {
  strengths: string[];
  opportunities: string[];
  recommendedPlan: AppPlan;
  planJustification: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  plan: AppPlan;
  stripe_customer_id?: string;
  subscription_status?: string;
  email_confirmed?: boolean;
  language?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface PlanConfig {
  id: string; // The Plan Name (PK)
  price: number;
  features: string[]; // List of enabled feature IDs
}

export interface AppSettings {
  show_plan_badges: boolean;
}

// Moved from SidebarComponent to prevent circular dependencies
export interface View {
  id: string;
  title: string;
  icon: string;
  propertyName?: string;
  featureId?: string; // Links this view to a specific feature for badge resolution
}

export interface Property {
  id: string;
  name: string;
  subViews: View[];
}