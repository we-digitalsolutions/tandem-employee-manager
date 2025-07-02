
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { FileText, Plus, Download, CheckCircle, XCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DocumentRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: 'payslip' | 'work-certificate' | 'salary-certificate' | 'mission-order' | 'custom';
  status: 'pending' | 'processing' | 'completed' | 'declined';
  submittedDate: string;
  processedBy?: string;
  processedDate?: string;
  generatedDocumentUrl?: string;
  comments?: string;
  customDescription?: string;
  additionalData?: any;
}

const mockRequests: DocumentRequest[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Smith',
    documentType: 'work-certificate',
    status: 'completed',
    submittedDate: '2024-12-20',
    processedBy: 'HR Manager',
    processedDate: '2024-12-21',
    generatedDocumentUrl: '/documents/work-cert-john-smith.pdf',
    comments: 'Document generated successfully'
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Sarah Johnson',
    documentType: 'salary-certificate',
    status: 'processing',
    submittedDate: '2024-12-22',
    comments: 'Under review'
  },
  {
    id: '3',
    employeeId: '103',
    employeeName: 'Mike Wilson',
    documentType: 'custom',
    customDescription: 'Letter of recommendation for MBA application',
    status: 'pending',
    submittedDate: '2024-12-23'
  }
];

interface RequestFormData {
  employeeId: string;
  employeeName: string;
  documentType: 'payslip' | 'work-certificate' | 'salary-certificate' | 'mission-order' | 'custom';
  customDescription?: string;
  additionalNotes?: string;
}

const EnhancedDocumentRequestSystem = () => {
  const [requests, setRequests] = useState<DocumentRequest[]>(mockRequests);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);

  const form = useForm<RequestFormData>({
    defaultValues: {
      employeeId: '',
      employeeName: '',
      documentType: 'work-certificate',
      customDescription: '',
      additionalNotes: '',
    },
  });

  const onSubmit = (data: RequestFormData) => {
    const newRequest: DocumentRequest = {
      id: `${Date.now()}`,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      documentType: data.documentType,
      customDescription: data.customDescription,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      comments: data.additionalNotes,
      additionalData: {
        submittedBy: 'Current User',
        priority: 'normal'
      }
    };

    setRequests([...requests, newRequest]);
    setIsCreateDialogOpen(false);
    form.reset();
    toast({
      title: "Success",
      description: "Document request submitted successfully"
    });
  };

  const handleProcess = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id 
        ? { 
            ...req, 
            status: 'processing',
            processedBy: 'Current HR User',
            processedDate: new Date().toISOString().split('T')[0]
          } 
        : req
    ));
    toast({
      title: "Success",
      description: "Request marked as processing"
    });
  };

  const handleComplete = (id: string) => {
    const request = requests.find(req => req.id === id);
    if (!request) return;

    // Simulate PDF generation
    const generatedUrl = `/documents/${request.documentType}-${request.employeeName.toLowerCase().replace(/\s+/g, '-')}.pdf`;

    setRequests(requests.map(req => 
      req.id === id 
        ? { 
            ...req, 
            status: 'completed',
            processedBy: 'Current HR User',
            processedDate: new Date().toISOString().split('T')[0],
            generatedDocumentUrl: generatedUrl,
            comments: 'Document generated and ready for download'
          } 
        : req
    ));
    toast({
      title: "Success",
      description: "Document generated successfully"
    });
  };

  const handleDecline = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id 
        ? { 
            ...req, 
            status: 'declined',
            processedBy: 'Current HR User',
            processedDate: new Date().toISOString().split('T')[0],
            comments: 'Request declined - insufficient information'
          } 
        : req
    ));
    toast({
      title: "Success",
      description: "Request declined"
    });
  };

  const handleDownload = (request: DocumentRequest) => {
    if (request.generatedDocumentUrl) {
      // In a real app, this would download the actual file
      toast({
        title: "Download",
        description: `Downloading ${request.documentType} for ${request.employeeName}`
      });
      console.log('Downloading:', request.generatedDocumentUrl);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'declined': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getDocumentLabel = (type: string) => {
    switch (type) {
      case 'work-certificate': return 'Work Certificate';
      case 'salary-certificate': return 'Salary Certificate';
      case 'mission-order': return 'Mission Order';
      case 'payslip': return 'Payslip';
      default: return 'Custom Document';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Requests</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Document</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="work-certificate">Work Certificate</SelectItem>
                          <SelectItem value="salary-certificate">Salary Certificate</SelectItem>
                          <SelectItem value="mission-order">Mission Order</SelectItem>
                          <SelectItem value="payslip">Monthly Payslip</SelectItem>
                          <SelectItem value="custom">Custom Request</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('documentType') === 'custom' && (
                  <FormField
                    control={form.control}
                    name="customDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the custom document needed" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional information" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Processed By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.employeeName}</p>
                      <p className="text-sm text-gray-500">ID: {request.employeeId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{getDocumentLabel(request.documentType)}</p>
                      {request.customDescription && (
                        <p className="text-sm text-gray-500">{request.customDescription}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{request.submittedDate}</TableCell>
                  <TableCell>{request.processedBy || '-'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleProcess(request.id)}
                          className="text-blue-600"
                        >
                          Process
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDecline(request.id)}
                          className="text-red-600"
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {request.status === 'processing' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleComplete(request.id)}
                        className="text-green-600"
                      >
                        Complete
                      </Button>
                    )}
                    {request.status === 'completed' && request.generatedDocumentUrl && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(request)}
                        className="text-blue-600"
                      >
                        <Download size={16} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDocumentRequestSystem;
