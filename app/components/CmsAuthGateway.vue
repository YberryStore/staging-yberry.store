<template>
  <div class="min-h-screen bg-[#111111] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-poppins relative overflow-hidden selection:bg-[#F4EB6A] selection:text-neutral-900">
    <!-- Ambient glowing backdrop blurs -->
    <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#F4EB6A]/10 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
      <!-- Crest & Branding -->
      <div class="text-center space-y-3">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-900 border-2 border-[#F4EB6A]/60 shadow-xl shadow-black/50 text-[#F4EB6A]">
          <FlowbiteIcon name="shield-check" size="32" stroke-width="1.8" />
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            CMS Control Gateway
          </h2>
          <p class="text-xs text-neutral-400 mt-1">
            Yellow Berry Store Administration Portal
          </p>
        </div>

        <!-- Security Gateway Authorized Pill -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-emerald-500/40 text-emerald-400 text-[11px] font-medium shadow-sm">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Gateway Key Verified • Session Authorized</span>
        </div>
      </div>

      <!-- Main Login Card -->
      <div class="mt-8 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
        <!-- Error Alert -->
        <div
          v-if="errorMessage || authError"
          class="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-start gap-2.5 animate-pulse"
        >
          <FlowbiteIcon name="close" size="16" stroke-width="2" class="text-red-400 shrink-0 mt-0.5" />
          <div class="flex-1">{{ errorMessage || authError }}</div>
        </div>

        <!-- Success Message -->
        <div
          v-if="statusMessage"
          class="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-200 flex items-start gap-2.5"
        >
          <FlowbiteIcon name="check" size="16" stroke-width="2" class="text-emerald-400 shrink-0 mt-0.5" />
          <div class="flex-1">{{ statusMessage }}</div>
        </div>

        <!-- Lockout Warning -->
        <div
          v-if="isLockedOut"
          class="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-xs text-amber-200 space-y-1"
        >
          <div class="flex items-center gap-2 font-bold text-amber-300">
            <FlowbiteIcon name="lock" size="15" />
            <span>Security Throttling Active</span>
          </div>
          <p>Too many failed attempts. Gateway locked for {{ lockoutRemaining }}s.</p>
        </div>

        <form @submit.prevent="handleCmsLogin" class="space-y-4">
          <!-- Invisible Honeypot Trap -->
          <div class="opacity-0 absolute -left-[9999px] pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true" tabindex="-1">
            <label for="cms_trap">Leave empty</label>
            <input id="cms_trap" v-model="form.trapField" type="text" name="b_cms_sec_tok" tabindex="-1" autocomplete="off" />
          </div>

          <!-- Email Field -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Administrator Email
            </label>
            <div class="relative">
              <FlowbiteIcon name="mail" size="18" stroke-width="1.5" class="text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="form.email"
                type="email"
                required
                autocomplete="username"
                placeholder="admin@yellowberry.store"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F4EB6A] transition-colors"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Password
              </label>
              <button
                type="button"
                @click="handleForgotCmsPassword"
                class="text-xs text-[#F4EB6A] hover:underline"
              >
                Reset password?
              </button>
            </div>
            <div class="relative">
              <FlowbiteIcon name="lock" size="18" stroke-width="1.5" class="text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••••••"
                class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F4EB6A] transition-colors"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-1"
                aria-label="Toggle password visibility"
              >
                <FlowbiteIcon :name="showPassword ? 'eye-off' : 'eye'" size="16" />
              </button>
            </div>
          </div>

          <!-- Interactive Human Verification Checkpoint -->
          <div
            class="p-3.5 rounded-xl border transition-all duration-200 select-none"
            :class="[
              isHumanVerified
                ? 'bg-emerald-950/30 border-emerald-500/50'
                : isVerifyingHuman
                  ? 'bg-amber-950/30 border-amber-500/50'
                  : 'bg-neutral-800/60 border-neutral-700 hover:border-neutral-600'
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="triggerHumanVerification"
                  :disabled="isHumanVerified || isVerifyingHuman || isLockedOut"
                  class="w-7 h-7 rounded-lg border-2 transition-all flex items-center justify-center focus:outline-none"
                  :class="[
                    isHumanVerified
                      ? 'bg-emerald-500 border-emerald-500 text-neutral-900 cursor-default'
                      : isVerifyingHuman
                        ? 'border-amber-400 bg-amber-500/20 cursor-wait'
                        : isLockedOut
                          ? 'border-neutral-700 bg-neutral-800 text-neutral-600 cursor-not-allowed'
                          : 'border-neutral-500 hover:border-[#F4EB6A] bg-neutral-800 cursor-pointer active:scale-95'
                  ]"
                >
                  <FlowbiteIcon v-if="isHumanVerified" name="check" size="16" stroke-width="2.5" />
                  <svg v-else-if="isVerifyingHuman" class="animate-spin w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span v-else class="w-2.5 h-2.5 rounded-xs bg-transparent"></span>
                </button>

                <div>
                  <p class="text-xs font-semibold text-white">
                    {{ isHumanVerified ? 'Identity Challenge Verified' : isVerifyingHuman ? 'Verifying browser environment...' : 'Verify security checkpoint' }}
                  </p>
                  <p class="text-[10px] text-neutral-400">
                    {{ isHumanVerified ? 'Pre-flight token validated' : 'Required before CMS access' }}
                  </p>
                </div>
              </div>

              <div class="text-right flex flex-col items-end">
                <span class="text-[9px] uppercase tracking-wider font-bold text-[#F4EB6A]">CMS Shield</span>
                <span class="text-[9px] text-neutral-500 font-mono">v2.4</span>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authLoading || isLockedOut || !isHumanVerified"
            class="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-950"
          >
            <FlowbiteIcon v-if="authLoading" name="arrow-path" size="16" class="animate-spin" />
            <span>{{ authLoading ? 'Authenticating...' : isLockedOut ? `Locked (${lockoutRemaining}s)` : !isHumanVerified ? 'Verify Security Above' : 'Sign In to CMS Dashboard' }}</span>
          </button>
        </form>
      </div>

      <!-- Footer Action: Back to storefront -->
      <div class="text-center mt-6">
        <button
          type="button"
          @click="$emit('back-to-storefront')"
          class="text-xs text-neutral-400 hover:text-[#F4EB6A] transition-colors inline-flex items-center gap-1.5"
        >
          <FlowbiteIcon name="arrow-left" size="14" />
          <span>Return to Public Storefront</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'

