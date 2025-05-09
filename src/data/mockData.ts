
import { Department, Employee, Stats } from '@/types';

// Mock Employees Data
export const employeesData: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '(555) 123-4567',
    position: 'Software Engineer',
    department: 'Engineering',
    hireDate: '2022-03-15',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '(555) 987-6543',
    position: 'Marketing Specialist',
    department: 'Marketing',
    hireDate: '2021-07-22',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@company.com',
    phone: '(555) 234-5678',
    position: 'Financial Analyst',
    department: 'Finance',
    hireDate: '2023-01-10',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@company.com',
    phone: '(555) 876-5432',
    position: 'HR Specialist',
    department: 'Human Resources',
    hireDate: '2022-11-05',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@company.com',
    phone: '(555) 345-6789',
    position: 'Product Manager',
    department: 'Product',
    hireDate: '2021-04-18',
    status: 'onLeave',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: '6',
    firstName: 'Sarah',
    lastName: 'Davis',
    email: 'sarah.davis@company.com',
    phone: '(555) 765-4321',
    position: 'UX Designer',
    department: 'Design',
    hireDate: '2022-09-30',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  {
    id: '7',
    firstName: 'David',
    lastName: 'Miller',
    email: 'david.miller@company.com',
    phone: '(555) 456-7890',
    position: 'Sales Representative',
    department: 'Sales',
    hireDate: '2023-02-14',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
  {
    id: '8',
    firstName: 'Lisa',
    lastName: 'Wilson',
    email: 'lisa.wilson@company.com',
    phone: '(555) 654-3210',
    position: 'Customer Support',
    department: 'Customer Service',
    hireDate: '2022-06-12',
    status: 'inactive',
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg'
  },
  {
    id: '9',
    firstName: 'James',
    lastName: 'Taylor',
    email: 'james.taylor@company.com',
    phone: '(555) 567-8901',
    position: 'Systems Administrator',
    department: 'IT',
    hireDate: '2021-10-08',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
  },
  {
    id: '10',
    firstName: 'Jennifer',
    lastName: 'Anderson',
    email: 'jennifer.anderson@company.com',
    phone: '(555) 543-2109',
    position: 'Content Writer',
    department: 'Marketing',
    hireDate: '2022-08-25',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg'
  }
];

// Mock Departments Data
export const departmentsData: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    manager: 'John Doe',
    employeeCount: 24,
    budget: 1250000
  },
  {
    id: '2',
    name: 'Marketing',
    manager: 'Jane Smith',
    employeeCount: 12,
    budget: 750000
  },
  {
    id: '3',
    name: 'Finance',
    manager: 'Robert Johnson',
    employeeCount: 8,
    budget: 900000
  },
  {
    id: '4',
    name: 'Human Resources',
    manager: 'Emily Williams',
    employeeCount: 6,
    budget: 500000
  },
  {
    id: '5',
    name: 'Product',
    manager: 'Michael Brown',
    employeeCount: 10,
    budget: 1100000
  },
  {
    id: '6',
    name: 'Design',
    manager: 'Sarah Davis',
    employeeCount: 7,
    budget: 650000
  },
  {
    id: '7',
    name: 'Sales',
    manager: 'David Miller',
    employeeCount: 15,
    budget: 1300000
  },
  {
    id: '8',
    name: 'Customer Service',
    manager: 'Lisa Wilson',
    employeeCount: 18,
    budget: 800000
  }
];

// Mock Statistics
export const statsData: Stats = {
  totalEmployees: 100,
  newHires: 7,
  departments: 8,
  onLeave: 3
};
