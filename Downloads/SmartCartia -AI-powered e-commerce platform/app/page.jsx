import { getFeaturedProducts, getBestSellingProducts, getNewProducts } from "@/lib/products"
import HeroSection from "@/components/hero-section"
import CategoryShowcase from "@/components/category-showcase"
import FeaturedCollection from "@/components/featured-collection"
import NewsletterSignup from "@/components/newsletter-signup"
import ProductLaunch from "@/components/product-launch"
import ProductGrid from "@/components/product-grid"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const featuredProducts = getFeaturedProducts().slice(0, 8)
  const bestSellingProducts = getBestSellingProducts(4)
  const newProducts = getNewProducts().slice(0, 4)

  // Get the first featured product as our "latest launch"
  const latestProduct = featuredProducts[0]

  // Create a product object for the launch component
  const launchProduct = {
    id: latestProduct.id,
    name: latestProduct.name,
    category: latestProduct.category,
    image: latestProduct.images[0],
  }

  return (
    <main>
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        {/* Latest Product Launch Section */}
        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
          <ProductLaunch product={launchProduct} />
        </Suspense>

        <CategoryShowcase />

        {/* Featured Products Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>

        {/* Best Selling Products Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Best Sellers</h2>
            <Link href="/products" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <ProductGrid products={bestSellingProducts} />
        </section>

        <FeaturedCollection />

        {/* New Arrivals Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link href="/products" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <ProductGrid products={newProducts} />
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        </section>

        <NewsletterSignup />
      </div>
    </main>
  )
}
