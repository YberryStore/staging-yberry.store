import { reactive, ref, computed } from 'vue'
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { useFirebaseAuth } from './useFirebaseAuth'
import { useCookieConsent } from './useCookieConsent'

export const defaultTrackingConfig = {
  gtmId: 'GTM-PNT79WT8',
  enableGtm: true,
  ga4Id: 'G-XJ3BF4MRDF',
  enableGa4: true,
  metaPixelId: '3007632809594306',
  enableMetaPixel: true,
  adsensePublisherId: '',
  enableAdsense: false
}

export const defaultPagesSeo = {
  home: {
    key: 'home',
    label: 'Home Storefront',
    path: '/',
    title: 'Ystore | Premium Toys & Everyday Joys',
    description: 'Explore our handpicked collection of developmental toys, puzzles, figures, and creative playsets. Fast nationwide delivery across South Africa.',
    keywords: 'toys South Africa, wooden toys, developmental toys, montessori, eco-friendly toys, cape town toys'
  },
  specials: {
    key: 'specials',
    label: 'Specials & Flash Deals',
    path: '/?view=specials',
    title: 'Specials & Flash Sales | Ystore',
    description: 'Limited-time deals, bundle promotions, and seasonal discounts on premium toys and developmental essentials.',
    keywords: 'toy deals South Africa, discounted toys, toy specials, sale toys'
  },
  category: {
    key: 'category',
    label: 'Product Catalog / Categories',
    path: '/?view=category',
    title: 'Browse All Categories | Ystore',
    description: 'Shop Building Blocks, Action Figures, Plush Toys, Puzzles, and Creative Playsets at Yellow Berry Store.',
    keywords: 'building blocks, action figures, plush toys, puzzles, creative toys'
  },
  blog: {
    key: 'blog',
    label: 'Blog & Stories',
    path: '/?view=blog',
    title: 'The Yellow Berry Chronicle | Stories, Craft & Play',
    description: 'Insightful guides, product spotlights, creative lifestyle trends, and behind-the-scenes stories from our Cape Town workshop.',
    keywords: 'parenting blog, child development, montessori guides, wooden toys benefits'
  },
  about: {
    key: 'about',
    label: 'About Yellow Berry Store',
    path: '/?view=about',
    title: 'About Us | Handcrafted Joy & Thoughtful Design - Ystore',
    description: 'Learn about Yellow Berry Store’s heritage, Cape Town roots, non-toxic materials, and dedication to sustainable, imaginative play.',
    keywords: 'about Ystore, Yellow Berry Store Cape Town, eco friendly toys SA'
  },
  contact: {
    key: 'contact',
    label: 'Contact Customer Concierge',
    path: '/?view=contact',
    title: 'Contact Concierge | Ystore Cape Town',
    description: 'Connect with Yellow Berry Store customer concierge for order tracking, bespoke gifting, and corporate inquiries.',
    keywords: 'contact Ystore, customer care, cape town toy store support'
  },
  privacy: {
    key: 'privacy',
    label: 'Privacy Policy (POPIA)',
    path: '/?view=privacy',
    title: 'Privacy Policy | POPIA & PAIA Compliance - Ystore',
    description: 'Learn how Yellow Berry Store protects your personal data in full compliance with the South African Protection of Personal Information Act.',
    keywords: 'POPIA compliance, privacy policy, data protection, Ystore privacy'
  },
  terms: {
    key: 'terms',
    label: 'Terms of Service',
    path: '/?view=terms',
    title: 'Terms & Conditions of Service | Ystore',
    description: 'Terms and conditions governing online purchases, courier delivery, payments, and product warranties at Yellow Berry Store.',
    keywords: 'terms of service, shopping terms, return policy, Ystore terms'
  },
  cookies: {
    key: 'cookies',
    label: 'Cookie Governance & Telemetry',
    path: '/?view=cookies',
    title: 'Cookie Policy & Consent Center | Ystore',
    description: 'Manage tracking cookies, telemetry preferences, and privacy controls in full compliance with Section 11 of POPIA.',
    keywords: 'cookie consent, cookie policy, POPIA cookies, telemetry settings'
  }
}

const TRACKING_STORAGE_KEY = 'ystore_cms_tracking_v1'
const SEO_STORAGE_KEY = 'ystore_cms_page_seo_v1'

// Smart sanitizers that extract clean tracking IDs whether the user types the ID or pastes a full snippet
export const sanitizeGtmId = (val = '') => {
  const raw = String(val || '').trim().toUpperCase()
  if (!raw) return ''
  const match = raw.match(/GTM-[A-Z0-9]{4,16}/)
  return match ? match[0] : ''
}

