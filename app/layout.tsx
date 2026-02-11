import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StatsForge - All your stats in one place",
  description: "StatsForge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster 
                  position="top-right" 
                  toastOptions={{
                    classNames: {
                      toast: '!bg-zinc-900 !border !border-orange-500/30 !rounded-2xl !shadow-2xl !shadow-orange-500/10',
                      title: '!text-white !text-[11px] !font-black !uppercase !tracking-widest',
                      description: '!text-white/60 !text-xs',
                      success: '!bg-zinc-900 !border-orange-500/30 !text-orange-500',
                      error: '!bg-zinc-900 !border-red-500/30 !text-red-500',
                      warning: '!bg-zinc-900 !border-yellow-500/30 !text-yellow-500',
                      info: '!bg-zinc-900 !border-orange-500/30 !text-orange-500',
                      actionButton: '!bg-orange-500 !text-white !font-bold',
                      cancelButton: '!bg-zinc-800 !text-white/60',
                      closeButton: '!bg-zinc-800 hover:!bg-zinc-700 !text-white/40 hover:!text-white',
                    },
                  }}
                />
        </AuthProvider>
      </body>
    </html>
  );
}
