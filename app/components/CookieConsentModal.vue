<template>
  <div v-if="!isCmsRoute">
    <!-- 1. Floating Bottom Banner (Prompt for visitors who haven't selected preferences) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-8 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-8 opacity-0"
    >
      <div
        v-if="isBannerVisible && !isPreferencesModalOpen"
        class="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none font-poppins"
        role="dialog"
        aria-label="Cookie consent banner"
      >
        <div class="max-w-4xl mx-auto bg-neutral-900 text-white border border-neutral-800 shadow-2xl rounded-3xl p-5 sm:p-6 pointer-events-auto backdrop-blur-md">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div class="space-y-2 flex-1">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#F4EB6A] shadow-xs"></span>
                <span class="text-xs font-semibold uppercase tracking-wider text-[#F4EB6A]">
                  POPIA Act &amp; Cookie Compliance
                </span>
              </div>
              <p class="text-xs text-neutral-300 leading-relaxed font-light">
                Yellow Berry Store is committed to safeguarding your personal information in strict compliance with the <strong>South African Protection of Personal Information Act (POPIA Act No. 4 of 2013)</strong>. We utilize essential cookies and encrypted local storage to guarantee secure shopping, maintain cart continuity, and elevate your experience.
              </p>
              <div class="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400 pt-0.5">
                <button
                  type="button"
                  @click="$emit('navigate', 'privacy')"
                  class="text-neutral-300 underline hover:text-[#F4EB6A] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  @click="$emit('navigate', 'cookies')"
                  class="text-neutral-300 underline hover:text-[#F4EB6A] transition-colors cursor-pointer"
                >
                  Cookie Policy
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  @click="$emit('navigate', 'terms')"
                  class="text-neutral-300 underline hover:text-[#F4EB6A] transition-colors cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0">
              <button
                @click="openPreferencesModal"
                type="button"
                class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-700 text-xs font-medium text-neutral-200 bg-neutral-800/80 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                Customize
              </button>
              <button
                @click="rejectNonEssential"
                type="button"
                class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-700 text-xs font-medium text-neutral-200 bg-neutral-800/80 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                Reject Non-Essential
              </button>
              <button
                @click="acceptAll"
                type="button"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 text-xs font-semibold transition-all cursor-pointer shadow-md active:scale-95"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 2. Detailed Cookie Preferences Modal (POPIA & Store Policy Compliance) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPreferencesModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-poppins"
        @click.self="closePreferencesModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
      >
        <div class="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-start justify-between border-b border-neutral-100 pb-4">
            <div>
              <span class="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
                POPIA Act Compliance
              </span>
              <h2 id="cookie-modal-title" class="text-xl font-bold text-neutral-900 mt-0.5">
                Cookie Consent &amp; Privacy Preferences
              </h2>
              <p class="text-xs text-neutral-500 mt-1">
                Customize which categories of cookies and local storage tokens you authorize Yellow Berry Store to utilize.
              </p>
            </div>
            <button
              @click="closePreferencesModal"
              type="button"
              aria-label="Close dialog"
              class="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <FlowbiteIcon name="close" size="18" />
            </button>
          </div>

          <!-- POPIA Compliance Assurance Card -->
          <div class="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 text-xs text-neutral-700 space-y-1">
            <span class="font-bold text-neutral-900 block">
              Protection of Personal Information Act (POPIA Act No. 4 of 2013)
            </span>
            <p class="text-[11px] text-neutral-600 leading-relaxed font-light">
              In accordance with Section 11 of POPIA and our digital privacy standards, you hold sovereign authority over non-essential tracking cookies and analytics telemetry. Adjust your preferences below and save.
            </p>
          </div>

          <!-- Category Toggles List -->
          <div class="space-y-4">
            <!-- 1. Strictly Necessary Cookies (Locked ON) -->
            <div class="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-semibold text-neutral-900">1. Strictly Necessary &amp; Security Cookies</h3>
                  <span class="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-md">
                    Always Active
                  </span>
                </div>
                <!-- Locked switch -->
                <div class="w-10 h-6 bg-neutral-900 rounded-full opacity-60 cursor-not-allowed flex items-center justify-end px-1" title="Mandatory for store operation">
                  <div class="w-4 h-4 rounded-full bg-[#F4EB6A] shadow"></div>
                </div>
              </div>
              <p class="text-xs text-neutral-600 leading-relaxed font-light">
                Essential for core storefront operations: shopping cart continuity, session tokens, secure payment gateway handshakes (Stripe, Payflex), rate-limiting defenses, and authentication.
              </p>
              <div class="text-[10px] font-mono text-neutral-500">
                Examples: Cart contents, checkout tokens, Firebase Auth sessions, security verification.
              </div>
            </div>

            <!-- 2. Performance & Analytical Cookies (Toggleable) -->
            <div class="p-4 rounded-2xl border border-neutral-200 bg-white space-y-2 hover:border-neutral-300 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">2. Performance &amp; Analytics Cookies</h3>
                  <p class="text-[11px] text-neutral-500">Telemetry &amp; store navigation performance</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="tempPreferences.analytics"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neutral-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                </label>
              </div>
              <p class="text-xs text-neutral-600 leading-relaxed font-light">
                Allows Yellow Berry Store to measure site engagement, determine popular toy categories, and diagnose infrastructure speed bottlenecks using anonymized IP telemetry.
              </p>
            </div>

            <!-- 3. Functional & Experience Cookies (Toggleable) -->
            <div class="p-4 rounded-2xl border border-neutral-200 bg-white space-y-2 hover:border-neutral-300 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">3. Functionality &amp; Storefront Personalization</h3>
                  <p class="text-[11px] text-neutral-500">Remembers customer preferences &amp; wishlist items</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="tempPreferences.functional"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neutral-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                </label>
              </div>
              <p class="text-xs text-neutral-600 leading-relaxed font-light">
                Preserves customer display filter preferences, currency notation, category sorting states, and acknowledged announcements across visits.
              </p>
            </div>

            <!-- 4. Targeting & Marketing Cookies (Toggleable) -->
            <div class="p-4 rounded-2xl border border-neutral-200 bg-white space-y-2 hover:border-neutral-300 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">4. Promotional &amp; Marketing Cookies</h3>
                  <p class="text-[11px] text-neutral-500">Promotions, seasonal specials &amp; social channels</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="tempPreferences.advertising"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neutral-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                </label>
              </div>
              <p class="text-xs text-neutral-600 leading-relaxed font-light">
                Used to showcase relevant new toy releases, seasonal flash sales, and measure campaign reach across external platforms without selling your personal dossiers.
              </p>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="border-t border-neutral-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              @click="$emit('navigate', 'cookies'); closePreferencesModal()"
              class="text-xs text-neutral-500 hover:text-neutral-900 underline order-last sm:order-first transition-colors cursor-pointer"
            >
              Read Full Cookie Policy Documentation
            </button>

            <div class="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                @click="rejectNonEssential"
                type="button"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                Reject Non-Essential
              </button>
              <button
                @click="handleSavePreferences"
                type="button"
                class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, watch, computed, onMounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useCookieConsent } from '../composables/useCookieConsent'

