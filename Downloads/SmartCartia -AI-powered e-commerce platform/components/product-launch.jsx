import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function ProductLaunch({ product }) {
  if (!product) return null

  return (
    <section className="mb-16 relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium">
              New Launch
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">{product.name}</h2>
            <p className="text-muted-foreground">
              Discover our latest product launch. Experience innovation and quality with our newest addition to the{" "}
              {product.category} collection.
            </p>
            <Button asChild>
              <Link href={`/products/${product.id}`} className="group">
                Explore Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-full w-24 h-24 flex items-center justify-center text-center p-2 font-bold">
              <span>New Arrival</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
