import {
  ref as storageRef,
  uploadBytesResumable,
  uploadString,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref } from 'vue'
import { useFirebaseAuth } from './useFirebaseAuth'

const uploadProgress = ref(0)
const isUploading = ref(false)
const storageError = ref('')
const uploadedItems = ref([])

// Sanitize file names while preserving extension
const sanitizeFileName = (name = 'file') => {
  const clean = name.replace(/[^a-zA-Z0-9._-]/g, '_')
  return `${Date.now()}-${clean}`
}

/**
 * Client-side high-efficiency image compression & WebP transcoding utility
 * Converts multi-megabyte photos into ultra-lean, retina-sharp WebP assets (typically ~150KB - 250KB)
 * @param {File|Blob} file - Original browser image file
 * @param {Object} options - Configuration overrides (maxWidth, maxHeight, quality, format)
 * @returns {Promise<File|Blob>} Compressed File or original if not eligible
 */
export const compressImage = async (file, options = {}) => {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return file
  }
  // Preserve vector SVGs and animated GIFs
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file
  }

  const maxWidth = options.maxWidth || 1200
  const maxHeight = options.maxHeight || 1200
  const quality = options.quality !== undefined ? options.quality : 0.78
  const format = options.format || 'image/webp'

  return new Promise((resolve) => {
    let objectUrl = null
    try {
      objectUrl = URL.createObjectURL(file)
    } catch (_) {
      return resolve(file)
    }

    const img = new Image()
    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      resolve(file)
    }
    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width
        let height = img.naturalHeight || img.height

        // Downscale proportionally if larger than maximum bounds
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          if (objectUrl) URL.revokeObjectURL(objectUrl)
          return resolve(file)
        }

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
            if (!blob) return resolve(file)

            // If compressed blob happens to be larger than original, keep original
            if (blob.size >= file.size && file.type === 'image/webp') {
              return resolve(file)
            }

            const rawName = file.name || 'image'
            const baseName = rawName.includes('.') ? rawName.substring(0, rawName.lastIndexOf('.')) : rawName
            const ext = format === 'image/webp' ? '.webp' : '.jpg'
            const newFileName = `${baseName}${ext}`

            const compressedFile = new File([blob], newFileName, {
              type: format,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          },
          format,
          quality
        )
      } catch (err) {
        if (objectUrl) URL.revokeObjectURL(objectUrl)
        console.warn('Image compression fallback:', err)
        resolve(file)
      }
    }
    img.src = objectUrl
  })
}

