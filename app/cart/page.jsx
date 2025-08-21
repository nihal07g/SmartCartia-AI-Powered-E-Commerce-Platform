import { CartContent } from "@/components/cart-content"

export const metadata = {
  title: "Your Cart | SmartCartia",
  description: "View and manage items in your shopping cart",
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <CartContent />
    </div>
  )
}
