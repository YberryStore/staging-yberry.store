<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop Blur & Darken -->
    <div
      class="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm transition-opacity"
      @click="handleClose"
    ></div>

    <!-- Modal Center Alignment Container -->
    <div class="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div
        class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden transform transition-all z-10"
        @click.stop
      >
        <!-- Top Sticky Header -->
        <div class="px-6 py-4 bg-white border-b border-neutral-100 flex items-center justify-between sticky top-0 z-20">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 text-[#F4EB6A] flex items-center justify-center shrink-0">
              <FlowbiteIcon name="shield-check" size="20" stroke-width="1.8" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base sm:text-lg font-bold text-neutral-900">
                  {{ orderConfirmed ? 'Order Confirmed' : 'Secure Checkout' }}
                </h3>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  256-Bit SSL Encrypted
                </span>
              </div>
              <p class="text-xs text-neutral-500">
                Yellow Berry Store • Cape Town, South Africa
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="handleClose"
            class="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center cursor-pointer transition-colors"
            title="Close Checkout"
          >
            <FlowbiteIcon name="close" size="16" stroke-width="2" />
          </button>
        </div>

        <!-- ORDER CONFIRMED VIEW (Step 2) -->
        <div v-if="orderConfirmed" class="p-6 sm:p-10 text-center space-y-6">
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-inner">
            ✓
          </div>

          <div class="space-y-1.5">
            <span class="text-xs uppercase tracking-wider font-extrabold text-[#9E7D0A] bg-[#FEFEEB] border border-[#F4EB6A] px-3 py-1 rounded-full">
              Order Received &amp; Processing
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-900 pt-2">
              Thank You, {{ confirmedOrder?.customerName || 'Shopper' }}!
            </h2>
            <p class="text-sm text-neutral-600 max-w-md mx-auto">
              Your order has been confirmed. A receipt and tracking notifications have been sent to
              <span class="font-semibold text-neutral-900">{{ confirmedOrder?.customerEmail }}</span>.
            </p>
          </div>

          <!-- Order Reference Card -->
          <div class="max-w-lg mx-auto p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-3">
            <div class="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span class="text-xs text-neutral-500">Order Number</span>
              <span class="font-mono text-sm font-bold text-neutral-900">#{{ confirmedOrder?.orderNumber }}</span>
            </div>
            <div class="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span class="text-xs text-neutral-500">Payment Method</span>
              <span class="text-xs font-semibold text-neutral-900">{{ confirmedOrder?.paymentMethod }}</span>
            </div>
            <div class="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span class="text-xs text-neutral-500">Total Paid</span>
              <span class="text-base font-extrabold text-emerald-700 font-mono">R{{ confirmedOrder?.total }}</span>
            </div>

            <!-- Manual EFT Instructions if applicable -->
            <div v-if="confirmedOrder?.paymentMethodId === 'eft'" class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5 mt-2">
              <span class="font-bold flex items-center gap-1.5">
                <span>🏦</span>
                <span>Bank Deposit / EFT Details:</span>
              </span>
              <p class="text-[11px] leading-relaxed">
                Bank: <strong class="font-semibold">First National Bank (FNB)</strong><br />
                Account Holder: <strong class="font-semibold">Yellow Berry Store (Pty) Ltd</strong><br />
                Account Number: <strong class="font-mono font-bold">62849102938</strong><br />
                Branch Code: <strong class="font-mono font-bold">250655</strong><br />
                Payment Reference: <strong class="font-mono font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-amber-300">#{{ confirmedOrder?.orderNumber }}</strong><br />
                Please email proof of payment (POP) to <strong class="underline">payments@yellowberry.store</strong>.
              </p>
            </div>
          </div>

          <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              @click="handleFinish"
              class="w-full sm:w-auto px-8 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-xs font-bold cursor-pointer transition-all shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        <!-- ACTIVE CHECKOUT FORM (Step 1) -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100 max-h-[82vh] overflow-y-auto">
          <!-- Left Column: Checkout Details Form (7 Cols) -->
          <form @submit.prevent="handlePlaceOrder" class="lg:col-span-7 p-6 sm:p-8 space-y-6">
            <!-- 1. Customer Information -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-neutral-900 text-[#F4EB6A] text-[11px] flex items-center justify-center font-bold">1</span>
                  <span>Contact Information</span>
                </h4>
                <button
                  v-if="!user"
                  type="button"
                  @click="$emit('require-auth')"
                  class="text-[11px] text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                >
                  Already have an account? Sign in
                </button>
                <span v-else class="text-[11px] text-emerald-700 font-medium">
                  Signed in as {{ user.email }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Email Address *</label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="you@domain.co.za"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Full Name *</label>
                  <input
                    v-model="form.fullName"
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Phone Number (For Delivery SMS) *</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    required
                    placeholder="e.g. 082 123 4567"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            <!-- 2. Delivery Method & Shipping Address -->
            <div class="space-y-3 pt-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-neutral-900 text-[#F4EB6A] text-[11px] flex items-center justify-center font-bold">2</span>
                <span>Delivery Method &amp; Shipping</span>
              </h4>

              <!-- Delivery Options -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <label
                  class="p-3 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all"
                  :class="form.deliveryMethod === 'standard' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <input type="radio" v-model="form.deliveryMethod" value="standard" class="sr-only" />
                  <div>
                    <span class="text-xs font-bold text-neutral-900 block">Standard Courier</span>
                    <span class="text-[10px] text-neutral-500 block">3 - 5 business days</span>
                  </div>
                  <span class="text-xs font-bold font-mono text-emerald-700 mt-2 block">
                    {{ subtotal >= 500 ? 'FREE' : 'R99' }}
                  </span>
                </label>

                <label
                  class="p-3 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all"
                  :class="form.deliveryMethod === 'express' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <input type="radio" v-model="form.deliveryMethod" value="express" class="sr-only" />
                  <div>
                    <span class="text-xs font-bold text-neutral-900 block">Express Courier</span>
                    <span class="text-[10px] text-neutral-500 block">1 - 2 business days</span>
                  </div>
                  <span class="text-xs font-bold font-mono text-neutral-900 mt-2 block">R150</span>
                </label>

                <label
                  class="p-3 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all"
                  :class="form.deliveryMethod === 'collection' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <input type="radio" v-model="form.deliveryMethod" value="collection" class="sr-only" />
                  <div>
                    <span class="text-xs font-bold text-neutral-900 block">Cape Town Studio</span>
                    <span class="text-[10px] text-neutral-500 block">Woodstock Pickup</span>
                  </div>
                  <span class="text-xs font-bold font-mono text-emerald-700 mt-2 block">FREE</span>
                </label>
              </div>

              <!-- Address Form (Hidden if Studio Collection) -->
              <div v-if="form.deliveryMethod !== 'collection'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div class="sm:col-span-2">
                  <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Street Address *</label>
                  <input
                    v-model="form.address"
                    type="text"
                    required
                    placeholder="e.g. 14 Kloof Street"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Apartment, suite, unit (Optional)</label>
                  <input
                    v-model="form.apartment"
                    type="text"
                    placeholder="e.g. Apt 4B"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-700 mb-1">City *</label>
                  <input
                    v-model="form.city"
                    type="text"
                    required
                    placeholder="e.g. Cape Town"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Province *</label>
                  <select
                    v-model="form.province"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-medium focus:outline-none focus:border-neutral-900"
                  >
                    <option value="Western Cape">Western Cape</option>
                    <option value="Gauteng">Gauteng</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Free State">Free State</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="North West">North West</option>
                    <option value="Northern Cape">Northern Cape</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Postal Code *</label>
                  <input
                    v-model="form.postalCode"
                    type="text"
                    required
                    placeholder="e.g. 8001"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
              <div v-else class="p-3.5 rounded-xl bg-neutral-100/80 border border-neutral-200 text-xs text-neutral-700 space-y-1">
                <span class="font-bold text-neutral-900 block">Studio Collection Address:</span>
                <p class="text-[11px] text-neutral-600">
                  Yellow Berry Store, Studio 4, The Palms Centre, 145 Sir Lowry Rd, Woodstock, Cape Town.<br />
                  You will receive an SMS and email notification when your package is packaged and ready for collection.
                </p>
              </div>
            </div>

            <!-- 3. Payment Method Selection -->
            <div class="space-y-3 pt-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-neutral-900 text-[#F4EB6A] text-[11px] flex items-center justify-center font-bold">3</span>
                <span>Payment Method</span>
              </h4>

              <div class="space-y-2">
                <!-- PayFast Option -->
                <label
                  v-if="availableGateways.payfast"
                  class="p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all"
                  :class="form.paymentMethod === 'payfast' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <div class="flex items-center gap-3">
                    <input type="radio" v-model="form.paymentMethod" value="payfast" class="accent-neutral-900" />
                    <div>
                      <span class="text-xs font-bold text-neutral-900 block">PayFast by Network</span>
                      <span class="text-[10px] text-neutral-500">Cards, Instant EFT, Capitec Pay, SnapScan, Zapper</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="text-[9px] font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Cards</span>
                    <span class="text-[9px] font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">EFT</span>
                  </div>
                </label>

                <!-- Yoco Option -->
                <label
                  v-if="availableGateways.yoco"
                  class="p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all"
                  :class="form.paymentMethod === 'yoco' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <div class="flex items-center gap-3">
                    <input type="radio" v-model="form.paymentMethod" value="yoco" class="accent-neutral-900" />
                    <div>
                      <span class="text-xs font-bold text-neutral-900 block">Yoco Payments</span>
                      <span class="text-[10px] text-neutral-500">Credit / Debit Card, Apple Pay &amp; Google Pay</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="text-[9px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Instant Card</span>
                  </div>
                </label>

                <!-- Ozow Option -->
                <label
                  v-if="availableGateways.ozow"
                  class="p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all"
                  :class="form.paymentMethod === 'ozow' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <div class="flex items-center gap-3">
                    <input type="radio" v-model="form.paymentMethod" value="ozow" class="accent-neutral-900" />
                    <div>
                      <span class="text-xs font-bold text-neutral-900 block">Ozow Instant EFT</span>
                      <span class="text-[10px] text-neutral-500">Fast bank transfer across all major SA banks</span>
                    </div>
                  </div>
                  <span class="text-[9px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Direct Bank</span>
                </label>

                <!-- Payflex Option -->
                <label
                  v-if="availableGateways.payflex"
                  class="p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all"
                  :class="form.paymentMethod === 'payflex' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <div class="flex items-center gap-3">
                    <input type="radio" v-model="form.paymentMethod" value="payflex" class="accent-neutral-900" />
                    <div>
                      <span class="text-xs font-bold text-neutral-900 block">Payflex (Pay in 4)</span>
                      <span class="text-[10px] text-neutral-500">
                        Pay 4 equal interest-free installments of R{{ (grandTotal / 4).toFixed(2) }}
                      </span>
                    </div>
                  </div>
                  <span class="text-[9px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">0% Interest</span>
                </label>

                <!-- Manual EFT Option -->
                <label
                  v-if="availableGateways.eft"
                  class="p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all"
                  :class="form.paymentMethod === 'eft' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <div class="flex items-center gap-3">
                    <input type="radio" v-model="form.paymentMethod" value="eft" class="accent-neutral-900" />
                    <div>
                      <span class="text-xs font-bold text-neutral-900 block">Manual EFT / Direct Bank Deposit</span>
                      <span class="text-[10px] text-neutral-500">Transfer directly into FNB account with order number reference</span>
                    </div>
                  </div>
                  <span class="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Manual POP</span>
                </label>

                <!-- Studio Pickup / Cash on Delivery Option -->
                <label
                  v-if="form.deliveryMethod === 'collection' && availableGateways.cod"
                  class="p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all"
                  :class="form.paymentMethod === 'cod' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <div class="flex items-center gap-3">
                    <input type="radio" v-model="form.paymentMethod" value="cod" class="accent-neutral-900" />
                    <div>
                      <span class="text-xs font-bold text-neutral-900 block">Pay on Collection</span>
                      <span class="text-[10px] text-neutral-500">Pay via card or cash when picking up at the Woodstock studio</span>
                    </div>
                  </div>
                  <span class="text-[9px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">Pickup</span>
                </label>
              </div>
            </div>

            <!-- 4. Order Notes (Optional) -->
            <div>
              <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Special Order Notes or Gift Message (Optional)</label>
              <textarea
                v-model="form.notes"
                rows="2"
                placeholder="e.g. Please leave at front desk or gift-wrap with a birthday card..."
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting || !cartItems.length"
              class="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-[#F4EB6A] text-sm font-bold cursor-pointer transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FlowbiteIcon v-if="isSubmitting" name="refresh" size="16" class="animate-spin" />
              <span>{{ isSubmitting ? 'Processing Order...' : `Place Order & Pay R${grandTotal}` }}</span>
            </button>
          </form>

          <!-- Right Column: Order Summary (5 Cols) -->
          <div class="lg:col-span-5 p-6 sm:p-8 bg-neutral-50/70 flex flex-col justify-between space-y-6">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-neutral-200">
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Order Summary ({{ cartItems.length }} item{{ cartItems.length > 1 ? 's' : '' }})
                </h4>
                <button
                  type="button"
                  @click="$emit('open-cart')"
                  class="text-[11px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                >
                  Edit Cart
                </button>
              </div>

              <!-- Cart Item List -->
              <div class="space-y-3 pt-3 max-h-60 overflow-y-auto pr-1">
                <div
                  v-for="item in cartItems"
                  :key="item.id"
                  class="flex items-center justify-between gap-3 text-xs"
                >
                  <div class="flex items-center gap-3">
                    <div class="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-neutral-200 shrink-0">
                      <img :src="item.image || '/images/prod-robot.jpg'" :alt="item.name" class="w-full h-full object-cover" />
                      <span class="absolute top-0 right-0 bg-neutral-900 text-[#F4EB6A] text-[9px] font-bold px-1.5 py-0.2 rounded-bl-lg">
                        x{{ item.qty }}
                      </span>
                    </div>
                    <div class="truncate">
                      <span class="font-bold text-neutral-900 block truncate">{{ item.name }}</span>
                      <span class="text-[10px] text-neutral-400 font-mono">R{{ item.price }} each</span>
                    </div>
                  </div>
                  <span class="font-bold text-neutral-900 font-mono shrink-0">
                    R{{ item.price * item.qty }}
                  </span>
                </div>
              </div>

              <!-- Coupon Code Input -->
              <div class="pt-4 mt-4 border-t border-neutral-200">
                <div class="flex items-center gap-2">
                  <input
                    v-model="couponInput"
                    type="text"
                    placeholder="Coupon / Promo code"
                    class="flex-1 px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    @click="applyCoupon"
                    class="px-3.5 py-2 rounded-xl bg-neutral-900 text-[#F4EB6A] text-xs font-semibold hover:bg-neutral-800 cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
                <div v-if="appliedCoupon" class="mt-2 flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                  <span class="font-bold font-mono">✓ Coupon "{{ appliedCoupon.code }}" Applied</span>
                  <button type="button" @click="removeCoupon" class="text-neutral-400 hover:text-red-600 cursor-pointer text-xs">✕</button>
                </div>
              </div>

              <!-- Calculations Breakdown -->
              <div class="pt-4 mt-4 border-t border-neutral-200 space-y-2 text-xs">
                <div class="flex items-center justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span class="font-mono font-medium text-neutral-900">R{{ subtotal }}</span>
                </div>

                <div v-if="discountAmount > 0" class="flex items-center justify-between text-emerald-700">
                  <span>Discount ({{ appliedCoupon?.discount }}%)</span>
                  <span class="font-mono font-bold">-R{{ discountAmount }}</span>
                </div>

                <div class="flex items-center justify-between text-neutral-600">
                  <span>Shipping ({{ form.deliveryMethod === 'collection' ? 'Cape Town Studio' : (form.deliveryMethod === 'express' ? 'Express' : 'Standard') }})</span>
                  <span class="font-mono font-medium" :class="shippingFee === 0 ? 'text-emerald-700 font-bold' : 'text-neutral-900'">
                    {{ shippingFee === 0 ? 'FREE' : `R${shippingFee}` }}
                  </span>
                </div>

                <div class="flex items-center justify-between text-neutral-400 text-[11px] pt-1">
                  <span>Includes 15% South African VAT</span>
                  <span class="font-mono">R{{ vatAmount }}</span>
                </div>

                <div class="pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span class="text-sm font-bold text-neutral-900">Total (ZAR)</span>
                  <span class="text-xl font-extrabold text-neutral-900 font-mono">
                    R{{ grandTotal }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Trust Badges & Guarantee -->
            <div class="pt-4 border-t border-neutral-200 text-center space-y-2">
              <div class="flex items-center justify-center gap-4 text-neutral-400">
                <FlowbiteIcon name="shield-check" size="18" />
                <FlowbiteIcon name="truck" size="18" />
                <FlowbiteIcon name="lock" size="18" />
              </div>
              <p class="text-[10px] text-neutral-400 leading-tight">
                All transactions are encrypted and processed through South African certified PCI-DSS payment gateways.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useStoreContent } from '../composables/useStoreContent'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  cartItems: {
    type: Array,
    default: () => []
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'order-placed', 'open-cart', 'require-auth'])

const {
  createOrder,
  discounts,
  paymentSettings
} = useStoreContent()

const isSubmitting = ref(false)
const orderConfirmed = ref(false)
const confirmedOrder = ref(null)

const couponInput = ref('')
const appliedCoupon = ref(null)

const form = ref({
  email: '',
  fullName: '',
  phone: '',
  address: '',
  apartment: '',
  city: 'Cape Town',
  province: 'Western Cape',
  postalCode: '8001',
  deliveryMethod: 'standard', // 'standard' | 'express' | 'collection'
  paymentMethod: 'payfast', // 'payfast' | 'yoco' | 'ozow' | 'payflex' | 'eft' | 'cod'
  notes: ''
})

// Populate user info when available
watch(
  () => props.user,
  (u) => {
    if (u) {
      if (!form.value.email) form.value.email = u.email || ''
      if (!form.value.fullName) form.value.fullName = u.displayName || ''
    }
  },
  { immediate: true }
)

// Reset form when modal opens
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      orderConfirmed.value = false
      confirmedOrder.value = null
      if (props.user) {
        form.value.email = props.user.email || ''
        form.value.fullName = props.user.displayName || ''
      }
    }
  }
)

