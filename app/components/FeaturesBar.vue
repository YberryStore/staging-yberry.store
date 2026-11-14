<template>
  <section v-if="visibleStats.length > 0" class="py-8 bg-neutral-50/50 border-b border-neutral-200/60 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
        :class="gridColsClass"
      >
        <component
          :is="feature.link ? 'a' : 'div'"
          v-for="feature in visibleStats"
          :key="feature.id || feature.title"
          :href="feature.link || undefined"
          :target="feature.link && feature.link.startsWith('http') ? '_blank' : undefined"
          :rel="feature.link && feature.link.startsWith('http') ? 'noopener noreferrer' : undefined"
          class="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-[#F4EB6A]/60 transition-all duration-200 group"
          :class="feature.link ? 'cursor-pointer' : ''"
        >
          <!-- Feature Icon Box using SVG or Image -->
          <div class="w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <img
              :src="resolveIcon(feature.icon)"
              :alt="feature.title"
              class="w-full h-full object-contain"
              loading="lazy"
            />
          </div>

          <div class="min-w-0 flex-1">
            <h3 class="text-base font-medium text-neutral-900 group-hover:text-black truncate">
              {{ feature.title }}
            </h3>
            <p class="text-xs sm:text-sm text-neutral-500 mt-0.5 line-clamp-2">
              {{ feature.subtitle }}
            </p>
          </div>
        </component>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStoreContent, defaultInitialGuaranteeStats } from '../composables/useStoreContent'
import { useAsset } from '../composables/useAsset'

const { guaranteeStats } = useStoreContent()

const visibleStats = computed(() => {
  const source = (guaranteeStats.value && guaranteeStats.value.length > 0)
    ? guaranteeStats.value
    : defaultInitialGuaranteeStats
  return source.filter((item) => item.enabled !== false && item.status !== 'draft')
})

const gridColsClass = computed(() => {
  const count = visibleStats.value.length
  if (count === 1) return 'max-w-md mx-auto grid-cols-1'
  if (count === 2) return 'max-w-3xl mx-auto sm:grid-cols-2'
  if (count === 3) return 'lg:grid-cols-3'
  return 'lg:grid-cols-4'
})

const resolveIcon = (iconPath) => {
  if (!iconPath) return useAsset('/images/free-shipping-icon.svg')
  if (iconPath.startsWith('http') || iconPath.startsWith('data:') || iconPath.startsWith('blob:')) {
    return iconPath
  }
  return useAsset(iconPath)
}
</script>

