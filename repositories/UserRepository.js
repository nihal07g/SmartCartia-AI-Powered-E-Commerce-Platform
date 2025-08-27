const User = require('../models/User');
const { query } = require('../db/connection');
const bcrypt = require('bcrypt');

class UserRepository {
  constructor() {
    this.model = User;
  }

  /**
   * Get all users with filtering and pagination
   */
  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  /**
   * Get user by ID
   */
  async findById(id) {
    return await this.model.findById(id);
  }

  /**
   * Get user by email
   */
  async findByEmail(email) {
    return await this.model.findByEmail(email);
  }

  /**
   * Create new user
   */
  async create(userData) {
    const { password, ...otherData } = userData;
    
    // Check if email already exists
    if (await this.model.emailExists(otherData.email)) {
      throw new Error('Email already exists');
    }

    // Hash password if provided
    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 12);
    }

    return await this.model.create({
      ...otherData,
      passwordHash
    });
  }

  /**
   * Update user
   */
  async update(id, updateData) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...otherData } = updateData;
    
    // Hash new password if provided
    if (password) {
      otherData.password_hash = await bcrypt.hash(password, 12);
    }

    // Check email uniqueness if being updated
    if (otherData.email && await this.model.emailExists(otherData.email, id)) {
      throw new Error('Email already exists');
    }

    return await user.update(otherData);
  }

  /**
   * Authenticate user
   */
  async authenticate(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await user.updateLastLogin();
    
    return user;
  }

  /**
   * Change user password
   */
  async changePassword(id, currentPassword, newPassword) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    return await user.update({ password_hash: passwordHash });
  }

  /**
   * Reset user password
   */
  async resetPassword(email, newPassword) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    return await user.update({ password_hash: passwordHash });
  }

  /**
   * Deactivate user
   */
  async deactivate(id) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.deactivate();
  }

  /**
   * Verify user email
   */
  async verifyEmail(id) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.update({ email_verified: true });
  }

  /**
   * Get user addresses
   */
  async getAddresses(userId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.getAddresses();
  }

  /**
   * Add user address
   */
  async addAddress(userId, addressData) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.addAddress(addressData);
  }

  /**
   * Update user address
   */
  async updateAddress(userId, addressId, updateData) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const allowedFields = [
      'address_type', 'street_address_1', 'street_address_2', 
      'city', 'state', 'postal_code', 'country', 'is_default'
    ];

    const updates = [];
    const params = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex++}`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    // If setting as default, unset other defaults
    if (updateData.is_default) {
      await query(
        'UPDATE user_addresses SET is_default = false WHERE user_id = $1 AND address_type = $2',
        [userId, updateData.address_type || 'shipping']
      );
    }

    params.push(addressId, userId);
    const sql = `
      UPDATE user_addresses 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
      RETURNING *
    `;

    const result = await query(sql, params);
    if (result.rows.length === 0) {
      throw new Error('Address not found');
    }

    return result.rows[0];
  }

  /**
   * Delete user address
   */
  async deleteAddress(userId, addressId) {
    const sql = 'DELETE FROM user_addresses WHERE id = $1 AND user_id = $2';
    const result = await query(sql, [addressId, userId]);
    return result.rowCount > 0;
  }

  /**
   * Get user orders
   */
  async getOrders(userId, options = {}) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.getOrders(options);
  }

  /**
   * Get user wishlist
   */
  async getWishlist(userId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.getWishlist();
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(userId, productId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.addToWishlist(productId);
  }

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(userId, productId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.removeFromWishlist(productId);
  }

  /**
   * Get user shopping cart
   */
  async getShoppingCart(userId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.getShoppingCart();
  }

  /**
   * Add item to shopping cart
   */
  async addToCart(userId, productId, quantity = 1, variantId = null) {
    // Get or create cart
    let cart = await query(
      'SELECT id FROM shopping_cart WHERE user_id = $1',
      [userId]
    );

    let cartId;
    if (cart.rows.length === 0) {
      const newCart = await query(
        'INSERT INTO shopping_cart (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cart.rows[0].id;
    }

    // Get product price
    const product = await query(
      'SELECT price FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (product.rows.length === 0) {
      throw new Error('Product not found or inactive');
    }

    const unitPrice = product.rows[0].price;

    // Check if item already exists in cart
    const existingItem = await query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2 AND ($3::uuid IS NULL OR variant_id = $3)',
      [cartId, productId, variantId]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const newQuantity = existingItem.rows[0].quantity + quantity;
      const sql = `
        UPDATE cart_items 
        SET quantity = $1, updated_at = NOW() 
        WHERE id = $2 
        RETURNING *
      `;
      const result = await query(sql, [newQuantity, existingItem.rows[0].id]);
      return result.rows[0];
    } else {
      // Add new item
      const sql = `
        INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, unit_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result = await query(sql, [cartId, productId, variantId, quantity, unitPrice]);
      return result.rows[0];
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(userId, itemId, quantity) {
    if (quantity <= 0) {
      return await this.removeFromCart(userId, itemId);
    }

    const sql = `
      UPDATE cart_items 
      SET quantity = $1, updated_at = NOW()
      WHERE id = $2 
      AND cart_id IN (SELECT id FROM shopping_cart WHERE user_id = $3)
      RETURNING *
    `;

    const result = await query(sql, [quantity, itemId, userId]);
    if (result.rows.length === 0) {
      throw new Error('Cart item not found');
    }

    return result.rows[0];
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId, itemId) {
    const sql = `
      DELETE FROM cart_items 
      WHERE id = $1 
      AND cart_id IN (SELECT id FROM shopping_cart WHERE user_id = $2)
    `;

    const result = await query(sql, [itemId, userId]);
    return result.rowCount > 0;
  }

  /**
   * Clear user cart
   */
  async clearCart(userId) {
    const sql = `
      DELETE FROM cart_items 
      WHERE cart_id IN (SELECT id FROM shopping_cart WHERE user_id = $1)
    `;

    await query(sql, [userId]);
    return true;
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    const sql = `
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        COALESCE(AVG(o.total_amount), 0) as average_order_value,
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as completed_orders,
        COUNT(DISTINCT w.product_id) as wishlist_count,
        COUNT(DISTINCT ci.product_id) as cart_count,
        COUNT(DISTINCT r.id) as review_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      LEFT JOIN wishlists w ON u.id = w.user_id
      LEFT JOIN shopping_cart sc ON u.id = sc.user_id
      LEFT JOIN cart_items ci ON sc.id = ci.cart_id
      LEFT JOIN reviews r ON u.id = r.user_id
      WHERE u.id = $1
      GROUP BY u.id
    `;

    const result = await query(sql, [userId]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const stats = result.rows[0];
    return {
      totalOrders: parseInt(stats.total_orders),
      totalSpent: parseFloat(stats.total_spent),
      averageOrderValue: parseFloat(stats.average_order_value),
      completedOrders: parseInt(stats.completed_orders),
      wishlistCount: parseInt(stats.wishlist_count),
      cartCount: parseInt(stats.cart_count),
      reviewCount: parseInt(stats.review_count)
    };
  }

  /**
   * Get platform user statistics
   */
  async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d,
        COUNT(CASE WHEN last_login >= NOW() - INTERVAL '7 days' THEN 1 END) as active_users_7d,
        COUNT(CASE WHEN last_login >= NOW() - INTERVAL '30 days' THEN 1 END) as active_users_30d
      FROM users
    `;

    const result = await query(sql);
    const stats = result.rows[0];

    return {
      totalUsers: parseInt(stats.total_users),
      activeUsers: parseInt(stats.active_users),
      verifiedUsers: parseInt(stats.verified_users),
      newUsers30d: parseInt(stats.new_users_30d),
      activeUsers7d: parseInt(stats.active_users_7d),
      activeUsers30d: parseInt(stats.active_users_30d)
    };
  }

  /**
   * Search users
   */
  async search(searchTerm, options = {}) {
    return await this.model.findAll({ 
      ...options, 
      search: searchTerm 
    });
  }
}

module.exports = UserRepository;