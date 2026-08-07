import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title:{default:"Plei Product Hub",template:"%s · Plei Product Hub"}, description:"Plei's outcome-based product roadmap" };

export default function RootLayout({ children, drawer }: Readonly<{ children: React.ReactNode; drawer: React.ReactNode }>) {
  return <html lang="en"><body>{children}{drawer}</body></html>;
}
