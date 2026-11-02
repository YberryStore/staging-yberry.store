<template>
  <div class="w-full bg-white font-poppins min-h-screen">
    <!-- Top Breadcrumbs Bar -->
    <section class="w-full pt-6 pb-2 border-b border-neutral-100">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between pb-4">
          <!-- Breadcrumbs -->
          <nav class="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 font-normal" aria-label="Breadcrumb">
            <button
              type="button"
              @click="$emit('back-home')"
              class="hover:text-neutral-900 transition-colors cursor-pointer flex items-center gap-1"
            >
              <FlowbiteIcon name="home" size="14" stroke-width="1.5" />
              <span>Home</span>
            </button>
            <span>&gt;</span>
            <button
              type="button"
              @click="activeArticle = null"
              class="hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Blog &amp; Stories
            </button>
            <template v-if="activeArticle">
              <span>&gt;</span>
              <span class="text-neutral-900 font-medium truncate max-w-[200px] sm:max-w-xs">{{ activeArticle.title }}</span>
            </template>
          </nav>

          <!-- Back action button -->
          <button
            v-if="activeArticle"
            type="button"
            @click="activeArticle = null"
            class="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <FlowbiteIcon name="arrow-left" size="14" stroke-width="2" />
            <span>All Articles</span>
          </button>
          <button
            v-else
            type="button"
            @click="$emit('back-home')"
            class="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <FlowbiteIcon name="arrow-left" size="14" stroke-width="2" />
            <span>Back to storefront</span>
          </button>
        </div>
      </div>
    </section>

    <!-- VIEW 1: DEDICATED FULL ARTICLE READER VIEW -->
    <article v-if="activeArticle" class="py-8 sm:py-14">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        
        <!-- Article Header Meta -->
        <div class="mb-6 sm:mb-8">
          <div class="flex items-center gap-2.5 mb-4 flex-wrap">
            <span class="bg-[#FAF7BA] text-[#423C27] text-xs font-bold px-3 py-1 rounded-full border border-[#F4EB6A]">
              {{ activeArticle.category }}
            </span>
            <span class="text-xs text-neutral-400">&bull;</span>
            <span class="text-xs text-neutral-500 flex items-center gap-1">
              <FlowbiteIcon name="clock" size="13" stroke-width="2" />
              {{ activeArticle.readTime }}
            </span>
            <span class="text-xs text-neutral-400">&bull;</span>
            <span class="text-xs text-neutral-500">{{ activeArticle.date }}</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900 leading-tight mb-6">
            {{ activeArticle.title }}
          </h1>

          <!-- Author Info & Share Bar -->
          <div class="flex items-center justify-between pb-6 border-b border-neutral-200 gap-4 flex-wrap">
            <div class="flex items-center gap-3">
              <img
                :src="activeArticle.author.avatar"
                :alt="activeArticle.author.name"
                class="w-12 h-12 rounded-full object-cover border border-neutral-200"
              />
              <div>
                <div class="text-sm font-semibold text-neutral-900">{{ activeArticle.author.name }}</div>
                <div class="text-xs text-neutral-500">{{ activeArticle.author.role }}</div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="shareArticle"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <FlowbiteIcon name="share" size="14" stroke-width="2" />
                <span>{{ copied ? 'Link Copied!' : 'Share Article' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Featured Banner Image -->
        <div class="rounded-3xl overflow-hidden aspect-video sm:aspect-21/9 bg-neutral-100 mb-10 shadow-md">
          <img
            :src="activeArticle.coverImage"
            :alt="activeArticle.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Article Rich Content Body -->
        <div class="prose prose-neutral max-w-none space-y-6 text-neutral-700 leading-relaxed font-light text-base sm:text-lg">
          
          <!-- Key Takeaways Callout Box -->
          <div class="p-6 rounded-2xl bg-gradient-to-br from-[#FEFEEB] to-[#FAF7BA]/30 border border-[#F4EB6A] not-prose my-6">
            <div class="flex items-center gap-2 text-sm font-bold text-[#423C27] mb-2 uppercase tracking-wide">
              <FlowbiteIcon name="sparkles" size="18" stroke-width="2" class="text-amber-600" />
              <span>Key Takeaways</span>
            </div>
            <ul class="space-y-2 text-xs sm:text-sm text-neutral-800 font-normal">
              <li v-for="(point, i) in activeArticle.takeaways" :key="i" class="flex items-start gap-2">
                <span class="text-[#DEC02A] font-bold">&check;</span>
                <span>{{ point }}</span>
              </li>
            </ul>
          </div>

          <!-- Article Text Sections -->
          <div v-for="(section, idx) in activeArticle.content" :key="idx" class="space-y-3">
            <h2 v-if="section.heading" class="text-xl sm:text-2xl font-semibold text-neutral-900 mt-8 mb-3">
              {{ section.heading }}
            </h2>
            <p v-for="(paragraph, pIdx) in section.paragraphs" :key="pIdx">
              {{ paragraph }}
            </p>
            <blockquote v-if="section.quote" class="border-l-4 border-[#F4EB6A] pl-4 py-1 italic font-normal text-neutral-900 my-4 bg-neutral-50 rounded-r-xl">
              "{{ section.quote }}"
            </blockquote>
          </div>

          <!-- Mentioned Product Card in Article -->
          <div v-if="activeArticle.relatedProduct" class="my-10 p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm flex flex-col sm:flex-row items-center gap-5 not-prose">
            <img
              :src="activeArticle.relatedProduct.image"
              :alt="activeArticle.relatedProduct.name"
              class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover bg-neutral-100 shrink-0"
            />
            <div class="flex-1 text-center sm:text-left">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Featured in this story</span>
              <h3 class="text-base sm:text-lg font-medium text-neutral-900 mt-0.5">
                {{ activeArticle.relatedProduct.name }}
              </h3>
              <p class="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                {{ activeArticle.relatedProduct.description }}
              </p>
              <div class="text-base font-semibold text-neutral-900 mt-2">
                R{{ activeArticle.relatedProduct.price }}
              </div>
            </div>
            <div class="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                @click="$emit('view-product', activeArticle.relatedProduct)"
                class="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-neutral-300 hover:border-neutral-900 text-xs font-semibold text-neutral-800 transition-colors"
              >
                View Product
              </button>
              <button
                type="button"
                @click="$emit('add-to-cart', activeArticle.relatedProduct)"
                class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div class="pt-6 border-t border-neutral-200 flex items-center gap-2 flex-wrap not-prose">
            <span class="text-xs font-medium text-neutral-400 mr-1">Tags:</span>
            <span
              v-for="tag in activeArticle.tags"
              :key="tag"
              class="px-3 py-1 rounded-lg bg-neutral-100 text-xs font-medium text-neutral-600"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Author Biography Footer -->
          <div class="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 not-prose mt-8 flex items-center gap-4">
            <img
              :src="activeArticle.author.avatar"
              :alt="activeArticle.author.name"
              class="w-14 h-14 rounded-full object-cover border border-neutral-200 shrink-0"
            />
            <div>
              <div class="text-sm font-bold text-neutral-900">Written by {{ activeArticle.author.name }}</div>
              <p class="text-xs text-neutral-500 mt-1 leading-relaxed">
                {{ activeArticle.author.bio }}
              </p>
            </div>
          </div>

          <!-- Bottom Return Navigation -->
          <div class="pt-10 flex items-center justify-between not-prose">
            <button
              type="button"
              @click="activeArticle = null"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <FlowbiteIcon name="arrow-left" size="14" stroke-width="2" />
              <span>Back to all stories</span>
            </button>
            <button
              type="button"
              @click="readNextArticle"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>Next story</span>
              <FlowbiteIcon name="chevron-right" size="14" stroke-width="2" />
            </button>
          </div>

        </div>

      </div>
    </article>


    <!-- VIEW 2: FULL BLOG CATALOG & EDITORIAL STORIES -->
    <div v-else>
      <!-- Hero Header -->
      <section class="py-12 sm:py-16 bg-neutral-900 text-white relative overflow-hidden">
        <div class="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#F4EB6A]/10 blur-3xl pointer-events-none"></div>
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="max-w-2xl">
            <span class="inline-flex items-center gap-2 bg-neutral-800 text-[#F4EB6A] text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-neutral-700">
              <FlowbiteIcon name="book" size="14" stroke-width="2" />
              <span>The Yellow Berry Chronicle</span>
            </span>
            <h1 class="text-3xl sm:text-5xl font-medium tracking-tight text-white mb-4">
              Stories, Craft &amp; <span class="italic font-light text-[#F4EB6A]">Play</span>
            </h1>
            <p class="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              Explore insightful guides, product spotlights, creative lifestyle trends, and behind-the-scenes stories from our workshop.
            </p>
          </div>
        </div>
      </section>

      <!-- Featured Headline Story (Hero Card) -->
      <section v-if="featuredArticle" class="py-8 sm:py-10 bg-neutral-50/50">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            v-if="featuredArticle"
            @click="openArticle(featuredArticle)"
            class="group relative rounded-3xl overflow-hidden bg-white border border-neutral-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row cursor-pointer"
          >
            <!-- Image half -->
            <div class="lg:w-1/2 aspect-video lg:aspect-auto relative overflow-hidden bg-neutral-100 min-h-[300px]">
              <img
                :src="featuredArticle.coverImage"
                :alt="featuredArticle.title"
                class="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <span class="absolute top-4 left-4 bg-[#F4EB6A] text-neutral-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Featured Editorial
              </span>
            </div>

            <!-- Content half -->
            <div class="lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 text-xs text-neutral-400 mb-3 font-medium">
                  <span class="text-[#DEC02A] font-bold">{{ featuredArticle.category }}</span>
                  <span>&bull;</span>
                  <span>{{ featuredArticle.date }}</span>
                  <span>&bull;</span>
                  <span>{{ featuredArticle.readTime }}</span>
                </div>

                <h2 class="text-2xl sm:text-3xl font-medium text-neutral-900 group-hover:text-amber-800 transition-colors leading-snug tracking-tight mb-3">
                  {{ featuredArticle.title }}
                </h2>

                <p class="text-xs sm:text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-6 font-light">
                  {{ featuredArticle.excerpt }}
                </p>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
                <div class="flex items-center gap-2.5">
                  <img
                    :src="featuredArticle.author.avatar"
                    :alt="featuredArticle.author.name"
                    class="w-8 h-8 rounded-full object-cover"
                  />
                  <span class="text-xs font-medium text-neutral-800">{{ featuredArticle.author.name }}</span>
                </div>

                <div class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:text-[#DEC02A] transition-colors">
                  <span>Read Story</span>
                  <FlowbiteIcon name="arrow-right" size="14" stroke-width="2" class="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Filter Tabs & Search Bar -->
      <section class="py-6 bg-white border-y border-neutral-100">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <!-- Category Pills -->
            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button
                v-for="cat in blogCategories"
                :key="cat"
                type="button"
                @click="selectedCategory = cat"
                :class="[
                  'px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer',
                  selectedCategory === cat
                    ? 'bg-[#F4EB6A] text-neutral-900 font-semibold shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                ]"
              >
                {{ cat }}
              </button>
            </div>

            <!-- Search input -->
            <div class="relative w-full md:w-72">
              <FlowbiteIcon name="search" size="16" stroke-width="2" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search articles..."
                class="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-full border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#F4EB6A] focus:bg-white transition-colors"
              />
              <button
                v-if="searchQuery"
                type="button"
                @click="searchQuery = ''"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <FlowbiteIcon name="close" size="12" stroke-width="2" />
              </button>
            </div>

          </div>
        </div>
      </section>

      <!-- Articles Grid -->
      <section class="py-12 sm:py-16 bg-neutral-50/40">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Empty Results -->
          <div
            v-if="filteredArticles.length === 0"
            class="py-16 text-center bg-white rounded-3xl border border-neutral-200 p-8"
          >
            <FlowbiteIcon name="search" size="32" class="mx-auto text-neutral-300 mb-3" />
            <h3 class="text-lg font-semibold text-neutral-900">No blog posts published yet</h3>
            <p class="text-xs sm:text-sm text-neutral-500 mt-1">
              Articles and stories will appear here once published in <code class="text-neutral-700 font-semibold">ystore-db</code>.
            </p>
            <button
              v-if="selectedCategory !== 'All' || searchQuery"
              type="button"
              @click="selectedCategory = 'All'; searchQuery = ''"
              class="mt-4 px-4 py-2 rounded-full bg-[#F4EB6A] text-xs font-semibold text-neutral-900"
            >
              Reset Filters
            </button>
          </div>

          <!-- Cards Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <article
              v-for="article in filteredArticles"
              :key="article.id"
              @click="openArticle(article)"
              class="group bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-[#F4EB6A] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <!-- Card Top: Image & Category Badge -->
              <div>
                <div class="aspect-16/10 relative overflow-hidden bg-neutral-100">
                  <img
                    :src="article.coverImage"
                    :alt="article.title"
                    class="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <span class="absolute top-3 left-3 bg-[#FEFEEB] text-neutral-900 border border-[#F4EB6A] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    {{ article.category }}
                  </span>
                </div>

                <!-- Text content -->
                <div class="p-5 sm:p-6">
                  <div class="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                    <span>{{ article.date }}</span>
                    <span>&bull;</span>
                    <span>{{ article.readTime }}</span>
                  </div>

                  <h3 class="text-lg sm:text-xl font-medium text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                    {{ article.title }}
                  </h3>

                  <p class="text-xs sm:text-sm text-neutral-500 line-clamp-3 mt-2 leading-relaxed font-light">
                    {{ article.excerpt }}
                  </p>
                </div>
              </div>

              <!-- Card Bottom: Author & Read link -->
              <div class="p-5 sm:p-6 mt-auto flex items-center justify-between border-t border-neutral-100 pt-4">
                <div class="flex items-center gap-2">
                  <img
                    :src="article.author.avatar"
                    :alt="article.author.name"
                    class="w-7 h-7 rounded-full object-cover"
                  />
                  <span class="text-xs text-neutral-700 font-medium">{{ article.author.name }}</span>
                </div>

                <span class="text-xs font-semibold text-neutral-900 group-hover:text-[#DEC02A] inline-flex items-center gap-1 transition-colors">
                  <span>Read</span>
                  <FlowbiteIcon name="chevron-right" size="14" stroke-width="2" class="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          </div>

        </div>
      </section>

      <!-- Newsletter Invitation Banner -->
      <section class="py-12 sm:py-16 bg-white border-t border-neutral-100">
        <div class="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-700">Stay in the loop</span>
          <h2 class="text-2xl sm:text-4xl font-medium text-neutral-900 mt-2 tracking-tight">
            Want fresh product releases, tips &amp; exclusive stories in your inbox?
          </h2>
          <p class="text-xs sm:text-sm text-neutral-500 mt-2 max-w-lg mx-auto">
            Subscribe to our weekly dispatch for Montessori tips, early drops, and exclusive maker stories.
          </p>

          <form @submit.prevent="subscribed = true" class="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              class="flex-1 px-4 py-3 rounded-full border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#F4EB6A] bg-neutral-50/50"
            />
            <button
              type="submit"
              class="px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
            >
              {{ subscribed ? 'Subscribed!' : 'Subscribe' }}
            </button>
          </form>
        </div>
      </section>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'

defineEmits(['back-home', 'view-product', 'add-to-cart'])

const { blogs: articles, initContentListeners } = useStoreContent()

onMounted(() => {
  initContentListeners()
})

const activeArticle = ref(null)
const selectedCategory = ref('All')
const searchQuery = ref('')
const copied = ref(false)
const subscribed = ref(false)

const blogCategories = computed(() => {
  const cats = new Set(['All'])
  articles.value.forEach(a => {
    if (a.category) cats.add(a.category)
  })
  return Array.from(cats)
})

const featuredArticle = computed(() => {
  return articles.value.find(a => a.featured) || articles.value[0] || null
})

const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    if (selectedCategory.value !== 'All' && article.category !== selectedCategory.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchTitle = article.title.toLowerCase().includes(q)
      const matchExcerpt = article.excerpt.toLowerCase().includes(q)
      const matchTag = (article.tags || []).some(t => t.toLowerCase().includes(q))
      if (!matchTitle && !matchExcerpt && !matchTag) return false
    }
    return true
  })
})

const openArticle = (article) => {
  activeArticle.value = article
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const readNextArticle = () => {
  if (!activeArticle.value || articles.value.length === 0) return
  const currentIndex = articles.value.findIndex(a => a.id === activeArticle.value.id)
  const nextIndex = (currentIndex + 1) % articles.value.length
  activeArticle.value = articles.value[nextIndex]
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const shareArticle = () => {
  if (typeof window !== 'undefined') {
    navigator.clipboard?.writeText(window.location.href)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  }
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
