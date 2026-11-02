<template>
  <div class="w-full bg-white font-poppins min-h-screen">
    <!-- Top Breadcrumbs & Sub-Header -->
    <section class="w-full pt-6 pb-2 border-b border-neutral-100">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
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
              @click="selectCategory('All')"
              class="hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Shop All
            </button>
            <span>&gt;</span>
            <span class="text-neutral-900 font-semibold">{{ activeCategory }}</span>
          </nav>

          <!-- Quick Return Action -->
          <button
            type="button"
            @click="$emit('back-home')"
            class="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 self-start sm:self-auto font-medium transition-colors"
          >
            <FlowbiteIcon name="arrow-left" size="14" stroke-width="2" />
            <span>Back to storefront</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Category Hero Header Banner -->
    <section class="py-6 sm:py-8 bg-neutral-900 text-white relative overflow-hidden">
      <!-- Background pattern & subtle glow -->
      <div class="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#F4EB6A]/10 blur-3xl pointer-events-none"></div>
      <div class="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 bg-neutral-800/90 border border-neutral-700 text-[#F4EB6A] text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-[#F4EB6A] animate-pulse"></span>
              <span>Curated Ystore Collection</span>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white mb-3">
              {{ currentCategoryMeta.title }}
            </h1>
            <p class="text-sm sm:text-base text-neutral-300 leading-relaxed font-light max-w-xl">
              {{ currentCategoryMeta.description }}
            </p>
          </div>

          <!-- Quick stats badge -->
          <div class="flex items-center gap-4 bg-neutral-800/60 backdrop-blur-md border border-neutral-700/80 p-4 rounded-2xl self-start lg:self-auto">
            <div class="w-12 h-12 rounded-xl bg-[#F4EB6A]/20 text-[#F4EB6A] flex items-center justify-center shrink-0">
              <FlowbiteIcon name="sparkles" size="24" stroke-width="1.8" />
            </div>
            <div>
              <div class="text-2xl font-bold text-white">{{ filteredProducts.length }}</div>
              <div class="text-xs text-neutral-400">Products available</div>
            </div>
          </div>
        </div>

        <!-- Quick Category Selector Chips -->
        <div class="mt-8 pt-6 border-t border-neutral-800/80 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            v-for="cat in allCategories"
            :key="cat.name"
            type="button"
            @click="selectCategory(cat.name)"
            :class="[
              'px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer',
              activeCategory === cat.name
                ? 'bg-[#F4EB6A] text-neutral-900 font-semibold shadow-md scale-102'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700'
            ]"
          >
            <span>{{ cat.name }}</span>
            <span
              :class="[
                'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                activeCategory === cat.name ? 'bg-neutral-900 text-[#F4EB6A]' : 'bg-neutral-700 text-neutral-300'
              ]"
            >
              {{ getCategoryProductCount(cat.name) }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Main Products Catalog Layout -->
    <section class="py-10 sm:py-12 bg-neutral-50/50">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Controls Toolbar (Search, Categories Dropdown, Price Range Dropdown, Filter drawer toggle, Sort, View mode) -->
        <div
          ref="toolbarDropdownContainerRef"
          class="bg-white rounded-2xl border border-neutral-200/80 p-4 mb-8 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4"
        >
          <!-- Left: Search, Advance Filter & Custom Dropdown Filters -->
          <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <!-- Search inside category -->
            <div class="relative flex-1 min-w-[200px] sm:w-64">
              <FlowbiteIcon name="search" size="16" stroke-width="2" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search in this category..."
                class="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#F4EB6A] focus:bg-white transition-colors"
              />
              <button
                v-if="searchQuery"
                type="button"
                @click="searchQuery = ''"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <FlowbiteIcon name="close" size="12" stroke-width="2" />
              </button>
            </div>

            <!-- Advance Filter Button (Next to Search Category) -->
            <button
              type="button"
              @click="toggleAdvancedFilters"
              :class="[
                'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer select-none shrink-0',
                showAdvancedFilters || mobileFilterOpen
                  ? 'bg-neutral-900 text-[#F4EB6A] border-neutral-900 shadow-sm'
                  : 'bg-neutral-50/80 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
              ]"
              aria-label="Toggle Advance Filter"
            >
              <FlowbiteIcon
                name="filter"
                size="15"
                stroke-width="2"
                :class="showAdvancedFilters || mobileFilterOpen ? 'text-[#F4EB6A]' : 'text-neutral-500'"
              />
              <span>Advance Filter</span>
              <span
                v-if="activeFilterCount > 0"
                class="w-5 h-5 rounded-full bg-[#F4EB6A] text-neutral-900 text-[11px] font-bold flex items-center justify-center shrink-0"
              >
                {{ activeFilterCount }}
              </span>
              <FlowbiteIcon
                name="chevron-down"
                size="13"
                stroke-width="2"
                :class="['hidden lg:inline-block transition-transform duration-200', showAdvancedFilters ? 'rotate-180 text-[#F4EB6A]' : 'text-neutral-400']"
              />
            </button>

            <!-- Toolbar Custom Dropdown 1: Categories -->
            <div class="relative w-full sm:w-auto">
              <button
                type="button"
                @click="toggleToolbarDropdown('category')"
                :class="[
                  'w-full sm:w-auto min-w-[215px] flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer select-none',
                  activeCategory !== 'All' || isToolbarCategoryOpen
                    ? 'bg-[#FEFEEB] border-[#F4EB6A] text-neutral-900 shadow-2xs'
                    : 'bg-neutral-50/70 hover:bg-neutral-100/80 border-neutral-200 text-neutral-800'
                ]"
                aria-haspopup="listbox"
                :aria-expanded="isToolbarCategoryOpen"
              >
                <div class="flex items-center gap-2 truncate">
                  <FlowbiteIcon name="grid" size="15" stroke-width="1.8" class="text-neutral-500 shrink-0" />
                  <span class="text-neutral-400 font-normal">Category:</span>
                  <span class="font-semibold text-neutral-900 truncate">{{ activeCategory }}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-neutral-900/10 text-neutral-800">
                    {{ getCategoryProductCount(activeCategory) }}
                  </span>
                  <FlowbiteIcon
                    name="chevron-down"
                    size="14"
                    stroke-width="2"
                    :class="['text-neutral-500 transition-transform duration-200', isToolbarCategoryOpen ? 'rotate-180 text-neutral-900' : '']"
                  />
                </div>
              </button>

              <transition name="dropdown">
                <div
                  v-if="isToolbarCategoryOpen"
                  class="absolute left-0 top-full mt-2 w-full sm:w-72 bg-white rounded-2xl shadow-xl border border-neutral-200/90 p-2 z-30"
                  role="listbox"
                >
                  <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                    <span>Select Category</span>
                    <button
                      v-if="activeCategory !== 'All'"
                      type="button"
                      @click="selectCategory('All'); isToolbarCategoryOpen = false"
                      class="text-[11px] font-medium text-amber-700 hover:underline normal-case cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                  <div class="space-y-1 mt-1">
                    <button
                      v-for="cat in allCategories"
                      :key="cat.name"
                      type="button"
                      @click="selectCategory(cat.name); isToolbarCategoryOpen = false"
                      :class="[
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer',
                        activeCategory === cat.name
                          ? 'bg-[#FEFEEB] text-neutral-900 font-semibold border border-[#F4EB6A]'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 border border-transparent'
                      ]"
                    >
                      <div class="flex items-center gap-2 truncate pr-2">
                        <span
                          :class="[
                            'w-2 h-2 rounded-full shrink-0 transition-colors',
                            activeCategory === cat.name ? 'bg-neutral-900' : 'bg-neutral-300'
                          ]"
                        ></span>
                        <span class="truncate">{{ cat.name }}</span>
                      </div>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <span
                          :class="[
                            'text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold',
                            activeCategory === cat.name
                              ? 'bg-neutral-900 text-[#F4EB6A]'
                              : 'bg-neutral-100 text-neutral-500'
                          ]"
                        >
                          {{ getCategoryProductCount(cat.name) }}
                        </span>
                        <FlowbiteIcon
                          v-if="activeCategory === cat.name"
                          name="check"
                          size="14"
                          stroke-width="2.5"
                          class="text-neutral-900"
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Toolbar Custom Dropdown 2: Price Range -->
            <div class="relative w-full sm:w-auto">
              <button
                type="button"
                @click="toggleToolbarDropdown('price')"
                :class="[
                  'w-full sm:w-auto min-w-[195px] flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer select-none',
                  selectedPriceRange !== 'all' || isToolbarPriceOpen
                    ? 'bg-[#FEFEEB] border-[#F4EB6A] text-neutral-900 shadow-2xs'
                    : 'bg-neutral-50/70 hover:bg-neutral-100/80 border-neutral-200 text-neutral-800'
                ]"
                aria-haspopup="listbox"
                :aria-expanded="isToolbarPriceOpen"
              >
                <div class="flex items-center gap-2 truncate">
                  <FlowbiteIcon name="tag" size="15" stroke-width="1.8" class="text-neutral-500 shrink-0" />
                  <span class="text-neutral-400 font-normal">Price:</span>
                  <span class="font-semibold text-neutral-900 truncate">{{ priceRangeLabel }}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-neutral-900/10 text-neutral-800">
                    {{ getPriceRangeProductCount(selectedPriceRange) }}
                  </span>
                  <FlowbiteIcon
                    name="chevron-down"
                    size="14"
                    stroke-width="2"
                    :class="['text-neutral-500 transition-transform duration-200', isToolbarPriceOpen ? 'rotate-180 text-neutral-900' : '']"
                  />
                </div>
              </button>

              <transition name="dropdown">
                <div
                  v-if="isToolbarPriceOpen"
                  class="absolute left-0 top-full mt-2 w-full sm:w-64 bg-white rounded-2xl shadow-xl border border-neutral-200/90 p-2 z-30"
                  role="listbox"
                >
                  <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                    <span>Filter by Price</span>
                    <button
                      v-if="selectedPriceRange !== 'all'"
                      type="button"
                      @click="selectPriceRange('all'); isToolbarPriceOpen = false"
                      class="text-[11px] font-medium text-amber-700 hover:underline normal-case cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                  <div class="space-y-1 mt-1">
                    <button
                      v-for="range in priceRangeOptions"
                      :key="range.value"
                      type="button"
                      @click="selectPriceRange(range.value); isToolbarPriceOpen = false"
                      :class="[
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer',
                        selectedPriceRange === range.value
                          ? 'bg-[#FEFEEB] text-neutral-900 font-semibold border border-[#F4EB6A]'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 border border-transparent'
                      ]"
                    >
                      <div class="flex items-center gap-2 truncate pr-2">
                        <span
                          :class="[
                            'w-2 h-2 rounded-full shrink-0 transition-colors',
                            selectedPriceRange === range.value ? 'bg-neutral-900' : 'bg-neutral-300'
                          ]"
                        ></span>
                        <span class="truncate">{{ range.label }}</span>
                      </div>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <span
                          :class="[
                            'text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold',
                            selectedPriceRange === range.value
                              ? 'bg-neutral-900 text-[#F4EB6A]'
                              : 'bg-neutral-100 text-neutral-500'
                          ]"
                        >
                          {{ getPriceRangeProductCount(range.value) }}
                        </span>
                        <FlowbiteIcon
                          v-if="selectedPriceRange === range.value"
                          name="check"
                          size="14"
                          stroke-width="2.5"
                          class="text-neutral-900"
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Right: Result count, Sort selector, View Mode -->
          <div class="flex items-center justify-between xl:justify-end gap-3 sm:gap-4 w-full xl:w-auto border-t xl:border-t-0 pt-3 xl:pt-0 border-neutral-100 shrink-0">
            <!-- Products count badge -->
            <span class="text-xs text-neutral-500 hidden sm:inline">
              Showing <strong class="text-neutral-900 font-semibold">{{ paginatedProducts.length }}</strong> of {{ filteredProducts.length }} items
            </span>

            <!-- Sort By Select -->
            <div class="flex items-center gap-2">
              <label for="sort-select" class="text-xs text-neutral-500 font-medium hidden sm:inline">Sort:</label>
              <select
                id="sort-select"
                v-model="sortBy"
                class="bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs sm:text-sm rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#F4EB6A] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            <!-- View Layout Toggle (Grid vs List) -->
            <div class="flex items-center bg-neutral-100 p-1 rounded-xl">
              <button
                type="button"
                @click="viewMode = 'grid'"
                :class="[
                  'p-1.5 rounded-lg transition-colors',
                  viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-400 hover:text-neutral-700'
                ]"
                aria-label="Grid view"
              >
                <FlowbiteIcon name="grid" size="16" stroke-width="1.8" />
              </button>
              <button
                type="button"
                @click="viewMode = 'list'"
                :class="[
                  'p-1.5 rounded-lg transition-colors',
                  viewMode === 'list' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-400 hover:text-neutral-700'
                ]"
                aria-label="List view"
              >
                <FlowbiteIcon name="bars" size="16" stroke-width="1.8" />
              </button>
            </div>
          </div>
        </div>

        <!-- Active Filter Pills (if any) -->
        <div v-if="activeFilterCount > 0" class="flex items-center gap-2 flex-wrap mb-6">
          <span class="text-xs font-medium text-neutral-500">Active Filters:</span>
          
          <span
            v-if="activeCategory !== 'All'"
            class="inline-flex items-center gap-1.5 bg-[#FAF7BA] text-[#423C27] text-xs font-semibold px-3 py-1 rounded-full border border-[#F4EB6A]"
          >
            Category: {{ activeCategory }}
            <button type="button" @click="selectCategory('All')" class="hover:text-black cursor-pointer">
              <FlowbiteIcon name="close" size="12" stroke-width="2.5" />
            </button>
          </span>

          <span
            v-if="selectedPriceRange !== 'all'"
            class="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-800 text-xs font-semibold px-3 py-1 rounded-full border border-neutral-200"
          >
            Price: {{ priceRangeLabel }}
            <button type="button" @click="selectedPriceRange = 'all'" class="hover:text-black cursor-pointer">
              <FlowbiteIcon name="close" size="12" stroke-width="2.5" />
            </button>
          </span>

          <span
            v-if="selectedTag"
            class="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-800 text-xs font-semibold px-3 py-1 rounded-full border border-neutral-200"
          >
            Tag: {{ selectedTag }}
            <button type="button" @click="selectedTag = ''" class="hover:text-black cursor-pointer">
              <FlowbiteIcon name="close" size="12" stroke-width="2.5" />
            </button>
          </span>

          <span
            v-if="onlyInStock"
            class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200"
          >
            In Stock Only
            <button type="button" @click="onlyInStock = false" class="hover:text-emerald-950 cursor-pointer">
              <FlowbiteIcon name="close" size="12" stroke-width="2.5" />
            </button>
          </span>

          <button
            type="button"
            @click="resetAllFilters"
            class="text-xs text-red-600 hover:text-red-700 font-medium underline underline-offset-2 ml-1 cursor-pointer"
          >
            Reset All
          </button>
        </div>

        <!-- Catalog Body: Sidebar + Grid -->
        <div :class="['grid grid-cols-1 gap-8 transition-all duration-300', showAdvancedFilters ? 'lg:grid-cols-4' : 'lg:grid-cols-1']">
          
          <!-- Desktop Filter Sidebar (Revealed only when Advance Filter is selected) -->
          <transition name="slide-fade">
            <aside v-if="showAdvancedFilters" class="hidden lg:block lg:col-span-1 space-y-6">
              <div class="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs sticky top-28 space-y-6">
                
                <!-- Sidebar Header -->
                <div class="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div class="flex items-center gap-2 text-neutral-900 font-semibold text-base">
                    <FlowbiteIcon name="filter" size="18" stroke-width="2" />
                    <span>Filters</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="activeFilterCount > 0"
                      type="button"
                      @click="resetAllFilters"
                      class="text-xs text-neutral-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                    <button
                      type="button"
                      @click="showAdvancedFilters = false"
                      class="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                      title="Hide filters"
                      aria-label="Hide filters"
                    >
                      <FlowbiteIcon name="close" size="14" stroke-width="2" />
                    </button>
                  </div>
                </div>

              <!-- Filter Section 1: Categories Dropdown -->
              <div ref="sidebarCategoryRef" class="relative">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400">Categories</h4>
                  <button
                    v-if="activeCategory !== 'All'"
                    type="button"
                    @click="selectCategory('All')"
                    class="text-[11px] font-medium text-amber-700 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <button
                  type="button"
                  @click="toggleSidebarDropdown('category')"
                  :class="[
                    'w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer select-none',
                    activeCategory !== 'All' || isSidebarCategoryOpen
                      ? 'bg-[#FEFEEB] border-[#F4EB6A] text-neutral-900 shadow-2xs'
                      : 'bg-neutral-50/80 hover:bg-neutral-100/80 border-neutral-200 text-neutral-800'
                  ]"
                  aria-haspopup="listbox"
                  :aria-expanded="isSidebarCategoryOpen"
                >
                  <div class="flex items-center gap-2 truncate">
                    <FlowbiteIcon name="grid" size="15" stroke-width="1.8" class="text-neutral-500 shrink-0" />
                    <span class="font-semibold text-neutral-900 truncate">{{ activeCategory }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-neutral-900/10 text-neutral-800">
                      {{ getCategoryProductCount(activeCategory) }}
                    </span>
                    <FlowbiteIcon
                      name="chevron-down"
                      size="14"
                      stroke-width="2"
                      :class="['text-neutral-500 transition-transform duration-200', isSidebarCategoryOpen ? 'rotate-180 text-neutral-900' : '']"
                    />
                  </div>
                </button>

                <transition name="dropdown">
                  <div
                    v-if="isSidebarCategoryOpen"
                    class="mt-2 bg-white rounded-2xl border border-neutral-200/90 shadow-lg p-2 space-y-1"
                    role="listbox"
                  >
                    <button
                      v-for="cat in allCategories"
                      :key="cat.name"
                      type="button"
                      @click="selectCategory(cat.name); isSidebarCategoryOpen = false"
                      :class="[
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer',
                        activeCategory === cat.name
                          ? 'bg-[#FEFEEB] text-neutral-900 font-semibold border border-[#F4EB6A]'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-transparent'
                      ]"
                    >
                      <div class="flex items-center gap-2 truncate pr-2">
                        <span
                          :class="[
                            'w-2 h-2 rounded-full shrink-0',
                            activeCategory === cat.name ? 'bg-neutral-900' : 'bg-neutral-300'
                          ]"
                        ></span>
                        <span class="truncate">{{ cat.name }}</span>
                      </div>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <span
                          :class="[
                            'text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold',
                            activeCategory === cat.name
                              ? 'bg-neutral-900 text-[#F4EB6A]'
                              : 'bg-neutral-100 text-neutral-500'
                          ]"
                        >
                          {{ getCategoryProductCount(cat.name) }}
                        </span>
                        <FlowbiteIcon
                          v-if="activeCategory === cat.name"
                          name="check"
                          size="13"
                          stroke-width="2.5"
                          class="text-neutral-900"
                        />
                      </div>
                    </button>
                  </div>
                </transition>
              </div>

              <!-- Filter Section 2: Price Range Dropdown -->
              <div ref="sidebarPriceRef" class="pt-4 border-t border-neutral-100 relative">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400">Price Range</h4>
                  <button
                    v-if="selectedPriceRange !== 'all'"
                    type="button"
                    @click="selectPriceRange('all')"
                    class="text-[11px] font-medium text-amber-700 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <button
                  type="button"
                  @click="toggleSidebarDropdown('price')"
                  :class="[
                    'w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer select-none',
                    selectedPriceRange !== 'all' || isSidebarPriceOpen
                      ? 'bg-[#FEFEEB] border-[#F4EB6A] text-neutral-900 shadow-2xs'
                      : 'bg-neutral-50/80 hover:bg-neutral-100/80 border-neutral-200 text-neutral-800'
                  ]"
                  aria-haspopup="listbox"
                  :aria-expanded="isSidebarPriceOpen"
                >
                  <div class="flex items-center gap-2 truncate">
                    <FlowbiteIcon name="tag" size="15" stroke-width="1.8" class="text-neutral-500 shrink-0" />
                    <span class="font-semibold text-neutral-900 truncate">{{ priceRangeLabel }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-neutral-900/10 text-neutral-800">
                      {{ getPriceRangeProductCount(selectedPriceRange) }}
                    </span>
                    <FlowbiteIcon
                      name="chevron-down"
                      size="14"
                      stroke-width="2"
                      :class="['text-neutral-500 transition-transform duration-200', isSidebarPriceOpen ? 'rotate-180 text-neutral-900' : '']"
                    />
                  </div>
                </button>

                <transition name="dropdown">
                  <div
                    v-if="isSidebarPriceOpen"
                    class="mt-2 bg-white rounded-2xl border border-neutral-200/90 shadow-lg p-2 space-y-1"
                    role="listbox"
                  >
                    <button
                      v-for="range in priceRangeOptions"
                      :key="range.value"
                      type="button"
                      @click="selectPriceRange(range.value); isSidebarPriceOpen = false"
                      :class="[
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer',
                        selectedPriceRange === range.value
                          ? 'bg-[#FEFEEB] text-neutral-900 font-semibold border border-[#F4EB6A]'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-transparent'
                      ]"
                    >
                      <div class="flex items-center gap-2 truncate pr-2">
                        <span
                          :class="[
                            'w-2 h-2 rounded-full shrink-0',
                            selectedPriceRange === range.value ? 'bg-neutral-900' : 'bg-neutral-300'
                          ]"
                        ></span>
                        <span class="truncate">{{ range.label }}</span>
                      </div>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <span
                          :class="[
                            'text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold',
                            selectedPriceRange === range.value
                              ? 'bg-neutral-900 text-[#F4EB6A]'
                              : 'bg-neutral-100 text-neutral-500'
                          ]"
                        >
                          {{ getPriceRangeProductCount(range.value) }}
                        </span>
                        <FlowbiteIcon
                          v-if="selectedPriceRange === range.value"
                          name="check"
                          size="13"
                          stroke-width="2.5"
                          class="text-neutral-900"
                        />
                      </div>
                    </button>
                  </div>
                </transition>
              </div>

              <!-- Filter Section 3: Popular Tags / Themes -->
              <div v-if="availableTags.length > 0" class="pt-4 border-t border-neutral-100">
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Popular Themes</h4>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="tag in availableTags"
                    :key="tag"
                    type="button"
                    @click="selectedTag = selectedTag === tag ? '' : tag"
                    :class="[
                      'px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                      selectedTag === tag
                        ? 'bg-[#151515] text-[#F4EB6A] font-semibold shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    ]"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>

              <!-- Filter Section 4: Availability -->
              <div class="pt-4 border-t border-neutral-100">
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Availability</h4>
                <label class="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    v-model="onlyInStock"
                    class="w-4 h-4 rounded text-neutral-900 accent-neutral-900 focus:ring-0"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              <!-- Highlight Box / Value Prop in Sidebar -->
              <div class="p-4 rounded-xl bg-gradient-to-br from-[#FEFEEB] to-[#FAF7BA]/40 border border-[#F4EB6A]/60">
                <div class="flex items-center gap-2 text-xs font-bold text-[#423C27] mb-1">
                  <FlowbiteIcon name="truck" size="16" stroke-width="2" class="text-amber-700" />
                  <span>Free Shipping</span>
                </div>
                <p class="text-[11px] text-neutral-600 leading-relaxed">
                  Qualify for complimentary door-to-door delivery on all orders over R550.
                </p>
              </div>

            </div>
          </aside>
        </transition>

        <!-- Products Grid / Results Area -->
        <div :class="showAdvancedFilters ? 'lg:col-span-3' : 'lg:col-span-1'">
          
          <!-- Loading State (while products load from Firestore) -->
          <div
            v-if="contentLoading && masterProducts.length === 0"
            :class="[
              'grid grid-cols-1 sm:grid-cols-2 gap-6',
              showAdvancedFilters ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
            ]"
          >
            <div
              v-for="i in 8"
              :key="i"
              class="bg-white rounded-2xl border border-neutral-200/80 p-4 animate-pulse space-y-3"
            >
              <div class="w-full aspect-square bg-neutral-100 rounded-xl"></div>
              <div class="h-4 bg-neutral-100 rounded-md w-3/4"></div>
              <div class="h-3 bg-neutral-100 rounded-md w-1/2"></div>
              <div class="h-5 bg-neutral-100 rounded-md w-1/3 pt-2"></div>
            </div>
          </div>

          <!-- Empty Results View -->
          <div
            v-else-if="filteredProducts.length === 0"
            class="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center flex flex-col items-center justify-center min-h-[420px]"
          >
            <div class="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
              <FlowbiteIcon name="search" size="28" stroke-width="1.5" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-1">No products match your criteria</h3>
            <p class="text-sm text-neutral-500 max-w-md mb-6 leading-relaxed">
              We couldn't find any items matching your selected category, price, or search keyword. Try adjusting or clearing your filters.
            </p>
            <button
              type="button"
              @click="resetAllFilters"
              class="px-6 py-2.5 rounded-full bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>

          <!-- Grid View (Default) -->
          <div
            v-else-if="viewMode === 'grid'"
            :class="[
              'grid grid-cols-1 sm:grid-cols-2 gap-6',
              showAdvancedFilters ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
            ]"
          >
              <ProductCard
                v-for="product in paginatedProducts"
                :key="product.id"
                :product="product"
                @add-to-cart="$emit('add-to-cart', $event)"
                @quick-view="$emit('quick-view', $event)"
                @toggle-wishlist="$emit('toggle-wishlist', $event)"
                @view-product="$emit('view-product', $event)"
              />
            </div>

            <!-- List View -->
            <div
              v-else-if="viewMode === 'list'"
              class="space-y-4"
            >
              <div
                v-for="product in paginatedProducts"
                :key="product.id"
                class="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs hover:shadow-lg hover:border-[#F4EB6A] transition-all flex flex-col sm:flex-row items-start sm:items-center gap-5 cursor-pointer group"
                @click="$emit('view-product', product)"
              >
                <!-- Thumbnail -->
                <div class="relative w-full sm:w-40 sm:h-40 aspect-square sm:aspect-auto rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span
                    v-if="product.tag"
                    class="absolute top-2 left-2 bg-[#FEFEEB] text-neutral-900 border border-[#F4EB6A] text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  >
                    {{ product.tag }}
                  </span>
                </div>

                <!-- Info -->
                <div class="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <div class="flex items-center gap-1.5 mb-1">
                      <div class="flex text-[#DEC02A]">
                        <FlowbiteIcon
                          v-for="s in 5"
                          :key="s"
                          name="star"
                          size="13"
                          :fill="s <= (product.rating || 5)"
                        />
                      </div>
                      <span class="text-xs text-neutral-400">({{ product.reviews || 28 }} reviews)</span>
                      <span class="text-neutral-300">&bull;</span>
                      <span class="text-xs text-neutral-500 font-medium">{{ product.category }}</span>
                    </div>

                    <h3 class="text-base sm:text-lg font-medium text-neutral-900 group-hover:text-black">
                      {{ product.name }}
                    </h3>
                    <p class="text-xs sm:text-sm text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                      {{ product.description }}
                    </p>
                  </div>

                  <!-- Price & Actions -->
                  <div class="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-4">
                    <div class="flex items-baseline gap-2">
                      <span class="text-lg font-semibold text-neutral-900">R{{ product.price }}</span>
                      <span v-if="product.originalPrice" class="text-xs text-neutral-400 line-through">
                        R{{ product.originalPrice }}
                      </span>
                    </div>

                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click.stop="$emit('quick-view', product)"
                        class="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                        title="Quick View"
                      >
                        <FlowbiteIcon name="eye" size="18" stroke-width="1.8" />
                      </button>
                      <button
                        type="button"
                        @click.stop="$emit('add-to-cart', product)"
                        class="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <FlowbiteIcon name="cart" size="14" stroke-width="2" />
                        <span>Add to cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination Bar -->
            <div
              v-if="filteredProducts.length > itemsPerPage"
              class="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200"
            >
              <div class="text-xs text-neutral-500">
                Page <strong class="text-neutral-900 font-medium">{{ currentPage }}</strong> of {{ totalPages }}
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <FlowbiteIcon name="chevron-left" size="16" stroke-width="2" />
                </button>

                <button
                  v-for="page in totalPages"
                  :key="page"
                  type="button"
                  @click="currentPage = page"
                  :class="[
                    'w-8 h-8 rounded-lg text-xs font-semibold transition-colors',
                    currentPage === page
                      ? 'bg-neutral-900 text-[#F4EB6A]'
                      : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  ]"
                >
                  {{ page }}
                </button>

                <button
                  type="button"
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <FlowbiteIcon name="chevron-right" size="16" stroke-width="2" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- Mobile Filter Drawer Modal -->
    <transition name="drawer">
      <div v-if="mobileFilterOpen" class="fixed inset-0 z-50 lg:hidden">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs" @click="mobileFilterOpen = false"></div>
        <div class="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
          <div class="space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 class="text-lg font-bold text-neutral-900">Filters</h3>
              <button type="button" @click="mobileFilterOpen = false" class="p-1 text-neutral-400 hover:text-neutral-900">
                <FlowbiteIcon name="close" size="20" stroke-width="2" />
              </button>
            </div>

            <!-- Mobile Categories Dropdown -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Categories</h4>
              <button
                type="button"
                @click="isMobileCategoryOpen = !isMobileCategoryOpen"
                :class="[
                  'w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none',
                  activeCategory !== 'All' || isMobileCategoryOpen
                    ? 'bg-[#FEFEEB] border-[#F4EB6A] text-neutral-900'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                ]"
              >
                <div class="flex items-center gap-2 truncate">
                  <FlowbiteIcon name="grid" size="14" stroke-width="1.8" class="text-neutral-500 shrink-0" />
                  <span class="font-semibold text-neutral-900 truncate">{{ activeCategory }}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-neutral-900/10 text-neutral-800">
                    {{ getCategoryProductCount(activeCategory) }}
                  </span>
                  <FlowbiteIcon
                    name="chevron-down"
                    size="14"
                    stroke-width="2"
                    :class="['text-neutral-500 transition-transform duration-200', isMobileCategoryOpen ? 'rotate-180 text-neutral-900' : '']"
                  />
                </div>
              </button>

              <transition name="dropdown">
                <div v-if="isMobileCategoryOpen" class="mt-2 bg-neutral-50/70 rounded-xl border border-neutral-200 p-1.5 space-y-1">
                  <button
                    v-for="cat in allCategories"
                    :key="cat.name"
                    type="button"
                    @click="selectCategory(cat.name); isMobileCategoryOpen = false"
                    :class="[
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors',
                      activeCategory === cat.name ? 'bg-[#FEFEEB] text-neutral-900 font-bold border border-[#F4EB6A]' : 'text-neutral-600 hover:bg-white'
                    ]"
                  >
                    <span class="truncate pr-2">{{ cat.name }}</span>
                    <span class="text-[10px] text-neutral-500 font-mono font-semibold">{{ getCategoryProductCount(cat.name) }}</span>
                  </button>
                </div>
              </transition>
            </div>

            <!-- Mobile Price Range Dropdown -->
            <div class="pt-4 border-t border-neutral-100">
              <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Price Range</h4>
              <button
                type="button"
                @click="isMobilePriceOpen = !isMobilePriceOpen"
                :class="[
                  'w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none',
                  selectedPriceRange !== 'all' || isMobilePriceOpen
                    ? 'bg-[#FEFEEB] border-[#F4EB6A] text-neutral-900'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                ]"
              >
                <div class="flex items-center gap-2 truncate">
                  <FlowbiteIcon name="tag" size="14" stroke-width="1.8" class="text-neutral-500 shrink-0" />
                  <span class="font-semibold text-neutral-900 truncate">{{ priceRangeLabel }}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-neutral-900/10 text-neutral-800">
                    {{ getPriceRangeProductCount(selectedPriceRange) }}
                  </span>
                  <FlowbiteIcon
                    name="chevron-down"
                    size="14"
                    stroke-width="2"
                    :class="['text-neutral-500 transition-transform duration-200', isMobilePriceOpen ? 'rotate-180 text-neutral-900' : '']"
                  />
                </div>
              </button>

              <transition name="dropdown">
                <div v-if="isMobilePriceOpen" class="mt-2 bg-neutral-50/70 rounded-xl border border-neutral-200 p-1.5 space-y-1">
                  <button
                    v-for="range in priceRangeOptions"
                    :key="range.value"
                    type="button"
                    @click="selectPriceRange(range.value); isMobilePriceOpen = false"
                    :class="[
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors',
                      selectedPriceRange === range.value ? 'bg-[#FEFEEB] text-neutral-900 font-bold border border-[#F4EB6A]' : 'text-neutral-600 hover:bg-white'
                    ]"
                  >
                    <span class="truncate pr-2">{{ range.label }}</span>
                    <span class="text-[10px] text-neutral-500 font-mono font-semibold">{{ getPriceRangeProductCount(range.value) }}</span>
                  </button>
                </div>
              </transition>
            </div>

            <!-- Availability -->
            <div class="pt-4 border-t border-neutral-100">
              <label class="flex items-center gap-2 text-xs text-neutral-700">
                <input type="checkbox" v-model="onlyInStock" class="w-4 h-4 rounded" />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          <div class="pt-6 border-t border-neutral-100 flex items-center gap-3">
            <button
              type="button"
              @click="resetAllFilters"
              class="w-1/2 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700"
            >
              Reset
            </button>
            <button
              type="button"
              @click="mobileFilterOpen = false"
              class="w-1/2 py-2.5 rounded-xl bg-neutral-900 text-[#F4EB6A] text-xs font-semibold"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import ProductCard from './ProductCard.vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'

