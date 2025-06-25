
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Settings, FolderOpen, Download } from 'lucide-react';
import DocumentManagement from './DocumentManagement';
import EnhancedDocumentRequestSystem from './EnhancedDocumentRequestSystem';
import DocumentTemplateManager from './DocumentTemplateManager';

interface DocumentManagementDashboardProps {
  employeeId: string;
  isHR?: boolean;
  isAdmin?: boolean;
}

const DocumentManagementDashboard: React.FC<DocumentManagementDashboardProps> = ({
  employeeId,
  isHR = false,
  isAdmin = false
}) => {
  const [activeTab, setActiveTab] = useState('documents');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Document Management</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Employee Documents
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Document Requests
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Template Management
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4">
          <DocumentManagement
            employeeId={employeeId}
            canUpload={true}
            canView={true}
            canDownload={true}
          />
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-4">
          <EnhancedDocumentRequestSystem
            employeeId={employeeId}
            isHR={isHR}
          />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="templates" className="space-y-4">
            <DocumentTemplateManager isAdmin={isAdmin} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DocumentManagementDashboard;
