import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scale Mastery | Guitar Fretboard Trainer",
  description: "Interactive guitar scale and mode trainer for mastering the fretboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
