
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, User, UserX, Plus, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';

interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  category: 'hr' | 'it' | 'manager' | 'employee';
}

interface Workflow {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'onboarding' | 'offboarding';
  status: 'active' | 'completed' | 'cancelled';
  startDate: string;
  targetDate: string;
  tasks: WorkflowTask[];
  progress: number;
}

interface OnboardingWorkflowProps {
  employeeId?: string;
  isHR?: boolean;
}

const defaultOnboardingTasks: Omit<WorkflowTask, 'id' | 'assignedTo' | 'dueDate'>[] = [
  {
    title: 'Send welcome email',
    description: 'Send welcome email with first day information',
    status: 'pending',
    category: 'hr'
  },
  {
    title: 'Prepare workspace',
    description: 'Set up desk, chair, and office supplies',
    status: 'pending',
    category: 'hr'
  },
  {
    title: 'Create IT accounts',
    description: 'Set up email, system access, and security credentials',
    status: 'pending',
    category: 'it'
  },
  {
    title: 'Equipment assignment',
    description: 'Assign laptop, phone, and other necessary equipment',
    status: 'pending',
    category: 'it'
  },
  {
    title: 'Complete orientation',
    description: 'Attend company orientation and training sessions',
    status: 'pending',
    category: 'employee'
  },
  {
    title: 'Meet with manager',
    description: 'Initial meeting to discuss role and expectations',
    status: 'pending',
    category: 'manager'
  }
];

const defaultOffboardingTasks: Omit<WorkflowTask, 'id' | 'assignedTo' | 'dueDate'>[] = [
  {
    title: 'Collect company property',
    description: 'Retrieve laptop, phone, ID card, and other company assets',
    status: 'pending',
    category: 'hr'
  },
  {
    title: 'Disable IT accounts',
    description: 'Deactivate email, system access, and security credentials',
    status: 'pending',
    category: 'it'
  },
  {
    title: 'Knowledge transfer',
    description: 'Transfer responsibilities and knowledge to team members',
    status: 'pending',
    category: 'manager'
  },
  {
    title: 'Exit interview',
    description: 'Conduct exit interview and gather feedback',
    status: 'pending',
    category: 'hr'
  },
  {
    title: 'Final payroll',
    description: 'Process final salary and benefits',
    status: 'pending',
    category: 'hr'
  }
];

// Mock workflow data
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    employeeId: '105',
    employeeName: 'Alice Cooper',
    type: 'onboarding',
    status: 'active',
    startDate: '2025-06-20',
    targetDate: '2025-07-05',
    progress: 60,
    tasks: [
      {
        id: '1',
        title: 'Send welcome email',
        description: 'Send welcome email with first day information',
        assignedTo: 'HR Team',
        dueDate: '2025-06-19',
        status: 'completed',
        category: 'hr'
      },
      {
        id: '2',
        title: 'Create IT accounts',
        description: 'Set up email, system access, and security credentials',
        assignedTo: 'IT Team',
        dueDate: '2025-06-25',
        status: 'in-progress',
        category: 'it'
      }
    ]
  }
];

const OnboardingWorkflow: React.FC<OnboardingWorkflowProps> = ({
  employeeId,
  isHR = false
}) => {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [isNewWorkflowDialogOpen, setIsNewWorkflowDialogOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    employeeName: '',
    type: 'onboarding' as 'onboarding' | 'offboarding',
    targetDate: ''
  });

  const getStatusColor = (status: WorkflowTask['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: WorkflowTask['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: WorkflowTask['category']) => {
    switch (category) {
      case 'hr': return 'bg-purple-100 text-purple-800';
      case 'it': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'employee': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (tasks: WorkflowTask[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflow.employeeName.trim() || !newWorkflow.targetDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const taskTemplates = newWorkflow.type === 'onboarding' 
      ? defaultOnboardingTasks 
      : defaultOffboardingTasks;

    const tasks: WorkflowTask[] = taskTemplates.map((template, index) => ({
      ...template,
      id: `${Date.now()}-${index}`,
      assignedTo: template.category === 'hr' ? 'HR Team' : 
                  template.category === 'it' ? 'IT Team' :
                  template.category === 'manager' ? 'Manager' : 'Employee',
      dueDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));

    const workflow: Workflow = {
      id: `${Date.now()}`,
      employeeId: `emp-${Date.now()}`,
      employeeName: newWorkflow.employeeName,
      type: newWorkflow.type,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: newWorkflow.targetDate,
      tasks,
      progress: 0
    };

    setWorkflows([workflow, ...workflows]);
    setNewWorkflow({ employeeName: '', type: 'onboarding', targetDate: '' });
    setIsNewWorkflowDialogOpen(false);
    toast.success(`${newWorkflow.type.charAt(0).toUpperCase() + newWorkflow.type.slice(1)} workflow created`);
  };

  const updateTaskStatus = (workflowId: string, taskId: string, status: WorkflowTask['status']) => {
    setWorkflows(workflows.map(workflow => {
      if (workflow.id === workflowId) {
        const updatedTasks = workflow.tasks.map(task =>
          task.id === taskId ? { ...task, status } : task
        );
        const progress = calculateProgress(updatedTasks);
        return { ...workflow, tasks: updatedTasks, progress };
      }
      return workflow;
    }));
    toast.success('Task status updated');
  };

  const filteredWorkflows = employeeId 
    ? workflows.filter(w => w.employeeId === employeeId)
    : workflows;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Onboarding & Offboarding
          </CardTitle>
          {isHR && (
            <Dialog open={isNewWorkflowDialogOpen} onOpenChange={setIsNewWorkflowDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Workflow
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Workflow</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="employeeName">Employee Name</Label>
                    <Input
                      id="employeeName"
                      value={newWorkflow.employeeName}
                      onChange={(e) => setNewWorkflow({...newWorkflow, employeeName: e.target.value})}
                      placeholder="Enter employee name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workflowType">Workflow Type</Label>
                    <Select
                      value={newWorkflow.type}
                      onValueChange={(value: 'onboarding' | 'offboarding') =>
                        setNewWorkflow({...newWorkflow, type: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="offboarding">Offboarding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="targetDate">Target Completion Date</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={newWorkflow.targetDate}
                      onChange={(e) => setNewWorkflow({...newWorkflow, targetDate: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredWorkflows.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active workflows</p>
          ) : (
            filteredWorkflows.map((workflow) => (
              <div key={workflow.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {workflow.type === 'onboarding' ? <User className="h-5 w-5 text-green-600" /> : <UserX className="h-5 w-5 text-red-600" />}
                      {workflow.employeeName} - {workflow.type.charAt(0).toUpperCase() + workflow.type.slice(1)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Started: {new Date(workflow.startDate).toLocaleDateString()}
                      </span>
                      <span>Target: {new Date(workflow.targetDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={workflow.status === 'completed' ? 'default' : 'secondary'}>
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </Badge>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <Progress value={workflow.progress} className="w-24" />
                        <span className="text-sm text-gray-600">{workflow.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Tasks</h4>
                  {workflow.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <h5 className="font-medium">{task.title}</h5>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>Assigned to: {task.assignedTo}</span>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(task.category)} variant="outline">
                          {task.category.toUpperCase()}
                        </Badge>
                        <Select
                          value={task.status}
                          onValueChange={(value: WorkflowTask['status']) =>
                            updateTaskStatus(workflow.id, task.id, value)
                          }
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingWorkflow;
