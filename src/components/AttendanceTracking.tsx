
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AttendanceRecord } from '@/types';
import { Clock, MapPin, Calendar, Plus, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';

interface AttendanceTrackingProps {
  employeeId: string;
  isManager?: boolean;
}

// Mock attendance data
const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '101',
    date: '2025-06-25',
    clockIn: '09:00',
    clockOut: '17:30',
    totalHours: 8.5,
    status: 'present',
    location: 'Office'
  },
  {
    id: '2',
    employeeId: '101',
    date: '2025-06-24',
    clockIn: '09:15',
    clockOut: '17:45',
    totalHours: 8.5,
    status: 'late',
    location: 'Office',
    notes: 'Traffic delay'
  },
  {
    id: '3',
    employeeId: '101',
    date: '2025-06-23',
    status: 'remote',
    totalHours: 8,
    location: 'Home'
  }
];

const AttendanceTracking: React.FC<AttendanceTrackingProps> = ({
  employeeId,
  isManager = false
}) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [isClockInDialogOpen, setIsClockInDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    status: 'present' as AttendanceRecord['status'],
    location: '',
    notes: ''
  });

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'remote': return 'bg-blue-100 text-blue-800';
      case 'half-day': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'late': return <Clock className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      case 'remote': return <MapPin className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleClockIn = () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    const record: AttendanceRecord = {
      id: `${Date.now()}`,
      employeeId,
      date: now.toISOString().split('T')[0],
      clockIn: currentTime,
      status: newRecord.status,
      location: newRecord.location,
      notes: newRecord.notes || undefined
    };

    setAttendanceRecords([record, ...attendanceRecords]);
    setNewRecord({ status: 'present', location: '', notes: '' });
    setIsClockInDialogOpen(false);
    toast.success('Clocked in successfully');
  };

  const handleClockOut = (recordId: string) => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    setAttendanceRecords(attendanceRecords.map(record => {
      if (record.id === recordId && record.clockIn) {
        const clockInTime = new Date(`1970-01-01T${record.clockIn}:00`);
        const clockOutTime = new Date(`1970-01-01T${currentTime}:00`);
        const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
        
        return {
          ...record,
          clockOut: currentTime,
          totalHours: Math.round(totalHours * 100) / 100
        };
      }
      return record;
    }));
    
    toast.success('Clocked out successfully');
  };

  const todayRecord = attendanceRecords.find(record => 
    record.date === new Date().toISOString().split('T')[0] && record.employeeId === employeeId
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Attendance Tracking
          </CardTitle>
          {!isManager && (
            <div className="flex items-center gap-2">
              {todayRecord && todayRecord.clockIn && !todayRecord.clockOut ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleClockOut(todayRecord.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Clock Out
                </Button>
              ) : !todayRecord ? (
                <Dialog open={isClockInDialogOpen} onOpenChange={setIsClockInDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Clock In
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Clock In</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={newRecord.status}
                          onValueChange={(value: AttendanceRecord['status']) =>
                            setNewRecord({...newRecord, status: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="remote">Remote Work</SelectItem>
                            <SelectItem value="half-day">Half Day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newRecord.location}
                          onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                          placeholder="Office, Home, Client site, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={newRecord.notes}
                          onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                          placeholder="Any additional notes..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleClockIn}>Clock In</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : null}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attendanceRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attendance records</p>
          ) : (
            attendanceRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                      <Badge className={getStatusColor(record.status)} variant="outline">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(record.status)}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </div>
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {record.clockIn && (
                      <span>In: {record.clockIn}</span>
                    )}
                    {record.clockOut && (
                      <span>Out: {record.clockOut}</span>
                    )}
                    {record.totalHours && (
                      <span>Hours: {record.totalHours}</span>
                    )}
                    {record.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {record.location}
                      </span>
                    )}
                  </div>
                  
                  {record.notes && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      {record.notes}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTracking;
