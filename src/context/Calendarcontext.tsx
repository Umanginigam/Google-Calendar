"use client";
import { createContext, useContext } from "react";

const CalendarContext = createContext<any>(null);

export function CalendarProvider({ value, children }: any) {
  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendarContext = () => useContext(CalendarContext);
