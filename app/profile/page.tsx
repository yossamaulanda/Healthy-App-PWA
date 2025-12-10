'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    imageUrl: ''
  })
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [canUpdate, setCanUpdate] = useState(true)
  const [daysUntilUpdate, setDaysUntilUpdate] = useState(0)
  const [imagePreview, setImagePreview] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Load data dari localStorage
  useEffect(() => {
    if (session?.user) {
      const savedData = localStorage.getItem('userProfile')
      const savedLastUpdate = localStorage.getItem('profileLastUpdate')
      
      if (savedData) {
        const parsed = JSON.parse(savedData)
        setProfileData({
          name: parsed.name || session.user.name || '',
          imageUrl: parsed.imageUrl || session.user.image || ''
        })
        setImagePreview(parsed.imageUrl || session.user.image || '')
      } else {
        setProfileData({
          name: session.user.name || '',
          imageUrl: session.user.image || ''
        })
        setImagePreview(session.user.image || '')
      }

      if (savedLastUpdate) {
        const lastUpdateDate = new Date(savedLastUpdate)
        setLastUpdate(lastUpdateDate)
        
        // // Hitung apakah sudah 7 hari
        // const daysPassed = Math.floor((new Date().getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24))
        // const daysRemaining = Math.max(0, 7 - daysPassed)
        
        // setCanUpdate(daysPassed >= 7)
        // setDaysUntilUpdate(daysRemaining)
      }
    }
  }, [session])

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

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  const handleEditClick = () => {
    if (canUpdate) {
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset ke data sebelumnya
    const savedData = localStorage.getItem('userProfile')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setProfileData({
        name: parsed.name || session.user?.name || '',
        imageUrl: parsed.imageUrl || session.user?.image || ''
      })
      setImagePreview(parsed.imageUrl || session.user?.image || '')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB')
        return
      }

      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        setProfileData(prev => ({ ...prev, imageUrl: base64String }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    
    // Simulasi delay untuk user experience
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simpan ke localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileData))
    localStorage.setItem('profileLastUpdate', new Date().toISOString())

    setLastUpdate(new Date())
    setCanUpdate(false)
    setDaysUntilUpdate(7)
    setIsEditing(false)
    setIsSaving(false)
    setShowSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Profil berhasil diperbarui!</span>
        </div>
      )}

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

            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={handleBackToDashboard}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => router.push('/kalori')}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Kalori
              </button>
              <button 
                onClick={() => router.push('/aktivitas')}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Aktivitas
              </button>
              <button 
                onClick={() => router.push('/riwayat')}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Riwayat
              </button>
            </nav>

            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={handleBackToDashboard}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Dashboard
        </button>

        {/* Update Restriction Warning */}
        {!canUpdate && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-900 mb-1">Perhatian</h4>
                <p className="text-sm text-yellow-700">
                  Anda dapat mengubah profil lagi dalam {daysUntilUpdate} hari. 
                  {lastUpdate && ` Terakhir diupdate: ${formatDate(lastUpdate)}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-8 py-12">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={imagePreview || '/default-avatar.png'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-4 text-2xl font-bold text-center bg-white text-gray-800 px-4 py-2 rounded-lg border-2 border-blue-500 focus:outline-none focus:border-blue-600"
                  placeholder="Masukkan nama"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white mb-1 mt-4">{profileData.name}</h2>
              )}
              
              <p className="text-gray-300">{session.user?.email}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="px-8 py-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Informasi Profil</h3>
              {!isEditing && (
                <button
                  onClick={handleEditClick}
                  disabled={!canUpdate}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    canUpdate
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Profil</span>
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Nama */}
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Nama Lengkap
                </label>
                <p className="text-gray-800 text-lg">{profileData.name || '-'}</p>
              </div>

              {/* Email */}
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Email
                </label>
                <p className="text-gray-800 text-lg">{session.user?.email || '-'}</p>
              </div>

              {/* Status Akun */}
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Status Akun
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Aktif
                  </span>
                </div>
              </div>

              {/* Last Update */}
              {lastUpdate && (
                <div className="border-b border-gray-200 pb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Terakhir Diupdate
                  </label>
                  <p className="text-gray-800 text-lg">{formatDate(lastUpdate)}</p>
                </div>
              )}

              {/* Metode Login */}
              <div className="pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Metode Login
                </label>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-800">Google</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-8">
            {isEditing ? (
              <div className="flex gap-4">
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving || !profileData.name.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex-1 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Kembali ke Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Informasi Update Profil</h4>
              <p className="text-sm text-blue-700">
                Anda dapat mengubah nama dan foto profil setiap 7 hari sekali. 
                Perubahan akan tersimpan secara lokal di perangkat Anda.
              </p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}