"use client"

import { getProductById, getRelatedProducts } from "@/lib/products"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { useCurrency } from "@/components/currency-provider"
import { useState, useEffect } from "react"

export default function RelatedProducts({ currentProductId }) {
  const { currency } = useCurrency()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentProduct = getProductById(currentProductId)

  if (!currentProduct) {
    return null
  }

  const relatedProducts = getRelatedProducts(currentProduct, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group block">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 mb-3">
              <img
                src={product.images[0] || "/placeholder.svg?height=300&width=300&query=product"}
                alt={product.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
            </div>
            <h3 className="text-sm font-medium">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
            <p className="mt-1 font-medium">
              {mounted ? formatCurrency(product.price, currency) : formatCurrency(product.price, "USD")}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
