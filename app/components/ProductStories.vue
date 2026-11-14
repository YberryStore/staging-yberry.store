<template>
  <div v-if="visibleStories.length > 0" class="w-full bg-neutral-950 border-b border-neutral-900 font-poppins select-none">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <!-- Story Circles Track -->
      <div
        ref="trackRef"
        class="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-1 px-1 -mx-2 sm:mx-0 snap-x"
      >
        <button
          v-for="(story, index) in visibleStories"
          :key="story.id || index"
          type="button"
          @click="openStory(index)"
          class="flex flex-col items-center shrink-0 group focus:outline-none cursor-pointer transition-transform duration-200 active:scale-95 snap-start"
        >
          <!-- Outer Ring: Gold/Yellow permanent ring that never disappears -->
          <div
            class="p-0.5 rounded-full transition-all duration-300 ring-2 ring-[#F4EB6A] shadow-[0_0_12px_rgba(244,235,106,0.35)] group-hover:ring-[#FAF7BA] group-hover:scale-105"
          >
            <!-- Inner Circle Thumbnail Container -->
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-neutral-900 border-2 border-neutral-950 flex items-center justify-center relative">
              <!-- Custom Image or Auto-Rotating Slide Thumbnail -->
              <img
                v-if="getStoryCurrentThumb(story)"
                :src="resolveAsset(getStoryCurrentThumb(story))"
                :alt="story.title"
                class="w-full h-full object-cover object-center group-hover:scale-110 transition-all duration-700 ease-out"
                loading="eager"
                decoding="async"
              />
              <!-- Fallback Icon with Yellow Berry styling -->
              <div v-else class="w-full h-full flex items-center justify-center bg-neutral-900 text-[#F4EB6A] font-bold text-lg">
                {{ story.title.charAt(0) }}
              </div>

              <!-- Permanent Gold Pulse Indicator (never disappears) -->
              <span
                class="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#F4EB6A] ring-2 ring-neutral-950 animate-pulse"
              ></span>
            </div>
          </div>

          <!-- Story Label -->
          <span
            class="text-[11px] sm:text-xs font-medium tracking-tight text-center truncate max-w-[76px] sm:max-w-[92px] mt-1.5 transition-colors text-neutral-100 group-hover:text-[#F4EB6A]"
            :title="story.title"
          >
            {{ story.title }}
          </span>
        </button>
      </div>
    </div>

    <!-- ==========================================
         FULLSCREEN STORY LIGHTBOX MODAL
         Constraint: Desktop max image width 1080px
         ========================================== -->
    <Teleport to="body">
      <transition name="story-fade">
        <div
          v-if="activeStoryIndex !== null"
          class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between overflow-hidden font-poppins"
          @keydown.esc="closeStory"
          tabindex="0"
          ref="lightboxRef"
        >
          <!-- Top Overlay Header: Progress Bars & Info & Close -->
          <div class="relative z-30 w-full max-w-[1080px] mx-auto px-4 pt-3 sm:pt-4">
            <!-- Progress Bars (One segment per slide in active story with 5s auto-rotate) -->
            <div class="flex items-center gap-1.5 w-full mb-3">
              <div
                v-for="(slide, sIdx) in currentStorySlides"
                :key="sIdx"
                class="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-[#F4EB6A] transition-[width] ease-linear duration-75"
                  :style="{
                    width: sIdx < currentSlideIndex
                      ? '100%'
                      : sIdx === currentSlideIndex
                      ? `${slideProgress}%`
                      : '0%'
                  }"
                ></div>
              </div>
            </div>

            <!-- Top Header Bar -->
            <div class="flex items-center justify-between text-white">
              <!-- Left: Story Avatar & Title -->
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-[#F4EB6A] overflow-hidden bg-neutral-900 shrink-0">
                  <img
                    :src="resolveAsset(currentStory?.icon || currentStory?.coverImage || currentSlide?.image)"
                    :alt="currentStory?.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-white tracking-tight leading-none">
                    {{ currentStory?.title }}
                  </h3>
                  <span class="text-[11px] text-neutral-400">
                    {{ currentSlideIndex + 1 }} of {{ currentStorySlides.length }}
                  </span>
                </div>
              </div>

              <!-- Right: Story Close Button -->
              <button
                type="button"
                @click="closeStory"
                class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm active:scale-95"
                title="Close Lightbox (Esc)"
                aria-label="Close"
              >
                <FlowbiteIcon name="close" size="20" stroke-width="2.5" />
              </button>
            </div>
          </div>

          <!-- Main Gallery Stage (Touch-swipeable on mobile, max 1080px on desktop) -->
          <div
            class="relative z-20 flex-1 w-full max-w-[1080px] mx-auto flex items-center justify-center px-2 sm:px-4 my-auto overflow-hidden"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @mouseenter="pauseSlideTimer"
            @mouseleave="resumeSlideTimer"
          >
            <!-- Desktop Left Nav Button -->
            <button
              v-if="canGoPrev"
              type="button"
              @click.stop="prevSlide"
              class="hidden sm:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white items-center justify-center backdrop-blur-md transition-all z-30 cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Previous Slide"
            >
              <FlowbiteIcon name="chevron-left" size="22" stroke-width="2.5" />
            </button>

            <!-- Desktop Right Nav Button -->
            <button
              v-if="canGoNext"
              type="button"
              @click.stop="nextSlide"
              class="hidden sm:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white items-center justify-center backdrop-blur-md transition-all z-30 cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Next Slide"
            >
              <FlowbiteIcon name="chevron-right" size="22" stroke-width="2.5" />
            </button>

            <!-- Clickable Invisible Tap Zones for Mobile Navigation (tap left to go back, right to go forward) -->
            <div
              class="absolute left-0 top-0 bottom-0 w-1/3 z-25 cursor-pointer select-none"
              @click="prevSlide"
              aria-hidden="true"
            ></div>
            <div
              class="absolute right-0 top-0 bottom-0 w-2/3 z-25 cursor-pointer select-none"
              @click="nextSlide"
              aria-hidden="true"
            ></div>

            <!-- Slide Image & Card Presentation -->
            <div
              v-if="currentSlide"
              class="relative w-full max-w-[1080px] h-full max-h-[78vh] sm:max-h-[82vh] flex flex-col items-center justify-center"
            >
              <!-- Slide Media Asset -->
              <div class="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl bg-black/40">
                <img
                  :src="resolveAsset(currentSlide.image)"
                  :alt="currentSlide.title || currentStory?.title"
                  class="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-300"
                  decoding="async"
                />

                <!-- Subtle bottom gradient overlay for caption contrast -->
                <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

                <!-- Slide Content & Custom CTA Overlay -->
                <div class="absolute inset-x-0 bottom-0 p-5 sm:p-8 z-30 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-auto">
                  <div class="max-w-xl text-left">
                    <span
                      v-if="showBadgePills && currentSlide.badge"
                      class="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#F4EB6A] text-neutral-900 mb-2 shadow-sm"
                    >
                      {{ currentSlide.badge }}
                    </span>
                    <h4 v-if="currentSlide.title" class="text-lg sm:text-2xl font-bold text-white tracking-tight leading-tight">
                      {{ currentSlide.title }}
                    </h4>
                    <p v-if="currentSlide.description" class="text-xs sm:text-sm text-neutral-300 mt-1 line-clamp-2 sm:line-clamp-3">
                      {{ currentSlide.description }}
                    </p>
                  </div>

                  <!-- Custom CTA Button -->
                  <div v-if="currentSlide.ctaText" class="shrink-0">
                    <button
                      type="button"
                      @click="handleCtaClick(currentSlide.ctaLink)"
                      class="btn-primary text-xs sm:text-sm !py-2.5 sm:!py-3 !px-5 sm:!px-7 inline-flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold"
                    >
                      <span>{{ currentSlide.ctaText }}</span>
                      <FlowbiteIcon name="arrow-right" size="16" stroke-width="2.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Footer Bar: Tap Hint / Slide indicators -->
          <div class="relative z-30 w-full max-w-[1080px] mx-auto px-4 pb-4 pt-2 flex items-center justify-between text-neutral-400 text-xs">
            <span class="sm:hidden text-[11px]">Swipe left or tap to advance</span>
            <span class="hidden sm:inline text-xs">Use arrow keys or click to navigate</span>
            <div class="flex items-center gap-1.5">
              <span
                v-for="(st, idx) in visibleStories"
                :key="idx"
                :class="[
                  'w-1.5 h-1.5 rounded-full transition-all',
                  idx === activeStoryIndex ? 'bg-[#F4EB6A] w-4' : 'bg-neutral-600'
                ]"
              ></span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent, defaultInitialStories } from '../composables/useStoreContent'
