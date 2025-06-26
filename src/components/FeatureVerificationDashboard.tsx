
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Users,
  Calendar,
  Settings,
  BarChart,
  Smartphone
} from 'lucide-react';

interface FeatureTest {
  name: string;
  description: string;
  status: 'passing' | 'failing' | 'partial' | 'not-implemented';
  issues?: string[];
  component?: string;
}

interface FeatureCategory {
  name: string;
  icon: any;
  tests: FeatureTest[];
}

const FeatureVerificationDashboard = () => {
  const [activeCategory, setActiveCategory] = useState('leave-requests');

  const featureCategories: FeatureCategory[] = [
    {
      name: 'Leave & Remote Work Requests',
      icon: Calendar,
      tests: [
        {
          name: 'Request Submission',
          description: 'Employee can submit leave/remote work requests',
          status: 'passing',
          component: 'LeaveRequestManagement'
        },
        {
          name: 'Duration Types',
          description: 'Quarter day, half day, full day, multiple days support',
          status: 'passing',
          component: 'LeaveRequestManagement'
        },
        {
          name: 'Auto-calculation of Days',
          description: 'Excludes Sundays and holidays',
          status: 'partial',
          issues: ['Holiday calculation not fully implemented'],
          component: 'dateCalculations.ts'
        },
        {
          name: 'File Upload Justification',
          description: 'Upload PDF, images for justification',
          status: 'not-implemented',
          issues: ['File upload component exists but not integrated with requests']
        },
        {
          name: 'Leave Balance Check',
          description: 'Check balance and alert if over quota',
          status: 'partial',
          issues: ['Balance display exists but quota alerts not implemented']
        },
        {
          name: 'Two-Step Approval Workflow',
          description: 'Manager → HR approval process',
          status: 'partial',
          issues: ['Workflow UI exists but backend logic incomplete'],
          component: 'ApprovalWorkflow'
        },
        {
          name: 'Status Tracking',
          description: 'Pending, approved, rejected with reasons',
          status: 'passing',
          component: 'LeaveRequestManagement'
        },
        {
          name: 'Email Notifications',
          description: 'Notifications for status changes',
          status: 'passing',
          component: 'emailService.ts'
        }
      ]
    },
    {
      name: 'Department & Employee Management',
      icon: Users,
      tests: [
        {
          name: 'Department CRUD',
          description: 'Create, edit, delete departments',
          status: 'passing',
          component: 'DepartmentManagement'
        },
        {
          name: 'Manager Assignment',
          description: 'Assign managers per department',
          status: 'passing',
          component: 'DepartmentManagement'
        },
        {
          name: 'Employee-Department Linking',
          description: 'Link employees to departments',
          status: 'passing',
          component: 'EmployeeDirectory'
        },
        {
          name: 'Manager Auto-Rights',
          description: 'Automatic approval rights for managers',
          status: 'partial',
          issues: ['Rights assignment logic needs implementation']
        }
      ]
    },
    {
      name: 'Document Management',
      icon: FileText,
      tests: [
        {
          name: 'Employee Document Folders',
          description: 'Secure document space per employee',
          status: 'passing',
          component: 'DocumentManagement'
        },
        {
          name: 'Document Categories',
          description: 'CV, contract, diploma, ID, passport, certifications',
          status: 'passing',
          component: 'DocumentManagement'
        },
        {
          name: 'Upload Metadata',
          description: 'Track who uploaded and when',
          status: 'passing',
          component: 'DocumentManagement'
        },
        {
          name: 'Role-based Permissions',
          description: 'Admin, HR, Employee access controls',
          status: 'passing',
          component: 'DocumentManagement'
        },
        {
          name: 'Document Request System',
          description: 'Request payslips, certificates, etc.',
          status: 'passing',
          component: 'EnhancedDocumentRequestSystem'
        },
        {
          name: 'PDF Template Generation',
          description: 'Generate documents from templates',
          status: 'passing',
          component: 'pdfGenerator.ts'
        },
        {
          name: 'Template Management',
          description: 'Admin can manage PDF templates',
          status: 'passing',
          component: 'DocumentTemplateManager'
        }
      ]
    },
    {
      name: 'Attendance & Time Tracking',
      icon: Clock,
      tests: [
        {
          name: 'Clock In/Out System',
          description: 'Web-based clock in/out functionality',
          status: 'passing',
          component: 'AttendanceTracking'
        },
        {
          name: 'Status Types',
          description: 'Present, late, remote, half-day, absent',
          status: 'passing',
          component: 'AttendanceTracking'
        },
        {
          name: 'Location Tracking',
          description: 'Track work location (office, home, etc.)',
          status: 'passing',
          component: 'AttendanceTracking'
        },
        {
          name: 'Time Calculation',
          description: 'Automatic hours calculation',
          status: 'passing',
          component: 'AttendanceTracking'
        },
        {
          name: 'Geolocation Restrictions',
          description: 'IP/location-based clock-in restrictions',
          status: 'not-implemented',
          issues: ['Requires geolocation API integration']
        }
      ]
    },
    {
      name: 'Performance Management',
      icon: BarChart,
      tests: [
        {
          name: 'Goal Setting',
          description: 'Set and track employee goals',
          status: 'passing',
          component: 'PerformanceManagement'
        },
        {
          name: 'Performance Reviews',
          description: 'Periodic review system',
          status: 'passing',
          component: 'PerformanceManagement'
        },
        {
          name: 'Rating System',
          description: 'Performance scoring and rating',
          status: 'passing',
          component: 'PerformanceManagement'
        },
        {
          name: '360-degree Feedback',
          description: 'Multi-perspective feedback collection',
          status: 'not-implemented',
          issues: ['Basic review system exists, 360-degree feature missing']
        }
      ]
    },
    {
      name: 'Onboarding & Offboarding',
      icon: Users,
      tests: [
        {
          name: 'Onboarding Workflows',
          description: 'Custom workflows per role',
          status: 'passing',
          component: 'OnboardingWorkflow'
        },
        {
          name: 'Task Assignments',
          description: 'Assign tasks to IT, HR, managers',
          status: 'passing',
          component: 'OnboardingWorkflow'
        },
        {
          name: 'Document Collection',
          description: 'Collect required documents during onboarding',
          status: 'partial',
          issues: ['Task management exists, document collection integration needed']
        },
        {
          name: 'Offboarding Checklist',
          description: 'Exit process and clearance tracking',
          status: 'passing',
          component: 'OnboardingWorkflow'
        }
      ]
    },
    {
      name: 'Reports & Analytics',
      icon: BarChart,
      tests: [
        {
          name: 'Advanced Reporting',
          description: 'Custom report builder with charts',
          status: 'passing',
          component: 'AdvancedReporting'
        },
        {
          name: 'Dashboard Analytics',
          description: 'Visual charts and metrics',
          status: 'passing',
          component: 'Reports'
        },
        {
          name: 'Export Functionality',
          description: 'Export to Excel, CSV, PDF',
          status: 'partial',
          issues: ['Export buttons exist but actual export logic incomplete']
        },
        {
          name: 'Scheduled Reports',
          description: 'Automated report generation and delivery',
          status: 'not-implemented',
          issues: ['Requires backend scheduling system']
        }
      ]
    },
    {
      name: 'Mobile & Integration',
      icon: Smartphone,
      tests: [
        {
          name: 'Mobile Responsiveness',
          description: 'Mobile-optimized interface',
          status: 'passing',
          component: 'MobileOptimization'
        },
        {
          name: 'External Integrations',
          description: 'Teams, Calendar, Email integrations',
          status: 'partial',
          issues: ['Integration UI exists, actual API connections not implemented'],
          component: 'ExternalIntegrations'
        },
        {
          name: 'Push Notifications',
          description: 'Real-time notifications',
          status: 'not-implemented',
          issues: ['Requires service worker and notification API']
        }
      ]
    }
  ];

  const getStatusIcon = (status: FeatureTest['status']) => {
    switch (status) {
      case 'passing': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failing': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'partial': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'not-implemented': return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: FeatureTest['status']) => {
    switch (status) {
      case 'passing': return 'bg-green-100 text-green-800';
      case 'failing': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'not-implemented': return 'bg-gray-100 text-gray-600';
    }
  };

  const calculateCategoryProgress = (category: FeatureCategory) => {
    const total = category.tests.length;
    const passing = category.tests.filter(t => t.status === 'passing').length;
    const partial = category.tests.filter(t => t.status === 'partial').length;
    return Math.round(((passing + partial * 0.5) / total) * 100);
  };

  const overallProgress = Math.round(
    featureCategories.reduce((acc, cat) => acc + calculateCategoryProgress(cat), 0) / featureCategories.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feature Verification Dashboard</h1>
          <p className="text-gray-600">Comprehensive testing of all HR system features</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{overallProgress}%</div>
          <p className="text-sm text-gray-600">Overall Progress</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featureCategories.map((category) => {
              const progress = calculateCategoryProgress(category);
              const IconComponent = category.icon;
              return (
                <div key={category.name} className="text-center p-4 border rounded-lg">
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium text-sm">{category.name}</p>
                  <div className="text-lg font-bold text-blue-600">{progress}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {featureCategories.map((category, index) => (
            <TabsTrigger 
              key={index} 
              value={category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
              className="text-xs"
            >
              {category.name.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {featureCategories.map((category, categoryIndex) => (
          <TabsContent 
            key={categoryIndex}
            value={category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.tests.map((test, testIndex) => (
                    <div key={testIndex} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(test.status)}
                          <h4 className="font-medium">{test.name}</h4>
                          <Badge className={getStatusColor(test.status)} variant="outline">
                            {test.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                        {test.component && (
                          <p className="text-xs text-blue-600">Component: {test.component}</p>
                        )}
                        {test.issues && test.issues.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-red-600 mb-1">Issues:</p>
                            <ul className="text-xs text-red-600 list-disc list-inside">
                              {test.issues.map((issue, i) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FeatureVerificationDashboard;
