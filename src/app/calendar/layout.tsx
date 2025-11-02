'use client';

import { CalendarProvider } from "@/context/Calendarcontext";
import { EventProvider } from "@/context/EventContext";
import useCalendar from "@/hooks/usecalender";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const calendar = useCalendar();

  return (
    <CalendarProvider value={calendar}>
      <EventProvider>
        {children}
      </EventProvider>
    </CalendarProvider>
  );
}