import { useAsset } from '../composables/useAsset'

const emit = defineEmits(['navigate'])

const { productStories, showBadgePills } = useStoreContent()

// Filtered stories that are active
const visibleStories = computed(() => {
  const list = productStories?.value && productStories.value.length > 0
    ? productStories.value
    : defaultInitialStories
  return list.filter((s) => s.enabled !== false && s.status !== 'draft')
})

// Track viewed story IDs in local storage
const viewedStories = ref(new Set())
const hasViewedStory = (id) => viewedStories.value.has(id)

// Active Story & Slide Index
const activeStoryIndex = ref(null)
const currentSlideIndex = ref(0)
const lightboxRef = ref(null)

// 5-Second Auto-Rotate Timers & Progress
const slideDuration = 5000 // 5 seconds per slide
const slideProgress = ref(0) // 0 to 100%
let slideTimer = null
const isSlidePaused = ref(false)

// Homepage Story Circles Static Thumbnail (matches designated cover/icon)
const getStoryCurrentThumb = (story) => {
  if (!story) return ''
  const raw = story.icon || story.coverImage || (Array.isArray(story.slides) && story.slides[0]?.image) || ''
  if (typeof raw === 'object' && raw?.url) return raw.url
  return typeof raw === 'string' ? raw : ''
}

