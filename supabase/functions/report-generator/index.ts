import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportRequest {
  type: 'attendance' | 'leave' | 'performance' | 'department' | 'custom';
  format: 'pdf' | 'csv' | 'excel';
  dateRange: {
    start: string;
    end: string;
  };
  filters?: {
    departmentId?: string;
    employeeId?: string;
    status?: string;
  };
  deliveryMethod?: 'download' | 'email';
  recipientEmail?: string;
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

    const { action, ...reportData } = await req.json();

    console.log('Processing report generation:', action);

    switch (action) {
      case 'generate_report':
        const request = reportData as ReportRequest;
        
        let data: any[] = [];
        let reportName = '';

        // Fetch data based on report type
        switch (request.type) {
          case 'attendance':
            reportName = `Attendance Report ${request.dateRange.start} to ${request.dateRange.end}`;
            
            let attendanceQuery = supabase
              .from('attendance_records')
              .select(`
                date, clock_in, clock_out, total_hours, status, location,
                employees!inner(first_name, last_name, department)
              `)
              .gte('date', request.dateRange.start)
              .lte('date', request.dateRange.end);

            if (request.filters?.employeeId) {
              attendanceQuery = attendanceQuery.eq('employee_id', request.filters.employeeId);
            }

            const { data: attendanceData, error: attendanceError } = await attendanceQuery;
            if (attendanceError) throw attendanceError;
            data = attendanceData || [];
            break;

          case 'leave':
            reportName = `Leave Report ${request.dateRange.start} to ${request.dateRange.end}`;
            
            let leaveQuery = supabase
              .from('leave_requests')
              .select(`
                start_date, end_date, type, status, calculated_days, reason,
                employees!inner(first_name, last_name, department)
              `)
              .gte('start_date', request.dateRange.start)
              .lte('end_date', request.dateRange.end);

            if (request.filters?.status) {
              leaveQuery = leaveQuery.eq('status', request.filters.status);
            }

            const { data: leaveData, error: leaveError } = await leaveQuery;
            if (leaveError) throw leaveError;
            data = leaveData || [];
            break;

          case 'performance':
            reportName = `Performance Report ${request.dateRange.start} to ${request.dateRange.end}`;
            
            const { data: performanceData, error: performanceError } = await supabase
              .from('performance_reviews')
              .select(`
                period, overall_rating, status, completed_date,
                employees!inner(first_name, last_name, department, position)
              `)
              .gte('created_date', request.dateRange.start)
              .lte('created_date', request.dateRange.end);

            if (performanceError) throw performanceError;
            data = performanceData || [];
            break;

          case 'department':
            reportName = `Department Report ${request.dateRange.start} to ${request.dateRange.end}`;
            
            const { data: departmentData, error: departmentError } = await supabase
              .from('departments')
              .select(`
                name, manager, employee_count, budget,
                employees!inner(first_name, last_name, position, status)
              `);

            if (departmentError) throw departmentError;
            data = departmentData || [];
            break;
        }

        // Generate report content based on format
        let reportContent = '';
        let contentType = '';

        switch (request.format) {
          case 'csv':
            contentType = 'text/csv';
            if (data.length > 0) {
              const headers = Object.keys(data[0]).join(',');
              const rows = data.map(row => 
                Object.values(row).map(value => 
                  typeof value === 'object' ? JSON.stringify(value) : value
                ).join(',')
              ).join('\n');
              reportContent = `${headers}\n${rows}`;
            }
            break;

          case 'excel':
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            // For now, fallback to CSV format (in production, use a proper Excel library)
            if (data.length > 0) {
              const headers = Object.keys(data[0]).join('\t');
              const rows = data.map(row => 
                Object.values(row).map(value => 
                  typeof value === 'object' ? JSON.stringify(value) : value
                ).join('\t')
              ).join('\n');
              reportContent = `${headers}\n${rows}`;
            }
            break;

          case 'pdf':
            contentType = 'application/pdf';
            // For now, generate a simple text report (in production, use a PDF library)
            reportContent = `
              ${reportName}
              Generated on: ${new Date().toLocaleString()}
              
              Summary:
              - Total Records: ${data.length}
              - Date Range: ${request.dateRange.start} to ${request.dateRange.end}
              
              Data:
              ${JSON.stringify(data, null, 2)}
            `;
            break;
        }

        // Save report to database
        const { data: savedReport, error: saveError } = await supabase
          .from('reports')
          .insert({
            name: reportName,
            type: request.type,
            format: request.format,
            generated_by: 'system', // In production, use actual user ID
            url: null // Would be populated with actual file URL in production
          })
          .select()
          .single();

        if (saveError) {
          console.error('Error saving report:', saveError);
        }

        // Handle delivery
        if (request.deliveryMethod === 'email' && request.recipientEmail) {
          // In production, integrate with email service
          console.log(`Would send report to: ${request.recipientEmail}`);
        }

        return new Response(JSON.stringify({
          success: true,
          reportId: savedReport?.id,
          reportName,
          recordCount: data.length,
          downloadUrl: request.deliveryMethod === 'download' ? 'data:' + contentType + ';base64,' + btoa(reportContent) : null
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'schedule_report':
        const { reportConfig, schedule } = reportData;
        
        // In production, this would integrate with a job scheduler
        console.log('Scheduling report:', { reportConfig, schedule });

        return new Response(JSON.stringify({
          success: true,
          message: 'Report scheduled successfully',
          nextRun: schedule.nextRun
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'list_reports':
        const { data: reports, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .order('generated_date', { ascending: false })
          .limit(50);

        if (reportsError) throw reportsError;

        return new Response(JSON.stringify({
          success: true,
          reports: reports || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in report generator:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});