import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Bot, Database, RefreshCw, Cloud, Sparkles, Code, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function Settings() {
  const [strictValidation, setStrictValidation] = useState(true);
  const [aiCoachTone, setAiCoachTone] = useState<'deterministic' | 'ai'>('deterministic');
  const [useLovableCloud, setUseLovableCloud] = useState(false);
  const [useLovableAI, setUseLovableAI] = useState(false);

  const handleResetData = () => {
    localStorage.clear();
    toast.success('Demo data has been reset');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-card border-b border-border/50 rounded-none">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Configure your Deal Health experience</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          {/* Validation Settings */}
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Validation</h2>
                <p className="text-sm text-muted-foreground">Control data quality requirements</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <p className="font-medium text-foreground">Strict Validation</p>
                <p className="text-sm text-muted-foreground">Require all fields before deal progression</p>
              </div>
              <Switch checked={strictValidation} onCheckedChange={setStrictValidation} />
            </div>
          </div>

          {/* AI Settings */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">AI Coach</h2>
                <p className="text-sm text-muted-foreground">Configure AI-powered guidance</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div>
                  <p className="font-medium text-foreground">AI Coach Tone</p>
                  <p className="text-sm text-muted-foreground">
                    {aiCoachTone === 'deterministic' ? 'Rule-based recommendations' : 'AI-generated insights'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${aiCoachTone === 'deterministic' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Rules
                  </span>
                  <Switch
                    checked={aiCoachTone === 'ai'}
                    onCheckedChange={(checked) => setAiCoachTone(checked ? 'ai' : 'deterministic')}
                  />
                  <span className={`text-sm ${aiCoachTone === 'ai' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    AI
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Use Lovable AI</p>
                    <p className="text-sm text-muted-foreground">Enable AI-powered features</p>
                  </div>
                </div>
                <Switch checked={useLovableAI} onCheckedChange={setUseLovableAI} />
              </div>
            </div>
          </div>

          {/* Cloud Settings */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Cloud className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Cloud & Data</h2>
                <p className="text-sm text-muted-foreground">Manage cloud integration and data</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Use Lovable Cloud</p>
                    <p className="text-sm text-muted-foreground">Persist data with cloud storage</p>
                  </div>
                </div>
                <Switch checked={useLovableCloud} onCheckedChange={setUseLovableCloud} />
              </div>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-health-watch/50 text-health-watch hover:bg-health-watch/10"
                onClick={handleResetData}
              >
                <RefreshCw className="w-4 h-4" />
                Reset Demo Data
              </Button>
            </div>
          </div>

          {/* Salesforce Integration */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Salesforce Integration</h2>
                <p className="text-sm text-muted-foreground">Embed as Lightning Web Component or Canvas App</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <h3 className="font-medium text-foreground mb-2">Lightning Web Component</h3>
                <p className="text-muted-foreground mb-3">
                  Pass <code className="px-1.5 py-0.5 rounded bg-background text-primary">recordId</code> and{' '}
                  <code className="px-1.5 py-0.5 rounded bg-background text-primary">objectApiName</code> via component context.
                </p>
                <div className="p-3 rounded bg-background font-mono text-xs overflow-x-auto">
                  <pre className="text-muted-foreground">
{`<template>
  <c-deal-health-app 
    record-id={recordId}
    object-api-name={objectApiName}>
  </c-deal-health-app>
</template>`}
                  </pre>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <h3 className="font-medium text-foreground mb-2">Canvas App</h3>
                <p className="text-muted-foreground mb-3">
                  Configure Named Credentials for OAuth and set field-level security appropriately.
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Setup → Named Credentials → Create New
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Configure OAuth 2.0 flow with your connected app
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Set field-level security in Profile or Permission Set
                  </li>
                </ul>
              </div>

              <a
                href="https://developer.salesforce.com/docs/component-library/documentation/en/lwc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View Salesforce LWC Documentation
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
