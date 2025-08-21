import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FeaturedCollection() {
  return (
    <section className="mb-16 overflow-hidden">
      <div className="relative">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 rounded-xl"></div>

        <div className="container mx-auto px-4 py-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Limited Time Collection
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Seasonal Collection</h2>
              <p className="text-muted-foreground max-w-md">
                Explore our exclusive collection of seasonal items, perfect for the current season with special
                discounts and offers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  <span>Trendy fashion for all ages</span>
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  <span>Decorative items and home accents</span>
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  <span>Curated gift boxes and packages</span>
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  <span>Special seasonal discounts on all items</span>
                </li>
              </ul>
              <div className="pt-2">
                <Button size="lg" asChild>
                  <Link href="/collections/seasonal">Shop the Collection</Link>
                </Button>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src="/seasonal-clothing-display.png"
                    alt="Seasonal Clothing"
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src="/decorative-items.png"
                    alt="Decorative Items"
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-6">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src="/cozy-living-room.png"
                    alt="Home Decor"
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src="/colorful-gift-boxes.png"
                    alt="Gift Boxes"
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
