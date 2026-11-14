/**
 * Resolves static asset paths against Nuxt's runtime baseURL.
 * Handles root-relative paths like '/images/icon.svg' so they load correctly
 * regardless of whether the site is hosted at the domain root ('/')
 * or on a repository subpath ('/staging-yberry.store/').
 */
export const useAsset = (path) => {
  if (!path) return ''
  const str = typeof path === 'object' && path?.url ? String(path.url) : (typeof path === 'string' ? path : '')
  if (!str) return ''
  
  // Return external URLs and data URIs untouched
  if (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('data:') ||
    str.startsWith('blob:') ||
    str.startsWith('//')
  ) {
    return str
  }

  try {
    const config = useRuntimeConfig()
    const base = config.app?.baseURL || '/'
    const cleanBase = base.endsWith('/') ? base : `${base}/`
    const cleanPath = str.startsWith('/') ? str.slice(1) : str

    // If path already starts with the base path, don't duplicate it
    if (base !== '/' && str.startsWith(base)) {
      return str
    }

    return `${cleanBase}${cleanPath}`
  } catch {
    return str
  }
}

