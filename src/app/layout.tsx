import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers"; // ✅ import client provider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Google Calendar Clone",
  description: "A high-fidelity clone of Google Calendar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* ✅ wraps with client context */}
      </body>
    </html>
  );
}
