import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './index.css'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Categories from './pages/Categories'
import CategoryProducts from './pages/CategoryProducts'

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">SmartCartia</h1>
        <p className="text-xl text-muted-foreground mb-8">
          AI-Powered E-Commerce Platform
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Products</h3>
            <p className="text-muted-foreground">Browse our product catalog</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <p className="text-muted-foreground">Shop by category</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">AI Features</h3>
            <p className="text-muted-foreground">Find products with AI</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Nav() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex gap-4">
        <Link to="/" className="font-semibold">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/cart">Cart</Link>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
  <Route path="/categories" element={<Categories />} />
  <Route path="/categories/:category" element={<CategoryProducts />} />
        <Route path="/cart" element={<div>Cart</div>} />
        <Route path="/checkout" element={<div>Checkout</div>} />
        <Route path="/account" element={<div>Account</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/search" element={<div>Search</div>} />
        <Route path="/new-launch" element={<div>New Launch</div>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  )
}

export default App
