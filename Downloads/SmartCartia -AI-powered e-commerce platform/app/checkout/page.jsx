"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCart, getCartTotal, clearCart } from "@/lib/cart-utils"
import { formatCurrency } from "@/lib/utils"
import { useCurrency } from "@/components/currency-provider"
import { ChevronLeft, CreditCard, Truck, Check } from "lucide-react"

export default function CheckoutPage() {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const { currency } = useCurrency()

  useEffect(() => {
    setMounted(true)
    setCart(getCart())
    setTotal(getCartTotal())
  }, [])

  const handleSubmitShipping = (e) => {
    e.preventDefault()
    setStep(2)
    window.scrollTo(0, 0)
  }

  const handleSubmitPayment = (e) => {
    e.preventDefault()
    setStep(3)
    window.scrollTo(0, 0)
    // In a real app, we would process payment here
    // For demo purposes, we'll just clear the cart
    setTimeout(() => {
      clearCart()
    }, 1000)
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <p>Loading checkout...</p>
      </div>
    )
  }

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Checkout Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            2
          </div>
          <div className={`w-12 h-1 ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            3
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your shipping details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitShipping} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip">Postal Code</Label>
                      <Input id="zip" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" defaultValue="India" required />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" asChild>
                      <Link href="/cart">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Cart
                      </Link>
                    </Button>
                    <Button type="submit">
                      Continue to Payment
                      <Truck className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Enter your payment details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Shipping
                    </Button>
                    <Button type="submit">
                      Complete Order
                      <CreditCard className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Check className="mr-2 h-6 w-6 text-green-500" />
                  Order Confirmed
                </CardTitle>
                <CardDescription>Thank you for your purchase!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="mb-4">Your order has been placed successfully.</p>
                  <p className="mb-4">Order #: {Math.floor(Math.random() * 1000000)}</p>
                  <p className="text-muted-foreground mb-8">We've sent a confirmation email with your order details.</p>
                  <Button asChild>
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {step < 3 ? (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                        className="flex justify-between"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatCurrency(item.price, currency)}
                          </p>
                          {item.selectedColor && (
                            <p className="text-xs text-muted-foreground">Color: {item.selectedColor}</p>
                          )}
                          {item.selectedSize && (
                            <p className="text-xs text-muted-foreground">Size: {item.selectedSize}</p>
                          )}
                        </div>
                        <p className="font-medium">{formatCurrency(item.price * item.quantity, currency)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between mb-2">
                      <p>Subtotal</p>
                      <p className="font-medium">{formatCurrency(total, currency)}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p>Shipping</p>
                      <p className="font-medium">{formatCurrency(total > 100 ? 0 : 10, currency)}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p>Tax</p>
                      <p className="font-medium">{formatCurrency(total * 0.18, currency)}</p>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <p>Total</p>
                      <p>{formatCurrency(total + (total > 100 ? 0 : 10) + total * 0.18, currency)}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Your order has been placed successfully.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
