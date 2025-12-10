'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, FormEvent, useRef } from 'react'

export default function NutrisiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // State untuk target nutrisi harian (dalam gram)
  const [targetProtein, setTargetProtein] = useState(60)
  const [targetKarbohidrat, setTargetKarbohidrat] = useState(300)
  const [targetLemak, setTargetLemak] = useState(65)
  const [targetSerat, setTargetSerat] = useState(25)
  
  // State untuk nutrisi terkonsumsi
  const [proteinTerkonsumsi, setProteinTerkonsumsi] = useState(0)
  const [karbohidratTerkonsumsi, setKarbohidratTerkonsumsi] = useState(0)
  const [lemakTerkonsumsi, setLemakTerkonsumsi] = useState(0)
  const [seratTerkonsumsi, setSeratTerkonsumsi] = useState(0)
  
  // State untuk form
  const [namaMakanan, setNamaMakanan] = useState('')
  const [protein, setProtein] = useState('')
  const [karbohidrat, setKarbohidrat] = useState('')
  const [lemak, setLemak] = useState('')
  const [serat, setSerat] = useState('')
  const [kalori, setKalori] = useState('')
  const [riwayatMakanan, setRiwayatMakanan] = useState<Array<{
    id: number
    nama: string
    protein: number
    karbohidrat: number
    lemak: number
    serat: number
    kalori: number
    waktu: string
  }>>([])

  // State untuk AI scanning
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Preset makanan sehat
  const presetMakanan = [
    { 
      nama: 'Nasi Putih (100g)', 
      protein: 2.7, 
      karbohidrat: 28, 
      lemak: 0.3, 
      serat: 0.4,
      kalori: 130,
      icon: '🍚' 
    },
    { 
      nama: 'Ayam Dada (100g)', 
      protein: 31, 
      karbohidrat: 0, 
      lemak: 3.6, 
      serat: 0,
      kalori: 165,
      icon: '🍗' 
    },
    { 
      nama: 'Telur (1 butir)', 
      protein: 6, 
      karbohidrat: 0.6, 
      lemak: 5, 
      serat: 0,
      kalori: 78,
      icon: '🥚' 
    },
    { 
      nama: 'Brokoli (100g)', 
      protein: 2.8, 
      karbohidrat: 7, 
      lemak: 0.4, 
      serat: 2.6,
      kalori: 34,
      icon: '🥦' 
    },
    { 
      nama: 'Pisang (1 buah)', 
      protein: 1.3, 
      karbohidrat: 27, 
      lemak: 0.3, 
      serat: 3.1,
      kalori: 105,
      icon: '🍌' 
    },
    { 
      nama: 'Salmon (100g)', 
      protein: 20, 
      karbohidrat: 0, 
      lemak: 13, 
      serat: 0,
      kalori: 208,
      icon: '🐟' 
    }
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  // Function untuk membuka kamera
  const openCamera = async () => {
    try {
      setScanError('')
      setIsCameraOpen(true)
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Gunakan kamera belakang jika ada
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      })
      
      setStream(mediaStream)
      
      // Set video stream setelah delay untuk memastikan video element sudah ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err)
          })
        }
      }, 100)
    } catch (error) {
      console.error('Error opening camera:', error)
      setScanError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.')
      setIsCameraOpen(false)
    }
  }

  // Function untuk menutup kamera
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraOpen(false)
  }

  // Function untuk capture foto dari kamera
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) return

    // Set canvas size sama dengan video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw video frame ke canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert canvas ke base64
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1]
    
    // Close camera
    closeCamera()
    
    // Process image
    await processImage(base64Image)
  }

  // Function untuk convert image ke base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result as string
        resolve(base64String.split(',')[1]) // Remove data:image/...;base64, prefix
      }
      reader.onerror = error => reject(error)
    })
  }

  // Function untuk process image dengan AI
  const processImage = async (base64Image: string) => {
    setIsScanning(true)
    setScanError('')

    try {
      // Call OpenAI API
      const response = await fetch('/api/scan-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        })
      })

      if (!response.ok) {
        throw new Error('Gagal menganalisis gambar')
      }

      const data = await response.json()

      // Auto-fill form dengan hasil scan
      if (data.success) {
        setNamaMakanan(data.nama || '')
        setProtein(data.protein?.toString() || '')
        setKarbohidrat(data.karbohidrat?.toString() || '')
        setLemak(data.lemak?.toString() || '')
        setSerat(data.serat?.toString() || '')
        setKalori(data.kalori?.toString() || '')
      } else {
        setScanError(data.error || 'Gagal menganalisis gambar')
      }
    } catch (error) {
      console.error('Error scanning food:', error)
      setScanError('Terjadi kesalahan saat memproses gambar')
    } finally {
      setIsScanning(false)
    }
  }

  // Function untuk scan foto makanan dengan AI (dari file upload)
  const handleScanFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setScanError('File harus berupa gambar')
      return
    }

    try {
      // Convert image to base64
      const base64Image = await convertToBase64(file)
      await processImage(base64Image)
    } catch (error) {
      console.error('Error scanning food:', error)
      setScanError('Terjadi kesalahan saat memproses gambar')
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

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

  const handleNavigateToProfile = () => {
    router.push('/profile')
  }

  // Hitung persentase
  const persentaseProtein = (proteinTerkonsumsi / targetProtein) * 100
  const persentaseKarbohidrat = (karbohidratTerkonsumsi / targetKarbohidrat) * 100
  const persentaseLemak = (lemakTerkonsumsi / targetLemak) * 100
  const persentaseSerat = (seratTerkonsumsi / targetSerat) * 100

  const handleTambahMakanan = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (namaMakanan && protein && karbohidrat && lemak && serat && kalori) {
      const waktuSekarang = new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      const makananBaru = {
        id: Date.now(),
        nama: namaMakanan,
        protein: parseFloat(protein),
        karbohidrat: parseFloat(karbohidrat),
        lemak: parseFloat(lemak),
        serat: parseFloat(serat),
        kalori: parseInt(kalori),
        waktu: waktuSekarang
      }
      
      setRiwayatMakanan([makananBaru, ...riwayatMakanan])
      setProteinTerkonsumsi(prev => prev + parseFloat(protein))
      setKarbohidratTerkonsumsi(prev => prev + parseFloat(karbohidrat))
      setLemakTerkonsumsi(prev => prev + parseFloat(lemak))
      setSeratTerkonsumsi(prev => prev + parseFloat(serat))
      
      setNamaMakanan('')
      setProtein('')
      setKarbohidrat('')
      setLemak('')
      setSerat('')
      setKalori('')
    }
  }

  const handleHapusMakanan = (item: any) => {
    setRiwayatMakanan(prev => prev.filter(m => m.id !== item.id))
    setProteinTerkonsumsi(prev => prev - item.protein)
    setKarbohidratTerkonsumsi(prev => prev - item.karbohidrat)
    setLemakTerkonsumsi(prev => prev - item.lemak)
    setSeratTerkonsumsi(prev => prev - item.serat)
  }

  const handlePresetClick = (makanan: any) => {
    setNamaMakanan(makanan.nama)
    setProtein(makanan.protein.toString())
    setKarbohidrat(makanan.karbohidrat.toString())
    setLemak(makanan.lemak.toString())
    setSerat(makanan.serat.toString())
    setKalori(makanan.kalori.toString())
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Ambil Foto Makanan</h3>
              <button
                onClick={closeCamera}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Video Container */}
            <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
              {!stream && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Membuka kamera...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-white p-6 flex justify-center space-x-4">
              <button
                onClick={closeCamera}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={capturePhoto}
                disabled={isScanning || !stream}
                className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                  isScanning || !stream
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {isScanning ? 'Memproses...' : 'Ambil Foto'}
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

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
                <h1 className="text-xl font-semibold text-gray-800">Pantau Nutrisi</h1>
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
        {/* Ringkasan Nutrisi */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Protein */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-500">Protein</h3>
              <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🥩</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{proteinTerkonsumsi.toFixed(1)}g</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-red-500 transition-all duration-500"
                style={{ width: `${Math.min(persentaseProtein, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">dari {targetProtein}g</p>
          </div>

          {/* Karbohidrat */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-500">Karbohidrat</h3>
              <div className="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🍞</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{karbohidratTerkonsumsi.toFixed(1)}g</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-yellow-500 transition-all duration-500"
                style={{ width: `${Math.min(persentaseKarbohidrat, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">dari {targetKarbohidrat}g</p>
          </div>

          {/* Lemak */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-500">Lemak</h3>
              <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🥑</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{lemakTerkonsumsi.toFixed(1)}g</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${Math.min(persentaseLemak, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">dari {targetLemak}g</p>
          </div>

          {/* Serat */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-500">Serat</h3>
              <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🥗</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{seratTerkonsumsi.toFixed(1)}g</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${Math.min(persentaseSerat, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">dari {targetSerat}g</p>
          </div>
        </div>

        {/* Chart Nutrisi */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Komposisi Nutrisi Hari Ini</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke="#ef4444" 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(persentaseProtein / 100, 1))}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">{persentaseProtein.toFixed(0)}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">Protein</p>
            </div>

            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke="#eab308" 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(persentaseKarbohidrat / 100, 1))}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">{persentaseKarbohidrat.toFixed(0)}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">Karbohidrat</p>
            </div>

            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke="#f97316" 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(persentaseLemak / 100, 1))}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">{persentaseLemak.toFixed(0)}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">Lemak</p>
            </div>

            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke="#22c55e" 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(persentaseSerat / 100, 1))}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">{persentaseSerat.toFixed(0)}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">Serat</p>
            </div>
          </div>
        </div>

        {/* Preset Makanan */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Makanan Populer</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {presetMakanan.map((makanan) => (
              <button
                key={makanan.nama}
                onClick={() => handlePresetClick(makanan)}
                className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-gray-300"
              >
                <span className="text-3xl mb-1">{makanan.icon}</span>
                <span className="text-xs font-medium text-gray-800 text-center">{makanan.nama}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Tambah Makanan */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Tambah Makanan</h3>
            
            {/* AI Scan Button */}
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-dashed border-purple-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Scan Foto Makanan dengan AI</p>
                    <p className="text-xs text-gray-600">Otomatis analisis nutrisi dari foto</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={openCamera}
                  disabled={isScanning}
                  className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all ${
                    isScanning 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Buka Kamera</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScanFoto}
                  className="hidden"
                  id="food-image-input"
                  disabled={isScanning}
                />
                
                <label 
                  htmlFor="food-image-input"
                  className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all cursor-pointer ${
                    isScanning 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Pilih Foto</span>
                </label>
              </div>
              
              {scanError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                  {scanError}
                </div>
              )}
            </div>

            <form onSubmit={handleTambahMakanan} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Makanan</label>
                <input
                  type="text"
                  value={namaMakanan}
                  onChange={(e) => setNamaMakanan(e.target.value)}
                  placeholder="Contoh: Nasi Goreng"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Karbohidrat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={karbohidrat}
                    onChange={(e) => setKarbohidrat(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none text-sm"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lemak (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={lemak}
                    onChange={(e) => setLemak(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={serat}
                    onChange={(e) => setSerat(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kalori (kkal)</label>
                <input
                  type="number"
                  value={kalori}
                  onChange={(e) => setKalori(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Tambah Makanan
              </button>
            </form>
          </div>

          {/* Riwayat Makanan */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Riwayat Makanan Hari Ini</h3>
            <div className="space-y-3">
              {riwayatMakanan.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Belum ada makanan yang ditambahkan</p>
              ) : (
                riwayatMakanan.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-800">{item.nama}</p>
                        <span className="text-xs text-gray-500">{item.waktu}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-600 space-x-2">
                        <span>Protein: {item.protein}g</span>
                        <span>•</span>
                        <span>Karbo: {item.karbohidrat}g</span>
                        <span>•</span>
                        <span>Lemak: {item.lemak}g</span>
                        <span>•</span>
                        <span>Serat: {item.serat}g</span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-gray-700">{item.kalori} kkal</p>
                    </div>
                    <button
                      onClick={() => handleHapusMakanan(item)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}