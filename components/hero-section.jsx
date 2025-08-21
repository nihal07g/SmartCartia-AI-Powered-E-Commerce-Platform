import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-sm font-medium">
              Special Sale | Up to 50% Off
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Discover Quality Products at <span className="text-blue-600 dark:text-blue-300">Great Prices</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Shop our extensive collection with worldwide delivery, secure payments, and excellent customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>✓ Free shipping on orders above ₹4,000</p>
              <p>✓ Multiple payment options</p>
              <p>✓ Easy returns within 30 days</p>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/vibrant-market-scene.png"
                alt="ShopHub Shopping Experience"
                className="max-h-full w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}
