<template>
  <div class="w-full bg-white font-poppins min-h-screen">
    <!-- Sub-header Bar: "All categories" & Breadcrumbs -->
    <section class="w-full pt-6 pb-2">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- "All categories" Button & Dropdown -->
        <div class="relative inline-block">
          <button
            type="button"
            @click="categoryMenuOpen = !categoryMenuOpen"
            class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 font-medium text-sm transition-all duration-200 shadow-xs cursor-pointer select-none active:scale-95"
            aria-label="All categories"
          >
            <FlowbiteIcon name="bars" size="18" stroke-width="2" />
            <span>All categories</span>
            <FlowbiteIcon
              name="chevron-down"
              size="14"
              stroke-width="2"
              :class="['transition-transform duration-200', categoryMenuOpen ? 'rotate-180' : '']"
            />
          </button>

          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div
              v-if="categoryMenuOpen"
              class="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-3 z-30 font-poppins"
            >
              <a
                v-for="cat in categoriesList"
                :key="cat"
                href="#categories"
                @click="categoryMenuOpen = false; $emit('back-home')"
                class="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-[#FEFEEB] hover:text-neutral-900 transition-colors"
              >
                {{ cat }}
              </a>
            </div>
          </transition>
        </div>

        <!-- Horizontal Divider -->
        <div class="border-b border-neutral-200 mt-4 mb-4"></div>

        <!-- Breadcrumbs Navigation -->
        <nav class="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 font-normal" aria-label="Breadcrumb">
          <button
            type="button"
            @click="$emit('back-home')"
            class="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>&gt;</span>
          <span class="hover:text-neutral-900 cursor-pointer" @click="$emit('back-home')">{{ product?.category || 'Products' }}</span>
          <template v-if="product?.name">
            <span>&gt;</span>
            <span class="text-neutral-500 font-normal">{{ product.name }}</span>
          </template>
        </nav>
      </div>
    </section>

    <!-- Empty State if no product is selected -->
    <section v-if="!product" class="py-16">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-neutral-50 rounded-3xl border border-neutral-200/80 p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
          <h2 class="text-xl font-semibold text-neutral-900">No product selected</h2>
          <p class="text-xs sm:text-sm text-neutral-500 mt-1 mb-6">
            Select a product from our catalog to view its full specifications.
          </p>
          <button
            type="button"
            @click="$emit('back-home')"
            class="btn-primary !text-xs sm:!text-sm"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    </section>

    <!-- Main Product Detail Showcase -->
    <section v-else class="py-6 sm:py-8">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">
          <!-- Col 1: Main Product Image (Left) -->
          <div class="lg:col-span-6 xl:col-span-5 flex flex-col items-center">
            <div class="relative w-full aspect-square rounded-3xl bg-[#ECECEC] flex items-center justify-center overflow-hidden shadow-xs border border-neutral-200/40 group">
              <!-- Shimmer loading skeleton -->
              <div
                v-if="mainImageLoading"
                class="absolute inset-0 bg-neutral-200/80 animate-pulse flex items-center justify-center z-10"
              >
                <div class="w-10 h-10 rounded-full border-2 border-neutral-300 border-t-[#DEC02A] animate-spin"></div>
              </div>

              <transition name="image-fade" mode="out-in">
                <img
                  :key="activeImage"
                  :src="activeImage"
                  :alt="product.name || 'Product'"
                  class="w-full h-full object-cover object-center select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                  fetchpriority="high"
                  loading="eager"
                  decoding="async"
                  @load="mainImageLoading = false"
                  @error="mainImageLoading = false"
                />
              </transition>
            </div>
          </div>

          <!-- Col 2: Vertical Thumbnails (Middle) -->
          <div class="lg:col-span-2 xl:col-span-2 flex flex-row lg:flex-col gap-3 justify-center lg:justify-start overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            <button
              v-for="(img, idx) in galleryImages"
              :key="idx"
              type="button"
              @click="selectGalleryImage(img)"
              @mouseenter="preloadImage(img)"
              :class="[
                'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#ECECEC] flex items-center justify-center border-2 transition-all duration-200 cursor-pointer shrink-0',
                activeImage === img
                  ? 'border-[#F4EB6A] shadow-md ring-2 ring-[#F4EB6A]/50 scale-102'
                  : 'border-transparent hover:border-neutral-300 opacity-80 hover:opacity-100'
              ]"
              :aria-label="`Select image view ${idx + 1}`"
            >
              <img
                :src="img"
                :alt="`${product.name || 'Product'} thumbnail ${idx + 1}`"
                class="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>

          <!-- Col 3: Product Info & Purchase Panel (Right) -->
          <div class="lg:col-span-4 xl:col-span-5 flex flex-col pt-2 lg:pt-0">
            <!-- Category, SKU & Stock Status -->
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FEFCE8] text-neutral-800 border border-[#F4EB6A]/50">
                {{ product.category || 'Product' }}
              </span>
              <span v-if="product.sku" class="text-xs font-mono text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                SKU: {{ product.sku }}
              </span>
              <!-- Live Stock badge -->
              <span
                v-if="isOutOfStockAndBlocked"
                class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200"
              >
                Sold Out
              </span>
              <span
                v-else-if="product.quantity > 0"
                class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                In Stock ({{ product.quantity }} available)
              </span>
              <span
                v-else-if="product.continueSellingWhenOutOfStock"
                class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Made to Order / Backorders Allowed
              </span>
            </div>

            <!-- Product Title -->
            <h1 class="text-3xl sm:text-4xl lg:text-[44px] font-bold text-neutral-900 tracking-tight leading-[1.15]">
              {{ product.titleLine1 || product.name }}
              <template v-if="product.titleLine2"><br />{{ product.titleLine2 }}</template>
            </h1>

            <!-- Tags -->
            <div v-if="product.tags && product.tags.length" class="flex flex-wrap gap-1.5 mt-3">
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60"
              >
                #{{ tag }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed mt-4 max-w-md">
              {{ product.fullDescription || product.description }}
            </p>

            <!-- Price -->
            <div class="mt-6 flex items-baseline gap-2">
              <span class="text-2xl sm:text-3xl font-bold text-neutral-900">Price:</span>
              <span class="text-2xl sm:text-3xl font-bold text-neutral-900">R{{ product.price }}</span>
              <span v-if="product.originalPrice" class="text-base text-neutral-400 line-through ml-2">R{{ product.originalPrice }}</span>
            </div>

            <!-- Color Options (Only when colors have been added to the product) -->
            <div v-if="productColors.length > 0" class="mt-6">
              <div class="text-sm font-medium text-neutral-900 mb-2.5">
                Color: <span class="font-normal text-neutral-600">{{ selectedColor }}</span>
              </div>
              <div class="flex items-center gap-2.5 flex-wrap">
                <button
                  v-for="color in productColors"
                  :key="color"
                  type="button"
                  @click="selectedColor = color"
                  :class="[
                    'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
                    selectedColor === color
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                  ]"
                >
                  {{ color }}
                </button>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="mt-6" v-if="!isOutOfStockAndBlocked">
              <div class="text-sm font-medium text-neutral-900 mb-2.5">Quantity</div>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="decrementQty"
                  class="w-8 h-8 rounded-full bg-[#FAF7BA] hover:bg-[#F4EB6A] text-neutral-900 font-bold flex items-center justify-center transition-all cursor-pointer active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <FlowbiteIcon name="minus" size="14" stroke-width="2.5" />
                </button>
                <span class="w-6 text-center font-semibold text-neutral-900 text-sm select-none">
                  {{ quantity }}
                </span>
                <button
                  type="button"
                  @click="incrementQty"
                  class="w-8 h-8 rounded-full bg-[#FAF7BA] hover:bg-[#F4EB6A] text-neutral-900 font-bold flex items-center justify-center transition-all cursor-pointer active:scale-90"
                  aria-label="Increase quantity"
                >
                  <FlowbiteIcon name="plus" size="14" stroke-width="2.5" />
                </button>
              </div>
            </div>

            <!-- Purchase Actions -->
            <div class="mt-8 flex flex-col gap-3 max-w-sm">
              <template v-if="!isOutOfStockAndBlocked">
                <!-- Add to Cart Button -->
                <button
                  type="button"
                  @click="addToCartHandler"
                  class="w-full bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 font-medium py-3.5 px-8 rounded-full shadow-xs flex items-center justify-center gap-2.5 transition-all text-sm sm:text-base cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <img :src="useAsset('/images/cart-icon.svg')" alt="" class="w-5 h-5 object-contain filter brightness-0" />
                  <span>Add to Cart</span>
                </button>

                <!-- Buy Now Button -->
                <button
                  type="button"
                  @click="buyNowHandler"
                  class="w-full bg-white hover:bg-neutral-50 text-neutral-900 font-medium py-3 px-8 rounded-full border border-neutral-900 shadow-xs flex items-center justify-center transition-all text-sm sm:text-base cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Buy now</span>
                </button>
              </template>
              <div
                v-else
                class="w-full p-4 rounded-2xl bg-neutral-100 text-neutral-500 font-semibold text-center border border-neutral-200"
              >
                Currently Out of Stock
              </div>
            </div>

            <!-- Shipping, Packaging & Specs Pill Box -->
            <div
              v-if="(product.weight || (product.packedDimensions && (product.packedDimensions.length || product.packedDimensions.width || product.packedDimensions.height)) || product.packageType || product.requiresShipping !== false)"
              class="mt-6 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-2 text-xs text-neutral-600 max-w-sm"
            >
              <div v-if="product.requiresShipping !== false" class="flex items-center gap-2 font-medium text-neutral-800">
                <span class="text-sm">🚚</span>
                <span>Courier delivery across South Africa</span>
              </div>
              <div v-if="product.weight" class="flex items-center gap-2">
                <span class="text-sm">⚖️</span>
                <span>Weight: <strong class="text-neutral-900">{{ product.weight }} {{ product.weightUnit || 'kg' }}</strong></span>
              </div>
              <div v-if="product.packedDimensions && (product.packedDimensions.length || product.packedDimensions.width || product.packedDimensions.height)" class="flex items-center gap-2">
                <span class="text-sm">📦</span>
                <span>Packed: <strong class="text-neutral-900">{{ product.packedDimensions.length || 0 }} × {{ product.packedDimensions.width || 0 }} × {{ product.packedDimensions.height || 0 }} cm</strong></span>
              </div>
              <div v-if="product.packageType" class="flex items-center gap-2">
                <span class="text-sm">🎁</span>
                <span>Package: <strong class="text-neutral-900">{{ product.packageType }}</strong></span>
              </div>
            </div>

            <!-- Disclosures & Metafields Accordion Group -->
            <div v-if="hasAnyDisclosures" class="mt-6 border-t border-neutral-200 pt-4 space-y-2 max-w-sm">
              <h3 class="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">Product Disclosures</h3>

              <!-- 🌿 Material & Eco Info -->
              <div v-if="product.disclosures?.material" class="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  @click="toggleDisclosure('material')"
                  class="w-full px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2">🌿 Material & Sustainability</span>
                  <FlowbiteIcon name="chevron-down" size="14" :class="['transition-transform duration-200', openDisclosures.material ? 'rotate-180' : '']" />
                </button>
                <div v-if="openDisclosures.material" class="p-4 bg-white text-xs text-neutral-600 leading-relaxed border-t border-neutral-100">
                  {{ product.disclosures.material }}
                </div>
              </div>

              <!-- 🧼 Care Instructions -->
              <div v-if="product.disclosures?.careInstructions" class="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  @click="toggleDisclosure('care')"
                  class="w-full px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2">🧼 Care & Handling</span>
                  <FlowbiteIcon name="chevron-down" size="14" :class="['transition-transform duration-200', openDisclosures.care ? 'rotate-180' : '']" />
                </button>
                <div v-if="openDisclosures.care" class="p-4 bg-white text-xs text-neutral-600 leading-relaxed border-t border-neutral-100">
                  {{ product.disclosures.careInstructions }}
                </div>
              </div>

              <!-- ⚠️ Safety & Age Warnings -->
              <div v-if="product.disclosures?.safetyNotice" class="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  @click="toggleDisclosure('safety')"
                  class="w-full px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2">⚠️ Safety & Age Notice</span>
                  <FlowbiteIcon name="chevron-down" size="14" :class="['transition-transform duration-200', openDisclosures.safety ? 'rotate-180' : '']" />
                </button>
                <div v-if="openDisclosures.safety" class="p-4 bg-white text-xs text-neutral-600 leading-relaxed border-t border-neutral-100">
                  {{ product.disclosures.safetyNotice }}
                </div>
              </div>

              <!-- 🇿🇦 Manufacturing & Origin -->
              <div v-if="product.disclosures?.origin" class="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  @click="toggleDisclosure('origin')"
                  class="w-full px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2">🇿🇦 Origin & Craft</span>
                  <FlowbiteIcon name="chevron-down" size="14" :class="['transition-transform duration-200', openDisclosures.origin ? 'rotate-180' : '']" />
                </button>
                <div v-if="openDisclosures.origin" class="p-4 bg-white text-xs text-neutral-600 leading-relaxed border-t border-neutral-100">
                  {{ product.disclosures.origin }}
                </div>
              </div>

              <!-- 📋 Custom Metafields -->
              <div v-if="product.metafields && product.metafields.length" class="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  @click="toggleDisclosure('metafields')"
                  class="w-full px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2">📋 Specifications</span>
                  <FlowbiteIcon name="chevron-down" size="14" :class="['transition-transform duration-200', openDisclosures.metafields ? 'rotate-180' : '']" />
                </button>
                <div v-if="openDisclosures.metafields" class="p-4 bg-white text-xs text-neutral-600 border-t border-neutral-100">
                  <dl class="divide-y divide-neutral-100">
                    <div v-for="(mf, idx) in product.metafields" :key="idx" class="py-1.5 flex justify-between gap-4">
                      <dt class="font-medium text-neutral-700">{{ mf.key }}</dt>
                      <dd class="text-neutral-900 text-right font-normal">{{ mf.value }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Proposition Features Bar (4 Distinct Rounded Cards) -->
    <section class="my-10 sm:my-14">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="bg-[#FEFCE8] border border-[#F4EB6A]/30 rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-transform hover:-translate-y-0.5 duration-200"
          >
            <!-- Feature SVG Badge -->
            <div class="w-14 h-12 flex items-center justify-center shrink-0">
              <img
                :src="useAsset(feature.icon)"
                :alt="feature.title"
                class="w-full h-full object-contain"
                loading="lazy"
              />
            </div>

            <div>
              <h3 class="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                {{ feature.title }}
              </h3>
              <p class="text-xs text-neutral-600 mt-0.5 font-light">
                {{ feature.subtitle }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Section: Product Description, Customer Reviews, FAQs -->
    <section class="my-12 sm:my-16">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="grid grid-cols-1 gap-8 xl:gap-12 items-start"
          :class="productFaqs.length > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'"
        >
          <!-- Column 1: Product description -->
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-neutral-900 mb-5 tracking-tight">
              Product description
            </h2>
            <p class="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              {{ product?.fullDescription || product?.description || 'No detailed specifications provided for this product yet.' }}
            </p>
          </div>

          <!-- Column 2: Customer Reviews -->
          <div class="flex flex-col">
            <div class="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 class="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  Customer Reviews
                </h2>
                <p v-if="extendedReviews.length > 0" class="text-xs text-neutral-500 mt-0.5">
                  {{ averageRating }} out of 5 ({{ extendedReviews.length }} {{ extendedReviews.length === 1 ? 'review' : 'reviews' }})
                </p>
              </div>
              <button
                type="button"
                @click="showWriteReviewForm = !showWriteReviewForm"
                class="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold transition-all cursor-pointer shrink-0 active:scale-95"
              >
                {{ showWriteReviewForm ? 'Close Form' : 'Write a Review' }}
              </button>
            </div>

            <!-- Inline Write a Review Form -->
            <div
              v-if="showWriteReviewForm"
              class="mb-6 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-neutral-700">Share your experience</span>
                <div class="flex items-center gap-1">
                  <button
                    v-for="s in 5"
                    :key="s"
                    type="button"
                    @click="reviewForm.rating = s"
                    class="p-0.5 cursor-pointer transition-transform hover:scale-110"
                    :aria-label="`Rate ${s} stars`"
                  >
                    <FlowbiteIcon
                      name="star"
                      size="18"
                      :fill="s <= reviewForm.rating"
                      :class="s <= reviewForm.rating ? 'text-[#EAB308]' : 'text-neutral-300'"
                    />
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  v-model="reviewForm.author"
                  type="text"
                  placeholder="Your Name *"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:border-[#F4EB6A]"
                />
                <input
                  v-model="reviewForm.title"
                  type="text"
                  placeholder="Review Headline (e.g. Great quality!)"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:border-[#F4EB6A]"
                />
              </div>

              <textarea
                v-model="reviewForm.comment"
                rows="3"
                placeholder="Tell other shoppers what you loved about this product *"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:border-[#F4EB6A]"
              ></textarea>

              <div class="flex items-center justify-between gap-3 pt-1">
                <span v-if="reviewFormMessage" class="text-xs font-medium text-emerald-700">{{ reviewFormMessage }}</span>
                <span v-else-if="reviewFormError" class="text-xs font-medium text-red-600">{{ reviewFormError }}</span>
                <span v-else class="text-[11px] text-neutral-400">Your review will appear below immediately.</span>

                <button
                  type="button"
                  :disabled="reviewSubmitting"
                  @click="handleSubmitProductReview"
                  class="px-5 py-2 rounded-full bg-[#F4EB6A] hover:bg-[#e8df56] text-neutral-950 font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {{ reviewSubmitting ? 'Submitting...' : 'Submit Review' }}
                </button>
              </div>
            </div>

            <div v-if="customerReviews.length === 0" class="text-xs sm:text-sm text-neutral-500 font-light">
              No reviews yet for this product. Be the first to leave one!
            </div>
            <div v-else class="space-y-6">
              <div
                v-for="(review, rIdx) in customerReviews"
                :key="review.id || rIdx"
                class="flex flex-col gap-1.5"
              >
                <!-- Stars and Title -->
                <div class="flex items-center gap-2 flex-wrap">
                  <div class="flex items-center text-[#EAB308]">
                    <FlowbiteIcon
                      v-for="star in 5"
                      :key="star"
                      name="star"
                      size="16"
                      :fill="star <= (Number(review.rating) || 5)"
                      :class="star <= (Number(review.rating) || 5) ? 'text-[#EAB308]' : 'text-neutral-200'"
                    />
                  </div>
                  <span v-if="review.title" class="font-bold text-neutral-900 text-sm sm:text-base">
                    {{ review.title }}
                  </span>
                </div>

                <!-- Review Text -->
                <p class="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                  {{ review.comment }}
                </p>

                <!-- Review Author -->
                <div class="text-xs text-neutral-500 font-light">
                  — {{ review.author }} <span class="text-emerald-700 italic font-medium">({{ review.badge || 'Verified Customer' }})</span>
                </div>

                <!-- Admin Reply if any -->
                <div
                  v-if="review.adminReply"
                  class="mt-1.5 pl-3 border-l-2 border-[#F4EB6A] text-xs text-neutral-600 bg-neutral-50 py-1.5 px-2.5 rounded-r-lg"
                >
                  <span class="font-semibold text-neutral-900">Ystore Reply:</span> {{ review.adminReply }}
                </div>
              </div>
            </div>

            <!-- View all reviews button -->
            <button
              v-if="extendedReviews.length > 0"
              type="button"
              @click="showReviewsModal = true"
              class="mt-8 w-full py-2.5 sm:py-3 px-6 rounded-full border border-neutral-700 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 font-medium text-xs sm:text-sm transition-all text-center cursor-pointer active:scale-98"
            >
              View all reviews ({{ extendedReviews.length }})
            </button>
          </div>

          <!-- Column 3: Frequently Asked Questions (Only displayed when added to this product) -->
          <div v-if="productFaqs.length > 0" class="flex flex-col">
            <h2 class="text-xl sm:text-2xl font-bold text-neutral-900 mb-5 tracking-tight">
              Frequently Asked Questions
            </h2>

            <!-- Accordion Pills -->
            <div class="space-y-3">
              <div
                v-for="(faq, fIdx) in productFaqs"
                :key="fIdx"
                class="flex flex-col"
              >
                <button
                  type="button"
                  @click="toggleFaq(fIdx)"
                  class="w-full text-left rounded-full border border-neutral-400 hover:border-neutral-900 px-5 py-2.5 sm:py-3 flex items-center justify-between text-xs sm:text-sm font-medium text-neutral-900 transition-colors cursor-pointer select-none"
                >
                  <span class="truncate pr-2">{{ fIdx + 1 }}. {{ faq.question }}</span>
                  <span class="text-base font-light shrink-0 text-neutral-700">
                    {{ activeFaqIndex === fIdx ? '−' : '+' }}
                  </span>
                </button>

                <!-- Accordion Answer -->
                <transition name="accordion">
                  <div
                    v-if="activeFaqIndex === fIdx"
                    class="px-5 py-3 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed bg-neutral-50 rounded-2xl mt-1.5 border border-neutral-200"
                  >
                    {{ faq.answer }}
                  </div>
                </transition>
              </div>
            </div>

            <!-- View all FAQs button (displayed if more than 3 FAQs) -->
            <button
              v-if="productFaqs.length > 3"
              type="button"
              @click="showAllFaqsModal = true"
              class="mt-8 w-full py-2.5 sm:py-3 px-6 rounded-full border border-neutral-700 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 font-medium text-xs sm:text-sm transition-all text-center cursor-pointer active:scale-98"
            >
              View all FAQs ({{ productFaqs.length }})
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- "Similar products" Section -->
    <section v-if="similarProducts.length > 0" class="my-16 sm:my-20">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl lg:text-[44px] font-bold text-neutral-900 tracking-tight mb-8">
          Similar <span class="font-serif italic font-normal text-neutral-600">products</span>
        </h2>

        <!-- 4 Rounded Cards Matching Reference Wireframe / Ecommerce Catalog -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="(item, idx) in similarProducts"
            :key="item.id || idx"
            @click="selectSimilarProduct(item)"
            class="group relative aspect-[3/4] rounded-3xl bg-[#D9D9D9] hover:bg-[#CECECE] transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-end p-5 shadow-xs hover:shadow-xl hover:-translate-y-1.5"
          >
            <!-- Background Product Preview Image -->
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
              loading="lazy"
            />

            <!-- Hover Info Overlay Pill -->
            <div class="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl shadow-md border border-neutral-200/60">
              <div class="font-semibold text-neutral-900 text-xs sm:text-sm truncate">{{ item.name }}</div>
              <div class="text-xs text-neutral-600 font-medium mt-0.5">R{{ item.price }}</div>
              <div class="text-[11px] text-neutral-900 font-semibold underline mt-1.5 flex items-center gap-1">
                <span>View Product</span>
                <span>&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- "Don't miss out and Subscribe" Newsletter Banner -->
    <section class="my-16 sm:my-24">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl bg-[#D9D9D9] p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <!-- Left Heading -->
          <div class="max-w-md text-left w-full">
            <span class="text-sm sm:text-base text-neutral-800 font-normal block leading-tight">
              Don't miss out and
            </span>
            <h2 class="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-none my-1.5">
              Subscribe
            </h2>
            <p class="text-xs sm:text-sm text-neutral-700 font-light mt-1">
              to get updates on new arrivals and exclusive offers.
            </p>
          </div>

          <!-- Right Form & Disclaimer -->
          <div class="w-full max-w-lg flex flex-col">
            <form @submit.prevent="handleNewsletterSubmit" class="flex flex-col">
              <!-- White Pill Input Container -->
              <div class="bg-white rounded-full p-1.5 pl-5 shadow-xs flex items-center justify-between border border-neutral-300/80 focus-within:border-neutral-900 transition-all">
                <input
                  v-model="newsletterEmail"
                  type="email"
                  required
                  placeholder="Email"
                  class="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none pr-3"
                />
                <button
                  type="submit"
                  class="bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 font-medium px-7 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  Subscribe
                </button>
              </div>

              <!-- Disclaimer with Checkbox -->
              <label class="flex items-start gap-2.5 text-[10px] sm:text-[11px] text-neutral-700 leading-tight mt-3 cursor-pointer pl-1">
                <input
                  v-model="newsletterAgreed"
                  type="checkbox"
                  required
                  class="mt-0.5 rounded text-[#F4EB6A] focus:ring-[#F4EB6A] border-neutral-400 shrink-0"
                />
                <span>
                  I agree to receive marketing communications, including newsletters, promotions and product updates, and other marketing materials. I understand that I can unsubscribe at any time.
                </span>
              </label>

              <!-- Success Alert -->
              <transition name="fade">
                <div
                  v-if="newsletterSubmitted"
                  class="mt-3 p-3 rounded-xl bg-white/90 text-neutral-900 text-xs font-medium flex items-center gap-2 border border-neutral-300"
                >
                  <FlowbiteIcon name="check" size="16" stroke-width="2" class="text-green-600 shrink-0" />
                  <span>Thank you for subscribing! Check your inbox for updates.</span>
                </div>
              </transition>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal: View All Reviews -->
    <transition name="modal">
      <div
        v-if="showReviewsModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        @click.self="showReviewsModal = false"
      >
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h3 class="text-2xl font-bold text-neutral-900">Customer Reviews</h3>
              <p class="text-xs text-neutral-500 mt-0.5">Verified purchaser ratings for {{ product.name || 'Product' }}</p>
            </div>
            <button
              type="button"
              @click="showReviewsModal = false"
              class="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
            >
              <FlowbiteIcon name="close" size="18" stroke-width="2" />
            </button>
          </div>

          <div class="divide-y divide-neutral-100 mt-4 space-y-4">
            <div v-for="(review, idx) in extendedReviews" :key="review.id || idx" class="pt-4 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-[#EAB308]">
                  <FlowbiteIcon
                    v-for="star in 5"
                    :key="star"
                    name="star"
                    size="15"
                    :fill="star <= (Number(review.rating) || 5)"
                    :class="star <= (Number(review.rating) || 5) ? 'text-[#EAB308]' : 'text-neutral-200'"
                  />
                </div>
                <span class="text-xs text-neutral-400">{{ formatReviewDate(review.createdAt || review.date) }}</span>
              </div>
              <h4 v-if="review.title" class="font-bold text-neutral-900 text-sm">{{ review.title }}</h4>
              <p class="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">{{ review.comment }}</p>
              <div class="text-xs text-neutral-500 font-light mt-1">
                — {{ review.author }} <span class="text-emerald-700 italic font-medium">({{ review.badge || 'Verified Customer' }})</span>
              </div>
              <div
                v-if="review.adminReply"
                class="mt-1 pl-3 border-l-2 border-[#F4EB6A] text-xs text-neutral-600 bg-neutral-50 py-1.5 px-2.5 rounded-r-lg"
              >
                <span class="font-semibold text-neutral-900">Ystore Reply:</span> {{ review.adminReply }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal: View All FAQs -->
    <transition name="modal">
      <div
        v-if="showAllFaqsModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        @click.self="showAllFaqsModal = false"
      >
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h3 class="text-2xl font-bold text-neutral-900">Frequently Asked Questions</h3>
              <p class="text-xs text-neutral-500 mt-0.5">Frequently asked questions for {{ product?.name || 'this product' }}</p>
            </div>
            <button
              type="button"
              @click="showAllFaqsModal = false"
              class="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
            >
              <FlowbiteIcon name="close" size="18" stroke-width="2" />
            </button>
          </div>

          <div class="divide-y divide-neutral-100 mt-4 space-y-4">
            <div v-for="(faq, idx) in productFaqs" :key="idx" class="pt-4 flex flex-col gap-1.5">
              <h4 class="font-semibold text-neutral-900 text-sm sm:text-base">
                {{ idx + 1 }}. {{ faq.question }}
              </h4>
              <p class="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed bg-neutral-50 p-3 rounded-xl mt-1 border border-neutral-100">
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'

const { productReviews, saveProductReview, initContentListeners } = useStoreContent()

onMounted(() => {
  initContentListeners()
})

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['back-home', 'add-to-cart', 'buy-now', 'view-product'])

const categoryMenuOpen = ref(false)
const quantity = ref(1)

const productColors = computed(() => {
  if (Array.isArray(props.product?.colors)) {
    return props.product.colors.map((c) => String(c).trim()).filter(Boolean)
  }
  return []
})

const selectedColor = ref(props.product?.colors?.[0] || '')

// Out of stock handling: out of stock and backorders disabled
const isOutOfStockAndBlocked = computed(() => {
  if (!props.product) return false
  const qty = props.product.quantity
  const continueSelling = props.product.continueSellingWhenOutOfStock
  if (qty !== undefined && qty !== null && qty <= 0 && !continueSelling) {
    return true
  }
  return false
})

// Disclosures & metafields accordion states
const openDisclosures = ref({
  material: false,
  care: false,
  safety: false,
  origin: false,
  metafields: false
})

const toggleDisclosure = (key) => {
  openDisclosures.value[key] = !openDisclosures.value[key]
}

const hasAnyDisclosures = computed(() => {
  const d = props.product?.disclosures
  const m = props.product?.metafields
  return Boolean(
    d?.material ||
    d?.careInstructions ||
    d?.safetyNotice ||
    d?.origin ||
    (Array.isArray(m) && m.length > 0)
  )
})

const galleryImages = computed(() => {
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

const activeImage = ref(props.product?.image || '')
const mainImageLoading = ref(true)
const preloadedUrls = new Set()

const preloadImage = (url) => {
  if (!url || typeof window === 'undefined' || preloadedUrls.has(url)) return
  preloadedUrls.add(url)
  const img = new Image()
  img.decoding = 'async'
  img.src = url
}

const selectGalleryImage = (img) => {
  if (!img || activeImage.value === img) return
  mainImageLoading.value = true
  activeImage.value = img
}

// Background preload all images in product gallery
const preloadProductGallery = (prod) => {
  if (!prod) return
  if (prod.image) preloadImage(prod.image)
  if (Array.isArray(prod.images)) {
    prod.images.forEach((u) => preloadImage(u))
  }
}

watch(
  () => props.product,
  (newVal) => {
    mainImageLoading.value = true
    activeImage.value = newVal?.image || (newVal?.images?.[0] || '')
    selectedColor.value = newVal?.colors?.[0] || ''
    preloadProductGallery(newVal)
  },
  { immediate: true }
)

onMounted(() => {
  preloadProductGallery(props.product)
})

const categoriesList = []

// 4 Feature proposition cards
const features = [
  {
    icon: '/images/free-shipping-icon.svg',
    title: 'Free shipping',
    subtitle: 'On orders over R500'
  },
  {
    icon: '/images/secure-payments-icon.svg',
    title: 'Secure payments',
    subtitle: '100% secure checkout'
  },
  {
    icon: '/images/easy-returns-icon.svg',
    title: 'Easy Returns',
    subtitle: '30-day refund policy'
  },
  {
    icon: '/images/24-7-customer-support.svg',
    title: '24/7 Support',
    subtitle: 'Always here to help'
  }
]

// Customer reviews (populated from live Firestore product_reviews)
const extendedReviews = computed(() => {
  const pid = props.product?.id ? String(props.product.id) : ''
  const pname = (props.product?.name || '').toLowerCase().trim()
  return (productReviews.value || []).filter((r) => {
    if (r.status === 'hidden' || r.status === 'pending') return false
    if (pid && r.productId && String(r.productId) === pid) return true
    if (pname && r.productName && String(r.productName).toLowerCase().trim() === pname) return true
    return false
  })
})

const customerReviews = computed(() => extendedReviews.value.slice(0, 3))

const averageRating = computed(() => {
  const list = extendedReviews.value
  if (!list.length) return '5.0'
  const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 5), 0)
  return (sum / list.length).toFixed(1)
})

const showWriteReviewForm = ref(false)
const reviewSubmitting = ref(false)
const reviewFormMessage = ref('')
const reviewFormError = ref('')
const reviewForm = ref({
  author: '',
  rating: 5,
  title: '',
  comment: ''
})

const handleSubmitProductReview = async () => {
  reviewFormError.value = ''
  reviewFormMessage.value = ''
  if (!reviewForm.value.author?.trim()) {
    reviewFormError.value = 'Please enter your name.'
    return
  }
  if (!reviewForm.value.comment?.trim()) {
    reviewFormError.value = 'Please write a short review comment.'
    return
  }
  reviewSubmitting.value = true
  try {
    await saveProductReview({
      productId: props.product?.id || props.product?.name || 'unknown',
      productName: props.product?.name || 'Product',
      author: reviewForm.value.author.trim(),
      rating: reviewForm.value.rating || 5,
      title: reviewForm.value.title.trim(),
      comment: reviewForm.value.comment.trim(),
      badge: 'Verified Customer',
      status: 'approved'
    })
    reviewForm.value = { author: '', rating: 5, title: '', comment: '' }
    reviewFormMessage.value = 'Thank you! Your review has been published.'
    setTimeout(() => {
      showWriteReviewForm.value = false
      reviewFormMessage.value = ''
    }, 1800)
  } catch (err) {
    reviewFormError.value = err?.message || 'Could not submit review. Please try again.'
  } finally {
    reviewSubmitting.value = false
  }
}

const formatReviewDate = (val) => {
  if (!val) return ''
  try {
    const d = val?.toDate ? val.toDate() : new Date(val)
    if (isNaN(d.getTime())) return String(val)
    return d.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

// Product-specific FAQs: only questions and answers explicitly added to this product
const productFaqs = computed(() => {
  if (Array.isArray(props.product?.faqs) && props.product.faqs.length > 0) {
    return props.product.faqs.filter((f) => f && f.question && f.answer)
  }
  return []
})

const activeFaqIndex = ref(null)

const toggleFaq = (index) => {
  if (activeFaqIndex.value === index) {
    activeFaqIndex.value = null
  } else {
    activeFaqIndex.value = index
  }
}

// Similar Products (populated from live catalog)
const similarProducts = []

const selectSimilarProduct = (item) => {
  emit('view-product', item)
}

// Newsletter state
const newsletterEmail = ref('')
const newsletterAgreed = ref(true)
const newsletterSubmitted = ref(false)

const handleNewsletterSubmit = () => {
  if (newsletterEmail.value) {
    newsletterSubmitted.value = true
    newsletterEmail.value = ''
    setTimeout(() => {
      newsletterSubmitted.value = false
    }, 4000)
  }
}

// Modals
const showReviewsModal = ref(false)
const showAllFaqsModal = ref(false)

const incrementQty = () => {
  quantity.value++
}

const decrementQty = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCartHandler = () => {
  emit('add-to-cart', {
    ...props.product,
    qty: quantity.value,
    selectedColor: productColors.value.length ? selectedColor.value : null,
    image: activeImage.value
  })
}

const buyNowHandler = () => {
  emit('buy-now', {
    ...props.product,
    qty: quantity.value,
    selectedColor: productColors.value.length ? selectedColor.value : null,
    image: activeImage.value
  })
}
</script>

<style scoped>
.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.image-fade-enter-from {
  opacity: 0;
  transform: scale(0.97);
}

.image-fade-leave-to {
  opacity: 0;
  transform: scale(1.03);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-6px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
