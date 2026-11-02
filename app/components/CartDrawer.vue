<template>
  <div>
    <!-- Backdrop -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
        @click="$emit('close')"
      ></div>
    </transition>

    <!-- Slide-over Drawer -->
    <transition name="slide">
      <div
        v-if="isOpen"
        class="fixed inset-y-0 right-0 max-w-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col font-poppins"
      >
        <!-- Header -->
        <div class="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div class="flex items-center gap-2">
            <FlowbiteIcon name="cart" size="20" stroke-width="1.5" />
            <h3 class="text-lg font-medium text-neutral-900">
              Shopping Cart ({{ totalCount }})
            </h3>
          </div>
          <button
            type="button"
            @click="$emit('close')"
            class="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <FlowbiteIcon name="close" size="20" stroke-width="1.5" />
          </button>
        </div>

        <!-- Free Delivery Progress Bar -->
        <div class="px-5 py-3 bg-[#FEFEEB] border-b border-[#F4EB6A]/50 text-xs text-neutral-800">
          <div class="flex items-center justify-between mb-1.5 font-medium">
            <span v-if="subtotal >= 500" class="text-green-700 font-semibold flex items-center gap-1">
              <FlowbiteIcon name="check" size="14" stroke-width="2" />
              You qualify for FREE Delivery!
            </span>
            <span v-else>
              Add <span class="font-bold text-neutral-900">R{{ 500 - subtotal }}</span> more for FREE Delivery!
            </span>
            <span>R{{ subtotal }} / R500</span>
          </div>
          <div class="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
            <div
              class="bg-[#F4EB6A] h-1.5 rounded-full transition-all duration-300"
              :style="{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- Items List -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          <div
            v-if="items.length === 0"
            class="py-16 text-center text-neutral-400 flex flex-col items-center justify-center"
          >
            <div class="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
              <FlowbiteIcon name="cart" size="30" stroke-width="1.5" />
            </div>
            <p class="text-base font-medium text-neutral-700">Your cart is currently empty</p>
            <p class="text-xs text-neutral-400 mt-1">Explore our catalog and find joyful toys!</p>
            <button
              type="button"
              @click="$emit('close')"
              class="btn-primary mt-6 !text-xs !py-2 !px-6"
            >
              Start Shopping
            </button>
          </div>

          <div
            v-for="item in items"
            :key="item.id"
            class="flex items-center gap-4 p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors bg-white shadow-2xs"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-18 h-18 rounded-lg object-cover bg-neutral-100 shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-neutral-900 truncate">
                {{ item.name }}
              </h4>
              <p class="text-xs font-semibold text-neutral-900 mt-0.5">
                R{{ item.price }}
              </p>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-3 mt-2">
                <div class="flex items-center border border-neutral-200 rounded-full bg-neutral-50 px-2 py-0.5 text-xs">
                  <button
                    type="button"
                    @click="$emit('update-qty', { id: item.id, qty: item.qty - 1 })"
                    class="px-1.5 py-0.5 text-neutral-600 hover:text-black font-bold"
                  >
                    -
                  </button>
                  <span class="px-2 font-semibold text-neutral-800">{{ item.qty }}</span>
                  <button
                    type="button"
                    @click="$emit('update-qty', { id: item.id, qty: item.qty + 1 })"
                    class="px-1.5 py-0.5 text-neutral-600 hover:text-black font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  @click="$emit('remove-item', item.id)"
                  class="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer / Checkout Area -->
        <div v-if="items.length > 0" class="p-5 border-t border-neutral-100 bg-neutral-50/50 space-y-4">
          <div class="space-y-1.5 text-sm">
            <div class="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span class="font-medium text-neutral-900">R{{ subtotal }}</span>
            </div>
            <div class="flex justify-between text-neutral-500">
              <span>Estimated Shipping</span>
              <span class="font-medium text-neutral-900">{{ subtotal >= 500 ? 'FREE' : 'R65' }}</span>
            </div>
            <div class="flex justify-between text-base font-semibold text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Total</span>
              <span class="text-lg">R{{ subtotal >= 500 ? subtotal : subtotal + 65 }}</span>
            </div>
          </div>

          <button
            type="button"
            class="btn-primary w-full !py-3.5 !text-base shadow-md font-semibold justify-center cursor-pointer"
            @click="checkout"
          >
            Proceed to Checkout
          </button>

          <p class="text-[11px] text-center text-neutral-400">
            Secure checkout powered by Visa, Mastercard, Stripe &amp; Payflex
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'update-qty', 'remove-item', 'require-auth', 'checkout-complete', 'start-checkout'])

const totalCount = computed(() => {
  return props.items.reduce((acc, curr) => acc + curr.qty, 0)
})

const subtotal = computed(() => {
  return props.items.reduce((acc, curr) => acc + curr.price * curr.qty, 0)
})

const checkout = () => {
  emit('start-checkout')
  emit('checkout-complete')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
