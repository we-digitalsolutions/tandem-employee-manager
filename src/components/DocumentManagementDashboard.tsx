
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  FolderOpen,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DocumentManagementDashboardProps {
  employeeId?: string;
  isHR?: boolean;
  isAdmin?: boolean;
}

const DocumentManagementDashboard: React.FC<DocumentManagementDashboardProps> = ({ 
  employeeId, 
  isHR = false, 
  isAdmin = false 
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock document data
  const documents = [
    {
      id: 1,
      name: 'Employment Contract.pdf',
      category: 'Contract',
      uploadDate: '2024-01-15',
      uploadedBy: 'HR Admin',
      size: '2.3 MB',
      type: 'PDF'
    },
    {
      id: 2,
      name: 'CV_Updated.pdf',
      category: 'CV',
      uploadDate: '2024-02-20',
      uploadedBy: 'John Doe',
      size: '1.8 MB',
      type: 'PDF'
    },
    {
      id: 3,
      name: 'Diploma_Certificate.jpg',
      category: 'Certificate',
      uploadDate: '2024-01-10',
      uploadedBy: 'John Doe',
      size: '0.9 MB',
      type: 'Image'
    }
  ];

  const categories = ['Contract', 'CV', 'Certificate', 'ID Card', 'Passport', 'Other'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Document Management</h1>
          <p className="text-gray-600">Manage employee documents securely</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Personal Documents
          </TabsTrigger>
          {(isHR || isAdmin) && (
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              All Documents
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
                          <Badge variant="outline">{doc.category}</Badge>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      {(isAdmin || isHR) && (
                        <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {(isHR || isAdmin) && (
          <TabsContent value="all" className="space-y-4">
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">All employee documents would be displayed here</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DocumentManagementDashboard;
