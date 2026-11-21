<template>
  <div class="w-full bg-white font-poppins min-h-[75vh]">
    <!-- Top Breadcrumb & Header -->
    <section class="w-full pt-8 pb-6 border-b border-neutral-100">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 font-normal mb-5" aria-label="Breadcrumb">
          <button
            type="button"
            @click="$emit('back-home')"
            class="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>&rsaquo;</span>
          <span class="text-neutral-900 font-medium">Wishlist</span>
        </nav>

        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-[40px] font-medium text-neutral-900 tracking-tight leading-tight flex items-center gap-3 flex-wrap">
              <span>My <span class="italic font-light text-neutral-700 font-serif">Wishlist</span></span>
              <span class="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-[#FAF7BA] text-neutral-900 border border-[#F4EB6A]">
                {{ wishlistItems.length }} {{ wishlistItems.length === 1 ? 'Item' : 'Items' }}
              </span>
            </h1>
            <p class="text-sm sm:text-base text-neutral-500 mt-1.5">
              Your saved favourites, ready whenever you are.
            </p>
          </div>

          <div v-if="wishlistItems.length > 0" class="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              @click="addAllToCart"
              class="btn-primary !text-xs sm:!text-sm !py-2.5 !px-5 inline-flex items-center gap-2 cursor-pointer"
            >
              <FlowbiteIcon name="cart" size="15" stroke-width="1.8" />
              <span>Add All to Cart</span>
            </button>
            <button
              type="button"
              @click="handleClearWishlist"
              class="px-4 py-2.5 rounded-full border border-neutral-200 hover:border-red-300 hover:bg-red-50 text-neutral-600 hover:text-red-600 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Clear Wishlist
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Wishlist Grid or Empty State -->
    <section class="py-10 sm:py-14">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Empty State -->
        <div
          v-if="wishlistItems.length === 0"
          class="py-16 sm:py-24 px-6 rounded-3xl bg-neutral-50 border border-neutral-200/80 text-center max-w-2xl mx-auto"
        >
          <div class="w-16 h-16 rounded-full bg-[#FAF7BA] border border-[#F4EB6A] text-neutral-900 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <FlowbiteIcon name="heart" size="28" stroke-width="1.8" />
          </div>
          <h2 class="text-xl sm:text-2xl font-medium text-neutral-900 mb-2">
            Your wishlist is empty
          </h2>
          <p class="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-7 leading-relaxed">
            Tap the heart icon on any product while browsing to save it here for quick access later.
          </p>
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              @click="$emit('select-category', 'All')"
              class="btn-primary !text-xs sm:!text-sm !py-2.5 !px-6 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Products</span>
              <FlowbiteIcon name="arrow-right" size="15" stroke-width="2" />
            </button>
            <button
              type="button"
              @click="$emit('back-home')"
              class="px-5 py-2.5 rounded-full border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>

        <!-- Saved Products Grid (2 per row on mobile, 4 on desktop) -->
        <div
          v-else
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          <ProductCard
            v-for="product in hydratedWishlistItems"
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
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useWishlist } from '../composables/useWishlist'
import { useStoreContent } from '../composables/useStoreContent'

const emit = defineEmits(['back-home', 'select-category', 'add-to-cart', 'quick-view', 'toggle-wishlist', 'view-product'])

const { wishlistItems, clearWishlist } = useWishlist()
const { publishedProducts, initContentListeners } = useStoreContent()

onMounted(() => {
  initContentListeners()
})

// Keep wishlisted product details fresh with live Firestore catalog data
const hydratedWishlistItems = computed(() => {
  const catalog = Array.isArray(publishedProducts.value) ? publishedProducts.value : []
  return wishlistItems.value.map((saved) => {
    const live = catalog.find((p) => String(p.id) === String(saved.id))
    return live || saved
  })
})

const addAllToCart = () => {
  hydratedWishlistItems.value.forEach((product) => {
    emit('add-to-cart', product)
  })
}

const handleClearWishlist = () => {
  clearWishlist()
}
</script>
