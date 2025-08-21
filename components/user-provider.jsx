"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { safeLocalStorage } from "@/lib/api-utils"

// Create the user context
const UserContext = createContext({
  user: null,
  isLoading: true,
  login: () => null,
  logout: () => null,
})

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Load user from localStorage on component mount
  useEffect(() => {
    setMounted(true)
    try {
      const storedUser = safeLocalStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Failed to load user:", error)
    } finally {
      setIsLoading(false)
    }

    // Listen for login/logout events
    const handleUserLogin = () => {
      try {
        const storedUser = safeLocalStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to load user after login:", error)
      }
    }

    const handleUserLogout = () => {
      setUser(null)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("userLogin", handleUserLogin)
      window.addEventListener("userLogout", handleUserLogout)

      return () => {
        window.removeEventListener("userLogin", handleUserLogin)
        window.removeEventListener("userLogout", handleUserLogout)
      }
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    try {
      safeLocalStorage.setItem("user", JSON.stringify(userData))
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("userLogin"))
      }
    } catch (error) {
      console.error("Failed to save user data:", error)
    }
  }

  const logout = () => {
    setUser(null)
    try {
      safeLocalStorage.removeItem("user")
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("userLogout"))
      }
    } catch (error) {
      console.error("Failed to remove user data:", error)
    }
  }

  // Use a consistent initial state for server rendering
  const contextValue = {
    user: user,
    isLoading: isLoading,
    login: login,
    logout: logout,
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
