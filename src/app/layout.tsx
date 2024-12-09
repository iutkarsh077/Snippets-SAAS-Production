import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextThemeProvider } from "@/components/NextUItheme";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Snippets - Empowering Developers with Sharable Code Solutions",
  description:
    "Discover, share, and collaborate on code snippets in a thriving community of developers. Snippets offers a platform to save your best ideas, learn from others, and contribute to the ever-growing knowledge base of programming expertise.",
  openGraph: {
    images: "https://i.postimg.cc/c1hMgQ7P/snippet-1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NextThemeProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          {children}
          <Toaster />
        </body>
      </NextThemeProvider>
    </html>
  );
}
