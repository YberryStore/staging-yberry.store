import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { ref, computed } from 'vue'
import { useFirebaseAuth } from './useFirebaseAuth'
import { useAsset } from './useAsset'

// Default South African & International Payment Settings
export const defaultPaymentSettings = {
  general: {
    currency: 'ZAR',
    currencySymbol: 'R',
    currencyPosition: 'left',
    vatRate: 15,
    pricesIncludeTax: true,
    sandboxMode: true,
    autoCapture: true,
    sendReceiptEmails: true
  },
  gateways: {
    payfast: {
      id: 'payfast',
      name: 'PayFast by Network',
      description: "South Africa's leading gateway: Credit & Debit Cards, Instant EFT, Capitec Pay, SnapScan, Zapper, Masterpass",
      enabled: true,
      sandbox: true,
      merchantId: '10000100',
      merchantKey: '46f0cd694581a',
      passphrase: '',
      acceptedMethods: ['visa', 'mastercard', 'instant-eft', 'capitec-pay', 'snapscan', 'zapper']
    },
    yoco: {
      id: 'yoco',
      name: 'Yoco Payments',
      description: 'Fast, secure SA card payments with Apple Pay, Google Pay, and bank OTP verification',
      enabled: true,
      sandbox: true,
      publicKey: 'pk_test_ed3c54a6w1bt9r647027',
      secretKey: '',
      webhookSecret: '',
      acceptedMethods: ['visa', 'mastercard', 'apple-pay', 'google-pay']
    },
    ozow: {
      id: 'ozow',
      name: 'Ozow Instant EFT',
      description: 'Direct bank transfer from ABSA, Capitec, FNB, Nedbank, Standard Bank, Investec & TymeBank with immediate payment notification',
      enabled: true,
      sandbox: true,
      siteCode: 'YBS-001',
      privateKey: '',
      apiKey: '',
      acceptedMethods: ['instant-eft']
    },
    payflex: {
      id: 'payflex',
      name: 'Payflex (Buy Now Pay Later)',
      description: 'Zero-interest Pay in 4 installments for South African shoppers. Increases checkout conversion by up to 30%',
      enabled: true,
      sandbox: true,
      merchantId: 'PF-YBS-789',
      apiKey: '',
      showWidgetOnProductPages: true,
      acceptedMethods: ['payflex-bnpl']
    },
    stripe: {
      id: 'stripe',
      name: 'Stripe International',
      description: 'Accept global credit & debit cards from international customers outside South Africa',
      enabled: false,
      sandbox: true,
      publishableKey: '',
      secretKey: '',
      acceptedMethods: ['visa', 'mastercard', 'amex', 'apple-pay', 'google-pay']
    },
    eft: {
      id: 'eft',
      name: 'Manual EFT / Direct Bank Deposit',
      description: 'Customers manually transfer payment into your South African business bank account using order number as reference',
      enabled: true,
      bankName: 'First National Bank (FNB)',
      accountHolder: 'Yellow Berry Store (Pty) Ltd',
      accountNumber: '62849102938',
      branchCode: '250655',
      accountType: 'Business Cheque Account',
      instructions: 'Please use your Order Number (#YBS-...) as payment reference. Send proof of payment (POP) to payments@yellowberry.store'
    },
    cod: {
      id: 'cod',
      name: 'Studio Collection / Cash on Pickup',
      description: 'Pay on collection at Yellow Berry Store studio in Cape Town (Card or Cash)',
      enabled: false,
      instructions: 'Collection address: Studio 4, The Palms Centre, 145 Sir Lowry Rd, Woodstock, Cape Town'
    }
  },
  payouts: {
    bankName: 'First National Bank (FNB)',
    accountHolder: 'Yellow Berry Store (Pty) Ltd',
    accountNumber: '62849102938',
    branchCode: '250655',
    accountType: 'Cheque / Current',
    schedule: 'weekly',
    payoutEmail: 'billing@yellowberry.store'
  }
}

// Default Admin & Store Staff Users (South African Store Team)
export const defaultAdminUsers = []

// Sanitize payment settings for public storefront clients (strips all secret keys, private keys, passphrases, webhooks)
export const sanitizePublicPaymentSettings = (s = {}) => {
  const general = s.general || defaultPaymentSettings.general
  const gateways = s.gateways || defaultPaymentSettings.gateways
  const payouts = s.payouts || defaultPaymentSettings.payouts

  return {
    general: {
      currency: general.currency || 'ZAR',
      currencySymbol: general.currencySymbol || 'R',
      currencyPosition: general.currencyPosition || 'left',
      vatRate: general.vatRate ?? 15,
      pricesIncludeTax: general.pricesIncludeTax !== false,
      sandboxMode: !!general.sandboxMode,
      autoCapture: general.autoCapture !== false,
      sendReceiptEmails: general.sendReceiptEmails !== false
    },
    gateways: {
      payfast: {
        id: 'payfast',
        name: gateways.payfast?.name || 'PayFast',
        description: gateways.payfast?.description || '',
        enabled: gateways.payfast?.enabled !== false,
        sandbox: !!gateways.payfast?.sandbox,
        merchantId: gateways.payfast?.merchantId || '10000100',
        merchantKey: gateways.payfast?.merchantKey || '',
        passphrase: '', // Strictly withheld from public clients
        acceptedMethods: gateways.payfast?.acceptedMethods || ['visa', 'mastercard', 'instant-eft']
      },
      yoco: {
        id: 'yoco',
        name: gateways.yoco?.name || 'Yoco',
        description: gateways.yoco?.description || '',
        enabled: gateways.yoco?.enabled !== false,
        sandbox: !!gateways.yoco?.sandbox,
        publicKey: gateways.yoco?.publicKey || '',
        secretKey: '', // Strictly withheld from public clients
        webhookSecret: '', // Strictly withheld from public clients
        acceptedMethods: gateways.yoco?.acceptedMethods || ['visa', 'mastercard']
      },
      ozow: {
        id: 'ozow',
        name: gateways.ozow?.name || 'Ozow',
        description: gateways.ozow?.description || '',
        enabled: gateways.ozow?.enabled !== false,
        sandbox: !!gateways.ozow?.sandbox,
        siteCode: gateways.ozow?.siteCode || '',
        privateKey: '', // Strictly withheld from public clients
        apiKey: '', // Strictly withheld from public clients
        acceptedMethods: gateways.ozow?.acceptedMethods || ['instant-eft']
      },
      payflex: {
        id: 'payflex',
        name: gateways.payflex?.name || 'Payflex',
        description: gateways.payflex?.description || '',
        enabled: gateways.payflex?.enabled !== false,
        sandbox: !!gateways.payflex?.sandbox,
        merchantId: gateways.payflex?.merchantId || '',
        apiKey: '', // Strictly withheld from public clients
        showWidgetOnProductPages: gateways.payflex?.showWidgetOnProductPages !== false,
        acceptedMethods: gateways.payflex?.acceptedMethods || ['payflex-bnpl']
      },
      stripe: {
        id: 'stripe',
        name: gateways.stripe?.name || 'Stripe',
        description: gateways.stripe?.description || '',
        enabled: !!gateways.stripe?.enabled,
        sandbox: !!gateways.stripe?.sandbox,
        publishableKey: gateways.stripe?.publishableKey || '',
        secretKey: '', // Strictly withheld from public clients
        acceptedMethods: gateways.stripe?.acceptedMethods || ['visa', 'mastercard']
      },
      eft: {
        id: 'eft',
        name: gateways.eft?.name || 'Manual EFT',
        description: gateways.eft?.description || '',
        enabled: gateways.eft?.enabled !== false,
        bankName: gateways.eft?.bankName || '',
        accountHolder: gateways.eft?.accountHolder || '',
        accountNumber: gateways.eft?.accountNumber || '',
        branchCode: gateways.eft?.branchCode || '',
        accountType: gateways.eft?.accountType || 'Cheque',
        instructions: gateways.eft?.instructions || ''
      },
      cod: {
        id: 'cod',
        name: gateways.cod?.name || 'Studio Collection',
        description: gateways.cod?.description || '',
        enabled: !!gateways.cod?.enabled,
        instructions: gateways.cod?.instructions || ''
      }
    },
    payouts: {
      bankName: payouts.bankName || '',
      accountHolder: payouts.accountHolder || '',
      accountNumber: payouts.accountNumber ? `•••• ${String(payouts.accountNumber).slice(-4)}` : '',
      branchCode: payouts.branchCode || '',
      accountType: payouts.accountType || '',
      schedule: payouts.schedule || 'weekly',
      payoutEmail: payouts.payoutEmail || ''
    }
  }
}

