<template>
  <div class="min-h-screen bg-black text-white font-poppins flex flex-col lg:flex-row p-2.5 sm:p-4 gap-2 sm:gap-4 select-none">
    <!-- ==========================================
         LEFT SIDEBAR (Matches Mockup Design)
         ========================================== -->
    <aside
      :class="[
        'flex flex-col justify-between shrink-0 transition-all duration-300 py-4 px-3',
        isSidebarCollapsed ? 'w-full lg:w-20' : 'w-full lg:w-[230px]'
      ]"
    >
      <!-- Top Section: Logo + Toggle + Search + Nav -->
      <div>
        <!-- Top Brand Row: Ystore Logo & Collapse Icon -->
        <div class="flex items-center justify-between px-2 mb-6">
          <button
            v-if="!isSidebarCollapsed"
            type="button"
            @click="$emit('view-storefront')"
            class="flex items-center group cursor-pointer"
            title="Return to Storefront"
          >
            <img
              :src="useAsset('/images/ystore-logo.svg')"
              alt="Ystore"
              class="h-9 w-auto object-contain"
            />
          </button>
          <button
            v-else
            type="button"
            @click="isSidebarCollapsed = false"
            class="mx-auto"
            title="Expand Sidebar"
          >
            <img
              :src="useAsset('/images/ystore-logo.svg')"
              alt="Ystore"
              class="h-7 w-7 object-contain object-left"
            />
          </button>

          <button
            type="button"
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            class="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            <FlowbiteIcon name="sidebar-toggle" size="20" stroke-width="1.3" />
          </button>
        </div>

        <!-- White Pill Search Input -->
        <div v-if="!isSidebarCollapsed" class="px-1 mb-8">
          <div class="bg-white rounded-full px-4 py-2.5 flex items-center gap-2.5 shadow-sm">
            <FlowbiteIcon name="search" size="18" stroke-width="1.8" class="text-neutral-700 shrink-0" />
            <input
              v-model="globalSearch"
              type="text"
              placeholder="Search"
              class="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder-neutral-600 focus:outline-none font-normal"
            />
            <button
              v-if="globalSearch"
              type="button"
              @click="globalSearch = ''"
              class="text-neutral-400 hover:text-neutral-800"
            >
              <FlowbiteIcon name="close" size="14" stroke-width="2" />
            </button>
          </div>
        </div>

        <!-- Navigation Menu Items -->
        <nav class="space-y-1.5 px-1">
          <template v-for="item in navItems" :key="item.id">
            <button
              type="button"
              @click="handleNavClick(item.id)"
              :class="[
                'w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer group',
                (activeSection === item.id || (item.id === 'media' && (activeSection === 'banners' || activeSection === 'story-categories' || activeSection === 'category-banners' || activeSection === 'collections-banners')) || (item.id === 'products' && (activeSection === 'categories' || activeSection === 'collections' || activeSection === 'purchase-orders' || activeSection === 'banner-categories' || activeSection === 'product-reviews')) || (item.id === 'customers' && activeSection === 'customer-segments') || (item.id === 'theme' && (activeSection === 'guarantee-stats' || activeSection === 'theme-badges' || activeSection === 'heading-slides' || activeSection === 'theme-reviews' || activeSection === 'theme-subscription')) || (item.id === 'marketing' && activeSection === 'marketing-mailers'))
                  ? 'text-white font-medium bg-neutral-900/80'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40 font-normal',
                isSidebarCollapsed ? 'justify-center px-2' : ''
              ]"
              :title="item.label"
            >
              <img
                v-if="item.icon && item.icon.includes('.svg')"
                :src="useAsset(item.icon)"
                :alt="item.label"
                :class="[
                  'w-5 h-5 object-contain shrink-0 transition-opacity',
                  (activeSection === item.id || (item.id === 'media' && (activeSection === 'banners' || activeSection === 'story-categories' || activeSection === 'category-banners' || activeSection === 'collections-banners')) || (item.id === 'products' && (activeSection === 'categories' || activeSection === 'collections' || activeSection === 'purchase-orders' || activeSection === 'banner-categories' || activeSection === 'product-reviews')) || (item.id === 'customers' && activeSection === 'customer-segments') || (item.id === 'theme' && (activeSection === 'guarantee-stats' || activeSection === 'theme-badges' || activeSection === 'heading-slides' || activeSection === 'theme-reviews' || activeSection === 'theme-subscription')) || (item.id === 'marketing' && activeSection === 'marketing-mailers')) ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                ]"
              />
              <FlowbiteIcon
                v-else
                :name="item.icon"
                size="20"
                stroke-width="1.5"
                :class="[
                  'shrink-0 transition-colors',
                  (activeSection === item.id || (item.id === 'media' && (activeSection === 'banners' || activeSection === 'story-categories' || activeSection === 'category-banners' || activeSection === 'collections-banners')) || (item.id === 'products' && (activeSection === 'categories' || activeSection === 'collections' || activeSection === 'purchase-orders' || activeSection === 'banner-categories' || activeSection === 'product-reviews')) || (item.id === 'customers' && activeSection === 'customer-segments') || (item.id === 'theme' && (activeSection === 'guarantee-stats' || activeSection === 'theme-badges' || activeSection === 'heading-slides' || activeSection === 'theme-reviews' || activeSection === 'theme-subscription')) || (item.id === 'marketing' && activeSection === 'marketing-mailers')) ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
                ]"
              />
              <span v-if="!isSidebarCollapsed" class="truncate">{{ item.label }}</span>
              <span
                v-if="!isSidebarCollapsed && item.count !== undefined && item.count > 0"
                class="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300"
              >
                {{ item.count }}
              </span>
              <!-- Submenu arrow indicators with smooth rotation -->
              <FlowbiteIcon
                v-if="item.id === 'products' && !isSidebarCollapsed"
                name="chevron-down"
                size="14"
                class="ml-auto text-neutral-500 group-hover:text-neutral-300 shrink-0 transition-transform duration-300"
                :class="{ 'rotate-180 !text-white': productsSubmenuOpen }"
              />
              <FlowbiteIcon
                v-else-if="item.id === 'media' && !isSidebarCollapsed"
                name="chevron-down"
                size="14"
                class="ml-auto text-neutral-500 group-hover:text-neutral-300 shrink-0 transition-transform duration-300"
                :class="{ 'rotate-180 !text-white': mediaSubmenuOpen }"
              />
              <FlowbiteIcon
                v-else-if="item.id === 'customers' && !isSidebarCollapsed"
                name="chevron-down"
                size="14"
                class="ml-auto text-neutral-500 group-hover:text-neutral-300 shrink-0 transition-transform duration-300"
                :class="{ 'rotate-180 !text-white': customersSubmenuOpen }"
              />
              <FlowbiteIcon
                v-else-if="item.id === 'theme' && !isSidebarCollapsed"
                name="chevron-down"
                size="14"
                class="ml-auto text-neutral-500 group-hover:text-neutral-300 shrink-0 transition-transform duration-300"
                :class="{ 'rotate-180 !text-white': themeSubmenuOpen }"
              />
              <FlowbiteIcon
                v-else-if="item.id === 'marketing' && !isSidebarCollapsed"
                name="chevron-down"
                size="14"
                class="ml-auto text-neutral-500 group-hover:text-neutral-300 shrink-0 transition-transform duration-300"
                :class="{ 'rotate-180 !text-white': marketingSubmenuOpen }"
              />
            </button>

            <!-- Products Sub-menu: "All Products", "Add Product +", "Categories", "Collections" -->
            <div
              v-if="item.id === 'products' && !isSidebarCollapsed"
              class="submenu-accordion"
              :class="{ 'is-open': productsSubmenuOpen }"
            >
              <div class="submenu-accordion-inner pl-6 pr-1 space-y-1 py-1">
              <!-- Sub-menu Item: All Products -->
              <button
                type="button"
                @click="activeSection = 'products'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'products' && !showProductForm
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="All Products List"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'products' && !showProductForm ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">All Products</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'products' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ products.length }}
                </span>
              </button>

              <!-- Sub-menu Item: Add Product + -->
              <button
                type="button"
                @click="activeSection = 'products'; openProductModal()"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'products' && showProductForm
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-300 hover:text-[#F4EB6A] hover:bg-neutral-900/50 font-normal'
                ]"
                title="Create a New Product"
              >
                <span class="flex items-center gap-2 truncate">
                  <FlowbiteIcon name="plus" size="13" class="text-[#F4EB6A] shrink-0" stroke-width="2" />
                  <span class="truncate font-medium text-white group-hover:text-[#F4EB6A]">Add Product +</span>
                </span>
                <span class="text-[9px] uppercase tracking-wider text-[#F4EB6A] font-bold bg-[#F4EB6A]/10 px-1.5 py-0.5 rounded">
                  New
                </span>
              </button>

              <!-- Sub-menu Item: Categories -->
              <button
                type="button"
                @click="activeSection = 'categories'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'categories'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Manage Store Categories"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'categories' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Categories</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'categories' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ categories.length }}
                </span>
              </button>

              <!-- Sub-menu Item: Collections -->
              <button
                type="button"
                @click="activeSection = 'collections'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'collections'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Manage Curated Collections"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'collections' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Collections</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'collections' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ collections.length }}
                </span>
              </button>

              <!-- Sub-menu Item: Banner Categories (Below Hero Banner) -->
              <button
                type="button"
                @click="activeSection = 'banner-categories'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'banner-categories'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Manage 7 Categories Below Hero Banner"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'banner-categories' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Banner Categories</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'banner-categories' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ (bannerCategories && bannerCategories.length) || 0 }}
                </span>
              </button>

              <!-- Sub-menu Item: Purchase Orders -->
              <button
                type="button"
                @click="activeSection = 'purchase-orders'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'purchase-orders'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Manage Supplier & Inventory Purchase Orders"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'purchase-orders' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Purchase Orders</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'purchase-orders' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ purchaseOrders.length }}
                </span>
              </button>

              <!-- Sub-menu Item: Customer Reviews (Product Reviews) -->
              <button
                type="button"
                @click="activeSection = 'product-reviews'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'product-reviews'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Manage Product Customer Reviews"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'product-reviews' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Customer Reviews</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'product-reviews' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ (productReviews && productReviews.length) || 0 }}
                </span>
              </button>
              </div>
            </div>

            <!-- Media files Sub-menu: "Stories Above Banner", "Home Banner", "Category Banner", "Collections Banner", & "Storage Files" -->
            <div
              v-if="item.id === 'media' && !isSidebarCollapsed"
              class="submenu-accordion"
              :class="{ 'is-open': mediaSubmenuOpen }"
            >
              <div class="submenu-accordion-inner pl-6 pr-1 space-y-1 py-1">
              <!-- Sub-menu Item: Stories Above Banner -->
              <button
                type="button"
                @click="activeSection = 'story-categories'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'story-categories'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Manage Story Circles Above Banner"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'story-categories' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Stories Above Banner</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'story-categories' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ (productStories && productStories.length) || 0 }}
                </span>
              </button>

              <!-- Sub-menu Item: Home Banner -->
              <button
                type="button"
                @click="activeSection = 'banners'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'banners'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Home Banner (Landing Hero Slides & Videos)"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'banners' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Home Banner</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'banners' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ banners.length }}
                </span>
              </button>

              <!-- Sub-menu Item: Category Banner -->
              <button
                type="button"
                @click="activeSection = 'category-banners'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'category-banners'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Manage Category Hero Banners"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'category-banners' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Category Banner</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'category-banners' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ (categoryBanners && categoryBanners.length) || 0 }}
                </span>
              </button>

              <!-- Sub-menu Item: Collections Banner -->
              <button
                type="button"
                @click="activeSection = 'collections-banners'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'collections-banners'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Manage Collection Hero Banners"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'collections-banners' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Collections Banner</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'collections-banners' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ (collectionBanners && collectionBanners.length) || 0 }}
                </span>
              </button>

              <!-- Sub-menu Item: All Storage Files -->
              <button
                type="button"
                @click="activeSection = 'media'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'media'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Storage File Bucket Browser"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'media' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Storage Files</span>
                </span>
                <span class="text-[9px] uppercase tracking-wider text-neutral-500">bucket</span>
              </button>
              </div>
            </div>

            <!-- Customers Sub-menu: "All Customers" & "Segment" -->
            <div
              v-if="item.id === 'customers' && !isSidebarCollapsed"
              class="submenu-accordion"
              :class="{ 'is-open': customersSubmenuOpen }"
            >
              <div class="submenu-accordion-inner pl-6 pr-1 space-y-1 py-1">
              <!-- Sub-menu Item: All Customers -->
              <button
                type="button"
                @click="activeSection = 'customers'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'customers'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="All Registered Customers"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'customers' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">All Customers</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'customers' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ customers.length }}
                </span>
              </button>

              <!-- Sub-menu Item: Segment -->
              <button
                type="button"
                @click="activeSection = 'customer-segments'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'customer-segments'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Customer Segments"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'customer-segments' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Segment</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'customer-segments' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ allComputedSegments.length }}
                </span>
              </button>
              </div>
            </div>

            <!-- Theme Sub-menu: "Guarantee Stats" -->
            <div
              v-if="item.id === 'theme' && !isSidebarCollapsed"
              class="submenu-accordion"
              :class="{ 'is-open': themeSubmenuOpen }"
            >
              <div class="submenu-accordion-inner pl-6 pr-1 space-y-1 py-1">
              <!-- Sub-menu Item: Guarantee Stats -->
              <button
                type="button"
                @click="activeSection = 'guarantee-stats'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'guarantee-stats'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Guarantee Stats & Trust Badges"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'guarantee-stats' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Guarantee Stats</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'guarantee-stats' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ (guaranteeStats && guaranteeStats.length) || 0 }}
                </span>
              </button>

              <!-- Sub-menu Item: Badges & Pills -->
              <button
                type="button"
                @click="activeSection = 'theme-badges'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'theme-badges'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Website Badges & Pills"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'theme-badges' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Badges &amp; Pills</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="themeConfig?.showBadgePills ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ themeConfig?.showBadgePills ? 'ON' : 'OFF' }}
                </span>
              </button>

              <!-- Sub-menu Item: Heading Slides -->
              <button
                type="button"
                @click="activeSection = 'heading-slides'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'heading-slides'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Heading Slides & Rotating Italic Words"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'heading-slides' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Heading Slides</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="headingSlides?.enabled ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ headingSlides?.enabled ? 'Active' : 'OFF' }}
                </span>
              </button>

              <!-- Sub-menu Item: Customer Reviews (Theme + Google Reviews API Prep) -->
              <button
                type="button"
                @click="activeSection = 'theme-reviews'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'theme-reviews'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Store Customer Reviews & Google Reviews API"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'theme-reviews' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Customer Reviews</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'theme-reviews' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ (storeReviews && storeReviews.length) || 0 }}
                </span>
              </button>

              <!-- Sub-menu Item: Subscription -->
              <button
                type="button"
                @click="activeSection = 'theme-subscription'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'theme-subscription'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="Newsletter Subscription Copy & Email Routing"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'theme-subscription' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Subscription</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'theme-subscription' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ (newsletterSubscribers && newsletterSubscribers.length) || 0 }}
                </span>
              </button>
              </div>
            </div>

            <!-- Marketing Sub-menu: "Mailers" -->
            <div
              v-if="item.id === 'marketing' && !isSidebarCollapsed"
              class="submenu-accordion"
              :class="{ 'is-open': marketingSubmenuOpen }"
            >
              <div class="submenu-accordion-inner pl-6 pr-1 space-y-1 py-1">
              <!-- Sub-menu Item: Mailers -->
              <button
                type="button"
                @click="activeSection = 'marketing-mailers'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
                  activeSection === 'marketing-mailers'
                    ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                ]"
                title="This will handle marketing to our customer base"
              >
                <span class="flex items-center gap-2 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    :class="activeSection === 'marketing-mailers' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
                  ></span>
                  <span class="truncate">Mailers</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="activeSection === 'marketing-mailers' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ (mailerCampaigns && mailerCampaigns.length) || 0 }}
                </span>
              </button>
              </div>
            </div>
          </template>
        </nav>
      </div>

      <!-- Bottom Section: Settings & Storefront Return -->
      <div class="pt-6 space-y-1.5 px-1">
        <!-- Settings Main Trigger Button -->
        <button
          type="button"
          @click="handleSettingsNavClick"
          :class="[
            'w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer group',
            (activeSection === 'settings' || activeSection === 'settings-payments' || activeSection === 'settings-users' || activeSection === 'settings-seo')
              ? 'text-white font-medium bg-neutral-900/80'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40 font-normal',
            isSidebarCollapsed ? 'justify-center px-2' : ''
          ]"
          title="Settings"
        >
          <img
            :src="useAsset('/images/settings-icon.svg')"
            alt="Settings"
            :class="[
              'w-5 h-5 object-contain shrink-0 transition-opacity',
              (activeSection === 'settings' || activeSection === 'settings-payments' || activeSection === 'settings-users' || activeSection === 'settings-seo') ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
            ]"
          />
          <span v-if="!isSidebarCollapsed" class="truncate">Settings</span>
          <!-- Submenu arrow indicator with smooth rotation -->
          <FlowbiteIcon
            v-if="!isSidebarCollapsed"
            name="chevron-down"
            size="14"
            class="ml-auto text-neutral-500 group-hover:text-neutral-300 shrink-0 transition-transform duration-300"
            :class="{ 'rotate-180 !text-white': settingsSubmenuOpen }"
          />
        </button>

        <!-- Settings Sub-menu: "General", "Payments" & "Manage Users" (USER REQUIREMENT) -->
        <div
          v-if="!isSidebarCollapsed"
          class="submenu-accordion"
          :class="{ 'is-open': settingsSubmenuOpen }"
        >
          <div class="submenu-accordion-inner pl-6 pr-1 space-y-1 py-1">
          <!-- Sub-menu Item: General -->
          <button
            type="button"
            @click="activeSection = 'settings'"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
              activeSection === 'settings'
                ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
            ]"
            title="General Store & Operational Settings"
          >
            <span class="flex items-center gap-2 truncate">
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                :class="activeSection === 'settings' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
              ></span>
              <span class="truncate">General</span>
            </span>
            <span class="text-[9px] uppercase tracking-wider text-neutral-500">Store</span>
          </button>

          <!-- Sub-menu Item: Payments -->
          <button
            type="button"
            @click="activeSection = 'settings-payments'"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
              activeSection === 'settings-payments'
                ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
            ]"
            title="Payment Gateways, Providers & Currencies"
          >
            <span class="flex items-center gap-2 truncate">
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                :class="activeSection === 'settings-payments' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
              ></span>
              <span class="truncate">Payments</span>
            </span>
            <span
              class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
              :class="activeSection === 'settings-payments' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
            >
              {{ activePaymentGatewaysCount }} Active
            </span>
          </button>

          <!-- Sub-menu Item: Manage Users (USER REQUIREMENT) -->
          <button
            type="button"
            @click="activeSection = 'settings-users'"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
              activeSection === 'settings-users'
                ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
            ]"
            title="Manage Admin & Staff Users, Roles and Permissions"
          >
            <span class="flex items-center gap-2 truncate">
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                :class="activeSection === 'settings-users' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
              ></span>
              <span class="truncate">Manage Users</span>
            </span>
            <span
              class="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
              :class="activeSection === 'settings-users' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-800 text-neutral-400'"
            >
              {{ adminUsers?.length || 0 }} Users
            </span>
          </button>

          <!-- Sub-menu Item: Tracking -->
          <button
            type="button"
            @click="activeSection = 'settings-seo'"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group',
              activeSection === 'settings-seo'
                ? 'text-[#F4EB6A] font-semibold bg-neutral-900'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
            ]"
            title="Manage Google GTM Tag, Meta Pixel & Analytics"
          >
            <span class="flex items-center gap-2 truncate">
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                :class="activeSection === 'settings-seo' ? 'bg-[#F4EB6A]' : 'bg-neutral-600 group-hover:bg-neutral-400'"
              ></span>
              <span class="truncate">Tracking</span>
            </span>
            <span
              class="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
              :class="activeSection === 'settings-seo' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A] font-bold' : 'bg-neutral-800 text-neutral-400'"
            >
              Tags
            </span>
          </button>
          </div>
        </div>

        <button
          type="button"
          @click="$emit('view-storefront')"
          :class="[
            'w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-xs text-neutral-500 hover:text-[#F4EB6A] hover:bg-neutral-900/40 transition-all cursor-pointer',
            isSidebarCollapsed ? 'justify-center px-2' : ''
          ]"
          title="View Storefront"
        >
          <FlowbiteIcon name="home" size="18" stroke-width="1.5" class="shrink-0" />
          <span v-if="!isSidebarCollapsed">View Storefront</span>
        </button>
      </div>
    </aside>

    <!-- ==========================================
         MAIN WHITE ROUNDED CANVAS (Matches Mockup)
         ========================================== -->
    <main class="flex-1 bg-white text-neutral-900 rounded-[28px] sm:rounded-[34px] p-6 sm:p-10 lg:p-12 flex flex-col min-h-[calc(100vh-2rem)] overflow-y-auto shadow-2xl">
      <!-- Top Canvas Header: Welcome Back + Live Visitors + Profile Avatar -->
      <header class="grid grid-cols-1 md:grid-cols-3 items-start md:items-center gap-4 pb-8">
        <!-- Left: Welcome back Laban -->
        <div>
          <h1 class="text-2xl sm:text-[32px] font-bold tracking-tight text-neutral-900 leading-tight">
            Welcome back <span class="text-[#F5C542]">{{ adminFirstName }}</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1 font-normal">
            Here's your overview of your shop
          </p>
        </div>

        <!-- Center: Realtime Active Sessions -->
        <div
          class="flex flex-col md:items-center justify-center relative group"
          :title="activeSessionsSummary"
        >
          <span class="text-xs sm:text-sm font-medium text-neutral-800">Realtime Active Sessions</span>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-xs sm:text-sm text-neutral-700 font-semibold font-mono">{{ liveVisitorsCount }}</span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#84CC16] inline-block shadow-[0_0_8px_#84CC16] animate-pulse"></span>
            <span v-if="activeSessionsSummary" class="hidden xl:inline text-[11px] text-neutral-400">
              ({{ activeSessionsSummary }})
            </span>
          </div>
        </div>

        <!-- Right: Circular Admin Avatar & Quick Dropdown -->
        <div class="flex items-center md:justify-end gap-3 relative">
          <!-- Toggle Clean Canvas vs Management Controls -->
          <button
            v-if="activeSection === 'dashboard'"
            type="button"
            @click="showDashboardWidgets = !showDashboardWidgets"
            class="px-3.5 py-1.5 rounded-full text-xs font-medium border border-neutral-200 hover:border-neutral-900 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            {{ showDashboardWidgets ? 'Clean Canvas' : 'Show Widgets' }}
          </button>

          <button
            type="button"
            @click="profileDropdownOpen = !profileDropdownOpen"
            class="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-neutral-100 hover:border-[#F5C542] transition-all shadow-sm shrink-0 cursor-pointer focus:outline-none"
            title="Admin Profile"
          >
            <img
              :src="adminAvatarUrl"
              :alt="currentUser?.displayName || 'Laban Le Fleur'"
              class="w-full h-full object-cover"
            />
          </button>

          <!-- Profile Quick Menu -->
          <div
            v-if="profileDropdownOpen"
            class="absolute right-0 top-16 w-60 bg-white rounded-2xl shadow-xl border border-neutral-200 p-3 z-30 text-left"
          >
            <div class="px-2.5 py-2 border-b border-neutral-100">
              <p class="text-xs font-bold text-neutral-900 truncate">{{ currentUser?.displayName || 'Laban Le Fleur' }}</p>
              <p class="text-[11px] text-neutral-500 truncate">{{ currentUser?.email }}</p>
              <span class="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FAF7BA] text-[#423C27]">
                Super Admin
              </span>
            </div>
            <div class="pt-2 space-y-1">
              <button
                type="button"
                @click="activeSection = 'settings'; profileDropdownOpen = false; settingsSubmenuOpen = true"
                class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
              >
                <FlowbiteIcon name="settings" size="15" />
                <span>Admin Settings</span>
              </button>
              <button
                type="button"
                @click="activeSection = 'settings-payments'; profileDropdownOpen = false; settingsSubmenuOpen = true"
                class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
              >
                <FlowbiteIcon name="credit-card" size="15" />
                <span>Payment Gateways</span>
              </button>
              <button
                type="button"
                @click="activeSection = 'settings-users'; profileDropdownOpen = false; settingsSubmenuOpen = true"
                class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
              >
                <FlowbiteIcon name="users" size="15" />
                <span>Manage Users</span>
              </button>
              <button
                type="button"
                @click="$emit('view-storefront'); profileDropdownOpen = false"
                class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
              >
                <FlowbiteIcon name="home" size="15" />
                <span>View Live Storefront</span>
              </button>
              <button
                type="button"
                @click="handleSignOut"
                class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
              >
                <FlowbiteIcon name="logout" size="15" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Status Toast inside Dashboard -->
      <div
        v-if="statusBanner.message"
        :class="[
          'mb-6 px-4 py-3 rounded-2xl text-xs font-medium flex items-center justify-between border',
          statusBanner.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-[#FEFEEB] border-[#F4EB6A] text-neutral-900'
        ]"
      >
        <div class="flex items-center gap-2">
          <FlowbiteIcon :name="statusBanner.type === 'error' ? 'close' : 'check'" size="16" stroke-width="2" />
          <span>{{ statusBanner.message }}</span>
        </div>
        <button type="button" @click="statusBanner.message = ''" class="text-neutral-400 hover:text-neutral-900">
          <FlowbiteIcon name="close" size="14" />
        </button>
      </div>

      <!-- ==========================================
           TAB 1: DASHBOARD OVERVIEW
           ========================================== -->
      <div v-if="activeSection === 'dashboard'" class="flex-1 flex flex-col">
        <div v-if="showDashboardWidgets" class="space-y-8">
          <!-- Key Store Metrics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div
              v-for="stat in overviewStats"
              :key="stat.label"
              @click="activeSection = stat.target"
              class="p-5 rounded-2xl border border-neutral-200/80 hover:border-[#F5C542] bg-neutral-50/50 hover:bg-white transition-all cursor-pointer group shadow-2xs"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-medium text-neutral-500">{{ stat.label }}</span>
                <div class="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center group-hover:scale-105 transition-transform p-2">
                  <img
                    v-if="stat.icon && stat.icon.includes('.svg')"
                    :src="stat.icon"
                    :alt="stat.label"
                    class="w-5 h-5 object-contain"
                  />
                  <FlowbiteIcon
                    v-else
                    :name="stat.icon"
                    size="18"
                    stroke-width="1.6"
                    class="text-[#F4EB6A]"
                  />
                </div>
              </div>
              <div class="text-2xl font-bold text-neutral-900">{{ stat.value }}</div>
              <div class="text-[11px] text-neutral-400 mt-1 flex items-center justify-between">
                <span>{{ stat.subtext }}</span>
                <span class="text-neutral-900 font-medium group-hover:underline">Manage &rarr;</span>
              </div>
            </div>
          </div>

          <!-- Quick Content Actions & Categories Manager -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Quick Actions -->
            <div class="p-6 rounded-2xl border border-neutral-200/80 bg-white space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-base font-bold text-neutral-900">Quick Store Actions</h2>
                <span class="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                  ystore-db
                </span>
              </div>
              <p class="text-xs text-neutral-500 leading-relaxed">
                Publish new products, upload images to <code class="text-neutral-800 font-semibold">ystore-db.firebasestorage.app</code>, or manage active promotions.
              </p>

              <div class="grid grid-cols-1 gap-2.5 pt-1">
                <button
                  type="button"
                  @click="activeSection = 'products'; openProductModal()"
                  class="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2.5">
                    <img :src="useAsset('/images/products-icon.svg')" alt="Products" class="w-4 h-4 object-contain brightness-125" />
                    <span>Add New Product</span>
                  </span>
                  <FlowbiteIcon name="chevron-right" size="14" />
                </button>

                <button
                  type="button"
                  @click="activeSection = 'banners'; openBannerModal()"
                  class="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:border-neutral-900 text-neutral-800 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2.5">
                    <FlowbiteIcon name="image" size="15" class="text-neutral-700" />
                    <span>Manage Home Banners</span>
                  </span>
                  <FlowbiteIcon name="chevron-right" size="14" />
                </button>

                <button
                  type="button"
                  @click="activeSection = 'media'"
                  class="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:border-neutral-900 text-neutral-800 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2.5">
                    <img :src="useAsset('/images/media-files-icon.svg')" alt="Media files" class="w-4 h-4 object-contain invert opacity-75" />
                    <span>Upload Media Files</span>
                  </span>
                  <FlowbiteIcon name="chevron-right" size="14" />
                </button>

                <button
                  type="button"
                  @click="activeSection = 'discounts'"
                  class="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:border-neutral-900 text-neutral-800 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2.5">
                    <img :src="useAsset('/images/discount-icon.svg')" alt="Discounts" class="w-4 h-4 object-contain invert opacity-75" />
                    <span>Create Discount / Coupon</span>
                  </span>
                  <FlowbiteIcon name="chevron-right" size="14" />
                </button>

                <button
                  type="button"
                  @click="activeSection = 'blogs'; openBlogModal()"
                  class="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:border-neutral-900 text-neutral-800 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-2.5">
                    <img :src="useAsset('/images/blogs-icon-1.svg')" alt="Blogs" class="w-4 h-4 object-contain invert opacity-75" />
                    <span>Publish Blog Post</span>
                  </span>
                  <FlowbiteIcon name="chevron-right" size="14" />
                </button>
              </div>
            </div>

            <!-- Store Categories Manager -->
            <div class="lg:col-span-2 p-6 rounded-2xl border border-neutral-200/80 bg-white flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h2 class="text-base font-bold text-neutral-900">Store Categories ({{ categories.length }})</h2>
                    <p class="text-xs text-neutral-500">Categories dynamically populate the Storefront &amp; Category filters.</p>
                  </div>
                </div>

                <!-- Add Category Inline Form -->
                <form @submit.prevent="handleSaveCategory" class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <input
                    v-model="categoryForm.name"
                    type="text"
                    required
                    placeholder="Category name (e.g. Action Figures)"
                    class="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs focus:outline-none focus:border-neutral-900"
                  />
                  <input
                    v-model="categoryForm.description"
                    type="text"
                    placeholder="Short description..."
                    class="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs focus:outline-none focus:border-neutral-900"
                  />
                  <div class="flex items-center gap-2">
                    <label class="flex-1 px-3 py-2 rounded-lg border border-dashed border-neutral-300 hover:border-neutral-900 bg-white text-[11px] text-neutral-600 truncate cursor-pointer text-center">
                      <input type="file" accept="image/*" class="hidden" @change="handleCategoryImageUpload" />
                      {{ categoryForm.image ? 'Image Ready ✓' : 'Upload Cover' }}
                    </label>
                    <button
                      type="submit"
                      :disabled="savingCategory"
                      class="px-4 py-2 rounded-lg bg-[#F5C542] hover:bg-[#eab308] text-neutral-950 font-semibold text-xs shrink-0 cursor-pointer"
                    >
                      {{ savingCategory ? '...' : 'Add' }}
                    </button>
                  </div>
                </form>

                <!-- Categories List -->
                <div v-if="categories.length === 0" class="py-8 text-center text-xs text-neutral-400">
                  No categories added yet. Add your first category above.
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto">
                  <div
                    v-for="cat in categories"
                    :key="cat.id"
                    class="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="w-9 h-9 rounded-lg bg-neutral-200 overflow-hidden shrink-0">
                        <img v-if="cat.image" :src="cat.image" :alt="cat.name" class="w-full h-full object-cover" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-semibold text-neutral-900 truncate">{{ cat.name }}</p>
                        <p class="text-[10px] text-neutral-400 truncate">{{ cat.description || 'Store category' }}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="handleDeleteCategory(cat.id)"
                      class="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete category"
                    >
                      <FlowbiteIcon name="trash" size="14" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- ==========================================
           TAB 2: ORDERS MANAGEMENT
           ========================================== -->
      <div v-else-if="activeSection === 'orders'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <img :src="useAsset('/images/orders-icon.svg')" alt="Orders" class="w-5 h-5 object-contain" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-neutral-900">Orders ({{ filteredOrders.length }})</h2>
              <p class="text-xs text-neutral-500">Track customer purchases, fulfillment status, and order totals.</p>
            </div>
          </div>
        </div>

        <div v-if="filteredOrders.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <div class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 text-neutral-400 p-3">
            <img :src="useAsset('/images/orders-icon.svg')" alt="Orders" class="w-6 h-6 object-contain" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900">No orders placed yet</h3>
          <p class="text-xs text-neutral-500 mt-1">Customer orders completed at checkout will automatically appear here.</p>
        </div>

        <div v-else class="overflow-x-auto rounded-2xl border border-neutral-200">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                <th class="py-3.5 px-4">Order ID</th>
                <th class="py-3.5 px-4">Customer</th>
                <th class="py-3.5 px-4">Items</th>
                <th class="py-3.5 px-4">Total</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-neutral-50/80">
                <td class="py-3.5 px-4 font-mono font-semibold text-neutral-900">#{{ order.id.slice(0, 8) }}</td>
                <td class="py-3.5 px-4">
                  <div class="font-medium text-neutral-900">{{ order.customerName || 'Shopper' }}</div>
                  <div class="text-[11px] text-neutral-400">{{ order.customerEmail || 'Guest' }}</div>
                </td>
                <td class="py-3.5 px-4 text-neutral-600">{{ order.items?.length || 0 }} item(s)</td>
                <td class="py-3.5 px-4 font-bold text-neutral-900">R{{ order.total || 0 }}</td>
                <td class="py-3.5 px-4">
                  <select
                    :value="order.status || 'Processing'"
                    @change="handleOrderStatusChange(order.id, $event.target.value)"
                    class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF7BA] text-[#423C27] border border-[#F4EB6A] focus:outline-none cursor-pointer"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td class="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    @click="deleteOrder(order.id)"
                    class="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Order"
                  >
                    <FlowbiteIcon name="trash" size="15" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- ==========================================
           TAB 3: PRODUCTS MANAGEMENT
           ========================================== -->
      <div v-else-if="activeSection === 'products'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <img :src="useAsset('/images/products-icon.svg')" alt="Products" class="w-5 h-5 object-contain" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-neutral-900">Products</h2>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FAF7BA] text-neutral-900">
                  {{ products.length }}
                </span>
                <span class="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                  {{ publishedProductsCount }} Published
                </span>
                <span v-if="draftProductsCount > 0" class="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800">
                  {{ draftProductsCount }} Drafts
                </span>
              </div>
              <p class="text-xs text-neutral-500 mt-0.5">Create, stage drafts, and publish products synced live with your storefront.</p>
            </div>
          </div>
          <button
            type="button"
            @click="openProductModal()"
            class="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <FlowbiteIcon name="plus" size="15" stroke-width="2" />
            <span>Add Product</span>
          </button>
        </div>

        <!-- Publication Status Filter Tabs -->
        <div class="flex items-center gap-2 border-b border-neutral-200/80 pb-3">
          <button
            type="button"
            @click="productStatusFilter = 'all'"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              productStatusFilter === 'all'
                ? 'bg-neutral-900 text-[#F4EB6A] shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            ]"
          >
            <span>All Products</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-full font-bold" :class="productStatusFilter === 'all' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-200 text-neutral-700'">
              {{ products.length }}
            </span>
          </button>

          <button
            type="button"
            @click="productStatusFilter = 'published'"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              productStatusFilter === 'published'
                ? 'bg-neutral-900 text-[#F4EB6A] shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Published</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-full font-bold" :class="productStatusFilter === 'published' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-200 text-neutral-700'">
              {{ publishedProductsCount }}
            </span>
          </button>

          <button
            type="button"
            @click="productStatusFilter = 'draft'"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              productStatusFilter === 'draft'
                ? 'bg-neutral-900 text-[#F4EB6A] shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Drafts</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-full font-bold" :class="productStatusFilter === 'draft' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-200 text-neutral-700'">
              {{ draftProductsCount }}
            </span>
          </button>
        </div>

        <!-- Product Modal / Form Drawer -->
        <div v-if="showProductForm" class="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-6 shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div>
              <h3 class="text-base font-bold text-neutral-900">
                {{ editingProductId ? 'Edit Product' : 'Create New Product' }}
              </h3>
              <p class="text-xs text-neutral-500">Configure catalog specifications, pricing, inventory, shipping, tags, disclosures &amp; SEO.</p>
            </div>
            <button type="button" @click="showProductForm = false" class="text-neutral-400 hover:text-neutral-900 cursor-pointer p-1">
              <FlowbiteIcon name="close" size="18" />
            </button>
          </div>

          <form @submit.prevent="handleSaveProduct(productForm.status)" class="space-y-6">
            <!-- 1. Publication Status Selector -->
            <div class="p-4 rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <span class="text-xs font-bold text-neutral-900 block">Publication Status</span>
                <span class="text-[11px] text-neutral-500">Draft items are stored securely in ystore-db but hidden from shoppers until published.</span>
              </div>
              <div class="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
                <button
                  type="button"
                  @click="productForm.status = 'published'"
                  :class="[
                    'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                    productForm.status !== 'draft'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="productForm.status !== 'draft' ? 'bg-white' : 'bg-emerald-500'"></span>
                  <span>Published (Live)</span>
                </button>
                <button
                  type="button"
                  @click="productForm.status = 'draft'"
                  :class="[
                    'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                    productForm.status === 'draft'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="productForm.status === 'draft' ? 'bg-white' : 'bg-amber-500'"></span>
                  <span>Draft (Hidden)</span>
                </button>
              </div>
            </div>

            <!-- 2. Basic Information & Media Card -->
            <div class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
              <div class="flex items-center gap-2 pb-2 border-b border-neutral-100">
                <FlowbiteIcon name="box" size="16" class="text-neutral-700" />
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">Basic Information &amp; Media</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-xs font-medium text-neutral-700 mb-1">Product Title / Name *</label>
                  <input
                    v-model="productForm.name"
                    type="text"
                    required
                    @input="handleProductNameInput"
                    placeholder="e.g. Minimalist Ceramic Planter (24cm)"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-medium focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-1">Category *</label>
                  <input
                    v-model="productForm.category"
                    list="category-options"
                    type="text"
                    required
                    placeholder="Select or type category"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                  />
                  <datalist id="category-options">
                    <option v-for="c in categories" :key="c.id" :value="c.name" />
                  </datalist>
                </div>

                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-1">Primary Display Badge (Optional)</label>
                  <input
                    v-model="productForm.tag"
                    type="text"
                    placeholder="e.g. BEST SELLER, NEW ARRIVAL, HANDCRAFTED"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <!-- Product Media & Gallery Card (Up to 7 Images - USER REQUIREMENT) -->
                <div class="md:col-span-2 p-4.5 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-4 shadow-2xs">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200">
                    <div>
                      <div class="flex items-center gap-2">
                        <FlowbiteIcon name="image" size="16" class="text-neutral-800" />
                        <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Product Gallery &amp; Photos (Up to 7 Images)
                        </h4>
                      </div>
                      <p class="text-[11px] text-neutral-500 mt-0.5">
                        Upload up to 7 photos. Choose which one serves as the Main Product Image on catalog cards and the primary storefront view.
                      </p>
                      <div class="flex flex-wrap items-center gap-2 mt-1.5">
                        <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-800 bg-[#FAF7BA] border border-[#F4EB6A] px-2.5 py-0.5 rounded-full">
                          Recommended size: 800 × 800px
                        </span>
                        <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          Images should be in WebP format (.webp)
                        </span>
                      </div>
                    </div>

                    <!-- Counter Badge & Upload Trigger -->
                    <div class="flex items-center gap-2 shrink-0">
                      <span
                        class="text-[11px] font-bold px-2.5 py-1 rounded-full border font-mono"
                        :class="productForm.images?.length >= 7 ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-neutral-800 border-neutral-300'"
                      >
                        {{ productForm.images?.length || 0 }} / 7 Photos
                      </span>
                      <label
                        v-if="(productForm.images?.length || 0) < 7"
                        class="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-[#F4EB6A] text-xs font-semibold cursor-pointer hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <FlowbiteIcon name="plus" size="13" stroke-width="2.5" />
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          class="hidden"
                          @change="handleProductMultipleImagesUpload"
                          :disabled="isUploading"
                        />
                        <span>{{ isUploading ? `Uploading ${uploadProgress}%...` : '+ Upload Photos' }}</span>
                      </label>
                    </div>
                  </div>

                  <!-- Upload by URL row (Optional fallback) -->
                  <div v-if="(productForm.images?.length || 0) < 7" class="flex items-center gap-2">
                    <input
                      v-model="productImageUrlInput"
                      type="text"
                      @keydown.enter.prevent="addProductImageUrl"
                      placeholder="Or paste an image URL here and click + Add Image ->"
                      class="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="button"
                      @click="addProductImageUrl"
                      class="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 hover:bg-neutral-100 cursor-pointer shrink-0"
                    >
                      + Add Image
                    </button>
                  </div>

                  <!-- Gallery 7-Slot Grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-1">
                    <!-- Uploaded Image Cards -->
                    <div
                      v-for="(img, idx) in (productForm.images || [])"
                      :key="idx"
                      class="group relative aspect-square rounded-xl overflow-hidden border-2 transition-all flex flex-col justify-between bg-white shadow-2xs cursor-pointer"
                      :class="productForm.image === img ? 'border-neutral-900 ring-2 ring-[#F4EB6A]' : 'border-neutral-200 hover:border-neutral-400'"
                      @click="setMainProductImage(img)"
                      :title="productForm.image === img ? 'Current Main Product Image' : 'Click to set as Main Product Image'"
                    >
                      <img :src="img" :alt="`Product photo ${idx + 1}`" class="w-full h-full object-cover" />

                      <!-- Main Badge / Star Overlay -->
                      <div class="absolute top-1.5 left-1.5 z-10" @click.stop>
                        <span
                          v-if="productForm.image === img"
                          class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#F4EB6A] text-neutral-900 shadow-sm border border-neutral-900/10"
                        >
                          <span>★</span>
                          <span>MAIN</span>
                        </span>
                        <button
                          v-else
                          type="button"
                          @click="setMainProductImage(img)"
                          class="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-white/90 hover:bg-neutral-900 text-neutral-800 hover:text-[#F4EB6A] shadow-xs border border-neutral-300 cursor-pointer transition-all opacity-85 group-hover:opacity-100"
                          title="Set as Main Cover Image"
                        >
                          ☆ Set Main
                        </button>
                      </div>

                      <!-- Slot Number Tag -->
                      <span class="absolute bottom-1.5 left-1.5 text-[9px] font-mono font-bold bg-neutral-900/75 text-white px-1.5 py-0.2 rounded">
                        #{{ idx + 1 }}
                      </span>

                      <!-- Hover Action Bar: Left / Right Reorder + Remove -->
                      <div class="absolute inset-x-0 bottom-0 p-1 bg-neutral-900/85 backdrop-blur-xs flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
                        <div class="flex items-center gap-0.5">
                          <button
                            v-if="idx > 0"
                            type="button"
                            @click="moveProductImage(idx, idx - 1)"
                            class="p-1 text-white hover:text-[#F4EB6A] cursor-pointer"
                            title="Move left"
                          >
                            <span class="text-[10px]">◀</span>
                          </button>
                          <button
                            v-if="idx < productForm.images.length - 1"
                            type="button"
                            @click="moveProductImage(idx, idx + 1)"
                            class="p-1 text-white hover:text-[#F4EB6A] cursor-pointer"
                            title="Move right"
                          >
                            <span class="text-[10px]">▶</span>
                          </button>
                        </div>
                        <button
                          type="button"
                          @click="removeProductImage(idx)"
                          class="p-1 text-red-300 hover:text-red-400 cursor-pointer"
                          title="Remove photo"
                        >
                          <FlowbiteIcon name="trash" size="13" />
                        </button>
                      </div>
                    </div>

                    <!-- Empty Placeholder Slots (Up to 7 slots total) -->
                    <label
                      v-for="emptyIdx in (7 - (productForm.images?.length || 0))"
                      :key="'empty-' + emptyIdx"
                      class="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-900 hover:bg-neutral-100/50 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all group"
                      :title="`Click to upload photo for Slot ${(productForm.images?.length || 0) + emptyIdx}`"
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        class="hidden"
                        @change="handleProductMultipleImagesUpload"
                        :disabled="isUploading"
                      />
                      <FlowbiteIcon name="plus" size="16" class="text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                      <span class="text-[9px] font-medium text-neutral-400 group-hover:text-neutral-800 mt-1">
                        Slot {{ (productForm.images?.length || 0) + emptyIdx }}
                      </span>
                    </label>
                  </div>

                  <!-- Active Main Image Callout -->
                  <div v-if="productForm.image" class="p-3 rounded-xl bg-white border border-neutral-200 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-3 truncate">
                      <img :src="productForm.image" alt="Main cover" class="w-10 h-10 rounded-lg object-cover border border-neutral-300 shrink-0" />
                      <div class="truncate">
                        <div class="flex items-center gap-1.5">
                          <span class="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.2 rounded-md">★ Selected Main Product Image</span>
                        </div>
                        <p class="text-[11px] text-neutral-500 truncate mt-0.5 font-mono">{{ productForm.image }}</p>
                      </div>
                    </div>
                    <span class="text-[10px] text-neutral-400 shrink-0 italic">Primary cover for catalog cards and storefront view</span>
                  </div>
                  <div v-else class="text-[11px] text-amber-700 italic flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>No main image selected. Upload photos above or click "☆ Set Main" on any uploaded image.</span>
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs font-medium text-neutral-700 mb-1">
                    Short Description <span class="text-[11px] font-normal text-neutral-400">(Optional — displayed under the product title)</span>
                  </label>
                  <textarea
                    v-model="productForm.shortDescription"
                    rows="2"
                    placeholder="Brief 1-2 sentence summary shown below the product title..."
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                  ></textarea>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs font-medium text-neutral-700 mb-1">Product Description</label>
                  <textarea
                    v-model="productForm.description"
                    rows="3"
                    placeholder="Provide a detailed description of the product, dimensions, tactile feel, and colors..."
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- 3. Pricing & Cost Per Item Card (USER REQUIREMENT) -->
            <div class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
              <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div class="flex items-center gap-2">
                  <FlowbiteIcon name="tag" size="16" class="text-neutral-700" />
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">Pricing &amp; Cost Per Item</h4>
                </div>
                <span class="text-[10px] text-neutral-400 font-medium">Currency: ZAR (R)</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-1">Selling Price (ZAR) *</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-xs text-neutral-500 font-semibold">R</span>
                    <input
                      v-model="productForm.price"
                      type="number"
                      step="0.01"
                      required
                      placeholder="299.00"
                      class="w-full pl-7 pr-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <p class="text-[10px] text-neutral-400 mt-1">Price displayed to shoppers</p>
                </div>

                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-1">Compare-at Price (ZAR)</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-xs text-neutral-400 font-semibold">R</span>
                    <input
                      v-model="productForm.originalPrice"
                      type="number"
                      step="0.01"
                      placeholder="399.00"
                      class="w-full pl-7 pr-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-700 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <p class="text-[10px] text-neutral-400 mt-1">Strikethrough original price for specials</p>
                </div>

                <div>
                  <label class="block text-xs font-bold text-neutral-900 mb-1 flex items-center justify-between">
                    <span>Cost Per Item (ZAR)</span>
                    <span class="text-[9px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">Admin Only</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-xs text-neutral-500 font-semibold">R</span>
                    <input
                      v-model="productForm.costPerItem"
                      type="number"
                      step="0.01"
                      placeholder="95.00"
                      class="w-full pl-7 pr-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50/20 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <p class="text-[10px] text-neutral-500 mt-1">Unit manufacturing or wholesale cost. Shoppers never see this.</p>
                </div>
              </div>

              <!-- Reactive Profit & Margin KPI Card -->
              <div v-if="calculatedProfit !== null" class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div class="flex items-center gap-6">
                  <div>
                    <span class="text-[10px] text-neutral-500 uppercase tracking-wider block">Gross Profit</span>
                    <span class="text-sm font-bold text-emerald-700 font-mono">R{{ calculatedProfit }}</span>
                  </div>
                  <div class="h-6 w-px bg-neutral-200"></div>
                  <div>
                    <span class="text-[10px] text-neutral-500 uppercase tracking-wider block">Profit Margin</span>
                    <span class="text-sm font-bold text-emerald-700 font-mono">{{ calculatedMargin }}%</span>
                  </div>
                </div>
                <span class="text-[11px] text-neutral-400 italic">Auto-calculated</span>
              </div>
            </div>

            <!-- 4. Inventory, SKU & Out-of-Stock Policy Card (USER REQUIREMENT) -->
            <div class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
              <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div class="flex items-center gap-2">
                  <FlowbiteIcon name="grid" size="16" class="text-neutral-700" />
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">Inventory, SKU &amp; Stock Policy</h4>
                </div>
                <span class="text-[10px] text-neutral-400 font-medium">Shelf Tracking</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-xs font-bold text-neutral-900">SKU (Stock Keeping Unit)</label>
                    <button
                      type="button"
                      @click="generateSku"
                      class="text-[10px] text-neutral-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>⚡ Auto-Generate SKU</span>
                    </button>
                  </div>
                  <input
                    v-model="productForm.sku"
                    type="text"
                    placeholder="e.g. YB-DRG-824"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-mono font-semibold uppercase text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                  <p class="text-[10px] text-neutral-400 mt-1">Unique internal warehouse identifier</p>
                </div>

                <div>
                  <label class="block text-xs font-bold text-neutral-900 mb-1">Product Quantity (Available Stock)</label>
                  <input
                    v-model.number="productForm.quantity"
                    type="number"
                    min="0"
                    placeholder="15"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                  <p class="text-[10px] text-neutral-400 mt-1">Number of physical units ready in inventory</p>
                </div>
              </div>

              <!-- Radio Toggle: Sell when it's out of stock (USER REQUIREMENT) -->
              <div class="pt-2 border-t border-neutral-100">
                <span class="block text-xs font-bold text-neutral-900 mb-2">Out-of-Stock Purchase Policy</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    :class="[
                      'p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5',
                      !productForm.continueSellingWhenOutOfStock
                        ? 'border-neutral-900 bg-neutral-50/70 shadow-2xs'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    ]"
                  >
                    <input
                      type="radio"
                      name="outOfStockPolicy"
                      :value="false"
                      v-model="productForm.continueSellingWhenOutOfStock"
                      class="mt-0.5 accent-neutral-900"
                    />
                    <div>
                      <span class="text-xs font-bold text-neutral-900 block">Stop selling when out of stock</span>
                      <span class="text-[10px] text-neutral-500 leading-tight block mt-0.5">
                        Item shows "Out of Stock" on storefront when quantity reaches 0. Customer cannot purchase.
                      </span>
                    </div>
                  </label>

                  <label
                    :class="[
                      'p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5',
                      productForm.continueSellingWhenOutOfStock
                        ? 'border-neutral-900 bg-neutral-50/70 shadow-2xs'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    ]"
                  >
                    <input
                      type="radio"
                      name="outOfStockPolicy"
                      :value="true"
                      v-model="productForm.continueSellingWhenOutOfStock"
                      class="mt-0.5 accent-neutral-900"
                    />
                    <div>
                      <span class="text-xs font-bold text-neutral-900 block">Continue selling when out of stock</span>
                      <span class="text-[10px] text-neutral-500 leading-tight block mt-0.5">
                        Backorders enabled (ideal for made-to-order or incoming stock). Customers can still purchase.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- 5. Shipping, Weight, Packed Dimensions & Package Type (USER REQUIREMENT) -->
            <div class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
              <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div class="flex items-center gap-2">
                  <FlowbiteIcon name="truck" size="16" class="text-neutral-700" />
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">Shipping, Packed Dimensions &amp; Package</h4>
                </div>
                <label class="flex items-center gap-2 text-xs font-semibold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="productForm.requiresShipping"
                    class="rounded accent-neutral-900"
                  />
                  <span>Requires physical shipping</span>
                </label>
              </div>

              <div v-if="productForm.requiresShipping" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <!-- Weight -->
                  <div>
                    <label class="block text-xs font-medium text-neutral-700 mb-1">Product Weight</label>
                    <div class="flex items-center">
                      <input
                        v-model="productForm.weight"
                        type="number"
                        step="0.01"
                        placeholder="0.25"
                        class="w-full px-3.5 py-2 rounded-l-xl border border-r-0 border-neutral-300 bg-white text-xs font-mono focus:outline-none focus:border-neutral-900"
                      />
                      <select
                        v-model="productForm.weightUnit"
                        class="px-2.5 py-2 rounded-r-xl border border-neutral-300 bg-neutral-100 text-xs font-bold text-neutral-700 focus:outline-none"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </select>
                    </div>
                    <p class="text-[10px] text-neutral-400 mt-1">Used for courier shipping rates</p>
                  </div>

                  <!-- Package for one product (USER REQUIREMENT) -->
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-medium text-neutral-700 mb-1">Package for One Product</label>
                    <select
                      v-model="productForm.packageType"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-800 font-medium focus:outline-none focus:border-neutral-900"
                    >
                      <option v-for="pkg in standardPackageTypes" :key="pkg" :value="pkg">
                        {{ pkg }}
                      </option>
                    </select>
                    <p class="text-[10px] text-neutral-400 mt-1">Select outer packaging used to calculate volumetric rates</p>
                  </div>
                </div>

                <!-- Packed dimensions: Length, Width, Height (USER REQUIREMENT) -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-xs font-medium text-neutral-700">Packed Dimensions (cm)</label>
                    <span v-if="calculatedVolume" class="text-[10px] font-mono text-neutral-500 font-semibold">
                      Package Volume: {{ calculatedVolume }} cm³
                    </span>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <div class="relative">
                      <input
                        v-model="productForm.packedDimensions.length"
                        type="number"
                        step="0.1"
                        placeholder="Length"
                        class="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-mono focus:outline-none focus:border-neutral-900"
                      />
                      <span class="absolute right-2.5 top-2 text-[10px] text-neutral-400 font-bold">L (cm)</span>
                    </div>
                    <div class="relative">
                      <input
                        v-model="productForm.packedDimensions.width"
                        type="number"
                        step="0.1"
                        placeholder="Width"
                        class="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-mono focus:outline-none focus:border-neutral-900"
                      />
                      <span class="absolute right-2.5 top-2 text-[10px] text-neutral-400 font-bold">W (cm)</span>
                    </div>
                    <div class="relative">
                      <input
                        v-model="productForm.packedDimensions.height"
                        type="number"
                        step="0.1"
                        placeholder="Height"
                        class="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-mono focus:outline-none focus:border-neutral-900"
                      />
                      <span class="absolute right-2.5 top-2 text-[10px] text-neutral-400 font-bold">H (cm)</span>
                    </div>
                  </div>
                  <p class="text-[10px] text-neutral-400 mt-1">Dimensions of the product package when boxed for dispatch</p>
                </div>
              </div>
            </div>

            <!-- 6. Tags Management Card (USER REQUIREMENT) -->
            <div class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3.5 shadow-2xs">
              <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div class="flex items-center gap-2">
                  <FlowbiteIcon name="tag" size="16" class="text-neutral-700" />
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">Product Tags</h4>
                </div>
                <span class="text-[10px] text-neutral-400">{{ productForm.tags?.length || 0 }} tags assigned</span>
              </div>

              <!-- Tag Input & Add Button -->
              <div class="flex items-center gap-2">
                <input
                  v-model="productForm.tagInput"
                  type="text"
                  @keydown.enter.prevent="addTag()"
                  placeholder="Type a tag and press Enter (e.g. Decor, Handcrafted, Gift)"
                  class="flex-1 px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="button"
                  @click="addTag()"
                  class="px-4 py-2 rounded-xl bg-neutral-900 text-[#F4EB6A] text-xs font-semibold cursor-pointer hover:bg-neutral-800 transition-colors shrink-0"
                >
                  + Add Tag
                </button>
              </div>

              <!-- Active Tag Pills -->
              <div v-if="productForm.tags && productForm.tags.length > 0" class="flex flex-wrap items-center gap-1.5 pt-1">
                <span
                  v-for="(t, tIdx) in productForm.tags"
                  :key="tIdx"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF7BA] text-neutral-900 border border-[#F4EB6A]"
                >
                  <span>{{ t }}</span>
                  <button
                    type="button"
                    @click="removeTag(tIdx)"
                    class="text-neutral-500 hover:text-red-700 cursor-pointer ml-0.5 p-0.5"
                    title="Remove tag"
                  >
                    &times;
                  </button>
                </span>
              </div>

              <!-- Quick Suggested Tags -->
              <div>
                <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">Quick Suggestions:</span>
                <div class="flex flex-wrap items-center gap-1.5">
                  <button
                    v-for="sTag in quickSuggestedTags"
                    :key="sTag"
                    type="button"
                    @click="addTag(sTag)"
                    class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer border border-neutral-200"
                  >
                    + {{ sTag }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 7. Product Meta Fields with Disclosures (USER REQUIREMENT) -->
            <div class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
              <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div class="flex items-center gap-2">
                  <FlowbiteIcon name="file" size="16" class="text-neutral-700" />
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">Product Meta Fields &amp; Disclosures</h4>
                </div>
                <span class="text-[10px] text-neutral-500">Rendered as accordion disclosures on product page</span>
              </div>

              <div class="space-y-3">
                <!-- Disclosure 1: Material & Eco Info -->
                <div class="border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    @click="disclosureOpen.material = !disclosureOpen.material"
                    class="w-full p-3 bg-neutral-50/70 hover:bg-neutral-100 flex items-center justify-between text-left cursor-pointer transition-colors"
                  >
                    <span class="text-xs font-bold text-neutral-900 flex items-center gap-2">
                      <span>🌿</span>
                      <span>Material &amp; Sustainability Disclosure</span>
                    </span>
                    <span class="text-xs text-neutral-500">{{ disclosureOpen.material ? '−' : '+' }}</span>
                  </button>
                  <div v-if="disclosureOpen.material" class="p-3 bg-white border-t border-neutral-200">
                    <textarea
                      v-model="productForm.disclosures.material"
                      rows="2"
                      placeholder="e.g. 100% Non-toxic, high-grade sustainable materials crafted for everyday durability."
                      class="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    ></textarea>
                  </div>
                </div>

                <!-- Disclosure 2: Care & Handling Instructions -->
                <div class="border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    @click="disclosureOpen.care = !disclosureOpen.care"
                    class="w-full p-3 bg-neutral-50/70 hover:bg-neutral-100 flex items-center justify-between text-left cursor-pointer transition-colors"
                  >
                    <span class="text-xs font-bold text-neutral-900 flex items-center gap-2">
                      <span>🧼</span>
                      <span>Care &amp; Handling Instructions</span>
                    </span>
                    <span class="text-xs text-neutral-500">{{ disclosureOpen.care ? '−' : '+' }}</span>
                  </button>
                  <div v-if="disclosureOpen.care" class="p-3 bg-white border-t border-neutral-200">
                    <textarea
                      v-model="productForm.disclosures.careInstructions"
                      rows="2"
                      placeholder="e.g. Wipe clean with a damp cloth. Do not expose to heat above 55°C."
                      class="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    ></textarea>
                  </div>
                </div>

                <!-- Disclosure 3: Safety & Age Warning -->
                <div class="border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    @click="disclosureOpen.safety = !disclosureOpen.safety"
                    class="w-full p-3 bg-neutral-50/70 hover:bg-neutral-100 flex items-center justify-between text-left cursor-pointer transition-colors"
                  >
                    <span class="text-xs font-bold text-neutral-900 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>Safety, Age &amp; Choking Hazard Warning</span>
                    </span>
                    <span class="text-xs text-neutral-500">{{ disclosureOpen.safety ? '−' : '+' }}</span>
                  </button>
                  <div v-if="disclosureOpen.safety" class="p-3 bg-white border-t border-neutral-200">
                    <textarea
                      v-model="productForm.disclosures.safetyNotice"
                      rows="2"
                      placeholder="e.g. Recommended for ages 4+. Keep out of reach of children under 3 if small parts are present."
                      class="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    ></textarea>
                  </div>
                </div>

                <!-- Disclosure 4: Manufacturing & Origin -->
                <div class="border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    @click="disclosureOpen.origin = !disclosureOpen.origin"
                    class="w-full p-3 bg-neutral-50/70 hover:bg-neutral-100 flex items-center justify-between text-left cursor-pointer transition-colors"
                  >
                    <span class="text-xs font-bold text-neutral-900 flex items-center gap-2">
                      <span>🇿🇦</span>
                      <span>Origin &amp; Manufacturing</span>
                    </span>
                    <span class="text-xs text-neutral-500">{{ disclosureOpen.origin ? '−' : '+' }}</span>
                  </button>
                  <div v-if="disclosureOpen.origin" class="p-3 bg-white border-t border-neutral-200">
                    <input
                      v-model="productForm.disclosures.origin"
                      type="text"
                      placeholder="e.g. Designed and crafted with care in Cape Town, South Africa."
                      class="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <!-- Custom Meta Fields Repeater -->
                <div class="pt-2">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-neutral-900">Custom Meta Fields</span>
                    <button
                      type="button"
                      @click="addMetafield"
                      class="text-[11px] font-semibold text-neutral-900 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>+ Add Custom Field</span>
                    </button>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(meta, mIdx) in productForm.metafields"
                      :key="mIdx"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="meta.key"
                        type="text"
                        placeholder="Field name (e.g. Material Finish)"
                        class="w-1/3 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                      />
                      <input
                        v-model="meta.value"
                        type="text"
                        placeholder="Value (e.g. Matte Satin Glaze)"
                        class="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                      />
                      <button
                        type="button"
                        @click="removeMetafield(mIdx)"
                        class="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg cursor-pointer"
                        title="Remove field"
                      >
                        <FlowbiteIcon name="trash" size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 7B. Product Color Options (Optional) -->
            <div class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
              <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div class="flex items-center gap-2">
                  <FlowbiteIcon name="tag" size="16" class="text-neutral-700" />
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">Color Options</h4>
                </div>
                <span class="text-[10px] text-neutral-500">Only displayed on storefront if colors are added</span>
              </div>
              <div class="flex items-center gap-2">
                <input
                  v-model="colorInput"
                  type="text"
                  placeholder="e.g. Sage Green, Ruby Red, Matte Black"
                  @keydown.enter.prevent="addProductColor"
                  class="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="button"
                  @click="addProductColor"
                  class="btn-primary !py-1.5 !px-3 !text-xs cursor-pointer"
                >
                  + Add Color
                </button>
              </div>
              <div v-if="productForm.colors && productForm.colors.length" class="flex flex-wrap gap-2 pt-1">
                <span
                  v-for="(clr, cIdx) in productForm.colors"
                  :key="cIdx"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-medium text-neutral-800"
                >
                  {{ clr }}
                  <button
                    type="button"
                    @click="removeProductColor(cIdx)"
                    class="text-neutral-400 hover:text-red-600 cursor-pointer ml-1 font-bold"
                    title="Remove color"
                  >
                    &times;
                  </button>
                </span>
              </div>
              <p v-else class="text-[11px] text-neutral-400 italic">No color choices added. Product page will not display a color picker.</p>

              <!-- Colour Variants with Custom Name & Price -->
              <div class="pt-4 border-t border-neutral-100 space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h5 class="text-xs font-bold text-neutral-900">Colour Variants (Custom Name &amp; Price)</h5>
                  <span class="text-[10px] text-neutral-500">Separate custom name &amp; price per colour variant (independent of the product's original price)</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div class="sm:col-span-4">
                    <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Colour</label>
                    <input
                      v-model="colorVariantInput.color"
                      type="text"
                      placeholder="e.g. Sage Green or #4A5D4E"
                      @keydown.enter.prevent="addColorVariant"
                      class="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div class="sm:col-span-4">
                    <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Custom Variant Name</label>
                    <input
                      v-model="colorVariantInput.name"
                      type="text"
                      placeholder="e.g. Sage Green – Deluxe"
                      @keydown.enter.prevent="addColorVariant"
                      class="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Price (R)</label>
                    <input
                      v-model="colorVariantInput.price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="499"
                      @keydown.enter.prevent="addColorVariant"
                      class="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <button
                      type="button"
                      @click="addColorVariant"
                      class="w-full btn-primary !py-1.5 !px-3 !text-xs cursor-pointer"
                    >
                      + Add Variant
                    </button>
                  </div>
                </div>

                <div v-if="productForm.colorVariants && productForm.colorVariants.length" class="space-y-2 pt-1">
                  <div
                    v-for="(variant, vIdx) in productForm.colorVariants"
                    :key="vIdx"
                    class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-neutral-50 border border-neutral-200"
                  >
                    <div class="sm:col-span-4">
                      <input
                        v-model="variant.color"
                        type="text"
                        placeholder="Colour"
                        class="w-full px-2.5 py-1 rounded-lg border border-neutral-200 bg-white text-xs focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div class="sm:col-span-4">
                      <input
                        v-model="variant.name"
                        type="text"
                        placeholder="Custom Name"
                        class="w-full px-2.5 py-1 rounded-lg border border-neutral-200 bg-white text-xs font-medium focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div class="sm:col-span-3 flex items-center gap-1.5">
                      <span class="text-xs font-semibold text-neutral-500">R</span>
                      <input
                        v-model="variant.price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Price"
                        class="w-full px-2.5 py-1 rounded-lg border border-neutral-200 bg-white text-xs font-semibold focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div class="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        @click="removeColorVariant(vIdx)"
                        class="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer font-bold"
                        title="Remove colour variant"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
                <p v-else class="text-[11px] text-neutral-400 italic">No colour variants with custom names/prices added yet.</p>
              </div>
            </div>

            <!-- 7C. Product FAQs (Questions & Answers) -->
            <div class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
              <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div class="flex items-center gap-2">
                  <FlowbiteIcon name="support" size="16" class="text-neutral-700" />
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">Product FAQs</h4>
                </div>
                <button
                  type="button"
                  @click="addProductFaq"
                  class="text-[11px] font-semibold text-neutral-900 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>+ Add FAQ</span>
                </button>
              </div>
              <p class="text-[11px] text-neutral-500">Only questions added here will be displayed on this product's page.</p>

              <div v-if="productForm.faqs && productForm.faqs.length" class="space-y-3">
                <div
                  v-for="(faq, fIdx) in productForm.faqs"
                  :key="fIdx"
                  class="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 relative"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-semibold text-neutral-700">FAQ #{{ fIdx + 1 }}</span>
                    <button
                      type="button"
                      @click="removeProductFaq(fIdx)"
                      class="p-1 text-neutral-400 hover:text-red-600 rounded cursor-pointer"
                      title="Remove FAQ"
                    >
                      <FlowbiteIcon name="trash" size="14" />
                    </button>
                  </div>
                  <input
                    v-model="faq.question"
                    type="text"
                    placeholder="Question (e.g. Is this dishwasher safe?)"
                    class="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 bg-white"
                  />
                  <textarea
                    v-model="faq.answer"
                    rows="2"
                    placeholder="Answer"
                    class="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 bg-white"
                  ></textarea>
                </div>
              </div>
              <p v-else class="text-[11px] text-neutral-400 italic">No FAQs added yet for this product. The FAQ column will stay hidden on the product page.</p>
            </div>

            <!-- 8. Search Engine Listing (SEO) Card (USER REQUIREMENT) -->
            <div class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
              <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div class="flex items-center gap-2">
                  <FlowbiteIcon name="search" size="16" class="text-neutral-700" />
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">Search Engine Listing (Google SEO Preview)</h4>
                </div>
                <button
                  type="button"
                  @click="generateSlug"
                  class="text-[10px] text-neutral-900 font-bold hover:underline cursor-pointer"
                >
                  ⚡ Auto-fill SEO from title
                </button>
              </div>

              <!-- Google SERP Snippet Preview Mockup -->
              <div class="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200 space-y-1">
                <div class="flex items-center gap-2 text-[11px] text-neutral-600 font-mono">
                  <div class="w-4 h-4 rounded-full bg-neutral-900 text-[#F4EB6A] flex items-center justify-center text-[9px] font-bold">Y</div>
                  <span>https://yberry.co.za &rsaquo; products &rsaquo; {{ productForm.seo.slug || 'product-url-slug' }}</span>
                </div>
                <h5 class="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                  {{ productForm.seo.title || productForm.name || 'Product Title' }} | Yellow Berry Store
                </h5>
                <p class="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                  {{ productForm.seo.description || productForm.description || 'Provide a compelling meta description to improve click-through rates on Google search results.' }}
                </p>
              </div>

              <!-- SEO Input Fields -->
              <div class="space-y-3">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-xs font-medium text-neutral-700">Page Title (SEO Title)</label>
                    <span class="text-[10px]" :class="(productForm.seo.title || '').length > 70 ? 'text-red-600 font-bold' : 'text-neutral-400'">
                      {{ (productForm.seo.title || '').length }} / 70 characters
                    </span>
                  </div>
                  <input
                    v-model="productForm.seo.title"
                    type="text"
                    :placeholder="productForm.name || 'Artisan Ceramic Vase | Yellow Berry Store'"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-xs font-medium text-neutral-700">Meta Description</label>
                    <span class="text-[10px]" :class="(productForm.seo.description || '').length > 160 ? 'text-red-600 font-bold' : 'text-neutral-400'">
                      {{ (productForm.seo.description || '').length }} / 160 characters
                    </span>
                  </div>
                  <textarea
                    v-model="productForm.seo.description"
                    rows="2"
                    :placeholder="productForm.description || 'Discover handcrafted lifestyle goods, home decor, and custom essentials crafted in Cape Town. Free shipping over R500.'"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                  ></textarea>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-xs font-medium text-neutral-700">URL Handle / Slug</label>
                    <button
                      type="button"
                      @click="generateSlug"
                      class="text-[10px] text-neutral-600 hover:text-neutral-900 hover:underline cursor-pointer"
                    >
                      Format from name
                    </button>
                  </div>
                  <div class="flex items-center">
                    <span class="px-3 py-2 rounded-l-xl border border-r-0 border-neutral-300 bg-neutral-100 text-xs text-neutral-500 font-mono">
                      /products/
                    </span>
                    <input
                      v-model="productForm.seo.slug"
                      type="text"
                      placeholder="artisan-ceramic-vase"
                      class="w-full px-3.5 py-2 rounded-r-xl border border-neutral-300 bg-white text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 9. Placement Checkboxes -->
            <div class="p-4 rounded-xl bg-white border border-neutral-200 flex flex-wrap items-center gap-5 shadow-2xs">
              <label class="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer font-medium">
                <input type="checkbox" v-model="productForm.inStock" class="rounded accent-neutral-900" />
                <span>In Stock</span>
              </label>
              <label class="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer font-medium">
                <input type="checkbox" v-model="productForm.isFeatured" class="rounded accent-neutral-900" />
                <span>Featured Product</span>
              </label>
              <label class="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer font-medium">
                <input type="checkbox" v-model="productForm.isNewArrival" class="rounded accent-neutral-900" />
                <span>New Arrival</span>
              </label>
              <label class="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer font-medium">
                <input type="checkbox" v-model="productForm.isBestSeller" class="rounded accent-neutral-900" />
                <span>Best Seller</span>
              </label>
              <label class="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer font-medium">
                <input type="checkbox" v-model="productForm.isSpecial" class="rounded accent-neutral-900" />
                <span>On Special / Flash Deal</span>
              </label>
            </div>

            <!-- 10. Drawer Footer & Actions -->
            <div class="flex items-center justify-between gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                @click="showProductForm = false"
                class="px-5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  :disabled="savingProduct"
                  @click="handleSaveProduct('draft')"
                  class="px-5 py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-900 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 cursor-pointer transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  :disabled="savingProduct"
                  @click.prevent="handleSaveProduct('published')"
                  class="px-6 py-2.5 rounded-xl bg-neutral-900 text-[#F4EB6A] text-xs font-semibold hover:bg-neutral-800 cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <FlowbiteIcon v-if="savingProduct" name="clock" size="14" class="animate-spin" />
                  <span>{{ savingProduct ? 'Saving to Database...' : (editingProductId ? 'Update & Publish' : 'Publish Product') }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Products Empty State -->
        <div v-if="filteredProductsList.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <div class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 text-neutral-400 p-3">
            <img :src="useAsset('/images/products-icon.svg')" alt="Products" class="w-6 h-6 object-contain" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900">No products in your catalog</h3>
          <p class="text-xs text-neutral-500 mt-1 mb-4">Click "Add Product" to publish your first item to ystore-db.</p>
          <button
            type="button"
            @click="openProductModal()"
            class="px-4 py-2 rounded-full bg-[#F5C542] text-neutral-950 text-xs font-semibold cursor-pointer"
          >
            + Add First Product
          </button>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="prod in filteredProductsList"
            :key="prod.id"
            class="rounded-2xl border border-neutral-200 p-3.5 bg-white hover:border-[#F5C542] transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <div class="aspect-square rounded-xl bg-neutral-100 overflow-hidden mb-3 relative">
                <img
                  v-if="prod.image"
                  :src="prod.image"
                  :alt="prod.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                  No image
                </div>
                <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900/80 text-[#F4EB6A]">
                  {{ prod.category }}
                </span>
                <span
                  :class="[
                    'absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 shadow-xs',
                    getProductStatus(prod).class
                  ]"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="prod.status === 'draft' ? 'bg-amber-500' : 'bg-emerald-500'"
                  ></span>
                  <span>{{ getProductStatus(prod).text }}</span>
                </span>
                <span
                  v-if="prod.images && prod.images.length > 1"
                  class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-neutral-900/80 text-[#F4EB6A] font-mono flex items-center gap-1 shadow-xs"
                  :title="`${prod.images.length} photos in gallery`"
                >
                  <span>📷</span>
                  <span>{{ prod.images.length }}</span>
                </span>
              </div>
              <h4 class="text-sm font-bold text-neutral-900 truncate">{{ prod.name }}</h4>
              <div class="flex items-baseline gap-2 mt-1">
                <span class="text-sm font-semibold text-neutral-900">R{{ prod.price }}</span>
                <span v-if="prod.originalPrice" class="text-xs text-neutral-400 line-through">R{{ prod.originalPrice }}</span>
                <span v-if="prod.costPerItem" class="text-[10px] text-neutral-400 font-medium ml-auto">Cost: R{{ prod.costPerItem }}</span>
              </div>

              <!-- SKU & Stock Pill -->
              <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                <span v-if="prod.sku" class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200" title="SKU">
                  {{ prod.sku }}
                </span>
                <span
                  v-if="prod.quantity !== undefined && prod.quantity !== null"
                  :class="[
                    'text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 border',
                    prod.quantity > 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : prod.continueSellingWhenOutOfStock
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                  ]"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="prod.quantity > 0 ? 'bg-emerald-500' : prod.continueSellingWhenOutOfStock ? 'bg-amber-500' : 'bg-red-500'"
                  ></span>
                  <span v-if="prod.quantity > 0">{{ prod.quantity }} in stock</span>
                  <span v-else-if="prod.continueSellingWhenOutOfStock">Backorders on</span>
                  <span v-else>Out of stock</span>
                </span>
              </div>

              <!-- Weight, Package & Dimensions info -->
              <div
                v-if="prod.weight || (prod.packedDimensions && (prod.packedDimensions.length || prod.packedDimensions.width || prod.packedDimensions.height))"
                class="text-[11px] text-neutral-500 mt-1.5 flex items-center gap-2 flex-wrap"
              >
                <span v-if="prod.weight" class="font-medium">⚖️ {{ prod.weight }}{{ prod.weightUnit || 'kg' }}</span>
                <span v-if="prod.packedDimensions && (prod.packedDimensions.length || prod.packedDimensions.width || prod.packedDimensions.height)" class="text-neutral-400 text-[10px]">
                  📦 {{ prod.packedDimensions.length || 0 }}×{{ prod.packedDimensions.width || 0 }}×{{ prod.packedDimensions.height || 0 }}cm
                </span>
              </div>

              <!-- Tags Chips -->
              <div v-if="prod.tags && prod.tags.length" class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="t in prod.tags.slice(0, 3)"
                  :key="t"
                  class="text-[9px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600"
                >
                  #{{ t }}
                </span>
                <span v-if="prod.tags.length > 3" class="text-[9px] text-neutral-400 font-medium">
                  +{{ prod.tags.length - 3 }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100">
              <button
                type="button"
                @click="toggleProductStatus(prod)"
                :class="[
                  'text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer',
                  prod.status === 'draft'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                ]"
                :title="prod.status === 'draft' ? 'Publish product to live storefront' : 'Move product to draft status'"
              >
                {{ prod.status === 'draft' ? 'Publish Live' : 'Move to Draft' }}
              </button>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="openProductModal(prod)"
                  class="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer"
                  title="Edit"
                >
                  <FlowbiteIcon name="edit" size="15" />
                </button>
                <button
                  type="button"
                  @click="handleDeleteProduct(prod.id)"
                  class="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Delete"
                >
                  <FlowbiteIcon name="trash" size="15" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TAB 3B: CATEGORIES MANAGEMENT
           ========================================== -->
      <div v-else-if="activeSection === 'categories'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <FlowbiteIcon name="folder" size="20" class="text-[#F4EB6A]" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-neutral-900">Store Categories</h2>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FAF7BA] text-neutral-900">
                  {{ categories.length }}
                </span>
              </div>
              <p class="text-xs text-neutral-500 mt-0.5">
                Organize your catalog with categories displayed in storefront navigation, badges, and filters.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              @click="openCategoryModal()"
              class="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <FlowbiteIcon name="plus" size="15" stroke-width="2" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        <!-- Add / Edit Category Form -->
        <div v-if="showCategoryForm" class="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-4 shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h3 class="text-sm font-bold text-neutral-900">
              {{ editingCategoryId ? 'Edit Category' : 'Create New Category' }}
            </h3>
            <button type="button" @click="showCategoryForm = false" class="text-neutral-400 hover:text-neutral-900 cursor-pointer">
              <FlowbiteIcon name="close" size="18" />
            </button>
          </div>

          <form @submit.prevent="handleSaveCategory" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-neutral-700 mb-1">Category Name *</label>
              <input
                v-model="categoryForm.name"
                type="text"
                required
                placeholder="e.g. Lifestyle, Home Decor, Wooden Toys"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900 font-medium"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-neutral-700 mb-1">Cover Image</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="categoryForm.image"
                  type="text"
                  placeholder="Image URL or upload ->"
                  class="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                />
                <label class="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    :disabled="isUploading"
                    @change="handleCategoryImageUpload"
                  />
                  <FlowbiteIcon name="upload" size="13" />
                  <span>{{ isUploading ? `${uploadProgress}%` : 'Upload' }}</span>
                </label>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-neutral-700 mb-1">Category Description</label>
              <textarea
                v-model="categoryForm.description"
                rows="2"
                placeholder="Short description displayed on category pages and filter pills..."
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
              ></textarea>
            </div>

            <div class="md:col-span-2 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                @click="showCategoryForm = false"
                class="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="savingCategory"
                class="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold cursor-pointer shadow-sm"
              >
                {{ savingCategory ? 'Saving...' : (editingCategoryId ? 'Update Category' : 'Save Category') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Categories List Grid -->
        <div v-if="categories.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <div class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 text-neutral-400 p-3">
            <FlowbiteIcon name="folder" size="24" class="text-[#F4EB6A]" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900">No categories added yet</h3>
          <p class="text-xs text-neutral-500 mt-1">Add categories to organize your storefront products.</p>
          <button
            type="button"
            @click="openCategoryModal()"
            class="mt-4 px-5 py-2 rounded-full bg-neutral-900 text-[#F4EB6A] text-xs font-semibold cursor-pointer"
          >
            + Create First Category
          </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs hover:border-[#F5C542] transition-all flex flex-col justify-between"
          >
            <div>
              <div class="aspect-video w-full rounded-xl bg-neutral-100 overflow-hidden mb-3 border border-neutral-200 flex items-center justify-center">
                <img
                  v-if="cat.image"
                  :src="cat.image"
                  :alt="cat.name"
                  class="w-full h-full object-cover"
                />
                <FlowbiteIcon v-else name="image" size="28" class="text-neutral-300" />
              </div>

              <div class="flex items-center justify-between gap-2 mb-1">
                <h4 class="text-sm font-bold text-neutral-900 truncate" :title="cat.name">{{ cat.name }}</h4>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 shrink-0">
                  {{ getCategoryProductCount(cat.name) }} items
                </span>
              </div>
              <p class="text-xs text-neutral-500 line-clamp-2">{{ cat.description || 'No description provided' }}</p>
            </div>

            <div class="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100 text-xs">
              <button
                type="button"
                @click="filterProductsByCategory(cat.name)"
                class="text-[11px] font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
              >
                <span>View Products</span>
                <FlowbiteIcon name="arrow-right" size="12" />
              </button>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="openCategoryModal(cat)"
                  class="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer"
                  title="Edit category"
                >
                  <FlowbiteIcon name="edit" size="14" />
                </button>
                <button
                  type="button"
                  @click="handleDeleteCategory(cat.id)"
                  class="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Delete category"
                >
                  <FlowbiteIcon name="trash" size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TAB 3C: COLLECTIONS MANAGEMENT
           ========================================== -->
      <div v-else-if="activeSection === 'collections'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <FlowbiteIcon name="sparkles" size="20" class="text-[#F4EB6A]" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-neutral-900">Product Collections</h2>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FAF7BA] text-neutral-900">
                  {{ collections.length }}
                </span>
              </div>
              <p class="text-xs text-neutral-500 mt-0.5">
                Curate seasonal drops, themed product edits, and spotlight collections.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              @click="openCollectionModal()"
              class="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <FlowbiteIcon name="plus" size="15" stroke-width="2" />
              <span>Create Collection</span>
            </button>
          </div>
        </div>

        <!-- Add / Edit Collection Form Drawer -->
        <div v-if="showCollectionForm" class="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-4 shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h3 class="text-sm font-bold text-neutral-900">
              {{ editingCollectionId ? 'Edit Collection' : 'Create New Curated Collection' }}
            </h3>
            <button type="button" @click="showCollectionForm = false" class="text-neutral-400 hover:text-neutral-900 cursor-pointer">
              <FlowbiteIcon name="close" size="18" />
            </button>
          </div>

          <form @submit.prevent="handleSaveCollection" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Collection Title *</label>
                <input
                  v-model="collectionForm.name"
                  type="text"
                  required
                  placeholder="e.g. Featured Toys, Montessori Sets, Companion Dragons"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900 font-medium"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Collection Cover Banner</label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="collectionForm.image"
                    type="text"
                    placeholder="Cover URL or upload ->"
                    class="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                  />
                  <label class="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      :disabled="isUploading"
                      @change="handleCollectionImageUpload"
                    />
                    <FlowbiteIcon name="upload" size="13" />
                    <span>{{ isUploading ? `${uploadProgress}%` : 'Upload' }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-neutral-700 mb-1">Collection Description</label>
              <textarea
                v-model="collectionForm.description"
                rows="2"
                placeholder="A compelling description for this curated set of products..."
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
              ></textarea>
            </div>

            <!-- Featured Toggle -->
            <div class="p-3.5 rounded-xl bg-white border border-neutral-200 flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-neutral-900 block">Feature on Storefront Landing Page</span>
                <span class="text-[11px] text-neutral-500">Showcases this collection prominently on the store homepage</span>
              </div>
              <input
                type="checkbox"
                v-model="collectionForm.featured"
                class="w-4 h-4 rounded accent-neutral-900 cursor-pointer"
              />
            </div>

            <!-- Product Selection Picker -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-neutral-900">
                  Select Products to Include ({{ collectionForm.productIds.length }} selected)
                </label>
                <div class="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    @click="selectAllProductsForCollection"
                    class="text-[11px] text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span class="text-neutral-300">·</span>
                  <button
                    type="button"
                    @click="collectionForm.productIds = []"
                    class="text-[11px] text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div class="max-h-60 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 divide-y divide-neutral-100">
                <div
                  v-for="prod in products"
                  :key="prod.id"
                  @click="toggleProductInCollection(prod.id)"
                  :class="[
                    'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors',
                    collectionForm.productIds.includes(prod.id) ? 'bg-[#FAF7BA]/40' : 'hover:bg-neutral-50'
                  ]"
                >
                  <div class="flex items-center gap-3 truncate">
                    <input
                      type="checkbox"
                      :checked="collectionForm.productIds.includes(prod.id)"
                      @click.stop="toggleProductInCollection(prod.id)"
                      class="rounded accent-neutral-900 cursor-pointer"
                    />
                    <img
                      :src="prod.image || useAsset('/images/prod-robot.jpg')"
                      :alt="prod.name"
                      class="w-9 h-9 rounded-lg object-cover shrink-0 border border-neutral-200"
                    />
                    <div class="truncate">
                      <p class="text-xs font-medium text-neutral-900 truncate">{{ prod.name }}</p>
                      <p class="text-[10px] text-neutral-400">{{ prod.category }}</p>
                    </div>
                  </div>
                  <span class="text-xs font-bold text-neutral-900 font-mono shrink-0">
                    R {{ Number(prod.price || 0).toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                @click="showCollectionForm = false"
                class="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="savingCollection"
                class="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold cursor-pointer shadow-sm"
              >
                {{ savingCollection ? 'Saving...' : (editingCollectionId ? 'Update Collection' : 'Create Collection') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Collections Cards Grid -->
        <div v-if="collections.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <div class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 text-neutral-400 p-3">
            <FlowbiteIcon name="sparkles" size="24" class="text-[#F4EB6A]" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900">No curated collections created yet</h3>
          <p class="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Group your products into holiday edits, best seller bundles, or themed showcases.
          </p>
          <button
            type="button"
            @click="openCollectionModal()"
            class="mt-4 px-5 py-2 rounded-full bg-neutral-900 text-[#F4EB6A] text-xs font-semibold cursor-pointer"
          >
            + Create First Collection
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="col in collections"
            :key="col.id"
            class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs hover:border-[#F5C542] transition-all flex flex-col justify-between"
          >
            <div>
              <div class="relative aspect-video w-full rounded-xl bg-neutral-100 overflow-hidden mb-3 border border-neutral-200 flex items-center justify-center">
                <img
                  v-if="col.image"
                  :src="col.image"
                  :alt="col.name"
                  class="w-full h-full object-cover"
                />
                <FlowbiteIcon v-else name="image" size="32" class="text-neutral-300" />
                <span
                  v-if="col.featured"
                  class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#F4EB6A] text-neutral-900 text-[10px] font-bold shadow-sm"
                >
                  Featured Collection
                </span>
              </div>

              <div class="flex items-center justify-between gap-2 mb-1">
                <h4 class="text-sm font-bold text-neutral-900 truncate" :title="col.name">{{ col.name }}</h4>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 shrink-0">
                  {{ col.productIds?.length || 0 }} items
                </span>
              </div>
              <p class="text-xs text-neutral-500 line-clamp-2">{{ col.description || 'No description provided' }}</p>

              <!-- Products Mini Thumbnail Stack -->
              <div v-if="col.productIds && col.productIds.length > 0" class="flex items-center gap-1.5 pt-3 mt-2 overflow-x-auto">
                <div
                  v-for="pid in col.productIds.slice(0, 5)"
                  :key="pid"
                  class="w-8 h-8 rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-50"
                  :title="getProductById(pid)?.name"
                >
                  <img
                    v-if="getProductById(pid)?.image"
                    :src="getProductById(pid)?.image"
                    :alt="getProductById(pid)?.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-[9px] text-neutral-400">
                    •
                  </div>
                </div>
                <span v-if="col.productIds.length > 5" class="text-[10px] font-semibold text-neutral-400 pl-1">
                  +{{ col.productIds.length - 5 }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100 text-xs">
              <span class="text-[11px] text-neutral-400 font-mono">/collections/{{ col.slug || col.id }}</span>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="openCollectionModal(col)"
                  class="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer"
                  title="Edit collection"
                >
                  <FlowbiteIcon name="edit" size="14" />
                </button>
                <button
                  type="button"
                  @click="handleDeleteCollection(col.id)"
                  class="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Delete collection"
                >
                  <FlowbiteIcon name="trash" size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TAB 3-PO: PURCHASE ORDERS MANAGEMENT
           ========================================== -->
      <div v-else-if="activeSection === 'purchase-orders'" class="space-y-6">
        <!-- Top Header & Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2 text-[#F4EB6A]">
              <FlowbiteIcon name="cart" size="20" stroke-width="1.8" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-neutral-900">Purchase Orders</h2>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7BA] text-neutral-900 border border-[#F4EB6A]/60">
                  {{ filteredPurchaseOrders.length }} Total
                </span>
              </div>
              <p class="text-xs text-neutral-500">Manage supplier orders, track incoming shipments, and restock products automatically upon receipt.</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openPOModal()"
              class="px-4 py-2 rounded-xl bg-[#F5C542] hover:bg-[#ebd06b] text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <FlowbiteIcon name="plus" size="14" stroke-width="2.5" />
              <span>+ Create Purchase Order</span>
            </button>
          </div>
        </div>

        <!-- 4 KPI Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 shadow-2xs">
            <div class="text-[11px] font-medium text-neutral-500 mb-1">Total Purchase Orders</div>
            <div class="text-2xl font-bold text-neutral-900">{{ poMetrics.total }}</div>
            <div class="text-[10px] text-neutral-400 mt-0.5">All time logged orders</div>
          </div>
          <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 shadow-2xs">
            <div class="text-[11px] font-medium text-amber-800 mb-1 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>In Transit / Ordered</span>
            </div>
            <div class="text-2xl font-bold text-amber-950">{{ poMetrics.ordered }}</div>
            <div class="text-[10px] text-amber-700/80 mt-0.5">Awaiting supplier delivery</div>
          </div>
          <div class="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs">
            <div class="text-[11px] font-medium text-emerald-800 mb-1 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Received &amp; Stocked</span>
            </div>
            <div class="text-2xl font-bold text-emerald-950">{{ poMetrics.received }}</div>
            <div class="text-[10px] text-emerald-700/80 mt-0.5">Inventory restocked</div>
          </div>
          <div class="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 shadow-2xs">
            <div class="text-[11px] font-medium text-neutral-500 mb-1">Committed Spend</div>
            <div class="text-2xl font-bold text-neutral-900">R{{ poMetrics.totalSpend.toFixed(2) }}</div>
            <div class="text-[10px] text-neutral-400 mt-0.5">Supplier supply investments</div>
          </div>
        </div>

        <!-- Create / Edit Purchase Order Form Card -->
        <div v-if="showPOForm" class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-5 shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#F5C542]"></span>
              <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-900">
                {{ editingPOId ? 'Edit Purchase Order' : 'Create New Purchase Order' }}
              </h3>
            </div>
            <button
              type="button"
              @click="showPOForm = false"
              class="text-neutral-400 hover:text-neutral-900 cursor-pointer p-1"
            >
              <FlowbiteIcon name="close" size="14" />
            </button>
          </div>

          <form @submit.prevent="handleSavePO" class="space-y-4">
            <!-- Header Row: PO#, Supplier, Email, Destination, Dates, Status -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">PO Number *</label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="poForm.poNumber"
                    type="text"
                    required
                    placeholder="PO-2026-101"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-mono font-semibold focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    @click="generatePONumber"
                    class="px-2.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-700 shrink-0 cursor-pointer"
                    title="Auto-generate fresh PO number"
                  >
                    ⚡ Gen
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Supplier / Vendor Name *</label>
                <input
                  v-model="poForm.supplierName"
                  type="text"
                  required
                  placeholder="e.g. Premier Supply Distributors SA"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Supplier Contact Email</label>
                <input
                  v-model="poForm.supplierEmail"
                  type="email"
                  placeholder="orders@supplier.co.za"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Stock Destination Location</label>
                <input
                  v-model="poForm.destination"
                  type="text"
                  placeholder="Main Workshop / Pretoria Hub"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Expected Delivery Date</label>
                <input
                  v-model="poForm.expectedDate"
                  type="date"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Order Status</label>
                <select
                  v-model="poForm.status"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900 font-semibold"
                >
                  <option value="ordered">Ordered / In Transit</option>
                  <option value="received">Received (In Stock)</option>
                  <option value="draft">Draft</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <!-- Line Items Section -->
            <div class="pt-2">
              <div class="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                <span class="text-xs font-bold text-neutral-800 uppercase tracking-wider">Purchase Order Items ({{ poForm.items.length }})</span>
                <button
                  type="button"
                  @click="addPOLineItem"
                  class="text-xs font-semibold text-neutral-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <FlowbiteIcon name="plus" size="13" stroke-width="2.5" />
                  <span>+ Add Line Item</span>
                </button>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(item, idx) in poForm.items"
                  :key="idx"
                  class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                >
                  <div class="sm:col-span-4">
                    <label class="block text-[10px] font-semibold text-neutral-600 mb-1">Select Catalog Product (Optional)</label>
                    <select
                      v-model="item.productId"
                      @change="onPOProductSelect(idx)"
                      class="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900 truncate"
                    >
                      <option value="">-- Or enter custom item below --</option>
                      <option v-for="prod in products" :key="prod.id" :value="prod.id">
                        {{ prod.name }} ({{ prod.sku || 'No SKU' }})
                      </option>
                    </select>
                  </div>

                  <div class="sm:col-span-3">
                    <label class="block text-[10px] font-semibold text-neutral-600 mb-1">Item Description / Name *</label>
                    <input
                      v-model="item.name"
                      type="text"
                      required
                      placeholder="e.g. Premium Raw Materials 1kg"
                      class="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div class="sm:col-span-2">
                    <label class="block text-[10px] font-semibold text-neutral-600 mb-1">SKU</label>
                    <input
                      v-model="item.sku"
                      type="text"
                      placeholder="SKU"
                      class="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div class="sm:col-span-1">
                    <label class="block text-[10px] font-semibold text-neutral-600 mb-1">Qty</label>
                    <input
                      v-model.number="item.quantityOrdered"
                      type="number"
                      min="1"
                      required
                      class="w-full px-2 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs text-center font-bold focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div class="sm:col-span-1">
                    <label class="block text-[10px] font-semibold text-neutral-600 mb-1">Unit Cost (R)</label>
                    <input
                      v-model.number="item.unitCost"
                      type="number"
                      min="0"
                      step="0.5"
                      required
                      class="w-full px-2 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs text-right focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div class="sm:col-span-1 flex items-center justify-between sm:justify-end gap-2 pb-0.5">
                    <div class="text-right">
                      <div class="text-[9px] text-neutral-400 sm:hidden">Total</div>
                      <div class="text-xs font-bold text-neutral-900">
                        R{{ ((Number(item.quantityOrdered || 0) * Number(item.unitCost || 0))).toFixed(2) }}
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="removePOLineItem(idx)"
                      :disabled="poForm.items.length <= 1"
                      class="p-1.5 text-neutral-400 hover:text-red-600 disabled:opacity-20 cursor-pointer"
                      title="Remove line item"
                    >
                      <FlowbiteIcon name="trash" size="13" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes & Financial Summary -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Internal Notes &amp; Payment Terms</label>
                <textarea
                  v-model="poForm.notes"
                  rows="3"
                  placeholder="e.g. Paid via EFT 50% deposit, balance upon delivery to workshop."
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900 resize-none"
                ></textarea>
              </div>

              <div class="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
                <div class="flex items-center justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span class="font-semibold text-neutral-900">R{{ poSubtotal.toFixed(2) }}</span>
                </div>
                <div class="flex items-center justify-between text-neutral-600">
                  <span>Shipping &amp; Courier Freight:</span>
                  <div class="flex items-center gap-1 w-28">
                    <span class="text-xs">R</span>
                    <input
                      v-model.number="poForm.shippingCost"
                      type="number"
                      min="0"
                      step="10"
                      class="w-full px-2 py-1 rounded border border-neutral-300 bg-white text-xs text-right font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
                <div class="border-t border-neutral-200 pt-2 flex items-center justify-between text-sm font-bold text-neutral-950">
                  <span>Total Purchase Order:</span>
                  <span class="text-base text-neutral-950">R{{ poTotal.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Form Action Buttons -->
            <div class="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                @click="showPOForm = false"
                class="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 text-xs font-semibold hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="poSaving"
                class="px-5 py-2 rounded-xl bg-[#F5C542] hover:bg-[#ebd06b] text-neutral-950 text-xs font-semibold cursor-pointer shadow-xs active:scale-95"
              >
                {{ poSaving ? 'Saving...' : (editingPOId ? 'Update Purchase Order' : 'Create Purchase Order') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Filter & Search Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              @click="poStatusFilter = 'all'"
              :class="[
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0',
                poStatusFilter === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              ]"
            >
              All ({{ purchaseOrders.length }})
            </button>
            <button
              type="button"
              @click="poStatusFilter = 'ordered'"
              :class="[
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0',
                poStatusFilter === 'ordered'
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              ]"
            >
              In Transit / Ordered ({{ poMetrics.ordered }})
            </button>
            <button
              type="button"
              @click="poStatusFilter = 'received'"
              :class="[
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0',
                poStatusFilter === 'received'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              ]"
            >
              Received ({{ poMetrics.received }})
            </button>
            <button
              type="button"
              @click="poStatusFilter = 'draft'"
              :class="[
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0',
                poStatusFilter === 'draft'
                  ? 'bg-neutral-700 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              ]"
            >
              Drafts ({{ poMetrics.drafts }})
            </button>
          </div>

          <div class="relative w-full sm:w-64">
            <FlowbiteIcon name="search" size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              v-model="poSearchQuery"
              type="text"
              placeholder="Search PO#, supplier, items..."
              class="w-full pl-8 pr-3.5 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        <!-- Purchase Orders Table -->
        <div v-if="filteredPurchaseOrders.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <div class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 p-3 text-[#F4EB6A]">
            <FlowbiteIcon name="cart" size="20" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900">No purchase orders found</h3>
          <p class="text-xs text-neutral-500 mt-1 mb-4">Create your first supplier purchase order to replenish stock and track inventory.</p>
          <button
            type="button"
            @click="openPOModal()"
            class="px-4 py-2 rounded-full bg-[#F5C542] text-neutral-950 text-xs font-semibold cursor-pointer"
          >
            + Create First Purchase Order
          </button>
        </div>

        <div v-else class="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                <th class="py-3.5 px-4">PO Number</th>
                <th class="py-3.5 px-4">Supplier</th>
                <th class="py-3.5 px-4">Items Ordered</th>
                <th class="py-3.5 px-4">Total Amount</th>
                <th class="py-3.5 px-4">Expected Date</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-for="po in filteredPurchaseOrders" :key="po.id" class="hover:bg-neutral-50/80 transition-colors">
                <td class="py-3.5 px-4">
                  <div class="font-mono font-bold text-neutral-900">{{ po.poNumber }}</div>
                  <div class="text-[10px] text-neutral-400 font-mono">
                    {{ po.destination || 'Main Warehouse' }}
                  </div>
                </td>
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-neutral-900">{{ po.supplierName }}</div>
                  <div v-if="po.supplierEmail" class="text-[10px] text-neutral-400 font-mono">{{ po.supplierEmail }}</div>
                </td>
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-neutral-900">
                    {{ po.items?.length || 0 }} line item{{ po.items?.length === 1 ? '' : 's' }}
                  </div>
                  <div class="text-[10px] text-neutral-500 truncate max-w-xs">
                    {{ (po.items || []).map(i => `${i.quantityOrdered}x ${i.name}`).join(', ') }}
                  </div>
                </td>
                <td class="py-3.5 px-4 font-bold text-neutral-900">
                  R{{ (Number(po.total) || 0).toFixed(2) }}
                </td>
                <td class="py-3.5 px-4 text-neutral-600">
                  {{ po.expectedDate || 'Not specified' }}
                </td>
                <td class="py-3.5 px-4">
                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1',
                      po.status === 'received'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : po.status === 'ordered'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : po.status === 'cancelled'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                    ]"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="po.status === 'received' ? 'bg-emerald-500' : po.status === 'ordered' ? 'bg-amber-500 animate-pulse' : 'bg-neutral-500'"
                    ></span>
                    <span class="capitalize">{{ po.status === 'ordered' ? 'In Transit' : (po.status || 'Draft') }}</span>
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      v-if="po.status === 'ordered'"
                      type="button"
                      @click="handleReceivePO(po)"
                      class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      title="Mark as received and add ordered quantities directly to live product stock"
                    >
                      <FlowbiteIcon name="check" size="12" stroke-width="2.5" />
                      <span>Receive Stock</span>
                    </button>
                    <button
                      type="button"
                      @click="openPOModal(po)"
                      class="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer"
                      title="Edit Purchase Order"
                    >
                      <FlowbiteIcon name="edit" size="14" />
                    </button>
                    <button
                      type="button"
                      @click="handleDeletePO(po.id, po.poNumber)"
                      class="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                      title="Delete Purchase Order"
                    >
                      <FlowbiteIcon name="trash" size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==========================================
           TAB 4: CUSTOMERS MANAGEMENT
           ========================================== -->
      <div v-else-if="activeSection === 'customers'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <img :src="useAsset('/images/customer-icon.svg')" alt="Customers" class="w-5 h-5 object-contain" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-neutral-900">Customers ({{ filteredCustomers.length }})</h2>
              <p class="text-xs text-neutral-500">Registered accounts and members in <code class="text-neutral-800 font-semibold">ystore-db</code>.</p>
            </div>
          </div>
        </div>

        <div v-if="filteredCustomers.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <p class="text-xs text-neutral-500">No customer profiles found.</p>
        </div>

        <div v-else class="overflow-x-auto rounded-2xl border border-neutral-200">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                <th class="py-3.5 px-4">User</th>
                <th class="py-3.5 px-4">Email</th>
                <th class="py-3.5 px-4">Role / Tier</th>
                <th class="py-3.5 px-4">Berry Points</th>
                <th class="py-3.5 px-4">UID</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-for="cust in filteredCustomers" :key="cust.id" class="hover:bg-neutral-50/80">
                <td class="py-3.5 px-4 font-semibold text-neutral-900">{{ cust.displayName || 'Ystore Member' }}</td>
                <td class="py-3.5 px-4 text-neutral-600">{{ cust.email || 'Anonymous Guest' }}</td>
                <td class="py-3.5 px-4">
                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                      cust.isAdmin || cust.role === 'super_admin'
                        ? 'bg-[#F5C542] text-neutral-950'
                        : 'bg-neutral-100 text-neutral-700'
                    ]"
                  >
                    {{ cust.isAdmin ? 'Super Admin' : (cust.tier || cust.role || 'Customer') }}
                  </span>
                </td>
                <td class="py-3.5 px-4 font-semibold text-neutral-800">{{ cust.rewardPoints ?? 0 }} pts</td>
                <td class="py-3.5 px-4 font-mono text-[11px] text-neutral-400">{{ (cust.uid || cust.id).slice(0, 12) }}...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==========================================
           TAB 4B: CUSTOMER SEGMENTS
           ========================================== -->
      <div v-else-if="activeSection === 'customer-segments'" class="space-y-6">
        <!-- Top Header & Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <img :src="useAsset('/images/customer-icon.svg')" alt="Segments" class="w-5 h-5 object-contain" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-neutral-900">Customer Segments</h2>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4EB6A]/20 text-neutral-900 border border-[#F4EB6A]/40">
                  {{ allComputedSegments.length }} Groups
                </span>
              </div>
              <p class="text-xs text-neutral-500">Segment shoppers by order history, lifetime spend, and loyalty tier for targeted marketing.</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="copySegmentEmails"
              class="px-3.5 py-2 rounded-xl border border-neutral-300 hover:border-neutral-900 bg-white text-neutral-700 hover:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Copy all emails in the selected segment to clipboard"
            >
              <FlowbiteIcon name="mail" size="14" />
              <span>Copy Segment Emails ({{ customersInActiveSegment.length }})</span>
            </button>
            <button
              type="button"
              @click="openSegmentModal()"
              class="px-4 py-2 rounded-xl bg-[#F5C542] hover:bg-[#ebd06b] text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <FlowbiteIcon name="plus" size="14" stroke-width="2.5" />
              <span>+ Create Segment</span>
            </button>
          </div>
        </div>

        <!-- Create / Edit Custom Segment Form Card -->
        <div v-if="showSegmentModal" class="p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#F5C542]"></span>
              <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-900">
                {{ editingSegmentId ? 'Edit Customer Segment' : 'Create New Customer Segment' }}
              </h3>
            </div>
            <button
              type="button"
              @click="showSegmentModal = false"
              class="text-neutral-400 hover:text-neutral-900 cursor-pointer p-1"
            >
              <FlowbiteIcon name="close" size="14" />
            </button>
          </div>

          <form @submit.prevent="handleSaveSegment" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Segment Name *</label>
                <input
                  v-model="segmentForm.name"
                  type="text"
                  required
                  placeholder="e.g. Cape Town High Spenders"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Color Accent</label>
                <select
                  v-model="segmentForm.color"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                >
                  <option value="yellow">Yellow / Gold Accent</option>
                  <option value="emerald">Emerald Green Accent</option>
                  <option value="blue">Blue Accent</option>
                  <option value="purple">Purple Accent</option>
                  <option value="rose">Rose Red Accent</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-medium text-neutral-700 mb-1">Segment Description / Purpose</label>
                <input
                  v-model="segmentForm.description"
                  type="text"
                  placeholder="e.g. VIP customers eligible for free gift upgrades and exclusive discount codes"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <!-- Qualification Criteria Rules -->
            <div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
              <span class="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">Qualification Rules (AND)</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Min Lifetime Spend (ZAR)</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">R</span>
                    <input
                      v-model.number="segmentForm.minSpend"
                      type="number"
                      min="0"
                      step="50"
                      placeholder="0"
                      class="w-full pl-7 pr-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Min Orders Placed</label>
                  <input
                    v-model.number="segmentForm.minOrders"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    class="w-full px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Min Berry Points</label>
                  <input
                    v-model.number="segmentForm.minPoints"
                    type="number"
                    min="0"
                    step="10"
                    placeholder="0"
                    class="w-full px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                @click="showSegmentModal = false"
                class="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 text-xs font-semibold hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="segmentSaving"
                class="px-5 py-2 rounded-xl bg-[#F5C542] hover:bg-[#ebd06b] text-neutral-950 text-xs font-semibold cursor-pointer shadow-xs"
              >
                {{ segmentSaving ? 'Saving...' : (editingSegmentId ? 'Update Segment' : 'Create Segment') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Segment Selector Cards -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-neutral-700 uppercase tracking-wider">Available Segments</span>
            <span class="text-[11px] text-neutral-400">Click a card to filter customers</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <div
              v-for="seg in allComputedSegments"
              :key="seg.id"
              @click="activeSegmentId = seg.id"
              :class="[
                'p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group relative shadow-2xs select-none',
                activeSegmentId === seg.id
                  ? 'border-[#F5C542] bg-[#FEFEEB]/60 ring-2 ring-[#F5C542]/40 shadow-xs'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
              ]"
            >
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span
                    :class="[
                      'w-2 h-2 rounded-full',
                      seg.color === 'emerald'
                        ? 'bg-emerald-500'
                        : seg.color === 'blue'
                          ? 'bg-blue-500'
                          : seg.color === 'purple'
                            ? 'bg-purple-500'
                            : seg.color === 'rose'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                    ]"
                  ></span>
                  <span class="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-neutral-900 text-white">
                    {{ seg.count }}
                  </span>
                </div>
                <h4 class="text-xs font-bold text-neutral-900 line-clamp-1">{{ seg.name }}</h4>
                <p class="text-[10px] text-neutral-500 mt-0.5 line-clamp-2 leading-tight">{{ seg.description }}</p>
              </div>

              <!-- Bottom Row: Custom segment edit / delete actions -->
              <div v-if="!customerSegmentPresets.some(p => p.id === seg.id)" class="pt-2 mt-2 border-t border-neutral-100 flex items-center justify-end gap-1">
                <button
                  type="button"
                  @click.stop="openSegmentModal(seg)"
                  class="p-1 text-neutral-400 hover:text-neutral-800 rounded hover:bg-neutral-100 cursor-pointer"
                  title="Edit Segment"
                >
                  <FlowbiteIcon name="edit" size="12" />
                </button>
                <button
                  type="button"
                  @click.stop="handleDeleteSegment(seg.id, seg.name)"
                  class="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                  title="Delete Segment"
                >
                  <FlowbiteIcon name="trash" size="12" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter & Search Bar for Active Segment -->
        <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-medium text-neutral-500">Active Segment:</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-[#F4EB6A]">
              {{ currentActiveSegment.name }}
            </span>
            <span class="text-xs text-neutral-500">
              ({{ customersInActiveSegment.length }} customer{{ customersInActiveSegment.length === 1 ? '' : 's' }} matched)
            </span>
          </div>

          <div class="relative w-full sm:w-72">
            <FlowbiteIcon name="search" size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              v-model="segmentCustomerSearch"
              type="text"
              placeholder="Filter by name, email, role..."
              class="w-full pl-8 pr-3.5 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        <!-- Customers in Active Segment Table -->
        <div v-if="customersInActiveSegment.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <div class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 p-3">
            <img :src="useAsset('/images/customer-icon.svg')" alt="Customers" class="w-6 h-6 object-contain" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900">No customers in this segment</h3>
          <p class="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Customers matching "{{ currentActiveSegment.name }}" will automatically populate here as they register and order.
          </p>
        </div>

        <div v-else class="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                <th class="py-3.5 px-4">Customer</th>
                <th class="py-3.5 px-4">Email</th>
                <th class="py-3.5 px-4">Orders &amp; Lifetime Spend</th>
                <th class="py-3.5 px-4">Berry Points</th>
                <th class="py-3.5 px-4">Role / Tier</th>
                <th class="py-3.5 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-for="cust in customersInActiveSegment" :key="cust.id" class="hover:bg-neutral-50/80 transition-colors">
                <td class="py-3.5 px-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-full bg-neutral-900 text-[#F4EB6A] font-bold text-xs flex items-center justify-center shrink-0">
                      {{ (cust.displayName || cust.email || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-semibold text-neutral-900">{{ cust.displayName || 'Ystore Member' }}</div>
                      <div class="font-mono text-[10px] text-neutral-400">{{ (cust.uid || cust.id).slice(0, 10) }}...</div>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4 text-neutral-600 font-mono text-[11px]">{{ cust.email || 'Anonymous Guest' }}</td>
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-neutral-900">
                    {{ getCustomerOrderCount(cust) }} order{{ getCustomerOrderCount(cust) === 1 ? '' : 's' }}
                  </div>
                  <div class="text-[11px] text-neutral-500 font-medium">
                    R{{ getCustomerSpend(cust).toFixed(2) }} total
                  </div>
                </td>
                <td class="py-3.5 px-4 font-semibold text-neutral-800">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                    ⭐ {{ cust.rewardPoints ?? 0 }} pts
                  </span>
                </td>
                <td class="py-3.5 px-4">
                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                      cust.isAdmin || cust.role === 'super_admin'
                        ? 'bg-[#F5C542] text-neutral-950'
                        : 'bg-neutral-100 text-neutral-700'
                    ]"
                  >
                    {{ cust.isAdmin ? 'Super Admin' : (cust.tier || cust.role || 'Customer') }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right">
                  <a
                    v-if="cust.email"
                    :href="`mailto:${cust.email}?subject=Exclusive from Yellow Berry Store`"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 text-[11px] font-medium transition-colors"
                  >
                    <FlowbiteIcon name="mail" size="12" />
                    <span>Email</span>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==========================================
           TAB 5: DISCOUNTS & COUPONS
           ========================================== -->
      <div v-else-if="activeSection === 'discounts'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <img :src="useAsset('/images/discount-icon.svg')" alt="Discounts" class="w-5 h-5 object-contain" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-neutral-900">Discounts &amp; Coupons ({{ discounts.length }})</h2>
              <p class="text-xs text-neutral-500">Manage promo codes displayed on the Specials page.</p>
            </div>
          </div>
        </div>

        <!-- Add Coupon Form -->
        <form @submit.prevent="handleSaveDiscount" class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
          <input
            v-model="discountForm.code"
            type="text"
            required
            placeholder="Code (e.g. YBERRY20)"
            class="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-mono uppercase focus:outline-none focus:border-neutral-900"
          />
          <input
            v-model="discountForm.discount"
            type="text"
            required
            placeholder="Discount (e.g. 20% OFF)"
            class="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
          />
          <input
            v-model="discountForm.description"
            type="text"
            placeholder="Description (e.g. Orders over R500)"
            class="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
          />
          <button
            type="submit"
            class="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold cursor-pointer"
          >
            + Add Coupon
          </button>
        </form>

        <div v-if="discounts.length === 0" class="py-12 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 text-xs text-neutral-500">
          No active discount codes configured.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="disc in discounts"
            :key="disc.id"
            class="p-4 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between shadow-2xs"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-sm text-neutral-900 bg-[#FAF7BA] px-2.5 py-0.5 rounded-lg border border-[#F4EB6A]">
                  {{ disc.code }}
                </span>
                <span class="text-xs font-bold text-emerald-700">{{ disc.discount }}</span>
              </div>
              <p class="text-xs text-neutral-500 mt-1">{{ disc.description || 'Storewide promotion' }}</p>
            </div>
            <button
              type="button"
              @click="deleteDiscount(disc.id)"
              class="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
            >
              <FlowbiteIcon name="trash" size="15" />
            </button>
          </div>
        </div>
      </div>



      <!-- ==========================================
           TAB 6: HOME BANNERS (Landing Page Hero)
           ========================================== -->
      <div v-else-if="activeSection === 'banners'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <FlowbiteIcon name="image" size="20" class="text-[#F4EB6A]" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-neutral-900">Home Banners</h2>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FAF7BA] text-neutral-900">
                  {{ banners.length }}
                </span>
                <span class="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                  {{ publishedBannersCount }} Published
                </span>
                <span v-if="draftBannersCount > 0" class="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800">
                  {{ draftBannersCount }} Drafts
                </span>
              </div>
              <p class="text-xs text-neutral-500 mt-0.5">
                Manage landing page hero carousel slides, mobile banners, background videos, end dates &amp; alt tags.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              @click="$emit('view-storefront')"
              class="px-4 py-2.5 rounded-full border border-neutral-300 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FlowbiteIcon name="eye" size="15" />
              <span>Preview Hero</span>
            </button>
            <button
              type="button"
              @click="openBannerModal()"
              class="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <FlowbiteIcon name="plus" size="15" stroke-width="2" />
              <span>Add Banner</span>
            </button>
          </div>
        </div>

        <!-- Publication Status Filter Tabs -->
        <div class="flex items-center gap-2 border-b border-neutral-200/80 pb-3">
          <button
            type="button"
            @click="bannerStatusFilter = 'all'"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              bannerStatusFilter === 'all'
                ? 'bg-neutral-900 text-[#F4EB6A] shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            ]"
          >
            <span>All Banners</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-full font-bold" :class="bannerStatusFilter === 'all' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-200 text-neutral-700'">
              {{ banners.length }}
            </span>
          </button>

          <button
            type="button"
            @click="bannerStatusFilter = 'published'"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              bannerStatusFilter === 'published'
                ? 'bg-neutral-900 text-[#F4EB6A] shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Published</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-full font-bold" :class="bannerStatusFilter === 'published' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-200 text-neutral-700'">
              {{ publishedBannersCount }}
            </span>
          </button>

          <button
            type="button"
            @click="bannerStatusFilter = 'draft'"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              bannerStatusFilter === 'draft'
                ? 'bg-neutral-900 text-[#F4EB6A] shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Drafts</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-full font-bold" :class="bannerStatusFilter === 'draft' ? 'bg-[#F4EB6A]/20 text-[#F4EB6A]' : 'bg-neutral-200 text-neutral-700'">
              {{ draftBannersCount }}
            </span>
          </button>
        </div>

        <!-- Add / Edit Banner Form Card -->
        <div v-if="showBannerForm" class="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-5 shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div>
              <h3 class="text-sm font-bold text-neutral-900">
                {{ editingBannerId ? 'Edit Home Banner' : 'Create New Home Banner' }}
              </h3>
              <p class="text-xs text-neutral-500">
                Upload desktop &amp; mobile media or background video directly to <code class="text-neutral-800 font-semibold">banners/</code> in Firebase Storage.
              </p>
            </div>
            <button type="button" @click="showBannerForm = false" class="text-neutral-400 hover:text-neutral-900 p-1 cursor-pointer">
              <FlowbiteIcon name="close" size="18" />
            </button>
          </div>

          <form @submit.prevent="handleSaveBanner(bannerForm.status)" class="space-y-5">
            <!-- Publication Status Selector -->
            <div class="p-3.5 rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span class="text-xs font-bold text-neutral-900 block">Publication Status</span>
                <span class="text-[11px] text-neutral-500">Draft banners are saved securely in ystore-db but will NOT appear on the storefront Hero until published.</span>
              </div>
              <div class="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
                <button
                  type="button"
                  @click="bannerForm.status = 'published'"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                    bannerForm.status !== 'draft'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="bannerForm.status !== 'draft' ? 'bg-white' : 'bg-emerald-500'"></span>
                  <span>Published (Live on Hero)</span>
                </button>
                <button
                  type="button"
                  @click="bannerForm.status = 'draft'"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                    bannerForm.status === 'draft'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="bannerForm.status === 'draft' ? 'bg-white' : 'bg-amber-500'"></span>
                  <span>Draft (Staged)</span>
                </button>
              </div>
            </div>
            <!-- Row 1: Headline, Badge -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-neutral-700 mb-1">Headline / Title *</label>
                <input
                  v-model="bannerForm.title"
                  type="text"
                  required
                  placeholder="e.g. Play, Build & Imagine Without Limits"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900 font-medium"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Badge Text</label>
                <input
                  v-model="bannerForm.badge"
                  type="text"
                  placeholder="e.g. WELCOME TO YSTORE, NEW DROP"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900 uppercase font-semibold"
                />
              </div>
            </div>

            <!-- Subtitle / Description -->
            <div>
              <label class="block text-xs font-medium text-neutral-700 mb-1">Hero Subtitle / Description</label>
              <textarea
                v-model="bannerForm.subtitle"
                rows="2"
                placeholder="e.g. Explore curated product collections, toys, and everyday lifestyle essentials made in South Africa."
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
              ></textarea>
            </div>

            <!-- Alt Tag (SEO & Accessibility) - USER SPECIFIED -->
            <div class="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <FlowbiteIcon name="tag" size="14" class="text-amber-700" />
                  <span>Alt Tag (Required for SEO &amp; Accessibility) *</span>
                </label>
                <span class="text-[10px] text-amber-900 font-medium">Google Image Search &amp; Screen Readers</span>
              </div>
              <input
                v-model="bannerForm.altText"
                type="text"
                required
                placeholder="e.g. Yellow Berry Store wooden craft blocks and featured collection hero banner"
                class="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
              <p class="text-[11px] text-neutral-500 mt-1">
                Provides descriptive alt text for search engine ranking, Pinterest indexing, and assistive technologies.
              </p>
            </div>

            <!-- MEDIA UPLOADS: Desktop, Mobile, and Video - USER SPECIFIED -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              <!-- 1. Desktop Banner Upload (Image or Video) -->
              <div class="p-4 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between space-y-3">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <FlowbiteIcon name="image" size="14" class="text-neutral-700" />
                      <span>Desktop Banner Asset *</span>
                    </span>
                    <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {{ bannerForm.desktopType || 'image' }}
                    </span>
                  </div>
                  <p class="text-[11px] text-neutral-500 mb-2">Recommended: 1920×800 (Image or Video for Desktop)</p>

                  <div class="flex items-center gap-2 mb-2">
                    <input
                      v-model="bannerForm.desktopUrl"
                      type="text"
                      placeholder="Desktop URL or upload ->"
                      class="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    />
                    <label class="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        class="hidden"
                        :disabled="isUploading"
                        @change="handleBannerUpload($event, 'desktop')"
                      />
                      <FlowbiteIcon name="upload" size="13" />
                      <span>{{ bannerUploadingField === 'desktop' ? `${uploadProgress}%` : 'Upload' }}</span>
                    </label>
                  </div>

                  <div class="flex items-center gap-2 text-[11px]">
                    <span class="text-neutral-400">Media Type:</span>
                    <button
                      type="button"
                      @click="bannerForm.desktopType = 'image'"
                      :class="[
                        'px-2 py-0.5 rounded font-medium cursor-pointer',
                        bannerForm.desktopType !== 'video' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                      ]"
                    >Image</button>
                    <button
                      type="button"
                      @click="bannerForm.desktopType = 'video'"
                      :class="[
                        'px-2 py-0.5 rounded font-medium cursor-pointer',
                        bannerForm.desktopType === 'video' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                      ]"
                    >Video</button>
                  </div>
                </div>

                <!-- Preview Box (1920x800 Ratio) -->
                <div class="w-full aspect-[1920/800] min-h-[110px] rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center relative">
                  <template v-if="bannerForm.desktopUrl">
                    <video
                      v-if="bannerForm.desktopType === 'video' || isVideoFile(bannerForm.desktopUrl)"
                      :src="bannerForm.desktopUrl"
                      autoplay loop muted playsinline
                      class="w-full h-full object-cover"
                      style="object-fit: cover !important;"
                    ></video>
                    <img
                      v-else
                      :src="bannerForm.desktopUrl"
                      :alt="bannerForm.altText || 'Desktop Preview'"
                      class="w-full h-full object-cover"
                      style="object-fit: cover !important;"
                    />
                  </template>
                  <span v-else class="text-[11px] text-neutral-400 flex items-center gap-1">
                    <FlowbiteIcon name="image" size="14" />
                    <span>No desktop file loaded</span>
                  </span>
                </div>
              </div>

              <!-- 2. Mobile Banner Upload (Image or Video) -->
              <div class="p-4 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between space-y-3">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <FlowbiteIcon name="sparkles" size="14" class="text-neutral-700" />
                      <span>Mobile Banner Asset</span>
                    </span>
                    <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {{ bannerForm.mobileType || 'image' }}
                    </span>
                  </div>
                  <p class="text-[11px] text-neutral-500 mb-2">Recommended: 700×700 (1:1 Square Asset for Mobile)</p>

                  <div class="flex items-center gap-2 mb-2">
                    <input
                      v-model="bannerForm.mobileUrl"
                      type="text"
                      placeholder="Mobile URL or upload ->"
                      class="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    />
                    <label class="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        class="hidden"
                        :disabled="isUploading"
                        @change="handleBannerUpload($event, 'mobile')"
                      />
                      <FlowbiteIcon name="upload" size="13" />
                      <span>{{ bannerUploadingField === 'mobile' ? `${uploadProgress}%` : 'Upload' }}</span>
                    </label>
                  </div>

                  <div class="flex items-center gap-2 text-[11px]">
                    <span class="text-neutral-400">Media Type:</span>
                    <button
                      type="button"
                      @click="bannerForm.mobileType = 'image'"
                      :class="[
                        'px-2 py-0.5 rounded font-medium cursor-pointer',
                        bannerForm.mobileType !== 'video' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                      ]"
                    >Image</button>
                    <button
                      type="button"
                      @click="bannerForm.mobileType = 'video'"
                      :class="[
                        'px-2 py-0.5 rounded font-medium cursor-pointer',
                        bannerForm.mobileType === 'video' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                      ]"
                    >Video</button>
                  </div>
                </div>

                <!-- Preview Box (700x700 Square Ratio) -->
                <div class="w-full aspect-square max-h-40 mx-auto rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center relative">
                  <template v-if="bannerForm.mobileUrl">
                    <video
                      v-if="bannerForm.mobileType === 'video' || isVideoFile(bannerForm.mobileUrl)"
                      :src="bannerForm.mobileUrl"
                      autoplay loop muted playsinline
                      class="w-full h-full object-cover"
                      style="object-fit: cover !important;"
                    ></video>
                    <img
                      v-else
                      :src="bannerForm.mobileUrl"
                      :alt="bannerForm.altText || 'Mobile Preview'"
                      class="w-full h-full object-cover"
                      style="object-fit: cover !important;"
                    />
                  </template>
                  <span v-else class="text-[11px] text-neutral-400">
                    Falls back to Desktop asset
                  </span>
                </div>
              </div>

              <!-- 3. Dedicated Hero Video File Upload -->
              <div class="p-4 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between space-y-3">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <FlowbiteIcon name="video" size="14" class="text-neutral-700" />
                      <span>Background Video File</span>
                    </span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      MP4 / WebM
                    </span>
                  </div>
                  <p class="text-[11px] text-neutral-500 mb-2">Autoplay background video loop (optional)</p>

                  <div class="flex items-center gap-2 mb-2">
                    <input
                      v-model="bannerForm.videoUrl"
                      type="text"
                      placeholder="Video URL or upload ->"
                      class="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    />
                    <label class="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                      <input
                        type="file"
                        accept="video/*"
                        class="hidden"
                        :disabled="isUploading"
                        @change="handleBannerUpload($event, 'video')"
                      />
                      <FlowbiteIcon name="upload" size="13" />
                      <span>{{ bannerUploadingField === 'video' ? `${uploadProgress}%` : 'Upload' }}</span>
                    </label>
                  </div>
                  <p class="text-[10px] text-neutral-400">Plays muted loop on landing page hero</p>
                </div>

                <!-- Preview Box -->
                <div class="h-28 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center relative">
                  <video
                    v-if="bannerForm.videoUrl"
                    :src="bannerForm.videoUrl"
                    autoplay loop muted playsinline
                    class="w-full h-full object-cover"
                  ></video>
                  <span v-else class="text-[11px] text-neutral-400 flex items-center gap-1">
                    <FlowbiteIcon name="video" size="14" />
                    <span>No separate video file</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Row 3: Call to Action Button & Link -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Button Text</label>
                <input
                  v-model="bannerForm.buttonText"
                  type="text"
                  placeholder="e.g. Explore Catalog, Shop Deals, Read Story"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1">Destination Link</label>
                <input
                  v-model="bannerForm.link"
                  type="text"
                  placeholder="e.g. #featured, #products, /categories/decor"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <!-- Row 4: End Date Schedule & Order - USER SPECIFIED -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-100/70 border border-neutral-200">
              <div class="sm:col-span-2">
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <FlowbiteIcon name="clock" size="14" class="text-neutral-700" />
                    <span>End Date &amp; Time (Automatic Expiration)</span>
                  </label>
                  <span v-if="bannerForm.endDate" class="text-[10px] text-neutral-600 font-mono">
                    {{ formatDateTime(bannerForm.endDate) }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <input
                    v-model="bannerForm.endDate"
                    type="datetime-local"
                    class="flex-1 px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
                  />
                  <!-- Quick Date presets -->
                  <div class="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      @click="setEndDatePreset(7)"
                      class="px-2.5 py-2 rounded-lg bg-white border border-neutral-300 hover:border-neutral-900 text-[11px] font-semibold text-neutral-700 cursor-pointer"
                      title="Set end date to 7 days from now"
                    >
                      +7d
                    </button>
                    <button
                      type="button"
                      @click="setEndDatePreset(30)"
                      class="px-2.5 py-2 rounded-lg bg-white border border-neutral-300 hover:border-neutral-900 text-[11px] font-semibold text-neutral-700 cursor-pointer"
                      title="Set end date to 30 days from now"
                    >
                      +30d
                    </button>
                    <button
                      v-if="bannerForm.endDate"
                      type="button"
                      @click="setEndDatePreset(0)"
                      class="px-2.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-[11px] font-semibold text-red-700 cursor-pointer"
                      title="Clear end date so it never expires"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <p class="text-[11px] text-neutral-500 mt-1">
                  Leave empty if this banner should run indefinitely without an expiration date.
                </p>
              </div>

              <div>
                <label class="block text-xs font-bold text-neutral-900 mb-1 flex items-center gap-1">
                  <FlowbiteIcon name="grid" size="14" class="text-neutral-700" />
                  <span>Carousel Order</span>
                </label>
                <input
                  v-model.number="bannerForm.order"
                  type="number"
                  min="1"
                  max="99"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
                />
                <p class="text-[11px] text-neutral-500 mt-1">Order 1 shows first</p>
              </div>
            </div>

            <!-- Row 5: Active status toggle & Submit Buttons -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-neutral-200">
              <label class="flex items-center gap-2.5 text-xs text-neutral-900 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  v-model="bannerForm.active"
                  class="w-4 h-4 rounded accent-neutral-900"
                />
                <span>Active on Storefront (Hero Carousel)</span>
              </label>

              <div class="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  @click="showBannerForm = false"
                  class="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  :disabled="savingBanner || !!bannerUploadingField"
                  @click="handleSaveBanner('draft')"
                  class="px-4 py-2 rounded-xl border border-neutral-300 hover:border-neutral-900 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 cursor-pointer"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  :disabled="savingBanner || !!bannerUploadingField"
                  @click="handleSaveBanner('published')"
                  class="px-6 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <FlowbiteIcon v-if="savingBanner" name="clock" size="14" class="animate-spin" />
                  <span>{{ savingBanner ? 'Saving...' : (editingBannerId ? 'Update & Publish' : 'Publish Banner') }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Banner List Display -->
        <div v-if="banners.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <div class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 text-neutral-400 p-3">
            <FlowbiteIcon name="image" size="24" class="text-[#F4EB6A]" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900">No Home Banners Loaded</h3>
          <p class="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
            Click "+ Add Banner" above to load your custom desktop, mobile, or video banners directly to Firebase Storage and publish them live to your storefront hero.
          </p>
          <button
            type="button"
            @click="openBannerModal()"
            class="mt-4 px-5 py-2 rounded-full bg-neutral-900 text-[#F4EB6A] text-xs font-semibold cursor-pointer"
          >
            + Create First Home Banner
          </button>
        </div>

        <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div
            v-for="banner in filteredBanners"
            :key="banner.id"
            class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs hover:border-[#F5C542] transition-all flex flex-col justify-between"
          >
            <div>
              <!-- Top Card Bar: Order, Badges, Status -->
              <div class="flex items-center justify-between gap-2 mb-3">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-neutral-900 text-[#F4EB6A] text-[10px] font-bold">
                    Slide #{{ banner.order || 1 }}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-semibold uppercase">
                    {{ banner.badge || 'PROMO' }}
                  </span>
                  <span
                    v-if="banner.videoUrl || banner.desktopType === 'video' || isVideoFile(banner.desktopUrl)"
                    class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1"
                  >
                    <FlowbiteIcon name="video" size="11" />
                    <span>Video</span>
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 shadow-xs',
                      getBannerStatus(banner).class
                    ]"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="banner.status === 'draft' ? 'bg-amber-500' : (isBannerExpired(banner) ? 'bg-red-500' : (banner.active === false ? 'bg-neutral-400' : 'bg-emerald-500'))"
                    ></span>
                    <span>{{ getBannerStatus(banner).text }}</span>
                  </span>
                </div>
              </div>

              <!-- Media Visual Preview Container -->
              <div class="relative w-full h-44 sm:h-52 rounded-xl bg-neutral-950 overflow-hidden mb-3 border border-neutral-200">
                <!-- Desktop Media -->
                <video
                  v-if="banner.videoUrl || banner.desktopType === 'video' || isVideoFile(banner.desktopUrl)"
                  :src="banner.videoUrl || banner.desktopUrl"
                  autoplay loop muted playsinline
                  class="w-full h-full object-cover"
                  style="object-fit: cover !important;"
                ></video>
                <img
                  v-else-if="banner.desktopUrl"
                  :src="banner.desktopUrl"
                  :alt="banner.altText || banner.title"
                  class="w-full h-full object-cover"
                  style="object-fit: cover !important;"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                  No preview asset
                </div>

                <!-- Inset Content Preview Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-transparent flex flex-col justify-end p-3.5 text-white">
                  <h4 class="text-sm sm:text-base font-bold line-clamp-1 drop-shadow">{{ banner.title }}</h4>
                  <p class="text-[11px] text-neutral-200 line-clamp-1 mt-0.5 font-light">{{ banner.subtitle }}</p>
                  <div class="mt-2 flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-full bg-[#F4EB6A] text-neutral-900 text-[10px] font-bold">
                      {{ banner.buttonText || 'Explore Catalog' }}
                    </span>
                    <span class="text-[10px] text-neutral-300 font-mono">{{ banner.link || '#featured' }}</span>
                  </div>
                </div>

                <!-- Floating Mobile Preview Badge (if mobile asset provided) -->
                <div
                  v-if="banner.mobileUrl"
                  class="absolute top-2.5 right-2.5 w-14 h-20 rounded-lg overflow-hidden border-2 border-white/90 shadow-lg bg-black group"
                  title="Mobile View Asset"
                >
                  <video
                    v-if="banner.mobileType === 'video' || isVideoFile(banner.mobileUrl)"
                    :src="banner.mobileUrl"
                    autoplay loop muted playsinline
                    class="w-full h-full object-cover"
                  ></video>
                  <img
                    v-else
                    :src="banner.mobileUrl"
                    :alt="banner.altText"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] text-white text-center font-bold py-0.5">
                    Mobile
                  </div>
                </div>
              </div>

              <!-- Alt Tag Box (USER REQUIREMENT) -->
              <div class="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 mb-3 text-xs">
                <div class="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">
                  <span class="flex items-center gap-1">
                    <FlowbiteIcon name="tag" size="12" class="text-amber-600" />
                    <span>Alt Tag (SEO &amp; Screen Readers)</span>
                  </span>
                  <span v-if="!banner.altText" class="text-amber-600 font-semibold">Missing alt tag</span>
                </div>
                <p class="text-xs text-neutral-800 font-medium italic truncate" :title="banner.altText">
                  "{{ banner.altText || 'No custom alt tag provided' }}"
                </p>
              </div>

              <!-- Expiry & Schedule Info (USER REQUIREMENT) -->
              <div class="flex items-center justify-between text-xs text-neutral-500 py-1 border-t border-neutral-100">
                <span class="flex items-center gap-1">
                  <FlowbiteIcon name="clock" size="13" class="text-neutral-400" />
                  <span>End Date:</span>
                </span>
                <span :class="isBannerExpired(banner) ? 'text-red-600 font-semibold font-mono' : 'text-neutral-800 font-medium font-mono'">
                  {{ formatDateTime(banner.endDate) }}
                </span>
              </div>
            </div>

            <!-- Action Toolbar -->
            <div class="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100">
              <button
                type="button"
                @click="toggleBannerStatus(banner)"
                :class="[
                  'text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5',
                  banner.status === 'draft'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                ]"
                :title="banner.status === 'draft' ? 'Publish banner live to storefront hero' : 'Move banner to draft status'"
              >
                <FlowbiteIcon :name="banner.status === 'draft' ? 'check' : 'close'" size="12" />
                <span>{{ banner.status === 'draft' ? 'Publish Live' : 'Move to Draft' }}</span>
              </button>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  @click="openBannerModal(banner)"
                  class="px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Edit Banner Content & Assets"
                >
                  <FlowbiteIcon name="edit" size="14" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  @click="handleDeleteBanner(banner.id)"
                  class="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                  title="Delete Banner"
                >
                  <FlowbiteIcon name="trash" size="15" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- ==========================================
           TAB 6B: MEDIA FILES (ystore-db.firebasestorage.app)
           ========================================== -->
      <div v-else-if="activeSection === 'media'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <img :src="useAsset('/images/media-files-icon.svg')" alt="Media files" class="w-5 h-5 object-contain" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-neutral-900">Media Files</h2>
              <p class="text-xs text-neutral-500">
                Connected to <code class="text-neutral-800 font-semibold">gs://ystore-db.firebasestorage.app/{{ activeStorageFolder }}/</code>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <select
              v-model="activeStorageFolder"
              @change="refreshMediaFolder"
              class="px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-800 focus:outline-none"
            >
              <option value="products">products/</option>
              <option value="categories">categories/</option>
              <option value="collections">collections/</option>
              <option value="specials">specials/</option>
              <option value="blog">blog/</option>
              <option value="banners">banners/</option>
              <option value="content">content/</option>
            </select>

            <label class="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*,video/*,application/pdf,application/json"
                class="hidden"
                :disabled="isUploading"
                @change="handleMediaLibraryUpload"
              />
              <FlowbiteIcon name="upload" size="15" />
              <span>{{ isUploading ? `Uploading ${uploadProgress}%` : 'Upload Files' }}</span>
            </label>
          </div>
        </div>

        <!-- Upload Progress Bar -->
        <div v-if="isUploading" class="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
          <div class="bg-[#F5C542] h-full transition-all duration-200" :style="{ width: `${uploadProgress}%` }"></div>
        </div>

        <div v-if="loadingMedia" class="py-12 text-center text-xs text-neutral-400">
          Loading files from ystore-db.firebasestorage.app/{{ activeStorageFolder }}/...
        </div>

        <div v-else-if="uploadedItems.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <div class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 text-neutral-400 p-3">
            <img :src="useAsset('/images/media-files-icon.svg')" alt="Media files" class="w-6 h-6 object-contain" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900">No files in {{ activeStorageFolder }}/</h3>
          <p class="text-xs text-neutral-500 mt-1">Upload product photos, banners, or blog images above.</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            v-for="item in uploadedItems"
            :key="item.storagePath"
            class="group rounded-2xl border border-neutral-200 p-2.5 bg-white hover:border-[#F5C542] transition-all flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div class="aspect-square rounded-xl bg-neutral-100 overflow-hidden mb-2 flex items-center justify-center">
                <img
                  v-if="item.url"
                  :src="item.url"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <p class="text-[11px] font-medium text-neutral-800 truncate" :title="item.name">{{ item.name }}</p>
            </div>

            <div class="flex items-center justify-between gap-1 pt-2 mt-2 border-t border-neutral-100">
              <button
                type="button"
                @click="copyUrl(item.url)"
                class="px-2 py-1 rounded-lg bg-[#FAF7BA] hover:bg-[#F4EB6A] text-neutral-900 text-[10px] font-semibold cursor-pointer"
              >
                Copy URL
              </button>
              <button
                type="button"
                @click="handleDeleteMedia(item.storagePath)"
                class="p-1 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                title="Delete file"
              >
                <FlowbiteIcon name="trash" size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>



      <!-- ==========================================
           TAB 7: BLOGS MANAGEMENT
           ========================================== -->
      <div v-else-if="activeSection === 'blogs'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <img :src="useAsset('/images/blogs-icon-1.svg')" alt="Blogs" class="w-5 h-5 object-contain" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-neutral-900">Blogs &amp; Stories ({{ blogs.length }})</h2>
              <p class="text-xs text-neutral-500">Write and publish articles to the Yellow Berry Chronicle.</p>
            </div>
          </div>
          <button
            type="button"
            @click="openBlogModal()"
            class="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <FlowbiteIcon name="plus" size="15" stroke-width="2" />
            <span>New Blog Post</span>
          </button>
        </div>

        <!-- Blog Form -->
        <div v-if="showBlogForm" class="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h3 class="text-sm font-bold text-neutral-900">
              {{ editingBlogId ? 'Edit Blog Post' : 'Publish New Blog Post' }}
            </h3>
            <button type="button" @click="showBlogForm = false" class="text-neutral-400 hover:text-neutral-900">
              <FlowbiteIcon name="close" size="18" />
            </button>
          </div>

          <form @submit.prevent="handleSaveBlog" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-neutral-700 mb-1">Article Title *</label>
              <input
                v-model="blogForm.title"
                type="text"
                required
                placeholder="e.g. Behind the Scenes: How We Design and Craft Our Products"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-neutral-700 mb-1">Category</label>
              <input
                v-model="blogForm.category"
                type="text"
                placeholder="e.g. Lifestyle, Handcrafted, Design Guides"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-neutral-700 mb-1">Cover Image</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="blogForm.coverImage"
                  type="text"
                  placeholder="Cover image URL or upload ->"
                  class="flex-1 px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
                />
                <label class="px-3.5 py-2 rounded-xl bg-neutral-900 text-[#F4EB6A] text-xs font-semibold cursor-pointer shrink-0">
                  <input type="file" accept="image/*" class="hidden" @change="handleBlogImageUpload" />
                  <span>{{ isUploading ? `${uploadProgress}%` : 'Upload' }}</span>
                </label>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-neutral-700 mb-1">Short Excerpt *</label>
              <textarea
                v-model="blogForm.excerpt"
                rows="2"
                required
                placeholder="A brief summary shown on the blog card..."
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
              ></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-neutral-700 mb-1">Full Article Body *</label>
              <textarea
                v-model="blogForm.body"
                rows="6"
                required
                placeholder="Write your article paragraphs here (separate paragraphs with a blank line)..."
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900"
              ></textarea>
            </div>

            <div class="md:col-span-2 flex items-center justify-between pt-2 border-t border-neutral-200">
              <label class="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer">
                <input type="checkbox" v-model="blogForm.featured" class="rounded accent-neutral-900" />
                <span>Feature as Headline Story</span>
              </label>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="showBlogForm = false"
                  class="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="savingBlog"
                  class="px-5 py-2 rounded-xl bg-neutral-900 text-[#F4EB6A] text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                >
                  {{ savingBlog ? 'Publishing...' : 'Publish Article' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div v-if="blogs.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <div class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 text-neutral-400 p-3">
            <img :src="useAsset('/images/blogs-icon-1.svg')" alt="Blogs" class="w-6 h-6 object-contain" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900">No blog posts yet</h3>
          <p class="text-xs text-neutral-500 mt-1">Publish stories and play guides to engage your shoppers.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="post in blogs"
            :key="post.id"
            class="rounded-2xl border border-neutral-200 p-4 bg-white flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div class="aspect-video rounded-xl bg-neutral-100 overflow-hidden mb-3">
                <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" class="w-full h-full object-cover" />
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700">{{ post.category }}</span>
              <h4 class="text-sm font-bold text-neutral-900 mt-0.5 line-clamp-2">{{ post.title }}</h4>
              <p class="text-xs text-neutral-500 mt-1 line-clamp-2">{{ post.excerpt }}</p>
            </div>
            <div class="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100">
              <span class="text-[11px] text-neutral-400">{{ post.date }}</span>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="openBlogModal(post)"
                  class="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer"
                >
                  <FlowbiteIcon name="edit" size="15" />
                </button>
                <button
                  type="button"
                  @click="deleteBlog(post.id)"
                  class="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                >
                  <FlowbiteIcon name="trash" size="15" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- ==========================================
           TAB 8: SETTINGS (General Store Admin)
           ========================================== -->
      <div v-else-if="activeSection === 'settings'" class="space-y-6 max-w-4xl">
        <div class="pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2">
              <img :src="useAsset('/images/settings-icon.svg')" alt="Settings" class="w-5 h-5 object-contain" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Settings /</span>
                <h2 class="text-xl font-bold text-neutral-900">General Settings</h2>
              </div>
              <p class="text-xs text-neutral-500">Configure store identity, regional preferences, and database connections.</p>
            </div>
          </div>

          <!-- Settings Sub-Navigation Header -->
          <div class="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl shrink-0">
            <button
              type="button"
              @click="activeSection = 'settings'"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors bg-white text-neutral-900 shadow-2xs"
            >
              General
            </button>
            <button
              type="button"
              @click="activeSection = 'settings-payments'"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
            >
              <FlowbiteIcon name="credit-card" size="14" />
              <span>Payments</span>
              <span class="text-[9px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded-full font-bold">
                {{ activePaymentGatewaysCount }}
              </span>
            </button>
            <button
              type="button"
              @click="activeSection = 'settings-users'"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
            >
              <FlowbiteIcon name="users" size="14" />
              <span>Manage Users</span>
              <span class="text-[9px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded-full font-bold">
                {{ adminUsers?.length || 0 }}
              </span>
            </button>
          </div>
        </div>

        <!-- Quick Access Navigation Cards (Payments + Manage Users) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Manage Users Card (USER REQUIREMENT) -->
          <div class="p-5 rounded-2xl border border-purple-200 bg-purple-50/40 flex flex-col justify-between gap-4 shadow-2xs">
            <div class="flex items-start gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-neutral-900 text-[#F4EB6A] flex items-center justify-center shrink-0 p-2.5">
                <FlowbiteIcon name="users" size="22" stroke-width="1.8" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-xs font-bold text-neutral-900">Manage Users &amp; Team Access</h4>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {{ adminUsers?.length || 0 }} Users
                  </span>
                </div>
                <p class="text-[11px] text-neutral-600 mt-1">
                  Super Admin profile, store staff invitations, role permissions (Store Manager, Order Fulfillment, Content Editor).
                </p>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-purple-200/60">
              <div class="flex items-center gap-1.5 text-[10px] font-semibold text-purple-900">
                <span class="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>{{ activeAdminsCount }} Super Admin · {{ activeStaffCount }} Active Staff</span>
              </div>
              <button
                type="button"
                @click="activeSection = 'settings-users'"
                class="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-[#F4EB6A] hover:bg-neutral-800 text-xs font-bold cursor-pointer transition-colors shrink-0 shadow-sm flex items-center gap-1"
              >
                <span>Manage Users</span>
                <FlowbiteIcon name="arrow-right" size="12" />
              </button>
            </div>
          </div>

          <!-- Payments Quick Access Card -->
          <div class="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between gap-4 shadow-2xs">
            <div class="flex items-start gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-neutral-900 text-[#F4EB6A] flex items-center justify-center shrink-0 p-2.5">
                <FlowbiteIcon name="credit-card" size="22" stroke-width="1.8" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-xs font-bold text-neutral-900">Payments &amp; Checkout Gateways</h4>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {{ activePaymentGatewaysCount }} Ready
                  </span>
                </div>
                <p class="text-[11px] text-neutral-600 mt-1">
                  Configure PayFast, Yoco, Ozow Instant EFT, Payflex Buy Now Pay Later, Stripe, and Direct Bank Transfer.
                </p>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-amber-200/60">
              <div class="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-700">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>ZAR (R) Base Currency · 15% VAT</span>
              </div>
              <button
                type="button"
                @click="activeSection = 'settings-payments'"
                class="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-[#F4EB6A] hover:bg-neutral-800 text-xs font-bold cursor-pointer transition-colors shrink-0 shadow-sm flex items-center gap-1"
              >
                <span>Payments</span>
                <FlowbiteIcon name="arrow-right" size="12" />
              </button>
            </div>
          </div>
        </div>

        <!-- Store Identity, Company Address & Contact Details -->
        <form @submit.prevent="handleSaveCompanyProfile" class="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-5">
          <div class="pb-3 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-sm font-bold text-neutral-900">Company Address &amp; Contact Details</h3>
              <p class="text-xs text-neutral-500">Update your business address, support emails, phone numbers, and hours shown across the storefront.</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                @click="handleResetCompanyProfile"
                class="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 text-xs font-semibold cursor-pointer transition-colors"
              >
                Reset Defaults
              </button>
              <button
                type="submit"
                :disabled="savingCompanyProfile"
                class="px-4 py-1.5 rounded-xl bg-neutral-900 text-[#F4EB6A] hover:bg-neutral-800 disabled:opacity-60 text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                {{ savingCompanyProfile ? 'Saving...' : 'Save Company Details' }}
              </button>
            </div>
          </div>

          <!-- Operational Summary Strip -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-white border border-neutral-200 flex items-center justify-between">
              <span class="text-neutral-400">Legal Entity</span>
              <span class="font-semibold text-neutral-900 truncate ml-2">{{ localCompanyProfile.companyName || 'Yellow Berry Store (Pty) Ltd' }}</span>
            </div>
            <div class="p-3 rounded-xl bg-white border border-neutral-200 flex items-center justify-between">
              <span class="text-neutral-400">Primary Currency</span>
              <span class="font-semibold text-neutral-900">{{ localPaymentSettings.general.currency }} ({{ localPaymentSettings.general.currencySymbol }})</span>
            </div>
            <div class="p-3 rounded-xl bg-white border border-neutral-200 flex items-center justify-between">
              <span class="text-neutral-400">Standard VAT Rate</span>
              <span class="font-semibold text-neutral-900">{{ localPaymentSettings.general.vatRate }}% (South Africa)</span>
            </div>
          </div>

          <!-- Company Identity & Physical Address -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Company / Legal Name</label>
              <input
                v-model="localCompanyProfile.companyName"
                type="text"
                placeholder="Yellow Berry Store (Pty) Ltd"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Storefront Domain</label>
              <input
                v-model="localCompanyProfile.domain"
                type="text"
                placeholder="ystoreza.co.za"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Timezone</label>
              <input
                v-model="localCompanyProfile.timezone"
                type="text"
                placeholder="Africa/Johannesburg (GMT+2)"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div class="sm:col-span-2 lg:col-span-3">
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Street Address</label>
              <input
                v-model="localCompanyProfile.streetAddress"
                type="text"
                placeholder="Studio 4, The Palms Centre, 145 Sir Lowry Rd, Woodstock"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">City</label>
              <input
                v-model="localCompanyProfile.city"
                type="text"
                placeholder="Cape Town"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Province / Region</label>
              <input
                v-model="localCompanyProfile.province"
                type="text"
                placeholder="Western Cape"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Postal Code</label>
                <input
                  v-model="localCompanyProfile.postalCode"
                  type="text"
                  placeholder="7925"
                  class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Country</label>
                <input
                  v-model="localCompanyProfile.country"
                  type="text"
                  placeholder="South Africa"
                  class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          </div>

          <!-- Contact Channels & Hours -->
          <div class="pt-3 border-t border-neutral-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Customer Support Email</label>
              <input
                v-model="localCompanyProfile.supportEmail"
                type="email"
                placeholder="support@yellowberry.store"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">General Inquiries Email</label>
              <input
                v-model="localCompanyProfile.infoEmail"
                type="email"
                placeholder="info@ystore.co.za"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Custom Orders Email</label>
              <input
                v-model="localCompanyProfile.customEmail"
                type="email"
                placeholder="custom@ystore.co.za"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Admin / POPIA Officer Email</label>
              <input
                v-model="localCompanyProfile.adminEmail"
                type="email"
                placeholder="admin@yellowberry.store"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Primary Phone / WhatsApp</label>
              <input
                v-model="localCompanyProfile.primaryPhone"
                type="text"
                placeholder="+27 71 234 5678"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Secondary Phone / WhatsApp</label>
              <input
                v-model="localCompanyProfile.secondaryPhone"
                type="text"
                placeholder="+27 82 987 6543"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Weekday Hours</label>
              <input
                v-model="localCompanyProfile.workingHoursWeekday"
                type="text"
                placeholder="Daily: 8am - 5pm"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Weekend / Sunday Hours</label>
              <input
                v-model="localCompanyProfile.workingHoursWeekend"
                type="text"
                placeholder="Sundays: Closed"
                class="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>
        </form>

        <!-- Firebase Cloud Environment Details -->
        <div class="p-6 rounded-2xl border border-neutral-200 bg-white space-y-4 shadow-2xs">
          <div class="pb-3 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-neutral-900">Cloud Infrastructure &amp; Persistence</h3>
              <p class="text-xs text-neutral-500">Live Firebase backend services connected to Yellow Berry Store.</p>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Active</span>
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <span class="text-neutral-400 block text-[11px]">Firestore NoSQL Database</span>
              <span class="font-mono font-semibold text-neutral-900">ystore-db (eur3)</span>
            </div>
            <div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <span class="text-neutral-400 block text-[11px]">Cloud Storage Bucket</span>
              <span class="font-mono font-semibold text-neutral-900">ystore-db.firebasestorage.app</span>
            </div>
          </div>

          <div class="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              @click="$emit('view-storefront')"
              class="px-5 py-2.5 rounded-full bg-neutral-900 text-[#F4EB6A] text-xs font-semibold cursor-pointer hover:bg-neutral-800 transition-colors"
            >
              Return to Storefront
            </button>
            <button
              type="button"
              @click="handleSignOut"
              class="px-5 py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer transition-colors"
            >
              Sign Out of Admin
            </button>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TAB 8B: SETTINGS - PAYMENTS (USER REQUIREMENT)
           ========================================== -->
      <div v-else-if="activeSection === 'settings-payments'" class="space-y-6">
        <!-- Header & Action Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2 text-[#F4EB6A]">
              <FlowbiteIcon name="credit-card" size="20" stroke-width="1.8" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Settings /</span>
                <h2 class="text-xl font-bold text-neutral-900">Payment Gateways &amp; Methods</h2>
              </div>
              <p class="text-xs text-neutral-500">Configure South African &amp; global checkout providers, currencies, and payout accounts.</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Global Mode Switch (Sandbox vs Live) -->
            <label
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
              :class="localPaymentSettings.general.sandboxMode ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'"
              title="Toggle between test sandbox and live production"
            >
              <input
                type="checkbox"
                v-model="localPaymentSettings.general.sandboxMode"
                class="rounded accent-neutral-900 cursor-pointer"
              />
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full" :class="localPaymentSettings.general.sandboxMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'"></span>
                <span>{{ localPaymentSettings.general.sandboxMode ? 'Sandbox Test Mode' : 'Live Production Mode' }}</span>
              </span>
            </label>

            <!-- Reset Defaults Button -->
            <button
              type="button"
              @click="handleResetPaymentDefaults"
              class="px-3.5 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 text-xs font-semibold cursor-pointer transition-colors"
              title="Reset to recommended South African defaults"
            >
              Reset
            </button>

            <!-- Save Payment Settings Button -->
            <button
              type="button"
              @click="handleSavePayments"
              :disabled="savingPayments"
              class="px-4 py-2 rounded-xl bg-neutral-900 text-[#F4EB6A] text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <FlowbiteIcon v-if="savingPayments" name="refresh" size="14" class="animate-spin" />
              <span>{{ savingPayments ? 'Saving...' : 'Save Payment Settings' }}</span>
            </button>
          </div>
        </div>

        <!-- Settings Sub-Navigation Header -->
        <div class="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl w-fit">
          <button
            type="button"
            @click="activeSection = 'settings'"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-600 hover:text-neutral-900"
          >
            General
          </button>
          <button
            type="button"
            @click="activeSection = 'settings-payments'"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors bg-white text-neutral-900 shadow-2xs flex items-center gap-1.5"
          >
            <FlowbiteIcon name="credit-card" size="14" />
            <span>Payments</span>
            <span class="text-[9px] bg-neutral-900 text-[#F4EB6A] px-1.5 py-0.2 rounded-full font-bold">
              {{ activePaymentGatewaysCount }} Active
            </span>
          </button>
          <button
            type="button"
            @click="activeSection = 'settings-users'"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
          >
            <FlowbiteIcon name="users" size="14" />
            <span>Manage Users</span>
            <span class="text-[9px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded-full font-bold">
              {{ adminUsers?.length || 0 }}
            </span>
          </button>
        </div>

        <!-- Sandbox Warning Banner -->
        <div v-if="localPaymentSettings.general.sandboxMode" class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <span class="text-base shrink-0">🧪</span>
          <div class="text-xs">
            <span class="font-bold text-amber-900 block">Sandbox Test Mode is Active</span>
            <span class="text-amber-800">
              Orders and checkout transactions will use test merchant keys and simulated payments. No real bank accounts or credit cards will be debited.
            </span>
          </div>
        </div>

        <!-- Top 4 Key Metrics Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Active Gateways</span>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-extrabold text-neutral-900 font-mono">{{ activePaymentGatewaysCount }}</span>
              <span class="text-xs text-neutral-500 font-medium">/ 7 configured</span>
            </div>
            <span class="text-[10px] text-emerald-700 font-medium mt-1 block">Live checkout enabled</span>
          </div>

          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Base Currency</span>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-extrabold text-neutral-900 font-mono">{{ localPaymentSettings.general.currency }}</span>
              <span class="text-xs text-neutral-500 font-bold">({{ localPaymentSettings.general.currencySymbol }})</span>
            </div>
            <span class="text-[10px] text-neutral-500 mt-1 block">VAT {{ localPaymentSettings.general.vatRate }}% included</span>
          </div>

          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Buy Now Pay Later</span>
            <div class="flex items-center gap-2 mt-1">
              <span class="w-2.5 h-2.5 rounded-full" :class="localPaymentSettings.gateways.payflex.enabled ? 'bg-emerald-500' : 'bg-neutral-300'"></span>
              <span class="text-xs font-bold text-neutral-900">{{ localPaymentSettings.gateways.payflex.enabled ? 'Payflex 4-Pay' : 'Disabled' }}</span>
            </div>
            <span class="text-[10px] text-neutral-500 mt-1.5 block">0% interest installments</span>
          </div>

          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Store Payout Routing</span>
            <span class="text-xs font-bold text-neutral-900 block truncate">{{ localPaymentSettings.payouts.bankName }}</span>
            <span class="text-[10px] text-neutral-500 font-mono mt-1 block">
              •••• {{ (localPaymentSettings.payouts.accountNumber || '').slice(-4) || '2938' }} ({{ localPaymentSettings.payouts.schedule }})
            </span>
          </div>
        </div>

        <!-- Section 1: Gateways & Payment Providers -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-neutral-900">Checkout Payment Providers</h3>
              <p class="text-xs text-neutral-500">Toggle active payment methods and configure merchant credentials.</p>
            </div>
            <span class="text-xs text-neutral-400 font-mono">{{ activePaymentGatewaysCount }} of 7 Active</span>
          </div>

          <div class="space-y-3">
            <!-- 1. PayFast by Network -->
            <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
              <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
                <div class="flex items-start sm:items-center gap-3.5">
                  <div class="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center font-bold text-red-700 text-sm shrink-0 font-mono">
                    PF
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs sm:text-sm font-bold text-neutral-900">{{ localPaymentSettings.gateways.payfast.name }}</h4>
                      <span
                        class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        :class="localPaymentSettings.gateways.payfast.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'"
                      >
                        {{ localPaymentSettings.gateways.payfast.enabled ? 'Enabled' : 'Disabled' }}
                      </span>
                    </div>
                    <p class="text-[11px] text-neutral-500 mt-0.5">{{ localPaymentSettings.gateways.payfast.description }}</p>
                    <div class="flex flex-wrap items-center gap-1.5 mt-2">
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Visa / Mastercard</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Instant EFT</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Capitec Pay</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">SnapScan</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Zapper</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="localPaymentSettings.gateways.payfast.enabled" class="sr-only peer" />
                    <div class="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                  <button
                    type="button"
                    @click="toggleGatewayConfig('payfast')"
                    class="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-xs font-semibold hover:bg-neutral-100 cursor-pointer transition-colors"
                  >
                    {{ openGatewayConfig.payfast ? 'Hide Settings' : 'Configure' }}
                  </button>
                </div>
              </div>

              <!-- PayFast Config Drawer -->
              <div v-if="openGatewayConfig.payfast" class="p-5 border-t border-neutral-200 bg-white space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">PayFast Merchant ID *</label>
                    <input
                      v-model="localPaymentSettings.gateways.payfast.merchantId"
                      type="text"
                      placeholder="10000100"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">PayFast Merchant Key *</label>
                    <input
                      v-model="localPaymentSettings.gateways.payfast.merchantKey"
                      type="text"
                      placeholder="46f0cd694581a"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-xs font-semibold text-neutral-700">Passphrase (Security Salt)</label>
                    <button
                      type="button"
                      @click="showSecretKey.payfastPassphrase = !showSecretKey.payfastPassphrase"
                      class="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
                    >
                      {{ showSecretKey.payfastPassphrase ? 'Hide' : 'Show' }}
                    </button>
                  </div>
                  <input
                    v-model="localPaymentSettings.gateways.payfast.passphrase"
                    :type="showSecretKey.payfastPassphrase ? 'text' : 'password'"
                    placeholder="Enter passphrase configured in PayFast portal"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                  />
                  <p class="text-[10px] text-neutral-400 mt-1">Recommended for preventing request tampering and verifying IPN callbacks.</p>
                </div>
              </div>
            </div>

            <!-- 2. Yoco Payments -->
            <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
              <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
                <div class="flex items-start sm:items-center gap-3.5">
                  <div class="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm shrink-0 font-mono">
                    YO
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs sm:text-sm font-bold text-neutral-900">{{ localPaymentSettings.gateways.yoco.name }}</h4>
                      <span
                        class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        :class="localPaymentSettings.gateways.yoco.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'"
                      >
                        {{ localPaymentSettings.gateways.yoco.enabled ? 'Enabled' : 'Disabled' }}
                      </span>
                    </div>
                    <p class="text-[11px] text-neutral-500 mt-0.5">{{ localPaymentSettings.gateways.yoco.description }}</p>
                    <div class="flex flex-wrap items-center gap-1.5 mt-2">
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Direct Card Checkout</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Apple Pay</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Google Pay</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Bank OTP Verified</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="localPaymentSettings.gateways.yoco.enabled" class="sr-only peer" />
                    <div class="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                  <button
                    type="button"
                    @click="toggleGatewayConfig('yoco')"
                    class="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-xs font-semibold hover:bg-neutral-100 cursor-pointer transition-colors"
                  >
                    {{ openGatewayConfig.yoco ? 'Hide Settings' : 'Configure' }}
                  </button>
                </div>
              </div>

              <!-- Yoco Config Drawer -->
              <div v-if="openGatewayConfig.yoco" class="p-5 border-t border-neutral-200 bg-white space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Public Key (Client Side) *</label>
                    <input
                      v-model="localPaymentSettings.gateways.yoco.publicKey"
                      type="text"
                      placeholder="pk_live_... or pk_test_..."
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-xs font-semibold text-neutral-700">Secret Key (Server Side) *</label>
                      <button
                        type="button"
                        @click="showSecretKey.yocoSecret = !showSecretKey.yocoSecret"
                        class="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
                      >
                        {{ showSecretKey.yocoSecret ? 'Hide' : 'Show' }}
                      </button>
                    </div>
                    <input
                      v-model="localPaymentSettings.gateways.yoco.secretKey"
                      :type="showSecretKey.yocoSecret ? 'text' : 'password'"
                      placeholder="sk_live_... or sk_test_..."
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">Webhook Secret Key (Optional)</label>
                  <input
                    v-model="localPaymentSettings.gateways.yoco.webhookSecret"
                    type="text"
                    placeholder="whsec_..."
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            <!-- 3. Ozow Instant EFT -->
            <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
              <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
                <div class="flex items-start sm:items-center gap-3.5">
                  <div class="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center font-bold text-purple-700 text-sm shrink-0 font-mono">
                    OZ
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs sm:text-sm font-bold text-neutral-900">{{ localPaymentSettings.gateways.ozow.name }}</h4>
                      <span
                        class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        :class="localPaymentSettings.gateways.ozow.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'"
                      >
                        {{ localPaymentSettings.gateways.ozow.enabled ? 'Enabled' : 'Disabled' }}
                      </span>
                    </div>
                    <p class="text-[11px] text-neutral-500 mt-0.5">{{ localPaymentSettings.gateways.ozow.description }}</p>
                    <div class="flex flex-wrap items-center gap-1.5 mt-2">
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">FNB</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Capitec</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Standard Bank</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">ABSA</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Nedbank</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Investec / TymeBank</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="localPaymentSettings.gateways.ozow.enabled" class="sr-only peer" />
                    <div class="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                  <button
                    type="button"
                    @click="toggleGatewayConfig('ozow')"
                    class="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-xs font-semibold hover:bg-neutral-100 cursor-pointer transition-colors"
                  >
                    {{ openGatewayConfig.ozow ? 'Hide Settings' : 'Configure' }}
                  </button>
                </div>
              </div>

              <!-- Ozow Config Drawer -->
              <div v-if="openGatewayConfig.ozow" class="p-5 border-t border-neutral-200 bg-white space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Site Code *</label>
                    <input
                      v-model="localPaymentSettings.gateways.ozow.siteCode"
                      type="text"
                      placeholder="YBS-001"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-xs font-semibold text-neutral-700">Private Key *</label>
                      <button
                        type="button"
                        @click="showSecretKey.ozowPrivate = !showSecretKey.ozowPrivate"
                        class="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
                      >
                        {{ showSecretKey.ozowPrivate ? 'Hide' : 'Show' }}
                      </button>
                    </div>
                    <input
                      v-model="localPaymentSettings.gateways.ozow.privateKey"
                      :type="showSecretKey.ozowPrivate ? 'text' : 'password'"
                      placeholder="Enter private key"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-xs font-semibold text-neutral-700">API Key *</label>
                      <button
                        type="button"
                        @click="showSecretKey.ozowApi = !showSecretKey.ozowApi"
                        class="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
                      >
                        {{ showSecretKey.ozowApi ? 'Hide' : 'Show' }}
                      </button>
                    </div>
                    <input
                      v-model="localPaymentSettings.gateways.ozow.apiKey"
                      :type="showSecretKey.ozowApi ? 'text' : 'password'"
                      placeholder="Enter API key"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. Payflex (Buy Now Pay Later) -->
            <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
              <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
                <div class="flex items-start sm:items-center gap-3.5">
                  <div class="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-sm shrink-0 font-mono">
                    PX
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs sm:text-sm font-bold text-neutral-900">{{ localPaymentSettings.gateways.payflex.name }}</h4>
                      <span
                        class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        :class="localPaymentSettings.gateways.payflex.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'"
                      >
                        {{ localPaymentSettings.gateways.payflex.enabled ? 'Enabled' : 'Disabled' }}
                      </span>
                    </div>
                    <p class="text-[11px] text-neutral-500 mt-0.5">{{ localPaymentSettings.gateways.payflex.description }}</p>
                    <div class="flex flex-wrap items-center gap-1.5 mt-2">
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Pay in 4 Installments</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">0% Interest to Customer</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Upfront Merchant Payout</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="localPaymentSettings.gateways.payflex.enabled" class="sr-only peer" />
                    <div class="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                  <button
                    type="button"
                    @click="toggleGatewayConfig('payflex')"
                    class="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-xs font-semibold hover:bg-neutral-100 cursor-pointer transition-colors"
                  >
                    {{ openGatewayConfig.payflex ? 'Hide Settings' : 'Configure' }}
                  </button>
                </div>
              </div>

              <!-- Payflex Config Drawer -->
              <div v-if="openGatewayConfig.payflex" class="p-5 border-t border-neutral-200 bg-white space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Payflex Merchant ID *</label>
                    <input
                      v-model="localPaymentSettings.gateways.payflex.merchantId"
                      type="text"
                      placeholder="PF-YBS-789"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-xs font-semibold text-neutral-700">API Key *</label>
                      <button
                        type="button"
                        @click="showSecretKey.payflexApi = !showSecretKey.payflexApi"
                        class="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
                      >
                        {{ showSecretKey.payflexApi ? 'Hide' : 'Show' }}
                      </button>
                    </div>
                    <input
                      v-model="localPaymentSettings.gateways.payflex.apiKey"
                      :type="showSecretKey.payflexApi ? 'text' : 'password'"
                      placeholder="Enter Payflex API key"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <label class="flex items-center gap-2.5 text-xs text-neutral-800 font-medium cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    v-model="localPaymentSettings.gateways.payflex.showWidgetOnProductPages"
                    class="rounded accent-neutral-900"
                  />
                  <span>Display "or 4 interest-free payments with Payflex" breakdown widget on product detail pages</span>
                </label>
              </div>
            </div>

            <!-- 5. Stripe (International Cards) -->
            <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
              <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
                <div class="flex items-start sm:items-center gap-3.5">
                  <div class="w-11 h-11 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-800 text-sm shrink-0 font-mono">
                    ST
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs sm:text-sm font-bold text-neutral-900">{{ localPaymentSettings.gateways.stripe.name }}</h4>
                      <span
                        class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        :class="localPaymentSettings.gateways.stripe.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'"
                      >
                        {{ localPaymentSettings.gateways.stripe.enabled ? 'Enabled' : 'Disabled' }}
                      </span>
                    </div>
                    <p class="text-[11px] text-neutral-500 mt-0.5">{{ localPaymentSettings.gateways.stripe.description }}</p>
                    <div class="flex flex-wrap items-center gap-1.5 mt-2">
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">International Cards</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">AMEX</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">USD / EUR / GBP</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="localPaymentSettings.gateways.stripe.enabled" class="sr-only peer" />
                    <div class="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                  <button
                    type="button"
                    @click="toggleGatewayConfig('stripe')"
                    class="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-xs font-semibold hover:bg-neutral-100 cursor-pointer transition-colors"
                  >
                    {{ openGatewayConfig.stripe ? 'Hide Settings' : 'Configure' }}
                  </button>
                </div>
              </div>

              <!-- Stripe Config Drawer -->
              <div v-if="openGatewayConfig.stripe" class="p-5 border-t border-neutral-200 bg-white space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Stripe Publishable Key *</label>
                    <input
                      v-model="localPaymentSettings.gateways.stripe.publishableKey"
                      type="text"
                      placeholder="pk_live_... or pk_test_..."
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-xs font-semibold text-neutral-700">Stripe Secret Key *</label>
                      <button
                        type="button"
                        @click="showSecretKey.stripeSecret = !showSecretKey.stripeSecret"
                        class="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
                      >
                        {{ showSecretKey.stripeSecret ? 'Hide' : 'Show' }}
                      </button>
                    </div>
                    <input
                      v-model="localPaymentSettings.gateways.stripe.secretKey"
                      :type="showSecretKey.stripeSecret ? 'text' : 'password'"
                      placeholder="sk_live_... or sk_test_..."
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 6. Manual EFT / Direct Bank Deposit -->
            <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
              <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
                <div class="flex items-start sm:items-center gap-3.5">
                  <div class="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-amber-800 text-sm shrink-0 font-mono">
                    EFT
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs sm:text-sm font-bold text-neutral-900">{{ localPaymentSettings.gateways.eft.name }}</h4>
                      <span
                        class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        :class="localPaymentSettings.gateways.eft.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'"
                      >
                        {{ localPaymentSettings.gateways.eft.enabled ? 'Enabled' : 'Disabled' }}
                      </span>
                    </div>
                    <p class="text-[11px] text-neutral-500 mt-0.5">{{ localPaymentSettings.gateways.eft.description }}</p>
                    <div class="flex flex-wrap items-center gap-1.5 mt-2">
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">{{ localPaymentSettings.gateways.eft.bankName }}</span>
                      <span class="text-[9px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-mono">Acc: •••• {{ (localPaymentSettings.gateways.eft.accountNumber || '').slice(-4) }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="localPaymentSettings.gateways.eft.enabled" class="sr-only peer" />
                    <div class="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                  <button
                    type="button"
                    @click="toggleGatewayConfig('eft')"
                    class="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-xs font-semibold hover:bg-neutral-100 cursor-pointer transition-colors"
                  >
                    {{ openGatewayConfig.eft ? 'Hide Settings' : 'Configure' }}
                  </button>
                </div>
              </div>

              <!-- Manual EFT Config Drawer -->
              <div v-if="openGatewayConfig.eft" class="p-5 border-t border-neutral-200 bg-white space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Bank Name *</label>
                    <input
                      v-model="localPaymentSettings.gateways.eft.bankName"
                      type="text"
                      placeholder="First National Bank (FNB)"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Account Holder Name *</label>
                    <input
                      v-model="localPaymentSettings.gateways.eft.accountHolder"
                      type="text"
                      placeholder="Yellow Berry Store (Pty) Ltd"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Account Number *</label>
                    <input
                      v-model="localPaymentSettings.gateways.eft.accountNumber"
                      type="text"
                      placeholder="62849102938"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Branch Code *</label>
                    <input
                      v-model="localPaymentSettings.gateways.eft.branchCode"
                      type="text"
                      placeholder="250655"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Account Type</label>
                    <input
                      v-model="localPaymentSettings.gateways.eft.accountType"
                      type="text"
                      placeholder="Business Cheque Account"
                      class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">Customer Payment Instructions</label>
                  <textarea
                    v-model="localPaymentSettings.gateways.eft.instructions"
                    rows="2"
                    placeholder="e.g. Please use your Order Number (#YBS-...) as reference and email POP to payments@yellowberry.store"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- 7. Studio Pickup / COD -->
            <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
              <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
                <div class="flex items-start sm:items-center gap-3.5">
                  <div class="w-11 h-11 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center font-bold text-green-700 text-sm shrink-0 font-mono">
                    CP
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs sm:text-sm font-bold text-neutral-900">{{ localPaymentSettings.gateways.cod.name }}</h4>
                      <span
                        class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        :class="localPaymentSettings.gateways.cod.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'"
                      >
                        {{ localPaymentSettings.gateways.cod.enabled ? 'Enabled' : 'Disabled' }}
                      </span>
                    </div>
                    <p class="text-[11px] text-neutral-500 mt-0.5">{{ localPaymentSettings.gateways.cod.description }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="localPaymentSettings.gateways.cod.enabled" class="sr-only peer" />
                    <div class="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                  <button
                    type="button"
                    @click="toggleGatewayConfig('cod')"
                    class="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-xs font-semibold hover:bg-neutral-100 cursor-pointer transition-colors"
                  >
                    {{ openGatewayConfig.cod ? 'Hide Settings' : 'Configure' }}
                  </button>
                </div>
              </div>

              <!-- COD Config Drawer -->
              <div v-if="openGatewayConfig.cod" class="p-5 border-t border-neutral-200 bg-white space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">Studio Collection Address &amp; Instructions</label>
                  <textarea
                    v-model="localPaymentSettings.gateways.cod.instructions"
                    rows="2"
                    placeholder="Studio 4, The Palms Centre, 145 Sir Lowry Rd, Woodstock, Cape Town"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Store Currency & Tax Settings -->
        <div class="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
          <div class="pb-3 border-b border-neutral-100">
            <h3 class="text-sm font-bold text-neutral-900">Currency, Taxes &amp; Checkout Rules</h3>
            <p class="text-xs text-neutral-500">Configure store pricing display, regional VAT rate, and checkout preferences.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Store Base Currency</label>
              <select
                v-model="localPaymentSettings.general.currency"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold focus:outline-none focus:border-neutral-900"
              >
                <option value="ZAR">ZAR - South African Rand (R)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Currency Symbol</label>
              <input
                v-model="localPaymentSettings.general.currencySymbol"
                type="text"
                placeholder="R"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Value-Added Tax (VAT Rate %)</label>
              <input
                v-model="localPaymentSettings.general.vatRate"
                type="number"
                step="0.1"
                placeholder="15"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <label class="flex items-center gap-2.5 text-xs text-neutral-800 font-medium cursor-pointer">
              <input
                type="checkbox"
                v-model="localPaymentSettings.general.pricesIncludeTax"
                class="rounded accent-neutral-900"
              />
              <span>Product prices include VAT</span>
            </label>

            <label class="flex items-center gap-2.5 text-xs text-neutral-800 font-medium cursor-pointer">
              <input
                type="checkbox"
                v-model="localPaymentSettings.general.autoCapture"
                class="rounded accent-neutral-900"
              />
              <span>Auto-capture payments immediately</span>
            </label>

            <label class="flex items-center gap-2.5 text-xs text-neutral-800 font-medium cursor-pointer">
              <input
                type="checkbox"
                v-model="localPaymentSettings.general.sendReceiptEmails"
                class="rounded accent-neutral-900"
              />
              <span>Send payment receipt email</span>
            </label>
          </div>
        </div>

        <!-- Section 3: Payout Bank Account Routing -->
        <div class="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
          <div class="pb-3 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-neutral-900">Store Payout Account (Revenue Deposits)</h3>
              <p class="text-xs text-neutral-500">Destination bank account where gateway settlements and direct EFTs are deposited.</p>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-mono">
              South Africa (ZAR)
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Registered Bank Name *</label>
              <input
                v-model="localPaymentSettings.payouts.bankName"
                type="text"
                placeholder="First National Bank (FNB)"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 font-medium"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Account Holder Name *</label>
              <input
                v-model="localPaymentSettings.payouts.accountHolder"
                type="text"
                placeholder="Yellow Berry Store (Pty) Ltd"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 font-medium"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-semibold text-neutral-700">Account Number *</label>
                <button
                  type="button"
                  @click="showBankAccount = !showBankAccount"
                  class="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
                >
                  {{ showBankAccount ? 'Mask' : 'Reveal' }}
                </button>
              </div>
              <input
                v-model="localPaymentSettings.payouts.accountNumber"
                :type="showBankAccount ? 'text' : 'password'"
                placeholder="62849102938"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Branch Code *</label>
              <input
                v-model="localPaymentSettings.payouts.branchCode"
                type="text"
                placeholder="250655"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Account Type</label>
              <select
                v-model="localPaymentSettings.payouts.accountType"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900 font-medium"
              >
                <option value="Cheque / Current">Cheque / Current Account</option>
                <option value="Savings">Savings Account</option>
                <option value="Transmission">Transmission Account</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Payout Schedule</label>
              <select
                v-model="localPaymentSettings.payouts.schedule"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-neutral-900 font-medium"
              >
                <option value="daily">Daily Settlements</option>
                <option value="weekly">Weekly (Every Monday)</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Settlement Notice Email</label>
              <input
                v-model="localPaymentSettings.payouts.payoutEmail"
                type="email"
                placeholder="billing@yellowberry.store"
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>
        </div>

        <!-- Sticky Bottom Save Bar -->
        <div class="p-4 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full bg-[#84CC16] inline-block animate-pulse"></span>
            <div class="text-xs">
              <span class="font-bold text-white block">{{ activePaymentGatewaysCount }} Payment Gateways Configured</span>
              <span class="text-neutral-400">Settings sync in real-time across checkout and admin with Firestore &amp; local caching.</span>
            </div>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              @click="handleResetPaymentDefaults"
              class="px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-xs font-semibold cursor-pointer transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              @click="handleSavePayments"
              :disabled="savingPayments"
              class="px-5 py-2 rounded-xl bg-[#F4EB6A] text-neutral-900 text-xs font-bold hover:bg-[#FAF7BA] cursor-pointer transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <FlowbiteIcon v-if="savingPayments" name="refresh" size="14" class="animate-spin" />
              <span>{{ savingPayments ? 'Saving...' : 'Save All Payment Settings' }}</span>
            </button>
          </div>
        </div>
      </div>
      <!-- ==========================================
           TAB 8C: SETTINGS - MANAGE USERS (USER REQUIREMENT)
           ========================================== -->
      <div v-else-if="activeSection === 'settings-users'" class="space-y-6">
        <!-- Header & Action Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2 text-[#F4EB6A]">
              <FlowbiteIcon name="users" size="20" stroke-width="1.8" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Settings /</span>
                <h2 class="text-xl font-bold text-neutral-900">Manage Users &amp; Team Access</h2>
              </div>
              <p class="text-xs text-neutral-500">Control administrator privileges, invite store staff, assign roles, and manage permissions.</p>
            </div>
          </div>

          <div class="flex items-center gap-2.5">
            <button
              type="button"
              @click="openAddUserModal"
              class="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
            >
              <FlowbiteIcon name="user-add" size="14" stroke-width="2" />
              <span>+ Add Team Member</span>
            </button>
          </div>
        </div>

        <!-- Settings Sub-Navigation Header -->
        <div class="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl w-fit">
          <button
            type="button"
            @click="activeSection = 'settings'"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-600 hover:text-neutral-900"
          >
            General
          </button>
          <button
            type="button"
            @click="activeSection = 'settings-payments'"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
          >
            <FlowbiteIcon name="credit-card" size="14" />
            <span>Payments</span>
            <span class="text-[9px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded-full font-bold">
              {{ activePaymentGatewaysCount }} Active
            </span>
          </button>
          <button
            type="button"
            @click="activeSection = 'settings-users'"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors bg-white text-neutral-900 shadow-2xs flex items-center gap-1.5"
          >
            <FlowbiteIcon name="users" size="14" />
            <span>Manage Users</span>
            <span class="text-[9px] bg-neutral-900 text-[#F4EB6A] px-1.5 py-0.2 rounded-full font-bold">
              {{ adminUsers?.length || 0 }} Users
            </span>
          </button>
        </div>

        <!-- 4 Quick Metric Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 rounded-2xl border border-neutral-200 bg-white shadow-2xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
              <FlowbiteIcon name="users" size="18" />
            </div>
            <div>
              <span class="text-xl font-extrabold text-neutral-900 font-mono">{{ adminUsers?.length || 0 }}</span>
              <p class="text-[11px] text-neutral-500 font-medium">Total Staff Members</p>
            </div>
          </div>

          <div class="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 shadow-2xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <FlowbiteIcon name="shield-check" size="18" />
            </div>
            <div>
              <span class="text-xl font-extrabold text-purple-900 font-mono">{{ activeAdminsCount }}</span>
              <p class="text-[11px] text-purple-700 font-medium">Super Admin(s)</p>
            </div>
          </div>

          <div class="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-2xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <FlowbiteIcon name="check" size="18" />
            </div>
            <div>
              <span class="text-xl font-extrabold text-emerald-900 font-mono">{{ activeStaffCount }}</span>
              <p class="text-[11px] text-emerald-700 font-medium">Active Accounts</p>
            </div>
          </div>

          <div class="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-2xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <FlowbiteIcon name="clock" size="18" />
            </div>
            <div>
              <span class="text-xl font-extrabold text-amber-900 font-mono">{{ pendingInvitesCount }}</span>
              <p class="text-[11px] text-amber-700 font-medium">Pending Invitations</p>
            </div>
          </div>
        </div>

        <!-- ==========================================
             ACTIVE SUPER ADMIN USER CARD (MOVED HERE FROM GENERAL SETTINGS)
             ========================================== -->
        <div class="p-6 rounded-2xl border-2 border-[#F5C542]/40 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 shadow-sm space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="relative">
                <img
                  :src="adminAvatarUrl"
                  :alt="currentUser?.displayName || 'Laban Le Fleur'"
                  class="w-16 h-16 rounded-2xl object-cover border-2 border-[#F5C542] shadow-sm"
                />
                <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Online now"></span>
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-base font-bold text-neutral-900">{{ currentUser?.displayName || 'Laban Le Fleur' }}</h3>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4EB6A] text-neutral-900 border border-[#F5C542]">
                    Super User Admin
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900 text-white">
                    Primary Store Owner
                  </span>
                </div>
                <p class="text-xs text-neutral-600 mt-0.5">{{ currentUser?.email || 'laban@yellowberry.store' }}</p>
                <p class="text-[11px] text-neutral-500 mt-1 flex items-center gap-1.5">
                  <span class="font-medium text-neutral-700">Access Scope:</span>
                  <span class="text-neutral-600">Full Unrestricted System Access (Catalog, Orders, Customers, Banking, Team Roles)</span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <button
                type="button"
                @click="$emit('view-storefront')"
                class="px-4 py-2 rounded-xl bg-neutral-900 text-[#F4EB6A] text-xs font-semibold cursor-pointer hover:bg-neutral-800 transition-colors shadow-2xs"
              >
                Storefront
              </button>
              <button
                type="button"
                @click="handleSignOut"
                class="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-200/80 text-xs">
            <div class="p-3 rounded-xl bg-white/80 border border-neutral-200">
              <span class="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Authentication State</span>
              <span class="font-semibold text-neutral-900 flex items-center gap-1.5 mt-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active Firebase Auth Session</span>
              </span>
            </div>
            <div class="p-3 rounded-xl bg-white/80 border border-neutral-200">
              <span class="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Cloud Firestore</span>
              <span class="font-mono font-semibold text-neutral-900 mt-0.5 block">ystore-db (eur3)</span>
            </div>
            <div class="p-3 rounded-xl bg-white/80 border border-neutral-200">
              <span class="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Storage Asset Bucket</span>
              <span class="font-mono font-semibold text-neutral-900 mt-0.5 block truncate">ystore-db.firebasestorage.app</span>
            </div>
          </div>
        </div>

        <!-- ==========================================
             ADD / EDIT TEAM MEMBER FORM (EXPANDABLE DRAWER)
             ========================================== -->
        <div
          v-if="showUserForm"
          class="p-6 rounded-2xl border-2 border-neutral-900 bg-white space-y-5 shadow-lg transition-all"
        >
          <div class="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-neutral-900 text-[#F4EB6A] flex items-center justify-center">
                <FlowbiteIcon :name="editingUserId ? 'user' : 'user-add'" size="16" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-neutral-900">
                  {{ editingUserId ? 'Edit Team Member Privileges' : 'Add New Team Member / Staff Invitation' }}
                </h3>
                <p class="text-[11px] text-neutral-500">
                  {{ editingUserId ? 'Update role assignments and access permissions for this account.' : 'Create credentials and grant granular administrative permissions.' }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="showUserForm = false"
              class="w-8 h-8 rounded-lg border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
            >
              <FlowbiteIcon name="close" size="14" />
            </button>
          </div>

          <form @submit.prevent="handleSaveUser" class="space-y-4">
            <!-- Row 1: Name, Email, Phone -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
                <input
                  v-model="userForm.name"
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Email Address *</label>
                <input
                  v-model="userForm.email"
                  type="email"
                  required
                  placeholder="user@yellowberry.store"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Phone / Mobile (Optional)</label>
                <input
                  v-model="userForm.phone"
                  type="tel"
                  placeholder="+27 (0) 82 123 4567"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>
            </div>

            <!-- Row 2: Department & Role Selector -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Department / Job Title</label>
                <input
                  v-model="userForm.department"
                  type="text"
                  placeholder="e.g. Retail Operations &amp; Merchandising"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Assigned Role *</label>
                <select
                  v-model="userForm.role"
                  @change="onRoleChange"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900 cursor-pointer"
                >
                  <option v-for="r in userRoles" :key="r.id" :value="r.id">
                    {{ r.label }} — {{ r.description }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Role Description Box -->
            <div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs flex items-start gap-2.5">
              <FlowbiteIcon name="shield-check" size="16" class="text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <span class="font-bold text-neutral-900">Role Preset: {{ userForm.role }}</span>
                <p class="text-neutral-600 text-[11px] mt-0.5">
                  {{ userRoles.find(r => r.id === userForm.role)?.description }}
                </p>
              </div>
            </div>

            <!-- Granular Permissions Matrix -->
            <div class="space-y-2 pt-2">
              <label class="block text-xs font-semibold text-neutral-800">
                Granular Permissions &amp; Access Controls
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                <label
                  v-for="perm in availablePermissions"
                  :key="perm.id"
                  class="p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5"
                  :class="userForm.permissions.includes(perm.id) ? 'bg-amber-50/60 border-amber-300' : 'bg-white border-neutral-200 hover:border-neutral-300'"
                >
                  <input
                    type="checkbox"
                    :value="perm.id"
                    v-model="userForm.permissions"
                    class="rounded accent-neutral-900 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span class="block text-xs font-bold text-neutral-900">{{ perm.label }}</span>
                    <span class="block text-[10px] text-neutral-500 mt-0.5 leading-tight">{{ perm.desc }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Row 3: Account Status & Invitation Options -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Account Status</label>
                <div class="flex items-center gap-3">
                  <label class="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                    <input type="radio" value="active" v-model="userForm.status" class="accent-neutral-900" />
                    <span class="flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Active</span>
                    </span>
                  </label>
                  <label class="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                    <input type="radio" value="invited" v-model="userForm.status" class="accent-neutral-900" />
                    <span class="flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Invited (Pending Confirmation)</span>
                    </span>
                  </label>
                  <label class="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                    <input type="radio" value="suspended" v-model="userForm.status" class="accent-neutral-900" />
                    <span class="flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>Suspended</span>
                    </span>
                  </label>
                </div>
              </div>

              <div class="space-y-1">
                <label class="flex items-center gap-2.5 text-xs text-neutral-800 font-semibold cursor-pointer">
                  <input type="checkbox" v-model="userForm.sendInviteEmail" class="rounded accent-neutral-900" />
                  <span>Send email instructions to set password &amp; access portal</span>
                </label>
                <p class="text-[11px] text-neutral-500 pl-6">
                  Provisions account credentials and dispatches password creation instructions to their inbox.
                </p>
              </div>
            </div>

            <!-- Form Action Buttons -->
            <div class="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="showUserForm = false"
                class="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="savingUser"
                class="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <FlowbiteIcon v-if="savingUser" name="arrow-path" size="14" class="animate-spin" />
                <span>{{ savingUser ? 'Saving & Sending Instructions...' : (editingUserId ? 'Save User Privileges' : 'Invite / Add Team Member') }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- ==========================================
             TEAM MEMBERS & STAFF ROSTER TABLE
             ========================================== -->
        <div class="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-2xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div>
              <h3 class="text-sm font-bold text-neutral-900">Staff Members &amp; Administrators</h3>
              <p class="text-xs text-neutral-500">Listing all active and invited personnel with access to the store dashboard.</p>
            </div>

            <!-- Filter Controls & Search -->
            <div class="flex flex-wrap items-center gap-2.5">
              <div class="relative">
                <input
                  v-model="userSearchQuery"
                  type="text"
                  placeholder="Filter name, email..."
                  class="pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 w-44 sm:w-56"
                />
                <FlowbiteIcon name="search" size="13" class="absolute left-2.5 top-2.5 text-neutral-400" />
              </div>

              <!-- Filter by Role -->
              <select
                v-model="userRoleFilter"
                class="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs focus:outline-none focus:border-neutral-900 font-medium cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option v-for="r in userRoles" :key="r.id" :value="r.id">{{ r.label }}</option>
              </select>

              <!-- Filter by Status -->
              <select
                v-model="userStatusFilter"
                class="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs focus:outline-none focus:border-neutral-900 font-medium cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-neutral-50 text-neutral-500 uppercase text-[10px] tracking-wider border-y border-neutral-200">
                <tr>
                  <th class="py-3 px-4 font-bold">Team Member</th>
                  <th class="py-3 px-4 font-bold">Role &amp; Department</th>
                  <th class="py-3 px-4 font-bold">Permissions</th>
                  <th class="py-3 px-4 font-bold">Status</th>
                  <th class="py-3 px-4 font-bold">Joined / Active</th>
                  <th class="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100">
                <tr
                  v-for="user in filteredAdminUsers"
                  :key="user.id"
                  class="hover:bg-neutral-50/70 transition-colors"
                >
                  <!-- Member Name & Email -->
                  <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-neutral-900 text-[#F4EB6A] font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                        {{ user.name ? user.name.charAt(0) : 'U' }}
                      </div>
                      <div>
                        <div class="flex items-center gap-1.5">
                          <span class="font-bold text-neutral-900">{{ user.name }}</span>
                          <span
                            v-if="user.isPrimary"
                            class="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300"
                            title="Primary Super Administrator"
                          >
                            Primary
                          </span>
                        </div>
                        <span class="text-neutral-500 text-[11px] block">{{ user.email }}</span>
                        <span v-if="user.phone" class="text-neutral-400 text-[10px] block font-mono">{{ user.phone }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Role & Department -->
                  <td class="py-3.5 px-4">
                    <div>
                      <span
                        class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                        :class="[
                          user.role === 'Super Admin' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                          user.role === 'Store Manager' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                          user.role === 'Order Fulfillment' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          user.role === 'Content Editor' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                          'bg-indigo-100 text-indigo-900 border border-indigo-200'
                        ]"
                      >
                        {{ user.role }}
                      </span>
                      <span class="text-[11px] text-neutral-500 block mt-0.5">{{ user.department || 'Operations' }}</span>
                    </div>
                  </td>

                  <!-- Permissions -->
                  <td class="py-3.5 px-4">
                    <div class="flex flex-wrap items-center gap-1 max-w-xs">
                      <span
                        v-if="user.role === 'Super Admin' || (user.permissions && user.permissions.length >= 7)"
                        class="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-900 text-[#F4EB6A]"
                      >
                        Full System Access
                      </span>
                      <template v-else-if="user.permissions && user.permissions.length">
                        <span
                          v-for="p in user.permissions.slice(0, 3)"
                          :key="p"
                          class="text-[9px] font-medium px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700"
                        >
                          {{ p.replace('manage_', '') }}
                        </span>
                        <span v-if="user.permissions.length > 3" class="text-[9px] font-bold text-neutral-400">
                          +{{ user.permissions.length - 3 }} more
                        </span>
                      </template>
                      <span v-else class="text-[10px] text-neutral-400 italic">No permissions</span>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="py-3.5 px-4">
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                      :class="[
                        user.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        user.status === 'invited' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      ]"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        :class="[
                          user.status === 'active' ? 'bg-emerald-600' :
                          user.status === 'invited' ? 'bg-amber-600 animate-pulse' :
                          'bg-red-600'
                        ]"
                      ></span>
                      <span class="capitalize">{{ user.status }}</span>
                    </span>
                  </td>

                  <!-- Joined / Active -->
                  <td class="py-3.5 px-4 text-[11px] text-neutral-600">
                    <div>
                      <span class="block text-neutral-900 font-medium">{{ user.lastActive || 'Recently' }}</span>
                      <span class="block text-neutral-400 text-[10px]">Since {{ user.joinedDate || '2024' }}</span>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="py-3.5 px-4 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <!-- Send / Resend Email Instructions Button -->
                      <button
                        type="button"
                        :disabled="sendingInviteId === user.id"
                        @click="handleSendInviteEmail(user)"
                        class="p-1.5 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-[#F4EB6A] text-neutral-700 cursor-pointer transition-colors"
                        :title="`Send or resend email setup instructions to ${user.email}`"
                      >
                        <FlowbiteIcon v-if="sendingInviteId !== user.id" name="mail" size="13" />
                        <svg v-else class="animate-spin w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                      </button>

                      <!-- Direct Mailer Fallback Button -->
                      <button
                        type="button"
                        @click="openDirectMail(user)"
                        class="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 cursor-pointer transition-colors"
                        title="Open email composer with pre-filled access instructions"
                      >
                        <FlowbiteIcon name="share" size="13" />
                      </button>

                      <!-- Edit Button -->
                      <button
                        type="button"
                        @click="openEditUserModal(user)"
                        class="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 cursor-pointer transition-colors"
                        title="Edit User Role &amp; Permissions"
                      >
                        <FlowbiteIcon name="edit" size="13" />
                      </button>

                      <!-- Suspend / Activate Button (disabled on primary Super Admin) -->
                      <button
                        v-if="!user.isPrimary"
                        type="button"
                        @click="toggleUserStatus(user)"
                        class="p-1.5 rounded-lg border text-xs cursor-pointer transition-colors"
                        :class="user.status === 'suspended' ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' : 'border-amber-200 text-amber-700 hover:bg-amber-50'"
                        :title="user.status === 'suspended' ? 'Re-activate account' : 'Suspend account access'"
                      >
                        <FlowbiteIcon :name="user.status === 'suspended' ? 'check' : 'lock'" size="13" />
                      </button>

                      <!-- Delete User Button (disabled on primary Super Admin) -->
                      <button
                        v-if="!user.isPrimary"
                        type="button"
                        @click="handleDeleteUser(user)"
                        class="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Remove user from store team"
                      >
                        <FlowbiteIcon name="trash" size="13" />
                      </button>

                      <span
                        v-else
                        class="p-1.5 text-neutral-300 cursor-not-allowed"
                        title="Primary account cannot be modified or removed"
                      >
                        <FlowbiteIcon name="lock" size="13" />
                      </span>
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-if="!filteredAdminUsers.length">
                  <td colspan="6" class="py-12 text-center text-xs">
                    <div class="flex flex-col items-center justify-center space-y-2">
                      <div class="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <FlowbiteIcon name="users" size="22" stroke-width="1.6" />
                      </div>
                      <p class="font-bold text-neutral-800 text-sm">No team members added yet</p>
                      <p class="text-[11px] text-neutral-400 max-w-sm">
                        You have not invited or added any staff users yet. Click below to add your first store team member.
                      </p>
                      <button
                        type="button"
                        @click="openAddUserModal"
                        class="mt-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        + Add First Team Member
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TAB 8.4: SETTINGS - SEO, ANALYTICS & CONVERSION PIXELS
           ========================================== -->
      <div v-else-if="activeSection === 'settings-seo'" class="space-y-6">
        <div class="pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 p-2 text-[#F4EB6A]">
              <FlowbiteIcon name="chart" size="20" stroke-width="2" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Settings /</span>
                <h2 class="text-xl font-bold text-neutral-900">Tracking, Analytics &amp; SEO</h2>
              </div>
              <p class="text-xs text-neutral-500">Edit your Google GTM Tag, Meta Pixel, Google Analytics 4, and page SEO metadata for the live site.</p>
            </div>
          </div>

          <div class="flex items-center gap-2.5">
            <button
              type="button"
              @click="handleSaveTracking"
              :disabled="isSavingSeo"
              class="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <FlowbiteIcon v-if="isSavingSeo" name="refresh" size="14" class="animate-spin" />
              <span>{{ isSavingSeo ? 'Syncing...' : 'Save Tracking Settings' }}</span>
            </button>
          </div>
        </div>

        <!-- Settings Sub-Navigation Header -->
        <div class="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl w-fit">
          <button
            type="button"
            @click="activeSection = 'settings'"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-600 hover:text-neutral-900"
          >
            General
          </button>
          <button
            type="button"
            @click="activeSection = 'settings-payments'"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
          >
            <FlowbiteIcon name="credit-card" size="14" />
            <span>Payments</span>
            <span class="text-[9px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded-full font-bold">
              {{ activePaymentGatewaysCount }} Active
            </span>
          </button>
          <button
            type="button"
            @click="activeSection = 'settings-users'"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
          >
            <FlowbiteIcon name="users" size="14" />
            <span>Manage Users</span>
            <span class="text-[9px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded-full font-bold">
              {{ adminUsers?.length || 0 }}
            </span>
          </button>
          <button
            type="button"
            @click="activeSection = 'settings-seo'"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors bg-white text-neutral-900 shadow-2xs flex items-center gap-1.5"
          >
            <FlowbiteIcon name="chart" size="14" />
            <span>Analytics &amp; SEO</span>
          </button>
        </div>

        <!-- Live Sync Status Banner -->
        <div class="bg-neutral-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-neutral-800 shadow-sm">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2.5 h-2.5 rounded-full bg-[#84CC16] shadow-[0_0_8px_#84CC16] inline-block animate-pulse"></span>
              <span class="text-xs font-bold text-[#F4EB6A] uppercase tracking-wider">Live Storefront Telemetry Active</span>
            </div>
            <p class="text-xs text-neutral-300 font-light max-w-2xl">
              Changes saved here instantly propagate to the live storefront (<code class="text-white font-semibold">https://ystoreza.co.za/</code>). Scripts are injected dynamically and strictly comply with Section 11 of POPIA cookie consent.
            </p>
          </div>
        </div>

        <!-- Analytics & Pixels Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- 1. Google Analytics 4 (GA4) -->
          <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4 hover:border-neutral-300 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-neutral-900 block">Google Analytics 4</span>
                <span class="text-[11px] text-neutral-400">Measurement ID</span>
              </div>
              <label class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 cursor-pointer">
                <input v-model="trackingConfig.enableGa4" type="checkbox" class="accent-neutral-900 w-4 h-4 rounded cursor-pointer" />
                <span>Active</span>
              </label>
            </div>
            <div>
              <label class="text-[11px] font-semibold text-neutral-600 block mb-1">Measurement ID (G-XXXXXXXXXX)</label>
              <input
                v-model="trackingConfig.ga4Id"
                type="text"
                placeholder="G-XJ3BF4MRDF"
                class="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-neutral-900"
              />
            </div>
            <p class="text-[11px] text-neutral-400 leading-relaxed font-light">
              Injects <code class="text-neutral-700 font-semibold">gtag.js</code> and fires real-time pageviews, view_item, add_to_cart, and purchases.
            </p>
          </div>

          <!-- 2. Google Tag Manager (GTM) -->
          <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4 hover:border-neutral-300 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-neutral-900 block">Google Tag Manager</span>
                <span class="text-[11px] text-neutral-400">Container ID</span>
              </div>
              <label class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 cursor-pointer">
                <input v-model="trackingConfig.enableGtm" type="checkbox" class="accent-neutral-900 w-4 h-4 rounded cursor-pointer" />
                <span>Active</span>
              </label>
            </div>
            <div>
              <label class="text-[11px] font-semibold text-neutral-600 block mb-1">Container ID (GTM-XXXXXXX)</label>
              <input
                v-model="trackingConfig.gtmId"
                type="text"
                placeholder="GTM-WSLWFLHM"
                class="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-neutral-900"
              />
            </div>
            <p class="text-[11px] text-neutral-400 leading-relaxed font-light">
              Orchestrates triggers and tags via <code class="text-neutral-700 font-semibold">window.dataLayer</code> with automatic noscript fallback.
            </p>
          </div>

          <!-- 3. Meta Pixel (Facebook Pixel) -->
          <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4 hover:border-neutral-300 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-neutral-900 block">Meta Pixel</span>
                <span class="text-[11px] text-neutral-400">Dataset / Pixel ID</span>
              </div>
              <label class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 cursor-pointer">
                <input v-model="trackingConfig.enableMetaPixel" type="checkbox" class="accent-neutral-900 w-4 h-4 rounded cursor-pointer" />
                <span>Active</span>
              </label>
            </div>
            <div>
              <label class="text-[11px] font-semibold text-neutral-600 block mb-1">Numeric Pixel ID</label>
              <input
                v-model="trackingConfig.metaPixelId"
                type="text"
                placeholder="3007632809594306"
                class="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-neutral-900"
              />
            </div>
            <p class="text-[11px] text-neutral-400 leading-relaxed font-light">
              Initializes <code class="text-neutral-700 font-semibold">fbevents.js</code> and triggers PageView, AddToCart, InitiateCheckout &amp; Purchase events.
            </p>
          </div>

          <!-- 4. Google AdSense -->
          <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4 hover:border-neutral-300 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-neutral-900 block">Google AdSense</span>
                <span class="text-[11px] text-neutral-400">Publisher ID</span>
              </div>
              <label class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 cursor-pointer">
                <input v-model="trackingConfig.enableAdsense" type="checkbox" class="accent-neutral-900 w-4 h-4 rounded cursor-pointer" />
                <span>Active</span>
              </label>
            </div>
            <div>
              <label class="text-[11px] font-semibold text-neutral-600 block mb-1">Publisher ID (ca-pub-...)</label>
              <input
                v-model="trackingConfig.adsensePublisherId"
                type="text"
                placeholder="ca-pub-1234567890123456"
                class="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-neutral-900"
              />
            </div>
            <p class="text-[11px] text-neutral-400 leading-relaxed font-light">
              Injects AdSense verification tag into the storefront head for domain ownership verification.
            </p>
          </div>
        </div>

        <!-- Page-Level SEO Metadata Editor -->
        <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-6">
          <div class="border-b border-neutral-100 pb-3">
            <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Search Engine Optimization</span>
            <h3 class="text-base font-bold text-neutral-900">Website Page Titles &amp; Meta Descriptions</h3>
            <p class="text-xs text-neutral-500 font-light">Customize page-level meta tags to optimize Google search ranking and social preview cards.</p>
          </div>

          <div class="space-y-4">
            <div
              v-for="(page, key) in pagesSeo"
              :key="key"
              class="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 space-y-3"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-bold uppercase">{{ key }}</span>
                  <span class="text-xs font-bold text-neutral-900">{{ page.label }}</span>
                </div>
                <span class="text-[11px] text-neutral-400 font-mono">{{ page.path }}</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-semibold text-neutral-600 block mb-1">Page Title</label>
                  <input
                    v-model="page.title"
                    type="text"
                    class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs bg-white focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="text-[11px] font-semibold text-neutral-600 block mb-1">Meta Description</label>
                  <input
                    v-model="page.description"
                    type="text"
                    class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs bg-white focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button
              type="button"
              @click="handleSaveTracking"
              :disabled="isSavingSeo"
              class="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <FlowbiteIcon v-if="isSavingSeo" name="refresh" size="14" class="animate-spin" />
              <span>{{ isSavingSeo ? 'Syncing...' : 'Save All SEO &amp; Tracking Tags' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TAB: THEME GUARANTEE STATS (TRUST BADGES)
           (USER REQUIREMENT: Editable under banner)
           ========================================== -->
      <div v-else-if="activeSection === 'guarantee-stats'" class="space-y-6">
        <!-- Section Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div>
            <nav class="flex items-center gap-1.5 text-xs text-neutral-400 mb-1" aria-label="Breadcrumb">
              <span>Theme</span>
              <span>&gt;</span>
              <span class="text-neutral-900 font-medium">Guarantee Stats</span>
            </nav>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Guarantee Stats &amp; Trust Badges
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 max-w-xl mt-1">
              Customise the 4 trust &amp; guarantee badges displayed directly beneath the home banner (e.g. Free shipping, Secure payments, Easy Returns, 24/7 Support).
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              @click="handleResetGuaranteeStats"
              class="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset to default 4 guarantee badges"
            >
              <FlowbiteIcon name="refresh" size="14" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              @click="openCreateGuaranteeStatModal"
              class="btn-primary text-xs !py-2.5 !px-4 inline-flex items-center gap-2 shadow-sm"
            >
              <FlowbiteIcon name="plus" size="14" stroke-width="2" />
              <span>Add Guarantee Stat</span>
            </button>
          </div>
        </div>

        <!-- Guarantee Stats Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="stat in guaranteeStats"
            :key="stat.id"
            class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 relative group"
            :class="{ 'opacity-60 bg-neutral-50/50': stat.enabled === false }"
          >
            <!-- Card Content Header -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-xl bg-[#FAF7BA]/60 text-neutral-900 flex items-center justify-center shrink-0 border border-[#F4EB6A]/40 overflow-hidden">
                  <img
                    v-if="stat.icon && (stat.icon.includes('/') || stat.icon.startsWith('data:'))"
                    :src="useAsset(stat.icon)"
                    :alt="stat.title"
                    class="w-6 h-6 object-contain"
                  />
                  <FlowbiteIcon
                    v-else
                    :name="stat.icon || 'shield-check'"
                    size="22"
                    class="text-neutral-900"
                  />
                </div>

                <div class="flex items-center gap-1">
                  <span
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    :class="stat.enabled !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'"
                  >
                    {{ stat.enabled !== false ? 'Active' : 'Hidden' }}
                  </span>
                  <span class="text-[10px] text-neutral-400 font-mono px-1.5 py-0.5 bg-neutral-100 rounded">
                    #{{ stat.order || 1 }}
                  </span>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-bold text-neutral-900 line-clamp-1">{{ stat.title }}</h3>
                <p class="text-xs text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {{ stat.description }}
                </p>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="pt-3 border-t border-neutral-100 flex items-center justify-between gap-1">
              <button
                type="button"
                @click="handleToggleGuaranteeStat(stat)"
                class="text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                :class="stat.enabled !== false ? 'text-neutral-500 hover:text-neutral-900' : 'text-emerald-700 font-bold'"
                :title="stat.enabled !== false ? 'Hide from storefront' : 'Show on storefront'"
              >
                <FlowbiteIcon :name="stat.enabled !== false ? 'eye-off' : 'eye'" size="14" />
              </button>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="openEditGuaranteeStatModal(stat)"
                  class="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Edit Guarantee Stat"
                >
                  <FlowbiteIcon name="edit" size="14" />
                </button>
                <button
                  type="button"
                  @click="handleDeleteGuaranteeStat(stat)"
                  class="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete Guarantee Stat"
                >
                  <FlowbiteIcon name="trash" size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TAB: THEME BADGES & PILLS
           (USER REQUIREMENT: Option to remove / turn off pills across website)
           ========================================== -->
      <div v-else-if="activeSection === 'theme-badges'" class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div class="space-y-1">
            <nav class="flex items-center gap-2 text-xs text-neutral-400">
              <FlowbiteIcon name="palette" size="14" class="text-neutral-500" />
              <span>Theme</span>
              <span>&gt;</span>
              <span class="text-neutral-900 font-medium">Badges &amp; Pills</span>
              <span class="text-neutral-300">•</span>
              <span class="text-xs text-neutral-400 font-medium">Storefront Display Controls</span>
            </nav>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Website Badge Pills &amp; Styling
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 max-w-xl">
              Control the visibility of pill badges across the website. Easily turn them off completely or customize them per section.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="handleSaveThemeBadges"
              :disabled="savingThemeBadges"
              class="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <FlowbiteIcon v-if="!savingThemeBadges" name="check" size="14" stroke-width="2" />
              <span v-else class="w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
              <span>{{ savingThemeBadges ? 'Saving...' : 'Save Theme Settings' }}</span>
            </button>
          </div>
        </div>

        <!-- Master Switch Card -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
            <div class="space-y-1">
              <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full" :class="themeBadgeForm.showBadgePills ? 'bg-emerald-500' : 'bg-neutral-300'"></span>
                <h3 class="text-base sm:text-lg font-bold text-neutral-900">
                  Global Badge Pills Switch
                </h3>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  :class="themeBadgeForm.showBadgePills ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'"
                >
                  {{ themeBadgeForm.showBadgePills ? 'Currently Visible' : 'Currently Hidden / Turned Off' }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-neutral-500 max-w-xl">
                When turned off, all pill-shaped badges across the website (hero banner "welcome" badge, category section badges, category card tags, and product badges) are completely removed from the storefront.
              </p>
            </div>

            <!-- Master Toggle Button -->
            <button
              type="button"
              @click="toggleGlobalPills"
              :class="[
                'relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                themeBadgeForm.showBadgePills ? 'bg-neutral-900' : 'bg-neutral-300'
              ]"
              role="switch"
              :aria-checked="themeBadgeForm.showBadgePills"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold',
                  themeBadgeForm.showBadgePills ? 'translate-x-8 text-neutral-900' : 'translate-x-0 text-neutral-400'
                ]"
              >
                {{ themeBadgeForm.showBadgePills ? 'ON' : 'OFF' }}
              </span>
            </button>
          </div>

          <!-- Section Controls Grid -->
          <div class="space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Granular Section Display Options
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Hero Banner Slide Badge -->
              <div class="p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex items-start justify-between gap-3">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <FlowbiteIcon name="sparkles" size="14" class="text-neutral-600" />
                    <span class="text-xs font-bold text-neutral-900">Hero Banner Badges</span>
                  </div>
                  <p class="text-[11px] text-neutral-500">e.g. "welcome", "New Arrival" above main banner headline</p>
                </div>
                <input
                  type="checkbox"
                  v-model="themeBadgeForm.showHeroBannerBadge"
                  :disabled="!themeBadgeForm.showBadgePills"
                  class="rounded accent-neutral-900 cursor-pointer mt-1"
                />
              </div>

              <!-- Category Row Header Badge -->
              <div class="p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex items-start justify-between gap-3">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <FlowbiteIcon name="grid" size="14" class="text-neutral-600" />
                    <span class="text-xs font-bold text-neutral-900">Category Section Badge</span>
                  </div>
                  <p class="text-[11px] text-neutral-500">e.g. "• Explore Collections" above Latest Categories</p>
                </div>
                <input
                  type="checkbox"
                  v-model="themeBadgeForm.showCategoryHeadingBadge"
                  :disabled="!themeBadgeForm.showBadgePills"
                  class="rounded accent-neutral-900 cursor-pointer mt-1"
                />
              </div>

              <!-- Category Card Badges -->
              <div class="p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex items-start justify-between gap-3">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <FlowbiteIcon name="tag" size="14" class="text-neutral-600" />
                    <span class="text-xs font-bold text-neutral-900">Category Card Badges</span>
                  </div>
                  <p class="text-[11px] text-neutral-500">e.g. "Montessori", "Bestseller" on category cards</p>
                </div>
                <input
                  type="checkbox"
                  v-model="themeBadgeForm.showCategoryCardBadges"
                  :disabled="!themeBadgeForm.showBadgePills"
                  class="rounded accent-neutral-900 cursor-pointer mt-1"
                />
              </div>

              <!-- Product Card Badges -->
              <div class="p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex items-start justify-between gap-3">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <FlowbiteIcon name="tag" size="14" class="text-neutral-600" />
                    <span class="text-xs font-bold text-neutral-900">Product Card Badges</span>
                  </div>
                  <p class="text-[11px] text-neutral-500">e.g. "New Arrival", "Bestseller", sale discount tags</p>
                </div>
                <input
                  type="checkbox"
                  v-model="themeBadgeForm.showProductBadges"
                  :disabled="!themeBadgeForm.showBadgePills"
                  class="rounded accent-neutral-900 cursor-pointer mt-1"
                />
              </div>

              <!-- Category & Collection Banner Badges -->
              <div class="p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex items-start justify-between gap-3">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <FlowbiteIcon name="sparkles" size="14" class="text-neutral-600" />
                    <span class="text-xs font-bold text-neutral-900">Category Page Banners</span>
                  </div>
                  <p class="text-[11px] text-neutral-500">e.g. "Curated Catalog", "Montessori &amp; STEM" on category heroes</p>
                </div>
                <input
                  type="checkbox"
                  v-model="themeBadgeForm.showCategoryBannerBadges"
                  :disabled="!themeBadgeForm.showBadgePills"
                  class="rounded accent-neutral-900 cursor-pointer mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TAB: THEME HEADING SLIDES (ROTATING ITALIC WORDS)
           (USER REQUIREMENT: rotate between up to 5 words, fade in from bottom)
           ========================================== -->
      <div v-else-if="activeSection === 'heading-slides'" class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div class="space-y-1">
            <nav class="flex items-center gap-2 text-xs text-neutral-400">
              <FlowbiteIcon name="palette" size="14" class="text-neutral-500" />
              <span>Theme</span>
              <span>&gt;</span>
              <span class="text-neutral-900 font-medium">Heading Slides</span>
              <span class="text-neutral-300">•</span>
              <span class="text-xs text-neutral-400 font-medium">Rotating Italic Words</span>
            </nav>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Heading Slides &amp; Italic Word Rotation
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 max-w-xl">
              Rotate the italicized highlight wording between up to 5 custom words for category and collection headings. Smooth fade-in animation from the bottom.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              @click="handleResetHeadingSlides"
              class="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset to default words"
            >
              <FlowbiteIcon name="refresh" size="14" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              @click="handleSaveHeadingSlides"
              :disabled="savingHeadingSlides"
              class="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <FlowbiteIcon v-if="!savingHeadingSlides" name="check" size="14" stroke-width="2" />
              <span v-else class="w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
              <span>{{ savingHeadingSlides ? 'Saving...' : 'Save Heading Slides' }}</span>
            </button>
          </div>
        </div>

        <!-- Live Animation Preview Sandbox (Matching User Reference) -->
        <div class="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800 text-white shadow-md relative overflow-hidden">
          <div class="flex items-center justify-between mb-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F4EB6A] text-xs font-semibold tracking-wide backdrop-blur-sm">
              <span class="w-2 h-2 rounded-full bg-[#F4EB6A] animate-pulse"></span>
              <span>Live Interactive Preview &bull; Fading in from bottom</span>
            </span>
            <span class="text-xs text-neutral-400 font-mono">
              Interval: {{ headingSlidesForm.intervalSeconds }}s
            </span>
          </div>

          <!-- Preview Stage -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7BA]/60 text-neutral-900 text-xs font-semibold mb-3 shadow-2xs">
                <span class="w-1.5 h-1.5 rounded-full bg-[#F4EB6A]"></span>
                <span>Category Showcase</span>
              </div>

              <h3 class="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight flex items-baseline flex-wrap">
                <span>{{ headingSlidesForm.categoryPrefix || 'The Perfect Gift for' }}</span>
                <span class="inline-block relative overflow-hidden align-baseline ml-2 min-h-[1.25em]">
                  <transition name="preview-slide" mode="out-in">
                    <span
                      :key="previewCategoryWord"
                      class="inline-block italic font-light text-[#F4EB6A] font-serif"
                    >
                      {{ previewCategoryWord }}
                    </span>
                  </transition>
                </span>
              </h3>

              <p class="text-xs text-neutral-400 mt-1 font-light">
                {{ headingSlidesForm.categorySubtitle || "There's Always Something to Unwrap" }}
              </p>
            </div>

            <div class="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7BA]/60 text-neutral-900 text-xs font-semibold mb-3 shadow-2xs">
                <span class="w-1.5 h-1.5 rounded-full bg-[#F4EB6A]"></span>
                <span>New Section</span>
              </div>

              <h3 class="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight flex items-baseline flex-wrap">
                <span>{{ headingSlidesForm.newPrefix || 'New' }}</span>
                <span class="inline-block relative overflow-hidden align-baseline ml-2 min-h-[1.25em]">
                  <transition name="preview-slide" mode="out-in">
                    <span
                      :key="previewCollectionWord"
                      class="inline-block italic font-light text-[#F4EB6A] font-serif"
                    >
                      {{ previewCollectionWord }}
                    </span>
                  </transition>
                </span>
              </h3>

              <p class="text-xs text-neutral-400 mt-1 font-light">
                {{ headingSlidesForm.newSubtitle || 'Discover the latest innovative toys and lovable companions just added to our collection.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Master Enable & Timing Controls -->
        <div class="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <h3 class="text-sm font-bold text-neutral-900">Italic Word Rotation Controls</h3>
              <p class="text-xs text-neutral-500">Toggle whether headings rotate words automatically on the live storefront.</p>
            </div>

            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                <input
                  type="checkbox"
                  v-model="headingSlidesForm.enabled"
                  class="rounded accent-neutral-900 w-4 h-4 cursor-pointer"
                />
                <span>Enable Heading Rotation</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Slide Transition Interval (Seconds)
              </label>
              <div class="flex items-center gap-3">
                <select
                  v-model.number="headingSlidesForm.intervalSeconds"
                  class="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#F4EB6A] cursor-pointer"
                >
                  <option :value="2.0">2.0 seconds (Fast)</option>
                  <option :value="2.5">2.5 seconds</option>
                  <option :value="3.0">3.0 seconds (Recommended)</option>
                  <option :value="3.5">3.5 seconds (Default)</option>
                  <option :value="4.0">4.0 seconds</option>
                  <option :value="5.0">5.0 seconds (Gentle)</option>
                </select>
                <span class="text-xs text-neutral-500 font-mono shrink-0">
                  {{ headingSlidesForm.intervalSeconds }}s
                </span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Animation Style
              </label>
              <div class="px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-700 flex items-center justify-between">
                <span>Vertical Slide &bull; Fade In From Bottom</span>
                <span class="text-emerald-700 font-bold text-[10px] uppercase">Active</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Headings Words (Up to 5) -->
        <div class="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <FlowbiteIcon name="grid" size="16" class="text-neutral-700" />
                <h3 class="text-sm font-bold text-neutral-900">Category Heading Rotating Words (Up to 5)</h3>
              </div>
              <p class="text-xs text-neutral-500 mt-0.5">
                Edit the heading prefix, subtitle, and up to 5 rotating italic words for the Category Showcase.
              </p>
            </div>
            <span class="text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
              {{ headingSlidesForm.categoryWords.filter(w => w && w.trim()).length }} of 5 Active
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Category Heading Prefix</label>
              <input
                v-model="headingSlidesForm.categoryPrefix"
                type="text"
                placeholder="The Perfect Gift for"
                class="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Category Subtitle</label>
              <input
                v-model="headingSlidesForm.categorySubtitle"
                type="text"
                placeholder="There's Always Something to Unwrap"
                class="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div v-for="(word, idx) in headingSlidesForm.categoryWords" :key="idx" class="space-y-1">
              <label class="block text-[11px] font-semibold text-neutral-600">
                Word {{ idx + 1 }} {{ idx === 0 ? '(Default)' : '' }}
              </label>
              <div class="relative">
                <input
                  v-model="headingSlidesForm.categoryWords[idx]"
                  type="text"
                  :placeholder="'e.g. Word ' + (idx + 1)"
                  class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 italic font-medium focus:outline-none focus:border-[#F4EB6A]"
                />
                <button
                  v-if="headingSlidesForm.categoryWords[idx]"
                  type="button"
                  @click="headingSlidesForm.categoryWords[idx] = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 text-xs p-1"
                  title="Clear word"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Collection Headings Words (Up to 5) -->
        <div class="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <FlowbiteIcon name="tag" size="16" class="text-neutral-700" />
                <h3 class="text-sm font-bold text-neutral-900">"New" Section Heading &amp; Rotating Words (Up to 5)</h3>
              </div>
              <p class="text-xs text-neutral-500 mt-0.5">
                Edit the "New" section prefix, subtitle, and rotating words (e.g. "New <em>Models</em>", "New <em>Treasures</em>").
              </p>
            </div>
            <span class="text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
              {{ headingSlidesForm.collectionWords.filter(w => w && w.trim()).length }} of 5 Active
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">"New" Section Prefix</label>
              <input
                v-model="headingSlidesForm.newPrefix"
                type="text"
                placeholder="New"
                class="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-neutral-600 mb-1">"New" Section Subtitle</label>
              <input
                v-model="headingSlidesForm.newSubtitle"
                type="text"
                placeholder="Discover the latest innovative toys and lovable companions just added to our collection."
                class="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div v-for="(word, idx) in headingSlidesForm.collectionWords" :key="idx" class="space-y-1">
              <label class="block text-[11px] font-semibold text-neutral-600">
                Word {{ idx + 1 }} {{ idx === 0 ? '(Default)' : '' }}
              </label>
              <div class="relative">
                <input
                  v-model="headingSlidesForm.collectionWords[idx]"
                  type="text"
                  :placeholder="'e.g. Word ' + (idx + 1)"
                  class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 italic font-medium focus:outline-none focus:border-[#F4EB6A]"
                />
                <button
                  v-if="headingSlidesForm.collectionWords[idx]"
                  type="button"
                  @click="headingSlidesForm.collectionWords[idx] = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 text-xs p-1"
                  title="Clear word"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- All Storefront Section Headings & Subtitles -->
        <div class="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
          <div class="pb-4 border-b border-neutral-100">
            <h3 class="text-sm font-bold text-neutral-900">Storefront Section Headings &amp; Subtitles</h3>
            <p class="text-xs text-neutral-500 mt-0.5">
              Customize headings and subtitles for Shop by Category, Featured Products, Best Sellers, and Customer Reviews.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            <!-- Shop by Category -->
            <div class="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 space-y-3">
              <div class="font-bold text-neutral-900">Shop by Category Section</div>
              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Heading Prefix</label>
                  <input v-model="headingSlidesForm.shopCategoryPrefix" type="text" placeholder="Shop by" class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Italic Highlight</label>
                  <input v-model="headingSlidesForm.shopCategoryHighlight" type="text" placeholder="category" class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white italic" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Subtitle</label>
                <input v-model="headingSlidesForm.shopCategorySubtitle" type="text" placeholder="Discover curated worlds of wonder..." class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Button Text</label>
                <input v-model="headingSlidesForm.shopCategoryButtonText" type="text" placeholder="View all categories" class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white" />
              </div>
            </div>

            <!-- Featured Products -->
            <div class="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 space-y-3">
              <div class="font-bold text-neutral-900">Featured Products Section</div>
              <div>
                <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Heading Prefix (rotates with Collection words)</label>
                <input v-model="headingSlidesForm.featuredPrefix" type="text" placeholder="Feature" class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Subtitle</label>
                <input v-model="headingSlidesForm.featuredSubtitle" type="text" placeholder="Discover our handpicked selection..." class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white" />
              </div>
            </div>

            <!-- Best Sellers -->
            <div class="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 space-y-3">
              <div class="font-bold text-neutral-900">Best Sellers Section</div>
              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Heading Prefix</label>
                  <input v-model="headingSlidesForm.bestSellersPrefix" type="text" placeholder="Best" class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Italic Highlight</label>
                  <input v-model="headingSlidesForm.bestSellersHighlight" type="text" placeholder="sellers" class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white italic" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Subtitle</label>
                <input v-model="headingSlidesForm.bestSellersSubtitle" type="text" placeholder="The community favorites..." class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white" />
              </div>
            </div>

            <!-- Customer Reviews / Testimonials -->
            <div class="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 space-y-3">
              <div class="font-bold text-neutral-900">Customer Reviews Section</div>
              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Heading Prefix</label>
                  <input v-model="headingSlidesForm.reviewsPrefix" type="text" placeholder="What our" class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Italic Highlight</label>
                  <input v-model="headingSlidesForm.reviewsHighlight" type="text" placeholder="customers say" class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white italic" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Subtitle</label>
                <input v-model="headingSlidesForm.reviewsSubtitle" type="text" placeholder="Real stories from happy parents..." class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           MARKETING -> MAILERS (CUSTOMER BASE CAMPAIGNS)
           ========================================== -->
      <div v-else-if="activeSection === 'marketing-mailers'" class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div class="space-y-1">
            <nav class="flex items-center gap-2 text-xs text-neutral-400">
              <span>Marketing</span>
              <FlowbiteIcon name="chevron-right" size="12" />
              <span class="text-neutral-900 font-medium">Mailers</span>
            </nav>
            <h1 class="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Customer Mailers &amp; Campaigns
            </h1>
            <p class="text-xs sm:text-sm text-neutral-500">
              Handle email marketing campaigns to your customer base, segments, and newsletter subscribers.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              @click="resetMailerForm"
              class="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              New Campaign
            </button>
            <button
              type="button"
              @click="handleSaveMailerDraft"
              :disabled="mailerSending"
              class="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              @click="handleSendMailerCampaign"
              :disabled="mailerSending || resolvedMailerRecipients.length === 0"
              class="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <FlowbiteIcon name="mail" size="14" />
              <span>{{ mailerSending ? 'Dispatching...' : `Send Mailer (${resolvedMailerRecipients.length})` }}</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left: Audience & Campaign Composer -->
          <div class="lg:col-span-7 space-y-6">
            <!-- Audience Targeting -->
            <div class="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 class="text-base font-bold text-neutral-900">1. Target Customer Base</h2>
                  <p class="text-xs text-neutral-500">Choose who receives this marketing mailer.</p>
                </div>
                <span class="px-3 py-1 rounded-full bg-[#FEFEEB] border border-[#F4EB6A] text-xs font-bold text-neutral-900">
                  {{ resolvedMailerRecipients.length }} Recipient{{ resolvedMailerRecipients.length === 1 ? '' : 's' }}
                </span>
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Audience Group</label>
                <select
                  v-model="mailerForm.audience"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:border-neutral-900"
                >
                  <option value="all-customers">All Customers &amp; Subscribers (Combined Customer Base)</option>
                  <option value="registered-customers">Registered Customers Only</option>
                  <option value="newsletter-subscribers">Newsletter Subscribers Only</option>
                  <option
                    v-for="seg in allComputedSegments"
                    :key="seg.id"
                    :value="`segment:${seg.id}`"
                  >
                    Segment: {{ seg.name }}
                  </option>
                  <option value="custom-emails">Custom Email List</option>
                </select>
              </div>

              <div v-if="mailerForm.audience === 'custom-emails'">
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Recipient Emails (comma or newline separated)</label>
                <textarea
                  v-model="mailerForm.customEmails"
                  rows="3"
                  placeholder="customer1@example.com, customer2@example.com"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                ></textarea>
              </div>

              <div class="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  @click="copyMailerRecipients"
                  :disabled="resolvedMailerRecipients.length === 0"
                  class="px-3.5 py-1.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-40"
                >
                  Copy Recipient Emails
                </button>
                <button
                  type="button"
                  @click="handleOpenMailClientBcc"
                  :disabled="resolvedMailerRecipients.length === 0"
                  class="px-3.5 py-1.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-40"
                >
                  Open in Mail App (BCC)
                </button>
              </div>
            </div>

            <!-- Campaign Content -> Visual Template Builder -->
            <div class="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 class="text-base font-bold text-neutral-900">2. Email Template Builder</h2>
                  <p class="text-xs text-neutral-500">Pick a starter layout, then add, edit, or reorder email blocks.</p>
                </div>
                <div class="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    @click="applyMailerPreset('new-arrivals')"
                    class="px-2.5 py-1 rounded-lg border border-neutral-200 text-[11px] font-medium hover:bg-neutral-50 cursor-pointer"
                  >
                    New Arrivals
                  </button>
                  <button
                    type="button"
                    @click="applyMailerPreset('flash-sale')"
                    class="px-2.5 py-1 rounded-lg border border-neutral-200 text-[11px] font-medium hover:bg-neutral-50 cursor-pointer"
                  >
                    Flash Sale
                  </button>
                  <button
                    type="button"
                    @click="applyMailerPreset('newsletter')"
                    class="px-2.5 py-1 rounded-lg border border-neutral-200 text-[11px] font-medium hover:bg-neutral-50 cursor-pointer"
                  >
                    Monthly Dispatch
                  </button>
                  <button
                    type="button"
                    @click="applyMailerPreset('blank')"
                    class="px-2.5 py-1 rounded-lg border border-neutral-200 text-[11px] font-medium hover:bg-neutral-50 cursor-pointer"
                  >
                    Blank
                  </button>
                </div>
              </div>

              <!-- Campaign Metadata & Sender -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">Campaign Name (Internal)</label>
                  <input
                    v-model="mailerForm.name"
                    type="text"
                    placeholder="e.g. November Toy Drop"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">Email Subject Line *</label>
                  <input
                    v-model="mailerForm.subject"
                    type="text"
                    placeholder="New arrivals &amp; 15% off this weekend!"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">From Name</label>
                  <input
                    v-model="mailerForm.fromName"
                    type="text"
                    placeholder="Yellow Berry Store"
                    class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">From Email</label>
                  <input
                    v-model="mailerForm.fromEmail"
                    type="email"
                    placeholder="noreply@ystoreza.co.za"
                    class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">Reply-To Email</label>
                  <input
                    v-model="mailerForm.replyToEmail"
                    type="email"
                    placeholder="info@yberry.co.za"
                    class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <!-- Theme Colors -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Accent Color</label>
                  <div class="flex items-center gap-2">
                    <input v-model="mailerTheme.accentColor" type="color" class="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                    <span class="text-[11px] font-mono text-neutral-600">{{ mailerTheme.accentColor }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Dark Color</label>
                  <div class="flex items-center gap-2">
                    <input v-model="mailerTheme.darkColor" type="color" class="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                    <span class="text-[11px] font-mono text-neutral-600">{{ mailerTheme.darkColor }}</span>
                  </div>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Button Style</label>
                  <select
                    v-model="mailerTheme.buttonRadius"
                    class="w-full px-2.5 py-1.5 rounded-xl border border-neutral-200 text-xs bg-white"
                  >
                    <option value="999px">Pill</option>
                    <option value="10px">Rounded</option>
                    <option value="4px">Sharp</option>
                  </select>
                </div>
              </div>

              <!-- Add Block Toolbar -->
              <div class="space-y-2">
                <span class="block text-xs font-semibold text-neutral-700">Add Template Block</span>
                <div class="flex flex-wrap gap-1.5">
                  <button type="button" @click="addMailerBlock('header')" class="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-800 cursor-pointer">+ Header</button>
                  <button type="button" @click="addMailerBlock('hero')" class="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-800 cursor-pointer">+ Hero Banner</button>
                  <button type="button" @click="addMailerBlock('text')" class="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-800 cursor-pointer">+ Text Block</button>
                  <button type="button" @click="addMailerBlock('product')" class="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-800 cursor-pointer">+ Product Spotlight</button>
                  <button type="button" @click="addMailerBlock('promo')" class="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-800 cursor-pointer">+ Promo Code</button>
                  <button type="button" @click="addMailerBlock('button')" class="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-800 cursor-pointer">+ CTA Button</button>
                  <button type="button" @click="addMailerBlock('divider')" class="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-800 cursor-pointer">+ Divider</button>
                </div>
              </div>

              <!-- Blocks Stack -->
              <div class="space-y-3">
                <div
                  v-for="(block, bIdx) in mailerBlocks"
                  :key="block.id"
                  class="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-3"
                >
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                      {{ bIdx + 1 }}. {{ block.type }} Block
                    </span>
                    <div class="flex items-center gap-1.5 text-xs">
                      <button
                        type="button"
                        @click="moveMailerBlock(bIdx, -1)"
                        :disabled="bIdx === 0"
                        class="px-2 py-0.5 rounded border border-neutral-200 bg-white text-neutral-600 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        @click="moveMailerBlock(bIdx, 1)"
                        :disabled="bIdx === mailerBlocks.length - 1"
                        class="px-2 py-0.5 rounded border border-neutral-200 bg-white text-neutral-600 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        @click="removeMailerBlock(bIdx)"
                        class="px-2 py-0.5 rounded border border-red-200 bg-white text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Remove Block"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <!-- Header Block Fields -->
                  <div v-if="block.type === 'header'" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input v-model="block.brandName" type="text" placeholder="Brand Name (e.g. Yellow Berry Store)" class="px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                    <input v-model="block.badgeText" type="text" placeholder="Top Badge (e.g. Curated Toy Drops)" class="px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                  </div>

                  <!-- Hero Block Fields -->
                  <div v-else-if="block.type === 'hero'" class="space-y-2">
                    <input v-model="block.headline" type="text" placeholder="Hero Headline" class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold" />
                    <input v-model="block.subheadline" type="text" placeholder="Hero Subheadline" class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                    <input v-model="block.imageUrl" type="url" placeholder="Optional Banner Image URL (https://...)" class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                  </div>

                  <!-- Text Block Fields -->
                  <div v-else-if="block.type === 'text'" class="space-y-2">
                    <input v-model="block.title" type="text" placeholder="Section Heading (optional)" class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold" />
                    <textarea v-model="block.content" rows="3" placeholder="Paragraph copy..." class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs"></textarea>
                  </div>

                  <!-- Product Spotlight Block Fields -->
                  <div v-else-if="block.type === 'product'" class="space-y-2">
                    <select
                      @change="applyProductToBlock(block, $event.target.value)"
                      class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs"
                    >
                      <option value="">-- Autofill from Store Product --</option>
                      <option v-for="p in products" :key="p.id" :value="p.id">
                        {{ p.name }} (R{{ p.price }})
                      </option>
                    </select>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input v-model="block.productName" type="text" placeholder="Product Name" class="px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                      <input v-model="block.productPrice" type="text" placeholder="Price (e.g. R499)" class="px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                    </div>
                    <input v-model="block.productImage" type="url" placeholder="Product Image URL" class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                    <input v-model="block.productUrl" type="url" placeholder="Product Link URL (https://ystoreza.co.za/)" class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                  </div>

                  <!-- Promo Code Block Fields -->
                  <div v-else-if="block.type === 'promo'" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input v-model="block.code" type="text" placeholder="Discount Code (e.g. YELLOW15)" class="px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-mono font-bold uppercase" />
                    <input v-model="block.note" type="text" placeholder="Offer Details (e.g. 15% off orders over R500)" class="px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                  </div>

                  <!-- CTA Button Block Fields -->
                  <div v-else-if="block.type === 'button'" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input v-model="block.label" type="text" placeholder="Button Label (e.g. Shop Collection)" class="px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                    <input v-model="block.url" type="url" placeholder="Destination URL (https://ystoreza.co.za/)" class="px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs" />
                  </div>

                  <!-- Divider Info -->
                  <div v-else-if="block.type === 'divider'" class="text-[11px] text-neutral-400">
                    Horizontal spacer divider line.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Live HTML Template Preview -->
          <div class="lg:col-span-5 space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4 sticky top-6">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <h2 class="text-base font-bold text-neutral-900">Live Template Preview</h2>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="mailerPreviewMode = 'desktop'"
                    :class="mailerPreviewMode === 'desktop' ? 'bg-neutral-900 text-[#F4EB6A]' : 'bg-neutral-100 text-neutral-600'"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer"
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    @click="mailerPreviewMode = 'mobile'"
                    :class="mailerPreviewMode === 'mobile' ? 'bg-neutral-900 text-[#F4EB6A]' : 'bg-neutral-100 text-neutral-600'"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer"
                  >
                    Mobile
                  </button>
                  <button
                    type="button"
                    @click="copyGeneratedMailerHtml"
                    class="px-2.5 py-1 rounded-lg border border-neutral-200 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  >
                    Copy HTML
                  </button>
                </div>
              </div>

              <div class="rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-100 p-3">
                <div class="px-3 py-2 mb-2 rounded-xl bg-white border border-neutral-200 text-[11px] space-y-0.5">
                  <p class="text-neutral-500 truncate">
                    <span class="font-semibold text-neutral-700">From:</span> {{ mailerForm.fromName || 'Yellow Berry Store' }} &lt;{{ mailerForm.fromEmail || 'noreply@ystoreza.co.za' }}&gt;
                  </p>
                  <p class="text-neutral-900 font-semibold truncate">
                    {{ mailerForm.subject || 'Your email subject line appears here' }}
                  </p>
                </div>

                <div
                  class="mx-auto transition-all duration-300 overflow-hidden rounded-xl border border-neutral-200 bg-white"
                  :style="{ maxWidth: mailerPreviewMode === 'mobile' ? '360px' : '100%' }"
                  v-html="generatedMailerHtml"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Campaign History -->
        <div class="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 class="text-base font-bold text-neutral-900">
            Campaign History ({{ (mailerCampaigns && mailerCampaigns.length) || 0 }})
          </h2>

          <div v-if="!mailerCampaigns || mailerCampaigns.length === 0" class="py-8 text-center text-xs text-neutral-400">
            No marketing mailers saved or sent yet.
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th class="py-3 px-3">Campaign</th>
                  <th class="py-3 px-3">Subject</th>
                  <th class="py-3 px-3">Recipients</th>
                  <th class="py-3 px-3">Status</th>
                  <th class="py-3 px-3">Updated</th>
                  <th class="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100">
                <tr v-for="camp in mailerCampaigns" :key="camp.id" class="hover:bg-neutral-50/70">
                  <td class="py-3 px-3 font-semibold text-neutral-900">{{ camp.name }}</td>
                  <td class="py-3 px-3 text-neutral-600">{{ camp.subject || '—' }}</td>
                  <td class="py-3 px-3 font-mono">{{ camp.recipientCount || 0 }}</td>
                  <td class="py-3 px-3">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                      :class="camp.status === 'sent' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'"
                    >
                      {{ camp.status || 'draft' }}
                    </span>
                  </td>
                  <td class="py-3 px-3 text-neutral-500">
                    {{ camp.updatedAt ? new Date(camp.updatedAt).toLocaleString() : '—' }}
                  </td>
                  <td class="py-3 px-3 text-right space-x-3">
                    <button
                      type="button"
                      @click="loadCampaignIntoEditor(camp)"
                      class="text-neutral-900 hover:underline font-medium cursor-pointer"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      @click="handleDeleteMailerCampaign(camp.id)"
                      class="text-red-500 hover:text-red-700 font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ==========================================
           THEME -> SUBSCRIPTION CONFIG & EMAIL ROUTING
           ========================================== -->
      <div v-else-if="activeSection === 'theme-subscription'" class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div class="space-y-1">
            <nav class="flex items-center gap-2 text-xs text-neutral-400">
              <span>Theme</span>
              <FlowbiteIcon name="chevron-right" size="12" />
              <span class="text-neutral-900 font-medium">Subscription</span>
            </nav>
            <h1 class="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
              Subscription &amp; Email Routing
            </h1>
            <p class="text-xs sm:text-sm text-neutral-500">
              Customize newsletter copy across the storefront, set the destination routing email, and manage captured subscribers.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              @click="handleResetSubscriptionConfig"
              class="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Reset Defaults
            </button>
            <button
              type="button"
              @click="handleSaveSubscriptionConfig"
              :disabled="subscriptionSaving"
              class="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <FlowbiteIcon name="check" size="14" />
              <span>{{ subscriptionSaving ? 'Saving...' : 'Save Subscription Settings' }}</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left: Email Routing & Visibility -->
          <div class="lg:col-span-5 space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-base font-bold text-neutral-900">Email Routing</h2>
                <label class="inline-flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
                  <input v-model="subscriptionForm.enabled" type="checkbox" class="rounded border-neutral-300 text-neutral-900" />
                  <span>Show on Storefront</span>
                </label>
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Route Subscriptions To Email *</label>
                <input
                  v-model="subscriptionForm.routeToEmail"
                  type="email"
                  placeholder="hello@ystoreza.co.za"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                />
                <p class="text-[11px] text-neutral-400 mt-1">
                  Every subscriber record is tagged with this destination address for routing and inbox follow-up.
                </p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Delivery Method</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    @click="subscriptionForm.deliveryMethod = 'webhook'"
                    :class="[
                      'px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                      subscriptionForm.deliveryMethod === 'webhook'
                        ? 'bg-neutral-900 text-[#F4EB6A] border-neutral-900'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                    ]"
                  >
                    Webhook
                  </button>
                  <button
                    type="button"
                    @click="subscriptionForm.deliveryMethod = 'mailbox'"
                    :class="[
                      'px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                      subscriptionForm.deliveryMethod === 'mailbox'
                        ? 'bg-neutral-900 text-[#F4EB6A] border-neutral-900'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                    ]"
                  >
                    Mailbox
                  </button>
                  <button
                    type="button"
                    @click="subscriptionForm.deliveryMethod = 'both'"
                    :class="[
                      'px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                      subscriptionForm.deliveryMethod === 'both'
                        ? 'bg-neutral-900 text-[#F4EB6A] border-neutral-900'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                    ]"
                  >
                    Both
                  </button>
                </div>
              </div>

              <div v-if="subscriptionForm.deliveryMethod === 'webhook' || subscriptionForm.deliveryMethod === 'both'">
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Optional Webhook / Mail Endpoint URL</label>
                <input
                  v-model="subscriptionForm.webhookUrl"
                  type="url"
                  placeholder="https://formspree.io/f/... or Zapier/Make webhook"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                />
                <p class="text-[11px] text-neutral-400 mt-1">
                  If provided, submissions also POST JSON (email, routeToEmail, sourcePage) to trigger automated email forwarding.
                </p>
              </div>
            </div>

            <!-- Mailbox Settings Card (Alternative Delivery) -->
            <div v-if="subscriptionForm.deliveryMethod === 'mailbox' || subscriptionForm.deliveryMethod === 'both'" class="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <h2 class="text-base font-bold text-neutral-900">Mailbox Settings</h2>
                  <p class="text-[11px] text-neutral-400">Admin-only SMTP credentials + domain mailer endpoint.</p>
                </div>
                <button
                  type="button"
                  @click="handleTestMailbox"
                  :disabled="mailboxTesting"
                  class="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {{ mailboxTesting ? 'Testing...' : 'Send Test Email' }}
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">SMTP Host</label>
                  <input
                    v-model="mailboxForm.host"
                    type="text"
                    placeholder="mail.ystoreza.co.za"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">SMTP Port</label>
                  <input
                    v-model.number="mailboxForm.port"
                    type="number"
                    placeholder="465"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">Encryption</label>
                  <select
                    v-model="mailboxForm.encryption"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:border-neutral-900"
                  >
                    <option value="ssl">SSL / TLS (Port 465)</option>
                    <option value="tls">STARTTLS (Port 587)</option>
                    <option value="none">None (Port 25)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">Mailbox Username</label>
                  <input
                    v-model="mailboxForm.username"
                    type="text"
                    placeholder="info@ystoreza.co.za"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Mailbox Password</label>
                <div class="relative">
                  <input
                    v-model="mailboxForm.password"
                    :type="showMailboxPassword ? 'text' : 'password'"
                    placeholder="••••••••••••"
                    class="w-full px-3.5 py-2 pr-16 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    @click="showMailboxPassword = !showMailboxPassword"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 cursor-pointer"
                  >
                    {{ showMailboxPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">From Name</label>
                  <input
                    v-model="mailboxForm.fromName"
                    type="text"
                    placeholder="Ystore Newsletter"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">From Email</label>
                  <input
                    v-model="mailboxForm.fromEmail"
                    type="email"
                    placeholder="noreply@ystoreza.co.za"
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Subject Template</label>
                <input
                  v-model="mailboxForm.subjectTemplate"
                  type="text"
                  placeholder="New Newsletter Subscriber: {{email}}"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Domain Mailer Endpoint URL</label>
                <input
                  v-model="mailboxForm.endpointUrl"
                  type="text"
                  placeholder="/api/subscribe-mail.php"
                  class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                />
                <p class="text-[11px] text-neutral-400 mt-1">
                  Defaults to <code class="text-neutral-600">/api/subscribe-mail.php</code> included in your deployment.
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Editable Storefront Content -->
          <div class="lg:col-span-7 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <h2 class="text-base font-bold text-neutral-900">Storefront Information &amp; Copy</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Eyebrow / Kicker</label>
                <input
                  v-model="subscriptionForm.eyebrow"
                  type="text"
                  placeholder="Never miss our deals"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Heading</label>
                <input
                  v-model="subscriptionForm.heading"
                  type="text"
                  placeholder="Subscribe"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Description</label>
              <textarea
                v-model="subscriptionForm.description"
                rows="2"
                placeholder="Get exclusive product drops, member-only discounts..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Input Placeholder</label>
                <input
                  v-model="subscriptionForm.placeholder"
                  type="text"
                  placeholder="Enter your email address..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Submit Button Label</label>
                <input
                  v-model="subscriptionForm.buttonText"
                  type="text"
                  placeholder="Subscribe"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Consent Checkbox Text</label>
              <input
                v-model="subscriptionForm.consentText"
                type="text"
                placeholder="I agree to receive promotional updates and news from Ystore."
                class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1.5">Success Confirmation Message</label>
              <input
                v-model="subscriptionForm.successMessage"
                type="text"
                placeholder="Thank you for subscribing! Check your inbox for a 10% welcome coupon."
                class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>
        </div>

        <!-- Subscriber Routing Log -->
        <div class="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-neutral-900">
                Subscriber Routing Log ({{ (newsletterSubscribers && newsletterSubscribers.length) || 0 }})
              </h2>
              <p class="text-xs text-neutral-500">Live sign-ups captured from Home, Product Detail, Specials, and Blog banners.</p>
            </div>
            <button
              type="button"
              @click="exportSubscribersCsv"
              :disabled="!newsletterSubscribers || newsletterSubscribers.length === 0"
              class="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-40"
            >
              Export CSV
            </button>
          </div>

          <div v-if="!newsletterSubscribers || newsletterSubscribers.length === 0" class="py-10 text-center text-xs text-neutral-400">
            No newsletter subscribers captured yet.
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th class="py-3 px-3">Subscriber Email</th>
                  <th class="py-3 px-3">Routed To</th>
                  <th class="py-3 px-3">Source Page</th>
                  <th class="py-3 px-3">Date</th>
                  <th class="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100">
                <tr v-for="sub in newsletterSubscribers" :key="sub.id" class="hover:bg-neutral-50/70">
                  <td class="py-3 px-3 font-medium text-neutral-900">{{ sub.email }}</td>
                  <td class="py-3 px-3 text-neutral-600">{{ sub.routedToEmail || subscriptionForm.routeToEmail }}</td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-medium capitalize">
                      {{ sub.sourcePage || 'home' }}
                    </span>
                  </td>
                  <td class="py-3 px-3 text-neutral-500">
                    {{ sub.createdAt ? new Date(sub.createdAt).toLocaleString() : '—' }}
                  </td>
                  <td class="py-3 px-3 text-right">
                    <button
                      type="button"
                      @click="handleDeleteSubscriber(sub.id)"
                      class="text-red-500 hover:text-red-700 font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ==========================================
           THEME -> CUSTOMER REVIEWS & GOOGLE REVIEWS API PREP
           ========================================== -->
      <div v-else-if="activeSection === 'theme-reviews'" class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div class="space-y-1">
            <nav class="flex items-center gap-2 text-xs text-neutral-400">
              <FlowbiteIcon name="palette" size="14" class="text-neutral-500" />
              <span>Theme</span>
              <span>&gt;</span>
              <span class="text-neutral-900 font-medium">Customer Reviews</span>
              <span class="text-neutral-300">•</span>
              <span class="text-xs text-neutral-400 font-medium">Manual + Google Places API Ready</span>
            </nav>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Storefront Customer Reviews
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 max-w-xl">
              Manually add and curate homepage customer testimonials, or connect your Google Places API key &amp; Place ID to sync Google Business reviews automatically.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              @click="handleResetStoreReviews"
              class="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FlowbiteIcon name="refresh" size="14" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              @click="openStoreReviewModal()"
              class="btn-primary text-xs !py-2.5 !px-4 inline-flex items-center gap-2 shadow-sm"
            >
              <FlowbiteIcon name="plus" size="14" stroke-width="2" />
              <span>Add Manual Review</span>
            </button>
          </div>
        </div>

        <!-- Google Reviews API Integration Prep Card -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-neutral-900">Google Reviews API Configuration</h3>
                <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  API Ready
                </span>
              </div>
              <p class="text-xs text-neutral-500 mt-0.5">
                Choose whether to display manual reviews, Google Reviews, or both combined on the storefront.
              </p>
            </div>
            <div v-if="googleReviewsForm.lastSyncedAt" class="text-[11px] text-neutral-400">
              Last synced: {{ new Date(googleReviewsForm.lastSyncedAt).toLocaleString() }}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-bold text-neutral-700 mb-1.5">Display Source Mode</label>
              <select
                v-model="googleReviewsForm.source"
                class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:border-[#F4EB6A]"
              >
                <option value="manual">Manual Reviews Only</option>
                <option value="google">Google Reviews API Only</option>
                <option value="hybrid">Combined (Manual + Google)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-neutral-700 mb-1.5">Google Place ID</label>
              <input
                v-model="googleReviewsForm.googlePlaceId"
                type="text"
                placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#F4EB6A]"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-neutral-700 mb-1.5">Google Places API Key</label>
              <input
                v-model="googleReviewsForm.googleApiKey"
                type="password"
                autocomplete="off"
                placeholder="AIzaSy..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#F4EB6A]"
              />
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="block text-xs font-bold text-neutral-700 mb-1.5">Min Rating</label>
                <select
                  v-model.number="googleReviewsForm.minRating"
                  class="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:border-[#F4EB6A]"
                >
                  <option :value="5">5 Stars</option>
                  <option :value="4">4+ Stars</option>
                  <option :value="3">3+ Stars</option>
                  <option :value="1">All (1+)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-neutral-700 mb-1.5">Max Shown</label>
                <input
                  v-model.number="googleReviewsForm.maxReviews"
                  type="number"
                  min="1"
                  max="20"
                  class="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#F4EB6A]"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p class="text-[11px] text-neutral-400">
              Uses Google Places API (New v1) <code class="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">places.googleapis.com/v1/places/{placeId}</code>. Cached reviews: {{ googleReviewsForm.cachedGoogleReviews?.length || 0 }}.
            </p>
            <div class="flex items-center gap-2.5">
              <button
                type="button"
                :disabled="googleReviewsSyncing"
                @click="handleSyncGoogleReviews"
                class="px-4 py-2 rounded-xl border border-neutral-200 hover:border-neutral-900 text-xs font-semibold text-neutral-800 transition-all cursor-pointer disabled:opacity-50"
              >
                {{ googleReviewsSyncing ? 'Syncing Google...' : 'Sync Google Reviews' }}
              </button>
              <button
                type="button"
                :disabled="googleReviewsSaving"
                @click="handleSaveGoogleReviewsConfig"
                class="btn-primary text-xs !py-2 !px-4"
              >
                {{ googleReviewsSaving ? 'Saving...' : 'Save API Settings' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Inline Add / Edit Manual Store Review Form -->
        <div v-if="showStoreReviewModal" class="bg-white p-6 rounded-3xl border border-[#F4EB6A] shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-neutral-900">
              {{ editingStoreReview ? 'Edit Customer Review' : 'Add Manual Customer Review' }}
            </h3>
            <button type="button" @click="showStoreReviewModal = false" class="text-xs text-neutral-400 hover:text-neutral-900 cursor-pointer">
              Close &times;
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-neutral-600 mb-1">Customer Name *</label>
              <input v-model="storeReviewForm.name" type="text" placeholder="e.g. Sarah Mkhize" class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-neutral-600 mb-1">Star Rating</label>
              <select v-model.number="storeReviewForm.rating" class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs">
                <option :value="5">5 Stars</option>
                <option :value="4">4 Stars</option>
                <option :value="3">3 Stars</option>
                <option :value="2">2 Stars</option>
                <option :value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-neutral-600 mb-1">Badge Label</label>
              <input v-model="storeReviewForm.badge" type="text" placeholder="Verified Buyer" class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-neutral-600 mb-1">Display Order</label>
              <input v-model.number="storeReviewForm.order" type="number" min="1" class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-neutral-600 mb-1">Review Quote *</label>
            <textarea v-model="storeReviewForm.quote" rows="3" placeholder="Customer testimonial text..." class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"></textarea>
          </div>
          <div class="flex items-center justify-between pt-1">
            <label class="inline-flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
              <input v-model="storeReviewForm.enabled" type="checkbox" class="rounded border-neutral-300" />
              <span>Visible on Storefront</span>
            </label>
            <div class="flex items-center gap-2">
              <button type="button" @click="showStoreReviewModal = false" class="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 cursor-pointer">Cancel</button>
              <button type="button" :disabled="storeReviewSaving" @click="handleSaveStoreReview" class="btn-primary text-xs !py-2 !px-4">
                {{ storeReviewSaving ? 'Saving...' : 'Save Review' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Manual Store Reviews Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="rev in storeReviews"
            :key="rev.id"
            class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between gap-4"
            :class="{ 'opacity-60': rev.enabled === false }"
          >
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-0.5 text-[#DEC02A]">
                  <FlowbiteIcon
                    v-for="s in 5"
                    :key="s"
                    name="star"
                    size="14"
                    :fill="s <= (Number(rev.rating) || 5)"
                    :class="s <= (Number(rev.rating) || 5) ? 'text-[#DEC02A]' : 'text-neutral-200'"
                  />
                </div>
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full" :class="rev.enabled !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'">
                  {{ rev.enabled !== false ? 'Active' : 'Hidden' }}
                </span>
              </div>
              <p class="text-xs text-neutral-600 italic leading-relaxed line-clamp-4">"{{ rev.quote }}"</p>
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-neutral-100">
              <div class="min-w-0">
                <div class="text-xs font-bold text-neutral-900 truncate">{{ rev.name }}</div>
                <div class="text-[11px] text-neutral-400 truncate">{{ rev.badge || 'Verified Buyer' }}</div>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button type="button" @click="openStoreReviewModal(rev)" class="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-800 cursor-pointer">Edit</button>
                <button type="button" @click="handleDeleteStoreReview(rev)" class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer" title="Delete review">
                  <FlowbiteIcon name="trash" size="13" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           PRODUCTS -> CUSTOMER REVIEWS (PRODUCT DETAIL REVIEWS)
           ========================================== -->
      <div v-else-if="activeSection === 'product-reviews'" class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div class="space-y-1">
            <nav class="flex items-center gap-2 text-xs text-neutral-400">
              <FlowbiteIcon name="tag" size="14" class="text-neutral-500" />
              <span>Products</span>
              <span>&gt;</span>
              <span class="text-neutral-900 font-medium">Customer Reviews</span>
              <span class="text-neutral-300">•</span>
              <span class="text-xs text-neutral-400 font-medium">Real-time Product Detail Sync</span>
            </nav>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Product Customer Reviews
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 max-w-xl">
              Manage reviews left by customers on product detail pages, add verified reviews, reply as Ystore, or moderate visibility.
            </p>
          </div>

          <button
            type="button"
            @click="openProductReviewModal()"
            class="btn-primary text-xs !py-2.5 !px-4 inline-flex items-center gap-2 shadow-sm shrink-0"
          >
            <FlowbiteIcon name="plus" size="14" stroke-width="2" />
            <span>Add Product Review</span>
          </button>
        </div>

        <!-- Filters Bar -->
        <div class="bg-white p-4 rounded-2xl border border-neutral-200/80 flex flex-wrap items-center gap-3">
          <select
            v-model="productReviewFilterProduct"
            class="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:border-[#F4EB6A]"
          >
            <option value="all">All Products ({{ productReviews.length }})</option>
            <option v-for="p in products" :key="p.id || p.name" :value="p.id || p.name">
              {{ p.name }}
            </option>
          </select>

          <select
            v-model="productReviewFilterStatus"
            class="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:border-[#F4EB6A]"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved (Live)</option>
            <option value="pending">Pending</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        <!-- Inline Add / Edit Product Review Form -->
        <div v-if="showProductReviewModal" class="bg-white p-6 rounded-3xl border border-[#F4EB6A] shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-neutral-900">
              {{ editingProductReview ? 'Edit / Reply to Product Review' : 'Add Product Customer Review' }}
            </h3>
            <button type="button" @click="showProductReviewModal = false" class="text-xs text-neutral-400 hover:text-neutral-900 cursor-pointer">
              Close &times;
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-neutral-600 mb-1">Product *</label>
              <select v-model="productReviewForm.productId" @change="syncProductReviewProductName" class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs">
                <option value="" disabled>Select product...</option>
                <option v-for="p in products" :key="p.id || p.name" :value="p.id || p.name">{{ p.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-neutral-600 mb-1">Customer Name *</label>
              <input v-model="productReviewForm.author" type="text" placeholder="e.g. Thabo Molefe" class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-neutral-600 mb-1">Star Rating</label>
              <select v-model.number="productReviewForm.rating" class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs">
                <option :value="5">5 Stars</option>
                <option :value="4">4 Stars</option>
                <option :value="3">3 Stars</option>
                <option :value="2">2 Stars</option>
                <option :value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-neutral-600 mb-1">Moderation Status</label>
              <select v-model="productReviewForm.status" class="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs">
                <option value="approved">Approved (Visible)</option>
                <option value="pending">Pending</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-neutral-600 mb-1">Review Title</label>
              <input v-model="productReviewForm.title" type="text" placeholder="e.g. Kids love it!" class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-neutral-600 mb-1">Badge</label>
              <input v-model="productReviewForm.badge" type="text" placeholder="Verified Customer" class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-neutral-600 mb-1">Review Comment *</label>
            <textarea v-model="productReviewForm.comment" rows="3" placeholder="Customer feedback..." class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"></textarea>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-neutral-600 mb-1">Store Admin Reply (Optional)</label>
            <textarea v-model="productReviewForm.adminReply" rows="2" placeholder="Thank you for your review..." class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"></textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="showProductReviewModal = false" class="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 cursor-pointer">Cancel</button>
            <button type="button" :disabled="productReviewSaving" @click="handleSaveProductReviewAdmin" class="btn-primary text-xs !py-2 !px-4">
              {{ productReviewSaving ? 'Saving...' : 'Save Product Review' }}
            </button>
          </div>
        </div>

        <!-- Product Reviews List -->
        <div v-if="filteredProductReviews.length === 0" class="bg-white p-10 rounded-3xl border border-neutral-200/80 text-center text-sm text-neutral-500">
          No product customer reviews yet. Customers can submit reviews directly on any product detail page, or you can add one above.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="rev in filteredProductReviews"
            :key="rev.id"
            class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div class="space-y-1.5 min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800">
                  {{ rev.productName || 'Product' }}
                </span>
                <div class="flex items-center gap-0.5 text-[#DEC02A]">
                  <FlowbiteIcon
                    v-for="s in 5"
                    :key="s"
                    name="star"
                    size="13"
                    :fill="s <= (Number(rev.rating) || 5)"
                    :class="s <= (Number(rev.rating) || 5) ? 'text-[#DEC02A]' : 'text-neutral-200'"
                  />
                </div>
                <span
                  class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                  :class="rev.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : (rev.status === 'hidden' ? 'bg-neutral-100 text-neutral-500' : 'bg-amber-50 text-amber-700')"
                >
                  {{ rev.status || 'approved' }}
                </span>
              </div>
              <h4 v-if="rev.title" class="text-sm font-bold text-neutral-900">{{ rev.title }}</h4>
              <p class="text-xs text-neutral-600 leading-relaxed">{{ rev.comment }}</p>
              <div class="text-[11px] text-neutral-400">
                By <span class="font-semibold text-neutral-700">{{ rev.author }}</span> ({{ rev.badge || 'Verified Customer' }})
              </div>
              <div v-if="rev.adminReply" class="mt-2 pl-3 border-l-2 border-[#F4EB6A] text-xs text-neutral-600 bg-neutral-50 py-1.5 px-2.5 rounded-r-lg">
                <span class="font-semibold text-neutral-900">Ystore Reply:</span> {{ rev.adminReply }}
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                @click="toggleProductReviewStatus(rev)"
                class="px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-[11px] font-semibold text-neutral-700 cursor-pointer"
              >
                {{ rev.status === 'approved' ? 'Hide' : 'Approve' }}
              </button>
              <button
                type="button"
                @click="openProductReviewModal(rev)"
                class="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-800 cursor-pointer"
              >
                Edit / Reply
              </button>
              <button
                type="button"
                @click="handleDeleteProductReviewAdmin(rev)"
                class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                title="Delete review"
              >
                <FlowbiteIcon name="trash" size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           STORIES ABOVE BANNER (MEDIA SUBMENU)
           ========================================== -->
      <div v-else-if="activeSection === 'story-categories'" class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div class="space-y-1">
            <nav class="flex items-center gap-2 text-xs text-neutral-400">
              <FlowbiteIcon name="sparkles" size="14" class="text-neutral-500" />
              <span>Media files</span>
              <span>&gt;</span>
              <span class="text-neutral-900 font-medium">Circular Story Track</span>
              <span class="text-neutral-300">•</span>
              <span class="text-xs text-neutral-400 font-medium">Real-time Firestore Sync</span>
            </nav>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Product Stories Above Hero Banner
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 max-w-xl">
              Manage the interactive circular story rings placed above the homepage hero banner. Each circle opens an interactive lightbox with gallery slides and custom CTA buttons.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              @click="handleResetStories"
              class="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset to default story circles"
            >
              <FlowbiteIcon name="refresh" size="14" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              @click="openCreateStoryModal"
              class="btn-primary text-xs !py-2.5 !px-4 inline-flex items-center gap-2 shadow-sm"
            >
              <FlowbiteIcon name="plus" size="14" stroke-width="2" />
              <span>Add Story Circle</span>
            </button>
          </div>
        </div>

        <!-- Story Circles Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="story in productStories"
            :key="story.id"
            class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
            :class="{ 'opacity-60 bg-neutral-50/50': story.enabled === false }"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <!-- Ring & Circle Icon Preview -->
                <div class="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#F4EB6A] via-yellow-400 to-amber-500 flex items-center justify-center shrink-0 shadow-xs">
                  <div class="w-full h-full rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center border-2 border-white">
                    <img
                      v-if="story.icon || (story.slides && story.slides[0]?.image)"
                      :src="useAsset(story.icon || story.slides[0]?.image)"
                      :alt="story.title"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <FlowbiteIcon v-else name="camera" size="20" class="text-[#F4EB6A]" />
                  </div>
                </div>

                <div class="flex flex-col items-end gap-1">
                  <span
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    :class="story.enabled !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'"
                  >
                    {{ story.enabled !== false ? 'Active' : 'Hidden' }}
                  </span>
                  <span class="text-[10px] text-neutral-400 font-mono px-1.5 py-0.5 bg-neutral-100 rounded">
                    #{{ story.order || 1 }}
                  </span>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-bold text-neutral-900 line-clamp-1">{{ story.title }}</h3>
                <p class="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                  {{ story.subtitle || 'Lightbox gallery collection' }}
                </p>
                <div class="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-600 font-medium">
                  <FlowbiteIcon name="image" size="13" class="text-neutral-400" />
                  <span>{{ (story.slides && story.slides.length) || 0 }} slides in lightbox</span>
                </div>
              </div>
            </div>

            <!-- Bottom Actions -->
            <div class="pt-3 border-t border-neutral-100 flex items-center justify-between gap-1">
              <button
                type="button"
                @click="handleToggleStory(story)"
                class="text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                :class="story.enabled !== false ? 'text-neutral-500 hover:text-neutral-900' : 'text-emerald-700 font-bold'"
                :title="story.enabled !== false ? 'Hide story circle' : 'Show story circle'"
              >
                <FlowbiteIcon :name="story.enabled !== false ? 'eye-off' : 'eye'" size="14" />
              </button>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="openEditStoryModal(story)"
                  class="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Edit Story Gallery"
                >
                  <FlowbiteIcon name="edit" size="14" />
                </button>
                <button
                  type="button"
                  @click="handleDeleteStory(story)"
                  class="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete Story Circle"
                >
                  <FlowbiteIcon name="trash" size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           BANNER CATEGORIES (PRODUCTS SUBMENU)
           ========================================== -->
      <div v-else-if="activeSection === 'banner-categories'" class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div class="space-y-1">
            <nav class="flex items-center gap-2 text-xs text-neutral-400">
              <FlowbiteIcon name="grid" size="14" class="text-neutral-500" />
              <span>Products</span>
              <span>&gt;</span>
              <span class="text-neutral-900 font-medium">Category Row Under Banner</span>
              <span class="text-neutral-300">•</span>
              <span class="text-xs text-neutral-400 font-medium">Real-time Firestore Sync</span>
            </nav>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Banner Categories Row (Latest Categories)
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 max-w-xl">
              Customise the horizontal category showcase displayed directly below the hero banner. Up to 7 curated cards on desktop and touch-swipeable on mobile.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              @click="handleResetBannerCategories"
              class="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset to 7 curated category cards"
            >
              <FlowbiteIcon name="refresh" size="14" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              @click="openCreateBannerCategoryModal"
              class="btn-primary text-xs !py-2.5 !px-4 inline-flex items-center gap-2 shadow-sm"
            >
              <FlowbiteIcon name="plus" size="14" stroke-width="2" />
              <span>Add Category Card</span>
            </button>
          </div>
        </div>

        <!-- Section Heading & Subtitle Configuration Card -->
        <div class="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 class="text-sm font-bold text-neutral-900">Section Header Customisation</h3>
              <p class="text-xs text-neutral-500">Edit the title, italic highlight, and subtitle displayed above the category cards.</p>
            </div>
            <button
              type="button"
              @click="handleSaveBannerCategoriesHeader"
              :disabled="savingBannerCategoriesHeader"
              class="btn-primary text-xs !py-2 !px-4 inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <FlowbiteIcon v-if="!savingBannerCategoriesHeader" name="check" size="13" stroke-width="2" />
              <span v-else class="w-3 h-3 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
              <span>{{ savingBannerCategoriesHeader ? 'Saving...' : 'Save Section Heading' }}</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Badge Text</label>
              <input
                v-model="bannerCategoriesHeaderForm.badge"
                type="text"
                placeholder="e.g. Explore Collections"
                class="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Main Heading</label>
              <input
                v-model="bannerCategoriesHeaderForm.title"
                type="text"
                placeholder="e.g. Latest"
                class="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-bold"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Italic Highlight Word</label>
              <input
                v-model="bannerCategoriesHeaderForm.highlight"
                type="text"
                placeholder="e.g. Categories"
                class="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 italic font-serif"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Subtitle / Descriptive Text</label>
              <input
                v-model="bannerCategoriesHeaderForm.subtitle"
                type="text"
                placeholder="Handpicked worlds of developmental toys, learning sets, and everyday joys."
                class="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">View All Button Label</label>
              <input
                v-model="bannerCategoriesHeaderForm.viewAllText"
                type="text"
                placeholder="View all categories"
                class="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
              />
            </div>
          </div>
        </div>

        <!-- 7 Category Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div
            v-for="cat in bannerCategories"
            :key="cat.id"
            class="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group relative"
            :class="{ 'opacity-60 bg-neutral-50/50': cat.enabled === false }"
          >
            <!-- Card Image Preview -->
            <div class="space-y-2">
              <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/70">
                <img
                  :src="useAsset(cat.image)"
                  :alt="cat.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                <span
                  class="absolute top-2 left-2 bg-neutral-950/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
                >
                  #{{ cat.order || 1 }}
                </span>

                <span
                  v-if="cat.badge"
                  class="absolute top-2 right-2 bg-[#F4EB6A] text-neutral-900 text-[9px] font-bold px-2 py-0.5 rounded-full"
                >
                  {{ cat.badge }}
                </span>

                <div class="absolute bottom-2 left-2 right-2">
                  <div class="text-xs font-bold text-white truncate">{{ cat.name }}</div>
                </div>
              </div>
            </div>

            <!-- Actions Bar -->
            <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
              <button
                type="button"
                @click="handleToggleBannerCategory(cat)"
                class="text-[11px] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer"
                :class="cat.enabled !== false ? 'text-neutral-500 hover:text-neutral-900' : 'text-emerald-700 font-bold'"
                :title="cat.enabled !== false ? 'Hide from storefront' : 'Show on storefront'"
              >
                <FlowbiteIcon :name="cat.enabled !== false ? 'eye-off' : 'eye'" size="13" />
              </button>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="openEditBannerCategoryModal(cat)"
                  class="p-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Edit Category Card"
                >
                  <FlowbiteIcon name="edit" size="13" />
                </button>
                <button
                  type="button"
                  @click="handleDeleteBannerCategory(cat)"
                  class="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete Category Card"
                >
                  <FlowbiteIcon name="trash" size="13" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TAB: CATEGORY BANNERS (MEDIA SUBMENU)
           ========================================== -->
      <div v-else-if="activeSection === 'category-banners'" class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7BA]/60 text-neutral-900 text-xs font-semibold">
                <FlowbiteIcon name="sparkles" size="14" class="text-neutral-900" />
                <span>Media files • Category Pages</span>
              </span>
              <span class="text-xs text-neutral-400 font-medium">Real-time Firestore Sync</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Category Hero Banners
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 max-w-xl">
              Customise hero banners, background visuals, headline copy, and category badges displayed at the top of category pages.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              @click="handleResetCategoryBanners"
              class="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset to default category banners"
            >
              <FlowbiteIcon name="refresh" size="14" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              @click="openCreateCategoryBannerModal"
              class="btn-primary text-xs !py-2.5 !px-4 inline-flex items-center gap-2 shadow-sm"
            >
              <FlowbiteIcon name="plus" size="14" stroke-width="2" />
              <span>Add Category Banner</span>
            </button>
          </div>
        </div>

        <!-- Category Banners Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="b in categoryBanners"
            :key="b.id"
            class="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            :class="{ 'opacity-60': b.enabled === false }"
          >
            <!-- Card Visual Preview (Mimics Storefront Hero Banner) -->
            <div class="relative h-44 bg-neutral-900 overflow-hidden">
              <img
                v-if="b.image"
                :src="useAsset(b.image)"
                :alt="b.title || b.categoryName"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center text-neutral-500 text-xs"
              >
                No Banner Image Set
              </div>

              <!-- Configured Dark Overlay -->
              <div
                class="absolute inset-0"
                :style="{ backgroundColor: `rgba(0, 0, 0, ${((b.overlayOpacity ?? 70) / 100)})` }"
              ></div>

              <!-- Header Badges -->
              <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                <span class="inline-flex items-center gap-1 bg-neutral-950/80 backdrop-blur-xs text-[#F4EB6A] text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-700/50">
                  <span>{{ b.categoryName || b.category }}</span>
                  <span v-if="b.isDefault" class="text-neutral-400 font-normal">• default</span>
                </span>
                <span
                  v-if="b.badge"
                  class="bg-[#F4EB6A] text-neutral-950 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs"
                >
                  {{ b.badge }}
                </span>
              </div>

              <!-- Card Content Overlay -->
              <div class="absolute bottom-3 left-3 right-3 text-white z-10">
                <h3 class="text-sm font-bold line-clamp-1 mb-0.5">{{ b.title }}</h3>
                <p class="text-[11px] text-neutral-300 line-clamp-2 font-light leading-snug">
                  {{ b.subtitle }}
                </p>
              </div>
            </div>

            <!-- Card Metadata & Controls -->
            <div class="p-4 flex-1 flex flex-col justify-between gap-3">
              <div class="flex items-center justify-between text-[11px] text-neutral-500">
                <div class="flex items-center gap-2">
                  <span class="font-mono font-semibold text-neutral-700">Order: #{{ b.order || 1 }}</span>
                  <span class="text-neutral-300">•</span>
                  <span>Overlay: {{ b.overlayOpacity ?? 70 }}%</span>
                </div>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="b.enabled !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'"
                >
                  {{ b.enabled !== false ? 'Active' : 'Disabled' }}
                </span>
              </div>

              <!-- Actions Row -->
              <div class="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  @click="handleToggleCategoryBanner(b)"
                  class="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                  :class="b.enabled !== false ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100' : 'text-emerald-700 hover:bg-emerald-50 font-bold'"
                  :title="b.enabled !== false ? 'Hide banner' : 'Activate banner'"
                >
                  <FlowbiteIcon :name="b.enabled !== false ? 'eye-off' : 'eye'" size="14" />
                  <span>{{ b.enabled !== false ? 'Hide' : 'Show' }}</span>
                </button>

                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="openEditCategoryBannerModal(b)"
                    class="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Edit Category Banner"
                  >
                    <FlowbiteIcon name="edit" size="14" />
                  </button>
                  <button
                    type="button"
                    @click="handleDeleteCategoryBanner(b)"
                    class="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Category Banner"
                  >
                    <FlowbiteIcon name="trash" size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TAB: COLLECTIONS BANNERS (MEDIA SUBMENU)
           ========================================== -->
      <div v-else-if="activeSection === 'collections-banners'" class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7BA]/60 text-neutral-900 text-xs font-semibold">
                <FlowbiteIcon name="sparkles" size="14" class="text-neutral-900" />
                <span>Media files • Collection Pages</span>
              </span>
              <span class="text-xs text-neutral-400 font-medium">Real-time Firestore Sync</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Collections Hero Banners
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 max-w-xl">
              Customise hero banners, background visuals, headline copy, and curated badges displayed for featured collections.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              @click="handleResetCollectionBanners"
              class="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset to default collection banners"
            >
              <FlowbiteIcon name="refresh" size="14" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              @click="openCreateCollectionBannerModal"
              class="btn-primary text-xs !py-2.5 !px-4 inline-flex items-center gap-2 shadow-sm"
            >
              <FlowbiteIcon name="plus" size="14" stroke-width="2" />
              <span>Add Collections Banner</span>
            </button>
          </div>
        </div>

        <!-- Collections Banners Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="b in collectionBanners"
            :key="b.id"
            class="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            :class="{ 'opacity-60': b.enabled === false }"
          >
            <!-- Card Visual Preview (Mimics Storefront Hero Banner) -->
            <div class="relative h-44 bg-neutral-900 overflow-hidden">
              <img
                v-if="b.image"
                :src="useAsset(b.image)"
                :alt="b.title || b.collectionName"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center text-neutral-500 text-xs"
              >
                No Banner Image Set
              </div>

              <!-- Configured Dark Overlay -->
              <div
                class="absolute inset-0"
                :style="{ backgroundColor: `rgba(0, 0, 0, ${((b.overlayOpacity ?? 70) / 100)})` }"
              ></div>

              <!-- Header Badges -->
              <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                <span class="inline-flex items-center gap-1 bg-neutral-950/80 backdrop-blur-xs text-[#F4EB6A] text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-700/50">
                  <span>{{ b.collectionName || b.collection }}</span>
                  <span v-if="b.isDefault" class="text-neutral-400 font-normal">• default</span>
                </span>
                <span
                  v-if="b.badge"
                  class="bg-[#F4EB6A] text-neutral-950 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs"
                >
                  {{ b.badge }}
                </span>
              </div>

              <!-- Card Content Overlay -->
              <div class="absolute bottom-3 left-3 right-3 text-white z-10">
                <h3 class="text-sm font-bold line-clamp-1 mb-0.5">{{ b.title }}</h3>
                <p class="text-[11px] text-neutral-300 line-clamp-2 font-light leading-snug">
                  {{ b.subtitle }}
                </p>
              </div>
            </div>

            <!-- Card Metadata & Controls -->
            <div class="p-4 flex-1 flex flex-col justify-between gap-3">
              <div class="flex items-center justify-between text-[11px] text-neutral-500">
                <div class="flex items-center gap-2">
                  <span class="font-mono font-semibold text-neutral-700">Order: #{{ b.order || 1 }}</span>
                  <span class="text-neutral-300">•</span>
                  <span>Overlay: {{ b.overlayOpacity ?? 70 }}%</span>
                </div>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="b.enabled !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'"
                >
                  {{ b.enabled !== false ? 'Active' : 'Disabled' }}
                </span>
              </div>

              <!-- Actions Row -->
              <div class="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  @click="handleToggleCollectionBanner(b)"
                  class="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                  :class="b.enabled !== false ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100' : 'text-emerald-700 hover:bg-emerald-50 font-bold'"
                  :title="b.enabled !== false ? 'Hide banner' : 'Activate banner'"
                >
                  <FlowbiteIcon :name="b.enabled !== false ? 'eye-off' : 'eye'" size="14" />
                  <span>{{ b.enabled !== false ? 'Hide' : 'Show' }}</span>
                </button>

                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="openEditCollectionBannerModal(b)"
                    class="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Edit Collection Banner"
                  >
                    <FlowbiteIcon name="edit" size="14" />
                  </button>
                  <button
                    type="button"
                    @click="handleDeleteCollectionBanner(b)"
                    class="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Collection Banner"
                  >
                    <FlowbiteIcon name="trash" size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           STAFF INVITATION & ACCESS DISPATCH MODAL
           ========================================== -->
      <transition name="fade">
        <div
          v-if="inviteDeliveryModal.show"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-poppins"
          @click.self="inviteDeliveryModal.show = false"
        >
          <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-neutral-900 text-[#F4EB6A] flex items-center justify-center shadow-md">
                  <FlowbiteIcon name="mail" size="24" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-neutral-900">
                    Team Member Invitation Hub
                  </h3>
                  <p class="text-xs text-neutral-500">
                    Onboarding instructions for <span class="font-semibold text-neutral-800">{{ inviteDeliveryModal.name }}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="inviteDeliveryModal.show = false"
                class="w-9 h-9 rounded-xl border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <FlowbiteIcon name="close" size="16" />
              </button>
            </div>

            <!-- Recipient & Role Summary Card -->
            <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span class="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Recipient Email</span>
                <span class="font-semibold text-neutral-900 font-mono text-sm">{{ inviteDeliveryModal.email }}</span>
              </div>
              <div>
                <span class="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Assigned Role</span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 text-[#F4EB6A] font-bold text-[11px]">
                  {{ inviteDeliveryModal.role }} • {{ inviteDeliveryModal.department }}
                </span>
              </div>
            </div>

            <!-- Delivery Status Banner -->
            <div
              v-if="inviteDeliveryModal.firebaseDispatched"
              class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5"
            >
              <div class="flex items-center gap-2 font-bold text-emerald-800">
                <FlowbiteIcon name="check" size="16" class="text-emerald-600" />
                <span>Firebase Auth Account Created & Password Link Dispatched</span>
              </div>
              <p class="text-emerald-700 leading-relaxed text-[11px]">
                Firebase has dispatched a password creation link to <strong class="underline">{{ inviteDeliveryModal.email }}</strong> from <code class="bg-emerald-100 px-1 py-0.5 rounded text-[10px]">noreply@ystore-db.firebaseapp.com</code>.
              </p>
            </div>

            <!-- Spam / Delivery Advisory -->
            <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div class="flex items-center gap-2 font-bold text-amber-800">
                <FlowbiteIcon name="shield-check" size="16" class="text-amber-600" />
                <span>Important Delivery Note (Avoid Spam Filters)</span>
              </div>
              <p class="text-amber-800/90 leading-relaxed text-[11px]">
                Automated emails from Firebase default domains are frequently directed to the user's <strong>Spam / Junk</strong> folder. To guarantee immediate delivery, send a direct invitation email from your verified address below.
              </p>
            </div>

            <!-- Guaranteed 1-Click Email Dispatch Actions -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Guaranteed Inbox Delivery (1-Click Send From Your Email)
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  @click="sendViaGmail"
                  class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FlowbiteIcon name="mail" size="14" />
                  <span>Send via Gmail</span>
                </button>
                <button
                  type="button"
                  @click="sendViaOutlook"
                  class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0078D4] hover:bg-[#106EBE] text-white font-semibold text-xs transition-all shadow-xs cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FlowbiteIcon name="mail" size="14" />
                  <span>Send via Outlook</span>
                </button>
                <button
                  type="button"
                  @click="sendViaMailto"
                  class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FlowbiteIcon name="mail" size="14" />
                  <span>Default Mail App</span>
                </button>
              </div>
            </div>

            <!-- Message Copy & Preview -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Invitation Message & Access Instructions
                </label>
                <button
                  type="button"
                  @click="copyInviteText"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-[#F4EB6A] transition-colors cursor-pointer"
                >
                  <span>{{ inviteDeliveryModal.copied ? '✓ Copied to Clipboard!' : '📋 Copy Text (WhatsApp / Slack)' }}</span>
                </button>
              </div>
              <div class="p-3.5 rounded-xl bg-neutral-100/80 border border-neutral-200 text-neutral-700 font-mono text-[11px] leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
                {{ inviteDeliveryModal.body }}
              </div>
            </div>

            <!-- Close Action -->
            <div class="pt-2 flex justify-end">
              <button
                type="button"
                @click="inviteDeliveryModal.show = false"
                class="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Close &amp; Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- ==========================================
           THEME GUARANTEE STAT MODAL
           ========================================== -->
      <transition name="fade">
        <div
          v-if="showGuaranteeStatModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-poppins"
          @click.self="showGuaranteeStatModal = false"
        >
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-neutral-900 text-[#F4EB6A] flex items-center justify-center shadow-md">
                  <FlowbiteIcon name="shield-check" size="22" />
                </div>
                <div>
                  <h3 class="text-base font-bold text-neutral-900">
                    {{ editingGuaranteeStat ? 'Edit Guarantee Stat' : 'New Guarantee Stat Badge' }}
                  </h3>
                  <p class="text-xs text-neutral-500">
                    Displayed directly under the landing page hero banner.
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="showGuaranteeStatModal = false"
                class="w-8 h-8 rounded-xl border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <FlowbiteIcon name="close" size="14" />
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSaveGuaranteeStat" class="space-y-4">
              <!-- Title Input -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Badge Title *
                </label>
                <input
                  v-model="guaranteeStatForm.title"
                  type="text"
                  required
                  placeholder="e.g. Free shipping, Secure payments, Easy Returns"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                />
              </div>

              <!-- Description Input -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Subtext / Guarantee Description *
                </label>
                <input
                  v-model="guaranteeStatForm.description"
                  type="text"
                  required
                  placeholder="e.g. Free delivery on orders over R500"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                />
              </div>

              <!-- Icon Selector / Upload -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Badge Icon (Flowbite icon name or uploaded image)
                </label>
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-[#FAF7BA]/60 border border-[#F4EB6A]/50 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      v-if="guaranteeStatForm.icon && (guaranteeStatForm.icon.includes('/') || guaranteeStatForm.icon.startsWith('data:'))"
                      :src="useAsset(guaranteeStatForm.icon)"
                      :alt="guaranteeStatForm.title"
                      class="w-6 h-6 object-contain"
                    />
                    <FlowbiteIcon
                      v-else
                      :name="guaranteeStatForm.icon || 'shield-check'"
                      size="22"
                      class="text-neutral-900"
                    />
                  </div>

                  <div class="flex-1 space-y-1.5">
                    <div class="flex items-center gap-2">
                      <input
                        v-model="guaranteeStatForm.icon"
                        type="text"
                        placeholder="truck, lock, refresh, user-headset"
                        class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                      />
                      <label class="px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 shrink-0 cursor-pointer transition-colors flex items-center gap-1.5">
                        <FlowbiteIcon name="upload" size="13" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          @change="handleGuaranteeStatIconUpload"
                          class="hidden"
                        />
                      </label>
                    </div>
                    <span class="text-[10px] text-neutral-400 block">
                      Common icons: <code class="text-neutral-700">truck</code>, <code class="text-neutral-700">lock</code>, <code class="text-neutral-700">refresh</code>, <code class="text-neutral-700">user-headset</code>, <code class="text-neutral-700">sparkles</code>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Order / Sequence -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Display Sequence (1 to 4)
                  </label>
                  <input
                    v-model.number="guaranteeStatForm.order"
                    type="number"
                    min="1"
                    max="10"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                  />
                </div>

                <div class="flex items-center pt-6">
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="guaranteeStatForm.enabled"
                      type="checkbox"
                      class="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-[#F4EB6A]"
                    />
                    <span class="text-xs font-semibold text-neutral-800">Publish on storefront</span>
                  </label>
                </div>
              </div>

              <!-- Modal Actions -->
              <div class="pt-4 flex items-center justify-end gap-2.5 border-t border-neutral-100">
                <button
                  type="button"
                  @click="showGuaranteeStatModal = false"
                  class="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  :disabled="guaranteeStatSaving"
                  class="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <FlowbiteIcon v-if="!guaranteeStatSaving" name="check" size="14" stroke-width="2" />
                  <span v-else class="w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
                  <span>{{ guaranteeStatSaving ? 'Saving...' : 'Save Guarantee Stat' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>

      <!-- ==========================================
           STORY MODAL (HIGHLIGHTS LIGHTBOX BUILDER)
           ========================================== -->
      <transition name="fade">
        <div
          v-if="showStoryModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-poppins"
          @click.self="showStoryModal = false"
        >
          <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 class="text-base font-bold text-neutral-900">
                  {{ editingStory ? 'Edit Story Highlight' : 'New Story Highlight' }}
                </h3>
                <p class="text-xs text-neutral-500">
                  Circular story track above hero banner + swipeable lightbox gallery.
                </p>
              </div>
              <button
                type="button"
                @click="showStoryModal = false"
                class="w-8 h-8 rounded-xl border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <FlowbiteIcon name="close" size="14" />
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSaveStory" class="space-y-5">
              <!-- Basic Info -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Story Circle Title *
                  </label>
                  <input
                    v-model="storyForm.title"
                    type="text"
                    required
                    placeholder="e.g. Deals, What We Offer, Categories, About Us"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Display Sequence (1, 2, 3...)
                  </label>
                  <input
                    v-model.number="storyForm.order"
                    type="number"
                    min="1"
                    max="20"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <!-- Circle Thumbnail Image -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Circle Ring Thumbnail (Icon / Cover)
                </label>
                <div class="flex items-center gap-3">
                  <div class="w-14 h-14 rounded-full overflow-hidden bg-neutral-900 border-2 border-[#F4EB6A] flex items-center justify-center shrink-0">
                    <img
                      v-if="storyForm.icon"
                      :src="useAsset(storyForm.icon)"
                      class="w-full h-full object-cover"
                    />
                    <FlowbiteIcon v-else name="camera" size="20" class="text-[#F4EB6A]" />
                  </div>

                  <div class="flex-1 space-y-1.5">
                    <div class="flex items-center gap-2">
                      <input
                        v-model="storyForm.icon"
                        type="text"
                        placeholder="Image URL or upload..."
                        class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                      />
                      <label
                        class="px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 shrink-0 cursor-pointer transition-colors flex items-center gap-1.5"
                        :class="{ 'opacity-60 pointer-events-none': storyUploading }"
                      >
                        <FlowbiteIcon name="upload" size="13" />
                        <span>{{ storyUploading ? 'Uploading...' : 'Upload' }}</span>
                        <input
                          type="file"
                          accept="image/*"
                          :disabled="storyUploading"
                          @change="handleStoryIconUpload"
                          class="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lightbox Slides Management -->
              <div class="space-y-3 pt-2 border-t border-neutral-100">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Lightbox Gallery Slides ({{ storyForm.slides.length }})
                  </h4>
                  <span class="text-[11px] text-neutral-400">Max 1080px width on desktop</span>
                </div>

                <!-- Existing Slides List -->
                <div v-if="storyForm.slides.length > 0" class="space-y-2">
                  <div
                    v-for="(slide, sIdx) in storyForm.slides"
                    :key="sIdx"
                    class="p-3 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3 text-xs"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-3 min-w-0">
                        <div class="w-12 h-12 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
                          <img :src="useAsset(slide.image)" class="w-full h-full object-cover" />
                        </div>
                        <div class="min-w-0">
                          <div class="font-bold text-neutral-900 truncate">{{ slide.caption || 'Slide #' + (sIdx + 1) }}</div>
                          <div class="text-[11px] text-neutral-500 truncate">
                            CTA: <span class="font-semibold text-neutral-800">{{ slide.ctaText || 'Shop Now' }}</span> &rarr; {{ slide.ctaLink || 'All' }}
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          @click="toggleEditSlide(sIdx)"
                          class="px-2 py-1 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer"
                          :class="editingSlideIdx === sIdx ? 'bg-neutral-900 text-[#F4EB6A] border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'"
                          :title="editingSlideIdx === sIdx ? 'Finish editing slide' : 'Edit slide'"
                        >
                          {{ editingSlideIdx === sIdx ? 'Done' : 'Edit' }}
                        </button>
                        <button
                          type="button"
                          @click="moveSlide(sIdx, -1)"
                          :disabled="sIdx === 0"
                          class="p-1.5 rounded text-neutral-500 hover:text-neutral-900 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          &uarr;
                        </button>
                        <button
                          type="button"
                          @click="moveSlide(sIdx, 1)"
                          :disabled="sIdx === storyForm.slides.length - 1"
                          class="p-1.5 rounded text-neutral-500 hover:text-neutral-900 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          &darr;
                        </button>
                        <button
                          type="button"
                          @click="removeSlideFromStory(sIdx)"
                          class="p-1.5 rounded text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          title="Remove Slide"
                        >
                          <FlowbiteIcon name="trash" size="13" />
                        </button>
                      </div>
                    </div>

                    <!-- Inline Slide Editor -->
                    <div
                      v-if="editingSlideIdx === sIdx"
                      class="pt-3 border-t border-neutral-200 space-y-2.5 bg-white p-3 rounded-xl"
                    >
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span class="text-[11px] font-bold text-neutral-800">Edit Slide #{{ sIdx + 1 }}</span>
                        <select
                          @change="applyProductToExistingSlide(sIdx, $event.target.value); $event.target.value = ''"
                          class="sm:w-64 px-2.5 py-1 rounded-lg border border-neutral-200 bg-neutral-50 text-[11px] text-neutral-800 focus:outline-none focus:border-neutral-900"
                          aria-label="Replace slide details with product"
                        >
                          <option value="">Link to a product (optional)...</option>
                          <option v-for="p in products" :key="p.id" :value="p.id">
                            {{ p.name }} (R{{ p.price }})
                          </option>
                        </select>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Slide Image *</label>
                          <div class="flex items-center gap-2">
                            <input
                              v-model="slide.image"
                              type="text"
                              placeholder="Image URL or upload..."
                              class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono"
                            />
                            <label
                              class="px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-700 shrink-0 cursor-pointer transition-colors flex items-center gap-1"
                              :class="{ 'opacity-60 pointer-events-none': storyUploading }"
                            >
                              <FlowbiteIcon name="upload" size="12" />
                              <span>{{ storyUploading ? 'Uploading...' : 'Upload' }}</span>
                              <input
                                type="file"
                                accept="image/*"
                                :disabled="storyUploading"
                                @change="handleExistingSlideImageUpload($event, sIdx)"
                                class="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Slide Caption / Headline</label>
                          <input
                            v-model="slide.caption"
                            type="text"
                            placeholder="e.g. Handmade wooden blocks collection"
                            class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs"
                          />
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label class="block text-[11px] font-semibold text-neutral-600 mb-1">CTA Button Text</label>
                          <input
                            v-model="slide.ctaText"
                            type="text"
                            placeholder="Shop Now"
                            class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs"
                          />
                        </div>
                        <div>
                          <label class="block text-[11px] font-semibold text-neutral-600 mb-1">CTA Destination (Category or View)</label>
                          <input
                            v-model="slide.ctaLink"
                            type="text"
                            placeholder="All, New Arrivals, product:id..."
                            class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add New Slide Mini-Form -->
                <div class="p-3.5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span class="text-xs font-bold text-neutral-800 block">+ Add Slide to this Gallery</span>
                    <div class="flex items-center gap-2 sm:w-72">
                      <select
                        v-model="selectedSlideProductId"
                        @change="applyProductToStorySlide(selectedSlideProductId)"
                        class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
                        aria-label="Select a product for this slide"
                      >
                        <option value="">Select a product (optional)...</option>
                        <option v-for="p in products" :key="p.id" :value="p.id">
                          {{ p.name }} (R{{ p.price }})
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Product Images Picker (when a product is selected) -->
                  <div
                    v-if="selectedSlideProductId && selectedProductGalleryImages.length > 0"
                    class="p-3 rounded-xl bg-white border border-neutral-200 space-y-2.5"
                  >
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <span class="text-[11px] font-bold text-neutral-800">
                        Product Images ({{ selectedStoryProductImages.length }} / {{ selectedProductGalleryImages.length }} selected)
                      </span>
                      <div class="flex flex-wrap items-center gap-1">
                        <span class="text-[10px] font-semibold text-neutral-500 mr-1">Limit:</span>
                        <button
                          v-for="count in [1, 2, 3, 4].filter(n => n <= selectedProductGalleryImages.length)"
                          :key="count"
                          type="button"
                          @click="setStoryProductImageLimit(count)"
                          class="px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors"
                          :class="selectedStoryProductImages.length === count ? 'bg-neutral-900 text-[#F4EB6A] border-neutral-900' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'"
                        >
                          {{ count }}
                        </button>
                        <button
                          type="button"
                          @click="setStoryProductImageLimit('all')"
                          class="px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors"
                          :class="selectedStoryProductImages.length === selectedProductGalleryImages.length ? 'bg-neutral-900 text-[#F4EB6A] border-neutral-900' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'"
                        >
                          All
                        </button>
                        <button
                          type="button"
                          @click="setStoryProductImageLimit(0)"
                          class="px-2 py-0.5 rounded-lg text-[10px] font-semibold border border-neutral-200 bg-white text-neutral-500 hover:text-red-600 hover:border-red-200 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      <button
                        v-for="(imgUrl, imgIdx) in selectedProductGalleryImages"
                        :key="imgIdx"
                        type="button"
                        @click="toggleStoryProductImage(imgUrl)"
                        class="relative aspect-square rounded-lg overflow-hidden border-2 transition-all bg-neutral-100 group"
                        :class="selectedStoryProductImages.includes(imgUrl) ? 'border-neutral-900 ring-2 ring-[#F4EB6A]' : 'border-neutral-200 opacity-55 hover:opacity-90'"
                        :title="selectedStoryProductImages.includes(imgUrl) ? 'Click to exclude from story' : 'Click to include in story'"
                      >
                        <img :src="imgUrl" class="w-full h-full object-cover" />
                        <span
                          class="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow"
                          :class="selectedStoryProductImages.includes(imgUrl) ? 'bg-neutral-900 text-[#F4EB6A]' : 'bg-white/90 text-neutral-400 border border-neutral-300'"
                        >
                          {{ selectedStoryProductImages.includes(imgUrl) ? '✓' : '' }}
                        </span>
                      </button>
                    </div>

                    <div class="flex items-center justify-between gap-2 pt-1">
                      <p class="text-[10px] text-neutral-500">
                        Click images to toggle which ones are added as lightbox slides.
                      </p>
                      <button
                        type="button"
                        @click="addSelectedProductSlidesToStory"
                        :disabled="selectedStoryProductImages.length === 0"
                        class="px-3 py-1.5 rounded-xl bg-neutral-900 text-[#F4EB6A] text-[11px] font-bold hover:bg-neutral-800 disabled:opacity-40 transition-colors shrink-0"
                      >
                        + Add {{ selectedStoryProductImages.length }} Slide{{ selectedStoryProductImages.length === 1 ? '' : 's' }} to Gallery
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Slide Image *</label>
                      <div class="flex items-center gap-2">
                        <input
                          v-model="newSlideForm.image"
                          type="text"
                          placeholder="Image URL or upload..."
                          class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono"
                        />
                        <label
                          class="px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-700 shrink-0 cursor-pointer transition-colors flex items-center gap-1"
                          :class="{ 'opacity-60 pointer-events-none': storyUploading }"
                        >
                          <FlowbiteIcon name="upload" size="12" />
                          <span>{{ storyUploading ? 'Uploading...' : 'Upload' }}</span>
                          <input
                            type="file"
                            accept="image/*"
                            :disabled="storyUploading"
                            @change="handleSlideImageUpload"
                            class="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label class="block text-[11px] font-semibold text-neutral-600 mb-1">Slide Caption / Headline</label>
                      <input
                        v-model="newSlideForm.caption"
                        type="text"
                        placeholder="e.g. Handmade wooden blocks collection"
                        class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label class="block text-[11px] font-semibold text-neutral-600 mb-1">CTA Button Text</label>
                      <input
                        v-model="newSlideForm.ctaText"
                        type="text"
                        placeholder="Shop Now"
                        class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold"
                      />
                    </div>

                    <div class="sm:col-span-2">
                      <label class="block text-[11px] font-semibold text-neutral-600 mb-1">CTA Destination (Category or View)</label>
                      <div class="flex items-center gap-2">
                        <input
                          v-model="newSlideForm.ctaLink"
                          type="text"
                          placeholder="Building Blocks, specials, about, contact..."
                          class="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs"
                        />
                        <button
                          type="button"
                          @click="addSlideToStory"
                          class="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-bold shrink-0 cursor-pointer transition-colors"
                        >
                          Add Slide
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Publish Toggle -->
              <div class="pt-2">
                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="storyForm.enabled"
                    type="checkbox"
                    class="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-[#F4EB6A]"
                  />
                  <span class="text-xs font-semibold text-neutral-800">Publish & visible in circular story track</span>
                </label>
              </div>

              <!-- Modal Actions -->
              <div class="pt-4 flex items-center justify-end gap-2.5 border-t border-neutral-100">
                <button
                  type="button"
                  @click="showStoryModal = false"
                  class="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  :disabled="storySaving"
                  class="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <FlowbiteIcon v-if="!storySaving" name="check" size="14" stroke-width="2" />
                  <span v-else class="w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
                  <span>{{ storySaving ? 'Saving...' : 'Save Story Highlight' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>

      <!-- ==========================================
           BANNER CATEGORY MODAL (BELOW HERO BANNER)
           ========================================== -->
      <transition name="fade">
        <div
          v-if="showBannerCategoryModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-poppins"
          @click.self="showBannerCategoryModal = false"
        >
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-neutral-900 text-[#F4EB6A] flex items-center justify-center shadow-md">
                  <FlowbiteIcon name="grid" size="22" />
                </div>
                <div>
                  <h3 class="text-base font-bold text-neutral-900">
                    {{ editingBannerCategory ? 'Edit Category Card' : 'New Banner Category Card' }}
                  </h3>
                  <p class="text-xs text-neutral-500">
                    Displayed in the horizontal latest categories row under the banner.
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="showBannerCategoryModal = false"
                class="w-8 h-8 rounded-xl border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <FlowbiteIcon name="close" size="14" />
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSaveBannerCategory" class="space-y-4">
              <!-- Name Input -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Category Name *
                </label>
                <input
                  v-model="bannerCategoryForm.name"
                  type="text"
                  required
                  placeholder="e.g. Building Blocks, Plush Toys, Action Figures"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                />
              </div>

              <!-- Image & Upload -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Card Cover Image *
                </label>
                <div class="flex items-center gap-3">
                  <div class="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                    <img
                      v-if="bannerCategoryForm.image"
                      :src="useAsset(bannerCategoryForm.image)"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                      No img
                    </div>
                  </div>

                  <div class="flex-1 space-y-1.5">
                    <div class="flex items-center gap-2">
                      <input
                        v-model="bannerCategoryForm.image"
                        type="text"
                        placeholder="Image URL or upload..."
                        class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                      />
                      <label class="px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 shrink-0 cursor-pointer transition-colors flex items-center gap-1.5">
                        <FlowbiteIcon name="upload" size="13" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          @change="handleBannerCatImageUpload"
                          class="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Badge & Item Count Row -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Badge Text (Optional)
                  </label>
                  <input
                    v-model="bannerCategoryForm.badge"
                    type="text"
                    placeholder="e.g. Popular, New"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Item Count
                  </label>
                  <input
                    v-model.number="bannerCategoryForm.itemCount"
                    type="number"
                    min="0"
                    placeholder="12"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <!-- Sequence Order & Link Filter Row -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Sequence Order (1 to 7)
                  </label>
                  <input
                    v-model.number="bannerCategoryForm.order"
                    type="number"
                    min="1"
                    max="10"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Filter Name / Target
                  </label>
                  <input
                    v-model="bannerCategoryForm.link"
                    type="text"
                    placeholder="Defaults to Category Name"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                  />
                </div>
              </div>

              <!-- Publish Checkbox -->
              <div class="pt-2">
                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="bannerCategoryForm.enabled"
                    type="checkbox"
                    class="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-[#F4EB6A]"
                  />
                  <span class="text-xs font-semibold text-neutral-800">Publish & visible below hero banner</span>
                </label>
              </div>

              <!-- Modal Actions -->
              <div class="pt-4 flex items-center justify-end gap-2.5 border-t border-neutral-100">
                <button
                  type="button"
                  @click="showBannerCategoryModal = false"
                  class="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  :disabled="bannerCategorySaving"
                  class="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <FlowbiteIcon v-if="!bannerCategorySaving" name="check" size="14" stroke-width="2" />
                  <span v-else class="w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
                  <span>{{ bannerCategorySaving ? 'Saving...' : 'Save Category Card' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>

      <!-- ==========================================
           CATEGORY BANNER MODAL (HERO FOR CATEGORIES)
           ========================================== -->
      <transition name="fade">
        <div
          v-if="showCategoryBannerModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-poppins"
          @click.self="showCategoryBannerModal = false"
        >
          <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-neutral-900 text-[#F4EB6A] flex items-center justify-center shadow-md">
                  <FlowbiteIcon name="image" size="22" />
                </div>
                <div>
                  <h3 class="text-base font-bold text-neutral-900">
                    {{ editingCategoryBanner ? 'Edit Category Hero Banner' : 'New Category Hero Banner' }}
                  </h3>
                  <p class="text-xs text-neutral-500">
                    Displayed at the top of category pages.
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="showCategoryBannerModal = false"
                class="w-8 h-8 rounded-xl border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <FlowbiteIcon name="close" size="14" />
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSaveCategoryBanner" class="space-y-4">
              <!-- Category Selector / Association -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Target Category *
                  </label>
                  <input
                    v-model="categoryBannerForm.category"
                    type="text"
                    required
                    placeholder="All, Building Blocks, Plush Toys..."
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                  />
                  <div class="mt-1 flex flex-wrap gap-1">
                    <span
                      v-for="c in ['All', ...categories.map(cat => cat.name)]"
                      :key="c"
                      @click="categoryBannerForm.category = c; categoryBannerForm.categoryName = (c === 'All' ? 'All Categories' : c)"
                      class="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 hover:bg-[#F4EB6A]/40 text-neutral-700 cursor-pointer"
                    >
                      {{ c }}
                    </span>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Display Label / Name
                  </label>
                  <input
                    v-model="categoryBannerForm.categoryName"
                    type="text"
                    placeholder="e.g. Building Blocks"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                  />
                </div>
              </div>

              <!-- Banner Title & Badge -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Banner Heading (Title) *
                  </label>
                  <input
                    v-model="categoryBannerForm.title"
                    type="text"
                    required
                    placeholder="e.g. Architectural &amp; Montessori Blocks"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-bold"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Badge Pill
                  </label>
                  <input
                    v-model="categoryBannerForm.badge"
                    type="text"
                    placeholder="e.g. Montessori &amp; STEM"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                  />
                </div>
              </div>

              <!-- Subtitle / Description -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Subtitle / Description
                </label>
                <textarea
                  v-model="categoryBannerForm.subtitle"
                  rows="2"
                  placeholder="Develop spatial reasoning, fine motor skills, and creative imagination with eco-friendly block sets."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 leading-relaxed"
                ></textarea>
              </div>

              <!-- Desktop Image & Upload -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Desktop Hero Banner Background Image
                </label>
                <div class="flex items-center gap-3">
                  <div class="w-16 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 shrink-0">
                    <img
                      v-if="categoryBannerForm.image"
                      :src="useAsset(categoryBannerForm.image)"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-neutral-500 text-[10px]">
                      No Image
                    </div>
                  </div>

                  <div class="flex-1 space-y-1.5">
                    <div class="flex items-center gap-2">
                      <input
                        v-model="categoryBannerForm.image"
                        type="text"
                        placeholder="Image URL or upload..."
                        class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                      />
                      <label class="px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 shrink-0 cursor-pointer transition-colors flex items-center gap-1.5">
                        <FlowbiteIcon name="upload" size="13" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          @change="(e) => handleCategoryBannerImageUpload(e, false)"
                          class="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mobile Image (Optional) & Upload -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Mobile Image (Optional - falls back to desktop image)
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="categoryBannerForm.mobileImage"
                    type="text"
                    placeholder="Optional mobile crop URL or upload..."
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                  />
                  <label class="px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 shrink-0 cursor-pointer transition-colors flex items-center gap-1.5">
                    <FlowbiteIcon name="upload" size="13" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      @change="(e) => handleCategoryBannerImageUpload(e, true)"
                      class="hidden"
                    />
                  </label>
                </div>
              </div>

              <!-- Overlay Opacity & Sequence Order -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="text-xs font-semibold text-neutral-700">Dark Overlay Opacity</label>
                    <span class="text-xs font-mono font-bold text-neutral-900">{{ categoryBannerForm.overlayOpacity }}%</span>
                  </div>
                  <input
                    v-model.number="categoryBannerForm.overlayOpacity"
                    type="range"
                    min="10"
                    max="95"
                    step="5"
                    class="w-full accent-neutral-900"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    v-model.number="categoryBannerForm.order"
                    type="number"
                    min="1"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <!-- Publish Checkbox -->
              <div class="pt-2 flex items-center justify-between">
                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="categoryBannerForm.enabled"
                    type="checkbox"
                    class="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-[#F4EB6A]"
                  />
                  <span class="text-xs font-semibold text-neutral-800">Publish &amp; activate on category page</span>
                </label>

                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="categoryBannerForm.isDefault"
                    type="checkbox"
                    class="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-[#F4EB6A]"
                  />
                  <span class="text-xs text-neutral-600">Default fallback</span>
                </label>
              </div>

              <!-- Modal Actions -->
              <div class="pt-4 flex items-center justify-end gap-2.5 border-t border-neutral-100">
                <button
                  type="button"
                  @click="showCategoryBannerModal = false"
                  class="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  :disabled="categoryBannerSaving"
                  class="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <FlowbiteIcon v-if="!categoryBannerSaving" name="check" size="14" stroke-width="2" />
                  <span v-else class="w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
                  <span>{{ categoryBannerSaving ? 'Saving...' : 'Save Category Banner' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>

      <!-- ==========================================
           COLLECTION BANNER MODAL (HERO FOR COLLECTIONS)
           ========================================== -->
      <transition name="fade">
        <div
          v-if="showCollectionBannerModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-poppins"
          @click.self="showCollectionBannerModal = false"
        >
          <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-neutral-900 text-[#F4EB6A] flex items-center justify-center shadow-md">
                  <FlowbiteIcon name="image" size="22" />
                </div>
                <div>
                  <h3 class="text-base font-bold text-neutral-900">
                    {{ editingCollectionBanner ? 'Edit Collection Hero Banner' : 'New Collection Hero Banner' }}
                  </h3>
                  <p class="text-xs text-neutral-500">
                    Displayed at the top of curated collection pages.
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="showCollectionBannerModal = false"
                class="w-8 h-8 rounded-xl border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <FlowbiteIcon name="close" size="14" />
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSaveCollectionBanner" class="space-y-4">
              <!-- Collection Selector / Association -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Target Collection *
                  </label>
                  <input
                    v-model="collectionBannerForm.collection"
                    type="text"
                    required
                    placeholder="All Collections, Wooden Classics..."
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                  />
                  <div class="mt-1 flex flex-wrap gap-1">
                    <span
                      v-for="c in ['All Collections', ...collections.map(col => col.name)]"
                      :key="c"
                      @click="collectionBannerForm.collection = c; collectionBannerForm.collectionName = c"
                      class="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 hover:bg-[#F4EB6A]/40 text-neutral-700 cursor-pointer"
                    >
                      {{ c }}
                    </span>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Display Label / Name
                  </label>
                  <input
                    v-model="collectionBannerForm.collectionName"
                    type="text"
                    placeholder="e.g. Wooden Classics"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                  />
                </div>
              </div>

              <!-- Banner Title & Badge -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Banner Heading (Title) *
                  </label>
                  <input
                    v-model="collectionBannerForm.title"
                    type="text"
                    required
                    placeholder="e.g. Handcrafted Wooden Toys"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-bold"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Badge Pill
                  </label>
                  <input
                    v-model="collectionBannerForm.badge"
                    type="text"
                    placeholder="e.g. Heirloom Series"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900"
                  />
                </div>
              </div>

              <!-- Subtitle / Description -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Subtitle / Description
                </label>
                <textarea
                  v-model="collectionBannerForm.subtitle"
                  rows="2"
                  placeholder="Sustainably sourced beechwood, non-toxic water-based finishes, and heirloom durability built to last."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 leading-relaxed"
                ></textarea>
              </div>

              <!-- Desktop Image & Upload -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Desktop Hero Banner Background Image
                </label>
                <div class="flex items-center gap-3">
                  <div class="w-16 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 shrink-0">
                    <img
                      v-if="collectionBannerForm.image"
                      :src="useAsset(collectionBannerForm.image)"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-neutral-500 text-[10px]">
                      No Image
                    </div>
                  </div>

                  <div class="flex-1 space-y-1.5">
                    <div class="flex items-center gap-2">
                      <input
                        v-model="collectionBannerForm.image"
                        type="text"
                        placeholder="Image URL or upload..."
                        class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                      />
                      <label class="px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 shrink-0 cursor-pointer transition-colors flex items-center gap-1.5">
                        <FlowbiteIcon name="upload" size="13" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          @change="(e) => handleCollectionBannerImageUpload(e, false)"
                          class="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mobile Image (Optional) & Upload -->
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Mobile Image (Optional - falls back to desktop image)
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="collectionBannerForm.mobileImage"
                    type="text"
                    placeholder="Optional mobile crop URL or upload..."
                    class="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                  />
                  <label class="px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 shrink-0 cursor-pointer transition-colors flex items-center gap-1.5">
                    <FlowbiteIcon name="upload" size="13" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      @change="(e) => handleCollectionBannerImageUpload(e, true)"
                      class="hidden"
                    />
                  </label>
                </div>
              </div>

              <!-- Overlay Opacity & Sequence Order -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="text-xs font-semibold text-neutral-700">Dark Overlay Opacity</label>
                    <span class="text-xs font-mono font-bold text-neutral-900">{{ collectionBannerForm.overlayOpacity }}%</span>
                  </div>
                  <input
                    v-model.number="collectionBannerForm.overlayOpacity"
                    type="range"
                    min="10"
                    max="95"
                    step="5"
                    class="w-full accent-neutral-900"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    v-model.number="collectionBannerForm.order"
                    type="number"
                    min="1"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F4EB6A] text-xs text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <!-- Publish Checkbox -->
              <div class="pt-2 flex items-center justify-between">
                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="collectionBannerForm.enabled"
                    type="checkbox"
                    class="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-[#F4EB6A]"
                  />
                  <span class="text-xs font-semibold text-neutral-800">Publish &amp; activate on collection page</span>
                </label>

                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="collectionBannerForm.isDefault"
                    type="checkbox"
                    class="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-[#F4EB6A]"
                  />
                  <span class="text-xs text-neutral-600">Default fallback</span>
                </label>
              </div>

              <!-- Modal Actions -->
              <div class="pt-4 flex items-center justify-end gap-2.5 border-t border-neutral-100">
                <button
                  type="button"
                  @click="showCollectionBannerModal = false"
                  class="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  :disabled="collectionBannerSaving"
                  class="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <FlowbiteIcon v-if="!collectionBannerSaving" name="check" size="14" stroke-width="2" />
                  <span v-else class="w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
                  <span>{{ collectionBannerSaving ? 'Saving...' : 'Save Collection Banner' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'
import { useFirebaseStorage } from '../composables/useFirebaseStorage'
import { useStoreContent } from '../composables/useStoreContent'
import { useSiteSeo } from '../composables/useSiteSeo'

const emit = defineEmits(['view-storefront', 'signed-out'])

const {
  trackingConfig,
  pagesSeo,
  isSavingSeo,
  initTrackingListener,
  updateTrackingConfig
} = useSiteSeo()

const handleSaveTracking = async () => {
  try {
    await updateTrackingConfig({ ...trackingConfig })
    notify('Tracking tags & SEO settings saved and synced to the live site!', 'success')
  } catch (err) {
    notify(err?.message || 'Failed to save tracking settings', 'error')
  }
}

onMounted(() => {
  initTrackingListener()
})

const { currentUser, logout, sendTeamMemberInvite } = useFirebaseAuth()
const {
  uploadProgress,
  isUploading,
  uploadedItems,
  uploadFile,
  uploadMultipleFiles,
  listFolderFiles,
  deleteFile
} = useFirebaseStorage()

const storeContent = useStoreContent()
const {
  products,
  categories,
  collections,
  discounts,
  blogs,
  orders,
  customers,
  customerSegments,
  purchaseOrders,
  banners,
  activeBanners,
  paymentSettings,
  savePaymentSettings,
  defaultPaymentSettings,
  initContentListeners,
  initAdminListeners,
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
  updateOrderStatus,
  deleteOrder,
  saveBanner,
  deleteBanner,
  guaranteeStats,
  saveGuaranteeStat,
  deleteGuaranteeStat,
  resetGuaranteeStatsToDefaults,
  defaultInitialGuaranteeStats,
  saveCustomerSegment,
  deleteCustomerSegment,
  savePurchaseOrder,
  deletePurchaseOrder,
  receivePurchaseOrder,
  productStories,
  saveStory,
  deleteStory,
  resetStoriesToDefaults,
  defaultInitialStories,
  bannerCategories,
  saveBannerCategory,
  deleteBannerCategory,
  resetBannerCategoriesToDefaults,
  defaultInitialBannerCategories,
  bannerCategoriesHeader,
  saveBannerCategoriesHeader,
  defaultBannerCategoriesHeader,
  categoryBanners,
  saveCategoryBanner,
  deleteCategoryBanner,
  resetCategoryBannersToDefaults,
  defaultInitialCategoryBanners,
  collectionBanners,
  saveCollectionBanner,
  deleteCollectionBanner,
  resetCollectionBannersToDefaults,
  defaultInitialCollectionBanners,
  themeConfig,
  saveThemeConfig,
  defaultThemeConfig,
  headingSlides,
  saveHeadingSlides,
  defaultHeadingSlides,
  storeReviews,
  googleReviewsConfig,
  saveStoreReview,
  deleteStoreReview,
  resetStoreReviewsToDefaults,
  saveGoogleReviewsConfig,
  syncGoogleReviews,
  productReviews,
  saveProductReview,
  deleteProductReview,
  subscriptionConfig,
  defaultSubscriptionConfig,
  saveSubscriptionConfig,
  subscriptionMailbox,
  defaultSubscriptionMailbox,
  companyProfile,
  defaultCompanyProfile,
  saveCompanyProfile,
  loadSubscriptionMailbox,
  saveSubscriptionMailbox,
  testMailboxEndpoint,
  newsletterSubscribers,
  deleteNewsletterSubscriber,
  mailerCampaigns,
  saveMailerCampaign,
  deleteMailerCampaign,
  liveActiveSessions,
  activeVisitorCount,
  showBadgePills,
  isVideoFile
} = storeContent

const adminUsers = storeContent?.adminUsers || ref([])
const defaultAdminUsers = storeContent?.defaultAdminUsers || []
const saveAdminUser = storeContent?.saveAdminUser
const deleteAdminUser = storeContent?.deleteAdminUser

if (!adminUsers.value) {
  adminUsers.value = []
}

// ==========================================
// THEME: GUARANTEE STATS (TRUST BADGES) METHODS
// ==========================================
const showGuaranteeStatModal = ref(false)
const editingGuaranteeStat = ref(null)
const guaranteeStatSaving = ref(false)
const guaranteeStatUploading = ref(false)

const guaranteeStatForm = ref({
  id: '',
  title: '',
  description: '',
  icon: '',
  order: 1,
  enabled: true
})

const openCreateGuaranteeStatModal = () => {
  editingGuaranteeStat.value = null
  guaranteeStatForm.value = {
    id: '',
    title: '',
    description: '',
    icon: '',
    order: (guaranteeStats.value?.length || 0) + 1,
    enabled: true
  }
  showGuaranteeStatModal.value = true
}

const openEditGuaranteeStatModal = (stat) => {
  editingGuaranteeStat.value = stat
  guaranteeStatForm.value = {
    id: stat.id,
    title: stat.title || '',
    description: stat.description || '',
    icon: stat.icon || '',
    order: stat.order || 1,
    enabled: stat.enabled !== false
  }
  showGuaranteeStatModal.value = true
}

const handleGuaranteeStatIconUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  guaranteeStatUploading.value = true
  try {
    const res = await uploadFile(file, 'theme-stats')
    const downloadUrl = (typeof res === 'object' && res?.url) ? res.url : res
    if (downloadUrl) {
      guaranteeStatForm.value.icon = downloadUrl
      notify('Trust badge icon uploaded successfully!')
    }
  } catch (err) {
    notify(err?.message || 'Failed to upload icon', 'error')
  } finally {
    guaranteeStatUploading.value = false
    if (e.target) e.target.value = ''
  }
}

const handleSaveGuaranteeStat = async () => {
  if (!guaranteeStatForm.value.title?.trim()) {
    notify('Please enter a badge title', 'error')
    return
  }
  guaranteeStatSaving.value = true
  try {
    await saveGuaranteeStat(guaranteeStatForm.value, editingGuaranteeStat.value?.id)
    notify('Guarantee stat saved & synced to live storefront!')
    showGuaranteeStatModal.value = false
  } catch (err) {
    notify(err?.message || 'Failed to save guarantee stat', 'error')
  } finally {
    guaranteeStatSaving.value = false
  }
}

const handleDeleteGuaranteeStat = async (stat) => {
  if (confirm(`Delete guarantee stat "${stat.title}"?`)) {
    try {
      await deleteGuaranteeStat(stat.id)
      notify('Guarantee stat removed.', 'info')
    } catch (err) {
      notify(err?.message || 'Failed to delete stat', 'error')
    }
  }
}

const handleToggleGuaranteeStat = async (stat) => {
  try {
    const updated = { ...stat, enabled: !stat.enabled }
    await saveGuaranteeStat(updated, stat.id)
    notify(`"${stat.title}" is now ${updated.enabled ? 'visible' : 'hidden'} on storefront.`)
  } catch (err) {
    notify(err?.message || 'Failed to update guarantee stat', 'error')
  }
}

const handleResetGuaranteeStats = async () => {
  if (confirm('Reset all guarantee stats back to the original 4 Yellow Berry Store trust badges?')) {
    try {
      await resetGuaranteeStatsToDefaults()
      notify('Guarantee stats reset to original defaults!')
    } catch (err) {
      notify(err?.message || 'Failed to reset stats', 'error')
    }
  }
}

// ==========================================
// THEME: WEBSITE BADGES & PILLS
// ==========================================
const savingThemeBadges = ref(false)
const themeBadgeForm = ref({
  showBadgePills: false,
  showHeroBannerBadge: false,
  showCategoryHeadingBadge: false,
  showCategoryCardBadges: false,
  showProductBadges: false,
  showCategoryBannerBadges: false
})

watch(
  () => themeConfig?.value,
  (val) => {
    if (val) {
      themeBadgeForm.value = {
        showBadgePills: Boolean(val.showBadgePills),
        showHeroBannerBadge: val.showHeroBannerBadge !== undefined ? Boolean(val.showHeroBannerBadge) : Boolean(val.showBadgePills),
        showCategoryHeadingBadge: val.showCategoryHeadingBadge !== undefined ? Boolean(val.showCategoryHeadingBadge) : Boolean(val.showBadgePills),
        showCategoryCardBadges: val.showCategoryCardBadges !== undefined ? Boolean(val.showCategoryCardBadges) : Boolean(val.showBadgePills),
        showProductBadges: val.showProductBadges !== undefined ? Boolean(val.showProductBadges) : Boolean(val.showBadgePills),
        showCategoryBannerBadges: val.showCategoryBannerBadges !== undefined ? Boolean(val.showCategoryBannerBadges) : Boolean(val.showBadgePills)
      }
    }
  },
  { immediate: true, deep: true }
)

const toggleGlobalPills = () => {
  themeBadgeForm.value.showBadgePills = !themeBadgeForm.value.showBadgePills
  if (themeBadgeForm.value.showBadgePills) {
    themeBadgeForm.value.showHeroBannerBadge = true
    themeBadgeForm.value.showCategoryHeadingBadge = true
    themeBadgeForm.value.showCategoryCardBadges = true
    themeBadgeForm.value.showProductBadges = true
    themeBadgeForm.value.showCategoryBannerBadges = true
  }
}

const handleSaveThemeBadges = async () => {
  savingThemeBadges.value = true
  try {
    await saveThemeConfig(themeBadgeForm.value)
    notify(
      themeBadgeForm.value.showBadgePills
        ? 'Website badge pills enabled and saved live!'
        : 'All badge pills removed and turned off across the website!'
    )
  } catch (err) {
    notify(err?.message || 'Failed to save theme settings', 'error')
  } finally {
    savingThemeBadges.value = false
  }
}

// ==========================================
// THEME: HEADING SLIDES (ROTATING ITALIC WORDS)
// ==========================================
const savingHeadingSlides = ref(false)
const headingSlidesForm = ref({
  enabled: true,
  intervalSeconds: 3.5,
  categoryPrefix: 'The Perfect Gift for',
  categorySubtitle: "There's Always Something to Unwrap",
  categoryWords: ['Readers', 'Categories', 'Builders', 'Creators', 'Explorers'],
  newPrefix: 'New',
  newSubtitle: 'Discover the latest innovative toys and lovable companions just added to our collection.',
  collectionWords: ['Models', 'Treasures', 'Bundles', 'Gift Boxes', 'Editions'],
  shopCategoryPrefix: 'Shop by',
  shopCategoryHighlight: 'category',
  shopCategorySubtitle: 'Discover curated worlds of wonder, learning, and playful exploration.',
  shopCategoryButtonText: 'View all categories',
  featuredPrefix: 'Feature',
  featuredSubtitle: 'Discover our handpicked selection of top-rated products designed to spark joy, imagination, and endless creative play.',
  bestSellersPrefix: 'Best',
  bestSellersHighlight: 'sellers',
  bestSellersSubtitle: 'The community favorites loved by children and parents across South Africa.',
  reviewsPrefix: 'What our',
  reviewsHighlight: 'customers say',
  reviewsSubtitle: 'Real stories from happy parents, educators, and little adventurers.'
})

watch(
  () => headingSlides?.value,
  (val) => {
    if (val) {
      const catWords = [...(val.categoryWords || defaultHeadingSlides?.categoryWords || ['Readers', 'Categories'])]
      while (catWords.length < 5) catWords.push('')
      const colWords = [...(val.collectionWords || defaultHeadingSlides?.collectionWords || ['Models', 'Treasures'])]
      while (colWords.length < 5) colWords.push('')

      headingSlidesForm.value = {
        enabled: val.enabled !== false,
        intervalSeconds: Number(val.intervalSeconds) || 3.5,
        categoryPrefix: val.categoryPrefix || defaultHeadingSlides?.categoryPrefix || 'The Perfect Gift for',
        categorySubtitle: val.categorySubtitle || defaultHeadingSlides?.categorySubtitle || "There's Always Something to Unwrap",
        categoryWords: catWords.slice(0, 5),
        newPrefix: val.newPrefix || defaultHeadingSlides?.newPrefix || 'New',
        newSubtitle: val.newSubtitle || defaultHeadingSlides?.newSubtitle || 'Discover the latest innovative toys and lovable companions just added to our collection.',
        collectionWords: colWords.slice(0, 5),
        shopCategoryPrefix: val.shopCategoryPrefix || defaultHeadingSlides?.shopCategoryPrefix || 'Shop by',
        shopCategoryHighlight: val.shopCategoryHighlight || defaultHeadingSlides?.shopCategoryHighlight || 'category',
        shopCategorySubtitle: val.shopCategorySubtitle || defaultHeadingSlides?.shopCategorySubtitle || 'Discover curated worlds of wonder, learning, and playful exploration.',
        shopCategoryButtonText: val.shopCategoryButtonText || defaultHeadingSlides?.shopCategoryButtonText || 'View all categories',
        featuredPrefix: val.featuredPrefix || defaultHeadingSlides?.featuredPrefix || 'Feature',
        featuredSubtitle: val.featuredSubtitle || defaultHeadingSlides?.featuredSubtitle || 'Discover our handpicked selection of top-rated products designed to spark joy, imagination, and endless creative play.',
        bestSellersPrefix: val.bestSellersPrefix || defaultHeadingSlides?.bestSellersPrefix || 'Best',
        bestSellersHighlight: val.bestSellersHighlight || defaultHeadingSlides?.bestSellersHighlight || 'sellers',
        bestSellersSubtitle: val.bestSellersSubtitle || defaultHeadingSlides?.bestSellersSubtitle || 'The community favorites loved by children and parents across South Africa.',
        reviewsPrefix: val.reviewsPrefix || defaultHeadingSlides?.reviewsPrefix || 'What our',
        reviewsHighlight: val.reviewsHighlight || defaultHeadingSlides?.reviewsHighlight || 'customers say',
        reviewsSubtitle: val.reviewsSubtitle || defaultHeadingSlides?.reviewsSubtitle || 'Real stories from happy parents, educators, and little adventurers.'
      }
    }
  },
  { immediate: true, deep: true }
)

// Live Admin Preview Rotation Animation
const previewWordIndex = ref(0)
let previewWordTimer = null

const activePreviewCategoryWords = computed(() => {
  const words = headingSlidesForm.value.categoryWords.map(w => (w || '').trim()).filter(Boolean)
  return words.length > 0 ? words : ['Readers', 'Categories']
})

const previewCategoryWord = computed(() => {
  const words = activePreviewCategoryWords.value
  return words[previewWordIndex.value % words.length]
})

const activePreviewCollectionWords = computed(() => {
  const words = headingSlidesForm.value.collectionWords.map(w => (w || '').trim()).filter(Boolean)
  return words.length > 0 ? words : ['Models', 'Treasures']
})

const previewCollectionWord = computed(() => {
  const words = activePreviewCollectionWords.value
  return words[previewWordIndex.value % words.length]
})

const startPreviewWordRotation = () => {
  if (previewWordTimer) clearInterval(previewWordTimer)
  const interval = (Number(headingSlidesForm.value.intervalSeconds) || 3.5) * 1000
  previewWordTimer = setInterval(() => {
    const words = activePreviewCategoryWords.value
    if (words.length > 1) {
      previewWordIndex.value = (previewWordIndex.value + 1) % words.length
    }
  }, interval)
}

watch(
  () => [headingSlidesForm.value.intervalSeconds, headingSlidesForm.value.categoryWords],
  () => {
    previewWordIndex.value = 0
    startPreviewWordRotation()
  },
  { deep: true }
)

onMounted(() => {
  startPreviewWordRotation()
})

const handleSaveHeadingSlides = async () => {
  savingHeadingSlides.value = true
  try {
    await saveHeadingSlides(headingSlidesForm.value)
    notify('Heading slides saved & synced to live storefront!')
  } catch (err) {
    notify(err?.message || 'Failed to save heading slides', 'error')
  } finally {
    savingHeadingSlides.value = false
  }
}

const handleResetHeadingSlides = () => {
  if (confirm('Reset heading slides to original rotating words?')) {
    headingSlidesForm.value = {
      enabled: true,
      intervalSeconds: 3.5,
      categoryWords: ['Readers', 'Categories', 'Builders', 'Creators', 'Explorers'],
      collectionWords: ['Collections', 'Gift Boxes', 'Treasures', 'Bundles', 'Editions']
    }
    notify('Reset to default words. Click "Save Heading Slides" to apply live.')
  }
}



// ==========================================
// STORIES ABOVE BANNER (CIRCULAR STORY TRACK)
// ==========================================
const showStoryModal = ref(false)
const editingStory = ref(null)
const storySaving = ref(false)
const storyUploading = ref(false)
const editingSlideIdx = ref(null)
const selectedSlideProductId = ref('')
const selectedProductGalleryImages = ref([])
const selectedStoryProductImages = ref([])
const newSlideForm = ref({
  image: '',
  caption: '',
  ctaText: 'Shop Now',
  ctaLink: 'All'
})
const storyForm = ref({
  title: '',
  subtitle: '',
  icon: '',
  coverImage: '',
  order: 1,
  enabled: true,
  slides: []
})

const openCreateStoryModal = () => {
  editingStory.value = null
  storyForm.value = {
    title: '',
    subtitle: '',
    icon: '',
    coverImage: '',
    order: (productStories.value?.length || 0) + 1,
    enabled: true,
    slides: [
      {
        image: '',
        caption: '',
        ctaText: 'Shop Now',
        ctaLink: 'All'
      }
    ]
  }
  selectedSlideProductId.value = ''
  selectedProductGalleryImages.value = []
  selectedStoryProductImages.value = []
  editingSlideIdx.value = null
  newSlideForm.value = { image: '', caption: '', ctaText: 'Shop Now', ctaLink: 'All' }
  showStoryModal.value = true
}

const openEditStoryModal = (story) => {
  editingStory.value = story
  storyForm.value = {
    id: story.id,
    title: story.title || '',
    subtitle: story.subtitle || '',
    icon: story.icon || '',
    coverImage: story.coverImage || '',
    order: story.order || 1,
    enabled: story.enabled !== false,
    slides: Array.isArray(story.slides) ? JSON.parse(JSON.stringify(story.slides)) : []
  }
  selectedSlideProductId.value = ''
  selectedProductGalleryImages.value = []
  selectedStoryProductImages.value = []
  editingSlideIdx.value = null
  newSlideForm.value = { image: '', caption: '', ctaText: 'Shop Now', ctaLink: 'All' }
  showStoryModal.value = true
}

const handleStoryIconUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  storyUploading.value = true
  try {
    const res = await uploadFile(file, 'story-thumbnails')
    const downloadUrl = (typeof res === 'object' && res?.url) ? res.url : res
    if (downloadUrl) {
      storyForm.value.icon = downloadUrl
      notify('Story thumbnail uploaded!')
    }
  } catch (err) {
    console.error('Failed to upload story thumbnail:', err)
    notify(err?.message || 'Failed to upload image', 'error')
  } finally {
    storyUploading.value = false
    if (e.target) e.target.value = ''
  }
}

const handleSlideImageUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  storyUploading.value = true
  try {
    const res = await uploadFile(file, 'story-slides')
    const downloadUrl = (typeof res === 'object' && res?.url) ? res.url : res
    if (downloadUrl) {
      newSlideForm.value.image = downloadUrl
      notify('Slide image uploaded!')
    }
  } catch (err) {
    console.error('Failed to upload slide image:', err)
    notify(err?.message || 'Failed to upload slide image', 'error')
  } finally {
    storyUploading.value = false
    if (e.target) e.target.value = ''
  }
}

const applyProductToStorySlide = (productId) => {
  if (!productId) {
    selectedProductGalleryImages.value = []
    selectedStoryProductImages.value = []
    return
  }
  const matched = (products.value || []).find((p) => String(p.id) === String(productId))
  if (!matched) {
    selectedProductGalleryImages.value = []
    selectedStoryProductImages.value = []
    return
  }
  const rawImgs = [
    matched.image,
    ...(Array.isArray(matched.gallery) ? matched.gallery : []),
    ...(Array.isArray(matched.images) ? matched.images : [])
  ].filter((u) => typeof u === 'string' && u.trim())
  const uniqueImgs = [...new Set(rawImgs)]
  selectedProductGalleryImages.value = uniqueImgs
  selectedStoryProductImages.value = [...uniqueImgs]

  newSlideForm.value.ctaLink = `product:${matched.id}`
  if (uniqueImgs[0]) {
    newSlideForm.value.image = uniqueImgs[0]
  }
  if (!newSlideForm.value.caption?.trim() && matched.name) {
    newSlideForm.value.caption = matched.name
  }
  if (!newSlideForm.value.ctaText?.trim() || newSlideForm.value.ctaText === 'Shop Now') {
    newSlideForm.value.ctaText = 'View Product'
  }
}

const toggleStoryProductImage = (imgUrl) => {
  const idx = selectedStoryProductImages.value.indexOf(imgUrl)
  if (idx >= 0) {
    selectedStoryProductImages.value.splice(idx, 1)
  } else {
    selectedStoryProductImages.value.push(imgUrl)
  }
  if (selectedStoryProductImages.value.length > 0) {
    newSlideForm.value.image = selectedStoryProductImages.value[0]
  }
}

const setStoryProductImageLimit = (limit) => {
  if (limit === 'all') {
    selectedStoryProductImages.value = [...selectedProductGalleryImages.value]
  } else if (limit === 0) {
    selectedStoryProductImages.value = []
  } else {
    selectedStoryProductImages.value = selectedProductGalleryImages.value.slice(0, limit)
  }
  if (selectedStoryProductImages.value.length > 0) {
    newSlideForm.value.image = selectedStoryProductImages.value[0]
  }
}

const addSelectedProductSlidesToStory = () => {
  if (!selectedStoryProductImages.value.length) {
    notify('Please select at least one product image.', 'warning')
    return
  }
  const caption = newSlideForm.value.caption?.trim() || ''
  const ctaText = newSlideForm.value.ctaText?.trim() || 'View Product'
  const ctaLink = newSlideForm.value.ctaLink?.trim() || 'All'
  const count = selectedStoryProductImages.value.length
  for (const imgUrl of selectedStoryProductImages.value) {
    storyForm.value.slides.push({
      image: imgUrl,
      caption,
      ctaText,
      ctaLink
    })
  }
  newSlideForm.value = { image: '', caption: '', ctaText: 'Shop Now', ctaLink: 'All' }
  selectedSlideProductId.value = ''
  selectedProductGalleryImages.value = []
  selectedStoryProductImages.value = []
  notify(`${count} slide${count === 1 ? '' : 's'} added to story gallery!`)
}

const addSlideToStory = () => {
  if (!newSlideForm.value.image?.trim()) {
    notify('Please provide or upload a slide image first.', 'warning')
    return
  }
  storyForm.value.slides.push({ ...newSlideForm.value })
  newSlideForm.value = { image: '', caption: '', ctaText: 'Shop Now', ctaLink: 'All' }
  selectedSlideProductId.value = ''
  selectedProductGalleryImages.value = []
  selectedStoryProductImages.value = []
  notify('Slide added to story gallery!')
}

const toggleEditSlide = (index) => {
  editingSlideIdx.value = editingSlideIdx.value === index ? null : index
}

const handleExistingSlideImageUpload = async (e, index) => {
  const file = e.target.files?.[0]
  if (!file || !storyForm.value.slides[index]) return
  storyUploading.value = true
  try {
    const res = await uploadFile(file, 'story-slides')
    const downloadUrl = (typeof res === 'object' && res?.url) ? res.url : res
    if (downloadUrl) {
      storyForm.value.slides[index].image = downloadUrl
      notify('Slide image updated!')
    }
  } catch (err) {
    console.error('Failed to upload slide image:', err)
    notify(err?.message || 'Failed to upload slide image', 'error')
  } finally {
    storyUploading.value = false
    if (e.target) e.target.value = ''
  }
}

const applyProductToExistingSlide = (index, productId) => {
  if (!productId || !storyForm.value.slides[index]) return
  const matched = (products.value || []).find((p) => String(p.id) === String(productId))
  if (!matched) return
  const slide = storyForm.value.slides[index]
  slide.ctaLink = `product:${matched.id}`
  if (matched.image) slide.image = matched.image
  if (matched.name) slide.caption = matched.name
  if (!slide.ctaText?.trim() || slide.ctaText === 'Shop Now') {
    slide.ctaText = 'View Product'
  }
}

const removeSlideFromStory = (index) => {
  storyForm.value.slides.splice(index, 1)
  if (editingSlideIdx.value === index) {
    editingSlideIdx.value = null
  } else if (editingSlideIdx.value !== null && editingSlideIdx.value > index) {
    editingSlideIdx.value -= 1
  }
}

const moveSlide = (index, direction) => {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= storyForm.value.slides.length) return
  const temp = storyForm.value.slides[index]
  storyForm.value.slides[index] = storyForm.value.slides[targetIndex]
  storyForm.value.slides[targetIndex] = temp
  if (editingSlideIdx.value === index) {
    editingSlideIdx.value = targetIndex
  } else if (editingSlideIdx.value === targetIndex) {
    editingSlideIdx.value = index
  }
}

const handleSaveStory = async () => {
  if (!storyForm.value.title?.trim()) {
    notify('Please enter a story title', 'error')
    return
  }
  if (!storyForm.value.slides || storyForm.value.slides.length === 0) {
    notify('Please add at least one slide to this story gallery', 'warning')
    return
  }
  storySaving.value = true
  try {
    await saveStory(storyForm.value, editingStory.value?.id)
    notify('Story highlight saved & synced to live storefront!')
    showStoryModal.value = false
  } catch (err) {
    notify(err?.message || 'Failed to save story', 'error')
  } finally {
    storySaving.value = false
  }
}

const handleDeleteStory = async (story) => {
  if (confirm(`Delete story "${story.title}"?`)) {
    try {
      await deleteStory(story.id)
      notify('Story removed.', 'info')
    } catch (err) {
      notify(err?.message || 'Failed to delete story', 'error')
    }
  }
}

const handleToggleStory = async (story) => {
  try {
    const updated = { ...story, enabled: !story.enabled }
    await saveStory(updated, story.id)
    notify(`Story "${story.title}" is now ${updated.enabled ? 'visible' : 'hidden'} on storefront.`)
  } catch (err) {
    notify(err?.message || 'Failed to update story status', 'error')
  }
}

const handleResetStories = async () => {
  if (confirm('Reset stories to original defaults (Deals, What We Offer, Categories, About Us)?')) {
    try {
      await resetStoriesToDefaults()
      notify('Story highlights reset to defaults!')
    } catch (err) {
      notify(err?.message || 'Failed to reset stories', 'error')
    }
  }
}

// ==========================================
// BANNER CATEGORIES (BELOW HERO BANNER)
// ==========================================
const showBannerCategoryModal = ref(false)
const editingBannerCategory = ref(null)
const bannerCategorySaving = ref(false)
const bannerCategoryUploading = ref(false)
const bannerCategoryForm = ref({
  name: '',
  image: '',
  badge: '',
  itemCount: 0,
  order: 1,
  enabled: true,
  link: ''
})

const openCreateBannerCategoryModal = () => {
  editingBannerCategory.value = null
  bannerCategoryForm.value = {
    name: '',
    image: '',
    badge: 'Popular',
    itemCount: 12,
    order: (bannerCategories.value?.length || 0) + 1,
    enabled: true,
    link: ''
  }
  showBannerCategoryModal.value = true
}

const openEditBannerCategoryModal = (cat) => {
  editingBannerCategory.value = cat
  bannerCategoryForm.value = {
    id: cat.id,
    name: cat.name || '',
    image: cat.image || '',
    badge: cat.badge || '',
    itemCount: cat.itemCount || 0,
    order: cat.order || 1,
    enabled: cat.enabled !== false,
    link: cat.link || ''
  }
  showBannerCategoryModal.value = true
}

const handleBannerCatImageUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  bannerCategoryUploading.value = true
  try {
    const res = await uploadFile(file, 'banner-categories')
    const downloadUrl = (typeof res === 'object' && res?.url) ? res.url : res
    if (downloadUrl) {
      bannerCategoryForm.value.image = downloadUrl
      notify('Category card image uploaded!')
    }
  } catch (err) {
    notify(err?.message || 'Failed to upload image', 'error')
  } finally {
    bannerCategoryUploading.value = false
    if (e.target) e.target.value = ''
  }
}

const handleSaveBannerCategory = async () => {
  if (!bannerCategoryForm.value.name?.trim()) {
    notify('Please enter a category title', 'error')
    return
  }
  bannerCategorySaving.value = true
  try {
    await saveBannerCategory(bannerCategoryForm.value, editingBannerCategory.value?.id)
    notify('Banner category saved & synced to live storefront!')
    showBannerCategoryModal.value = false
  } catch (err) {
    notify(err?.message || 'Failed to save category card', 'error')
  } finally {
    bannerCategorySaving.value = false
  }
}

const handleDeleteBannerCategory = async (cat) => {
  if (confirm(`Delete banner category card "${cat.name}"?`)) {
    try {
      await deleteBannerCategory(cat.id)
      notify('Category card removed.', 'info')
    } catch (err) {
      notify(err?.message || 'Failed to delete category card', 'error')
    }
  }
}

const handleToggleBannerCategory = async (cat) => {
  try {
    const updated = { ...cat, enabled: !cat.enabled }
    await saveBannerCategory(updated, cat.id)
    notify(`"${cat.name}" is now ${updated.enabled ? 'visible' : 'hidden'} on storefront.`)
  } catch (err) {
    notify(err?.message || 'Failed to update category card', 'error')
  }
}

const handleResetBannerCategories = async () => {
  if (confirm('Reset banner categories back to 7 curated collections?')) {
    try {
      await resetBannerCategoriesToDefaults()
      notify('Banner categories reset to defaults!')
    } catch (err) {
      notify(err?.message || 'Failed to reset categories', 'error')
    }
  }
}

// Banner Categories Section Heading State
const bannerCategoriesHeaderForm = ref({
  badge: bannerCategoriesHeader?.value?.badge || defaultBannerCategoriesHeader?.badge || 'Explore Collections',
  title: bannerCategoriesHeader?.value?.title || defaultBannerCategoriesHeader?.title || 'Latest',
  highlight: bannerCategoriesHeader?.value?.highlight || defaultBannerCategoriesHeader?.highlight || 'Categories',
  subtitle: bannerCategoriesHeader?.value?.subtitle || defaultBannerCategoriesHeader?.subtitle || 'Handpicked worlds of developmental toys, learning sets, and everyday joys.',
  viewAllText: bannerCategoriesHeader?.value?.viewAllText || defaultBannerCategoriesHeader?.viewAllText || 'View all categories'
})
const savingBannerCategoriesHeader = ref(false)

watch(bannerCategoriesHeader, (newVal) => {
  if (newVal) {
    bannerCategoriesHeaderForm.value = {
      badge: newVal.badge || 'Explore Collections',
      title: newVal.title || 'Latest',
      highlight: newVal.highlight || 'Categories',
      subtitle: newVal.subtitle || '',
      viewAllText: newVal.viewAllText || 'View all categories'
    }
  }
}, { immediate: true })

const handleSaveBannerCategoriesHeader = async () => {
  savingBannerCategoriesHeader.value = true
  try {
    await saveBannerCategoriesHeader(bannerCategoriesHeaderForm.value)
    notify('Section heading saved & synced to live storefront!')
  } catch (err) {
    notify(err?.message || 'Failed to save section heading', 'error')
  } finally {
    savingBannerCategoriesHeader.value = false
  }
}

// ==========================================
// CATEGORY BANNERS STATE & HANDLERS
// ==========================================
const showCategoryBannerModal = ref(false)
const editingCategoryBanner = ref(null)
const categoryBannerSaving = ref(false)
const categoryBannerUploading = ref(false)
const categoryBannerMobileUploading = ref(false)

const categoryBannerForm = ref({
  id: '',
  category: 'All',
  categoryName: 'All Categories',
  title: '',
  subtitle: '',
  badge: '',
  image: '',
  mobileImage: '',
  overlayOpacity: 70,
  order: 1,
  enabled: true,
  isDefault: false
})

const openCreateCategoryBannerModal = () => {
  editingCategoryBanner.value = null
  categoryBannerForm.value = {
    id: '',
    category: 'All',
    categoryName: 'All Categories',
    title: '',
    subtitle: '',
    badge: 'Curated Catalog',
    image: '',
    mobileImage: '',
    overlayOpacity: 70,
    order: (categoryBanners.value?.length || 0) + 1,
    enabled: true,
    isDefault: false
  }
  showCategoryBannerModal.value = true
}

const openEditCategoryBannerModal = (b) => {
  editingCategoryBanner.value = b
  categoryBannerForm.value = {
    id: b.id,
    category: b.category || 'All',
    categoryName: b.categoryName || b.category || 'All Categories',
    title: b.title || '',
    subtitle: b.subtitle || b.description || '',
    badge: b.badge || '',
    image: b.image || '',
    mobileImage: b.mobileImage || '',
    overlayOpacity: Number(b.overlayOpacity ?? 70),
    order: Number(b.order ?? 1),
    enabled: b.enabled !== false,
    isDefault: Boolean(b.isDefault)
  }
  showCategoryBannerModal.value = true
}

const handleCategoryBannerImageUpload = async (e, isMobile = false) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (isMobile) categoryBannerMobileUploading.value = true
  else categoryBannerUploading.value = true
  try {
    const res = await uploadFile(file, 'category-banners')
    const downloadUrl = (typeof res === 'object' && res?.url) ? res.url : res
    if (downloadUrl) {
      if (isMobile) categoryBannerForm.value.mobileImage = downloadUrl
      else categoryBannerForm.value.image = downloadUrl
      notify(isMobile ? 'Mobile category banner image uploaded!' : 'Category banner desktop image uploaded!')
    }
  } catch (err) {
    notify(err?.message || 'Failed to upload image', 'error')
  } finally {
    if (isMobile) categoryBannerMobileUploading.value = false
    else categoryBannerUploading.value = false
    if (e.target) e.target.value = ''
  }
}

const handleSaveCategoryBanner = async () => {
  if (!categoryBannerForm.value.title?.trim()) {
    notify('Please enter a banner title/heading', 'error')
    return
  }
  categoryBannerSaving.value = true
  try {
    await saveCategoryBanner(categoryBannerForm.value, editingCategoryBanner.value?.id)
    notify('Category banner saved & synced to live storefront!')
    showCategoryBannerModal.value = false
  } catch (err) {
    notify(err?.message || 'Failed to save category banner', 'error')
  } finally {
    categoryBannerSaving.value = false
  }
}

const handleDeleteCategoryBanner = async (b) => {
  if (confirm(`Delete category banner for "${b.categoryName || b.category}"?`)) {
    try {
      await deleteCategoryBanner(b.id)
      notify('Category banner removed.', 'info')
    } catch (err) {
      notify(err?.message || 'Failed to delete category banner', 'error')
    }
  }
}

const handleToggleCategoryBanner = async (b) => {
  try {
    await saveCategoryBanner({ ...b, enabled: b.enabled === false }, b.id)
    notify(b.enabled === false ? 'Category banner enabled' : 'Category banner hidden')
  } catch (err) {
    notify(err?.message || 'Failed to update category banner', 'error')
  }
}

const handleResetCategoryBanners = async () => {
  if (confirm('Reset category hero banners back to default templates?')) {
    try {
      await resetCategoryBannersToDefaults()
      notify('Category banners reset to defaults!')
    } catch (err) {
      notify(err?.message || 'Failed to reset category banners', 'error')
    }
  }
}

// ==========================================
// COLLECTIONS BANNERS STATE & HANDLERS
// ==========================================
const showCollectionBannerModal = ref(false)
const editingCollectionBanner = ref(null)
const collectionBannerSaving = ref(false)
const collectionBannerUploading = ref(false)
const collectionBannerMobileUploading = ref(false)

const collectionBannerForm = ref({
  id: '',
  collection: 'All Collections',
  collectionName: 'All Collections',
  title: '',
  subtitle: '',
  badge: '',
  image: '',
  mobileImage: '',
  overlayOpacity: 70,
  order: 1,
  enabled: true,
  isDefault: false
})

const openCreateCollectionBannerModal = () => {
  editingCollectionBanner.value = null
  collectionBannerForm.value = {
    id: '',
    collection: 'All Collections',
    collectionName: 'All Collections',
    title: '',
    subtitle: '',
    badge: 'Curated Collection',
    image: '',
    mobileImage: '',
    overlayOpacity: 70,
    order: (collectionBanners.value?.length || 0) + 1,
    enabled: true,
    isDefault: false
  }
  showCollectionBannerModal.value = true
}

const openEditCollectionBannerModal = (b) => {
  editingCollectionBanner.value = b
  collectionBannerForm.value = {
    id: b.id,
    collection: b.collection || 'All Collections',
    collectionName: b.collectionName || b.collection || 'All Collections',
    title: b.title || '',
    subtitle: b.subtitle || b.description || '',
    badge: b.badge || '',
    image: b.image || '',
    mobileImage: b.mobileImage || '',
    overlayOpacity: Number(b.overlayOpacity ?? 70),
    order: Number(b.order ?? 1),
    enabled: b.enabled !== false,
    isDefault: Boolean(b.isDefault)
  }
  showCollectionBannerModal.value = true
}

const handleCollectionBannerImageUpload = async (e, isMobile = false) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (isMobile) collectionBannerMobileUploading.value = true
  else collectionBannerUploading.value = true
  try {
    const res = await uploadFile(file, 'collections-banners')
    const downloadUrl = (typeof res === 'object' && res?.url) ? res.url : res
    if (downloadUrl) {
      if (isMobile) collectionBannerForm.value.mobileImage = downloadUrl
      else collectionBannerForm.value.image = downloadUrl
      notify(isMobile ? 'Mobile collection banner image uploaded!' : 'Collection banner desktop image uploaded!')
    }
  } catch (err) {
    notify(err?.message || 'Failed to upload image', 'error')
  } finally {
    if (isMobile) collectionBannerMobileUploading.value = false
    else collectionBannerUploading.value = false
    if (e.target) e.target.value = ''
  }
}

const handleSaveCollectionBanner = async () => {
  if (!collectionBannerForm.value.title?.trim()) {
    notify('Please enter a banner title/heading', 'error')
    return
  }
  collectionBannerSaving.value = true
  try {
    await saveCollectionBanner(collectionBannerForm.value, editingCollectionBanner.value?.id)
    notify('Collection banner saved & synced to live storefront!')
    showCollectionBannerModal.value = false
  } catch (err) {
    notify(err?.message || 'Failed to save collection banner', 'error')
  } finally {
    collectionBannerSaving.value = false
  }
}

const handleDeleteCollectionBanner = async (b) => {
  if (confirm(`Delete collection banner for "${b.collectionName || b.collection}"?`)) {
    try {
      await deleteCollectionBanner(b.id)
      notify('Collection banner removed.', 'info')
    } catch (err) {
      notify(err?.message || 'Failed to delete collection banner', 'error')
    }
  }
}

const handleToggleCollectionBanner = async (b) => {
  try {
    await saveCollectionBanner({ ...b, enabled: b.enabled === false }, b.id)
    notify(b.enabled === false ? 'Collection banner enabled' : 'Collection banner hidden')
  } catch (err) {
    notify(err?.message || 'Failed to update collection banner', 'error')
  }
}

const handleResetCollectionBanners = async () => {
  if (confirm('Reset collection hero banners back to default templates?')) {
    try {
      await resetCollectionBannersToDefaults()
      notify('Collection banners reset to defaults!')
    } catch (err) {
      notify(err?.message || 'Failed to reset collection banners', 'error')
    }
  }
}

// Payments & Gateways State
const settingsSubmenuOpen = ref(false)
const localPaymentSettings = ref(JSON.parse(JSON.stringify(paymentSettings.value || defaultPaymentSettings)))
const savingPayments = ref(false)

// Company Address & Contact Details State
const localCompanyProfile = ref({ ...defaultCompanyProfile, ...(companyProfile.value || {}) })
const savingCompanyProfile = ref(false)
watch(
  companyProfile,
  (val) => {
    if (val) {
      localCompanyProfile.value = { ...defaultCompanyProfile, ...val }
    }
  },
  { deep: true }
)

const handleSaveCompanyProfile = async () => {
  if (savingCompanyProfile.value) return
  savingCompanyProfile.value = true
  try {
    await saveCompanyProfile(localCompanyProfile.value)
    notify('Company address & contact details saved and published to storefront.', 'success')
  } catch (err) {
    notify(err?.message || 'Failed to save company details', 'error')
  } finally {
    savingCompanyProfile.value = false
  }
}

const handleResetCompanyProfile = () => {
  localCompanyProfile.value = { ...defaultCompanyProfile }
}
const showBankAccount = ref(false)
const showSecretKey = ref({
  payfastPassphrase: false,
  yocoSecret: false,
  yocoWebhook: false,
  ozowPrivate: false,
  ozowApi: false,
  payflexApi: false,
  stripeSecret: false
})

const openGatewayConfig = ref({
  payfast: true,
  yoco: false,
  ozow: false,
  payflex: false,
  stripe: false,
  eft: false,
  cod: false
})

const toggleGatewayConfig = (key) => {
  openGatewayConfig.value[key] = !openGatewayConfig.value[key]
}

const activePaymentGatewaysCount = computed(() => {
  if (!localPaymentSettings.value?.gateways) return 0
  return Object.values(localPaymentSettings.value.gateways).filter((g) => g.enabled).length
})

// Watch for Firestore updates to paymentSettings
watch(
  paymentSettings,
  (newVal) => {
    if (newVal) {
      localPaymentSettings.value = JSON.parse(JSON.stringify(newVal))
    }
  },
  { deep: true, immediate: true }
)

const handleSettingsNavClick = () => {
  const wasOpen = settingsSubmenuOpen.value
  closeAllSubmenus()
  settingsSubmenuOpen.value = !wasOpen
  if (settingsSubmenuOpen.value && activeSection.value !== 'settings' && activeSection.value !== 'settings-payments' && activeSection.value !== 'settings-users' && activeSection.value !== 'settings-seo') {
    activeSection.value = 'settings'
  }
}

const handleSavePayments = async () => {
  savingPayments.value = true
  try {
    await savePaymentSettings(localPaymentSettings.value)
    notify('Payment settings and gateway credentials saved successfully!', 'success')
  } catch (err) {
    notify('Failed to save payment settings: ' + (err.message || 'Unknown error'), 'error')
  } finally {
    savingPayments.value = false
  }
}

const handleResetPaymentDefaults = () => {
  if (confirm('Reset payment settings to recommended South African defaults?')) {
    localPaymentSettings.value = JSON.parse(JSON.stringify(defaultPaymentSettings))
    notify('Payment settings reset to defaults. Click Save to persist.', 'info')
  }
}

const isSidebarCollapsed = ref(false)
const activeSection = ref('dashboard')
const productsSubmenuOpen = ref(false)
const mediaSubmenuOpen = ref(false)
const customersSubmenuOpen = ref(false)
const themeSubmenuOpen = ref(false)
const marketingSubmenuOpen = ref(false)
const globalSearch = ref('')
const profileDropdownOpen = ref(false)
const showDashboardWidgets = ref(true)
const liveVisitorsCount = computed(() => activeVisitorCount?.value ?? 0)
const activeSessionsSummary = computed(() => {
  const list = liveActiveSessions?.value || []
  if (!list.length) return ''
  const counts = {}
  list.forEach((s) => {
    const label = s.view || 'home'
    counts[label] = (counts[label] || 0) + 1
  })
  return Object.entries(counts)
    .map(([v, c]) => `${v}: ${c}`)
    .join(', ')
})

const closeAllSubmenus = () => {
  productsSubmenuOpen.value = false
  mediaSubmenuOpen.value = false
  customersSubmenuOpen.value = false
  themeSubmenuOpen.value = false
  marketingSubmenuOpen.value = false
  settingsSubmenuOpen.value = false
}

const handleNavClick = (id) => {
  if (id === 'products') {
    const wasOpen = productsSubmenuOpen.value
    closeAllSubmenus()
    productsSubmenuOpen.value = !wasOpen
    if (productsSubmenuOpen.value && activeSection.value !== 'products' && activeSection.value !== 'categories' && activeSection.value !== 'collections' && activeSection.value !== 'purchase-orders' && activeSection.value !== 'banner-categories' && activeSection.value !== 'product-reviews') {
      activeSection.value = 'products'
    }
  } else if (id === 'media') {
    const wasOpen = mediaSubmenuOpen.value
    closeAllSubmenus()
    mediaSubmenuOpen.value = !wasOpen
    if (mediaSubmenuOpen.value && activeSection.value !== 'media' && activeSection.value !== 'banners' && activeSection.value !== 'story-categories' && activeSection.value !== 'category-banners' && activeSection.value !== 'collections-banners') {
      activeSection.value = 'banners'
    }
  } else if (id === 'customers') {
    const wasOpen = customersSubmenuOpen.value
    closeAllSubmenus()
    customersSubmenuOpen.value = !wasOpen
    if (customersSubmenuOpen.value && activeSection.value !== 'customers' && activeSection.value !== 'customer-segments') {
      activeSection.value = 'customers'
    }
  } else if (id === 'theme') {
    const wasOpen = themeSubmenuOpen.value
    closeAllSubmenus()
    themeSubmenuOpen.value = !wasOpen
    if (themeSubmenuOpen.value && activeSection.value !== 'guarantee-stats' && activeSection.value !== 'theme-badges' && activeSection.value !== 'heading-slides' && activeSection.value !== 'theme-reviews' && activeSection.value !== 'theme-subscription') {
      activeSection.value = 'heading-slides'
    }
  } else if (id === 'marketing') {
    const wasOpen = marketingSubmenuOpen.value
    closeAllSubmenus()
    marketingSubmenuOpen.value = !wasOpen
    if (marketingSubmenuOpen.value && activeSection.value !== 'marketing-mailers') {
      activeSection.value = 'marketing-mailers'
    }
  } else if (id === 'settings') {
    handleSettingsNavClick()
  } else {
    closeAllSubmenus()
    activeSection.value = id
  }
}

const statusBanner = ref({ message: '', type: 'success' })
const notify = (message, type = 'success') => {
  statusBanner.value = { message, type }
  setTimeout(() => {
    if (statusBanner.value.message === message) {
      statusBanner.value.message = ''
    }
  }, 4000)
}

// ==========================================
// THEME -> SUBSCRIPTION CONFIG & EMAIL ROUTING
// ==========================================
const subscriptionForm = ref({
  enabled: subscriptionConfig.value?.enabled !== false,
  eyebrow: subscriptionConfig.value?.eyebrow || defaultSubscriptionConfig.eyebrow,
  heading: subscriptionConfig.value?.heading || defaultSubscriptionConfig.heading,
  description: subscriptionConfig.value?.description || defaultSubscriptionConfig.description,
  placeholder: subscriptionConfig.value?.placeholder || defaultSubscriptionConfig.placeholder,
  buttonText: subscriptionConfig.value?.buttonText || defaultSubscriptionConfig.buttonText,
  consentText: subscriptionConfig.value?.consentText || defaultSubscriptionConfig.consentText,
  successMessage: subscriptionConfig.value?.successMessage || defaultSubscriptionConfig.successMessage,
  routeToEmail: subscriptionConfig.value?.routeToEmail || defaultSubscriptionConfig.routeToEmail,
  deliveryMethod: subscriptionConfig.value?.deliveryMethod || defaultSubscriptionConfig.deliveryMethod,
  webhookUrl: subscriptionConfig.value?.webhookUrl || '',
  mailboxEndpointUrl: subscriptionConfig.value?.mailboxEndpointUrl || defaultSubscriptionConfig.mailboxEndpointUrl,
  mailboxFromName: subscriptionConfig.value?.mailboxFromName || defaultSubscriptionConfig.mailboxFromName,
  mailboxFromEmail: subscriptionConfig.value?.mailboxFromEmail || defaultSubscriptionConfig.mailboxFromEmail,
  mailboxSubject: subscriptionConfig.value?.mailboxSubject || defaultSubscriptionConfig.mailboxSubject
})
const mailboxForm = ref({
  host: subscriptionMailbox.value?.host || '',
  port: subscriptionMailbox.value?.port || 465,
  encryption: subscriptionMailbox.value?.encryption || 'ssl',
  username: subscriptionMailbox.value?.username || '',
  password: subscriptionMailbox.value?.password || '',
  fromName: subscriptionMailbox.value?.fromName || defaultSubscriptionMailbox.fromName,
  fromEmail: subscriptionMailbox.value?.fromEmail || defaultSubscriptionMailbox.fromEmail,
  subjectTemplate: subscriptionMailbox.value?.subjectTemplate || defaultSubscriptionMailbox.subjectTemplate,
  endpointUrl: subscriptionMailbox.value?.endpointUrl || defaultSubscriptionMailbox.endpointUrl
})
const showMailboxPassword = ref(false)
const mailboxTesting = ref(false)
const subscriptionSaving = ref(false)

watch(subscriptionConfig, (cfg) => {
  if (!cfg) return
  subscriptionForm.value = {
    enabled: cfg.enabled !== false,
    eyebrow: cfg.eyebrow ?? defaultSubscriptionConfig.eyebrow,
    heading: cfg.heading ?? defaultSubscriptionConfig.heading,
    description: cfg.description ?? defaultSubscriptionConfig.description,
    placeholder: cfg.placeholder ?? defaultSubscriptionConfig.placeholder,
    buttonText: cfg.buttonText ?? defaultSubscriptionConfig.buttonText,
    consentText: cfg.consentText ?? defaultSubscriptionConfig.consentText,
    successMessage: cfg.successMessage ?? defaultSubscriptionConfig.successMessage,
    routeToEmail: cfg.routeToEmail ?? defaultSubscriptionConfig.routeToEmail,
    deliveryMethod: cfg.deliveryMethod || defaultSubscriptionConfig.deliveryMethod,
    webhookUrl: cfg.webhookUrl || '',
    mailboxEndpointUrl: cfg.mailboxEndpointUrl || defaultSubscriptionConfig.mailboxEndpointUrl,
    mailboxFromName: cfg.mailboxFromName || defaultSubscriptionConfig.mailboxFromName,
    mailboxFromEmail: cfg.mailboxFromEmail || defaultSubscriptionConfig.mailboxFromEmail,
    mailboxSubject: cfg.mailboxSubject || defaultSubscriptionConfig.mailboxSubject
  }
}, { deep: true })

watch(subscriptionMailbox, (mb) => {
  if (!mb) return
  mailboxForm.value = {
    host: mb.host || '',
    port: mb.port || 465,
    encryption: mb.encryption || 'ssl',
    username: mb.username || '',
    password: mb.password || '',
    fromName: mb.fromName || defaultSubscriptionMailbox.fromName,
    fromEmail: mb.fromEmail || defaultSubscriptionMailbox.fromEmail,
    subjectTemplate: mb.subjectTemplate || defaultSubscriptionMailbox.subjectTemplate,
    endpointUrl: mb.endpointUrl || defaultSubscriptionMailbox.endpointUrl
  }
}, { deep: true })

watch(activeSection, (sec) => {
  if (sec === 'theme-subscription') {
    loadSubscriptionMailbox()
  }
})

const handleSaveSubscriptionConfig = async () => {
  if (!subscriptionForm.value.routeToEmail?.trim()) {
    notify('Please enter a destination routing email.', 'error')
    return
  }
  subscriptionSaving.value = true
  try {
    await saveSubscriptionConfig({
      ...subscriptionForm.value,
      mailboxEndpointUrl: mailboxForm.value.endpointUrl,
      mailboxFromName: mailboxForm.value.fromName,
      mailboxFromEmail: mailboxForm.value.fromEmail,
      mailboxSubject: mailboxForm.value.subjectTemplate
    })
    await saveSubscriptionMailbox(mailboxForm.value)
    notify('Subscription & mailbox settings saved!')
  } catch (err) {
    notify(err?.message || 'Failed to save subscription settings.', 'error')
  } finally {
    subscriptionSaving.value = false
  }
}

const handleTestMailbox = async () => {
  mailboxTesting.value = true
  try {
    await saveSubscriptionMailbox(mailboxForm.value)
    const res = await testMailboxEndpoint(subscriptionForm.value.routeToEmail)
    notify(res?.message || `Test email routed to ${subscriptionForm.value.routeToEmail}!`)
  } catch (err) {
    notify(err?.message || 'Mailbox test failed.', 'error')
  } finally {
    mailboxTesting.value = false
  }
}

const handleResetSubscriptionConfig = async () => {
  if (!confirm('Reset Subscription copy and routing settings to defaults?')) return
  subscriptionSaving.value = true
  try {
    await saveSubscriptionConfig({ ...defaultSubscriptionConfig })
    notify('Subscription settings reset to defaults.')
  } finally {
    subscriptionSaving.value = false
  }
}

const handleDeleteSubscriber = async (id) => {
  if (!confirm('Remove this subscriber record?')) return
  await deleteNewsletterSubscriber(id)
  notify('Subscriber removed.')
}

const exportSubscribersCsv = () => {
  const rows = newsletterSubscribers.value || []
  if (rows.length === 0) return
  const header = ['Email', 'RoutedToEmail', 'SourcePage', 'CreatedAt']
  const lines = [
    header.join(','),
    ...rows.map(r => [
      JSON.stringify(r.email || ''),
      JSON.stringify(r.routedToEmail || ''),
      JSON.stringify(r.sourcePage || ''),
      JSON.stringify(r.createdAt || '')
    ].join(','))
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'ystore-subscribers.csv'
  link.click()
  URL.revokeObjectURL(url)
}

// ==========================================
// MARKETING -> MAILERS (TEMPLATE BUILDER)
// ==========================================
const editingCampaignId = ref(null)
const mailerSending = ref(false)
const mailerPreviewMode = ref('desktop')
const mailerTheme = ref({
  accentColor: '#F4EB6A',
  darkColor: '#171717',
  buttonRadius: '999px'
})
const createDefaultBlocks = (preset = 'new-arrivals') => {
  const uid = () => `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  if (preset === 'flash-sale') {
    return [
      { id: uid(), type: 'header', brandName: 'Yellow Berry Store', badgeText: 'Weekend Flash Sale' },
      { id: uid(), type: 'hero', headline: 'Save 15% on Curated Favorites', subheadline: 'Limited-time offer for our valued Yellow Berry community.', imageUrl: '' },
      { id: uid(), type: 'promo', code: 'YELLOW15', note: 'Use code at checkout • Valid this weekend only' },
      { id: uid(), type: 'text', title: 'Why Shop With Us', content: 'Handpicked educational toys and collectibles delivered fast across South Africa.' },
      { id: uid(), type: 'button', label: 'Claim 15% Off Now', url: 'https://ystoreza.co.za/?view=specials' }
    ]
  }
  if (preset === 'newsletter') {
    return [
      { id: uid(), type: 'header', brandName: 'Yellow Berry Store', badgeText: 'Monthly Dispatch' },
      { id: uid(), type: 'hero', headline: 'Playroom Ideas & Fresh Arrivals', subheadline: 'Stories, Montessori tips, and our favorite picks this month.', imageUrl: '' },
      { id: uid(), type: 'text', title: 'This Month at Ystore', content: 'Explore thoughtful wooden and creative toys designed to spark curiosity.' },
      { id: uid(), type: 'button', label: 'Read & Shop', url: 'https://ystoreza.co.za/' }
    ]
  }
  if (preset === 'blank') {
    return [
      { id: uid(), type: 'header', brandName: 'Yellow Berry Store', badgeText: 'Store Update' },
      { id: uid(), type: 'text', title: '', content: 'Write your message to customers here...' }
    ]
  }
  // default: 'new-arrivals'
  return [
    { id: uid(), type: 'header', brandName: 'Yellow Berry Store', badgeText: 'New Arrivals' },
    { id: uid(), type: 'hero', headline: 'Just Landed in Store', subheadline: 'Discover our newest handcrafted toys & collectibles.', imageUrl: '' },
    { id: uid(), type: 'text', title: 'Handpicked For Little Explorers', content: 'Our latest collection is live! Quantities are limited on first-drop pieces.' },
    { id: uid(), type: 'button', label: 'Shop New Arrivals', url: 'https://ystoreza.co.za/' }
  ]
}
const mailerBlocks = ref(createDefaultBlocks('new-arrivals'))
const mailerForm = ref({
  name: '',
  subject: '',
  preheader: '',
  audience: 'all-customers',
  customEmails: '',
  templatePreset: 'new-arrivals',
  headline: '',
  body: '',
  ctaText: 'Shop Now',
  ctaUrl: 'https://ystoreza.co.za/',
  fromName: 'Yellow Berry Store',
  fromEmail: 'noreply@ystoreza.co.za',
  replyToEmail: 'info@yberry.co.za'
})

const applyMailerPreset = (preset) => {
  mailerForm.value.templatePreset = preset
  mailerBlocks.value = createDefaultBlocks(preset)
}

const addMailerBlock = (type) => {
  const id = `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const defaults = {
    header: { id, type: 'header', brandName: 'Yellow Berry Store', badgeText: 'Exclusive Update' },
    hero: { id, type: 'hero', headline: 'Featured Headline', subheadline: 'Short supporting subtitle', imageUrl: '' },
    text: { id, type: 'text', title: 'Section Title', content: 'Write your paragraph copy here...' },
    product: { id, type: 'product', productName: 'Featured Product', productPrice: 'R499', productImage: '', productUrl: 'https://ystoreza.co.za/' },
    promo: { id, type: 'promo', code: 'YELLOW15', note: 'Apply at checkout for 15% off' },
    button: { id, type: 'button', label: 'Shop Now', url: 'https://ystoreza.co.za/' },
    divider: { id, type: 'divider' }
  }
  if (defaults[type]) mailerBlocks.value.push(defaults[type])
}

const moveMailerBlock = (idx, dir) => {
  const next = idx + dir
  if (next < 0 || next >= mailerBlocks.value.length) return
  const arr = [...mailerBlocks.value]
  const [item] = arr.splice(idx, 1)
  arr.splice(next, 0, item)
  mailerBlocks.value = arr
}

const removeMailerBlock = (idx) => {
  mailerBlocks.value.splice(idx, 1)
}

const applyProductToBlock = (block, productId) => {
  const found = (products.value || []).find((p) => String(p.id) === String(productId))
  if (!found) return
  block.productName = found.name || ''
  block.productPrice = `R${found.price || 0}`
  block.productImage = found.image || found.images?.[0] || ''
  block.productUrl = 'https://ystoreza.co.za/'
}

const escapeEmailHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const generatedMailerHtml = computed(() => {
  const accent = mailerTheme.value.accentColor || '#F4EB6A'
  const dark = mailerTheme.value.darkColor || '#171717'
  const radius = mailerTheme.value.buttonRadius || '999px'
  const replyTo = escapeEmailHtml(mailerForm.value.replyToEmail || 'info@yberry.co.za')

  const blocksHtml = (mailerBlocks.value || []).map((b) => {
    if (b.type === 'header') {
      return `<div style="background:${dark};padding:20px 24px;text-align:center;">
        <div style="display:inline-block;padding:4px 12px;border-radius:999px;background:${accent};color:${dark};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${escapeEmailHtml(b.badgeText || 'Update')}</div>
        <div style="color:#ffffff;font-size:20px;font-weight:700;margin-top:8px;">${escapeEmailHtml(b.brandName || 'Yellow Berry Store')}</div>
      </div>`
    }
    if (b.type === 'hero') {
      const img = b.imageUrl ? `<img src="${escapeEmailHtml(b.imageUrl)}" alt="" style="width:100%;max-height:240px;object-fit:cover;border-radius:12px;margin-bottom:16px;" />` : ''
      return `<div style="padding:24px 24px 12px 24px;text-align:center;">
        ${img}
        <h1 style="margin:0;font-size:24px;line-height:1.25;color:#171717;font-weight:800;">${escapeEmailHtml(b.headline || '')}</h1>
        ${b.subheadline ? `<p style="margin:8px 0 0 0;font-size:14px;line-height:1.5;color:#525252;">${escapeEmailHtml(b.subheadline)}</p>` : ''}
      </div>`
    }
    if (b.type === 'text') {
      return `<div style="padding:14px 24px;">
        ${b.title ? `<h2 style="margin:0 0 8px 0;font-size:16px;color:#171717;font-weight:700;">${escapeEmailHtml(b.title)}</h2>` : ''}
        <p style="margin:0;font-size:13px;line-height:1.65;color:#404040;white-space:pre-line;">${escapeEmailHtml(b.content || '')}</p>
      </div>`
    }
    if (b.type === 'product') {
      const img = b.productImage ? `<img src="${escapeEmailHtml(b.productImage)}" alt="${escapeEmailHtml(b.productName || '')}" style="width:96px;height:96px;object-fit:cover;border-radius:12px;background:#f5f5f5;flex-shrink:0;" />` : ''
      return `<div style="padding:12px 24px;">
        <div style="display:flex;align-items:center;gap:14px;padding:14px;border:1px solid #e5e5e5;border-radius:16px;background:#fafafa;">
          ${img}
          <div>
            <div style="font-size:14px;font-weight:700;color:#171717;">${escapeEmailHtml(b.productName || 'Product')}</div>
            <div style="font-size:13px;font-weight:700;color:#854d0e;margin:4px 0 8px 0;">${escapeEmailHtml(b.productPrice || '')}</div>
            <a href="${escapeEmailHtml(b.productUrl || 'https://ystoreza.co.za/')}" style="display:inline-block;padding:6px 14px;background:${dark};color:${accent};font-size:11px;font-weight:700;text-decoration:none;border-radius:${radius};">View Product</a>
          </div>
        </div>
      </div>`
    }
    if (b.type === 'promo') {
      return `<div style="padding:14px 24px;">
        <div style="padding:18px;border:2px dashed ${dark};border-radius:16px;background:#fefce8;text-align:center;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#737373;font-weight:700;">Promo Code</div>
          <div style="font-family:monospace;font-size:22px;font-weight:800;color:#171717;margin:6px 0;">${escapeEmailHtml(b.code || 'YELLOW15')}</div>
          <div style="font-size:12px;color:#525252;">${escapeEmailHtml(b.note || '')}</div>
        </div>
      </div>`
    }
    if (b.type === 'button') {
      return `<div style="padding:16px 24px;text-align:center;">
        <a href="${escapeEmailHtml(b.url || 'https://ystoreza.co.za/')}" style="display:inline-block;padding:12px 26px;background:${dark};color:${accent};font-size:13px;font-weight:700;text-decoration:none;border-radius:${radius};">${escapeEmailHtml(b.label || 'Shop Now')}</a>
      </div>`
    }
    if (b.type === 'divider') {
      return `<div style="padding:8px 24px;"><hr style="border:0;border-top:1px solid #e5e5e5;" /></div>`
    }
    return ''
  }).join('')

  return `<div style="font-family:Poppins,Arial,sans-serif;background:#ffffff;color:#171717;max-width:600px;margin:0 auto;">
    ${blocksHtml}
    <div style="padding:18px 24px;border-top:1px solid #f0f0f0;text-align:center;font-size:11px;color:#737373;line-height:1.5;">
      ${escapeEmailHtml(companyProfile.value?.companyName || 'Yellow Berry Store')} • ${escapeEmailHtml([companyProfile.value?.city, companyProfile.value?.country].filter(Boolean).join(', ') || 'Cape Town, South Africa')} • <a href="https://${escapeEmailHtml(companyProfile.value?.domain || 'ystoreza.co.za')}/" style="color:#171717;">${escapeEmailHtml(companyProfile.value?.domain || 'ystoreza.co.za')}</a><br />
      Reply to ${replyTo} anytime to unsubscribe.
    </div>
  </div>`
})

const resolvedMailerRecipients = computed(() => {
  const emailSet = new Set()
  const addIfValid = (val) => {
    const clean = String(val || '').trim().toLowerCase()
    if (clean && clean.includes('@')) emailSet.add(clean)
  }

  const aud = mailerForm.value.audience
  if (aud === 'all-customers') {
    ;(customers.value || []).forEach((c) => addIfValid(c.email))
    ;(newsletterSubscribers.value || []).forEach((s) => addIfValid(s.email))
  } else if (aud === 'registered-customers') {
    ;(customers.value || []).forEach((c) => {
      if (!c.isAnonymous) addIfValid(c.email)
    })
  } else if (aud === 'newsletter-subscribers') {
    ;(newsletterSubscribers.value || []).forEach((s) => addIfValid(s.email))
  } else if (aud.startsWith('segment:')) {
    const segId = aud.replace('segment:', '')
    const seg = (allComputedSegments.value || []).find((s) => s.id === segId)
    if (seg && Array.isArray(seg.customers)) {
      seg.customers.forEach((c) => addIfValid(c.email))
    }
  } else if (aud === 'custom-emails') {
    String(mailerForm.value.customEmails || '')
      .split(/[\s,;]+/)
      .forEach((e) => addIfValid(e))
  }

  return Array.from(emailSet)
})

const resetMailerForm = () => {
  editingCampaignId.value = null
  mailerBlocks.value = createDefaultBlocks('new-arrivals')
  mailerForm.value = {
    name: '',
    subject: '',
    preheader: '',
    audience: 'all-customers',
    customEmails: '',
    templatePreset: 'new-arrivals',
    headline: '',
    body: '',
    ctaText: 'Shop Now',
    ctaUrl: 'https://ystoreza.co.za/',
    fromName: 'Yellow Berry Store',
    fromEmail: 'noreply@ystoreza.co.za',
    replyToEmail: 'info@yberry.co.za'
  }
}

const loadCampaignIntoEditor = (camp) => {
  if (!camp) return
  editingCampaignId.value = camp.id
  if (Array.isArray(camp.blocks) && camp.blocks.length > 0) {
    mailerBlocks.value = camp.blocks.map((b) => ({ ...b }))
  }
  if (camp.theme && typeof camp.theme === 'object') {
    mailerTheme.value = { ...mailerTheme.value, ...camp.theme }
  }
  mailerForm.value = {
    name: camp.name || '',
    subject: camp.subject || '',
    preheader: camp.preheader || '',
    audience: camp.audience || 'all-customers',
    customEmails: camp.customEmails || '',
    templatePreset: camp.templatePreset || 'custom',
    headline: camp.headline || '',
    body: camp.body || '',
    ctaText: camp.ctaText || 'Shop Now',
    ctaUrl: camp.ctaUrl || 'https://ystoreza.co.za/',
    fromName: camp.fromName || 'Yellow Berry Store',
    fromEmail: camp.fromEmail || 'noreply@ystoreza.co.za',
    replyToEmail: camp.replyToEmail || 'info@yberry.co.za'
  }
  notify(`Loaded template "${camp.name || 'Draft'}" into builder.`)
}

const handleSaveMailerDraft = async () => {
  const saved = await saveMailerCampaign(
    {
      ...mailerForm.value,
      blocks: mailerBlocks.value,
      theme: mailerTheme.value,
      htmlBody: generatedMailerHtml.value,
      name: mailerForm.value.name || mailerForm.value.subject || 'Untitled Template',
      recipientCount: resolvedMailerRecipients.value.length,
      status: 'draft'
    },
    editingCampaignId.value
  )
  editingCampaignId.value = saved.id
  notify('Mailer template draft saved!')
}

const handleSendMailerCampaign = async () => {
  const recipients = resolvedMailerRecipients.value
  if (recipients.length === 0) {
    notify('No recipient email addresses found for the selected audience.', 'error')
    return
  }
  if (!mailerForm.value.subject?.trim() || mailerBlocks.value.length === 0) {
    notify('Please enter a subject line and add at least one template block.', 'error')
    return
  }
  if (!confirm(`Send this HTML mailer template to ${recipients.length} recipient(s)?`)) return

  mailerSending.value = true
  try {
    const res = await fetch('/api/send-campaign-mail.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        recipients,
        subject: mailerForm.value.subject.trim(),
        htmlBody: generatedMailerHtml.value,
        fromName: mailerForm.value.fromName.trim(),
        fromEmail: mailerForm.value.fromEmail.trim(),
        replyToEmail: mailerForm.value.replyToEmail.trim()
      })
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data.ok === false) {
      throw new Error(data.error || `Mailer endpoint returned HTTP ${res.status}`)
    }
    const saved = await saveMailerCampaign(
      {
        ...mailerForm.value,
        blocks: mailerBlocks.value,
        theme: mailerTheme.value,
        htmlBody: generatedMailerHtml.value,
        name: mailerForm.value.name || mailerForm.value.subject,
        recipientCount: recipients.length,
        status: 'sent',
        sentAt: new Date().toISOString()
      },
      editingCampaignId.value
    )
    editingCampaignId.value = saved.id
    notify(data.message || `HTML template dispatched to ${recipients.length} recipient(s)!`)
  } catch (err) {
    notify(err?.message || 'Unable to dispatch campaign.', 'error')
  } finally {
    mailerSending.value = false
  }
}

const copyGeneratedMailerHtml = async () => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  await navigator.clipboard.writeText(generatedMailerHtml.value)
  notify('Generated HTML email template copied to clipboard.')
}

const copyMailerRecipients = async () => {
  const list = resolvedMailerRecipients.value
  if (!list.length || typeof navigator === 'undefined' || !navigator.clipboard) return
  await navigator.clipboard.writeText(list.join(', '))
  notify(`Copied ${list.length} email address(es) to clipboard.`)
}

const handleOpenMailClientBcc = () => {
  const list = resolvedMailerRecipients.value
  if (!list.length) return
  const subject = encodeURIComponent(mailerForm.value.subject || '')
  const body = encodeURIComponent(
    `${mailerForm.value.headline ? mailerForm.value.headline + '\n\n' : ''}${mailerForm.value.body || ''}${mailerForm.value.ctaText ? `\n\n${mailerForm.value.ctaText}: ${mailerForm.value.ctaUrl}` : ''}`
  )
  window.location.href = `mailto:?bcc=${encodeURIComponent(list.join(','))}&subject=${subject}&body=${body}`
}

const handleDeleteMailerCampaign = async (id) => {
  if (!confirm('Delete this mailer campaign?')) return
  await deleteMailerCampaign(id)
  if (editingCampaignId.value === id) resetMailerForm()
  notify('Campaign deleted.')
}

// ==========================================
// THEME -> CUSTOMER REVIEWS & GOOGLE REVIEWS API PREP
// ==========================================
const googleReviewsForm = ref({
  source: googleReviewsConfig.value?.source || 'manual',
  googlePlaceId: googleReviewsConfig.value?.googlePlaceId || '',
  googleApiKey: googleReviewsConfig.value?.googleApiKey || '',
  minRating: googleReviewsConfig.value?.minRating || 4,
  maxReviews: googleReviewsConfig.value?.maxReviews || 6,
  lastSyncedAt: googleReviewsConfig.value?.lastSyncedAt || null,
  cachedGoogleReviews: googleReviewsConfig.value?.cachedGoogleReviews || []
})
watch(
  googleReviewsConfig,
  (val) => {
    if (val) {
      googleReviewsForm.value = {
        source: val.source || 'manual',
        googlePlaceId: val.googlePlaceId || '',
        googleApiKey: val.googleApiKey || '',
        minRating: val.minRating || 4,
        maxReviews: val.maxReviews || 6,
        lastSyncedAt: val.lastSyncedAt || null,
        cachedGoogleReviews: Array.isArray(val.cachedGoogleReviews) ? val.cachedGoogleReviews : []
      }
    }
  },
  { deep: true }
)

const googleReviewsSaving = ref(false)
const googleReviewsSyncing = ref(false)

const handleSaveGoogleReviewsConfig = async () => {
  googleReviewsSaving.value = true
  try {
    await saveGoogleReviewsConfig(googleReviewsForm.value)
    notify('Google Reviews API settings saved!')
  } catch (err) {
    notify(err?.message || 'Failed to save Google Reviews settings', 'error')
  } finally {
    googleReviewsSaving.value = false
  }
}

const handleSyncGoogleReviews = async () => {
  googleReviewsSyncing.value = true
  try {
    const synced = await syncGoogleReviews(
      googleReviewsForm.value.googlePlaceId,
      googleReviewsForm.value.googleApiKey
    )
    notify(`Synced ${synced.length} Google review(s)!`)
  } catch (err) {
    notify(err?.message || 'Google Reviews sync failed', 'error')
  } finally {
    googleReviewsSyncing.value = false
  }
}

const showStoreReviewModal = ref(false)
const editingStoreReview = ref(null)
const storeReviewSaving = ref(false)
const storeReviewForm = ref({
  name: '',
  rating: 5,
  badge: 'Verified Buyer',
  quote: '',
  order: 1,
  enabled: true
})

const openStoreReviewModal = (review = null) => {
  if (review) {
    editingStoreReview.value = review
    storeReviewForm.value = {
      name: review.name || '',
      rating: Number(review.rating) || 5,
      badge: review.badge || 'Verified Buyer',
      quote: review.quote || '',
      order: Number(review.order) || 1,
      enabled: review.enabled !== false
    }
  } else {
    editingStoreReview.value = null
    storeReviewForm.value = {
      name: '',
      rating: 5,
      badge: 'Verified Buyer',
      quote: '',
      order: (storeReviews.value?.length || 0) + 1,
      enabled: true
    }
  }
  showStoreReviewModal.value = true
}

const handleSaveStoreReview = async () => {
  if (!storeReviewForm.value.name?.trim() || !storeReviewForm.value.quote?.trim()) {
    notify('Please enter both customer name and review quote.', 'error')
    return
  }
  storeReviewSaving.value = true
  try {
    await saveStoreReview(storeReviewForm.value, editingStoreReview.value?.id)
    notify('Customer review saved!')
    showStoreReviewModal.value = false
  } catch (err) {
    notify(err?.message || 'Failed to save customer review', 'error')
  } finally {
    storeReviewSaving.value = false
  }
}

const handleDeleteStoreReview = async (review) => {
  if (confirm(`Delete review from "${review.name}"?`)) {
    try {
      await deleteStoreReview(review.id)
      notify('Review removed.', 'info')
    } catch (err) {
      notify(err?.message || 'Failed to delete review', 'error')
    }
  }
}

const handleResetStoreReviews = async () => {
  if (confirm('Reset storefront customer reviews to defaults?')) {
    try {
      await resetStoreReviewsToDefaults()
      notify('Storefront reviews reset to defaults.')
    } catch (err) {
      notify(err?.message || 'Failed to reset reviews', 'error')
    }
  }
}

// ==========================================
// PRODUCTS -> CUSTOMER REVIEWS MANAGEMENT
// ==========================================
const productReviewFilterProduct = ref('all')
const productReviewFilterStatus = ref('all')
const showProductReviewModal = ref(false)
const editingProductReview = ref(null)
const productReviewSaving = ref(false)
const productReviewForm = ref({
  productId: '',
  productName: '',
  author: '',
  rating: 5,
  title: '',
  comment: '',
  badge: 'Verified Customer',
  status: 'approved',
  adminReply: ''
})

const filteredProductReviews = computed(() => {
  return (productReviews.value || []).filter((rev) => {
    if (productReviewFilterProduct.value !== 'all') {
      const target = String(productReviewFilterProduct.value).toLowerCase()
      const pid = String(rev.productId || '').toLowerCase()
      const pname = String(rev.productName || '').toLowerCase()
      if (pid !== target && pname !== target) return false
    }
    if (productReviewFilterStatus.value !== 'all') {
      if ((rev.status || 'approved') !== productReviewFilterStatus.value) return false
    }
    return true
  })
})

const syncProductReviewProductName = () => {
  const match = (products.value || []).find(
    (p) => String(p.id || p.name) === String(productReviewForm.value.productId)
  )
  if (match) {
    productReviewForm.value.productName = match.name || 'Product'
  }
}

const openProductReviewModal = (rev = null) => {
  if (rev) {
    editingProductReview.value = rev
    productReviewForm.value = {
      productId: rev.productId || '',
      productName: rev.productName || '',
      author: rev.author || '',
      rating: Number(rev.rating) || 5,
      title: rev.title || '',
      comment: rev.comment || '',
      badge: rev.badge || 'Verified Customer',
      status: rev.status || 'approved',
      adminReply: rev.adminReply || ''
    }
  } else {
    const firstProd = products.value?.[0]
    editingProductReview.value = null
    productReviewForm.value = {
      productId: firstProd ? (firstProd.id || firstProd.name) : '',
      productName: firstProd ? firstProd.name : '',
      author: '',
      rating: 5,
      title: '',
      comment: '',
      badge: 'Verified Customer',
      status: 'approved',
      adminReply: ''
    }
  }
  showProductReviewModal.value = true
}

const handleSaveProductReviewAdmin = async () => {
  if (!productReviewForm.value.productId) {
    notify('Please select a product.', 'error')
    return
  }
  if (!productReviewForm.value.author?.trim() || !productReviewForm.value.comment?.trim()) {
    notify('Please enter customer name and review comment.', 'error')
    return
  }
  syncProductReviewProductName()
  productReviewSaving.value = true
  try {
    await saveProductReview(productReviewForm.value, editingProductReview.value?.id)
    notify('Product review saved!')
    showProductReviewModal.value = false
  } catch (err) {
    notify(err?.message || 'Failed to save product review', 'error')
  } finally {
    productReviewSaving.value = false
  }
}

const toggleProductReviewStatus = async (rev) => {
  try {
    const nextStatus = rev.status === 'approved' ? 'hidden' : 'approved'
    await saveProductReview({ ...rev, status: nextStatus }, rev.id)
    notify(`Review ${nextStatus === 'approved' ? 'approved & visible' : 'hidden'}.`)
  } catch (err) {
    notify(err?.message || 'Failed to update review status', 'error')
  }
}

const handleDeleteProductReviewAdmin = async (rev) => {
  if (confirm(`Delete review by "${rev.author}" for "${rev.productName}"?`)) {
    try {
      await deleteProductReview(rev.id)
      notify('Product review deleted.', 'info')
    } catch (err) {
      notify(err?.message || 'Failed to delete product review', 'error')
    }
  }
}

const adminFirstName = computed(() => {
  const full = currentUser.value?.displayName || 'Laban Le Fleur'
  return full.split(' ')[0] || 'Laban'
})

const adminAvatarUrl = computed(() => {
  return currentUser.value?.photoURL || useAsset('/images/avatar-laban.jpg')
})

const navItems = computed(() => [
  { id: 'dashboard', label: 'Dashboard', icon: '/images/dashboard-icon.svg' },
  { id: 'orders', label: 'Orders', icon: '/images/orders-icon.svg', count: orders.value.length },
  { id: 'products', label: 'Products', icon: '/images/products-icon.svg', count: products.value.length },
  { id: 'customers', label: 'Customers', icon: '/images/customer-icon.svg', count: customers.value.length },
  { id: 'discounts', label: 'Discounts', icon: '/images/discount-icon.svg', count: discounts.value.length },
  { id: 'media', label: 'Media files', icon: '/images/media-files-icon.svg' },
  { id: 'blogs', label: 'Blogs', icon: '/images/blogs-icon-1.svg', count: blogs.value.length },
  { id: 'marketing', label: 'Marketing', icon: 'mail' },
  { id: 'theme', label: 'Theme', icon: 'palette' }
])

const overviewStats = computed(() => [
  {
    label: 'Total Products',
    value: products.value.length,
    subtext: `${categories.value.length} active categories`,
    icon: '/images/products-icon.svg',
    target: 'products'
  },
  {
    label: 'Active Orders',
    value: orders.value.length,
    subtext: 'Live order queue',
    icon: '/images/orders-icon.svg',
    target: 'orders'
  },
  {
    label: 'Registered Customers',
    value: customers.value.length,
    subtext: 'Synced in ystore-db',
    icon: '/images/customer-icon.svg',
    target: 'customers'
  },
  {
    label: 'Blog Articles',
    value: blogs.value.length,
    subtext: `${discounts.value.length} active discounts`,
    icon: '/images/blogs-icon-1.svg',
    target: 'blogs'
  }
])

// Publication status filters
const productStatusFilter = ref('all') // 'all' | 'published' | 'draft'
const bannerStatusFilter = ref('all') // 'all' | 'published' | 'draft'

const publishedProductsCount = computed(() => products.value.filter((p) => p.status !== 'draft').length)
const draftProductsCount = computed(() => products.value.filter((p) => p.status === 'draft').length)

const publishedBannersCount = computed(() => banners.value.filter((b) => b.status !== 'draft').length)
const draftBannersCount = computed(() => banners.value.filter((b) => b.status === 'draft').length)

// Filtered lists using the sidebar search bar and publication status filters
const filteredProductsList = computed(() => {
  const q = globalSearch.value.trim().toLowerCase()
  return products.value.filter((p) => {
    if (productStatusFilter.value === 'published' && p.status === 'draft') return false
    if (productStatusFilter.value === 'draft' && p.status !== 'draft') return false
    if (!q) return true
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    )
  })
})

const filteredOrders = computed(() => {
  const q = globalSearch.value.trim().toLowerCase()
  if (!q) return orders.value
  return orders.value.filter(
    (o) =>
      (o.id || '').toLowerCase().includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerEmail || '').toLowerCase().includes(q)
  )
})

const filteredCustomers = computed(() => {
  const q = globalSearch.value.trim().toLowerCase()
  if (!q) return customers.value
  return customers.value.filter(
    (c) =>
      (c.displayName || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
  )
})

// ==========================================
// CUSTOMER SEGMENTATION HELPERS & STATE
// ==========================================
const getCustomerOrders = (customer) => {
  if (!customer) return []
  const email = (customer.email || '').toLowerCase().trim()
  const uid = customer.uid || customer.id
  return orders.value.filter((o) => {
    const oEmail = (o.customerEmail || '').toLowerCase().trim()
    const oUid = o.userId || o.customerId
    return (email && oEmail === email) || (uid && oUid === uid)
  })
}

const getCustomerSpend = (customer) => {
  const ords = getCustomerOrders(customer)
  return ords.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
}

const getCustomerOrderCount = (customer) => {
  return getCustomerOrders(customer).length
}

const matchesSegmentCriteria = (customer, segment) => {
  if (!segment) return true
  if (segment.id === 'all') return true
  if (segment.id === 'vip') return getCustomerSpend(customer) >= 1000 || (customer.rewardPoints ?? 0) >= 200
  if (segment.id === 'repeat') return getCustomerOrderCount(customer) >= 2
  if (segment.id === 'first_time') return getCustomerOrderCount(customer) === 1
  if (segment.id === 'loyalty') return (customer.rewardPoints ?? 0) > 0
  if (segment.id === 'at_risk') return getCustomerOrderCount(customer) === 0

  // Custom Segment criteria
  const spend = getCustomerSpend(customer)
  const ordersCount = getCustomerOrderCount(customer)
  const points = customer.rewardPoints ?? 0

  if (segment.minSpend && spend < segment.minSpend) return false
  if (segment.minOrders && ordersCount < segment.minOrders) return false
  if (segment.minPoints && points < segment.minPoints) return false
  return true
}

const customerSegmentPresets = computed(() => [
  {
    id: 'all',
    name: 'All Customers',
    icon: 'users',
    description: 'All registered accounts in ystore-db',
    color: 'neutral',
    badgeClass: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    count: customers.value.length
  },
  {
    id: 'vip',
    name: 'VIP High Spenders',
    icon: 'star',
    description: 'Spent R1,000+ or holding 200+ Berry Points',
    color: 'yellow',
    badgeClass: 'bg-[#FAF7BA] text-neutral-900 border-[#F4EB6A]',
    count: customers.value.filter((c) => getCustomerSpend(c) >= 1000 || (c.rewardPoints ?? 0) >= 200).length
  },
  {
    id: 'repeat',
    name: 'Repeat Buyers',
    icon: 'cart',
    description: 'Placed 2 or more orders with Yellow Berry',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    count: customers.value.filter((c) => getCustomerOrderCount(c) >= 2).length
  },
  {
    id: 'first_time',
    name: 'First-Time Buyers',
    icon: 'box',
    description: 'New shoppers with exactly 1 order',
    color: 'blue',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    count: customers.value.filter((c) => getCustomerOrderCount(c) === 1).length
  },
  {
    id: 'loyalty',
    name: 'Loyalty Club Members',
    icon: 'gift',
    description: 'Shoppers with active Berry Points rewards',
    color: 'purple',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    count: customers.value.filter((c) => (c.rewardPoints ?? 0) > 0).length
  },
  {
    id: 'at_risk',
    name: 'Inactive / Prospect',
    icon: 'clock',
    description: 'Registered accounts with 0 completed orders',
    color: 'rose',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    count: customers.value.filter((c) => getCustomerOrderCount(c) === 0).length
  }
])

const allComputedSegments = computed(() => [
  ...customerSegmentPresets.value,
  ...customerSegments.value.map((s) => ({
    ...s,
    badgeClass: s.color === 'emerald'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : s.color === 'blue'
        ? 'bg-blue-100 text-blue-800 border-blue-300'
        : s.color === 'purple'
          ? 'bg-purple-100 text-purple-800 border-purple-300'
          : s.color === 'rose'
            ? 'bg-rose-100 text-rose-800 border-rose-300'
            : 'bg-[#FAF7BA] text-neutral-900 border-[#F4EB6A]',
    count: customers.value.filter((c) => matchesSegmentCriteria(c, s)).length
  }))
])

const activeSegmentId = ref('all')
const segmentCustomerSearch = ref('')

const currentActiveSegment = computed(() => {
  return allComputedSegments.value.find((s) => s.id === activeSegmentId.value) || allComputedSegments.value[0] || {
    id: 'all',
    name: 'All Customers',
    description: 'All registered accounts in ystore-db'
  }
})

const customersInActiveSegment = computed(() => {
  const seg = currentActiveSegment.value
  let list = customers.value.filter((c) => matchesSegmentCriteria(c, seg))
  const q = segmentCustomerSearch.value.toLowerCase().trim()
  if (q) {
    list = list.filter((c) =>
      (c.displayName || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.role || '').toLowerCase().includes(q)
    )
  }
  return list
})

// Segment Modal State
const showSegmentModal = ref(false)
const editingSegmentId = ref(null)
const segmentSaving = ref(false)
const segmentForm = ref({
  name: '',
  description: '',
  criteriaType: 'spend',
  minSpend: 500,
  minOrders: 1,
  minPoints: 50,
  color: 'yellow'
})

const openSegmentModal = (seg = null) => {
  if (seg && seg.id && !customerSegmentPresets.value.some((p) => p.id === seg.id)) {
    editingSegmentId.value = seg.id
    segmentForm.value = {
      name: seg.name || '',
      description: seg.description || '',
      criteriaType: seg.criteriaType || 'spend',
      minSpend: seg.minSpend || 0,
      minOrders: seg.minOrders || 0,
      minPoints: seg.minPoints || 0,
      color: seg.color || 'yellow'
    }
  } else {
    editingSegmentId.value = null
    segmentForm.value = {
      name: '',
      description: '',
      criteriaType: 'spend',
      minSpend: 500,
      minOrders: 1,
      minPoints: 50,
      color: 'yellow'
    }
  }
  showSegmentModal.value = true
}

const handleSaveSegment = async () => {
  if (!segmentForm.value.name.trim()) return
  segmentSaving.value = true
  try {
    await saveCustomerSegment(segmentForm.value, editingSegmentId.value)
    showSegmentModal.value = false
    notify(`Segment "${segmentForm.value.name}" saved successfully!`, 'success')
  } catch (err) {
    notify(`Failed to save segment: ${err.message}`, 'error')
  } finally {
    segmentSaving.value = false
  }
}

const handleDeleteSegment = async (id, name) => {
  if (!confirm(`Are you sure you want to delete the segment "${name}"?`)) return
  try {
    await deleteCustomerSegment(id)
    if (activeSegmentId.value === id) {
      activeSegmentId.value = 'all'
    }
    notify(`Segment "${name}" deleted.`, 'success')
  } catch (err) {
    notify(`Failed to delete segment: ${err.message}`, 'error')
  }
}

const copySegmentEmails = () => {
  const emails = customersInActiveSegment.value
    .map((c) => c.email)
    .filter(Boolean)
  if (!emails.length) {
    notify('No email addresses found in this segment to copy.', 'error')
    return
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(emails.join(', '))
  }
  notify(`Copied ${emails.length} customer email(s) for "${currentActiveSegment.value?.name || 'Segment'}" to clipboard!`, 'success')
}

const filteredBanners = computed(() => {
  const q = globalSearch.value.trim().toLowerCase()
  return banners.value.filter((b) => {
    if (bannerStatusFilter.value === 'published' && b.status === 'draft') return false
    if (bannerStatusFilter.value === 'draft' && b.status !== 'draft') return false
    if (!q) return true
    return (
      (b.title || '').toLowerCase().includes(q) ||
      (b.subtitle || '').toLowerCase().includes(q) ||
      (b.altText || '').toLowerCase().includes(q) ||
      (b.badge || '').toLowerCase().includes(q)
    )
  })
})

// ==========================================
// PURCHASE ORDERS STATE & HELPERS
// ==========================================
const poStatusFilter = ref('all')
const poSearchQuery = ref('')
const showPOForm = ref(false)
const editingPOId = ref(null)
const poSaving = ref(false)

const poForm = ref({
  poNumber: '',
  supplierName: '',
  supplierEmail: '',
  destination: 'Main Workshop / Warehouse',
  status: 'ordered',
  expectedDate: '',
  shippingCost: 0,
  notes: '',
  items: [
    {
      productId: '',
      name: '',
      sku: '',
      quantityOrdered: 1,
      unitCost: 0
    }
  ]
})

const generatePONumber = () => {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(100 + Math.random() * 900)
  poForm.value.poNumber = `PO-${year}-${randomNum}`
}

const addPOLineItem = () => {
  poForm.value.items.push({
    productId: '',
    name: '',
    sku: '',
    quantityOrdered: 1,
    unitCost: 0
  })
}

const removePOLineItem = (index) => {
  if (poForm.value.items.length > 1) {
    poForm.value.items.splice(index, 1)
  }
}

const onPOProductSelect = (index) => {
  const item = poForm.value.items[index]
  if (!item.productId) return
  const prod = products.value.find((p) => p.id === item.productId)
  if (prod) {
    item.name = prod.name || ''
    item.sku = prod.sku || ''
    item.unitCost = prod.costPerItem || 0
  }
}

const poSubtotal = computed(() => {
  return poForm.value.items.reduce((sum, it) => {
    return sum + (Number(it.quantityOrdered || 0) * Number(it.unitCost || 0))
  }, 0)
})

const poTotal = computed(() => {
  return Number((poSubtotal.value + Number(poForm.value.shippingCost || 0)).toFixed(2))
})

const openPOModal = (po = null) => {
  if (po) {
    editingPOId.value = po.id
    poForm.value = {
      poNumber: po.poNumber || '',
      supplierName: po.supplierName || '',
      supplierEmail: po.supplierEmail || '',
      destination: po.destination || 'Main Workshop / Warehouse',
      status: po.status || 'ordered',
      expectedDate: po.expectedDate || '',
      shippingCost: po.shippingCost || 0,
      notes: po.notes || '',
      items: Array.isArray(po.items) && po.items.length
        ? JSON.parse(JSON.stringify(po.items))
        : [{ productId: '', name: '', sku: '', quantityOrdered: 1, unitCost: 0 }]
    }
  } else {
    editingPOId.value = null
    generatePONumber()
    poForm.value = {
      poNumber: poForm.value.poNumber,
      supplierName: '',
      supplierEmail: '',
      destination: 'Main Workshop / Warehouse',
      status: 'ordered',
      expectedDate: '',
      shippingCost: 0,
      notes: '',
      items: [
        {
          productId: '',
          name: '',
          sku: '',
          quantityOrdered: 1,
          unitCost: 0
        }
      ]
    }
  }
  showPOForm.value = true
}

const handleSavePO = async () => {
  if (!poForm.value.supplierName.trim()) {
    notify('Please specify a supplier name.', 'error')
    return
  }
  if (!poForm.value.items.length) {
    notify('Please add at least one line item to the purchase order.', 'error')
    return
  }
  poSaving.value = true
  try {
    await savePurchaseOrder(poForm.value, editingPOId.value)
    showPOForm.value = false
    notify(`Purchase Order ${poForm.value.poNumber} saved successfully!`, 'success')
  } catch (err) {
    notify(`Failed to save Purchase Order: ${err.message}`, 'error')
  } finally {
    poSaving.value = false
  }
}

const handleReceivePO = async (po) => {
  if (!confirm(`Mark ${po.poNumber} as Received? This will automatically add ordered quantities to your live product stock.`)) {
    return
  }
  try {
    await receivePurchaseOrder(po.id, true)
    notify(`Purchase Order ${po.poNumber} received! Product inventory has been updated.`, 'success')
  } catch (err) {
    notify(`Failed to receive Purchase Order: ${err.message}`, 'error')
  }
}

const handleDeletePO = async (id, poNum) => {
  if (!confirm(`Are you sure you want to delete ${poNum}?`)) return
  try {
    await deletePurchaseOrder(id)
    notify(`Purchase Order ${poNum} deleted.`, 'success')
  } catch (err) {
    notify(`Failed to delete Purchase Order: ${err.message}`, 'error')
  }
}

const filteredPurchaseOrders = computed(() => {
  const q = (poSearchQuery.value || globalSearch.value).toLowerCase().trim()
  return purchaseOrders.value.filter((po) => {
    if (poStatusFilter.value !== 'all' && po.status !== poStatusFilter.value) return false
    if (!q) return true
    const num = (po.poNumber || '').toLowerCase()
    const sup = (po.supplierName || '').toLowerCase()
    const items = (po.items || []).some((it) => (it.name || '').toLowerCase().includes(q) || (it.sku || '').toLowerCase().includes(q))
    return num.includes(q) || sup.includes(q) || items
  })
})

const poMetrics = computed(() => {
  const total = purchaseOrders.value.length
  const ordered = purchaseOrders.value.filter((p) => p.status === 'ordered').length
  const received = purchaseOrders.value.filter((p) => p.status === 'received').length
  const drafts = purchaseOrders.value.filter((p) => p.status === 'draft').length
  const totalSpend = purchaseOrders.value.reduce((sum, p) => sum + (Number(p.total) || 0), 0)
  return { total, ordered, received, drafts, totalSpend }
})

// ==========================================
// CATEGORY HANDLERS
// ==========================================
const showCategoryForm = ref(false)
const savingCategory = ref(false)
const editingCategoryId = ref(null)
const categoryForm = ref({ name: '', description: '', image: '' })

const openCategoryModal = (cat = null) => {
  if (cat) {
    editingCategoryId.value = cat.id
    categoryForm.value = {
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || ''
    }
  } else {
    editingCategoryId.value = null
    categoryForm.value = { name: '', description: '', image: '' }
  }
  showCategoryForm.value = true
}

const getCategoryProductCount = (catName) => {
  if (!catName) return 0
  return products.value.filter(
    (p) => (p.category || '').trim().toLowerCase() === catName.trim().toLowerCase()
  ).length
}

const filterProductsByCategory = (catName) => {
  globalSearch.value = catName
  activeSection.value = 'products'
}

const handleCategoryImageUpload = async (e) => {
  const file = e.target?.files?.[0]
  if (!file) return
  try {
    const uploaded = await uploadFile(file, 'categories')
    categoryForm.value.image = uploaded.url
    notify('Category cover image uploaded!')
  } catch (err) {
    notify(err.message || 'Upload failed', 'error')
  }
}

const handleSaveCategory = async () => {
  if (!categoryForm.value.name.trim()) return
  savingCategory.value = true
  try {
    await saveCategory(categoryForm.value, editingCategoryId.value)
    categoryForm.value = { name: '', description: '', image: '' }
    showCategoryForm.value = false
    notify(editingCategoryId.value ? 'Category updated!' : 'Category added to ystore-db!')
  } catch (err) {
    notify(err.message || 'Failed to save category', 'error')
  } finally {
    savingCategory.value = false
  }
}

const handleDeleteCategory = async (id) => {
  if (typeof window !== 'undefined' && !window.confirm('Delete this category?')) return
  try {
    await deleteCategory(id)
    notify('Category removed.')
  } catch (err) {
    notify(err.message || 'Failed to delete category', 'error')
  }
}

// ==========================================
// COLLECTIONS HANDLERS
// ==========================================
const showCollectionForm = ref(false)
const savingCollection = ref(false)
const editingCollectionId = ref(null)
const collectionForm = ref({
  name: '',
  description: '',
  image: '',
  featured: false,
  productIds: []
})

const openCollectionModal = (col = null) => {
  if (col) {
    editingCollectionId.value = col.id
    collectionForm.value = {
      name: col.name || col.title || '',
      description: col.description || '',
      image: col.image || '',
      featured: !!col.featured,
      productIds: Array.isArray(col.productIds) ? [...col.productIds] : []
    }
  } else {
    editingCollectionId.value = null
    collectionForm.value = {
      name: '',
      description: '',
      image: '',
      featured: false,
      productIds: []
    }
  }
  showCollectionForm.value = true
}

const handleCollectionImageUpload = async (e) => {
  const file = e.target?.files?.[0]
  if (!file) return
  try {
    const uploaded = await uploadFile(file, 'collections')
    collectionForm.value.image = uploaded.url
    notify('Collection banner uploaded!')
  } catch (err) {
    notify(err.message || 'Upload failed', 'error')
  }
}

const toggleProductInCollection = (productId) => {
  const arr = collectionForm.value.productIds
  const idx = arr.indexOf(productId)
  if (idx > -1) {
    arr.splice(idx, 1)
  } else {
    arr.push(productId)
  }
}

const selectAllProductsForCollection = () => {
  collectionForm.value.productIds = products.value.map((p) => p.id)
}

const getProductById = (pid) => {
  return products.value.find((p) => p.id === pid)
}

const handleSaveCollection = async () => {
  if (!collectionForm.value.name.trim()) {
    notify('Please enter a collection title', 'error')
    return
  }
  savingCollection.value = true
  try {
    await saveCollection(collectionForm.value, editingCollectionId.value)
    showCollectionForm.value = false
    notify(editingCollectionId.value ? 'Collection updated!' : 'Curated collection created!')
  } catch (err) {
    notify(err.message || 'Failed to save collection', 'error')
  } finally {
    savingCollection.value = false
  }
}

const handleDeleteCollection = async (id) => {
  if (typeof window !== 'undefined' && !window.confirm('Delete this product collection?')) return
  try {
    await deleteCollection(id)
    notify('Collection removed.')
  } catch (err) {
    notify(err.message || 'Failed to delete collection', 'error')
  }
}

// ==========================================
// PRODUCT HANDLERS
// ==========================================
const showProductForm = ref(false)
const savingProduct = ref(false)
const editingProductId = ref(null)

const quickSuggestedTags = [
  'Handcrafted',
  'Eco-Friendly',
  'Lifestyle',
  'Toys & Games',
  'Collectible',
  'Custom Decor',
  'Gift Idea',
  'Made in SA'
]

const standardPackageTypes = [
  'Standard Box (15 × 10 × 8 cm)',
  'Small Box (12 × 9 × 5 cm)',
  'Medium Box (22 × 16 × 12 cm)',
  'Large Box (30 × 24 × 18 cm)',
  'Padded Bubble Mailer (20 × 15 cm)',
  'Custom Box / Tube'
]

const disclosureOpen = ref({
  material: true,
  care: false,
  safety: false,
  origin: false,
  custom: true
})

const productForm = ref({
  name: '',
  category: '',
  price: '',
  originalPrice: '',
  costPerItem: '',
  sku: '',
  quantity: 15,
  continueSellingWhenOutOfStock: false,
  requiresShipping: true,
  weight: '',
  weightUnit: 'kg',
  packedDimensions: {
    length: '',
    width: '',
    height: '',
    unit: 'cm'
  },
  packageType: '',
  tags: [],
  tagInput: '',
  tag: '',
  image: '',
  images: [],
  description: '',
  status: 'published',
  inStock: true,
  isFeatured: true,
  isNewArrival: false,
  isBestSeller: false,
  isSpecial: false,
  colors: [],
  colorVariants: [],
  faqs: [],
  disclosures: {
    material: '',
    careInstructions: '',
    safetyNotice: '',
    origin: ''
  },
  metafields: [
    { key: '', value: '' }
  ],
  seo: {
    title: '',
    description: '',
    slug: ''
  }
})

// Reactive Financial Analytics
const calculatedProfit = computed(() => {
  const p = Number(productForm.value.price) || 0
  const c = Number(productForm.value.costPerItem) || 0
  if (!productForm.value.costPerItem || c <= 0) return null
  return Number((p - c).toFixed(2))
})

const calculatedMargin = computed(() => {
  const p = Number(productForm.value.price) || 0
  const c = Number(productForm.value.costPerItem) || 0
  if (!productForm.value.costPerItem || c <= 0 || p <= 0) return null
  return Number((((p - c) / p) * 100).toFixed(1))
})

// Reactive Volume Calculation
const calculatedVolume = computed(() => {
  const l = Number(productForm.value.packedDimensions?.length) || 0
  const w = Number(productForm.value.packedDimensions?.width) || 0
  const h = Number(productForm.value.packedDimensions?.height) || 0
  if (l > 0 && w > 0 && h > 0) {
    return (l * w * h).toLocaleString()
  }
  return null
})

// Auto-generate smart SKU
const generateSku = () => {
  const prefix = 'YB'
  const namePart = (productForm.value.name || 'PRD')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 3)
    .toUpperCase()
  const randomNum = Math.floor(100 + Math.random() * 900)
  productForm.value.sku = `${prefix}-${namePart || 'ITM'}-${randomNum}`
}

// Auto-generate SEO URL slug
const generateSlug = () => {
  if (!productForm.value.name) return
  productForm.value.seo.slug = productForm.value.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const handleProductNameInput = () => {
  if (!productForm.value.seo.slug) {
    generateSlug()
  }
}

// Tag Management
const addTag = (tagToAdd = null) => {
  const val = (tagToAdd || productForm.value.tagInput || '').trim()
  if (!val) return
  if (!productForm.value.tags) productForm.value.tags = []
  if (!productForm.value.tags.includes(val)) {
    productForm.value.tags.push(val)
  }
  productForm.value.tagInput = ''
}

const removeTag = (index) => {
  if (productForm.value.tags) {
    productForm.value.tags.splice(index, 1)
  }
}

// Metafields Management
const addMetafield = () => {
  if (!productForm.value.metafields) productForm.value.metafields = []
  productForm.value.metafields.push({ key: '', value: '' })
}

const removeMetafield = (index) => {
  if (productForm.value.metafields) {
    productForm.value.metafields.splice(index, 1)
  }
}

// Color Variations Management
const colorInput = ref('')
const addProductColor = () => {
  const val = colorInput.value.trim()
  if (!val) return
  if (!productForm.value.colors) productForm.value.colors = []
  if (!productForm.value.colors.includes(val)) {
    productForm.value.colors.push(val)
  }
  colorInput.value = ''
}

const removeProductColor = (index) => {
  if (productForm.value.colors) {
    productForm.value.colors.splice(index, 1)
  }
}

// Colour Variants (Custom Name & Price) Management
const colorVariantInput = ref({ color: '', name: '', price: '' })
const addColorVariant = () => {
  const color = String(colorVariantInput.value.color || '').trim()
  const name = String(colorVariantInput.value.name || '').trim()
  const rawPrice = colorVariantInput.value.price
  if (!color && !name) {
    notify('Please enter a colour or custom variant name.', 'warning')
    return
  }
  if (!productForm.value.colorVariants) productForm.value.colorVariants = []
  productForm.value.colorVariants.push({
    color: color || name,
    name: name || color,
    price: rawPrice !== '' && rawPrice !== null && rawPrice !== undefined ? Number(rawPrice) : (Number(productForm.value.price) || 0)
  })
  colorVariantInput.value = { color: '', name: '', price: '' }
}

const removeColorVariant = (index) => {
  if (productForm.value.colorVariants) {
    productForm.value.colorVariants.splice(index, 1)
  }
}

// Product FAQs Management
const addProductFaq = () => {
  if (!productForm.value.faqs) productForm.value.faqs = []
  productForm.value.faqs.push({ question: '', answer: '' })
}

const removeProductFaq = (index) => {
  if (productForm.value.faqs) {
    productForm.value.faqs.splice(index, 1)
  }
}

const getProductStatus = (prod) => {
  if (prod.status === 'draft') {
    return {
      text: 'Draft',
      class: 'bg-amber-50 text-amber-800 border-amber-300'
    }
  }
  return {
    text: 'Published',
    class: 'bg-emerald-50 text-emerald-800 border-emerald-300'
  }
}

const openProductModal = (prod = null) => {
  if (prod) {
    editingProductId.value = prod.id
    const existingImages = Array.isArray(prod.images) && prod.images.length
      ? [...prod.images.slice(0, 7)]
      : (prod.image ? [prod.image] : [])
    const mainImg = prod.image || existingImages[0] || ''
    if (mainImg && !existingImages.includes(mainImg) && existingImages.length < 7) {
      existingImages.unshift(mainImg)
    }

    productForm.value = {
      name: prod.name || '',
      category: prod.category || '',
      price: prod.price ?? '',
      originalPrice: prod.originalPrice ?? '',
      costPerItem: prod.costPerItem ?? '',
      sku: prod.sku || '',
      quantity: prod.quantity ?? prod.stockLeft ?? 15,
      continueSellingWhenOutOfStock: !!prod.continueSellingWhenOutOfStock,
      requiresShipping: prod.requiresShipping !== false,
      weight: prod.weight ?? '',
      weightUnit: prod.weightUnit || 'kg',
      packedDimensions: {
        length: prod.packedDimensions?.length ?? '',
        width: prod.packedDimensions?.width ?? '',
        height: prod.packedDimensions?.height ?? '',
        unit: 'cm'
      },
      packageType: prod.packageType || '',
      tags: Array.isArray(prod.tags) ? [...prod.tags] : (prod.tag ? [prod.tag] : []),
      tagInput: '',
      tag: prod.tag || '',
      image: mainImg,
      images: existingImages.slice(0, 7),
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      status: prod.status || 'published',
      inStock: prod.inStock !== false,
      isFeatured: !!prod.isFeatured,
      isNewArrival: !!prod.isNewArrival,
      isBestSeller: !!prod.isBestSeller,
      isSpecial: !!prod.isSpecial,
      colors: Array.isArray(prod.colors) ? [...prod.colors] : [],
      colorVariants: Array.isArray(prod.colorVariants) ? prod.colorVariants.map((v) => ({ ...v })) : [],
      faqs: Array.isArray(prod.faqs) ? prod.faqs.map((f) => ({ ...f })) : [],
      disclosures: {
        material: prod.disclosures?.material || '',
        careInstructions: prod.disclosures?.careInstructions || '',
        safetyNotice: prod.disclosures?.safetyNotice || '',
        origin: prod.disclosures?.origin || ''
      },
      metafields: Array.isArray(prod.metafields) && prod.metafields.length
        ? prod.metafields.map((m) => ({ ...m }))
        : [{ key: '', value: '' }],
      seo: {
        title: prod.seo?.title || prod.name || '',
        description: prod.seo?.description || prod.description || '',
        slug: prod.seo?.slug || (prod.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      }
    }
  } else {
    editingProductId.value = null
    const defaultName = ''
    productForm.value = {
      name: defaultName,
      category: categories.value[0]?.name || '',
      price: '',
      originalPrice: '',
      costPerItem: '',
      sku: '',
      quantity: 15,
      continueSellingWhenOutOfStock: false,
      requiresShipping: true,
      weight: '',
      weightUnit: 'kg',
      packedDimensions: {
        length: '',
        width: '',
        height: '',
        unit: 'cm'
      },
      packageType: '',
      tags: [],
      tagInput: '',
      tag: '',
      image: '',
      images: [],
      shortDescription: '',
      description: '',
      status: 'published',
      inStock: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      isSpecial: false,
      colors: [],
      colorVariants: [],
      faqs: [],
      disclosures: {
        material: '',
        careInstructions: '',
        safetyNotice: '',
        origin: ''
      },
      metafields: [{ key: '', value: '' }],
      seo: {
        title: '',
        description: '',
        slug: ''
      }
    }
  }
  showProductForm.value = true
}

const productImageUrlInput = ref('')

const handleProductMultipleImagesUpload = async (e) => {
  const files = Array.from(e.target?.files || [])
  if (!files.length) return
  if (!productForm.value.images) productForm.value.images = []

  const remainingSlots = 7 - productForm.value.images.length
  if (remainingSlots <= 0) {
    notify('Maximum limit of 7 images reached for this product.', 'error')
    return
  }

  const filesToUpload = files.slice(0, remainingSlots)
  try {
    notify(`Optimizing and compressing ${filesToUpload.length} image${filesToUpload.length > 1 ? 's' : ''} to high-speed WebP...`)
    const results = await uploadMultipleFiles(filesToUpload, 'products')
    const newUrls = results.map((r) => r.url).filter(Boolean)
    productForm.value.images.push(...newUrls)

    // If no main image is designated yet, set first uploaded as main
    if (!productForm.value.image && productForm.value.images.length > 0) {
      productForm.value.image = productForm.value.images[0]
    }

    notify(`Uploaded and optimized ${newUrls.length} high-speed WebP photo${newUrls.length > 1 ? 's' : ''} to gallery!`)
  } catch (err) {
    notify(err.message || 'Image upload failed', 'error')
  } finally {
    if (e.target) e.target.value = ''
  }
}

const handleProductImageUpload = handleProductMultipleImagesUpload

const addProductImageUrl = () => {
  const url = productImageUrlInput.value.trim()
  if (!url) return
  if (!productForm.value.images) productForm.value.images = []
  if (productForm.value.images.length >= 7) {
    notify('Maximum limit of 7 images reached for this product.', 'error')
    return
  }
  productForm.value.images.push(url)
  if (!productForm.value.image) {
    productForm.value.image = url
  }
  productImageUrlInput.value = ''
  notify('Image added to gallery.')
}

const setMainProductImage = (url) => {
  productForm.value.image = url
  // If image is not in gallery, add it
  if (!productForm.value.images) productForm.value.images = []
  if (!productForm.value.images.includes(url) && productForm.value.images.length < 7) {
    productForm.value.images.unshift(url)
  }
  notify('Selected as Main Product Image!')
}

const removeProductImage = (idx) => {
  if (!productForm.value.images) return
  const removed = productForm.value.images.splice(idx, 1)[0]
  if (productForm.value.image === removed) {
    productForm.value.image = productForm.value.images[0] || ''
  }
}

const moveProductImage = (fromIdx, toIdx) => {
  if (!productForm.value.images) return
  if (toIdx < 0 || toIdx >= productForm.value.images.length) return
  const item = productForm.value.images.splice(fromIdx, 1)[0]
  productForm.value.images.splice(toIdx, 0, item)
}

const handleSaveProduct = async (forcedStatus = null) => {
  savingProduct.value = true
  try {
    const targetStatus = forcedStatus || productForm.value.status || 'published'
    const discountPct =
      productForm.value.originalPrice && Number(productForm.value.originalPrice) > Number(productForm.value.price)
        ? Math.round(
            ((Number(productForm.value.originalPrice) - Number(productForm.value.price)) /
              Number(productForm.value.originalPrice)) *
              100
          )
        : 0

    // Ensure SEO fields fall back cleanly if not explicitly set
    if (!productForm.value.seo.title) {
      productForm.value.seo.title = productForm.value.name
    }
    if (!productForm.value.seo.description) {
      productForm.value.seo.description = productForm.value.description
    }
    if (!productForm.value.seo.slug && productForm.value.name) {
      productForm.value.seo.slug = productForm.value.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    const cleanImages = (productForm.value.images || []).filter(Boolean).slice(0, 7)
    let mainImg = productForm.value.image || cleanImages[0] || ''
    if (mainImg && !cleanImages.includes(mainImg) && cleanImages.length < 7) {
      cleanImages.unshift(mainImg)
    }

    if (String(colorVariantInput.value.color || '').trim() || String(colorVariantInput.value.name || '').trim()) {
      addColorVariant()
    }

    const cleanColorVariants = (productForm.value.colorVariants || [])
      .filter((v) => v && (String(v.name || '').trim() || String(v.color || '').trim()))
      .map((v) => {
        const color = String(v.color || '').trim()
        const name = String(v.name || '').trim()
        const parsedPrice = Number(v.price)
        return {
          color: color || name,
          name: name || color,
          price: !Number.isNaN(parsedPrice) && v.price !== '' && v.price !== null ? parsedPrice : (Number(productForm.value.price) || 0)
        }
      })

    await saveProduct(
      {
        ...productForm.value,
        colorVariants: cleanColorVariants,
        image: mainImg,
        images: cleanImages,
        status: targetStatus,
        discount: discountPct
      },
      editingProductId.value
    )
    showProductForm.value = false
    notify(
      editingProductId.value
        ? (targetStatus === 'draft' ? 'Product updated as draft.' : 'Product updated & published live!')
        : (targetStatus === 'draft' ? 'Product saved as draft!' : 'Product published to storefront!')
    )
  } catch (err) {
    notify(err.message || 'Failed to save product', 'error')
  } finally {
    savingProduct.value = false
  }
}

const toggleProductStatus = async (prod) => {
  const nextStatus = prod.status === 'draft' ? 'published' : 'draft'
  try {
    await saveProduct({ ...prod, status: nextStatus }, prod.id)
    notify(
      nextStatus === 'published'
        ? `"${prod.name}" published live to storefront!`
        : `"${prod.name}" moved to draft status.`
    )
  } catch (err) {
    notify(err.message || 'Failed to update product status', 'error')
  }
}

const handleDeleteProduct = async (id) => {
  try {
    await deleteProduct(id)
    notify('Product deleted.')
  } catch (err) {
    notify(err.message || 'Failed to delete product', 'error')
  }
}

// ==========================================
// DISCOUNT HANDLERS
// ==========================================
const discountForm = ref({ code: '', discount: '', description: '' })

const handleSaveDiscount = async () => {
  if (!discountForm.value.code.trim()) return
  try {
    await saveDiscount(discountForm.value)
    discountForm.value = { code: '', discount: '', description: '' }
    notify('Coupon code published!')
  } catch (err) {
    notify(err.message || 'Failed to save coupon', 'error')
  }
}

// ==========================================
// MEDIA LIBRARY HANDLERS
// ==========================================
const activeStorageFolder = ref('products')
const loadingMedia = ref(false)

const refreshMediaFolder = async () => {
  loadingMedia.value = true
  try {
    await listFolderFiles(activeStorageFolder.value)
  } finally {
    loadingMedia.value = false
  }
}

const handleMediaLibraryUpload = async (e) => {
  const files = e.target?.files
  if (!files?.length) return
  try {
    const res = await uploadMultipleFiles(files, activeStorageFolder.value)
    notify(`Uploaded ${res.length} file(s) to ${activeStorageFolder.value}/`)
    await refreshMediaFolder()
  } catch (err) {
    notify(err.message || 'Upload failed', 'error')
  } finally {
    e.target.value = ''
  }
}

const handleDeleteMedia = async (storagePath) => {
  const ok = await deleteFile(storagePath)
  if (ok) notify('File removed from storage bucket.')
}

const copyUrl = (url) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(url)
    notify('Storage URL copied to clipboard!')
  }
}

watch(activeSection, (sec) => {
  if (sec === 'media') {
    refreshMediaFolder()
  }
})

// ==========================================
// HOME BANNER HANDLERS (Landing Page Hero)
// ==========================================
const showBannerForm = ref(false)
const savingBanner = ref(false)
const editingBannerId = ref(null)
const bannerUploadingField = ref('')

const bannerForm = ref({
  title: '',
  subtitle: '',
  badge: '',
  desktopUrl: '',
  desktopType: 'image',
  mobileUrl: '',
  mobileType: 'image',
  videoUrl: '',
  altText: '',
  link: '#featured',
  buttonText: 'Explore Catalog',
  startDate: '',
  endDate: '',
  order: 1,
  status: 'published',
  active: true
})

const isBannerExpired = (b) => {
  if (!b || !b.endDate) return false
  return new Date(b.endDate) < new Date()
}

const getBannerStatus = (b) => {
  if (b.status === 'draft') {
    return { text: 'Draft', class: 'bg-amber-50 text-amber-800 border-amber-300' }
  }
  if (b.active === false) {
    return { text: 'Paused', class: 'bg-neutral-100 text-neutral-600 border-neutral-300' }
  }
  if (isBannerExpired(b)) {
    return { text: 'Expired', class: 'bg-red-50 text-red-700 border-red-200' }
  }
  return { text: 'Published · Live', class: 'bg-emerald-50 text-emerald-800 border-emerald-300' }
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return 'No expiration'
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const setEndDatePreset = (days) => {
  if (days === 0) {
    bannerForm.value.endDate = ''
    return
  }
  const date = new Date()
  date.setDate(date.getDate() + days)
  const iso = date.toISOString()
  bannerForm.value.endDate = iso.substring(0, 16)
}

const openBannerModal = (banner = null) => {
  if (banner) {
    editingBannerId.value = banner.id
    bannerForm.value = {
      title: banner.title || '',
      subtitle: banner.subtitle || banner.description || '',
      badge: banner.badge || '',
      desktopUrl: banner.desktopUrl || '',
      desktopType: banner.desktopType || (isVideoFile && isVideoFile(banner.desktopUrl) ? 'video' : 'image'),
      mobileUrl: banner.mobileUrl || '',
      mobileType: banner.mobileType || (isVideoFile && isVideoFile(banner.mobileUrl) ? 'video' : 'image'),
      videoUrl: banner.videoUrl || '',
      altText: banner.altText || '',
      link: banner.link || '#featured',
      buttonText: banner.buttonText || 'Explore Catalog',
      startDate: banner.startDate || '',
      endDate: banner.endDate || '',
      order: Number(banner.order ?? 1),
      status: banner.status || (banner.active === false ? 'draft' : 'published'),
      active: banner.status ? banner.status === 'published' : banner.active !== false
    }
  } else {
    editingBannerId.value = null
    bannerForm.value = {
      title: '',
      subtitle: '',
      badge: '',
      desktopUrl: '',
      desktopType: 'image',
      mobileUrl: '',
      mobileType: 'image',
      videoUrl: '',
      altText: '',
      link: '#featured',
      buttonText: 'Explore Catalog',
      startDate: '',
      endDate: '',
      order: (banners.value.length || 0) + 1,
      status: 'published',
      active: true
    }
  }
  showBannerForm.value = true
}

const handleBannerUpload = async (e, field) => {
  const file = e.target?.files?.[0]
  if (!file) return
  bannerUploadingField.value = field
  try {
    // Preserve full 1920x800 resolution on desktop banners and 700x700 on mobile
    const compressionOptions = field === 'desktop'
      ? { maxWidth: 2560, maxHeight: 1600, quality: 0.88 }
      : { maxWidth: 1400, maxHeight: 1400, quality: 0.86 }
    const res = await uploadFile(file, 'banners', { compression: compressionOptions })
    if (field === 'desktop') {
      bannerForm.value.desktopUrl = res.url
      bannerForm.value.desktopType = file.type.startsWith('video/') ? 'video' : 'image'
    } else if (field === 'mobile') {
      bannerForm.value.mobileUrl = res.url
      bannerForm.value.mobileType = file.type.startsWith('video/') ? 'video' : 'image'
    } else if (field === 'video') {
      bannerForm.value.videoUrl = res.url
      bannerForm.value.desktopType = 'video'
    }
    notify(`${field.toUpperCase()} asset uploaded to ystore-db banners!`)
  } catch (err) {
    notify(err.message || 'Upload failed', 'error')
  } finally {
    bannerUploadingField.value = ''
    if (e.target) e.target.value = ''
  }
}

const handleSaveBanner = async (forcedStatus = null) => {
  if (!bannerForm.value.title.trim()) {
    notify('Please enter a banner headline/title', 'error')
    return
  }
  if (!bannerForm.value.desktopUrl && !bannerForm.value.videoUrl) {
    notify('Please upload or provide a desktop image or video file', 'error')
    return
  }
  const targetStatus = forcedStatus || bannerForm.value.status || 'published'
  savingBanner.value = true
  try {
    await saveBanner(
      {
        ...bannerForm.value,
        status: targetStatus,
        active: targetStatus === 'published'
      },
      editingBannerId.value
    )
    showBannerForm.value = false
    notify(
      editingBannerId.value
        ? (targetStatus === 'draft' ? 'Banner updated as draft.' : 'Banner updated & published live!')
        : (targetStatus === 'draft' ? 'Banner saved as draft.' : 'Banner published to Landing Hero!')
    )
  } catch (err) {
    notify(err.message || 'Failed to save banner', 'error')
  } finally {
    savingBanner.value = false
  }
}

const toggleBannerStatus = async (banner) => {
  const nextStatus = banner.status === 'draft' ? 'published' : 'draft'
  try {
    await saveBanner(
      {
        ...banner,
        status: nextStatus,
        active: nextStatus === 'published'
      },
      banner.id
    )
    notify(
      nextStatus === 'published'
        ? `"${banner.title}" published live to hero carousel!`
        : `"${banner.title}" moved to draft status.`
    )
  } catch (err) {
    notify(err.message || 'Failed to update banner status', 'error')
  }
}

const handleDeleteBanner = async (id) => {
  if (typeof window !== 'undefined' && !window.confirm('Delete this home hero banner?')) {
    return
  }
  try {
    await deleteBanner(id)
    notify('Banner deleted from database.')
  } catch (err) {
    notify(err.message || 'Failed to delete banner', 'error')
  }
}

const toggleBannerActive = async (banner) => {
  await toggleBannerStatus(banner)
}

// ==========================================
// BLOG HANDLERS
// ==========================================
const showBlogForm = ref(false)
const savingBlog = ref(false)
const editingBlogId = ref(null)
const blogForm = ref({
  title: '',
  category: 'Craft & Play',
  coverImage: '',
  excerpt: '',
  body: '',
  featured: false
})

const openBlogModal = (post = null) => {
  if (post) {
    editingBlogId.value = post.id
    blogForm.value = {
      title: post.title || '',
      category: post.category || 'Craft & Play',
      coverImage: post.coverImage || '',
      excerpt: post.excerpt || '',
      body: post.body || post.content?.[0]?.paragraphs?.join('\n\n') || '',
      featured: !!post.featured
    }
  } else {
    editingBlogId.value = null
    blogForm.value = {
      title: '',
      category: 'Craft & Play',
      coverImage: '',
      excerpt: '',
      body: '',
      featured: false
    }
  }
  showBlogForm.value = true
}

const handleBlogImageUpload = async (e) => {
  const file = e.target?.files?.[0]
  if (!file) return
  try {
    const res = await uploadFile(file, 'blog')
    blogForm.value.coverImage = res.url
    notify('Blog cover image uploaded!')
  } catch (err) {
    notify(err.message || 'Upload failed', 'error')
  }
}

const handleSaveBlog = async () => {
  savingBlog.value = true
  try {
    await saveBlog(blogForm.value, editingBlogId.value)
    showBlogForm.value = false
    notify(editingBlogId.value ? 'Blog post updated!' : 'Blog post published!')
  } catch (err) {
    notify(err.message || 'Failed to publish blog', 'error')
  } finally {
    savingBlog.value = false
  }
}

// ==========================================
// ORDER STATUS & SIGN OUT
// ==========================================
const handleOrderStatusChange = async (orderId, newStatus) => {
  await updateOrderStatus(orderId, newStatus)
  notify(`Order status updated to ${newStatus}`)
}

const handleSignOut = async () => {
  await logout()
  emit('signed-out')
}

// ==========================================
// USER & STAFF MANAGEMENT STATE & HANDLERS (USER REQUIREMENT)
// ==========================================
const userRoles = [
  {
    id: 'Super Admin',
    label: 'Super Admin',
    badgeClass: 'bg-purple-100 text-purple-900',
    description: 'Full unrestricted control across all store settings, payments, users, orders, and data.',
    defaultPermissions: [
      'manage_products',
      'manage_orders',
      'manage_customers',
      'manage_segments',
      'manage_payments',
      'manage_users',
      'manage_content',
      'manage_discounts'
    ]
  },
  {
    id: 'Store Manager',
    label: 'Store Manager',
    badgeClass: 'bg-blue-100 text-blue-900',
    description: 'Manage products, inventory, customer orders, segments, media, and discount promotions.',
    defaultPermissions: [
      'manage_products',
      'manage_orders',
      'manage_customers',
      'manage_segments',
      'manage_content',
      'manage_discounts'
    ]
  },
  {
    id: 'Order Fulfillment',
    label: 'Order Fulfillment',
    badgeClass: 'bg-amber-100 text-amber-900',
    description: 'Pack, fulfill customer orders, manage purchase orders, and track shipments.',
    defaultPermissions: [
      'manage_orders'
    ]
  },
  {
    id: 'Content Editor',
    label: 'Content Editor',
    badgeClass: 'bg-emerald-100 text-emerald-900',
    description: 'Publish blogs, update hero banners, upload media assets, and craft product descriptions.',
    defaultPermissions: [
      'manage_content',
      'manage_products'
    ]
  },
  {
    id: 'Finance Manager',
    label: 'Finance Manager',
    badgeClass: 'bg-indigo-100 text-indigo-900',
    description: 'Manage payments, payout bank routing, tax configurations, and transaction audits.',
    defaultPermissions: [
      'manage_payments',
      'manage_orders'
    ]
  }
]

const availablePermissions = [
  { id: 'manage_products', label: 'Products & Inventory', desc: 'Create, edit products, manage stock levels, pricing, tags & weights' },
  { id: 'manage_orders', label: 'Orders & Shipments', desc: 'Process orders, print pack slips, mark fulfilled, manage purchase orders' },
  { id: 'manage_customers', label: 'Customers & Segments', desc: 'View customer accounts, spend history, and manage marketing segments' },
  { id: 'manage_payments', label: 'Payment Gateways & Banking', desc: 'Configure PayFast, Yoco, Ozow, Payflex, EFT and bank payout accounts' },
  { id: 'manage_users', label: 'Manage Users & Permissions', desc: 'Invite store staff, assign roles, manage access and security permissions' },
  { id: 'manage_content', label: 'Hero Banners & Blogs', desc: 'Publish announcement banners, blog posts, and manage media library' },
  { id: 'manage_discounts', label: 'Coupons & Specials', desc: 'Create coupon discount codes and manage special promotion listings' }
]

const userSearchQuery = ref('')
const userRoleFilter = ref('all')
const userStatusFilter = ref('all')
const showUserForm = ref(false)
const editingUserId = ref(null)
const savingUser = ref(false)

const userForm = ref({
  name: '',
  email: '',
  role: 'Store Manager',
  department: 'Retail Operations',
  phone: '',
  status: 'active',
  isPrimary: false,
  permissions: ['manage_products', 'manage_orders', 'manage_customers', 'manage_content', 'manage_discounts'],
  sendInviteEmail: true
})

const activeAdminsCount = computed(() => {
  return (adminUsers?.value || []).filter((u) => u.role === 'Super Admin').length
})

const activeStaffCount = computed(() => {
  return (adminUsers?.value || []).filter((u) => u.status === 'active').length
})

const pendingInvitesCount = computed(() => {
  return (adminUsers?.value || []).filter((u) => u.status === 'invited').length
})

const filteredAdminUsers = computed(() => {
  const users = adminUsers?.value || []
  return users.filter((user) => {
    if (userRoleFilter.value !== 'all' && user.role !== userRoleFilter.value) {
      return false
    }
    if (userStatusFilter.value !== 'all' && user.status !== userStatusFilter.value) {
      return false
    }
    if (userSearchQuery.value.trim()) {
      const q = userSearchQuery.value.toLowerCase()
      const matchName = user.name?.toLowerCase().includes(q)
      const matchEmail = user.email?.toLowerCase().includes(q)
      const matchDept = user.department?.toLowerCase().includes(q)
      const matchRole = user.role?.toLowerCase().includes(q)
      if (!matchName && !matchEmail && !matchDept && !matchRole) {
        return false
      }
    }
    return true
  })
})

const onRoleChange = () => {
  const roleConfig = userRoles.find((r) => r.id === userForm.value.role)
  if (roleConfig) {
    userForm.value.permissions = [...roleConfig.defaultPermissions]
  }
}

const openAddUserModal = () => {
  editingUserId.value = null
  userForm.value = {
    name: '',
    email: '',
    role: 'Store Manager',
    department: 'Retail Operations',
    phone: '',
    status: 'active',
    isPrimary: false,
    permissions: ['manage_products', 'manage_orders', 'manage_customers', 'manage_content', 'manage_discounts'],
    sendInviteEmail: true
  }
  showUserForm.value = true
}

const openEditUserModal = (user) => {
  editingUserId.value = user.id
  userForm.value = {
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'Store Manager',
    department: user.department || 'Store Operations',
    phone: user.phone || '',
    status: user.status || 'active',
    isPrimary: !!user.isPrimary,
    permissions: Array.isArray(user.permissions) ? [...user.permissions] : [],
    sendInviteEmail: false
  }
  showUserForm.value = true
}

const sendingInviteId = ref(null)

const inviteDeliveryModal = ref({
  show: false,
  email: '',
  name: '',
  role: '',
  department: '',
  firebaseDispatched: false,
  firebaseError: null,
  subject: '',
  body: '',
  portalUrl: '',
  copied: false
})

const openInviteDeliveryModal = (data) => {
  inviteDeliveryModal.value = {
    show: true,
    email: data.email || '',
    name: data.name || 'Team Member',
    role: data.role || 'Staff Member',
    department: data.department || 'Operations',
    firebaseDispatched: !!data.firebaseDispatched,
    firebaseError: data.firebaseError || null,
    subject: data.subject || 'Welcome to the Yellow Berry Store Team — Staff Access Instructions',
    body: data.body || '',
    portalUrl: data.portalUrl || '',
    copied: false
  }
}

const sendViaGmail = () => {
  const to = inviteDeliveryModal.value.email
  const su = inviteDeliveryModal.value.subject
  const body = inviteDeliveryModal.value.body
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(su)}&body=${encodeURIComponent(body)}`
  window.open(url, '_blank')
}

const sendViaOutlook = () => {
  const to = inviteDeliveryModal.value.email
  const su = inviteDeliveryModal.value.subject
  const body = inviteDeliveryModal.value.body
  const url = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(su)}&body=${encodeURIComponent(body)}`
  window.open(url, '_blank')
}

const sendViaMailto = () => {
  const to = inviteDeliveryModal.value.email
  const su = inviteDeliveryModal.value.subject
  const body = inviteDeliveryModal.value.body
  const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(su)}&body=${encodeURIComponent(body)}`
  window.open(url, '_blank')
}

const copyInviteText = async () => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(inviteDeliveryModal.value.body)
      inviteDeliveryModal.value.copied = true
      setTimeout(() => {
        inviteDeliveryModal.value.copied = false
      }, 2500)
      return
    } catch (_) {}
  }
  const ta = document.createElement('textarea')
  ta.value = inviteDeliveryModal.value.body
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
  inviteDeliveryModal.value.copied = true
  setTimeout(() => {
    inviteDeliveryModal.value.copied = false
  }, 2500)
}

const handleSendInviteEmail = async (user) => {
  if (!user?.email || !user.email.includes('@')) {
    notify('User has no valid email address.', 'error')
    return
  }
  sendingInviteId.value = user.id
  try {
    const res = await sendTeamMemberInvite({
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department
    })
    openInviteDeliveryModal({
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      firebaseDispatched: res?.success,
      firebaseError: res?.error,
      subject: res?.inviteDetails?.subject,
      body: res?.inviteDetails?.body,
      portalUrl: res?.inviteDetails?.portalUrl
    })
    notify(res?.success ? `Invitation prepared & Firebase link triggered for ${user.email}!` : 'Direct dispatch hub ready.', res?.success ? 'success' : 'warning')
  } catch (err) {
    notify(`Failed to send instructions: ${err?.message || 'Error'}`, 'error')
  } finally {
    sendingInviteId.value = null
  }
}

const handleSaveUser = async () => {
  if (!userForm.value.name.trim()) {
    notify('Please enter the user full name', 'error')
    return
  }
  if (!userForm.value.email.trim() || !userForm.value.email.includes('@')) {
    notify('Please enter a valid email address', 'error')
    return
  }
  savingUser.value = true
  try {
    await saveAdminUser(userForm.value, editingUserId.value)

    if (userForm.value.sendInviteEmail) {
      const inviteRes = await sendTeamMemberInvite({
        email: userForm.value.email,
        name: userForm.value.name,
        role: userForm.value.role,
        department: userForm.value.department
      })

      openInviteDeliveryModal({
        email: userForm.value.email,
        name: userForm.value.name,
        role: userForm.value.role,
        department: userForm.value.department,
        firebaseDispatched: inviteRes?.success,
        firebaseError: inviteRes?.error,
        subject: inviteRes?.inviteDetails?.subject,
        body: inviteRes?.inviteDetails?.body,
        portalUrl: inviteRes?.inviteDetails?.portalUrl
      })

      notify(`User saved & invitation delivery hub opened for ${userForm.value.email}!`, 'success')
    } else {
      notify(editingUserId.value ? 'User privileges updated successfully!' : 'Team member invitation saved successfully!', 'success')
    }

    showUserForm.value = false
  } catch (err) {
    notify(err?.message || 'Failed to save user', 'error')
  } finally {
    savingUser.value = false
  }
}

const handleDeleteUser = async (user) => {
  if (user.isPrimary) {
    notify('The primary Super Admin account cannot be removed.', 'error')
    return
  }
  if (!confirm(`Are you sure you want to remove user "${user.name}" from the store team?`)) {
    return
  }
  try {
    await deleteAdminUser(user.id)
    notify(`User "${user.name}" removed from team.`, 'success')
  } catch (err) {
    notify(err?.message || 'Failed to remove user', 'error')
  }
}

const toggleUserStatus = async (user) => {
  if (user.isPrimary) {
    notify('The primary Super Admin cannot be suspended.', 'error')
    return
  }
  const nextStatus = user.status === 'active' ? 'suspended' : 'active'
  try {
    await saveAdminUser({ ...user, status: nextStatus }, user.id)
    notify(`User "${user.name}" account is now ${nextStatus}.`, 'success')
  } catch (err) {
    notify('Failed to update user status', 'error')
  }
}

onMounted(() => {
  initContentListeners()
  initAdminListeners()
})
</script>

<style scoped>
.submenu-accordion {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 320ms cubic-bezier(0.4, 0, 0.2, 1), opacity 260ms ease-in-out;
}

.submenu-accordion.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.submenu-accordion-inner {
  overflow: hidden;
  min-height: 0;
}

.preview-slide-enter-active {
  transition: transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease-out;
}
.preview-slide-leave-active {
  transition: transform 300ms cubic-bezier(0.7, 0, 0.84, 0), opacity 240ms ease-in;
}
.preview-slide-enter-from {
  opacity: 0;
  transform: translateY(22px);
}
.preview-slide-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

</style>
