-- Temporarily update RLS policies to allow public access for departments and employees
-- This will allow the app to work without authentication

-- Drop existing policies for departments
DROP POLICY IF EXISTS "Allow authenticated users to view departments" ON public.departments;
DROP POLICY IF EXISTS "Allow managers to manage departments" ON public.departments;

-- Create new policies that allow public access
CREATE POLICY "Allow public access to view departments" 
ON public.departments 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public access to manage departments" 
ON public.departments 
FOR ALL 
USING (true);

-- Drop existing policies for employees  
DROP POLICY IF EXISTS "Allow HR to manage employees" ON public.employees;
DROP POLICY IF EXISTS "Allow authenticated users to view employees" ON public.employees;

-- Create new policies that allow public access
CREATE POLICY "Allow public access to view employees" 
ON public.employees 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public access to manage employees" 
ON public.employees 
FOR ALL 
USING (true);