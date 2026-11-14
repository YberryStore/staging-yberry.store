<template>
  <div class="w-full bg-[#FAFAFA] font-poppins min-h-screen pb-20 print:bg-white print:pb-0">
    <!-- Sub-header Bar: "All categories" & Breadcrumbs (Hidden on Print) -->
    <section class="w-full pt-6 pb-2 print:hidden bg-white border-b border-neutral-100">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 font-normal" aria-label="Breadcrumb">
          <button
            type="button"
            @click="$emit('back-home')"
            class="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>&gt;</span>
          <span class="text-neutral-900 font-medium">Order Confirmation</span>
        </nav>
      </div>
    </section>

    <!-- Main Thank You Container -->
    <main class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      <!-- 1. Hero Confirmation Card -->
      <div class="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-xs mb-8 text-center relative overflow-hidden print:border-none print:shadow-none print:p-0">
        <!-- Top accent banner -->
        <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-[#F4EB6A] to-emerald-500 print:hidden"></div>

        <!-- Animated Success Badge -->
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <svg class="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Payment &amp; Order Received
        </span>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight mb-3">
          Thank you, {{ activeOrder?.customerName || 'Friend' }}!
        </h1>

        <p class="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Your order has been officially registered and our Cape Town workshop team is already preparing your items.
          A confirmation receipt and courier tracking updates have been sent to
          <strong class="text-neutral-900 font-semibold">{{ activeOrder?.customerEmail || 'your email' }}</strong>.
        </p>

        <!-- Quick Summary Bar -->
        <div class="mt-8 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-200/70 text-left">
          <div>
            <span class="text-[11px] font-medium text-neutral-400 block uppercase tracking-wider">Order Number</span>
            <span class="text-sm font-bold font-mono text-neutral-900">#{{ activeOrder?.orderNumber }}</span>
          </div>
          <div>
            <span class="text-[11px] font-medium text-neutral-400 block uppercase tracking-wider">Date</span>
            <span class="text-sm font-bold text-neutral-900">{{ formattedOrderDate }}</span>
          </div>
          <div>
            <span class="text-[11px] font-medium text-neutral-400 block uppercase tracking-wider">Total Paid</span>
            <span class="text-sm font-extrabold font-mono text-emerald-700">R{{ activeOrder?.total }}</span>
          </div>
          <div>
            <span class="text-[11px] font-medium text-neutral-400 block uppercase tracking-wider">Payment</span>
            <span class="text-sm font-bold text-neutral-900">{{ activeOrder?.paymentMethod || 'Online Payment' }}</span>
          </div>
        </div>

        <!-- Action Buttons (Print / Continue) -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            type="button"
            @click="handlePrint"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <FlowbiteIcon name="printer" size="16" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            @click="$emit('back-home')"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
          >
            <FlowbiteIcon name="shopping-bag" size="16" />
            <span>Continue Shopping</span>
          </button>

          <button
            type="button"
            @click="$emit('view-specials')"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <span>Explore Flash Specials</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      <!-- 2. Order Fulfillment Status Timeline (Print: Hidden) -->
      <div class="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs mb-8 print:hidden">
        <h2 class="text-base sm:text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <FlowbiteIcon name="truck" size="20" class="text-neutral-700" />
          <span>Fulfillment &amp; Courier Timeline</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <!-- Step 1 -->
          <div class="flex md:flex-col items-center md:items-start gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
              ✓
            </div>
            <div>
              <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Step 1 • Complete</span>
              <h3 class="text-sm font-bold text-neutral-900">Order Placed</h3>
              <p class="text-xs text-neutral-500 mt-0.5">Order verified &amp; logged in database</p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex md:flex-col items-center md:items-start gap-4 p-4 rounded-2xl bg-[#FEFEEB] border border-[#F4EB6A]">
            <div class="w-10 h-10 rounded-xl bg-[#F4EB6A] text-neutral-900 flex items-center justify-center shrink-0 font-bold text-sm shadow-xs animate-pulse">
              ⚡
            </div>
            <div>
              <span class="text-[11px] font-bold text-[#9E7D0A] uppercase tracking-wider block">Step 2 • In Progress</span>
              <h3 class="text-sm font-bold text-neutral-900">Workshop Preparation</h3>
              <p class="text-xs text-neutral-500 mt-0.5">Craft inspection, wrapping &amp; packing</p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex md:flex-col items-center md:items-start gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 opacity-75">
            <div class="w-10 h-10 rounded-xl bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0 font-bold text-sm">
              3
            </div>
            <div>
              <span class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Step 3 • Upcoming</span>
              <h3 class="text-sm font-bold text-neutral-700">Courier Handover</h3>
              <p class="text-xs text-neutral-500 mt-0.5">Handed to The Courier Guy / Courier partner</p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex md:flex-col items-center md:items-start gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 opacity-75">
            <div class="w-10 h-10 rounded-xl bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0 font-bold text-sm">
              4
            </div>
            <div>
              <span class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Step 4 • Final</span>
              <h3 class="text-sm font-bold text-neutral-700">Doorstep Delivery</h3>
              <p class="text-xs text-neutral-500 mt-0.5">Delivered safely across South Africa</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Details Grid: Order Items & Delivery Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <!-- Left: Items Ordered (7 Cols) -->
        <div class="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
            <h2 class="text-base font-bold text-neutral-900 flex items-center gap-2">
              <FlowbiteIcon name="shopping-bag" size="18" class="text-neutral-700" />
              <span>Items in this Order ({{ totalItemQuantity }})</span>
            </h2>
            <span class="text-xs font-mono font-semibold text-neutral-500">
              Ref: #{{ activeOrder?.orderNumber }}
            </span>
          </div>

          <!-- Items list -->
          <div class="divide-y divide-neutral-100">
            <div
              v-for="(item, idx) in orderItems"
              :key="idx"
              class="py-4 flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200/70 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    v-if="item.image || item.coverImage"
                    :src="item.image || item.coverImage"
                    :alt="item.name || item.title"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-xl">🧸</span>
                </div>
                <div class="min-w-0">
                  <h4 class="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                    {{ item.name || item.title }}
                  </h4>
                  <p class="text-[11px] text-neutral-500 truncate">
                    Qty: <strong class="font-semibold text-neutral-800">{{ item.qty || 1 }}</strong>
                    <span v-if="item.selectedColor"> • {{ item.selectedColor }}</span>
                  </p>
                  <span class="text-[11px] font-mono text-neutral-400">
                    R{{ item.price }} each
                  </span>
                </div>
              </div>

              <div class="text-right shrink-0">
                <span class="text-xs sm:text-sm font-extrabold font-mono text-neutral-900 block">
                  R{{ (item.price || 0) * (item.qty || 1) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Cost Calculations Breakdown -->
          <div class="pt-5 mt-4 border-t border-neutral-200 space-y-2 text-xs">
            <div class="flex items-center justify-between text-neutral-600">
              <span>Subtotal</span>
              <span class="font-mono font-medium text-neutral-900">R{{ activeOrder?.subtotal || activeOrder?.total }}</span>
            </div>

            <div v-if="activeOrder?.discountAmount > 0" class="flex items-center justify-between text-emerald-700">
              <span>Promotional Discount ({{ activeOrder?.couponCode ? `Coupon: ${activeOrder.couponCode}` : 'Special' }})</span>
              <span class="font-mono font-bold">-R{{ activeOrder.discountAmount }}</span>
            </div>

            <div class="flex items-center justify-between text-neutral-600">
              <span>Shipping ({{ deliveryMethodLabel }})</span>
              <span class="font-mono font-medium" :class="activeOrder?.shippingFee === 0 ? 'text-emerald-700 font-bold' : 'text-neutral-900'">
                {{ activeOrder?.shippingFee === 0 ? 'FREE' : `R${activeOrder?.shippingFee || 0}` }}
              </span>
            </div>

            <div class="flex items-center justify-between text-neutral-400 text-[11px] pt-1">
              <span>Includes 15% South African VAT</span>
              <span class="font-mono">R{{ vatAmount }}</span>
            </div>

            <div class="pt-3 border-t border-neutral-200 flex items-center justify-between">
              <span class="text-sm font-bold text-neutral-900">Grand Total</span>
              <span class="text-xl font-extrabold text-neutral-900 font-mono">
                R{{ activeOrder?.total }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Delivery Details & Payment Info (5 Cols) -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Delivery Address Card -->
          <div class="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
            <h3 class="text-sm font-bold text-neutral-900 pb-3 border-b border-neutral-100 flex items-center gap-2">
              <FlowbiteIcon name="truck" size="18" class="text-neutral-700" />
              <span>Delivery / Collection Method</span>
            </h3>

            <div class="pt-4 space-y-3 text-xs">
              <div>
                <span class="text-[11px] text-neutral-400 font-medium block uppercase tracking-wider">Method</span>
                <span class="font-bold text-neutral-900">{{ deliveryMethodLabel }}</span>
              </div>

              <div v-if="activeOrder?.deliveryMethod !== 'collection'">
                <span class="text-[11px] text-neutral-400 font-medium block uppercase tracking-wider">Delivery Address</span>
                <p class="font-medium text-neutral-800 leading-relaxed mt-0.5">
                  {{ activeOrder?.shippingAddress?.street || activeOrder?.deliveryAddress || 'Standard Delivery Address' }}<br />
                  <span v-if="activeOrder?.shippingAddress?.suburb">{{ activeOrder.shippingAddress.suburb }}, </span>
                  <span v-if="activeOrder?.shippingAddress?.city">{{ activeOrder.shippingAddress.city }}</span>
                  <span v-if="activeOrder?.shippingAddress?.postalCode"> - {{ activeOrder.shippingAddress.postalCode }}</span><br />
                  <span v-if="activeOrder?.shippingAddress?.province">{{ activeOrder.shippingAddress.province }}, </span>
                  <span>South Africa</span>
                </p>
              </div>

              <div v-else class="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-700 space-y-1">
                <span class="font-bold text-neutral-900 block">Cape Town Studio Pickup</span>
                <p class="text-[11px] leading-relaxed">
                  Yellow Berry Store Creative Hub<br />
                  Kloof Street &amp; Bree Street Creative Quarter, Cape Town<br />
                  Available: Mon - Fri, 09:00 - 17:00
                </p>
              </div>

              <div class="pt-3 border-t border-neutral-100">
                <span class="text-[11px] text-neutral-400 font-medium block uppercase tracking-wider">Contact Recipient</span>
                <p class="text-neutral-800 font-medium mt-0.5">
                  {{ activeOrder?.customerName }}<br />
                  <span class="text-neutral-500">{{ activeOrder?.customerEmail }}</span><br />
                  <span v-if="activeOrder?.customerPhone" class="font-mono text-neutral-600">{{ activeOrder.customerPhone }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Bank Deposit / EFT Instructions (If EFT) -->
          <div
            v-if="activeOrder?.paymentMethodId === 'eft' || activeOrder?.paymentMethod?.toLowerCase().includes('eft')"
            class="bg-amber-50/80 rounded-3xl border border-amber-200 p-6 shadow-xs space-y-3"
          >
            <div class="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <span class="text-lg">🏦</span>
              <span>Direct Bank Deposit / EFT Details</span>
            </div>
            <p class="text-xs text-amber-900/90 leading-relaxed">
              Please transfer <strong class="font-mono font-bold">R{{ activeOrder?.total }}</strong> using your order number as the payment reference:
            </p>
            <div class="bg-white p-4 rounded-2xl border border-amber-200/80 text-xs space-y-1.5 font-mono">
              <div class="flex justify-between">
                <span class="text-neutral-500 font-sans">Bank:</span>
                <span class="font-bold text-neutral-900">First National Bank (FNB)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500 font-sans">Account Holder:</span>
                <span class="font-bold text-neutral-900">Yellow Berry Store (Pty) Ltd</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500 font-sans">Account Number:</span>
                <span class="font-bold text-neutral-900">62849102938</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500 font-sans">Branch Code:</span>
                <span class="font-bold text-neutral-900">250655</span>
              </div>
              <div class="flex justify-between pt-1 border-t border-neutral-100">
                <span class="text-neutral-500 font-sans font-bold">Payment Reference:</span>
                <span class="font-extrabold text-amber-700 bg-amber-50 px-1.5 rounded border border-amber-200">#{{ activeOrder?.orderNumber }}</span>
              </div>
            </div>
            <p class="text-[11px] text-amber-800">
              Send proof of payment (POP) to <strong class="underline">payments@yellowberry.store</strong>.
            </p>
          </div>

          <!-- Customer Concierge / Help Card -->
          <div class="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-3 print:hidden">
            <h4 class="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <FlowbiteIcon name="shield-check" size="16" class="text-emerald-600" />
              <span>Need Help With Your Order?</span>
            </h4>
            <p class="text-xs text-neutral-500 leading-relaxed font-light">
              Our customer care concierge is available 7 days a week. Quote order reference <strong class="font-mono text-neutral-900 font-bold">#{{ activeOrder?.orderNumber }}</strong> for immediate status tracking.
            </p>
            <div class="flex items-center gap-3 pt-1">
              <a
                href="mailto:support@yellowberry.store"
                class="flex-1 text-center py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold transition-colors"
              >
                Email Support
              </a>
              <button
                type="button"
                @click="$emit('navigate-contact')"
                class="flex-1 text-center py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold transition-colors cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useSiteSeo } from '../composables/useSiteSeo'

const props = defineProps({
  order: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['back-home', 'view-specials', 'navigate-contact'])

const { trackEcommerceEvent } = useSiteSeo()

// Fallback demo order if user lands on /?view=thank-you without an order in session
const fallbackDemoOrder = {
  id: 'ord_demo_2026',
  orderNumber: 'YB-202611-9041',
  customerName: 'Valued Customer',
  customerEmail: 'shopper@yellowberry.store',
  customerPhone: '+27 82 000 0000',
  total: 1250,
  subtotal: 1250,
  discountAmount: 0,
  shippingFee: 0,
  deliveryMethod: 'courier',
  paymentMethod: 'PayFast / Card',
  createdAt: new Date().toISOString(),
  items: [
    {
      name: 'Montessori Wooden Building Blocks - Creative City Set',
      price: 650,
      qty: 1,
      image: '/images/products/blocks-city.jpg'
    },
    {
      name: 'Interactive Safari Animal Puzzle - Handcrafted Birchwood',
      price: 600,
      qty: 1,
      image: '/images/products/safari-puzzle.jpg'
    }
  ]
}

// Active order resolution: checks props, then sessionStorage, then fallback
const activeOrder = computed(() => {
  if (props.order && Object.keys(props.order).length > 0) {
    return props.order
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('ystore_last_order')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed === 'object') {
          return parsed
        }
      }
    } catch {}
  }
  return fallbackDemoOrder
})

const orderItems = computed(() => {
  return activeOrder.value?.items || fallbackDemoOrder.items
})

const totalItemQuantity = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (Number(item.qty) || 1), 0)
})

const vatAmount = computed(() => {
  const total = Number(activeOrder.value?.total) || 0
  return (total * (15 / 115)).toFixed(2)
})

const deliveryMethodLabel = computed(() => {
  const m = activeOrder.value?.deliveryMethod
  if (m === 'collection') return 'Cape Town Workshop Pickup (Free)'
  if (m === 'express') return 'Express Overnight Courier (1-2 business days)'
  return 'Standard Doorstep Delivery (2-4 business days)'
})

const formattedOrderDate = computed(() => {
  try {
    const raw = activeOrder.value?.createdAt
    const d = raw ? new Date(raw) : new Date()
    return d.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return '10 Nov 2026'
  }
})

const handlePrint = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

// Trigger Meta Pixel & GA4 purchase telemetry on mount
onMounted(() => {
  if (activeOrder.value) {
    trackEcommerceEvent('purchase', {
      transaction_id: activeOrder.value.orderNumber || activeOrder.value.id,
      value: activeOrder.value.total,
      currency: 'ZAR',
      items: (activeOrder.value.items || []).map(item => ({
        item_id: item.id || item.name,
        item_name: item.name || item.title,
        price: item.price,
        quantity: item.qty || 1
      }))
    })
  }
})
</script>

<style scoped>
@media print {
  /* Clean invoice formatting for printing receipts */
  body {
    background-color: #fff !important;
  }
}
</style>

