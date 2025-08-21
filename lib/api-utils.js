// Utility functions for API and browser storage

// Check if code is running on the client side
export const isClient = typeof window !== "undefined"

// Safe localStorage wrapper
export const safeLocalStorage = {
  getItem: (key) => {
    if (!isClient) return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return null
    }
  },

  setItem: (key, value) => {
    if (!isClient) return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error)
    }
  },

  removeItem: (key) => {
    if (!isClient) return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error)
    }
  },
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

// Fetch with error handling
export async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error)
    throw error
  }
}

export async function fetchFromBackend(endpoint, options = {}) {
  try {
    const response = await fetch(`${BACKEND_URL}/api${endpoint}`, options) // Prepend BACKEND_URL and /api

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        // Not a JSON response
      }
      const errorMessage = errorData?.error || `API error: ${response.status} ${response.statusText}`
      console.error(`Fetch error for ${BACKEND_URL}/api${endpoint}: ${errorMessage}`, errorData)
      throw new Error(errorMessage)
    }
    // Handle cases where response might not be JSON (e.g. 204 No Content)
    if (response.status === 204) {
      return null
    }
    return await response.json()
  } catch (error) {
    console.error(`Fetch error for ${BACKEND_URL}/api${endpoint}:`, error.message)
    throw error // Re-throw the original error or a new one
  }
}

// Debounce function for search inputs, etc.
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
