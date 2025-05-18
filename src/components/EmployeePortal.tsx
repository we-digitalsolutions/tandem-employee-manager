
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { 
  Calendar, 
  FileText,
  Plus,
  CalendarCheck,
  CalendarX,
  FilePlus,
  FileMinus,
  Clock
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeaveRequest, RemoteRequest } from '@/types';

// Mock data for employee's leave requests
const mockMyLeaveRequests: LeaveRequest[] = [
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
    employeeId: '101',
    employeeName: 'John Smith',
    startDate: '2025-04-10',
    endDate: '2025-04-10',
    type: 'sick',
    reason: 'Doctor appointment',
    status: 'approved',
    submittedDate: '2025-04-08',
    reviewedBy: 'Michael Brown',
    reviewDate: '2025-04-09',
  },
  {
    id: '3',
    employeeId: '101',
    employeeName: 'John Smith',
    startDate: '2025-03-15',
    endDate: '2025-03-15',
    type: 'personal',
    reason: 'Personal matters',
    status: 'declined',
    submittedDate: '2025-03-12',
    reviewedBy: 'Michael Brown',
    reviewDate: '2025-03-13',
    comments: 'Critical project deadline on this date',
  },
];

// Mock data for employee's remote work requests
const mockMyRemoteRequests: RemoteRequest[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Smith',
    startDate: '2025-06-15',
    endDate: '2025-06-17',
    reason: 'Working on project remotely',
    status: 'pending',
    submittedDate: '2025-05-20',
    location: 'Home Office'
  },
  {
    id: '2',
    employeeId: '101',
    employeeName: 'John Smith',
    startDate: '2025-05-05',
    endDate: '2025-05-05',
    reason: 'Internet issue at the office',
    status: 'approved',
    submittedDate: '2025-05-04',
    reviewedBy: 'Michael Brown',
    reviewDate: '2025-05-04',
    location: 'Home Office'
  },
];

// Types for form data
interface NewLeaveRequestFormData {
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'bereavement';
  reason: string;
  duration: 'full-day' | 'half-day-morning' | 'half-day-afternoon' | 'quarter-day-1' | 'quarter-day-2' | 'quarter-day-3' | 'quarter-day-4';
}

interface NewRemoteRequestFormData {
  startDate: string;
  endDate: string;
  reason: string;
  location: string;
  duration: 'full-day' | 'half-day-morning' | 'half-day-afternoon' | 'quarter-day-1' | 'quarter-day-2' | 'quarter-day-3' | 'quarter-day-4';
}

