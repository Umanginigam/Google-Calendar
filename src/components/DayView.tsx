"use client";
import { useCalendarContext } from "@/context/Calendarcontext";
import useEvents from "@/hooks/useEvents";
import EventModal from "./EventModel";
import EventPreview from "./EventPreview";
import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { nanoid } from "nanoid";

export default function DayView({ selectedZone }: { selectedZone: string }) {
  const { currentDate } = useCalendarContext();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });

  const hours = useMemo(() => {
    const slots: string[] = [];
    slots.push('12:00 AM');
    for (let i = 1; i <= 11; i++) {
      slots.push(`${i}:00 AM`);
    }
    slots.push('12:00 PM');
    for (let i = 1; i <= 11; i++) {
      slots.push(`${i}:00 PM`);
    }
    return slots;
  }, []);

  const dayStr = format(currentDate, "yyyy-MM-dd");
  const today = format(new Date(), "yyyy-MM-dd") === dayStr;

  const handleTimeSlotClick = () => {
    setSelectedDate(dayStr);
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
    <div className="flex flex-1 overflow-hidden">
      {/* Time Column */}
      <div className="flex flex-col w-[60px] border-r bg-white">
        <div className="h-[60px] border-b flex items-center justify-center text-[10px] font-medium text-gray-500">
          GMT+5:30
        </div>
        {hours.map((hour, i) => (
          <div key={i} className="h-[48px] -mt-[9px] relative">
            <div className="absolute right-2 top-0 text-[10px] text-gray-500">
              {hour.replace(':00', '')}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-white sticky top-0 z-10">
          <div className="text-center py-2">
            <div className="text-xs text-gray-500 mb-1">
              {format(currentDate, "EEE").toUpperCase()}
            </div>
            <div className={`text-2xl font-light mx-auto w-10 h-10 flex items-center justify-center rounded-full
              ${today ? "bg-blue-600 text-white" : "text-gray-700"}`}>
              {format(currentDate, "d")}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="relative">
          {hours.map((_, hourIdx) => {
            const hourEvents = events.filter(e => 
              e.date === dayStr && 
              e.startTime && 
              parseInt(e.startTime.split(':')[0]) === hourIdx
            );
            
            return (
              <div
                key={hourIdx}
                onClick={handleTimeSlotClick}
                className="border-t h-[48px] relative hover:bg-blue-50 cursor-pointer group"
              >
                <div className="absolute -top-[9px] left-0 right-0 h-[1px] bg-gray-200 group-hover:bg-gray-300"></div>
                {hourEvents.map((event) => (
                  <div
                    key={event._id}
                    onClick={(e) => handleEventClick(event, e)}
                    className="absolute inset-x-2 top-0 bg-blue-600 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
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