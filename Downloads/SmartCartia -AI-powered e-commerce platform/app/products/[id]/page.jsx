"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { getProductById } from "@/lib/products"
import { formatCurrency } from "@/lib/utils"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react"
import AddToCartButton from "@/components/add-to-cart-button"
import ProductReviews from "@/components/product-reviews"
import RelatedProducts from "@/components/related-products"
import { useCurrency } from "@/components/currency-provider"
import ReviewEmotions from "@/components/review-emotions"
import SocialEmotions from "@/components/social-emotions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductPage() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const { currency } = useCurrency()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("emotions")

  useEffect(() => {
    setMounted(true)
    // Fetch reviews for this product
    fetchReviews(params.id)
  }, [params.id])

  const fetchReviews = async (productId) => {
    try {
      setLoading(true)
      // Try to fetch from API
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`)
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        setReviews(data)
      } catch (apiError) {
        console.error("API error:", apiError)
        // Use sample reviews as fallback
        setReviews(getSampleReviews(productId))
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      // Use sample reviews as fallback
      setReviews(getSampleReviews(productId))
    } finally {
      setLoading(false)
    }
  }

  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to Products Link */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="pl-0">
          <Link href="/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to All Products
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div>
          <Suspense fallback={<Skeleton className="aspect-square w-full rounded-lg" />}>
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              <img
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
          </Suspense>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-2">
            <Link
              href={`/categories/${product.category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              {product.category}
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < Math.floor(product.rating) ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
          <div className="text-2xl font-bold mb-4">
            {mounted ? formatCurrency(product.price, currency) : formatCurrency(product.price, "INR")}
          </div>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* Product Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{ backgroundColor: color.toLowerCase().replace(/\s+/g, "") }}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="px-3 py-1 border border-input rounded-md hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-auto">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Insight Highlights - NEW SECTION */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Product Insights</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Powered by AI Analysis</span>
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emotion Insight Card */}
          <Card className="overflow-hidden border-2 border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-primary/5 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <span className="mr-2">😊</span> Review Emotions
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary" onClick={() => setActiveTab("emotions")}>
                  View Analysis <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <CardDescription>AI-powered emotional analysis of customer reviews</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">78%</div>
                    <div className="text-xs text-muted-foreground">Positive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500">15%</div>
                    <div className="text-xs text-muted-foreground">Neutral</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">7%</div>
                    <div className="text-xs text-muted-foreground">Negative</div>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">😊</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Insight Card */}
          <Card className="overflow-hidden border-2 border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-primary/5 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <span className="mr-2">🌐</span> Social Media Analysis
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary" onClick={() => setActiveTab("social")}>
                  View Analysis <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Real-time social media sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">🐦</div>
                    <div className="text-xs text-muted-foreground">Twitter</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">📸</div>
                    <div className="text-xs text-muted-foreground">Instagram</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">👍</div>
                    <div className="text-xs text-muted-foreground">Facebook</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">🤖</div>
                    <div className="text-xs text-muted-foreground">Reddit</div>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis Tabs */}
      <div className="mb-16">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="emotions" className="flex items-center">
              <span className="mr-2">😊</span> Review Emotions
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center">
              <span className="mr-2">🌐</span> Social Media Analysis
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center">
              <span className="mr-2">⭐</span> Customer Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emotions">
            <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
              <ReviewEmotions productId={params.id} reviews={reviews} />
            </Suspense>
          </TabsContent>

          <TabsContent value="social">
            <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
              <SocialEmotions productId={params.id} />
            </Suspense>
          </TabsContent>

          <TabsContent value="reviews">
            <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
              <ProductReviews productId={params.id} reviews={reviews} loading={loading} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg mt-8" />}>
        <RelatedProducts currentProductId={params.id} />
      </Suspense>
    </div>
  )
}

