"use client"
import ProductGrid from "@/components/product-grid"
import PaginationControls from "@/components/pagination-controls"
import { fetchFromBackend } from "@/lib/api-utils"

async function getProductsData(searchParams) {
  const page = searchParams.page || "1"
  const limit = searchParams.limit || "12"
  const query = new URLSearchParams({ page, limit, ...searchParams }).toString()

  try {
    const data = await fetchFromBackend(`/products?${query}`)
    return data
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return { products: [], totalProducts: 0, totalPages: 0, currentPage: 1 }
  }
}

export default async function ProductsPage({ searchParams }) {
  const { products, totalProducts, totalPages, currentPage } = await getProductsData(searchParams)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
      {products && products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/products"
            currentParams={searchParams}
          />
        </>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  )
}
