
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer } from '@/components/ui/chart';
import * as RechartsPrimitive from "recharts";
import { ChartTooltipContent } from '@/components/ui/chart';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AdvancedReporting = () => {
  const [activeReport, setActiveReport] = useState('workforce');
  const [timeRange, setTimeRange] = useState('month');

  // Mock advanced analytics data
  const workforceAnalytics = {
    totalEmployees: 124,
    activeEmployees: 118,
    onLeave: 6,
    turnoverRate: 5.2,
    avgTenure: 2.8,
    satisfactionScore: 8.4
  };

  const productivityMetrics = [
    { department: 'Engineering', current: 87, target: 90, change: 5 },
    { department: 'Marketing', current: 76, target: 80, change: -2 },
    { department: 'Finance', current: 92, target: 85, change: 8 },
    { department: 'HR', current: 85, target: 88, change: 3 },
    { department: 'Sales', current: 88, target: 90, change: 12 }
  ];

  const attendanceTrends = [
    { month: 'Jan', present: 94, remote: 78, hybrid: 86 },
    { month: 'Feb', present: 92, remote: 82, hybrid: 89 },
    { month: 'Mar', present: 89, remote: 85, hybrid: 91 },
    { month: 'Apr', present: 91, remote: 88, hybrid: 93 },
    { month: 'May', present: 88, remote: 90, hybrid: 95 },
    { month: 'Jun', present: 86, remote: 92, hybrid: 97 }
  ];

  const performanceDistribution = [
    { rating: 'Exceeds', count: 28, percentage: 23 },
    { rating: 'Meets', count: 74, percentage: 60 },
    { rating: 'Below', count: 15, percentage: 12 },
    { rating: 'Needs Improvement', count: 7, percentage: 5 }
  ];

  const exportReport = (reportType: string) => {
    toast.success(`${reportType} report exported successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive workforce insights and reporting</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => exportReport('Current Report')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeReport} onValueChange={setActiveReport} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workforce" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Workforce
          </TabsTrigger>
          <TabsTrigger value="productivity" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Productivity
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workforce" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Workforce Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Employees</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{workforceAnalytics.totalEmployees}</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="font-bold">{workforceAnalytics.activeEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">On Leave</span>
                  <Badge variant="outline">{workforceAnalytics.onLeave}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Turnover Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{workforceAnalytics.turnoverRate}%</span>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Tenure</span>
                  <span className="font-bold">{workforceAnalytics.avgTenure} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Satisfaction</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{workforceAnalytics.satisfactionScore}/10</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Department Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-48">
                <ChartContainer
                  config={{
                    employees: { color: "#3b82f6" }
                  }}
                >
                  <RechartsPrimitive.PieChart>
                    <RechartsPrimitive.Pie
                      data={[
                        { name: 'Engineering', value: 35 },
                        { name: 'Sales', value: 25 },
                        { name: 'Marketing', value: 20 },
                        { name: 'Support', value: 12 },
                        { name: 'HR', value: 8 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#3b82f6"
                      dataKey="value"
                    />
                    <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                  </RechartsPrimitive.PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Productivity Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {productivityMetrics.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.department}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{dept.current}%</span>
                      <Badge variant={dept.change >= 0 ? "default" : "destructive"}>
                        {dept.change >= 0 ? '+' : ''}{dept.change}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={dept.current} className="h-2" />
                  <div className="text-xs text-gray-500">Target: {dept.target}%</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends by Work Mode</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  present: { color: "#10b981" },
                  remote: { color: "#3b82f6" },
                  hybrid: { color: "#f59e0b" }
                }}
              >
                <RechartsPrimitive.LineChart
                  data={attendanceTrends}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                  <RechartsPrimitive.XAxis dataKey="month" />
                  <RechartsPrimitive.YAxis />
                  <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Legend />
                  <RechartsPrimitive.Line 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#10b981" 
                    name="In-Office"
                  />
                  <RechartsPrimitive.Line 
                    type="monotone" 
                    dataKey="remote" 
                    stroke="#3b82f6" 
                    name="Remote"
                  />
                  <RechartsPrimitive.Line 
                    type="monotone" 
                    dataKey="hybrid" 
                    stroke="#f59e0b" 
                    name="Hybrid"
                  />
                </RechartsPrimitive.LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ChartContainer
                  config={{
                    count: { color: "#8b5cf6" }
                  }}
                >
                  <RechartsPrimitive.BarChart
                    data={performanceDistribution}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                    <RechartsPrimitive.XAxis dataKey="rating" />
                    <RechartsPrimitive.YAxis />
                    <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                    <RechartsPrimitive.Bar dataKey="count" fill="#8b5cf6" />
                  </RechartsPrimitive.BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceDistribution.map((rating, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{rating.rating} Expectations</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{rating.count} employees</span>
                      <Badge variant="outline">{rating.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedReporting;
