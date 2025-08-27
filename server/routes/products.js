const express = require("express")
const router = express.Router()
const ProductRepository = require("../../repositories/ProductRepository")
const CategoryRepository = require("../../repositories/CategoryRepository")
const { getProducts, getProductById, getCategories, getRelatedProducts } = require("../data/products")

// Initialize repositories
const productRepo = new ProductRepository()
const categoryRepo = new CategoryRepository()

// GET /api/products
router.get("/", async (req, res) => {
  const { 
    category, 
    search, 
    page = 1, 
    limit = 20, 
    sortBy = 'created_at', 
    sortOrder = 'DESC',
    featured,
    bestseller,
    isNew,
    priceMin,
    priceMax
  } = req.query

  try {
    // Try database first, fallback to static data
    try {
      const options = {
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        category,
        search,
        sortBy,
        sortOrder,
        featured: featured ? featured === 'true' : undefined,
        bestseller: bestseller ? bestseller === 'true' : undefined,
        isNew: isNew ? isNew === 'true' : undefined,
        priceMin: priceMin ? parseFloat(priceMin) : undefined,
        priceMax: priceMax ? parseFloat(priceMax) : undefined
      }

      const products = await productRepo.findAll(options)
      
      res.json({
        products: products.map(p => p.toJSON()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products.length,
          hasMore: products.length === parseInt(limit)
        }
      })
    } catch (dbError) {
      console.warn("Database query failed, using static data:", dbError.message)
      // Fallback to static data
      const result = getProducts({ 
        category, 
        searchTerm: search, 
        page, 
        limit, 
        sortBy, 
        sortOrder 
      })
      res.json(result)
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ error: "Failed to fetch products" })
  }
})

// GET /api/products/featured
router.get("/featured", async (req, res) => {
  const { limit = 10 } = req.query

  try {
    try {
      const products = await productRepo.getFeatured(parseInt(limit))
      res.json(products.map(p => p.toJSON()))
    } catch (dbError) {
      console.warn("Database query failed, using static data:", dbError.message)
      const result = getProducts({ featured: true, limit })
      res.json(result.products || [])
    }
  } catch (error) {
    console.error("Error fetching featured products:", error)
    res.status(500).json({ error: "Failed to fetch featured products" })
  }
})

// GET /api/products/bestsellers
router.get("/bestsellers", async (req, res) => {
  const { limit = 10 } = req.query

  try {
    try {
      const products = await productRepo.getBestsellers(parseInt(limit))
      res.json(products.map(p => p.toJSON()))
    } catch (dbError) {
      console.warn("Database query failed, using static data:", dbError.message)
      const result = getProducts({ bestseller: true, limit })
      res.json(result.products || [])
    }
  } catch (error) {
    console.error("Error fetching bestseller products:", error)
    res.status(500).json({ error: "Failed to fetch bestseller products" })
  }
})

// GET /api/products/new
router.get("/new", async (req, res) => {
  const { limit = 10 } = req.query

  try {
    try {
      const products = await productRepo.getNew(parseInt(limit))
      res.json(products.map(p => p.toJSON()))
    } catch (dbError) {
      console.warn("Database query failed, using static data:", dbError.message)
      const result = getProducts({ isNew: true, limit })
      res.json(result.products || [])
    }
  } catch (error) {
    console.error("Error fetching new products:", error)
    res.status(500).json({ error: "Failed to fetch new products" })
  }
})

// GET /api/products/search
router.get("/search", async (req, res) => {
  const { q, limit = 20, page = 1 } = req.query

  if (!q) {
    return res.status(400).json({ error: "Search query is required" })
  }

  try {
    try {
      const options = {
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      }
      const products = await productRepo.search(q, options)
      res.json({
        products: products.map(p => p.toJSON()),
        query: q,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products.length,
          hasMore: products.length === parseInt(limit)
        }
      })
    } catch (dbError) {
      console.warn("Database search failed, using static data:", dbError.message)
      const result = getProducts({ searchTerm: q, limit, page })
      res.json(result)
    }
  } catch (error) {
    console.error("Error searching products:", error)
    res.status(500).json({ error: "Failed to search products" })
  }
})

// GET /api/products/categories
router.get("/categories", async (req, res) => {
  try {
    try {
      const Category = require("../../models/Category")
      const categories = await Category.findAll({ 
        includeProductCount: true,
        isActive: true 
      })
      res.json(categories.map(c => c.toJSON()))
    } catch (dbError) {
      console.warn("Database query failed, using static data:", dbError.message)
      const categories = getCategories()
      res.json(categories)
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

// GET /api/products/stats
router.get("/stats", async (req, res) => {
  try {
    try {
      const stats = await productRepo.getStats()
      res.json(stats)
    } catch (dbError) {
      console.warn("Database query failed:", dbError.message)
      // Return basic stats from static data
      const allProducts = getProducts({ limit: 1000 })
      res.json({
        totalProducts: allProducts.products?.length || 0,
        activeProducts: allProducts.products?.length || 0,
        featuredProducts: allProducts.products?.filter(p => p.featured)?.length || 0,
        categories: getCategories()?.length || 0
      })
    }
  } catch (error) {
    console.error("Error fetching product stats:", error)
    res.status(500).json({ error: "Failed to fetch product statistics" })
  }
})

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    try {
      const product = await productRepo.findById(req.params.id)
      if (product) {
        // Track product view
        await productRepo.trackEvent(req.params.id, 'view', {
          sessionId: req.sessionID,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }).catch(err => console.warn("Failed to track view:", err.message))
        
        res.json(product.toJSON())
      } else {
        res.status(404).json({ error: "Product not found" })
      }
    } catch (dbError) {
      console.warn("Database query failed, using static data:", dbError.message)
      const product = getProductById(req.params.id)
      if (product) {
        res.json(product)
      } else {
        res.status(404).json({ error: "Product not found" })
      }
    }
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error)
    res.status(500).json({ error: "Failed to fetch product" })
  }
})

// GET /api/products/:id/related
router.get("/:id/related", async (req, res) => {
  const { limit = 4 } = req.query

  try {
    try {
      const related = await productRepo.getRelated(req.params.id, parseInt(limit))
      res.json(related.map(p => p.toJSON()))
    } catch (dbError) {
      console.warn("Database query failed, using static data:", dbError.message)
      const related = getRelatedProducts(req.params.id)
      res.json(related)
    }
  } catch (error) {
    console.error(`Error fetching related products for ${req.params.id}:`, error)
    res.status(500).json({ error: "Failed to fetch related products" })
  }
})

module.exports = router
