<template>
  <div class="w-full bg-white font-poppins min-h-screen">
    <!-- Sub-header Bar: "All categories" & Breadcrumbs -->
    <section class="w-full pt-6 pb-2">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- "All categories" Button & Dropdown -->
        <div class="relative inline-block">
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
                @click.prevent="categoryMenuOpen = false; $emit('back-home')"
                class="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-[#FEFEEB] hover:text-neutral-900 transition-colors"
              >
                {{ cat }}
              </a>
            </div>
          </transition>
        </div>

        <!-- Horizontal Divider -->
        <div class="border-b border-neutral-200 mt-4 mb-4"></div>

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
          <span class="text-neutral-900 font-medium">Contact Us</span>
        </nav>
      </div>
    </section>

    <!-- Header Section: Title & Subtitle Matching Reference -->
    <section class="pt-6 pb-4">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <!-- Tag matching reference "Plan Trip" -->
          <span v-if="showBadgePills" class="inline-block bg-neutral-100 text-neutral-700 border border-neutral-200/80 text-xs font-medium px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 shadow-2xs">
            Custom Orders &amp; Support
          </span>

          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight leading-none">
              Contact Us
            </h1>
            <p class="text-xs sm:text-sm text-neutral-500 font-light max-w-sm md:text-right leading-relaxed">
              Tell us what you'd like to order or ask, and our store team will confirm availability within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Form & Visual Card Container (2-Column Layout) -->
    <section class="py-6 sm:py-8">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl bg-[#FAFAFA] border border-neutral-200/70 p-6 sm:p-10 lg:p-12 shadow-xs">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <!-- Left Column: The Contact Form -->
            <div class="lg:col-span-7 flex flex-col justify-between">
              <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Row 1: Name & Email -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5">
                      Name
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      placeholder="Your full name"
                      class="w-full bg-[#EFEFEF] hover:bg-[#EAEAEA] focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 rounded-xl px-4 py-3 border border-transparent focus:border-[#F4EB6A] focus:outline-none focus:ring-2 focus:ring-[#F4EB6A]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5">
                      Email
                    </label>
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      class="w-full bg-[#EFEFEF] hover:bg-[#EAEAEA] focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 rounded-xl px-4 py-3 border border-transparent focus:border-[#F4EB6A] focus:outline-none focus:ring-2 focus:ring-[#F4EB6A]/50 transition-all"
                    />
                  </div>
                </div>

                <!-- Row 2: Phone Number & Select Inquiry Type -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      placeholder="+27 82 123 4567"
                      class="w-full bg-[#EFEFEF] hover:bg-[#EAEAEA] focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 rounded-xl px-4 py-3 border border-transparent focus:border-[#F4EB6A] focus:outline-none focus:ring-2 focus:ring-[#F4EB6A]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5">
                      Select Topic
                    </label>
                    <div class="relative">
                      <select
                        v-model="form.topic"
                        class="w-full bg-[#EFEFEF] hover:bg-[#EAEAEA] focus:bg-white text-xs sm:text-sm text-neutral-900 rounded-xl px-4 py-3 pr-10 border border-transparent focus:border-[#F4EB6A] focus:outline-none focus:ring-2 focus:ring-[#F4EB6A]/50 transition-all cursor-pointer appearance-none"
                      >
                        <option value="custom-order">Custom Product / Bespoke Order</option>
                        <option value="order-status">Order Status &amp; Tracking</option>
                        <option value="wholesale">Wholesale &amp; Bulk Orders</option>
                        <option value="returns">Returns &amp; Exchanges</option>
                        <option value="general">General Product Question</option>
                      </select>
                      <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                        <FlowbiteIcon name="chevron-down" size="14" stroke-width="2" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Row 3: Preferred Date & Quantity -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5">
                      Preferred Date / Timeline
                    </label>
                    <input
                      v-model="form.date"
                      type="date"
                      class="w-full bg-[#EFEFEF] hover:bg-[#EAEAEA] focus:bg-white text-xs sm:text-sm text-neutral-900 rounded-xl px-4 py-3 border border-transparent focus:border-[#F4EB6A] focus:outline-none focus:ring-2 focus:ring-[#F4EB6A]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5">
                      Quantity / Units
                    </label>
                    <input
                      v-model="form.quantity"
                      type="text"
                      placeholder="e.g. 1 unit, 5-10 figures"
                      class="w-full bg-[#EFEFEF] hover:bg-[#EAEAEA] focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 rounded-xl px-4 py-3 border border-transparent focus:border-[#F4EB6A] focus:outline-none focus:ring-2 focus:ring-[#F4EB6A]/50 transition-all"
                    />
                  </div>
                </div>

                <!-- Row 4: Message / Special Requests -->
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5">
                    Message / Special Requests
                  </label>
                  <textarea
                    v-model="form.message"
                    required
                    rows="4"
                    placeholder="Describe your design specifications, dimensions, color preferences, or any specific questions..."
                    class="w-full bg-[#EFEFEF] hover:bg-[#EAEAEA] focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 rounded-xl p-4 border border-transparent focus:border-[#F4EB6A] focus:outline-none focus:ring-2 focus:ring-[#F4EB6A]/50 transition-all resize-none"
                  ></textarea>
                </div>

                <!-- Submit Button & Action Group Matching Reference -->
                <div class="pt-2 flex items-center gap-2.5">
                  <button
                    type="submit"
                    class="bg-[#151515] hover:bg-neutral-800 active:scale-98 text-white font-medium text-xs sm:text-sm py-3.5 px-7 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2 select-none"
                  >
                    <span>Send Message</span>
                  </button>

                  <!-- Circular Arrow Button Matching Reference -->
                  <button
                    type="submit"
                    aria-label="Submit message"
                    class="w-12 h-12 rounded-full bg-[#151515] hover:bg-[#F4EB6A] hover:text-[#151515] text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md active:scale-95 group"
                  >
                    <FlowbiteIcon name="arrow-up-right" size="16" stroke-width="2.5" class="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

                <!-- Success Toast / Message -->
                <transition name="fade">
                  <div
                    v-if="submitted"
                    class="p-4 rounded-2xl bg-[#FEFEEB] border border-[#F4EB6A] text-neutral-900 text-xs sm:text-sm flex items-center gap-3 shadow-xs"
                  >
                    <div class="w-6 h-6 rounded-full bg-[#F4EB6A] text-neutral-900 flex items-center justify-center shrink-0">
                      <FlowbiteIcon name="check" size="14" stroke-width="2.5" />
                    </div>
                    <span>Thank you for reaching out! We've received your request and will respond within 24 hours.</span>
                  </div>
                </transition>
              </form>
            </div>

            <!-- Right Column: Vertical Picture Card Matching Reference -->
            <div class="lg:col-span-5">
              <div class="relative w-full h-full min-h-[460px] rounded-3xl overflow-hidden shadow-md flex flex-col justify-between p-6 sm:p-8 bg-neutral-900 group">
                <!-- Background Image -->
                <img
                  :src="useAsset('/images/robot-angle.jpg')"
                  alt="Ystore Featured Products"
                  class="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                />

                <!-- Dark Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-neutral-950/50"></div>

                <!-- Top Right Pill Badge Matching Reference "Your Journey" -->
                <div class="relative z-10 self-end">
                  <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-medium border border-white/30 shadow-xs transition-colors">
                    Custom Creation
                  </span>
                </div>

                <!-- Bottom Content Overlay -->
                <div class="relative z-10 text-white">
                  <span class="text-xs uppercase tracking-wider font-semibold text-[#F4EB6A] block mb-1">
                    Crafted With Care
                  </span>
                  <h3 class="text-xl sm:text-2xl font-bold leading-tight">
                    Thoughtfully curated products designed to power your imagination.
                  </h3>
                  <p class="text-xs text-neutral-300 font-light mt-1.5 leading-relaxed">
                    Made with premium, durable materials for lasting quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3 Direct Contact Channels (Matching Reference Middle Section) -->
    <section class="py-12 sm:py-16">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
          <!-- Channel 1: Call & WhatsApp -->
          <div class="flex flex-col items-center">
            <div class="w-14 h-14 rounded-full border border-neutral-300 hover:border-[#F4EB6A] bg-white hover:bg-[#FEFEEB] flex items-center justify-center text-neutral-800 transition-all duration-200 mb-4 shadow-2xs group cursor-pointer">
              <FlowbiteIcon name="phone" size="20" stroke-width="1.5" class="group-hover:scale-110 transition-transform" />
            </div>
            <h3 class="text-base font-bold text-neutral-900 mb-1.5">
              Call &amp; WhatsApp
            </h3>
            <p class="text-xs sm:text-sm text-neutral-500 font-light">
              +27 71 234 5678
            </p>
            <p class="text-xs sm:text-sm text-neutral-500 font-light">
              +27 82 987 6543
            </p>
          </div>

          <!-- Channel 2: Working Hours -->
          <div class="flex flex-col items-center">
            <div class="w-14 h-14 rounded-full border border-neutral-300 hover:border-[#F4EB6A] bg-white hover:bg-[#FEFEEB] flex items-center justify-center text-neutral-800 transition-all duration-200 mb-4 shadow-2xs group cursor-pointer">
              <FlowbiteIcon name="clock" size="20" stroke-width="1.5" class="group-hover:scale-110 transition-transform" />
            </div>
            <h3 class="text-base font-bold text-neutral-900 mb-1.5">
              Working Hours
            </h3>
            <p class="text-xs sm:text-sm text-neutral-500 font-light">
              Daily: 8am - 5pm
            </p>
            <p class="text-xs sm:text-sm text-neutral-500 font-light">
              Sundays: Closed
            </p>
          </div>

          <!-- Channel 3: Write to Us -->
          <div class="flex flex-col items-center">
            <div class="w-14 h-14 rounded-full border border-neutral-300 hover:border-[#F4EB6A] bg-white hover:bg-[#FEFEEB] flex items-center justify-center text-neutral-800 transition-all duration-200 mb-4 shadow-2xs group cursor-pointer">
              <FlowbiteIcon name="mail" size="20" stroke-width="1.5" class="group-hover:scale-110 transition-transform" />
            </div>
            <h3 class="text-base font-bold text-neutral-900 mb-1.5">
              Write to Us
            </h3>
            <p class="text-xs sm:text-sm text-neutral-500 font-light">
              info@ystore.co.za
            </p>
            <p class="text-xs sm:text-sm text-neutral-500 font-light">
              custom@ystore.co.za
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Showcase / CTA Card (Matching Reference Bottom Section) -->
    <section class="py-8 sm:py-12 mb-16 sm:mb-20">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl bg-[#F6F6F6] border border-neutral-200/70 p-8 sm:p-12 lg:p-16">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <!-- Left Content -->
            <div class="lg:col-span-6">
              <span class="inline-block bg-white text-neutral-800 border border-neutral-200/80 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-2xs">
                Start now
              </span>

              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight leading-tight mb-4">
                Discover your next <br class="hidden sm:inline" />
                <span class="font-serif italic font-normal text-neutral-700">custom creation</span>
              </h2>

              <p class="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed max-w-md mb-8">
                Discover and order your favorite items in minutes, made for home, workspaces, and everyday collections.
              </p>

              <button
                type="button"
                @click="$emit('back-home')"
                class="btn-primary !text-xs sm:!text-sm !py-3 !px-7 inline-flex items-center gap-2 group shadow-sm"
              >
                <span>Explore our collection</span>
                <FlowbiteIcon name="arrow-right" size="16" stroke-width="2" class="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <!-- Right Content: 2 Picture Cards Side-by-Side Matching Reference -->
            <div class="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
              <div class="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-200 shadow-sm group cursor-pointer" @click="$emit('back-home')">
                <img
                  :src="useAsset('/images/prod-robot.jpg')"
                  alt="Collectible Figure Model"
                  class="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div class="absolute bottom-3 left-3 text-white text-xs font-medium">
                  Collectible Figures
                </div>
              </div>

              <div class="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-200 shadow-sm group cursor-pointer" @click="$emit('back-home')">
                <img
                  :src="useAsset('/images/robot-wave.jpg')"
                  alt="Playroom creations"
                  class="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div class="absolute bottom-3 left-3 text-white text-xs font-medium">
                  Display Collectibles
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'

const { showBadgePills } = useStoreContent()

defineEmits(['back-home', 'view-specials'])

const categoryMenuOpen = ref(false)
const submitted = ref(false)

const categoriesList = []

const form = ref({
  name: '',
  email: '',
  phone: '',
  topic: 'custom-order',
  date: '',
  quantity: '',
  message: ''
})

const handleSubmit = () => {
  if (form.value.name && form.value.email && form.value.message) {
    submitted.value = true
    form.value = {
      name: '',
      email: '',
      phone: '',
      topic: 'custom-order',
      date: '',
      quantity: '',
      message: ''
    }
    setTimeout(() => {
      submitted.value = false
    }, 6000)
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
