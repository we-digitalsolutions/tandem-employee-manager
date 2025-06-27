
import { Holiday } from '@/types';

// Mock holidays data - in real app, this would come from the HolidayCalendar component
const defaultHolidays: Holiday[] = [
  { id: '1', name: 'New Year\'s Day', date: '2025-01-01', type: 'national', recurring: true },
  { id: '2', name: 'Independence Day', date: '2025-03-20', type: 'national', recurring: true },
  { id: '3', name: 'Labor Day', date: '2025-05-01', type: 'national', recurring: true },
  { id: '4', name: 'Company Foundation Day', date: '2025-06-15', type: 'company', recurring: true },
];

export const calculateBusinessDays = (
  startDate: string, 
  endDate: string, 
  holidays: Holiday[] = defaultHolidays
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    return 0;
  }

  let businessDays = 0;
  const current = new Date(start);

  // Get holiday dates for the year
  const holidayDates = getHolidayDatesForYear(new Date().getFullYear(), holidays);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    const currentDateString = current.toISOString().split('T')[0];
    
    // Skip Sundays (0) and holidays
    if (dayOfWeek !== 0 && !holidayDates.includes(currentDateString)) {
      businessDays++;
    }
    
    current.setDate(current.getDate() + 1);
  }

  return businessDays;
};

export const calculateLeaveDays = (
  startDate: string,
  endDate: string,
  durationType: string,
  holidays: Holiday[] = defaultHolidays
): number => {
  const businessDays = calculateBusinessDays(startDate, endDate, holidays);
  
  // Apply duration multiplier
  switch (durationType) {
    case 'half-day-morning':
    case 'half-day-afternoon':
      return businessDays * 0.5;
    case 'quarter-day-1':
    case 'quarter-day-2':
    case 'quarter-day-3':
    case 'quarter-day-4':
      return businessDays * 0.25;
    case 'full-day':
    default:
      return businessDays;
  }
};

const getHolidayDatesForYear = (year: number, holidays: Holiday[]): string[] => {
  return holidays
    .filter(holiday => {
      if (holiday.recurring) {
        return true; // Include all recurring holidays
      } else {
        const holidayYear = new Date(holiday.date).getFullYear();
        return holidayYear === year;
      }
    })
    .map(holiday => {
      if (holiday.recurring) {
        // For recurring holidays, use the current year
        const holidayDate = new Date(holiday.date);
        holidayDate.setFullYear(year);
        return holidayDate.toISOString().split('T')[0];
      }
      return holiday.date;
    });
};

export const isWorkingDay = (date: string, holidays: Holiday[] = defaultHolidays): boolean => {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  
  // Check if it's Sunday
  if (dayOfWeek === 0) {
    return false;
  }
  
  // Check if it's a holiday
  const year = dateObj.getFullYear();
  const holidayDates = getHolidayDatesForYear(year, holidays);
  
  return !holidayDates.includes(date);
};

export const getNextWorkingDay = (date: string, holidays: Holiday[] = defaultHolidays): string => {
  const current = new Date(date);
  
  do {
    current.setDate(current.getDate() + 1);
  } while (!isWorkingDay(current.toISOString().split('T')[0], holidays));
  
  return current.toISOString().split('T')[0];
};

export const getPreviousWorkingDay = (date: string, holidays: Holiday[] = defaultHolidays): string => {
  const current = new Date(date);
  
  do {
    current.setDate(current.getDate() - 1);
  } while (!isWorkingDay(current.toISOString().split('T')[0], holidays));
  
  return current.toISOString().split('T')[0];
};

export const formatDuration = (durationType: string): string => {
  switch (durationType) {
    case 'full-day': return 'Full Day (8 hours)';
    case 'half-day-morning': return 'Half Day - Morning (4 hours)';
    case 'half-day-afternoon': return 'Half Day - Afternoon (4 hours)';
    case 'quarter-day-1': return '1st Quarter Day (2 hours)';
    case 'quarter-day-2': return '2nd Quarter Day (2 hours)';
    case 'quarter-day-3': return '3rd Quarter Day (2 hours)';
    case 'quarter-day-4': return '4th Quarter Day (2 hours)';
    default: return 'Full Day';
  }
};
