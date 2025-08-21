import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Truck, CreditCard } from "lucide-react"

export default function IndianContextBanner() {
  return (
    <section className="mb-16">
      <Card className="bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-900 dark:to-green-900 border-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-300">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Pan-India Delivery</h3>
                <p className="text-sm text-muted-foreground">We deliver to all major cities across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders above ₹1,000</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-300">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">UPI, Net Banking & COD available</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