export const sanitizeGa4Id = (val = '') => {
  const raw = String(val || '').trim().toUpperCase()
  if (!raw) return ''
  const match = raw.match(/G-[A-Z0-9]{6,16}/)
  return match ? match[0] : ''
}

export const sanitizeMetaPixelId = (val = '') => {
  const raw = String(val || '').trim()
  if (!raw) return ''
  const match = raw.match(/\b(\d{8,20})\b/)
  return match ? match[1] : ''
}

export const sanitizeAdsenseId = (val = '') => {
  const raw = String(val || '').trim()
  if (!raw) return ''
  const match = raw.match(/(?:ca-)?(pub-\d{10,20})/i)
  return match ? `ca-${match[1].toLowerCase()}` : ''
}

// Initial cached tracking state
const getInitialTracking = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(TRACKING_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...defaultTrackingConfig,
          ...(parsed || {}),
          metaPixelId: parsed?.metaPixelId ? sanitizeMetaPixelId(parsed.metaPixelId) : defaultTrackingConfig.metaPixelId,
          gtmId: parsed?.gtmId ? sanitizeGtmId(parsed.gtmId) : defaultTrackingConfig.gtmId,
          ga4Id: parsed?.ga4Id ? sanitizeGa4Id(parsed.ga4Id) : defaultTrackingConfig.ga4Id
        }
      }
    } catch {}
  }
  return { ...defaultTrackingConfig }
}

const getInitialPagesSeo = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(SEO_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...defaultPagesSeo,
          ...(parsed || {})
        }
      }
    } catch {}
  }
  return { ...defaultPagesSeo }
}

// Shared reactive singleton state across entire application
const sharedTracking = reactive(getInitialTracking())
const sharedPagesSeo = reactive(getInitialPagesSeo())
const isSavingSeo = ref(false)
let trackingListenerInitialized = false

