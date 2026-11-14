<template>
  <section v-if="visibleCategories.length > 0" class="py-8 sm:py-12 bg-white border-b border-neutral-100 font-poppins select-none">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header (Fully Editable from Admin CMS) -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <!-- Badge -->
          <div
            v-if="showBadgePills && headerConfig.badge"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7BA]/60 text-neutral-900 text-xs font-semibold mb-2 shadow-2xs"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-[#F4EB6A]"></span>
            <span>{{ headerConfig.badge }}</span>
          </div>

          <!-- Main Title with rotating italic highlight word (Fade In from Bottom) -->
          <h2 class="text-2xl sm:text-3xl lg:text-[32px] font-bold text-neutral-900 tracking-tight leading-tight flex items-baseline flex-wrap">
            <span>{{ headerConfig.title || 'Latest' }}</span>
            <span class="inline-block relative overflow-hidden align-baseline ml-2 min-h-[1.25em]">
              <transition name="heading-slide" mode="out-in">
                <span
                  :key="currentCategoryWord"
                  class="inline-block italic font-light text-neutral-600 font-serif"
                >
                  {{ currentCategoryWord }}
                </span>
              </transition>
            </span>
          </h2>

          <!-- Subtitle -->
          <p class="text-xs sm:text-sm text-neutral-500 mt-0.5 max-w-2xl">
            {{ headerConfig.subtitle || 'Handpicked worlds of developmental toys, learning sets, and everyday joys.' }}
          </p>
        </div>

        <!-- Controls: View all link + Desktop Chevron Scroll Buttons -->
        <div class="flex items-center gap-4 shrink-0">
          <button
            type="button"
            @click="$emit('select-category', 'All')"
            class="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-black inline-flex items-center gap-1.5 group cursor-pointer"
          >
            <span>{{ headerConfig.viewAllText || 'View all categories' }}</span>
            <FlowbiteIcon name="arrow-right" size="14" stroke-width="2" class="group-hover:translate-x-1 transition-transform" />
          </button>

          <!-- Desktop Chevron Scroll Buttons -->
          <div class="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              @click="scrollLeft"
              class="w-9 h-9 rounded-full border border-neutral-200 bg-white hover:bg-neutral-900 hover:text-[#F4EB6A] text-neutral-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              title="Scroll previous categories"
              aria-label="Scroll left"
            >
              <FlowbiteIcon name="chevron-left" size="16" stroke-width="2.5" />
            </button>
            <button
              type="button"
              @click="scrollRight"
              class="w-9 h-9 rounded-full border border-neutral-200 bg-white hover:bg-neutral-900 hover:text-[#F4EB6A] text-neutral-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              title="Scroll next categories"
              aria-label="Scroll right"
            >
              <FlowbiteIcon name="chevron-right" size="16" stroke-width="2.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Categories Track: Horizontal scroll for desktop AND mobile -->
      <div
        ref="scrollTrackRef"
        class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none gap-4 sm:gap-5 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        <div
          v-for="cat in visibleCategories"
          :key="cat.id || cat.name"
          @click="handleCategoryClick(cat)"
          class="shrink-0 w-[170px] sm:w-[210px] md:w-[230px] snap-start group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 hover:border-[#F4EB6A] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
        >
          <!-- Category Image Container with 5s Auto-Rotation -->
          <div class="relative aspect-square w-full overflow-hidden bg-neutral-200">
            <img
              :src="resolveAsset(getCurrentImage(cat))"
              :alt="cat.name"
              class="w-full h-full object-cover object-center group-hover:scale-108 transition-all duration-700 ease-out"
              loading="lazy"
              decoding="async"
            />
            <!-- Dark Gradient Overlay for Readability -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent group-hover:from-black/85 transition-colors"></div>

            <!-- Optional Tag / Item Count Badge -->
            <span
              v-if="showBadgePills && (cat.badge || cat.itemCount)"
              class="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs"
            >
              {{ cat.badge || `${cat.itemCount} items` }}
            </span>

            <!-- Subtle Slide Progress Dots (shows when card has multiple rotating images) -->
            <div
              v-if="getCardImages(cat).length > 1"
              class="absolute top-3 right-3 flex items-center gap-1 z-10"
            >
              <span
                v-for="(img, iIdx) in getCardImages(cat)"
                :key="iIdx"
                class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                :class="iIdx === getCurrentImageIndex(cat) ? 'bg-[#F4EB6A] w-3' : 'bg-white/40'"
              ></span>
            </div>

            <!-- Bottom Content inside Image overlay -->
            <div class="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 text-white">
              <h3 class="text-xs sm:text-sm font-semibold tracking-tight text-white group-hover:text-[#F4EB6A] transition-colors truncate">
                {{ cat.name }}
              </h3>
              <div class="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors mt-0.5">
                <span>Shop now</span>
                <FlowbiteIcon name="arrow-right" size="11" stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import {
  useStoreContent,
  defaultInitialBannerCategories,
  defaultBannerCategoriesHeader
} from '../composables/useStoreContent'
import { useAsset } from '../composables/useAsset'

const emit = defineEmits(['select-category'])

const {
  bannerCategories,
  bannerCategoriesHeader,
  products,
  showBadgePills,
  headingSlides
} = useStoreContent()

