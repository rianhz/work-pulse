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
         <ReactQueryProvider>
          <StoreProvider>
              <ThemeProvider>
                <AuthServerProvider>
                  <TooltipProvider>
                    <Toaster />
                    {children}
                  </TooltipProvider>
                </AuthServerProvider>
              </ThemeProvider>
          </StoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
