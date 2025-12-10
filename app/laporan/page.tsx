'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

export default function LaporanPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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

  if (!session) {
    return null
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const handleNavigateToProfile = () => {
    router.push('/profile')
  }

  // Data untuk grafik kalori 7 hari
  const kaloriData = [
    { hari: 'Sen', target: 2000, aktual: 1850, terbakar: 450 },
    { hari: 'Sel', target: 2000, aktual: 2100, terbakar: 520 },
    { hari: 'Rab', target: 2000, aktual: 1900, terbakar: 380 },
    { hari: 'Kam', target: 2000, aktual: 2050, terbakar: 600 },
    { hari: 'Jum', target: 2000, aktual: 1950, terbakar: 420 },
    { hari: 'Sab', target: 2000, aktual: 2200, terbakar: 550 },
    { hari: 'Min', target: 2000, aktual: 1800, terbakar: 300 },
  ]

  // Data untuk distribusi nutrisi
  const nutrisiData = [
    { name: 'Karbohidrat', value: 45, color: '#6B7280' },
    { name: 'Protein', value: 30, color: '#9CA3AF' },
    { name: 'Lemak', value: 25, color: '#D1D5DB' },
  ]

  // Data untuk aktivitas mingguan
  const aktivitasData = [
    { hari: 'Sen', durasi: 30, kalori: 450 },
    { hari: 'Sel', durasi: 45, kalori: 520 },
    { hari: 'Rab', durasi: 25, kalori: 380 },
    { hari: 'Kam', durasi: 60, kalori: 600 },
    { hari: 'Jum', durasi: 35, kalori: 420 },
    { hari: 'Sab', durasi: 50, kalori: 550 },
    { hari: 'Min', durasi: 20, kalori: 300 },
  ]

  // Data untuk berat badan trend
  const beratBadanData = [
    { minggu: 'Mg 1', berat: 75, target: 72 },
    { minggu: 'Mg 2', berat: 74.5, target: 72 },
    { minggu: 'Mg 3', berat: 74, target: 72 },
    { minggu: 'Mg 4', berat: 73.5, target: 72 },
    { minggu: 'Mg 5', berat: 73, target: 72 },
    { minggu: 'Mg 6', berat: 72.8, target: 72 },
  ]

  // Statistik ringkasan
  const stats = [
    {
      label: 'Rata-rata Kalori/Hari',
      value: '1,979',
      change: '+5%',
      trend: 'up',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      label: 'Total Olahraga',
      value: '265 menit',
      change: '+12%',
      trend: 'up',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      label: 'Kalori Terbakar',
      value: '3,220',
      change: '+8%',
      trend: 'up',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      )
    },
    {
      label: 'Penurunan Berat',
      value: '2.2 kg',
      change: '-2.9%',
      trend: 'down',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
  ]

  // Pencapaian badges
  const achievements = [
    { name: '7 Hari Berturut-turut', earned: true, icon: '🔥' },
    { name: 'Target Kalori 30x', earned: true, icon: '🎯' },
    { name: 'Pelari 50km', earned: true, icon: '🏃' },
    { name: 'Penurunan 5kg', earned: false, icon: '⭐' },
    { name: 'Bulan Sempurna', earned: false, icon: '🏆' },
    { name: 'Master Nutrisi', earned: false, icon: '🥗' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Healthy</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => router.push('/dashboard')} className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Dashboard
              </button>
              <button onClick={() => router.push('/kalori')} className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Kalori
              </button>
              <button onClick={() => router.push('/aktivitas')} className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Aktivitas
              </button>
              <a href="#" className="text-gray-800 font-semibold border-b-2 border-gray-700 pb-1">
                Laporan
              </a>
            </nav>

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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title & Period Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Laporan Kesehatan</h2>
            <p className="text-gray-500">Pantau progres dan pencapaian Anda</p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setSelectedPeriod('7days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === '7days'
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setSelectedPeriod('30days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === '30days'
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setSelectedPeriod('90days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === '90days'
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              90 Hari
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700">
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'text-gray-800 border-b-2 border-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ringkasan
            </button>
            <button
              onClick={() => setActiveTab('kalori')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'kalori'
                  ? 'text-gray-800 border-b-2 border-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Kalori
            </button>
            <button
              onClick={() => setActiveTab('aktivitas')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'aktivitas'
                  ? 'text-gray-800 border-b-2 border-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Aktivitas
            </button>
            <button
              onClick={() => setActiveTab('nutrisi')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'nutrisi'
                  ? 'text-gray-800 border-b-2 border-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Nutrisi
            </button>
            <button
              onClick={() => setActiveTab('pencapaian')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'pencapaian'
                  ? 'text-gray-800 border-b-2 border-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pencapaian
            </button>
          </div>
        </div>

        {/* Tab Content - Ringkasan */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grafik Kalori */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Asupan Kalori Harian</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={kaloriData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="hari" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Area type="monotone" dataKey="target" stroke="#9CA3AF" fill="#F3F4F6" name="Target" />
                    <Area type="monotone" dataKey="aktual" stroke="#374151" fill="#6B7280" name="Aktual" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Grafik Berat Badan */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Trend Berat Badan</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={beratBadanData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="minggu" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" domain={[70, 76]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="berat" stroke="#374151" strokeWidth={2} name="Berat Aktual" />
                    <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeDasharray="5 5" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Progress Bar Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Target Mingguan</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Olahraga 300 menit</span>
                    <span className="text-sm font-medium text-gray-700">265/300 menit</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gray-700 h-3 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Konsumsi Air 14L</span>
                    <span className="text-sm font-medium text-gray-700">11.5/14 L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gray-600 h-3 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Defisit Kalori 3500 kal</span>
                    <span className="text-sm font-medium text-gray-700">2800/3500 kal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gray-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content - Kalori */}
        {activeTab === 'kalori' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Perbandingan Kalori</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={kaloriData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hari" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="aktual" fill="#374151" name="Kalori Masuk" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="terbakar" fill="#9CA3AF" name="Kalori Terbakar" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Total Kalori Masuk</h4>
                <p className="text-3xl font-bold text-gray-800">13,850</p>
                <p className="text-sm text-gray-500 mt-1">Kalori dalam 7 hari terakhir</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Total Kalori Terbakar</h4>
                <p className="text-3xl font-bold text-gray-800">3,220</p>
                <p className="text-sm text-gray-500 mt-1">Dari aktivitas olahraga</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Defisit Kalori</h4>
                <p className="text-3xl font-bold text-gray-800">-150</p>
                <p className="text-sm text-gray-500 mt-1">Rata-rata per hari</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content - Aktivitas */}
        {activeTab === 'aktivitas' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Durasi Aktivitas Harian</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={aktivitasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hari" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="durasi" fill="#6B7280" name="Durasi (menit)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Total Durasi</h4>
                <p className="text-3xl font-bold text-gray-800">265 menit</p>
                <p className="text-sm text-green-600 mt-1">↑ 12% dari minggu lalu</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Hari Aktif</h4>
                <p className="text-3xl font-bold text-gray-800">7/7 hari</p>
                <p className="text-sm text-green-600 mt-1">Sempurna! 🔥</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Rata-rata/Hari</h4>
                <p className="text-3xl font-bold text-gray-800">38 menit</p>
                <p className="text-sm text-gray-500 mt-1">Target: 30 menit</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content - Nutrisi */}
        {activeTab === 'nutrisi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Makronutrisi</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={nutrisiData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) => `${props.name}: ${props.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {nutrisiData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Nutrisi Harian</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Serat</p>
                      <p className="text-sm text-gray-500">28g / 30g</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">93%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Karbohidrat</p>
                      <p className="text-sm text-gray-500">225g / 250g</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">90%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Protein</p>
                      <p className="text-sm text-gray-500">142g / 150g</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">95%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Lemak</p>
                      <p className="text-sm text-gray-500">56g / 67g</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">84%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Asupan Vitamin & Mineral</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Vitamin C</p>
                  <p className="text-2xl font-bold text-gray-800">85%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Vitamin D</p>
                  <p className="text-2xl font-bold text-gray-800">72%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Kalsium</p>
                  <p className="text-2xl font-bold text-gray-800">88%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Zat Besi</p>
                  <p className="text-2xl font-bold text-gray-800">91%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content - Pencapaian */}
        {activeTab === 'pencapaian' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Badge Pencapaian</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-lg border-2 transition-all ${
                      achievement.earned
                        ? 'border-gray-700 bg-gray-50'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <p className="text-xs font-medium text-gray-700">{achievement.name}</p>
                    {achievement.earned && (
                      <div className="mt-2">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Rekor Pribadi</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-800">Lari Terjauh</p>
                      <p className="text-sm text-gray-500">Minggu lalu</p>
                    </div>
                    <p className="text-xl font-bold text-gray-800">10.5 km</p>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-800">Kalori Terbakar (1 hari)</p>
                      <p className="text-sm text-gray-500">3 hari lalu</p>
                    </div>
                    <p className="text-xl font-bold text-gray-800">850 kal</p>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-800">Streak Terpanjang</p>
                      <p className="text-sm text-gray-500">Bulan ini</p>
                    </div>
                    <p className="text-xl font-bold text-gray-800">21 hari</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">Olahraga Terlama</p>
                      <p className="text-sm text-gray-500">2 minggu lalu</p>
                    </div>
                    <p className="text-xl font-bold text-gray-800">90 menit</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Milestone Berikutnya</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Total Jarak 100km</span>
                      <span className="text-sm font-medium text-gray-700">78/100 km</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gray-700 h-3 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Olahraga 100x</span>
                      <span className="text-sm font-medium text-gray-700">67/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gray-600 h-3 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Penurunan 10kg</span>
                      <span className="text-sm font-medium text-gray-700">2.2/10 kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gray-500 h-3 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Konsistensi 90 hari</span>
                      <span className="text-sm font-medium text-gray-700">45/90 hari</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gray-400 h-3 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl shadow-sm p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Kerja Bagus! 🎉</h3>
                  <p className="text-gray-200">Kamu telah mencapai 6 pencapaian dan sedang menuju 4 milestone lagi!</p>
                </div>
                <div className="hidden md:block text-6xl">🏆</div>
              </div>
            </div>
          </div>
        )}

        {/* Export & Share Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Ekspor Laporan</h3>
              <p className="text-sm text-gray-500">Unduh atau bagikan laporan kesehatan Anda</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Bagikan
              </button>
              <button className="px-5 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}