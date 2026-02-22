import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { clash } from "./fonts";
import "./globals.css";
import Nav from "@/components/Nav";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const metadata: Metadata = {
  title: "Harish Portfolio",
  description: "Software Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${inter.variable} ${clash.variable} antialiased overflow-hidden`}
      >
  
          <Nav />
      

        {children}
      </body>
    </html>
  );
}