const props = defineProps({
  initialCategory: {
    type: String,
    default: 'All'
  }
})

const emit = defineEmits(['add-to-cart', 'quick-view', 'toggle-wishlist', 'view-product', 'back-home'])

const { publishedProducts: masterProducts, categories: liveCategories, initContentListeners, contentLoading } = useStoreContent()

// Active filter states
const activeCategory = ref(props.initialCategory || 'All')
const searchQuery = ref('')
const selectedPriceRange = ref('all')
const selectedTag = ref('')
const onlyInStock = ref(false)
const sortBy = ref('featured')
const viewMode = ref('grid')
const mobileFilterOpen = ref(false)
const showAdvancedFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = 12

const toggleAdvancedFilters = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    mobileFilterOpen.value = !mobileFilterOpen.value
  } else {
    showAdvancedFilters.value = !showAdvancedFilters.value
  }
}

// Custom Dropdown Open States
const isToolbarCategoryOpen = ref(false)
const isToolbarPriceOpen = ref(false)
const isSidebarCategoryOpen = ref(false)
const isSidebarPriceOpen = ref(false)
const isMobileCategoryOpen = ref(false)
const isMobilePriceOpen = ref(false)

const toolbarDropdownContainerRef = ref(null)
const sidebarCategoryRef = ref(null)
const sidebarPriceRef = ref(null)

