import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function NewNodeSection() {
  // Sample new node products
  const newNodeProducts = [
    {
      id: "node-1",
      name: "SmartNode Hub",
      description: "Central control hub for all your smart devices with AI-powered automation.",
      category: "Smart Home",
      image: "/smart-home-hub.png",
      price: 199.99,
      tags: ["New", "AI-Powered", "Smart Home"],
    },
    {
      id: "node-2",
      name: "NodeSense Environmental Monitor",
      description:
        "Advanced environmental monitoring with precision sensors for temperature, humidity, air quality, and more.",
      category: "Smart Home",
      image: "/environmental-monitor.png",
      price: 129.99,
      tags: ["New", "Sensors", "Health"],
    },
    {
      id: "node-3",
      name: "NodeConnect Mesh System",
      description: "Whole-home mesh WiFi system with intelligent routing and security features.",
      category: "Networking",
      image: "/placeholder.svg?key=13ye5",
      price: 249.99,
      tags: ["New", "WiFi 6", "Mesh"],
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Introducing Node</h2>
        <p className="text-muted-foreground mb-4">
          Our revolutionary new product line designed to make your home smarter, more efficient, and more connected than
          ever before.
        </p>
        <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
          <img
            src="/smart-home-living-room.png"
            alt="Node Smart Home Ecosystem"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">The Node Ecosystem</h3>
            <p className="text-white/90 mb-4 max-w-2xl">
              Seamlessly connect your entire home with our intelligent Node devices. Control everything from a single
              app.
            </p>
            <Button className="w-fit" asChild>
              <Link href="/products?category=smart-home">
                Explore Node Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newNodeProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <div className="text-lg font-bold">${product.price}</div>
              </div>
              <CardDescription>{product.category}</CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{product.description}</p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
