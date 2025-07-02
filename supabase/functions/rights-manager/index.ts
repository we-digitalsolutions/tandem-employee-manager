import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RoleAssignment {
  userId: string;
  role: 'admin' | 'manager' | 'employee';
  permissions?: string[];
  departmentId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, userId, role, permissions, departmentId } = await req.json();

    console.log('Processing rights management:', { action, userId, role, permissions, departmentId });

    switch (action) {
      case 'assign_role':
        // Update employee role
        const { error: roleError } = await supabase
          .from('employees')
          .update({ role })
          .eq('id', userId);

        if (roleError) {
          throw roleError;
        }

        // If manager role, potentially update department
        if (role === 'manager' && departmentId) {
          const { error: deptError } = await supabase
            .from('departments')
            .update({ manager_id: userId })
            .eq('id', departmentId);

          if (deptError) {
            console.log('Warning: Could not update department manager:', deptError);
          }
        }

        return new Response(JSON.stringify({ 
          success: true, 
          message: `Role ${role} assigned to user ${userId}` 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'check_permissions':
        // Get user's role and permissions
        const { data: employee, error: empError } = await supabase
          .from('employees')
          .select('role, department, manager_id')
          .eq('id', userId)
          .single();

        if (empError || !employee) {
          throw new Error('Employee not found');
        }

        // Define role-based permissions
        const rolePermissions = {
          admin: [
            'manage_employees',
            'manage_departments', 
            'view_all_requests',
            'approve_leave',
            'approve_remote',
            'generate_reports',
            'manage_templates',
            'manage_holidays'
          ],
          manager: [
            'view_team_requests',
            'approve_leave',
            'approve_remote',
            'view_team_reports',
            'manage_team_documents'
          ],
          employee: [
            'submit_leave_request',
            'submit_remote_request',
            'view_own_requests',
            'view_holidays',
            'request_documents'
          ]
        };

        const userPermissions = rolePermissions[employee.role as keyof typeof rolePermissions] || [];

        return new Response(JSON.stringify({
          success: true,
          role: employee.role,
          permissions: userPermissions,
          isManager: employee.role === 'manager',
          isAdmin: employee.role === 'admin'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'get_manageable_users':
        // Get users that this user can manage
        const { data: currentUser, error: currentUserError } = await supabase
          .from('employees')
          .select('role, department, id')
          .eq('id', userId)
          .single();

        if (currentUserError || !currentUser) {
          throw new Error('Current user not found');
        }

        let manageableUsers: any[] = [];

        if (currentUser.role === 'admin') {
          // Admins can manage everyone
          const { data: allUsers, error: allUsersError } = await supabase
            .from('employees')
            .select('id, first_name, last_name, role, department, email');

          if (!allUsersError && allUsers) {
            manageableUsers = allUsers;
          }
        } else if (currentUser.role === 'manager') {
          // Managers can manage their department employees
          const { data: teamUsers, error: teamUsersError } = await supabase
            .from('employees')
            .select('id, first_name, last_name, role, department, email')
            .eq('department', currentUser.department)
            .neq('role', 'admin');

          if (!teamUsersError && teamUsers) {
            manageableUsers = teamUsers;
          }
        }

        return new Response(JSON.stringify({
          success: true,
          manageableUsers,
          userRole: currentUser.role
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in rights manager:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});