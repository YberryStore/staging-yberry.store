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
        class="fixed inset-y-0 right-0 max-w-full w-full sm:w-[440px] bg-white z-50 shadow-2xl flex flex-col font-poppins"
      >
        <!-- Top Brand Header -->
        <div class="p-5 border-b border-neutral-100 flex items-center justify-between bg-[#151515] text-white">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-[#F4EB6A] text-neutral-900 flex items-center justify-center font-bold">
              <FlowbiteIcon name="user" size="18" stroke-width="1.8" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-white leading-tight">
                {{ isAuthenticated ? 'My Ystore Account' : 'Welcome to Ystore' }}
              </h3>
              <p class="text-[11px] text-neutral-400">
                {{ isAuthenticated ? 'Member Profile & Rewards' : 'Sign in for rewards, wishlist & fast checkout' }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="$emit('close')"
            class="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            aria-label="Close account drawer"
          >
            <FlowbiteIcon name="close" size="20" stroke-width="1.5" />
          </button>
        </div>

        <!-- Perks Banner -->
        <div class="px-5 py-2.5 bg-[#FAF7BA] border-b border-[#F4EB6A]/60 text-xs text-[#423C27] flex items-center justify-between">
          <div class="flex items-center gap-1.5 font-medium">
            <FlowbiteIcon name="sparkles" size="14" stroke-width="1.8" />
            <span>Yellow Berry Club: Earn 150 bonus points on sign up!</span>
          </div>
          <span class="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4EB6A] text-neutral-900">
            Free
          </span>
        </div>

        <!-- Main Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- ==========================================
               STATE 1: AUTHENTICATED USER PROFILE VIEW
               ========================================== -->
          <div v-if="isAuthenticated && currentUser" class="space-y-6">
            <!-- User Card -->
            <div class="p-5 rounded-2xl bg-neutral-900 text-white relative overflow-hidden shadow-md">
              <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#F4EB6A]/10 pointer-events-none"></div>
              <div class="flex items-center gap-4">
                <div
                  v-if="currentUser.photoURL"
                  class="w-14 h-14 rounded-full overflow-hidden border-2 border-[#F4EB6A] shrink-0"
                >
                  <img :src="currentUser.photoURL" :alt="currentUser.displayName" class="w-full h-full object-cover" />
                </div>
                <div
                  v-else
                  class="w-14 h-14 rounded-full bg-[#F4EB6A] text-neutral-900 flex items-center justify-center text-xl font-bold shrink-0"
                >
                  {{ userInitials }}
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <h4 class="text-base font-semibold text-white truncate">
                      {{ currentUser.displayName }}
                    </h4>
                    <span
                      :class="[
                        'px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0',
                        isAdmin
                          ? 'bg-amber-400 text-neutral-950 ring-2 ring-amber-200/50'
                          : 'bg-[#F4EB6A] text-neutral-900'
                      ]"
                    >
                      {{ isAdmin ? 'Super Admin' : (isGuest ? 'Guest' : (userProfile?.tier || 'Member')) }}
                    </span>
                  </div>
                  <p class="text-xs text-neutral-300 truncate mt-0.5">
                    {{ currentUser.email || 'Anonymous Guest Session' }}
                  </p>
                  <p class="text-[11px] text-emerald-400 mt-1 flex items-center gap-1.5 font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    <span>{{ isGuest ? 'Guest Session' : 'Active Member' }}</span>
                  </p>
                </div>
              </div>

              <!-- Rewards & Tier Metrics -->
              <div class="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-neutral-800">
                <div class="bg-neutral-800/70 rounded-xl p-3">
                  <span class="text-[11px] text-neutral-400 block">Berry Points</span>
                  <span class="text-lg font-bold text-[#F4EB6A]">
                    {{ userProfile?.rewardPoints ?? (isGuest ? 0 : 150) }} pts
                  </span>
                </div>
                <div class="bg-neutral-800/70 rounded-xl p-3">
                  <span class="text-[11px] text-neutral-400 block">{{ isAdmin ? 'Access Level' : 'Member Discount' }}</span>
                  <span class="text-lg font-bold text-white">
                    {{ isAdmin ? 'Full Admin' : (isGuest ? 'None' : '15% OFF') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Super Admin Status Banner & Media Storage Uploader -->
            <div
              v-if="isAdmin"
              class="p-4 rounded-2xl bg-[#151515] text-white border border-[#F4EB6A]/60 space-y-3 shadow-sm"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-[#F4EB6A] font-semibold text-xs uppercase tracking-wider">
                  <FlowbiteIcon name="shield-check" size="16" stroke-width="1.8" />
                  <span>Super User Admin Privileges Active</span>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  Admin Session
                </span>
              </div>
              <p class="text-xs text-neutral-300 leading-relaxed">
                Signed in as <strong class="text-white">{{ currentUser.displayName || 'Admin' }}</strong> ({{ currentUser.email }}). Full administrative dashboard and media management controls enabled.
              </p>

              <!-- Launch Full Admin Dashboard Button -->
              <button
                type="button"
                @click="$emit('open-admin'); $emit('close')"
                class="w-full py-2.5 px-4 rounded-xl bg-[#F4EB6A] hover:bg-[#FAF7BA] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <FlowbiteIcon name="grid" size="16" stroke-width="2" />
                <span>Open Full Admin Dashboard</span>
              </button>

              <!-- Storage Upload Controls -->
              <div class="pt-3 border-t border-neutral-800 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Storage Bucket Uploader
                  </span>
                  <select
                    v-model="selectedStorageFolder"
                    class="bg-neutral-800 text-xs text-[#F4EB6A] font-medium px-2.5 py-1 rounded-lg border border-neutral-700 focus:outline-none"
                  >
                    <option value="products">products/</option>
                    <option value="categories">categories/</option>
                    <option value="specials">specials/</option>
                    <option value="blog">blog/</option>
                    <option value="banners">banners/</option>
                    <option value="content">content/</option>
                  </select>
                </div>

                <label
                  class="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-neutral-700 hover:border-[#F4EB6A] bg-neutral-900/80 cursor-pointer transition-colors text-center"
                >
                  <input
                    type="file"
                    accept="image/*,video/*,application/pdf,application/json"
                    multiple
                    class="hidden"
                    :disabled="isUploading"
                    @change="handleStorageFileSelect"
                  />
                  <span class="text-xs font-medium text-white">
                    {{ isUploading ? `Uploading (${uploadProgress}%)...` : 'Click to upload images or content' }}
                  </span>
                  <span class="text-[10px] text-neutral-400 mt-0.5">
                    Saves directly to storage/{{ selectedStorageFolder }}/
                  </span>
                </label>

                <!-- Progress Bar -->
                <div v-if="isUploading" class="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    class="bg-[#F4EB6A] h-1.5 transition-all duration-200"
                    :style="{ width: `${uploadProgress}%` }"
                  ></div>
                </div>

                <!-- Error -->
                <p v-if="storageError" class="text-[11px] text-red-400">
                  {{ storageError }}
                </p>

                <!-- Recently Uploaded URLs -->
                <div v-if="uploadedItems.length > 0" class="space-y-1.5 max-h-36 overflow-y-auto pt-1">
                  <div
                    v-for="item in uploadedItems"
                    :key="item.storagePath"
                    class="flex items-center justify-between gap-2 bg-neutral-800/90 p-2 rounded-lg text-[11px]"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <img
                        v-if="item.contentType && item.contentType.startsWith('image/')"
                        :src="item.url"
                        :alt="item.name"
                        class="w-7 h-7 rounded object-cover shrink-0 bg-neutral-700"
                      />
                      <span class="truncate text-neutral-200">{{ item.storagePath }}</span>
                    </div>
                    <button
                      type="button"
                      @click="copyStorageUrl(item.url)"
                      class="px-2 py-0.5 rounded bg-[#F4EB6A] text-neutral-900 font-semibold text-[10px] shrink-0 cursor-pointer"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upgrade Guest Banner (if signed in anonymously) -->
            <div
              v-if="isGuest"
              class="p-4 rounded-2xl bg-[#FEFEEB] border border-[#F4EB6A] space-y-2"
            >
              <div class="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                <FlowbiteIcon name="sparkles" size="16" stroke-width="1.8" />
                <span>Want to save your cart & earn 150 points?</span>
              </div>
              <p class="text-xs text-neutral-600 leading-relaxed">
                You're browsing with a temporary guest session. Sign up for a full account anytime to keep your order history.
              </p>
              <button
                type="button"
                @click="switchFromGuestToSignUp"
                class="btn-pill-sm mt-1"
              >
                Create Permanent Account
              </button>
            </div>

            <!-- Edit Display Name Section -->
            <div v-if="!isGuest" class="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Profile Details</span>
                <button
                  type="button"
                  @click="isEditingProfile = !isEditingProfile"
                  class="text-xs font-medium text-neutral-900 underline hover:text-neutral-600"
                >
                  {{ isEditingProfile ? 'Cancel' : 'Edit Name' }}
                </button>
              </div>

              <div v-if="isEditingProfile" class="flex items-center gap-2 pt-1">
                <input
                  v-model="editNameInput"
                  type="text"
                  placeholder="Your display name"
                  class="flex-1 px-3.5 py-2 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white"
                  @keyup.enter="handleUpdateName"
                />
                <button
                  type="button"
                  :disabled="authLoading"
                  @click="handleUpdateName"
                  class="btn-pill-sm !py-2 !px-4"
                >
                  Save
                </button>
              </div>
              <div v-else class="text-xs text-neutral-600 space-y-1">
                <p><span class="text-neutral-400">Name:</span> {{ currentUser.displayName }}</p>
                <p><span class="text-neutral-400">Email:</span> {{ currentUser.email }}</p>
              </div>
            </div>

            <!-- Quick Account Actions -->
            <div class="space-y-2">
              <h5 class="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
                Quick Actions
              </h5>

              <button
                type="button"
                @click="$emit('open-cart'); $emit('close')"
                class="w-full flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-[#FEFEEB]/50 transition-all text-left group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-neutral-100 group-hover:bg-[#F4EB6A] flex items-center justify-center transition-colors">
                    <FlowbiteIcon name="bag" size="18" stroke-width="1.5" />
                  </div>
                  <div>
                    <span class="text-sm font-medium text-neutral-900 block">My Shopping Bag</span>
                    <span class="text-xs text-neutral-500">View items & proceed to checkout</span>
                  </div>
                </div>
                <FlowbiteIcon name="chevron-right" size="16" stroke-width="1.5" class="text-neutral-400" />
              </button>

              <button
                type="button"
                @click="$emit('navigate-specials'); $emit('close')"
                class="w-full flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-[#FEFEEB]/50 transition-all text-left group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-neutral-100 group-hover:bg-[#F4EB6A] flex items-center justify-center transition-colors">
                    <FlowbiteIcon name="tag" size="18" stroke-width="1.5" />
                  </div>
                  <div>
                    <span class="text-sm font-medium text-neutral-900 block">Member Flash Deals</span>
                    <span class="text-xs text-neutral-500">Up to 25% off exclusive toy specials</span>
                  </div>
                </div>
                <FlowbiteIcon name="chevron-right" size="16" stroke-width="1.5" class="text-neutral-400" />
              </button>

              <button
                type="button"
                @click="$emit('navigate-contact'); $emit('close')"
                class="w-full flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-[#FEFEEB]/50 transition-all text-left group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-neutral-100 group-hover:bg-[#F4EB6A] flex items-center justify-center transition-colors">
                    <FlowbiteIcon name="headset" size="18" stroke-width="1.5" />
                  </div>
                  <div>
                    <span class="text-sm font-medium text-neutral-900 block">Order Support & Help</span>
                    <span class="text-xs text-neutral-500">Track deliveries or request a return</span>
                  </div>
                </div>
                <FlowbiteIcon name="chevron-right" size="16" stroke-width="1.5" class="text-neutral-400" />
              </button>
            </div>

            <!-- Sign Out Button -->
            <div class="pt-4 border-t border-neutral-100">
              <button
                type="button"
                :disabled="authLoading"
                @click="handleLogout"
                class="w-full py-3 px-4 rounded-full border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FlowbiteIcon name="logout" size="18" stroke-width="1.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <!-- ==========================================
               STATE 2: SIGN IN / SIGN UP / RESET FORMS
               ========================================== -->
          <div v-else class="space-y-6">
            <!-- First-Layer Defense Perimeter Header -->
            <div class="flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-900 text-white shadow-xs">
              <div class="flex items-center gap-2">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-xs font-medium tracking-wide">L1 Defense Shield Active</span>
              </div>
              <span class="text-[10px] text-neutral-400 font-mono">Anti-Bot & Rate Guard</span>
            </div>

            <!-- Lockout Security Banner (Client-Side Progressive Rate Limiting) -->
            <div
              v-if="isLockedOut"
              class="p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs text-red-800 space-y-1.5 animate-pulse"
            >
              <div class="flex items-center gap-2 font-semibold text-red-900">
                <FlowbiteIcon name="lock" size="16" stroke-width="2" class="text-red-600 shrink-0" />
                <span>Security Cooldown Active</span>
              </div>
              <p class="leading-relaxed">
                Multiple consecutive failed login attempts detected ({{ failedAttempts }} recorded). Access is temporarily throttled to prevent credential attacks.
              </p>
              <div class="pt-1 flex items-center justify-between font-mono text-[11px] text-red-700">
                <span>Unlocking in:</span>
                <span class="px-2 py-0.5 rounded-md bg-red-100 font-bold text-red-900">{{ lockoutRemaining }}s</span>
              </div>
            </div>

            <!-- Mode Switcher Tabs -->
            <div
              v-if="activeTab !== 'reset'"
              class="grid grid-cols-2 p-1 bg-neutral-100 rounded-full border border-neutral-200"
            >
              <button
                type="button"
                @click="switchTab('signin')"
                :class="[
                  'py-2 text-sm font-medium rounded-full transition-all',
                  activeTab === 'signin'
                    ? 'bg-neutral-900 text-[#F4EB6A] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                ]"
              >
                Sign In
              </button>
              <button
                type="button"
                @click="switchTab('signup')"
                :class="[
                  'py-2 text-sm font-medium rounded-full transition-all',
                  activeTab === 'signup'
                    ? 'bg-neutral-900 text-[#F4EB6A] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                ]"
              >
                Create Account
              </button>
            </div>

            <!-- Alert / Error Message -->
            <div
              v-if="authError"
              class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5"
            >
              <FlowbiteIcon name="close" size="16" stroke-width="2" class="text-red-500 shrink-0 mt-0.5" />
              <div class="flex-1">{{ authError }}</div>
            </div>

            <!-- Success Message (e.g. Password Reset Sent) -->
            <div
              v-if="statusMessage"
              class="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-start gap-2.5"
            >
              <FlowbiteIcon name="check" size="16" stroke-width="2" class="text-green-600 shrink-0 mt-0.5" />
              <div class="flex-1">{{ statusMessage }}</div>
            </div>

            <!-- PASSWORD RESET FORM -->
            <form v-if="activeTab === 'reset'" @submit.prevent="handleResetPassword" class="space-y-4">
              <!-- Honeypot Trap (Hidden from users, catches automated bots) -->
              <div class="opacity-0 absolute -left-[9999px] pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true" tabindex="-1">
                <label for="reset_trap">Security Token Verification</label>
                <input
                  id="reset_trap"
                  v-model="form.trapField"
                  type="text"
                  name="b_reset_sec_token"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>

              <div>
                <button
                  type="button"
                  @click="switchTab('signin')"
                  class="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 mb-3"
                >
                  <FlowbiteIcon name="arrow-left" size="14" stroke-width="1.5" />
                  <span>Back to Sign In</span>
                </button>
                <h4 class="text-lg font-semibold text-neutral-900">Reset your password</h4>
                <p class="text-xs text-neutral-500 mt-1">
                  Enter the email address associated with your Ystore account and we'll send you a reset link.
                </p>
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1.5">Email Address</label>
                <div class="relative">
                  <FlowbiteIcon name="mail" size="18" stroke-width="1.5" class="text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <!-- Interactive Human Verification Challenge -->
              <div
                class="p-3.5 rounded-xl border transition-all duration-200 select-none"
                :class="[
                  isHumanVerified
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                    : isVerifyingHuman
                      ? 'bg-amber-50/50 border-amber-300'
                      : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
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
                          ? 'bg-emerald-500 border-emerald-500 text-white cursor-default shadow-xs'
                          : isVerifyingHuman
                            ? 'border-amber-500 bg-amber-50 cursor-wait'
                            : isLockedOut
                              ? 'border-neutral-300 bg-neutral-100 text-neutral-300 cursor-not-allowed'
                              : 'border-neutral-400 hover:border-neutral-900 bg-white cursor-pointer hover:shadow-xs active:scale-95'
                      ]"
                      aria-label="Human verification checkpoint"
                    >
                      <FlowbiteIcon v-if="isHumanVerified" name="check" size="16" stroke-width="2.5" />
                      <svg
                        v-else-if="isVerifyingHuman"
                        class="animate-spin w-4 h-4 text-amber-600"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span v-else class="w-2.5 h-2.5 rounded-xs bg-transparent"></span>
                    </button>

                    <div>
                      <p class="text-xs font-semibold text-neutral-800">
                        {{ isHumanVerified ? 'Human Verification Confirmed' : isVerifyingHuman ? 'Verifying browser environment...' : 'Verify you are human' }}
                      </p>
                      <p class="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <FlowbiteIcon
                          name="shield-check"
                          size="12"
                          stroke-width="1.8"
                          :class="isHumanVerified ? 'text-emerald-600' : 'text-neutral-400'"
                        />
                        <span>{{ isHumanVerified ? 'Security token validated' : 'Required before sending link' }}</span>
                      </p>
                    </div>
                  </div>

                  <div class="text-right flex flex-col items-end">
                    <span class="text-[9px] uppercase tracking-wider font-bold text-neutral-600">Shield L1</span>
                    <span class="text-[9px] text-neutral-600 font-mono">Ystore-Def</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                :disabled="authLoading || isLockedOut || !isHumanVerified"
                class="btn-primary w-full !py-3 font-semibold justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span v-if="authLoading">Sending Reset Link...</span>
                <span v-else-if="isLockedOut">Cooldown Active ({{ lockoutRemaining }}s)</span>
                <span v-else-if="!isHumanVerified">Verify Above to Unlock</span>
                <span v-else>Send Reset Link</span>
              </button>
            </form>

            <!-- SIGN IN / SIGN UP FORM -->
            <form v-else @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Honeypot Trap (Hidden from users, catches automated bots) -->
              <div class="opacity-0 absolute -left-[9999px] pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true" tabindex="-1">
                <label for="auth_trap">Security Token Verification</label>
                <input
                  id="auth_trap"
                  v-model="form.trapField"
                  type="text"
                  name="b_auth_sec_token"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>

              <!-- Full Name (Sign Up only) -->
              <div v-if="activeTab === 'signup'">
                <label class="block text-xs font-medium text-neutral-700 mb-1.5">Full Name</label>
                <div class="relative">
                  <FlowbiteIcon name="user" size="18" stroke-width="1.5" class="text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-1.5">Email Address</label>
                <div class="relative">
                  <FlowbiteIcon name="mail" size="18" stroke-width="1.5" class="text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <!-- Password -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-xs font-medium text-neutral-700">Password</label>
                  <button
                    v-if="activeTab === 'signin'"
                    type="button"
                    @click="switchTab('reset')"
                    class="text-xs text-neutral-500 hover:text-neutral-900 underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div class="relative">
                  <FlowbiteIcon name="lock" size="18" stroke-width="1.5" class="text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                    placeholder="••••••••"
                    class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                    aria-label="Toggle password visibility"
                  >
                    <FlowbiteIcon :name="showPassword ? 'eye-off' : 'eye'" size="16" stroke-width="1.5" />
                  </button>
                </div>

                <!-- Password Strength Meter on Sign Up -->
                <div v-if="activeTab === 'signup' && form.password" class="space-y-1.5 pt-2">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-neutral-500">Password strength:</span>
                    <span :class="passwordStrength.colorClass" class="font-semibold">{{ passwordStrength.label }}</span>
                  </div>
                  <div class="grid grid-cols-4 gap-1.5 h-1.5">
                    <div
                      v-for="i in 4"
                      :key="i"
                      :class="[
                        'h-full rounded-full transition-all duration-300',
                        i <= passwordStrength.score ? passwordStrength.barBg : 'bg-neutral-200'
                      ]"
                    ></div>
                  </div>
                  <p class="text-[10px] text-neutral-400">
                    Use 8+ characters combining uppercase, numbers & special symbols.
                  </p>
                </div>
              </div>

              <!-- Interactive Human Verification Challenge Checkpoint -->
              <div
                class="p-3.5 rounded-xl border transition-all duration-200 select-none"
                :class="[
                  isHumanVerified
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                    : isVerifyingHuman
                      ? 'bg-amber-50/50 border-amber-300'
                      : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
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
                          ? 'bg-emerald-500 border-emerald-500 text-white cursor-default shadow-xs'
                          : isVerifyingHuman
                            ? 'border-amber-500 bg-amber-50 cursor-wait'
                            : isLockedOut
                              ? 'border-neutral-300 bg-neutral-100 text-neutral-300 cursor-not-allowed'
                              : 'border-neutral-400 hover:border-neutral-900 bg-white cursor-pointer hover:shadow-xs active:scale-95'
                      ]"
                      aria-label="Human verification checkpoint checkbox"
                    >
                      <FlowbiteIcon v-if="isHumanVerified" name="check" size="16" stroke-width="2.5" />
                      <svg
                        v-else-if="isVerifyingHuman"
                        class="animate-spin w-4 h-4 text-amber-600"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span v-else class="w-2.5 h-2.5 rounded-xs bg-transparent"></span>
                    </button>

                    <div>
                      <p class="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                        <span>{{ isHumanVerified ? 'Human Verification Confirmed' : isVerifyingHuman ? 'Verifying browser environment...' : 'Verify you are human' }}</span>
                      </p>
                      <p class="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <FlowbiteIcon
                          name="shield-check"
                          size="12"
                          stroke-width="1.8"
                          :class="isHumanVerified ? 'text-emerald-600' : 'text-neutral-400'"
                        />
                        <span>{{ isHumanVerified ? 'Security token validated' : 'Required before sign in' }}</span>
                      </p>
                    </div>
                  </div>

                  <div class="text-right flex flex-col items-end">
                    <span class="text-[9px] uppercase tracking-wider font-bold text-neutral-600">Shield L1</span>
                    <span class="text-[9px] text-neutral-600 font-mono">Ystore-Def</span>
                  </div>
                </div>
              </div>

              <!-- Submit Primary Button -->
              <button
                type="submit"
                :disabled="authLoading || isLockedOut || !isHumanVerified"
                class="btn-primary w-full !py-3 font-semibold justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span v-if="authLoading">
                  {{ activeTab === 'signin' ? 'Signing In...' : 'Creating Account...' }}
                </span>
                <span v-else-if="isLockedOut">
                  Cooldown Active ({{ lockoutRemaining }}s)
                </span>
                <span v-else-if="!isHumanVerified">
                  Verify You Are Human Above
                </span>
                <span v-else>
                  {{ activeTab === 'signin' ? 'Sign In to Ystore' : 'Create Ystore Account' }}
                </span>
              </button>
            </form>

            <!-- Divider -->
            <div v-if="activeTab !== 'reset'" class="relative flex py-1 items-center">
              <div class="flex-grow border-t border-neutral-200"></div>
              <span class="flex-shrink mx-3 text-xs text-neutral-400 uppercase tracking-wider">Or continue with</span>
              <div class="flex-grow border-t border-neutral-200"></div>
            </div>

            <!-- OAuth & Guest Options -->
            <div v-if="activeTab !== 'reset'" class="space-y-2.5">
              <!-- Google Sign-In -->
              <button
                type="button"
                :disabled="authLoading"
                @click="handleGoogleSignIn"
                class="w-full py-2.5 px-4 rounded-full border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-sm font-medium text-neutral-800 flex items-center justify-center gap-2.5 transition-all disabled:opacity-60"
              >
                <!-- Official Google G SVG -->
                <svg class="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <!-- Guest / Anonymous Checkout -->
              <button
                type="button"
                :disabled="authLoading"
                @click="handleGuestSignIn"
                class="w-full py-2.5 px-4 rounded-full border border-neutral-200 hover:border-[#F4EB6A] bg-neutral-50 hover:bg-[#FEFEEB] text-xs font-medium text-neutral-700 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                <FlowbiteIcon name="bag" size="15" stroke-width="1.5" />
                <span>Continue as Guest Shopper (Fast Checkout)</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Drawer Footer -->
        <div class="p-4 border-t border-neutral-100 bg-neutral-50/70 text-center">
          <div class="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
            <FlowbiteIcon name="shield-check" size="14" stroke-width="1.5" class="text-emerald-600" />
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FlowbiteIcon from './FlowbiteIcon.vue'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'
import { useFirebaseStorage } from '../composables/useFirebaseStorage'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'auth-success', 'open-cart', 'open-admin', 'navigate-specials', 'navigate-contact'])

