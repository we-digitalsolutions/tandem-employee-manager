
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
import { LeaveRequest } from '@/types';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Plus,
  CalendarCheck,
  CalendarX
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

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
  },
];

interface NewLeaveRequestFormData {
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'bereavement';
  reason: string;
}

const LeaveRequestManagement = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [viewRequest, setViewRequest] = useState<LeaveRequest | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const form = useForm<NewLeaveRequestFormData>({
    defaultValues: {
      employeeId: '',
      employeeName: '',
      startDate: '',
      endDate: '',
      type: 'vacation',
      reason: '',
    },
  });

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id 
        ? { ...req, status: 'approved', reviewDate: new Date().toISOString().split('T')[0], reviewedBy: 'Current User' } 
        : req
    ));
    toast.success('Leave request approved');
  };

  const handleDecline = (id: string, comments: string = 'Request declined') => {
    setRequests(requests.map(req => 
      req.id === id 
        ? { ...req, status: 'declined', reviewDate: new Date().toISOString().split('T')[0], reviewedBy: 'Current User', comments } 
        : req
    ));
    toast.success('Leave request declined');
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="vacation">Vacation</option>
                          <option value="sick">Sick Leave</option>
                          <option value="personal">Personal Leave</option>
                          <option value="maternity">Maternity Leave</option>
                          <option value="paternity">Paternity Leave</option>
                          <option value="bereavement">Bereavement Leave</option>
                        </select>
                      </FormControl>
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
                        onClick={() => handleDecline(request.id)}
                      >
                        <XCircle size={16} className="text-red-600" />
                      </Button>
                    </>
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
    </div>
  );
};

export default LeaveRequestManagement;
