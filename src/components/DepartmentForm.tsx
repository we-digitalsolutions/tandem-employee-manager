
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
import { toast } from "@/components/ui/sonner";
import { Department } from "@/types";

const departmentFormSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  manager: z.string().min(2, "Manager name is required"),
  budget: z.coerce.number().min(0, "Budget must be a positive number"),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentFormProps {
  department?: Department;
  onSubmit: (data: DepartmentFormValues) => void;
}

const DepartmentForm = ({ department, onSubmit }: DepartmentFormProps) => {
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
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
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
