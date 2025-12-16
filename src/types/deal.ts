export type HealthStatus = 'healthy' | 'watch' | 'at-risk';
export type UserRole = 'rep' | 'manager' | 'ops';

export interface MissingField {
  id: string;
  name: string;
  description: string;
  resolved: boolean;
  impact: number;
}

export interface DealHealth {
  score: number;
  status: HealthStatus;
  missingFields: MissingField[];
  trend: 'up' | 'down' | 'stable';
}

export interface TerritoryMetrics {
  coverage: number;
  quota: number;
  accounts: number;
  opportunities: number;
}

export interface PipelineMetrics {
  coverage: number;
  quota: number;
  avgDaysInStage: number;
  totalValue: number;
  dealsAtRisk: number;
}

export interface LeadMetrics {
  mqls: number;
  sqls: number;
  conversionRate: number;
  avgTimeToConvert: number;
}

export interface ProcessMetrics {
  completionRate: number;
  automatedTasks: number;
  manualTasks: number;
  automationOpportunities: string[];
}

export interface PricingMetrics {
  avgMarginImpact: number;
  dealsNeedingReview: number;
  discountUsage: number;
}

export interface DataQualityMetrics {
  score: number;
  trend: number;
  issues: string[];
}

export interface MarketMetrics {
  topSegments: { name: string; penetration: number }[];
  underPenetrated: string[];
}

export interface OnboardingMetrics {
  progress: number;
  completedModules: number;
  totalModules: number;
  nextModule: string;
}

export interface TeamMetrics {
  repsMissingFields: number;
  totalReps: number;
  topFrictionPoints: { name: string; count: number }[];
  pipelineCoverage: number;
  avgDealAge: number;
  avgMarginImpact: number;
  automationRatio: number;
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  stage: string;
  health: DealHealth;
  owner: string;
  account: string;
  closeDate: string;
  daysInStage: number;
}
