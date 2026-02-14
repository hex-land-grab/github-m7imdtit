import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hex Land Grab',
  description: 'Own a color forever.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        {children}
        {/* Hivatalos Gumroad Overlay Script a body végén */}
        <Script 
          src="https://gumroad.com/js/gumroad.js" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  )
}
