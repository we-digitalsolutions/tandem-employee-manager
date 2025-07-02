import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApprovalRequest {
  requestId: string;
  requestType: 'leave' | 'remote';
  action: 'approve' | 'decline';
  approverId: string;
  approverRole: string;
  comments?: string;
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

    const { requestId, requestType, action, approverId, approverRole, comments } = await req.json() as ApprovalRequest;

    console.log('Processing workflow approval:', { requestId, requestType, action, approverId, approverRole });

    // Get current request details
    const tableName = requestType === 'leave' ? 'leave_requests' : 'remote_requests';
    const { data: request, error: requestError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError || !request) {
      throw new Error('Request not found');
    }

    // Create approval record
    const { data: approvalRecord, error: approvalError } = await supabase
      .from('approval_records')
      .insert({
        approver_id: approverId,
        approver_name: `Approver ${approverId}`,
        approver_role: approverRole,
        decision: action,
        comments: comments || '',
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (approvalError) {
      console.error('Error creating approval record:', approvalError);
      throw approvalError;
    }

    // Update request based on workflow logic
    let newStatus = request.status;
    let currentStep = request.current_approval_step;
    let approvalFieldName = '';

    if (action === 'decline') {
      newStatus = 'declined';
      currentStep = null;
    } else if (action === 'approve') {
      if (approverRole === 'manager' && currentStep === 'manager') {
        // Manager approval - move to HR if needed
        newStatus = 'manager-approved';
        currentStep = 'hr';
        approvalFieldName = 'manager_approval_id';
      } else if (approverRole === 'hr' && currentStep === 'hr') {
        // HR approval - final approval
        newStatus = 'approved';
        currentStep = null;
        approvalFieldName = 'hr_approval_id';
      }
    }

    // Update request with new status and approval
    const updateData: any = {
      status: newStatus,
      current_approval_step: currentStep,
      reviewed_by: approverId,
      review_date: new Date().toISOString(),
      comments: comments || request.comments
    };

    if (approvalFieldName) {
      updateData[approvalFieldName] = approvalRecord.id;
    }

    const { error: updateError } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', requestId);

    if (updateError) {
      console.error('Error updating request:', updateError);
      throw updateError;
    }

    // Send notification to employee
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        recipient_id: request.employee_id,
        sender_id: approverId,
        type: action === 'approve' ? 'success' : 'warning',
        message: `Your ${requestType} request has been ${action === 'approve' ? 'approved' : 'declined'} by ${approverRole}`,
        link: `/requests/${requestType}/${requestId}`
      });

    if (notificationError) {
      console.log('Warning: Could not send notification:', notificationError);
    }

    const result = {
      success: true,
      newStatus,
      currentStep,
      approvalRecordId: approvalRecord.id,
      message: `Request ${action === 'approve' ? 'approved' : 'declined'} successfully`
    };

    console.log('Workflow processing result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in workflow processor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});