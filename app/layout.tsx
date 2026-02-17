import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Own a Color | The Exclusive Digital Hex Registry',
  description: 'Claim your favorite hex color code forever. A unique digital collectible registry where one color equals one owner. Only $5 USD.',
  openGraph: {
    title: 'Own a Color | Digital Hex Registry',
    description: 'Be the exclusive owner of your favorite hex color code.',
    url: 'https://own-a-color.vercel.app',
    siteName: 'Own a Color',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Own a Color | Digital Hex Registry',
    description: 'I just claimed my color. Can you find yours?',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
