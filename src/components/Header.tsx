import { UserRole } from '@/types/deal';
import { RoleSelector } from './RoleSelector';
import { Activity, Settings, LogOut, List, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function Header({ role, onRoleChange }: HeaderProps) {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/deals', label: 'Deals', icon: List },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 glow-primary">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Deal Health</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Guidance & Insights</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path}>
                  <Button
                    variant={location.pathname === path ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <RoleSelector role={role} onRoleChange={onRoleChange} />
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
              {user?.email}
            </div>
            
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
