"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { getProductById } from "@/lib/products"

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const messagesEndRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Only run client-side code after mounting
  useEffect(() => {
    setMounted(true)

    // Load chat history from localStorage
    try {
      const savedMessages = localStorage.getItem("chatHistory")
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      } else {
        // Add initial welcome message
        setMessages([
          {
            id: 1,
            text: "Hello! How can I help you with your shopping today?",
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ])
      }
    } catch (error) {
      console.error("Failed to load chat history:", error)
      // Fallback to default message
      setMessages([
        {
          id: 1,
          text: "Hello! How can I help you with your shopping today?",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }, [])

  // Check if we're on a product page and get the product
  useEffect(() => {
    if (mounted && pathname) {
      const match = pathname.match(/\/products\/(\d+)/)
      if (match && match[1]) {
        const productId = match[1]
        const product = getProductById(productId)
        setCurrentProduct(product)
      } else {
        setCurrentProduct(null)
      }
    }
  }, [pathname, mounted])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (mounted && messages.length > 0) {
      try {
        localStorage.setItem("chatHistory", JSON.stringify(messages))
      } catch (error) {
        console.error("Failed to save chat history:", error)
      }
    }
  }, [messages, mounted])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isMinimized])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isMinimized) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    // Generate response based on user message and current product
    setTimeout(() => {
      let botResponse = ""
      const userQuery = message.toLowerCase()

      // If we're on a product page, provide product-specific information
      if (currentProduct) {
        if (userQuery.includes("price") || userQuery.includes("cost") || userQuery.includes("how much")) {
          botResponse = `The price of ${currentProduct.name} is ₹${currentProduct.price.toLocaleString()}. We offer free shipping on orders over ₹4,000.`
        } else if (userQuery.includes("available") || userQuery.includes("in stock") || userQuery.includes("buy")) {
          botResponse = currentProduct.inStock
            ? `Yes, ${currentProduct.name} is in stock! We currently have ${currentProduct.stockQuantity} units available.`
            : `I'm sorry, ${currentProduct.name} is currently out of stock. Would you like to be notified when it's back in stock?`
        } else if (
          userQuery.includes("feature") ||
          userQuery.includes("specification") ||
          userQuery.includes("detail")
        ) {
          botResponse = `${currentProduct.name} features: ${currentProduct.description} It has a rating of ${currentProduct.rating}/5 based on ${currentProduct.reviews} customer reviews.`
        } else if (userQuery.includes("delivery") || userQuery.includes("shipping")) {
          botResponse = `We offer standard delivery (3-5 business days) and express delivery (1-2 business days) for ${currentProduct.name}. Standard shipping is free for orders over ₹4,000.`
        } else if (userQuery.includes("return") || userQuery.includes("warranty")) {
          botResponse = `${currentProduct.name} comes with a 30-day return policy and a 1-year warranty. If you're not satisfied, you can return it for a full refund.`
        } else if (userQuery.includes("review") || userQuery.includes("rating")) {
          botResponse = `${currentProduct.name} has an average rating of ${currentProduct.rating}/5 from ${currentProduct.reviews} customer reviews. Most customers praise its quality and value for money.`
        } else if (userQuery.includes("discount") || userQuery.includes("offer") || userQuery.includes("coupon")) {
          botResponse = `We currently have a 10% discount on ${currentProduct.name} for first-time buyers. Use code WELCOME10 at checkout.`
        } else if (
          userQuery.includes("compare") ||
          userQuery.includes("similar") ||
          userQuery.includes("alternative")
        ) {
          botResponse = `${currentProduct.name} is one of our best sellers in the ${currentProduct.category} category. You might also want to check out similar products in this category.`
        } else {
          botResponse = `Thank you for your interest in ${currentProduct.name}. It's one of our popular products in the ${currentProduct.category} category. Is there anything specific you'd like to know about it?`
        }
      } else {
        // General responses when not on a product page
        if (userQuery.includes("shipping") || userQuery.includes("delivery")) {
          botResponse =
            "We offer free shipping on orders over ₹4,000. Standard delivery takes 3-5 business days, and express delivery takes 1-2 business days for an additional fee."
        } else if (userQuery.includes("return") || userQuery.includes("refund")) {
          botResponse =
            "Our return policy allows you to return items within 30 days of delivery. Refunds are typically processed within 5-7 business days after we receive the returned item."
        } else if (userQuery.includes("payment") || userQuery.includes("pay")) {
          botResponse =
            "We accept various payment methods including credit/debit cards, UPI, net banking, and cash on delivery for eligible orders."
        } else if (userQuery.includes("discount") || userQuery.includes("coupon") || userQuery.includes("offer")) {
          botResponse =
            "You can find our current promotions on the homepage. New customers can use code WELCOME10 for 10% off their first order!"
        } else if (userQuery.includes("size") || userQuery.includes("fit")) {
          botResponse =
            "We provide detailed size guides on each product page. If you're between sizes, we generally recommend sizing up for a more comfortable fit."
        } else if (userQuery.includes("track") || userQuery.includes("order status")) {
          botResponse =
            "You can track your order by logging into your account and visiting the 'My Orders' section. You'll also receive tracking updates via email."
        } else if (userQuery.includes("mobile") || userQuery.includes("phone") || userQuery.includes("smartphone")) {
          botResponse =
            "We offer a wide range of mobile devices from top brands. Our collection includes premium smartphones, budget options, tablets, and accessories. Is there a specific type of mobile device you're looking for?"
        } else if (userQuery.includes("tablet")) {
          botResponse =
            "Our tablet selection includes options for productivity, entertainment, and kids. We have models from Apple, Samsung, Lenovo, and more. Would you like me to recommend some popular tablets?"
        } else if (userQuery.includes("accessories")) {
          botResponse =
            "We have a comprehensive range of mobile accessories including cases, screen protectors, chargers, power banks, and camera enhancements. All our accessories are compatible with major device brands."
        } else {
          botResponse =
            "Thank you for your message! I'm here to help with any questions about our products, shipping, returns, or anything else you need assistance with. Feel free to ask about our new mobile device collection!"
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  // Don't render anything during SSR to prevent hydration issues
  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className={`w-80 md:w-96 shadow-lg transition-all duration-300 ${isMinimized ? "h-14" : "h-[500px]"}`}>
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 border-b">
            <CardTitle className="text-base font-medium">
              {currentProduct ? `Chat about ${currentProduct.name}` : "Support Chat"}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-8 w-8">
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-4 overflow-y-auto h-[calc(500px-8rem)]">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted text-muted-foreground">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75"></div>
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-2 border-t">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      ) : (
        <Button onClick={toggleChat} className="h-12 w-12 rounded-full shadow-lg flex items-center justify-center">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
