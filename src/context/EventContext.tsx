"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import EventPopup from '@/components/EventPopup'; // Adjust the path as needed

interface EventPopupState {
  isOpen: boolean;
  position: { x: number; y: number } | null;
}

interface EventContextType {
  eventPopup: EventPopupState;
  openEventPopup: (x: number, y: number) => void;
  closeEventPopup: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [eventPopup, setEventPopup] = useState<EventPopupState>({
    isOpen: false,
    position: null,
  });

  const openEventPopup = (x: number, y: number) => {
    setEventPopup({
      isOpen: true,
      position: { x, y },
    });
  };

  const closeEventPopup = () => {
    setEventPopup({
      isOpen: false,
      position: null,
    });
  };

  return (
    <EventContext.Provider value={{ eventPopup, openEventPopup, closeEventPopup }}>
      {children}
      {eventPopup.isOpen && eventPopup.position && (
        <div 
          className="fixed inset-0 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeEventPopup();
            }
          }}
        >
          <div 
            className="absolute"
            style={{ 
              left: eventPopup.position.x, 
              top: eventPopup.position.y 
            }}
          >
            <EventPopup
              onClose={closeEventPopup}
              onSave={(eventData) => {
                // Handle event save
                closeEventPopup();
              }}
            />
          </div>
        </div>
      )}
    </EventContext.Provider>
  );
}

export function useEventPopup() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventPopup must be used within an EventProvider');
  }
  return context;
}
