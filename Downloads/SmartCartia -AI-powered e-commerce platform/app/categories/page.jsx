import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function CategoriesPage() {
  const categories = [
    { name: "Electronics", image: "/electronics-components.png" },
    { name: "Clothing", image: "/diverse-clothing-rack.png" },
    { name: "Home Goods", image: "/assorted-home-goods.png" },
    { name: "Books", image: "/stack-of-diverse-books.png" },
    { name: "Accessories", image: "/fashion-accessories-flatlay.png" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.name} href={`/categories/${encodeURIComponent(category.name)}`}>
            <Card className="overflow-hidden h-full transition-all hover:shadow-md">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-center text-lg">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