const startSlideTimer = () => {
  stopSlideTimer()
  slideProgress.value = 0
  isSlidePaused.value = false
  if (typeof window === 'undefined') return
  const tickMs = 50
  const step = (tickMs / slideDuration) * 100
  slideTimer = setInterval(() => {
    if (!isSlidePaused.value && activeStoryIndex.value !== null) {
      slideProgress.value += step
      if (slideProgress.value >= 100) {
        slideProgress.value = 0
        nextSlide()
      }
    }
  }, tickMs)
}

const stopSlideTimer = () => {
  if (slideTimer) {
    clearInterval(slideTimer)
    slideTimer = null
  }
  slideProgress.value = 0
}

const pauseSlideTimer = () => {
  isSlidePaused.value = true
}

const resumeSlideTimer = () => {
  isSlidePaused.value = false
}

const currentStory = computed(() => {
  if (activeStoryIndex.value === null) return null
  return visibleStories.value[activeStoryIndex.value] || null
})

const currentStorySlides = computed(() => {
  if (!currentStory.value) return []
  if (Array.isArray(currentStory.value.slides) && currentStory.value.slides.length > 0) {
    return currentStory.value.slides
  }
  // Fallback to single slide using cover/icon
  return [
    {
      image: currentStory.value.coverImage || currentStory.value.icon || '/images/promo-banner.jpg',
      title: currentStory.value.title,
      description: currentStory.value.description || '',
      ctaText: currentStory.value.ctaText || 'Explore More',
      ctaLink: currentStory.value.ctaLink || '#featured'
    }
  ]
})

const currentSlide = computed(() => {
  return currentStorySlides.value[currentSlideIndex.value] || null
})

const canGoPrev = computed(() => {
  return currentSlideIndex.value > 0 || (activeStoryIndex.value !== null && activeStoryIndex.value > 0)
})

