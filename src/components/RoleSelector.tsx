import { UserRole } from '@/types/deal';
import { User, Users, Settings } from 'lucide-react';

interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles: { value: UserRole; label: string; icon: typeof User }[] = [
  { value: 'rep', label: 'Sales Rep', icon: User },
  { value: 'manager', label: 'Manager', icon: Users },
  { value: 'ops', label: 'Sales Ops', icon: Settings },
];

export function RoleSelector({ role, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-border/50">
      {roles.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onRoleChange(value)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            role === value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
