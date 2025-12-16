import { useState } from 'react';
import { UserRole, MissingField } from '@/types/deal';
import { Header } from '@/components/Header';
import { HealthScoreCard } from '@/components/HealthScoreCard';
import { MissingFieldsCard } from '@/components/MissingFieldsCard';
import { RecommendedAction } from '@/components/RecommendedAction';
import { TerritoryMetricsCard } from '@/components/TerritoryMetricsCard';
import { PipelineMetricsCard } from '@/components/PipelineMetricsCard';
import { LeadMetricsCard } from '@/components/LeadMetricsCard';
import { ProcessMetricsCard } from '@/components/ProcessMetricsCard';
import { PricingMetricsCard } from '@/components/PricingMetricsCard';
import { DataQualityCard } from '@/components/DataQualityCard';
import { MarketMetricsCard } from '@/components/MarketMetricsCard';
import { OnboardingCard } from '@/components/OnboardingCard';
import { OpsInsightsPanel } from '@/components/OpsInsightsPanel';
import {
  mockDeal,
  mockTerritoryMetrics,
  mockPipelineMetrics,
  mockLeadMetrics,
  mockProcessMetrics,
  mockPricingMetrics,
  mockDataQualityMetrics,
  mockMarketMetrics,
  mockOnboardingMetrics,
  mockTeamMetrics,
  mockMissingFields,
} from '@/data/mockData';

const Index = () => {
  const [role, setRole] = useState<UserRole>('rep');
  const [missingFields, setMissingFields] = useState<MissingField[]>(mockMissingFields);
  const [dataQualityScore, setDataQualityScore] = useState(mockDataQualityMetrics.score);

  const handleFieldResolved = (fieldId: string) => {
    setMissingFields(prev =>
      prev.map(f => (f.id === fieldId ? { ...f, resolved: true } : f))
    );
    const field = missingFields.find(f => f.id === fieldId);
    if (field) {
      setDataQualityScore(prev => Math.min(100, prev + field.impact));
    }
  };

  const healthScore = {
    ...mockDeal.health,
    score: Math.min(100, mockDeal.health.score + missingFields.filter(f => f.resolved).reduce((acc, f) => acc + f.impact, 0)),
    missingFields,
  };

  const isManager = role === 'manager' || role === 'ops';
  const showOnboarding = role === 'rep'; // Simulating new rep

  return (
    <div className="min-h-screen bg-background">
      <Header role={role} onRoleChange={setRole} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Top Section: Health Score and Missing Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthScoreCard health={healthScore} dealName={mockDeal.name} />
          <MissingFieldsCard fields={missingFields} onFieldResolved={handleFieldResolved} />
        </div>

        {/* Recommended Action */}
        <RecommendedAction
          title="Complete Close Plan"
          description="Adding a close plan will improve deal visibility and increase your health score by 15 points. This is critical for accurate forecasting."
          priority="high"
          onAction={() => {}}
        />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <TerritoryMetricsCard metrics={mockTerritoryMetrics} />
          <PipelineMetricsCard metrics={mockPipelineMetrics} />
          <LeadMetricsCard metrics={mockLeadMetrics} />
          <ProcessMetricsCard metrics={mockProcessMetrics} />
          <PricingMetricsCard metrics={mockPricingMetrics} />
          <DataQualityCard metrics={{ ...mockDataQualityMetrics, score: dataQualityScore }} />
          <MarketMetricsCard metrics={mockMarketMetrics} />
          {showOnboarding && <OnboardingCard metrics={mockOnboardingMetrics} />}
        </div>

        {/* Ops Insights - Manager/Ops Only */}
        {isManager && (
          <OpsInsightsPanel metrics={mockTeamMetrics} />
        )}
      </main>
    </div>
  );
};

export default Index;
