const { query } = require('../db/connection');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.password_hash;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.phone = data.phone;
    this.dateOfBirth = data.date_of_birth;
    this.gender = data.gender;
    this.emailVerified = data.email_verified;
    this.isActive = data.is_active;
    this.lastLogin = data.last_login;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    
    // Additional computed fields
    this.addresses = data.addresses || [];
    this.orderCount = data.order_count || 0;
    this.totalSpent = data.total_spent || 0;
  }
  const mongoose = require('mongoose');

  const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('User', UserSchema);

  static async findAll(options = {}) {
    const {
      limit = 50,
      offset = 0,
      search,
      isActive,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(
        u.first_name ILIKE $${paramIndex} OR 
        u.last_name ILIKE $${paramIndex} OR 
        u.email ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (isActive !== undefined) {
      whereConditions.push(`u.is_active = $${paramIndex++}`);
      params.push(isActive);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const validSortColumns = ['first_name', 'last_name', 'email', 'created_at', 'last_login'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    params.push(limit, offset);

    const sql = `
      SELECT 
        u.*,
        COUNT(DISTINCT o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.${sortColumn} ${order}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const result = await query(sql, params);
    return result.rows.map(row => new User(row));
  }

  static async findById(id) {
    const sql = `
      SELECT 
        u.*,
        COUNT(DISTINCT o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', ua.id,
              'type', ua.address_type,
              'street_address_1', ua.street_address_1,
              'street_address_2', ua.street_address_2,
              'city', ua.city,
              'state', ua.state,
              'postal_code', ua.postal_code,
              'country', ua.country,
              'is_default', ua.is_default
            )
          ) FILTER (WHERE ua.id IS NOT NULL), 
          '[]'::json
        ) as addresses
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      LEFT JOIN user_addresses ua ON u.id = ua.user_id
      WHERE u.id = $1
      GROUP BY u.id
    `;

    const result = await query(sql, [id]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  static async findByEmail(email) {
    const sql = `
      SELECT u.*
      FROM users u
      WHERE u.email = $1 AND u.is_active = true
    `;
    
    const result = await query(sql, [email]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  static async create(userData) {
    const {
      email, passwordHash, firstName, lastName, phone, dateOfBirth, gender
    } = userData;

    const sql = `
      INSERT INTO users (
        email, password_hash, first_name, last_name, phone, date_of_birth, gender
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const params = [email, passwordHash, firstName, lastName, phone, dateOfBirth, gender];

    const result = await query(sql, params);
    return new User(result.rows[0]);
  }

  static async emailExists(email, excludeId = null) {
    let sql = 'SELECT COUNT(*) as count FROM users WHERE email = $1';
    let params = [email];

    if (excludeId) {
      sql += ' AND id != $2';
      params.push(excludeId);
    }

    const result = await query(sql, params);
    return parseInt(result.rows[0].count) > 0;
  }

  async update(updateData) {
    const allowedFields = [
      'email', 'password_hash', 'first_name', 'last_name', 'phone', 
      'date_of_birth', 'gender', 'email_verified', 'is_active'
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

    params.push(this.id);
    const sql = `
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, params);
    if (result.rows.length > 0) {
      Object.assign(this, result.rows[0]);
    }
    return this;
  }

  async updateLastLogin() {
    const sql = 'UPDATE users SET last_login = NOW() WHERE id = $1';
    await query(sql, [this.id]);
    this.lastLogin = new Date();
    return this;
  }

  async deactivate() {
    const sql = 'UPDATE users SET is_active = false WHERE id = $1';
    await query(sql, [this.id]);
    this.isActive = false;
    return this;
  }

  async addAddress(addressData) {
    const {
      addressType = 'shipping',
      streetAddress1,
      streetAddress2,
      city,
      state,
      postalCode,
      country = 'India',
      isDefault = false
    } = addressData;

    // If this is the default address, unset other defaults
    if (isDefault) {
      await query(
        'UPDATE user_addresses SET is_default = false WHERE user_id = $1 AND address_type = $2',
        [this.id, addressType]
      );
    }

    const sql = `
      INSERT INTO user_addresses (
        user_id, address_type, street_address_1, street_address_2, 
        city, state, postal_code, country, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const params = [
      this.id, addressType, streetAddress1, streetAddress2,
      city, state, postalCode, country, isDefault
    ];

    const result = await query(sql, params);
    return result.rows[0];
  }

  async getAddresses() {
    const sql = `
      SELECT * FROM user_addresses 
      WHERE user_id = $1 
      ORDER BY is_default DESC, created_at DESC
    `;

    const result = await query(sql, [this.id]);
    return result.rows;
  }

  async getOrders(options = {}) {
    const { limit = 20, offset = 0, status } = options;

    let whereCondition = 'WHERE o.user_id = $1';
    let params = [this.id];
    let paramIndex = 2;

    if (status) {
      whereCondition += ` AND o.status = $${paramIndex++}`;
      params.push(status);
    }

    params.push(limit, offset);

    const sql = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereCondition}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const result = await query(sql, params);
    return result.rows;
  }

  async getWishlist() {
    const sql = `
      SELECT 
        w.id as wishlist_id,
        w.created_at as added_at,
        p.*,
        c.name as category_name,
        b.name as brand_name,
        pi.image_url as primary_image
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE w.user_id = $1 AND p.is_active = true
      ORDER BY w.created_at DESC
    `;

    const result = await query(sql, [this.id]);
    return result.rows;
  }

  async addToWishlist(productId) {
    try {
      const sql = `
        INSERT INTO wishlists (user_id, product_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, product_id) DO NOTHING
        RETURNING *
      `;

      const result = await query(sql, [this.id, productId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to add product to wishlist');
    }
  }

  async removeFromWishlist(productId) {
    const sql = 'DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2';
    await query(sql, [this.id, productId]);
    return true;
  }

  async getShoppingCart() {
    const sql = `
      SELECT 
        sc.id as cart_id,
        ci.id as item_id,
        ci.quantity,
        ci.unit_price,
        p.*,
        c.name as category_name,
        b.name as brand_name,
        pi.image_url as primary_image,
        pv.variant_name,
        pv.variant_value
      FROM shopping_cart sc
      JOIN cart_items ci ON sc.id = ci.cart_id
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE sc.user_id = $1 AND p.is_active = true
      ORDER BY ci.created_at DESC
    `;

    const result = await query(sql, [this.id]);
    return result.rows;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get isEmailVerified() {
    return this.emailVerified;
  }

  toJSON() {
    // Don't include password hash in JSON output
    const { passwordHash, ...safeData } = this;
    return {
      ...safeData,
      fullName: this.fullName,
      isEmailVerified: this.isEmailVerified,
      addresses: this.addresses,
      orderCount: this.orderCount,
      totalSpent: this.totalSpent
    };
  }
}

module.exports = User;