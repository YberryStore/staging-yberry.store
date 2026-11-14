<template>
  <section v-if="newArrivals.length > 0" id="new-arrivals" class="py-14 sm:py-20 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header Centered -->
      <div class="text-center max-w-2xl mx-auto mb-10">
        <h2 class="text-3xl sm:text-[40px] font-medium text-neutral-900 tracking-tight leading-tight flex items-baseline justify-center flex-wrap">
          <span>New</span>
          <span class="inline-block relative overflow-hidden align-baseline ml-2 min-h-[1.25em]">
            <transition name="heading-slide" mode="out-in">
              <span :key="currentCollectionWord" class="inline-block italic font-light text-neutral-700 font-serif">
                {{ currentCollectionWord }}
              </span>
            </transition>
          </span>
        </h2>
        <p class="text-sm sm:text-base text-neutral-500 mt-2">
          Discover the latest innovative toys and lovable companions just added to our collection.
        </p>
      </div>

      <!-- Product Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in newArrivals"
          :key="product.id"
          :product="product"
          @add-to-cart="$emit('add-to-cart', $event)"
          @quick-view="$emit('quick-view', $event)"
          @toggle-wishlist="$emit('toggle-wishlist', $event)"
          @view-product="$emit('view-product', $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import ProductCard from './ProductCard.vue'
import { useStoreContent } from '../composables/useStoreContent'

defineEmits(['add-to-cart', 'quick-view', 'toggle-wishlist', 'view-product'])

const { newArrivalProducts: newArrivals, initContentListeners, headingSlides } = useStoreContent()


// ==========================================
// ROTATING ITALIC HIGHLIGHT WORDS (COLLECTIONS)
// ==========================================
const collectionWordIndex = ref(0)
let collectionWordTimer = null

const activeCollectionWords = computed(() => {
  if (headingSlides?.value?.enabled !== false && headingSlides?.value?.collectionWords) {
    const list = headingSlides.value.collectionWords.map(w => (w || '').trim()).filter(Boolean)
    if (list.length > 0) return list.slice(0, 5)
  }
  return ['Arrivals', 'Editions', 'Treasures']
})

const currentCollectionWord = computed(() => {
  const words = activeCollectionWords.value
  if (!words || words.length === 0) return 'Arrivals'
  return words[collectionWordIndex.value % words.length]
})

const startCollectionWordRotation = () => {
  stopCollectionWordRotation()
  if (typeof window === 'undefined') return
  const words = activeCollectionWords.value
  if (words.length <= 1) return
  const interval = (Number(headingSlides?.value?.intervalSeconds) || 3.5) * 1000
  collectionWordTimer = setInterval(() => {
    collectionWordIndex.value = (collectionWordIndex.value + 1) % words.length
  }, interval)
}

const stopCollectionWordRotation = () => {
  if (collectionWordTimer) {
    clearInterval(collectionWordTimer)
    collectionWordTimer = null
  }
}

watch(
  () => [headingSlides?.value?.enabled, headingSlides?.value?.intervalSeconds, activeCollectionWords.value],
  () => {
    collectionWordIndex.value = 0
    startCollectionWordRotation()
  },
  { deep: true }
)

onMounted(() => {
  startCollectionWordRotation()
  initContentListeners()
})
onUnmounted(() => {
  stopCollectionWordRotation()
})
</script>

<style scoped>
.heading-slide-enter-active {
  transition: transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease-out;
}
.heading-slide-leave-active {
  transition: transform 300ms cubic-bezier(0.7, 0, 0.84, 0), opacity 220ms ease-in;
}
.heading-slide-enter-from {
  opacity: 0;
  transform: translateY(22px);
}
.heading-slide-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