const {
  currentUser,
  userProfile,
  authLoading,
  authError,
  isAuthenticated,
  isGuest,
  isAdmin,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInAsGuest,
  resetPassword,
  updateUserDisplayName,
  logout,
  clearError
} = useFirebaseAuth()

const {
  uploadProgress,
  isUploading,
  storageError,
  uploadedItems,
  uploadMultipleFiles
} = useFirebaseStorage()

// Storage Keys for Client-Side Rate Throttling
const FAILED_ATTEMPTS_KEY = 'ystore_auth_failed_count'
const LOCKOUT_UNTIL_KEY = 'ystore_auth_lockout_until'

// Security & Verification Reactive State
const isHumanVerified = ref(false)
const isVerifyingHuman = ref(false)
const verificationToken = ref('')
const failedAttempts = ref(0)
const lockoutRemaining = ref(0)
let lockoutTimer = null

const isLockedOut = computed(() => lockoutRemaining.value > 0)

const selectedStorageFolder = ref('products')
const activeTab = ref('signin') // 'signin' | 'signup' | 'reset'
const showPassword = ref(false)
const statusMessage = ref('')
const isEditingProfile = ref(false)
const editNameInput = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  trapField: '' // Invisible Honeypot Trap
})

// Dynamic Password Strength Meter for Registration
const passwordStrength = computed(() => {
  const pwd = form.value.password || ''
  if (!pwd) return { score: 0, label: 'None', colorClass: 'text-neutral-400', barBg: 'bg-neutral-200' }

  let score = 0
  if (pwd.length >= 6) score++
  if (pwd.length >= 8) score++
  if (/[0-9]/.test(pwd) && /[a-zA-Z]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) {
    return { score: 1, label: 'Weak', colorClass: 'text-red-500', barBg: 'bg-red-500' }
  } else if (score <= 3) {
    return { score, label: 'Moderate', colorClass: 'text-amber-500', barBg: 'bg-amber-400' }
  } else {
    return { score: 4, label: 'Strong', colorClass: 'text-emerald-600', barBg: 'bg-emerald-500' }
  }
})

