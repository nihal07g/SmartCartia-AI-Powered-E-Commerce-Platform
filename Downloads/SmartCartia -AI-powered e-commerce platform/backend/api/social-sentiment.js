import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execPromise = promisify(exec)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    // Get product name from product ID
    // In a real implementation, you would fetch this from a database
    const productName = getProductNameById(productId)

    if (!productName) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Call the Python script to analyze social media sentiment
    const scriptPath = path.join(process.cwd(), "ml", "social_media_sentiment_analyzer.py")

    // Execute the Python script
    const { stdout, stderr } = await execPromise(`python ${scriptPath} --product "${productName}" --count 50`)

    if (stderr) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Error analyzing social media sentiment" }, { status: 500 })
    }

    // Parse the output
    const analysisResult = JSON.parse(stdout)

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to get product name by ID
// In a real implementation, this would query a database
function getProductNameById(productId) {
  const productMap = {
    1: "Premium Wireless Headphones",
    2: "Smart Fitness Watch",
    3: "Casual Cotton T-Shirt",
    4: "Ergonomic Office Chair",
    5: "Bestselling Novel",
    6: "Professional DSLR Camera",
    7: "Designer Handbag",
    8: "Stainless Steel Water Bottle",
  }

  return productMap[productId] || null
}
