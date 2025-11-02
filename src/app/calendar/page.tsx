'use client';

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CalendarGrid from "@/components/Calendgrid";
import DayView from "@/components/DayView";
import MonthView from "@/components/MonthView";

export default function CalendarPage() {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedZone, setSelectedZone] = useState("GMT+05:30 (India)");
  const [view, setView] = useState("Week");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        onCreateClick={() => setOpen((v) => !v)}
        onMenuClick={() => setSidebarOpen((s) => !s)}
        view={view}
        setView={setView}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-14 h-[calc(100vh-56px)] w-64 bg-white transform transition-transform z-40 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-64"
          }`}
        >
          <Sidebar
            open={open}
            setOpen={setOpen}
            onDateSelect={(d: Date) => {}}
          />
        </div>

        {/* Calendar Content */}
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {/* Add padding and spacing around calendar */}
          <div className="p-6 pl-12 flex flex-col h-full">
            <div className="max-w-screen-2xl w-full mx-auto flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200 h-full">
              
              {/* Timezone Selector */}
              <div className="flex items-center justify-start gap-3 px-6 py-4 border-b bg-white">
                <label className="text-sm font-medium text-gray-700">Time Zone:</label>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                >
                  {[
                    "GMT+05:30 (India)",
                    "GMT+00:00 (London)",
                    "GMT-05:00 (New York)",
                    "GMT+09:00 (Tokyo)",
                    "GMT+08:00 (Singapore)",
                  ].map((tz) => (
                    <option key={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              {/* Conditional View Rendering */}
              <main className="flex-1 overflow-hidden">
                <div className="h-full">
                  {view === 'Week' && <CalendarGrid view="week" selectedZone={selectedZone} />}
                  {view === 'Day' && <DayView selectedZone={selectedZone} />}
                  {view === 'Month' && <MonthView />}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
