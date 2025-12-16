import { GraduationCap, ArrowRight } from 'lucide-react';
import { OnboardingMetrics } from '@/types/deal';
import { MetricCard, ProgressBar } from './MetricCard';
import { Button } from '@/components/ui/button';

interface OnboardingCardProps {
  metrics: OnboardingMetrics;
}

export function OnboardingCard({ metrics }: OnboardingCardProps) {
  return (
    <MetricCard title="Onboarding Progress" icon={GraduationCap} delay={900}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-4xl font-bold text-primary">{metrics.progress}%</span>
            <p className="text-sm text-muted-foreground">complete</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {metrics.completedModules}/{metrics.totalModules}
            </p>
            <p className="text-sm text-muted-foreground">modules</p>
          </div>
        </div>

        <ProgressBar 
          value={metrics.progress} 
          max={100} 
          color="primary"
          showLabel={false}
        />

        <div className="pt-3 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Next Module</p>
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
            <span className="text-sm font-medium text-foreground">{metrics.nextModule}</span>
            <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/20">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </MetricCard>
  );
}
