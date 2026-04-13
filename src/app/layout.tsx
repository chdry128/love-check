import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lovecheck.app"),
  title: "LoveCheck - Relationship Tests, Red Flag Checker & Love Tools",
  description:
    "LoveCheck offers free relationship tests, red flag checkers, compatibility quizzes, texting analyzers, and love tools for practical dating clarity.",
  keywords: [
    "relationship tests",
    "red flag checker",
    "relationship quiz",
    "relationship advice",
    "dating quiz",
    "compatibility test",
    "texting analyzer",
    "attachment style quiz",
    "love language test",
  ],
  authors: [{ name: "LoveCheck" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "LoveCheck - Relationship Tests, Red Flag Checker & Love Tools",
    description:
      "Use free relationship tests, compatibility quizzes, and red flag tools to understand your dating patterns with practical clarity.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoveCheck - Relationship Tests & Red Flag Checker",
    description: "Free relationship tools, quizzes, and compatibility tests for dating clarity.",
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
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
        <Toaster />
        <Analytics />
        <div className="ad-banner">
          <a
            href="https://www.profitablecpmratenetwork.com/u1giby0jw?key=470e1e7d6942888dff155b3a7b564cc7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/path-to-ad-image.jpg"
              alt="Advertisement"
            />
          </a>
        </div>
        <Script
          src="https://pl29143392.profitablecpmratenetwork.com/db/d3/88/dbd388fa4858924d834fd2edd4cda8fc.js"
        />
        <script src="https://quge5.com/88/tag.min.js" data-zone="229365" async data-cfasync="false"></script>
      </body>
    </html>
  );
}
