<template>
  <div class="min-h-screen bg-white text-neutral-900 font-poppins selection:bg-[#F4EB6A] selection:text-neutral-900">
    <!-- ==========================================
         FULL-SCREEN ADMIN DASHBOARD (CMS - Admin Only)
         ========================================== -->
    <AdminDashboard
      v-if="currentView === 'admin' && isAdmin"
      @view-storefront="currentView = 'home'"
      @signed-out="handleAdminSignedOut"
    />

    <!-- ==========================================
         SECRET CMS AUTHENTICATION GATEWAY
         ========================================== -->
    <CmsAuthGateway
      v-else-if="currentView === 'cms-auth'"
      @authenticated="currentView = 'admin'"
      @back-to-storefront="currentView = 'home'"
    />

    <!-- ==========================================
         PUBLIC STOREFRONT SHELL
         ========================================== -->
    <template v-else>
      <!-- Navbar -->
      <Navbar
        :cart-count="totalCartCount"
        :current-view="currentView"
        :user="currentUser"
        @open-cart="isCartOpen = true"
        @open-account="handleOpenAccount"
        @open-admin="openAdminDashboard"
        @navigate-home="currentView = 'home'"
        @navigate-specials="currentView = 'specials'"
        @navigate-contact="currentView = 'contact'"
        @navigate-category="handleCategorySelect('All')"
        @navigate-blog="currentView = 'blog'"
        @navigate-about="currentView = 'about'"
      />

      <!-- Main Content -->
      <main>
        <!-- Dedicated Product Detail Page (Matches design mockup) -->
        <ProductDetailPage
          v-if="currentView === 'product'"
          :product="selectedProduct"
          @back-home="currentView = 'home'"
          @add-to-cart="addToCart"
          @buy-now="handleBuyNow"
          @view-product="handleViewProduct"
        />

        <!-- Dedicated Specials & Flash Deals Page -->
        <SpecialsPage
          v-else-if="currentView === 'specials'"
          @back-home="currentView = 'home'"
          @view-product="handleViewProduct"
          @add-to-cart="addToCart"
          @quick-view="openQuickView"
          @toggle-wishlist="handleWishlist"
        />

        <!-- Dedicated Products Category Page -->
        <CategoryPage
          v-else-if="currentView === 'category'"
          :initial-category="selectedCategoryFilter"
          @back-home="currentView = 'home'"
          @view-product="handleViewProduct"
          @add-to-cart="addToCart"
          @quick-view="openQuickView"
          @toggle-wishlist="handleWishlist"
        />

        <!-- Dedicated Contact Us Page (Matches reference design) -->
        <ContactPage
          v-else-if="currentView === 'contact'"
          @back-home="currentView = 'home'"
          @view-specials="currentView = 'specials'"
        />

        <!-- Dedicated Blog & Stories Page -->
        <BlogPage
          v-else-if="currentView === 'blog'"
          @back-home="currentView = 'home'"
          @view-product="handleViewProduct"
          @add-to-cart="addToCart"
        />

        <!-- Dedicated About Us Page -->
        <AboutPage
          v-else-if="currentView === 'about'"
          @back-home="currentView = 'home'"
          @view-range="handleCategorySelect('All')"
          @contact-us="currentView = 'contact'"
        />

        <!-- Homepage Catalog Sections -->
        <div v-else>
          <!-- Hero Banner Carousel (Hidden when no banner is loaded) -->
          <HeroBanner v-if="hasActiveBanners" />

          <!-- Value Propositions / Features Bar -->
          <FeaturesBar />

          <!-- Shop by category (Hidden when no products loaded or mapped) -->
          <CategoryGrid
            v-if="hasCategoriesWithProducts"
            @select-category="handleCategorySelect"
          />

          <!-- Feature Products (Hidden when no featured products loaded or mapped) -->
          <FeaturedProducts
            v-if="hasFeaturedProducts"
            @add-to-cart="addToCart"
            @quick-view="openQuickView"
            @toggle-wishlist="handleWishlist"
            @view-product="handleViewProduct"
          />

          <!-- New arrivals (Hidden when no new arrivals loaded or mapped) -->
          <NewArrivals
            v-if="hasNewArrivals"
            @add-to-cart="addToCart"
            @quick-view="openQuickView"
            @toggle-wishlist="handleWishlist"
            @view-product="handleViewProduct"
          />

          <!-- Best sellers (Hidden when no best sellers loaded or mapped) -->
          <BestSellers
            v-if="hasBestSellers"
            @add-to-cart="addToCart"
            @quick-view="openQuickView"
            @toggle-wishlist="handleWishlist"
            @view-product="handleViewProduct"
          />

          <!-- Testimonials: What our customers say -->
          <Testimonials />

          <!-- Newsletter Subscribe -->
          <Newsletter />
        </div>
      </main>

      <!-- App Footer -->
      <AppFooter
        @navigate-contact="currentView = 'contact'"
        @navigate-about="currentView = 'about'"
      />
    </template>

    <!-- Slide-over Cart Drawer -->
    <CartDrawer
      :is-open="isCartOpen"
      :items="cartItems"
      :user="currentUser"
      @close="isCartOpen = false"
      @update-qty="updateCartQty"
      @remove-item="removeCartItem"
      @require-auth="handleRequireAuthForCheckout"
      @checkout-complete="handleStartCheckout"
      @start-checkout="handleStartCheckout"
    />

    <!-- Checkout Modal (Step-by-Step Checkout & Payment Gateways) -->
    <CheckoutModal
      :is-open="isCheckoutOpen"
      :cart-items="cartItems"
      :user="currentUser"
      @close="isCheckoutOpen = false"
      @order-placed="handleOrderPlaced"
      @open-cart="handleCheckoutOpenCart"
      @require-auth="handleRequireAuthForCheckout"
    />

    <!-- Slide-over Auth & Account Portal (ystore-db) -->
    <AuthModal
      :is-open="isAuthOpen"
      @close="isAuthOpen = false"
      @auth-success="handleAuthSuccess"
      @open-cart="isCartOpen = true"
      @open-admin="openAdminDashboard"
      @navigate-specials="currentView = 'specials'"
      @navigate-contact="currentView = 'contact'"
    />

    <!-- Quick View Modal -->
    <QuickViewModal
      :is-open="isQuickViewOpen"
      :product="quickViewProduct"
      @close="isQuickViewOpen = false"
      @add-to-cart="addToCart"
    />

    <!-- Toast Notification -->
    <transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-neutral-700 font-poppins text-sm"
      >
        <div class="w-7 h-7 rounded-full bg-[#F4EB6A] text-neutral-900 flex items-center justify-center shrink-0">
          <FlowbiteIcon name="check" size="16" stroke-width="2.5" />
        </div>
        <div class="flex flex-col">
          <span class="font-semibold text-white">{{ toast.title }}</span>
          <span class="text-xs text-neutral-300">{{ toast.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import CmsAuthGateway from './components/CmsAuthGateway.vue'
import ProductDetailPage from './components/ProductDetailPage.vue'
import SpecialsPage from './components/SpecialsPage.vue'
import CategoryPage from './components/CategoryPage.vue'
import BlogPage from './components/BlogPage.vue'
import AboutPage from './components/AboutPage.vue'
import ContactPage from './components/ContactPage.vue'
import HeroBanner from './components/HeroBanner.vue'
import FeaturesBar from './components/FeaturesBar.vue'
import CategoryGrid from './components/CategoryGrid.vue'
import FeaturedProducts from './components/FeaturedProducts.vue'
import NewArrivals from './components/NewArrivals.vue'
import BestSellers from './components/BestSellers.vue'
import Testimonials from './components/Testimonials.vue'
import Newsletter from './components/Newsletter.vue'
import AppFooter from './components/AppFooter.vue'
import CartDrawer from './components/CartDrawer.vue'
import AuthModal from './components/AuthModal.vue'
import QuickViewModal from './components/QuickViewModal.vue'
import CheckoutModal from './components/CheckoutModal.vue'
import FlowbiteIcon from './components/FlowbiteIcon.vue'
import { useFirebaseAuth } from './composables/useFirebaseAuth'
import { useStoreContent } from './composables/useStoreContent'

const { currentUser, isAdmin, initFirebase } = useFirebaseAuth()
const {
  hasActiveBanners,
  hasCategoriesWithProducts,
  hasFeaturedProducts,
  hasNewArrivals,
  hasBestSellers,
  initContentListeners
} = useStoreContent()

// Runtime config for secret access keys
const config = useRuntimeConfig()

// Secret CMS Access Keys allowed to unlock the CMS Gateway
const CMS_SECRET_KEYS = [
  'yberry-admin-2026',
  'yberry-admin',
  'yberry-mgmt',
  'yberry-secure',
  'yberry-cms'
]
if (config?.public?.cmsSecretKey && !CMS_SECRET_KEYS.includes(config.public.cmsSecretKey)) {
  CMS_SECRET_KEYS.unshift(config.public.cmsSecretKey)
}

// Permitted navigation views (including secret cms-auth gateway)
const VALID_VIEWS = ['home', 'category', 'product', 'specials', 'blog', 'contact', 'about', 'admin', 'cms-auth']

// Verify secret URL parameters (e.g. ?cms_auth=..., ?portal=..., ?cms_key=...)
// Sets session authorization and purges secret parameters from address bar for anti-shoulder-surfing
const verifyAndAuthorizeCmsUrl = () => {
  if (typeof window === 'undefined') return { authorized: false, isSecretEntry: false }
  try {
    const url = new URL(window.location.href)
    const secretParams = ['cms_auth', 'cms_portal', 'portal', 'cms_key', 'access_key']
    let foundKey = null

    for (const param of secretParams) {
      const val = url.searchParams.get(param)
      if (val && CMS_SECRET_KEYS.includes(val.trim())) {
        foundKey = param
        break
      }
    }

    if (foundKey) {
      sessionStorage.setItem('ystore_cms_authorized', 'true')
      // Clean query parameter from address bar immediately
      url.searchParams.delete(foundKey)
      window.history.replaceState({}, '', url.pathname + (url.search || '') + (url.hash || ''))
      return { authorized: true, isSecretEntry: true }
    }

    const authorized = sessionStorage.getItem('ystore_cms_authorized') === 'true'
    return { authorized, isSecretEntry: false }
  } catch {
    return { authorized: false, isSecretEntry: false }
  }
}

// Active View: 'home' for landing storefront, or 'category'/'product'/'specials'/'blog'/'contact'/'about'/'admin'/'cms-auth'
const getInitialView = () => {
  if (typeof window !== 'undefined') {
    try {
      const { authorized, isSecretEntry } = verifyAndAuthorizeCmsUrl()
      if (isSecretEntry) {
        return 'cms-auth'
      }

      const params = new URLSearchParams(window.location.search)
      const viewParam = params.get('view')
      if (viewParam && VALID_VIEWS.includes(viewParam)) {
        if ((viewParam === 'admin' || viewParam === 'cms-auth') && !authorized) {
          return 'home'
        }
        return viewParam
      }

      const hash = window.location.hash.replace('#', '')
      if (hash && VALID_VIEWS.includes(hash)) {
        if ((hash === 'admin' || hash === 'cms-auth') && !authorized) {
          return 'home'
        }
        return hash
      }

      const saved = sessionStorage.getItem('ystore_current_view')
      if (saved && VALID_VIEWS.includes(saved)) {
        if ((saved === 'admin' || saved === 'cms-auth') && !authorized) {
          return 'home'
        }
        return saved
      }
    } catch {}
  }
  return 'home'
}

const currentView = ref(getInitialView())
const selectedCategoryFilter = ref('All')

// Synchronize URL with view so other users can navigate, share direct links, and bookmark pages
const syncUrlWithView = (view) => {
  if (typeof window === 'undefined') return
  try {
    const url = new URL(window.location.href)
    if (view === 'home' || view === 'cms-auth') {
      // Keep URL clean for home and secret CMS auth gateway
      url.searchParams.delete('view')
    } else {
      url.searchParams.set('view', view)
    }
    if (view === 'category' && selectedCategoryFilter.value && selectedCategoryFilter.value !== 'All') {
      url.searchParams.set('cat', selectedCategoryFilter.value)
    } else {
      url.searchParams.delete('cat')
    }
    window.history.pushState({ view, cat: selectedCategoryFilter.value }, '', url.toString())
  } catch {}
}

watch(currentView, (newView) => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('ystore_current_view', newView)
      syncUrlWithView(newView)
    } catch {}
  }
})

