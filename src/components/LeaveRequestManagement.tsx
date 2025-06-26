import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { LeaveRequest, RequestStatus } from '@/types';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Plus,
  CalendarCheck,
  CalendarX,
  Clock,
  Mail,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sendStatusUpdateEmail } from '@/utils/emailService';
import FileUpload from './FileUpload';
import ApprovalWorkflow from './ApprovalWorkflow';
import { Badge } from '@/components/ui/badge';

// Mock leave balances
const mockLeaveBalances = {
  vacation: { allocated: 25, used: 10, remaining: 15 },
  sick: { allocated: 12, used: 3, remaining: 9 },
  personal: { allocated: 5, used: 2, remaining: 3 }
};

// Mock data for leave requests
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Smith',
    startDate: '2025-06-01',
    endDate: '2025-06-07',
    type: 'vacation',
    reason: 'Annual family vacation',
    status: 'pending',
    submittedDate: '2025-05-15',
    duration: 'full-day',
    calculatedDays: 5,
    currentApprovalStep: 'manager'
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Sarah Johnson',
    startDate: '2025-05-20',
    endDate: '2025-05-21',
    type: 'sick',
    reason: 'Medical appointment',
    status: 'manager-approved',
    submittedDate: '2025-05-10',
    reviewedBy: 'Michael Brown',
    reviewDate: '2025-05-12',
    duration: 'half-day-morning',
    calculatedDays: 1,
    currentApprovalStep: 'hr',
    managerApproval: {
      approverId: 'mgr1',
      approverName: 'Michael Brown',
      approverRole: 'Department Manager',
      decision: 'approved',
      date: '2025-05-12',
      comments: 'Approved for medical reasons'
    }
  }
];

interface NewLeaveRequestFormData {
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'bereavement';
  reason: string;
  duration: 'full-day' | 'half-day-morning' | 'half-day-afternoon' | 'quarter-day-1' | 'quarter-day-2' | 'quarter-day-3' | 'quarter-day-4';
}

