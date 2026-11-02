<template>
  <header class="sticky top-0 z-40 w-full font-poppins">
    <!-- Top Announcement Bar -->
    <div class="bg-[#FAF7BA] text-[#423C27] text-xs font-semibold py-2 px-4 text-center tracking-wider border-b border-[#F4EB6A]/40 flex items-center justify-center gap-2">
      <span class="inline-block w-2 h-2 rounded-full bg-[#E5D744] animate-pulse"></span>
      <span>FREE SHIPPING ON ORDERS OVER R550</span>
    </div>

    <!-- Main Navigation Bar -->
    <nav class="bg-[#151515] text-white border-b border-neutral-800">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20 relative">
          <!-- Logo -->
          <a
            href="#"
            @click.prevent="$emit('navigate-home')"
            class="flex items-center group py-2"
            aria-label="Ystore Home"
          >
            <img
              :src="useAsset('/images/ystore-logo.svg')"
              alt="Ystore Logo"
              class="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </a>

          <!-- Desktop Navigation Links -->
          <div class="hidden md:flex items-center gap-8">
            <a
              v-for="item in navItems"
              :key="item.label"
              :href="item.href"
              :class="[
                'text-[15px] font-medium transition-colors duration-200 relative py-1 flex items-center gap-1.5',
                activeNav === item.label
                  ? 'text-[#F4EB6A]'
                  : 'text-neutral-300 hover:text-[#F4EB6A]'
              ]"
              @click.prevent="handleNavClick(item)"
            >
              <span>{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none bg-[#F4EB6A] text-neutral-900 shadow-xs"
              >
                {{ item.badge }}
              </span>
              <span
                v-if="activeNav === item.label"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-[#F4EB6A] rounded-full"
              ></span>
            </a>
          </div>

          <!-- Utility Icons / Actions -->
          <div class="flex items-center gap-3 sm:gap-4">
            <!-- Search Toggle / Input (Desktop) -->
            <div class="hidden sm:flex items-center">
              <!-- Expanded Inline Search Bar -->
              <div
                v-if="showSearchInput"
                class="flex items-center bg-neutral-800/95 text-white pl-3.5 pr-2 py-1.5 rounded-full border border-[#F4EB6A] shadow-md transition-all duration-200 w-64 lg:w-72"
              >
                <img :src="useAsset('/images/search-icon.svg')" alt="Search" class="w-5 h-5 object-contain mr-2.5 shrink-0 opacity-80" />
                <input
                  ref="searchInputRef"
                  type="text"
                  placeholder="Search toys, figures..."
                  class="bg-transparent text-sm text-white placeholder-neutral-400 focus:outline-none w-full"
                  v-model="searchQuery"
                  @keyup.enter="handleSearch"
                  @keydown.esc="closeSearch"
                />
                <button
                  type="button"
                  @click="closeSearch"
                  class="p-1 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-700/60 transition-colors ml-1 shrink-0"
                  aria-label="Close search"
                >
                  <FlowbiteIcon name="close" size="16" stroke-width="2" />
                </button>
              </div>

              <!-- Collapsed Search Button -->
              <button
                v-else
                type="button"
                @click="toggleSearch"
                class="p-2 text-neutral-300 hover:text-[#F4EB6A] hover:bg-neutral-800/80 rounded-full transition-all flex items-center justify-center hover:scale-105 active:scale-95"
                aria-label="Search"
              >
                <img :src="useAsset('/images/search-icon.svg')" alt="Search" class="w-8 h-8 object-contain" />
              </button>
            </div>

            <!-- Mobile Search Icon Button -->
            <button
              type="button"
              @click="toggleSearch"
              class="sm:hidden p-2 text-neutral-300 hover:text-[#F4EB6A] hover:bg-neutral-800/80 rounded-full transition-all flex items-center justify-center hover:scale-105 active:scale-95"
              aria-label="Search"
            >
              <img :src="useAsset('/images/search-icon.svg')" alt="Search" class="w-8 h-8 object-contain" />
            </button>

            <!-- Admin Dashboard Quick Button (Only visible to Super Admin) -->
            <button
              v-if="user && user.isAdmin"
              type="button"
              @click="$emit('open-admin')"
              class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 font-semibold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <FlowbiteIcon name="grid" size="14" stroke-width="2" />
              <span>Admin Dashboard</span>
            </button>

            <!-- User Account -->
            <button
              type="button"
              @click="$emit('open-account')"
              class="relative p-2 text-neutral-300 hover:text-[#F4EB6A] hover:bg-neutral-800/80 rounded-full transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              :aria-label="user ? `Account (${user.displayName})` : 'Account'"
            >
              <div
                v-if="user && user.photoURL"
                class="w-8 h-8 rounded-full overflow-hidden border-2 border-[#F4EB6A]"
              >
                <img :src="user.photoURL" :alt="user.displayName" class="w-full h-full object-cover" />
              </div>
              <div
                v-else-if="user"
                class="w-8 h-8 rounded-full bg-[#F4EB6A] text-neutral-900 font-bold text-xs flex items-center justify-center shadow-xs"
              >
                {{ (user.displayName || 'Y').slice(0, 2).toUpperCase() }}
              </div>
              <img v-else :src="useAsset('/images/user-icon.svg')" alt="Account" class="w-8 h-8 object-contain" />
              <span
                v-if="user"
                class="hidden lg:inline-block text-xs font-medium text-[#F4EB6A] max-w-[100px] truncate pr-1"
              >
                {{ user.displayName }}
              </span>
              <span
                v-if="user"
                class="w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#151515] absolute top-1.5 left-7"
              ></span>
            </button>

            <!-- Shopping Cart with Badge -->
            <button
              type="button"
              @click="$emit('open-cart')"
              class="relative p-2 text-white hover:text-[#F4EB6A] hover:bg-neutral-800/80 rounded-full transition-all flex items-center justify-center hover:scale-105 active:scale-95"
              aria-label="Shopping Cart"
            >
              <img :src="useAsset('/images/cart-icon.svg')" alt="Shopping Cart" class="w-8 h-8 object-contain" />
              <span
                v-if="cartCount > 0"
                class="absolute -top-1 -right-1 w-7 h-7 bg-red-700 text-white font-medium text-xs rounded-full flex items-center justify-center shadow-sm"
              >
                {{ cartCount }}
              </span>
            </button>

            <!-- Mobile Menu Toggle Button -->
            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 text-neutral-300 hover:text-white rounded-lg"
              aria-label="Open menu"
            >
              <FlowbiteIcon :name="mobileMenuOpen ? 'close' : 'bars'" size="22" stroke-width="1.5" />
            </button>
          </div>

          <!-- Mobile Full-Width Search Overlay -->
          <div
            v-if="showSearchInput"
            class="sm:hidden absolute inset-0 bg-[#151515] px-4 flex items-center gap-3 z-30"
          >
            <div class="flex-1 flex items-center bg-neutral-800/95 rounded-full pl-3.5 pr-2 py-1.5 border border-[#F4EB6A]">
              <img :src="useAsset('/images/search-icon.svg')" alt="Search" class="w-5 h-5 object-contain mr-2.5 shrink-0 opacity-80" />
              <input
                ref="mobileSearchInputRef"
                type="text"
                placeholder="Search toys, figures..."
                class="bg-transparent text-sm text-white placeholder-neutral-400 focus:outline-none w-full"
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                @keydown.esc="closeSearch"
              />
              <button
                v-if="searchQuery"
                type="button"
                @click="searchQuery = ''"
                class="p-1 text-neutral-400 hover:text-white mr-1"
                aria-label="Clear query"
              >
                <FlowbiteIcon name="close" size="14" stroke-width="2" />
              </button>
            </div>
            <button
              type="button"
              @click="closeSearch"
              class="text-sm font-medium text-[#F4EB6A] px-2 py-1 shrink-0"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-neutral-900 border-b border-neutral-800 px-4 pt-2 pb-6 space-y-3"
      >
        <div class="pt-2 pb-3">
          <input
            type="text"
            placeholder="Search toys, figures..."
            class="w-full bg-neutral-800 text-white placeholder-neutral-400 px-4 py-2 rounded-full border border-neutral-700 focus:outline-none focus:border-[#F4EB6A]"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="flex flex-col space-y-2">
          <a
            v-for="item in navItems"
            :key="item.label"
            :href="item.href"
            class="px-3 py-2.5 rounded-lg text-base font-medium text-neutral-200 hover:text-[#F4EB6A] hover:bg-neutral-800 transition-colors flex items-center justify-between"
            @click.prevent="handleNavClick(item); mobileMenuOpen = false"
          >
            <span>{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="px-2 py-0.5 rounded-full text-xs font-bold leading-none bg-[#F4EB6A] text-neutral-900"
            >
              {{ item.badge }}
            </span>
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'

const props = defineProps({
  cartCount: {
    type: Number,
    default: 0
  },
  currentView: {
    type: String,
    default: 'home'
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['open-cart', 'open-account', 'open-admin', 'search', 'navigate-home', 'navigate-specials', 'navigate-contact', 'navigate-category', 'navigate-blog', 'navigate-about'])

const activeNav = ref(
  props.currentView === 'specials' ? 'Specials' :
  (props.currentView === 'contact' ? 'Contact Us' :
  (props.currentView === 'category' ? 'Our Range' :
  (props.currentView === 'blog' ? 'Blog' :
  (props.currentView === 'about' ? 'About' : ''))))
)
const mobileMenuOpen = ref(false)
const showSearchInput = ref(false)
const searchQuery = ref('')
const searchInputRef = ref(null)
const mobileSearchInputRef = ref(null)

const navItems = [
  { label: 'Specials', href: '#specials', isPage: true },
  { label: 'Our Range', href: '#category', isPage: true },
  { label: 'Blog', href: '#blog', isPage: true },
  { label: 'About', href: '#about', isPage: true },
  { label: 'Contact Us', href: '#contact', isPage: true }
]

watch(() => props.currentView, (newView) => {
  if (newView === 'specials') {
    activeNav.value = 'Specials'
  } else if (newView === 'contact') {
    activeNav.value = 'Contact Us'
  } else if (newView === 'category') {
    activeNav.value = 'Our Range'
  } else if (newView === 'blog') {
    activeNav.value = 'Blog'
  } else if (newView === 'about') {
    activeNav.value = 'About'
  } else {
    activeNav.value = ''
  }
})

const handleNavClick = (item) => {
  activeNav.value = item.label
  if (item.label === 'Specials') {
    emit('navigate-specials')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else if (item.label === 'Our Range') {
    emit('navigate-category')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else if (item.label === 'Blog') {
    emit('navigate-blog')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else if (item.label === 'About') {
    emit('navigate-about')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else if (item.label === 'Contact Us') {
    emit('navigate-contact')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else {
    emit('navigate-home')
    if (typeof window !== 'undefined' && item.href && item.href.startsWith('#')) {
      const el = document.querySelector(item.href)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 120)
      }
    }
  }
}

const toggleSearch = () => {
  showSearchInput.value = !showSearchInput.value
  if (showSearchInput.value) {
    nextTick(() => {
      searchInputRef.value?.focus()
      mobileSearchInputRef.value?.focus()
    })
  }
}

const closeSearch = () => {
  showSearchInput.value = false
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    const el = document.getElementById('featured')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
