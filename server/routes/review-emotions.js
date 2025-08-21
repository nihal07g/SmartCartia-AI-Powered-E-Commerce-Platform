const express = require("express")
const router = express.Router()
const { exec } = require("child_process")
const path = require("path")
const { getProductById } = require("../data/products") // Assuming product data is here

// Dummy reviews data - in a real app, this would come from a database
const productReviewsDB = {
  1: [
    {
      id: "r1",
      productId: "1",
      userId: "u1",
      rating: 5,
      comment: "Absolutely love these headphones! Amazing sound quality.",
      timestamp: "2023-10-01T10:00:00Z",
    },
    {
      id: "r2",
      productId: "1",
      userId: "u2",
      rating: 4,
      comment: "Very good, noise cancellation is effective.",
      timestamp: "2023-10-02T14:30:00Z",
    },
    {
      id: "r3",
      productId: "1",
      userId: "u3",
      rating: 3,
      comment: "Decent for the price, but expected a bit more.",
      timestamp: "2023-10-03T09:15:00Z",
    },
  ],
  // Add more reviews for other product IDs
}

const getReviewsForProduct = (productId) => {
  return productReviewsDB[productId] || []
}

router.post("/", async (req, res) => {
  const { productId } = req.body || {}
  const pythonExecutable = process.env.PYTHON_EXECUTABLE || "python"
  const mlPath = process.env.PYTHON_ML_PATH || path.join(__dirname, "../../ml") // Path to ml directory

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" })
  }

  const product = getProductById(productId)
  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }

  const reviews = getReviewsForProduct(productId)
  if (!reviews || reviews.length === 0) {
    // Return a default empty-like response if no reviews
    return res.json({
      analyses: [],
      summary: {
        total_reviews: 0,
        emotion_distribution: {},
        dominant_emotion: "N/A",
        timestamp: new Date().toISOString(),
      },
    })
  }

  // For now, we'll use the simulated logic from your Next.js API route.
  // In a real scenario with Python script:
  // const scriptPath = path.join(mlPath, 'review_emotion_analyzer.py');
  // const reviewsJsonString = JSON.stringify(reviews);
  // exec(`${pythonExecutable} "${scriptPath}" --reviews='${reviewsJsonString}'`, (error, stdout, stderr) => { ... });
  // For this refactor, I'll adapt the simulation directly.

  try {
    const emotions = ["happy", "satisfied", "neutral", "disappointed", "angry"]
    const emojis = { happy: "😊", satisfied: "😌", neutral: "😐", disappointed: "😔", angry: "😠" }

    const reviewAnalyses = reviews.map((review) => {
      let emotion
      if (review.rating === 5) emotion = Math.random() > 0.3 ? "happy" : "satisfied"
      else if (review.rating === 4) emotion = Math.random() > 0.5 ? "satisfied" : "neutral"
      else if (review.rating === 3) emotion = "neutral"
      else if (review.rating === 2) emotion = Math.random() > 0.5 ? "disappointed" : "neutral"
      else emotion = Math.random() > 0.3 ? "angry" : "disappointed"
      return {
        review_id: review.id,
        analysis: { emotion, emoji: emojis[emotion], score: Math.random(), timestamp: new Date().toISOString() },
      }
    })

    const emotionCounts = reviewAnalyses.reduce((acc, curr) => {
      acc[curr.analysis.emotion] = (acc[curr.analysis.emotion] || 0) + 1
      return acc
    }, {})

    const total = reviewAnalyses.length
    const emotionDistribution = Object.fromEntries(
      emotions.map((em) => [
        em,
        { count: emotionCounts[em] || 0, percentage: total > 0 ? ((emotionCounts[em] || 0) / total) * 100 : 0 },
      ]),
    )

    const dominantEmotion =
      total > 0
        ? Object.keys(emotionCounts).reduce((a, b) => (emotionCounts[a] > emotionCounts[b] ? a : b), emotions[0])
        : "N/A"

    res.json({
      analyses: reviewAnalyses,
      summary: {
        total_reviews: total,
        emotion_distribution: emotionDistribution,
        dominant_emotion: dominantEmotion,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error analyzing review emotions:", error)
    res.status(500).json({ error: "Failed to analyze review emotions" })
  }
})

module.exports = router
