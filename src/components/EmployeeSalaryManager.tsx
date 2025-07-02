import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Edit, 
  Save, 
  X
} from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';
import { Employee, SalaryHistory } from '@/types';
import { format } from 'date-fns';

interface EmployeeSalaryManagerProps {
  employee: Employee;
  onClose: () => void;
  onUpdate: (updatedEmployee: Employee) => void;
}

const EmployeeSalaryManager = ({ employee, onClose, onUpdate }: EmployeeSalaryManagerProps) => {
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const [updateForm, setUpdateForm] = useState({
    newSalary: employee.salary?.toString() || '',
    currency: employee.salaryCurrency || 'USD',
    effectiveDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  useEffect(() => {
    fetchSalaryHistory();
  }, [employee.id]);

  const fetchSalaryHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('salary_history')
        .select('*')
        .eq('employee_id', employee.id)
        .order('effective_date', { ascending: false });

      if (error) throw error;

      const formattedHistory: SalaryHistory[] = data.map(record => ({
        id: record.id,
        employeeId: record.employee_id,
        previousSalary: record.previous_salary || undefined,
        newSalary: record.new_salary,
        currency: record.currency,
        effectiveDate: record.effective_date,
        reason: record.reason || undefined,
        approvedBy: record.approved_by || undefined,
        createdAt: record.created_at
      }));

      setSalaryHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching salary history:', error);
      toast.error('Failed to fetch salary history');
    } finally {
      setLoading(false);
    }
  };

  const handleSalaryUpdate = async () => {
    if (!updateForm.newSalary || !updateForm.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newSalary = parseFloat(updateForm.newSalary);
    if (isNaN(newSalary) || newSalary <= 0) {
      toast.error('Please enter a valid salary amount');
      return;
    }

    try {
      setUpdating(true);

      // Update employee salary
      const { data, error } = await supabase
        .from('employees')
        .update({
          salary: newSalary,
          salary_currency: updateForm.currency
        })
        .eq('id', employee.id)
        .select()
        .single();

      if (error) throw error;

      // Add manual salary history record with reason
      const { error: historyError } = await supabase
        .from('salary_history')
        .insert({
          employee_id: employee.id,
          previous_salary: employee.salary,
          new_salary: newSalary,
          currency: updateForm.currency,
          effective_date: updateForm.effectiveDate,
          reason: updateForm.reason,
          approved_by: employee.id // In real app, this would be current user ID
        });

      if (historyError) throw historyError;

      // Update local employee data
      const updatedEmployee = {
        ...employee,
        salary: newSalary,
        salaryCurrency: updateForm.currency
      };

      onUpdate(updatedEmployee);
      toast.success('Salary updated successfully');
      setIsUpdateDialogOpen(false);
      setUpdateForm({
        newSalary: '',
        currency: 'USD',
        effectiveDate: new Date().toISOString().split('T')[0],
        reason: ''
      });
      await fetchSalaryHistory();
    } catch (error) {
      console.error('Error updating salary:', error);
      toast.error('Failed to update salary');
    } finally {
      setUpdating(false);
    }
  };

  const calculateSalaryChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return {
      amount: change,
      percentage: percentage,
      isIncrease: change > 0
    };
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Salary Management</h3>
        <Button 
          onClick={() => setIsUpdateDialogOpen(true)}
          className="bg-hr-teal hover:bg-hr-teal/90"
        >
          <Edit className="mr-2 h-4 w-4" />
          Update Salary
        </Button>
      </div>

      {/* Current Salary Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Current Salary Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-500">Current Salary</Label>
              <p className="text-2xl font-bold text-green-600">
                {employee.salary ? 
                  formatCurrency(employee.salary, employee.salaryCurrency || 'USD') : 
                  'Not set'
                }
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Currency</Label>
              <p className="text-lg font-medium">
                {employee.salaryCurrency || 'USD'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Employment Type</Label>
              <p className="text-lg font-medium capitalize">
                {employee.employmentType || 'Full-time'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Salary History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Effective Date</TableHead>
                <TableHead>Previous Salary</TableHead>
                <TableHead>New Salary</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading salary history...
                  </TableCell>
                </TableRow>
              ) : salaryHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No salary history available
                  </TableCell>
                </TableRow>
              ) : (
                salaryHistory.map((record) => {
                  const change = calculateSalaryChange(record.newSalary, record.previousSalary);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {format(new Date(record.effectiveDate), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.previousSalary ? 
                          formatCurrency(record.previousSalary, record.currency) : 
                          'N/A'
                        }
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(record.newSalary, record.currency)}
                      </TableCell>
                      <TableCell>
                        {change ? (
                          <div className={`flex items-center gap-1 ${
                            change.isIncrease ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingUp 
                              className={`h-4 w-4 ${change.isIncrease ? '' : 'transform rotate-180'}`} 
                            />
                            <span className="font-medium">
                              {change.isIncrease ? '+' : ''}
                              {formatCurrency(change.amount, record.currency)}
                            </span>
                            <span className="text-sm">
                              ({change.isIncrease ? '+' : ''}{change.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Initial salary</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {record.reason || 'No reason provided'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Update Salary Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Salary</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentSalary">Current Salary</Label>
              <Input
                id="currentSalary"
                value={employee.salary ? formatCurrency(employee.salary, employee.salaryCurrency || 'USD') : 'Not set'}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newSalary">New Salary *</Label>
                <Input
                  id="newSalary"
                  type="number"
                  placeholder="60000"
                  value={updateForm.newSalary}
                  onChange={(e) => setUpdateForm(prev => ({ 
                    ...prev, 
                    newSalary: e.target.value 
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={updateForm.currency} 
                  onValueChange={(value) => setUpdateForm(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="effectiveDate">Effective Date *</Label>
              <Input
                id="effectiveDate"
                type="date"
                value={updateForm.effectiveDate}
                onChange={(e) => setUpdateForm(prev => ({ 
                  ...prev, 
                  effectiveDate: e.target.value 
                }))}
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason for Change *</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Annual review, Promotion, Market adjustment..."
                value={updateForm.reason}
                onChange={(e) => setUpdateForm(prev => ({ 
                  ...prev, 
                  reason: e.target.value 
                }))}
              />
            </div>

            {updateForm.newSalary && employee.salary && (
              <div className="p-4 bg-blue-50 rounded-md">
                <Label className="text-sm font-medium text-blue-700">Salary Change Preview</Label>
                {(() => {
                  const change = calculateSalaryChange(parseFloat(updateForm.newSalary), employee.salary);
                  return change ? (
                    <p className={`font-medium ${change.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                      {change.isIncrease ? '+' : ''}{formatCurrency(change.amount, updateForm.currency)} 
                      ({change.isIncrease ? '+' : ''}{change.percentage.toFixed(1)}%)
                    </p>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSalaryUpdate} 
              disabled={updating || !updateForm.newSalary || !updateForm.reason}
            >
              {updating ? 'Updating...' : 'Update Salary'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default EmployeeSalaryManager;