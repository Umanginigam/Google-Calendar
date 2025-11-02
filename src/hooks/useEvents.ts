import { useEffect, useState } from "react";

export interface Event {
  _id?: string;
  date: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  reminder?: string;      // Add this
  organizer?: string;     // Add this
}
export default function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setLoading(false);
  };

  const addEvent = async (event: Event) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      const newEvent = await res.json();
      setEvents((prev) => [...prev, newEvent]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const updateEvent = async (id: string, payload: Partial<Event>) => {
    try {
      // FIX: Changed backticks to parentheses
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setEvents((prev) => prev.map((e) => (e._id === id ? updated : e)));
      return updated;
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      // FIX: Changed backticks to parentheses
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return { events, addEvent, deleteEvent, updateEvent, loading };
}