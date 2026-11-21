<template>
  <div
    class="group relative min-w-0 flex flex-col rounded-2xl bg-white border border-neutral-200/80 p-2.5 sm:p-4 shadow-sm hover:shadow-xl hover:border-[#F4EB6A] transition-all duration-300 font-poppins cursor-pointer"
    @click="$emit('view-product', product)"
  >
    <!-- Image Area with Scrollable Gallery, Badges & Action Overlays -->
    <div class="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100 mb-3 sm:mb-4">
      <div
        ref="imageTrackRef"
        @scroll.passive="handleTrackScroll"
        class="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none touch-pan-x"
      >
        <div
          v-for="(img, idx) in cardImages"
          :key="idx"
          class="w-full h-full shrink-0 snap-center overflow-hidden"
        >
          <img
            :src="img"
            :alt="`${product.name} ${idx + 1}`"
            class="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <!-- Gallery Carousel Controls & Dots (when product has multiple gallery images) -->
      <template v-if="cardImages.length > 1">
        <button
          type="button"
          @click.stop="prevCardImage"
          class="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/85 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
          aria-label="Previous product image"
        >
          <FlowbiteIcon name="chevron-left" size="12" stroke-width="2.5" />
        </button>
        <button
          type="button"
          @click.stop="nextCardImage"
          class="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/85 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
          aria-label="Next product image"
        >
          <FlowbiteIcon name="chevron-right" size="12" stroke-width="2.5" />
        </button>
        <div class="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1 z-10 pointer-events-none">
          <span
            v-for="(img, idx) in cardImages"
            :key="idx"
            :class="[
              'h-1.5 rounded-full transition-all duration-300',
              currentImageIndex === idx ? 'w-3.5 bg-[#F4EB6A] shadow-2xs' : 'w-1.5 bg-white/70'
            ]"
          ></span>
        </div>
      </template>

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
      <div class="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-100 flex items-center justify-between gap-1.5 sm:gap-2 min-w-0">
        <div class="flex flex-col min-w-0">
          <span class="text-sm sm:text-lg font-semibold text-neutral-900 leading-tight truncate">
            R{{ product.price }}
          </span>
          <span v-if="product.originalPrice" class="text-[11px] sm:text-xs text-neutral-400 line-through truncate">
            R{{ product.originalPrice }}
          </span>
        </div>

        <!-- Add To Cart Pill Button (Matching Style Guide) -->
        <button
          type="button"
          @click.stop="$emit('add-to-cart', product)"
          class="btn-primary !text-[11px] sm:!text-xs !py-1.5 sm:!py-2 !px-2.5 sm:!px-4 shadow-none hover:shadow-sm flex items-center gap-1 sm:gap-1.5 shrink-0"
        >
          <FlowbiteIcon name="cart" size="13" stroke-width="1.5" />
          <span class="sm:hidden">Add</span>
          <span class="hidden sm:inline">Add to cart</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'
import { useWishlist } from '../composables/useWishlist'

const { showBadgePills } = useStoreContent()
const { isInWishlist, toggleWishlistItem } = useWishlist()

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart', 'quick-view', 'toggle-wishlist', 'view-product'])

const isWishlisted = computed(() => isInWishlist(props.product?.id))
const imageTrackRef = ref(null)
const currentImageIndex = ref(0)

const cardImages = computed(() => {
  const list = []
  const pushUnique = (src) => {
    const url = typeof src === 'object' && src?.url ? String(src.url).trim() : String(src || '').trim()
    if (url && !list.includes(url)) list.push(url)
  }
  pushUnique(props.product?.image)
  if (Array.isArray(props.product?.gallery)) props.product.gallery.forEach(pushUnique)
  if (Array.isArray(props.product?.images)) props.product.images.forEach(pushUnique)
  return list.length > 0 ? list : ['/images/prod-robot.jpg']
})

const scrollToImage = (idx) => {
  if (!imageTrackRef.value) return
  const clamped = Math.max(0, Math.min(idx, cardImages.value.length - 1))
  currentImageIndex.value = clamped
  imageTrackRef.value.scrollTo({
    left: clamped * imageTrackRef.value.clientWidth,
    behavior: 'smooth'
  })
}

const handleTrackScroll = () => {
  if (!imageTrackRef.value || imageTrackRef.value.clientWidth <= 0) return
  const idx = Math.round(imageTrackRef.value.scrollLeft / imageTrackRef.value.clientWidth)
  currentImageIndex.value = Math.max(0, Math.min(idx, cardImages.value.length - 1))
}

const nextCardImage = () => {
  if (cardImages.value.length <= 1) return
  scrollToImage((currentImageIndex.value + 1) % cardImages.value.length)
}

const prevCardImage = () => {
  if (cardImages.value.length <= 1) return
  scrollToImage((currentImageIndex.value - 1 + cardImages.value.length) % cardImages.value.length)
}

const toggleWishlist = () => {
  const result = toggleWishlistItem(props.product)
  emit('toggle-wishlist', result)
}
</script>