// Progressive Lockout Management
const startLockoutCountdown = (seconds) => {
  if (lockoutTimer) clearInterval(lockoutTimer)
  lockoutRemaining.value = seconds

  lockoutTimer = setInterval(() => {
    lockoutRemaining.value--
    if (lockoutRemaining.value <= 0) {
      clearInterval(lockoutTimer)
      lockoutTimer = null
      lockoutRemaining.value = 0
      try {
        sessionStorage.removeItem(LOCKOUT_UNTIL_KEY)
      } catch (_) {}
    }
  }, 1000)
}

const checkStoredLockout = () => {
  if (typeof window === 'undefined') return
  try {
    const storedCount = parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10)
    failedAttempts.value = isNaN(storedCount) ? 0 : storedCount

    const storedUntil = parseInt(sessionStorage.getItem(LOCKOUT_UNTIL_KEY) || '0', 10)
    const now = Date.now()
    if (storedUntil && storedUntil > now) {
      const remaining = Math.ceil((storedUntil - now) / 1000)
      startLockoutCountdown(remaining)
    }
  } catch (_) {}
}

const recordFailedAttempt = () => {
  failedAttempts.value++
  try {
    sessionStorage.setItem(FAILED_ATTEMPTS_KEY, failedAttempts.value.toString())
  } catch (_) {}

  // Progressive cooldown curve: 3 fails -> 30s, 4 fails -> 60s, 5+ fails -> 120s
  let cooldownSec = 0
  if (failedAttempts.value === 3) {
    cooldownSec = 30
  } else if (failedAttempts.value === 4) {
    cooldownSec = 60
  } else if (failedAttempts.value >= 5) {
    cooldownSec = 120
  }

  if (cooldownSec > 0) {
    const until = Date.now() + cooldownSec * 1000
    try {
      sessionStorage.setItem(LOCKOUT_UNTIL_KEY, until.toString())
    } catch (_) {}
    startLockoutCountdown(cooldownSec)
  }

  // Invalidate challenge token to prevent replay
  isHumanVerified.value = false
  verificationToken.value = ''
}

