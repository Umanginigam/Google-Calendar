"use client";

import { X } from "lucide-react";

interface EventPopupProps {
  onClose: () => void;
  onSave: (event: any) => void;
  position?: { x: number; y: number };
}

export default function EventPopup({ onClose, onSave, position }: EventPopupProps) {
  const style = position ? {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
  } as const : {};

  return (
    <div 
      className="bg-white rounded-lg shadow-xl w-[448px] relative z-50" 
      style={style}
    >
      <div className="p-6">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Create Event</h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Add title"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <input
              type="datetime-local"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="datetime-local"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              placeholder="Add description"
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({})}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
