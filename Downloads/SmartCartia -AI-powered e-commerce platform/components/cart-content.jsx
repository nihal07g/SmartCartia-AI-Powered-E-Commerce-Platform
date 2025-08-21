"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useCurrency } from "@/components/currency-provider"
import { getCart, removeFromCart, updateCartItemQuantity, getCartTotal } from "@/lib/cart-utils"

export function CartContent() {
  const [cart, setCart] = useState([])
  const [mounted, setMounted] = useState(false)
  const { currency } = useCurrency()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)

    const loadCart = () => {
      const cartItems = getCart()
      setCart(cartItems)
      setIsLoading(false)
    }

    loadCart()

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("storage", (e) => {
      if (e.key === "cart") handleCartUpdate()
    })

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("storage", handleCartUpdate)
    }
  }, [])

  const handleUpdateQuantity = (itemId, quantity, color, size) => {
    updateCartItemQuantity(itemId, quantity, color, size)
  }

  const handleRemoveFromCart = (itemId, color, size) => {
    removeFromCart(itemId, color, size)
  }

  if (isLoading) {
    return <div className="py-8 text-center">Loading cart...</div>
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-center font-medium">Quantity</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-right font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="border-b">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-secondary">
                        {item.image && (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        {item.selectedColor && (
                          <p className="text-sm text-muted-foreground">Color: {item.selectedColor}</p>
                        )}
                        {item.selectedSize && (
                          <p className="text-sm text-muted-foreground">Size: {item.selectedSize}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                            item.selectedColor,
                            item.selectedSize,
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      <div className="w-12 text-center border-y border-input h-8 flex items-center justify-center">
                        {item.quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            Math.min(10, item.quantity + 1),
                            item.selectedColor,
                            item.selectedSize,
                          )
                        }
                        disabled={item.quantity >= 10}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">{formatCurrency(item.price, currency)}</td>
                  <td className="px-4 py-4 text-right">{formatCurrency(item.price * item.quantity, currency)}</td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFromCart(item.id, item.selectedColor, item.selectedSize)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t">
                <td colSpan={3} className="px-4 py-4 text-right font-medium">
                  Subtotal
                </td>
                <td className="px-4 py-4 text-right font-medium">{formatCurrency(getCartTotal(), currency)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <Link href="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link href="/checkout">
          <Button>Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  )
}
