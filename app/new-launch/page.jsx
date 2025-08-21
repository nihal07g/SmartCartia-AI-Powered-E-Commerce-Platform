import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewNodeSection from "@/components/new-node-section"
import FindMyProduct from "@/components/find-my-product"

export const metadata = {
  title: "New Launch | SmartCartia",
  description: "Discover our newest products and find the perfect match for your needs.",
}

export default function NewLaunchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Launch</h1>

      <Tabs defaultValue="find-my-product" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="new-node">New Node</TabsTrigger>
          <TabsTrigger value="find-my-product">Find My Product</TabsTrigger>
        </TabsList>

        <TabsContent value="new-node" className="mt-6">
          <NewNodeSection />
        </TabsContent>

        <TabsContent value="find-my-product" className="mt-6">
          <FindMyProduct />
        </TabsContent>
      </Tabs>
    </div>
  )
}
