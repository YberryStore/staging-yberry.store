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
              src="/images/ystore-logo.svg"
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
              src="/images/ystore-logo.svg"
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
                (activeSection === item.id || (item.id === 'media' && activeSection === 'banners') || (item.id === 'products' && (activeSection === 'categories' || activeSection === 'collections' || activeSection === 'purchase-orders')) || (item.id === 'customers' && activeSection === 'customer-segments'))
                  ? 'text-white font-medium bg-neutral-900/80'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40 font-normal',
                isSidebarCollapsed ? 'justify-center px-2' : ''
              ]"
              :title="item.label"
            >
              <img
                v-if="item.icon && item.icon.includes('.svg')"
                :src="item.icon"
                :alt="item.label"
                :class="[
                  'w-5 h-5 object-contain shrink-0 transition-opacity',
                  (activeSection === item.id || (item.id === 'media' && activeSection === 'banners') || (item.id === 'products' && (activeSection === 'categories' || activeSection === 'collections' || activeSection === 'purchase-orders')) || (item.id === 'customers' && activeSection === 'customer-segments')) ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                ]"
              />
              <FlowbiteIcon
                v-else
                :name="item.icon"
                size="20"
                stroke-width="1.5"
                :class="[
                  'shrink-0 transition-colors',
                  (activeSection === item.id || (item.id === 'media' && activeSection === 'banners') || (item.id === 'products' && (activeSection === 'categories' || activeSection === 'collections' || activeSection === 'purchase-orders')) || (item.id === 'customers' && activeSection === 'customer-segments')) ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
                ]"
              />
              <span v-if="!isSidebarCollapsed" class="truncate">{{ item.label }}</span>
              <span
                v-if="!isSidebarCollapsed && item.count !== undefined && item.count > 0"
                class="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300"
              >
                {{ item.count }}
              </span>
              <!-- Submenu arrow indicators -->
              <FlowbiteIcon
                v-if="item.id === 'products' && !isSidebarCollapsed"
                :name="productsSubmenuOpen ? 'chevron-up' : 'chevron-down'"
                size="14"
                class="ml-auto text-neutral-500 group-hover:text-neutral-300 shrink-0 transition-transform"
              />
              <FlowbiteIcon
                v-else-if="item.id === 'media' && !isSidebarCollapsed"
                :name="mediaSubmenuOpen ? 'chevron-up' : 'chevron-down'"
                size="14"
                class="ml-auto text-neutral-500 group-hover:text-neutral-300 shrink-0 transition-transform"
              />
              <FlowbiteIcon
                v-else-if="item.id === 'customers' && !isSidebarCollapsed"
                :name="customersSubmenuOpen ? 'chevron-up' : 'chevron-down'"
                size="14"
                class="ml-auto text-neutral-500 group-hover:text-neutral-300 shrink-0 transition-transform"
              />
            </button>

            <!-- Products Sub-menu: "All Products", "Add Product +", "Categories", "Collections" -->
            <div
              v-if="item.id === 'products' && !isSidebarCollapsed && productsSubmenuOpen"
              class="pl-6 pr-1 space-y-1 py-1 transition-all"
            >
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
            </div>

            <!-- Media files Sub-menu: "Home Banner" & "Storage Files" -->
            <div
              v-if="item.id === 'media' && !isSidebarCollapsed && mediaSubmenuOpen"
              class="pl-6 pr-1 space-y-1 py-1 transition-all"
            >
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

            <!-- Customers Sub-menu: "All Customers" & "Segment" -->
            <div
              v-if="item.id === 'customers' && !isSidebarCollapsed && customersSubmenuOpen"
              class="pl-6 pr-1 space-y-1 py-1 transition-all"
            >
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
            (activeSection === 'settings' || activeSection === 'settings-payments' || activeSection === 'settings-users')
              ? 'text-white font-medium bg-neutral-900/80'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40 font-normal',
            isSidebarCollapsed ? 'justify-center px-2' : ''
          ]"
          title="Settings"
        >
          <img
            src="/images/settings-icon.svg"
            alt="Settings"
            :class="[
              'w-5 h-5 object-contain shrink-0 transition-opacity',
              (activeSection === 'settings' || activeSection === 'settings-payments' || activeSection === 'settings-users') ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
            ]"
          />
          <span v-if="!isSidebarCollapsed" class="truncate">Settings</span>
          <!-- Submenu arrow indicator -->
          <FlowbiteIcon
            v-if="!isSidebarCollapsed"
            :name="settingsSubmenuOpen ? 'chevron-up' : 'chevron-down'"
            size="14"
            class="ml-auto text-neutral-500 group-hover:text-neutral-300 shrink-0 transition-transform"
          />
        </button>

        <!-- Settings Sub-menu: "General", "Payments" & "Manage Users" (USER REQUIREMENT) -->
        <div
          v-if="!isSidebarCollapsed && settingsSubmenuOpen"
          class="pl-6 pr-1 space-y-1 py-1 transition-all"
        >
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

        <!-- Center: Current Live Visitors -->
        <div class="flex flex-col md:items-center justify-center">
          <span class="text-xs sm:text-sm font-medium text-neutral-800">Current Live Visitors</span>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-xs sm:text-sm text-neutral-500 font-medium">{{ liveVisitorsCount }}</span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#84CC16] inline-block shadow-[0_0_8px_#84CC16] animate-pulse"></span>
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
                    <img src="/images/products-icon.svg" alt="Products" class="w-4 h-4 object-contain brightness-125" />
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
                    <img src="/images/media-files-icon.svg" alt="Media files" class="w-4 h-4 object-contain invert opacity-75" />
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
                    <img src="/images/discount-icon.svg" alt="Discounts" class="w-4 h-4 object-contain invert opacity-75" />
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
                    <img src="/images/blogs-icon-1.svg" alt="Blogs" class="w-4 h-4 object-contain invert opacity-75" />
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
              <img src="/images/orders-icon.svg" alt="Orders" class="w-5 h-5 object-contain" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-neutral-900">Orders ({{ filteredOrders.length }})</h2>
              <p class="text-xs text-neutral-500">Track customer purchases, fulfillment status, and order totals.</p>
            </div>
          </div>
        </div>

        <div v-if="filteredOrders.length === 0" class="py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <div class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 text-neutral-400 p-3">
            <img src="/images/orders-icon.svg" alt="Orders" class="w-6 h-6 object-contain" />
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
              <img src="/images/products-icon.svg" alt="Products" class="w-5 h-5 object-contain" />
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
            <img src="/images/products-icon.svg" alt="Products" class="w-6 h-6 object-contain" />
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
                      :src="prod.image || '/images/prod-robot.jpg'"
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
              <img src="/images/customer-icon.svg" alt="Customers" class="w-5 h-5 object-contain" />
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
              <img src="/images/customer-icon.svg" alt="Segments" class="w-5 h-5 object-contain" />
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
            <img src="/images/customer-icon.svg" alt="Customers" class="w-6 h-6 object-contain" />
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
              <img src="/images/discount-icon.svg" alt="Discounts" class="w-5 h-5 object-contain" />
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
              <img src="/images/media-files-icon.svg" alt="Media files" class="w-5 h-5 object-contain" />
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
            <img src="/images/media-files-icon.svg" alt="Media files" class="w-6 h-6 object-contain" />
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
              <img src="/images/blogs-icon-1.svg" alt="Blogs" class="w-5 h-5 object-contain" />
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
            <img src="/images/blogs-icon-1.svg" alt="Blogs" class="w-6 h-6 object-contain" />
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
              <img src="/images/settings-icon.svg" alt="Settings" class="w-5 h-5 object-contain" />
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

        <!-- Store Identity & Regional Details -->
        <div class="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-4">
          <div class="pb-3 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-neutral-900">Store Profile &amp; Operational Details</h3>
              <p class="text-xs text-neutral-500">Public store identification and business contact information.</p>
            </div>
            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-900 text-[#F4EB6A]">
              Yellow Berry Store (Pty) Ltd
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div class="p-3.5 rounded-xl bg-white border border-neutral-200">
              <span class="text-neutral-400 block text-[11px]">Storefront Domain</span>
              <span class="font-semibold text-neutral-900">yellowberry.store</span>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-neutral-200">
              <span class="text-neutral-400 block text-[11px]">Primary Currency</span>
              <span class="font-semibold text-neutral-900">{{ localPaymentSettings.general.currency }} ({{ localPaymentSettings.general.currencySymbol }})</span>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-neutral-200">
              <span class="text-neutral-400 block text-[11px]">Standard VAT Rate</span>
              <span class="font-semibold text-neutral-900">{{ localPaymentSettings.general.vatRate }}% (South Africa)</span>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-neutral-200">
              <span class="text-neutral-400 block text-[11px]">Timezone</span>
              <span class="font-semibold text-neutral-900">Africa/Johannesburg (GMT+2)</span>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-neutral-200">
              <span class="text-neutral-400 block text-[11px]">Headquarters</span>
              <span class="font-semibold text-neutral-900">Cape Town, South Africa</span>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-neutral-200">
              <span class="text-neutral-400 block text-[11px]">Customer Support Email</span>
              <span class="font-semibold text-neutral-900">support@yellowberry.store</span>
            </div>
          </div>
        </div>

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



    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'
import { useFirebaseStorage } from '../composables/useFirebaseStorage'
import { useStoreContent } from '../composables/useStoreContent'

const emit = defineEmits(['view-storefront', 'signed-out'])

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
  saveCustomerSegment,
  deleteCustomerSegment,
  savePurchaseOrder,
  deletePurchaseOrder,
  receivePurchaseOrder,
  isVideoFile
} = storeContent

