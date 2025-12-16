import { DollarSign, AlertCircle } from 'lucide-react';
import { PricingMetrics } from '@/types/deal';
import { MetricCard, ProgressBar } from './MetricCard';

interface PricingMetricsCardProps {
  metrics: PricingMetrics;
}

export function PricingMetricsCard({ metrics }: PricingMetricsCardProps) {
  const impactColor = metrics.avgMarginImpact >= 0 ? 'text-health-healthy' : 
                      metrics.avgMarginImpact >= -5 ? 'text-health-watch' : 
                      'text-health-at-risk';

  return (
    <MetricCard title="Pricing & Margin" icon={DollarSign} delay={600}>
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${impactColor}`}>
            {metrics.avgMarginImpact > 0 ? '+' : ''}{metrics.avgMarginImpact}%
          </span>
          <span className="text-sm text-muted-foreground">margin impact</span>
        </div>

        <div className="py-3 border-y border-border/50">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">Discount Usage</span>
            <span className="text-sm font-medium text-foreground">{metrics.discountUsage}%</span>
          </div>
          <ProgressBar 
            value={metrics.discountUsage} 
            max={25} 
            color={metrics.discountUsage <= 10 ? 'healthy' : metrics.discountUsage <= 15 ? 'watch' : 'at-risk'}
            showLabel={false}
          />
          <p className="text-xs text-muted-foreground mt-1">of max 25% allowed</p>
        </div>

        {metrics.dealsNeedingReview > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-health-watch/10 border border-health-watch/30">
            <AlertCircle className="w-4 h-4 text-health-watch shrink-0" />
            <span className="text-sm text-health-watch">
              {metrics.dealsNeedingReview} deal{metrics.dealsNeedingReview > 1 ? 's' : ''} need Finance review
            </span>
          </div>
        )}
      </div>
    </MetricCard>
  );
}
