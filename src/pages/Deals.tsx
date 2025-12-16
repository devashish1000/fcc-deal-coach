import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDeals, useCreateDeal, useDeleteDeal, Deal } from '@/hooks/useDeals';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Plus, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Trash2,
  Eye,
  DollarSign,
  Calendar,
  Building2
} from 'lucide-react';
import { UserRole } from '@/types/deal';
import { format } from 'date-fns';

const STAGES = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
const HEALTH_STATUSES = ['healthy', 'watch', 'at-risk'];

const Deals = () => {
  const { user } = useAuth();
  const { data: deals = [], isLoading } = useDeals();
  const createDeal = useCreateDeal();
  const deleteDeal = useDeleteDeal();
  
  const [role, setRole] = useState<UserRole>('rep');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'health_score' | 'close_date'>('close_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // New deal form state
  const [newDeal, setNewDeal] = useState({
    name: '',
    value: 0,
    stage: 'Discovery',
    owner: user?.email?.split('@')[0] || 'Me',
    account: '',
    close_date: format(new Date(), 'yyyy-MM-dd'),
    days_in_stage: 0,
    health_score: 50,
    health_status: 'watch' as const,
    health_trend: 'stable' as const,
  });

  // Get unique owners for filter
  const owners = useMemo(() => {
    const ownerSet = new Set(deals.map(d => d.owner));
    return Array.from(ownerSet);
  }, [deals]);

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    let result = [...deals];
    
    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(searchLower) ||
        d.account.toLowerCase().includes(searchLower) ||
        d.owner.toLowerCase().includes(searchLower)
      );
    }
    
    // Filters
    if (stageFilter !== 'all') {
      result = result.filter(d => d.stage === stageFilter);
    }
    if (healthFilter !== 'all') {
      result = result.filter(d => d.health_status === healthFilter);
    }
    if (ownerFilter !== 'all') {
      result = result.filter(d => d.owner === ownerFilter);
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'health_score':
          comparison = a.health_score - b.health_score;
          break;
        case 'close_date':
          comparison = new Date(a.close_date).getTime() - new Date(b.close_date).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [deals, search, stageFilter, healthFilter, ownerFilter, sortBy, sortOrder]);

  const handleCreateDeal = async () => {
    await createDeal.mutateAsync(newDeal);
    setIsCreateOpen(false);
    setNewDeal({
      name: '',
      value: 0,
      stage: 'Discovery',
      owner: user?.email?.split('@')[0] || 'Me',
      account: '',
      close_date: format(new Date(), 'yyyy-MM-dd'),
      days_in_stage: 0,
      health_score: 50,
      health_status: 'watch',
      health_trend: 'stable',
    });
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'healthy': 'bg-healthy/20 text-healthy border-healthy/30',
      'watch': 'bg-watch/20 text-watch border-watch/30',
      'at-risk': 'bg-risk/20 text-risk border-risk/30',
    };
    return variants[status] || variants['watch'];
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-healthy" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-risk" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header role={role} onRoleChange={setRole} />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Deal Pipeline</h1>
            <p className="text-muted-foreground">{filteredDeals.length} deals found</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border/50">
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Deal Name</Label>
                  <Input
                    id="name"
                    value={newDeal.name}
                    onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                    placeholder="Enterprise License Renewal"
                    className="bg-card/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">Value ($)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={newDeal.value}
                      onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
                      className="bg-card/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <Select value={newDeal.stage} onValueChange={(v) => setNewDeal({ ...newDeal, stage: v })}>
                      <SelectTrigger className="bg-card/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Account</Label>
                  <Input
                    id="account"
                    value={newDeal.account}
                    onChange={(e) => setNewDeal({ ...newDeal, account: e.target.value })}
                    placeholder="Acme Corp"
                    className="bg-card/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close_date">Close Date</Label>
                  <Input
                    id="close_date"
                    type="date"
                    value={newDeal.close_date}
                    onChange={(e) => setNewDeal({ ...newDeal, close_date: e.target.value })}
                    className="bg-card/50"
                  />
                </div>
                <Button onClick={handleCreateDeal} className="w-full" disabled={!newDeal.name || !newDeal.account}>
                  Create Deal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals, accounts, owners..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-card/50"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-[140px] bg-card/50">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                
                <Select value={healthFilter} onValueChange={setHealthFilter}>
                  <SelectTrigger className="w-[140px] bg-card/50">
                    <SelectValue placeholder="Health" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Health</SelectItem>
                    {HEALTH_STATUSES.map(s => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                  <SelectTrigger className="w-[140px] bg-card/50">
                    <SelectValue placeholder="Owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    {owners.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deals List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading deals...</div>
        ) : filteredDeals.length === 0 ? (
          <Card className="glass-card border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {deals.length === 0 ? "No deals yet. Create your first deal to get started!" : "No deals match your filters."}
              </p>
              {deals.length === 0 && (
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Deal
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Sort Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-4 text-sm text-muted-foreground">
              <button 
                onClick={() => toggleSort('name')} 
                className="col-span-3 flex items-center gap-1 hover:text-foreground transition-colors"
              >
                Deal Name <ArrowUpDown className="h-3 w-3" />
              </button>
              <div className="col-span-2">Account</div>
              <button 
                onClick={() => toggleSort('value')} 
                className="col-span-1 flex items-center gap-1 hover:text-foreground transition-colors"
              >
                Value <ArrowUpDown className="h-3 w-3" />
              </button>
              <div className="col-span-1">Stage</div>
              <button 
                onClick={() => toggleSort('health_score')} 
                className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors"
              >
                Health <ArrowUpDown className="h-3 w-3" />
              </button>
              <button 
                onClick={() => toggleSort('close_date')} 
                className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors"
              >
                Close Date <ArrowUpDown className="h-3 w-3" />
              </button>
              <div className="col-span-1">Actions</div>
            </div>

            {filteredDeals.map((deal) => (
              <Card key={deal.id} className="glass-card border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Deal Name */}
                    <div className="lg:col-span-3">
                      <Link to={`/?deal=${deal.id}`} className="font-semibold hover:text-primary transition-colors">
                        {deal.name}
                      </Link>
                      <p className="text-sm text-muted-foreground lg:hidden">{deal.account}</p>
                    </div>
                    
                    {/* Account */}
                    <div className="hidden lg:flex lg:col-span-2 items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{deal.account}</span>
                    </div>
                    
                    {/* Value */}
                    <div className="lg:col-span-1 flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground lg:hidden" />
                      <span className="font-medium">${deal.value.toLocaleString()}</span>
                    </div>
                    
                    {/* Stage */}
                    <div className="lg:col-span-1">
                      <Badge variant="outline" className="text-xs">{deal.stage}</Badge>
                    </div>
                    
                    {/* Health */}
                    <div className="lg:col-span-2 flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              deal.health_status === 'healthy' ? 'bg-healthy' :
                              deal.health_status === 'watch' ? 'bg-watch' : 'bg-risk'
                            }`}
                            style={{ width: `${deal.health_score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{deal.health_score}</span>
                        {getTrendIcon(deal.health_trend)}
                      </div>
                      <Badge className={`${getStatusBadge(deal.health_status)} text-xs capitalize`}>
                        {deal.health_status}
                      </Badge>
                    </div>
                    
                    {/* Close Date */}
                    <div className="lg:col-span-2 flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(deal.close_date), 'MMM d, yyyy')}
                    </div>
                    
                    {/* Actions */}
                    <div className="lg:col-span-1 flex items-center gap-2">
                      <Link to={`/?deal=${deal.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteDeal.mutate(deal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Deals;
