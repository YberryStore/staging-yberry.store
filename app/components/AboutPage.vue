<template>
  <div class="w-full bg-white font-poppins min-h-screen">
    <!-- Top Breadcrumbs & Sub-Header -->
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
            <span class="text-neutral-900 font-semibold">About Us</span>
          </nav>

          <!-- Quick Return Action -->
          <button
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

    <!-- Hero Section: Brand Vision & Credo -->
    <section class="py-12 sm:py-20 bg-neutral-900 text-white relative overflow-hidden">
      <!-- Ambient Lighting Blobs -->
      <div class="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#F4EB6A]/10 blur-3xl pointer-events-none"></div>
      <div class="absolute left-1/4 -bottom-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl">
          <!-- Brand Badge -->
          <div class="inline-flex items-center gap-2 bg-neutral-800/90 border border-neutral-700 text-[#F4EB6A] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 shadow-xs">
            <FlowbiteIcon name="sparkles" size="14" stroke-width="2" />
            <span>The Yellow Berry Story</span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-tight mb-6">
            Crafting tomorrow’s play with <span class="italic font-light text-[#F4EB6A]">sustainable precision.</span>
          </h1>

          <p class="text-base sm:text-lg text-neutral-300 font-light leading-relaxed mb-8 max-w-2xl">
            We are an artisanal e-commerce toy workshop blending sustainable biopolymers, kinetic engineering, and Montessori-inspired philosophy to create heirloom toys built to last for generations.
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              @click="$emit('view-range')"
              class="px-6 py-3 rounded-full bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Explore Our Range</span>
              <FlowbiteIcon name="arrow-right" size="16" stroke-width="2" />
            </button>
            <button
              type="button"
              @click="$emit('contact-us')"
              class="px-6 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Meet the Workshop</span>
            </button>
          </div>
        </div>

        <!-- High-Impact Key Metrics Bar -->
        <div class="mt-14 pt-10 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div class="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/60 backdrop-blur-xs">
            <div class="text-2xl sm:text-4xl font-bold text-[#F4EB6A]">10,000+</div>
            <div class="text-xs sm:text-sm text-neutral-400 mt-1">Heirloom Toys Delivered</div>
          </div>
          <div class="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/60 backdrop-blur-xs">
            <div class="text-2xl sm:text-4xl font-bold text-white">100%</div>
            <div class="text-xs sm:text-sm text-neutral-400 mt-1">Eco-Friendly &amp; Non-Toxic</div>
          </div>
          <div class="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/60 backdrop-blur-xs">
            <div class="text-2xl sm:text-4xl font-bold text-[#F4EB6A]">0.12mm</div>
            <div class="text-xs sm:text-sm text-neutral-400 mt-1">Precision-Crafted Detail</div>
          </div>
          <div class="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/60 backdrop-blur-xs">
            <div class="text-2xl sm:text-4xl font-bold text-white">4.9 / 5</div>
            <div class="text-xs sm:text-sm text-neutral-400 mt-1">Verified Parent Rating</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Origin Story Section: Two Columns (Narrative + Visual) -->
    <section class="py-16 sm:py-24 bg-white font-poppins">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <!-- Image Collage Container -->
          <div class="relative">
            <div class="rounded-3xl overflow-hidden aspect-4/3 shadow-2xl border border-neutral-100 bg-neutral-100">
              <img
                :src="useAsset('/images/promo-banner.jpg')"
                alt="Yellow Berry product design studio"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <!-- Floating Accent Badge -->
            <div class="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-neutral-100 max-w-xs hidden sm:block">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#FEFEEB] border border-[#F4EB6A] flex items-center justify-center text-neutral-900 shrink-0">
                  <FlowbiteIcon name="shield-check" size="20" stroke-width="2" class="text-amber-700" />
                </div>
                <div>
                  <div class="text-xs font-bold text-neutral-900">Zero Disposable Plastic</div>
                  <div class="text-[11px] text-neutral-500">Every piece crafted to endure a lifetime of joy.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Narrative Content -->
          <div class="space-y-6">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-700">How It Started</span>
              <h2 class="text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900 mt-2 leading-tight">
                Tired of toys that break in two days and sit in landfills forever.
              </h2>
            </div>

            <p class="text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
              Yellow Berry Store was born out of frustration. As designers and parents, we watched the toy industry churn out billions of flimsy, petroleum-based plastic gadgets—toys equipped with noisy electronic chips that hijack attention, only to end up shattered in the dustbin within a week.
            </p>

            <p class="text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
              We asked a foundational question: <strong class="text-neutral-900 font-semibold">What if a toy was treated like an heirloom piece of industrial kinetic art?</strong> What if everyday products were crafted without hazardous toxic components, finished with safe organic dyes, and engineered to spark endless imaginative wonder?
            </p>

            <p class="text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
              Today, from our workshop in South Africa, we combine state-of-the-art modern manufacturing with thoughtful design principles. Every item, rainbow stacker, and puzzle is made with care, precision, and passion.
            </p>

            <div class="pt-2 flex items-center gap-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-neutral-900 text-[#F4EB6A] font-bold text-sm flex items-center justify-center">
                  LM
                </div>
                <div>
                  <div class="text-sm font-semibold text-neutral-900">Laban M.</div>
                  <div class="text-xs text-neutral-500">Founder &amp; Chief Creative Engineer</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- The 4 Core Pillars of Yellow Berry Store -->
    <section class="py-16 sm:py-24 bg-neutral-50/50 border-y border-neutral-200/60 font-poppins">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-700">The Yellow Berry Standard</span>
          <h2 class="text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900 mt-2">
            Four promises in every piece we make
          </h2>
          <p class="text-sm sm:text-base text-neutral-500 mt-3 font-light leading-relaxed">
            We hold ourselves to higher standards than traditional toy manufacturers because we make toys for the children we love.
          </p>
        </div>

        <!-- 4-Card Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div class="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-[#F4EB6A] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-[#FEFEEB] border border-[#F4EB6A] text-neutral-900 flex items-center justify-center mb-6">
                <FlowbiteIcon name="sparkles" size="22" stroke-width="2" class="text-amber-700" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 mb-2">100% Sustainable Materials</h3>
              <p class="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
                Zero cheap, disposable plastics. Our components are crafted from sustainably sourced, non-toxic, and certified safe materials.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-neutral-100 text-xs font-semibold text-neutral-900 flex items-center gap-1">
              <span>Non-Toxic Certified</span>
              <FlowbiteIcon name="check" size="14" stroke-width="2.5" class="text-emerald-600" />
            </div>
          </div>

          <div class="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-[#F4EB6A] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-[#FEFEEB] border border-[#F4EB6A] text-neutral-900 flex items-center justify-center mb-6">
                <FlowbiteIcon name="shield-check" size="22" stroke-width="2" class="text-amber-700" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 mb-2">Precision Engineering</h3>
              <p class="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
                Our products feature seamless joints and smooth finishes with no hazardous sharp edges or loose pins that pose safety concerns.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-neutral-100 text-xs font-semibold text-neutral-900 flex items-center gap-1">
              <span>Toddler &amp; Child Safe</span>
              <FlowbiteIcon name="check" size="14" stroke-width="2.5" class="text-emerald-600" />
            </div>
          </div>

          <div class="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-[#F4EB6A] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-[#FEFEEB] border border-[#F4EB6A] text-neutral-900 flex items-center justify-center mb-6">
                <FlowbiteIcon name="heart" size="22" stroke-width="2" class="text-amber-700" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 mb-2">Montessori Tactility</h3>
              <p class="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
                Open-ended play pieces that stimulate tactile weight, spatial balance, and autonomous imagination instead of passive screen consumption.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-neutral-100 text-xs font-semibold text-neutral-900 flex items-center gap-1">
              <span>Mindful Child Development</span>
              <FlowbiteIcon name="check" size="14" stroke-width="2.5" class="text-emerald-600" />
            </div>
          </div>

          <div class="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-[#F4EB6A] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-[#FEFEEB] border border-[#F4EB6A] text-neutral-900 flex items-center justify-center mb-6">
                <FlowbiteIcon name="truck" size="22" stroke-width="2" class="text-amber-700" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 mb-2">Zero-Waste On-Demand</h3>
              <p class="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
                No overstocked warehouses or discarded clearance inventory. We manufacture with zero tooling waste and ship in 100% recyclable packaging.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-neutral-100 text-xs font-semibold text-neutral-900 flex items-center gap-1">
              <span>Eco-Conscious Footprint</span>
              <FlowbiteIcon name="check" size="14" stroke-width="2.5" class="text-emerald-600" />
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- How a Yellow Berry Toy is Born (Process Pipeline) -->
    <section class="py-16 sm:py-24 bg-white font-poppins">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div class="max-w-2xl">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-700">Behind the Machine</span>
            <h2 class="text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900 mt-2">
              From parametric CAD to your child’s hands
            </h2>
            <p class="text-sm sm:text-base text-neutral-500 mt-2 font-light">
              Step inside our digital craft pipeline. Here is how raw idea becomes kinetic heirloom reality.
            </p>
          </div>
          <button
            type="button"
            @click="$emit('view-range')"
            class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-900 hover:text-amber-800 transition-colors self-start lg:self-auto cursor-pointer"
          >
            <span>Browse finished collections</span>
            <FlowbiteIcon name="arrow-right" size="16" stroke-width="2" />
          </button>
        </div>

        <!-- 4 Process Steps -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          <div class="relative bg-neutral-50/70 p-6 rounded-3xl border border-neutral-200">
            <span class="text-4xl font-extrabold text-[#F4EB6A] font-mono block mb-3">01</span>
            <h3 class="text-base font-semibold text-neutral-900 mb-2">Design &amp; Prototyping</h3>
            <p class="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
              Every curve, dimension, and detail is meticulously modeled. We iterate dozens of digital simulations and physical prototypes to ensure supreme quality.
            </p>
          </div>

          <div class="relative bg-neutral-50/70 p-6 rounded-3xl border border-neutral-200">
            <span class="text-4xl font-extrabold text-[#F4EB6A] font-mono block mb-3">02</span>
            <h3 class="text-base font-semibold text-neutral-900 mb-2">Material Sourcing &amp; Selection</h3>
            <p class="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
              Only vetted, premium materials are selected. Pigments and finishes are thoroughly tested for endurance and everyday safety.
            </p>
          </div>

          <div class="relative bg-neutral-50/70 p-6 rounded-3xl border border-neutral-200">
            <span class="text-4xl font-extrabold text-[#F4EB6A] font-mono block mb-3">03</span>
            <h3 class="text-base font-semibold text-neutral-900 mb-2">Precision Manufacturing</h3>
            <p class="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
              Our specialized production equipment and crafters produce each item with high-precision tolerances and enduring craftsmanship.
            </p>
          </div>

          <div class="relative bg-neutral-50/70 p-6 rounded-3xl border border-neutral-200">
            <span class="text-4xl font-extrabold text-[#F4EB6A] font-mono block mb-3">04</span>
            <h3 class="text-base font-semibold text-neutral-900 mb-2">Drop Test &amp; Packaging</h3>
            <p class="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
              Every production batch undergoes a 1.5-meter hardwood drop test. Passed pieces are hand-inspected, wrapped in recyclable tissue, and boxed for delivery.
            </p>
          </div>

        </div>

      </div>
    </section>

    <!-- Meet The Team / Studio Makers -->
    <section class="py-16 sm:py-24 bg-neutral-900 text-white font-poppins">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-bold uppercase tracking-wider text-[#F4EB6A]">The Minds Behind The Makers</span>
          <h2 class="text-3xl sm:text-4xl font-medium tracking-tight text-white mt-2">
            Passionate designers, engineers &amp; educators
          </h2>
          <p class="text-sm sm:text-base text-neutral-400 mt-3 font-light leading-relaxed">
            Our team shares one obsession: making timeless play pieces that inspire curiosity and stand the test of time.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Maker 1 -->
          <div class="bg-neutral-800/70 p-6 rounded-3xl border border-neutral-700/80 flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-full bg-neutral-700 overflow-hidden mb-4 border-2 border-[#F4EB6A]">
              <img :src="useAsset('/images/user-icon.svg')" alt="Laban M." class="w-full h-full object-cover p-3 invert opacity-80" />
            </div>
            <h3 class="text-lg font-semibold text-white">Laban M.</h3>
            <div class="text-xs text-[#F4EB6A] font-medium mt-0.5">Founder &amp; Chief Creative Director</div>
            <p class="text-xs text-neutral-400 mt-3 font-light leading-relaxed">
              Industrial product designer obsessed with functional aesthetics, quality materials, and modern product design.
            </p>
          </div>

          <!-- Maker 2 -->
          <div class="bg-neutral-800/70 p-6 rounded-3xl border border-neutral-700/80 flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-full bg-neutral-700 overflow-hidden mb-4 border-2 border-neutral-600">
              <img :src="useAsset('/images/user-icon.svg')" alt="Elena Rostova" class="w-full h-full object-cover p-3 invert opacity-80" />
            </div>
            <h3 class="text-lg font-semibold text-white">Elena Rostova</h3>
            <div class="text-xs text-[#F4EB6A] font-medium mt-0.5">Sustainable Materials Engineer</div>
            <p class="text-xs text-neutral-400 mt-3 font-light leading-relaxed">
              Material chemist specializing in cornstarch-derived biopolymers, non-toxic pigment stability, and structural tensile strength.
            </p>
          </div>

          <!-- Maker 3 -->
          <div class="bg-neutral-800/70 p-6 rounded-3xl border border-neutral-700/80 flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-full bg-neutral-700 overflow-hidden mb-4 border-2 border-neutral-600">
              <img :src="useAsset('/images/user-icon.svg')" alt="Sarah Van Der Merwe" class="w-full h-full object-cover p-3 invert opacity-80" />
            </div>
            <h3 class="text-lg font-semibold text-white">Sarah Van Der Merwe</h3>
            <div class="text-xs text-[#F4EB6A] font-medium mt-0.5">Child Development &amp; Play Specialist</div>
            <p class="text-xs text-neutral-400 mt-3 font-light leading-relaxed">
              Early childhood educator passionate about Montessori open-ended exploration, sensory integration, and tactile spatial reasoning.
            </p>
          </div>

        </div>

      </div>
    </section>

    <!-- Customer Reviews / Community Trust Section -->
    <section class="py-16 sm:py-24 bg-white font-poppins">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-700">Real Parent Stories</span>
          <h2 class="text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900 mt-2">
            Why families love Yellow Berry
          </h2>
          <p class="text-sm text-neutral-500 mt-2">
            Read how our quality products, curated essentials, and playful designs enrich homes across the country.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div class="p-6 rounded-3xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between">
            <div>
              <div class="flex text-[#DEC02A] mb-3">
                <FlowbiteIcon v-for="s in 5" :key="s" name="star" size="14" :fill="true" />
              </div>
              <p class="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                "The Yellow Berry toy collection blew away all our expectations. The quality and craftsmanship are superb. My 4-year-old takes it everywhere."
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-neutral-900">David &amp; Liam K.</div>
                <div class="text-[11px] text-neutral-400">Cape Town &bull; Verified Purchase</div>
              </div>
              <span class="text-[10px] bg-[#FEFEEB] text-neutral-900 px-2 py-0.5 rounded-full border border-[#F4EB6A] font-semibold">
                Yellow Berry Originals
              </span>
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between">
            <div>
              <div class="flex text-[#DEC02A] mb-3">
                <FlowbiteIcon v-for="s in 5" :key="s" name="star" size="14" :fill="true" />
              </div>
              <p class="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                "Finally, an e-commerce toy store that cares about materials! The rainbow stacker feels substantial, smooth, and smells clean. Best birthday gift we've bought this year."
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-neutral-900">Annelize P.</div>
                <div class="text-[11px] text-neutral-400">Johannesburg &bull; Verified Purchase</div>
              </div>
              <span class="text-[10px] bg-[#FEFEEB] text-neutral-900 px-2 py-0.5 rounded-full border border-[#F4EB6A] font-semibold">
                Rainbow Stacker
              </span>
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between">
            <div>
              <div class="flex text-[#DEC02A] mb-3">
                <FlowbiteIcon v-for="s in 5" :key="s" name="star" size="14" :fill="true" />
              </div>
              <p class="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                "Customer support was incredibly kind when I asked for a custom color combination. Delivered safely in 2 days. Yellow Berry has earned a customer for life."
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-neutral-900">Marcus T.</div>
                <div class="text-[11px] text-neutral-400">Durban &bull; Verified Purchase</div>
              </div>
              <span class="text-[10px] bg-[#FEFEEB] text-neutral-900 px-2 py-0.5 rounded-full border border-[#F4EB6A] font-semibold">
                Custom Mech
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Bottom Storefront Reassurance Bar -->
    <section class="py-12 bg-neutral-50 border-t border-neutral-200/80 font-poppins">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <img :src="useAsset('/images/free-shipping-icon.svg')" alt="Free delivery" class="w-12 h-12 shrink-0" />
            <div>
              <div class="text-sm font-semibold text-neutral-900">Free Delivery</div>
              <div class="text-xs text-neutral-500">On all orders over R550</div>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <img :src="useAsset('/images/secure-payments-icon.svg')" alt="Secure payments" class="w-12 h-12 shrink-0" />
            <div>
              <div class="text-sm font-semibold text-neutral-900">100% Secure Checkout</div>
              <div class="text-xs text-neutral-500">PayFlex, Stripe &amp; Card</div>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <img :src="useAsset('/images/easy-returns-icon.svg')" alt="Easy returns" class="w-12 h-12 shrink-0" />
            <div>
              <div class="text-sm font-semibold text-neutral-900">30-Day Easy Returns</div>
              <div class="text-xs text-neutral-500">Hassle-free peace of mind</div>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <img :src="useAsset('/images/24-7-customer-support.svg')" alt="Dedicated support" class="w-12 h-12 shrink-0" />
            <div>
              <div class="text-sm font-semibold text-neutral-900">Maker Studio Support</div>
              <div class="text-xs text-neutral-500">Talk to real toy craftspeople</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final Call to Action -->
    <section class="py-16 sm:py-20 bg-neutral-900 text-white text-center font-poppins relative overflow-hidden">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <h2 class="text-3xl sm:text-5xl font-medium tracking-tight text-white mb-4">
          Ready to experience heirloom play?
        </h2>
        <p class="text-sm sm:text-base text-neutral-300 font-light max-w-xl mx-auto mb-8">
          Explore our collection of custom robots, Montessori arches, and brain games—each piece crafted with intention and made to be passed down.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            @click="$emit('view-range')"
            class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-900 font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer"
          >
            Shop All Collections
          </button>
          <button
            type="button"
            @click="$emit('contact-us')"
            class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            Contact Our Workshop
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import FlowbiteIcon from './FlowbiteIcon.vue'

defineEmits(['back-home', 'view-range', 'contact-us'])
</script>
