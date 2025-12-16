import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Deal {
  id: string;
  user_id: string;
  name: string;
  value: number;
  stage: string;
  owner: string;
  account: string;
  close_date: string;
  days_in_stage: number;
  health_score: number;
  health_status: 'healthy' | 'watch' | 'at-risk';
  health_trend: 'up' | 'down' | 'stable';
  created_at: string;
  updated_at: string;
}

export interface MissingFieldDB {
  id: string;
  deal_id: string;
  name: string;
  description: string | null;
  resolved: boolean;
  impact: number;
  resolved_at: string | null;
  created_at: string;
}

export const useDeals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['deals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Deal[];
    },
    enabled: !!user,
  });
};

export const useDealWithFields = (dealId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['deal', dealId],
    queryFn: async () => {
      if (!user || !dealId) return null;
      
      const [dealResult, fieldsResult] = await Promise.all([
        supabase.from('deals').select('*').eq('id', dealId).single(),
        supabase.from('missing_fields').select('*').eq('deal_id', dealId),
      ]);
      
      if (dealResult.error) throw dealResult.error;
      
      return {
        deal: dealResult.data as Deal,
        missingFields: (fieldsResult.data || []) as MissingFieldDB[],
      };
    },
    enabled: !!user && !!dealId,
  });
};

export const useCreateDeal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (deal: Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('deals')
        .insert([{ ...deal, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Create default missing fields for the deal
      const defaultFields = [
        { deal_id: data.id, name: 'Next Step', description: 'Define the next step in the sales process', impact: 10 },
        { deal_id: data.id, name: 'Close Plan', description: 'Document the steps to close this deal', impact: 15 },
        { deal_id: data.id, name: 'Primary Contact', description: 'Identify and document primary contact', impact: 10 },
        { deal_id: data.id, name: 'Forecast Category', description: 'Assign appropriate forecast category', impact: 10 },
      ];
      
      await supabase.from('missing_fields').insert(defaultFields);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({ title: 'Success', description: 'Deal created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Deal> & { id: string }) => {
      const { data, error } = await supabase
        .from('deals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({ title: 'Success', description: 'Deal updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useResolveField = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ fieldId, dealId, impact }: { fieldId: string; dealId: string; impact: number }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Update the field
      const { error: fieldError } = await supabase
        .from('missing_fields')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', fieldId);
      
      if (fieldError) throw fieldError;
      
      // Log the resolution
      await supabase.from('field_resolution_history').insert([{
        user_id: user.id,
        deal_id: dealId,
        field_name: fieldId,
        score_impact: impact,
      }]);
      
      // Update deal health score
      const { data: deal } = await supabase
        .from('deals')
        .select('health_score')
        .eq('id', dealId)
        .single();
      
      if (deal) {
        const newScore = Math.min(100, deal.health_score + impact);
        const newStatus = newScore >= 80 ? 'healthy' : newScore >= 50 ? 'watch' : 'at-risk';
        
        await supabase
          .from('deals')
          .update({ health_score: newScore, health_status: newStatus, health_trend: 'up' })
          .eq('id', dealId);
        
        // Log health score history
        await supabase.from('health_score_history').insert([{
          deal_id: dealId,
          score: newScore,
          status: newStatus,
        }]);
      }
      
      return { fieldId, dealId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', variables.dealId] });
      toast({ title: '✓ Issue resolved', description: `Data quality improved` });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('deals').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({ title: 'Success', description: 'Deal deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
