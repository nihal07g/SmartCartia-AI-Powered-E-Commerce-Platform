// This file adapts logic from your existing lib/products.js and lib/extended-products.js
// For a real application, you'd likely connect to a database here.

// Build server-side catalog by adapting lib/products.js for API usage
const { getAllProducts } = require('../../lib/products')
const baseProducts = getAllProducts().map(p => ({
  id: String(p.id),
  name: p.name,
  category: p.category,
  price: p.price,
  description: p.description,
  image: Array.isArray(p.images) && p.images.length ? p.images[0] : '/placeholder.svg',
  rating: p.rating || 0,
  reviews: p.reviews || p.reviewCount || 0,
  tags: p.tags || [],
}))

// Derive simple related by same category
const allProducts = baseProducts.map(p => ({
  ...p,
  relatedProductIds: baseProducts.filter(x => x.id !== p.id && x.category === p.category).slice(0, 4).map(x => x.id),
}))

const getProducts = ({ category, searchTerm, page = 1, limit = 12, sortBy, sortOrder = "asc" } = {}) => {
  let filteredProducts = [...allProducts]

  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
  }

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearchTerm) ||
        p.description.toLowerCase().includes(lowerSearchTerm) ||
        (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm))),
    )
  }

  if (sortBy) {
    filteredProducts.sort((a, b) => {
      let valA = a[sortBy]
      let valB = b[sortBy]

      if (typeof valA === "string") valA = valA.toLowerCase()
      if (typeof valB === "string") valB = valB.toLowerCase()

      if (valA < valB) return sortOrder === "asc" ? -1 : 1
      if (valA > valB) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }

  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / limit)
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  return {
    products: paginatedProducts,
    totalProducts,
    totalPages,
    currentPage: Number.parseInt(page, 10),
    limit: Number.parseInt(limit, 10),
  }
}

const getProductById = (id) => {
  return allProducts.find((p) => p.id === id)
}

const getCategories = () => {
  const categories = [...new Set(allProducts.map((p) => p.category))]
  return categories.map((category) => ({
    name: category,
    // You might want to add more details like image, product count etc.
    image: `/placeholder.svg?width=200&height=150&query=${encodeURIComponent(category)}`,
    productCount: allProducts.filter((p) => p.category === category).length,
  }))
}

const getRelatedProducts = (productId, count = 4) => {
  const product = getProductById(productId)
  if (!product || !product.relatedProductIds) return []

  const related = product.relatedProductIds.map((id) => getProductById(id)).filter((p) => p != null) // Filter out any nulls if an ID doesn't match

  // If not enough from relatedProductIds, fill with same category (excluding self)
  if (related.length < count && product.category) {
    const categoryProducts = allProducts.filter((p) => p.category === product.category && p.id !== productId)
    const needed = count - related.length
    for (let i = 0; i < categoryProducts.length && related.length < count; i++) {
      if (!related.find((rp) => rp.id === categoryProducts[i].id)) {
        related.push(categoryProducts[i])
      }
    }
  }
  return related.slice(0, count)
}

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  getRelatedProducts,
  allProducts, // Exporting allProducts for direct use if needed by other backend modules
}