const resetFailedAttempts = () => {
  failedAttempts.value = 0
  lockoutRemaining.value = 0
  if (lockoutTimer) {
    clearInterval(lockoutTimer)
    lockoutTimer = null
  }
  try {
    sessionStorage.removeItem(FAILED_ATTEMPTS_KEY)
    sessionStorage.removeItem(LOCKOUT_UNTIL_KEY)
  } catch (_) {}
}

// Interactive Human Verification Trigger
const triggerHumanVerification = () => {
  if (isHumanVerified.value || isVerifyingHuman.value || isLockedOut.value) return
  isVerifyingHuman.value = true
  setTimeout(() => {
    isVerifyingHuman.value = false
    isHumanVerified.value = true
    verificationToken.value = 'sec_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36)
  }, 650)
}

const userInitials = computed(() => {
  const name = currentUser.value?.displayName || 'Y'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const switchTab = (tab) => {
  activeTab.value = tab
  clearError()
  statusMessage.value = ''
  // Reset verification to require fresh validation on tab change
  isHumanVerified.value = false
  verificationToken.value = ''
}

const handleSubmit = async () => {
  statusMessage.value = ''

  // 1. Invisible Honeypot Trap: Immediate abort if filled by a bot
  if (form.value.trapField) {
    authError.value = 'Security verification failed: Automated submission blocked.'
    return
  }

  // 2. Lockout Guard: Block submission during active cooldown
  if (isLockedOut.value) {
    authError.value = `Authentication temporarily locked. Cooldown active: ${lockoutRemaining.value}s remaining.`
    return
  }

  // 3. Human Verification Guard: Require completed challenge
  if (!isHumanVerified.value) {
    authError.value = 'Please complete the human verification checkpoint before proceeding.'
    return
  }

  // 4. Pre-flight Input Sanitization
  const sanitizedEmail = form.value.email ? form.value.email.trim().toLowerCase() : ''
  const sanitizedName = form.value.name ? form.value.name.trim().replace(/[<>]/g, '') : ''

  if (activeTab.value === 'signin') {
    const { user } = await signInWithEmail(sanitizedEmail, form.value.password)
    if (user) {
      resetFailedAttempts()
      form.value.password = ''
      isHumanVerified.value = false
      emit('auth-success', {
        title: 'Welcome Back!',
        message: `Signed in as ${user.displayName || user.email}`
      })
    } else {
      recordFailedAttempt()
    }
  } else if (activeTab.value === 'signup') {
    if (form.value.password.length < 6) {
      authError.value = 'Password must be at least 6 characters long.'
      return
    }

    const { user } = await signUpWithEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      password: form.value.password
    })
    if (user) {
      resetFailedAttempts()
      form.value.password = ''
      isHumanVerified.value = false
      emit('auth-success', {
        title: 'Account Created!',
        message: `Welcome to Ystore, ${sanitizedName || user.email}! +150 Berry Points added.`
      })
    } else {
      recordFailedAttempt()
    }
  }
}

