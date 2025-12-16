import { TeamMetrics } from '@/types/deal';
import { Users, AlertTriangle, TrendingUp, Clock, DollarSign, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, RadialBarChart, RadialBar } from 'recharts';

interface OpsInsightsPanelProps {
  metrics: TeamMetrics;
}

export function OpsInsightsPanel({ metrics }: OpsInsightsPanelProps) {
  const missingFieldsData = [
    { name: 'Missing', value: metrics.repsMissingFields, fill: 'hsl(var(--health-watch))' },
    { name: 'Complete', value: metrics.totalReps - metrics.repsMissingFields, fill: 'hsl(var(--health-healthy))' },
  ];

  const frictionData = metrics.topFrictionPoints.map(point => ({
    name: point.name.split(' ')[0],
    fullName: point.name,
    count: point.count,
  }));

  const automationData = [
    { name: 'Automation', value: metrics.automationRatio * 100, fill: 'hsl(var(--primary))' },
  ];

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Ops Insights</h2>
          <p className="text-sm text-muted-foreground">Team-level metrics and performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Reps Missing Fields */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Reps Missing Fields</h3>
            <AlertTriangle className="w-4 h-4 text-health-watch" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="60%"
                  outerRadius="100%"
                  data={[{ value: (metrics.repsMissingFields / metrics.totalReps) * 100 }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill="hsl(var(--health-watch))"
                    background={{ fill: 'hsl(var(--secondary))' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-3xl font-bold text-health-watch">{metrics.repsMissingFields}</p>
              <p className="text-sm text-muted-foreground">of {metrics.totalReps} reps</p>
            </div>
          </div>
        </div>

        {/* Top Friction Points */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <h3 className="text-sm font-medium text-foreground mb-4">Top Friction Points</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frictionData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {frictionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Coverage */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Pipeline Coverage</h3>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-center">
            <p className={`text-4xl font-bold ${
              metrics.pipelineCoverage >= 3 ? 'text-health-healthy' : 
              metrics.pipelineCoverage >= 2 ? 'text-health-watch' : 'text-health-at-risk'
            }`}>
              {metrics.pipelineCoverage}x
            </p>
            <p className="text-sm text-muted-foreground mt-1">vs quota target</p>
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">Recommended: 3x+</p>
            </div>
          </div>
        </div>

        {/* Average Deal Age */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Avg Deal Age</h3>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-foreground">{metrics.avgDealAge}</p>
            <p className="text-sm text-muted-foreground">days in stage</p>
            <div className="mt-3 pt-3 border-t border-border/50 text-left">
              <p className={`text-xs ${metrics.avgDealAge > 30 ? 'text-health-watch' : 'text-health-healthy'}`}>
                {metrics.avgDealAge > 30 ? '⚠️ Above benchmark (30 days)' : '✓ Within benchmark'}
              </p>
            </div>
          </div>
        </div>

        {/* Average Margin Impact */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Avg Margin Impact</h3>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className={`text-4xl font-bold ${
              metrics.avgMarginImpact >= 0 ? 'text-health-healthy' : 
              metrics.avgMarginImpact >= -5 ? 'text-health-watch' : 'text-health-at-risk'
            }`}>
              {metrics.avgMarginImpact > 0 ? '+' : ''}{metrics.avgMarginImpact}%
            </p>
            <p className="text-sm text-muted-foreground">across all deals</p>
          </div>
        </div>

        {/* Automation Ratio */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Automation Ratio</h3>
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="60%"
                  outerRadius="100%"
                  data={automationData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill="hsl(var(--primary))"
                    background={{ fill: 'hsl(var(--secondary))' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{Math.round(metrics.automationRatio * 100)}%</p>
              <p className="text-sm text-muted-foreground">automated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
