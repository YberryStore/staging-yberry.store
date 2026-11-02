<template>
  <section v-if="categories.length > 0" id="categories" class="py-14 sm:py-20 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <h2 class="text-3xl sm:text-[40px] font-medium text-neutral-900 tracking-tight leading-tight">
            Shop by <span class="italic font-light text-neutral-700">category</span>
          </h2>
          <p class="text-sm sm:text-base text-neutral-500 mt-1">
            Discover curated worlds of wonder, learning, and playful exploration.
          </p>
        </div>

        <button
          type="button"
          @click="$emit('select-category', 'All')"
          class="btn-primary self-start sm:self-auto text-sm !py-2.5 !px-5 inline-flex items-center gap-2 group shrink-0 cursor-pointer"
        >
          <span>View all categories</span>
          <FlowbiteIcon name="chevron-right" size="16" stroke-width="2" class="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer border border-neutral-100 hover:border-[#F4EB6A]"
          @click="$emit('select-category', cat.name)"
        >
          <!-- Category Image Container -->
          <div class="relative aspect-square w-full overflow-hidden bg-neutral-200">
            <img
              :src="cat.image"
              :alt="cat.name"
              class="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

            <!-- Category Badge -->
            <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-neutral-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              {{ cat.itemCount }} {{ cat.itemCount === 1 ? 'Item' : 'Items' }}
            </span>

            <!-- Bottom Content inside Image overlay -->
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <h3 class="text-lg sm:text-xl font-medium tracking-tight text-white mb-1 group-hover:text-[#F4EB6A] transition-colors">
                {{ cat.name }}
              </h3>
              <p class="text-xs text-neutral-200 line-clamp-1 mb-2">
                {{ cat.description }}
              </p>
              <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4EB6A]">
                <span>Explore</span>
                <FlowbiteIcon name="arrow-right" size="14" stroke-width="2" class="group-hover:translate-x-1 transition-transform" />
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

defineEmits(['select-category'])

const { categoriesWithProducts: categories, initContentListeners } = useStoreContent()

onMounted(() => {
  initContentListeners()
})
</script>
