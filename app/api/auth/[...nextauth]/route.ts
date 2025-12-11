@@ -1,48 +1,8 @@
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { authOptions } from './options'

// Konfigurasi NextAuth dengan Google provider
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  // Konfigurasi session dan callback
  callbacks: {
    async session({ session, token }) {
      // Menambahkan informasi tambahan ke session
      return session
    },
    async jwt({ token, account, profile }) {
      // Menyimpan informasi dari Google ke JWT token
      if (account && profile) {
        token.accessToken = account.access_token
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Redirect ke dashboard setelah login berhasil
      if (url.startsWith(baseUrl)) return url
      // Callback URL dari login page
      else if (url.startsWith('/')) return `${baseUrl}${url}`
      return `${baseUrl}/dashboard`
    }
  },
  // Halaman yang akan diarahkan setelah login/logout
  pages: {
    signIn: '/login',
    error: '/login',
  },
  // Konfigurasi session
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Secret untuk enkripsi JWT
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
})
// Tambahkan error handling tambahan
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
