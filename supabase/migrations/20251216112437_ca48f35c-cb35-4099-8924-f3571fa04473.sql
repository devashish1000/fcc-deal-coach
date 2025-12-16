-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deals table
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'Discovery',
  owner TEXT NOT NULL,
  account TEXT NOT NULL,
  close_date DATE NOT NULL,
  days_in_stage INTEGER NOT NULL DEFAULT 0,
  health_score INTEGER NOT NULL DEFAULT 50,
  health_status TEXT NOT NULL DEFAULT 'watch' CHECK (health_status IN ('healthy', 'watch', 'at-risk')),
  health_trend TEXT NOT NULL DEFAULT 'stable' CHECK (health_trend IN ('up', 'down', 'stable')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create missing_fields table for tracking deal missing fields
CREATE TABLE public.missing_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  impact INTEGER NOT NULL DEFAULT 0,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_settings table
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  strict_validation BOOLEAN NOT NULL DEFAULT false,
  ai_coach_tone TEXT NOT NULL DEFAULT 'deterministic',
  use_cloud BOOLEAN NOT NULL DEFAULT true,
  use_ai BOOLEAN NOT NULL DEFAULT true,
  selected_role TEXT NOT NULL DEFAULT 'rep',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create field_resolution_history table
CREATE TABLE public.field_resolution_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  field_name TEXT NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  score_impact INTEGER NOT NULL DEFAULT 0
);

-- Create health_score_history table
CREATE TABLE public.health_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  status TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missing_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_resolution_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_score_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Deals policies
CREATE POLICY "Users can view their own deals" ON public.deals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own deals" ON public.deals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own deals" ON public.deals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own deals" ON public.deals FOR DELETE USING (auth.uid() = user_id);

-- Missing fields policies
CREATE POLICY "Users can view missing fields for their deals" ON public.missing_fields FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.deals WHERE deals.id = missing_fields.deal_id AND deals.user_id = auth.uid())
);
CREATE POLICY "Users can manage missing fields for their deals" ON public.missing_fields FOR ALL USING (
  EXISTS (SELECT 1 FROM public.deals WHERE deals.id = missing_fields.deal_id AND deals.user_id = auth.uid())
);

-- User settings policies
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Field resolution history policies
CREATE POLICY "Users can view their own resolution history" ON public.field_resolution_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own resolution history" ON public.field_resolution_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Health score history policies
CREATE POLICY "Users can view health history for their deals" ON public.health_score_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.deals WHERE deals.id = health_score_history.deal_id AND deals.user_id = auth.uid())
);
CREATE POLICY "Users can insert health history for their deals" ON public.health_score_history FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.deals WHERE deals.id = health_score_history.deal_id AND deals.user_id = auth.uid())
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();