import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";

const NohemiSemiBold = localFont({
  src: "../../public/Nohemi-SemiBold.woff2",
  variable: "--font-nohemi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Merge it",
  description: "Zendesk Ticket history with merge option",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className={NohemiSemiBold.variable}>
        <head />
        <body>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster position="top-center" />
          </SessionProvider>
        </body>
      </html>
    </>
  );
}
