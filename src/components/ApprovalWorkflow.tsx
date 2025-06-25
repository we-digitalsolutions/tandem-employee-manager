
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApprovalRecord, RequestStatus } from '@/types';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';

interface ApprovalWorkflowProps {
  status: RequestStatus;
  managerApproval?: ApprovalRecord;
  hrApproval?: ApprovalRecord;
  currentStep?: 'manager' | 'hr';
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  status,
  managerApproval,
  hrApproval,
  currentStep
}) => {
  const getStepStatus = (step: 'manager' | 'hr') => {
    if (step === 'manager') {
      if (managerApproval) {
        return managerApproval.decision === 'approved' ? 'approved' : 'declined';
      }
      return currentStep === 'manager' ? 'pending' : 'waiting';
    } else {
      if (hrApproval) {
        return hrApproval.decision === 'approved' ? 'approved' : 'declined';
      }
      if (managerApproval?.decision === 'approved') {
        return currentStep === 'hr' ? 'pending' : 'waiting';
      }
      return 'waiting';
    }
  };

  const getStatusIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'declined': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (stepStatus: string) => {
    switch (stepStatus) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const managerStatus = getStepStatus('manager');
  const hrStatus = getStepStatus('hr');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Manager Approval Step */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(managerStatus)}
              <div>
                <h4 className="font-medium">Department Manager</h4>
                <p className="text-sm text-gray-500">Step 1: Manager Review</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(managerStatus)} variant="outline">
                {managerStatus.charAt(0).toUpperCase() + managerStatus.slice(1)}
              </Badge>
              {managerApproval && (
                <div className="mt-1 text-sm text-gray-600">
                  <p>{managerApproval.approverName}</p>
                  <p>{new Date(managerApproval.date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Connection Line */}
          <div className="flex justify-center">
            <div className={`w-0.5 h-6 ${
              managerStatus === 'approved' ? 'bg-green-300' : 'bg-gray-300'
            }`} />
          </div>

          {/* HR Approval Step */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(hrStatus)}
              <div>
                <h4 className="font-medium">HR Manager</h4>
                <p className="text-sm text-gray-500">Step 2: HR Review</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(hrStatus)} variant="outline">
                {hrStatus.charAt(0).toUpperCase() + hrStatus.slice(1)}
              </Badge>
              {hrApproval && (
                <div className="mt-1 text-sm text-gray-600">
                  <p>{hrApproval.approverName}</p>
                  <p>{new Date(hrApproval.date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          {(managerApproval?.comments || hrApproval?.comments) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Comments</h4>
              {managerApproval?.comments && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">Manager:</p>
                  <p className="text-sm text-gray-600">{managerApproval.comments}</p>
                </div>
              )}
              {hrApproval?.comments && (
                <div>
                  <p className="text-sm font-medium text-gray-700">HR:</p>
                  <p className="text-sm text-gray-600">{hrApproval.comments}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalWorkflow;
