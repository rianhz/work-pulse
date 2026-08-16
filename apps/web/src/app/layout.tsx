import type { Metadata } from "next";
import { Manrope, EB_Garamond } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AuthServerProvider from "@/providers/AuthServerProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import GoogleAuthProvider from "@/providers/GoogleAuthProvider";

const manrope = Manrope({subsets:['latin'],variable:'--font-manrope', display:'swap'});
const ebGaramond = EB_Garamond({subsets:['latin'],variable:'--font-garamond', display:'swap'});

export const metadata: Metadata = {
  title: "Work Pulse",
  description: "The Operating System for Modern Teams",
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
      className={cn("h-full antialiased", manrope.variable, ebGaramond.variable)}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAuthProvider>
          <ReactQueryProvider>
            <StoreProvider>
                <ThemeProvider>
                  <AuthServerProvider>
                    <TooltipProvider>
                      <Toaster position="top-right" closeButton={true} />
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
