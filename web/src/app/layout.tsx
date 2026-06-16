import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AuthServerProvider from "@/providers/AuthServerProvider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import GoogleAuthProvider from "@/providers/GoogleAuthProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Work Pulse",
  description: "Work Pulse is a platform for managing your work and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans h-full antialiased", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAuthProvider>
          <ReactQueryProvider>
            <StoreProvider>
                <ThemeProvider>
                  <AuthServerProvider>
                    <TooltipProvider>
                      <Toaster position="top-right" />
                      {children}
                    </TooltipProvider>
                  </AuthServerProvider>
                </ThemeProvider>
            </StoreProvider>
          </ReactQueryProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
