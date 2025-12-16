import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendedActionProps {
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
  onAction?: () => void;
}

export function RecommendedAction({ title, description, priority = 'medium', onAction }: RecommendedActionProps) {
  const priorityConfig = {
    high: {
      border: 'border-health-at-risk/50',
      bg: 'bg-health-at-risk/10',
      badge: 'bg-health-at-risk/20 text-health-at-risk',
    },
    medium: {
      border: 'border-health-watch/50',
      bg: 'bg-health-watch/10',
      badge: 'bg-health-watch/20 text-health-watch',
    },
    low: {
      border: 'border-primary/50',
      bg: 'bg-primary/10',
      badge: 'bg-primary/20 text-primary',
    },
  };

  const config = priorityConfig[priority];

  return (
    <div className={`glass-card p-4 ${config.border} ${config.bg} animate-fade-in`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-background/50">
          <Lightbulb className="w-5 h-5 text-health-watch" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
              {priority}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {onAction && (
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 text-primary hover:text-primary hover:bg-primary/10"
            onClick={onAction}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
