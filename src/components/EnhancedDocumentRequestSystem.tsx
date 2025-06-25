
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentRequest, DocumentTemplate } from '@/types';
import { FileText, Download, Clock, CheckCircle, XCircle, Plus, Settings } from 'lucide-react';
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
import { generatePDF } from '@/utils/pdfGenerator';

interface EnhancedDocumentRequestSystemProps {
  employeeId: string;
  isHR?: boolean;
  templates?: DocumentTemplate[];
}

// Mock templates for demonstration
const mockTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Work Certificate Template',
    type: 'work-certificate',
    description: 'Standard work certificate',
    templateUrl: '/templates/work-certificate.pdf',
    variables: ['{{EMPLOYEE_NAME}}', '{{CIN}}', '{{POSITION}}', '{{START_DATE}}'],
    createdBy: 'HR Admin',
    createdDate: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    name: 'Salary Certificate Template',
    type: 'salary-certificate',
    description: 'Salary certificate template',
    templateUrl: '/templates/salary-certificate.pdf',
    variables: ['{{EMPLOYEE_NAME}}', '{{CIN}}', '{{MONTHLY_SALARY}}', '{{ANNUAL_SALARY}}'],
    createdBy: 'HR Admin',
    createdDate: '2024-01-10',
    isActive: true
  }
];

// Mock requests data
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
  }
];

const EnhancedDocumentRequestSystem: React.FC<EnhancedDocumentRequestSystemProps> = ({
  employeeId,
  isHR = false,
  templates = mockTemplates
}) => {
  const [requests, setRequests] = useState<DocumentRequest[]>(mockRequests);
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [isProcessingDialogOpen, setIsProcessingDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    documentType: 'payslip' as DocumentRequest['documentType'],
    customDescription: '',
    additionalData: {} as Record<string, string>
  });
  const [processingData, setProcessingData] = useState({
    monthlySalary: '',
    annualSalary: '',
    missionLocation: '',
    purpose: '',
    endDate: ''
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

  const getActiveTemplate = (documentType: DocumentRequest['documentType']) => {
    return templates.find(t => t.type === documentType && t.isActive);
  };

  const handleSubmitRequest = () => {
    if (newRequest.documentType === 'custom' && !newRequest.customDescription.trim()) {
      toast.error('Please provide a description for custom requests');
      return;
    }

    const request: DocumentRequest = {
      id: `${Date.now()}`,
      employeeId,
      employeeName: 'Current User',
      documentType: newRequest.documentType,
      customDescription: newRequest.customDescription || undefined,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      additionalData: newRequest.additionalData
    };

    setRequests([request, ...requests]);
    setNewRequest({ 
      documentType: 'payslip', 
      customDescription: '', 
      additionalData: {} 
    });
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

  const handleGenerateDocument = async (request: DocumentRequest) => {
    const template = getActiveTemplate(request.documentType);
    if (!template) {
      toast.error('No active template found for this document type');
      return;
    }

    toast.info('Generating document...');
    
    try {
      // Mock employee data - in real app, fetch from API
      const mockEmployee = {
        id: request.employeeId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '(555) 123-4567',
        position: 'Software Engineer',
        department: 'Engineering',
        hireDate: '2022-03-15',
        status: 'active' as const
      };

      const generatedUrl = await generatePDF({
        template,
        employee: mockEmployee,
        additionalData: {
          ...processingData,
          ...request.additionalData
        }
      });

      setRequests(requests.map(req => {
        if (req.id === request.id) {
          return {
            ...req,
            status: 'completed',
            generatedDocumentUrl: generatedUrl
          };
        }
        return req;
      }));

      setIsProcessingDialogOpen(false);
      setSelectedRequest(null);
      setProcessingData({
        monthlySalary: '',
        annualSalary: '',
        missionLocation: '',
        purpose: '',
        endDate: ''
      });
      
      toast.success('Document generated successfully!');
    } catch (error) {
      toast.error('Failed to generate document');
      console.error('PDF Generation Error:', error);
    }
  };

  const openProcessingDialog = (request: DocumentRequest) => {
    setSelectedRequest(request);
    setIsProcessingDialogOpen(true);
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
                        {templates.filter(t => t.isActive).map(template => (
                          <SelectItem key={template.id} value={template.type}>
                            {getDocumentTypeLabel(template.type)}
                          </SelectItem>
                        ))}
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
                      onClick={() => openProcessingDialog(request)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Generate
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Document Generation Dialog */}
      <Dialog open={isProcessingDialogOpen} onOpenChange={setIsProcessingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Document</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                Generating {getDocumentTypeLabel(selectedRequest.documentType)} for {selectedRequest.employeeName}
              </p>
              
              {selectedRequest.documentType === 'salary-certificate' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlySalary">Monthly Salary</Label>
                    <Input
                      id="monthlySalary"
                      value={processingData.monthlySalary}
                      onChange={(e) => setProcessingData({...processingData, monthlySalary: e.target.value})}
                      placeholder="Enter monthly salary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="annualSalary">Annual Salary</Label>
                    <Input
                      id="annualSalary"
                      value={processingData.annualSalary}
                      onChange={(e) => setProcessingData({...processingData, annualSalary: e.target.value})}
                      placeholder="Enter annual salary"
                    />
                  </div>
                </div>
              )}
              
              {selectedRequest.documentType === 'mission-order' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="missionLocation">Mission Location</Label>
                    <Input
                      id="missionLocation"
                      value={processingData.missionLocation}
                      onChange={(e) => setProcessingData({...processingData, missionLocation: e.target.value})}
                      placeholder="Enter mission location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      value={processingData.purpose}
                      onChange={(e) => setProcessingData({...processingData, purpose: e.target.value})}
                      placeholder="Enter mission purpose"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={processingData.endDate}
                      onChange={(e) => setProcessingData({...processingData, endDate: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => selectedRequest && handleGenerateDocument(selectedRequest)}>
              Generate Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EnhancedDocumentRequestSystem;
