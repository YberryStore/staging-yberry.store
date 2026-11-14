<template>
  <section
    v-if="slides.length > 0"
    class="relative w-full overflow-hidden bg-neutral-950 group"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Slide Container with Full-Width Auto Height (No 1920x800 Limit) -->
    <div
      ref="bannerFrameRef"
      class="relative w-full hero-banner-frame h-auto overflow-hidden"
    >
      <transition-group name="fade" tag="div" class="relative w-full h-auto">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          v-show="currentSlide === index"
          :class="[
            'w-full',
            currentSlide === index ? 'relative hero-slide-active z-10 w-full h-auto' : 'absolute inset-0 pointer-events-none z-0'
          ]"
        >
          <!-- Full Cover Background Media: Responsive Separate Mobile Asset or Unified Asset -->
          <template v-if="slide.hasDifferentMobile">
            <!-- Mobile Presentation (< 640px) -->
            <video
              v-if="slide.mobileIsVideo"
              :src="slide.mobileUrl"
              autoplay
              loop
              muted
              :muted="true"
              playsinline
              webkit-playsinline
              preload="auto"
              class="sm:hidden block w-full h-auto object-cover object-center"
              style="object-fit: cover !important; object-position: center !important; width: 100%; height: auto;"
              :aria-label="slide.altText || slide.title"
            ></video>
            <img
              v-else-if="slide.mobileUrl"
              :src="slide.mobileUrl"
              :alt="slide.altText || slide.title"
              class="sm:hidden block w-full h-auto object-cover object-center"
              style="object-fit: cover !important; object-position: center !important; width: 100%; height: auto;"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'low'"
              decoding="async"
            />

            <!-- Desktop Presentation (>= 640px) -->
            <video
              v-if="slide.desktopIsVideo"
              :src="slide.videoUrl || slide.desktopUrl"
              autoplay
              loop
              muted
              :muted="true"
              playsinline
              webkit-playsinline
              preload="auto"
              class="hidden sm:block w-full h-auto min-h-[380px] object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-700 ease-out"
              style="object-fit: cover !important; object-position: center !important; width: 100%; height: auto;"
              :aria-label="slide.altText || slide.title"
            ></video>
            <img
              v-else-if="slide.desktopUrl"
              :src="slide.desktopUrl"
              :alt="slide.altText || slide.title"
              class="hidden sm:block w-full h-auto min-h-[380px] object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-700 ease-out"
              style="object-fit: cover !important; object-position: center !important; width: 100%; height: auto;"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'low'"
              decoding="async"
            />
          </template>

          <template v-else>
            <!-- Unified Presentation (Shared Asset between Desktop and Mobile) -->
            <video
              v-if="slide.desktopIsVideo || slide.mobileIsVideo"
              :src="slide.videoUrl || slide.desktopUrl || slide.mobileUrl"
              autoplay
              loop
              muted
              :muted="true"
              playsinline
              webkit-playsinline
              preload="auto"
              class="w-full h-auto sm:min-h-[380px] object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-700 ease-out block"
              style="object-fit: cover !important; object-position: center !important; width: 100%; height: auto;"
              :aria-label="slide.altText || slide.title"
            ></video>
            <img
              v-else-if="slide.desktopUrl || slide.mobileUrl"
              :src="slide.desktopUrl || slide.mobileUrl"
              :alt="slide.altText || slide.title"
              class="w-full h-auto sm:min-h-[380px] object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-700 ease-out block"
              style="object-fit: cover !important; object-position: center !important; width: 100%; height: auto;"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'low'"
              decoding="async"
            />
          </template>

          <!-- Gradient Overlays for Readability -->
          <div class="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/45 to-transparent hidden sm:block pointer-events-none z-[1]"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-neutral-950/85 via-neutral-950/40 to-transparent sm:hidden pointer-events-none z-[1]"></div>

          <!-- Aligned Hero Caption Content Container: Full Width & Auto-height overlay -->
          <div class="absolute inset-0 z-10 w-full h-full px-4 sm:px-8 lg:px-16 xl:px-20 flex items-center py-6 sm:py-16 md:py-20 lg:py-24 pointer-events-none">
            <div class="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl text-white drop-shadow-md pointer-events-auto">
              <span
                v-if="showBadgePills && slide.badge"
                class="inline-block px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#F4EB6A] text-neutral-900 mb-2 sm:mb-3 shadow-sm tracking-wide"
              >
                {{ slide.badge }}
              </span>
              <h1
                v-if="slide.title"
                class="w-full max-w-4xl text-2xl sm:text-[36px] font-medium tracking-tight text-white mb-2 sm:mb-4 leading-tight sm:leading-[1.25]"
              >
                {{ slide.title }}
              </h1>
              <p
                v-if="slide.description"
                class="text-xs sm:text-base lg:text-lg text-neutral-200 mb-4 sm:mb-8 font-light leading-relaxed max-w-2xl line-clamp-3 sm:line-clamp-none"
              >
                {{ slide.description }}
              </p>
              <div v-if="slide.buttonText && slide.link" class="flex items-center gap-3">
                <a
                  :href="slide.link"
                  class="btn-primary text-xs sm:text-base !py-2 sm:!py-3 !px-5 sm:!px-7 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <span>{{ slide.buttonText }}</span>
                  <FlowbiteIcon name="arrow-right" size="16" class="sm:w-[18px] sm:h-[18px]" stroke-width="2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Right Arrow Navigation -->
      <button
        v-if="slides.length > 1"
        type="button"
        @click="nextSlide"
        class="absolute right-2 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#FAF7BA]/90 hover:bg-[#F4EB6A] text-neutral-900 flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 z-20 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <FlowbiteIcon name="chevron-right" size="18" class="sm:w-[22px] sm:h-[22px]" stroke-width="2" />
      </button>

      <!-- Pagination Dots with Live 5000ms Time Progression Fill -->
      <div
        v-if="slides.length > 1"
        class="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 sm:gap-2.5 z-20"
      >
        <button
          v-for="(_, index) in slides"
          :key="index"
          type="button"
          @click="goToSlide(index)"
          :class="[
            'h-2 sm:h-2.5 rounded-full transition-all duration-300 overflow-hidden relative cursor-pointer shadow-md select-none',
            currentSlide === index
              ? 'w-7 sm:w-8 bg-neutral-600/70'
              : 'w-2 sm:w-2.5 bg-neutral-400/80 hover:bg-white'
          ]"
          :aria-label="`Go to slide ${index + 1}`"
        >
          <!-- Active Slide Fill Progression Bar (Fills #F4EB6A over 5000ms) -->
          <span
            v-if="currentSlide === index"
            :key="`fill-${index}-${slideKey}`"
            class="banner-progress-fill absolute inset-0 bg-[#F4EB6A] rounded-full pointer-events-none"
            :style="{
              animationDuration: `${SLIDE_DURATION}ms`,
              animationPlayState: isPaused ? 'paused' : 'running'
            }"
            @animationend="handleProgressEnd"
          ></span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'

