
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface LeaveBalance {
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  used: number;
  total: number;
  pending: number;
}

interface LeaveBalanceQuotaAlertProps {
  balances: LeaveBalance[];
  requestedDays: number;
  requestType: string;
}

const LeaveBalanceQuotaAlert = ({ balances, requestedDays, requestType }: LeaveBalanceQuotaAlertProps) => {
  const getBalanceForType = (type: string) => {
    return balances.find(b => b.type === type) || { used: 0, total: 20, pending: 0 };
  };

  const currentBalance = getBalanceForType(requestType);
  const available = currentBalance.total - currentBalance.used - currentBalance.pending;
  const willExceed = requestedDays > available;
  const utilizationPercent = ((currentBalance.used + currentBalance.pending) / currentBalance.total) * 100;

  const getStatusIcon = () => {
    if (willExceed) return <XCircle className="h-4 w-4 text-red-500" />;
    if (utilizationPercent > 80) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getAlertVariant = () => {
    if (willExceed) return "destructive";
    if (utilizationPercent > 80) return "default";
    return "default";
  };

  const getStatusMessage = () => {
    if (willExceed) {
      return `Request exceeds available balance by ${requestedDays - available} day(s). Consider adjusting the dates or request type.`;
    }
    if (utilizationPercent > 80) {
      return `High leave utilization (${utilizationPercent.toFixed(0)}%). ${available} day(s) remaining after this request.`;
    }
    return `Request approved. ${available - requestedDays} day(s) will remain available.`;
  };

  return (
    <div className="space-y-4">
      <Alert variant={getAlertVariant()}>
        {getStatusIcon()}
        <AlertDescription>
          {getStatusMessage()}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {balances.map((balance) => {
          const used = balance.used + balance.pending;
          const percent = (used / balance.total) * 100;
          
          return (
            <div key={balance.type} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium capitalize">{balance.type} Leave</h4>
                <Badge variant={percent > 80 ? "destructive" : percent > 60 ? "secondary" : "default"}>
                  {balance.total - used}/{balance.total}
                </Badge>
              </div>
              
              <Progress value={percent} className="mb-2" />
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span>{balance.used} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span>{balance.pending} days</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Available:</span>
                  <span>{balance.total - used} days</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {willExceed && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Suggestion:</strong> You can split this request across different leave types or adjust the dates to fit within your available balance.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LeaveBalanceQuotaAlert;
