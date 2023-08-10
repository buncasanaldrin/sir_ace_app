import "../globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "SirAce",
  description: "A Next.js 13 Meta SirAce Application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="flex justify-center items-center w-full min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
