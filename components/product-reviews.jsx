"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductReviews({ productId, reviews = [], loading = false }) {
  const [sortBy, setSortBy] = useState("recent")

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date) - new Date(a.date)
    } else if (sortBy === "highest") {
      return b.rating - a.rating
    } else if (sortBy === "lowest") {
      return a.rating - b.rating
    }
    return 0
  })

  // Calculate average rating
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0] // 5 stars to 1 star
  reviews.forEach((review) => {
    ratingCounts[5 - review.rating]++
  })

  const ratingPercentages = ratingCounts.map((count) => (reviews.length > 0 ? (count / reviews.length) * 100 : 0))

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <section>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            <Button className="mt-4">Write a Review</Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section>
      <Tabs defaultValue="reviews" className="mb-8">
        <TabsList>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="summary">Rating Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">{averageRating.toFixed(1)}</div>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>{star <= Math.round(averageRating) ? "★" : "☆"}</span>
                ))}
              </div>
              <div className="text-sm text-muted-foreground ml-2">({reviews.length} reviews)</div>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border rounded p-1">
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {sortedReviews.map((review) => (
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
                          <span className="ml-2 text-green-600 dark:text-green-400 text-xs">Verified Purchase</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm">{review.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button>Write a Review</Button>
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="text-5xl font-bold mr-4">{averageRating.toFixed(1)}</div>
                <div>
                  <div className="flex text-yellow-400 text-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>{star <= Math.round(averageRating) ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">Based on {reviews.length} reviews</div>
                </div>
              </div>
            </div>
            <div>
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={rating} className="flex items-center mb-2">
                  <div className="w-12 text-sm">{rating} stars</div>
                  <div className="flex-1 mx-2 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${ratingPercentages[index]}%` }}
                      role="progressbar"
                      aria-valuenow={ratingPercentages[index]}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="w-12 text-sm text-right">{ratingCounts[index]}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
