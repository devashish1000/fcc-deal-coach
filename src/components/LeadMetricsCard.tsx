import { Users, ArrowRight } from 'lucide-react';
import { LeadMetrics } from '@/types/deal';
import { MetricCard, ProgressBar } from './MetricCard';

interface LeadMetricsCardProps {
  metrics: LeadMetrics;
}

export function LeadMetricsCard({ metrics }: LeadMetricsCardProps) {
  return (
    <MetricCard title="Lead Maturation" icon={Users} delay={400}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{metrics.mqls}</p>
            <p className="text-xs text-muted-foreground">MQLs</p>
          </div>
          <ArrowRight className="w-5 h-5 text-primary" />
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{metrics.sqls}</p>
            <p className="text-xs text-muted-foreground">SQLs</p>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">Conversion Rate</span>
            <span className="text-sm font-semibold text-health-healthy">{metrics.conversionRate}%</span>
          </div>
          <ProgressBar 
            value={metrics.conversionRate} 
            max={100} 
            color="healthy"
            showLabel={false}
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <span className="text-sm text-muted-foreground">Avg Time to Convert</span>
          <span className="font-semibold text-foreground">{metrics.avgTimeToConvert} days</span>
        </div>
      </div>
    </MetricCard>
  );
}
