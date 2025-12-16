import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
  delay?: number;
}

export function MetricCard({ title, icon: Icon, children, action, delay = 0 }: MetricCardProps) {
  return (
    <div 
      className="glass-card-hover p-5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'healthy' | 'watch' | 'at-risk';
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, color = 'primary', showLabel = true }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    primary: 'bg-primary',
    healthy: 'bg-health-healthy',
    watch: 'bg-health-watch',
    'at-risk': 'bg-health-at-risk',
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{value}</span>
          <span className="text-muted-foreground">/ {max}</span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          className={`progress-fill ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatRow({ label, value, subtext, trend }: StatRowProps) {
  const trendColors = {
    up: 'text-health-healthy',
    down: 'text-health-at-risk',
    neutral: 'text-muted-foreground',
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className={`font-semibold ${trend ? trendColors[trend] : 'text-foreground'}`}>
          {value}
        </span>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </div>
    </div>
  );
}
