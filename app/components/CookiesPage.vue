<template>
  <div class="w-full bg-[#FAFAFA] font-poppins min-h-screen py-10 sm:py-14">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <!-- Breadcrumb & Top Bar -->
      <nav class="flex items-center justify-between text-xs sm:text-sm text-neutral-500 font-medium pb-2 border-b border-neutral-200/80">
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="$emit('back-home')"
            class="hover:text-neutral-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FlowbiteIcon name="home" size="14" stroke-width="1.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span class="text-neutral-900 font-semibold">Cookie Policy</span>
        </div>

        <button
          type="button"
          @click="$emit('back-home')"
          class="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <FlowbiteIcon name="arrow-left" size="14" stroke-width="2" />
          <span>Back to storefront</span>
        </button>
      </nav>

      <!-- Main Legal Document Card -->
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-neutral-200/90 shadow-sm space-y-10 text-neutral-800">
        <!-- Header -->
        <header class="border-b border-neutral-100 pb-8 space-y-3">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#F4EB6A] shadow-xs"></span>
            <span class="text-xs uppercase tracking-widest font-bold text-neutral-900">
              Transparency &amp; Consent Management
            </span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-bold text-neutral-900 tracking-tight leading-tight">
            Cookie Policy &amp; POPIA Act Compliance Controls
          </h1>

          <p class="text-xs text-neutral-500 font-light">
            Effective Date: November 1, 2026 &bull; Compliant with the Protection of Personal Information Act (POPIA Act No. 4 of 2013) &bull; Published by Yellow Berry Store
          </p>
        </header>

        <!-- INTERACTIVE COOKIE PREFERENCE CONTROLLER (Embedded directly on page with toggles) -->
        <section class="bg-neutral-50 border-2 border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Interactive Consent Dashboard
              </span>
              <h2 class="text-xl font-bold text-neutral-900 mt-0.5">
                Your Cookie Consent Settings
              </h2>
              <p class="text-xs text-neutral-500 mt-1 font-light">
                Toggle options below to customize which tracking technologies you authorize Yellow Berry Store to utilize.
              </p>
            </div>

            <!-- Status Badge -->
            <div class="flex items-center gap-2 bg-white border border-neutral-200 px-3.5 py-1.5 rounded-xl text-xs font-medium self-start sm:self-auto shadow-xs">
              <span
                class="w-2.5 h-2.5 rounded-full"
                :class="hasConsented ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'"
              ></span>
              <span class="text-neutral-800 font-semibold">
                {{ hasConsented ? 'Consent Active' : 'Default Non-Essential Blocked' }}
              </span>
            </div>
          </div>

          <!-- POPIA Compliance Notice Card -->
          <div class="bg-white p-4 rounded-2xl border border-neutral-200 space-y-1.5 shadow-2xs">
            <span class="font-bold text-neutral-900 text-sm block">
              POPIA Act Statutory Compliance
            </span>
            <p class="text-xs text-neutral-600 leading-relaxed font-light">
              In terms of Section 11 of the South African Protection of Personal Information Act (POPIA Act No. 4 of 2013), Yellow Berry Store ensures that processing of personal information via non-essential cookies occurs only with your informed authorization. You have the right to modify or withdraw consent at any time.
            </p>
          </div>

          <!-- The 4 Categorized Toggles -->
          <div class="space-y-4">
            <!-- 1. Strictly Necessary (Locked ON) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 space-y-2 shadow-2xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <h3 class="text-sm font-semibold text-neutral-900">1. Strictly Necessary &amp; Security Cookies</h3>
                  <span class="text-[10px] uppercase font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                    Always Required
                  </span>
                </div>
                <!-- Locked toggle -->
                <div class="w-11 h-6 bg-neutral-900 rounded-full opacity-60 cursor-not-allowed flex items-center justify-end px-1" title="Required for store operation">
                  <div class="w-4 h-4 rounded-full bg-[#F4EB6A] shadow"></div>
                </div>
              </div>
              <p class="text-xs text-neutral-600 leading-relaxed font-light">
                Mandatory for shopping bag persistence, checkout tokens, payment gateway handshakes (Stripe, Payflex), session security, and firewall rate-limiting. Under Section 11 of POPIA, these essential cookies operate to deliver requested services.
              </p>
            </div>

            <!-- 2. Performance & Analytical Cookies (Toggleable) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 space-y-2 hover:border-neutral-300 transition-colors shadow-2xs">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">2. Performance &amp; Analytics Cookies</h3>
                  <p class="text-[11px] text-neutral-500 font-light">Store speed metrics &amp; anonymous navigation analysis</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="pagePreferences.analytics"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neutral-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                </label>
              </div>
              <p class="text-xs text-neutral-600 leading-relaxed font-light">
                Allows Yellow Berry Store to measure audience reach, observe which toy collections are popular, and eliminate technical page lag using anonymized telemetry.
              </p>
            </div>

            <!-- 3. Functionality & Customization Cookies (Toggleable) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 space-y-2 hover:border-neutral-300 transition-colors shadow-2xs">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">3. Functionality &amp; Customer Personalization</h3>
                  <p class="text-[11px] text-neutral-500 font-light">Preserves customer filter choices &amp; shopping preferences</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="pagePreferences.functional"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neutral-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                </label>
              </div>
              <p class="text-xs text-neutral-600 leading-relaxed font-light">
                Remembers your selected category filters, price sorting preferences, and dismissed promotional alerts across your visits.
              </p>
            </div>

            <!-- 4. Targeting & Marketing Cookies (Toggleable) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 space-y-2 hover:border-neutral-300 transition-colors shadow-2xs">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">4. Promotional &amp; Marketing Cookies</h3>
                  <p class="text-[11px] text-neutral-500 font-light">Seasonal announcements &amp; social campaign verification</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="pagePreferences.advertising"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neutral-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                </label>
              </div>
              <p class="text-xs text-neutral-600 leading-relaxed font-light">
                Used to deliver relevant special toy promotions, seasonal holiday flash deals, and verify advertising effectiveness without creating commercial behavioral dossiers.
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span v-if="saveMessage" class="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <FlowbiteIcon name="check" size="16" />
              {{ saveMessage }}
            </span>
            <span v-else class="text-xs text-neutral-500 font-light">
              Preferences are saved immediately to your browser.
            </span>

            <div class="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                @click="handleRejectAll"
                type="button"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                Reject Non-Essential
              </button>
              <button
                @click="handleSave"
                type="button"
                class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </section>

        <!-- Section 1: What Are Cookies -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">1. What Are Cookies &amp; Local Storage?</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            Cookies are compact text files stored on your device by websites you visit. They enable platforms to identify your browser, remember your shopping cart items, preserve your preferences, and maintain secure authenticated sessions.
          </p>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            Yellow Berry Store also uses modern browser storage mechanisms such as <code class="bg-neutral-100 text-neutral-900 px-1.5 py-0.5 rounded text-xs font-mono">localStorage</code> and <code class="bg-neutral-100 text-neutral-900 px-1.5 py-0.5 rounded text-xs font-mono">sessionStorage</code>. These operate locally on your computer without broadcasting data headers on every server request, maximizing digital privacy and speed.
          </p>
        </section>

        <!-- Section 2: Why We Use Cookies -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">2. Why Yellow Berry Store Uses Tracking Technologies</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            We use cookies strictly to deliver an enjoyable, dependable shopping experience:
          </p>
          <ul class="list-disc pl-5 text-sm text-neutral-700 space-y-1.5 leading-relaxed font-light">
            <li><strong>Cart Persistence:</strong> Retaining items placed in your shopping bag so they are waiting for you upon return.</li>
            <li><strong>Checkout Security:</strong> Managing encrypted handshakes with payment gateways (Stripe, Payflex, Card).</li>
            <li><strong>Member Access:</strong> Supporting authenticated sessions for the Yellow Berry Club loyalty program.</li>
            <li><strong>Store Health:</strong> Diagnosing performance bottlenecks and preventing automated bot intrusions.</li>
          </ul>
        </section>

        <!-- Section 3: Managing Cookies in Browsers -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">3. Managing Cookies in Your Web Browser</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            In addition to our on-page consent dashboard above, most contemporary browsers permit you to block or delete cookies through browser settings:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-neutral-700 font-light">
            <div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <strong class="font-bold text-neutral-900 block mb-1">Google Chrome</strong>
              Settings &gt; Privacy and Security &gt; Third-party cookies
            </div>
            <div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <strong class="font-bold text-neutral-900 block mb-1">Apple Safari</strong>
              Preferences &gt; Privacy &gt; Prevent cross-site tracking
            </div>
            <div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <strong class="font-bold text-neutral-900 block mb-1">Mozilla Firefox</strong>
              Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection
            </div>
            <div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <strong class="font-bold text-neutral-900 block mb-1">Microsoft Edge</strong>
              Settings &gt; Cookies and site permissions &gt; Manage and delete cookies
            </div>
          </div>
          <p class="text-xs text-neutral-500 font-light pt-1">
            <em>Note: Blocking strictly necessary cookies entirely in your browser will prevent items from being added to your shopping cart or completing online checkout.</em>
          </p>
        </section>

        <!-- Section 4: Contact Compliance -->
        <section class="space-y-3 border-t border-neutral-100 pt-8">
          <h2 class="text-xl font-bold text-neutral-900">4. Inquiries &amp; Information Officer Contact</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            For questions regarding our use of cookies or POPIA compliance practices, please contact our team:
          </p>
          <div class="text-sm text-neutral-800 space-y-1 pt-1 font-light">
            <p><strong>Compliance Email:</strong> <a href="mailto:admin@yellowberry.store" class="text-neutral-900 font-medium underline">admin@yellowberry.store</a></p>
            <p><strong>Customer Care:</strong> <a href="mailto:support@yellowberry.store" class="text-neutral-900 font-medium underline">support@yellowberry.store</a></p>
            <p><strong>Privacy Statement:</strong> <button type="button" @click="$emit('navigate-privacy')" class="text-neutral-900 underline font-medium cursor-pointer">Read Full Privacy Policy</button></p>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useCookieConsent } from '../composables/useCookieConsent'

defineEmits(['back-home', 'navigate-privacy'])

const {
  consentState,
  hasConsented,
  savePreferences,
  rejectNonEssential,
  initConsent
} = useCookieConsent()

const saveMessage = ref('')

const pagePreferences = reactive({
  necessary: true,
  analytics: false,
  functional: false,
  advertising: false
})

onMounted(() => {
  initConsent()
  pagePreferences.necessary = true
  pagePreferences.analytics = Boolean(consentState.categories.analytics)
  pagePreferences.functional = Boolean(consentState.categories.functional)
  pagePreferences.advertising = Boolean(consentState.categories.advertising)
})

const handleSave = () => {
  savePreferences({
    necessary: true,
    analytics: pagePreferences.analytics,
    functional: pagePreferences.functional,
    advertising: pagePreferences.advertising
  })
  saveMessage.value = 'Preferences saved successfully!'
  setTimeout(() => {
    saveMessage.value = ''
  }, 3500)
}

const handleRejectAll = () => {
  rejectNonEssential()
  pagePreferences.analytics = false
  pagePreferences.functional = false
  pagePreferences.advertising = false
  saveMessage.value = 'Non-essential cookies rejected.'
  setTimeout(() => {
    saveMessage.value = ''
  }, 3500)
}
</script>

