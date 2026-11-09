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
          <span class="text-neutral-900 font-semibold">Privacy Policy</span>
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

      <!-- Main Legal Document Card -->
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-neutral-200/90 shadow-sm space-y-10 text-neutral-800">
        <!-- Document Header -->
        <header class="border-b border-neutral-100 pb-8 space-y-3">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#F4EB6A] shadow-xs"></span>
            <span class="text-xs uppercase tracking-widest font-bold text-neutral-900">
              Legal &amp; Regulatory Compliance
            </span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-bold text-neutral-900 tracking-tight leading-tight">
            Privacy Policy &amp; POPIA Act Compliance Statement
          </h1>

          <p class="text-xs text-neutral-500 font-light">
            Effective Date: November 1, 2026 &bull; Compliant with the South African Protection of Personal Information Act (POPIA Act No. 4 of 2013) &bull; Published by Yellow Berry Store
          </p>
        </header>

        <!-- Executive Commitment Callout -->
        <div class="bg-neutral-900 text-white p-6 sm:p-7 rounded-2xl border border-neutral-800 space-y-2 relative overflow-hidden">
          <div class="absolute right-0 top-0 w-32 h-32 bg-[#F4EB6A]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#F4EB6A]">
            <FlowbiteIcon name="shield-check" size="16" />
            <span>Executive Privacy Commitment</span>
          </div>
          <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            Yellow Berry Store is committed to upholding the privacy, confidentiality, and security of every customer and visitor. This policy explains how we collect, use, store, and protect your personal information in strict compliance with the <strong>South African Protection of Personal Information Act (POPIA Act No. 4 of 2013)</strong> and the <strong>Promotion of Access to Information Act (PAIA Act No. 2 of 2000)</strong>.
          </p>
        </div>

        <!-- Section 1: Responsible Party -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">1. Data Controller &amp; Responsible Party</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            The responsible party determining the lawful purpose and means of personal data processing for this e-commerce storefront is:
          </p>
          <div class="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 text-xs sm:text-sm text-neutral-800 space-y-1">
            <p class="font-bold text-neutral-900">Yellow Berry Store (Pty) Ltd</p>
            <p class="text-neutral-600">Artisanal Toy &amp; Creative Studio</p>
            <p>General Support: <a href="mailto:support@yellowberry.store" class="text-neutral-900 font-medium underline hover:text-amber-700">support@yellowberry.store</a></p>
            <p>Information Officer: <a href="mailto:admin@yellowberry.store" class="text-neutral-900 font-medium underline hover:text-amber-700">admin@yellowberry.store</a></p>
          </div>
        </section>

        <!-- Section 2: Categories of Data -->
        <section class="space-y-4">
          <h2 class="text-xl font-bold text-neutral-900">2. Categories of Information We Collect</h2>
          <div class="space-y-3 text-sm text-neutral-700 leading-relaxed font-light">
            <p>
              <strong>A. Customer Order &amp; Delivery Information:</strong> When you purchase toys, figures, or collectibles through our store, we collect your full legal name, delivery address, postal code, phone number, and email address to fulfill and dispatch orders via our licensed South African courier partners.
            </p>
            <p>
              <strong>B. Payment Transaction Records:</strong> All financial checkouts are processed through secure, PCI-DSS Level 1 compliant payment gateways (Payflex, Stripe, Visa, and Mastercard). Yellow Berry Store receives only cryptographic transaction tokens, order status confirmations, and billing timestamps. <em>We never store your complete credit card numbers, banking PINs, or CVV security codes on our servers.</em>
            </p>
            <p>
              <strong>C. Automated Telemetry &amp; Session Continuity:</strong> When browsing our catalog, our edge hosting servers automatically log masked, non-identifiable diagnostic metrics: anonymized IP addresses, browser specifications, referrer domains, catalog dwell time, and shopping cart persistence tokens stored locally in your browser's <code class="bg-neutral-100 text-neutral-900 px-1.5 py-0.5 rounded text-xs font-mono">localStorage</code>.
            </p>
            <p>
              <strong>D. Member Accounts &amp; Communications:</strong> If you register a Yellow Berry Club account or subscribe to our newsletter, we store your profile nickname, email address, loyalty berry points, and communications preferences.
            </p>
          </div>
        </section>

        <!-- Section 3: Legal Bases for Processing -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">3. Legal Bases for Data Processing</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            In terms of Section 11 of the South African Protection of Personal Information Act (POPIA), we process personal information strictly under the following statutory grounds:
          </p>
          <ul class="list-disc pl-5 text-sm text-neutral-700 space-y-1.5 leading-relaxed font-light">
            <li><strong>Contractual Performance:</strong> To fulfill purchases, process orders, package products, and dispatch couriers to your designated delivery destination.</li>
            <li><strong>Explicit Consent:</strong> When you subscribe to our newsletter, opt into promotional announcements, or choose non-essential analytical cookies.</li>
            <li><strong>Legal &amp; Tax Obligations:</strong> To generate legally compliant tax invoices and maintain accounting records as mandated by South African Revenue Service (SARS) regulations and the Electronic Communications and Transactions Act (ECTA).</li>
            <li><strong>Legitimate Interests:</strong> To protect our storefront from fraud, defend CMS administrative endpoints from credential-stuffing attacks, and improve catalog navigation.</li>
          </ul>
        </section>

        <!-- Section 4: POPIA & PAIA Rights for South Africans -->
        <section class="space-y-4 bg-neutral-50 p-6 sm:p-7 rounded-2xl border border-neutral-200">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-neutral-900"></span>
            <h2 class="text-lg font-bold text-neutral-900">4. South African Citizens: Your POPIA &amp; PAIA Rights</h2>
          </div>
          <p class="text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
            Under the <strong>Protection of Personal Information Act, 2013 (Act No. 4 of 2013)</strong> and the <strong>Promotion of Access to Information Act, 2000 (Act No. 2 of 2000)</strong>, South African customers have clear, enforceable statutory rights:
          </p>
          <ul class="list-disc pl-5 text-xs sm:text-sm text-neutral-700 space-y-2 leading-relaxed font-light">
            <li><strong>Right of Access &amp; Confirmation:</strong> You may request confirmation of what personal records Yellow Berry Store holds regarding your account and obtain a copy free of charge.</li>
            <li><strong>Right to Rectification:</strong> You may demand that inaccurate, outdated, or incomplete personal data be corrected or updated without unreasonable delay.</li>
            <li><strong>Right to Erasure &amp; Objection:</strong> You have the right to object to processing and request permanent deletion of your customer records where processing is no longer required for statutory tax retention.</li>
            <li><strong>Transborder Information Flows (POPIA Section 72):</strong> Storefront infrastructure and database services hosted on Google Firebase/Firestore comply with Section 72 of POPIA, ensuring all cloud facilities maintain privacy protections equal to or exceeding South African law.</li>
            <li><strong>Right to Lodge a Complaint:</strong> If you believe your personal data has been handled contrary to POPIA, you have the statutory right to lodge a formal complaint with the <strong>Information Regulator of South Africa</strong>:
              <div class="mt-2 p-3 bg-white rounded-xl border border-neutral-200 text-xs space-y-0.5">
                <p><strong>Information Regulator (South Africa)</strong></p>
                <p>Complaints Email: <a href="mailto:POPIAComplaints@inforegulator.org.za" class="text-neutral-900 underline font-medium">POPIAComplaints@inforegulator.org.za</a></p>
                <p>General Enquiries: <a href="mailto:enquiries@inforegulator.org.za" class="text-neutral-900 underline font-medium">enquiries@inforegulator.org.za</a></p>
                <p>Website: <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" class="text-neutral-900 underline font-medium">https://inforegulator.org.za</a></p>
              </div>
            </li>
          </ul>
        </section>

        <!-- Section 5: Children's Privacy -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">5. Protection of Children's Privacy (Toy Store Credo)</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            While Yellow Berry Store designs toys and creative essentials for young explorers, our storefront is intended for purchase exclusively by parents, guardians, and adults of legal majority (18 years or older). We do not knowingly collect personal information directly from minors without verified parental consent. If a parent becomes aware that a child has submitted personal details without authorization, please notify us immediately at <a href="mailto:support@yellowberry.store" class="text-neutral-900 underline font-medium">support@yellowberry.store</a> for swift deletion.
          </p>
        </section>

        <!-- Section 6: Courier Logistics & Third Parties -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">6. Third-Party Service Providers &amp; Courier Sharing</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            We share personal data strictly with vetted operational partners required to fulfill our e-commerce duties:
          </p>
          <ul class="list-disc pl-5 text-sm text-neutral-700 space-y-1.5 leading-relaxed font-light">
            <li><strong>Couriers &amp; Freight:</strong> Reputable delivery companies across South Africa receive your recipient name, physical shipping address, and contact number strictly to complete parcel dispatch.</li>
            <li><strong>Payment Gateways:</strong> Payflex, Stripe, Visa, and Mastercard handle encrypted checkout without sharing raw card data with our servers.</li>
            <li><strong>Cloud Infrastructure:</strong> Google Firebase provides certified ISO-27001, SOC-2 database infrastructure with encrypted data storage.</li>
            <li><strong>Zero Commercial Brokerage:</strong> We never sell, lease, or monetize customer contact lists to marketing brokers or third-party advertisers.</li>
          </ul>
        </section>

        <!-- Section 7: Cookie Preferences -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">7. Cookie Governance &amp; Preference Controls</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            Yellow Berry Store categorizes cookies into Strictly Necessary, Analytics, Functional, and Marketing. You hold full authority to review or modify your consent selections at any time through our interactive
            <button
              type="button"
              @click="$emit('navigate-cookies')"
              class="text-neutral-900 font-bold underline hover:text-amber-700 cursor-pointer inline"
            >
              Cookie Policy &amp; Consent Center
            </button>.
          </p>
        </section>

        <!-- Section 8: Retention & Security -->
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-neutral-900">8. Cryptographic Security &amp; Data Retention</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            Customer data is stored using AES-256 encryption at rest and TLS 1.3 encryption in transit across all endpoints. Administrative CMS terminals are protected behind secret authorization gates, brute-force rate limiters, and bot honeypots. Customer order records are retained for five (5) years in compliance with South African statutory commercial tax retention mandates, after which records are anonymized or permanently destroyed.
          </p>
        </section>

        <!-- Section 9: Contact Information Officer -->
        <section class="space-y-3 border-t border-neutral-100 pt-8">
          <h2 class="text-xl font-bold text-neutral-900">9. Contact Our Information Officer</h2>
          <p class="text-sm text-neutral-700 leading-relaxed font-light">
            To submit a data access request, correct your personal details, or request account closure, contact our Information Officer:
          </p>
          <div class="text-sm text-neutral-800 space-y-1 pt-1 font-light">
            <p><strong>Attention:</strong> Information Officer &bull; Yellow Berry Store Compliance</p>
            <p><strong>Email:</strong> <a href="mailto:admin@yellowberry.store" class="text-neutral-900 font-medium underline">admin@yellowberry.store</a></p>
            <p><strong>Customer Care:</strong> <a href="mailto:support@yellowberry.store" class="text-neutral-900 font-medium underline">support@yellowberry.store</a></p>
            <p><strong>Response Commitment:</strong> Formal written acknowledgment within 48 hours; complete resolution within 30 days.</p>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup>
import FlowbiteIcon from './FlowbiteIcon.vue'

defineEmits(['back-home', 'navigate-cookies', 'navigate-terms'])
</script>

