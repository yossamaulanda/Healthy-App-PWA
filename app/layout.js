import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'ACTLY - Health Tracking App',
  description: 'Track your health activities and calories',
  manifest: '/manifest.json',
  themeColor: '#1F2937',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ACTLY',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-180.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
