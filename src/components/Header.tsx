"use client";

import { 
  Menu, 
  Search, 
  HelpCircle, 
  Settings, 
  Calendar as CalendarIcon, 
  Check, 
  Grid3x3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCalendarContext } from "@/context/Calendarcontext";
import { format, startOfWeek, addDays } from "date-fns";
import { useSession, signOut } from "next-auth/react";

export default function Header({
  onCreateClick,
  onMenuClick,
  view,
  setView,
}: {
  onCreateClick: () => void;
  onMenuClick: () => void;
  view: string;
  setView: (view: string) => void;
}) {
  const { data: session } = useSession();
  const [showSearch, setShowSearch] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { currentDate, resetToday, nextMonth, prevMonth, nextWeek, prevWeek, nextDay, prevDay } =
    useCalendarContext();

  // Dynamic date display based on view
  const getDisplayDate = () => {
    if (view === "Month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "Week") {
      const start = startOfWeek(currentDate);
      const end = addDays(start, 6);
      return `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`;
    } else {
      return format(currentDate, "EEEE, MMMM d, yyyy");
    }
  };

  const handlePrev = () => {
    if (view === "Month") prevMonth();
    else if (view === "Week") prevWeek();
    else prevDay();
  };

  const handleNext = () => {
    if (view === "Month") nextMonth();
    else if (view === "Week") nextWeek();
    else nextDay();
  };

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-2 h-16 relative">
      {!showSearch && (
        <>
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              aria-label="Toggle sidebar"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <img
                src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_1_2x.png"
                alt="Calendar"
                className="w-10 h-10"
              />
              <h1 className="text-xl text-gray-700">Calendar</h1>
            </div>
          </div>

          {/* Middle section - navigation */}
          <div className="flex items-center gap-3 ml-8">
            <button
              onClick={resetToday}
              className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>
            <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>
            <h2 className="text-xl text-gray-700 font-normal min-w-[200px]">{getDisplayDate()}</h2>
          </div>
        </>
      )}

      {/* Right section - tools */}
      <div className="flex items-center gap-2 flex-1 max-w-[1200px] justify-end">
        {/* Search Bar */}
        {showSearch ? (
          <div className="absolute inset-0 bg-white px-4 flex items-center">
            <div className="flex items-center gap-4 text-gray-600">
              <button 
                onClick={() => setShowSearch(false)}
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-xl font-medium">Search</span>
            </div>
            <div className="mx-auto max-w-[720px] flex-1 flex items-center gap-10 bg-white px-6 py-3 rounded-full border border-gray-300 shadow-sm">
              <Search className="w-5 h-5 text-gray-600" />
              <input
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in calendar"
                className="bg-transparent outline-none flex-1 text-base"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <button onClick={() => setShowSearch(true)} className="p-2 rounded-full hover:bg-gray-100">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Other icons (only when search not open) */}
        {!showSearch && (
          <>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {/* View menu */}
            <div className="relative">
              <button
                onClick={() => setShowViewMenu(!showViewMenu)}
                className="px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                {view}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showViewMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      setView("Day");
                      setShowViewMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Day
                  </button>
                  <button
                    onClick={() => {
                      setView("Week");
                      setShowViewMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Week
                  </button>
                  <button
                    onClick={() => {
                      setView("Month");
                      setShowViewMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Month
                  </button>
                </div>
              )}
            </div>

            <button className="p-2 rounded-full hover:bg-gray-100">
              <CalendarIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Check className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Grid3x3 className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative ml-2">
              {session?.user?.image ? (
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || "User"} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ) : (
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm"
                >
                  {session?.user?.email?.[0]?.toUpperCase() || "U"}
                </button>
              )}

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                    <p className="text-sm text-gray-500">{session?.user?.email}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