// Support browser Back / Forward buttons (popstate)
const handlePopState = () => {
  if (typeof window === 'undefined') return
  const isCmsAuthorized = sessionStorage.getItem('ystore_cms_authorized') === 'true'
  const params = new URLSearchParams(window.location.search)
  const viewParam = params.get('view')
  const catParam = params.get('cat')
  if (catParam) {
    selectedCategoryFilter.value = catParam
  }
  if (viewParam && VALID_VIEWS.includes(viewParam)) {
    if ((viewParam === 'admin' || viewParam === 'cms-auth') && !isCmsAuthorized) {
      currentView.value = 'home'
    } else {
      currentView.value = viewParam
    }
  } else {
    currentView.value = 'home'
  }
}

onMounted(() => {
  initFirebase()
  initContentListeners()
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const catParam = params.get('cat')
    if (catParam) {
      selectedCategoryFilter.value = catParam
    }
    window.addEventListener('popstate', handlePopState)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('popstate', handlePopState)
  }
})

// Selected product state (populated when a real product is selected)
const selectedProduct = ref(null)

// Cart State (Starts empty with zero dummy items)
const cartItems = ref([])

const isCartOpen = ref(false)
const isCheckoutOpen = ref(false)
const isAuthOpen = ref(false)
const isQuickViewOpen = ref(false)
const quickViewProduct = ref(null)