// Editable Section Header
const headerConfig = computed(() => {
  return bannerCategoriesHeader?.value || defaultBannerCategoriesHeader
})

// Filtered categories
const visibleCategories = computed(() => {
  const list = bannerCategories?.value && bannerCategories.value.length > 0
    ? bannerCategories.value
    : defaultInitialBannerCategories
  return list.filter((c) => c.enabled !== false && c.status !== 'draft')
})

// Desktop & Mobile Horizontal Scroll Container Ref
const scrollTrackRef = ref(null)

const scrollLeft = () => {
  if (scrollTrackRef.value) {
    scrollTrackRef.value.scrollBy({ left: -260, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollTrackRef.value) {
    scrollTrackRef.value.scrollBy({ left: 260, behavior: 'smooth' })
  }
}

// ==========================================
// AUTO-ROTATE CARD IMAGES EVERY 5 SECONDS
// ==========================================
const cardImageIndices = ref({})
let cardRotateTimer = null

// Collect multiple images per category card (cat.image, cat.images, and related catalog products)
const getCardImages = (cat) => {
  if (!cat) return ['/images/category-blocks.jpg']
  const images = []
  if (cat.image) images.push(cat.image)
  if (Array.isArray(cat.images)) {
    cat.images.forEach((img) => {
      if (img && !images.includes(img)) images.push(img)
    })
  }

  // Also include product images belonging to this category
  if (products?.value && Array.isArray(products.value)) {
    const targetName = (cat.targetCategory || cat.name || '').toLowerCase().trim()
    const matchingProducts = products.value.filter((p) => {
      const pCat = (p.category || '').toLowerCase().trim()
      return pCat === targetName || pCat.includes(targetName)
    })
    for (const prod of matchingProducts) {
      if (images.length >= 4) break
      if (prod.image && !images.includes(prod.image)) images.push(prod.image)
      if (Array.isArray(prod.images)) {
        for (const pImg of prod.images) {
          if (images.length >= 4) break
          if (pImg && !images.includes(pImg)) images.push(pImg)
        }
      }
    }
  }

  return images.length > 0 ? images : [cat.image || '/images/category-blocks.jpg']
}

const getCurrentImageIndex = (cat) => {
  const key = cat.id || cat.name
  return cardImageIndices.value[key] || 0
}

const getCurrentImage = (cat) => {
  const images = getCardImages(cat)
  const idx = getCurrentImageIndex(cat)
  return images[idx % images.length] || images[0] || '/images/category-blocks.jpg'
}

const startCardRotation = () => {
  stopCardRotation()
  if (typeof window === 'undefined') return
  cardRotateTimer = setInterval(() => {
    visibleCategories.value.forEach((cat) => {
      const imgs = getCardImages(cat)
      if (imgs.length > 1) {
        const key = cat.id || cat.name
        const cur = cardImageIndices.value[key] || 0
        cardImageIndices.value[key] = (cur + 1) % imgs.length
      }
    })
  }, 5000)
}

const stopCardRotation = () => {
  if (cardRotateTimer) {
    clearInterval(cardRotateTimer)
    cardRotateTimer = null
  }
}

const handleCategoryClick = (cat) => {
  emit('select-category', cat.targetCategory || cat.name)
}

const resolveAsset = (path) => {
  if (!path) return useAsset('/images/category-blocks.jpg')
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }
  return useAsset(path)
}


// ==========================================
// ROTATING ITALIC HIGHLIGHT WORDS (HEADING SLIDES)
// ==========================================
const categoryWordIndex = ref(0)
let categoryWordTimer = null

const activeCategoryWords = computed(() => {
  if (headingSlides?.value?.enabled !== false && headingSlides?.value?.categoryWords) {
    const list = headingSlides.value.categoryWords.map(w => (w || '').trim()).filter(Boolean)
    if (list.length > 0) return list.slice(0, 5)
  }
  return [headerConfig.value?.highlight || 'Categories']
})

const currentCategoryWord = computed(() => {
  const words = activeCategoryWords.value
  if (!words || words.length === 0) return headerConfig.value?.highlight || 'Categories'
  return words[categoryWordIndex.value % words.length]
})

const startCategoryWordRotation = () => {
  stopCategoryWordRotation()
  if (typeof window === 'undefined') return
  const words = activeCategoryWords.value
  if (words.length <= 1) return
  const interval = (Number(headingSlides?.value?.intervalSeconds) || 3.5) * 1000
  categoryWordTimer = setInterval(() => {
    categoryWordIndex.value = (categoryWordIndex.value + 1) % words.length
  }, interval)
}

const stopCategoryWordRotation = () => {
  if (categoryWordTimer) {
    clearInterval(categoryWordTimer)
    categoryWordTimer = null
  }
}

watch(
  () => [headingSlides?.value?.enabled, headingSlides?.value?.intervalSeconds, activeCategoryWords.value],
  () => {
    categoryWordIndex.value = 0
    startCategoryWordRotation()
  },
  { deep: true }
)

onMounted(() => {
  startCategoryWordRotation()
  startCardRotation()
})

onUnmounted(() => {
  stopCategoryWordRotation()
  stopCardRotation()
})
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Rotate animation: fade in from the bottom */
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
