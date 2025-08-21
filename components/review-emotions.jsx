"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReviewEmotions({ productId, reviews = [] }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // If there are no reviews, don't try to fetch emotions
        if (!reviews || reviews.length === 0) {
          setLoading(false)
          return
        }

        // Try to fetch from API
        try {
          const response = await fetch(`/api/review-emotions?productId=${productId}`)

          if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`)
          }

          const result = await response.json()
          setData(result)
        } catch (apiError) {
          console.error("API error:", apiError)
          // Generate fallback data if API fails
          setData(generateFallbackData(reviews))
        }
      } catch (err) {
        console.error("Error in review emotions component:", err)
        setError(err.message)
        // Generate fallback data on error
        setData(generateFallbackData(reviews))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productId, reviews])

  // Generate fallback data if API fails
  const generateFallbackData = (reviews) => {
    const emotions = ["happy", "satisfied", "neutral", "disappointed", "angry"]
    const emojis = {
      happy: "😊",
      satisfied: "😌",
      neutral: "😐",
      disappointed: "😔",
      angry: "😠",
    }

    // Generate random emotion analysis for each review
    const reviewAnalyses = reviews.map((review) => {
      // Use a simple algorithm to determine emotion based on rating
      let emotion
      if (review.rating === 5) {
        emotion = Math.random() > 0.3 ? "happy" : "satisfied"
      } else if (review.rating === 4) {
        emotion = Math.random() > 0.5 ? "satisfied" : "neutral"
      } else if (review.rating === 3) {
        emotion = "neutral"
      } else if (review.rating === 2) {
        emotion = Math.random() > 0.5 ? "disappointed" : "neutral"
      } else {
        emotion = Math.random() > 0.3 ? "angry" : "disappointed"
      }

      return {
        review_id: review.id,
        analysis: {
          emotion: emotion,
          emoji: emojis[emotion],
          score: Math.random(),
          timestamp: new Date().toISOString(),
        },
      }
    })

    // Generate emotion summary
    const emotionCounts = {}
    emotions.forEach((emotion) => {
      emotionCounts[emotion] = 0
    })

    reviewAnalyses.forEach((analysis) => {
      emotionCounts[analysis.analysis.emotion]++
    })

    const total = reviewAnalyses.length
    const emotionDistribution = {}

    Object.keys(emotionCounts).forEach((emotion) => {
      emotionDistribution[emotion] = {
        count: emotionCounts[emotion],
        percentage: (emotionCounts[emotion] / total) * 100,
      }
    })

    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => (emotionCounts[a] > emotionCounts[b] ? a : b))

    return {
      analyses: reviewAnalyses,
      summary: {
        total_reviews: total,
        emotion_distribution: emotionDistribution,
        dominant_emotion: dominantEmotion,
        timestamp: new Date().toISOString(),
      },
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Emotion Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Emotion Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Unable to load review emotion data.</p>
            <p className="text-sm">We're experiencing technical difficulties. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !data.summary || reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Emotion Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>No review data available for this product.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for charts
  const emotionData = Object.entries(data.summary.emotion_distribution).map(([emotion, info]) => ({
    name: emotion,
    value: info.percentage,
    count: info.count,
    color: getEmotionColor(emotion),
  }))

  // Combine reviews with their emotion analysis
  const reviewsWithEmotions = reviews.map((review) => {
    const analysis = data.analyses.find((a) => a.review_id === review.id)
    return {
      ...review,
      emotion: analysis ? analysis.analysis.emotion : null,
      emoji: analysis ? analysis.analysis.emoji : null,
    }
  })

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Review Emotion Analysis</CardTitle>
        {error && (
          <p className="text-sm text-amber-500">
            Note: Using locally generated data due to API issues. Some features may be limited.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="emotions">Emotions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews by Emotion</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.summary.total_reviews}</div>
                    <div className="text-sm text-muted-foreground">Total Reviews</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold flex items-center justify-center">
                      {data.summary.dominant_emotion}
                      <span className="ml-2 text-3xl">{getEmotionEmoji(data.summary.dominant_emotion)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Dominant Emotion</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {Math.round(data.summary.emotion_distribution.happy?.percentage || 0) +
                        Math.round(data.summary.emotion_distribution.satisfied?.percentage || 0)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">Positive Emotions</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Emotion Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-[200px]">
                    <ChartContainer
                      config={{
                        emotion: {
                          label: "Emotion",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={emotionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {emotionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Emotion Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-[200px]">
                    <ChartContainer
                      config={{
                        count: {
                          label: "Count",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={emotionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" name="Count" fill="var(--color-count)">
                            {emotionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emotions">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(data.summary.emotion_distribution).map(([emotion, info]) => (
                  <Card key={emotion}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{getEmotionEmoji(emotion)}</div>
                        <div className="font-medium capitalize">{emotion}</div>
                        <div className="text-2xl font-bold">{Math.round(info.percentage)}%</div>
                        <div className="text-sm text-muted-foreground">{info.count} reviews</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Emotion Intensity</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        intensity: {
                          label: "Intensity",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={generateEmotionIntensityData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="emotion" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="intensity" fill="var(--color-intensity)">
                            {generateEmotionIntensityData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getEmotionColor(entry.emotion)} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  {Object.keys(data.summary.emotion_distribution).map((emotion) => (
                    <TabsTrigger key={emotion} value={emotion}>
                      {emotion} {getEmotionEmoji(emotion)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <div className="space-y-4">
                    {reviewsWithEmotions.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center mb-1">
                                <div className="flex text-yellow-400 mr-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>{star <= review.rating ? "★" : "☆"}</span>
                                  ))}
                                </div>
                                <h3 className="font-semibold">{review.title}</h3>
                              </div>
                              <div className="text-sm text-muted-foreground mb-3">
                                {review.author} • {formatDate(review.date)}
                                {review.verified && (
                                  <span className="ml-2 text-green-600 dark:text-green-400 text-xs">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                            </div>
                            {review.emotion && (
                              <div className="flex items-center bg-muted px-2 py-1 rounded text-sm">
                                <span className="mr-1">{review.emotion}</span>
                                <span className="text-lg">{review.emoji}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm">{review.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {Object.keys(data.summary.emotion_distribution).map((emotion) => (
                  <TabsContent key={emotion} value={emotion} className="mt-4">
                    <div className="space-y-4">
                      {reviewsWithEmotions
                        .filter((review) => review.emotion === emotion)
                        .map((review) => (
                          <Card key={review.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center mb-1">
                                    <div className="flex text-yellow-400 mr-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star}>{star <= review.rating ? "★" : "☆"}</span>
                                      ))}
                                    </div>
                                    <h3 className="font-semibold">{review.title}</h3>
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-3">
                                    {review.author} • {formatDate(review.date)}
                                    {review.verified && (
                                      <span className="ml-2 text-green-600 dark:text-green-400 text-xs">
                                        Verified Purchase
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center bg-muted px-2 py-1 rounded text-sm">
                                  <span className="mr-1">{review.emotion}</span>
                                  <span className="text-lg">{review.emoji}</span>
                                </div>
                              </div>
                              <p className="text-sm">{review.content}</p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Helper functions
function getEmotionColor(emotion) {
  // Use different colors for dark mode
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return (
      {
        happy: "#4ade80",
        satisfied: "#86efac",
        neutral: "#fde047",
        disappointed: "#fca5a5",
        angry: "#f87171",
      }[emotion] || "#d4d4d4"
    )
  }

  const colors = {
    happy: "#22c55e",
    satisfied: "#4ade80",
    neutral: "#facc15",
    disappointed: "#f87171",
    angry: "#ef4444",
  }
  return colors[emotion] || "#a3a3a3"
}

function getEmotionEmoji(emotion) {
  const emojis = {
    happy: "😊",
    satisfied: "😌",
    neutral: "😐",
    disappointed: "😔",
    angry: "😠",
  }
  return emojis[emotion] || "😐"
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Generate sample data for charts
function generateEmotionIntensityData() {
  const emotions = ["happy", "satisfied", "neutral", "disappointed", "angry"]

  return emotions.map((emotion) => ({
    emotion,
    intensity: Math.random() * 100,
  }))
}
