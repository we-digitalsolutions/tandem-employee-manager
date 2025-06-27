
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/sonner';
import { Holiday } from '@/types';

const mockHolidays: Holiday[] = [
  { id: '1', name: 'New Year\'s Day', date: '2025-01-01', type: 'national', recurring: true },
  { id: '2', name: 'Independence Day', date: '2025-03-20', type: 'national', recurring: true },
  { id: '3', name: 'Labor Day', date: '2025-05-01', type: 'national', recurring: true },
  { id: '4', name: 'Company Foundation Day', date: '2025-06-15', type: 'company', recurring: true },
];

interface HolidayFormData {
  name: string;
  date: string;
  type: 'national' | 'company' | 'religious';
  recurring: boolean;
}

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<HolidayFormData>({
    defaultValues: {
      name: '',
      date: '',
      type: 'national',
      recurring: true,
    },
  });

  const onSubmit = (data: HolidayFormData) => {
    const newHoliday: Holiday = {
      id: `${Date.now()}`,
      name: data.name,
      date: data.date,
      type: data.type,
      recurring: data.recurring,
    };

    setHolidays([...holidays, newHoliday]);
    setIsCreateDialogOpen(false);
    form.reset();
    toast.success('Holiday added successfully');
  };

  const handleDelete = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
    toast.success('Holiday deleted');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'national': return 'bg-blue-100 text-blue-800';
      case 'company': return 'bg-green-100 text-green-800';
      case 'religious': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Holiday Calendar</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Holiday
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Holiday</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Holiday Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter holiday name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="national">National</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="religious">Religious</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Holiday</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Holidays ({new Date().getFullYear()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {holidays.map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{holiday.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(holiday.type)}`}>
                      {holiday.type}
                    </span>
                    {holiday.recurring && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Recurring
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{holiday.date}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(holiday.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HolidayCalendar;
