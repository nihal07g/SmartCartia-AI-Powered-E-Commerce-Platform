import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/components/currency-provider"
import { UserProvider } from "@/components/user-provider"
import SupportChat from "@/components/support-chat"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SmartCartia - Your Smart Shopping Destination",
  description: "Discover amazing products with AI-powered recommendations and smart shopping features.",
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <CurrencyProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <SupportChat />
            </CurrencyProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
