import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Own a Color | The Global Hex Code Registry',
  description: 'Claim your unique spot in the digital spectrum. Secure your favorite hex color forever on the global registry. Only $5 USD per color.',
  metadataBase: new URL('https://own-a-color.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Own a Color | The Global Hex Code Registry',
    description: 'Claim your favorite hex color and own it forever on the digital spectrum.',
    url: 'https://own-a-color.vercel.app',
    siteName: 'Own a Color',
    images: [
      {
        url: '/og-image.png', // A főoldali megosztó képed
        width: 1200,
        height: 630,
        alt: 'Own a Color Registry - Digital Collectible',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Own a Color | The Global Hex Code Registry',
    description: 'I just secured my unique hex color. Is your favorite still available?',
    images: ['/og-image.png'],
    creator: '@yourusername', // Itt opcionálisan megadhatod a saját X felhasználónevedet
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-[#050505] text-white">
        {children}
      </body>
    </html>
  );
}
