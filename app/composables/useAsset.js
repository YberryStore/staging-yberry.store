/**
 * Resolves static asset paths against Nuxt's runtime baseURL.
 * Handles root-relative paths like '/images/icon.svg' so they load correctly
 * regardless of whether the site is hosted at the domain root ('/')
 * or on a repository subpath ('/staging-yberry.store/').
 */
export const useAsset = (path) => {
  if (!path || typeof path !== 'string') return path || ''
  
  // Return external URLs and data URIs untouched
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('//')
  ) {
    return path
  }

  try {
    const config = useRuntimeConfig()
    const base = config.app?.baseURL || '/'
    const cleanBase = base.endsWith('/') ? base : `${base}/`
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    // If path already starts with the base path, don't duplicate it
    if (base !== '/' && path.startsWith(base)) {
      return path
    }

    return `${cleanBase}${cleanPath}`
  } catch {
    return path
  }
}
