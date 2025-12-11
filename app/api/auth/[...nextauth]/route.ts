import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

// Tambahkan type definition langsung di sini
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  
  interface User {
    id: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Tambahkan konfigurasi tambahan
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // Tambahkan logging
      console.log('Session callback:', { session, token })
      // Tambahkan token.sub (ID pengguna) ke session
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session
    },
    async jwt({ token, account, profile }) {
      // Tambahkan logging
      console.log('JWT callback:', { account, profile })
      // Simpan informasi dari Google ke JWT token
      if (account && profile) {
        token.accessToken = account.access_token
        token.id = profile.sub
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Tambahkan logging
      console.log('Redirect callback:', { url, baseUrl })
      // Hanya izinkan redirect ke baseUrl atau path internal
      if (url.startsWith(baseUrl)) return url
      else if (url.startsWith('/')) return `${baseUrl}${url}`
      return `${baseUrl}/dashboard`
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Aktifkan untuk debugging
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
