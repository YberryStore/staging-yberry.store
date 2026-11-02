<template>
  <section v-if="newArrivals.length > 0" id="new-arrivals" class="py-14 sm:py-20 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header Centered -->
      <div class="text-center max-w-2xl mx-auto mb-10">
        <h2 class="text-3xl sm:text-[40px] font-medium text-neutral-900 tracking-tight leading-tight">
          New <span class="italic font-light text-neutral-700">arrivals</span>
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
import { onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import { useStoreContent } from '../composables/useStoreContent'

defineEmits(['add-to-cart', 'quick-view', 'toggle-wishlist', 'view-product'])

const { newArrivalProducts: newArrivals, initContentListeners } = useStoreContent()

onMounted(() => {
  initContentListeners()
})
</script>
