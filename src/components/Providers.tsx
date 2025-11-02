"use client";

import { SessionProvider } from "next-auth/react";
import { EventProvider } from "@/context/EventContext"; // adjust path

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <EventProvider>{children}</EventProvider>
    </SessionProvider>
  );
}
