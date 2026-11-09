import { initializeApp, getApps, getApp, deleteApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  sendPasswordResetEmail,
  updateProfile,
  signOut
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { ref, computed } from 'vue'

// Shared singleton state across components
const currentUser = ref(null)
const userProfile = ref(null)
const authReady = ref(false)
const authLoading = ref(false)
const authError = ref('')
const pendingApprovalInfo = ref(null)

let firebaseApp = null
let firebaseAuth = null
let firestoreDb = null
let firebaseStorage = null
let authListenerInitialized = false

const SUPER_ADMIN_EMAILS = [
  'info@yberry.co.za',
  'admin@yellowberry.store',
  'admin@ystoreza.co.za',
  'support@yellowberry.store'
]
const isSuperAdminEmail = (email) => SUPER_ADMIN_EMAILS.includes((email || '').toLowerCase().trim())

// Friendly error messages for Firebase Auth error codes
const formatAuthError = (error) => {
  const code = error?.code || ''
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please check your credentials and try again.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled yet in the Firebase Console (ystore-db > Authentication > Sign-in method).'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.'
    default:
      return error?.message || 'An unexpected authentication error occurred.'
  }
}

export const useFirebaseAuth = () => {
  const config = useRuntimeConfig()

  const initFirebase = () => {
    if (typeof window === 'undefined') return null

    if (!firebaseApp) {
      const firebaseConfig = {
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        projectId: config.public.firebaseProjectId,
        storageBucket: config.public.firebaseStorageBucket,
        messagingSenderId: config.public.firebaseMessagingSenderId,
        appId: config.public.firebaseAppId,
        measurementId: config.public.firebaseMeasurementId
      }

      firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
      firebaseAuth = getAuth(firebaseApp)
      firestoreDb = getFirestore(firebaseApp)
      firebaseStorage = getStorage(firebaseApp, `gs://${config.public.firebaseStorageBucket || 'ystore-db.firebasestorage.app'}`)
    }

    if (!authListenerInitialized && firebaseAuth) {
      authListenerInitialized = true
      onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          let tokenResult = null
          try {
            tokenResult = await user.getIdTokenResult()
          } catch (e) {
            // ignore token parse error
          }
          const isSuperAdmin =
            !!tokenResult?.claims?.admin ||
            tokenResult?.claims?.role === 'super_admin' ||
            isSuperAdminEmail(user.email)

          // Check if user is an approved CMS staff admin
          let isStaffAdmin = false
          let staffRole = 'customer'
          if (!isSuperAdmin && user.email) {
            try {
              const cached = JSON.parse(localStorage.getItem('ystore_admin_users') || '[]')
              const found = cached.find((u) => (u.email || '').toLowerCase() === user.email.toLowerCase())
              if (found && found.status === 'active' && (found.approvedAt || found.active !== false)) {
                isStaffAdmin = true
                staffRole = found.role || 'Store Staff'
              }
            } catch {}
          }

          const hasAdminPrivilege = isSuperAdmin || isStaffAdmin

          currentUser.value = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || (isSuperAdmin ? 'Laban Le Fleur' : (user.isAnonymous ? 'Guest Shopper' : user.email?.split('@')[0] || 'Ystore Member')),
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
            emailVerified: user.emailVerified,
            isAdmin: hasAdminPrivilege,
            role: isSuperAdmin ? 'super_admin' : (isStaffAdmin ? staffRole : (user.isAnonymous ? 'guest' : 'customer')),
            providerId: user.providerData?.[0]?.providerId || (user.isAnonymous ? 'anonymous' : 'password'),
            createdAt: user.metadata?.creationTime
          }
          await syncUserProfile(user, { isAdmin: hasAdminPrivilege, role: isSuperAdmin ? 'super_admin' : (isStaffAdmin ? staffRole : 'customer') })
        } else {
          currentUser.value = null
          userProfile.value = null
        }
        authReady.value = true
      })
    }

    return { app: firebaseApp, auth: firebaseAuth, db: firestoreDb, storage: firebaseStorage }
  }

  // Sync user document in Firestore `users/{uid}` (gracefully degrades if Firestore rules aren't open yet)
  const syncUserProfile = async (user, extraData = {}) => {
    if (!firestoreDb || !user) return
    const isSuper = extraData.isAdmin || isSuperAdminEmail(user.email)
    const defaultTier = isSuper ? 'Super Admin' : (user.isAnonymous ? 'Guest' : 'Yellow Berry Club')
    const defaultPoints = isSuper ? 9999 : (user.isAnonymous ? 0 : 150)
    const defaultRole = isSuper ? 'super_admin' : (user.isAnonymous ? 'guest' : 'customer')

    try {
      const userRef = doc(firestoreDb, 'users', user.uid)
      const snap = await getDoc(userRef)
      const baseData = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || extraData.displayName || (isSuper ? 'Laban Le Fleur' : (user.isAnonymous ? 'Guest Shopper' : 'Ystore Member')),
        photoURL: user.photoURL || null,
        isAnonymous: user.isAnonymous || false,
        isAdmin: isSuper,
        role: defaultRole,
        lastLoginAt: serverTimestamp(),
        ...extraData
      }

      if (!snap.exists()) {
        await setDoc(userRef, {
          ...baseData,
          rewardPoints: defaultPoints,
          tier: defaultTier,
          createdAt: serverTimestamp()
        })
        userProfile.value = {
          ...baseData,
          rewardPoints: defaultPoints,
          tier: defaultTier
        }
      } else {
        await setDoc(userRef, baseData, { merge: true })
        userProfile.value = { ...snap.data(), ...baseData }
      }
    } catch (err) {
      // Fallback profile in memory if Firestore has not been provisioned or rules block write
      userProfile.value = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || extraData.displayName || (isSuper ? 'Laban Le Fleur' : (user.isAnonymous ? 'Guest Shopper' : 'Ystore Member')),
        isAnonymous: user.isAnonymous,
        isAdmin: isSuper,
        role: defaultRole,
        rewardPoints: defaultPoints,
        tier: defaultTier
      }
    }
  }

  // 1. Email & Password Sign In
  const signInWithEmail = async (email, password) => {
    initFirebase()
    authLoading.value = true
    authError.value = ''
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password)
      return { user: cred.user, error: null }
    } catch (err) {
      const msg = formatAuthError(err)
      authError.value = msg
      return { user: null, error: msg }
    } finally {
      authLoading.value = false
    }
  }

  // 2. Email & Password Sign Up
  const signUpWithEmail = async ({ name, email, password }) => {
    initFirebase()
    authLoading.value = true
    authError.value = ''
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password)
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name.trim() })
        currentUser.value = {
          ...currentUser.value,
          displayName: name.trim()
        }
      }
      await syncUserProfile(cred.user, { displayName: name?.trim() })
      return { user: cred.user, error: null }
    } catch (err) {
      const msg = formatAuthError(err)
      authError.value = msg
      return { user: null, error: msg }
    } finally {
      authLoading.value = false
    }
  }

  // 3. Google Sign-In (OAuth Popup)
  const signInWithGoogle = async () => {
    initFirebase()
    authLoading.value = true
    authError.value = ''
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      const cred = await signInWithPopup(firebaseAuth, provider)
      await syncUserProfile(cred.user)
      return { user: cred.user, error: null }
    } catch (err) {
      const msg = formatAuthError(err)
      authError.value = msg
      return { user: null, error: msg }
    } finally {
      authLoading.value = false
    }
  }

  // 4. Guest / Anonymous Checkout Auth
  const signInAsGuest = async () => {
    initFirebase()
    authLoading.value = true
    authError.value = ''
    try {
      const cred = await signInAnonymously(firebaseAuth)
      await syncUserProfile(cred.user, { displayName: 'Guest Shopper' })
      return { user: cred.user, error: null }
    } catch (err) {
      const msg = formatAuthError(err)
      authError.value = msg
      return { user: null, error: msg }
    } finally {
      authLoading.value = false
    }
  }

  // 5. Password Reset Email
  const resetPassword = async (email) => {
    initFirebase()
    authLoading.value = true
    authError.value = ''
    try {
      await sendPasswordResetEmail(firebaseAuth, email.trim())
      return { success: true, error: null }
    } catch (err) {
      const msg = formatAuthError(err)
      authError.value = msg
      return { success: false, error: msg }
    } finally {
      authLoading.value = false
    }
  }

  // 6. Update User Display Name
  const updateUserDisplayName = async (newName) => {
    initFirebase()
    if (!firebaseAuth?.currentUser || !newName?.trim()) return { success: false }
    authLoading.value = true
    authError.value = ''
    try {
      await updateProfile(firebaseAuth.currentUser, { displayName: newName.trim() })
      currentUser.value = {
        ...currentUser.value,
        displayName: newName.trim()
      }
      await syncUserProfile(firebaseAuth.currentUser, { displayName: newName.trim() })
      return { success: true, error: null }
    } catch (err) {
      const msg = formatAuthError(err)
      authError.value = msg
      return { success: false, error: msg }
    } finally {
      authLoading.value = false
    }
  }

  // 7. Provision & Send Team Member Invitation / Instructions Email
  const sendTeamMemberInvite = async ({ email, name, role, department }) => {
    initFirebase()
    if (!email || !email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' }
    }

    const trimmedEmail = email.trim().toLowerCase()
    let authUserCreated = false

    // Step 1: Provision user account in Firebase Auth using a transient secondary app
    // This allows creating the Auth credentials without signing out the Super Admin.
    if (typeof window !== 'undefined') {
      const appName = `InviteWorker_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      let workerApp = null
      try {
        const firebaseConfig = {
          apiKey: config.public.firebaseApiKey,
          authDomain: config.public.firebaseAuthDomain,
          projectId: config.public.firebaseProjectId,
          storageBucket: config.public.firebaseStorageBucket,
          messagingSenderId: config.public.firebaseMessagingSenderId,
          appId: config.public.firebaseAppId,
          measurementId: config.public.firebaseMeasurementId
        }
        workerApp = initializeApp(firebaseConfig, appName)
        const workerAuth = getAuth(workerApp)

        // Generate temporary secure initial password; user sets their own upon opening the email link
        const tempPassword = `YStore!${Math.random().toString(36).slice(2, 9)}${Math.random().toString(36).slice(2, 9).toUpperCase()}#`
        const cred = await createUserWithEmailAndPassword(workerAuth, trimmedEmail, tempPassword)
        if (cred?.user && name?.trim()) {
          try {
            await updateProfile(cred.user, { displayName: name.trim() })
          } catch (_) {}
        }
        authUserCreated = true
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          // User already exists in Auth, which is expected for existing staff
          authUserCreated = true
        } else {
          console.warn('Auto-provisioning Auth user returned:', err?.code || err)
        }
      } finally {
        if (workerApp) {
          try {
            await deleteApp(workerApp)
          } catch (_) {}
        }
      }
    }

    // Step 2: Dispatch password setup & instructions email via Firebase Auth
    let emailSent = false
    let emailError = null
    try {
      const actionCodeSettings = {
        url: typeof window !== 'undefined' ? `${window.location.origin}` : 'https://yellowberry.store',
        handleCodeInApp: false
      }
      try {
        await sendPasswordResetEmail(firebaseAuth, trimmedEmail, actionCodeSettings)
        emailSent = true
      } catch (uriErr) {
        // Fallback to standard Firebase action URL if domain is not whitelisted in console
        await sendPasswordResetEmail(firebaseAuth, trimmedEmail)
        emailSent = true
      }
    } catch (err) {
      emailError = formatAuthError(err)
      console.warn('Failed to send invite email via Firebase:', err)
    }

    const portalUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : 'https://yberrystore.github.io/staging-yberry.store/'
    const subject = 'Welcome to the Yellow Berry Store Team — Staff Access Instructions'
    const body = `Hi ${name || 'Team Member'},

You have been granted access to the Yellow Berry Store administrative portal as "${role || 'Staff'}" (${department || 'Store Operations'}).

Here are your instructions to access the system:
1. Open the storefront portal: ${portalUrl}
2. Click the Account icon in the top header and select "Sign In".
3. If you have not created your private password yet, click "Forgot password?" and enter your email address (${trimmedEmail}).
4. Check your inbox (and Spam/Junk folder for sender noreply@ystore-db.firebaseapp.com) for the password creation link and set your private password.
5. Return to the site, sign in, and you will have full access to your assigned administration dashboard permissions.

If you have any questions or require assistance, please reach out to the store administrator.

Warm regards,
Yellow Berry Store Team`

    return {
      success: emailSent,
      emailSent,
      authUserCreated,
      error: emailError,
      inviteDetails: {
        email: trimmedEmail,
        name: name || '',
        role: role || 'Store Staff',
        department: department || 'Operations',
        portalUrl,
        subject,
        body
      }
    }
  }

  // 8. Sign Out
  const logout = async () => {
    initFirebase()
    authLoading.value = true
    authError.value = ''
    try {
      await signOut(firebaseAuth)
      currentUser.value = null
      userProfile.value = null
      return { success: true }
    } catch (err) {
      const msg = formatAuthError(err)
      authError.value = msg
      return { success: false, error: msg }
    } finally {
      authLoading.value = false
    }
  }

  // 9. Sign in with Google for CMS Portal Access
  // Strictly checks administrator approval before allowing entry to CMS
  const signInCmsWithGoogle = async () => {
    initFirebase()
    authLoading.value = true
    authError.value = ''
    pendingApprovalInfo.value = null

    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      provider.setCustomParameters({ prompt: 'select_account' })

      const cred = await signInWithPopup(firebaseAuth, provider)
      if (!cred || !cred.user) {
        throw new Error('Google Sign-In was cancelled or failed to return a user session.')
      }

      const emailLower = (cred.user.email || '').trim().toLowerCase()
      if (!emailLower) {
        await signOut(firebaseAuth)
        throw new Error('This Google account does not have a verified email address.')
      }

      // Check A: Super Administrator (Always granted full access)
      if (isSuperAdminEmail(emailLower)) {
        await syncUserProfile(cred.user, { isAdmin: true, role: 'super_admin' })
        return { user: cred.user, isAdmin: true, error: null }
      }

      // Check B: Query admin_users in Firestore and local storage
      let matched = null
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'admin_users', cred.user.uid))
          if (snap.exists()) {
            matched = { id: snap.id, ...snap.data() }
          }
        } catch (_) {}
      }

      if (!matched && typeof window !== 'undefined') {
        try {
          const cached = JSON.parse(localStorage.getItem('ystore_admin_users') || '[]')
          matched = cached.find((u) => (u.email || '').toLowerCase() === emailLower)
        } catch (_) {}
      }

      // Check C: If account is approved and active
      if (matched && matched.status === 'active' && (matched.approvedAt || matched.active !== false)) {
        await syncUserProfile(cred.user, { isAdmin: true, role: matched.role || 'Store Staff' })
        return { user: cred.user, isAdmin: true, error: null }
      }

      // Check D: If account is explicitly suspended
      if (matched && matched.status === 'suspended') {
        await signOut(firebaseAuth)
        currentUser.value = null
        throw new Error('This staff account has been suspended by an administrator.')
      }

      // Check E: User is pending approval OR brand-new Google Sign-In
      // Register or update pending record in admin_users
      const pendingRecord = {
        id: matched?.id || cred.user.uid,
        uid: cred.user.uid,
        email: emailLower,
        name: cred.user.displayName || matched?.name || emailLower.split('@')[0],
        displayName: cred.user.displayName || matched?.name || emailLower.split('@')[0],
        role: matched?.role || 'Store Staff (Pending Approval)',
        department: matched?.department || 'Store Operations',
        photoURL: cred.user.photoURL || null,
        provider: 'google',
        status: 'pending',
        active: false,
        registeredAt: matched?.registeredAt || new Date().toISOString(),
        createdAt: matched?.createdAt || new Date().toISOString()
      }

      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'admin_users', pendingRecord.id), {
            ...pendingRecord,
            updatedAt: serverTimestamp()
          }, { merge: true })
        } catch (e) {
          console.warn('Could not write pending record to Firestore admin_users:', e)
        }
      }

      if (typeof window !== 'undefined') {
        try {
          const cached = JSON.parse(localStorage.getItem('ystore_admin_users') || '[]')
          const idx = cached.findIndex((u) => (u.email || '').toLowerCase() === emailLower)
          if (idx !== -1) {
            cached[idx] = { ...cached[idx], ...pendingRecord }
          } else {
            cached.push(pendingRecord)
          }
          localStorage.setItem('ystore_admin_users', JSON.stringify(cached))
        } catch (_) {}
      }

      // REVOKE SESSION IMMEDIATELY: User cannot browse CMS until an admin approves
      await signOut(firebaseAuth)
      currentUser.value = null

      pendingApprovalInfo.value = {
        email: emailLower,
        displayName: pendingRecord.displayName,
        photoURL: cred.user.photoURL || null,
        provider: 'google',
        registeredAt: new Date().toLocaleDateString()
      }

      return {
        user: null,
        pendingApproval: true,
        pendingInfo: pendingApprovalInfo.value,
        error: null
      }
    } catch (err) {
      const msg = formatAuthError(err)
      authError.value = msg
      return { user: null, error: msg }
    } finally {
      authLoading.value = false
    }
  }

  // 10. Sign in with Email for CMS Portal Access
  const signInCmsWithEmail = async (email, password) => {
    initFirebase()
    authLoading.value = true
    authError.value = ''
    pendingApprovalInfo.value = null
    const emailLower = email.trim().toLowerCase()

    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, emailLower, password)
      if (!cred || !cred.user) throw new Error('Authentication failed.')

      if (isSuperAdminEmail(emailLower)) {
        await syncUserProfile(cred.user, { isAdmin: true, role: 'super_admin' })
        return { user: cred.user, isAdmin: true, error: null }
      }

      // Check admin_users
      let matched = null
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'admin_users', cred.user.uid))
          if (snap.exists()) matched = snap.data()
        } catch (_) {}
      }
      if (!matched && typeof window !== 'undefined') {
        try {
          const cached = JSON.parse(localStorage.getItem('ystore_admin_users') || '[]')
          matched = cached.find((u) => (u.email || '').toLowerCase() === emailLower)
        } catch (_) {}
      }

      if (matched && matched.status === 'active' && (matched.approvedAt || matched.active !== false)) {
        await syncUserProfile(cred.user, { isAdmin: true, role: matched.role || 'Store Staff' })
        return { user: cred.user, isAdmin: true, error: null }
      }

      if (matched && matched.status === 'suspended') {
        await signOut(firebaseAuth)
        currentUser.value = null
        throw new Error('This administrator account has been suspended by an administrator.')
      }

      // User exists or is pending: Revoke session and show awaiting approval
      await signOut(firebaseAuth)
      currentUser.value = null

      pendingApprovalInfo.value = {
        email: emailLower,
        displayName: matched?.name || cred.user.displayName || emailLower.split('@')[0],
        provider: 'email',
        registeredAt: matched?.registeredAt || new Date().toLocaleDateString()
      }

      return {
        user: null,
        pendingApproval: true,
        pendingInfo: pendingApprovalInfo.value,
        error: null
      }
    } catch (err) {
      const msg = formatAuthError(err)
      authError.value = msg
      return { user: null, error: msg }
    } finally {
      authLoading.value = false
    }
  }

  // 11. Request CMS Staff Access (Self-Registration)
  const requestCmsAccessWithEmail = async ({ name, email, password, department }) => {
    initFirebase()
    authLoading.value = true
    authError.value = ''
    pendingApprovalInfo.value = null
    const emailLower = email.trim().toLowerCase()

    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, emailLower, password)
      if (name && cred.user) {
        try {
          await updateProfile(cred.user, { displayName: name.trim() })
        } catch (_) {}
      }

      const pendingRecord = {
        id: cred.user.uid,
        uid: cred.user.uid,
        email: emailLower,
        name: name.trim() || emailLower.split('@')[0],
        displayName: name.trim() || emailLower.split('@')[0],
        role: 'Store Staff (Pending Approval)',
        department: department || 'Store Operations',
        status: 'pending',
        active: false,
        provider: 'email',
        registeredAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }

      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'admin_users', cred.user.uid), {
            ...pendingRecord,
            createdAt: serverTimestamp()
          }, { merge: true })
        } catch (e) {
          console.warn('Firestore admin_users write error:', e)
        }
      }

      if (typeof window !== 'undefined') {
        try {
          const cached = JSON.parse(localStorage.getItem('ystore_admin_users') || '[]')
          cached.push(pendingRecord)
          localStorage.setItem('ystore_admin_users', JSON.stringify(cached))
        } catch (_) {}
      }

      // Immediately sign out so account remains locked until approval
      await signOut(firebaseAuth)
      currentUser.value = null

      pendingApprovalInfo.value = {
        email: emailLower,
        displayName: name.trim(),
        provider: 'email',
        registeredAt: new Date().toLocaleDateString()
      }

      return { success: true, pendingInfo: pendingApprovalInfo.value, error: null }
    } catch (err) {
      const msg = formatAuthError(err)
      authError.value = msg
      return { success: false, error: msg }
    } finally {
      authLoading.value = false
    }
  }

  const clearError = () => {
    authError.value = ''
  }

  const isAuthenticated = computed(() => !!currentUser.value)
  const isGuest = computed(() => !!currentUser.value?.isAnonymous)
  const isAdmin = computed(() => {
    if (!currentUser.value) return false
    if (currentUser.value.isAdmin) return true
    if (isSuperAdminEmail(currentUser.value.email)) return true
    if (userProfile.value?.role === 'super_admin') return true
    if (typeof window !== 'undefined' && currentUser.value.email) {
      try {
        const cached = JSON.parse(localStorage.getItem('ystore_admin_users') || '[]')
        const found = cached.find((u) => (u.email || '').toLowerCase() === currentUser.value.email.toLowerCase())
        if (found && found.status === 'active' && (found.approvedAt || found.active !== false)) {
          return true
        }
      } catch (_) {}
    }
    return false
  })

  return {
    currentUser,
    userProfile,
    authReady,
    authLoading,
    authError,
    pendingApprovalInfo,
    isAuthenticated,
    isGuest,
    isAdmin,
    initFirebase,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInCmsWithGoogle,
    signInCmsWithEmail,
    requestCmsAccessWithEmail,
    signInAsGuest,
    resetPassword,
    updateUserDisplayName,
    sendTeamMemberInvite,
    logout,
    clearError
  }
}