const canGoNext = computed(() => {
  if (activeStoryIndex.value === null) return false
  const isLastSlide = currentSlideIndex.value >= currentStorySlides.value.length - 1
  const isLastStory = activeStoryIndex.value >= visibleStories.value.length - 1
  return !(isLastSlide && isLastStory)
})

const openStory = (index) => {
  activeStoryIndex.value = index
  currentSlideIndex.value = 0
  const story = visibleStories.value[index]
  if (story?.id) {
    viewedStories.value.add(story.id)
    saveViewedStories()
  }
  startSlideTimer()
  nextTick(() => {
    if (lightboxRef.value) {
      lightboxRef.value.focus()
    }
  })
}

const closeStory = () => {
  stopSlideTimer()
  activeStoryIndex.value = null
  currentSlideIndex.value = 0
}

const prevSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
    startSlideTimer()
  } else if (activeStoryIndex.value > 0) {
    activeStoryIndex.value--
    currentSlideIndex.value = currentStorySlides.value.length - 1
    startSlideTimer()
  }
}

const nextSlide = () => {
  if (currentSlideIndex.value < currentStorySlides.value.length - 1) {
    currentSlideIndex.value++
    startSlideTimer()
  } else if (activeStoryIndex.value < visibleStories.value.length - 1) {
    activeStoryIndex.value++
    currentSlideIndex.value = 0
    const nextSt = visibleStories.value[activeStoryIndex.value]
    if (nextSt?.id) {
      viewedStories.value.add(nextSt.id)
      saveViewedStories()
    }
    startSlideTimer()
  } else {
    // End of all stories -> close or restart
    closeStory()
  }
}

const handleCtaClick = (link) => {
  closeStory()
  if (!link) return
  if (link.startsWith('http')) {
    window.open(link, '_blank', 'noopener,noreferrer')
  } else if (link.startsWith('#')) {
    const el = document.querySelector(link)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  } else {
    emit('navigate', link)
  }
}

// Touch swipe gestures
let touchStartX = 0
let touchStartY = 0

const onTouchStart = (e) => {
  if (!e.touches?.[0]) return
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

const onTouchMove = (e) => {
  // Prevent page scroll while swiping inside modal
  if (e.cancelable) {
    // allow horizontal swipe detection
  }
}

const onTouchEnd = (e) => {
  if (!e.changedTouches?.[0]) return
  const diffX = e.changedTouches[0].clientX - touchStartX
  const diffY = e.changedTouches[0].clientY - touchStartY

  // Check if horizontal swipe is dominant and significant (> 45px)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
    if (diffX < 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  } else if (diffY > 80 && Math.abs(diffX) < 40) {
    // Swipe down to close
    closeStory()
  }
}

// Keyboard arrow navigation
const handleKeyDown = (e) => {
  if (activeStoryIndex.value === null) return
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault()
    nextSlide()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevSlide()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    closeStory()
  }
}

// LocalStorage helpers for viewed state
const loadViewedStories = () => {
  if (typeof window === 'undefined') return
  try {
    const saved = sessionStorage.getItem('ystore_viewed_stories')
    if (saved) {
      viewedStories.value = new Set(JSON.parse(saved))
    }
  } catch {}
}

const saveViewedStories = () => {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem('ystore_viewed_stories', JSON.stringify([...viewedStories.value]))
  } catch {}
}

const resolveAsset = (path) => {
  if (!path) return useAsset('/images/promo-banner.jpg')
  const str = typeof path === 'object' && path?.url ? String(path.url) : (typeof path === 'string' ? path : '')
  if (!str) return useAsset('/images/promo-banner.jpg')
  if (str.startsWith('http') || str.startsWith('data:') || str.startsWith('blob:')) {
    return str
  }
  return useAsset(str)
}

onMounted(() => {
  loadViewedStories()
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  stopSlideTimer()
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown)
  }
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

.story-fade-enter-active,
.story-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.story-fade-enter-from,
.story-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>

