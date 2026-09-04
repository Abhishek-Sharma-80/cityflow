import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CityFlow AI — Predict. Optimize. Move.",
  description: "Intelligent Urban Mobility & Logistics Decision-Support Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}