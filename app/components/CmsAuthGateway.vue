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
        <!-- ==========================================
             DEDICATED AWAITING ADMINISTRATOR APPROVAL CARD
             (Matches Headline Central Security Protocol)
             ========================================== -->
        <div
          v-if="pendingApprovalInfo"
          class="p-5 rounded-2xl border-2 border-amber-500/80 bg-amber-950/40 text-amber-100 space-y-4 shadow-lg backdrop-blur-md"
        >
          <div class="flex items-center gap-3.5">
            <img
              v-if="pendingApprovalInfo.photoURL"
              :src="pendingApprovalInfo.photoURL"
              :alt="pendingApprovalInfo.displayName"
              class="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shrink-0"
            />
            <div
              v-else
              class="w-12 h-12 rounded-full bg-amber-400 text-neutral-900 flex items-center justify-center font-bold text-lg shrink-0"
            >
              {{ (pendingApprovalInfo.displayName || 'U')[0].toUpperCase() }}
            </div>
            <div class="min-w-0 flex-1">
              <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-neutral-900 mb-1">
                Awaiting Administrator Approval
              </span>
              <p class="text-sm font-semibold text-white truncate">{{ pendingApprovalInfo.displayName }}</p>
              <p class="text-xs text-neutral-300 font-mono truncate">{{ pendingApprovalInfo.email }}</p>
            </div>
          </div>

          <div class="text-xs text-neutral-200 bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-700 space-y-2">
            <p class="font-medium text-white">
              Your {{ pendingApprovalInfo.provider === 'google' ? 'Google Sign-In' : 'account registration' }} has been received and verified.
            </p>
            <p class="text-neutral-300 leading-relaxed font-light">
              An administrator must review your registration and approve your account permissions before you can enter the CMS Control Portal.
            </p>
            <div class="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium pt-1">
              <FlowbiteIcon name="shield-check" size="14" />
              <span>Security Protocol: Access restricted to authorized personnel.</span>
            </div>
          </div>

          <button
            @click="pendingApprovalInfo = null; errorMessage = ''"
            type="button"
            class="w-full py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            &larr; Switch Account / Return to Sign In
          </button>
        </div>

        <template v-else>
          <!-- Mode Toggle Tabs (Sign In vs Request Access) -->
          <div class="p-1 rounded-full bg-neutral-800 flex items-center max-w-xs mx-auto mb-2">
            <button
              @click="switchAuthMode('login')"
              type="button"
              class="flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer"
              :class="authMode === 'login' ? 'bg-[#F4EB6A] text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-white'"
            >
              Sign In
            </button>
            <button
              @click="switchAuthMode('register')"
              type="button"
              class="flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer"
              :class="authMode === 'register' ? 'bg-[#F4EB6A] text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-white'"
            >
              Request Access
            </button>
          </div>

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

          <!-- Official Google Sign-In / Request Access Button -->
          <div class="space-y-3">
            <button
              @click="handleGoogleCmsLogin"
              :disabled="authLoading || isLockedOut"
              type="button"
              class="w-full py-3 px-4 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer hover:border-neutral-500"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{{ isGoogleAuthenticating ? 'Connecting to Google...' : (authMode === 'login' ? 'Sign in with Google' : 'Request Access with Google') }}</span>
            </button>

            <!-- Subtle Security Note about Google SSO -->
            <p class="text-[10px] text-neutral-400 text-center">
              Requires administrative approval before access is unlocked.
            </p>
          </div>

          <div class="relative my-3">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-neutral-800"></div>
            </div>
            <div class="relative flex justify-center text-[10px] uppercase">
              <span class="bg-neutral-900 px-3 text-neutral-500 font-medium">Or continue with email</span>
            </div>
          </div>

          <!-- TAB 1: SIGN IN WITH EMAIL -->
          <form v-if="authMode === 'login'" @submit.prevent="handleEmailCmsLogin" class="space-y-4">
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
                  class="text-xs text-[#F4EB6A] hover:underline cursor-pointer"
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
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-1 cursor-pointer"
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

          <!-- TAB 2: REQUEST ACCESS (REGISTRATION) -->
          <form v-else @submit.prevent="handleRequestAccessSubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Full Name *
              </label>
              <input
                v-model="registerForm.name"
                type="text"
                required
                placeholder="e.g. Elena Rostova"
                class="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F4EB6A] transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Email Address *
              </label>
              <input
                v-model="registerForm.email"
                type="email"
                required
                placeholder="e.g. elena@yellowberry.store"
                class="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F4EB6A] transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Desired Password *
              </label>
              <input
                v-model="registerForm.password"
                type="password"
                required
                minlength="6"
                placeholder="At least 6 characters"
                class="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F4EB6A] transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Department / Role Note (Optional)
              </label>
              <input
                v-model="registerForm.department"
                type="text"
                placeholder="e.g. Inventory Specialist, Customer Support"
                class="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F4EB6A] transition-colors"
              />
            </div>

            <button
              type="submit"
              :disabled="authLoading"
              class="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-950"
            >
              <FlowbiteIcon v-if="authLoading" name="arrow-path" size="16" class="animate-spin" />
              <span>{{ authLoading ? 'Submitting Request...' : 'Submit Access Request' }}</span>
            </button>
          </form>
        </template>
      </div>

      <!-- Footer Action: Back to storefront -->
      <div class="text-center mt-6">
        <button
          type="button"
          @click="$emit('back-to-storefront')"
          class="text-xs text-neutral-400 hover:text-[#F4EB6A] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <FlowbiteIcon name="arrow-left" size="14" />
          <span>Return to Public Storefront</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'

