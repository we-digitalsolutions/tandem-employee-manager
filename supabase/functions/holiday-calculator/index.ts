import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeaveRequest {
  start_date: string;
  end_date: string;
  type: string;
  duration: string;
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

    const { startDate, endDate, duration } = await req.json();

    console.log('Calculating leave days for:', { startDate, endDate, duration });

    // Get holidays within the date range
    const { data: holidays, error: holidaysError } = await supabase
      .from('holidays')
      .select('date, type')
      .gte('date', startDate)
      .lte('date', endDate);

    if (holidaysError) {
      console.error('Error fetching holidays:', holidaysError);
      throw holidaysError;
    }

    // Calculate business days excluding weekends and holidays
    const start = new Date(startDate);
    const end = new Date(endDate);
    let businessDays = 0;
    let totalDays = 0;

    // Get holiday dates for quick lookup
    const holidayDates = new Set(holidays?.map(h => h.date) || []);

    const currentDate = new Date(start);
    while (currentDate <= end) {
      totalDays++;
      
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
      const isHoliday = holidayDates.has(currentDate.toISOString().split('T')[0]);

      if (!isWeekend && !isHoliday) {
        businessDays++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Apply duration multiplier
    let calculatedDays = businessDays;
    switch (duration) {
      case 'half-day-morning':
      case 'half-day-afternoon':
        calculatedDays = businessDays * 0.5;
        break;
      case 'quarter-day-1':
      case 'quarter-day-2':
      case 'quarter-day-3':
      case 'quarter-day-4':
        calculatedDays = businessDays * 0.25;
        break;
      default: // full-day
        calculatedDays = businessDays;
    }

    const result = {
      calculatedDays: Math.round(calculatedDays * 100) / 100, // Round to 2 decimal places
      totalDays,
      businessDays,
      weekendDays: totalDays - businessDays - (holidays?.length || 0),
      holidayDays: holidays?.length || 0,
      excludedHolidays: holidays || []
    };

    console.log('Holiday calculation result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in holiday calculator:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});