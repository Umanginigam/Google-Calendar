"use client";
import { useCalendarContext } from "@/context/Calendarcontext";
import useEvents from "@/hooks/useEvents";
import EventModal from "./EventModel";
import EventPreview from "./EventPreview";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday } from "date-fns";
import { nanoid } from "nanoid";

export default function MonthView() {
  const { currentDate } = useCalendarContext();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(format(date, "yyyy-MM-dd"));
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(event.date);
    setShowPreview(true);
  };

  const handleAdd = (data: { title: string; description: string; startTime: string; endTime: string }) => {
    if (selectedDate) {
      addEvent({ _id: nanoid(), date: selectedDate, ...data });
    }
    setShowModal(false);
  };

  const handleUpdate = (data: { title: string; description: string; startTime: string; endTime: string }) => {
    if (selectedEvent?._id) {
      updateEvent(selectedEvent._id, data);
    }
    setShowModal(false);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    deleteEvent(id);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b bg-gray-50 sticky top-0 z-10">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-600 py-3 border-l">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 overflow-auto">
        {days.map((day, i) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayEvents = events.filter(e => e.date === dateStr);
          const isCurrent = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <div
              key={i}
              onClick={() => handleDayClick(day)}
              className="border-l border-t p-2 hover:bg-blue-50 cursor-pointer min-h-[120px]"
            >
              <div className={`text-sm mb-2 w-7 h-7 flex items-center justify-center rounded-full
                ${today ? 'bg-blue-600 text-white font-semibold' : 
                  isCurrent ? 'text-gray-800' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event._id ?? (event as any).id ?? `${dateStr}-${i}-${event.title}`}
                    onClick={(e) => handleEventClick(event, e)}
                    className="text-xs px-2 py-1 bg-blue-600 text-white rounded truncate cursor-pointer hover:bg-blue-700"
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-600 px-2 font-medium">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showPreview && selectedEvent && (
  <EventPreview
    event={selectedEvent}
    eventX={previewPosition.x}
    eventY={previewPosition.y}
    onClose={() => setShowPreview(false)}
    onEdit={() => {
      setShowPreview(false);
      setShowModal(true);
    }}
    onDelete={() => {
      handleDelete(selectedEvent?._id);
      setShowPreview(false);
    }}
  />
)}

      {showModal && (
        <EventModal
          selectedDate={selectedDate!}
          onClose={() => setShowModal(false)}
          onSave={selectedEvent ? handleUpdate : handleAdd}
          onDelete={handleDelete}
          existingEvent={selectedEvent}
        />
      )}
    </div>
  );
}