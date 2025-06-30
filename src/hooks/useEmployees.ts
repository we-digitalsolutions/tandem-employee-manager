
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEmployees: Employee[] = data.map(emp => ({
        id: emp.id,
        firstName: emp.first_name,
        lastName: emp.last_name,
        email: emp.email,
        phone: emp.phone || '',
        position: emp.position,
        department: emp.department,
        hireDate: emp.hire_date,
        status: emp.status as 'active' | 'inactive' | 'onLeave',
        avatar: emp.avatar || undefined,
        jobDescription: emp.job_description || undefined,
        role: emp.role as 'admin' | 'manager' | 'employee' || 'employee',
        managerId: emp.manager_id || undefined
      }));

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'hireDate'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          first_name: employeeData.firstName,
          last_name: employeeData.lastName,
          email: employeeData.email,
          phone: employeeData.phone,
          position: employeeData.position,
          department: employeeData.department,
          hire_date: new Date().toISOString().split('T')[0],
          status: employeeData.status,
          job_description: employeeData.jobDescription,
          role: employeeData.role || 'employee'
        })
        .select()
        .single();

      if (error) throw error;

      const newEmployee: Employee = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone || '',
        position: data.position,
        department: data.department,
        hireDate: data.hire_date,
        status: data.status,
        avatar: data.avatar || undefined,
        jobDescription: data.job_description || undefined,
        role: data.role || 'employee',
        managerId: data.manager_id || undefined
      };

      setEmployees(prev => [newEmployee, ...prev]);
      
      toast({
        title: "Success",
        description: "Employee added successfully"
      });

      return newEmployee;
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update({
          first_name: employeeData.firstName,
          last_name: employeeData.lastName,
          email: employeeData.email,
          phone: employeeData.phone,
          position: employeeData.position,
          department: employeeData.department,
          status: employeeData.status,
          job_description: employeeData.jobDescription,
          role: employeeData.role
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedEmployee: Employee = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone || '',
        position: data.position,
        department: data.department,
        hireDate: data.hire_date,
        status: data.status,
        avatar: data.avatar || undefined,
        jobDescription: data.job_description || undefined,
        role: data.role || 'employee',
        managerId: data.manager_id || undefined
      };

      setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp));
      
      toast({
        title: "Success",
        description: "Employee updated successfully"
      });

      return updatedEmployee;
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deactivateEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) throw error;

      setEmployees(prev => prev.map(emp => 
        emp.id === id ? { ...emp, status: 'inactive' as const } : emp
      ));
      
      toast({
        title: "Success",
        description: "Employee deactivated successfully"
      });
    } catch (error) {
      console.error('Error deactivating employee:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate employee",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deactivateEmployee,
    refetch: fetchEmployees
  };
};
