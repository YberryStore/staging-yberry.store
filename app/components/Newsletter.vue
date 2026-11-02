<template>
  <section class="py-14 sm:py-20 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded-3xl bg-neutral-100/90 border border-neutral-200/80 p-8 sm:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
        <!-- Left Content -->
        <div class="max-w-lg text-center lg:text-left">
          <span class="text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-500 mb-2 block">
            Never miss our deals
          </span>
          <h2 class="text-3xl sm:text-[40px] font-medium text-neutral-900 tracking-tight leading-tight">
            Subscribe
          </h2>
          <p class="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
            Get exclusive product drops, member-only discounts, and inspiring playroom ideas delivered straight to your inbox.
          </p>
        </div>

        <!-- Right Form -->
        <div class="w-full max-w-md">
          <form @submit.prevent="handleSubscribe" class="flex flex-col gap-3">
            <div class="relative flex items-center bg-white rounded-full p-1.5 border border-neutral-300 shadow-sm focus-within:border-[#F4EB6A] focus-within:ring-2 focus-within:ring-[#F4EB6A]/40 transition-all">
              <input
                v-model="email"
                type="email"
                required
                placeholder="Enter your email address..."
                class="w-full bg-transparent pl-4 pr-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                class="btn-primary !text-xs sm:!text-sm !py-2.5 !px-5 shrink-0"
              >
                <span>Subscribe</span>
              </button>
            </div>

            <!-- Agreement Checkbox -->
            <label class="flex items-start gap-2.5 text-xs text-neutral-500 cursor-pointer pl-2">
              <input
                v-model="agreed"
                type="checkbox"
                required
                class="mt-0.5 rounded text-[#F4EB6A] focus:ring-[#F4EB6A] border-neutral-300"
              />
              <span>I agree to receive promotional updates and news from Ystore. Unsubscribe anytime.</span>
            </label>

            <!-- Success notification -->
            <transition name="fade">
              <div
                v-if="subscribed"
                class="mt-2 p-3 rounded-xl bg-[#FEFEEB] border border-[#F4EB6A] text-[#423C27] text-xs font-medium flex items-center gap-2"
              >
                <FlowbiteIcon name="check" size="16" stroke-width="2" class="text-green-600 shrink-0" />
                <span>Thank you for subscribing! Check your inbox for a 10% welcome coupon.</span>
              </div>
            </transition>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'

const email = ref('')
const agreed = ref(true)
const subscribed = ref(false)

const handleSubscribe = () => {
  if (email.value) {
    subscribed.value = true
    email.value = ''
    setTimeout(() => {
      subscribed.value = false
    }, 5000)
  }
}
</script>