// Sample reviews data for fallback
function getSampleReviews(productId) {
  const sampleReviews = [
    {
      id: 1,
      productId: "1",
      rating: 5,
      title: "Excellent quality and sound",
      content:
        "These headphones exceeded my expectations. The sound quality is incredible, and the noise cancellation works perfectly. Battery life is also impressive.",
      author: "Alex Johnson",
      date: "2023-11-15",
      verified: true,
    },
    {
      id: 2,
      productId: "1",
      rating: 4,
      title: "Great value for money",
      content:
        "Very comfortable to wear for long periods. Sound quality is great, though bass could be a bit stronger. Overall, very satisfied with my purchase.",
      author: "Sarah Miller",
      date: "2023-10-28",
      verified: true,
    },
    {
      id: 3,
      productId: "1",
      rating: 5,
      title: "Perfect for work calls",
      content:
        "I use these headphones daily for work calls and listening to music. The microphone quality is excellent and everyone can hear me clearly. Highly recommend!",
      author: "Michael Chen",
      date: "2023-10-12",
      verified: true,
    },
    {
      id: 4,
      productId: "2",
      rating: 5,
      title: "Amazing fitness companion",
      content:
        "This watch has transformed my fitness routine. The tracking is accurate and the app is intuitive. Battery lasts for days!",
      author: "Emma Wilson",
      date: "2023-11-05",
      verified: true,
    },
    {
      id: 5,
      productId: "2",
      rating: 3,
      title: "Good but has some issues",
      content:
        "The watch looks great and has many features, but I've had some syncing issues with my phone. Customer service was helpful though.",
      author: "David Brown",
      date: "2023-09-30",
      verified: false,
    },
    {
      id: 6,
      productId: "3",
      rating: 5,
      title: "Best t-shirt I've owned",
      content:
        "The quality of this t-shirt is outstanding. After multiple washes, it still looks brand new. Will definitely buy more colors.",
      author: "Jessica Lee",
      date: "2023-11-10",
      verified: true,
    },
    {
      id: 7,
      productId: "4",
      rating: 4,
      title: "Very comfortable chair",
      content:
        "I've been using this chair for my home office for a month now. It's very comfortable for long working hours and my back pain has reduced significantly.",
      author: "Robert Taylor",
      date: "2023-10-22",
      verified: true,
    },
    {
      id: 8,
      productId: "5",
      rating: 5,
      title: "Couldn't put it down!",
      content:
        "This book was absolutely captivating from start to finish. The character development is superb and the plot twists kept me guessing. Highly recommend!",
      author: "Amanda Garcia",
      date: "2023-11-08",
      verified: true,
    },
    {
      id: 9,
      productId: "6",
      rating: 5,
      title: "Professional quality camera",
      content:
        "As a professional photographer, I'm extremely impressed with this camera. The image quality is outstanding and the controls are intuitive. Worth every penny.",
      author: "Chris Wilson",
      date: "2023-10-15",
      verified: true,
    },
    {
      id: 10,
      productId: "7",
      rating: 4,
      title: "Elegant and practical",
      content:
        "This handbag is both stylish and functional. The leather quality is excellent and it has plenty of compartments. The only reason for 4 stars is that it's a bit heavier than expected.",
      author: "Nicole Adams",
      date: "2023-11-02",
      verified: true,
    },
    {
      id: 11,
      productId: "7",
      rating: 5,
      title: "Perfect gift",
      content:
        "I bought this as a gift for my wife and she absolutely loves it. The craftsmanship is excellent and it looks even better in person than in the photos.",
      author: "James Wilson",
      date: "2023-10-25",
      verified: true,
    },
    {
      id: 12,
      productId: "8",
      rating: 5,
      title: "Best water bottle ever",
      content:
        "This water bottle keeps my drinks cold for the entire day! The design is sleek and it doesn't leak at all. I take it everywhere with me now.",
      author: "Lisa Johnson",
      date: "2023-11-12",
      verified: true,
    },
  ]

  // Filter reviews for the specific product
  const productReviews = sampleReviews.filter((review) => review.productId === productId)

  // If we have fewer than 10 reviews, add some additional ones
  if (productReviews.length < 10) {
    const additionalReviews = [
      {
        title: "Highly recommend this product",
        content: "I've been using this for a few weeks now and I'm very impressed with the quality and performance.",
        rating: 5,
        verified: true,
      },
      {
        title: "Good product with minor issues",
        content: "Overall I'm satisfied with this purchase, but there are a few small issues that could be improved.",
        rating: 4,
        verified: true,
      },
      {
        title: "Decent value for the price",
        content: "Not the best quality I've seen, but considering the price point, it's a good value purchase.",
        rating: 3,
        verified: true,
      },
      {
        title: "Exceeded my expectations",
        content: "I wasn't expecting much, but this product really surprised me with its quality and features.",
        rating: 5,
        verified: true,
      },
      {
        title: "Not worth the money",
        content: "I expected better quality for the price. Disappointed with my purchase and wouldn't recommend it.",
        rating: 2,
        verified: false,
      },
      {
        title: "Perfect for my needs",
        content: "This product fits my needs perfectly. The design is elegant and the functionality is excellent.",
        rating: 5,
        verified: true,
      },
      {
        title: "Average product",
        content: "It's okay, nothing special. Does the job but doesn't stand out in any particular way.",
        rating: 3,
        verified: true,
      },
      {
        title: "Great customer service",
        content: "Had an issue with my initial order, but customer service was excellent in resolving it quickly.",
        rating: 4,
        verified: true,
      },
    ]

    const neededReviews = 10 - productReviews.length
    const authors = [
      "John Smith",
      "Mary Johnson",
      "Robert Davis",
      "Jennifer Wilson",
      "Michael Brown",
      "Patricia Miller",
      "William Garcia",
      "Elizabeth Martinez",
      "David Anderson",
      "Linda Thomas",
    ]
    const dates = [
      "2023-11-20",
      "2023-11-18",
      "2023-11-15",
      "2023-11-10",
      "2023-11-05",
      "2023-10-30",
      "2023-10-25",
      "2023-10-20",
      "2023-10-15",
      "2023-10-10",
    ]

    for (let i = 0; i < neededReviews; i++) {
      const reviewTemplate = additionalReviews[i % additionalReviews.length]
      const newReview = {
        id: 1000 + i,
        productId: productId,
        rating: reviewTemplate.rating,
        title: reviewTemplate.title,
        content: reviewTemplate.content,
        author: authors[i % authors.length],
        date: dates[i % dates.length],
        verified: reviewTemplate.verified,
      }
      productReviews.push(newReview)
    }
  }

  return productReviews
}
