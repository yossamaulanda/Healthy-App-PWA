'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Debug logging
  useEffect(() => {
    console.log('Dashboard - Session Status:', status)
    console.log('Dashboard - Session Data:', session)
  }, [status, session])

  // Redirect ke login jika belum authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('Redirecting to login - unauthenticated')
      router.push('/login')
    }
  }, [status, router])

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  // Jika tidak ada session, jangan render apa-apa (akan redirect)
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  // Handler untuk navigasi ke halaman profile
  const handleNavigateToProfile = () => {
    router.push('/profile')
  }

  // Handler untuk navigasi ke halaman kalori
  const handleNavigateToKalori = () => {
    router.push('/kalori')
  }

  // Handler untuk menu lainnya
  const handleNavigateToAktivitas = () => {
    router.push('/aktivitas')
  }

  const handleNavigateToNutrisi = () => {
    router.push('/nutrisi')
  }

  const handleNavigateToLaporan = () => {
    router.push('/laporan')
  }

  const handleNavigateToRiwayat = () => {
    router.push('/riwayat')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Healthy</h1>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Dashboard
              </a>
              <button
                onClick={handleNavigateToKalori}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Kalori
              </button>
              <button
                onClick={handleNavigateToAktivitas}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Aktivitas
              </button>
              <button
                onClick={handleNavigateToRiwayat}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Riwayat
              </button>
            </nav>

            {/* Profile Section - Made Clickable */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNavigateToProfile}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600">{session.user?.email}</p>
                </div>
                <div className="relative">
                  <img
                    src={session.user?.image || '/default-avatar.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-gray-200 group-hover:border-gray-300 transition-colors"
                  />
                  {/* Indicator untuk menunjukkan clickable */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center border-2 border-white">
                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat datang di aplikasi ACTLY
          </h2>
          <p className="text-gray-500">
            Kelola kesehatan Anda dengan mudah
          </p>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            onClick={handleNavigateToKalori}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform transition-transform duration-200"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Kalori</h3>
            <p className="text-sm text-gray-500">Monitor kondisi tubuh Anda</p>
          </div>

          <div
            onClick={handleNavigateToAktivitas}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform transition-transform duration-200"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Aktivitas</h3>
            <p className="text-sm text-gray-500">Catat olahraga harian</p>
          </div>

          <div
            onClick={handleNavigateToNutrisi}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform transition-transform duration-200"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Nutrisi</h3>
            <p className="text-sm text-gray-500">Pantau asupan makanan</p>
          </div>

          <div
            onClick={handleNavigateToLaporan}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform transition-transform duration-200"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Laporan</h3>
            <p className="text-sm text-gray-500">Lihat progres Anda</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-center text-gray-600 text-sm">
              Anda berhasil login dengan akun Google. Mulai jelajahi fitur-fitur aplikasi Actly untuk mendukung gaya hidup sehat Anda.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
