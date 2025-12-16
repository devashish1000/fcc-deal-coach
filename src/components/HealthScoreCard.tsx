import { DealHealth, HealthStatus } from '@/types/deal';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

interface HealthScoreCardProps {
  health: DealHealth;
  dealName: string;
}

const getStatusConfig = (status: HealthStatus) => {
  switch (status) {
    case 'healthy':
      return {
        label: 'Healthy',
        icon: CheckCircle2,
        className: 'health-healthy',
        ringColor: 'stroke-health-healthy',
        bgGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      };
    case 'watch':
      return {
        label: 'Watch',
        icon: AlertTriangle,
        className: 'health-watch',
        ringColor: 'stroke-health-watch',
        bgGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
      };
    case 'at-risk':
      return {
        label: 'At Risk',
        icon: AlertCircle,
        className: 'health-at-risk',
        ringColor: 'stroke-health-at-risk',
        bgGlow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
      };
  }
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-health-healthy" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-health-at-risk" />;
    case 'stable':
      return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

export function HealthScoreCard({ health, dealName }: HealthScoreCardProps) {
  const config = getStatusConfig(health.status);
  const StatusIcon = config.icon;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (health.score / 100) * circumference;

  return (
    <div className={`glass-card p-6 ${config.bgGlow} animate-fade-in`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Deal Health</h2>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{dealName}</p>
        </div>
        <div className={`health-badge ${config.className}`}>
          <StatusIcon className="w-4 h-4" />
          {config.label}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-secondary"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={config.ringColor}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: 'stroke-dashoffset 1s ease-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="metric-value">{health.score}</span>
            <span className="text-xs text-muted-foreground">Score</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Trend</span>
            {getTrendIcon(health.trend)}
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Missing Fields</span>
            <p className="text-xl font-semibold text-foreground">
              {health.missingFields.filter(f => !f.resolved).length}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Potential Gain</span>
            <p className="text-primary font-medium">
              +{health.missingFields.filter(f => !f.resolved).reduce((acc, f) => acc + f.impact, 0)} pts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
