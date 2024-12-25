import type { Metadata } from "next";
import "./globals.css";
import { NextThemeProvider } from "@/components/NextUItheme";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from "next/font/google";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: "500",
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
          className={`${poppinsFont.className}`}
        >
          <Navbar />
          {children}
          <Toaster />
        </body>
      </NextThemeProvider>
    </html>
  );
}
