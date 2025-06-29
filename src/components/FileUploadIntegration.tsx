
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadIntegrationProps {
  onFilesUploaded: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  requestType?: 'leave' | 'remote' | 'document';
}

const FileUploadIntegration = ({ 
  onFilesUploaded, 
  acceptedTypes = ['.pdf', '.png', '.jpg', '.jpeg'],
  maxFiles = 3,
  requestType = 'leave'
}: FileUploadIntegrationProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const totalFiles = uploadedFiles.length + files.length;
    
    if (totalFiles > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }

    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = acceptedTypes.includes(extension);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive"
        });
        return false;
      }

      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    const newFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);

    if (validFiles.length > 0) {
      toast({
        title: "Files uploaded",
        description: `${validFiles.length} file(s) uploaded successfully`,
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Justification Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here or click to browse
          </p>
          <Input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Choose Files
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Supported: {acceptedTypes.join(', ')} • Max {maxFiles} files • 10MB each
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Uploaded Files:</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {requestType === 'leave' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Upload medical certificates, travel documents, or other supporting documents for your leave request.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadIntegration;
