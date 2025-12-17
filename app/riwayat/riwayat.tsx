'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RiwayatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('semua')

  // Redirect ke login jika belum authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
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
    return null
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const handleNavigateToProfile = () => {
    router.push('/profile')
  }

  // Handler untuk navigasi
  const handleNavigateToDashboard = () => {
    router.push('/dashboard')
  }

  const handleNavigateToKalori = () => {
    router.push('/kalori')
  }

  const handleNavigateToAktivitas = () => {
    router.push('/aktivitas')
  }

  // Data riwayat contoh
  const riwayatData = [
    {
      id: 1,
      type: 'kalori',
      title: 'Input Berat Badan',
      detail: '68 kg',
      date: '2024-11-25',
      time: '08:30',
      icon: 'heart'
    },
    {
      id: 2,
      type: 'aktivitas',
      title: 'Lari Pagi',
      detail: '5 km - 30 menit',
      date: '2024-11-25',
      time: '06:00',
      icon: 'activity'
    },
    {
      id: 3,
      type: 'nutrisi',
      title: 'Sarapan',
      detail: 'Nasi Goreng - 450 kal',
      date: '2024-11-25',
      time: '07:30',
      icon: 'food'
    },
    {
      id: 4,
      type: 'aktivitas',
      title: 'Yoga',
      detail: '20 menit',
      date: '2024-11-24',
      time: '18:00',
      icon: 'activity'
    },
    {
      id: 5,
      type: 'kalori',
      title: 'Input Tinggi Badan',
      detail: '170 cm',
      date: '2024-11-24',
      time: '09:00',
      icon: 'heart'
    },
    {
      id: 6,
      type: 'nutrisi',
      title: 'Makan Siang',
      detail: 'Ayam Bakar + Sayur - 550 kal',
      date: '2024-11-24',
      time: '12:30',
      icon: 'food'
    }
  ]

  // Filter data berdasarkan tab aktif
  const filteredData = activeTab === 'semua' 
    ? riwayatData 
    : riwayatData.filter(item => item.type === activeTab)

  // Fungsi untuk mendapatkan warna badge berdasarkan tipe
  const getBadgeColor = (type: string) => {
    if (type === 'kalori') return 'bg-red-100 text-red-700'
    if (type === 'aktivitas') return 'bg-blue-100 text-blue-700'
    if (type === 'nutrisi') return 'bg-green-100 text-green-700'
    return 'bg-gray-100 text-gray-700'
  }

  // Fungsi untuk mendapatkan icon
  const getIcon = (iconType: string) => {
    if (iconType === 'heart') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
    if (iconType === 'activity') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
    if (iconType === 'food') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-800">Riwayat Aktivitas</h1>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={handleNavigateToDashboard}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Dashboard
              </button>
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
              <a href="#" className="text-gray-800 font-medium border-b-2 border-gray-800 pb-1">
                Riwayat
              </a>
            </nav>

            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                <img
                  src={session.user?.image || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
              </div>
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
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Riwayat Aktivitas</h2>
          <p className="text-gray-500">Lihat semua aktivitas kesehatan Anda</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 inline-flex space-x-2">
          <button
            onClick={() => setActiveTab('semua')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'semua' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab('kalori')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'kalori' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Kalori
          </button>
          <button
            onClick={() => setActiveTab('aktivitas')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'aktivitas' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Aktivitas
          </button>
          <button
            onClick={() => setActiveTab('nutrisi')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'nutrisi' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Nutrisi
          </button>
        </div>

        {/* Riwayat List */}
        <div className="space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 ${getBadgeColor(item.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {getIcon(item.icon)}
                    </div>
                    
                    {/* Content */}
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(item.type)}`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{item.detail}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {item.date}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum ada riwayat</h3>
              <p className="text-gray-500">Riwayat aktivitas Anda akan muncul di sini</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {filteredData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Aktivitas</p>
                  <p className="text-2xl font-bold text-gray-800">{riwayatData.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {riwayatData.filter(item => item.date === '2024-11-25').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Minggu Ini</p>
                  <p className="text-2xl font-bold text-gray-800">{riwayatData.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
