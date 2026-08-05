import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title:{default:"Plei Outcomes",template:"%s · Plei Outcomes"}, description:"Plei's outcome-based product roadmap" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
