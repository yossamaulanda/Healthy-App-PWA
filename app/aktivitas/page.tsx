'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, FormEvent } from 'react'

export default function AktivitasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State untuk data aktivitas
  const [targetAktivitas, setTargetAktivitas] = useState(60) // target menit per hari
  const [totalDurasi, setTotalDurasi] = useState(0) // dalam menit
  const [totalKaloriTerbakar, setTotalKaloriTerbakar] = useState(0)
  
  // State untuk form input aktivitas
  const [jenisAktivitas, setJenisAktivitas] = useState('')
  const [durasi, setDurasi] = useState('')
  const [kaloriPerMenit, setKaloriPerMenit] = useState('')
  const [riwayatAktivitas, setRiwayatAktivitas] = useState<Array<{
    id: number
    jenis: string
    durasi: number
    kaloriTerbakar: number
    waktu: string
  }>>([])

  // Preset aktivitas populer
  const presetAktivitas = [
    { nama: 'Lari', kaloriPerMenit: 10, icon: '🏃' },
    { nama: 'Bersepeda', kaloriPerMenit: 8, icon: '🚴' },
    { nama: 'Berenang', kaloriPerMenit: 9, icon: '🏊' },
    { nama: 'Yoga', kaloriPerMenit: 4, icon: '🧘' },
    { nama: 'Jalan Kaki', kaloriPerMenit: 5, icon: '🚶' },
    { nama: 'Gym', kaloriPerMenit: 7, icon: '💪' }
  ]

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

  if (!session) {
    return null
  }

  // Hitung persentase aktivitas
  const persentaseAktivitas = (totalDurasi / targetAktivitas) * 100

  // Handler untuk menambah aktivitas
  const handleTambahAktivitas = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (jenisAktivitas && durasi && kaloriPerMenit) {
      const waktuSekarang = new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      const durasiInt = parseInt(durasi)
      const kaloriPerMenitInt = parseFloat(kaloriPerMenit)
      const totalKalori = durasiInt * kaloriPerMenitInt
      
      const aktivitasBaru = {
        id: Date.now(),
        jenis: jenisAktivitas,
        durasi: durasiInt,
        kaloriTerbakar: Math.round(totalKalori),
        waktu: waktuSekarang
      }
      
      setRiwayatAktivitas([aktivitasBaru, ...riwayatAktivitas])
      setTotalDurasi(prev => prev + durasiInt)
      setTotalKaloriTerbakar(prev => prev + Math.round(totalKalori))
      setJenisAktivitas('')
      setDurasi('')
      setKaloriPerMenit('')
    }
  }

  // Handler untuk menghapus aktivitas
  const handleHapusAktivitas = (id: number, durasi: number, kalori: number) => {
    setRiwayatAktivitas(prev => prev.filter(item => item.id !== id))
    setTotalDurasi(prev => prev - durasi)
    setTotalKaloriTerbakar(prev => prev - kalori)
  }

  const handleNavigateToProfile = () => {
    router.push('/profile')
  }

  // Handler untuk quick add dari preset
  const handlePresetClick = (nama: string, kaloriPerMenit: number) => {
    setJenisAktivitas(nama)
    setKaloriPerMenit(kaloriPerMenit.toString())
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
                <h1 className="text-xl font-semibold text-gray-800">Catat Aktivitas</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleNavigateToProfile}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900">{session.user?.name}</p>
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Ringkasan Aktivitas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Target Aktivitas */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Target Harian</h3>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{targetAktivitas}</p>
            <p className="text-xs text-gray-500 mt-1">menit/hari</p>
          </div>

          {/* Card Total Durasi */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Durasi</h3>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalDurasi}</p>
            <p className="text-xs text-gray-500 mt-1">{persentaseAktivitas.toFixed(0)}% dari target</p>
          </div>

          {/* Card Kalori Terbakar */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Kalori Terbakar</h3>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalKaloriTerbakar}</p>
            <p className="text-xs text-gray-500 mt-1">kalori hari ini</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Progress Aktivitas Harian</h3>
            <span className="text-sm text-gray-500">{persentaseAktivitas.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-500 bg-blue-500"
              style={{ width: `${Math.min(persentaseAktivitas, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {totalDurasi >= targetAktivitas
              ? `Selamat! Anda telah mencapai target aktivitas hari ini`
              : `Kurang ${targetAktivitas - totalDurasi} menit lagi untuk mencapai target`
            }
          </p>
        </div>

        {/* Preset Aktivitas */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Aktivitas Populer</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {presetAktivitas.map((aktivitas) => (
              <button
                key={aktivitas.nama}
                onClick={() => handlePresetClick(aktivitas.nama, aktivitas.kaloriPerMenit)}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-gray-300"
              >
                <span className="text-3xl mb-2">{aktivitas.icon}</span>
                <span className="text-sm font-medium text-gray-800">{aktivitas.nama}</span>
                <span className="text-xs text-gray-500">{aktivitas.kaloriPerMenit} kal/mnt</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Tambah Aktivitas */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Tambah Aktivitas</h3>
            <form onSubmit={handleTambahAktivitas} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Aktivitas
                </label>
                <input
                  type="text"
                  value={jenisAktivitas}
                  onChange={(e) => setJenisAktivitas(e.target.value)}
                  placeholder="Contoh: Lari"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durasi (menit)
                </label>
                <input
                  type="number"
                  value={durasi}
                  onChange={(e) => setDurasi(e.target.value)}
                  placeholder="Contoh: 30"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kalori per Menit
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={kaloriPerMenit}
                  onChange={(e) => setKaloriPerMenit(e.target.value)}
                  placeholder="Contoh: 10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Tambah Aktivitas
              </button>
            </form>
          </div>

          {/* Riwayat Aktivitas */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Riwayat Hari Ini</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {riwayatAktivitas.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Belum ada aktivitas yang dicatat</p>
              ) : (
                riwayatAktivitas.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.jenis}</h4>
                      <p className="text-xs text-gray-500">{item.waktu} • {item.durasi} menit</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-800">{item.kaloriTerbakar} kal</span>
                      <button
                        onClick={() => handleHapusAktivitas(item.id, item.durasi, item.kaloriTerbakar)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Tips Aktivitas Fisik</h4>
              <p className="text-sm text-gray-600">
                Lakukan aktivitas fisik minimal 30 menit setiap hari untuk menjaga kesehatan jantung dan meningkatkan metabolisme tubuh. 
                Kombinasikan berbagai jenis aktivitas untuk hasil yang optimal.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}