// Helper to initialize cached payment settings (sanitized against secret leakage)
const getInitialPaymentSettings = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('ystore_payment_settings')
      if (cached) {
        const parsed = JSON.parse(cached)
        return sanitizePublicPaymentSettings(parsed)
      }
    } catch {
      // Fallback to default
    }
  }
  return sanitizePublicPaymentSettings(defaultPaymentSettings)
}

// Helper to initialize cached admin & staff users (dummy users purged)
const getInitialAdminUsers = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('ystore_admin_users')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) {
          // Purge any legacy dummy users
          const cleanUsers = parsed.filter(u =>
            u && u.id && !u.id.startsWith('usr-staff-') &&
            u.email !== 'sarah.j@yellowberry.store' &&
            u.email !== 'david.n@yellowberry.store' &&
            u.email !== 'elena.r@yellowberry.store' &&
            u.name !== 'Sarah Jenkins' &&
            u.name !== 'David Ndlovu' &&
            u.name !== 'Elena Rostova' &&
            u.id !== 'usr-primary-superadmin'
          )
          localStorage.setItem('ystore_admin_users', JSON.stringify(cleanUsers))
          return cleanUsers
        }
      }
    } catch {
      // Fallback to default
    }
  }
  return []
}

// ==========================================
// DEFAULT STOREFRONT CATALOG (Seed Fallbacks)
// ==========================================
export const defaultInitialBanners = [
  {
    id: 'ban-default-1',
    title: 'Ignite Imagination & Play',
    subtitle: 'Thoughtfully crafted, eco-conscious toys and developmental playsets designed to spark wonder.',
    badge: 'NEW COLLECTION 2026',
    desktopUrl: '/images/promo-banner.jpg',
    desktopType: 'image',
    mobileUrl: '/images/promo-banner.jpg',
    mobileType: 'image',
    videoUrl: '',
    altText: 'Yellow Berry Store Premium Toys',
    link: '#featured',
    buttonText: 'Explore Catalog',
    status: 'published',
    active: true,
    order: 1
  }
]

export const defaultInitialCategories = [
  {
    id: 'cat-blocks',
    name: 'Building Blocks',
    title: 'Building Blocks',
    description: 'Stacking sets, architectural blocks, and developmental building kits for growing minds.',
    image: '/images/category-blocks.jpg'
  },
  {
    id: 'cat-figures',
    name: 'Action Figures',
    title: 'Action Figures',
    description: 'Inspiring robots, dynamic heroes, and interactive figures engineered for adventures.',
    image: '/images/category-figures.jpg'
  },
  {
    id: 'cat-plush',
    name: 'Plush Toys',
    title: 'Plush Toys',
    description: 'Ultra-soft organic plushies, huggable bedtime companions, and sensory characters.',
    image: '/images/category-plush.jpg'
  },
  {
    id: 'cat-puzzles',
    name: 'Puzzles & Games',
    title: 'Puzzles & Games',
    description: 'Montessori shape sorters, wooden puzzles, and engaging problem-solving games.',
    image: '/images/category-puzzles.jpg'
  }
]

export const defaultInitialProducts = [
  {
    id: 'prod-ai-robot',
    name: 'Smart Interactive AI Robot',
    category: 'Action Figures',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    sku: 'YBS-ROB-01',
    quantity: 45,
    stockLeft: 45,
    inStock: true,
    image: '/images/prod-robot.jpg',
    images: ['/images/prod-robot.jpg', '/images/robot-angle.jpg', '/images/robot-closeup.jpg', '/images/robot-side.jpg'],
    description: 'Intelligent learning and companion robot equipped with voice response, multi-gesture sensing, programmable routines, and expressive LED emotional reactions.',
    status: 'published',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    rating: 5,
    reviews: 42,
    claimedPercent: 78
  },
  {
    id: 'prod-rainbow-stacker',
    name: 'Wooden Rainbow Stacker',
    category: 'Building Blocks',
    price: 349,
    originalPrice: 429,
    discount: 19,
    sku: 'YBS-WOD-02',
    quantity: 60,
    stockLeft: 60,
    inStock: true,
    image: '/images/prod-rainbow.jpg',
    images: ['/images/prod-rainbow.jpg'],
    description: 'Handcrafted sustainably-sourced beechwood rainbow arches with non-toxic water-based paints. Fosters open-ended cognitive architecture and spatial exploration.',
    status: 'published',
    isFeatured: true,
    isBestSeller: true,
    rating: 5,
    reviews: 38,
    claimedPercent: 64
  },
  {
    id: 'prod-rc-drift-car',
    name: 'Turbo Drift High-Speed RC Car',
    category: 'Action Figures',
    price: 649,
    originalPrice: 799,
    discount: 19,
    sku: 'YBS-RC-03',
    quantity: 30,
    stockLeft: 30,
    inStock: true,
    image: '/images/prod-rc-car.jpg',
    images: ['/images/prod-rc-car.jpg'],
    description: '2.4GHz proportional all-wheel drift racing vehicle with high-torque brushless motor, rechargeable lithium-ion pack, and shock-damped suspension.',
    status: 'published',
    isFeatured: true,
    isNewArrival: true,
    rating: 5,
    reviews: 29,
    claimedPercent: 55
  },
  {
    id: 'prod-dino-explorer',
    name: 'Dino Explorer Sensory Playset',
    category: 'Action Figures',
    price: 399,
    originalPrice: 499,
    discount: 20,
    sku: 'YBS-DIN-04',
    quantity: 50,
    stockLeft: 50,
    inStock: true,
    image: '/images/prod-dino.jpg',
    images: ['/images/prod-dino.jpg'],
    description: 'Detailed museum-grade articulated prehistoric figures with tactile textures and sensory learning flashcards for imaginative junior paleontologists.',
    status: 'published',
    isFeatured: false,
    isBestSeller: true,
    rating: 5,
    reviews: 17,
    claimedPercent: 40
  },
  {
    id: 'prod-plushie-bear',
    name: 'Organic Cotton Huggable Plushie',
    category: 'Plush Toys',
    price: 299,
    originalPrice: 350,
    discount: 15,
    sku: 'YBS-PLU-05',
    quantity: 80,
    stockLeft: 80,
    inStock: true,
    image: '/images/prod-plushie.jpg',
    images: ['/images/prod-plushie.jpg'],
    description: 'GOTS-certified 100% organic cotton plush companion filled with hypoallergenic recycled fibres. Gentle on sensitive skin and machine washable.',
    status: 'published',
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    rating: 5,
    reviews: 31,
    claimedPercent: 62
  },
  {
    id: 'prod-shape-sorter',
    name: 'Geometric Montessori Shape Sorter',
    category: 'Puzzles & Games',
    price: 279,
    originalPrice: 320,
    discount: 13,
    sku: 'YBS-PUZ-06',
    quantity: 40,
    stockLeft: 40,
    inStock: true,
    image: '/images/prod-sorter.jpg',
    images: ['/images/prod-sorter.jpg'],
    description: 'Natural solid-wood puzzle sorter with smooth chamfered edges. Develops fine motor coordination, shape recognition, and deductive problem solving.',
    status: 'published',
    isFeatured: true,
    isBestSeller: false,
    rating: 5,
    reviews: 24,
    claimedPercent: 48
  },
  {
    id: 'prod-chef-kitchen',
    name: 'Deluxe Mini Chef Wooden Kitchen',
    category: 'Building Blocks',
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    sku: 'YBS-KIT-07',
    quantity: 15,
    stockLeft: 15,
    inStock: true,
    image: '/images/prod-kitchen.jpg',
    images: ['/images/prod-kitchen.jpg'],
    description: 'Scandinavian-inspired wooden play kitchen featuring turning knobs, oven, sink with faucet, chalkboard menu, and stainless steel cookware set.',
    status: 'published',
    isFeatured: false,
    isBestSeller: true,
    rating: 5,
    reviews: 19,
    claimedPercent: 85
  },
  {
    id: 'prod-steam-train',
    name: 'Classic Express Steam Train Set',
    category: 'Building Blocks',
    price: 549,
    originalPrice: 650,
    discount: 16,
    sku: 'YBS-TRN-08',
    quantity: 35,
    stockLeft: 35,
    inStock: true,
    image: '/images/prod-train.jpg',
    images: ['/images/prod-train.jpg'],
    description: 'Magnetic coupling wooden railway engine and passenger cars complete with 32-piece interlocking track layout, bridge trestles, and scenery trees.',
    status: 'published',
    isFeatured: true,
    isNewArrival: true,
    rating: 5,
    reviews: 22,
    claimedPercent: 70
  }
]

