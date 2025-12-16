import { MapPin } from 'lucide-react';
import { TerritoryMetrics } from '@/types/deal';
import { MetricCard, ProgressBar, StatRow } from './MetricCard';

interface TerritoryMetricsCardProps {
  metrics: TerritoryMetrics;
}

export function TerritoryMetricsCard({ metrics }: TerritoryMetricsCardProps) {
  const coveragePercent = Math.round((metrics.coverage / 100) * 100);
  
  return (
    <MetricCard title="Territory & Quota" icon={MapPin} delay={200}>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">Coverage vs Quota</span>
            <span className="text-sm font-medium text-foreground">{metrics.coverage}%</span>
          </div>
          <ProgressBar 
            value={metrics.coverage} 
            max={100} 
            color={metrics.coverage >= 80 ? 'healthy' : metrics.coverage >= 60 ? 'watch' : 'at-risk'}
            showLabel={false}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div>
            <p className="metric-label">Accounts</p>
            <p className="text-2xl font-bold text-foreground">{metrics.accounts}</p>
          </div>
          <div>
            <p className="metric-label">Opportunities</p>
            <p className="text-2xl font-bold text-foreground">{metrics.opportunities}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border/50">
          <p className="metric-label">Quota Target</p>
          <p className="text-lg font-semibold text-foreground">
            ${(metrics.quota / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>
    </MetricCard>
  );
}