const toggleToolbarDropdown = (type) => {
  if (type === 'category') {
    isToolbarCategoryOpen.value = !isToolbarCategoryOpen.value
    isToolbarPriceOpen.value = false
  } else if (type === 'price') {
    isToolbarPriceOpen.value = !isToolbarPriceOpen.value
    isToolbarCategoryOpen.value = false
  }
}

const toggleSidebarDropdown = (type) => {
  if (type === 'category') {
    isSidebarCategoryOpen.value = !isSidebarCategoryOpen.value
  } else if (type === 'price') {
    isSidebarPriceOpen.value = !isSidebarPriceOpen.value
  }
}

const handleDocumentClick = (e) => {
  if (toolbarDropdownContainerRef.value && !toolbarDropdownContainerRef.value.contains(e.target)) {
    isToolbarCategoryOpen.value = false
    isToolbarPriceOpen.value = false
  }
}

onMounted(() => {
  initContentListeners()
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleDocumentClick)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleDocumentClick)
  }
})

watch(() => props.initialCategory, (newCat) => {
  if (newCat) {
    activeCategory.value = newCat
    currentPage.value = 1
  }
})

// Categories master list (synced with live ystore-db categories and discovered product categories)
const allCategories = computed(() => {
  const list = [
    {
      name: 'All',
      title: 'All Collections',
      description: 'Explore our catalog of custom creations.'
    }
  ]
  const seen = new Set(['all'])
  liveCategories.value.forEach(c => {
    if (c.name && !seen.has(c.name.trim().toLowerCase())) {
      seen.add(c.name.trim().toLowerCase())
      list.push({
        name: c.name,
        title: c.title || c.name,
        description: c.description || `Explore our ${c.name} collection.`
      })
    }
  })
  masterProducts.value.forEach(p => {
    if (p.category && !seen.has(p.category.trim().toLowerCase())) {
      seen.add(p.category.trim().toLowerCase())
      list.push({
        name: p.category,
        title: p.category,
        description: `Explore our ${p.category} collection.`
      })
    }
  })
  return list
})