export const defaultInitialDiscounts = [
  {
    id: 'disc-welcome10',
    code: 'WELCOME10',
    discount: '10% OFF',
    description: 'Special 10% welcome discount for new Yellow Berry Store customers',
    active: true
  },
  {
    id: 'disc-ystore20',
    code: 'YSTORE20',
    discount: '20% OFF',
    description: 'Seasonal promotion across select developmental play collections',
    active: true
  }
]

export const defaultInitialBlogs = [
  {
    id: 'blog-eco-play',
    title: 'Why Sustainable Wooden Toys Shape Better Child Development',
    category: 'Craft & Play',
    excerpt: 'Discover how natural materials, tactile warmth, and open-ended play design enhance sensory integration and focused imagination in early childhood.',
    coverImage: '/images/promo-banner.jpg',
    readTime: '4 min read',
    date: 'Oct 28, 2026',
    featured: true,
    tags: ['Sustainable Toys', 'Montessori', 'Child Development', 'Sensory Play'],
    takeaways: [
      'Natural textures stimulate sensory perception and neural development.',
      'Open-ended play builds spatial logic and resilient problem-solving.',
      'Sustainably harvested wood creates lasting family heirlooms that outlast plastic.'
    ],
    body: 'In an era dominated by flashing screens and high-frequency digital stimulation, mindful parents and educators are returning to the timeless purity of natural materials.\n\nWooden toys possess a subtle weight, organic tactile grain, and pleasant sensory resonance that plastic simply cannot replicate. When a child engages with a wooden stacker or architectural block, their mind is actively required to envision balance, gravity, and structural integrity.\n\nAt Yellow Berry Store, each toy is carefully curated to foster enduring wonder, cognitive development, and environmental stewardship.',
    content: [
      {
        heading: 'The Power of Sensory Warmth',
        paragraphs: [
          'In an era dominated by flashing screens and high-frequency digital stimulation, mindful parents and educators are returning to the timeless purity of natural materials.',
          'Wooden toys possess a subtle weight, organic tactile grain, and pleasant sensory resonance that plastic simply cannot replicate. When a child engages with a wooden stacker or architectural block, their mind is actively required to envision balance, gravity, and structural integrity.'
        ],
        quote: 'Play is the highest form of research. When materials are pure, creativity knows no bounds.'
      }
    ],
    author: {
      name: 'Laban Le Fleur',
      role: 'Founder & Creative Director',
      avatar: '/images/avatar-laban.jpg',
      bio: 'Passionate about quality handcrafted products, thoughtful design, and joyful living at Yellow Berry Store.'
    }
  }
]

// Safe local persistence helper
const saveToCache = (key, data) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.warn(`Failed to cache ${key}:`, err)
  }
}

const getInitialProducts = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('ystore_products_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
  }
  return [...defaultInitialProducts]
}

const getInitialCategories = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('ystore_categories_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
  }
  return [...defaultInitialCategories]
}

const getInitialBanners = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('ystore_banners_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
  }
  return [...defaultInitialBanners]
}

const getInitialCollections = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('ystore_collections_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {}
  }
  return []
}

const getInitialDiscounts = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('ystore_discounts_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
  }
  return [...defaultInitialDiscounts]
}

const getInitialBlogs = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('ystore_blogs_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
  }
  return [...defaultInitialBlogs]
}

// Shared reactive singleton state across Admin Dashboard and Storefront
const products = ref(getInitialProducts())
const categories = ref(getInitialCategories())
const collectionsList = ref(getInitialCollections())
const discounts = ref(getInitialDiscounts())
const blogs = ref(getInitialBlogs())
const orders = ref([])
const customers = ref([])
const customerSegments = ref([])
const purchaseOrders = ref([])
const banners = ref(getInitialBanners())
const paymentSettings = ref(getInitialPaymentSettings())
const adminUsers = ref(getInitialAdminUsers())
const contentLoading = ref(false)
const contentError = ref('')

let publicListenersInitialized = false
let adminListenersInitialized = false

