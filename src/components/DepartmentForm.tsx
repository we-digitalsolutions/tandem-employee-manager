
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Department } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";

const departmentFormSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  manager: z.string().min(1, "Manager is required"),
  budget: z.coerce.number().min(0, "Budget must be a positive number"),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentFormProps {
  department?: Department;
  onSubmit: (data: DepartmentFormValues) => void;
}

const DepartmentForm = ({ department, onSubmit }: DepartmentFormProps) => {
  const { employees } = useEmployees();
  
  // Filter employees to get only managers and admins
  const managers = employees.filter(emp => emp.role === 'manager' || emp.role === 'admin');
  
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: department ? {
      name: department.name,
      manager: department.manager,
      budget: department.budget,
    } : {
      name: "",
      manager: "",
      budget: 0,
    }
  });

  const handleSubmit = (data: DepartmentFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Name</FormLabel>
              <FormControl>
                <Input placeholder="Engineering" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Manager</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {managers.map((manager) => (
                    <SelectItem key={manager.id} value={`${manager.firstName} ${manager.lastName}`}>
                      {manager.firstName} {manager.lastName} - {manager.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Budget</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="100000" 
                  {...field} 
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">
            {department ? "Update Department" : "Add Department"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DepartmentForm;