const priceRangeOptions = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under R250', value: 'under-250' },
  { label: 'R250 to R400', value: '250-400' },
  { label: 'Over R400', value: 'over-400' }
]

const availableTags = computed(() => {
  const tags = new Set()
  masterProducts.value.forEach(p => {
    if (p.tag) tags.add(p.tag)
  })
  return Array.from(tags)
})

const currentCategoryMeta = computed(() => {
  const match = allCategories.value.find(c => c.name === activeCategory.value)
  return match || allCategories.value[0]
})

const getCategoryProductCount = (categoryName) => {
  if (categoryName === 'All') return masterProducts.value.length
  const catLower = (categoryName || '').trim().toLowerCase()
  return masterProducts.value.filter(p => (p.category || '').trim().toLowerCase() === catLower).length
}

const getPriceRangeProductCount = (rangeValue) => {
  const baseList = activeCategory.value === 'All'
    ? masterProducts.value
    : masterProducts.value.filter(p => (p.category || '').trim().toLowerCase() === activeCategory.value.trim().toLowerCase())

  if (rangeValue === 'all') return baseList.length
  if (rangeValue === 'under-250') return baseList.filter(p => (Number(p.price) || 0) < 250).length
  if (rangeValue === '250-400') {
    return baseList.filter(p => {
      const pr = Number(p.price) || 0
      return pr >= 250 && pr <= 400
    }).length
  }
  if (rangeValue === 'over-400') return baseList.filter(p => (Number(p.price) || 0) > 400).length
  return 0
}

