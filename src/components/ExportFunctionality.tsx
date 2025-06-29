
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportData {
  headers: string[];
  rows: any[][];
  title: string;
}

interface ExportFunctionalityProps {
  data: ExportData;
  filename?: string;
}

const ExportFunctionality = ({ data, filename = 'hr-report' }: ExportFunctionalityProps) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToCSV = (data: ExportData, filename: string) => {
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToExcel = async (data: ExportData, filename: string) => {
    // In a real app, you'd use a library like SheetJS (xlsx)
    // For now, we'll create a simple Excel-compatible CSV
    const excelContent = [
      data.headers.join('\t'),
      ...data.rows.map(row => row.join('\t'))
    ].join('\n');

    const blob = new Blob([excelContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async (data: ExportData, filename: string) => {
    // Create a simple HTML table for PDF conversion
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .export-date { color: #666; font-size: 12px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${data.title}</h1>
        <div class="export-date">Generated on: ${new Date().toLocaleString()}</div>
        <table>
          <thead>
            <tr>
              ${data.headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.rows.map(row => 
              `<tr>${row.map(cell => `<td>${cell || ''}</td>`).join('')}</tr>`
            ).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create PDF using browser's print functionality
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
  };

  const handleExport = async () => {
    if (!data.rows.length) {
      toast({
        title: "No data to export",
        description: "There's no data available for export",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const exportFilename = `${filename}-${new Date().toISOString().split('T')[0]}`;
      
      switch (exportFormat) {
        case 'csv':
          exportToCSV(data, exportFilename);
          break;
        case 'excel':
          await exportToExcel(data, exportFilename);
          break;
        case 'pdf':
          await exportToPDF(data, exportFilename);
          break;
      }

      toast({
        title: "Export successful",
        description: `Data exported as ${exportFormat.toUpperCase()} file`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return <Table className="h-4 w-4" />;
      case 'excel': return <FileSpreadsheet className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <Select value={exportFormat} onValueChange={(value: 'csv' | 'excel' | 'pdf') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    CSV (Comma Separated)
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel (Spreadsheet)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF (Printable)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              {data.rows.length} records
            </Badge>
            <p className="text-xs text-gray-500">Available for export</p>
          </div>
        </div>

        <Button
          onClick={handleExport}
          disabled={isExporting || !data.rows.length}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Download className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              {getFormatIcon(exportFormat)}
              <span className="ml-2">Export as {exportFormat.toUpperCase()}</span>
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>CSV:</strong> Comma-separated values, opens in spreadsheet apps</p>
          <p><strong>Excel:</strong> Spreadsheet format with formatting</p>
          <p><strong>PDF:</strong> Printable document format</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportFunctionality;
