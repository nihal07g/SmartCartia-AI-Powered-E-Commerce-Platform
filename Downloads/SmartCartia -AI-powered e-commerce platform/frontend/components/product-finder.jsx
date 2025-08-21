"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { useCurrency } from "@/components/currency-provider"
import Link from "next/link"
import { ArrowRight, Search, CheckCircle2, Loader2 } from "lucide-react"

// Sample questions
const questions = [
  {
    id: "category",
    text: "What type of product are you looking for?",
    options: ["Electronics", "Clothing", "Home Goods", "Books", "Any"],
  },
  {
    id: "price_range",
    text: "What's your budget?",
    options: ["Under ₹2,000", "₹2,000-₹5,000", "₹5,000-₹20,000", "Over ₹20,000", "No budget limit"],
  },
  {
    id: "feature_priority",
    text: "What's most important to you?",
    options: ["Quality", "Price", "Brand", "Features", "Reviews"],
  },
  {
    id: "usage",
    text: "How will you primarily use this product?",
    options: ["Personal", "Professional", "Gift", "Occasional use", "Daily use"],
  },
]

// Sample product data with more realistic prices
const sampleProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 8999,
    category: "Electronics",
    images: ["/diverse-people-listening-headphones.png"],
    rating: 4.8,
    reviews: 120,
    inStock: true,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smart watch featuring heart rate monitoring and GPS.",
    price: 6499,
    category: "Electronics",
    images: ["/modern-smartwatch.png"],
    rating: 4.5,
    reviews: 85,
    inStock: true,
  },
  {
    id: "3",
    name: "Casual Cotton T-Shirt",
    description: "Comfortable cotton t-shirt perfect for everyday wear.",
    price: 999,
    category: "Clothing",
    images: ["/plain-white-tshirt.png"],
    rating: 4.3,
    reviews: 210,
    inStock: true,
  },
]

export default function ProductFinder() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const { currency } = useCurrency()
  const [mounted, setMounted] = useState(true) // For demo purposes, assume mounted

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // In a real implementation, this would call the backend API
      // const response = await fetch('/api/product-finder', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ answers })
      // })
      // const data = await response.json()

      // Filter products based on answers (simplified logic)
      let filtered = [...sampleProducts]

      if (answers.category && answers.category !== "Any") {
        filtered = filtered.filter((p) => p.category === answers.category)
      }

      if (answers.price_range) {
        if (answers.price_range === "Under ₹2,000") {
          filtered = filtered.filter((p) => p.price < 2000)
        } else if (answers.price_range === "₹2,000-₹5,000") {
          filtered = filtered.filter((p) => p.price >= 2000 && p.price <= 5000)
        } else if (answers.price_range === "₹5,000-₹20,000") {
          filtered = filtered.filter((p) => p.price > 5000 && p.price <= 20000)
        } else if (answers.price_range === "Over ₹20,000") {
          filtered = filtered.filter((p) => p.price > 20000)
        }
      }

      if (answers.feature_priority === "Quality" || answers.feature_priority === "Reviews") {
        filtered.sort((a, b) => b.rating - a.rating)
      } else if (answers.feature_priority === "Price") {
        filtered.sort((a, b) => a.price - b.price)
      }

      setRecommendations(filtered)
      setLoading(false)
      setStep(questions.length) // Move to results step
    }, 1500)
  }

  const handleReset = () => {
    setStep(0)
    setAnswers({})
    setRecommendations([])
  }

  const currentQuestion = questions[step]
  const isLastQuestion = step === questions.length - 1
  const hasAnswer = currentQuestion ? !!answers[currentQuestion.id] : true

  // If we're at the results step
  if (step === questions.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Your Recommended Products</CardTitle>
          <CardDescription>
            Based on your preferences, we've found {recommendations.length} products that match your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products match your criteria. Try adjusting your preferences.</p>
              <Button onClick={handleReset} className="mt-4">
                Start Over
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {recommendations.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 aspect-square">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < Math.floor(product.rating) ? "★" : "☆"}</span>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                      <div className="text-lg font-bold mt-auto">
                        {mounted ? formatCurrency(product.price, currency) : formatCurrency(product.price, "INR")}
                      </div>
                      <div className="mt-4">
                        <Button asChild>
                          <Link href={`/products/${product.id}`}>
                            View Product
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Start Over
          </Button>
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // If we're still in the questions phase
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Find Your Perfect Product</CardTitle>
          <div className="text-sm text-muted-foreground">
            Question {step + 1} of {questions.length}
          </div>
        </div>
        <CardDescription>Answer a few questions to help us find the right product for you.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Finding the perfect products for you...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            >
              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <div key={option} className="flex items-center">
                    <RadioGroupItem value={option} id={option} className="peer sr-only" />
                    <Label
                      htmlFor={option}
                      className="flex flex-1 items-center justify-between rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      {option}
                      {answers[currentQuestion.id] === option && <CheckCircle2 className="ml-2 h-4 w-4 text-primary" />}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={step === 0 || loading}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!hasAnswer || loading}>
          {isLastQuestion ? (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Products
            </>
          ) : (
            "Next"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
