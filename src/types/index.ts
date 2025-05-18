
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'onLeave';
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  budget: number;
}

export interface Stats {
  totalEmployees: number;
  newHires: number;
  departments: number;
  onLeave: number;
}

export interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  current: boolean;
}

export interface DashboardStat {
  title: string;
  value: number | string;
  icon: any;
  change?: number;
  changeType?: 'increase' | 'decrease';
}

export type RequestStatus = 'pending' | 'approved' | 'declined';

export type TimeDuration = 'full-day' | 'half-day-morning' | 'half-day-afternoon' | 'quarter-day-1' | 'quarter-day-2' | 'quarter-day-3' | 'quarter-day-4';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'bereavement';
  reason: string;
  status: RequestStatus;
  submittedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
  duration?: TimeDuration;
}

export interface RemoteRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  submittedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
  location?: string;
  duration?: TimeDuration;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  date: string;
  read: boolean;
  link?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  permissions: string[];
}

export interface Report {
  id: string;
  name: string;
  type: 'attendance' | 'leave' | 'performance' | 'department' | 'custom';
  generatedDate: string;
  generatedBy: string;
  format: 'pdf' | 'csv' | 'excel';
  url?: string;
}

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}
