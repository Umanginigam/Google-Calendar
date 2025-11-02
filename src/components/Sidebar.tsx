"use client";

import { useEffect, useRef, useState } from "react";
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, isToday, isSameMonth } from "date-fns";
import { useCalendarContext } from "@/context/Calendarcontext";
import { useEventPopup } from "@/context/EventContext";

export default function Sidebar({
  open,
  setOpen,
  onDateSelect,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDateSelect?: (d: Date) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isCalendarsOpen, setIsCalendarsOpen] = useState(true);
  const { currentDate, setCurrentDate, nextMonth, prevMonth } = useCalendarContext();
  const { openEventPopup } = useEventPopup();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [setOpen]);

  // Generate mini month days
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
    if (onDateSelect) onDateSelect(date);
    else setCurrentDate(date); // updates global state
  };

  return (
    <div ref={ref} className="flex flex-col h-full p-6 bg-white border-r w-[300px]">
      <div className="overflow-y-auto h-full">
        {/* Create button */}
        <div className="mb-4 relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <span className="text-2xl">+</span>
            <span className="font-medium">Create</span>
            <svg
              className="ml-2 w-4 h-4 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M8 9l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
              <ul className="flex flex-col">
                <li>
                  <button 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      openEventPopup(rect.right + 10, rect.top);
                      setOpen(false);
                    }} 
                    className="w-full text-left px-4 py-3 hover:bg-gray-50"
                  >
                    Event
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50">Task</button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50">Appointment Schedule</button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Event creation moved to calendar area */}

        {/* Mini month calendar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="px-2 py-1 rounded-md hover:bg-gray-100"
            >
              ◀
            </button>
            <h3 className="text-lg font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h3>
            <button
              onClick={nextMonth}
              className="px-2 py-1 rounded-md hover:bg-gray-100"
            >
              ▶
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d} className="text-center font-medium">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {days.map((day, i) => {
              const isCurrent = isSameMonth(day, currentDate);
              const today = isToday(day);
              const isSelected =
                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd");

              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(day)}
                  className={`h-6 w-6 flex items-center justify-center rounded-full cursor-pointer transition text-[11px]
                    ${
                      isSelected
                        ? "bg-blue-600 text-white font-semibold"
                        : today
                        ? "border border-blue-400 text-blue-700"
                        : isCurrent
                        ? "text-gray-800 hover:bg-gray-100"
                        : "text-gray-400"
                    }`}
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </div>
        </div>

        {/* Search pill */}
        <div className="mb-6">
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-lg">
            <svg
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-gray-600">Search for people</span>
          </div>
        </div>

        {/* Sections (Booking pages, My calendars, etc.) */}
        <div className="space-y-6">
          {/* Booking pages */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold">Booking pages</h4>
              <button className="text-2xl">+</button>
            </div>
          </div>

          {/* My calendars */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold">My calendars</h4>
              <button 
                onClick={() => setIsCalendarsOpen(!isCalendarsOpen)}
                className="text-xl transform transition-transform duration-200"
                style={{ transform: isCalendarsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ⌄
              </button>
            </div>

            {isCalendarsOpen && (
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center text-white">✓</span>
                  <span>Umangi Nigam</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center text-white">✓</span>
                  <span>Birthdays</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 border-2 border-blue-400 rounded-sm" />
                  <span>Tasks</span>
                </li>
              </ul>
            )}
          </div>

          {/* Other calendars */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold">Other calendars</h4>
              <button className="text-2xl">+</button>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-green-800 rounded-sm flex items-center justify-center text-white">✓</span>
                <span>Holidays in India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-auto text-sm text-gray-400 pt-6">Terms – Privacy</div>
      </div>
    </div>
  );
}
