"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Gift, Tag, Bell } from "lucide-react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail("")

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1000)
  }

  return (
    <section className="mb-16">
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 border-none">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold">Stay Updated with SmartCartia</h2>
              <p className="text-muted-foreground">
                Subscribe to our newsletter for exclusive deals, new arrivals, and special offers.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-2">
                  <Gift className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Special Offers</h4>
                    <p className="text-sm text-muted-foreground">Exclusive deals and promotions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Tag className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Exclusive Discounts</h4>
                    <p className="text-sm text-muted-foreground">Subscriber-only pricing</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Bell className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">New Arrivals</h4>
                    <p className="text-sm text-muted-foreground">Be first to know about new products</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Product Updates</h4>
                    <p className="text-sm text-muted-foreground">Latest product information</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Thank You for Subscribing!</h3>
                  <p className="text-muted-foreground">You'll now receive updates on our latest offers and products.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Subscribe to Our Newsletter</h3>
                    <p className="text-sm text-muted-foreground">Join 50,000+ shoppers who receive our updates.</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Subscribing..." : "Subscribe Now"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By subscribing, you agree to our Privacy Policy and Terms of Service. We'll send you marketing
                    promotions and updates.
                  </p>
                </form>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
