"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { safeLocalStorage } from "@/lib/api-utils"

// Create the currency context
const CurrencyContext = createContext({
  currency: "INR",
  setCurrency: () => null,
})

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("INR") // Default to INR
  const [mounted, setMounted] = useState(false)

  // Load currency preference from localStorage on component mount
  useEffect(() => {
    setMounted(true)
    try {
      const storedCurrency = safeLocalStorage.getItem("currency")
      if (storedCurrency) {
        setCurrency(storedCurrency)
      }
    } catch (error) {
      console.error("Failed to load currency preference:", error)
    }
  }, [])

  // Save currency preference to localStorage whenever it changes
  useEffect(() => {
    if (!mounted) return

    try {
      safeLocalStorage.setItem("currency", currency)
    } catch (error) {
      console.error("Failed to save currency preference:", error)
    }
  }, [currency, mounted])

  // Use a consistent initial state for server rendering
  const contextValue = {
    currency: mounted ? currency : "INR",
    setCurrency: mounted ? setCurrency : () => null,
  }

  return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>
}

// Custom hook to use the currency context
export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