const adminUsers = storeContent?.adminUsers || ref([])
const defaultAdminUsers = storeContent?.defaultAdminUsers || []
const saveAdminUser = storeContent?.saveAdminUser
const deleteAdminUser = storeContent?.deleteAdminUser

if (!adminUsers.value) {
  adminUsers.value = []
}

// Payments & Gateways State
const settingsSubmenuOpen = ref(true)
const localPaymentSettings = ref(JSON.parse(JSON.stringify(paymentSettings.value || defaultPaymentSettings)))
const savingPayments = ref(false)
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
  if (activeSection.value !== 'settings' && activeSection.value !== 'settings-payments' && activeSection.value !== 'settings-users') {
    activeSection.value = 'settings'
    settingsSubmenuOpen.value = true
  } else {
    settingsSubmenuOpen.value = !settingsSubmenuOpen.value
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
const productsSubmenuOpen = ref(true)
const mediaSubmenuOpen = ref(true)
const customersSubmenuOpen = ref(true)
const globalSearch = ref('')
const profileDropdownOpen = ref(false)
const showDashboardWidgets = ref(true)
const liveVisitorsCount = ref(12)

const handleNavClick = (id) => {
  if (id === 'products') {
    if (activeSection.value !== 'products' && activeSection.value !== 'categories' && activeSection.value !== 'collections' && activeSection.value !== 'purchase-orders') {
      activeSection.value = 'products'
      productsSubmenuOpen.value = true
    } else {
      productsSubmenuOpen.value = !productsSubmenuOpen.value
    }
  } else if (id === 'media') {
    if (activeSection.value !== 'media' && activeSection.value !== 'banners') {
      activeSection.value = 'banners'
      mediaSubmenuOpen.value = true
    } else {
      mediaSubmenuOpen.value = !mediaSubmenuOpen.value
    }
  } else if (id === 'customers') {
    if (activeSection.value !== 'customers' && activeSection.value !== 'customer-segments') {
      activeSection.value = 'customers'
      customersSubmenuOpen.value = true
    } else {
      customersSubmenuOpen.value = !customersSubmenuOpen.value
    }
  } else if (id === 'settings') {
    handleSettingsNavClick()
  } else {
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

const adminFirstName = computed(() => {
  const full = currentUser.value?.displayName || 'Laban Le Fleur'
  return full.split(' ')[0] || 'Laban'
})

const adminAvatarUrl = computed(() => {
  return currentUser.value?.photoURL || '/images/avatar-laban.jpg'
})

const navItems = computed(() => [
  { id: 'dashboard', label: 'Dashboard', icon: '/images/dashboard-icon.svg' },
  { id: 'orders', label: 'Orders', icon: '/images/orders-icon.svg', count: orders.value.length },
  { id: 'products', label: 'Products', icon: '/images/products-icon.svg', count: products.value.length },
  { id: 'customers', label: 'Customers', icon: '/images/customer-icon.svg', count: customers.value.length },
  { id: 'discounts', label: 'Discounts', icon: '/images/discount-icon.svg', count: discounts.value.length },
  { id: 'media', label: 'Media files', icon: '/images/media-files-icon.svg' },
  { id: 'blogs', label: 'Blogs', icon: '/images/blogs-icon-1.svg', count: blogs.value.length }
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
      description: prod.description || '',
      status: prod.status || 'published',
      inStock: prod.inStock !== false,
      isFeatured: !!prod.isFeatured,
      isNewArrival: !!prod.isNewArrival,
      isBestSeller: !!prod.isBestSeller,
      isSpecial: !!prod.isSpecial,
      colors: Array.isArray(prod.colors) ? [...prod.colors] : [],
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
      description: '',
      status: 'published',
      inStock: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      isSpecial: false,
      colors: [],
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

    await saveProduct(
      {
        ...productForm.value,
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

const openDirectMail = (user) => {
  if (typeof window === 'undefined' || !user?.email) return
  const origin = window.location.origin
  const subject = encodeURIComponent('Welcome to the Yellow Berry Store Team — Staff Access Instructions')
  const body = encodeURIComponent(
`Hi ${user.name || 'Team Member'},

You have been granted access to the Yellow Berry Store administrative portal as "${user.role || 'Staff'}" (${user.department || 'Store Operations'}).

Here are your instructions to access the system:
1. Open the storefront portal: ${origin}
2. Click the Account icon in the top right header and select "Sign In".
3. Click "Forgot password?" and enter your email address (${user.email}).
4. Check your inbox for the password creation link and set your private password.
5. Return to the site, sign in, and you will have full access to your assigned administration dashboard permissions.

If you have any questions or require assistance, please reach out to the store administrator.

Warm regards,
Yellow Berry Store Team`
  )
  window.open(`mailto:${user.email}?subject=${subject}&body=${body}`, '_blank')
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
    if (res?.success) {
      notify(`Login setup & access instructions sent to ${user.email}!`, 'success')
    } else {
      notify(`Email service response: ${res?.error || 'Direct dispatch unconfirmed'}. Opening email composer...`, 'warning')
      openDirectMail(user)
    }
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

      if (inviteRes?.success) {
        notify(`Team member saved & login setup instructions sent to ${userForm.value.email}!`, 'success')
      } else {
        notify(`User saved. Notice: ${inviteRes?.error || 'Email dispatch issue'}. Opening direct mail composer...`, 'warning')
        openDirectMail(userForm.value)
      }
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