const SLIDE_DURATION = 5000

const { activeBanners, initContentListeners, isVideoFile, showBadgePills } = useStoreContent()

const bannerFrameRef = ref(null)
const currentSlide = ref(0)
const slideKey = ref(0)
const isPaused = ref(false)
let fallbackTimer = null

const slides = computed(() => {
  if (!activeBanners.value || activeBanners.value.length === 0) {
    return []
  }

  return activeBanners.value
    .filter((b) => b && (b.desktopUrl || b.videoUrl || b.mobileUrl || b.image))
    .map((b) => {
      const desktop = b.desktopUrl || b.image || ''
      const mobile = b.mobileUrl || desktop
      const video = b.videoUrl || ''

      const isDesktopVid = !!video || b.desktopType === 'video' || (isVideoFile && isVideoFile(desktop))
      const isMobileVid = b.mobileType === 'video' || (isVideoFile && isVideoFile(mobile))
      const hasDifferentMobile = !!b.mobileUrl && (b.mobileUrl !== desktop || isMobileVid !== isDesktopVid)

      return {
        id: b.id,
        desktopUrl: desktop,
        desktopType: b.desktopType || (isDesktopVid ? 'video' : 'image'),
        desktopIsVideo: isDesktopVid,
        mobileUrl: mobile,
        mobileType: b.mobileType || (isMobileVid ? 'video' : 'image'),
        mobileIsVideo: isMobileVid,
        hasDifferentMobile,
        videoUrl: video,
        isVideo: isDesktopVid || isMobileVid,
        badge: b.badge || '',
        title: b.title || '',
        description: b.subtitle || b.description || '',
        buttonText: b.buttonText || 'Explore Catalog',
        link: b.link || '#featured',
        altText: b.altText || b.title || 'Hero banner'
      }
    })
})

