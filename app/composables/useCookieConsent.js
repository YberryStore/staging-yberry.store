import { reactive, ref, computed } from 'vue'

const STORAGE_KEY = 'ystore_cookie_consent_v1'
const CONSENT_VERSION = '2026.1'

const defaultCategories = {
  necessary: true,   // Always required for shopping cart, session, security
  analytics: false,  // Telemetry & performance
  functional: false, // Wishlist & shopping preferences
  advertising: false // Marketing & partner promotions
}

const consentState = reactive({
  hasConsented: false,
  categories: { ...defaultCategories },
  consentDate: '',
  version: CONSENT_VERSION,
  frameworks: {
    popia: true // South Africa Protection of Personal Information Act
  }
})

const isPreferencesModalOpen = ref(false)
const isBannerVisible = ref(false)
let isInitialized = false

export const useCookieConsent = () => {
  const initConsent = () => {
    if (typeof window === 'undefined' || isInitialized) return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed.categories === 'object') {
          consentState.hasConsented = Boolean(parsed.hasConsented)
          consentState.categories.necessary = true
          consentState.categories.analytics = Boolean(parsed.categories.analytics)
          consentState.categories.functional = Boolean(parsed.categories.functional)
          consentState.categories.advertising = Boolean(parsed.categories.advertising)
          consentState.consentDate = parsed.consentDate || new Date().toISOString()
          consentState.version = parsed.version || CONSENT_VERSION
          isBannerVisible.value = !parsed.hasConsented
        }
      } else {
        // No stored consent found: show banner to prompt for consent
        isBannerVisible.value = true
      }
    } catch {
      isBannerVisible.value = true
    }

    isInitialized = true
  }

  const persistConsent = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentState))
    } catch {
      // Ignore storage write issues
    }
  }

  const acceptAll = () => {
    consentState.hasConsented = true
    consentState.categories.necessary = true
    consentState.categories.analytics = true
    consentState.categories.functional = true
    consentState.categories.advertising = true
    consentState.consentDate = new Date().toISOString()
    isBannerVisible.value = false
    isPreferencesModalOpen.value = false
    persistConsent()
    dispatchConsentChangeEvent()
  }

  const rejectNonEssential = () => {
    consentState.hasConsented = true
    consentState.categories.necessary = true
    consentState.categories.analytics = false
    consentState.categories.functional = false
    consentState.categories.advertising = false
    consentState.consentDate = new Date().toISOString()
    isBannerVisible.value = false
    isPreferencesModalOpen.value = false
    persistConsent()
    dispatchConsentChangeEvent()
  }

  const savePreferences = (custom) => {
    consentState.hasConsented = true
    consentState.categories.necessary = true
    if (custom) {
      if (typeof custom.analytics === 'boolean') consentState.categories.analytics = custom.analytics
      if (typeof custom.functional === 'boolean') consentState.categories.functional = custom.functional
      if (typeof custom.advertising === 'boolean') consentState.categories.advertising = custom.advertising
    }
    consentState.consentDate = new Date().toISOString()
    isBannerVisible.value = false
    isPreferencesModalOpen.value = false
    persistConsent()
    dispatchConsentChangeEvent()
  }

  const openPreferencesModal = () => {
    isPreferencesModalOpen.value = true
  }

  const closePreferencesModal = () => {
    isPreferencesModalOpen.value = false
  }

  const resetConsent = () => {
    consentState.hasConsented = false
    consentState.categories = { ...defaultCategories }
    consentState.consentDate = ''
    isBannerVisible.value = true
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {}
    }
    dispatchConsentChangeEvent()
  }

  const dispatchConsentChangeEvent = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('ystore-cookie-consent-updated', {
      detail: JSON.parse(JSON.stringify(consentState))
    }))
  }

  return {
    consentState,
    isBannerVisible,
    isPreferencesModalOpen,
    initConsent,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    openPreferencesModal,
    closePreferencesModal,
    resetConsent,
    hasConsented: computed(() => consentState.hasConsented),
    allowsAnalytics: computed(() => Boolean(consentState.hasConsented && consentState.categories.analytics)),
    allowsAdvertising: computed(() => Boolean(consentState.hasConsented && consentState.categories.advertising)),
    allowsFunctional: computed(() => Boolean(consentState.hasConsented && consentState.categories.functional))
  }
}

