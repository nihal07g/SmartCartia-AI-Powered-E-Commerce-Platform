"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Bot, Search, CheckCircle2, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { getAllProducts } from "@/lib/products"
import { formatCurrency } from "@/lib/utils"
import { useCurrency } from "@/components/currency-provider"

export default function FindMyProduct() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [thinking, setThinking] = useState("")
  const [mounted, setMounted] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Simulated Grok.AI questions
  const questions = [
    {
      id: "category",
      question: "What type of product are you looking for?",
      options: [
        "Mobile Devices",
        "Mobile Accessories",
        "Electronics",
        "Clothing",
        "Home Goods",
        "Books",
        "Accessories",
        "Not Sure",
      ],
    },
    {
      id: "purpose",
      question: "What will you primarily use this product for?",
      options: [
        "Professional Work",
        "Entertainment",
        "Everyday Use",
        "Special Occasion",
        "Gift for Someone",
        "Hobby or Interest",
        "Travel",
        "Other",
      ],
    },
    {
      id: "budget",
      question: "What's your budget range?",
      options: [
        "Under $50",
        "$50 - $100",
        "$100 - $300",
        "$300 - $500",
        "$500 - $1000",
        "Over $1000",
        "No specific budget",
      ],
    },
  ]

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

  const handleReset = () => {
    setStep(0)
    setAnswers({})
    setRecommendations([])
    setThinking("")
  }

  // Simulate Grok.AI thinking process
  const simulateThinking = async () => {
    setThinking("")
    const thinkingSteps = [
      "Analyzing your preferences...",
      "Considering product categories based on your needs...",
      "Evaluating budget constraints...",
      "Matching with available inventory...",
      "Ranking products by relevance...",
      "Finalizing recommendations...",
    ]

    for (const step of thinkingSteps) {
      setThinking((prev) => (prev ? `${prev}\n${step}` : step))
      await new Promise((resolve) => setTimeout(resolve, 600))
    }
  }

  // Simulate Grok.AI product recommendation
  const handleSubmit = async () => {
    setLoading(true)

    // Simulate AI thinking process
    await simulateThinking()

    // Get all products
    const allProducts = getAllProducts()

    // Filter products based on answers
    let filtered = [...allProducts]

    // Filter by category if specified and not "Not Sure"
    if (answers.category && answers.category !== "Not Sure") {
      filtered = filtered.filter((p) => {
        if (answers.category === "Mobile Devices" || answers.category === "Mobile Accessories") {
          return p.category === answers.category
        }
        return p.category === answers.category
      })
    }

    // Filter by budget
    if (answers.budget) {
      if (answers.budget === "Under $50") {
        filtered = filtered.filter((p) => p.price < 50)
      } else if (answers.budget === "$50 - $100") {
        filtered = filtered.filter((p) => p.price >= 50 && p.price <= 100)
      } else if (answers.budget === "$100 - $300") {
        filtered = filtered.filter((p) => p.price > 100 && p.price <= 300)
      } else if (answers.budget === "$300 - $500") {
        filtered = filtered.filter((p) => p.price > 300 && p.price <= 500)
      } else if (answers.budget === "$500 - $1000") {
        filtered = filtered.filter((p) => p.price > 500 && p.price <= 1000)
      } else if (answers.budget === "Over $1000") {
        filtered = filtered.filter((p) => p.price > 1000)
      }
    }

    // Apply purpose-based filtering logic
    if (answers.purpose) {
      // Professional Work - prioritize high-rated electronics, mobile devices
      if (answers.purpose === "Professional Work") {
        const professionalItems = filtered.filter(
          (p) => (p.category === "Electronics" || p.category === "Mobile Devices") && p.rating >= 4.5,
        )
        const otherItems = filtered.filter(
          (p) => !((p.category === "Electronics" || p.category === "Mobile Devices") && p.rating >= 4.5),
        )
        filtered = [...professionalItems, ...otherItems]
      }

      // Entertainment - prioritize electronics, books
      else if (answers.purpose === "Entertainment") {
        const entertainmentItems = filtered.filter((p) => p.category === "Electronics" || p.category === "Books")
        const otherItems = filtered.filter((p) => p.category !== "Electronics" && p.category !== "Books")
        filtered = [...entertainmentItems, ...otherItems]
      }

      // Everyday Use - prioritize clothing, accessories, mobile accessories
      else if (answers.purpose === "Everyday Use") {
        const everydayItems = filtered.filter(
          (p) => p.category === "Clothing" || p.category === "Accessories" || p.category === "Mobile Accessories",
        )
        const otherItems = filtered.filter(
          (p) => p.category !== "Clothing" && p.category !== "Accessories" && p.category !== "Mobile Accessories",
        )
        filtered = [...everydayItems, ...otherItems]
      }

      // Special Occasion - prioritize clothing, accessories
      else if (answers.purpose === "Special Occasion") {
        const specialItems = filtered.filter((p) => p.category === "Clothing" || p.category === "Accessories")
        const otherItems = filtered.filter((p) => p.category !== "Clothing" && p.category !== "Accessories")
        filtered = [...specialItems, ...otherItems]
      }

      // Gift - prioritize books, accessories, home goods
      else if (answers.purpose === "Gift for Someone") {
        const giftItems = filtered.filter(
          (p) => p.category === "Books" || p.category === "Accessories" || p.category === "Home Goods",
        )
        const otherItems = filtered.filter(
          (p) => p.category !== "Books" && p.category !== "Accessories" && p.category !== "Home Goods",
        )
        filtered = [...giftItems, ...otherItems]
      }

      // Travel - prioritize mobile devices, accessories, clothing
      else if (answers.purpose === "Travel") {
        const travelItems = filtered.filter(
          (p) => p.category === "Mobile Devices" || p.category === "Mobile Accessories" || p.category === "Clothing",
        )
        const otherItems = filtered.filter(
          (p) => p.category !== "Mobile Devices" && p.category !== "Mobile Accessories" && p.category !== "Clothing",
        )
        filtered = [...travelItems, ...otherItems]
      }
    }

    // Take top 5 recommendations
    const topRecommendations = filtered.slice(0, 5)

    // Simulate API delay
    setTimeout(() => {
      setRecommendations(topRecommendations)
      setLoading(false)
      setStep(questions.length) // Move to results step
    }, 1000)
  }

  const currentQuestion = questions[step]
  const hasAnswer = currentQuestion ? !!answers[currentQuestion.id] : true

  // If we're at the results step
  if (step === questions.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <Bot className="mr-2 h-5 w-5 text-primary" />
                Your Personalized Recommendations
              </CardTitle>
              <CardDescription>
                Based on your preferences, our AI has found {recommendations.length} products that match your needs.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground mb-6">Finding the perfect products for you...</p>
              <div className="w-full max-w-md bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-line">
                {thinking}
              </div>
            </div>
          ) : recommendations.length === 0 ? (
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
                        src={product.images?.[0] || "/placeholder.svg"}
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
                      <div className="mt-2 mb-2">
                        <Badge>{product.category}</Badge>
                      </div>
                      <div className="text-lg font-bold mt-auto">
                        {mounted ? formatCurrency(product.price, currency) : formatCurrency(product.price, "USD")}
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
          <CardTitle className="text-2xl flex items-center">
            <Bot className="mr-2 h-5 w-5 text-primary" />
            Find My Product
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Question {step + 1} of {questions.length}
          </div>
        </div>
        <CardDescription>Answer a few questions to help our AI find the perfect product for you.</CardDescription>
        <Separator className="mt-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
          <RadioGroup
            value={answers[currentQuestion.id] || ""}
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            className="gap-2"
          >
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
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={step === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={!hasAnswer}>
          {step === questions.length - 1 ? (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Products
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
