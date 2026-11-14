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

      <!-- Testimonial Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div
          v-for="(item, idx) in activeStoreReviews"
          :key="item.id || item.name || idx"
          class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg border border-neutral-100 hover:border-[#F4EB6A] transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- Stars -->
            <div class="flex items-center justify-between gap-2 mb-4">
              <div class="flex items-center gap-1 text-[#F4EB6A]">
                <FlowbiteIcon
                  v-for="s in 5"
                  :key="s"
                  name="star"
                  size="18"
                  stroke-width="1.5"
                  :fill="s <= (Number(item.rating) || 5)"
                  :class="s <= (Number(item.rating) || 5) ? 'text-[#DEC02A]' : 'text-neutral-200'"
                />
              </div>
              <span
                v-if="item.source === 'google'"
                class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
              >
                Google
              </span>
            </div>

            <!-- Review Text -->
            <p class="text-sm sm:text-base text-neutral-600 leading-relaxed italic mb-6">
              "{{ item.quote }}"
            </p>
          </div>

          <!-- Customer Info -->
          <div class="flex items-center gap-3 pt-4 border-t border-neutral-100">
            <div class="w-10 h-10 rounded-full bg-[#FEFEEB] border border-[#F4EB6A] flex items-center justify-center font-bold text-neutral-800 text-sm shrink-0">
              {{ item.initials || (item.name || 'YB').slice(0, 2).toUpperCase() }}
            </div>
            <div>
              <h4 class="text-sm font-semibold text-neutral-900">
                {{ item.name }}
              </h4>
              <div class="flex items-center gap-1 text-xs text-neutral-400">
                <FlowbiteIcon name="check" size="12" stroke-width="2" class="text-green-500" />
                <span>{{ item.badge || 'Verified Buyer' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'

const { activeStoreReviews, initContentListeners } = useStoreContent()

onMounted(() => {
  initContentListeners()
})
</script>
