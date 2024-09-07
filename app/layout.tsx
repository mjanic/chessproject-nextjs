import type { Metadata } from "next";
import { Limelight, Caudex, PT_Serif_Caption } from "next/font/google";
import "./globals.css";

const limelight = Limelight({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-limelight",
});
const caudex = Caudex({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-caudex",
});
const ptserifcaption = PT_Serif_Caption({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-ptserifcaption",
});

export const metadata: Metadata = {
  title: "Chess Coach Openings",
  description: "Practice chess openings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${limelight.variable} ${caudex.variable} ${ptserifcaption.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
