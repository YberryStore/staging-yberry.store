<template>
  <section v-if="products.length > 0" id="featured" class="py-14 sm:py-20 bg-neutral-50/50 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mb-8">
        <h2 class="text-3xl sm:text-[40px] font-medium text-neutral-900 tracking-tight leading-tight">
          Feature <span class="italic font-light text-neutral-700">Products</span>
        </h2>
        <p class="text-sm sm:text-base text-neutral-500 mt-1 max-w-2xl">
          Discover our handpicked selection of top-rated products designed to spark joy, imagination, and endless creative play.
        </p>
      </div>

      <!-- Filters & Action Bar -->
      <div v-if="filterCategories.length > 2" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
        <!-- Category Filter Pills -->
        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            v-for="cat in filterCategories"
            :key="cat"
            type="button"
            @click="activeCategory = cat"
            :class="[
              'px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer',
              activeCategory === cat
                ? 'bg-[#F4EB6A] text-neutral-900 shadow-xs font-semibold'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Right Filter Button -->
        <button
          type="button"
          @click="showSortMenu = !showSortMenu"
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-colors shrink-0"
        >
          <FlowbiteIcon name="filter" size="15" stroke-width="1.5" />
          <span>Sort: {{ sortBy }}</span>
        </button>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
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
import { ref, computed, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'

defineEmits(['add-to-cart', 'quick-view', 'toggle-wishlist', 'view-product'])

const { featuredProducts: products, initContentListeners } = useStoreContent()

onMounted(() => {
  initContentListeners()
})

const activeCategory = ref('All')
const sortBy = ref('Featured')
const showSortMenu = ref(false)

const filterCategories = computed(() => {
  const cats = new Set(products.value.map(p => p.category).filter(Boolean))
  return ['All', ...Array.from(cats)]
})

const filteredProducts = computed(() => {
  if (activeCategory.value === 'All') return products.value
  return products.value.filter(p => p.category === activeCategory.value)
})
</script>
