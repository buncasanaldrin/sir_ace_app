import "../globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import {
  Bottombar,
  LeftSidebar,
  RightSidebar,
  Topbar,
} from "@/components/shared";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SirAce",
  description: "A Next.js 13 Meta SirAce Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
          <main className="flex flex-row">
            <LeftSidebar />
            {/* CHECK class name to understand the design */}
            {/* PROCEED with the video after */}
            <section className="main-container">
              <div className="w-full max-w-4-xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
