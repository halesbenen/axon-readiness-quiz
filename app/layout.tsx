import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Readiness Assessment | Axon IT",
  description: "Find out how ready your business is for AI & Automation. Answer 30 questions and get a personalised breakdown across 5 dimensions, free in 10 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`min-h-full flex flex-col ${dmSans.className}`}>
        <header style={{ backgroundColor: "#230533" }} className="px-6 py-4 flex items-center justify-between">
          <a href="https://axon-it.com" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/axon-logo-whiteout.svg"
              alt="Axon IT"
              width={120}
              height={40}
              style={{ width: 120, height: "auto" }}
            />
          </a>
          <span className="text-xs" style={{ color: "#a900f1", fontWeight: 300 }}>
            AI & Automation
          </span>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        <footer style={{ backgroundColor: "#230533" }} className="px-6 py-4 text-center">
          <a
            href="https://axon-it.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs"
            style={{ color: "#a900f1", fontWeight: 300 }}
          >
            axon-it.com
          </a>
        </footer>
      </body>
    </html>
  );
}
