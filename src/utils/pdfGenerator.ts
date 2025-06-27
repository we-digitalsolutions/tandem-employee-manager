
import { DocumentTemplate, Employee } from '@/types';

interface PDFGenerationData {
  employee: Employee;
  template: DocumentTemplate;
  additionalData?: Record<string, any>;
}

// Mock PDF generation service
export const generatePDF = async (data: PDFGenerationData): Promise<string> => {
  const { employee, template, additionalData = {} } = data;
  
  // Simulate PDF generation process
  console.log('Generating PDF with data:', {
    templateName: template.name,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    variables: template.variables
  });

  // Create variable replacements
  const variables: Record<string, string> = {
    employeeName: `${employee.firstName} ${employee.lastName}`,
    employeeId: employee.id,
    position: employee.position,
    department: employee.department,
    startDate: employee.hireDate,
    currentDate: new Date().toLocaleDateString(),
    salary: additionalData.salary || 'N/A',
    destination: additionalData.destination || '',
    purpose: additionalData.purpose || '',
    endDate: additionalData.endDate || '',
    ...additionalData
  };

  // Simulate template processing
  let documentContent = getTemplateContent(template.type);
  
  // Replace variables in template
  template.variables.forEach(variable => {
    const value = variables[variable] || `[${variable}]`;
    documentContent = documentContent.replace(new RegExp(`{{${variable}}}`, 'g'), value);
  });

  // Simulate PDF generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return mock PDF URL
  const filename = `${template.type}-${employee.id}-${Date.now()}.pdf`;
  const mockPDFUrl = `/generated-documents/${filename}`;

  // In a real application, you would:
  // 1. Use a PDF library like jsPDF, PDFKit, or Puppeteer
  // 2. Load the actual template file
  // 3. Replace placeholders with real data
  // 4. Generate and save the PDF
  // 5. Return the actual URL or file path

  console.log('PDF generated successfully:', mockPDFUrl);
  return mockPDFUrl;
};

const getTemplateContent = (templateType: string): string => {
  const templates: Record<string, string> = {
    'work-certificate': `
      WORK CERTIFICATE
      
      This is to certify that {{employeeName}} (Employee ID: {{employeeId}}) 
      has been working with our organization as {{position}} in the {{department}} 
      department since {{startDate}}.
      
      During their tenure, they have shown dedication and professionalism in their work.
      
      This certificate is issued on {{currentDate}} for official purposes.
      
      HR Department
    `,
    'salary-certificate': `
      SALARY CERTIFICATE
      
      This is to certify that {{employeeName}} (Employee ID: {{employeeId}}) 
      is currently employed with our organization as {{position}} in the {{department}} 
      department since {{startDate}}.
      
      Their current monthly salary is {{salary}}.
      
      This certificate is issued on {{currentDate}} for official purposes.
      
      HR Department
    `,
    'mission-order': `
      MISSION ORDER
      
      Employee: {{employeeName}} (ID: {{employeeId}})
      Position: {{position}}
      Department: {{department}}
      
      You are hereby authorized to travel to {{destination}} 
      for the purpose of {{purpose}}.
      
      Mission Period: {{startDate}} to {{endDate}}
      
      Issued on: {{currentDate}}
      
      HR Department
    `,
    'payslip': `
      PAYSLIP - {{currentDate}}
      
      Employee: {{employeeName}}
      Employee ID: {{employeeId}}
      Position: {{position}}
      Department: {{department}}
      
      Basic Salary: {{salary}}
      
      Net Pay: {{salary}}
      
      HR Department
    `
  };

  return templates[templateType] || 'Template content not found';
};

export const validateTemplate = (template: DocumentTemplate): boolean => {
  // Validate template structure
  if (!template.name || !template.type || !template.variables) {
    return false;
  }

  // Check if required variables are present
  const requiredVariables = ['employeeName', 'employeeId', 'currentDate'];
  const hasRequiredVars = requiredVariables.every(variable => 
    template.variables.includes(variable)
  );

  return hasRequiredVars;
};

export const getAvailableVariables = (): string[] => {
  return [
    'employeeName',
    'employeeId', 
    'firstName',
    'lastName',
    'position',
    'department',
    'startDate',
    'currentDate',
    'salary',
    'destination',
    'purpose',
    'endDate',
    'phone',
    'email'
  ];
};
