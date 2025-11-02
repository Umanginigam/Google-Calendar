"use client";

import { useState } from "react";
import { X, Clock, Users, MapPin, Video, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  selectedDate: string;
  onClose: () => void;
  onSave: (data: { title: string; description: string; startTime: string; endTime: string }) => void;
  embedded?: boolean;

  // 🔹 New Props for Editing Mode
  existingEvent?: {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  };
  onDelete?: (id: string) => void;
}

export default function EventModal({ selectedDate, onClose, onSave, embedded = false, existingEvent, onDelete }: Props) {
  const [tab, setTab] = useState<"event" | "task" | "schedule">("event");
  const [title, setTitle] = useState(existingEvent?.title || "");
  const [description, setDescription] = useState(existingEvent?.description || "");
  const [startTime, setStartTime] = useState(existingEvent?.startTime || "");
  const [endTime, setEndTime] = useState(existingEvent?.endTime || "");
  const router = useRouter();

  const handleSave = () => {
  if (!title) return;
  onSave({
    title,
    description,
    startTime,
    endTime,
  });
  onClose();
};


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[640px] rounded-2xl shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X className="w-6 h-6" />
        </button>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add title"
          className="w-full border-b-2 border-blue-600 pb-2 text-2xl font-medium mb-4 focus:outline-none"
        />

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => (embedded ? router.push('/create/event') : setTab("event"))}
            className={`px-3 py-2 rounded-md ${tab === "event" ? "bg-blue-100" : ""}`}
          >
            Event
          </button>
          <button
            onClick={() => (embedded ? router.push('/create/task') : setTab("task"))}
            className={`px-3 py-2 rounded-md ${tab === "task" ? "bg-blue-100" : ""}`}
          >
            Task
          </button>
          <button
            onClick={() => (embedded ? router.push('/create/schedule') : setTab("schedule"))}
            className={`px-3 py-2 rounded-md ${tab === "schedule" ? "bg-blue-100" : ""}`}
          >
            Appointment schedule
          </button>
        </div>

        {/* Date/time row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <div className="text-sm">{selectedDate}</div>
              <div className="text-xs text-gray-500">Time zone · Does not repeat</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-transparent"
            />
            <span>-</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-transparent"
            />
          </div>
        </div>

        {/* Options list - change per tab */}
        <div className="space-y-4">
          {tab === "event" && (
            <>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-600" />
                <div className="text-sm text-gray-700">Add guests</div>
              </div>

              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-gray-600" />
                <div className="text-sm text-gray-700">Add Google Meet video conferencing</div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div className="text-sm text-gray-700">Add location</div>
              </div>

              <div>
                <textarea
                  placeholder="Add description or a Google Drive attachment"
                  className="w-full border rounded-md p-3 text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {existingEvent && onDelete && (
                    <button
                      onClick={() => {
                        onDelete(existingEvent._id);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1 rounded"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                  <div className="text-sm">Umangi Nigam</div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="text-sm text-blue-600">More options</button>
                  <button onClick={handleSave} className="bg-blue-600 text-white px-5 py-2 rounded-full">
                    {existingEvent ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "task" && (
            <>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <div className="text-sm text-gray-700">Add deadline</div>
              </div>

              <div>
                <textarea
                  placeholder="Add description"
                  className="w-full border rounded-md p-3 text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {existingEvent && onDelete && (
                    <button
                      onClick={() => {
                        onDelete(existingEvent._id);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1 rounded"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                  <div className="text-sm">My Tasks</div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-sm text-blue-600">More options</button>
                  <button onClick={handleSave} className="bg-blue-600 text-white px-5 py-2 rounded-full">
                    {existingEvent ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "schedule" && (
            <>
              <div className="p-4 border rounded-md bg-gray-50 text-sm">
                Create a booking page you can share with others so they can book time with you themselves
                <div className="mt-2 flex gap-4">
                  <button className="text-blue-600 text-sm">See how it works</button>
                  <button className="text-blue-600 text-sm">Learn more</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    <div className="text-sm">Umangi Nigam</div>
  </div>

  <div className="flex items-center gap-3">
   {existingEvent && onDelete && (
  <button
    onClick={() => {
      onDelete(existingEvent._id);
      onClose();
    }}
    className="flex items-center gap-1 text-sm text-red-600 mr-4 hover:text-red-700"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4h6v3m-8 4h10l-1 10H8L7 11z" />
    </svg>
    Delete
  </button>
)}


    <button className="text-sm text-blue-600">More options</button>
    <button
      onClick={handleSave}
      className="bg-blue-600 text-white px-5 py-2 rounded-full"
    >
      {existingEvent ? "Update" : "Save"}
    </button>
  </div>
</div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
