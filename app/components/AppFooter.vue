<template>
  <footer id="footer" class="bg-[#151515] text-white pt-16 pb-12 font-poppins border-t border-neutral-800">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
        <!-- Brand & About (Spans 2 cols) -->
        <div class="lg:col-span-2">
          <!-- Logo -->
          <a href="#" @click.prevent="$emit('navigate-home')" class="flex items-center group mb-4" aria-label="Ystore Home">
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
            <li><a href="#" @click.prevent="$emit('navigate-specials')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Specials &amp; Deals</a></li>
            <li><a href="#" @click.prevent="$emit('navigate-blog')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Blog &amp; Stories</a></li>
            <li><a href="#" @click.prevent="$emit('navigate-terms')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Returns &amp; Refunds</a></li>
            <li><a href="#" @click.prevent="$emit('navigate-contact')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Custom Service</a></li>
          </ul>
        </div>

        <!-- Links Column 2: Help & Legal -->
        <div>
          <h4 class="text-base font-semibold text-white tracking-wide mb-4">
            Help &amp; Legal
          </h4>
          <ul class="space-y-2.5 text-sm text-neutral-400 font-light">
            <li><a href="#" @click.prevent="$emit('navigate-contact')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Customer Support</a></li>
            <li><a href="#" @click.prevent="$emit('navigate-terms')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Delivery &amp; Shipping</a></li>
            <li><a href="#" @click.prevent="$emit('navigate-terms')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Terms &amp; Conditions</a></li>
            <li><a href="#" @click.prevent="$emit('navigate-privacy')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Privacy Policy</a></li>
            <li><a href="#" @click.prevent="$emit('navigate-cookies')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Cookie Policy</a></li>
            <li><button type="button" @click="openPreferencesModal" class="hover:text-[#F4EB6A] transition-colors cursor-pointer text-left">Cookie Preferences</button></li>
          </ul>
        </div>

        <!-- Links Column 3: FAQ -->
        <div>
          <h4 class="text-base font-semibold text-white tracking-wide mb-4">
            FAQ
          </h4>
          <ul class="space-y-2.5 text-sm text-neutral-400 font-light">
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Account</a></li>
            <li><a href="#" @click.prevent="$emit('navigate-terms')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Manage Deliveries</a></li>
            <li><a href="#" class="hover:text-[#F4EB6A] transition-colors">Orders</a></li>
            <li><a href="#" @click.prevent="$emit('navigate-terms')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Payments</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar: Copyright & Payment Badges -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 text-xs text-neutral-400 font-light flex-wrap">
          <p>Copyright &copy; 2026 Ystore. All rights reserved.</p>
          <span class="text-neutral-600 hidden sm:inline">&bull;</span>
          <button type="button" @click="$emit('navigate-privacy')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Privacy Policy</button>
          <span class="text-neutral-600">&bull;</span>
          <button type="button" @click="$emit('navigate-terms')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Terms &amp; Conditions</button>
          <span class="text-neutral-600">&bull;</span>
          <button type="button" @click="$emit('navigate-cookies')" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Cookie Policy</button>
          <span class="text-neutral-600">&bull;</span>
          <button type="button" @click="openPreferencesModal" class="hover:text-[#F4EB6A] transition-colors cursor-pointer">Cookie Preferences</button>
        </div>

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

<script setup>
import { useCookieConsent } from '../composables/useCookieConsent'

const { openPreferencesModal } = useCookieConsent()

defineEmits([
  'navigate-home',
  'navigate-about',
  'navigate-specials',
  'navigate-blog',
  'navigate-contact',
  'navigate-privacy',
  'navigate-terms',
  'navigate-cookies'
])
</script>
