import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  Image, 
  File,
  CheckCircle,
  AlertCircle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedDate: string;
  category: 'template' | 'document' | 'image' | 'other';
  status: 'uploading' | 'completed' | 'error';
  progress?: number;
}

const FileUploadIntegration = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);

  // Load existing files from Supabase Storage
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      // Load files from different buckets
      const buckets = ['document-templates'];
      const allFiles: UploadedFile[] = [];

      for (const bucket of buckets) {
        const { data: bucketFiles, error } = await supabase.storage
          .from(bucket)
          .list('', {
            limit: 100,
            offset: 0
          });

        if (error) {
          console.error(`Error loading files from ${bucket}:`, error);
          continue;
        }

        if (bucketFiles) {
          const filesWithUrls = bucketFiles.map(file => {
            const { data } = supabase.storage
              .from(bucket)
              .getPublicUrl(file.name);

            return {
              id: file.id || `${bucket}-${file.name}`,
              name: file.name,
              size: file.metadata?.size || 0,
              type: file.metadata?.mimetype || 'application/octet-stream',
              url: data.publicUrl,
              uploadedDate: file.created_at || new Date().toISOString(),
              category: getCategoryFromBucket(bucket),
              status: 'completed' as const
            };
          });

          allFiles.push(...filesWithUrls);
        }
      }

      setFiles(allFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive"
      });
    }
  };

  const getCategoryFromBucket = (bucket: string): UploadedFile['category'] => {
    switch (bucket) {
      case 'document-templates': return 'template';
      case 'employee-documents': return 'document';
      case 'avatars': return 'image';
      default: return 'other';
    }
  };

  const getCategoryFromMimeType = (mimeType: string): UploadedFile['category'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.includes('pdf') || mimeType.includes('doc') || mimeType.includes('text')) return 'document';
    return 'other';
  };

  const uploadFile = async (file: File, category: UploadedFile['category'] = 'other'): Promise<string> => {
    const fileId = `${Date.now()}-${file.name}`;
    const bucket = category === 'template' ? 'document-templates' : 'employee-documents';
    
    // Add file to state with uploading status
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: '',
      uploadedDate: new Date().toISOString(),
      category,
      status: 'uploading',
      progress: 0
    };

    setFiles(prev => [...prev, newFile]);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Update file status to completed
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, url: data.publicUrl, status: 'completed', progress: 100 }
          : f
      ));

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      
      // Update file status to error
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error' }
          : f
      ));

      throw error;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setIsUploading(true);
      
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const category = getCategoryFromMimeType(file.type);
          await uploadFile(file, category);
        });

        await Promise.all(uploadPromises);
        
        toast({
          title: "Success",
          description: `Successfully uploaded ${acceptedFiles.length} file(s)`
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Error",
          description: "Some files failed to upload",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB limit
  });

  const deleteFile = async (file: UploadedFile) => {
    try {
      const bucket = file.category === 'template' ? 'document-templates' : 'employee-documents';
      const fileName = file.url.split('/').pop();
      
      if (fileName) {
        const { error } = await supabase.storage
          .from(bucket)
          .remove([fileName]);

        if (error) throw error;
      }

      setFiles(prev => prev.filter(f => f.id !== file.id));
      
      toast({
        title: "Success",
        description: "File deleted successfully"
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const downloadFile = async (file: UploadedFile) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download",
        description: `Downloaded ${file.name}`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf') || type.includes('doc')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getCategoryColor = (category: UploadedFile['category']) => {
    switch (category) {
      case 'template': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-green-100 text-green-800';
      case 'image': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Upload className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">File Management</h2>
          <p className="text-gray-600">Upload and manage files for the HR system</p>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            File Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium">
              {isDragActive
                ? 'Drop the files here...'
                : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Maximum file size: 10MB. Supports all common file types.
            </p>
          </div>
          
          {isUploading && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Uploading files...</p>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded Files ({files.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No files uploaded</h3>
              <p className="mt-2 text-gray-600">Upload some files to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.type}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(file.category)} variant="secondary">
                        {file.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(file.status)}
                        <span className="capitalize">{file.status}</span>
                        {file.status === 'uploading' && file.progress && (
                          <Progress value={file.progress} className="w-16 h-2" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(file.uploadedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {file.status === 'completed' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(file.url, '_blank')}
                            title="View file"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(file)}
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFile(file)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold">{files.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Upload className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-2xl font-bold">
                  {files.filter(f => f.category === 'template').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Image className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Images</p>
                <p className="text-2xl font-bold">
                  {files.filter(f => f.category === 'image').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold">
                  {files.filter(f => f.category === 'document').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileUploadIntegration;