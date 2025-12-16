import { Settings, Zap } from 'lucide-react';
import { ProcessMetrics } from '@/types/deal';
import { MetricCard, ProgressBar } from './MetricCard';

interface ProcessMetricsCardProps {
  metrics: ProcessMetrics;
}

export function ProcessMetricsCard({ metrics }: ProcessMetricsCardProps) {
  const automationRate = Math.round((metrics.automatedTasks / (metrics.automatedTasks + metrics.manualTasks)) * 100);

  return (
    <MetricCard title="Process Adherence" icon={Settings} delay={500}>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">Completion Rate</span>
            <span className="text-sm font-semibold text-foreground">{metrics.completionRate}%</span>
          </div>
          <ProgressBar 
            value={metrics.completionRate} 
            max={100} 
            color={metrics.completionRate >= 80 ? 'healthy' : 'watch'}
            showLabel={false}
          />
        </div>

        <div className="flex items-center justify-between py-3 border-y border-border/50">
          <div>
            <p className="text-sm text-muted-foreground">Automated</p>
            <p className="text-lg font-semibold text-health-healthy">{metrics.automatedTasks}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-sm text-muted-foreground">Manual</p>
            <p className="text-lg font-semibold text-health-watch">{metrics.manualTasks}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-sm text-muted-foreground">Ratio</p>
            <p className="text-lg font-semibold text-primary">{automationRate}%</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Automation Opportunities</span>
          </div>
          <ul className="space-y-1">
            {metrics.automationOpportunities.slice(0, 2).map((opp, i) => (
              <li key={i} className="text-xs text-muted-foreground pl-4 relative">
                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                {opp}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MetricCard>
  );
}
