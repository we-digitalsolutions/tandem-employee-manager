
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentRequest } from '@/types';
import { FileText, Download, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
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

interface DocumentRequestSystemProps {
  employeeId: string;
  isHR?: boolean;
}

// Mock document requests data
const mockRequests: DocumentRequest[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Smith',
    documentType: 'work-certificate',
    status: 'completed',
    submittedDate: '2025-06-20',
    processedBy: 'HR Manager',
    processedDate: '2025-06-21',
    generatedDocumentUrl: '/documents/work-certificate-john.pdf'
  },
  {
    id: '2',
    employeeId: '101',
    employeeName: 'John Smith',
    documentType: 'payslip',
    status: 'pending',
    submittedDate: '2025-06-22'
  },
  {
    id: '3',
    employeeId: '102',
    employeeName: 'Sarah Johnson',
    documentType: 'salary-certificate',
    status: 'processing',
    submittedDate: '2025-06-21',
    processedBy: 'HR Manager'
  }
];

const DocumentRequestSystem: React.FC<DocumentRequestSystemProps> = ({
  employeeId,
  isHR = false
}) => {
  const [requests, setRequests] = useState<DocumentRequest[]>(mockRequests);
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    documentType: 'payslip' as DocumentRequest['documentType'],
    customDescription: ''
  });

  const getDocumentTypeLabel = (type: DocumentRequest['documentType']) => {
    const labels = {
      'payslip': 'Monthly Payslip',
      'work-certificate': 'Work Certificate (Attestation de travail)',
      'salary-certificate': 'Salary Certificate (Attestation de salaire)',
      'mission-order': 'Mission Order (Ordre de mission)',
      'custom': 'Custom Request'
    };
    return labels[type];
  };

  const getStatusColor = (status: DocumentRequest['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: DocumentRequest['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleSubmitRequest = () => {
    if (newRequest.documentType === 'custom' && !newRequest.customDescription.trim()) {
      toast.error('Please provide a description for custom requests');
      return;
    }

    const request: DocumentRequest = {
      id: `${Date.now()}`,
      employeeId,
      employeeName: 'Current User', // In real app, get from context
      documentType: newRequest.documentType,
      customDescription: newRequest.customDescription || undefined,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setRequests([request, ...requests]);
    setNewRequest({ documentType: 'payslip', customDescription: '' });
    setIsNewRequestDialogOpen(false);
    toast.success('Document request submitted successfully');
  };

  const handleProcessRequest = (requestId: string, action: 'approve' | 'decline') => {
    setRequests(requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: action === 'approve' ? 'processing' : 'declined',
          processedBy: 'HR Manager',
          processedDate: new Date().toISOString().split('T')[0]
        };
      }
      return req;
    }));
    
    toast.success(`Request ${action === 'approve' ? 'approved' : 'declined'} successfully`);
  };

  const handleCompleteRequest = (requestId: string) => {
    setRequests(requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'completed',
          generatedDocumentUrl: `/documents/generated-${req.documentType}-${requestId}.pdf`
        };
      }
      return req;
    }));
    
    toast.success('Document generated and sent to employee');
  };

  const filteredRequests = isHR ? requests : requests.filter(req => req.employeeId === employeeId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isHR ? 'Document Requests (All)' : 'My Document Requests'}
          </CardTitle>
          {!isHR && (
            <Dialog open={isNewRequestDialogOpen} onOpenChange={setIsNewRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select
                      value={newRequest.documentType}
                      onValueChange={(value: DocumentRequest['documentType']) =>
                        setNewRequest({...newRequest, documentType: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payslip">Monthly Payslip</SelectItem>
                        <SelectItem value="work-certificate">Work Certificate</SelectItem>
                        <SelectItem value="salary-certificate">Salary Certificate</SelectItem>
                        <SelectItem value="mission-order">Mission Order</SelectItem>
                        <SelectItem value="custom">Custom Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newRequest.documentType === 'custom' && (
                    <div>
                      <Label htmlFor="customDescription">Description</Label>
                      <Textarea
                        id="customDescription"
                        value={newRequest.customDescription}
                        onChange={(e) => setNewRequest({...newRequest, customDescription: e.target.value})}
                        placeholder="Please describe the document you need..."
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmitRequest}>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No document requests</p>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      {getDocumentTypeLabel(request.documentType)}
                    </h4>
                    <Badge className={getStatusColor(request.status)} variant="outline">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </div>
                    </Badge>
                  </div>
                  
                  {isHR && (
                    <p className="text-sm text-gray-600 mb-1">
                      Requested by: {request.employeeName}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                    {request.processedDate && (
                      <span>Processed: {new Date(request.processedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  {request.customDescription && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      "{request.customDescription}"
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {request.generatedDocumentUrl && (
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  
                  {isHR && request.status === 'pending' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleProcessRequest(request.id, 'approve')}
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleProcessRequest(request.id, 'decline')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}
                  
                  {isHR && request.status === 'processing' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompleteRequest(request.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Generate
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentRequestSystem;
