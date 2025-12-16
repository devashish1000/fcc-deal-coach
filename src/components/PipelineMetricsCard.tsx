import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { PipelineMetrics } from '@/types/deal';
import { MetricCard, StatRow } from './MetricCard';

interface PipelineMetricsCardProps {
  metrics: PipelineMetrics;
}

export function PipelineMetricsCard({ metrics }: PipelineMetricsCardProps) {
  const coverageColor = metrics.coverage >= 3 ? 'text-health-healthy' : 
                        metrics.coverage >= 2 ? 'text-health-watch' : 
                        'text-health-at-risk';

  return (
    <MetricCard title="Pipeline Coverage" icon={TrendingUp} delay={300}>
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${coverageColor}`}>
            {metrics.coverage}x
          </span>
          <span className="text-sm text-muted-foreground">coverage</span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Days</p>
              <p className="font-semibold text-foreground">{metrics.avgDaysInStage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-health-at-risk" />
            <div>
              <p className="text-sm text-muted-foreground">At Risk</p>
              <p className="font-semibold text-health-at-risk">{metrics.dealsAtRisk}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="metric-label">Total Pipeline Value</p>
          <p className="text-2xl font-bold text-foreground">
            ${(metrics.totalValue / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs text-muted-foreground">
            vs ${(metrics.quota / 1000000).toFixed(1)}M quota
          </p>
        </div>
      </div>
    </MetricCard>
  );
}
