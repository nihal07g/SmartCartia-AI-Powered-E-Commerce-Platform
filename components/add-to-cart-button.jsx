"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MinusIcon, PlusIcon, ShoppingCart, Check, ShoppingBag } from "lucide-react"
import { addToCart } from "@/lib/cart-utils"
import { formatCurrency } from "@/lib/utils"
import { useCurrency } from "@/components/currency-provider"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Cart from "@/components/cart"

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null,
  )
  const [selectedSize, setSelectedSize] = useState(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { currency } = useCurrency()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset selected options when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : null)
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null)
      setQuantity(1)
      setIsAdded(false)
    }
  }, [product])

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10))
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
  }

  const handleSizeChange = (size) => {
    setSelectedSize(size)
  }

  const handleAddToCart = () => {
    if (!product.inStock) return

    setIsAdding(true)

    // Add the item to cart using the utility function
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : null,
      quantity,
      selectedColor,
      selectedSize,
    })

    // Show success state
    setIsAdded(true)
    setIsAdding(false)

    // Reset success state after 3 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 3000)
  }

  const handleViewCart = () => {
    router.push("/cart")
  }

  const openCart = () => {
    setIsCartOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Price Display */}
      <div className="text-xl font-bold">
        {mounted ? formatCurrency(product.price, currency) : formatCurrency(product.price, "INR")}
      </div>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium">Color:</span>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                className={`h-8 px-3 rounded-md text-sm ${
                  selectedColor === color
                    ? "bg-primary text-primary-foreground"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleColorChange(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium">Size:</span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`h-8 w-10 rounded-md text-sm ${
                  selectedSize === size
                    ? "bg-primary text-primary-foreground"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleSizeChange(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center">
        <span className="mr-4 text-sm font-medium">Quantity:</span>
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none rounded-l-md"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isAdding || isAdded}
          >
            <MinusIcon className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <div className="w-12 text-center">{quantity}</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none rounded-r-md"
            onClick={incrementQuantity}
            disabled={quantity >= 10 || isAdding || isAdded}
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          className={`w-full ${isAdded ? "bg-green-600 hover:bg-green-700" : ""}`}
          size="lg"
          onClick={handleAddToCart}
          disabled={isAdding || !product.inStock}
        >
          {isAdded ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Added to Cart
            </>
          ) : isAdding ? (
            "Adding..."
          ) : product.inStock ? (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          ) : (
            "Out of Stock"
          )}
        </Button>

        {isAdded && (
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto" onClick={openCart}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                View Cart
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
                  <Cart onClose={() => setIsCartOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Stock Status */}
      {product.inStock ? (
        <p className="text-sm text-green-600 dark:text-green-400">
          In Stock {product.stockQuantity && `(${product.stockQuantity} available)`}
        </p>
      ) : (
        <p className="text-sm text-red-600 dark:text-red-400">Out of Stock</p>
      )}
    </div>
  )
}
