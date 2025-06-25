
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Holiday } from '@/types';
import { holidays } from '@/utils/dateCalculations';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';

const HolidayCalendar: React.FC = () => {
  const [holidayList, setHolidayList] = useState<Holiday[]>(holidays);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    type: 'company' as Holiday['type'],
    recurring: false
  });

  const getTypeColor = (type: Holiday['type']) => {
    switch (type) {
      case 'national': return 'bg-red-100 text-red-800';
      case 'religious': return 'bg-purple-100 text-purple-800';
      case 'company': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedHolidays = [...holidayList].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleAddHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const holiday: Holiday = {
      id: `${Date.now()}`,
      ...newHoliday
    };

    setHolidayList([...holidayList, holiday]);
    setNewHoliday({ name: '', date: '', type: 'company', recurring: false });
    setIsAddDialogOpen(false);
    toast.success('Holiday added successfully');
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidayList(holidayList.filter(holiday => holiday.id !== id));
    toast.success('Holiday deleted successfully');
  };

  const getCurrentYear = () => new Date().getFullYear();
  const currentYearHolidays = sortedHolidays.filter(holiday => 
    new Date(holiday.date).getFullYear() === getCurrentYear()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Holiday Calendar {getCurrentYear()}
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Holiday</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="holidayName">Holiday Name</Label>
                  <Input
                    id="holidayName"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
                    placeholder="Enter holiday name"
                  />
                </div>
                <div>
                  <Label htmlFor="holidayDate">Date</Label>
                  <Input
                    id="holidayDate"
                    type="date"
                    value={newHoliday.date}
                    onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="holidayType">Type</Label>
                  <Select value={newHoliday.type} onValueChange={(value: Holiday['type']) => 
                    setNewHoliday({...newHoliday, type: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="religious">Religious</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={newHoliday.recurring}
                    onChange={(e) => setNewHoliday({...newHoliday, recurring: e.target.checked})}
                  />
                  <Label htmlFor="recurring">Recurring annually</Label>
                </div>
                <Button onClick={handleAddHoliday} className="w-full">
                  Add Holiday
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currentYearHolidays.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No holidays defined for this year</p>
          ) : (
            currentYearHolidays.map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 text-center">
                    <div className="text-lg font-bold">
                      {new Date(holiday.date).getDate()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">{holiday.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(holiday.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(holiday.type)} variant="outline">
                    {holiday.type}
                  </Badge>
                  {holiday.recurring && (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Recurring
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteHoliday(holiday.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HolidayCalendar;