// Active Gateways from store payment settings
const availableGateways = computed(() => {
  const g = paymentSettings.value?.gateways
  return {
    payfast: g?.payfast?.enabled !== false,
    yoco: g?.yoco?.enabled !== false,
    ozow: g?.ozow?.enabled !== false,
    payflex: g?.payflex?.enabled !== false,
    eft: g?.eft?.enabled !== false,
    cod: g?.cod?.enabled !== false
  }
})

// Subtotal calculation
const subtotal = computed(() => {
  return props.cartItems.reduce((acc, curr) => acc + (Number(curr.price) || 0) * (Number(curr.qty) || 1), 0)
})

// Discount calculation
const discountAmount = computed(() => {
  if (!appliedCoupon.value || !appliedCoupon.value.discount) return 0
  const pct = Number(appliedCoupon.value.discount) || 0
  return Math.round((subtotal.value * pct) / 100)
})

// Shipping fee
const shippingFee = computed(() => {
  if (form.value.deliveryMethod === 'collection') return 0
  if (form.value.deliveryMethod === 'express') return 150
  return subtotal.value >= 500 ? 0 : 99
})

// Grand Total
const grandTotal = computed(() => {
  return Math.max(0, subtotal.value - discountAmount.value + shippingFee.value)
})

// 15% VAT breakdown (included in total)
const vatAmount = computed(() => {
  return Math.round((grandTotal.value * 0.15) / 1.15)
})

