# Aplikasi Login dengan NextAuth.js

Aplikasi web sederhana untuk login menggunakan akun Google dengan NextAuth.js, Next.js, dan Tailwind CSS.

## Fitur

- ✅ Login dengan akun Google
- ✅ Dashboard dengan profil pengguna
- ✅ Logout functionality
- ✅ UI yang responsif dengan Tailwind CSS
- ✅ Autentikasi server-side dengan NextAuth.js

## Setup dan Instalasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Google OAuth

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat proyek baru atau pilih proyek yang sudah ada
3. Aktifkan Google+ API
4. Pergi ke "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Pilih "Web application"
6. Tambahkan authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (untuk development)
   - `https://yourdomain.com/api/auth/callback/google` (untuk production)
7. Copy Client ID dan Client Secret

### 3. Konfigurasi Environment Variables

Buat file `.env.local` di root project:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

**Cara mendapatkan NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Proyek

```
aplikasi-login/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts          # Konfigurasi NextAuth
│   ├── dashboard/
│   │   └── page.tsx          # Halaman dashboard
│   ├── login/
│   │   └── page.tsx          # Halaman login
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Halaman utama (redirect)
│   └── providers.tsx         # Session provider
├── .env.local                # Environment variables
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Cara Kerja

1. **Halaman Utama (`/`)**: Mengecek status login dan mengarahkan ke `/login` atau `/dashboard`
2. **Halaman Login (`/login`)**: Menampilkan tombol login Google
3. **Halaman Dashboard (`/dashboard`)**: Menampilkan profil pengguna setelah login
4. **API Auth (`/api/auth/[...nextauth]`)**: Menangani autentikasi dengan Google

## Teknologi yang Digunakan

- **Next.js 14** - React framework dengan App Router
- **NextAuth.js** - Autentikasi untuk Next.js
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Google OAuth** - Provider autentikasi

## Troubleshooting

### Error: "Invalid redirect_uri"
Pastikan redirect URI di Google Cloud Console sama dengan yang ada di kode:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

### Error: "NEXTAUTH_SECRET is not defined"
Pastikan file `.env.local` sudah dibuat dengan benar dan berisi `NEXTAUTH_SECRET`.

### Error: "Google OAuth error"
Pastikan `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` sudah diisi dengan benar di `.env.local`.

## Deployment

Untuk deployment ke production:

1. Update `NEXTAUTH_URL` di `.env.local` dengan domain production
2. Update redirect URI di Google Cloud Console
3. Deploy ke platform seperti Vercel, Netlify, atau server sendiri

## Lisensi

MIT License
