import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Konfigurasi NextAuth untuk domain production
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.id = profile.sub
      }
      return token
    },
    async redirect({ url, baseUrl }) {
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
  debug: process.env.NODE_ENV === 'development', // Aktifkan debug hanya di development
})

export { handler as GET, handler as POST }
