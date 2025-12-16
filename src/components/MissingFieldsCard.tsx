import { useState } from 'react';
import { MissingField } from '@/types/deal';
import { Check, Circle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MissingFieldsCardProps {
  fields: MissingField[];
  onFieldResolved: (fieldId: string) => void;
}

export function MissingFieldsCard({ fields, onFieldResolved }: MissingFieldsCardProps) {
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleResolve = async (field: MissingField) => {
    setResolvingId(field.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onFieldResolved(field.id);
    setResolvingId(null);
    
    toast.success(
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-health-healthy" />
        <span>Issue resolved – Data quality +{field.impact}</span>
      </div>
    );
  };

  const unresolvedFields = fields.filter(f => !f.resolved);
  const resolvedFields = fields.filter(f => f.resolved);

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Missing Fields</h3>
        <span className="text-sm text-muted-foreground">
          {resolvedFields.length}/{fields.length} complete
        </span>
      </div>

      <div className="space-y-3">
        {unresolvedFields.map((field) => (
          <div
            key={field.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50 transition-all hover:border-primary/30"
          >
            <div className="mt-0.5">
              <Circle className="w-5 h-5 text-health-watch" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{field.name}</p>
              <p className="text-sm text-muted-foreground">{field.description}</p>
              <p className="text-xs text-primary mt-1">+{field.impact} pts on completion</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleResolve(field)}
              disabled={resolvingId === field.id}
            >
              {resolvingId === field.id ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                'Fix'
              )}
            </Button>
          </div>
        ))}

        {resolvedFields.map((field) => (
          <div
            key={field.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-health-healthy/10 border border-health-healthy/20"
          >
            <div className="mt-0.5">
              <Check className="w-5 h-5 text-health-healthy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground line-through opacity-60">{field.name}</p>
              <p className="text-sm text-muted-foreground opacity-60">{field.description}</p>
            </div>
            <span className="text-xs text-health-healthy font-medium">✓ Resolved</span>
          </div>
        ))}

        {unresolvedFields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Sparkles className="w-8 h-8 text-health-healthy mb-2" />
            <p className="text-foreground font-medium">All fields complete!</p>
            <p className="text-sm text-muted-foreground">Great job maintaining data quality</p>
          </div>
        )}
      </div>
    </div>
  );
}
