import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoveCheck — See Your Relationship Patterns Clearly",
  description:
    "LoveCheck is a relationship intelligence platform that helps you understand patterns, recognize strengths, and make more confident decisions about your connections — without judgment.",
  keywords: [
    "relationship advice",
    "relationship patterns",
    "love quiz",
    "relationship health",
    "emotional intelligence",
    "dating advice",
    "communication patterns",
    "relationship radar",
  ],
  authors: [{ name: "LoveCheck" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "LoveCheck — See Your Relationship Patterns Clearly",
    description:
      "Understand your relationship patterns, recognize strengths, and make more confident decisions. Premium, private, and judgment-free.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoveCheck",
    description: "See your relationship patterns clearly — without judgment.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
