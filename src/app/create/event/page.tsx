"use client";

import EventModal from "@/components/EventModel";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Event</h1>
      <div className="max-w-2xl">
        {/* Reuse modal but render inline */}
        <EventModal
          embedded
          selectedDate={new Date().toISOString().slice(0, 10)}
          onClose={() => router.back()}
          onSave={(data) => {
            // TODO: integrate saving logic
            console.log("Saved event", data);
            router.back();
          }}
        />
      </div>
    </div>
  );
}
