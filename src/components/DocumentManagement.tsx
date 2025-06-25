
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmployeeDocument } from '@/types';
import { FileText, Download, Eye, Upload, AlertTriangle, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FileUpload from './FileUpload';
import { toast } from '@/components/ui/sonner';

interface DocumentManagementProps {
  employeeId: string;
  documents?: EmployeeDocument[];
  canUpload?: boolean;
  canView?: boolean;
  canDownload?: boolean;
}

// Mock documents data
const mockDocuments: EmployeeDocument[] = [
  {
    id: '1',
    name: 'Employment Contract',
    category: 'contract',
    type: 'application/pdf',
    size: 245760,
    url: '/documents/contract.pdf',
    uploadedBy: 'HR Admin',
    uploadedDate: '2024-01-15',
    expiryDate: '2026-01-15'
  },
  {
    id: '2',
    name: 'Resume_JohnDoe.pdf',
    category: 'cv',
    type: 'application/pdf',
    size: 156432,
    url: '/documents/resume.pdf',
    uploadedBy: 'John Doe',
    uploadedDate: '2024-01-10'
  },
  {
    id: '3',
    name: 'Diploma_Computer_Science.pdf',
    category: 'diploma',
    type: 'application/pdf',
    size: 567890,
    url: '/documents/diploma.pdf',
    uploadedBy: 'John Doe',
    uploadedDate: '2024-01-10'
  },
  {
    id: '4',
    name: 'ID_Card_Front.jpg',
    category: 'id-card',
    type: 'image/jpeg',
    size: 123456,
    url: '/documents/id-front.jpg',
    uploadedBy: 'John Doe',
    uploadedDate: '2024-01-10',
    expiryDate: '2029-05-20'
  }
];

const DocumentManagement: React.FC<DocumentManagementProps> = ({
  employeeId,
  documents = mockDocuments,
  canUpload = true,
  canView = true,
  canDownload = true
}) => {
  const [documentList, setDocumentList] = useState<EmployeeDocument[]>(documents);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EmployeeDocument['category']>('other');

  const getCategoryLabel = (category: EmployeeDocument['category']) => {
    const labels = {
      'cv': 'CV/Resume',
      'contract': 'Contract',
      'diploma': 'Diploma',
      'id-card': 'ID Card',
      'passport': 'Passport',
      'certification': 'Certification',
      'other': 'Other'
    };
    return labels[category];
  };

  const getCategoryColor = (category: EmployeeDocument['category']) => {
    const colors = {
      'cv': 'bg-blue-100 text-blue-800',
      'contract': 'bg-green-100 text-green-800',
      'diploma': 'bg-purple-100 text-purple-800',
      'id-card': 'bg-yellow-100 text-yellow-800',
      'passport': 'bg-indigo-100 text-indigo-800',
      'certification': 'bg-pink-100 text-pink-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffMonths = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return diffMonths <= 3 && diffMonths > 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const handleFileUpload = (files: any[]) => {
    // In a real app, files would be uploaded to server first
    const newDocuments: EmployeeDocument[] = files.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      category: selectedCategory,
      type: file.type,
      size: file.size,
      url: file.url,
      uploadedBy: 'Current User',
      uploadedDate: new Date().toISOString().split('T')[0]
    }));

    setDocumentList([...documentList, ...newDocuments]);
    setIsUploadDialogOpen(false);
    toast.success(`${files.length} document(s) uploaded successfully`);
  };

  const groupedDocuments = documentList.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, EmployeeDocument[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
          {canUpload && (
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Document Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as EmployeeDocument['category'])}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="cv">CV/Resume</option>
                      <option value="contract">Contract</option>
                      <option value="diploma">Diploma</option>
                      <option value="id-card">ID Card</option>
                      <option value="passport">Passport</option>
                      <option value="certification">Certification</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <FileUpload
                    onFilesUploaded={handleFileUpload}
                    maxFiles={5}
                    acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx']}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.keys(groupedDocuments).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No documents uploaded</p>
          ) : (
            Object.entries(groupedDocuments).map(([category, docs]) => (
              <div key={category}>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge className={getCategoryColor(category as EmployeeDocument['category'])} variant="outline">
                    {getCategoryLabel(category as EmployeeDocument['category'])}
                  </Badge>
                  <span className="text-sm text-gray-500">({docs.length})</span>
                </h4>
                <div className="space-y-2 ml-4">
                  {docs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatFileSize(doc.size)}</span>
                            <span>Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}</span>
                            <span>By: {doc.uploadedBy}</span>
                          </div>
                          {doc.expiryDate && (
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              <span className={`text-xs ${
                                isExpired(doc.expiryDate) ? 'text-red-600' :
                                isExpiringSoon(doc.expiryDate) ? 'text-yellow-600' :
                                'text-gray-500'
                              }`}>
                                Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                              </span>
                              {(isExpired(doc.expiryDate) || isExpiringSoon(doc.expiryDate)) && (
                                <AlertTriangle className={`h-3 w-3 ${
                                  isExpired(doc.expiryDate) ? 'text-red-600' : 'text-yellow-600'
                                }`} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {canView && (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {canDownload && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
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

export default DocumentManagement;
