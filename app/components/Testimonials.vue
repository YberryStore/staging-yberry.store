<template>
  <section class="py-14 sm:py-20 bg-neutral-50/60 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Title -->
      <div class="text-center max-w-xl mx-auto mb-12">
        <h2 class="text-3xl sm:text-[40px] font-medium text-neutral-900 tracking-tight leading-tight">
          What our <span class="italic font-light text-neutral-700">customers say</span>
        </h2>
        <p class="text-sm sm:text-base text-neutral-500 mt-2">
          Real stories from happy parents, educators, and little adventurers.
        </p>
      </div>

      <!-- 3 Testimonial Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div
          v-for="item in testimonials"
          :key="item.name"
          class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg border border-neutral-100 hover:border-[#F4EB6A] transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- Stars -->
            <div class="flex items-center gap-1 text-[#F4EB6A] mb-4">
              <FlowbiteIcon
                v-for="s in 5"
                :key="s"
                name="star"
                size="18"
                stroke-width="1.5"
                fill
                class="text-[#DEC02A]"
              />
            </div>

            <!-- Review Text -->
            <p class="text-sm sm:text-base text-neutral-600 leading-relaxed italic mb-6">
              "{{ item.quote }}"
            </p>
          </div>

          <!-- Customer Info -->
          <div class="flex items-center gap-3 pt-4 border-t border-neutral-100">
            <div class="w-10 h-10 rounded-full bg-[#FEFEEB] border border-[#F4EB6A] flex items-center justify-center font-bold text-neutral-800 text-sm">
              {{ item.initials }}
            </div>
            <div>
              <h4 class="text-sm font-semibold text-neutral-900">
                {{ item.name }}
              </h4>
              <div class="flex items-center gap-1 text-xs text-neutral-400">
                <FlowbiteIcon name="check" size="12" stroke-width="2" class="text-green-500" />
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import FlowbiteIcon from './FlowbiteIcon.vue'

const testimonials = [
  {
    name: 'Sarah Mkhize',
    initials: 'SM',
    quote: 'Ystore delivered our package to Durban in less than 48 hours. The rainbow stacker and wooden train are beautifully made with smooth non-toxic paints. My toddlers play with them every morning.'
  },
  {
    name: 'Liam Van Der Merwe',
    initials: 'LV',
    quote: 'The collectible figure exceeded all expectations! The articulation and vintage details are exceptional. It is so hard to find high quality toys that survive rough daily play, but Ystore nailed it.'
  },
  {
    name: 'Amanda Naidoo',
    initials: 'AN',
    quote: 'Customer service was super responsive when I had questions about shipping before my daughter’s birthday. The afternoon tea set is absolutely adorable and well packaged. Highly recommended!'
  }
]
</script>
