import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title:{default:"Plei Outcomes",template:"%s · Plei Outcomes"}, description:"Plei's outcome-based product roadmap" };

export default function RootLayout({ children, drawer }: Readonly<{ children: React.ReactNode; drawer: React.ReactNode }>) {
  return <html lang="en"><body>{children}{drawer}</body></html>;
}
