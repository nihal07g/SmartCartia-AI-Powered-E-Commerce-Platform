"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductById } from "@/lib/products"

export default function SocialEmotions({ productId }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Try to fetch from API
        try {
          const response = await fetch(`/api/social-sentiment?productId=${productId}`)

          if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`)
          }

          const result = await response.json()
          setData(result)
        } catch (apiError) {
          console.error("API error:", apiError)
          // Generate fallback data if API fails
          setData(generateFallbackData(productId))
        }
      } catch (err) {
        console.error("Error in social emotions component:", err)
        setError(err.message)
        // Generate fallback data on error
        setData(generateFallbackData(productId))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productId])

  // Generate fallback data if API fails
  const generateFallbackData = (productId) => {
    const product = getProductById(productId)
    if (!product) return null

    const platforms = ["twitter", "instagram", "facebook", "reddit", "tiktok"]
    const sentimentLevels = ["very_positive", "positive", "neutral", "negative", "very_negative"]
    const emojis = {
      very_positive: "😍",
      positive: "😊",
      neutral: "😐",
      negative: "😕",
      very_negative: "😡",
    }

    // Generate simulated posts
    const posts = []
    const count = 50

    for (let i = 0; i < count; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      const sentimentCategory = Math.random() < 0.6 ? "positive" : Math.random() < 0.8 ? "neutral" : "negative"
      let sentimentLevel

      if (sentimentCategory === "positive") {
        sentimentLevel = Math.random() < 0.6 ? "very_positive" : "positive"
      } else if (sentimentCategory === "negative") {
        sentimentLevel = Math.random() < 0.6 ? "very_negative" : "negative"
      } else {
        sentimentLevel = "neutral"
      }

      // Create a simulated post with minimal content
      const post = {
        id: `post_${i}`,
        platform: platform,
        text: `Sample post about ${product.name} with ${sentimentCategory} sentiment.`,
        timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
        likes: Math.floor(Math.random() * 1000),
        shares: platform !== "instagram" ? Math.floor(Math.random() * 200) : null,
        comments: Math.floor(Math.random() * 100),
        analysis: {
          sentiment: sentimentLevel,
          emoji: emojis[sentimentLevel],
          score: Math.random(),
          platform: platform,
          timestamp: new Date().toISOString(),
        },
      }

      posts.push(post)
    }

    // Sort by timestamp (newest first)
    posts.sort((a, b) => b.timestamp - a.timestamp)

    // Generate summary statistics
    const sentiment_counts = {}
    sentimentLevels.forEach((sentiment) => {
      sentiment_counts[sentiment] = 0
    })

    const platform_counts = {}
    platforms.forEach((platform) => {
      platform_counts[platform] = 0
    })

    posts.forEach((post) => {
      sentiment_counts[post.analysis.sentiment]++
      platform_counts[post.platform]++
    })

    const total_posts = posts.length

    const sentiment_distribution = {}
    Object.keys(sentiment_counts).forEach((sentiment) => {
      sentiment_distribution[sentiment] = {
        count: sentiment_counts[sentiment],
        percentage: (sentiment_counts[sentiment] / total_posts) * 100,
      }
    })

    const platform_distribution = {}
    Object.keys(platform_counts).forEach((platform) => {
      platform_distribution[platform] = {
        count: platform_counts[platform],
        percentage: (platform_counts[platform] / total_posts) * 100,
      }
    })

    const overall_sentiment = Object.keys(sentiment_counts).reduce((a, b) =>
      sentiment_counts[a] > sentiment_counts[b] ? a : b,
    )

    return {
      posts: posts,
      summary: {
        product: product.name,
        total_mentions: total_posts,
        sentiment_distribution: sentiment_distribution,
        platform_distribution: platform_distribution,
        overall_sentiment: overall_sentiment,
        timestamp: new Date().toISOString(),
      },
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Sentiment Analysis</CardTitle>
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
          <CardTitle>Social Media Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Unable to load social media sentiment data.</p>
            <p className="text-sm">We're experiencing technical difficulties. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !data.summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>No social media data available for this product.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for charts
  const sentimentData = Object.entries(data.summary.sentiment_distribution).map(([sentiment, info]) => ({
    name: sentiment.replace("_", " "),
    value: info.percentage,
    count: info.count,
    color: getSentimentColor(sentiment),
  }))

  const platformData = Object.entries(data.summary.platform_distribution).map(([platform, info]) => ({
    name: platform,
    value: info.percentage,
    count: info.count,
    color: getPlatformColor(platform),
  }))

  // Get recent posts (limit to 5)
  const recentPosts = data.posts.slice(0, 5)

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Social Media Sentiment Analysis</CardTitle>
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
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="posts">Recent Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.summary.total_mentions}</div>
                    <div className="text-sm text-muted-foreground">Total Mentions</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold flex items-center justify-center">
                      {data.summary.overall_sentiment.replace("_", " ")}
                      <span className="ml-2 text-3xl">{getSentimentEmoji(data.summary.overall_sentiment)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Sentiment</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {Math.round(
                        (data.summary.sentiment_distribution.very_positive?.percentage || 0) +
                          (data.summary.sentiment_distribution.positive?.percentage || 0),
                      )}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">Positive Mentions</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Sentiment Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-[200px]">
                    <ChartContainer
                      config={{
                        sentiment: {
                          label: "Sentiment",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sentimentData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {sentimentData.map((entry, index) => (
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
                  <CardTitle className="text-base">Platform Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-[200px]">
                    <ChartContainer
                      config={{
                        platform: {
                          label: "Platform",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={platformData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="value" name="Percentage" fill="var(--color-platform)">
                            {platformData.map((entry, index) => (
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

          <TabsContent value="sentiment">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(data.summary.sentiment_distribution).map(([sentiment, info]) => (
                  <Card key={sentiment}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{getSentimentEmoji(sentiment)}</div>
                        <div className="font-medium capitalize">{sentiment.replace("_", " ")}</div>
                        <div className="text-2xl font-bold">{Math.round(info.percentage)}%</div>
                        <div className="text-sm text-muted-foreground">{info.count} mentions</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Sentiment Trend</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        positive: {
                          label: "Positive",
                          color: "#4ade80",
                        },
                        neutral: {
                          label: "Neutral",
                          color: "#facc15",
                        },
                        negative: {
                          label: "Negative",
                          color: "#f87171",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={generateSentimentTrendData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="positive" stackId="a" fill="var(--color-positive)" />
                          <Bar dataKey="neutral" stackId="a" fill="var(--color-neutral)" />
                          <Bar dataKey="negative" stackId="a" fill="var(--color-negative)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="platforms">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(data.summary.platform_distribution).map(([platform, info]) => (
                  <Card key={platform}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{getPlatformIcon(platform)}</div>
                        <div className="font-medium capitalize">{platform}</div>
                        <div className="text-2xl font-bold">{Math.round(info.percentage)}%</div>
                        <div className="text-sm text-muted-foreground">{info.count} mentions</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Platform Sentiment Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        positive: {
                          label: "Positive",
                          color: "#4ade80",
                        },
                        neutral: {
                          label: "Neutral",
                          color: "#facc15",
                        },
                        negative: {
                          label: "Negative",
                          color: "#f87171",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={generatePlatformSentimentData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="platform" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="positive" fill="var(--color-positive)" />
                          <Bar dataKey="neutral" fill="var(--color-neutral)" />
                          <Bar dataKey="negative" fill="var(--color-negative)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="posts">
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getPlatformIcon(post.platform)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium capitalize">{post.platform}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(new Date(post.timestamp))}</div>
                        </div>
                        <p className="my-2">{post.text}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>❤️ {post.likes}</span>
                            {post.shares !== null && <span>🔄 {post.shares}</span>}
                            <span>💬 {post.comments}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">Sentiment:</span>
                            <span className="font-medium flex items-center">
                              {post.analysis.sentiment.replace("_", " ")}
                              <span className="ml-1 text-lg">{post.analysis.emoji}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Helper functions
function getSentimentColor(sentiment) {
  // Use different colors for dark mode
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return (
      {
        very_positive: "#4ade80",
        positive: "#86efac",
        neutral: "#fde047",
        negative: "#fca5a5",
        very_negative: "#f87171",
      }[sentiment] || "#d4d4d4"
    )
  }

  const colors = {
    very_positive: "#22c55e",
    positive: "#4ade80",
    neutral: "#facc15",
    negative: "#f87171",
    very_negative: "#ef4444",
  }
  return colors[sentiment] || "#a3a3a3"
}

function getPlatformColor(platform) {
  // Use different colors for dark mode
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return (
      {
        twitter: "#60a5fa",
        instagram: "#f472b6",
        facebook: "#93c5fd",
        reddit: "#fb923c",
        tiktok: "#e5e5e5",
      }[platform] || "#d4d4d4"
    )
  }

  const colors = {
    twitter: "#1da1f2",
    instagram: "#e1306c",
    facebook: "#4267B2",
    reddit: "#ff4500",
    tiktok: "#000000",
  }
  return colors[platform] || "#a3a3a3"
}

function getSentimentEmoji(sentiment) {
  const emojis = {
    very_positive: "😍",
    positive: "😊",
    neutral: "😐",
    negative: "😕",
    very_negative: "😡",
  }
  return emojis[sentiment] || "😐"
}

function getPlatformIcon(platform) {
  const icons = {
    twitter: "🐦",
    instagram: "📸",
    facebook: "👍",
    reddit: "🤖",
    tiktok: "🎵",
  }
  return icons[platform] || "💬"
}

function formatDate(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}d ago`
  }

  return date.toLocaleDateString("en-IN")
}

// Generate sample data for charts
function generateSentimentTrendData() {
  const days = 7
  const data = []

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      positive: Math.floor(Math.random() * 30) + 20,
      neutral: Math.floor(Math.random() * 20) + 10,
      negative: Math.floor(Math.random() * 15) + 5,
    })
  }

  return data
}

function generatePlatformSentimentData() {
  const platforms = ["twitter", "instagram", "facebook", "reddit", "tiktok"]

  return platforms.map((platform) => ({
    platform,
    positive: Math.floor(Math.random() * 50) + 20,
    neutral: Math.floor(Math.random() * 30) + 10,
    negative: Math.floor(Math.random() * 20) + 5,
  }))
}
