<template>
  <section v-if="bestSellers.length > 0" id="bestsellers" class="py-14 sm:py-20 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <h2 class="text-3xl sm:text-[40px] font-medium text-neutral-900 tracking-tight leading-tight">
            Best <span class="italic font-light text-neutral-700">sellers</span>
          </h2>
          <p class="text-sm sm:text-base text-neutral-500 mt-1">
            The community favorites loved by children and parents across South Africa.
          </p>
        </div>
      </div>

      <!-- Product Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in bestSellers"
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

const { bestSellerProducts: bestSellers, initContentListeners } = useStoreContent()

onMounted(() => {
  initContentListeners()
})
</script>
