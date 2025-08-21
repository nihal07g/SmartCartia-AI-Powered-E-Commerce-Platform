"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { getCart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal } from "@/lib/cart-utils"
import { useCurrency } from "@/components/currency-provider"

export default function Cart({ onClose }) {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { currency } = useCurrency()
  const [mounted, setMounted] = useState(false)

  // Load cart on mount and listen for updates
  useEffect(() => {
    setMounted(true)
    const loadCart = () => {
      const cartItems = getCart()
      setCart(cartItems)
      setTotal(getCartTotal())
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

  const handleRemoveItem = (id, color, size) => {
    removeFromCart(id, color, size)
  }

  const handleUpdateQuantity = (id, quantity, color, size) => {
    updateCartItemQuantity(id, quantity, color, size)
  }

  const handleClearCart = () => {
    clearCart()
  }

  const handleCheckout = () => {
    if (onClose) onClose()
  }

  const handleContinueShopping = () => {
    if (onClose) onClose()
  }

  if (isLoading) {
    return <div className="py-8 text-center">Loading cart...</div>
  }

  if (cart.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Button asChild onClick={handleContinueShopping}>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {cart.map((item) => (
        <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4 py-4 border-b">
          <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-medium">{item.name}</h4>
            <div className="text-sm text-muted-foreground">
              {item.selectedColor && <span className="mr-2">Color: {item.selectedColor}</span>}
              {item.selectedSize && <span>Size: {item.selectedSize}</span>}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none rounded-l-md"
                  onClick={() =>
                    handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1), item.selectedColor, item.selectedSize)
                  }
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <div className="w-8 text-center text-sm">{item.quantity}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none rounded-r-md"
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
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-medium">
                  {mounted
                    ? formatCurrency(item.price * item.quantity, currency)
                    : formatCurrency(item.price * item.quantity, "INR")}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveItem(item.id, item.selectedColor, item.selectedSize)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-4 border-t">
        <div className="flex justify-between mb-4">
          <span>Subtotal</span>
          <span className="font-medium">
            {mounted ? formatCurrency(total, currency) : formatCurrency(total, "INR")}
          </span>
        </div>
        <Button className="w-full mb-2" asChild onClick={handleCheckout}>
          <Link href="/checkout">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Checkout
          </Link>
        </Button>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" className="w-full" onClick={handleContinueShopping}>
            Continue Shopping
          </Button>
          <Button variant="outline" className="w-auto" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