// Coupon application
const applyCoupon = () => {
  const code = couponInput.value.trim().toUpperCase()
  if (!code) return
  const match = (discounts.value || []).find((d) => (d.code || '').toUpperCase() === code)
  if (match) {
    appliedCoupon.value = match
    couponInput.value = ''
  } else {
    alert(`Coupon code "${code}" not found or expired.`)
  }
}

const removeCoupon = () => {
  appliedCoupon.value = null
}

// Payment method display names
const getPaymentMethodTitle = (key) => {
  switch (key) {
    case 'payfast':
      return 'PayFast by Network (Credit/Debit Card & Instant EFT)'
    case 'yoco':
      return 'Yoco Payments (Cards & Apple Pay)'
    case 'ozow':
      return 'Ozow Instant EFT'
    case 'payflex':
      return 'Payflex (Buy Now Pay Later)'
    case 'eft':
      return 'Manual EFT / Direct Bank Deposit'
    case 'cod':
      return 'Pay on Collection (Cape Town Studio)'
    default:
      return 'Online Payment'
  }
}

// Order submission
const handlePlaceOrder = async () => {
  if (!props.cartItems.length) return
  if (!form.value.email.trim() || !form.value.fullName.trim()) {
    alert('Please enter your contact details (Email and Full Name).')
    return
  }

  isSubmitting.value = true
  try {
    const orderNumber = `YBS-${Math.floor(100000 + Math.random() * 900000)}`
    const orderPayload = {
      orderNumber,
      customerName: form.value.fullName.trim(),
      customerEmail: form.value.email.trim(),
      customerPhone: form.value.phone.trim(),
      shippingAddress:
        form.value.deliveryMethod === 'collection'
          ? {
              type: 'Studio Collection',
              address: 'Studio 4, The Palms Centre, 145 Sir Lowry Rd, Woodstock, Cape Town'
            }
          : {
              street: form.value.address.trim(),
              apartment: form.value.apartment.trim(),
              city: form.value.city.trim(),
              province: form.value.province.trim(),
              postalCode: form.value.postalCode.trim()
            },
      deliveryMethod: form.value.deliveryMethod,
      shippingFee: shippingFee.value,
      paymentMethod: getPaymentMethodTitle(form.value.paymentMethod),
      paymentMethodId: form.value.paymentMethod,
      paymentStatus:
        form.value.paymentMethod === 'eft'
          ? 'Pending Proof of Payment (POP)'
          : form.value.paymentMethod === 'cod'
            ? 'Due Upon Collection'
            : 'Paid (Simulated Live/Test)',
      items: props.cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        qty: Number(item.qty),
        image: item.image || ''
      })),
      subtotal: subtotal.value,
      discountCode: appliedCoupon.value?.code || null,
      discountAmount: discountAmount.value,
      vatAmount: vatAmount.value,
      total: grandTotal.value,
      status: 'Processing',
      notes: form.value.notes.trim(),
      userId: props.user?.uid || 'guest'
    }

    const orderId = await createOrder(orderPayload)
    confirmedOrder.value = { ...orderPayload, id: orderId }
    orderConfirmed.value = true

    emit('order-placed', confirmedOrder.value)
  } catch (err) {
    alert(err.message || 'Failed to complete order. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  emit('close')
}

const handleFinish = () => {
  orderConfirmed.value = false
  confirmedOrder.value = null
  emit('close')
}
</script>

