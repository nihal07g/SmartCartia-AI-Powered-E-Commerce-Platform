"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Menu, X, User, Search, LogOut, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import ThemeToggle from "@/components/theme-toggle"
import CurrencyToggle from "@/components/currency-toggle"
import { getCartCount } from "@/lib/cart-utils"
import { useUser } from "@/components/user-provider"
import Cart from "@/components/cart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, logout } = useUser()
  const [cartUpdated, setCartUpdated] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Initialize component
  useEffect(() => {
    setMounted(true)
    setCartCount(getCartCount())

    const handleCartUpdate = () => {
      const newCount = getCartCount()
      setCartCount(newCount)

      // Show animation when cart is updated
      if (newCount > 0) {
        setCartUpdated(true)
        setTimeout(() => setCartUpdated(false), 1500)
      }
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("storage", (e) => {
      if (e.key === "cart") handleCartUpdate()
    })

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("storage", handleCartUpdate)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    logout()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const openCart = () => {
    setIsCartOpen(true)
  }

  // Updated navigation links with New Launch
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/new-launch", label: "New Launch" },
    { href: "/categories/electronics", label: "Electronics" },
    { href: "/categories/clothing", label: "Clothing" },
    { href: "/categories/home-goods", label: "Home Goods" },
    { href: "/categories/books", label: "Books" },
  ]

  // Server-side rendering placeholder
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">SmartCartia</span>
            </Link>
            <div className="flex items-center space-x-4">
              {/* Placeholder for theme toggle */}
              <div className="w-10 h-10"></div>
              {/* Placeholder for mobile menu button */}
              <div className="w-10 h-10 md:hidden"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  // Don't render cart count until mounted to prevent hydration mismatch
  const cartBadge =
    cartCount > 0 ? (
      <Badge
        variant="destructive"
        className={`absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs ${
          cartUpdated ? "animate-pulse scale-110" : ""
        }`}
      >
        {cartCount}
      </Badge>
    ) : null

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">SmartCartia</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative w-40 lg:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-md pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Currency Toggle */}
            <CurrencyToggle />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
            )}

            {/* Cart */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant={cartCount > 0 ? "default" : "outline"}
                  size="icon"
                  className={`relative transition-all duration-300 ${
                    cartUpdated
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                      : cartCount > 0
                        ? "bg-primary text-primary-foreground"
                        : ""
                  }`}
                  onClick={openCart}
                  aria-label={`Shopping cart with ${cartCount} items`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartBadge}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-4">Your Cart ({cartCount} items)</h2>
                    <Cart onClose={() => setIsCartOpen(false)} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="flex md:hidden items-center space-x-4">
            <CurrencyToggle />
            <ThemeToggle />

            {/* Mobile Cart Button */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant={cartCount > 0 ? "default" : "outline"}
                  size="icon"
                  className={`relative transition-all duration-300 ${
                    cartUpdated
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                      : cartCount > 0
                        ? "bg-primary text-primary-foreground"
                        : ""
                  }`}
                  onClick={openCart}
                  aria-label={`Shopping cart with ${cartCount} items`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartBadge}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-4">Your Cart ({cartCount} items)</h2>
                    <Cart onClose={() => setIsCartOpen(false)} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t">
                {user ? (
                  <>
                    <div className="mb-2 text-sm font-medium">
                      Signed in as <span className="font-bold">{user.name || user.email}</span>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center space-x-2 text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 text-sm font-medium text-red-500 mt-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Login / Register</span>
                  </Link>
                )}
              </div>
              <div>
                <Link
                  href="/cart"
                  className="flex items-center space-x-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </div>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-md pl-8 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Add default export that re-exports the named export for backward compatibility
export default Header
