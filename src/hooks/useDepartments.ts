
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('departments')
        .select('name')
        .order('name');

      if (error) throw error;

      setDepartments(data.map(dept => dept.name));
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Fallback to default departments if fetch fails
      setDepartments([
        'Engineering',
        'Human Resources',
        'Marketing',
        'Sales',
        'Finance',
        'Operations'
      ]);
      toast({
        title: "Warning",
        description: "Using default departments. Database connection may be limited.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return { departments, loading, refetch: fetchDepartments };
};
