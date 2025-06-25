
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentTemplate } from '@/types';
import { FileText, Download, Edit, Trash2, Plus, Upload } from 'lucide-react';
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
import FileUpload from './FileUpload';
import { toast } from '@/components/ui/sonner';

interface DocumentTemplateManagerProps {
  isAdmin?: boolean;
}

// Mock templates data
const mockTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Work Certificate Template',
    type: 'work-certificate',
    description: 'Standard work certificate template for employees',
    templateUrl: '/templates/work-certificate.pdf',
    variables: ['{{EMPLOYEE_NAME}}', '{{CIN}}', '{{POSITION}}', '{{START_DATE}}', '{{SALARY}}'],
    createdBy: 'HR Admin',
    createdDate: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    name: 'Salary Certificate Template',
    type: 'salary-certificate',
    description: 'Template for salary certificates',
    templateUrl: '/templates/salary-certificate.pdf',
    variables: ['{{EMPLOYEE_NAME}}', '{{CIN}}', '{{POSITION}}', '{{MONTHLY_SALARY}}', '{{ANNUAL_SALARY}}'],
    createdBy: 'HR Admin',
    createdDate: '2024-01-10',
    isActive: true
  },
  {
    id: '3',
    name: 'Mission Order Template',
    type: 'mission-order',
    description: 'Template for mission orders',
    templateUrl: '/templates/mission-order.pdf',
    variables: ['{{EMPLOYEE_NAME}}', '{{MISSION_LOCATION}}', '{{START_DATE}}', '{{END_DATE}}', '{{PURPOSE}}'],
    createdBy: 'HR Admin',
    createdDate: '2024-01-05',
    isActive: false
  }
];

const DocumentTemplateManager: React.FC<DocumentTemplateManagerProps> = ({
  isAdmin = false
}) => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(mockTemplates);
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'work-certificate' as DocumentTemplate['type'],
    description: '',
    variables: [] as string[],
    templateFile: null as any
  });

  const getTypeLabel = (type: DocumentTemplate['type']) => {
    const labels = {
      'work-certificate': 'Work Certificate',
      'salary-certificate': 'Salary Certificate',
      'mission-order': 'Mission Order',
      'payslip': 'Payslip',
      'custom': 'Custom'
    };
    return labels[type];
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const template: DocumentTemplate = {
      id: `${Date.now()}`,
      name: newTemplate.name,
      type: newTemplate.type,
      description: newTemplate.description,
      templateUrl: newTemplate.templateFile?.url || '',
      variables: newTemplate.variables,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true
    };

    setTemplates([template, ...templates]);
    setNewTemplate({
      name: '',
      type: 'work-certificate',
      description: '',
      variables: [],
      templateFile: null
    });
    setIsNewTemplateDialogOpen(false);
    toast.success('Template created successfully');
  };

  const handleToggleActive = (templateId: string) => {
    setTemplates(templates.map(template =>
      template.id === templateId
        ? { ...template, isActive: !template.isActive }
        : template
    ));
    toast.success('Template status updated');
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(template => template.id !== templateId));
    toast.success('Template deleted successfully');
  };

  const handleFileUpload = (files: any[]) => {
    if (files.length > 0) {
      setNewTemplate({ ...newTemplate, templateFile: files[0] });
    }
  };

  const addVariable = () => {
    const variable = prompt('Enter variable name (e.g., {{EMPLOYEE_NAME}}):');
    if (variable && !newTemplate.variables.includes(variable)) {
      setNewTemplate({
        ...newTemplate,
        variables: [...newTemplate.variables, variable]
      });
    }
  };

  const removeVariable = (variable: string) => {
    setNewTemplate({
      ...newTemplate,
      variables: newTemplate.variables.filter(v => v !== variable)
    });
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Templates
          </CardTitle>
          <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Document Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Document Type</Label>
                    <Select
                      value={newTemplate.type}
                      onValueChange={(value: DocumentTemplate['type']) =>
                        setNewTemplate({...newTemplate, type: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work-certificate">Work Certificate</SelectItem>
                        <SelectItem value="salary-certificate">Salary Certificate</SelectItem>
                        <SelectItem value="mission-order">Mission Order</SelectItem>
                        <SelectItem value="payslip">Payslip</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    placeholder="Enter template description"
                  />
                </div>
                <div>
                  <Label>Template Variables</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newTemplate.variables.map((variable, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {variable}
                        <button
                          onClick={() => removeVariable(variable)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariable}
                  >
                    Add Variable
                  </Button>
                </div>
                <div>
                  <Label>Upload Template File</Label>
                  <FileUpload
                    onFilesUploaded={handleFileUpload}
                    maxFiles={1}
                    acceptedTypes={['application/pdf', '.doc', '.docx']}
                    existingFiles={newTemplate.templateFile ? [newTemplate.templateFile] : []}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No templates created</p>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{template.name}</h4>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{getTypeLabel(template.type)}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {new Date(template.createdDate).toLocaleDateString()}</span>
                    <span>By: {template.createdBy}</span>
                    <span>Variables: {template.variables.length}</span>
                  </div>
                  {template.variables.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.variables.map((variable, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(template.id)}
                    className={template.isActive ? "text-yellow-600" : "text-green-600"}
                  >
                    {template.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentTemplateManager;