const props = defineProps({
  currentView: {
    type: String,
    default: 'home'
  }
})

const emit = defineEmits(['navigate'])

const {
  consentState,
  isBannerVisible,
  isPreferencesModalOpen,
  initConsent,
  acceptAll,
  rejectNonEssential,
  savePreferences,
  openPreferencesModal,
  closePreferencesModal
} = useCookieConsent()

const isCmsRoute = computed(() =>
  props.currentView === 'admin' || props.currentView === 'cms-auth'
)

const tempPreferences = reactive({
  necessary: true,
  analytics: false,
  functional: false,
  advertising: false
})

// Sync modal local toggles whenever modal opens
watch(
  () => isPreferencesModalOpen.value,
  (isOpen) => {
    if (isOpen) {
      tempPreferences.necessary = true
      tempPreferences.analytics = Boolean(consentState.categories.analytics)
      tempPreferences.functional = Boolean(consentState.categories.functional)
      tempPreferences.advertising = Boolean(consentState.categories.advertising)
    }
  }
)

const handleSavePreferences = () => {
  savePreferences({
    necessary: true,
    analytics: tempPreferences.analytics,
    functional: tempPreferences.functional,
    advertising: tempPreferences.advertising
  })
}

onMounted(() => {
  initConsent()
})
</script>

