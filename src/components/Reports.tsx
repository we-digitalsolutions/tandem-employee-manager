
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ChartContainer } from '@/components/ui/chart';
import * as RechartsPrimitive from "recharts";
import { ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Download, BarChart, CalendarCheck, FileText } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('attendance');

  // Mock data for reports
  const attendanceData = [
    { month: 'Jan', present: 92, absent: 8, leave: 0 },
    { month: 'Feb', present: 89, absent: 5, leave: 6 },
    { month: 'Mar', present: 85, absent: 10, leave: 5 },
    { month: 'Apr', present: 90, absent: 2, leave: 8 },
    { month: 'May', present: 88, absent: 7, leave: 5 },
    { month: 'Jun', present: 82, absent: 8, leave: 10 },
  ];
  
  const departmentProductivityData = [
    { department: 'Engineering', productivity: 87 },
    { department: 'Marketing', productivity: 76 },
    { department: 'Finance', productivity: 92 },
    { department: 'HR', productivity: 85 },
    { department: 'Product', productivity: 79 },
    { department: 'Design', productivity: 83 },
    { department: 'Sales', productivity: 88 },
  ];
  
  const leaveDistributionData = [
    { type: 'Vacation', value: 45 },
    { type: 'Sick', value: 25 },
    { type: 'Personal', value: 15 },
    { type: 'Maternity', value: 8 },
    { type: 'Paternity', value: 5 },
    { type: 'Bereavement', value: 2 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and view reports on employee data</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="attendance" onValueChange={setReportType}>
        <TabsList className="mb-6">
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <CalendarCheck size={16} />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="productivity" className="flex items-center gap-2">
            <BarChart size={16} />
            Productivity
          </TabsTrigger>
          <TabsTrigger value="leave" className="flex items-center gap-2">
            <FileText size={16} />
            Leave Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Report</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  present: { color: "#38b2ac" },
                  absent: { color: "#f56565" },
                  leave: { color: "#ecc94b" }
                }}
              >
                <RechartsPrimitive.BarChart
                  data={attendanceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                  <RechartsPrimitive.XAxis dataKey="month" />
                  <RechartsPrimitive.YAxis />
                  <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Legend />
                  <RechartsPrimitive.Bar dataKey="present" stackId="a" fill="#38b2ac" name="Present" />
                  <RechartsPrimitive.Bar dataKey="absent" stackId="a" fill="#f56565" name="Absent" />
                  <RechartsPrimitive.Bar dataKey="leave" stackId="a" fill="#ecc94b" name="Leave" />
                </RechartsPrimitive.BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Productivity</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  productivity: { color: "#805ad5" }
                }}
              >
                <RechartsPrimitive.BarChart
                  data={departmentProductivityData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                  <RechartsPrimitive.XAxis dataKey="department" />
                  <RechartsPrimitive.YAxis />
                  <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Bar dataKey="productivity" fill="#805ad5" />
                </RechartsPrimitive.BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Distribution by Type</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  value: { color: "#4c51bf" }
                }}
              >
                <RechartsPrimitive.PieChart>
                  <RechartsPrimitive.Pie
                    data={leaveDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {leaveDistributionData.map((entry, index) => (
                      <RechartsPrimitive.Cell 
                        key={`cell-${index}`} 
                        fill={['#4c51bf', '#38b2ac', '#f56565', '#ecc94b', '#ed64a6', '#9f7aea'][index % 6]} 
                      />
                    ))}
                  </RechartsPrimitive.Pie>
                  <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Legend />
                </RechartsPrimitive.PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
