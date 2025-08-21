"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCurrency } from "@/components/currency-provider"
import { ChevronsUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="h-8 w-24"></div> // Placeholder with similar dimensions
  }

  const currencyLabels = {
    USD: "$ USD",
    INR: "₹ INR",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          {currencyLabels[currency]}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setCurrency("USD")}>$ USD</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("INR")}>₹ INR</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
