
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaveBalance as LeaveBalanceType } from '@/types';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

interface LeaveBalanceProps {
  employeeId: string;
  balances?: LeaveBalanceType[];
}

// Mock leave balances data
const mockLeaveBalances: LeaveBalanceType[] = [
  {
    type: 'vacation',
    allocated: 25,
    used: 10,
    remaining: 15,
    year: 2025
  },
  {
    type: 'sick',
    allocated: 12,
    used: 3,
    remaining: 9,
    year: 2025
  },
  {
    type: 'personal',
    allocated: 5,
    used: 2,
    remaining: 3,
    year: 2025
  },
  {
    type: 'maternity',
    allocated: 90,
    used: 0,
    remaining: 90,
    year: 2025
  },
  {
    type: 'paternity',
    allocated: 14,
    used: 0,
    remaining: 14,
    year: 2025
  }
];

const LeaveBalance: React.FC<LeaveBalanceProps> = ({ employeeId, balances = mockLeaveBalances }) => {
  const getLeaveTypeLabel = (type: string) => {
    const labels = {
      vacation: 'Vacation',
      sick: 'Sick Leave',
      personal: 'Personal Leave',
      maternity: 'Maternity Leave',
      paternity: 'Paternity Leave',
      bereavement: 'Bereavement Leave'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getBalanceStatus = (remaining: number, allocated: number) => {
    const percentage = (remaining / allocated) * 100;
    if (percentage <= 10) return 'critical';
    if (percentage <= 25) return 'low';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Leave Balances - {new Date().getFullYear()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {balances.map((balance) => {
            const status = getBalanceStatus(balance.remaining, balance.allocated);
            return (
              <div key={balance.type} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{getLeaveTypeLabel(balance.type)}</h4>
                    <Badge className={getStatusColor(status)} variant="outline">
                      {balance.remaining} days left
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Used: {balance.used}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Total: {balance.allocated}</span>
                    </div>
                  </div>
                  
                  {status === 'critical' && (
                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Low balance - plan accordingly</span>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'critical' ? 'bg-red-500' :
                        status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.max((balance.remaining / balance.allocated) * 100, 5)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalance;
