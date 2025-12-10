'use client'

import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()

  // Jika user sudah login, redirect ke dashboard
  useEffect(() => {
    const checkSession = async () => {
      if (typeof window !== 'undefined') {
        // Cek session menggunakan next-auth client-side
        const {getSession} = await import('next-auth/react')
        const session = await getSession()
        if (session) {
          router.push('/dashboard')
        }
      }
    }
    
    checkSession()
  }, [router])

  const handleGoogleLogin = async () => {
    try {
      // Gunakan redirect otomatis dari NextAuth dengan callback URL yang eksplisit
      const result = await signIn('google', { 
        callbackUrl: `${window.location.origin}/dashboard` 
      })
      
      // Jangan tambahkan router.push di sini karena signIn sudah handle redirect
      if (result?.error) {
        console.error('Login error:', result.error)
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 text-white w-full">
          {/* Logo & Brand */}
          <div className="mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-2xl font-bold">ACTLY</span>
            </div>
          </div>

          {/* Main Content */}
          <div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Kesehatan Hal Yang Sangat Penting
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-md">
              Aplikasi ini berguna untuk mentracking aktivitas secara berkala</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-gray-600">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full group relative flex items-center justify-center px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300"
            >
              <svg className="w-6 h-6 mr-3 flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-base font-semibold">
                Lanjutkan dengan Google
              </span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">atau</span>
              </div>
            </div>

            {/* Alternative Info */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <Link
                  href="/register"
                  className="text-gray-900 font-semibold cursor-pointer hover:text-gray-700 hover:underline transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          {/* Footer Links */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              Dengan melanjutkan, Anda menyetujui{' '}
              <span className="text-gray-700 font-medium hover:underline cursor-pointer">Syarat Layanan</span>
              {' '}dan{' '}
              <span className="text-gray-700 font-medium hover:underline cursor-pointer">Kebijakan Privasi</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
