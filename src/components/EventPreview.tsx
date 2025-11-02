import React, { useEffect, useState } from "react";
import { Bell, Calendar, Edit, Mail, MoreVertical, Trash2, X } from "lucide-react";

interface Event {
  title: string;
  startTime?: string | Date;
  end?: string | Date;
  reminder?: string;
  organizer?: string;
  description?: string;
}

interface EventPreviewProps {
  event: Event;
  eventX: number;
  eventY: number;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EventPreview: React.FC<EventPreviewProps> = ({ 
  event, 
  eventX, 
  eventY, 
  onClose,
  onEdit,
  onDelete 
}) => {
  const [position, setPosition] = useState<"left" | "right">("right");

  // Detect position to flip popup if near screen edge
  useEffect(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth - eventX < 400) {
      setPosition("left");
    } else {
      setPosition("right");
    }
  }, [eventX]);

  // Safe Date Formatting - Google Calendar style
  const formatDate = (date?: string | Date) => {
    if (!date) return "No date";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(parsed);
  };

  // Safe Time Formatting - 12 hour format
  const formatTime = (date?: string | Date) => {
    if (!date) return "";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "";
    return parsed.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    }).toLowerCase();
  };

  const startTimeFormatted = formatTime(event.startTime);
  const endTimeFormatted = formatTime(event.end);

  return (
    <div
      className={`fixed z-[9999] bg-white shadow-2xl rounded-lg border border-gray-300 transition-all duration-200`}
      style={{ 
        left: position === "left" ? eventX - 400 - 10 : eventX,
        top: eventY - 20,
        width: '400px'
      }}
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-b border-gray-200">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Edit"
          >
            <Edit size={20} className="text-gray-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Delete"
          >
            <Trash2 size={20} className="text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Send email"
          >
            <Mail size={20} className="text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="More options"
          >
            <MoreVertical size={20} className="text-gray-600" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Color Badge & Title */}
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-blue-600 rounded-sm mt-1.5 flex-shrink-0"></div>
          <h2 className="text-2xl font-normal text-gray-900 break-words flex-1">
            {event.title || "Untitled Event"}
          </h2>
        </div>

        {/* Date & Time */}
        <div className="text-base text-gray-700">
          {formatDate(event.startTime)} · {startTimeFormatted} – {endTimeFormatted}
        </div>

        {/* Invite via link button */}
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span className="text-blue-600 font-medium text-sm">Invite via link</span>
        </button>

        {/* Reminder */}
        {event.reminder && (
          <div className="flex items-center gap-3 text-gray-700">
            <Bell size={20} className="text-gray-600 flex-shrink-0" />
            <span className="text-base">{event.reminder}</span>
          </div>
        )}

        {/* Organizer */}
        {event.organizer && (
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar size={20} className="text-gray-600 flex-shrink-0" />
            <span className="text-base">{event.organizer}</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="pt-2 text-base text-gray-700 whitespace-pre-wrap">
            {event.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPreview;