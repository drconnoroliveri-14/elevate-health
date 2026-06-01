import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import Analytics from "@/components/Analytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elevate Health — Pain-Free Program",
  description:
    "Finally eliminate neck, mid back, and lower back pain from home with the chiropractor-designed Elevate Pain-Free Program. Just $97.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Elevate Health — Pain-Free Program",
    description:
      "Finally eliminate neck, mid back, and lower back pain from home. Just $97 — 90-day guarantee.",
    url: "https://elevate-health-lyart.vercel.app",
    siteName: "Elevate Health",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SupabaseProvider>
          {children}
          <Analytics />
        </SupabaseProvider>
      </body>
    </html>
  );
}