const LeaveRequestManagement = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [viewRequest, setViewRequest] = useState<LeaveRequest | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [declineComment, setDeclineComment] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const form = useForm<NewLeaveRequestFormData>({
    defaultValues: {
      employeeId: '',
      employeeName: '',
      startDate: '',
      endDate: '',
      type: 'vacation',
      reason: '',
      duration: 'full-day',
    },
  });

  // Mock function to get employee email (in a real app, this would come from a database)
  const getEmployeeEmail = (employeeId: string): string => {
    return `${employeeId}@company.com`;
  };

  const calculateLeaveDays = (startDate: string, endDate: string, duration: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Adjust based on duration type
    switch (duration) {
      case 'half-day-morning':
      case 'half-day-afternoon':
        return diffDays * 0.5;
      case 'quarter-day-1':
      case 'quarter-day-2':
      case 'quarter-day-3':
      case 'quarter-day-4':
        return diffDays * 0.25;
      default:
        return diffDays;
    }
  };

  const checkLeaveBalance = (type: string, requestedDays: number) => {
    const balance = mockLeaveBalances[type as keyof typeof mockLeaveBalances];
    if (!balance) return { isValid: true, message: '' };
    
    if (requestedDays > balance.remaining) {
      return {
        isValid: false,
        message: `Insufficient leave balance. Requested: ${requestedDays} days, Available: ${balance.remaining} days`
      };
    }
    return { isValid: true, message: '' };
  };

  const handleApprove = (id: string, step: 'manager' | 'hr' = 'manager') => {
    const request = requests.find(req => req.id === id);
    if (!request) return;
    
    const updatedRequests = requests.map(req => {
      if (req.id === id) {
        if (step === 'manager') {
          return {
            ...req,
            status: 'manager-approved' as RequestStatus,
            currentApprovalStep: 'hr' as const,
            managerApproval: {
              approverId: 'current-user',
              approverName: 'Current User',
              approverRole: 'Department Manager',
              decision: 'approved' as const,
              date: new Date().toISOString().split('T')[0],
              comments: 'Approved by manager'
            }
          };
        } else {
          return {
            ...req,
            status: 'approved' as RequestStatus,
            hrApproval: {
              approverId: 'current-hr',
              approverName: 'HR Manager',
              approverRole: 'HR Manager',
              decision: 'approved' as const,
              date: new Date().toISOString().split('T')[0],
              comments: 'Final approval by HR'
            }
          };
        }
      }
      return req;
    });
    
    setRequests(updatedRequests);
    toast.success(`Leave request ${step === 'manager' ? 'approved by manager' : 'fully approved'}`);
    
    // Send email notification
    sendStatusUpdateEmail(
      request.employeeName,
      getEmployeeEmail(request.employeeId),
      'leave',
      request.id,
      step === 'manager' ? 'manager-approved' : 'approved',
      { startDate: request.startDate, endDate: request.endDate }
    );
  };

  const openDeclineDialog = (id: string) => {
    setSelectedRequestId(id);
    setIsDeclineDialogOpen(true);
  };

  const handleDecline = () => {
    const id = selectedRequestId;
    const request = requests.find(req => req.id === id);
    if (!request) return;
    
    const comments = declineComment.trim() || "Request declined";
    
    const updatedRequests = requests.map(req => 
      req.id === id 
        ? { 
            ...req, 
            status: 'declined' as RequestStatus, 
            reviewDate: new Date().toISOString().split('T')[0], 
            reviewedBy: 'Current User', 
            comments 
          } 
        : req
    );
    
    setRequests(updatedRequests);
    setIsDeclineDialogOpen(false);
    setDeclineComment("");
    toast.success('Leave request declined');
    
    // Send email notification
    sendStatusUpdateEmail(
      request.employeeName,
      getEmployeeEmail(request.employeeId),
      'leave',
      request.id,
      'declined',
      { startDate: request.startDate, endDate: request.endDate },
      comments
    );
  };

  const handleView = (request: LeaveRequest) => {
    setViewRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleFileUpload = (files: any[]) => {
    setUploadedFiles(files);
    toast.success(`${files.length} file(s) uploaded as justification`);
  };

  const onSubmit = (data: NewLeaveRequestFormData) => {
    const calculatedDays = calculateLeaveDays(data.startDate, data.endDate, data.duration);
    const balanceCheck = checkLeaveBalance(data.type, calculatedDays);
    
    if (!balanceCheck.isValid) {
      toast.error(balanceCheck.message);
      return;
    }

    const newRequest: LeaveRequest = {
      id: `${Date.now()}`,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      startDate: data.startDate,
      endDate: data.endDate,
      type: data.type,
      reason: data.reason,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      duration: data.duration,
      calculatedDays,
      currentApprovalStep: 'manager',
      attachments: uploadedFiles.length > 0 ? uploadedFiles.map(file => ({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.url,
        uploadedDate: new Date().toISOString().split('T')[0]
      })) : undefined
    };
    
    setRequests([...requests, newRequest]);
    setIsCreateDialogOpen(false);
    setUploadedFiles([]);
    form.reset();
    toast.success('New leave request created and sent for approval');
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800';
    if (status === 'declined') return 'bg-red-100 text-red-800';
    if (status === 'manager-approved') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'approved') return <CalendarCheck className="h-4 w-4 mr-1 text-green-600" />;
    if (status === 'declined') return <CalendarX className="h-4 w-4 mr-1 text-red-600" />;
    if (status === 'manager-approved') return <CheckCircle className="h-4 w-4 mr-1 text-blue-600" />;
    return <Calendar className="h-4 w-4 mr-1 text-yellow-600" />;
  };

  const getDurationLabel = (duration?: string) => {
    if (!duration) return "Full Day";
    
    switch (duration) {
      case 'full-day': return "Full Day (8 hours)";
      case 'half-day-morning': return "Half Day - Morning (4 hours)";
      case 'half-day-afternoon': return "Half Day - Afternoon (4 hours)";
      case 'quarter-day-1': return "1st Quarter Day (2 Hours)";
      case 'quarter-day-2': return "2nd Quarter Day (2 Hours)";
      case 'quarter-day-3': return "3rd Quarter Day (2 Hours)";
      case 'quarter-day-4': return "4th Quarter Day (2 Hours)";
      default: return "Full Day";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leave Request Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              New Leave Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Leave Request</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-day">Full Day (8 hours)</SelectItem>
                          <SelectItem value="half-day-morning">Half Day - Morning (4 hours)</SelectItem>
                          <SelectItem value="half-day-afternoon">Half Day - Afternoon (4 hours)</SelectItem>
                          <SelectItem value="quarter-day-1">1st Quarter Day (2 Hours)</SelectItem>
                          <SelectItem value="quarter-day-2">2nd Quarter Day (2 Hours)</SelectItem>
                          <SelectItem value="quarter-day-3">3rd Quarter Day (2 Hours)</SelectItem>
                          <SelectItem value="quarter-day-4">4th Quarter Day (2 Hours)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal Leave</SelectItem>
                          <SelectItem value="maternity">Maternity Leave</SelectItem>
                          <SelectItem value="paternity">Paternity Leave</SelectItem>
                          <SelectItem value="bereavement">Bereavement Leave</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Reason for leave request" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* File Upload Section */}
                <div>
                  <FormLabel>Supporting Documents (Optional)</FormLabel>
                  <div className="mt-2">
                    <FileUpload
                      onFilesUploaded={handleFileUpload}
                      maxFiles={3}
                      acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx']}
                    />
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">
                        {uploadedFiles.length} file(s) attached
                      </p>
                    </div>
                  )}
                </div>

                {/* Leave Balance Check */}
                {form.watch('type') && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Leave Balance</h4>
                    {Object.entries(mockLeaveBalances).map(([type, balance]) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="capitalize">{type}:</span>
                        <span>{balance.remaining}/{balance.allocated} days remaining</span>
                      </div>
                    ))}
                  </div>
                )}

                <DialogFooter className="pt-4">
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.employeeName}</TableCell>
                <TableCell className="capitalize">{request.type}</TableCell>
                <TableCell>{request.startDate} to {request.endDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-sm">{getDurationLabel(request.duration)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {request.calculatedDays || 'N/A'} days
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status === 'manager-approved' ? 'Pending HR' : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                </TableCell>
                <TableCell>{request.submittedDate}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleView(request)}
                  >
                    <Eye size={16} />
                  </Button>
                  {request.status === 'pending' && request.currentApprovalStep === 'manager' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleApprove(request.id, 'manager')}
                      >
                        <CheckCircle size={16} className="text-green-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openDeclineDialog(request.id)}
                      >
                        <XCircle size={16} className="text-red-600" />
                      </Button>
                    </>
                  )}
                  {request.status === 'manager-approved' && request.currentApprovalStep === 'hr' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleApprove(request.id, 'hr')}
                      >
                        <CheckCircle size={16} className="text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openDeclineDialog(request.id)}
                      >
                        <XCircle size={16} className="text-red-600" />
                      </Button>
                    </>
                  )}
                  {(request.status === 'approved' || request.status === 'declined') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const email = getEmployeeEmail(request.employeeId);
                        sendStatusUpdateEmail(
                          request.employeeName,
                          email,
                          'leave',
                          request.id,
                          request.status as 'approved' | 'declined',
                          { startDate: request.startDate, endDate: request.endDate },
                          request.comments
                        );
                        toast.success(`Notification resent to ${request.employeeName} (${email})`);
                      }}
                    >
                      <Mail size={16} className="text-blue-600" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {viewRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Employee</p>
                  <p>{viewRequest.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Employee ID</p>
                  <p>{viewRequest.employeeId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p>{viewRequest.startDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p>{viewRequest.endDate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{getDurationLabel(viewRequest.duration)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Calculated Days</p>
                  <Badge variant="outline" className="mt-1">
                    {viewRequest.calculatedDays || 'N/A'} days
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="capitalize">{viewRequest.type}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Reason</p>
                <p>{viewRequest.reason}</p>
              </div>
              
              {viewRequest.attachments && viewRequest.attachments.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Supporting Documents</p>
                  <div className="space-y-2">
                    {viewRequest.attachments.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 p-2 border rounded">
                        <Upload className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024).toFixed(1)} KB
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(viewRequest.status)}`}>
                    {getStatusIcon(viewRequest.status)}
                    {viewRequest.status === 'manager-approved' ? 'Pending HR' : viewRequest.status.charAt(0).toUpperCase() + viewRequest.status.slice(1)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted</p>
                  <p>{viewRequest.submittedDate}</p>
                </div>
              </div>
              
              {(viewRequest.managerApproval || viewRequest.hrApproval) && (
                <div>
                  <ApprovalWorkflow
                    status={viewRequest.status}
                    managerApproval={viewRequest.managerApproval}
                    hrApproval={viewRequest.hrApproval}
                    currentStep={viewRequest.currentApprovalStep}
                  />
                </div>
              )}
              
              {viewRequest.comments && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Comments</p>
                  <p>{viewRequest.comments}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Decline Leave Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <FormLabel>Reason for declining</FormLabel>
              <Textarea 
                placeholder="Enter reason for declining this request"
                value={declineComment}
                onChange={(e) => setDeclineComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsDeclineDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDecline}>Decline Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveRequestManagement;
