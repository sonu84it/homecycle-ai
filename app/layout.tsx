import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeCycle AI",
  description: "AI-powered home sustainability assistant for reuse, resale, repair, donation, and recycling."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
