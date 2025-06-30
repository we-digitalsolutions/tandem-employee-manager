
-- Create enum types first
CREATE TYPE public.employee_status AS ENUM ('active', 'inactive', 'onLeave');
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'employee');
CREATE TYPE public.request_status AS ENUM ('pending', 'manager-approved', 'hr-approved', 'approved', 'declined');
CREATE TYPE public.approval_step AS ENUM ('manager', 'hr');
CREATE TYPE public.time_duration AS ENUM ('full-day', 'half-day-morning', 'half-day-afternoon', 'quarter-day-1', 'quarter-day-2', 'quarter-day-3', 'quarter-day-4');
CREATE TYPE public.leave_type AS ENUM ('vacation', 'sick', 'personal', 'maternity', 'paternity', 'bereavement');
CREATE TYPE public.holiday_type AS ENUM ('national', 'company', 'religious');
CREATE TYPE public.document_category AS ENUM ('cv', 'contract', 'diploma', 'id-card', 'passport', 'certification', 'other');
CREATE TYPE public.document_request_type AS ENUM ('payslip', 'work-certificate', 'salary-certificate', 'mission-order', 'custom');
CREATE TYPE public.document_request_status AS ENUM ('pending', 'processing', 'completed', 'declined');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'half-day', 'remote');
CREATE TYPE public.goal_status AS ENUM ('not-started', 'in-progress', 'completed');
CREATE TYPE public.review_status AS ENUM ('draft', 'submitted', 'completed');
CREATE TYPE public.notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE public.report_type AS ENUM ('attendance', 'leave', 'performance', 'department', 'custom');
CREATE TYPE public.report_format AS ENUM ('pdf', 'csv', 'excel');

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  manager TEXT NOT NULL,
  manager_id UUID,
  employee_count INTEGER DEFAULT 0,
  budget DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  hire_date DATE NOT NULL,
  status employee_status DEFAULT 'active',
  avatar TEXT,
  job_description TEXT,
  password TEXT, -- For demo purposes
  role user_role DEFAULT 'employee',
  manager_id UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave_balances table
CREATE TABLE public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  type leave_type NOT NULL,
  allocated INTEGER NOT NULL DEFAULT 0,
  used INTEGER NOT NULL DEFAULT 0,
  remaining INTEGER NOT NULL DEFAULT 0,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, type, year)
);

-- Create file_attachments table
CREATE TABLE public.file_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  url TEXT NOT NULL,
  uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create approval_records table
CREATE TABLE public.approval_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approver_id UUID NOT NULL,
  approver_name TEXT NOT NULL,
  approver_role TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'declined')),
  comments TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type leave_type NOT NULL,
  reason TEXT NOT NULL,
  status request_status DEFAULT 'pending',
  submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.employees(id),
  review_date TIMESTAMP WITH TIME ZONE,
  comments TEXT,
  duration time_duration DEFAULT 'full-day',
  calculated_days INTEGER,
  manager_approval_id UUID REFERENCES public.approval_records(id),
  hr_approval_id UUID REFERENCES public.approval_records(id),
  current_approval_step approval_step DEFAULT 'manager'
);

-- Create remote_requests table
CREATE TABLE public.remote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status request_status DEFAULT 'pending',
  submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.employees(id),
  review_date TIMESTAMP WITH TIME ZONE,
  comments TEXT,
  location TEXT,
  duration time_duration DEFAULT 'full-day',
  calculated_days INTEGER,
  manager_approval_id UUID REFERENCES public.approval_records(id),
  hr_approval_id UUID REFERENCES public.approval_records(id),
  current_approval_step approval_step DEFAULT 'manager'
);

-- Create holidays table
CREATE TABLE public.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  type holiday_type NOT NULL,
  recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employee_documents table
CREATE TABLE public.employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category document_category NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.employees(id),
  uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date DATE
);

-- Create document_requests table
CREATE TABLE public.document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  document_type document_request_type NOT NULL,
  custom_description TEXT,
  status document_request_status DEFAULT 'pending',
  submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_by UUID REFERENCES public.employees(id),
  processed_date TIMESTAMP WITH TIME ZONE,
  generated_document_url TEXT,
  comments TEXT,
  additional_data JSONB
);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in TIME,
  clock_out TIME,
  total_hours DECIMAL(4,2),
  status attendance_status NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- Create performance_goals table
