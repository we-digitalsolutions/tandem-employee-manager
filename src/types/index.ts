
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