const EmployeePortal = () => {
  const [myLeaveRequests, setMyLeaveRequests] = useState<LeaveRequest[]>(mockMyLeaveRequests);
  const [myRemoteRequests, setMyRemoteRequests] = useState<RemoteRequest[]>(mockMyRemoteRequests);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isRemoteDialogOpen, setIsRemoteDialogOpen] = useState(false);
  const [viewLeaveRequest, setViewLeaveRequest] = useState<LeaveRequest | null>(null);
  const [viewRemoteRequest, setViewRemoteRequest] = useState<RemoteRequest | null>(null);
  const [isViewLeaveDialogOpen, setIsViewLeaveDialogOpen] = useState(false);
  const [isViewRemoteDialogOpen, setIsViewRemoteDialogOpen] = useState(false);

  const leaveForm = useForm<NewLeaveRequestFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      type: 'vacation',
      reason: '',
      duration: 'full-day',
    },
  });

  const remoteForm = useForm<NewRemoteRequestFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      reason: '',
      location: 'Home Office',
      duration: 'full-day',
    },
  });

  const handleLeaveSubmit = (data: NewLeaveRequestFormData) => {
    const newRequest: LeaveRequest = {
      id: `L${Date.now()}`,
      employeeId: '101',
      employeeName: 'John Smith',
      startDate: data.startDate,
      endDate: data.endDate,
      type: data.type,
      reason: data.reason,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    
    setMyLeaveRequests([...myLeaveRequests, newRequest]);
    setIsLeaveDialogOpen(false);
    leaveForm.reset();
    toast.success('Leave request submitted successfully');
  };

  const handleRemoteSubmit = (data: NewRemoteRequestFormData) => {
    const newRequest: RemoteRequest = {
      id: `R${Date.now()}`,
      employeeId: '101',
      employeeName: 'John Smith',
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      location: data.location,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    
    setMyRemoteRequests([...myRemoteRequests, newRequest]);
    setIsRemoteDialogOpen(false);
    remoteForm.reset();
    toast.success('Remote work request submitted successfully');
  };

  const handleViewLeave = (request: LeaveRequest) => {
    setViewLeaveRequest(request);
    setIsViewLeaveDialogOpen(true);
  };

  const handleViewRemote = (request: RemoteRequest) => {
    setViewRemoteRequest(request);
    setIsViewRemoteDialogOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800';
    if (status === 'declined') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (status: string, type: 'leave' | 'remote') => {
    if (type === 'leave') {
      if (status === 'approved') return <CalendarCheck className="h-4 w-4 mr-1 text-green-600" />;
      if (status === 'declined') return <CalendarX className="h-4 w-4 mr-1 text-red-600" />;
      return <Calendar className="h-4 w-4 mr-1 text-yellow-600" />;
    } else {
      if (status === 'approved') return <FilePlus className="h-4 w-4 mr-1 text-green-600" />;
      if (status === 'declined') return <FileMinus className="h-4 w-4 mr-1 text-red-600" />;
      return <FileText className="h-4 w-4 mr-1 text-yellow-600" />;
    }
  };

  const renderDurationSelect = (type: 'leave' | 'remote') => {
    const form = type === 'leave' ? leaveForm : remoteForm;
    
    return (
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
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Portal</h1>
        <p className="text-gray-600">Manage your leave and remote work requests</p>
      </div>

      <Tabs defaultValue="leave">
        <TabsList className="mb-6">
          <TabsTrigger value="leave" className="flex items-center gap-2">
            <Calendar size={16} />
            Leave Requests
          </TabsTrigger>
          <TabsTrigger value="remote" className="flex items-center gap-2">
            <FileText size={16} />
            Remote Work Requests
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="leave" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Leave Requests</h2>
            <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  New Leave Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request Leave</DialogTitle>
                </DialogHeader>
                <Form {...leaveForm}>
                  <form onSubmit={leaveForm.handleSubmit(handleLeaveSubmit)} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={leaveForm.control}
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
                        control={leaveForm.control}
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
                    
                    {renderDurationSelect('leave')}
                    
                    <FormField
                      control={leaveForm.control}
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
                      control={leaveForm.control}
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

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myLeaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="capitalize">{request.type}</TableCell>
                      <TableCell>{request.startDate} to {request.endDate}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                          {getStatusIcon(request.status, 'leave')}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>{request.submittedDate}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewLeave(request)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isViewLeaveDialogOpen} onOpenChange={setIsViewLeaveDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Leave Request Details</DialogTitle>
              </DialogHeader>
              {viewLeaveRequest && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Date</p>
                      <p>{viewLeaveRequest.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">End Date</p>
                      <p>{viewLeaveRequest.endDate}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="capitalize">{viewLeaveRequest.type}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reason</p>
                    <p>{viewLeaveRequest.reason}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(viewLeaveRequest.status)}`}>
                        {getStatusIcon(viewLeaveRequest.status, 'leave')}
                        {viewLeaveRequest.status.charAt(0).toUpperCase() + viewLeaveRequest.status.slice(1)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submitted</p>
                      <p>{viewLeaveRequest.submittedDate}</p>
                    </div>
                  </div>
                  
                  {viewLeaveRequest.reviewedBy && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Reviewed By</p>
                        <p>{viewLeaveRequest.reviewedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Review Date</p>
                        <p>{viewLeaveRequest.reviewDate}</p>
                      </div>
                    </div>
                  )}
                  
                  {viewLeaveRequest.comments && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Comments</p>
                      <p>{viewLeaveRequest.comments}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="remote" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Remote Work Requests</h2>
            <Dialog open={isRemoteDialogOpen} onOpenChange={setIsRemoteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  New Remote Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request Remote Work</DialogTitle>
                </DialogHeader>
                <Form {...remoteForm}>
                  <form onSubmit={remoteForm.handleSubmit(handleRemoteSubmit)} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={remoteForm.control}
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
                        control={remoteForm.control}
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
                    
                    {renderDurationSelect('remote')}

                    <FormField
                      control={remoteForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remote Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Where will you be working from?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={remoteForm.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Reason for remote work request" {...field} />
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

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRemoteRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>{request.startDate} to {request.endDate}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                          {getStatusIcon(request.status, 'remote')}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>{request.submittedDate}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewRemote(request)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isViewRemoteDialogOpen} onOpenChange={setIsViewRemoteDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Remote Work Request Details</DialogTitle>
              </DialogHeader>
              {viewRemoteRequest && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Date</p>
                      <p>{viewRemoteRequest.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">End Date</p>
                      <p>{viewRemoteRequest.endDate}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Remote Location</p>
                    <p>{viewRemoteRequest.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reason</p>
                    <p>{viewRemoteRequest.reason}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(viewRemoteRequest.status)}`}>
                        {getStatusIcon(viewRemoteRequest.status, 'remote')}
                        {viewRemoteRequest.status.charAt(0).toUpperCase() + viewRemoteRequest.status.slice(1)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submitted</p>
                      <p>{viewRemoteRequest.submittedDate}</p>
                    </div>
                  </div>
                  
                  {viewRemoteRequest.reviewedBy && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Reviewed By</p>
                        <p>{viewRemoteRequest.reviewedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Review Date</p>
                        <p>{viewRemoteRequest.reviewDate}</p>
                      </div>
                    </div>
                  )}
                  
                  {viewRemoteRequest.comments && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Comments</p>
                      <p>{viewRemoteRequest.comments}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={18} />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...myLeaveRequests, ...myRemoteRequests]
              .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
              .slice(0, 5)
              .map((request, index) => {
                const isLeave = 'type' in request;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`${isLeave ? 'bg-blue-500' : 'bg-purple-500'} p-2 rounded-full`}>
                      {isLeave ? 
                        <Calendar className="h-4 w-4 text-white" /> : 
                        <FileText className="h-4 w-4 text-white" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {isLeave ? 'Leave Request' : 'Remote Work Request'} - 
                        <span className={`ml-1 ${
                          request.status === 'approved' ? 'text-green-600' : 
                          request.status === 'declined' ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {isLeave ? 
                          `${(request as LeaveRequest).type.charAt(0).toUpperCase() + (request as LeaveRequest).type.slice(1)} leave` : 
                          `From ${request.location}`
                        } • {request.startDate} to {request.endDate}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeePortal;
