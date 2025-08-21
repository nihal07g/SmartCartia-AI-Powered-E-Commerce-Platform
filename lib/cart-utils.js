// Get cart from localStorage
export function getCart() {
  if (typeof window === "undefined") return []

  try {
    const cart = localStorage.getItem("cart")
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error("Failed to parse cart:", error)
    return []
  }
}

// Get cart count
export function getCartCount() {
  const cart = getCart()
  return cart.reduce((count, item) => count + item.quantity, 0)
}

// Get cart total
export function getCartTotal() {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Add item to cart with proper validation
export function addToCart(item) {
  if (!item || !item.id || !item.name || !item.price) {
    console.error("Invalid item data:", item)
    return
  }

  const cart = getCart()

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(
    (cartItem) =>
      cartItem.id === item.id &&
      cartItem.selectedColor === item.selectedColor &&
      cartItem.selectedSize === item.selectedSize,
  )

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += item.quantity || 1
  } else {
    // Add new item with default quantity if not provided
    if (!item.quantity) item.quantity = 1
    cart.push(item)
  }

  try {
    localStorage.setItem("cart", JSON.stringify(cart))
    // Dispatch event for components to listen for cart updates
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"))
    }
  } catch (error) {
    console.error("Failed to save cart:", error)
  }

  return cart
}

// Remove item from cart with proper validation
export function removeFromCart(id, color, size) {
  if (!id) {
    console.error("Invalid product ID for removal")
    return
  }

  const cart = getCart()
  const updatedCart = cart.filter(
    (item) => !(item.id === id && item.selectedColor === color && item.selectedSize === size),
  )

  try {
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"))
    }
  } catch (error) {
    console.error("Failed to update cart after removal:", error)
  }

  return updatedCart
}

// Update cart item quantity with validation
export function updateCartItemQuantity(id, quantity, color, size) {
  if (!id || typeof quantity !== "number" || quantity < 0) {
    console.error("Invalid parameters for quantity update:", { id, quantity, color, size })
    return
  }

  if (quantity <= 0) {
    return removeFromCart(id, color, size)
  }

  const cart = getCart()
  const updatedCart = cart.map((item) =>
    item.id === id && item.selectedColor === color && item.selectedSize === size ? { ...item, quantity } : item,
  )

  try {
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"))
    }
  } catch (error) {
    console.error("Failed to update cart quantity:", error)
  }

  return updatedCart
}

// Clear cart
export function clearCart() {
  try {
    localStorage.removeItem("cart")
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"))
    }
  } catch (error) {
    console.error("Failed to clear cart:", error)
  }

  return []
}
