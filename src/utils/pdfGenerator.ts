
import { Employee, DocumentTemplate, DocumentRequest } from '@/types';

export interface PDFGenerationData {
  template: DocumentTemplate;
  employee: Employee;
  additionalData?: Record<string, any>;
}

export const generatePDF = async (data: PDFGenerationData): Promise<string> => {
  const { template, employee, additionalData = {} } = data;
  
  // In a real application, this would use a PDF generation library like jsPDF or PDFKit
  // For now, we'll simulate PDF generation
  
  console.log('Generating PDF with data:', {
    templateId: template.id,
    templateName: template.name,
    employeeId: employee.id,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    variables: template.variables,
    additionalData
  });

  // Create variable mappings
  const variableMappings: Record<string, string> = {
    '{{EMPLOYEE_NAME}}': `${employee.firstName} ${employee.lastName}`,
    '{{CIN}}': employee.id, // Assuming ID is used as CIN for demo
    '{{POSITION}}': employee.position,
    '{{DEPARTMENT}}': employee.department,
    '{{START_DATE}}': employee.hireDate,
    '{{HIRE_DATE}}': employee.hireDate,
    '{{EMAIL}}': employee.email,
    '{{PHONE}}': employee.phone,
    '{{MONTHLY_SALARY}}': additionalData.monthlySalary || 'N/A',
    '{{ANNUAL_SALARY}}': additionalData.annualSalary || 'N/A',
    '{{MISSION_LOCATION}}': additionalData.missionLocation || 'N/A',
    '{{PURPOSE}}': additionalData.purpose || 'N/A',
    '{{END_DATE}}': additionalData.endDate || 'N/A',
    '{{CURRENT_DATE}}': new Date().toLocaleDateString(),
    '{{COMPANY_NAME}}': 'Your Company Name',
    '{{COMPANY_ADDRESS}}': 'Your Company Address'
  };

  // Simulate PDF generation process
  await new Promise(resolve => setTimeout(resolve, 2000));

  // In a real implementation, you would:
  // 1. Load the template PDF
  // 2. Replace variables with actual data
  // 3. Generate the final PDF
  // 4. Save it to storage (cloud storage, local server, etc.)
  // 5. Return the URL to the generated PDF

  const generatedPdfUrl = `/generated-documents/${template.type}-${employee.id}-${Date.now()}.pdf`;
  
  console.log('PDF generated successfully:', generatedPdfUrl);
  
  return generatedPdfUrl;
};

export const replaceVariables = (template: string, variables: Record<string, string>): string => {
  let result = template;
  
  Object.entries(variables).forEach(([variable, value]) => {
    const regex = new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g');
    result = result.replace(regex, value);
  });
  
  return result;
};

export const validateTemplate = (template: DocumentTemplate): string[] => {
  const errors: string[] = [];
  
  if (!template.name) {
    errors.push('Template name is required');
  }
  
  if (!template.templateUrl) {
    errors.push('Template file is required');
  }
  
  if (!template.variables || template.variables.length === 0) {
    errors.push('At least one variable is required');
  }
  
  // Check for malformed variables
  template.variables.forEach(variable => {
    if (!variable.startsWith('{{') || !variable.endsWith('}}')) {
      errors.push(`Invalid variable format: ${variable}. Use {{VARIABLE_NAME}} format.`);
    }
  });
  
  return errors;
};

export const getAvailableVariables = (): Record<string, string> => {
  return {
    '{{EMPLOYEE_NAME}}': 'Full name of the employee',
    '{{CIN}}': 'Employee ID or CIN number',
    '{{POSITION}}': 'Job position/title',
    '{{DEPARTMENT}}': 'Department name',
    '{{START_DATE}}': 'Employment start date',
    '{{HIRE_DATE}}': 'Hire date (same as start date)',
    '{{EMAIL}}': 'Employee email address',
    '{{PHONE}}': 'Employee phone number',
    '{{MONTHLY_SALARY}}': 'Monthly salary amount',
    '{{ANNUAL_SALARY}}': 'Annual salary amount',
    '{{MISSION_LOCATION}}': 'Mission location (for mission orders)',
    '{{PURPOSE}}': 'Purpose of mission or document',
    '{{END_DATE}}': 'End date (for missions, etc.)',
    '{{CURRENT_DATE}}': 'Current date when document is generated',
    '{{COMPANY_NAME}}': 'Company name',
    '{{COMPANY_ADDRESS}}': 'Company address'
  };
};
