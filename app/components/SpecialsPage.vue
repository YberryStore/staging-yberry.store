<template>
  <div class="w-full bg-white font-poppins min-h-screen">
    <!-- Sub-header Bar: "All categories" & Breadcrumbs -->
    <section class="w-full pt-6 pb-2">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- "All categories" Button & Dropdown -->
        <div v-if="categoriesList.length > 0" class="relative inline-block">
          <button
            type="button"
            @click="categoryMenuOpen = !categoryMenuOpen"
            class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 font-medium text-sm transition-all duration-200 shadow-xs cursor-pointer select-none active:scale-95"
            aria-label="All categories"
          >
            <FlowbiteIcon name="bars" size="18" stroke-width="2" />
            <span>All categories</span>
            <FlowbiteIcon
              name="chevron-down"
              size="14"
              stroke-width="2"
              :class="['transition-transform duration-200', categoryMenuOpen ? 'rotate-180' : '']"
            />
          </button>

          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div
              v-if="categoryMenuOpen"
              class="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-3 z-30 font-poppins"
            >
              <a
                v-for="cat in categoriesList"
                :key="cat"
                href="#"
                @click.prevent="categoryMenuOpen = false; selectedFilter = cat"
                class="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-[#FEFEEB] hover:text-neutral-900 transition-colors"
              >
                {{ cat }}
              </a>
            </div>
          </transition>
        </div>

        <!-- Horizontal Divider -->
        <div v-if="categoriesList.length > 0" class="border-b border-neutral-200 mt-4 mb-4"></div>

        <!-- Breadcrumbs Navigation -->
        <nav class="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 font-normal" aria-label="Breadcrumb">
          <button
            type="button"
            @click="$emit('back-home')"
            class="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>&gt;</span>
          <span class="text-neutral-900 font-medium">Specials &amp; Deals</span>
        </nav>
      </div>
    </section>

    <!-- Hero / Flash Sale Announcement Banner -->
    <section class="py-6 sm:py-8">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative rounded-3xl overflow-hidden bg-neutral-900 text-white shadow-2xl p-8 sm:p-12 lg:p-16 min-h-[420px] flex flex-col justify-between">
          <!-- Background image with gradient blend -->
          <img
            :src="useAsset('/images/promo-banner.jpg')"
            alt="Specials and promotional offers"
            class="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter brightness-90 hover:scale-102 transition-transform duration-700"
            style="object-fit: cover !important; object-position: center !important;"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-900/40"></div>

          <!-- Top Row: Badge & Countdown Timer -->
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
            <div class="flex items-center gap-3">
              <span v-if="showBadgePills" class="inline-flex items-center gap-1.5 bg-[#FEFEEB] text-neutral-900 border border-[#F4EB6A] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                <FlowbiteIcon name="fire" size="14" stroke-width="2" class="text-red-500" />
                <span>Limited-Time Specials</span>
              </span>
              <span class="text-xs sm:text-sm text-[#F4EB6A] font-medium hidden sm:inline">
                Save up to 40% this week
              </span>
            </div>

            <!-- Real-time Flash Deals Countdown Timer -->
            <div class="flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-neutral-700 shadow-md">
              <FlowbiteIcon name="clock" size="18" stroke-width="2" class="text-[#F4EB6A]" />
              <span class="text-xs text-neutral-300 font-medium mr-1.5">Ends in:</span>
              <div class="flex items-center gap-1.5 text-center font-mono">
                <div class="bg-neutral-800 px-2 py-1 rounded-lg">
                  <span class="text-sm font-bold text-white">{{ timerDays }}</span>
                  <span class="text-[9px] text-neutral-400 block -mt-0.5">d</span>
                </div>
                <span class="text-neutral-500 font-bold">:</span>
                <div class="bg-neutral-800 px-2 py-1 rounded-lg">
                  <span class="text-sm font-bold text-white">{{ timerHours }}</span>
                  <span class="text-[9px] text-neutral-400 block -mt-0.5">h</span>
                </div>
                <span class="text-neutral-500 font-bold">:</span>
                <div class="bg-neutral-800 px-2 py-1 rounded-lg">
                  <span class="text-sm font-bold text-white">{{ timerMinutes }}</span>
                  <span class="text-[9px] text-neutral-400 block -mt-0.5">m</span>
                </div>
                <span class="text-neutral-500 font-bold">:</span>
                <div class="bg-neutral-800 px-2 py-1 rounded-lg">
                  <span class="text-sm font-bold text-[#F4EB6A]">{{ timerSeconds }}</span>
                  <span class="text-[9px] text-neutral-400 block -mt-0.5">s</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle Content -->
          <div class="relative z-10 max-w-2xl my-6">
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-[1.1]">
              Exclusive <span class="font-serif italic font-normal text-[#F4EB6A]">Specials</span>
            </h1>
            <p class="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-xl">
              Discover verified markdown prices across our curated collection of featured products, playful essentials, and special seasonal arrivals.
            </p>
          </div>

          <!-- Bottom Row: Copyable Voucher Codes (Rendered only when coupons are configured) -->
          <div v-if="coupons.length > 0" class="relative z-10 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-4 sm:gap-6">
            <span class="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Active Coupons:</span>
            <div
              v-for="coupon in coupons"
              :key="coupon.code"
              @click="copyCoupon(coupon.code)"
              class="inline-flex items-center gap-2 bg-neutral-800/90 hover:bg-neutral-800 border border-neutral-700 hover:border-[#F4EB6A] px-3.5 py-1.5 rounded-xl cursor-pointer transition-all duration-200 group text-xs shadow-sm"
              :title="`Click to copy ${coupon.code}`"
            >
              <FlowbiteIcon name="tag" size="14" stroke-width="2" class="text-[#F4EB6A]" />
              <span class="font-mono font-bold text-white">{{ coupon.code }}</span>
              <span class="text-neutral-400 text-[11px]">({{ coupon.discount }})</span>
              <span class="text-[10px] text-[#F4EB6A] font-semibold group-hover:underline ml-1">
                {{ copiedCode === coupon.code ? 'Copied!' : 'Copy' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Proposition Features Bar (4 Distinct Rounded Cards) -->
    <section class="my-6 sm:my-10">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="bg-[#FEFCE8] border border-[#F4EB6A]/30 rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-transform hover:-translate-y-0.5 duration-200"
          >
            <div class="w-14 h-12 flex items-center justify-center shrink-0">
              <img
                :src="useAsset(feature.icon)"
                :alt="feature.title"
                class="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                {{ feature.title }}
              </h3>
              <p class="text-xs text-neutral-600 mt-0.5 font-light">
                {{ feature.subtitle }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters & Sorting Bar -->
    <section class="mt-10 sm:mt-12">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <!-- Filter Tabs -->
          <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              v-for="filter in filterTabs"
              :key="filter.label"
              type="button"
              @click="selectedFilter = filter.value"
              :class="[
                'px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer',
                selectedFilter === filter.value
                  ? 'bg-[#F4EB6A] text-neutral-900 shadow-xs font-semibold'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
              ]"
            >
              <span>{{ filter.label }}</span>
              <span class="ml-1 text-[11px] opacity-75">({{ filter.count }})</span>
            </button>
          </div>

          <!-- Sort Selector -->
          <div class="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <span class="text-xs text-neutral-500 font-medium hidden sm:inline">Sort by:</span>
            <select
              v-model="selectedSort"
              class="bg-white text-neutral-800 text-xs sm:text-sm font-medium px-4 py-2 rounded-full border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] cursor-pointer shadow-xs"
            >
              <option value="discount-desc">Highest Discount (%)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Specials Product Grid -->
    <section class="py-10 sm:py-12">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Empty State when no specials exist -->
        <div
          v-if="sortedSpecials.length === 0"
          class="bg-neutral-50 rounded-3xl border border-neutral-200/80 p-12 text-center flex flex-col items-center justify-center min-h-[280px]"
        >
          <div class="w-14 h-14 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 mb-3">
            <FlowbiteIcon name="tag" size="24" stroke-width="1.5" />
          </div>
          <h3 class="text-lg font-semibold text-neutral-900">No active specials right now</h3>
          <p class="text-xs sm:text-sm text-neutral-500 mt-1 max-w-md">
            Specials and promotional items will appear here as soon as they are published in <code class="text-neutral-700 font-semibold">ystore-db</code>.
          </p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in sortedSpecials"
            :key="product.id"
            class="group relative flex flex-col rounded-3xl bg-white border border-neutral-200/90 p-4 shadow-xs hover:shadow-xl hover:border-[#F4EB6A] transition-all duration-300 font-poppins cursor-pointer"
            @click="$emit('view-product', product)"
          >
            <!-- Image Area with Badges -->
            <div class="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#ECECEC] mb-4">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              <!-- Top Left Badges -->
              <div v-if="showBadgePills && (product.discount || product.tag)" class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                <span v-if="product.discount" class="bg-[#F4EB6A] text-neutral-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  -{{ product.discount }}% OFF
                </span>
                <span
                  v-if="product.tag"
                  class="bg-neutral-900/90 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs"
                >
                  {{ product.tag }}
                </span>
              </div>

              <!-- Wishlist Button -->
              <button
                type="button"
                @click.stop="$emit('toggle-wishlist', { product, isWishlisted: false })"
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-neutral-600 hover:text-red-500 hover:bg-white flex items-center justify-center shadow-xs transition-all duration-200 z-10 cursor-pointer"
                aria-label="Save to Wishlist"
              >
                <FlowbiteIcon name="heart" size="16" stroke-width="1.5" />
              </button>

              <!-- Quick View Floating Button on Hover -->
              <button
                type="button"
                @click.stop="$emit('quick-view', product)"
                class="absolute bottom-3 right-3 px-3 py-1.5 bg-neutral-900/90 hover:bg-neutral-900 text-white text-xs font-medium rounded-full shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 cursor-pointer z-10"
              >
                <FlowbiteIcon name="eye" size="14" stroke-width="2" />
                <span>Quick view</span>
              </button>
            </div>

            <!-- Product Meta -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <!-- Category & Star Rating -->
                <div class="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                  <span class="uppercase font-semibold tracking-wider text-[11px] text-neutral-500">{{ product.category }}</span>
                  <div class="flex items-center text-[#EAB308]">
                    <FlowbiteIcon name="star" size="13" fill class="text-[#EAB308]" />
                    <span class="text-neutral-700 font-semibold ml-1 text-xs">{{ product.rating }}</span>
                    <span class="text-neutral-400 ml-0.5">({{ product.reviews }})</span>
                  </div>
                </div>

                <!-- Product Title -->
                <h3 class="text-base font-bold text-neutral-900 group-hover:text-neutral-800 transition-colors line-clamp-2 leading-snug">
                  {{ product.name }}
                </h3>

                <!-- Stock Urgency Bar -->
                <div class="mt-3">
                  <div class="flex items-center justify-between text-[11px] font-medium text-neutral-500 mb-1">
                    <span class="text-amber-700 font-semibold">{{ product.claimedPercent }}% claimed</span>
                    <span class="text-red-600 font-medium">Only {{ product.stockLeft }} left</span>
                  </div>
                  <div class="w-full bg-neutral-200/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      class="bg-amber-500 h-full rounded-full transition-all duration-500"
                      :style="{ width: `${product.claimedPercent}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Price & Add to Cart Action -->
              <div class="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <div class="flex flex-col">
                  <div class="flex items-baseline gap-2">
                    <span class="text-xl font-bold text-neutral-900">R{{ product.price }}</span>
                    <span class="text-xs text-neutral-400 line-through">R{{ product.originalPrice }}</span>
                  </div>
                  <span class="text-[11px] font-medium text-emerald-700">Save R{{ product.originalPrice - product.price }}</span>
                </div>

                <button
                  type="button"
                  @click.stop="$emit('add-to-cart', product)"
                  class="bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 font-semibold p-2.5 sm:px-4 sm:py-2.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
                  aria-label="Add to Cart"
                >
                  <FlowbiteIcon name="cart" size="16" stroke-width="2" />
                  <span class="text-xs hidden sm:inline">Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bundle & Save Spotlight (Rendered only when bundles are configured) -->
    <section v-if="bundles.length > 0" class="py-12 sm:py-16 bg-[#FFFEE5]/60 border-y border-[#F4EB6A]/40 font-poppins">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span v-if="showBadgePills" class="inline-block bg-[#FEFEEB] text-neutral-900 border border-[#F4EB6A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Curated Bundles
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            Bundle &amp; <span class="font-serif italic font-normal text-neutral-700">Save More</span>
          </h2>
          <p class="text-sm sm:text-base text-neutral-600 mt-2">
            Pair popular favourites together to unlock our highest discounts plus free shipping.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            v-for="bundle in bundles"
            :key="bundle.id"
            class="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm flex flex-col md:flex-row items-center gap-6"
          >
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <span class="text-xs font-bold text-amber-700 uppercase tracking-wide">{{ bundle.subtitle }}</span>
                <h3 class="text-xl font-bold text-neutral-900 mt-1">{{ bundle.name }}</h3>
                <p class="text-xs text-neutral-500 font-light mt-1">
                  {{ bundle.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- "Don't miss out and Subscribe" Newsletter Banner -->
    <section class="my-16 sm:my-24">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl bg-[#D9D9D9] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <!-- Left Heading -->
          <div class="max-w-md text-left w-full">
            <span class="text-sm sm:text-base text-neutral-800 font-normal block leading-tight">
              Get secret discounts first
            </span>
            <h2 class="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-none my-1.5">
              Subscribe
            </h2>
            <p class="text-xs sm:text-sm text-neutral-700 font-light mt-1">
              Join our VIP list to receive instant flash sale notifications and extra coupons.
            </p>
          </div>

          <!-- Right Form & Disclaimer -->
          <div class="w-full max-w-lg flex flex-col">
            <form @submit.prevent="handleNewsletterSubmit" class="flex flex-col">
              <!-- White Pill Input Container -->
              <div class="bg-white rounded-full p-1 pl-5 shadow-xs flex items-center justify-between border border-neutral-300/80 focus-within:border-neutral-900 transition-all">
                <input
                  v-model="newsletterEmail"
                  type="email"
                  required
                  placeholder="Email"
                  class="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none pr-3"
                />
                <button
                  type="submit"
                  class="bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 font-medium px-7 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  Subscribe
                </button>
              </div>

              <!-- Disclaimer with Checkbox -->
              <label class="flex items-start gap-2.5 text-[10px] sm:text-[11px] text-neutral-700 leading-tight mt-3 cursor-pointer pl-1">
                <input
                  v-model="newsletterAgreed"
                  type="checkbox"
                  required
                  class="mt-0.5 rounded text-[#F4EB6A] focus:ring-[#F4EB6A] border-neutral-400 shrink-0"
                />
                <span>
                  I agree to receive promotional updates, discount codes, and new arrival alerts from Ystore. Unsubscribe anytime.
                </span>
              </label>

              <!-- Success Alert -->
              <transition name="fade">
                <div
                  v-if="newsletterSubmitted"
                  class="mt-3 p-3 rounded-xl bg-white/90 text-neutral-900 text-xs font-medium flex items-center gap-2 border border-neutral-300"
                >
                  <FlowbiteIcon name="check" size="16" stroke-width="2" class="text-green-600 shrink-0" />
                  <span>Welcome to the VIP club! Check your inbox for your 15% coupon.</span>
                </div>
              </transition>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'

const emit = defineEmits(['back-home', 'view-product', 'add-to-cart', 'quick-view', 'toggle-wishlist'])

const {
  specialProducts: specialsProducts,
  categories: liveCategories,
  discounts: liveDiscounts,
  initContentListeners,
  showBadgePills
} = useStoreContent()

const categoryMenuOpen = ref(false)
const selectedFilter = ref('all')
const selectedSort = ref('discount-desc')
const copiedCode = ref('')
const newsletterEmail = ref('')
const newsletterAgreed = ref(true)
const newsletterSubmitted = ref(false)

const categoriesList = computed(() => liveCategories.value.map(c => c.name))

const features = [
  {
    icon: '/images/free-shipping-icon.svg',
    title: 'Free shipping',
    subtitle: 'On all orders over R500'
  },
  {
    icon: '/images/secure-payments-icon.svg',
    title: 'Secure payments',
    subtitle: '100% secure checkout'
  },
  {
    icon: '/images/easy-returns-icon.svg',
    title: 'Easy Returns',
    subtitle: '30-day money-back guarantee'
  },
  {
    icon: '/images/24-7-customer-support.svg',
    title: '24/7 Support',
    subtitle: 'Always here to help'
  }
]

const coupons = computed(() => liveDiscounts.value)

const copyCoupon = (code) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(code).catch(() => {})
  }
  copiedCode.value = code
  setTimeout(() => {
    copiedCode.value = ''
  }, 2500)
}

// Live Countdown Timer (8 days, 14 hours, 32 mins, 45 secs from now)
const targetDate = ref(Date.now() + (8 * 86400 + 14 * 3600 + 32 * 60 + 45) * 1000)
const now = ref(Date.now())
let timerInterval = null

onMounted(() => {
  initContentListeners()
  timerInterval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const timeLeft = computed(() => {
  const diff = Math.max(0, targetDate.value - now.value)
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
})

const timerDays = computed(() => String(timeLeft.value.days).padStart(2, '0'))
const timerHours = computed(() => String(timeLeft.value.hours).padStart(2, '0'))
const timerMinutes = computed(() => String(timeLeft.value.minutes).padStart(2, '0'))
const timerSeconds = computed(() => String(timeLeft.value.seconds).padStart(2, '0'))

// Products on Special (Populated from live ystore-db specials)
const bundles = ref([])

const filterTabs = computed(() => [
  { label: 'All Specials', value: 'all', count: specialsProducts.value.length }
])

const filteredSpecials = computed(() => {
  if (selectedFilter.value === 'all') {
    return specialsProducts.value
  }
  return specialsProducts.value.filter(p => p.category === selectedFilter.value)
})

const sortedSpecials = computed(() => {
  const list = [...filteredSpecials.value]
  if (selectedSort.value === 'discount-desc') {
    return list.sort((a, b) => b.discount - a.discount)
  }
  if (selectedSort.value === 'price-asc') {
    return list.sort((a, b) => a.price - b.price)
  }
  if (selectedSort.value === 'price-desc') {
    return list.sort((a, b) => b.price - a.price)
  }
  if (selectedSort.value === 'popular') {
    return list.sort((a, b) => b.reviews - a.reviews)
  }
  return list
})

const handleNewsletterSubmit = () => {
  if (newsletterEmail.value) {
    newsletterSubmitted.value = true
    newsletterEmail.value = ''
    setTimeout(() => {
      newsletterSubmitted.value = false
    }, 4500)
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