CREATE TABLE public.performance_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_date DATE NOT NULL,
  status goal_status DEFAULT 'not-started',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT
);

-- Create performance_reviews table
CREATE TABLE public.performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.employees(id),
  period TEXT NOT NULL,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  comments TEXT NOT NULL,
  status review_status DEFAULT 'draft',
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_date TIMESTAMP WITH TIME ZONE
);

-- Create performance_review_goals junction table
CREATE TABLE public.performance_review_goals (
  review_id UUID NOT NULL REFERENCES public.performance_reviews(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.performance_goals(id) ON DELETE CASCADE,
  PRIMARY KEY (review_id, goal_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_type NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  recipient_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.employees(id)
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type report_type NOT NULL,
  generated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by UUID NOT NULL REFERENCES public.employees(id),
  format report_format NOT NULL,
  url TEXT
);

-- Create document_templates table
CREATE TABLE public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type document_request_type NOT NULL,
  description TEXT NOT NULL,
  template_url TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES public.employees(id),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create junction tables for many-to-many relationships
CREATE TABLE public.leave_request_attachments (
  leave_request_id UUID NOT NULL REFERENCES public.leave_requests(id) ON DELETE CASCADE,
  attachment_id UUID NOT NULL REFERENCES public.file_attachments(id) ON DELETE CASCADE,
  PRIMARY KEY (leave_request_id, attachment_id)
);

CREATE TABLE public.remote_request_attachments (
  remote_request_id UUID NOT NULL REFERENCES public.remote_requests(id) ON DELETE CASCADE,
  attachment_id UUID NOT NULL REFERENCES public.file_attachments(id) ON DELETE CASCADE,
  PRIMARY KEY (remote_request_id, attachment_id)
);

-- Add indexes for better performance
CREATE INDEX idx_employees_email ON public.employees(email);
CREATE INDEX idx_employees_department ON public.employees(department);
CREATE INDEX idx_employees_manager_id ON public.employees(manager_id);
CREATE INDEX idx_leave_requests_employee_id ON public.leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX idx_remote_requests_employee_id ON public.remote_requests(employee_id);
CREATE INDEX idx_remote_requests_status ON public.remote_requests(status);
CREATE INDEX idx_attendance_records_employee_id ON public.attendance_records(employee_id);
CREATE INDEX idx_attendance_records_date ON public.attendance_records(date);
CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_leave_balances_employee_id ON public.leave_balances(employee_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (these can be refined based on specific requirements)
-- For now, allowing authenticated users to access data - you may want to refine these

-- Departments policies
CREATE POLICY "Allow authenticated users to view departments" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow managers to manage departments" ON public.departments FOR ALL TO authenticated USING (true);

-- Employees policies
CREATE POLICY "Allow authenticated users to view employees" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow HR to manage employees" ON public.employees FOR ALL TO authenticated USING (true);

-- Leave balances policies
CREATE POLICY "Users can view their own leave balances" ON public.leave_balances FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR can manage leave balances" ON public.leave_balances FOR ALL TO authenticated USING (true);

-- Leave requests policies
CREATE POLICY "Users can view leave requests" ON public.leave_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create leave requests" ON public.leave_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update leave requests" ON public.leave_requests FOR UPDATE TO authenticated USING (true);

-- Remote requests policies
CREATE POLICY "Users can view remote requests" ON public.remote_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create remote requests" ON public.remote_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update remote requests" ON public.remote_requests FOR UPDATE TO authenticated USING (true);

-- Add similar policies for other tables
CREATE POLICY "Allow authenticated users to view holidays" ON public.holidays FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view documents" ON public.employee_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage document requests" ON public.document_requests FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view attendance" ON public.attendance_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage performance reviews" ON public.performance_reviews FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view notifications" ON public.notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view reports" ON public.reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view templates" ON public.document_templates FOR SELECT TO authenticated USING (true);

-- Create trigger to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to relevant tables
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_balances_updated_at BEFORE UPDATE ON public.leave_balances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
