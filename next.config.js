/** @type {import('next').NextConfig} */

// Nonaktifkan PWA sementara untuk debugging auth
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
//   buildExcludes: [/middleware-manifest\.json$/],
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'google-fonts-webfonts',
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 365 * 24 * 60 * 60
//         }
//       }
//     },
//     {
//       urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'google-fonts-stylesheets',
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 7 * 24 * 60 * 60
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-font-assets',
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 7 * 24 * 60 * 60
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-image-assets',
//         expiration: {
//           maxEntries: 64,
//           maxAgeSeconds: 24 * 60 * 60
//         }
//       }
//     },
//     {
//       urlPattern: /\/_next\/image\?url=.+$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'next-image',
//         expiration: {
//           maxEntries: 64,
//           maxAgeSeconds: 24 * 60 * 60
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:mp3|wav|ogg)$/i,
//       handler: 'CacheFirst',
//       options: {
//         rangeRequests: true,
//         cacheName: 'static-audio-assets',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:mp4)$/i,
//       handler: 'CacheFirst',
//       options: {
//         rangeRequests: true,
//         cacheName: 'static-video-assets',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:js)$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-js-assets',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:css|less)$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-style-assets',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60
//         }
//       }
//     },
//     {
//       urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'next-data',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60
//         }
//       }
//     },
//     {
//       urlPattern: /\/api\/.*$/i,
//       handler: 'NetworkFirst',
//       method: 'GET',
//       options: {
//         cacheName: 'apis',
//         expiration: {
//           maxEntries: 16,
//           maxAgeSeconds: 24 * 60 * 60
//         },
//         networkTimeoutSeconds: 10
//       }
//     },
//     {
//       urlPattern: /\/api\/auth\/.*$/i,
//       handler: 'NetworkOnly'
//     },
//     {
//       urlPattern: /.*/i,
//       handler: 'NetworkFirst',
//       options: {
//         cacheName: 'others',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60
//         },
//         networkTimeoutSeconds: 10
//       }
//     }
//   ]
// });

const nextConfig = {
  reactStrictMode: true,
  // Add images configuration if using next/image with external sources
  images: {
    domains: ['lh3.googleusercontent.com'], // for Google profile images
  },
  // Add experimental features if needed
  experimental: {
    // appDir: true, // if using app directory
  },
  async headers() {
    return [
      {
        // Menambahkan headers ke semua route untuk NextAuth
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow all origins for preview deployment
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
};

// Gunakan nextConfig biasa tanpa PWA untuk debugging
module.exports = nextConfig;
