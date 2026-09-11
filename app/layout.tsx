import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = localFont({
  src: "./fonts/dm-sans-variable.ttf",
  weight: "100 1000",
  display: "swap",
  variable: "--font-dm-sans",
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
        <header className="site-header px-6 py-4 flex items-center justify-between">
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
          <span className="eyebrow">
            AI infrastructure readiness
          </span>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        <footer className="site-footer px-6 py-4 text-center">
          <a
            href="https://axon-it.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            axon-it.com
          </a>
        </footer>
      </body>
    </html>
  );
}