const selectCategory = (categoryName) => {
  activeCategory.value = categoryName
  currentPage.value = 1
}

const selectPriceRange = (rangeValue) => {
  selectedPriceRange.value = rangeValue
  currentPage.value = 1
}

const priceRangeLabel = computed(() => {
  const found = priceRangeOptions.find(o => o.value === selectedPriceRange.value)
  return found ? found.label : ''
})

const activeFilterCount = computed(() => {
  let count = 0
  if (activeCategory.value !== 'All') count++
  if (selectedPriceRange.value !== 'all') count++
  if (selectedTag.value) count++
  if (onlyInStock.value) count++
  if (searchQuery.value.trim()) count++
  return count
})

const resetAllFilters = () => {
  activeCategory.value = 'All'
  selectedPriceRange.value = 'all'
  selectedTag.value = ''
  onlyInStock.value = false
  searchQuery.value = ''
  currentPage.value = 1
}

// Filtering & Sorting Pipeline (Loaded and active products display by default; filters refine the search)
const filteredProducts = computed(() => {
  return masterProducts.value
    .filter(product => {
      // Category filter (case-insensitive & trimmed)
      if (
        activeCategory.value &&
        activeCategory.value !== 'All' &&
        (product.category || '').trim().toLowerCase() !== activeCategory.value.trim().toLowerCase()
      ) {
        return false
      }
      // Price range filter
      const priceNum = Number(product.price) || 0
      if (selectedPriceRange.value === 'under-250' && priceNum >= 250) return false
      if (selectedPriceRange.value === '250-400' && (priceNum < 250 || priceNum > 400)) return false
      if (selectedPriceRange.value === 'over-400' && priceNum <= 400) return false
      // Tag filter
      if (selectedTag.value && (product.tag || '').trim().toLowerCase() !== selectedTag.value.trim().toLowerCase()) return false
      // Stock filter
      if (onlyInStock.value && !product.inStock && Number(product.quantity) <= 0) return false
      // Search query
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.trim().toLowerCase()
        const matchName = (product.name || '').toLowerCase().includes(query)
        const matchDesc = (product.description || '').toLowerCase().includes(query)
        const matchCat = (product.category || '').toLowerCase().includes(query)
        const matchTag = (product.tag || '').toLowerCase().includes(query)
        if (!matchName && !matchDesc && !matchCat && !matchTag) return false
      }
      return true
    })
    .sort((a, b) => {
      const priceA = Number(a.price) || 0
      const priceB = Number(b.price) || 0
      if (sortBy.value === 'price-asc') return priceA - priceB
      if (sortBy.value === 'price-desc') return priceB - priceA
      if (sortBy.value === 'rating') return (Number(b.rating) || 0) - (Number(a.rating) || 0)
      if (sortBy.value === 'newest') return (Number(b.id) || 0) - (Number(a.id) || 0)
      return 0 // default 'featured'
    })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage))
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

watch([searchQuery, selectedTag, onlyInStock], () => {
  currentPage.value = 1
})

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = Math.max(1, newTotal)
  }
})
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

.slide-fade-enter-active {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.3s ease-in-out;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from > div:last-child {
  transform: translateX(-100%);
}
.drawer-leave-to > div:last-child {
  transform: translateX(-100%);
}
</style>
