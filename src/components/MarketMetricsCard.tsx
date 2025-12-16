import { PieChart, Target } from 'lucide-react';
import { MarketMetrics } from '@/types/deal';
import { MetricCard, ProgressBar } from './MetricCard';

interface MarketMetricsCardProps {
  metrics: MarketMetrics;
}

export function MarketMetricsCard({ metrics }: MarketMetricsCardProps) {
  return (
    <MetricCard title="Market Segments" icon={PieChart} delay={800}>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Top Segments by Penetration</p>
          <div className="space-y-3">
            {metrics.topSegments.map((segment, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{segment.name}</span>
                  <span className="text-sm font-medium text-foreground">{segment.penetration}%</span>
                </div>
                <ProgressBar 
                  value={segment.penetration} 
                  max={100} 
                  color={i === 0 ? 'primary' : 'watch'}
                  showLabel={false}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Under-Penetrated</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {metrics.underPenetrated.map((segment, i) => (
              <span 
                key={i}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30"
              >
                {segment}
              </span>
            ))}
          </div>
        </div>
      </div>
    </MetricCard>
  );
}
