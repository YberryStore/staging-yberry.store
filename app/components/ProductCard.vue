<template>
  <div
    class="group relative flex flex-col rounded-2xl bg-white border border-neutral-200/80 p-3 sm:p-4 shadow-sm hover:shadow-xl hover:border-[#F4EB6A] transition-all duration-300 font-poppins cursor-pointer"
    @click="$emit('view-product', product)"
  >
    <!-- Image Area with Badges & Action Overlays -->
    <div class="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100 mb-3 sm:mb-4">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
        loading="lazy"
        decoding="async"
      />

      <!-- Badge (Category / Sale) -->
      <div v-if="showBadgePills && (product.tag || product.discount)" class="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
        <span
          v-if="product.tag"
          class="bg-[#FEFEEB] text-neutral-900 border border-[#F4EB6A] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs"
        >
          {{ product.tag }}
        </span>
        <span
          v-if="product.discount"
          class="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs"
        >
          -{{ product.discount }}%
        </span>
      </div>

      <!-- Wishlist Button -->
      <button
        type="button"
        @click.stop="toggleWishlist"
        class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-neutral-600 hover:text-red-500 hover:bg-white flex items-center justify-center shadow-sm transition-all duration-200 z-10"
        :class="{ 'text-red-500 !bg-white': isWishlisted }"
        :aria-label="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
      >
        <FlowbiteIcon
          name="heart"
          size="16"
          :stroke-width="1.5"
          :fill="isWishlisted"
        />
      </button>

      <!-- Quick View Button (hover overlay) -->
      <div class="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          type="button"
          @click.stop="$emit('quick-view', product)"
          class="bg-neutral-900/85 hover:bg-neutral-900 text-white text-xs font-medium px-4 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
        >
          <FlowbiteIcon name="eye" size="14" stroke-width="1.5" />
          <span>Quick View</span>
        </button>
      </div>
    </div>

    <!-- Details Section -->
    <div class="flex-1 flex flex-col justify-between">
      <div>
        <!-- Star Rating -->
        <div class="flex items-center gap-1 mb-1.5">
          <div class="flex text-[#F4EB6A]">
            <FlowbiteIcon
              v-for="s in 5"
              :key="s"
              name="star"
              size="13"
              stroke-width="1.5"
              :fill="s <= (product.rating || 5)"
              class="text-[#DEC02A]"
            />
          </div>
          <span class="text-[11px] text-neutral-400 font-medium">({{ product.reviews || 24 }})</span>
        </div>

        <!-- Product Name -->
        <h3 class="text-sm sm:text-base font-medium text-neutral-900 line-clamp-1 group-hover:text-neutral-700 transition-colors">
          {{ product.name }}
        </h3>

        <!-- Description Snippet -->
        <p class="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
          {{ product.description }}
        </p>
      </div>

      <!-- Price & Add To Cart Button -->
      <div class="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
        <div class="flex flex-col">
          <span class="text-base sm:text-lg font-semibold text-neutral-900 leading-tight">
            R{{ product.price }}
          </span>
          <span v-if="product.originalPrice" class="text-xs text-neutral-400 line-through">
            R{{ product.originalPrice }}
          </span>
        </div>

        <!-- Add To Cart Pill Button (Matching Style Guide) -->
        <button
          type="button"
          @click.stop="$emit('add-to-cart', product)"
          class="btn-primary !text-xs !py-2 !px-4 shadow-none hover:shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <FlowbiteIcon name="cart" size="14" stroke-width="1.5" />
          <span>Add to cart</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'

const { showBadgePills } = useStoreContent()

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart', 'quick-view', 'toggle-wishlist', 'view-product'])

const isWishlisted = ref(false)

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value
  emit('toggle-wishlist', { product: props.product, isWishlisted: isWishlisted.value })
}
</script>