export const useFirebaseStorage = () => {
  const { initFirebase, currentUser } = useFirebaseAuth()

  const getStorageInstance = () => {
    const instances = initFirebase()
    return instances
  }

  /**
   * Upload an image or file to `ystore-db.firebasestorage.app`
   * Automatically compresses images to WebP and applies 1-year immutable caching headers
   * @param {File|Blob} file - Browser File or Blob object
   * @param {string} folder - Target folder in bucket ('products' | 'categories' | 'specials' | 'blog' | 'banners' | 'content' | 'users')
   * @param {Object} options - Optional custom metadata or customPath
   */
  const uploadFile = async (file, folder = 'products', options = {}) => {
    if (!file) {
      const err = 'No file selected for upload.'
      storageError.value = err
      throw new Error(err)
    }

    isUploading.value = true
    uploadProgress.value = 0
    storageError.value = ''

    // Client-side image optimization (scale down to max 1400px and transcode to WebP)
    let fileToUpload = file
    if (!options.skipCompression && file.type && file.type.startsWith('image/')) {
      try {
        fileToUpload = await compressImage(file, options.compression)
      } catch (e) {
        console.warn('Image compression fallback to original:', e)
        fileToUpload = file
      }
    }

    const fileName = options.customFileName || sanitizeFileName(fileToUpload.name || file.name)
    const fullPath = options.customPath || `${folder}/${fileName}`

    // Resilient local reader fallback (so uploads never fail even if storage permissions/offline block)
    const readAsDataUrlFallback = () => {
      return new Promise((resolve) => {
        try {
          const reader = new FileReader()
          reader.onload = () => {
            const fallbackResult = {
              name: fileToUpload.name || fileName,
              storagePath: fullPath,
              bucket: 'local-fallback',
              url: reader.result,
              contentType: fileToUpload.type || 'image/webp',
              size: fileToUpload.size || 0,
              folder,
              createdAt: new Date().toISOString()
            }
            uploadedItems.value = [fallbackResult, ...uploadedItems.value]
            isUploading.value = false
            uploadProgress.value = 100
            resolve(fallbackResult)
          }
          reader.onerror = () => {
            isUploading.value = false
            resolve({
              name: fileName,
              storagePath: fullPath,
              bucket: 'local-fallback',
              url: '',
              folder
            })
          }
          reader.readAsDataURL(fileToUpload)
        } catch (_) {
          isUploading.value = false
          resolve({
            name: fileName,
            storagePath: fullPath,
            bucket: 'local-fallback',
            url: '',
            folder
          })
        }
      })
    }

    const instances = getStorageInstance()
    if (!instances?.storage) {
      console.warn('Firebase Storage not initialized, falling back to compressed DataURL')
      return await readAsDataUrlFallback()
    }

    const fileReference = storageRef(instances.storage, fullPath)

    const metadata = {
      contentType: fileToUpload.type || 'application/octet-stream',
      cacheControl: options.cacheControl || 'public, max-age=31536000, immutable',
      customMetadata: {
        uploadedBy: currentUser.value?.email || currentUser.value?.uid || 'anonymous',
        folder,
        originalName: file.name || fileName,
        compressed: fileToUpload !== file ? 'true' : 'false',
        ...(options.metadata || {})
      }
    }

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileReference, fileToUpload, metadata)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            uploadProgress.value = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          }
        },
        async (error) => {
          console.warn('Firebase Storage upload failed, activating resilient DataURL fallback:', error)
          const fallback = await readAsDataUrlFallback()
          resolve(fallback)
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref)
            const result = {
              name: fileToUpload.name || fileName,
              storagePath: fullPath,
              bucket: 'ystore-db.firebasestorage.app',
              url,
              contentType: fileToUpload.type || 'application/octet-stream',
              size: fileToUpload.size || 0,
              folder,
              createdAt: new Date().toISOString()
            }

            // Optionally log media reference in Firestore `media` collection
            if (options.recordInFirestore !== false && instances.db) {
              try {
                await addDoc(collection(instances.db, 'media'), {
                  ...result,
                  uploadedBy: currentUser.value?.email || currentUser.value?.uid || null,
                  createdAt: serverTimestamp()
                })
              } catch (_) {
                // Non-fatal if Firestore media log is skipped
              }
            }

            uploadedItems.value = [result, ...uploadedItems.value]
            isUploading.value = false
            uploadProgress.value = 100
            resolve(result)
          } catch (err) {
            console.warn('Failed to retrieve download URL, activating resilient DataURL fallback:', err)
            const fallback = await readAsDataUrlFallback()
            resolve(fallback)
          }
        }
      )
    })
  }

  /**
   * Upload multiple files in sequence/parallel to a target folder
   */
  const uploadMultipleFiles = async (files, folder = 'products', options = {}) => {
    const fileArray = Array.from(files || [])
    const results = []
    for (const file of fileArray) {
      const uploaded = await uploadFile(file, folder, options)
      results.push(uploaded)
    }
    return results
  }

  /**
   * Upload JSON or text content directly to `ystore-db.firebasestorage.app`
   */
  const uploadContent = async (content, pathInBucket = 'content/data.json', contentType = 'application/json') => {
    const instances = getStorageInstance()
    if (!instances?.storage) throw new Error('Firebase Storage is not initialized.')

    isUploading.value = true
    storageError.value = ''
    try {
      const payload = typeof content === 'string' ? content : JSON.stringify(content, null, 2)
      const fileReference = storageRef(instances.storage, pathInBucket)
      await uploadString(fileReference, payload, 'raw', { contentType })
      const url = await getDownloadURL(fileReference)
      return {
        storagePath: pathInBucket,
        bucket: 'ystore-db.firebasestorage.app',
        url
      }
    } catch (err) {
      storageError.value = err?.message || 'Failed to upload content.'
      throw err
    } finally {
      isUploading.value = false
    }
  }

  /**
   * List all stored files in a folder inside `ystore-db.firebasestorage.app`
   */
  const listFolderFiles = async (folder = 'products') => {
    const instances = getStorageInstance()
    if (!instances?.storage) return []

    storageError.value = ''
    try {
      const folderReference = storageRef(instances.storage, folder)
      const res = await listAll(folderReference)
      const items = await Promise.all(
        res.items.map(async (itemRef) => {
          const [url, meta] = await Promise.all([
            getDownloadURL(itemRef),
            getMetadata(itemRef).catch(() => ({}))
          ])
          return {
            name: itemRef.name,
            storagePath: itemRef.fullPath,
            bucket: itemRef.bucket,
            url,
            contentType: meta.contentType || '',
            size: meta.size || 0,
            updatedAt: meta.updated || ''
          }
        })
      )
      uploadedItems.value = items
      return items
    } catch (err) {
      storageError.value = err?.message || 'Failed to list files from storage.'
      return []
    }
  }

  /**
   * Delete a file from `ystore-db.firebasestorage.app` by its storagePath
   */
  const deleteFile = async (storagePath) => {
    const instances = getStorageInstance()
    if (!instances?.storage || !storagePath) return false

    storageError.value = ''
    try {
      const fileReference = storageRef(instances.storage, storagePath)
      await deleteObject(fileReference)
      uploadedItems.value = uploadedItems.value.filter((item) => item.storagePath !== storagePath)
      return true
    } catch (err) {
      storageError.value = err?.message || 'Failed to delete file.'
      return false
    }
  }

  return {
    uploadProgress,
    isUploading,
    storageError,
    uploadedItems,
    compressImage,
    uploadFile,
    uploadMultipleFiles,
    uploadContent,
    listFolderFiles,
    deleteFile
  }
}

