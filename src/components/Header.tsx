import { UserRole } from '@/types/deal';
import { RoleSelector } from './RoleSelector';
import { Activity, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function Header({ role, onRoleChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 glow-primary">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Deal Health</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Guidance & Insights</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <RoleSelector role={role} onRoleChange={onRoleChange} />
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
