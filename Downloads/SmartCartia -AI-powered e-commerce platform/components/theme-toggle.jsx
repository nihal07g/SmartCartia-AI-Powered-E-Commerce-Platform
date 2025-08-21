"use client"

import { Button } from "@/components/ui/button"
import { Sun } from "lucide-react"

export default function ThemeToggle() {
  return (
    <Button variant="ghost" size="icon" className="rounded-full" aria-label="Light mode" disabled>
      <Sun className="h-5 w-5" />
      <span className="sr-only">Light mode</span>
    </Button>
  )
}
