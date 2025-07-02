import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Plus, Edit, Trash2, Eye, Upload, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDropzone } from 'react-dropzone';

interface DocumentTemplate {
  id: string;
  name: string;
  type: 'payslip' | 'work-certificate' | 'salary-certificate' | 'mission-order' | 'custom';
  description: string;
  template_url: string;
  variables: string[];
  created_by: string;
  created_date: string;
  is_active: boolean;
}

interface TemplateFormData {
  name: string;
  type: 'payslip' | 'work-certificate' | 'salary-certificate' | 'mission-order' | 'custom';
  description: string;
  file?: File;
}

const DocumentTemplateManager = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [detectedVariables, setDetectedVariables] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<TemplateFormData>({
    defaultValues: {
      name: '',
      type: 'work-certificate',
      description: '',
    },
  });

  // Load templates from Supabase
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive"
      });
    }
  };

  // Variable detection function
  const detectVariables = (text: string): string[] => {
    // Look for variables in various formats: {{variable}}, {variable}, [variable], $variable, %variable%
    const patterns = [
      /\{\{([^}]+)\}\}/g,  // {{variable}}
      /\{([^}]+)\}/g,      // {variable}
      /\[([^\]]+)\]/g,     // [variable]
      /\$([a-zA-Z_][a-zA-Z0-9_]*)/g,  // $variable
      /%([^%]+)%/g,        // %variable%
    ];

    const variables = new Set<string>();
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const variable = match[1].trim();
        // Filter out common non-variable patterns
        if (variable && 
            !variable.includes(' ') && 
            variable.length > 1 && 
            variable.length < 50 &&
            !/^\d+$/.test(variable)) {
          variables.add(variable);
        }
      }
    });

    return Array.from(variables);
  };

  // File processing for variable detection
  const processFile = async (file: File): Promise<string[]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const variables = detectVariables(text);
          resolve(variables);
        } catch (error) {
          console.error('Error processing file:', error);
          resolve([]);
        }
      };

      // For different file types, we might need different processing
      if (file.type === 'application/pdf') {
        // For PDF files, we'll read as text (simplified - in production you'd use a PDF parser)
        reader.readAsText(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/html': ['.html']
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        setIsUploading(true);
        
        try {
          const variables = await processFile(file);
          setDetectedVariables(variables);
          toast({
            title: "File processed",
            description: `Detected ${variables.length} variables in the document`
          });
        } catch (error) {
          console.error('Error processing file:', error);
          toast({
            title: "Error",
            description: "Failed to process file",
            variant: "destructive"
          });
        } finally {
          setIsUploading(false);
        }
      }
    }
  });

  const uploadFile = async (file: File, templateId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${templateId}.${fileExt}`;
    const filePath = `templates/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('document-templates')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('document-templates')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const onSubmit = async (data: TemplateFormData) => {
    if (!selectedFile && !editingTemplate) {
      toast({
        title: "Error",
        description: "Please upload a template file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let templateUrl = editingTemplate?.template_url || '';
      let variables = detectedVariables;

      // Upload file if new file is selected
      if (selectedFile) {
        const templateId = editingTemplate?.id || `template_${Date.now()}`;
        setUploadProgress(30);
        templateUrl = await uploadFile(selectedFile, templateId);
        setUploadProgress(70);
      }

      const templateData = {
        name: data.name,
        type: data.type,
        description: data.description,
        template_url: templateUrl,
        variables,
        created_by: 'current_user', // In production, get from auth context
        is_active: true
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('document_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Template updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('document_templates')
          .insert([templateData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Template created successfully"
        });
      }

      setUploadProgress(100);
      setIsCreateDialogOpen(false);
      setEditingTemplate(null);
      setSelectedFile(null);
      setDetectedVariables([]);
      form.reset();
      loadTemplates();

    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    form.setValue('name', template.name);
    form.setValue('type', template.type);
    form.setValue('description', template.description);
    setDetectedVariables(template.variables || []);
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Template deleted successfully"
      });
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('document_templates')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Template status updated"
      });
      loadTemplates();
    } catch (error) {
      console.error('Error updating template status:', error);
      toast({
        title: "Error",
        description: "Failed to update template status",
        variant: "destructive"
      });
    }
  };

  const downloadTemplate = async (template: DocumentTemplate) => {
    try {
      const { data, error } = await supabase.storage
        .from('document-templates')
        .download(template.template_url.split('/').pop() || '');

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name}.${template.template_url.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      toast({
        title: "Error",
        description: "Failed to download template",
        variant: "destructive"
      });
    }
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
        <div>
          <h2 className="text-2xl font-bold">Document Templates</h2>
          <p className="text-gray-600">Manage document templates with automatic variable detection</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setEditingTemplate(null);
            setSelectedFile(null);
            setDetectedVariables([]);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
                  rules={{ required: "Template name is required" }}
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

                {/* File Upload Section */}
                <div className="space-y-3">
                  <FormLabel>Template File</FormLabel>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {isDragActive
                        ? 'Drop the file here...'
                        : 'Drag & drop a template file here, or click to select'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports PDF, DOC, DOCX, TXT, HTML files
                    </p>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Processing file...</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>

                {/* Detected Variables */}
                {detectedVariables.length > 0 && (
                  <div className="space-y-2">
                    <FormLabel>Detected Variables ({detectedVariables.length})</FormLabel>
                    <div className="flex flex-wrap gap-1 p-3 bg-blue-50 rounded-lg max-h-32 overflow-y-auto">
                      {detectedVariables.map((variable, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      These variables were automatically detected in your template file
                    </p>
                  </div>
                )}

                <DialogFooter>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Processing...' : editingTemplate ? 'Update Template' : 'Create Template'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {getTypeLabel(template.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => downloadTemplate(template)}
                    title="Download template"
                  >
                    <Download size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleActive(template.id, template.is_active)}
                    title={template.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(template)}
                    title="Edit template"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete template"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Variables ({template.variables?.length || 0}):
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(template.variables || []).map((variable, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>Created by {template.created_by}</span>
                  <span>{new Date(template.created_date).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {templates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No templates yet</h3>
              <p className="mt-2 text-gray-600">Create your first document template to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DocumentTemplateManager;