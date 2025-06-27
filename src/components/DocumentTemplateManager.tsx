
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/sonner';
import { DocumentTemplate } from '@/types';

const mockTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Work Certificate Template',
    type: 'work-certificate',
    description: 'Standard work certificate for employees',
    templateUrl: '/templates/work-certificate.pdf',
    variables: ['employeeName', 'employeeId', 'position', 'department', 'startDate', 'currentDate'],
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
    variables: ['employeeName', 'employeeId', 'position', 'salary', 'department', 'currentDate'],
    createdBy: 'HR Admin',
    createdDate: '2024-01-15',
    isActive: true
  },
  {
    id: '3',
    name: 'Mission Order Template',
    type: 'mission-order',
    description: 'Template for mission orders',
    templateUrl: '/templates/mission-order.pdf',
    variables: ['employeeName', 'employeeId', 'destination', 'purpose', 'startDate', 'endDate'],
    createdBy: 'HR Admin',
    createdDate: '2024-01-15',
    isActive: true
  }
];

interface TemplateFormData {
  name: string;
  type: 'payslip' | 'work-certificate' | 'salary-certificate' | 'mission-order' | 'custom';
  description: string;
  variables: string;
}

const DocumentTemplateManager = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(mockTemplates);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);

  const form = useForm<TemplateFormData>({
    defaultValues: {
      name: '',
      type: 'work-certificate',
      description: '',
      variables: '',
    },
  });

  const onSubmit = (data: TemplateFormData) => {
    const variables = data.variables.split(',').map(v => v.trim()).filter(v => v);
    
    if (editingTemplate) {
      const updatedTemplates = templates.map(t => 
        t.id === editingTemplate.id 
          ? {
              ...t,
              name: data.name,
              type: data.type,
              description: data.description,
              variables
            }
          : t
      );
      setTemplates(updatedTemplates);
      toast.success('Template updated successfully');
    } else {
      const newTemplate: DocumentTemplate = {
        id: `${Date.now()}`,
        name: data.name,
        type: data.type,
        description: data.description,
        templateUrl: `/templates/${data.name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        variables,
        createdBy: 'Current User',
        createdDate: new Date().toISOString().split('T')[0],
        isActive: true
      };
      setTemplates([...templates, newTemplate]);
      toast.success('Template created successfully');
    }

    setIsCreateDialogOpen(false);
    setEditingTemplate(null);
    form.reset();
  };

  const handleEdit = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    form.setValue('name', template.name);
    form.setValue('type', template.type);
    form.setValue('description', template.description);
    form.setValue('variables', template.variables.join(', '));
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success('Template deleted');
  };

  const toggleActive = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
    toast.success('Template status updated');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'work-certificate': return 'Work Certificate';
      case 'salary-certificate': return 'Salary Certificate';
      case 'mission-order': return 'Mission Order';
      case 'payslip': return 'Payslip';
      default: return 'Custom';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Templates</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setEditingTemplate(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter template name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="work-certificate">Work Certificate</SelectItem>
                          <SelectItem value="salary-certificate">Salary Certificate</SelectItem>
                          <SelectItem value="mission-order">Mission Order</SelectItem>
                          <SelectItem value="payslip">Payslip</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Template description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="variables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variables (comma-separated)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., employeeName, position, salary" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {getTypeLabel(template.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Variables:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.variables.map((variable, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>Created by {template.createdBy}</span>
                  <span>{template.createdDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentTemplateManager;
