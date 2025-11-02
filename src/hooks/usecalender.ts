// // src/hooks/usecalender.ts
// import { useState } from "react";
// import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isToday, format } from "date-fns";

// export default function useCalendar() {
//   const [currentDate, setCurrentDate] = useState(new Date());

//   const monthStart = startOfMonth(currentDate);
//   const monthEnd = endOfMonth(currentDate);
//   const startDate = startOfWeek(monthStart);
//   const endDate = endOfWeek(monthEnd);

//   const days: Date[] = [];
//   let day = startDate;
//   while (day <= endDate) {
//     days.push(day);
//     day = addDays(day, 1);
//   }

//   const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
//   const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
//   const resetToday = () => setCurrentDate(new Date());
//   const monthYear = format(currentDate, "MMMM yyyy");

//   return {
//     days,
//     monthYear,
//     nextMonth,
//     prevMonth,
//   resetToday,
//   isSameMonth,
//   isToday,
//   currentDate,
//   setCurrentDate,
//   };
// }
"use client";
import { useState } from "react";
import { addMonths, addDays, format } from "date-fns";

export default function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  
  // ADD THESE NEW FUNCTIONS
  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const prevDay = () => setCurrentDate(addDays(currentDate, -1));
  
  const resetToday = () => setCurrentDate(new Date());
  
  const monthYear = format(currentDate, "MMMM yyyy");

  return {
    currentDate,
    setCurrentDate,
    nextMonth,
    prevMonth,
    nextWeek,
    prevWeek,
    nextDay,      // ADD THIS
    prevDay,      // ADD THIS
    resetToday,
    monthYear,
  };
}