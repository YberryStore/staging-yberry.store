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

    <!-- Users / Manage Users / Team -->
    <path
      v-else-if="name === 'users'"
      d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
    />

    <!-- User Add / Invite -->
    <path
      v-else-if="name === 'user-add' || name === 'user-plus'"
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9-1v6m3-3h-6"
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

    <!-- Chevron Down -->
    <path
      v-else-if="name === 'chevron-down'"
      d="m19 9-7 7-7-7"
    />

    <!-- Chevron Up -->
    <path
      v-else-if="name === 'chevron-up'"
      d="m19 15-7-7-7 7"
    />

    <!-- Plus -->
    <path
      v-else-if="name === 'plus'"
      d="M12 5v14m-7-7h14"
    />

    <!-- Minus -->
    <path
      v-else-if="name === 'minus'"
      d="M5 12h14"
    />

    <!-- Arrow Right -->
    <path
      v-else-if="name === 'arrow-right'"
      d="M19 12H5m14 0-4 4m4-4-4-4"
    />

    <!-- Arrow Up Right -->
    <path
      v-else-if="name === 'arrow-up-right'"
      d="M7 17 17 7m0 0H7m10 0v10"
    />

    <!-- Phone -->
    <path
      v-else-if="name === 'phone'"
      d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
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

    <!-- Clock -->
    <path
      v-else-if="name === 'clock'"
      d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
    />

    <!-- Tag -->
    <path
      v-else-if="name === 'tag'"
      d="M7 7h.01M3 11l8.586 8.586a2 2 0 0 0 2.828 0l6.586-6.586a2 2 0 0 0 0-2.828L12.414 1.586A2 2 0 0 0 11 1H4a2 2 0 0 0-2 2v7a2 2 0 0 0 1 1Z"
    />

    <!-- Fire / Flame -->
    <path
      v-else-if="name === 'fire'"
      d="M12 2c.5 2.5-1 4.5-2 6 2-1 4.5-1.5 5 1.5.5 3-1.5 5-1.5 7 0 2 1.5 3.5 3.5 3.5 3 0 5-2.5 5-6 0 4.5-2 8-8 8s-8-4-8-9c0-3.5 3-6.5 4-8.5.5 1.5 1.5 2.5 2 2.5Z"
    />

    <!-- Copy -->
    <path
      v-else-if="name === 'copy'"
      d="M8 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4M4 8h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z"
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

    <!-- Home -->
    <path
      v-else-if="name === 'home'"
      d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
    />

    <!-- Arrow Left -->
    <path
      v-else-if="name === 'arrow-left'"
      d="M5 12h14M5 12l4-4m-4 4 4 4"
    />

    <!-- Sparkles -->
    <path
      v-else-if="name === 'sparkles'"
      d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Zm7 11l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14ZM5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6L5 15Z"
    />

    <!-- Grid -->
    <path
      v-else-if="name === 'grid'"
      d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
    />

    <!-- Lock -->
    <path
      v-else-if="name === 'lock'"
      d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
    />

    <!-- Eye Off -->
    <path
      v-else-if="name === 'eye-off'"
      d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />

    <!-- Logout / Sign Out -->
    <path
      v-else-if="name === 'logout'"
      d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
    />

    <!-- Sidebar Toggle / Panel Split -->
    <path
      v-else-if="name === 'sidebar-toggle'"
      d="M9 4v16M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
    />

    <!-- Check Badge / Orders -->
    <path
      v-else-if="name === 'check-badge' || name === 'orders'"
      d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />

    <!-- Folder / Media Files -->
    <path
      v-else-if="name === 'folder'"
      d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6.5l-2-2H5a2 2 0 0 0-2 2Z"
    />

    <!-- Folder Box / Products -->
    <path
      v-else-if="name === 'folder-open' || name === 'products'"
      d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6.5l-2-2H5a2 2 0 0 0-2 2Zm0 4h18"
    />

    <!-- Newspaper / Blogs -->
    <path
      v-else-if="name === 'newspaper' || name === 'blogs' || name === 'book'"
      d="M19 7h1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11.5M7 14h6m-6 3h6m0-10h.5m-.5 3h.5M7 7h3v3H7V7Z"
    />

    <!-- Settings / Cog -->
    <path
      v-else-if="name === 'settings' || name === 'cog'"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />

    <!-- Trash / Delete -->
    <path
      v-else-if="name === 'trash'"
      d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
    />

    <!-- Edit / Pencil -->
    <path
      v-else-if="name === 'edit'"
      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
    />

    <!-- Upload / Cloud Arrow Up -->
    <path
      v-else-if="name === 'upload'"
      d="M12 16V4m0 0L8 8m4-4 4 4M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"
    />

    <!-- Share -->
    <path
      v-else-if="name === 'share'"
      d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.59 13.51l6.83 3.98m-.01-10.98-6.82 3.98"
    />

    <!-- Image / Photo -->
    <path
      v-else-if="name === 'image'"
      d="m3 16 5-5c.928-.893 2.072-.893 3 0l5 5m0 0 2-2c.928-.893 2.072-.893 3 0l2 2M3 19V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm11-10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
    />

    <!-- Video / Camera -->
    <path
      v-else-if="name === 'video'"
      d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z"
    />

    <!-- Play -->
    <path
      v-else-if="name === 'play'"
      d="M7 4v16l13-8z"
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
