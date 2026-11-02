<template>
  <footer id="footer" class="bg-[#151515] text-white pt-16 pb-12 font-poppins border-t border-neutral-800">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
        <!-- Brand & About (Spans 2 cols) -->
        <div class="lg:col-span-2">
          <!-- Logo -->
          <a href="#" class="flex items-center group mb-4" aria-label="Ystore Home">
            <img
              :src="useAsset('/images/ystore-logo.svg')"
              alt="Ystore Logo"
              class="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </a>

          <p class="text-sm text-neutral-400 max-w-sm leading-relaxed mb-6 font-light">
            We bring ideas to life with high-quality, thoughtfully designed products. Crafted with precision and durable materials to brighten your everyday life.
          </p>

          <!-- Social Media Icons (Using provided SVGs) -->
          <div class="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full bg-neutral-800 hover:bg-[#F4EB6A] hover:brightness-105 flex items-center justify-center transition-all duration-200 group"
              aria-label="Facebook"
            >
              <img
                :src="useAsset('/images/ystore-facebook-icon.svg')"
                alt="Facebook"
                class="w-5 h-5 filter brightness-100 group-hover:brightness-0 transition-all"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full bg-neutral-800 hover:bg-[#F4EB6A] hover:brightness-105 flex items-center justify-center transition-all duration-200 group"
              aria-label="Instagram"
            >
              <img
                :src="useAsset('/images/ystore-instagram-icon.svg')"
                alt="Instagram"
                class="w-5 h-5 filter brightness-100 group-hover:brightness-0 transition-all"
              />
            </a>
          </div>
        </div>

        <!-- Links Column 1: Ystore -->
        <div>
          <h4 class="text-base font-semibold text-white tracking-wide mb-4">
            Ystore
          </h4>
          <ul class="space-y-2.5 text-sm text-neutral-400 font-light">
            <li><a href="#" @click.prevent="$emit('navigate-about')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">About us</a></li>
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Order history</a></li>
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Returns</a></li>
            <li><a href="#" @click.prevent="$emit('navigate-contact')" class="hover:text-[#F4EB6A] transition-colors">Custom Service</a></li>
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Terms &amp; Conditions</a></li>
          </ul>
        </div>

        <!-- Links Column 2: Help -->
        <div>
          <h4 class="text-base font-semibold text-white tracking-wide mb-4">
            Help
          </h4>
          <ul class="space-y-2.5 text-sm text-neutral-400 font-light">
            <li><a href="#" @click.prevent="$emit('navigate-contact')" class="hover:text-[#F4EB6A] transition-colors">Customer Support</a></li>
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Delivery Details</a></li>
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Terms &amp; Conditions</a></li>
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <!-- Links Column 3: FAQ -->
        <div>
          <h4 class="text-base font-semibold text-white tracking-wide mb-4">
            FAQ
          </h4>
          <ul class="space-y-2.5 text-sm text-neutral-400 font-light">
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Account</a></li>
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Manage Deliveries</a></li>
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Orders</a></li>
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Payments</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar: Copyright & Payment Badges -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-neutral-400 font-light">
          Copyright &copy; 2026 Ystore. All rights reserved.
        </p>

        <!-- Payment Badges (Using provided SVGs) -->
        <div class="flex items-center gap-3.5 flex-wrap justify-center">
          <div class="h-8 px-2.5 rounded bg-white/5 border border-neutral-800 flex items-center justify-center hover:bg-white/10 transition-colors">
            <img :src="useAsset('/images/ystore-visa-icon.svg')" alt="Visa" class="h-4 w-auto object-contain" />
          </div>
          <div class="h-8 px-2.5 rounded bg-white/5 border border-neutral-800 flex items-center justify-center hover:bg-white/10 transition-colors">
            <img :src="useAsset('/images/ystore-mastercard-icon.svg')" alt="Mastercard" class="h-4 w-auto object-contain" />
          </div>
          <div class="h-8 px-2.5 rounded bg-white/5 border border-neutral-800 flex items-center justify-center hover:bg-white/10 transition-colors">
            <img :src="useAsset('/images/ystore-stripe-icon.svg')" alt="Stripe" class="h-4 w-auto object-contain" />
          </div>
          <div class="h-8 px-2.5 rounded bg-white/5 border border-neutral-800 flex items-center justify-center hover:bg-white/10 transition-colors">
            <img :src="useAsset('/images/ystore-payflex-icon.svg')" alt="Payflex" class="h-4 w-auto object-contain" />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
