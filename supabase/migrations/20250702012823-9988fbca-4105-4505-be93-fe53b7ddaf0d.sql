-- Insert sample departments
INSERT INTO public.departments (name, manager, employee_count, budget) VALUES
('Human Resources', 'Sarah Johnson', 5, 250000),
('Engineering', 'Mike Chen', 15, 800000),
('Marketing', 'Emma Davis', 8, 400000),
('Sales', 'James Wilson', 12, 600000),
('Finance', 'Lisa Anderson', 6, 300000),
('Operations', 'David Brown', 10, 500000)
ON CONFLICT DO NOTHING;

-- Insert sample employees
INSERT INTO public.employees (first_name, last_name, email, phone, position, department, hire_date, status, role, salary, salary_currency) VALUES
('Sarah', 'Johnson', 'sarah.johnson@company.com', '555-0101', 'HR Director', 'Human Resources', '2020-01-15', 'active', 'admin', 85000, 'USD'),
('Mike', 'Chen', 'mike.chen@company.com', '555-0102', 'Engineering Manager', 'Engineering', '2019-03-20', 'active', 'manager', 95000, 'USD'),
('Emma', 'Davis', 'emma.davis@company.com', '555-0103', 'Marketing Director', 'Marketing', '2021-05-10', 'active', 'manager', 78000, 'USD'),
('James', 'Wilson', 'james.wilson@company.com', '555-0104', 'Sales Manager', 'Sales', '2020-08-12', 'active', 'manager', 82000, 'USD'),
('Lisa', 'Anderson', 'lisa.anderson@company.com', '555-0105', 'Finance Manager', 'Finance', '2021-02-28', 'active', 'manager', 76000, 'USD'),
('John', 'Smith', 'john.smith@company.com', '555-0106', 'Software Engineer', 'Engineering', '2022-01-10', 'active', 'employee', 65000, 'USD'),
('Jane', 'Doe', 'jane.doe@company.com', '555-0107', 'Marketing Specialist', 'Marketing', '2022-06-15', 'active', 'employee', 52000, 'USD'),
('Robert', 'Taylor', 'robert.taylor@company.com', '555-0108', 'Sales Representative', 'Sales', '2023-01-05', 'active', 'employee', 48000, 'USD')
ON CONFLICT DO NOTHING;