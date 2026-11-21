import { ref, computed } from 'vue'

const WISHLIST_STORAGE_KEY = 'ystore_wishlist_v1'

const loadInitialWishlist = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}
  return []
}

const wishlistItems = ref(loadInitialWishlist())

const persistWishlist = () => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems.value))
  } catch {}
}

export const useWishlist = () => {
  const isInWishlist = (productId) => {
    if (productId === undefined || productId === null || productId === '') return false
    return wishlistItems.value.some((item) => String(item.id) === String(productId))
  }

  const toggleWishlistItem = (product) => {
    if (!product || product.id === undefined || product.id === null) {
      return { isWishlisted: false, product }
    }
    const idx = wishlistItems.value.findIndex((item) => String(item.id) === String(product.id))
    if (idx >= 0) {
      wishlistItems.value.splice(idx, 1)
      persistWishlist()
      return { isWishlisted: false, product }
    } else {
      wishlistItems.value.unshift({ ...product })
      persistWishlist()
      return { isWishlisted: true, product }
    }
  }

  const removeFromWishlist = (productId) => {
    const idx = wishlistItems.value.findIndex((item) => String(item.id) === String(productId))
    if (idx >= 0) {
      wishlistItems.value.splice(idx, 1)
      persistWishlist()
    }
  }

  const clearWishlist = () => {
    wishlistItems.value = []
    persistWishlist()
  }

  const wishlistCount = computed(() => wishlistItems.value.length)

  return {
    wishlistItems,
    wishlistCount,
    isInWishlist,
    toggleWishlistItem,
    removeFromWishlist,
    clearWishlist
  }
}
