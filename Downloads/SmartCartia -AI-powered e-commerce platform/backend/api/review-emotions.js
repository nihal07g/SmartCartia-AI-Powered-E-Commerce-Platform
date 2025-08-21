import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"

const execPromise = promisify(exec)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    // In a real implementation, you would fetch reviews from a database
    // Here we're using the sample reviews from the frontend
    const reviewsPath = path.join(process.cwd(), "data", "reviews.json")
    const reviewsData = JSON.parse(fs.readFileSync(reviewsPath, "utf8"))

    const productReviews = reviewsData.filter((review) => review.productId === productId)

    if (productReviews.length === 0) {
      return NextResponse.json({ error: "No reviews found for this product" }, { status: 404 })
    }

    // Call the Python script to analyze emotions
    const scriptPath = path.join(process.cwd(), "ml", "review_emotion_analyzer.py")

    // Write reviews to a temporary file for the Python script to read
    const tempFilePath = path.join(process.cwd(), "temp", `reviews_${productId}.json`)
    fs.writeFileSync(tempFilePath, JSON.stringify(productReviews))

    // Execute the Python script
    const { stdout, stderr } = await execPromise(
      `python ${scriptPath} --input ${tempFilePath} --output ${tempFilePath}.out`,
    )

    if (stderr) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Error analyzing reviews" }, { status: 500 })
    }

    // Read the output file
    const analysisResult = JSON.parse(fs.readFileSync(`${tempFilePath}.out`, "utf8"))

    // Clean up temporary files
    fs.unlinkSync(tempFilePath)
    fs.unlinkSync(`${tempFilePath}.out`)

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
