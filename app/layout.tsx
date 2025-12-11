import InstallFooter from "@/app/components/InstallFooter";
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aplikasi Login',
  description: 'Aplikasi login dengan Google menggunakan NextAuth',
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        {/* Tag PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />

        {/* iOS Support */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>

      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>

        {/* FOOTER PWA INSTALL */}
        <InstallFooter />
      </body>
    </html>
  )
}
