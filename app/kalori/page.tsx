'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function KaloriPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State untuk form input
  const [beratBadan, setBeratBadan] = useState('')
  const [tinggiBadan, setTinggiBadan] = useState('')
  const [usia, setUsia] = useState('')
  const [jenisKelamin, setJenisKelamin] = useState('laki-laki')
  const [tingkatAktivitas, setTingkatAktivitas] = useState('sedang')
  
  // State untuk hasil kalkulasi
  const [hasilKalori, setHasilKalori] = useState<number | null>(null)
  const [bmi, setBmi] = useState<number | null>(null)

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

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const handleNavigateToDashboard = () => {
    router.push('/dashboard')
  }

  const handleNavigateToProfile = () => {
    router.push('/profile')
  }

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

  // Fungsi untuk menghitung BMR (Basal Metabolic Rate) menggunakan rumus Mifflin-St Jeor
  const hitungKalori = (e: React.FormEvent) => {
    e.preventDefault()
    
    const berat = parseFloat(beratBadan)
    const tinggi = parseFloat(tinggiBadan)
    const umur = parseFloat(usia)
    
    if (!berat || !tinggi || !umur) {
      alert('Mohon isi semua data dengan benar')
      return
    }
    
    // Hitung BMI
    const tinggiMeter = tinggi / 100
    const hitungBMI = berat / (tinggiMeter * tinggiMeter)
    setBmi(hitungBMI)
    
    // Hitung BMR
    let bmr: number
    if (jenisKelamin === 'laki-laki') {
      bmr = (10 * berat) + (6.25 * tinggi) - (5 * umur) + 5
    } else {
      bmr = (10 * berat) + (6.25 * tinggi) - (5 * umur) - 161
    }
    
    // Kalikan dengan faktor aktivitas
    const faktorAktivitas: { [key: string]: number } = {
      'sangat-ringan': 1.2,
      'ringan': 1.375,
      'sedang': 1.55,
      'berat': 1.725,
      'sangat-berat': 1.9
    }
    
    const kebutuhanKalori = bmr * faktorAktivitas[tingkatAktivitas]
    setHasilKalori(Math.round(kebutuhanKalori))
  }

  const getKategoriBMI = (bmi: number) => {
    if (bmi < 18.5) return { kategori: 'Kurus', warna: 'text-blue-600' }
    if (bmi < 25) return { kategori: 'Normal', warna: 'text-green-600' }
    if (bmi < 30) return { kategori: 'Gemuk', warna: 'text-yellow-600' }
    return { kategori: 'Obesitas', warna: 'text-red-600' }
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
                <h1 className="text-xl font-semibold text-gray-800">Catat Kebutuhan Kalori</h1>
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
              <a href="#" className="text-gray-800 font-semibold border-b-2 border-gray-800 pb-1">
                Kalori
              </a>
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

            {/* Profile Section */}
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
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Kalkulator Kebutuhan Kalori
          </h2>
          <p className="text-gray-500">
            Hitung kebutuhan kalori harian Anda berdasarkan data tubuh dan tingkat aktivitas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Data Diri Anda</h3>
            
            <form onSubmit={hitungKalori} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  value={beratBadan}
                  onChange={(e) => setBeratBadan(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                  placeholder="Contoh: 70"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="number"
                  value={tinggiBadan}
                  onChange={(e) => setTinggiBadan(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                  placeholder="Contoh: 170"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usia (tahun)
                </label>
                <input
                  type="number"
                  value={usia}
                  onChange={(e) => setUsia(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                  placeholder="Contoh: 25"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                >
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tingkat Aktivitas
                </label>
                <select
                  value={tingkatAktivitas}
                  onChange={(e) => setTingkatAktivitas(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                >
                  <option value="sangat-ringan">Sangat Ringan (Jarang olahraga)</option>
                  <option value="ringan">Ringan (1-3x seminggu)</option>
                  <option value="sedang">Sedang (3-5x seminggu)</option>
                  <option value="berat">Berat (6-7x seminggu)</option>
                  <option value="sangat-berat">Sangat Berat (Atlet)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Hitung Kebutuhan Kalori
              </button>
            </form>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {hasilKalori !== null && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Kebutuhan Kalori Harian</h3>
                  <div className="text-center py-6">
                    <div className="text-5xl font-bold text-gray-800 mb-2">
                      {hasilKalori}
                    </div>
                    <p className="text-gray-500">kalori/hari</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-sm text-gray-600">
                      Ini adalah perkiraan kebutuhan kalori harian Anda untuk mempertahankan berat badan saat ini.
                    </p>
                  </div>
                </div>

                {bmi !== null && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Indeks Massa Tubuh (BMI)</h3>
                    <div className="text-center py-6">
                      <div className="text-4xl font-bold text-gray-800 mb-2">
                        {bmi.toFixed(1)}
                      </div>
                      <p className={`text-lg font-medium ${getKategoriBMI(bmi).warna}`}>
                        {getKategoriBMI(bmi).kategori}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4 space-y-2 text-sm text-gray-600">
                      <p>• Kurus: BMI &lt; 18.5</p>
                      <p>• Normal: BMI 18.5 - 24.9</p>
                      <p>• Gemuk: BMI 25 - 29.9</p>
                      <p>• Obesitas: BMI ≥ 30</p>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Tips Kesehatan</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Untuk menurunkan berat: kurangi 300-500 kalori/hari</li>
                    <li>• Untuk menambah berat: tambah 300-500 kalori/hari</li>
                    <li>• Konsultasikan dengan ahli gizi untuk program yang tepat</li>
                  </ul>
                </div>
              </>
            )}

            {hasilKalori === null && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">
                    Isi data diri Anda untuk menghitung kebutuhan kalori harian
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
