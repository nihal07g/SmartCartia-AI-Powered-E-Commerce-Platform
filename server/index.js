// Load env variables (prefer .env.local when present)
require("dotenv").config({ path: [".env.local", ".env"] })
const express = require("express")
const cors = require("cors")
const path = require("path")

// Import database configuration
const { testConnection } = require("./db/config")

// Import routes
const productRoutes = require("./routes/products")
const reviewEmotionsRoutes = require("./routes/review-emotions")
const socialSentimentRoutes = require("./routes/social-sentiment")
const findMyProductRoutes = require("./routes/find-my-product")
// Add other routes here as you create them

const app = express()
const PORT = process.env.BACKEND_PORT || 3001

// Middleware
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: false,
  }),
) // Enable CORS for frontend
app.use(express.json()) // Parse JSON bodies

// API Routes
app.use("/api/products", productRoutes)
app.use("/api/review-emotions", reviewEmotionsRoutes)
app.use("/api/social-sentiment", socialSentimentRoutes)
app.use("/api/find-my-product", findMyProductRoutes)
// Mount other routes here

// Simple health check route
app.get("/api/health", async (req, res) => {
  const dbStatus = await testConnection()
  res.json({ 
    status: "UP",
    database: dbStatus ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  })
})

// Database status endpoint
app.get("/api/database/status", async (req, res) => {
  try {
    const { getPoolStatus } = require("./db/connection")
    const isConnected = await testConnection()
    const poolStatus = getPoolStatus()
    
    res.json({
      connected: isConnected,
      pool: poolStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ 
      error: "Database status check failed",
      message: error.message 
    })
  }
})

// Serve static assets from Next.js build in production (optional, Next.js can serve itself)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../out"))) // Assuming 'next export' or similar
  // You might need to adjust this depending on your Next.js build output and deployment strategy
}

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection()
    if (!dbConnected) {
      console.warn("⚠️  Database connection failed - running in fallback mode")
    }

    app.listen(PORT, () => {
      console.log(`🚀 Express server listening on port ${PORT}`)
      console.log(`🌐 Frontend should be available at ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`)
      console.log(`🔗 Backend API available at http://localhost:${PORT}/api`)
      console.log(`💾 Database status: ${dbConnected ? "Connected" : "Disconnected"}`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// 404 for unknown API routes (catch-all under /api)
app.use('/api', (req, res) => res.status(404).json({ error: 'API endpoint not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  const { closePool } = require("./db/connection")
  await closePool()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully')
  const { closePool } = require("./db/connection")
  await closePool()
  process.exit(0)
})

startServer()
