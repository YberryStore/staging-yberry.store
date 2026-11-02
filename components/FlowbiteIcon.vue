<template>
  <svg
    :class="customClass"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="fill ? 'currentColor' : 'none'"
    :stroke="fill ? 'none' : 'currentColor'"
    :stroke-width="fill ? '0' : strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Search -->
    <path
      v-if="name === 'search'"
      d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
    />

    <!-- User / Account -->
    <path
      v-else-if="name === 'user'"
      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 3c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
    />

    <!-- Cart / Bag -->
    <path
      v-else-if="name === 'cart'"
      d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.333"
    />

    <!-- Shopping Bag variant -->
    <path
      v-else-if="name === 'bag'"
      d="M9 10V6a3 3 0 0 1 6 0v4m-9 9h12a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z"
    />

    <!-- Truck (Free Shipping) -->
    <path
      v-else-if="name === 'truck'"
      d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10l2 2h8a1 1 0 0 0 1-1Zm0 0h4.586a1 1 0 0 0 .707-.293l2.414-2.414a1 1 0 0 0 .293-.707V11a1 1 0 0 0-1-1h-6v6Zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
    />

    <!-- Credit Card / Payments -->
    <path
      v-else-if="name === 'credit-card'"
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3Z"
    />

    <!-- Shield Check (Payments) -->
    <path
      v-else-if="name === 'shield-check'"
      d="M12 3c4.5 1.5 7.5 3 7.5 7.5 0 5-3.5 8.5-7.5 10.5-4-2-7.5-5.5-7.5-10.5C4.5 6 7.5 4.5 12 3Zm-2.5 8.5 2 2 4.5-4.5"
    />

    <!-- Arrow Path / Returns -->
    <path
      v-else-if="name === 'arrow-path' || name === 'returns'"
      d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
    />

    <!-- Headset / Support 24/7 -->
    <path
      v-else-if="name === 'headset' || name === 'support'"
      d="M12 3a9 9 0 0 0-9 9v4a3 3 0 0 0 3 3h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5.1A7.003 7.003 0 0 1 12 5a7.003 7.003 0 0 1 6.9 7H17a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1a3 3 0 0 0 3-3v-4a9 9 0 0 0-9-9Zm-3 18h6"
    />

    <!-- Chevron Left -->
    <path
      v-else-if="name === 'chevron-left'"
      d="m15 19-7-7 7-7"
    />

    <!-- Chevron Right -->
    <path
      v-else-if="name === 'chevron-right'"
      d="m9 5 7 7-7 7"
    />

    <!-- Arrow Right -->
    <path
      v-else-if="name === 'arrow-right'"
      d="M19 12H5m14 0-4 4m4-4-4-4"
    />

    <!-- Filter / Funnel -->
    <path
      v-else-if="name === 'filter'"
      d="M4 4h16l-6 7.5V18l-4 2v-8.5L4 4Z"
    />

    <!-- Star -->
    <path
      v-else-if="name === 'star'"
      d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />

    <!-- Heart -->
    <path
      v-else-if="name === 'heart'"
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />

    <!-- Checkmark -->
    <path
      v-else-if="name === 'check'"
      d="m5 13 4 4L19 7"
    />

    <!-- Close / X -->
    <path
      v-else-if="name === 'close' || name === 'x'"
      d="M6 18 18 6M6 6l12 12"
    />

    <!-- Hamburger Bars -->
    <path
      v-else-if="name === 'bars'"
      d="M4 6h16M4 12h16M4 18h16"
    />

    <!-- Envelope / Mail -->
    <path
      v-else-if="name === 'mail'"
      d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm2 0 7 5 7-5"
    />

    <!-- Eye / Quick View -->
    <path
      v-else-if="name === 'eye'"
      d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
    />
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 20
  },
  strokeWidth: {
    type: [Number, String],
    default: 1.5 // As explicitly required: Flowbite icons with stroke width 1.5
  },
  fill: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>