// Route guard: Ensure non-authorized visitors cannot access admin or cms-auth
watch(
  [isAdmin, currentView],
  ([adminActive, view]) => {
    const isCmsAuthorized = typeof window !== 'undefined' && sessionStorage.getItem('ystore_cms_authorized') === 'true'

    if (view === 'admin') {
      if (!adminActive) {
        // If not logged in as admin yet, route to cms-auth if secret-authorized, else back to storefront
        currentView.value = isCmsAuthorized ? 'cms-auth' : 'home'
      }
    } else if (view === 'cms-auth') {
      if (adminActive) {
        // Already authenticated as admin, jump straight into dashboard
        currentView.value = 'admin'
      } else if (!isCmsAuthorized) {
        // Unauthorized visitor trying to access cms gateway without secret URL
        currentView.value = 'home'
      }
    }
  },
  { immediate: true }
)

const openAdminDashboard = () => {
  if (!isAdmin.value) {
    showToast('Admin Access Only', 'Only the Super Admin can access the management dashboard.')
    return
  }
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('ystore_cms_authorized', 'true')
  }
  isAuthOpen.value = false
  currentView.value = 'admin'
}

const handleAdminSignedOut = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('ystore_cms_authorized')
    sessionStorage.removeItem('ystore_current_view')
  }
  currentView.value = 'home'
  showToast('Signed Out', 'You have signed out of the Admin Dashboard.')
}

