<template>
  <div class="min-h-screen bg-white text-neutral-900 font-poppins selection:bg-[#F4EB6A] selection:text-neutral-900">
    <!-- ==========================================
         FULL-SCREEN ADMIN DASHBOARD (Admin Only)
         ========================================== -->
    <AdminDashboard
      v-if="currentView === 'admin' && isAdmin"
      @view-storefront="currentView = 'home'"
      @signed-out="handleAdminSignedOut"
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
import { ref, computed, watch, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import AdminDashboard from './components/AdminDashboard.vue'
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

onMounted(() => {
  initFirebase()
  initContentListeners()
})

// Active View: 'home' for the landing storefront with Hero Banner & catalog, or 'category'/'product'/'specials'/'blog'/'contact'/'about'/'admin'
const getInitialView = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem('ystore_current_view')
      if (saved) return saved
    } catch {}
  }
  return 'home'
}

const currentView = ref(getInitialView())
const selectedCategoryFilter = ref('All')

watch(currentView, (newView) => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('ystore_current_view', newView)
    } catch {}
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

// Route guard: Ensure non-admins cannot access the 'admin' view, without forcibly hijacking storefront page refreshes
watch(
  [isAdmin, currentView],
  ([adminActive, view]) => {
    if (view === 'admin' && !adminActive) {
      currentView.value = 'home'
    }
  },
  { immediate: true }
)

const openAdminDashboard = () => {
  if (!isAdmin.value) {
    showToast('Admin Access Only', 'Only the Super Admin can access the management dashboard.')
    return
  }
  isAuthOpen.value = false
  currentView.value = 'admin'
}

const handleAdminSignedOut = () => {
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
