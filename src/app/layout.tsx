import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Business Optimizer",
  description: "AI Business Optimizer",
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
