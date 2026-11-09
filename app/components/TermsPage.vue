<template>
  <div class="w-full bg-[#FAFAFA] font-poppins min-h-screen py-10 sm:py-14">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <!-- Breadcrumb & Top Bar -->
      <nav class="flex items-center justify-between text-xs sm:text-sm text-neutral-500 font-medium pb-2 border-b border-neutral-200/80">
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="$emit('back-home')"
            class="hover:text-neutral-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FlowbiteIcon name="home" size="14" stroke-width="1.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span class="text-neutral-900 font-semibold">Terms &amp; Conditions</span>
        </div>

        <button
          type="button"
          @click="$emit('back-home')"
          class="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <FlowbiteIcon name="arrow-left" size="14" stroke-width="2" />
          <span>Back to storefront</span>
        </button>
      </nav>

      <!-- Main Document Card -->
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-neutral-200/90 shadow-sm space-y-10 text-neutral-800">
        <!-- Header -->
        <header class="border-b border-neutral-100 pb-8 space-y-3">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#F4EB6A] shadow-xs"></span>
            <span class="text-xs uppercase tracking-widest font-bold text-neutral-900">
              Customer Agreement &amp; Storefront Code
            </span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-bold text-neutral-900 tracking-tight leading-tight">
            Terms &amp; Conditions of Storefront Service
          </h1>

          <p class="text-xs text-neutral-500 font-light">
            Effective Date: November 1, 2026 &bull; Published by Yellow Berry Store &bull; Governed by the Laws of the Republic of South Africa
          </p>
        </header>

        <!-- Preamble Callout -->
        <div class="bg-neutral-900 text-white p-6 sm:p-7 rounded-2xl border border-neutral-800 space-y-2 relative overflow-hidden">
          <div class="absolute right-0 top-0 w-32 h-32 bg-[#F4EB6A]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#F4EB6A]">
            <FlowbiteIcon name="shield-check" size="16" />
            <span>Binding Consumer Agreement</span>
          </div>
          <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            Please read these Terms and Conditions carefully before browsing, ordering, or purchasing products from Yellow Berry Store. By accessing our catalog, registering an account, or placing an order, you agree to be bound by these Terms and our Privacy Policy.
          </p>
        </div>

        <!-- Section 1: Acceptance & Eligibility -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">1. Acceptance &amp; Eligibility</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            By utilizing the Yellow Berry Store storefront, you represent and warrant that you are at least 18 years of age or possess legal parental/guardian authorization, and hold the requisite legal capacity to enter into a binding contract under South African law. If you do not agree to all provisions contained herein, you must cease using this platform immediately.
          </p>
        </section>

        <!-- Section 2: Intellectual Property -->
        <section class="space-y-4">
          <h2 class="text-xl font-bold text-neutral-900">2. Intellectual Property, Copyright &amp; Catalog Assets</h2>
          <div class="space-y-3 text-sm text-neutral-700 leading-relaxed font-light">
            <p>
              <strong>A. Proprietary Ownership:</strong> All original product designs, 3D modeled figures, brand trademarks, photographic assets, text descriptions, logos, and software code comprising Yellow Berry Store are the exclusive intellectual property of Yellow Berry Store, protected under the <strong>South African Copyright Act (Act 98 of 1978)</strong>, the Trade Marks Act (Act 194 of 1993), and international conventions.
            </p>
            <p>
              <strong>B. Limited License:</strong> You are granted a limited, non-transferable, revocable license to access our storefront for personal, non-commercial shopping purposes. Any commercial reproduction, scraping, reverse engineering, or redistribution of our product media or 3D files without prior written approval is strictly prohibited.
            </p>
          </div>
        </section>

        <!-- Section 3: Product Descriptions & Safety Warnings -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">3. Product Descriptions, Toy Safety &amp; Age Grading</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            We take exceptional pride in craftsmanship, sustainable biopolymers, and kinetic durability. However, parents and guardians must observe the following:
          </p>
          <ul class="list-disc pl-5 text-sm text-neutral-700 space-y-1.5 leading-relaxed font-light">
            <li><strong>Age Suitability &amp; Small Parts:</strong> Certain collectibles and miniature figures contain small parts and are strictly not intended for infants or children under 3 years of age due to potential choking hazards. Always review individual product safety labels.</li>
            <li><strong>Biopolymer &amp; Material Care:</strong> Our sustainable toys are made with non-toxic, eco-conscious materials. Avoid exposing delicate mechanical items to extreme thermal heat or aggressive chemical solvents.</li>
            <li><strong>Color Calibration:</strong> While we render high-resolution product photography, slight color variances may arise due to customer display monitor profiles and natural batch pigment blending.</li>
          </ul>
        </section>

        <!-- Section 4: Pricing, Currency & Orders -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">4. Pricing, Currency &amp; Order Acceptance</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            All prices displayed on Yellow Berry Store are quoted in <strong>South African Rand (ZAR / R)</strong>. While we strive for absolute accuracy, typographical pricing errors may occasionally occur. Yellow Berry Store reserves the right to cancel or adjust orders placed for items listed at an incorrect price due to technical glitches, issuing an immediate refund for any charged amount.
          </p>
        </section>

        <!-- Section 5: Secure Checkout & Payments -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">5. Secure Checkout &amp; Payment Terms</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            Payment must be completed in full before order dispatch. We support trusted payment gateways:
          </p>
          <ul class="list-disc pl-5 text-sm text-neutral-700 space-y-1.5 leading-relaxed font-light">
            <li><strong>Card &amp; Digital Payments:</strong> Visa, Mastercard, and Stripe with 3D Secure verification.</li>
            <li><strong>Payflex:</strong> Buy Now, Pay Later in 4 equal interest-free installments for qualified South African customers.</li>
            <li><strong>Payment Security:</strong> Card transactions are end-to-end encrypted; our servers never store raw card numbers or security CVV digits.</li>
          </ul>
        </section>

        <!-- Section 6: Delivery & Courier Logistics -->
        <section class="space-y-3 bg-neutral-50 p-6 sm:p-7 rounded-2xl border border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">6. Shipping, Delivery Thresholds &amp; Courier Logistics</h2>
          <div class="space-y-2 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
            <p>
              <strong>A. Delivery Across South Africa:</strong> We deliver nationwide via reputable courier partners directly to your residential or business address. Standard courier transit typically takes 2 to 5 business days depending on location.
            </p>
            <p>
              <strong>B. Free Shipping Policy:</strong> Orders exceeding <strong>R500.00</strong> qualify for 100% Free Standard Delivery across major South African metropolitan areas.
            </p>
            <p>
              <strong>C. Risk of Loss:</strong> Title and risk of loss pass to the customer upon verified courier delivery scan at the provided shipping address.
            </p>
          </div>
        </section>

        <!-- Section 7: Returns & Refunds Policy -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">7. 30-Day Easy Returns &amp; Refunds Policy</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            In accordance with the <strong>Consumer Protection Act (Act No. 68 of 2008)</strong>:
          </p>
          <ul class="list-disc pl-5 text-sm text-neutral-700 space-y-1.5 leading-relaxed font-light">
            <li><strong>30-Day Window:</strong> You may initiate a return within thirty (30) days of receiving your order if you are dissatisfied with your purchase.</li>
            <li><strong>Condition:</strong> Returned toys must be undamaged, unplayed, and in their original packaging with all accessories and instructions included.</li>
            <li><strong>Defects &amp; Warranty:</strong> If an item arrives with a confirmed manufacturing defect, Yellow Berry Store will cover collection courier fees and issue an immediate replacement or full refund.</li>
            <li><strong>Refund Method:</strong> Refunds are processed back to the original payment method (Payflex, Card, or Stripe) within 5 to 7 business days following inspection.</li>
          </ul>
        </section>

        <!-- Section 8: Storefront Security & Prohibited Conduct -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">8. Prohibited Conduct &amp; Platform Security</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            Users are strictly prohibited from:
          </p>
          <ul class="list-disc pl-5 text-sm text-neutral-700 space-y-1.5 leading-relaxed font-light">
            <li>Attempting unauthorized access to CMS administrative terminals, Firebase datastores, or employee accounts.</li>
            <li>Conducting automated credential brute-force attacks, DDoS stress tests, or injecting malicious payloads.</li>
            <li>Exploiting promotional discount codes through fraudulent multi-account generation.</li>
          </ul>
        </section>

        <!-- Section 9: Governing Law & Jurisdiction -->
        <section class="space-y-3 bg-neutral-50 p-6 sm:p-7 rounded-2xl border border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">9. Governing Law &amp; Jurisdiction</h2>
          <p class="text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
            These Terms and Conditions are governed by and construed in accordance with the substantive laws of the <strong>Republic of South Africa</strong>. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of the <strong>Republic of South Africa</strong>.
          </p>
        </section>

        <!-- Section 10: Amendments & Customer Support -->
        <section class="space-y-3 border-t border-neutral-100 pt-8">
          <h2 class="text-xl font-bold text-neutral-900">10. Modifications &amp; Customer Support Desk</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            We reserve the right to revise these Terms periodically. For questions or support concerning an order or return:
          </p>
          <div class="text-sm text-neutral-800 space-y-1 pt-1 font-light">
            <p><strong>Customer Support:</strong> <a href="mailto:support@yellowberry.store" class="text-neutral-900 font-medium underline">support@yellowberry.store</a></p>
            <p><strong>Legal &amp; Business:</strong> <a href="mailto:admin@yellowberry.store" class="text-neutral-900 font-medium underline">admin@yellowberry.store</a></p>
            <p><strong>Support Desk:</strong> <button type="button" @click="$emit('navigate-contact')" class="text-neutral-900 underline font-medium cursor-pointer">Contact Our Team</button></p>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup>
import FlowbiteIcon from './FlowbiteIcon.vue'

defineEmits(['back-home', 'navigate-contact'])
</script>

