"use client"

import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "@/components/add-to-cart-button"
import { useCurrency } from "@/components/currency-provider"
import { useState, useEffect } from "react"

export default function ProductGrid({ products }) {
  const { currency } = useCurrency()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden group h-full flex flex-col">
          <Link href={`/products/${product.id}`} className="block">
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img
                src={product.images?.[0] || "/placeholder.svg?height=300&width=300&query=product"}
                alt={product.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              {product.new && <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">New</Badge>}
              {product.bestSeller && (
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">Best Seller</Badge>
              )}
            </div>
          </Link>
          <CardContent className="p-4 flex-grow">
            <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <div className="font-bold">
                {mounted ? formatCurrency(product.price, currency) : formatCurrency(product.price, "USD")}
              </div>
              <div className="flex text-yellow-400 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < Math.floor(product.rating) ? "★" : "☆"}</span>
                ))}
                <span className="text-muted-foreground ml-1">({product.reviews})</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 mt-auto">
            <AddToCartButton product={product} variant="secondary" className="w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
