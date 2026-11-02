<template>
  <section class="py-8 bg-neutral-50/50 border-b border-neutral-200/60 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-[#F4EB6A]/60 transition-all duration-200 group"
        >
          <!-- Feature Icon Box using provided SVG -->
          <div class="w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <img
              :src="feature.icon"
              :alt="feature.title"
              class="w-full h-full object-contain"
              loading="lazy"
            />
          </div>

          <div>
            <h3 class="text-base font-medium text-neutral-900 group-hover:text-black">
              {{ feature.title }}
            </h3>
            <p class="text-xs sm:text-sm text-neutral-500 mt-0.5">
              {{ feature.subtitle }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: '/images/free-shipping-icon.svg',
    title: 'Free shipping',
    subtitle: 'Free delivery on orders over R500'
  },
  {
    icon: '/images/secure-payments-icon.svg',
    title: 'Secure payments',
    subtitle: '100% secure checkout'
  },
  {
    icon: '/images/easy-returns-icon.svg',
    title: 'Easy Returns',
    subtitle: '30 days hassle-free returns'
  },
  {
    icon: '/images/24-7-customer-support.svg',
    title: '24/7 Support',
    subtitle: 'Dedicated friendly team'
  }
]
</script>