const toast = ref({
  show: false,
  title: '',
  message: ''
})

let toastTimer = null

const showToast = (title, message) => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, title, message }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3500)
}

const totalCartCount = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.qty, 0)
})

const addToCart = (product) => {
  const quantityToAdd = product.qty || 1
  const existingIndex = cartItems.value.findIndex(item => item.id === product.id)
  
  if (existingIndex > -1) {
    cartItems.value[existingIndex].qty += quantityToAdd
  } else {
    cartItems.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: quantityToAdd
    })
  }
  
  showToast('Added to Cart', `${product.name} (x${quantityToAdd}) added to your cart.`)
}

const updateCartQty = ({ id, qty }) => {
  if (qty <= 0) {
    removeCartItem(id)
  } else {
    const item = cartItems.value.find(i => i.id === id)
    if (item) item.qty = qty
  }
}

const removeCartItem = (id) => {
  const item = cartItems.value.find(i => i.id === id)
  cartItems.value = cartItems.value.filter(i => i.id !== id)
  if (item) {
    showToast('Item Removed', `${item.name} removed from your cart.`)
  }
}

const openQuickView = (product) => {
  quickViewProduct.value = product
  isQuickViewOpen.value = true
}

const handleWishlist = ({ product, isWishlisted }) => {
  showToast(
    isWishlisted ? 'Saved to Wishlist' : 'Removed from Wishlist',
    product.name
  )
}

const handleCategorySelect = (categoryName) => {
  selectedCategoryFilter.value = categoryName || 'All'
  currentView.value = 'category'
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleOpenAccount = () => {
  isAuthOpen.value = true
}

const handleAuthSuccess = ({ title, message }) => {
  showToast(title, message)
}

const handleStartCheckout = () => {
  if (!cartItems.value.length) {
    showToast('Your Cart is Empty', 'Please add items to your cart before proceeding to checkout.')
    return
  }
  isCartOpen.value = false
  isCheckoutOpen.value = true
}

const handleCheckoutComplete = () => {
  handleStartCheckout()
}

const handleOrderPlaced = (order) => {
  cartItems.value = []
  showToast(
    'Order Confirmed!',
    `Thank you! Order #${order.orderNumber || ''} has been placed.`
  )
}

const handleCheckoutOpenCart = () => {
  isCheckoutOpen.value = false
  isCartOpen.value = true
}

const handleRequireAuthForCheckout = () => {
  isAuthOpen.value = true
  showToast('Sign In or Guest Checkout', 'Please sign in or continue as a Guest Shopper to complete checkout.')
}

const handleViewProduct = (product) => {
  if (!product) return
  const parts = (product.name || '').split(' ')
  selectedProduct.value = {
    ...product,
    titleLine1: parts.length > 2 ? parts.slice(0, 2).join(' ') : (product.name || ''),
    titleLine2: parts.length > 2 ? parts.slice(2).join(' ') : (product.category || ''),
    fullDescription: product.description || ''
  }
  currentView.value = 'product'
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleBuyNow = (product) => {
  addToCart(product)
  isCartOpen.value = false
  isCheckoutOpen.value = true
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
