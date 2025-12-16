import { Database, TrendingUp, TrendingDown } from 'lucide-react';
import { DataQualityMetrics } from '@/types/deal';
import { MetricCard, ProgressBar } from './MetricCard';

interface DataQualityCardProps {
  metrics: DataQualityMetrics;
}

export function DataQualityCard({ metrics }: DataQualityCardProps) {
  const TrendIcon = metrics.trend >= 0 ? TrendingUp : TrendingDown;
  const trendColor = metrics.trend >= 0 ? 'text-health-healthy' : 'text-health-at-risk';

  return (
    <MetricCard title="Data Quality" icon={Database} delay={700}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-4xl font-bold text-foreground">{metrics.score}</span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {metrics.trend > 0 ? '+' : ''}{metrics.trend}%
            </span>
          </div>
        </div>

        <ProgressBar 
          value={metrics.score} 
          max={100} 
          color={metrics.score >= 80 ? 'healthy' : metrics.score >= 60 ? 'watch' : 'at-risk'}
          showLabel={false}
        />

        <div className="pt-3 border-t border-border/50">
          <p className="text-sm font-medium text-foreground mb-2">Top Issues</p>
          <ul className="space-y-1.5">
            {metrics.issues.map((issue, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-health-watch" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MetricCard>
  );
}
