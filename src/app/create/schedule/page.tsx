"use client";

import EventModal from "@/components/EventModel";
import { useRouter } from "next/navigation";

export default function CreateSchedulePage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Appointment Schedule</h1>
      <div className="max-w-2xl">
        <EventModal
          embedded
          selectedDate={new Date().toISOString().slice(0, 10)}
          onClose={() => router.back()}
          onSave={(data) => {
            console.log("Saved schedule", data);
            router.back();
          }}
        />
      </div>
    </div>
  );
}
