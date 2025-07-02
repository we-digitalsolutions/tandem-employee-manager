import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  FileText, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { EmployeeDocument } from '@/types';
import { format } from 'date-fns';

interface EmployeeDocumentManagerProps {
  employeeId: string;
  employeeName: string;
  onClose: () => void;
}

const EmployeeDocumentManager = ({ employeeId, employeeName, onClose }: EmployeeDocumentManagerProps) => {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    category: '',
    expiryDate: ''
  });

  const documentCategories = [
    { value: 'cv', label: 'CV/Resume' },
    { value: 'contract', label: 'Employment Contract' },
    { value: 'diploma', label: 'Diploma/Degree' },
    { value: 'id-card', label: 'ID Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'certification', label: 'Certification' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchDocuments();
  }, [employeeId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId)
        .order('uploaded_date', { ascending: false });

      if (error) throw error;

      const formattedDocuments: EmployeeDocument[] = data.map(doc => ({
        id: doc.id,
        name: doc.name,
        category: doc.category as EmployeeDocument['category'],
        type: doc.type,
        size: doc.size,
        url: doc.url,
        uploadedBy: doc.uploaded_by,
        uploadedDate: doc.uploaded_date,
        expiryDate: doc.expiry_date || undefined
      }));

      setDocuments(formattedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadForm.file || !uploadForm.category) {
      toast.error('Please select a file and category');
      return;
    }

    try {
      setUploading(true);
      
      // Upload file to Supabase Storage
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${employeeId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('document-templates')
        .upload(fileName, uploadForm.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('document-templates')
        .getPublicUrl(fileName);

      // Save document record to database
      const { data, error } = await supabase
        .from('employee_documents')
        .insert({
          employee_id: employeeId,
          name: uploadForm.file.name,
          category: uploadForm.category as any,
          type: uploadForm.file.type,
          size: uploadForm.file.size,
          url: publicUrl,
          uploaded_by: employeeId, // In real app, this would be current user ID
          expiry_date: uploadForm.expiryDate || null
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Document uploaded successfully');
      setIsUploadDialogOpen(false);
      setUploadForm({ file: null, category: '', expiryDate: '' });
      await fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast.success('Document deleted successfully');
      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryLabel = (category: string) => {
    const cat = documentCategories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const isExpiringSoon = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry <= thirtyDaysFromNow && expiry >= today;
  };

  const isExpired = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Documents for {employeeName}</h3>
        <Button 
          onClick={() => setIsUploadDialogOpen(true)}
          className="bg-hr-teal hover:bg-hr-teal/90"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading documents...
                  </TableCell>
                </TableRow>
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No documents uploaded yet
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryLabel(doc.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(doc.size)}</TableCell>
                    <TableCell>
                      {format(new Date(doc.uploadedDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {doc.expiryDate ? (
                        <div className="flex items-center gap-1">
                          {isExpired(doc.expiryDate) ? (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Expired
                            </Badge>
                          ) : isExpiringSoon(doc.expiryDate) ? (
                            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Expiring Soon
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-600">
                              {format(new Date(doc.expiryDate), 'MMM dd, yyyy')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No expiry</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = doc.url;
                            link.download = doc.name;
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setUploadForm(prev => ({ 
                  ...prev, 
                  file: e.target.files?.[0] || null 
                }))}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </p>
            </div>

            <div>
              <Label htmlFor="category">Document Category</Label>
              <Select 
                value={uploadForm.category} 
                onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={uploadForm.expiryDate}
                onChange={(e) => setUploadForm(prev => ({ 
                  ...prev, 
                  expiryDate: e.target.value 
                }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleFileUpload} 
              disabled={uploading || !uploadForm.file || !uploadForm.category}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default EmployeeDocumentManager;