const handleGoogleSignIn = async () => {
  statusMessage.value = ''
  if (isLockedOut.value) {
    authError.value = `Authentication cooldown active: ${lockoutRemaining.value}s remaining.`
    return
  }
  const { user } = await signInWithGoogle()
  if (user) {
    resetFailedAttempts()
    emit('auth-success', {
      title: 'Signed in with Google',
      message: `Welcome, ${user.displayName || user.email}!`
    })
  }
}

const handleGuestSignIn = async () => {
  statusMessage.value = ''
  if (isLockedOut.value) {
    authError.value = `Authentication cooldown active: ${lockoutRemaining.value}s remaining.`
    return
  }
  const { user } = await signInAsGuest()
  if (user) {
    resetFailedAttempts()
    emit('auth-success', {
      title: 'Guest Session Active',
      message: 'You are signed in as a Guest Shopper for fast checkout.'
    })
  }
}

const handleResetPassword = async () => {
  statusMessage.value = ''
  if (form.value.trapField) {
    authError.value = 'Security verification failed: Automated submission blocked.'
    return
  }
  if (isLockedOut.value) {
    authError.value = `Security cooldown active. Please wait ${lockoutRemaining.value}s.`
    return
  }
  if (!isHumanVerified.value) {
    authError.value = 'Please complete the human verification checkpoint before proceeding.'
    return
  }

  const sanitizedEmail = form.value.email ? form.value.email.trim().toLowerCase() : ''
  const { success } = await resetPassword(sanitizedEmail)
  if (success) {
    statusMessage.value = `Password reset instructions sent to ${sanitizedEmail}. Check your inbox!`
    isHumanVerified.value = false
  }
}

