
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  UserMinus 
} from "lucide-react";
import { statsData } from '@/data/mockData';
import { ChartContainer } from '@/components/ui/chart';
import * as RechartsPrimitive from "recharts";
import { ChartTooltipContent } from '@/components/ui/chart';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the HR Management dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={statsData.totalEmployees}
          icon={<Users className="h-6 w-6 text-hr-navy" />}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="New Hires"
          value={statsData.newHires}
          icon={<UserPlus className="h-6 w-6 text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Departments"
          value={statsData.departments}
          icon={<Briefcase className="h-6 w-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatCard
          title="On Leave"
          value={statsData.onLeave}
          icon={<UserMinus className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={{
                employees: { color: "#38b2ac" }
              }}
            >
              {({ chartColors }: { chartColors: any }) => (
                <RechartsPrimitive.BarChart
                  data={[
                    { name: 'Engineering', employees: 24 },
                    { name: 'Marketing', employees: 12 },
                    { name: 'Finance', employees: 8 },
                    { name: 'HR', employees: 6 },
                    { name: 'Product', employees: 10 },
                    { name: 'Design', employees: 7 },
                    { name: 'Sales', employees: 15 },
                    { name: 'Support', employees: 18 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                  <RechartsPrimitive.XAxis dataKey="name" />
                  <RechartsPrimitive.YAxis />
                  <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Bar dataKey="employees" fill="#38b2ac" />
                </RechartsPrimitive.BarChart>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`${activity.color} p-2 rounded-full`}>
                    <activity.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, iconBg }: { 
  title: string; 
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`${iconBg} p-3 rounded-full`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const activities = [
  {
    title: 'Sarah Davis submitted leave request',
    time: '2 hours ago',
    icon: UserMinus,
    color: 'bg-amber-500'
  },
  {
    title: 'New employee James Wilson onboarded',
    time: '5 hours ago',
    icon: UserPlus,
    color: 'bg-green-500'
  },
  {
    title: 'Performance review cycle started',
    time: '1 day ago',
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    title: 'Engineering department budget updated',
    time: '2 days ago',
    icon: Briefcase,
    color: 'bg-purple-500'
  },
];

export default Dashboard;
