-- Add salary and additional information fields to employees table
ALTER TABLE public.employees ADD COLUMN salary DECIMAL(10,2);
ALTER TABLE public.employees ADD COLUMN salary_currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE public.employees ADD COLUMN emergency_contact_name TEXT;
ALTER TABLE public.employees ADD COLUMN emergency_contact_phone TEXT;
ALTER TABLE public.employees ADD COLUMN emergency_contact_relationship TEXT;
ALTER TABLE public.employees ADD COLUMN date_of_birth DATE;
ALTER TABLE public.employees ADD COLUMN address TEXT;
ALTER TABLE public.employees ADD COLUMN city TEXT;
ALTER TABLE public.employees ADD COLUMN state TEXT;
ALTER TABLE public.employees ADD COLUMN postal_code TEXT;
ALTER TABLE public.employees ADD COLUMN country TEXT DEFAULT 'United States';
ALTER TABLE public.employees ADD COLUMN employment_type TEXT DEFAULT 'full-time';
ALTER TABLE public.employees ADD COLUMN work_schedule TEXT;
ALTER TABLE public.employees ADD COLUMN office_location TEXT;
ALTER TABLE public.employees ADD COLUMN notes TEXT;
ALTER TABLE public.employees ADD COLUMN bank_account_number TEXT;
ALTER TABLE public.employees ADD COLUMN bank_routing_number TEXT;
ALTER TABLE public.employees ADD COLUMN bank_name TEXT;
ALTER TABLE public.employees ADD COLUMN tax_id TEXT;

-- Create salary history table for tracking salary changes
CREATE TABLE public.salary_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  previous_salary DECIMAL(10,2),
  new_salary DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  effective_date DATE NOT NULL,
  reason TEXT,
  approved_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on salary_history
ALTER TABLE public.salary_history ENABLE ROW LEVEL SECURITY;

-- Create policies for salary_history (HR and admin access only)
CREATE POLICY "HR can manage salary history" 
ON public.salary_history 
FOR ALL 
USING (true);

-- Create function to automatically create salary history record when salary changes
CREATE OR REPLACE FUNCTION public.track_salary_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Only track if salary actually changed
  IF OLD.salary IS DISTINCT FROM NEW.salary THEN
    INSERT INTO public.salary_history (
      employee_id,
      previous_salary,
      new_salary,
      currency,
      effective_date,
      reason
    ) VALUES (
      NEW.id,
      OLD.salary,
      NEW.salary,
      NEW.salary_currency,
      CURRENT_DATE,
      'Salary updated'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for salary tracking
CREATE TRIGGER track_salary_changes_trigger
  AFTER UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.track_salary_changes();

-- Add RLS policies for employee documents to allow HR management
CREATE POLICY "HR can manage employee documents" 
ON public.employee_documents 
FOR ALL 
USING (true);