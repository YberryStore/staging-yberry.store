<template>
  <div>
    <!-- Backdrop -->
    <transition name="fade">
      <div
        v-if="isOpen && product"
        class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity font-poppins"
        @click="$emit('close')"
      >
        <!-- Modal Card -->
        <div
          class="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-neutral-100"
          @click.stop
        >
          <!-- Close Button -->
          <button
            type="button"
            @click="$emit('close')"
            class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <FlowbiteIcon name="close" size="18" stroke-width="1.5" />
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2">
            <!-- Product Image & Gallery -->
            <div class="relative bg-neutral-100 flex flex-col justify-between p-4">
              <div class="relative aspect-square rounded-2xl overflow-hidden bg-white flex items-center justify-center">
                <!-- Loading skeleton -->
                <div
                  v-if="modalImageLoading"
                  class="absolute inset-0 bg-neutral-100 animate-pulse flex items-center justify-center z-10"
                >
                  <div class="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-[#DEC02A] animate-spin"></div>
                </div>

                <img
                  :key="activeModalImage || product.image"
                  :src="activeModalImage || product.image"
                  :alt="product.name"
                  class="w-full h-full object-cover transition-all duration-300"
                  fetchpriority="high"
                  decoding="async"
                  @load="modalImageLoading = false"
                  @error="modalImageLoading = false"
                />
                <span
                  v-if="product.tag"
                  class="absolute top-3 left-3 bg-[#FEFEEB] text-neutral-900 border border-[#F4EB6A] text-xs font-semibold px-3 py-1 rounded-full shadow-xs z-20"
                >
                  {{ product.tag }}
                </span>
              </div>

              <!-- Thumbnails below for up to 7 images -->
              <div
                v-if="modalGalleryImages.length > 1"
                class="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none"
              >
                <button
                  v-for="(img, idx) in modalGalleryImages"
                  :key="idx"
                  type="button"
                  @click="selectModalImage(img)"
                  @mouseenter="preloadImage(img)"
                  class="w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer"
                  :class="(activeModalImage || product.image) === img ? 'border-[#F4EB6A] ring-2 ring-[#F4EB6A]/40' : 'border-neutral-200 opacity-70 hover:opacity-100'"
                  :title="`View photo ${idx + 1}`"
                >
                  <img :src="img" :alt="`Thumbnail ${idx + 1}`" class="w-full h-full object-cover" decoding="async" />
                </button>
              </div>
            </div>

            <!-- Details -->
            <div class="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <!-- Rating -->
                <div class="flex items-center gap-1.5 mb-2 text-[#F4EB6A]">
                  <FlowbiteIcon
                    v-for="s in 5"
                    :key="s"
                    name="star"
                    size="15"
                    stroke-width="1.5"
                    :fill="s <= (product.rating || 5)"
                    class="text-[#DEC02A]"
                  />
                  <span class="text-xs text-neutral-400 font-medium ml-1">({{ product.reviews || 30 }} reviews)</span>
                </div>

                <h3 class="text-xl sm:text-2xl font-medium text-neutral-900 mb-2">
                  {{ product.name }}
                </h3>

                <p class="text-xl font-bold text-neutral-900 mb-4">
                  R{{ product.price }}
                  <span v-if="product.originalPrice" class="text-sm font-normal text-neutral-400 line-through ml-2">
                    R{{ product.originalPrice }}
                  </span>
                </p>

                <p v-if="product.description" class="text-sm text-neutral-600 leading-relaxed mb-6">
                  {{ product.description }}
                </p>

                <!-- Value Perks -->
                <div class="space-y-2 py-3 border-y border-neutral-100 text-xs text-neutral-600 mb-6">
                  <div class="flex items-center gap-2">
                    <FlowbiteIcon name="truck" size="15" stroke-width="1.5" class="text-[#706747]" />
                    <span>Free delivery on orders over R500</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <FlowbiteIcon name="arrow-path" size="15" stroke-width="1.5" class="text-[#706747]" />
                    <span>30-day hassle-free return guarantee</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-3">
                <div class="flex items-center border border-neutral-300 rounded-full bg-neutral-50 px-3 py-1.5 text-sm">
                  <button
                    type="button"
                    @click="qty = Math.max(1, qty - 1)"
                    class="px-2 py-0.5 text-neutral-600 hover:text-black font-bold"
                  >
                    -
                  </button>
                  <span class="px-2 font-semibold text-neutral-900">{{ qty }}</span>
                  <button
                    type="button"
                    @click="qty++"
                    class="px-2 py-0.5 text-neutral-600 hover:text-black font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  @click="handleAddToCart"
                  class="btn-primary flex-1 !py-3 shadow-md font-semibold justify-center"
                >
                  <FlowbiteIcon name="cart" size="16" stroke-width="1.5" />
                  <span>Add to cart &bull; R{{ product.price * qty }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'add-to-cart'])

const qty = ref(1)
const activeModalImage = ref('')
const modalImageLoading = ref(true)
const preloadedUrls = new Set()

const preloadImage = (url) => {
  if (!url || typeof window === 'undefined' || preloadedUrls.has(url)) return
  preloadedUrls.add(url)
  const img = new Image()
  img.decoding = 'async'
  img.src = url
}

const selectModalImage = (img) => {
  if (!img || activeModalImage.value === img) return
  modalImageLoading.value = true
  activeModalImage.value = img
}

const modalGalleryImages = computed(() => {
  if (props.product?.images?.length) {
    const list = [...props.product.images]
    const mainImg = props.product.image
    if (mainImg) {
      const idx = list.indexOf(mainImg)
      if (idx > 0) {
        list.splice(idx, 1)
        list.unshift(mainImg)
      } else if (idx === -1) {
        list.unshift(mainImg)
      }
    }
    return list.slice(0, 7)
  }
  if (props.product?.image) return [props.product.image]
  return []
})

watch(() => props.product, (newVal) => {
  qty.value = 1
  modalImageLoading.value = true
  activeModalImage.value = newVal?.image || (newVal?.images?.[0] || '')
  if (newVal?.images && Array.isArray(newVal.images)) {
    newVal.images.forEach((u) => preloadImage(u))
  }
}, { immediate: true })

const handleAddToCart = () => {
  if (props.product) {
    emit('add-to-cart', { ...props.product, qty: qty.value })
    emit('close')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