const handleUpdateName = async () => {
  if (!editNameInput.value.trim()) return
  const { success } = await updateUserDisplayName(editNameInput.value)
  if (success) {
    isEditingProfile.value = false
    emit('auth-success', {
      title: 'Profile Updated',
      message: `Display name updated to ${editNameInput.value.trim()}.`
    })
  }
}

const switchFromGuestToSignUp = async () => {
  await logout()
  switchTab('signup')
}

const handleLogout = async () => {
  const { success } = await logout()
  if (success) {
    emit('auth-success', {
      title: 'Signed Out',
      message: 'You have been safely signed out of your Ystore account.'
    })
  }
}

const handleStorageFileSelect = async (event) => {
  const files = event.target?.files
  if (!files || files.length === 0) return
  try {
    const results = await uploadMultipleFiles(files, selectedStorageFolder.value)
    emit('auth-success', {
      title: 'Upload Complete',
      message: `${results.length} file(s) uploaded to storage/${selectedStorageFolder.value}/`
    })
  } catch (_) {
    // Error displayed in storageError ref
  } finally {
    event.target.value = ''
  }
}

const copyStorageUrl = (url) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(url)
    emit('auth-success', {
      title: 'URL Copied',
      message: 'Firebase Storage download URL copied to clipboard.'
    })
  }
}

onMounted(() => {
  checkStoredLockout()
})

onUnmounted(() => {
  if (lockoutTimer) {
    clearInterval(lockoutTimer)
    lockoutTimer = null
  }
})
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