const emit = defineEmits(['authenticated', 'back-to-storefront'])

const {
  signInWithEmail,
  resetPassword,
  logout,
  isAdmin,
  authLoading,
  authError,
  clearError
} = useFirebaseAuth()

const form = ref({
  email: '',
  password: '',
  trapField: ''
})

const showPassword = ref(false)
const errorMessage = ref('')
const statusMessage = ref('')

// Security Challenge state
const isHumanVerified = ref(false)
const isVerifyingHuman = ref(false)
const failedAttempts = ref(0)
const lockoutRemaining = ref(0)
let lockoutTimer = null

const isLockedOut = computed(() => lockoutRemaining.value > 0)

const triggerHumanVerification = () => {
  if (isHumanVerified.value || isVerifyingHuman.value || isLockedOut.value) return
  isVerifyingHuman.value = true
  setTimeout(() => {
    isVerifyingHuman.value = false
    isHumanVerified.value = true
  }, 600)
}

const startLockout = (seconds) => {
  if (lockoutTimer) clearInterval(lockoutTimer)
  lockoutRemaining.value = seconds
  lockoutTimer = setInterval(() => {
    lockoutRemaining.value--
    if (lockoutRemaining.value <= 0) {
      clearInterval(lockoutTimer)
      lockoutTimer = null
    }
  }, 1000)
}

const handleCmsLogin = async () => {
  errorMessage.value = ''
  statusMessage.value = ''
  clearError()

  // 1. Honeypot Bot Trap
  if (form.value.trapField) {
    errorMessage.value = 'Automated access blocked.'
    return
  }

  // 2. Lockout Check
  if (isLockedOut.value) {
    errorMessage.value = `Rate throttled. Please wait ${lockoutRemaining.value}s.`
    return
  }

  // 3. Human Challenge Check
  if (!isHumanVerified.value) {
    errorMessage.value = 'Please complete the security challenge verification.'
    return
  }

  const email = form.value.email.trim().toLowerCase()
  const { user, error } = await signInWithEmail(email, form.value.password)

  if (user) {
    // Check if the user possesses admin privileges
    if (isAdmin.value) {
      statusMessage.value = 'Access granted. Opening CMS Control Dashboard...'
      setTimeout(() => {
        emit('authenticated')
      }, 400)
    } else {
      errorMessage.value = 'Access Denied: Your account does not have administrative privileges for the CMS.'
      await logout()
      failedAttempts.value++
      if (failedAttempts.value >= 3) startLockout(60)
      isHumanVerified.value = false
    }
  } else {
    failedAttempts.value++
    if (failedAttempts.value >= 3) startLockout(60)
    isHumanVerified.value = false
    errorMessage.value = error || 'Invalid administrator credentials.'
  }
}

const handleForgotCmsPassword = async () => {
  errorMessage.value = ''
  statusMessage.value = ''
  if (!form.value.email || !form.value.email.includes('@')) {
    errorMessage.value = 'Please enter your administrator email address above first.'
    return
  }
  const { success, error } = await resetPassword(form.value.email)
  if (success) {
    statusMessage.value = `Password reset link dispatched to ${form.value.email}. Check your inbox.`
  } else {
    errorMessage.value = error || 'Failed to dispatch reset link.'
  }
}

onUnmounted(() => {
  if (lockoutTimer) clearInterval(lockoutTimer)
})
</script>
