
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
  jobDescription?: string;
  password?: string;  // For demo purposes only
  role?: 'admin' | 'manager' | 'employee';
  managerId?: string;
  leaveBalances?: LeaveBalance[];
  documents?: EmployeeDocument[];
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  managerId: string;
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

export type RequestStatus = 'pending' | 'manager-approved' | 'hr-approved' | 'approved' | 'declined';

export type ApprovalStep = 'manager' | 'hr';

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
  attachments?: FileAttachment[];
  calculatedDays?: number;
  managerApproval?: ApprovalRecord;
  hrApproval?: ApprovalRecord;
  currentApprovalStep?: ApprovalStep;
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
  attachments?: FileAttachment[];
  calculatedDays?: number;
  managerApproval?: ApprovalRecord;
  hrApproval?: ApprovalRecord;
  currentApprovalStep?: ApprovalStep;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedDate: string;
}

export interface ApprovalRecord {
  approverId: string;
  approverName: string;
  approverRole: string;
  decision: 'approved' | 'declined';
  comments?: string;
  date: string;
}

export interface LeaveBalance {
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'bereavement';
  allocated: number;
  used: number;
  remaining: number;
  year: number;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'company' | 'religious';
  recurring: boolean;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  category: 'cv' | 'contract' | 'diploma' | 'id-card' | 'passport' | 'certification' | 'other';
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedDate: string;
  expiryDate?: string;
}

export interface DocumentRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: 'payslip' | 'work-certificate' | 'salary-certificate' | 'mission-order' | 'custom';
  customDescription?: string;
  status: 'pending' | 'processing' | 'completed' | 'declined';
  submittedDate: string;
  processedBy?: string;
  processedDate?: string;
  generatedDocumentUrl?: string;
  comments?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'remote';
  location?: string;
  notes?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  goals: Goal[];
  overallRating: number;
  comments: string;
  status: 'draft' | 'submitted' | 'completed';
  createdDate: string;
  completedDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  rating?: number;
  comments?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  date: string;
  read: boolean;
  link?: string;
  recipientId: string;
  senderId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  permissions: string[];
  password?: string; // For demo purposes only
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

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
