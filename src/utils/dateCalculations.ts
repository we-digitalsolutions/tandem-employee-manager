
import { Holiday } from '@/types';

// Mock holidays data
export const holidays: Holiday[] = [
  {
    id: '1',
    name: 'New Year\'s Day',
    date: '2025-01-01',
    type: 'national',
    recurring: true
  },
  {
    id: '2',
    name: 'Labor Day',
    date: '2025-05-01',
    type: 'national',
    recurring: true
  },
  {
    id: '3',
    name: 'Independence Day',
    date: '2025-07-04',
    type: 'national',
    recurring: true
  },
  {
    id: '4',
    name: 'Christmas Day',
    date: '2025-12-25',
    type: 'national',
    recurring: true
  },
  {
    id: '5',
    name: 'Company Founding Day',
    date: '2025-03-15',
    type: 'company',
    recurring: true
  }
];

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0; // Sunday only
};

export const isHoliday = (date: Date, holidayList: Holiday[] = holidays): boolean => {
  const dateString = date.toISOString().split('T')[0];
  return holidayList.some(holiday => holiday.date === dateString);
};

export const isWorkingDay = (date: Date, holidayList: Holiday[] = holidays): boolean => {
  return !isWeekend(date) && !isHoliday(date, holidayList);
};

export const calculateWorkingDays = (
  startDate: string, 
  endDate: string, 
  holidayList: Holiday[] = holidays
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let workingDays = 0;
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    if (isWorkingDay(currentDate, holidayList)) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return workingDays;
};

export const getNextWorkingDay = (date: Date, holidayList: Holiday[] = holidays): Date => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (!isWorkingDay(nextDay, holidayList)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
};

export const getHolidaysBetweenDates = (
  startDate: string, 
  endDate: string, 
  holidayList: Holiday[] = holidays
): Holiday[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return holidayList.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= start && holidayDate <= end;
  });
};
