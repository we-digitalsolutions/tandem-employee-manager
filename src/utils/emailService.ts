export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

// Mock email service implementation
export const sendStatusUpdateEmail = (
  employeeName: string,
  employeeEmail: string,
  requestType: 'leave' | 'remote',
  requestId: string,
  status: 'approved' | 'declined' | 'manager-approved',
  requestDetails?: any,
  comments?: string
) => {
  let subject = '';
  let statusMessage = '';
  
  if (status === 'approved') {
    subject = `${requestType === 'leave' ? 'Leave' : 'Remote Work'} Request Approved`;
    statusMessage = 'has been approved';
  } else if (status === 'declined') {
    subject = `${requestType === 'leave' ? 'Leave' : 'Remote Work'} Request Declined`;
    statusMessage = 'has been declined';
  } else if (status === 'manager-approved') {
    subject = `${requestType === 'leave' ? 'Leave' : 'Remote Work'} Request - Manager Approved`;
    statusMessage = 'has been approved by your manager and is now pending HR approval';
  }

  let body = `Dear ${employeeName},\n\nYour ${requestType} request (ID: ${requestId}) for ${requestDetails?.startDate} to ${requestDetails?.endDate} ${statusMessage}.\n`;

  if (comments) {
    body += `\nComments: ${comments}\n`;
  }

  body += `\nSincerely,\nYour HR Department`;

  const notification: EmailNotification = {
    to: employeeEmail,
    subject: subject,
    body: body,
    isHtml: false,
  };

  console.log('Sending email:', notification);
  // In a real application, you would use a service like SendGrid, Mailgun, or Nodemailer to send the email.
};
