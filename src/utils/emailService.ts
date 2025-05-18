
import { toast } from "@/components/ui/sonner";
import { EmailNotification } from "@/types";

// In a real application, this would connect to a backend service
export const sendEmailNotification = async (notification: EmailNotification): Promise<boolean> => {
  console.log("Sending email notification:", notification);
  
  // Simulate API call (in a real app, this would be an actual API request)
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Log the email for demonstration purposes
      console.log(`Email sent successfully to ${notification.to}`);
      console.log(`Subject: ${notification.subject}`);
      console.log(`Body: ${notification.body}`);
      
      // In a real application, we would check the actual response status
      resolve(true);
    }, 1000);
  });
};

export const sendStatusUpdateEmail = async (
  employeeName: string,
  employeeEmail: string,
  requestType: 'leave' | 'remote',
  requestId: string,
  newStatus: 'approved' | 'declined',
  dates: { startDate: string; endDate: string },
  comments?: string
): Promise<void> => {
  const subject = `[HR System] Your ${requestType} request has been ${newStatus}`;
  
  const getStatusEmoji = () => (newStatus === 'approved' ? '✅' : '❌');
  
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2>Hello ${employeeName},</h2>
      
      <p>Your ${requestType} request for ${dates.startDate} to ${dates.endDate} has been <strong>${newStatus}</strong> ${getStatusEmoji()}</p>
      
      ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ''}
      
      <p>Request ID: ${requestId}</p>
      
      <p style="margin-top: 30px;">If you have any questions, please contact the HR department.</p>
      
      <p><em>This is an automated message, please do not reply to this email.</em></p>
    </div>
  `;
  
  try {
    const result = await sendEmailNotification({
      to: employeeEmail,
      subject,
      body,
      isHtml: true
    });
    
    if (result) {
      toast.success(`Status update email sent to ${employeeName}`);
    } else {
      toast.error(`Failed to send email notification to ${employeeName}`);
    }
  } catch (error) {
    console.error("Error sending email notification:", error);
    toast.error("Failed to send email notification");
  }
};
