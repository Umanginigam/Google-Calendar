"use client";
import { useCalendarContext } from "@/context/Calendarcontext";
import useEvents from "@/hooks/useEvents";
import EventModal from "./EventModel";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { nanoid } from "nanoid";
import EventPreview from "./EventPreview";

export default function CalendarGrid({ 
  view, 
  selectedZone 
}: { 
  view: string; 
  selectedZone: string 
}) {
  const { currentDate } = useCalendarContext();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [previewCoords, setPreviewCoords] = useState<{ x: number; y: number } | null>(null);
  
  const timeColRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Sync scroll between time column and grid
  useEffect(() => {
    const timeCol = timeColRef.current;
    const grid = gridRef.current;
    
    if (!timeCol || !grid) return;

    const handleGridScroll = () => {
      timeCol.scrollTop = grid.scrollTop;
    };

    grid.addEventListener('scroll', handleGridScroll);
    return () => grid.removeEventListener('scroll', handleGridScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const timeZones = [
    { label: "GMT+05:30 (India)", offset: 5.5, display: "GMT+05:30" },
    { label: "GMT+00:00 (London)", offset: 0, display: "GMT+00:00" },
    { label: "GMT-05:00 (New York)", offset: -5, display: "GMT-05:00" },
    { label: "GMT+09:00 (Tokyo)", offset: 9, display: "GMT+09:00" },
    { label: "GMT+08:00 (Singapore)", offset: 8, display: "GMT+08:00" },
  ];

  const selectedTZ = timeZones.find((tz) => tz.label === selectedZone);
  const selectedOffset = selectedTZ?.offset || 5.5;
  const timezoneDisplay = selectedTZ?.display || "GMT+05:30";

  const hours = useMemo(() => {
    const slots: { label: string; hour: number }[] = [];
    for (let i = 0; i < 24; i++) {
      if (i === 0) {
        slots.push({ label: '12 AM', hour: 0 });
      } else if (i < 12) {
        slots.push({ label: `${i} AM`, hour: i });
      } else if (i === 12) {
        slots.push({ label: '12 PM', hour: 12 });
      } else {
        slots.push({ label: `${i - 12} PM`, hour: i });
      }
    }
    return slots;
  }, []);

  const startDate = startOfWeek(currentDate);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) days.push(addDays(startDate, i));

  // Filter out events with invalid/empty times OR handle them properly
  const invalidEvents = events.filter(e => 
    !e.startTime || !e.endTime || e.startTime === "" || e.endTime === ""
  );
  
  const validEvents = events.filter(e => {
    // Keep events that have valid start and end times
    if (e.startTime && e.endTime && e.startTime !== "" && e.endTime !== "") {
      return true;
    }
    return false; // Hide events without proper times
  });

  // Function to delete all invalid events
  const handleDeleteInvalidEvents = async () => {
    if (window.confirm(`Delete ${invalidEvents.length} event(s) with invalid times?`)) {
      for (const event of invalidEvents) {
        if (event._id) {
          await deleteEvent(event._id);
        }
      }
    }
  };

  // Calculate event position and height based on time range
  const getEventStyle = (startTime: string, endTime: string) => {
    // Default values if times are empty
    if (!startTime || startTime === "") startTime = "00:00";
    if (!endTime || endTime === "") endTime = "01:00";
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    // Validate numbers
    if (isNaN(startHour) || isNaN(endHour)) {
      return { top: 0, height: 48 };
    }
    
    const hourHeight = 48; // Each hour is 48px
    const startPosition = (startHour * hourHeight) + ((startMin || 0) / 60 * hourHeight);
    const endPosition = (endHour * hourHeight) + ((endMin || 0) / 60 * hourHeight);
    const height = endPosition - startPosition;
    
    return {
      top: startPosition,
      height: Math.max(height, 24) // Minimum height of 24px
    };
  };

  const getCurrentTimePosition = (day: Date) => {
    if (!isToday(day)) return null;
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() / 60;
    const adjustedHour = now.getHours() + (selectedOffset - (-utcOffset));
    const adjustedMinutes = now.getMinutes();
    const hourHeight = 48;
    const topPosition = (adjustedHour * hourHeight) + (adjustedMinutes / 60 * hourHeight);
    return topPosition;
  };

  const handleDateClick = (date: Date, hour?: number) => {
    setSelectedDate(format(date, "yyyy-MM-dd"));
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Event clicked:", event);
    console.log("Event ID:", event._id);
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.right + 10;
    const y = rect.top;

    // Store full event object and ensure we have all fields
    const fullEvent = {
      _id: event._id,  // This should come from MongoDB
      title: event.title || '',
      description: event.description || '',
      date: event.date,
      startTime: event.startTime || '',
      endTime: event.endTime || ''
    };
    
    if (!fullEvent._id) {
      console.error('Warning: Event is missing _id:', fullEvent);
    }
    
    console.log("Full event data:", fullEvent);

    setSelectedEvent(fullEvent);
    setSelectedDate(event.date);
    setPreviewCoords({ x, y });
    setShowPreview(true);
  };

  const handleEditFromPreview = () => {
    setShowPreview(false);
    setShowModal(true);
  };

  const handleDeleteFromPreview = async () => {
    try {
      console.log("Selected event for deletion:", selectedEvent);
      
      if (!selectedEvent) {
        console.error('No event selected for deletion');
        return;
      }
      
      if (!selectedEvent._id) {
        console.error('Event has no _id:', selectedEvent);
        return;
      }

      if (window.confirm('Are you sure you want to delete this event?')) {
        console.log("Attempting to delete event with ID:", selectedEvent._id);
        await deleteEvent(selectedEvent._id);
        console.log("Event deleted successfully");
        setShowPreview(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleAdd = async (data: { 
    title: string; 
    description: string; 
    startTime: string; 
    endTime: string 
  }) => {
    if (selectedDate) {
      try {
        await addEvent({ date: selectedDate, ...data }); // Remove _id: nanoid(), let MongoDB handle it
        console.log("Event added successfully");
      } catch (error) {
        console.error("Failed to add event:", error);
      }
    }
    setShowModal(false);
  };

  const handleUpdate = (data: { 
    title: string; 
    description: string; 
    startTime: string; 
    endTime: string 
  }) => {
    if (selectedEvent?._id) {
      updateEvent(selectedEvent._id, data);
    }
    setShowModal(false);
    setShowPreview(false);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    deleteEvent(id);
    setShowModal(false);
    setShowPreview(false);
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-white h-full">
      {/* Main Container */}
      <div className="flex flex-1 relative bg-white h-full overflow-hidden rounded-3xl">
        
        {/* Time Column - Synced Scroll */}
        <div className="w-[80px] border-r border-gray-200 bg-white flex-shrink-0 flex flex-col h-full">
          {/* Fixed Timezone Header */}
          <div className="h-[88px] flex items-start justify-start pt-3 px-3 border-b bg-white flex-shrink-0 sticky top-0 z-30 ">
            <span className="text-[11px] font-medium text-gray-700">
              {timezoneDisplay}
            </span>
          </div>
          
          {/* Scrollable Hours - Hidden scrollbar, synced with grid */}
          <div 
            ref={timeColRef}
            className="flex-1 overflow-y-auto overflow-x-hidden
              [&::-webkit-scrollbar]:w-0">
            {hours.map((slot, i) => (
              <div key={i} className="h-12 relative flex-shrink-0">
                <div className="absolute -top-2 right-3 text-[11px] text-gray-600">
                  {slot.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Calendar Grid */}
        <div 
          ref={gridRef}
          className="flex-1 overflow-y-auto overflow-x-hidden relative bg-white h-full rounded-r-3xl
            [&::-webkit-scrollbar]:w-[14px] 
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full 
            [&::-webkit-scrollbar-track]:bg-gray-100
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
            [&::-webkit-scrollbar-thumb]:border-2
            [&::-webkit-scrollbar-thumb]:border-solid
            [&::-webkit-scrollbar-thumb]:border-white">
          
          {/* Header with Day Names and Dates - Sticky */}
          <div className="grid grid-cols-7 border-b sticky top-0 z-30 bg-white">
            {days.map((day, i) => {
              const today = isToday(day);
              return (
                <div key={i} className=" text-center py-3 h-[88px] flex flex-col items-center justify-center">
                  <div className="text-[11px] font-medium text-gray-600 mb-2 tracking-wide">
                    {format(day, "EEE").toUpperCase()}
                  </div>
                  <div 
                    className={`text-[26px] w-12 h-12 flex items-center justify-center rounded-full font-light
                      ${today ? "bg-blue-600 text-white" : "text-gray-800"}`}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid Container */}
          <div className="relative" style={{ height: `${hours.length * 48}px` }}>
            {/* Hour Grid Lines */}
            <div className="grid grid-cols-7 absolute inset-0">
              {hours.map((slot, hourIdx) => (
                <React.Fragment key={hourIdx}>
                  {days.map((day, dayIdx) => (
                    <div
                      key={`${hourIdx}-${dayIdx}`}
                      onClick={() => handleDateClick(day, hourIdx)}
                      className="border-t border-l border-gray-200 h-12 hover:bg-gray-50 cursor-pointer transition-colors "
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>

            {/* Events Layer - Absolute Positioning Over Grid */}
            {days.map((day, dayIdx) => {
              const dayStr = format(day, "yyyy-MM-dd");
              const dayEvents = validEvents.filter(e => e.date === dayStr);
              const timePosition = getCurrentTimePosition(day);
              
              return (
                <div
                  key={`events-${dayIdx}`}
                  className="absolute top-0"
                  style={{
                    left: `${(100 / 7) * dayIdx}%`,
                    width: `${100 / 7}%`,
                    height: '100%',
                    pointerEvents: 'none'
                  }}
                >
                  {/* Events */}
                  {dayEvents.map((event) => {
                    const style = getEventStyle(event.startTime || '', event.endTime || '');
                    
                    // Debug log for event positioning
                    console.log(`Event "${event.title}":`, {
                      startTime: event.startTime,
                      endTime: event.endTime,
                      calculatedStyle: style
                    });
                    
                    return (
                      <div
                        key={event._id ?? (event as any).id ?? `${dayStr}-${event.startTime}-${event.title}`}
                        onClick={(e) => handleEventClick(event, e)}
                        className="absolute bg-blue-600 text-white text-[11px] px-2 py-1 rounded-3xl cursor-pointer hover:bg-blue-700 transition-colors overflow-hidden shadow-md"
                        style={{
                          top: `${style.top}px`,
                          height: `${style.height}px`,
                          left: '8px',
                          right: '8px',
                          pointerEvents: 'auto',
                          zIndex: 15
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        {style.height > 30 && event.startTime && event.startTime !== "" && (
                          <div className="text-[10px] opacity-90 truncate">
                            {event.startTime}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Red Line (Current Time Indicator) */}
                  {timePosition !== null && (
                    <div 
                      className="absolute left-0 right-0"
                      style={{ 
                        top: `${timePosition}px`,
                        pointerEvents: 'none',
                        zIndex: 20
                      }}
                    >
                      <div className="relative w-full h-[2px] bg-red-500">
                        <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedEvent && previewCoords && (
        <EventPreview
          event={{
            title: selectedEvent.title || "Untitled Event",
            startTime: selectedEvent.startTime && selectedEvent.startTime !== "" 
              ? `${selectedEvent.date}T${selectedEvent.startTime}:00` 
              : `${selectedEvent.date}T00:00:00`,
            end: selectedEvent.endTime && selectedEvent.endTime !== ""
              ? `${selectedEvent.date}T${selectedEvent.endTime}:00`
              : `${selectedEvent.date}T01:00:00`,
            description: selectedEvent.description || "",
            organizer: "Umangi Nigam",
            reminder: "30 minutes before"
          }}
          eventX={previewCoords.x}
          eventY={previewCoords.y}
          onClose={() => {
            console.log("Closing preview");
            setShowPreview(false);
          }}
          onEdit={handleEditFromPreview}
          onDelete={handleDeleteFromPreview}
        />
      )}

      {/* Add/Edit Event Modal */}
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