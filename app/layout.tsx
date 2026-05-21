import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elevate Health — Pain-Free Program",
  description:
    "Finally eliminate neck, mid back, and lower back pain from home with the chiropractor-designed Elevate Pain-Free Program.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
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
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
