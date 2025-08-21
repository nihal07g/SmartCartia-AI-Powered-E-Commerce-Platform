const express = require("express")
const router = express.Router()
const { getProducts, getProductById, getCategories, getRelatedProducts } = require("../data/products")

// GET /api/products
router.get("/", (req, res) => {
  const { category, searchTerm, page, limit, sortBy, sortOrder } = req.query
  try {
    const result = getProducts({ category, searchTerm, page, limit, sortBy, sortOrder })
    res.json(result)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ error: "Failed to fetch products" })
  }
})

// GET /api/products/categories
router.get("/categories", (req, res) => {
  try {
    const categories = getCategories()
    res.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

// GET /api/products/:id
router.get("/:id", (req, res) => {
  try {
    const product = getProductById(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ error: "Product not found" })
    }
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error)
    res.status(500).json({ error: "Failed to fetch product" })
  }
})

// GET /api/products/:id/related
router.get("/:id/related", (req, res) => {
  try {
    const related = getRelatedProducts(req.params.id)
    res.json(related)
  } catch (error) {
    console.error(`Error fetching related products for ${req.params.id}:`, error)
    res.status(500).json({ error: "Failed to fetch related products" })
  }
})

module.exports = router