export const useStoreContent = () => {
  const { initFirebase } = useFirebaseAuth()

  const getDb = () => {
    const instances = initFirebase()
    return instances?.db || null
  }

  // Initialize real-time Firestore listeners for public storefront catalog
  const initContentListeners = () => {
    if (typeof window === 'undefined' || publicListenersInitialized) return
    const db = getDb()
    if (!db) return

    publicListenersInitialized = true
    contentLoading.value = true

    // 1. Products Listener
    onSnapshot(
      collection(db, 'products'),
      (snap) => {
        if (!snap.empty) {
          products.value = snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }))
          saveToCache('ystore_products_cache', products.value)
        }
        contentLoading.value = false
      },
      (err) => {
        console.warn('Firestore products listener warning:', err)
        contentLoading.value = false
      }
    )

    // 2. Categories Listener
    onSnapshot(
      collection(db, 'categories'),
      (snap) => {
        if (!snap.empty) {
          categories.value = snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }))
          saveToCache('ystore_categories_cache', categories.value)
        }
      },
      (err) => {
        console.warn('Firestore categories listener warning:', err)
      }
    )

    // 3. Discounts / Coupons Listener
    onSnapshot(
      collection(db, 'discounts'),
      (snap) => {
        if (!snap.empty) {
          discounts.value = snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }))
          saveToCache('ystore_discounts_cache', discounts.value)
        }
      },
      (err) => {
        console.warn('Firestore discounts listener warning:', err)
      }
    )

    // 4. Blogs Listener
    onSnapshot(
      collection(db, 'blogs'),
      (snap) => {
        if (!snap.empty) {
          blogs.value = snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }))
          saveToCache('ystore_blogs_cache', blogs.value)
        }
      },
      (err) => {
        console.warn('Firestore blogs listener warning:', err)
      }
    )

    // 5. Banners Listener (Home Hero Banners)
    onSnapshot(
      collection(db, 'banners'),
      (snap) => {
        if (!snap.empty) {
          banners.value = snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }))
          saveToCache('ystore_banners_cache', banners.value)
        }
      },
      (err) => {
        console.warn('Firestore banners listener warning:', err)
      }
    )

    // 6. Collections Listener (Curated Collections)
    onSnapshot(
      collection(db, 'collections'),
      (snap) => {
        if (!snap.empty) {
          collectionsList.value = snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }))
          saveToCache('ystore_collections_cache', collectionsList.value)
        }
      },
      (err) => {
        console.warn('Firestore collections listener warning:', err)
      }
    )

    // 7. Public Storefront Config (Only enabled toggles, public keys, and EFT details — zero secret keys)
    onSnapshot(
      doc(db, 'settings', 'public_config'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data()
          paymentSettings.value = {
            general: { ...paymentSettings.value.general, ...(data.general || {}) },
            gateways: {
              ...paymentSettings.value.gateways,
              ...(data.gateways || {})
            },
            payouts: paymentSettings.value.payouts
          }
        }
      },
      () => { }
    )
  }

  // Initialize real-time listeners for sensitive management records (Super Admin Only)
  const initAdminListeners = () => {
    if (typeof window === 'undefined' || adminListenersInitialized) return
    const db = getDb()
    if (!db) return

    adminListenersInitialized = true

    // 1. Orders Listener (Admin Only)
    onSnapshot(
      collection(db, 'orders'),
      (snap) => {
        orders.value = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      },
      () => { }
    )

    // 2. Customers / Users Listener (Admin Only)
    onSnapshot(
      collection(db, 'users'),
      (snap) => {
        customers.value = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      },
      () => { }
    )

    // 3. Customer Segments Listener (Admin Only)
    onSnapshot(
      collection(db, 'customer_segments'),
      (snap) => {
        customerSegments.value = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      },
      () => { }
    )

    // 4. Purchase Orders Listener (Admin Only)
    onSnapshot(
      collection(db, 'purchase_orders'),
      (snap) => {
        purchaseOrders.value = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      },
      () => { }
    )

    // 5. Admin Users & Staff Listener (Admin Only)
    onSnapshot(
      collection(db, 'admin_users'),
      (snap) => {
        if (!snap.empty) {
          adminUsers.value = snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }))
        } else {
          adminUsers.value = []
        }
      },
      () => { }
    )

    // 6. Full Payment Settings Listener (Super Admin Only — reads full credentials for configuration)
    onSnapshot(
      doc(db, 'settings', 'payments'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data()
          paymentSettings.value = {
            general: { ...defaultPaymentSettings.general, ...(data.general || {}) },
            gateways: {
              ...defaultPaymentSettings.gateways,
              ...(data.gateways || {})
            },
            payouts: { ...defaultPaymentSettings.payouts, ...(data.payouts || {}) }
          }
        }
      },
      () => { }
    )
  }

  // ==========================================
  // PRODUCTS CRUD (Optimistic & Persistent)
  // ==========================================
  const saveProduct = async (productData, existingId = null) => {
    const db = getDb()
    contentError.value = ''

    const price = Number(productData.price) || 0
    const originalPrice = productData.originalPrice ? Number(productData.originalPrice) : null
    const costPerItem =
      productData.costPerItem !== undefined && productData.costPerItem !== '' && productData.costPerItem !== null
        ? Number(productData.costPerItem)
        : null
    const profit = costPerItem !== null ? Number((price - costPerItem).toFixed(2)) : null
    const margin = costPerItem !== null && price > 0 ? Number((((price - costPerItem) / price) * 100).toFixed(1)) : null
    const quantity = Number(productData.quantity ?? productData.stockLeft ?? 0)

    const payload = {
      name: (productData.name || '').trim(),
      category: (productData.category || 'Uncategorized').trim(),
      price,
      originalPrice,
      discount: productData.discount ? Number(productData.discount) : 0,
      costPerItem,
      profit,
      margin,
      sku: (productData.sku || '').trim().toUpperCase(),
      quantity,
      stockLeft: quantity,
      continueSellingWhenOutOfStock: !!productData.continueSellingWhenOutOfStock,
      requiresShipping: productData.requiresShipping !== false,
      weight: productData.weight !== undefined && productData.weight !== '' && productData.weight !== null ? Number(productData.weight) : null,
      weightUnit: productData.weightUnit || 'kg',
      packedDimensions: {
        length: productData.packedDimensions?.length ? Number(productData.packedDimensions.length) : null,
        width: productData.packedDimensions?.width ? Number(productData.packedDimensions.width) : null,
        height: productData.packedDimensions?.height ? Number(productData.packedDimensions.height) : null,
        unit: 'cm'
      },
      packageType: (productData.packageType || 'Standard Box').trim(),
      tags: Array.isArray(productData.tags) ? productData.tags.map((t) => String(t).trim()).filter(Boolean) : [],
      tag: (productData.tag || '').trim(),
      image: (productData.image || (Array.isArray(productData.images) && productData.images[0]) || '').trim(),
      images: Array.isArray(productData.images)
        ? productData.images.map((img) => String(img || '').trim()).filter(Boolean).slice(0, 7)
        : (productData.image ? [productData.image.trim()] : []),
      description: productData.description || '',
      status: productData.status || (productData.isDraft ? 'draft' : 'published'),
      inStock: productData.continueSellingWhenOutOfStock ? true : (quantity > 0 || productData.inStock !== false),
      claimedPercent: Number(productData.claimedPercent ?? 25),
      rating: Number(productData.rating ?? 5),
      reviews: Number(productData.reviews ?? 1),
      isFeatured: !!productData.isFeatured,
      isNewArrival: !!productData.isNewArrival,
      isBestSeller: !!productData.isBestSeller,
      isSpecial: !!productData.isSpecial,
      colors: Array.isArray(productData.colors)
        ? productData.colors.map((c) => String(c).trim()).filter(Boolean)
        : [],
      faqs: Array.isArray(productData.faqs)
        ? productData.faqs
            .filter((f) => f && (f.question || f.answer))
            .map((f) => ({
              question: String(f.question || '').trim(),
              answer: String(f.answer || '').trim()
            }))
            .filter((f) => f.question && f.answer)
        : [],
      disclosures: {
        material: productData.disclosures?.material || '',
        careInstructions: productData.disclosures?.careInstructions || '',
        safetyNotice: productData.disclosures?.safetyNotice || '',
        origin: productData.disclosures?.origin || ''
      },
      metafields: Array.isArray(productData.metafields)
        ? productData.metafields
          .filter((m) => m && m.key && m.value)
          .map((m) => ({ key: String(m.key).trim(), value: String(m.value).trim() }))
        : [],
      seo: {
        title: (productData.seo?.title || productData.name || '').trim(),
        description: (productData.seo?.description || productData.description || '').trim(),
        slug: (
          productData.seo?.slug ||
          (productData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        ).trim()
      },
      updatedAt: serverTimestamp()
    }

    let finalId = existingId || `prod-${Date.now()}`

    if (db) {
      try {
        if (existingId) {
          await updateDoc(doc(db, 'products', existingId), payload)
        } else {
          const refDoc = await addDoc(collection(db, 'products'), {
            ...payload,
            createdAt: serverTimestamp()
          })
          finalId = refDoc.id
        }
      } catch (err) {
        console.warn('Firestore products write failed, updated local state & cache:', err)
      }
    }

    // Instant optimistic update across storefront & CMS
    const idx = products.value.findIndex((p) => p.id === finalId || (existingId && p.id === existingId))
    const updatedProd = { id: finalId, ...payload, updatedAt: new Date().toISOString() }
    if (idx !== -1) {
      products.value[idx] = { ...products.value[idx], ...updatedProd }
    } else {
      products.value.unshift(updatedProd)
    }
    saveToCache('ystore_products_cache', products.value)

    return finalId
  }

  const deleteProduct = async (id) => {
    if (!id) return
    const db = getDb()
    if (db) {
      try {
        await deleteDoc(doc(db, 'products', id))
      } catch (err) {
        console.warn('Firestore deleteDoc failed for product:', err)
      }
    }
    products.value = products.value.filter((p) => p.id !== id)
    saveToCache('ystore_products_cache', products.value)
  }

  // ==========================================
  // CATEGORIES CRUD (Optimistic & Persistent)
  // ==========================================
  const saveCategory = async (categoryData, existingId = null) => {
    const db = getDb()

    const payload = {
      name: (categoryData.name || '').trim(),
      title: (categoryData.title || categoryData.name || '').trim(),
      description: (categoryData.description || '').trim(),
      image: categoryData.image || '',
      updatedAt: serverTimestamp()
    }

    let finalId = existingId || `cat-${Date.now()}`
    if (db) {
      try {
        if (existingId) {
          await updateDoc(doc(db, 'categories', existingId), payload)
        } else {
          const refDoc = await addDoc(collection(db, 'categories'), {
            ...payload,
            createdAt: serverTimestamp()
          })
          finalId = refDoc.id
        }
      } catch (err) {
        console.warn('Firestore categories write failed, updated local state & cache:', err)
      }
    }

    const idx = categories.value.findIndex((c) => c.id === finalId || (existingId && c.id === existingId))
    const updatedCat = { id: finalId, ...payload, updatedAt: new Date().toISOString() }
    if (idx !== -1) {
      categories.value[idx] = { ...categories.value[idx], ...updatedCat }
    } else {
      categories.value.push(updatedCat)
    }
    saveToCache('ystore_categories_cache', categories.value)

    return finalId
  }

  const deleteCategory = async (id) => {
    if (!id) return
    const db = getDb()
    if (db) {
      try {
        await deleteDoc(doc(db, 'categories', id))
      } catch (err) {
        console.warn('Firestore deleteDoc failed for category:', err)
      }
    }
    categories.value = categories.value.filter((c) => c.id !== id)
    saveToCache('ystore_categories_cache', categories.value)
  }

  // ==========================================
  // COLLECTIONS CRUD (Curated Product Collections)
  // ==========================================
  const saveCollection = async (collectionData, existingId = null) => {
    const db = getDb()

    const payload = {
      name: (collectionData.name || '').trim(),
      title: (collectionData.title || collectionData.name || '').trim(),
      description: (collectionData.description || '').trim(),
      image: (collectionData.image || '').trim(),
      slug: (collectionData.slug || (collectionData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim(),
      featured: !!collectionData.featured,
      productIds: Array.isArray(collectionData.productIds) ? collectionData.productIds : [],
      updatedAt: serverTimestamp()
    }

    let finalId = existingId || `col-${Date.now()}`
    if (db) {
      try {
        if (existingId) {
          await updateDoc(doc(db, 'collections', existingId), payload)
        } else {
          const refDoc = await addDoc(collection(db, 'collections'), {
            ...payload,
            createdAt: serverTimestamp()
          })
          finalId = refDoc.id
        }
      } catch (err) {
        console.warn('Firestore collections write failed, updated local state & cache:', err)
      }
    }

    const idx = collectionsList.value.findIndex((c) => c.id === finalId || (existingId && c.id === existingId))
    const updatedCol = { id: finalId, ...payload, updatedAt: new Date().toISOString() }
    if (idx !== -1) {
      collectionsList.value[idx] = { ...collectionsList.value[idx], ...updatedCol }
    } else {
      collectionsList.value.push(updatedCol)
    }
    saveToCache('ystore_collections_cache', collectionsList.value)

    return finalId
  }

  const deleteCollection = async (id) => {
    if (!id) return
    const db = getDb()
    if (db) {
      try {
        await deleteDoc(doc(db, 'collections', id))
      } catch (err) {
        console.warn('Firestore deleteDoc failed for collection:', err)
      }
    }
    collectionsList.value = collectionsList.value.filter((c) => c.id !== id)
    saveToCache('ystore_collections_cache', collectionsList.value)
  }

  // ==========================================
  // DISCOUNTS / COUPONS CRUD
  // ==========================================
  const saveDiscount = async (discountData, existingId = null) => {
    const db = getDb()

    const payload = {
      code: (discountData.code || '').toUpperCase().trim(),
      discount: (discountData.discount || '').trim(),
      description: (discountData.description || '').trim(),
      active: discountData.active !== false,
      updatedAt: serverTimestamp()
    }

    let finalId = existingId || `disc-${Date.now()}`
    if (db) {
      try {
        if (existingId) {
          await updateDoc(doc(db, 'discounts', existingId), payload)
        } else {
          const refDoc = await addDoc(collection(db, 'discounts'), {
            ...payload,
            createdAt: serverTimestamp()
          })
          finalId = refDoc.id
        }
      } catch (err) {
        console.warn('Firestore discounts write failed, updated local state & cache:', err)
      }
    }

    const idx = discounts.value.findIndex((d) => d.id === finalId || (existingId && d.id === existingId))
    const updatedDisc = { id: finalId, ...payload, updatedAt: new Date().toISOString() }
    if (idx !== -1) {
      discounts.value[idx] = { ...discounts.value[idx], ...updatedDisc }
    } else {
      discounts.value.push(updatedDisc)
    }
    saveToCache('ystore_discounts_cache', discounts.value)

    return finalId
  }

  const deleteDiscount = async (id) => {
    if (!id) return
    const db = getDb()
    if (db) {
      try {
        await deleteDoc(doc(db, 'discounts', id))
      } catch (err) {
        console.warn('Firestore deleteDoc failed for discount:', err)
      }
    }
    discounts.value = discounts.value.filter((d) => d.id !== id)
    saveToCache('ystore_discounts_cache', discounts.value)
  }

  // ==========================================
  // BLOGS CRUD
  // ==========================================
  const saveBlog = async (blogData, existingId = null) => {
    const db = getDb()

    const paragraphs = Array.isArray(blogData.paragraphs)
      ? blogData.paragraphs
      : (blogData.body || '')
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean)

    const tags = Array.isArray(blogData.tags)
      ? blogData.tags
      : (blogData.tagsString || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

    const takeaways = Array.isArray(blogData.takeaways)
      ? blogData.takeaways
      : (blogData.takeawaysString || '')
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean)

    const payload = {
      title: (blogData.title || '').trim(),
      category: (blogData.category || 'Craft & Play').trim(),
      excerpt: (blogData.excerpt || '').trim(),
      coverImage: blogData.coverImage || '',
      readTime: blogData.readTime || '4 min read',
      date: blogData.date || new Date().toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' }),
      featured: !!blogData.featured,
      tags,
      takeaways,
      body: blogData.body || paragraphs.join('\n\n'),
      content: [
        {
          heading: blogData.sectionHeading || '',
          paragraphs,
          quote: blogData.quote || ''
        }
      ],
      author: {
        name: blogData.authorName || 'Laban Le Fleur',
        role: blogData.authorRole || 'Founder & Creative Director',
        avatar: blogData.authorAvatar || useAsset('/images/avatar-laban.jpg'),
        bio: blogData.authorBio || 'Passionate about quality handcrafted products, thoughtful design, and joyful living at Yellow Berry Store.'
      },
      updatedAt: serverTimestamp()
    }

    let finalId = existingId || `blog-${Date.now()}`
    if (db) {
      try {
        if (existingId) {
          await updateDoc(doc(db, 'blogs', existingId), payload)
        } else {
          const refDoc = await addDoc(collection(db, 'blogs'), {
            ...payload,
            createdAt: serverTimestamp()
          })
          finalId = refDoc.id
        }
      } catch (err) {
        console.warn('Firestore blogs write failed, updated local state & cache:', err)
      }
    }

    const idx = blogs.value.findIndex((b) => b.id === finalId || (existingId && b.id === existingId))
    const updatedBlog = { id: finalId, ...payload, updatedAt: new Date().toISOString() }
    if (idx !== -1) {
      blogs.value[idx] = { ...blogs.value[idx], ...updatedBlog }
    } else {
      blogs.value.unshift(updatedBlog)
    }
    saveToCache('ystore_blogs_cache', blogs.value)

    return finalId
  }

  const deleteBlog = async (id) => {
    if (!id) return
    const db = getDb()
    if (db) {
      try {
        await deleteDoc(doc(db, 'blogs', id))
      } catch (err) {
        console.warn('Firestore deleteDoc failed for blog:', err)
      }
    }
    blogs.value = blogs.value.filter((b) => b.id !== id)
    saveToCache('ystore_blogs_cache', blogs.value)
  }

  // ==========================================
  // ORDERS CRUD
  // ==========================================
  const createOrder = async (orderData) => {
    const db = getDb()
    if (!db) throw new Error('Firestore database not initialized.')

    // Validate and sanitize numeric totals to prevent client tampering
    const sanitizedItems = (orderData.items || []).map((item) => ({
      id: String(item.id || ''),
      name: String(item.name || 'Product'),
      price: Math.max(0, Number(item.price) || 0),
      qty: Math.max(1, parseInt(item.qty, 10) || 1),
      image: String(item.image || '')
    }))

    const computedSubtotal = sanitizedItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0)
    const computedShipping = orderData.deliveryMethod === 'collection' ? 0 : (orderData.deliveryMethod === 'express' ? 150 : (computedSubtotal >= 500 ? 0 : 99))
    const cleanDiscount = Math.max(0, Number(orderData.discountAmount) || 0)
    const computedGrandTotal = Math.max(0, computedSubtotal - cleanDiscount + computedShipping)

    const payload = {
      ...orderData,
      items: sanitizedItems,
      subtotal: computedSubtotal,
      shippingFee: computedShipping,
      discountAmount: cleanDiscount,
      total: computedGrandTotal,
      status: orderData.status || 'Processing',
      createdAt: serverTimestamp()
    }

    const refDoc = await addDoc(collection(db, 'orders'), payload)
    return refDoc.id
  }

  const updateOrderStatus = async (orderId, status) => {
    const db = getDb()
    if (!db || !orderId) return
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: serverTimestamp()
    })
  }

  const deleteOrder = async (orderId) => {
    const db = getDb()
    if (!db || !orderId) return
    await deleteDoc(doc(db, 'orders', orderId))
  }

  const isVideoFile = (url = '') => {
    if (!url) return false
    const clean = url.split('?')[0].toLowerCase()
    return (
      clean.endsWith('.mp4') ||
      clean.endsWith('.webm') ||
      clean.endsWith('.ogg') ||
      clean.endsWith('.mov') ||
      clean.endsWith('.m4v') ||
      url.includes('video%2f') ||
      url.includes('video%2F') ||
      url.includes('/video') ||
      (url.includes('firebasestorage') && url.includes('video'))
    )
  }

  // ==========================================
  // BANNERS CRUD (Landing Page Hero Banners - Optimistic & Persistent)
  // ==========================================
  const saveBanner = async (bannerData, existingId = null) => {
    const db = getDb()

    const desktopUrl = (bannerData.desktopUrl || '').trim()
    const mobileUrl = (bannerData.mobileUrl || '').trim()
    const videoUrl = (bannerData.videoUrl || '').trim()

    const payload = {
      title: (bannerData.title || '').trim(),
      subtitle: (bannerData.subtitle || bannerData.description || '').trim(),
      badge: (bannerData.badge || '').trim(),
      desktopUrl,
      desktopType: bannerData.desktopType || (isVideoFile(desktopUrl) ? 'video' : 'image'),
      mobileUrl,
      mobileType: bannerData.mobileType || (isVideoFile(mobileUrl) ? 'video' : 'image'),
      videoUrl,
      altText: (bannerData.altText || bannerData.title || 'Yellow Berry Store hero banner').trim(),
      link: (bannerData.link || '#featured').trim(),
      buttonText: (bannerData.buttonText || 'Explore Catalog').trim(),
      startDate: bannerData.startDate || null,
      endDate: bannerData.endDate || null,
      status: bannerData.status || (bannerData.isDraft || bannerData.active === false ? 'draft' : 'published'),
      active: bannerData.status ? bannerData.status === 'published' : bannerData.active !== false,
      order: Number(bannerData.order ?? 0),
      updatedAt: serverTimestamp()
    }

    let finalId = existingId || `ban-${Date.now()}`
    if (db) {
      try {
        if (existingId) {
          await updateDoc(doc(db, 'banners', existingId), payload)
        } else {
          const refDoc = await addDoc(collection(db, 'banners'), {
            ...payload,
            createdAt: serverTimestamp()
          })
          finalId = refDoc.id
        }
      } catch (err) {
        console.warn('Firestore banners write failed, updated local state & cache:', err)
      }
    }

    const idx = banners.value.findIndex((b) => b.id === finalId || (existingId && b.id === existingId))
    const updatedBanner = { id: finalId, ...payload, updatedAt: new Date().toISOString() }
    if (idx !== -1) {
      banners.value[idx] = { ...banners.value[idx], ...updatedBanner }
    } else {
      banners.value.unshift(updatedBanner)
    }
    saveToCache('ystore_banners_cache', banners.value)

    return finalId
  }

  const deleteBanner = async (id) => {
    if (!id) return
    const db = getDb()
    if (db) {
      try {
        await deleteDoc(doc(db, 'banners', id))
      } catch (err) {
        console.warn('Firestore deleteDoc failed for banner:', err)
      }
    }
    banners.value = banners.value.filter((b) => b.id !== id)
    saveToCache('ystore_banners_cache', banners.value)
  }

  // ==========================================
  // CUSTOMER SEGMENTS CRUD
  // ==========================================
  const saveCustomerSegment = async (segmentData, existingId = null) => {
    const db = getDb()
    if (!db) throw new Error('Firestore database not initialized.')

    const payload = {
      name: (segmentData.name || '').trim(),
      description: (segmentData.description || '').trim(),
      criteriaType: segmentData.criteriaType || 'all',
      minSpend: Number(segmentData.minSpend || 0),
      minOrders: Number(segmentData.minOrders || 0),
      minPoints: Number(segmentData.minPoints || 0),
      color: segmentData.color || 'yellow',
      tags: Array.isArray(segmentData.tags) ? segmentData.tags : [],
      updatedAt: serverTimestamp()
    }

    if (existingId) {
      await updateDoc(doc(db, 'customer_segments', existingId), payload)
      return existingId
    } else {
      const refDoc = await addDoc(collection(db, 'customer_segments'), {
        ...payload,
        createdAt: serverTimestamp()
      })
      return refDoc.id
    }
  }

  const deleteCustomerSegment = async (id) => {
    const db = getDb()
    if (!db || !id) return
    await deleteDoc(doc(db, 'customer_segments', id))
  }

  // ==========================================
  // PURCHASE ORDERS CRUD (Supplier & Inventory POs)
  // ==========================================
  const savePurchaseOrder = async (poData, existingId = null) => {
    const db = getDb()
    if (!db) throw new Error('Firestore database not initialized.')

    const items = Array.isArray(poData.items) ? poData.items.map((it) => ({
      productId: it.productId || '',
      name: (it.name || '').trim(),
      sku: (it.sku || '').trim(),
      quantityOrdered: Number(it.quantityOrdered || it.quantity || 1),
      quantityReceived: Number(it.quantityReceived ?? 0),
      unitCost: Number(it.unitCost || 0),
      totalCost: Number((Number(it.quantityOrdered || 1) * Number(it.unitCost || 0)).toFixed(2))
    })) : []

    const subtotal = items.reduce((sum, it) => sum + (it.totalCost || 0), 0)
    const shippingCost = Number(poData.shippingCost || 0)
    const total = Number((subtotal + shippingCost).toFixed(2))

    const payload = {
      poNumber: (poData.poNumber || `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`).trim(),
      supplierName: (poData.supplierName || '').trim(),
      supplierEmail: (poData.supplierEmail || '').trim(),
      destination: (poData.destination || 'Main Workshop / Warehouse').trim(),
      status: poData.status || 'ordered',
      expectedDate: poData.expectedDate || null,
      items,
      subtotal,
      shippingCost,
      total,
      notes: (poData.notes || '').trim(),
      updatedAt: serverTimestamp()
    }

    if (existingId) {
      await updateDoc(doc(db, 'purchase_orders', existingId), payload)
      return existingId
    } else {
      const refDoc = await addDoc(collection(db, 'purchase_orders'), {
        ...payload,
        createdAt: serverTimestamp()
      })
      return refDoc.id
    }
  }

  const deletePurchaseOrder = async (id) => {
    const db = getDb()
    if (!db || !id) return
    await deleteDoc(doc(db, 'purchase_orders', id))
  }

  const receivePurchaseOrder = async (poId, shouldUpdateProductStock = true) => {
    const db = getDb()
    if (!db || !poId) return
    const po = purchaseOrders.value.find((p) => p.id === poId)
    if (!po) return

    const updatedItems = (po.items || []).map((it) => ({
      ...it,
      quantityReceived: it.quantityOrdered
    }))

    await updateDoc(doc(db, 'purchase_orders', poId), {
      status: 'received',
      items: updatedItems,
      receivedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    if (shouldUpdateProductStock && Array.isArray(po.items)) {
      for (const item of po.items) {
        if (item.productId) {
          const existingProduct = products.value.find((p) => p.id === item.productId)
          if (existingProduct) {
            const currentQty = Number(existingProduct.quantity ?? existingProduct.stockLeft ?? 0)
            const addQty = Number(item.quantityOrdered || 0)
            const newQty = currentQty + addQty
            await updateDoc(doc(db, 'products', item.productId), {
              quantity: newQty,
              stockLeft: newQty,
              inStock: newQty > 0 || !!existingProduct.continueSellingWhenOutOfStock,
              updatedAt: serverTimestamp()
            })
          }
        }
      }
    }
  }

  // Computed active banners for Hero section (respects active toggle, draft status, and end dates)
  const activeBanners = computed(() => {
    const now = new Date()
    return banners.value
      .filter((b) => {
        if (b.status === 'draft') return false
        if (b.active === false) return false
        if (b.endDate) {
          const end = new Date(b.endDate)
          if (!isNaN(end.getTime()) && end < now) return false
        }
        if (b.startDate) {
          const start = new Date(b.startDate)
          if (!isNaN(start.getTime()) && start > now) return false
        }
        return true
      })
      .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
  })

  // Whether any valid active hero banners are loaded (used to completely hide hero section when empty)
  const hasActiveBanners = computed(() => {
    return activeBanners.value.some((b) => b && (b.desktopUrl || b.videoUrl || b.mobileUrl || b.image))
  })

  // ==========================================
  // PAYMENT SETTINGS CRUD (Firestore & Cache)
  // ==========================================
  const savePaymentSettings = async (settingsData) => {
    const db = getDb()

    const payload = {
      general: {
        currency: settingsData.general?.currency || defaultPaymentSettings.general.currency,
        currencySymbol: settingsData.general?.currencySymbol || defaultPaymentSettings.general.currencySymbol,
        currencyPosition: settingsData.general?.currencyPosition || defaultPaymentSettings.general.currencyPosition,
        vatRate: Number(settingsData.general?.vatRate ?? 15),
        pricesIncludeTax: settingsData.general?.pricesIncludeTax !== false,
        sandboxMode: !!settingsData.general?.sandboxMode,
        autoCapture: settingsData.general?.autoCapture !== false,
        sendReceiptEmails: settingsData.general?.sendReceiptEmails !== false
      },
      gateways: {
        payfast: {
          ...defaultPaymentSettings.gateways.payfast,
          ...(settingsData.gateways?.payfast || {})
        },
        yoco: {
          ...defaultPaymentSettings.gateways.yoco,
          ...(settingsData.gateways?.yoco || {})
        },
        ozow: {
          ...defaultPaymentSettings.gateways.ozow,
          ...(settingsData.gateways?.ozow || {})
        },
        payflex: {
          ...defaultPaymentSettings.gateways.payflex,
          ...(settingsData.gateways?.payflex || {})
        },
        stripe: {
          ...defaultPaymentSettings.gateways.stripe,
          ...(settingsData.gateways?.stripe || {})
        },
        eft: {
          ...defaultPaymentSettings.gateways.eft,
          ...(settingsData.gateways?.eft || {})
        },
        cod: {
          ...defaultPaymentSettings.gateways.cod,
          ...(settingsData.gateways?.cod || {})
        }
      },
      payouts: {
        bankName: (settingsData.payouts?.bankName || defaultPaymentSettings.payouts.bankName).trim(),
        accountHolder: (settingsData.payouts?.accountHolder || defaultPaymentSettings.payouts.accountHolder).trim(),
        accountNumber: (settingsData.payouts?.accountNumber || defaultPaymentSettings.payouts.accountNumber).trim(),
        branchCode: (settingsData.payouts?.branchCode || defaultPaymentSettings.payouts.branchCode).trim(),
        accountType: settingsData.payouts?.accountType || defaultPaymentSettings.payouts.accountType,
        schedule: settingsData.payouts?.schedule || defaultPaymentSettings.payouts.schedule,
        payoutEmail: (settingsData.payouts?.payoutEmail || defaultPaymentSettings.payouts.payoutEmail).trim()
      },
      updatedAt: serverTimestamp()
    }

    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'payments'), payload, { merge: true })
        // Also save sanitized public configuration to doc(db, 'settings', 'public_config')
        const publicPayload = sanitizePublicPaymentSettings(payload)
        await setDoc(doc(db, 'settings', 'public_config'), publicPayload, { merge: true })
      } catch (err) {
        console.warn('Firestore setDoc failed for payment settings:', err)
      }
    }

    // Always update reactive local state
    paymentSettings.value = JSON.parse(JSON.stringify(payload))
    if (typeof window !== 'undefined') {
      try {
        // Only cache sanitized settings in localStorage to prevent secret key leakage
        const sanitized = sanitizePublicPaymentSettings(payload)
        localStorage.setItem('ystore_payment_settings', JSON.stringify(sanitized))
      } catch {
        // Ignore localStorage quota
      }
    }
    return true
  }

  // ==========================================
  // ADMIN USERS & STAFF MANAGEMENT CRUD
  // ==========================================
  const saveAdminUser = async (userData, existingId = null) => {
    const db = getDb()

    const payload = {
      name: (userData.name || '').trim(),
      email: (userData.email || '').trim().toLowerCase(),
      role: userData.role || 'Store Manager',
      department: (userData.department || 'Store Operations').trim(),
      phone: (userData.phone || '').trim(),
      status: userData.status || 'active',
      isPrimary: !!userData.isPrimary,
      permissions: Array.isArray(userData.permissions) ? userData.permissions : [],
      avatar: userData.avatar || '',
      joinedDate: userData.joinedDate || new Date().toISOString().split('T')[0],
      lastActive: userData.lastActive || 'Just now',
      updatedAt: serverTimestamp()
    }

    let finalId = existingId

    if (db) {
      try {
        if (existingId) {
          await updateDoc(doc(db, 'admin_users', existingId), payload)
        } else {
          const refDoc = await addDoc(collection(db, 'admin_users'), {
            ...payload,
            createdAt: serverTimestamp()
          })
          finalId = refDoc.id
        }
      } catch (err) {
        console.warn('Firestore admin_users write failed, using local cache:', err)
        if (!finalId) {
          finalId = `usr-${Date.now()}`
        }
      }
    } else if (!finalId) {
      finalId = `usr-${Date.now()}`
    }

    // Always update reactive local state and localStorage
    const index = adminUsers.value.findIndex((u) => u.id === finalId)
    const updatedUser = { id: finalId, ...payload, updatedAt: new Date().toISOString() }
    if (index !== -1) {
      adminUsers.value[index] = { ...adminUsers.value[index], ...updatedUser }
    } else {
      adminUsers.value.push(updatedUser)
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ystore_admin_users', JSON.stringify(adminUsers.value))
      } catch {
        // Ignore quota
      }
    }

    return finalId
  }

  const deleteAdminUser = async (id) => {
    const db = getDb()
    const user = adminUsers.value.find((u) => u.id === id)
    if (user && user.isPrimary) {
      throw new Error('Primary Super Admin cannot be removed.')
    }

    if (db && id) {
      try {
        await deleteDoc(doc(db, 'admin_users', id))
      } catch (err) {
        console.warn('Firestore deleteDoc failed for admin_users:', err)
      }
    }

    adminUsers.value = adminUsers.value.filter((u) => u.id !== id)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ystore_admin_users', JSON.stringify(adminUsers.value))
      } catch {
        // Ignore quota
      }
    }
  }

  // Computed filtered product subsets for Storefront components (Drafts excluded from customers)
  const publishedProducts = computed(() => products.value.filter((p) => p.status !== 'draft'))
  const featuredProducts = computed(() => products.value.filter((p) => p.isFeatured && p.status !== 'draft'))
  const newArrivalProducts = computed(() => products.value.filter((p) => p.isNewArrival && p.status !== 'draft'))
  const bestSellerProducts = computed(() => products.value.filter((p) => p.isBestSeller && p.status !== 'draft'))
  const specialProducts = computed(() => products.value.filter((p) => (p.isSpecial || (p.discount && p.discount > 0)) && p.status !== 'draft'))

  // Active categories that have at least 1 published product loaded and mapped
  const categoriesWithProducts = computed(() => {
    if (!categories.value?.length || !publishedProducts.value?.length) return []
    return categories.value
      .map((cat) => {
        const catName = (cat.name || '').trim().toLowerCase()
        const matchingProducts = publishedProducts.value.filter((p) => {
          return (p.category || '').trim().toLowerCase() === catName
        })
        return {
          ...cat,
          itemCount: matchingProducts.length,
          image: cat.image || matchingProducts[0]?.image || matchingProducts[0]?.images?.[0] || ''
        }
      })
      .filter((cat) => cat.itemCount > 0)
  })

  // Storefront section visibility flags (auto-hide sections with 0 products or unmapped categories)
  const hasCategoriesWithProducts = computed(() => categoriesWithProducts.value.length > 0)
  const hasFeaturedProducts = computed(() => featuredProducts.value.length > 0)
  const hasNewArrivals = computed(() => newArrivalProducts.value.length > 0)
  const hasBestSellers = computed(() => bestSellerProducts.value.length > 0)
  const hasPublishedProducts = computed(() => publishedProducts.value.length > 0)

  // Utility to seed or sync default initial catalog items to Firestore when empty
  const syncDefaultCatalogToFirestore = async () => {
    const db = getDb()
    if (!db) throw new Error('Firestore database not initialized.')

    for (const cat of defaultInitialCategories) {
      await setDoc(doc(db, 'categories', cat.id), {
        ...cat,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true })
    }

    for (const ban of defaultInitialBanners) {
      await setDoc(doc(db, 'banners', ban.id), {
        ...ban,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true })
    }

    for (const prod of defaultInitialProducts) {
      await setDoc(doc(db, 'products', prod.id), {
        ...prod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true })
    }

    for (const disc of defaultInitialDiscounts) {
      await setDoc(doc(db, 'discounts', disc.id), {
        ...disc,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true })
    }

    for (const blg of defaultInitialBlogs) {
      await setDoc(doc(db, 'blogs', blg.id), {
        ...blg,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true })
    }

    return true
  }

  return {
    products,
    publishedProducts,
    categories,
    categoriesWithProducts,
    hasCategoriesWithProducts,
    hasFeaturedProducts,
    hasNewArrivals,
    hasBestSellers,
    hasPublishedProducts,
    collections: collectionsList,
    discounts,
    blogs,
    orders,
    customers,
    customerSegments,
    purchaseOrders,
    banners,
    activeBanners,
    hasActiveBanners,
    featuredProducts,
    newArrivalProducts,
    bestSellerProducts,
    specialProducts,
    paymentSettings,
    savePaymentSettings,
    defaultPaymentSettings,
    adminUsers,
    defaultAdminUsers,
    saveAdminUser,
    deleteAdminUser,
    contentLoading,
    contentError,
    initContentListeners,
    initAdminListeners,
    sanitizePublicPaymentSettings,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    saveCollection,
    deleteCollection,
    saveDiscount,
    deleteDiscount,
    saveBlog,
    deleteBlog,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    saveBanner,
    deleteBanner,
    saveCustomerSegment,
    deleteCustomerSegment,
    savePurchaseOrder,
    deletePurchaseOrder,
    receivePurchaseOrder,
    syncDefaultCatalogToFirestore,
    defaultInitialProducts,
    defaultInitialBanners,
    defaultInitialCategories,
    defaultInitialDiscounts,
    defaultInitialBlogs,
    isVideoFile
  }
}

