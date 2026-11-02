<template>
  <section id="offers" class="py-10 sm:py-16 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative rounded-3xl overflow-hidden bg-neutral-900 text-white shadow-2xl min-h-[380px] sm:min-h-[420px] flex items-center">
        <!-- Background Image with Gradient Overlay -->
        <img
          :src="useAsset('/images/promo-banner.jpg')"
          alt="Limited time offer"
          class="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity filter brightness-90 hover:scale-103 transition-transform duration-700"
          style="object-fit: cover !important; object-position: center !important;"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent"></div>

        <!-- Content Card Overlay -->
        <div class="relative z-10 max-w-xl p-8 sm:p-14">
          <span class="inline-block bg-[#FEFEEB] text-neutral-900 border border-[#F4EB6A] text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 shadow-sm">
            Limited time offer
          </span>

          <h2 class="text-3xl sm:text-5xl font-medium tracking-tight text-white mb-4 leading-tight">
            Up to <span class="text-[#F4EB6A]">25% Off</span>
          </h2>

          <p class="text-base sm:text-lg text-neutral-300 font-light mb-8 max-w-md leading-relaxed">
            On top popular categories in our store. Spark imagination and playful curiosity at unbeatable prices.
          </p>

          <a
            href="#featured"
            class="btn-primary !text-base !py-3 !px-8 inline-flex items-center gap-2 group shadow-lg"
          >
            <span>Shop now</span>
            <FlowbiteIcon name="arrow-right" size="18" stroke-width="2" class="group-hover:translate-x-1.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import FlowbiteIcon from './FlowbiteIcon.vue'
</script>