export const useSiteSeo = () => {
  const { initFirebase } = useFirebaseAuth()

  const getDb = () => {
    const instances = initFirebase()
    return instances?.db || null
  }

  // Real-time Firestore listener for live cloud updates
  const initTrackingListener = () => {
    if (typeof window === 'undefined' || trackingListenerInitialized) return
    const db = getDb()
    if (!db) return

    trackingListenerInitialized = true

    onSnapshot(
      doc(db, 'settings', 'seo_tracking'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() || {}
          if (data.tracking && typeof data.tracking === 'object') {
            applyTrackingUpdates(data.tracking)
          }
          if (data.pagesSeo && typeof data.pagesSeo === 'object') {
            Object.assign(sharedPagesSeo, data.pagesSeo)
            try {
              localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(sharedPagesSeo))
            } catch {}
          }
        }
      },
      (err) => {
        console.warn('Firestore seo_tracking listener warning:', err)
      }
    )
  }

  const applyTrackingUpdates = (updates = {}) => {
    if (typeof updates.gtmId === 'string') {
      sharedTracking.gtmId = sanitizeGtmId(updates.gtmId) || updates.gtmId.trim()
    }
    if (typeof updates.ga4Id === 'string') {
      sharedTracking.ga4Id = sanitizeGa4Id(updates.ga4Id) || updates.ga4Id.trim()
    }
    if (typeof updates.metaPixelId === 'string') {
      sharedTracking.metaPixelId = sanitizeMetaPixelId(updates.metaPixelId) || updates.metaPixelId.trim()
    }
    if (typeof updates.adsensePublisherId === 'string') {
      sharedTracking.adsensePublisherId = sanitizeAdsenseId(updates.adsensePublisherId) || updates.adsensePublisherId.trim()
    }
    if (typeof updates.enableGtm === 'boolean') sharedTracking.enableGtm = updates.enableGtm
    if (typeof updates.enableGa4 === 'boolean') sharedTracking.enableGa4 = updates.enableGa4
    if (typeof updates.enableMetaPixel === 'boolean') sharedTracking.enableMetaPixel = updates.enableMetaPixel
    if (typeof updates.enableAdsense === 'boolean') sharedTracking.enableAdsense = updates.enableAdsense

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(sharedTracking))
      } catch {}
    }
  }

  // Update tracking configuration optimistically and sync to Firestore
  const updateTrackingConfig = async (updates = {}) => {
    applyTrackingUpdates(updates)

    const db = getDb()
    if (db) {
      isSavingSeo.value = true
      try {
        const payload = {
          tracking: JSON.parse(JSON.stringify(sharedTracking)),
          pagesSeo: JSON.parse(JSON.stringify(sharedPagesSeo)),
          updatedAt: serverTimestamp()
        }
        await setDoc(doc(db, 'settings', 'seo_tracking'), payload, { merge: true })

        // Also update settings/public_config for public storefront clients
        await setDoc(doc(db, 'settings', 'public_config'), {
          tracking: {
            gtmId: sharedTracking.gtmId,
            enableGtm: sharedTracking.enableGtm,
            ga4Id: sharedTracking.ga4Id,
            enableGa4: sharedTracking.enableGa4,
            metaPixelId: sharedTracking.metaPixelId,
            enableMetaPixel: sharedTracking.enableMetaPixel,
            adsensePublisherId: sharedTracking.adsensePublisherId,
            enableAdsense: sharedTracking.enableAdsense
          }
        }, { merge: true })
      } catch (err) {
        console.warn('Firestore tracking write failed, saved to local cache:', err)
      } finally {
        isSavingSeo.value = false
      }
    }
    return true
  }

  // Update page-level SEO metadata
  const updatePageSeo = async (pageKey, updates = {}) => {
    if (!sharedPagesSeo[pageKey]) return false
    sharedPagesSeo[pageKey] = {
      ...sharedPagesSeo[pageKey],
      ...updates
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(sharedPagesSeo))
      } catch {}
    }

    const db = getDb()
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'seo_tracking'), {
          pagesSeo: JSON.parse(JSON.stringify(sharedPagesSeo)),
          updatedAt: serverTimestamp()
        }, { merge: true })
      } catch (err) {
        console.warn('Firestore pagesSeo write failed:', err)
      }
    }
    return true
  }

  // Computed valid IDs
  const validGtmId = computed(() => sanitizeGtmId(sharedTracking.gtmId))
  const validGa4Id = computed(() => sanitizeGa4Id(sharedTracking.ga4Id))
  const validMetaPixelId = computed(() => sanitizeMetaPixelId(sharedTracking.metaPixelId))
  const validAdsenseId = computed(() => sanitizeAdsenseId(sharedTracking.adsensePublisherId))

  // Route / PageView tracking dispatcher (POPIA compliant)
  const trackPageView = (path = '/', title = '') => {
    if (typeof window === 'undefined') return
    const { allowsAnalytics, allowsAdvertising } = useCookieConsent()
    const w = window

    // 1. Google Tag Manager page_view
    if (validGtmId.value && sharedTracking.enableGtm && allowsAnalytics.value && Array.isArray(w.dataLayer)) {
      w.dataLayer.push({
        event: 'page_view',
        page_path: path,
        page_title: title || document.title
      })
    }

    // 2. Google Analytics 4 page_view
    if (validGa4Id.value && sharedTracking.enableGa4 && allowsAnalytics.value && typeof w.gtag === 'function') {
      w.gtag('config', validGa4Id.value, {
        page_path: path,
        page_title: title || document.title
      })
    }

    // 3. Meta Pixel PageView
    if (validMetaPixelId.value && sharedTracking.enableMetaPixel && allowsAdvertising.value && typeof w.fbq === 'function') {
      w.fbq('track', 'PageView')
    }
  }

  // E-commerce conversion event tracking dispatcher
  const trackEcommerceEvent = (eventName, data = {}) => {
    if (typeof window === 'undefined') return
    const { allowsAnalytics, allowsAdvertising } = useCookieConsent()
    const w = window

    if (allowsAnalytics.value) {
      if (Array.isArray(w.dataLayer)) {
        w.dataLayer.push({
          event: eventName,
          ecommerce: data
        })
      }
      if (typeof w.gtag === 'function') {
        w.gtag('event', eventName, data)
      }
    }

    if (allowsAdvertising.value && typeof w.fbq === 'function') {
      switch (eventName) {
        case 'add_to_cart':
          w.fbq('track', 'AddToCart', {
            content_ids: data.items?.map((it) => it.id) || [],
            value: data.value || 0,
            currency: 'ZAR'
          })
          break
        case 'begin_checkout':
          w.fbq('track', 'InitiateCheckout', {
            num_items: data.items?.length || 1,
            value: data.value || 0,
            currency: 'ZAR'
          })
          break
        case 'purchase':
          w.fbq('track', 'Purchase', {
            content_ids: data.items?.map((it) => it.id) || [],
            value: data.value || 0,
            currency: 'ZAR'
          })
          break
        default:
          w.fbq('trackCustom', eventName, data)
      }
    }
  }

  return {
    trackingConfig: sharedTracking,
    pagesSeo: sharedPagesSeo,
    validGtmId,
    validGa4Id,
    validMetaPixelId,
    validAdsenseId,
    isSavingSeo,
    initTrackingListener,
    updateTrackingConfig,
    updatePageSeo,
    trackPageView,
    trackEcommerceEvent,
    sanitizeGtmId,
    sanitizeGa4Id,
    sanitizeMetaPixelId,
    sanitizeAdsenseId
  }
}

