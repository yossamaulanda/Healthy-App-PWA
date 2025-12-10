// app/dashboard/layout.tsx
'use client'

// Hapus proteksi route dari layout untuk sementara
// Kita hanya akan fokus pada proteksi di page.tsx

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
