// https://nuxt.com/docs/api/configuration/nuxt-config

// Calculate baseURL: defaults to '/' for root domains and production, or GitHub Pages subpath if in GitHub Actions
const getBaseURL = () => {
  if (process.env.NUXT_APP_BASE_URL) return process.env.NUXT_APP_BASE_URL
  if (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split('/')[1]
    return `/${repo}/`
  }
  return '/'
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false, // Pure client-side SPA mode for zero-latency static hosting
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  nitro: {
    externals: {
      trace: false
    }
  },
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDzbkRqsOzWVyxXPPvXz0wr4qgZyCmaFNg',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'ystore-db.firebaseapp.com',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'ystore-db',
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'ystore-db.firebasestorage.app',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '669307805234',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:669307805234:web:be578670181474145ca62b',
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XJ3BF4MRDF',
      cmsSecretKey: process.env.NUXT_PUBLIC_CMS_SECRET_KEY || 'yberry-admin-2026'
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    baseURL: getBaseURL(),
    head: {
      title: 'Ystore | Premium Toys & Everyday Joys',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Ystore - Explore our handpicked collection of toys, games, figures, and creative essentials. Free delivery over R500.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://firebasestorage.googleapis.com', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://firebasestorage.googleapis.com' },
        { rel: 'preconnect', href: 'https://firestore.googleapis.com', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://firestore.googleapis.com' }
      ]
    }
  }
})