const playVisibleVideos = () => {
  if (typeof document === 'undefined') return
  setTimeout(() => {
    if (!bannerFrameRef.value) return
    const activeSlide = bannerFrameRef.value.querySelector('.hero-slide-active')
    if (activeSlide) {
      const vids = activeSlide.querySelectorAll('video')
      vids.forEach((v) => {
        v.muted = true
        v.playsInline = true
        const playPromise = v.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay prevented by browser power-saving mode
          })
        }
      })
    }
  }, 60)
}

const resetFallbackTimer = () => {
  if (fallbackTimer) {
    clearTimeout(fallbackTimer)
    fallbackTimer = null
  }
  if (slides.value.length <= 1 || isPaused.value) return
  fallbackTimer = setTimeout(() => {
    nextSlide()
  }, SLIDE_DURATION + 300)
}

const nextSlide = () => {
  if (slides.value.length <= 1) return
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  slideKey.value++
  resetFallbackTimer()
  playVisibleVideos()
}

const prevSlide = () => {
  if (slides.value.length <= 1) return
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
  slideKey.value++
  resetFallbackTimer()
  playVisibleVideos()
}

const goToSlide = (idx) => {
  if (currentSlide.value === idx) return
  currentSlide.value = idx
  slideKey.value++
  resetFallbackTimer()
  playVisibleVideos()
}

const handleProgressEnd = () => {
  nextSlide()
}

const handleMouseEnter = () => {
  isPaused.value = true
  if (fallbackTimer) {
    clearTimeout(fallbackTimer)
    fallbackTimer = null
  }
}

const handleMouseLeave = () => {
  isPaused.value = false
  resetFallbackTimer()
}

const onVisibilityChange = () => {
  if (typeof document === 'undefined') return
  if (document.hidden) {
    isPaused.value = true
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
  } else {
    isPaused.value = false
    resetFallbackTimer()
    playVisibleVideos()
  }
}

watch(
  () => slides.value.length,
  (len) => {
    if (currentSlide.value >= len) {
      currentSlide.value = 0
    }
    slideKey.value++
    resetFallbackTimer()
    playVisibleVideos()
  }
)

watch(currentSlide, () => {
  playVisibleVideos()
})

onMounted(() => {
  initContentListeners()
  resetFallbackTimer()
  playVisibleVideos()
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibilityChange)
  }
})

onUnmounted(() => {
  if (fallbackTimer) {
    clearTimeout(fallbackTimer)
    fallbackTimer = null
  }
  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }
})
</script>

<style scoped>
.hero-banner-frame {
  width: 100%;
  height: auto;
}

@keyframes bannerProgressFill {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

.banner-progress-fill {
  width: 0%;
  height: 100%;
  animation-name: bannerProgressFill;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.group:hover .banner-progress-fill {
  animation-play-state: paused;
}

img, video {
  object-fit: cover !important;
  object-position: center !important;
}

picture {
  display: block;
  width: 100%;
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
