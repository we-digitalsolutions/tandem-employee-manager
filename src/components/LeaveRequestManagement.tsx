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
  Mail
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sendStatusUpdateEmail } from '@/utils/emailService';

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
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Sarah Johnson',
    startDate: '2025-05-20',
    endDate: '2025-05-21',
    type: 'sick',
    reason: 'Medical appointment',
    status: 'approved',
    submittedDate: '2025-05-10',
    reviewedBy: 'Michael Brown',
    reviewDate: '2025-05-12',
    duration: 'half-day-morning',
  },
  {
    id: '3',
    employeeId: '103',
    employeeName: 'Emily Davis',
    startDate: '2025-06-15',
    endDate: '2025-06-30',
    type: 'maternity',
    reason: 'Maternity leave',
    status: 'approved',
    submittedDate: '2025-04-30',
    reviewedBy: 'Michael Brown',
    reviewDate: '2025-05-02',
    duration: 'full-day',
  },
  {
    id: '4',
    employeeId: '104',
    employeeName: 'David Wilson',
    startDate: '2025-05-25',
    endDate: '2025-05-25',
    type: 'personal',
    reason: 'Personal matters',
    status: 'declined',
    submittedDate: '2025-05-18',
    reviewedBy: 'Michael Brown',
    reviewDate: '2025-05-19',
    comments: 'Critical project deadline on this date',
    duration: 'quarter-day-3',
  },
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
    // This is a mock function returning fake emails
    return `${employeeId}@company.com`;
  };

  const handleApprove = (id: string) => {
    const request = requests.find(req => req.id === id);
    if (!request) return;
    
    const updatedRequests = requests.map(req => 
      req.id === id 
        ? { 
            ...req, 
            status: 'approved' as RequestStatus, 
            reviewDate: new Date().toISOString().split('T')[0], 
            reviewedBy: 'Current User' 
          } 
        : req
    );
    
    setRequests(updatedRequests);
    toast.success('Leave request approved');
    
    // Send email notification
    sendStatusUpdateEmail(
      request.employeeName,
      getEmployeeEmail(request.employeeId),
      'leave',
      request.id,
      'approved',
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

  const onSubmit = (data: NewLeaveRequestFormData) => {
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
    };
    
    setRequests([...requests, newRequest]);
    setIsCreateDialogOpen(false);
    form.reset();
    toast.success('New leave request created');
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800';
    if (status === 'declined') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'approved') return <CalendarCheck className="h-4 w-4 mr-1 text-green-600" />;
    if (status === 'declined') return <CalendarX className="h-4 w-4 mr-1 text-red-600" />;
    return <Calendar className="h-4 w-4 mr-1 text-yellow-600" />;
  };

  const getDurationLabel = (duration?: string) => {
    if (!duration) return "Full Day";
    
    switch (duration) {
      case 'full-day': return "Full Day (8 hours)";
      case 'half-day-morning': return "Half Day - Morning (4 hours)";
      case 'half-day-afternoon': return "Half Day - Afternoon (4 hours)";
      case 'quarter-day-1': return "Quarter Day - 8:00-10:00";
      case 'quarter-day-2': return "Quarter Day - 10:00-12:00";
      case 'quarter-day-3': return "Quarter Day - 13:00-15:00";
      case 'quarter-day-4': return "Quarter Day - 15:00-17:00";
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
          <DialogContent className="sm:max-w-[425px]">
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
                          <SelectItem value="quarter-day-1">Quarter Day - 8:00-10:00</SelectItem>
                          <SelectItem value="quarter-day-2">Quarter Day - 10:00-12:00</SelectItem>
                          <SelectItem value="quarter-day-3">Quarter Day - 13:00-15:00</SelectItem>
                          <SelectItem value="quarter-day-4">Quarter Day - 15:00-17:00</SelectItem>
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
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
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
                  {request.status === 'pending' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleApprove(request.id)}
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
                  {request.status !== 'pending' && (
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
        <DialogContent className="sm:max-w-[500px]">
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
              
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{getDurationLabel(viewRequest.duration)}</span>
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(viewRequest.status)}`}>
                    {getStatusIcon(viewRequest.status)}
                    {viewRequest.status.charAt(0).toUpperCase() + viewRequest.status.slice(1)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted</p>
                  <p>{viewRequest.submittedDate}</p>
                </div>
              </div>
              
              {viewRequest.reviewedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reviewed By</p>
                    <p>{viewRequest.reviewedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Review Date</p>
                    <p>{viewRequest.reviewDate}</p>
                  </div>
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
