import { Deal, TerritoryMetrics, PipelineMetrics, LeadMetrics, ProcessMetrics, PricingMetrics, DataQualityMetrics, MarketMetrics, OnboardingMetrics, TeamMetrics, MissingField } from '@/types/deal';

export const mockMissingFields: MissingField[] = [
  { id: '1', name: 'Next Step', description: 'Define the next action to progress this deal', resolved: false, impact: 10 },
  { id: '2', name: 'Close Plan', description: 'Document the strategy to close this opportunity', resolved: false, impact: 15 },
  { id: '3', name: 'Primary Contact', description: 'Identify the key decision maker', resolved: true, impact: 8 },
  { id: '4', name: 'Forecast Category', description: 'Categorize deal for accurate forecasting', resolved: false, impact: 12 },
];

export const mockDeal: Deal = {
  id: '1',
  name: 'Enterprise Cloud Migration - Acme Corp',
  value: 450000,
  stage: 'Negotiation',
  health: {
    score: 72,
    status: 'watch',
    missingFields: mockMissingFields,
    trend: 'up',
  },
  owner: 'Sarah Johnson',
  account: 'Acme Corporation',
  closeDate: '2025-01-15',
  daysInStage: 14,
};

export const mockTerritoryMetrics: TerritoryMetrics = {
  coverage: 78,
  quota: 1200000,
  accounts: 45,
  opportunities: 23,
};

export const mockPipelineMetrics: PipelineMetrics = {
  coverage: 3.2,
  quota: 500000,
  avgDaysInStage: 18,
  totalValue: 1600000,
  dealsAtRisk: 4,
};

export const mockLeadMetrics: LeadMetrics = {
  mqls: 156,
  sqls: 42,
  conversionRate: 27,
  avgTimeToConvert: 12,
};

export const mockProcessMetrics: ProcessMetrics = {
  completionRate: 84,
  automatedTasks: 127,
  manualTasks: 43,
  automationOpportunities: [
    'Contract generation from templates',
    'Proposal approval routing',
    'Meeting scheduling follow-ups',
  ],
};

export const mockPricingMetrics: PricingMetrics = {
  avgMarginImpact: -4.2,
  dealsNeedingReview: 3,
  discountUsage: 12,
};

export const mockDataQualityMetrics: DataQualityMetrics = {
  score: 78,
  trend: 5,
  issues: ['Missing industry tags', 'Outdated contact info', 'Incomplete company data'],
};

export const mockMarketMetrics: MarketMetrics = {
  topSegments: [
    { name: 'Enterprise Tech', penetration: 45 },
    { name: 'Healthcare', penetration: 32 },
    { name: 'Financial Services', penetration: 28 },
  ],
  underPenetrated: ['Manufacturing', 'Retail', 'Education'],
};

export const mockOnboardingMetrics: OnboardingMetrics = {
  progress: 65,
  completedModules: 8,
  totalModules: 12,
  nextModule: 'Advanced Negotiation Techniques',
};

export const mockTeamMetrics: TeamMetrics = {
  repsMissingFields: 8,
  totalReps: 12,
  topFrictionPoints: [
    { name: 'Legal Review Delays', count: 15 },
    { name: 'Pricing Approvals', count: 12 },
    { name: 'Technical Validation', count: 8 },
  ],
  pipelineCoverage: 2.8,
  avgDealAge: 34,
  avgMarginImpact: -3.8,
  automationRatio: 0.74,
};

export const mockDeals: Deal[] = [
  mockDeal,
  {
    id: '2',
    name: 'Digital Transformation - TechStart Inc',
    value: 280000,
    stage: 'Discovery',
    health: {
      score: 89,
      status: 'healthy',
      missingFields: [],
      trend: 'stable',
    },
    owner: 'Sarah Johnson',
    account: 'TechStart Inc',
    closeDate: '2025-02-28',
    daysInStage: 7,
  },
  {
    id: '3',
    name: 'Platform Migration - GlobalBank',
    value: 750000,
    stage: 'Proposal',
    health: {
      score: 45,
      status: 'at-risk',
      missingFields: mockMissingFields.slice(0, 3),
      trend: 'down',
    },
    owner: 'Mike Chen',
    account: 'GlobalBank Financial',
    closeDate: '2025-01-30',
    daysInStage: 28,
  },
];
