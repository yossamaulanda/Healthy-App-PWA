// app/dashboard/layout.tsx
// Layout sederhana tanpa proteksi route untuk menghindari konflik
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
