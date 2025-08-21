"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getProductsByCategory } from "@/lib/products"
import ProductGrid from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CategoryPage() {
  const params = useParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [categoryName, setCategoryName] = useState("")
  const productsPerPage = 12

  useEffect(() => {
    // Format category name for display (convert slug to title case)
    const formatCategoryName = (slug) => {
      return decodeURIComponent(slug)
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }

    const category = params.category
    const formattedCategory = formatCategoryName(category)
    setCategoryName(formattedCategory)

    // Get products by category
    const categoryProducts = getProductsByCategory(formattedCategory)
    setProducts(categoryProducts)
    setFilteredProducts(categoryProducts)
    setLoading(false)
  }, [params.category])

  // Filter and sort products
  useEffect(() => {
    let result = [...products]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result = result.filter((product) => product.new).concat(result.filter((product) => !product.new))
        break
      case "featured":
      default:
        result = result.filter((product) => product.featured).concat(result.filter((product) => !product.featured))
        break
    }

    setFilteredProducts(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, searchQuery, sortBy])

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
      <p className="text-muted-foreground mb-6">
        Browse our collection of {products.length} {categoryName.toLowerCase()} products
      </p>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search in ${categoryName}...`}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.length > 0 ? (
        <ProductGrid products={currentProducts} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
          <Button
            onClick={() => {
              setSearchQuery("")
              setSortBy("featured")
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNumber
              if (totalPages <= 5) {
                pageNumber = i + 1
              } else if (currentPage <= 3) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i
              } else {
                pageNumber = currentPage - 2 + i
              }

              return (
                <Button
                  key={i}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  onClick={() => paginate(pageNumber)}
                  className="hidden sm:inline-flex"
                >
                  {pageNumber}
                </Button>
              )
            })}

            <span className="flex items-center px-2 sm:hidden">
              Page {currentPage} of {totalPages}
            </span>

            <Button variant="outline" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