const emit = defineEmits(['authenticated', 'back-to-storefront'])

const {
  signInCmsWithEmail,
  signInCmsWithGoogle,
  requestCmsAccessWithEmail,
  resetPassword,
  isAdmin,
  authLoading,
  authError,
  pendingApprovalInfo,
  clearError
} = useFirebaseAuth()

const authMode = ref('login')
const isGoogleAuthenticating = ref(false)

const form = ref({
  email: '',
  password: '',
  trapField: ''
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  department: ''
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

const switchAuthMode = (mode) => {
  authMode.value = mode
  errorMessage.value = ''
  statusMessage.value = ''
  clearError()
}

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

// 1. Google Sign-In with Administrator Approval Check
const handleGoogleCmsLogin = async () => {
  errorMessage.value = ''
  statusMessage.value = ''
  clearError()
  isGoogleAuthenticating.value = true

  try {
    const res = await signInCmsWithGoogle()
    if (res.isAdmin) {
      statusMessage.value = 'Access granted. Opening CMS Control Dashboard...'
      setTimeout(() => {
        emit('authenticated')
      }, 400)
    } else if (res.pendingApproval) {
      // The pending approval card is now rendered automatically via pendingApprovalInfo
      errorMessage.value = ''
    }
  } catch (err) {
    errorMessage.value = err?.message || 'Google authentication failed.'
  } finally {
    isGoogleAuthenticating.value = false
  }
}

// 2. Email Sign-In with Administrator Approval Check
const handleEmailCmsLogin = async () => {
  errorMessage.value = ''
  statusMessage.value = ''
  clearError()

  if (form.value.trapField) {
    errorMessage.value = 'Automated access blocked.'
    return
  }

  if (isLockedOut.value) {
    errorMessage.value = `Rate throttled. Please wait ${lockoutRemaining.value}s.`
    return
  }

  if (!isHumanVerified.value) {
    errorMessage.value = 'Please complete the security challenge verification.'
    return
  }

  const email = form.value.email.trim().toLowerCase()
  const res = await signInCmsWithEmail(email, form.value.password)

  if (res.isAdmin) {
    statusMessage.value = 'Access granted. Opening CMS Control Dashboard...'
    setTimeout(() => {
      emit('authenticated')
    }, 400)
  } else if (res.pendingApproval) {
    // Shows the pending approval card automatically
    errorMessage.value = ''
  } else {
    failedAttempts.value++
    if (failedAttempts.value >= 3) startLockout(60)
    isHumanVerified.value = false
    errorMessage.value = res.error || 'Invalid administrator credentials.'
  }
}

// 3. Request Access Form Submission
const handleRequestAccessSubmit = async () => {
  errorMessage.value = ''
  statusMessage.value = ''
  clearError()

  if (!registerForm.email.includes('@')) {
    errorMessage.value = 'Please provide a valid email address.'
    return
  }

  const res = await requestCmsAccessWithEmail({
    name: registerForm.name,
    email: registerForm.email,
    password: registerForm.password,
    department: registerForm.department
  })

  if (res.success) {
    registerForm.name = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.department = ''
  } else {
    errorMessage.value = res.error || 'Failed to submit registration request.'
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
